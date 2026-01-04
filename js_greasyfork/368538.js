// ==UserScript==
// @name         Steam Wishlist Checker
// @namespace    https://coding.net/u/sffxzzp
// @version      0.05
// @description  Check specified users that add the game to wishlist.
// @author       sffxzzp
// @match        *://steamcommunity.com/*/friendsthatplay/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      store.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/368538/Steam%20Wishlist%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/368538/Steam%20Wishlist%20Checker.meta.js
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.xhr = function (xhrData) {
            return new Promise(function(resolve, reject) {
                if (!xhrData.xhr) {
                    GM_xmlhttpRequest({
                        method: xhrData.method || "get",
                        url: xhrData.url,
                        responseType: xhrData.type || "",
                        timeout: 3e4,
                        onload: function onload(res) {
                            return resolve({ response: res, body: res.response });
                        },
                        onerror: reject,
                        ontimeout: reject
                    });
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open(
                        xhrData.method || "get",
                        xhrData.url,
                        true
                    );
                    if (xhrData.method === "POST") {
                        xhr.setRequestHeader(
                            "content-type",
                            "application/x-www-form-urlencoded; charset=utf-8"
                        );
                    }
                    if (xhrData.cookie) xhr.withCredentials = true;
                    xhr.responseType = xhrData.responseType || "";
                    xhr.timeout = 3e4;
                    xhr.onload = function(ev) {
                        var evt = ev.target;
                        resolve({ response: evt, body: evt.response });
                    };
                    xhr.onerror = reject;
                    xhr.ontimeout = reject;
                    xhr.send(xhrData.data);
                }
            });
        };
        util.wrun = function (data) {
            setTimeout(data.run||null, data.ms);
        };
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
        util.getElement = function (data) {};
        return util;
    })();
    var swc = (function () {
        function swc() {};
        swc.prototype.getUsers = function () {
            var sAccounts = GM_getValue("swcAccounts");
            if (sAccounts) {
                sAccounts = JSON.parse(sAccounts);
            }
            else {
                sAccounts = [];
            }
            return sAccounts;
        };
        swc.prototype.get32id = function (steam64id) {
            var tmp = [], root = ["76561","197960","265728"];
            tmp[0] = steam64id.substr(0,5);
            tmp[1] = steam64id.substr(5,6);
            tmp[2] = steam64id.substr(11,6);
            return (tmp[0]-root[0])*1000000000000+(tmp[1]-root[1])*1000000+(tmp[2]-root[2]);
        };
        swc.prototype.getAppid = function () {
            return parseInt(/friendsthatplay\/(\d*)/ig.exec(location.href)[1]);
        };
        swc.prototype.inArray = function (array, item) {
            if (array.indexOf(item)>-1) {
                return true;
            }
            else {
                return false;
            }
        };
        swc.prototype.getXmlNode = function (xml, nodeName) {
            return xml.getElementsByTagName(nodeName)[0].textContent;
        };
        swc.prototype.addToPage = function (user) {
            var _this = this;
            util.xhr({
                url: "https://steamcommunity.com/profiles/"+user+"?xml=1",
                type: "xml"
            }).then(function (result) {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(result.body, "text/xml");
                let avatarMedium = _this.getXmlNode(xmlDoc, "avatarMedium");
                let steamID = _this.getXmlNode(xmlDoc, "steamID");
                let onlineState = _this.getXmlNode(xmlDoc, "onlineState");
                let userblock = util.createElement({node: "div", content: {class: "friendBlock persona "+onlineState, "data-miniprofile": _this.get32id(user)}, html: '<a class="friendBlockLinkOverlay" href="https://steamcommunity.com/profiles/'+user+'"></a><div class="playerAvatar '+onlineState+'"><img src="'+avatarMedium+'"></div><div class="friendBlockContent">'+steamID+'<br><span class="friendSmallText"><br><a class="whiteLink friendBlockInnerLink" href="https://steamcommunity.com/profiles/'+user+'/wishlist">查看愿望单</a></span></div>'});
                document.getElementById("swcbody").appendChild(userblock);
            });
        };
        swc.prototype.addView = function () {
            var mList = document.getElementById("memberList");
            let header = document.getElementsByClassName("mainSectionHeader");
            header = header[header.length-1].cloneNode(true);
            header.innerHTML += ' ** ';
            let settings = util.createElement({node: "a", content: {href: "javascript:void(0);"}, html:"设置"});
            settings.onclick = function () {
                var sAccounts = GM_getValue("swcAccounts");
                if (sAccounts) {
                    sAccounts = JSON.parse(sAccounts).join(',');
                }
                else {
                    sAccounts = "";
                }
                console.log(sAccounts);
                var input = prompt("请输入要检查的Steam 64位ID\n按英文逗号分割", sAccounts);
                if (input) {
                    var accounts = input.split(',');
                    GM_setValue("swcAccounts", JSON.stringify(accounts));
                }
            }
            header.appendChild(settings);
            let clear = util.createElement({node: "a", content: {style: "padding-left: 20px;", href: "javascript:void(0);"}, html: "清空"});
            clear.onclick = function () {
                if (confirm("确定要清空么？")) {
                    GM_deleteValue("swcAccounts");
                    alert("清空完毕！");
                }
            };
            header.appendChild(clear);
            mList.appendChild(header);
            let body = util.createElement({node: "div", content: {id: "swcbody", class: "profile_friends responsive_friendblocks"}});
            mList.appendChild(body);
        };
        swc.prototype.run = function () {
            var _this = this;
            _this.addView();
            let users = _this.getUsers();
            let appid = _this.getAppid();
            for (let i=0;i<users.length;i++) {
                util.xhr({
                    url: "https://store.steampowered.com/wishlist/profiles/"+users[i]
                }).then(function (result) {
                    let userWishlist = result;
                    let wishlistData = /g_rgWishlistData = (.*?);/ig.exec(result.body)[1];
                    wishlistData = JSON.parse(wishlistData);
                    for (let j=0;j<wishlistData.length;j++) {
                        if (wishlistData[j].appid == appid) {
                            _this.addToPage(users[i]);
                            break;
                        }
                    }
                });
            }
        };
        return swc;
    })();
    var program = new swc();
    program.run();
})();