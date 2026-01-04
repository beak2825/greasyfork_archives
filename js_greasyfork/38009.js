// ==UserScript==
// @name        RefreshBill2Money
// @namespace   yck
// @version      1.0.4
// @description  定时刷新融资订单订单请求, 并以通知窗口形式告知
// @author       Jack Li
// @include       http://payment.yinchengku.com/*
// @include       http://139.219.230.146:9001/*
// @include       http://payment01.tst.yinchengku.com:9001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38009/RefreshBill2Money.user.js
// @updateURL https://update.greasyfork.org/scripts/38009/RefreshBill2Money.meta.js
// ==/UserScript==

(function(doc) {
    'use strict';

    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number]  : match
                ;
            });
        };
    }

    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };


    var Config = {
        soundUrl: "http://img.yinchengku.com/vsftp/audio/microwave_oven.mp3",
        storageKey: "RequestBill2Money.lastTimestamp",
        url: "/PayConsole/merchantElecBillFinanceRecord",
        pageUrl: "/home/merchantETrading",
        notify: {
            title: "[新] 电票融资订单",
            content: "您有({0})条未融资订单({1}条新增), 点击查看"
        },
        timeWindow: {
            fetchTimeWindow: 15000,
            checkTimeWindow: 1000
        }
    };

    var NotifyWindow = {
        domElement: undefined,
        title: "Notify Window",
        content: "",
        isRunWithIFrame: function() {
            return window.frameElement && window.frameElement.nodeName == "IFRAME";
        },
        create: function(title, content) {
            if (this.isRunWithIFrame()) {
                return;
            }
            this.title = title;
            this.content = content;
            var notifyEle = document.createElement("div");
            notifyEle.id = "notification";
            notifyEle.style = "display: none;cursor: pointer;position: fixed;right: .5em;bottom: .5em;overflow: hidden;width: 260px;color: #ddd;border-radius: 5px;background: rgba(35, 40, 45, 0.9);box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);animation: bottom50 300ms;";
            notifyEle.setAttribute("onclick", "window.location.href=\'" + Config.pageUrl + "\'");

            var titleEle = document.createElement("div");
            titleEle.style = "   text-align: center;padding: 3px 10px;font-weight: 600;border-bottom: 1px solid #898C7B;";
            titleEle.innerHTML = "<span class=\"icon\"></span>" + this.title;
            notifyEle.appendChild(titleEle);

            var bodyEle = document.createElement("div");
            bodyEle.style = " font-size: 13px;padding: 8px 12px;word-break: break-all;transition: all .3s ease-in-out";
            var msgEle = document.createElement("span");
            msgEle.style = "animation: bottom20 500ms;";
            msgEle.textContent = this.content;
            bodyEle.appendChild(msgEle);

            notifyEle.appendChild(bodyEle);

            var body = document.getElementsByTagName("body")[0];
            body.appendChild(notifyEle);
            this.domElement = notifyEle;

            return this;
        },
        update: function(title, content) {
            var parser = new DOMParser();
            var titleIter = document.evaluate( '//*[@id="notification"]/div[1]', this.domElement, null, XPathResult.ANY_TYPE, null );
            var titleNode = titleIter.iterateNext();
            if (titleNode) {
                titleNode.textContent = title || this.title;
            }

            var contentIter = document.evaluate( '//*[@id="notification"]/div[2]/span', this.domElement, null, XPathResult.ANY_TYPE, null );
            var contentNode = contentIter.iterateNext();
            if (contentNode) {
                contentNode.textContent = content || this.content;
            }
        },
        isVisible: function() {
            if (!this.domElement) {
                return false;
            }
            if (this.domElement.style && this.domElement.style.display === "none") {
                return false;
            }
            return true;
        },
        remove: function() {
            if (!!this.domElement) {
                this.domElement.parentNode.removeChild(this.domElement);
            }
        },
        show: function(title, content) {
            if (this.isVisible()) {
                console.debug("Update Notification wth title: " + title + ", content: " + content);
                this.update(title, content);
            } else {
                console.debug("Create Notification wth title: " + title + ", content: " + content);
                this.create(title, content);
            }
            if (!this.domElement) {
                console.warn("Cannot display notification due to no node");
                console.debug(this.domElement);
                return;
            }
            this.domElement.style.display = "block";
        },
        hide: function() {
            this.domElement.style.display = "none";
        }
    };

    var DynData = {
        url: Config.url,
        totalNoReplyJsonData: [],
        version: 0,
        token: undefined,
        fetchResponse: function(url, cb) {
            var userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
            if (userInfo && userInfo.token) {
                this.token = userInfo.token;
            } else {
                cb([]);
                return;
            }

            Zepto.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                timeout: 300,
                headers: {token: this.token},
                success: function(data){
                    cb(data);
                },
                error: function(xhr, type){
                    alert('Ajax error!');
                }
            });
        },
        json: function(url, cb) {
            var that = this;
            this.fetchResponse(url, function(data) {
                var diffNoReplyJsonData = [];
                if (!data || data.totalCount === 0)
                    return;
                for (var item in data.content) {
                    var obj = data.content[item];
                    if (obj.status === "WAITTOPAY") {
                        diffNoReplyJsonData.push(item);
                    }
                }

                cb(diffNoReplyJsonData);
            });
        },
        fetch5PagesJson(cb) {
            var page = 5;
            var curPage = 1;
            var totalNoReplyJsonData = [];
            var count = 1;
            function successfulCallback(data) {
                if (count < page) {
                    count++;
                    return;
                }
                var newNoReplyJsonData = data.filter(key => !DynData.totalNoReplyJsonData.includes(key));
                DynData.totalNoReplyJsonData = data;
                cb(data, newNoReplyJsonData);
            }
            for (; curPage <= page; curPage++) {
                var url = this.url;
                if (curPage >= 1) {
                    url = this.url + "?page=" + curPage + "&perPage=10";
                }
                this.json(url, function(noReplyJsonDataByPage) {
                    totalNoReplyJsonData = totalNoReplyJsonData.concat(noReplyJsonDataByPage).unique();
                    successfulCallback(totalNoReplyJsonData);
                });
            }
        }
    };

    var Sound = {
        srcUrl: Config.soundUrl,
        audioElement: undefined,
        finish: false,
        init: function() {
            this.finish=false;
            var audioElement=document.createElement("audio");
            audioElement.id = "notify-sound";

            audioElement.setAttribute("src", this.srcUrl);
            audioElement.setAttribute("type", "audio/mp3");

            this.audioElement = audioElement;

            document.body.appendChild(this.audioElement);
        },
        start: function() {
            this.audioElement.play();
        },
        play: function() {
            if(!this.audioElement) {
                this.init();
            }
            this.start();
        },
        remove: function() {
            document.body.removeChild(this.audioElement);
            return this;
        }
    };

    var Storage = {
        storeTimeWindow: function(timestamep) {
            if(window.localStorage){
                window.localStorage.setItem(Config.storageKey, timestamep);
            }
        },
        getCachedTimeWindow: function() {
            if(window.localStorage){
                var timestamp = window.localStorage.getItem(Config.storageKey);
                if (!timestamp) {
                    return undefined;
                }
                return window.localStorage.getItem(Config.storageKey);
            } else {
                return undefined;
            }
        }
    };

    doc.config = Config.timeWindow;
    doc.cache = {lastFetch: undefined};

    function withInSpecifyTimewindow() {
        var lastTimestamp = Storage.getCachedTimeWindow();
        if (!lastTimestamp) {
            return false;
        }

        var curDate = new Date();
        if (curDate.getTime() - lastTimestamp < doc.config.fetchTimeWindow) {
            return true;
        }
        return false;
    }
    function newRoundNotify(cb) {
        if (doc.st) {
            clearTimeout(doc.st);
        }
        doc.st = setTimeout(cb, doc.config.checkTimeWindow);
    }
    function notifyWithNewData() {
        if (!Sound.audioElement) {
            Sound.init();
        }
        if (withInSpecifyTimewindow() ) {
            return newRoundNotify(notifyWithNewData);
        }
        console.debug("Start to fetch Data of 5 page");
        DynData.fetch5PagesJson(function(totalNoReplyList, newNoReplyList) {
            Storage.storeTimeWindow(new Date().getTime());

            if (!totalNoReplyList || totalNoReplyList.length === 0) {
                console.debug("No Data Found");
            } else {
                console.debug(">>>>> Total No Reply List <<<<<<");
                console.debug(totalNoReplyList);
                let title = Config.notify.title;
                let content = Config.notify.content.format(totalNoReplyList.length, (newNoReplyList.length || 0));
                NotifyWindow.show(title, content);
                Sound.play();
            }
            newRoundNotify(notifyWithNewData);
        });
    }

    function createElement(tag, attr) {
        var elem = doc.createElement(tag);
        for (var obj in attr) {
            elem.setAttribute(obj, attr[obj]);
        }
        return elem;
    }
    function loadlib(url, cb) {
        var attr = {type: "text/javascript", src: url};
        var body = doc.getElementsByTagName("body")[0];
        body.appendChild(createElement("script", attr));
        setTimeout(cb, 1000);
    }

    loadlib("https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js", notifyWithNewData);
})(document);
