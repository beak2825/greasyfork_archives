// ==UserScript==
// @name         RefreshOCRRequest
// @namespace   refreshyckadmin
// @version      1.0.1
// @description  定时刷新人工OCR订单请求, 并生成alert窗口
// @author       Jack Li
// @include        http://b2badmin01.tst.yinchengku.com/*
// @include        http://b2badmin01.uat.yinchengku.com/*
// @include        http://admin.yinchengku.com/*
// @exclude       http://*.yinchengku.com/admin
// @exclude       http://*.yinchengku.com/admin/logout
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31604/RefreshOCRRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/31604/RefreshOCRRequest.meta.js
// ==/UserScript==

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
    notifyEle.setAttribute("onclick", "window.location.href=\'" + OCRDynData.url + "\'");
    
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

var OCRDynData = {
  url: "/quote/querylist",
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
        var statusStr = domEle.getElementsByTagName('td')[6].textContent.trim();
        if (statusStr === "已报价") {
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
                var id = item.getAttribute('ids');
                if (!!id && that.hasNoReply(that.getQuoteStatus(item))) {
                    diffNoReplyJsonData.push(id);
                }
                item = iter.iterateNext();
            }
            if (diffNoReplyJsonData.length > 0) {
                this.totalNoReplyJsonData = that.totalNoReplyJsonData.concat(diffNoReplyJsonData).unique();
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
            var newNoReplyJsonData = data.filter(key => !OCRDynData.totalNoReplyJsonData.includes(key));
            OCRDynData.totalNoReplyJsonData = data;
            cb(data, newNoReplyJsonData);
        }
        for (; curPage <= page; curPage++) {
            var url = this.url;
            if (curPage > 1) {
                url = this.url + "?page=" + curPage;
            }
            this.json(url, function(noReplyJsonDataByPage) {
                totalNoReplyJsonData = totalNoReplyJsonData.concat(noReplyJsonDataByPage).unique();
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
    },
    remove: function() {
        document.body.removeChild(this.audioElement);
        return this;
    }
};

var Storage = {
    storeTimeWindow: function(timestamep) {
        if(window.localStorage){
            window.localStorage.setItem('RequestOCRRequest.lastTimestamp', timestamep);
        }
    },
    getCachedTimeWindow: function() {
        if(window.localStorage){
            var timestamp = window.localStorage.getItem('RequestOCRRequest.lastTimestamp');
            if (!timestamp) {
                return undefined;
            }
            return window.localStorage.getItem('RequestOCRRequest.lastTimestamp');
        } else {
            return undefined;
        }
    }
};

(function(doc) {
  'use strict';
    doc.config = {
        fetchTimeWindow: 15000,
        checkTimeWindow: 5000
    };
    doc.cache = {
        lastFetch: undefined
    };
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
    function notifyWithNewOCRData() {
        if (withInSpecifyTimewindow() ) {
            return newRoundNotify(notifyWithNewOCRData);
        }
        console.debug("Start to fetch OCR No-Reply Data of 5 page");
        OCRDynData.fetch5PagesJson(function(totalNoReplyList, newNoReplyList) {
            Storage.storeTimeWindow(new Date().getTime());

            if (!totalNoReplyList || totalNoReplyList.length === 0) {
                console.debug("No Data Found");
            } else {
                console.debug(">>>>> Total No Reply List <<<<<<");
                console.debug(totalNoReplyList);
                NotifyWindow.show("[新] OCR 寻价", "您有(" + totalNoReplyList.length + ")条未报价(" + (newNoReplyList.length || 0) + "条新增)OCR信息, 点击查看");
                Sound.play();
            }
            newRoundNotify(notifyWithNewOCRData);
        });
    }
    notifyWithNewOCRData();
})(document);
