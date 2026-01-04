// ==UserScript==
// @name         darkemoon
// @match        https://www.drakemoon.com/*
// @grant        none
// @version         0.6
// @description	 drakemoon自动开箱
// @namespace         darkemoon
// @downloadURL https://update.greasyfork.org/scripts/34768/darkemoon.user.js
// @updateURL https://update.greasyfork.org/scripts/34768/darkemoon.meta.js
// ==/UserScript==
(function() {
    if ( !! document.getBoxObjectFor || window.mozInnerScreenX != null) {
        HTMLElement.prototype.__defineSetter__("outerText",
        function(sText) {
            var parsedText = document.createTextNode(sText);
            this.parentNode.replaceChild(parsedText, this);
            return parsedText;
        });
        HTMLElement.prototype.__defineGetter__("outerText",
        function() {
            var r = this.ownerDocument.createRange();
            r.selectNodeContents(this);
            return r.toString();
        });
    }
    var count = 0;
    var interval = 5100;
    var need_refresh = true;
    var refresh_count = 10;
    var openning = 0;
    var timerVar = setInterval(function() {
        DoMeEverySecond();
    },
    interval);

    function DoMeEverySecond() {

        var x = document.getElementsByClassName("menu-item login");
        if (x[0]) {
            x[0].click();
        } else {

            if (!window.location.href.match("https://www.drakemoon.com/get-free")) {
                window.location.href = "https://www.drakemoon.com/get-free";
            }

            x = document.getElementsByClassName("borderless");
            if (x[0]) {
                x[0].click();
            }
        }

        if (need_refresh && ++count > refresh_count) {
            var token = $('meta[name="csrf_token"]').attr("content");
            var diamonds = parseInt(document.getElementsByClassName("diamonds")[1].outerText);
            if (diamonds >= 15000) {

                while  (true) {
                    if (diamonds < 15000) {
                        break;
                    }
                    /*
                    case_id
                    1=Marble Chest
                    2=Royal Chest
                    3=Blood Chest
                    4=Emerald Chest
                    */
                    $.ajax({
                        method: "GET",
                        url: "/api/drake-clash/open",
                        async: false,
                        data: {
                            case_id: 3,
                            _token: token
                        }
                    }).success(function(e) {
                        if (e.winInfo.type == "chest") {
                            var winid = e.winId + "";
                            $.ajax({
                                method: "POST",
                                url: "/api/drake-clash/sell",
                                async: false,
                                data: {
                                    winning: winid.split(),
                                    _token: token
                                }
                            })
                        }

                    }).error(function(e) {
                        helpers.showError(e.responseJSON.message)

                    }).success(function(e) {
                        diamonds = e.diamonds;
                    });

                }

            }
            count = 0;
            window.location.reload();
        }
    }

})();