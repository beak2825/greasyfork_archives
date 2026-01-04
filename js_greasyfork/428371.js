// ==UserScript==
// @name          suruga-ya enhancer
// @namespace     http://tampermonkey.net/
// @version       1.0.10
// @description   駿河屋の利便性を向上させるスクリプト
// @author        kood
// @match         https://www.suruga-ya.jp/*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant         GM_addStyle
// @antifeature   referral-link
// @downloadURL https://update.greasyfork.org/scripts/428371/suruga-ya%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/428371/suruga-ya%20enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let itemCode = ""; // 管理番号
    let productURL = ""; // 販売ページのURL
    let kaitoriURL = ""; //　買取ページのURL
    let priceOfKaitori = ""; // 買取ページから取得した買取価格
    let jan = ""; // 買取ページから取得したJAN
    let priceOfBrandNew = ""; // 販売ページから取得した新品価格
    let priceOfUsed = ""; // 販売ページから取得した中古価格
    let priceOfPreOrder = ""; // 販売ページから取得した予約価格
    let priceOfMarketplace = ""; // 販売ページから取得した最安値のマケプレ価格
    let defaultImgURL = ""; // 販売ページ、買取ページから取得した商品画像1枚目のURL
    let getKaitoriPageDataCompleted = false; // 買取ページのデータの取得が完了済みかどうか
    let getProductPageDataCompleted = false; // 販売ページのデータの取得が完了済みかどうか
    let skipNumOfProdsCheck = false; // カートから合計価格を取得する際の商品数チェックをスキップするかどうか
    let isProductDetail = false; // 販売ページ(/product/detail/...) かどうか
    let isFukubukuro = false; // 商品が福袋かどうか
    let favoListId = ""; // お気に入りリストのID
    let isNyukaList = false; // 入荷リストかどうか
    let base64Decoded = "";
    const base64Encoded =
        "aHR0cHM6Ly9hZmZpbGlhdGUuc3VydWdhLXlhLmpwL21vZHVsZXMv" +
        "YWYvYWZfanVtcC5waHA/dXNlcl9pZD0xNTc2Jmdvb2RzX3VybD0=";
    const cartURL = "https://www.suruga-ya.jp/cargo/detail";
    const currentURL = window.location.href;
    const defaultClearIntervalTime = 10000;

    const CSS = [
        ".c-modal{display:none;height:100vh;position:fixed;top:0;width:100%;top:0;left:0;z-index:1}",
        ".c-modal_bg{background:rgba(0,0,0,.6);height:100vh;width:100%}",
        ".c-modal_content{background:#fff;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);border-radius:5px;max-width:600px;max-height:400px;overflow:scroll}",
        ".c-modal_content_inner{position:relative;padding:45px 24px 24px 24px}",
        ".c-modal_close{position:absolute;top:10px;right:10px;color:#007185;border-bottom:1px solid #007185}",
        ".c-modal_title{position:absolute;top:10px;left:15px;font-weight:700;font-size:15px;border-bottom:1px solid}",
        ".c-modal .table-bordered th{padding:10px 8px}",
        ".c-modal_content_inner .bg-purple{background-color:#9999FF}",
        "#modal-shipping_fee table,#modal-shipping_fee td,#modal-shipping_fee th{border:1px #000 solid}",
        "#modal-shipping_fee td{padding:5px}",
        "#modal-shipping_fee th.text-center{font-weight:700;background-color:#eee}",
        ".enhancer_outofstock_display_option:link,.enhancer_outofstock_display_option:visited,.enhancer_outofstock_display_option:hover,.enhancer_outofstock_display_option:active{color:#0E83CD}",
        "#enhancer_outofstock_display_option_wrapper{padding-left:5px}",
        "#added_price_elem{font-size:12px}",
    ].join("");
    if (isUserscript()) {
        GM_addStyle(CSS);
    } else {
        addStyle(CSS);
    }

    function addStyle(css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

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
    const clearIntervalConfig = {};
    function waitForKeyElements(
        selectorTxt /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */,
        actionFunction /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */,
        bWaitOnce /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */,
        clearIntervalTime /* Optional: You can set the time to execute clearInterval. */,
        iframeSelector /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        if (!isNaN(clearIntervalTime) && !clearIntervalConfig[selectorTxt]) {
            clearIntervalConfig[selectorTxt] = {
                maximumTime: clearIntervalTime,
                startTime: performance.now(),
            };
        }

        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
        else targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data("alreadyFound") || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data("alreadyFound", true);
                }
            });
        } else {
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
            delete controlObj[controlKey];
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(
                        selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                }, 300);
                controlObj[controlKey] = timeControl;
            } else if (clearIntervalConfig[selectorTxt]) {
                const maximumTime = clearIntervalConfig[selectorTxt]["maximumTime"];
                const startTime = clearIntervalConfig[selectorTxt]["startTime"];
                const endTime = performance.now();
                const elapsedTime = endTime - startTime;
                if (elapsedTime > maximumTime) {
                    clearInterval(timeControl);
                    delete controlObj[controlKey];
                    delete clearIntervalConfig[selectorTxt];
                }
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

    /* 18禁商品ページの警告画面を自動でクリック */
    const popupAdult = document.querySelector('[data-popup="popup-adult"]');
    if (popupAdult) {
        new MutationObserver((_, _observer) => {
            if (popupAdult.checkVisibility()) {
                _observer.disconnect();
                document.querySelector("#btn-confirm-adult").click();
            }
        }).observe(popupAdult, { attributes: true });
    }

    /* 18禁商品の表示に関わるセーフサーチのcookieを設定 */
    if (
        Cookies.get("safe_search_option") == undefined ||
        Cookies.get("safe_search_expired") != 1
    ) {
        /*
            safe_search_option
                3で制限無しで商品を表示(検索で成年向け商品表示、成年向け商品ページの警告画面を非表示)
                2で成年向け商品の表示が制限
                1でR指定などを含め過激な表現のある商品を原則非表示
            safe_search_expired
                1で無期限、2で今回のみ、3で24時間
            */
        /* 警告ポップアップクリックで保存されるcookieは期限が短いため、valueと期限を調整 */
        setTimeout(function () {
            Cookies.set("safe_search_option", "3", { expires: 999, path: "/" });
            Cookies.set("safe_search_expired", "1", {
                expires: 999,
                path: "/",
            });
            $(".safe-search.safe-search2 a").text("セーフサーチ OFF");
            if ($("div.float-left.fonts13").length == 1) {
                $("div.float-left.fonts13").css("visibility", "hidden");
            }
            /* 検索結果ページの場合は自動でリロード */
            if (currentURL.indexOf("search?category=") > -1) {
                location.reload();
            }
        }, 3000);
    }

    /* 管理番号の取得 */
    try {
        itemCode = shinaban;
        getItemCode();
    } catch (e) {
        getItemCode();
    }

    function getItemCode() {
        if (typeof shinaban == "string") {
            return;
        }
        const pathname = window.location.pathname;
        const searchStrs = [
            "/product/detail/",
            "/product-other/",
            "/kaitori_detail/",
        ];
        $.each(searchStrs, function (_, searchStr) {
            if (pathname.indexOf(searchStr) > -1) {
                itemCode = pathname.slice(pathname.lastIndexOf("/") + 1);
                return;
            }
        });
    }

    /* 商品のURLをグローバル変数に格納 */
    if (itemCode) {
        productURL = "https://www.suruga-ya.jp/product/detail/" + itemCode;
        kaitoriURL = "https://www.suruga-ya.jp/kaitori_detail/" + itemCode;
    }

    if (currentURL.indexOf("/product/detail/") > -1) {
        isProductDetail = true;
    }

    /* モーダルのイベント */
    $(document).on("click", ".js-modal-open", function () {
        const modalId = $(this).data("target");
        const modal = $("#" + modalId);
        modal.fadeIn(100);
        return false;
    });
    $(document).on("click", ".js-modal-close", function () {
        $(".js-modal").fadeOut(100);
        return false;
    });

    /* 商品が福袋かどうかの確認 */
    if (isProductDetail) {
        waitForKeyElements(
            "ol.breadcrumb.chevron-double.bg-transparent",
            checkCategory,
            true,
            defaultClearIntervalTime
        );
    }
    function checkCategory(jNode) {
        try {
            $.each(jNode.find("li"), function (_, elem) {
                if ($(elem).find("a").attr("href").indexOf("?category=12&") > -1) {
                    isFukubukuro = true;
                    return false;
                }
            });
        } catch (e) {}
    }

    /* お気に入りリスト、入荷リストかどうかの確認 */
    if (currentURL.indexOf("/action_favorite_list/detail/") > -1) {
        const urlMatch = currentURL.match(
            /action_favorite_list\/detail\/[0-9]{1,}/
        );
        if (urlMatch != null) {
            favoListId = urlMatch[0].slice(urlMatch[0].lastIndexOf("/") + 1);
        }
    } else if (currentURL.indexOf("pcmypage/action_nyuka_search/list") > -1) {
        isNyukaList = true;
    }

    /* ページ上部の検索ボックス横のカテゴリセレクトボックスに福袋カテゴリが存在しない場合は福袋カテゴリを追加 */
    if ($(".search_top_pc select#cat-search").length == 1) {
        addFukubukuroCategoryToSelectbox($(".search_top_pc select#cat-search"));
    }
    function addFukubukuroCategoryToSelectbox(jNode) {
        const options = jNode.find("option");
        let addFukubukuro = true;
        $.each(options, function (_, elem) {
            if ($(elem).val() == "12") {
                addFukubukuro = false;
                return false;
            }
        });
        if (addFukubukuro) {
            const addElem = "<option value='12'>福袋</option>";
            options.last().after(addElem);
        }
    }

    /* ページ左のサイドバーメニューに福袋カテゴリのリンクを追加 */
    if ($("nav#sidebar_menu").length == 1) {
        addFukubukuroCategoryToSidebarMenu($("nav#sidebar_menu"));
    }
    function addFukubukuroCategoryToSidebarMenu(jNode) {
        const pageListElem = jNode.find(".sidebar_wrap.padT0 ul");
        const fukubukuroCatURL = fixURL(
            "https://www.suruga-ya.jp/search?category=12&search_word="
        );
        const addElem = "<li><a href='" + fukubukuroCatURL + "'>福袋</a></li>";
        pageListElem.append(addElem);
    }

    /* 販売ページの数量セレクトボックスの下に在庫数表示を追加 */
    if (isProductDetail && $(".out-of-stock-text").length == 0) {
        waitForKeyElements(
            "input[name=grade]:checked",
            addQuantityDisplayFromDataAttr,
            true,
            defaultClearIntervalTime
        );
        $("input[name=grade]").on("change", function () {
            $("#quantity_display").remove();
            addQuantityDisplayFromDataAttr($("input[name=grade]:checked"));
        });
    }
    function addQuantityDisplayFromDataAttr(jNode) {
        if ($("#quantity_display").length != 0) {
            return false;
        }
        const zaikoObj = jNode.data("zaiko");
        if (zaikoObj == undefined || zaikoObj.zaiko == undefined) {
            return false;
        }
        const divElem = $("#quantity_selection").closest("div.product_amounts");
        if (divElem.length == 0) {
            return false;
        }
        const addElem =
            "<div id='quantity_display'>在庫数 " + zaikoObj.zaiko + "点</div>";
        divElem.after(addElem);
    }

    /* 買取ページのリンクが無い販売ページに買取ページのリンクを追加 */
    if (isProductDetail) {
        waitForKeyElements(
            "div.link-group.mgnT12",
            addKaitoriLink,
            true,
            defaultClearIntervalTime
        );
        if ($(".item-price").length > 1) {
            /* 商品のグレード(新品/中古等)ボタンの変更によって買取ページのリンクにhiddenクラスが付加される事があるため、イベントを設定 */
            $("input[name=grade]").on("change", function () {
                if ($("div.link-group.mgnT12").length) {
                    addKaitoriLink($("div.link-group.mgnT12"));
                }
            });
        }
    }
    function addKaitoriLink(jNode) {
        if (isFukubukuro) {
            return false;
        }
        if ($("#added_kaitori_elem").length > 0) {
            return false;
        }
        const ulElem = jNode.find("ul.list-unstyled.mb-0.list-p3");
        let liKaitoriElem = ulElem.find("li.kaitori.hidden");
        if (liKaitoriElem.length == 0) {
            liKaitoriElem = "";
        }
        const liElems = ulElem.find("li");
        let kaitoriLinkNotExist = true;
        let liKaitoriElems = [];
        $.each(liElems, function (index, liElem) {
            const href = $(liElem).find("a").attr("href");
            if (href.indexOf("/kaitori_detail/") > -1) {
                liKaitoriElems.push(liElem);
            }
        });
        if (liKaitoriElems.length > 0) {
            /* 既にリンクが存在する場合 */
            kaitoriLinkNotExist = false;
            if (
                liKaitoriElems.length == 1 &&
                $(liKaitoriElems[0]).hasClass("hidden")
            ) {
                /*1つかつhiddenクラスが付加されている場合はクラスを消して表示させる*/
                $(liKaitoriElems[0]).removeClass("hidden");
                $(liKaitoriElems[0]).attr("id", "added_kaitori_elem");
                return false;
            } else if (liKaitoriElems.length == 1) {
                /* 1つかつ既に表示されている場合は終了 */
                $(liKaitoriElems[0]).attr("id", "added_kaitori_elem");
                return false;
            }
            /* 買取ページのリンクが複数存在する場合 */
            let numOfHiddenClass = 0;
            $.each(liKaitoriElems, function (index, liKaitoriElem) {
                if ($(liKaitoriElem).hasClass("hidden")) {
                    numOfHiddenClass++;
                }
            });
            try {
                if (liKaitoriElems.length == numOfHiddenClass) {
                    /* 複数ある買取ページのリンク全てにhiddenクラスが付加されている場合*/
                    $(liKaitoriElems[0]).removeClass("hidden");
                    $(liKaitoriElems[0]).attr("id", "added_kaitori_elem");
                    return false;
                }
            } catch (e) {}
        }
        if (kaitoriLinkNotExist && kaitoriURL != "") {
            const addElem =
                "<li id='added_kaitori_elem'><a href='" +
                fixURL(kaitoriURL) +
                "' class='link_underline'>この商品の買取ページ</a></li>";
            ulElem.append(addElem);
        }
    }

    /* 買取ページから取得した情報を販売ページに追加 */
    if (isProductDetail) {
        waitForKeyElements(
            "#item_detailInfo",
            getKaitoriPageData,
            true,
            defaultClearIntervalTime
        );
    }
    function getKaitoriPageData(jNode) {
        if (isFukubukuro) {
            return false;
        }
        getPageData(kaitoriURL)
            .then(
                function (data) {
                    var def = $.Deferred();
                    const article1 = $(data).find("#article1");
                    const detail = $(data).find("#detail");
                    /* 買取価格の取得 */
                    const priceMain = article1.find("#priceMain span");
                    if (priceMain.length != 0) {
                        priceOfKaitori = priceMain.text();
                    }
                    /* JANの取得 */
                    const table = detail.find("table#configurations");
                    if (table.length == 1 && table.find("td").length > 1) {
                        let isJAN = false;
                        $.each(table.find("td"), function (index, td) {
                            let tdStr = $(td).text();
                            if (tdStr == "JAN") {
                                isJAN = true;
                                return true;
                            }
                            if (isJAN) {
                                tdStr = tdStr.replace(/(	|\r\n|\n)/g, "");
                                if (tdStr.length > 6) {
                                    jan = tdStr;
                                }
                                return false;
                            }
                        });
                    }
                    /* 画像の取得 */
                    //console.log($(article1.find("img")[0]).attr("src"));
                    defaultImgURL = $(article1.find("img")[0]).attr("src"); // currentSrcだと取得できない場合があるので
                    defaultImgURL = "https://www.suruga-ya.jp" + defaultImgURL;
                    if (defaultImgURL.indexOf("no_photo.jpg") > -1) {
                        defaultImgURL = "";
                    }
                    getKaitoriPageDataCompleted = true;
                    def.resolve();
                    return def.promise();
                },
                function () {
                    return $.Deferred().resolve().promise();
                }
            )
            .then(function () {
                if (!getKaitoriPageDataCompleted) {
                    return false;
                }
                if (priceOfKaitori != "" && $("#added_kaitori_elem").length == 1) {
                    /* 買取価格が設定されてる場合は買取価格表示を追加 */
                    const origText = $("#added_kaitori_elem a").text();
                    if (!origText.includes(priceOfKaitori)) {
                        $("#added_kaitori_elem a").empty();
                        const addStr =
                            "この商品の買取価格&nbsp;" +
                            "<span class='text-red'>" +
                            priceOfKaitori +
                            "</span>";
                        $("#added_kaitori_elem a").append(addStr);
                    }
                }
                if (jan != "" && $("#item_detailInfo tbody").length == 1) {
                    /* JAN表示、JAN検索を追加 */
                    let addElem =
                        "<th class='text-right'>JAN</th><td>" + jan + "</td>";
                    //const url1 = fixURL("https://www.suruga-ya.jp/search?category=&search_word=" + jan);
                    const url1 = fixURL(
                        "https://www.suruga-ya.jp/search?category=&search_word=&gtin=" +
                            jan
                    );
                    //const url2 = fixURL("https://www.suruga-ya.jp/search_buy?category=&search_word=" + jan);
                    let url2 =
                        "https://www.suruga-ya.jp/search_buy?category=&search_word=" +
                        jan;
                    url2 += "&adult_t=On&key_flag=1&searchbox=1&tab=1";
                    url2 = fixURL(url2);
                    const url3 = "https://www.google.com/search?q=" + jan;
                    const base64EncodedStr1 =
                        "aHR0cHM6Ly93d3cuYW1hem9uLmNvLmpwL2dwL3NlYXJjaC9yZWY9YXNfb" +
                        "GlfcWZfc3Bfc3JfdGw/aWU9VVRGOCZ0YWc9a29vZC0yMiZrZXl3b3Jkcz0=";
                    const url4 = atob(base64EncodedStr1) + jan;
                    const link1 =
                        "<a href='" +
                        url1 +
                        "' class='jan_search' target='_blank'>販売</a>";
                    const link2 =
                        "<a href='" +
                        url2 +
                        "' class='jan_search' target='_blank'>買取</a>";
                    const link3 =
                        "<a href='" +
                        url3 +
                        "' class='jan_search' target='_blank'>Google</a>";
                    const link4 =
                        "<a href='" +
                        url4 +
                        "' class='jan_search' target='_blank'>Amazon</a>";
                    const searchLinks =
                        link1 + " / " + link2 + " / " + link3 + " / " + link4;
                    addElem =
                        addElem +
                        "<th class='text-right'>JANで検索</th><td>" +
                        searchLinks +
                        "</td>";
                    addElem = addElem + "<th></th><td></td>";
                    addElem = addElem + "<th></th><td></td>";
                    addElem = addElem + "<th></th><td></td>";
                    addElem = "<tr>" + addElem + "</tr>";
                    jNode.find("tbody").prepend(addElem);
                    $(".jan_search").addClass("link_underline");
                }
                /* 販売ページに画像が無く、買取ページに画像があった場合、画像を設定*/
                if (
                    defaultImgURL != "" &&
                    $($(".img-fluid")[0]).attr("src").indexOf("no_photo.jpg") > -1
                ) {
                    $($(".img-fluid")[0]).attr("src", defaultImgURL);
                }
            });
    }

    /* マケプレの販売ページの判定 */
    if (isProductDetail && currentURL.indexOf("tenpo_cd=") > -1) {
        /* "tenpo_cd=" で終わるURL(店舗のIDの指定無し)の場合はマケプレではなく駿河屋.JPの販売ページ */
        if (currentURL.match(/(?=.*\?tenpo_cd\=$)/) == null) {
            waitForKeyElements(
                ".col-8 .w-70.pr-5",
                adjustMarketplaceProductPage,
                true,
                defaultClearIntervalTime
            );
            waitForKeyElements(
                ".price_choise.price_group.selected_price",
                getShippingFeeForMarketplaceProduct1,
                true,
                defaultClearIntervalTime
            );
        }
    } else if ($(".d-flex div.mb-2")[0] != undefined) {
        /* URLではなくhtmlを見てマケプレかどうか判定するコード （こちらの処理が実行されるページがあるかどうかは不明）*/
        const mb2Html = $($(".d-flex div.mb-2")[0]).html();
        if (
            mb2Html.match(/(?=.*この商品は、)(?=.*が販売、発送します。).*/) != null
        ) {
            let targetElem = $(".col-8 .w-70.pr-5");
            if (targetElem.length != 0) {
                adjustMarketplaceProductPage(targetElem);
            }
            targetElem = $(".price_choise.price_group.selected_price");
            if (targetElem.length != 0) {
                getShippingFeeForMarketplaceProduct1(targetElem);
            }
        }
    }

    /* マケプレの販売ページに駿河屋.JPの販売ページのリンクを追加 + 他のショップの一覧ページのリンクを追加 */
    function adjustMarketplaceProductPage(jNode) {
        const addElem =
            "<div id='added_prod_link_elem'><a href='" +
            fixURL(productURL) +
            "' class='link_underline'>この商品の販売ページ (駿河屋.JP)</a></div>";
        jNode.append(addElem);
        $("#added_prod_link_elem").css("margin-top", "15px");
        getPageData(productURL).then(function (data) {
            let prodPriceElem = "";
            $.each(
                $(data).find(".item-price .mgnB0.d-block"),
                function (index, elem) {
                    let labelStr = $(elem).data("label");
                    let priceStr = $(elem).find(".price-buy").text();
                    const labelEndMatch = labelStr.match(/ $/);
                    if (labelEndMatch != null) {
                        labelStr = labelStr.slice(0, labelEndMatch.index);
                    }
                    prodPriceElem =
                        prodPriceElem +
                        "<li>" +
                        labelStr +
                        " " +
                        priceStr +
                        "</li>";
                }
            );
            if (prodPriceElem != "") {
                prodPriceElem =
                    "<br>販売価格 (駿河屋.JP)<ul id='added_prod_price_elem'>" +
                    prodPriceElem +
                    "</ul>";
                $("#added_prod_link_elem").append(prodPriceElem);
            }
        });
    }

    /* マケプレの販売ページ右側の価格表示下にショップの配送料を表示出来るリンクを作成 */
    function getShippingFeeForMarketplaceProduct1(jNode) {
        if ($("#tenpo").length == 0) {
            return false;
        }
        const tenpoCd = $("#tenpo").val();
        const tenpoURL = "https://www.suruga-ya.jp/shop/" + tenpoCd;
        getPageData(tenpoURL).then(
            function (data) {
                const table = $(data).find("#search_result table");
                if ($(data).find("#search_result table").length != 1) {
                    getShippingFeeForMarketplaceProduct2(jNode);
                    return false;
                }
                let html = table[0].outerHTML;
                const modalId = "modal-shipping_fee";
                const modalStr = createModal(html, modalId);
                $(".bg_white_body.default_font").append(modalStr);
                let modalLink =
                    '<div id="shipping_fee_modal_link"><a class="js-modal-open link_underline" ';
                modalLink +=
                    'href="" data-target="' +
                    modalId +
                    '">このショップの配送料を確認</a></div>';
                jNode.after(modalLink);
                $("#shipping_fee_modal_link").css("margin", "5px 0");
            },
            function () {
                getShippingFeeForMarketplaceProduct2(jNode);
            }
        );
    }

    /*
          マケプレの販売ページ右側の価格表示下にショップの配送料を表示出来るリンクを作成（1で取得出来ない場合に実行）
          (※こちらで取得出来る配送料は実際の送料とは違う可能性がある)
        */
    function getShippingFeeForMarketplaceProduct2(jNode) {
        if ($("#tenpo").length == 0) {
            return false;
        }
        const tenpoCd = $("#tenpo").val();
        $.ajax({
            type: "POST",
            url: "https://www.suruga-ya.jp/product-other/shipping-fee",
            dataType: "json",
            data: {
                tenpo_cd: tenpoCd,
            },
        })
            .done(function (response) {
                /*
                テーブルの作成は基本的に駿河屋のスクリプトにてshipping-fee-tenpoクラスに対して設定されたイベントのコードのコピペ
                */
                let html = "";
                try {
                    if (response.data == "") {
                        return false;
                    }
                    const formatter = new Intl.NumberFormat("ja-JP");
                    html +=
                        '<table class="table-bordered" width="100%" cellpadding="0" cellspacing="0">';
                    html += "<tr>";
                    html += '<th class="text-center">都道府県</th>';
                    html += '<th class="text-center">送料</th>';
                    html += "</tr>";
                    if (response.data.option == 1) {
                        html += "<tr>";
                        html += '<td class="text-center">全国一律</td>';
                        html +=
                            '<td class="text-right">' +
                            formatter.format(response.data.shipping.national_fee) +
                            "円</td>";
                        html += "</tr>";
                        if (response.data.exception == 1) {
                            $.each(
                                response.data.list_zip_national_fee,
                                function (index, item) {
                                    html += "<tr>";
                                    html +=
                                        '<td align="center">' +
                                        item.zip_code +
                                        "</td>";
                                    html +=
                                        '<td align="right">' +
                                        formatter.format(item.fee) +
                                        "円</td>";
                                    html += "</tr>";
                                }
                            );
                        }
                        html += "</table>";
                    } else {
                        $.each(response.data.list_pref_fee, function (index, item) {
                            html += "<tr>";
                            html +=
                                '<td align="center">' + item.prefecture + "</td>";
                            html +=
                                '<td align="right">' +
                                formatter.format(item.fee) +
                                "円</td>";
                            html += "</tr>";
                        });
                        if (response.data.exception == 2) {
                            $.each(
                                response.data.list_zip_pref_fee,
                                function (index, item) {
                                    html += "<tr>";
                                    html +=
                                        '<td align="center">' +
                                        item.zip_code +
                                        "</td>";
                                    html +=
                                        '<td align="right">' +
                                        formatter.format(item.fee) +
                                        "円</td>";
                                    html += "</tr>";
                                }
                            );
                        }
                        html += "</table>";
                    }
                } catch (e) {
                    return false;
                }
                if (html != "") {
                    const modalId = "modal-shipping_fee";
                    const modalStr = createModal(html, modalId);
                    $(".bg_white_body.default_font").append(modalStr);
                    let modalLink =
                        '<div id="shipping_fee_modal_link"><a class="js-modal-open link_underline" ';
                    modalLink +=
                        'href="" data-target="' +
                        modalId +
                        '">このショップの配送料を確認</a></div>';
                    jNode.after(modalLink);
                    $("#shipping_fee_modal_link").css("margin", "5px 0");
                }
            })
            .fail(function () {
                return false;
            });
    }

    /* 品切れの販売ページにて、構造化データから価格を取得して表示 */
    if (isProductDetail) {
        if ($(".col-8 .w-70.pr-5").length == 1) {
            getPriceFromStructuredData($(".col-8 .w-70.pr-5"));
        }
    }
    function getPriceFromStructuredData(jNode) {
        if ($(".out-of-stock-text").length === 0) {
            /* 品切れではない販売ページ */
            return;
        }
        const jsons = $("script[type='application/ld+json']");
        if (jsons.length === 0) {
            return;
        }

        let targetObj;
        $.each(jsons, function (_, elem) {
            try {
                let obj = JSON.parse($($(elem)[0]).text());
                if (!Array.isArray(obj)) {
                    return true;
                }
                if (obj[0]["@type"] === "Product") {
                    targetObj = obj[0];
                }
            } catch (e) {
                console.log(e);
            }
        });

        if (targetObj) {
            let priceFromSdElem = "";
            const formatter = new Intl.NumberFormat("ja-JP");
            try {
                let priceStr = targetObj.offers?.price;
                if (priceStr === undefined || priceStr === null) {
                    return;
                }
                if (Number.isNaN(priceStr)) {
                    return;
                }
                if (priceStr == "0") {
                    return;
                }
                priceStr = formatter.format(priceStr);
                priceFromSdElem += `<li>${priceStr}円</li>`;
            } catch (e) {
                console.log(e);
            }
            if (priceFromSdElem != "") {
                const spanStr =
                    "<span>ソース内の構造化データから取得した価格</span>";
                priceFromSdElem =
                    "<div id='added_price_from_sd_elem'>" +
                    spanStr +
                    "<ul>" +
                    priceFromSdElem +
                    "</ul></div>";
                jNode.append(priceFromSdElem);
                $("#added_price_from_sd_elem").css("margin-top", "15px");
            }
        }
    }

    /* 過去に購入した商品の販売ページにて、購入時の価格を表示 */
    if (isProductDetail) {
        waitForKeyElements(
            ".alert.alert-infor.show.show-history a",
            getPriceFromOrderHistory,
            true,
            defaultClearIntervalTime
        );
    }
    function getPriceFromOrderHistory(jNode) {
        const prodInfoArea = $(".col-8 .w-70.pr-5");
        if (prodInfoArea.length != 1) return;
        let orderHistoryUrl = $(jNode[0]).attr("href");
        orderHistoryUrl = "https://www.suruga-ya.jp/" + orderHistoryUrl;
        getPageData(orderHistoryUrl).then(function (data) {
            const orderHistoryTBody = $(data).find(
                ".cont table.mgnT15.paddTbl tbody"
            );
            $.each(orderHistoryTBody.find("tr"), function (index, tr) {
                if (index === 0) return true;
                console.log();
                const td = $(tr).find("td");
                const itemCode2 = $(td[0]).text();
                if (itemCode2.indexOf(itemCode) === 0) {
                    let purchasePrice = $(td[7]).text().trim();
                    purchasePrice = purchasePrice.replace("￥", "");
                    purchasePrice += "円";
                    const spanStr = "<span>注文時の価格</span>";
                    const ulElem = "<ul><li>" + purchasePrice + "</li></ul>";
                    const divElem =
                        "<div id='added_price_from_order_history'>" +
                        spanStr +
                        ulElem +
                        "</div>";
                    prodInfoArea.append(divElem);
                    $("#added_price_from_order_history").css("margin-top", "15px");
                    return false;
                }
            });
        });
    }

    /* 買取ページに販売ページから取得した画像と価格を追加 */
    if (currentURL.indexOf("/kaitori_detail/") > -1) {
        waitForKeyElements(
            "#ansin #article1",
            getProductPageData,
            true,
            defaultClearIntervalTime
        );
    }
    function getProductPageData(jNode) {
        if (currentURL.indexOf("/kaitori_detail/") == -1) {
            return false;
        }
        const priceElem = jNode.find("#price");
        const nextElem = $(priceElem).next();
        if (nextElem.text() == "この商品の販売ページ") {
            nextElem.hide();
        }

        /**
         *  買取ページに
         * "こちらの商品の買取価格は、あんしん買取でのお申込後、メールにてご案内しております。"
         * のような記載があった場合でも販売ページに買取価格が表示される場合があるため、
         * その価格を買取ページに表示する。以下の商品でのみ確認。
         * https://www.suruga-ya.jp/product/detail/873007541
         * https://www.suruga-ya.jp/kaitori/kaitori_detail/873007541
         */
        let kaitoriPrice = "";
        const addKaitoriPrice = (kaitoriPriceElem) => {
            const priceMain = kaitoriPriceElem.find("#priceMain");
            const span = "<span>" + kaitoriPrice + "</span>";
            const kaitoriPriceInfo =
                "<div id='kaitoriPrice'>(販売ページから取得した買取価格" +
                span +
                ")</div>";
            priceMain.after(kaitoriPriceInfo);
            $("#kaitoriPrice").css({
                opacity: 0.7,
            });
        };

        getPageData(productURL)
            .then(
                function (data) {
                    var def = $.Deferred();
                    /** 販売価格 */
                    $.each(
                        $(data).find(".item-price .mgnB0.d-block"),
                        function (index, elem) {
                            const labelStr = $(elem).data("label");
                            let priceStr = $(elem).find(".price-buy").text();
                            priceStr = priceStr.replace(" (税込)", "");
                            if (labelStr.indexOf("新品") > -1) {
                                priceOfBrandNew = priceStr;
                            } else if (labelStr.indexOf("中古") > -1) {
                                priceOfUsed = priceStr;
                            } else if (labelStr.indexOf("予約") > -1) {
                                priceOfPreOrder = priceStr;
                            }
                        }
                    );
                    $.each(
                        $(data).find(".link-group.mgnT12 li"),
                        function (index, elem) {
                            if (
                                $(elem).find("a").text().indexOf("他のショップ") >
                                -1
                            ) {
                                priceOfMarketplace = $(elem).find("span").text();
                                priceOfMarketplace = priceOfMarketplace.replace(
                                    " ～",
                                    ""
                                );
                                return false;
                            }
                        }
                    );

                    /** 買取価格 */
                    (() => {
                        const kaitoriElemArea = $(data).find(
                            ".list-unstyled.mb-0.list-p3 li"
                        );
                        if (kaitoriElemArea.length !== 1) {
                            return;
                        }
                        const testStr = kaitoriElemArea.text();
                        if (!/.*(買取価格).*/.test(testStr)) {
                            return;
                        }
                        const kaitoriPriceElem =
                            kaitoriElemArea.find("span.text-red");
                        if (kaitoriPriceElem.length !== 1) {
                            return;
                        }
                        kaitoriPrice = kaitoriPriceElem.text();
                    })();

                    //defaultImgURL = $(data).find(".img-fluid")[0].currentSrc;
                    defaultImgURL = $($(data).find(".img-fluid")[0])
                        .parent()
                        .attr("href"); // currentSrcだと取得出来ない場合があったので
                    if (defaultImgURL.indexOf("javascript:void") > -1) {
                        defaultImgURL = "";
                    }
                    getProductPageDataCompleted = true;
                    def.resolve();
                    return def.promise();
                },
                function () {
                    return $.Deferred().resolve().promise();
                }
            )
            .then(function () {
                if (!getProductPageDataCompleted) {
                    return false;
                }

                (() => {
                    const kaitoriPriceElem = jNode.find("#price");
                    const testStr = kaitoriPriceElem.text();
                    const testResult =
                        /.*(こちらの商品の買取価格は、あんしん買取でのお申込後、メールにてご案内しております。).*/.test(
                            testStr
                        );
                    if (testResult && kaitoriPrice !== "") {
                        addKaitoriPrice(kaitoriPriceElem);
                    }
                })();

                let sellingPriceElem = "";
                if (priceOfPreOrder != "") {
                    sellingPriceElem +=
                        "<div id='priceOfPreOrder'>販売価格<span>" +
                        priceOfPreOrder +
                        " (予約)</span></div>";
                }
                if (priceOfBrandNew != "") {
                    sellingPriceElem +=
                        "<div id='priceOfBrandNew'>販売価格<span>" +
                        priceOfBrandNew +
                        " (新品)</span></div>";
                }
                if (priceOfUsed != "") {
                    sellingPriceElem +=
                        "<div id='priceOfUsed'>販売価格<span>" +
                        priceOfUsed +
                        " (中古)</span></div>";
                }
                if (priceOfMarketplace != "") {
                    sellingPriceElem +=
                        "<div id='priceOfMarketplace'>販売価格<span>" +
                        priceOfMarketplace +
                        " (マケプレ最安値)</span></div>";
                }
                const link =
                    "<a href='" + fixURL(productURL) + "'>この商品の販売ページ</a>";
                let buttonElem =
                    "<button type='button' class='btn w-100' id='productButton'>" +
                    link +
                    "</button>";
                if (sellingPriceElem != "") {
                    sellingPriceElem =
                        "<div id='sellingPrice'>" + sellingPriceElem + "</div>";
                    priceElem.after(sellingPriceElem);
                    $("#sellingPrice").css({
                        "font-size": "14px",
                        "font-weight": "bold",
                        "padding-top": "10px",
                    });
                    $("#sellingPrice span").css({
                        color: "#CC3333",
                        "font-size": "18px",
                        "padding-left": "15px",
                    });
                    $("#sellingPrice div").last().after(buttonElem);
                } else {
                    priceElem.after(
                        "<div id='sellingPrice'>" + buttonElem + "</div>"
                    );
                }
                /**
                 * 買取カートの位置と合わせるために#productButtonにmarginLeftを設定したかったが、そうすると商品画像のサイズが変わる。
                 * 調整が面倒なため、marginLeftは設定しないことにした。
                 */
                // let marginLeft = "180px";
                // if ($("#cart:has(.cart1)").length) {
                //     const cartPosition = $("#cart:has(.cart1)").position();
                //     const left = parseFloat(cartPosition?.left);
                //     if (!Number.isNaN(left) && left < 300) {
                //         marginLeft = left + "px";
                //     }
                // }
                $("#productButton").css({
                    width: "160px",
                    "font-size": "14px",
                    "font-weight": "bold",
                    padding: "3px 0 3px 0",
                    border: "1px solid #c7c7c7",
                    backgroundColor: "white",
                    padding: "6px 0",
                });
                $("#productButton a").css({
                    color: "#007185",
                    borderBottom: "1px solid #007185",
                });
                const imgElem = $(jNode.find("img")[0]);
                if (
                    defaultImgURL != "" &&
                    imgElem.attr("src").indexOf("no_photo.jpg") > -1
                ) {
                    imgElem.attr("src", defaultImgURL);
                    imgElem.removeAttr("width");
                }

                // 販売ページのリンクが2つある場合は元々あった方を非表示
                if ($("#price a.link_underline").length) {
                    const target = $("#price a.link_underline")[0];
                    if (target.textContent === "この商品の販売ページ") {
                        $(target).hide();
                    }
                }
            });
    }

    /* お気に入りリスト及び入荷リストにて、品切れ商品の表示に関するオプションを追加*/
    if (favoListId != "" || isNyukaList) {
        /* ページ上に商品がある場合のみ処理を続行。gnavBoxは商品のtd要素に設定されているクラス名 */
        if ($(".gnavBox").length != 0) {
            let destClassName = "favorite-action-wrapper";
            if (isNyukaList && $(".read.mt10 h2:first").length == 1) {
                /* 入荷リストの場合に、オプションの作成先となる要素を作成 */
                destClassName = "nyuka-list-action-wrapper";
                const wrapperHtml = '<div class="' + destClassName + '"></div>';
                $(".read.mt10 h2:first").after(wrapperHtml);
                $("." + destClassName).css("padding-bottom", "8px");
            } else if (isNyukaList) {
                destClassName = "";
            }
            if (destClassName != "") {
                addOutOfStockDisplayOption($("." + destClassName), destClassName);
                addNewProductTableToList();
            }
        }
    }
    $(document).on("click", ".enhancer_outofstock_display_option", function () {
        const lsVal = $(this).data("val");
        const lsKeyName = $(this).data("key");
        localStorage.setItem(lsKeyName, lsVal);
        const destClassName = $("#enhancer_outofstock_display_option_wrapper").data(
            "dest"
        );
        addOutOfStockDisplayOption($("." + destClassName), destClassName);
        addNewProductTableToList();
        return false;
    });
    function addOutOfStockDisplayOption(jNode, destClassName) {
        const wrapperName = "enhancer_outofstock_display_option_wrapper";
        $("#" + wrapperName).remove();
        const optionHtml = createOutOfStockDisplayOption();
        jNode.prepend(optionHtml);
        $("#" + wrapperName).attr("data-dest", destClassName);
    }
    function createOutOfStockDisplayOption() {
        let optionHtml = "";
        const optionId = "enhancer_outofstock_display_option";
        const lsKeyName = "enhancer__outofstock_display_option";
        const lsVal = localStorage.getItem(lsKeyName);
        const span1 = "<span>表示</span>";
        const span2 = "<span>非表示</span>";
        const span3 = "<span>のみ</span>";
        const link1 =
            '<a href="" class="' +
            optionId +
            '" data-val="1" data-key="' +
            lsKeyName +
            '">表示</a>';
        const link2 =
            '<a href="" class="' +
            optionId +
            '" data-val="2" data-key="' +
            lsKeyName +
            '">非表示</a>';
        const link3 =
            '<a href="" class="' +
            optionId +
            '" data-val="3" data-key="' +
            lsKeyName +
            '">のみ</a>';
        switch (lsVal) {
            case null:
                localStorage.setItem(lsKeyName, "1");
            case "1":
                optionHtml = [span1, link2, link3].join(" | ");
                break;
            case "2":
                optionHtml = [link1, span2, link3].join(" | ");
                break;
            case "3":
                optionHtml = [link1, link2, span3].join(" | ");
                break;
        }
        optionHtml = "品切れ: " + optionHtml;
        optionHtml =
            '<span id="enhancer_outofstock_display_option_wrapper">' +
            optionHtml +
            "</span>";
        return optionHtml;
    }
    function addNewProductTableToList() {
        const html = createNewProductTableFromOriginalTable();
        $(".new_table").remove();
        $($(".original_table")[0]).before(html);
    }
    function createNewProductTableFromOriginalTable() {
        if ($(".original_table").length == 0) {
            $(".read.mt10 table.list").addClass("original_table");
            $(".original_table").hide();
        }
        const lsKeyName = "enhancer__outofstock_display_option";
        const lsVal = localStorage.getItem(lsKeyName);
        const products = getProductsFromOriginalTable(lsVal);
        const productsLen = products.length;
        const num = 2;
        const newAry = [];
        for (var i = 0; i < Math.ceil(productsLen / num); i++) {
            const j = i * num;
            const ary = products.slice(j, j + num);
            newAry.push(ary);
        }
        let html = "";
        $.each(newAry, function (index, ary) {
            let prodHtml = "";
            if (ary.length == 1) {
                prodHtml = $(ary[0])[0].outerHTML;
            } else {
                prodHtml = $(ary[0])[0].outerHTML + $(ary[1])[0].outerHTML;
            }
            let tableHtml = "<tbody><tr>" + prodHtml + "</tr></tbody>";
            tableHtml =
                '<table class="list new_table" width="700" border="0">' +
                tableHtml +
                "</table>";
            html += tableHtml;
        });
        return html;
    }
    function getProductsFromOriginalTable(lsVal) {
        let products = [];
        $.each($(".original_table .gnavBox"), function (_, elem) {
            const priceElem = $(elem).find(".price");
            let isOutOfStock = false;
            if (priceElem.length == 0) {
                isOutOfStock = true;
            } else if (priceElem.html().indexOf("品切れ") > -1) {
                isOutOfStock = true;
            }
            if (isOutOfStock) {
                if (lsVal != 2) {
                    products.push($(elem));
                }
            } else {
                if (lsVal != 3) {
                    products.push($(elem));
                }
            }
        });
        return products;
    }

    /* 購入履歴の品番(管理番号)部分を販売ページのリンクに変換 */
    if (currentURL.indexOf("action_sell_search/detail?trade_code=") > -1) {
        const table = $("#pageCont .mgnT15.paddTbl");
        if (table.length == 1) {
            convertItemCodeinPurchaseHistoryToLink(table);
        }
    }
    function convertItemCodeinPurchaseHistoryToLink(table) {
        const reviewButton = $(".cont button.w100.padT0.padB0");
        let reviewURL, tenpoCd;
        if (reviewButton.length == 1 && reviewButton.attr("onclick")) {
            // マケプレの購入履歴の場合に、レビューページのURLを取得
            const href = reviewButton.attr("onclick");
            if (href.match(/'[^']*'/)) {
                reviewURL =
                    "https://www.suruga-ya.jp" +
                    href.match(/'[^']*'/)[0].replace(/'/g, "");
            }
        }
        (function () {
            let def = $.Deferred();
            if (reviewURL) {
                def.resolve();
            } else {
                def.reject();
            }
            return def.promise();
        })()
            .then(
                function () {
                    let def = $.Deferred();
                    getPageData(reviewURL).then(
                        function (data) {
                            const temp = $(data).find("#tenpo_cd");
                            if (temp && temp.val()) {
                                tenpoCd = temp.val();
                            }
                            def.resolve();
                        },
                        function () {
                            def.resolve();
                        }
                    );
                    return def.promise();
                },
                function () {
                    return $.Deferred().resolve().promise();
                }
            )
            .then(function () {
                $.each($(table.find("tr td:first-child")), function (index, td) {
                    const code = $(td).text();
                    const match = code.match(/^[a-zA-Z0-9]+$/);
                    if (match == null) {
                        return true;
                    }
                    let url = "https://www.suruga-ya.jp/product/detail/" + code;
                    if (tenpoCd) url = url + "?tenpo_cd=" + tenpoCd;
                    const html =
                        '<a href="' +
                        fixURL(url) +
                        '" target="_blank">' +
                        code +
                        "</a>";
                    $(td).empty();
                    $(td).append(html);
                });
            });
    }

    /* ページ右上のカートアイコンの横にカート内の商品の合計価格表示を追加 */
    if (".item_right_header .lbl_cart.cart-number".length) {
        getTotalPrice();
    }
    $(".btn_buy.btn.cart1").on("click", function () {
        getTotalPriceAfterClickingCart();
    });
    $(".tab-item .add-cart").on("click", function () {
        getTotalPriceAfterClickingCart();
    });
    function getTotalPriceAfterClickingCart() {
        skipNumOfProdsCheck = true;
        setTimeout(function () {
            getTotalPrice();
        }, 1000);
    }
    function getTotalPrice() {
        $("#added_price_elem").remove();
        const cartNumElem = $(".item_right_header .lbl_cart.cart-number");
        if (currentURL.indexOf("cargo/detail") > -1) {
            readCartPage1($(document), cartNumElem);
            return false;
        }
        if (cartNumElem.length != 1) {
            return false;
        }
        if (cartNumElem.text() == "") {
            setTimeout(function () {
                getTotalPrice();
            }, 1000);
            return false;
        }
        const numOfProds = cartNumElem.text();
        if (numOfProds == "0") {
            /* カートに何も入っていなければ終了 */
            localStorage.setItem("enhancer__num_of_prods", 0);
            localStorage.setItem("enhancer__total_price", "");
            localStorage.setItem("enhancer__delivery_charge", "");
            if (!skipNumOfProdsCheck) {
                return false;
            }
        }
        if (
            !skipNumOfProdsCheck &&
            localStorage.getItem("enhancer__num_of_prods") != null
        ) {
            if (numOfProds == localStorage.getItem("enhancer__num_of_prods")) {
                /* カート内の商品数とlocalStorageに保存された商品数が同じ場合はlocalStorageから読み込む */
                readLocalStorage(cartNumElem);
                return false;
            }
        } else {
            localStorage.setItem("enhancer__num_of_prods", numOfProds);
        }
        getPageData(cartURL).then(function (data) {
            readCartPage1($(data), cartNumElem);
        });
    }

    function readCartPage1(jqObj, cartNumElem) {
        /* 商品数の取得、保存 */
        const total = jqObj.find(".next_step .total");
        const itemCount = total.find(".item_count").text();
        let numOfProds = itemCount.replace(/(\(|\)|点|:)/g, "");
        numOfProds = numOfProds.replace(/( |	)/, "");
        if (numOfProds == "") {
            localStorage.setItem("enhancer__num_of_prods", 0);
            localStorage.setItem("enhancer__total_price", "");
            localStorage.setItem("enhancer__delivery_charge", "");
            return false;
        }
        /* 合計価格の取得、保存 */
        localStorage.setItem("enhancer__num_of_prods", numOfProds);
        let totalPrice = total.find(".mgnB0 > .total_price").text();
        if (totalPrice == "") {
            totalPrice = $(total.find(".total_price")[0]).text();
        }
        localStorage.setItem("enhancer__total_price", totalPrice);
        /* 送料の取得、保存 */
        readCartPage2(jqObj, cartNumElem);
    }

    /* カートの右ペインから送料や手数料を取得する */
    function readCartPage2(jqObj, cartNumElem) {
        const total = jqObj.find(".next_step .total");
        const itemCount = total.find(".item_count").text();
        let numOfProds = itemCount.replace(/(\(|\)|点|:)/g, "");
        numOfProds = numOfProds.replace(/( |	)/, "");
        if (numOfProds == "") {
            localStorage.setItem("enhancer__num_of_prods", 0);
            localStorage.setItem("enhancer__total_price", "");
            localStorage.setItem("enhancer__delivery_charge", "");
            return false;
        }
        localStorage.setItem("enhancer__num_of_prods", numOfProds);
        let totalPrice = total.find(".mgnB0 > .total_price").text();
        if (totalPrice == "") {
            totalPrice = $(total.find(".total_price")[0]).text();
        }
        localStorage.setItem("enhancer__total_price", totalPrice);
        let deliveryCharge = total.find(".delivery_charge.mgnT5").text();
        deliveryCharge = deliveryCharge.replace(/( |	|\r\n|\n)/g, "");
        if (deliveryCharge == "") {
            deliveryCharge = "送料が取得出来ません";
        } else {
            const deliveryChargeAry = [];
            const formatter = new Intl.NumberFormat("ja-JP");

            try {
                // 駿河屋の送料及びマケプレの全国一律の送料
                if (deliveryCharge.includes("送料無料")) {
                    deliveryChargeAry.push(`送料無料`);
                } else {
                    const deliveryChargeMatch =
                        deliveryCharge.match(/\+[0-9]{1,}円の送料/g);
                    let dcSum = 0;
                    if (deliveryChargeMatch) {
                        for (const dcStr of deliveryChargeMatch) {
                            const _dcStr = dcStr.match(/[0-9]{1,}/)[0];
                            dcSum += parseInt(_dcStr);
                        }
                    }
                    if (dcSum !== 0) {
                        const dcSumStr = formatter.format(dcSum);
                        deliveryChargeAry.push(`+${dcSumStr}円`);
                    }
                }

                // マケプレの地域別の送料
                const cartHtml = jqObj.find("main.cart").html();
                const mpDeliveryChargeByRegionMatch =
                    cartHtml.match(/配送住所に合わせた送料/g);
                let mpDeliveryChargeByRegionCount = 0;
                if (mpDeliveryChargeByRegionMatch) {
                    mpDeliveryChargeByRegionCount =
                        mpDeliveryChargeByRegionMatch.length;
                }
                if (mpDeliveryChargeByRegionCount === 1) {
                    deliveryChargeAry.push(`+地域別`);
                } else if (mpDeliveryChargeByRegionCount > 1) {
                    deliveryChargeAry.push(
                        `+地域別x${mpDeliveryChargeByRegionCount}`
                    );
                }

                // 通信販売手数料
                if (deliveryCharge.includes("通信販売手数料")) {
                    const salesFeeMatch = deliveryCharge.match(
                        /通信販売手数料[^\:]*:([0-9]{1,})円/
                    );
                    if (salesFeeMatch) {
                        const salesFeeStr = salesFeeMatch[1];
                        if (salesFeeStr !== "0") {
                            deliveryChargeAry.push(`+通信販売手数料`);
                        }
                    }
                }

                if (deliveryChargeAry.length) {
                    deliveryCharge = deliveryChargeAry.join(",");
                }
            } catch (e) {
                console.log(e);
            }
        }
        localStorage.setItem("enhancer__delivery_charge", deliveryCharge);
        const priceElem =
            "<span id='added_price_elem'>" +
            totalPrice +
            "[" +
            deliveryCharge +
            "]" +
            "</span>";
        cartNumElem.after(priceElem);
    }

    function readLocalStorage(cartNumElem) {
        const totalPrice = localStorage.getItem("enhancer__total_price");
        const deliveryCharge = localStorage.getItem("enhancer__delivery_charge");
        const priceElem =
            "<span id='added_price_elem'>" +
            totalPrice +
            "[" +
            deliveryCharge +
            "]" +
            "</span>";
        cartNumElem.after(priceElem);
    }

    function getPageData(url) {
        var def = $.Deferred();
        $.ajax({
            type: "GET",
            url: url,
        })
            .done(function (data) {
                def.resolve(data);
            })
            .fail(function () {
                def.reject();
            });
        return def.promise();
    }

    function createModal(html, modalId) {
        const modalStr =
            '<div id="' +
            modalId +
            '" class="c-modal js-modal">' +
            '<div class="c-modal_bg js-modal-close"></div>' +
            '<div class="c-modal_content _lg">' +
            '<div class="c-modal_content_inner">' +
            '<span class="c-modal_title">送料</span>' +
            '<a class="js-modal-close c-modal_close" href=""><span>[閉じる]</span></a>' +
            "<div>" +
            html +
            "</div>" +
            "</div></div></div>";
        return modalStr;
    }

    function fixURL(url) {
        if (base64Decoded == "") {
            base64Decoded = decodeURIComponent(atob(base64Encoded));
        }
        const encodedURL = encodeURIComponent(url);
        url = base64Decoded + encodedURL;
        return url;
    }

    // カートのリンク
    const cartLinkSelectors = [
        ".item_right_header .d-flex.justify-content-start.align-content-center",
        ".item_sidebar_header a[href='/cargo/detail']",
        "#utility .icon01 a[href='/cargo/top']",
        "a.cart-number[href='https://www.suruga-ya.jp/cargo/top']",
    ];
    for (const s of cartLinkSelectors) {
        if ($(s).length == 1) {
            afCartIcon($(s));
        }
    }
    function afCartIcon(jNode) {
        jNode.attr("href", fixURL(cartURL));
    }

    // "注文画面に進む" ボタンのリンク
    if (currentURL.indexOf("cargo/detail") > -1) {
        afRegisterButton();
    }
    function afRegisterButton() {
        let btn = $(".total .register .btn");
        if (btn.length == 0) {
            btn = $("#sidebar .register .btn.mgnB10");
        }
        if (btn.length == 1) {
            let registerURL = btn.attr("href");
            if (registerURL.indexOf("/") == 0) {
                registerURL = "https://www.suruga-ya.jp" + registerURL;
            }
            btn.attr("href", fixURL(registerURL));
        }
    }

    // あんしん買取のカート("売却カートを見る"タブ)のリンク
    const ansinCartLinkSelector = "#ansin .TabbedPanels .TabbedPanelsTabLink a";
    if ($(ansinCartLinkSelector).length == 1) {
        afAnsinCart($(ansinCartLinkSelector));
    }
    function afAnsinCart(jNode) {
        if (jNode.text().indexOf("売却カートを見る") > -1) {
            let AnsinCartURL = jNode.attr("href");
            if (AnsinCartURL.indexOf("/") == 0) {
                AnsinCartURL = "https://www.suruga-ya.jp" + AnsinCartURL;
            }
            jNode.attr("href", fixURL(AnsinCartURL));
        }
    }

    $("#ansin #tabbed p.button a").each(function (_, elem) {
        afAnsinNyuryoku($(elem));
    });
    function afAnsinNyuryoku(jNode) {
        if (jNode.text().indexOf("申込み手続きへ") > -1) {
            let AnsinNyuryokuURL = jNode.attr("href");
            if (AnsinNyuryokuURL.indexOf("/") == 0) {
                AnsinNyuryokuURL = "https://www.suruga-ya.jp" + AnsinNyuryokuURL;
            }
            jNode.attr("href", fixURL(AnsinNyuryokuURL));
        }
    }

    function isUserscript() {
        try {
            const gmVer = window.GM_info.script.version;
            if (typeof gmVer === "string") {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            // console.log(e);
            return false;
        }
    }

})();
