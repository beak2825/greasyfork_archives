// ==UserScript==
// @name         newFinancingRequest
// @namespace    refreshyckadmin
// @version      1.0
// @description  每五分钟定时刷新四要素审核订单请求, 并生成alert窗口
// @author       Jack Li
// @include      http://b2badmin01.tst.yinchengku.com/*
// @include      http://b2badmin01.uat.yinchengku.com/*
// @include      http://admin.yinchengku.com/*
// @exclude      http://*.yinchengku.com/admin
// @exclude      http://*.yinchengku.com/admin/logout
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33521/newFinancingRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/33521/newFinancingRequest.meta.js
// ==/UserScript==
Array.prototype.uniquemill = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var NotmillionListWindow = {
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
        notifyEle.setAttribute("onclick", "window.location.href=\'" + millionListData.url + "\'");

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

var millionListData = {
    url: "/raiseOrder/millionList",
    //url:"/quote/querylist",
    respContent: undefined,
    totalNoReplyJsonData: [],
    version: 0,
    fetchResponse: function(url, cb) {
        $.get(url, function(data){
            this.data = data;
            cb(this.data);
        });
    },
    notExist: function(key) {
        var exist = false;
        for (var i = 0; i < this.origJsonData.length; i++) {
            var item = this.origJsonData[i];
            if (item === key) {
                return false;
            }
        }
        return true;
    },
    hasNoReply: function(status) {
        return !status;
    },
    getQuoteStatus(domEle) {
        var statusStr = domEle.getElementsByTagName('th')[12].textContent.trim();
        if (statusStr === "已审核") {
            return true;
        }
        return false;
    },
    json: function(url, cb) {
        var that = this;
        this.fetchResponse(url, function(content) {
            var diffNoReplyJsonData = [];
            var parser = new DOMParser();
            var doc = parser.parseFromString(content, "text/html");
            var iter = document.evaluate( '//tbody/tr', doc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );

            var item = iter.iterateNext();
            while (item) {
                var id = item.getAttribute('id');
                if (!!id && that.hasNoReply(that.getQuoteStatus(item))) {
                    diffNoReplyJsonData.push(id);
                }
                item = iter.iterateNext();
            }
            if (diffNoReplyJsonData.length > 0) {
                this.totalNoReplyJsonData = that.totalNoReplyJsonData.concat(diffNoReplyJsonData).uniquemill();
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
            var newNoReplyJsonData = data.filter(key => !millionListData.totalNoReplyJsonData.includes(key));
            millionListData.totalNoReplyJsonData = data;
            cb(data, newNoReplyJsonData);
        }
        for (; curPage <= page; curPage++) {
            var url = this.url;
            if (curPage > 1) {
                url = this.url + "?page=" + curPage;
            }
            this.json(url, function(noReplyJsonDataByPage) {
                totalNoReplyJsonData = totalNoReplyJsonData.concat(noReplyJsonDataByPage).uniquemill();
                successfulCallback(totalNoReplyJsonData);
            });
        }
    }
};

Array.prototype.uniquefin = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


var NotfinancingWindow = {
    domElement: undefined,
    title: "Notfinancing",
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
        var notfinEle = document.createElement("div");
        notfinEle.id = "Notfinancing";
        notfinEle.style = "display: none;cursor: pointer;position: fixed;right: 0.5em;bottom: 6em;overflow: hidden;width: 260px;color: #ddd;border-radius: 5px;background: rgba(35, 40, 45, 0.9);box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);animation: bottom50 300ms;";
        notfinEle.setAttribute("onclick", "window.location.href=\'" + finData.url + "\'");
        var titleEle = document.createElement("div");
        titleEle.style = "   text-align: center;padding: 3px 10px;font-weight: 600;border-bottom: 1px solid #898C7B;";
        titleEle.innerHTML = "<span class=\"icon\"></span>" + this.title;
        notfinEle.appendChild(titleEle);

        var bodyEle = document.createElement("div");
        bodyEle.style = " font-size: 13px;padding: 8px 12px;word-break: break-all;transition: all .3s ease-in-out";
        var msgEle = document.createElement("span");
        msgEle.style = "animation: bottom20 500ms;";
        msgEle.textContent = this.content;
        bodyEle.appendChild(msgEle);

        notfinEle.appendChild(bodyEle);

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(notfinEle);
        this.domElement = notfinEle;

        return this;
    },
    update: function(title, content) {
        var parser = new DOMParser();
        var titleIter = document.evaluate( '//*[@id="Notfinancing"]/div[1]', this.domElement, null, XPathResult.ANY_TYPE, null );
        var titleNode = titleIter.iterateNext();
        if (titleNode) {
            titleNode.textContent = title || this.title;
        }
        var contentIter = document.evaluate( '//*[@id="Notfinancing"]/div[2]/span', this.domElement, null, XPathResult.ANY_TYPE, null );
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
            console.debug("Update Notfinancing wth title: " + title + ", content: " + content);
            this.update(title, content);
        } else {
            console.debug("Create Notfinancing wth title: " + title + ", content: " + content);
            this.create(title, content);
        }
        if (!this.domElement) {
            console.warn("Cannot display Notfinancing due to no node");
            console.debug(this.domElement);
            return;
        }
        this.domElement.style.display = "block";
    },
    hide: function() {
        this.domElement.style.display = "none";
    }
};

var finData = {
    url: "/raiseOrder/list",
    respContent: undefined,
    totalNoReplyJsonData: [],
    version: 0,
    fetchResponse: function(url, cb) {
        $.get(url, function(data){
            this.data = data;
            cb(this.data);
        });
    },
    notExist: function(key) {
        var exist = false;
        for (var i = 0; i < this.origJsonData.length; i++) {
            var item = this.origJsonData[i];
            if (item === key) {
                return false;
            }
        }
        return true;
    },
    hasNoReply: function(status) {
        return !status;
    },
    getQuoteStatus(domEle) {
        var statusStr = domEle.getElementsByTagName('th')[12].textContent.trim();
        if (statusStr === "已审核") {
            return true;
        }
        return false;
    },
    json: function(url, cbfin) {
        var that = this;
        this.fetchResponse(url, function(content) {
            var diffNoReplyJsonData = [];
            var parser = new DOMParser();
            var docfin = parser.parseFromString(content, "text/html");
            var iter = document.evaluate( '//tbody/tr', docfin, null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );
            var item = iter.iterateNext();
            while (item) {
                var id = item.getAttribute('id');
                if (!!id && that.hasNoReply(that.getQuoteStatus(item))) {
                    diffNoReplyJsonData.push(id);
                }
                item = iter.iterateNext();
            }
            if (diffNoReplyJsonData.length > 0) {
                this.totalNoReplyJsonData = that.totalNoReplyJsonData.concat(diffNoReplyJsonData).uniquefin();
            }
            cbfin(diffNoReplyJsonData);
        });
    },
    fetch5PagesJson(cbfin) {
        var page = 5;
        var curPage = 1;
        var totalNoReplyJsonData = [];
        var count = 1;
        function successfulCallback(data) {
            if (count < page) {
                count++;
                return;
            }
            var newNoReplyJsonData = data.filter(key => !finData.totalNoReplyJsonData.includes(key));
            finData.totalNoReplyJsonData = data;
            cbfin(data, newNoReplyJsonData);
        }
        for (; curPage <= page; curPage++) {
            var url = this.url;
            if (curPage > 1) {
                url = this.url + "?page=" + curPage;
            }
            this.json(url, function(noReplyJsonDataByPage) {
                totalNoReplyJsonData = totalNoReplyJsonData.concat(noReplyJsonDataByPage).uniquefin();
                successfulCallback(totalNoReplyJsonData);
            });
        }
    }
};


var Sound = {
    srcUrl: "http://img.yinchengku.com/vsftp/audio/microwave_oven.mp3",
    audioElement: undefined,
    finish: false,
    init: function() {
        this.finish=false;
        audioElement=document.createElement("audio");
        audioElement.id = "notify-sound";

        srcElement = document.createElement("source");
        srcElement.setAttribute("src", this.srcUrl);
        srcElement.setAttribute("type", "audio/mp3");

        audioElement.appendChild(srcElement);
        document.body.appendChild(audioElement);

        this.audioElement = audioElement;
    },
    start: function() {
        this.audioElement.play();
    },
    play: function() {
        if(!this.audioElement) {
            this.init();
        }
        this.start();
        console.log("声音播放~~~~~");
    },
    remove: function() {
        document.body.removeChild(this.audioElement);
        return this;
    }
};

var Storage = {
    storeTimeWindow: function(timestamep) {
        if(window.localStorage){
            window.localStorage.setItem('finRequest.lastTimestamp', timestamep);
        }
    },
    getCachedTimeWindow: function() {
        if(window.localStorage){
            var timestamp = window.localStorage.getItem('finRequest.lastTimestamp');
            if (!timestamp) {
                return undefined;
            }
            return window.localStorage.getItem('finRequest.lastTimestamp');
        } else {
            return undefined;
        }
    }
};


(function(docfins){
    'use strict';
    docfins.config = {
        fetchTimeWindow: 300000,
        checkTimeWindow: 5000
    };
    docfins.cache = {
        lastFetch: undefined
    };
    function withInSpecifyTimewindow() {
        var lastTimestamp = Storage.getCachedTimeWindow();
        if (!lastTimestamp) {
            return false;
        }

        var curDate = new Date();
        if (curDate.getTime() - lastTimestamp < docfins.config.fetchTimeWindow) {
            return true;
        }
        return false;
    }
    function newRoundNotify(cb) {
        if (docfins.st) {
            clearTimeout(docfins.st);
        }
        docfins.st = setTimeout(cb, docfins.config.checkTimeWindow);
    }
    function notifyWithNewOCRData() {
        if (withInSpecifyTimewindow() ) {
            console.log("开始更新"+withInSpecifyTimewindow());
            return newRoundNotify(notifyWithNewOCRData);
        }
        console.log("Start to fetch  Data of 5 page");
        Storage.storeTimeWindow(new Date().getTime());
        millionListData.fetch5PagesJson(function(totalNoReplyList, newNoReplyList) {
            if (!totalNoReplyList || totalNoReplyList.length === 0) {
                console.log("没有[新]的四要素百万定单");
            } else {
                //console.log(">>>>> Total No Reply List <<<<<<");
                //console.log(totalNoReplyList);
                NotmillionListWindow.show("[新] 四要素百万", "您有(" + totalNoReplyList.length + ")条未审核(" + (newNoReplyList.length || 0) + "条新增)四要素百万信息, 点击查看");
                Sound.play();
            }
        });
        finData.fetch5PagesJson(function(totalNoReplyListfin, newNoReplyListfin) {
            if (!totalNoReplyListfin || totalNoReplyListfin.length === 0) {
                console.log("没有[新]的融资定单");
            } else {
                //console.log(">>>>> Total No Replyfin List <<<<<<");
                //console.log(totalNoReplyListfin);
                NotfinancingWindow.show("[新] 融资定单", "您有(" + totalNoReplyListfin.length + ")条未融资(" + (newNoReplyListfin.length || 0) + "条新增)融资定单信息, 点击查看");
                Sound.play();
            }

        });
        newRoundNotify(notifyWithNewOCRData);
    }
    notifyWithNewOCRData();
})(document);
