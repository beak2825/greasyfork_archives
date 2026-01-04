// ==UserScript==
// @name         Steam Wishlist Copy
// @namespace    https://coding.net/u/sffxzzp
// @version      0.10
// @description  Copy specified user's wishlist to your wishlist.
// @author       sffxzzp
// @match        *://store.steampowered.com/wishlist/*
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/368597/Steam%20Wishlist%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/368597/Steam%20Wishlist%20Copy.meta.js
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.createElement = function (data) {
            var node;
            if (data.node) {
                node = document.createElement(data.node);
                if (data.content) {
                    this.setElement({node: node, content: data.content});
                }
                if (data.html) {
                    node.innerHTML = data.html;
                }
            }
            return node;
        };
        util.setElement = function (data) {
            if (data.node) {
                for (let name in data.content) {
                    data.node.setAttribute(name, data.content[name]);
                }
                if (data.html!=undefined) {
                    data.node.innerHTML = data.html;
                }
            }
        };
        return util;
    })();
    var swcopy = (function () {
        function swcopy() {};
        swcopy.prototype.addToWishlist = function (appid) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("post", 'https://store.steampowered.com/api/addtowishlist', true);
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                xhr.responseType = "";
                xhr.timeout = 3e4;
                xhr.onload = function(ev) {
                    var evt = ev.target;
                    resolve(evt.response);
                };
                xhr.onerror = reject;
                xhr.ontimeout = reject;
                xhr.send(`sessionid=${unsafeWindow.g_sessionID}&appid=${appid}`);
            });
        };
        swcopy.prototype.run = function () {
            var _this = this;
            var searchBar = document.getElementsByClassName('controls')[0];
            var swcButton = util.createElement({node: "div", content: {class: "filter_tab settings_tab"}, html: "添加全部到愿望单"});
            swcButton.onclick = async function () {
                if (confirm("确定全部添加到愿望单？\n可能会有不可预料的后果。\n确定后请耐心等待。\n完成后会有弹窗提示。")) {
                    for (var i=0;i<unsafeWindow.g_rgWishlistData.length;i++) {
                        await _this.addToWishlist(unsafeWindow.g_rgWishlistData[i].appid);
                    }
                    alert("导入完成！");
                }
            }
            searchBar.appendChild(swcButton);
        };
        return swcopy
    })();
    (new swcopy()).run();
})();