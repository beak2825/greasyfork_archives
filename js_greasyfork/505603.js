// ==UserScript==
// @name         MarketHelper
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  MarketHelper helps you sold and bougth items in market
// @author       RockefelleR
// @include https://*.the-west.*/game.php*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAw3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBEsMgCLz7ij5BWFR8jmnSmf6gzy8Gk4lNmXFZWGdFwvZ5v8KjB5MESUVzzTlaSJXKzYhGj7YjRdnRizo0mvvhFNhasAwvNY/7R59OA0/NWLoY6XMIyyxUGf76Y8Se0CfqfB1GdRiBXaBh0PxbMVct1y8sW5xD/YQOovPYt7rY9tZk74B5AyEaAuoDoB8JaEbUkKF2kZCME4ohcExiC/m3pyPCF/OsWSul/SBQAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TpUVaHdpBpEOG6mQXFXEsVSyChdJWaNXB5NIvaNKSpLg4Cq4FBz8Wqw4uzro6uAqC4AeIs4OToouU+L+k0CLGg+N+vLv3uHsHCO0aU42BOKBqpp5JJsR8YVX0vcKPCIIYRkhiRiOVXczBdXzdw8PXuxjPcj/35wgqRYMBHpE4zhq6SbxBPLtpNjjvE4dZRVKIz4kndbog8SPXZYffOJdtFnhmWM9l5onDxGK5j+U+ZhVdJZ4hjiqqRvlC3mGF8xZntdZk3XvyFwaK2kqW6zQjSGIJKaQhQkYTVdRgIkarRoqBDO0nXPxjtj9NLplcVTByLKAOFZLtB/+D390apekpJymQAAZfLOtjHPDtAp2WZX0fW1bnBPA+A1daz19vA3OfpLd6WvQIGNkGLq57mrwHXO4Ao08NSZdsyUtTKJWA9zP6pgIQugWG1pzeuvs4fQBy1NXyDXBwCEyUKXvd5d3+/t7+PdPt7weK/nKwLNGRWwAADXZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MzcwMjcwYTAtYmI3YS00ZGViLWE1ZjctNjhiMDI4NmE5NjEwIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExNDYzNTE3LWZhMmEtNGE1OC1hOTM3LWVmZGFhNmVlYzFiZCIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjNjZjcwODNhLTE3YTEtNGJjZi1hZDRhLTNkYTg0NWQyOTA5MCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzI0ODUxMDU0NTU0MjE5IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjI4VDE1OjE3OjM0KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoyOFQxNToxNzozNCswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIwMWMxODI1LWFjZjQtNDQ5Ni1iY2ZlLTE5NGJmZThjYjliNyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yOFQxNToxNzozNCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4NjQHHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AgcDREikh1hDgAABnhJREFUSMeVlluIXVcZx39rrX09Z++zz3VuJ5lkMqmk6SWpTWtpY28mLaX6EMErgi9KEUQqfRF8sQVBRHwQFBUrCIpCDdhWTINNKWovSUxiYtI0F+ukmSQzmWlmzn2fs/day4ckRbBq+z0tWKz/71vw/y6CDxAP3Xd7zRjqSqnB3pcPvP1+34n/dnHHlk1+HIVf9jz5uHLdiueoqucqlOMgEGijybL8oNb696NR9srGqHnoB88+u/q+ITu2b/2I6zm7wzBoxnGBpFggKgYIJWkvrtDRGUoIstwyHGWkoyF6pLU08rPPvbz/t/8Tcvftm51Cwf+WH3jfrCUx9VpCtRJTjAJcR+J3MnxXcflKC4ylMxjSSYestrqMcs1glBF47hO/euGV778n5O47N8UFP9wdBsHOZrPKWKNKrRwRhiGOK8k6A8aUQyWJmF+8grUWKQT9dMBqLyVNc7qDlHavz8jI9U//7sVz17Xl9YPver8oFsOda9c0mG6OsWayRhJH+K6DRCF7KdVqzPzCMiudLsZaXM+lUUloVEo0qhEbmmNUSzGDtP/zf/+JAnhg+9btURR+d2q8yrrpCarVhDAMcBwXJAwXV7lxeoL5hXd47i9H6KQptahA6Hm4jiJwPVzX49LSCucXlyn43szWTeufP/zm3CUAByBwnW8kcZHx8QrVJML3XRwhsGjQmo1TNd54a57nXzvGp+7fRq+f0uqljNcl5XJEvz/k/OJlllbbtPoDVgYpnX72FPBxAPngPVvW+IH/6Fi9Qq2cUIhCHOVizNUchFC02j3mFpbwih6n5i5SLIS0+j0Goxw90ly8vMqZ+SUOnzmHCTwmpya49aaZR7/0+Uc+BOB4nn9PHIXUkpiw6IERWCxSKYzV5MLSSzPanQGdxQVenHubTpbxsQ9vphB4nFtY5tUTpzjyj0vMzkxQTkqsnWpQikK6/f5HgdOOo8RdUVzALzg4SiGkAGsxaAQSaTQDnZNjMMbwxBd2MV5P6PZS9h04zrF/XiCuxtx26w3UKjGNeoVKtYA0Em3sLQCOVHJ7IQzxfR8J5Ca/ajsrsDpDOIqhp1g3Vmfzlq3MbNrAX187yL7Dp1BxwNS6SerlmFotoRSFBKGPFGCVwPedqxClpPJdhSsFUrlXK8caJALpuuTGUCqXOXHkFGb5CocOHeVKv0dUCpmq1xifrF4zi4Nw1LWaUBitcVx3E4B0HNl2XRepFGCuQSxGG3JjAEueDWl3WjRKZdJ0xOL8BZIoYv26cSbHKvgFH+l4oA1ag0FjhCVNhyMAqbVd1TpHW7AIjDYYBEaAyQxGW86enMMYTW/QJ0wKjCcBr+8/SncwJDM5wliszjHiqmlMZkHDoD/sAshc5ydzbbDGYLEIC/Jas5FK0u/3WVla5pH7t2PJSSqTV8WHI46eOEu/k6KNxQhQSBAgFFhhyXLdAZCDYX58kKbkWYa0Esd1QCmkhW6rQ5JpPnHvnUw1m5SSBJN1UV6I7wsOH/g7J0/P0+l0EVIgpERKiUAghEBZcRTAWZxv7Z6ebHxvlOkJrTUrK6ssL64yXS4y06gC8PbFJf6091VCF1r9IdUkZqXVphAGTAQu7fNLjHJNvV5GCgEWVlbaKGN/A+AcO3Mmba4pPxoVg0O23WOqUuKWm2cQ1rB0pcMzLx2k3R/S7fdpt9vEUUhvoLlpdoZd992BoyR7Dr9B2XFIkohiGJIbjUix7yxcOPhugzw7d/HSbeua7Y3N+sOVuEinN+TIm+fY8/ox4mLI5vVTzK4Zw6J47JM7mKxX2HHnZlY6PaSUTJUjLiy3KVeKOMrh8tKqzftm15M/fub4uxCAqBgdqCfh3YHnzvYGKZP1Mttu3MiaRsIv9+7n4jst5haXGWYZ4+WEw6fPEfoes80GLx09TT/XVMox3UFqgoyHvv6dn+x5z8n4mZ13BdNj1T/cfMPaB+pJjO+5OApanZTldg8lBEHgMkhHbGg2WF7t8udjZ7jQ6bK2OU4lKuqx0Hvksad++sf/mCfX48Rb87nner++0uqtHQ7TrVIKhFCU4gL1akwx8MFYRvmIE2fn2Xf8LAMB9XKJYhCemkiq277y5I+OvO9t5XMPP3hvELnf9si3N2tlFlbatLMR+lpujhIgJKFyL5SC4PHpqPLs1374dPaBVqLr8dUvfrp8fuHi7CjPir7n+AXfRymVAdbHaf1s956//T+NfwEVfME3NkEQxAAAAABJRU5ErkJggg==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/505603/MarketHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/505603/MarketHelper.meta.js
// ==/UserScript==



(function () {

    MarketHelper = {
        window: null,
        states: ["idle", "running", "waiting for a consumable cooldown"],
        data: null,
        stage: null,
        itemPattern: "",
        sortType: false,
        itemPrice: 0,
        itemID: "",
        itemDescription: "",
        onlyWeb: true,
        startBuying: false,
    };



    MarketHelper.selectTab = function (key) {
        MarketHelper.window.tabIds[key].f(MarketHelper.window, key);
    };

    MarketHelper.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };

    MarketHelper.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };

    MarketHelper.removeWindowContent = function () {
        $(".MarketHelper2window").remove();
    };


    MarketHelper.createWindow = async function () {
        var window = wman.open("MarketHelper").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("MarketHelper");
        var content = $('<div class=\'MarketHelper2window\'/>');
        var tabs = {
            "settings": "Settings",
            "buy": "Buy",
        };
        var tabLogic = function (win, id) {
            var content = $('<div class=\'MarketHelper2window\'/>');
            switch (id) {
                case "settings":
                    MarketHelper.removeActiveTab(this);
                    MarketHelper.removeWindowContent();
                    MarketHelper.addActiveTab("settings", this);
                    content.append(MarketHelper.createSettingsGui());
                    MarketHelper.window.appendToContentPane(content);
                    break;
                case "buy":
                    MarketHelper.removeActiveTab(this);
                    MarketHelper.removeWindowContent();
                    MarketHelper.addActiveTab("buy", this);
                    content.append(MarketHelper.createBuyGui());
                    MarketHelper.window.appendToContentPane(content);
                    break;
            }
        }
        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, tabLogic);
        }
        MarketHelper.window = window;
        MarketHelper.selectTab("settings");
        return new Promise(resolve => {
            resolve();
        });
    };



    MarketHelper.cooldownChanged = function () {
        var min = 2200;
        var max = 2600;
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    MarketHelper.symulateClickC = async function (typeOfClick) {
        var targetDiv = document.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
        if (targetDiv) {
            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            targetDiv.dispatchEvent(event);
            console.log("Symulowano kliknięcie na div z klasą ''.");
            console.log(typeOfClick)
        } else {
            console.log("Nie znaleziono elementu z klasą ''.");
            console.log(typeOfClick);
        }
    }

    MarketHelper.symulateClickCExtendedCC = async function (parentDivName, typeOfClick) {
        var parentDiv = document.querySelector(parentDivName);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą ''.");
                console.log(typeOfClick)
            } else {
                console.log("Nie znaleziono elementu z klasą ''.");
                console.log(typeOfClick);
            }
        }
    }

    MarketHelper.symulateClickCExtendedIC = async function (parentDivName, typeOfClick) {
        var parentDiv = document.getElementById(parentDivName);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą ''.");
                console.log(typeOfClick)
            } else {
                console.log("Nie znaleziono elementu z klasą ''.");
                console.log(typeOfClick);
            }
        }
    }

    MarketHelper.closeWindow = async function (nameOfWindow) {
        var parentDiv = document.querySelector(nameOfWindow);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(".tw2gui_window_buttons_close"); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą 'tw2gui_window_buttons_close'.");
            } else {
                console.log("Nie znaleziono elementu z klasą 'tw2gui_window_buttons_close'.");
            }
        }

    }



    MarketHelper.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");

        var buttonApply = new west.gui.Button("Send", function () {
            console.log("button clicked");

            var reqObj = {
                pattern: "",
                nav: "",
                page: 0,
                sort: "bid",
                order: "asc",
                type: "",
                level_range_min: 0,
                level_range_max: "",
                usable: true,
                has_effect: false,
                visibility: 2,
            };


            Ajax.remoteCall('building_market', 'search', reqObj, function (json) {
                if (json.error)
                    return new UserMessage(json.msg, UserMessage.TYPE_ERROR).show();
                if (json.msg.search_result.length == 0) {
                    return new UserMessage('Nie znaleziono pasującej oferty!', UserMessage.TYPE_ERROR).show();
                }
                console.log(json);
            }, MarketWindow);



        })

        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };






    MarketHelper.RunBuying = async function () {
        if (MarketHelper.startBuying) {

            var order = MarketHelper.sortType ? "desc" : "asc";
            var sort = MarketHelper.sortType ? "stack" : "buynow";
            var bougth = false;


            var reqObj = {
                pattern: MarketHelper.itemPattern,
                nav: "first",
                page: 1,
                sort: sort,
                order: order,
                type: "",
                level_range_min: 0,
                level_range_max: "",
                usable: true,
                has_effect: false,
                visibility: 2,
            };

            var result = null;

            Ajax.remoteCall('building_market', 'search', reqObj, async function (json) {
                console.log(json);
                result = json.msg.search_result;
                await new Promise(r => setTimeout(r, 100));

                for (var i = 0; i < result.length; i++) {
                    if (result[i].description.includes(MarketHelper.itemDescription)) {
                        if (result[i].item_id.toString().includes(MarketHelper.itemID)) {
                            var x = result[i].max_price / result[i].item_count;
                            if (x <= MarketHelper.itemPrice || MarketHelper.itemPrice == 0) {
                                if (MarketHelper.onlyWeb && result[i].sell_rights != 2) {
    
                                } else {
                                    Ajax.remoteCall('building_market', 'bid', {
                                        bidtype: 0,
                                        bid: result[i].max_price,
                                        market_offer_id: result[i].market_offer_id
                                    }, async function (resp) {
                                        Character.setMoney(resp.msg.money);
                                        await new Promise(r => setTimeout(r, 1000));
                                    });
                                    bougth = true;
                                    await new Promise(r => setTimeout(r, 1200)); // Czekanie 1 sekundy
                                }
                            }
                        }
                    }
                }
            });
            

            if (bougth) {
                MessagesWindow.Report.currentFolder = 'other';
                MessagesWindow.Report.multiDelete(true, true);
                await new Promise(r => setTimeout(r, 500));
                MessagesWindow.Report.currentFolder = 'deleted';
                MessagesWindow.Report.multiDelete(true, true);
            }

            await new Promise(r => setTimeout(r, 1500));
            MarketHelper.RunBuying();
        }
    }

    MarketHelper.createBuyGui = function () {
        var htmlSkel = $("<div id=\'buy_overview'\ style = \'padding:10px;'\></div>");


        var htmlItemPattern = $("<div></div>");
        htmlItemPattern.append("<span> Patern: </span>");
        var itemPatternTextfield = new west.gui.Textfield(MarketHelper.itemPattern || "");
        itemPatternTextfield.setValue(MarketHelper.itemPattern);
        itemPatternTextfield.setWidth(100);
        $(itemPatternTextfield.getMainDiv()).on('input', function () {
            MarketHelper.itemPattern = String(itemPatternTextfield.getValue());
        });
        htmlItemPattern.append(itemPatternTextfield.getMainDiv());

        var checkboxsortType = new west.gui.Checkbox();
        checkboxsortType.setLabel("Kupowanie sortując od największej ilości");
        checkboxsortType.setSelected(MarketHelper.sortType);
        checkboxsortType.setCallback(function () {
            MarketHelper.sortType = !MarketHelper.sortType;
        });

        var htmlItemPrice = $("<div></div>");
        htmlItemPrice.append("<span> Cena poniżej za szt.: </span>");
        var itemPriceTextfield = new west.gui.Textfield(0);
        itemPriceTextfield.setValue(MarketHelper.itemPrice);
        itemPriceTextfield.setWidth(100);
        $(itemPriceTextfield.getMainDiv()).on('input', function () {
            MarketHelper.itemPrice = parseInt(itemPriceTextfield.getValue(), 10) || 0;
        });
        htmlItemPrice.append(itemPriceTextfield.getMainDiv());



        var htmlItemID = $("<div></div>");
        htmlItemID.append("<span> Item o podanym ID(Wyszukiwanie ograniczone przez Patern): </span>");
        var itemIDTextfield = new west.gui.Textfield(MarketHelper.itemID);
        itemIDTextfield.setValue(MarketHelper.itemID);
        itemIDTextfield.setWidth(100);
        $(itemIDTextfield.getMainDiv()).on('input', function () {
            MarketHelper.itemID = String(itemIDTextfield.getValue());
        });
        htmlItemID.append(itemIDTextfield.getMainDiv());

        var htmlitemDescription = $("<div></div>");
        htmlitemDescription.append("<span> Aukcja o podanym opisie </span>");
        var itemDescriptionTextfield = new west.gui.Textfield(MarketHelper.itemDescription);
        itemDescriptionTextfield.setValue(MarketHelper.itemDescription);
        itemDescriptionTextfield.setWidth(100);
        $(itemDescriptionTextfield.getMainDiv()).on('input', function () {
            MarketHelper.itemDescription = String(itemDescriptionTextfield.getValue());
        });
        htmlitemDescription.append(itemDescriptionTextfield.getMainDiv());

        var checkboxOnlyWeb = new west.gui.Checkbox();
        checkboxOnlyWeb.setLabel("Kupuj tylko przedmioty wystawione na świat(Nie kupuj wystawionych na sojusz)");
        checkboxOnlyWeb.setSelected(MarketHelper.onlyWeb);
        checkboxOnlyWeb.setCallback(function () {
            MarketHelper.onlyWeb = !MarketHelper.onlyWeb;
        });



        var htmlRun = $("<div style='text-align:center; margin-top:10px;'></div>"); // Wyśrodkowanie opisu statusu

        if (MarketHelper.startBuying) {
            htmlRun.append("<span> Szukam i kupuje przedmioty</span>");
        }
        else {
            htmlRun.append("<span> Program czeka na uruchomienie</span>");
        }


        var buttonStartStop = new west.gui.Button("Start/Stop", function () {
            MarketHelper.startBuying = !MarketHelper.startBuying;
            MarketHelper.selectTab("buy");
            MarketHelper.RunBuying();
            
        })


        var buttonDiv = $("<div style='text-align:center;'></div>"); // Wyśrodkowanie przycisku
        buttonDiv.append(buttonStartStop.getMainDiv());


        htmlSkel.append("Nie jest możliwe pobranie wszystkich aukcji... Pobierana jest tylko jedna strona. Zalecane jest zawęrzanie wyszukiwanych przedmiotów przez patern(Jest to część nazwy przedmiotu)");
        htmlSkel.append("<br>");
        htmlSkel.append(htmlItemPattern);
        htmlSkel.append(checkboxsortType.getMainDiv());
        htmlSkel.append(htmlItemPrice);

        htmlSkel.append(htmlItemID);
        htmlSkel.append(htmlitemDescription);
        htmlSkel.append(checkboxOnlyWeb.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append("<br>");
        htmlSkel.append(buttonDiv);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlRun);

        return htmlSkel;
    };






    MarketHelper.createMenuIcon = function () {
        var menuimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAw3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBEsMgCLz7ij5BWFR8jmnSmf6gzy8Gk4lNmXFZWGdFwvZ5v8KjB5MESUVzzTlaSJXKzYhGj7YjRdnRizo0mvvhFNhasAwvNY/7R59OA0/NWLoY6XMIyyxUGf76Y8Se0CfqfB1GdRiBXaBh0PxbMVct1y8sW5xD/YQOovPYt7rY9tZk74B5AyEaAuoDoB8JaEbUkKF2kZCME4ohcExiC/m3pyPCF/OsWSul/SBQAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TpUVaHdpBpEOG6mQXFXEsVSyChdJWaNXB5NIvaNKSpLg4Cq4FBz8Wqw4uzro6uAqC4AeIs4OToouU+L+k0CLGg+N+vLv3uHsHCO0aU42BOKBqpp5JJsR8YVX0vcKPCIIYRkhiRiOVXczBdXzdw8PXuxjPcj/35wgqRYMBHpE4zhq6SbxBPLtpNjjvE4dZRVKIz4kndbog8SPXZYffOJdtFnhmWM9l5onDxGK5j+U+ZhVdJZ4hjiqqRvlC3mGF8xZntdZk3XvyFwaK2kqW6zQjSGIJKaQhQkYTVdRgIkarRoqBDO0nXPxjtj9NLplcVTByLKAOFZLtB/+D390apekpJymQAAZfLOtjHPDtAp2WZX0fW1bnBPA+A1daz19vA3OfpLd6WvQIGNkGLq57mrwHXO4Ao08NSZdsyUtTKJWA9zP6pgIQugWG1pzeuvs4fQBy1NXyDXBwCEyUKXvd5d3+/t7+PdPt7weK/nKwLNGRWwAADXZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MzcwMjcwYTAtYmI3YS00ZGViLWE1ZjctNjhiMDI4NmE5NjEwIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExNDYzNTE3LWZhMmEtNGE1OC1hOTM3LWVmZGFhNmVlYzFiZCIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjNjZjcwODNhLTE3YTEtNGJjZi1hZDRhLTNkYTg0NWQyOTA5MCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzI0ODUxMDU0NTU0MjE5IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjI4VDE1OjE3OjM0KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoyOFQxNToxNzozNCswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIwMWMxODI1LWFjZjQtNDQ5Ni1iY2ZlLTE5NGJmZThjYjliNyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yOFQxNToxNzozNCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4NjQHHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AgcDREikh1hDgAABnhJREFUSMeVlluIXVcZx39rrX09Z++zz3VuJ5lkMqmk6SWpTWtpY28mLaX6EMErgi9KEUQqfRF8sQVBRHwQFBUrCIpCDdhWTINNKWovSUxiYtI0F+ukmSQzmWlmzn2fs/day4ckRbBq+z0tWKz/71vw/y6CDxAP3Xd7zRjqSqnB3pcPvP1+34n/dnHHlk1+HIVf9jz5uHLdiueoqucqlOMgEGijybL8oNb696NR9srGqHnoB88+u/q+ITu2b/2I6zm7wzBoxnGBpFggKgYIJWkvrtDRGUoIstwyHGWkoyF6pLU08rPPvbz/t/8Tcvftm51Cwf+WH3jfrCUx9VpCtRJTjAJcR+J3MnxXcflKC4ylMxjSSYestrqMcs1glBF47hO/euGV778n5O47N8UFP9wdBsHOZrPKWKNKrRwRhiGOK8k6A8aUQyWJmF+8grUWKQT9dMBqLyVNc7qDlHavz8jI9U//7sVz17Xl9YPver8oFsOda9c0mG6OsWayRhJH+K6DRCF7KdVqzPzCMiudLsZaXM+lUUloVEo0qhEbmmNUSzGDtP/zf/+JAnhg+9btURR+d2q8yrrpCarVhDAMcBwXJAwXV7lxeoL5hXd47i9H6KQptahA6Hm4jiJwPVzX49LSCucXlyn43szWTeufP/zm3CUAByBwnW8kcZHx8QrVJML3XRwhsGjQmo1TNd54a57nXzvGp+7fRq+f0uqljNcl5XJEvz/k/OJlllbbtPoDVgYpnX72FPBxAPngPVvW+IH/6Fi9Qq2cUIhCHOVizNUchFC02j3mFpbwih6n5i5SLIS0+j0Goxw90ly8vMqZ+SUOnzmHCTwmpya49aaZR7/0+Uc+BOB4nn9PHIXUkpiw6IERWCxSKYzV5MLSSzPanQGdxQVenHubTpbxsQ9vphB4nFtY5tUTpzjyj0vMzkxQTkqsnWpQikK6/f5HgdOOo8RdUVzALzg4SiGkAGsxaAQSaTQDnZNjMMbwxBd2MV5P6PZS9h04zrF/XiCuxtx26w3UKjGNeoVKtYA0Em3sLQCOVHJ7IQzxfR8J5Ca/ajsrsDpDOIqhp1g3Vmfzlq3MbNrAX187yL7Dp1BxwNS6SerlmFotoRSFBKGPFGCVwPedqxClpPJdhSsFUrlXK8caJALpuuTGUCqXOXHkFGb5CocOHeVKv0dUCpmq1xifrF4zi4Nw1LWaUBitcVx3E4B0HNl2XRepFGCuQSxGG3JjAEueDWl3WjRKZdJ0xOL8BZIoYv26cSbHKvgFH+l4oA1ag0FjhCVNhyMAqbVd1TpHW7AIjDYYBEaAyQxGW86enMMYTW/QJ0wKjCcBr+8/SncwJDM5wliszjHiqmlMZkHDoD/sAshc5ydzbbDGYLEIC/Jas5FK0u/3WVla5pH7t2PJSSqTV8WHI46eOEu/k6KNxQhQSBAgFFhhyXLdAZCDYX58kKbkWYa0Esd1QCmkhW6rQ5JpPnHvnUw1m5SSBJN1UV6I7wsOH/g7J0/P0+l0EVIgpERKiUAghEBZcRTAWZxv7Z6ebHxvlOkJrTUrK6ssL64yXS4y06gC8PbFJf6091VCF1r9IdUkZqXVphAGTAQu7fNLjHJNvV5GCgEWVlbaKGN/A+AcO3Mmba4pPxoVg0O23WOqUuKWm2cQ1rB0pcMzLx2k3R/S7fdpt9vEUUhvoLlpdoZd992BoyR7Dr9B2XFIkohiGJIbjUix7yxcOPhugzw7d/HSbeua7Y3N+sOVuEinN+TIm+fY8/ox4mLI5vVTzK4Zw6J47JM7mKxX2HHnZlY6PaSUTJUjLiy3KVeKOMrh8tKqzftm15M/fub4uxCAqBgdqCfh3YHnzvYGKZP1Mttu3MiaRsIv9+7n4jst5haXGWYZ4+WEw6fPEfoes80GLx09TT/XVMox3UFqgoyHvv6dn+x5z8n4mZ13BdNj1T/cfMPaB+pJjO+5OApanZTldg8lBEHgMkhHbGg2WF7t8udjZ7jQ6bK2OU4lKuqx0Hvksad++sf/mCfX48Rb87nner++0uqtHQ7TrVIKhFCU4gL1akwx8MFYRvmIE2fn2Xf8LAMB9XKJYhCemkiq277y5I+OvO9t5XMPP3hvELnf9si3N2tlFlbatLMR+lpujhIgJKFyL5SC4PHpqPLs1374dPaBVqLr8dUvfrp8fuHi7CjPir7n+AXfRymVAdbHaf1s956//T+NfwEVfME3NkEQxAAAAABJRU5ErkJggg==';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=MarketHelper.createWindow(); title="MarketHelper" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };





    $(document).ready(function () {
        try {
            MarketHelper.createMenuIcon();
        } catch (e) {
            console.log("exception occured");
        }
    });


})();















// ToDo
/*
- Change names in the code
- End buying page
- More Pattern reading
- Set reloading time in settings (Default value is 900ms)

*/