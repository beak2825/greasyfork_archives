// ==UserScript==
// @name       hikakin remover
// @namespace  http://kenmmn.5gbfree.com/
// @include     /^https?:\/\/(?:[\w\-]+\.)*youtube\.com\//
// @version     1.1
// @run-at      document-start
// @grant       none
// @description youtube hidden user
// @downloadURL https://update.greasyfork.org/scripts/5341/hikakin%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/5341/hikakin%20remover.meta.js
// ==/UserScript==

// date 2014-09-28


function Blocker(userSpecified) {
    this.makeSelector = function() {
        var selectors = [
            "li.channels-browse-content-list-item",
            "#pl-video-list .pl-video", // Popular in Japan
            "ol.item-section > li", // search
            ".video-list-item", 
            "li.yt-shelf-grid-item",
            ".lohp-medium-shelf", // TOP
            ".lohp-large-shelf-container", // TOP
            ".branded-page-related-channels-item",
            "#guide li.guide-channel",
            ".branded-page-module-title"
        ];
        return selectors.join(", ");
    };
    this.user_specified = userSpecified;
    this.confirmHidden = 
        "mozGetUserMedia" in navigator || "undefined" !== typeof InstallTrigger
        ? function(e) { // Firefox
            var v = window.getComputedStyle(e, "");
            return v.MozBinding.search(/\Wabout:abp-elemhidehit\W/) > -1;
        }
        : function(e) { // Chrome
            var v = window.getComputedStyle(e, "");
            return v.display === "none";
        };
    this.elem_selector = this.makeSelector();
    if(userSpecified){
        this.userInfo = {
            ytid: null,
            Name: null,
            count: 0
        };
    }
}

Blocker.prototype = {
    ab_attr: "adblock-ytid",
    setYtid: function(e, ytid) {
        e.setAttribute(this.ab_attr, ytid);
        if(this.confirmHidden(e)){
            e.remove();
        }
    },
    observed: function(e) {
        var i, ytnode, ytid, elems = e.querySelectorAll(this.elem_selector);
        
        for (i = 0; i < elems.length; i++) {
            if (elems[i].hasAttribute(this.ab_attr)) {
                continue;
            }
            ytnode = elems[i].querySelector('[data-ytid]');
            if (ytnode) {
                ytid = ytnode.getAttribute('data-ytid');
                this.setYtid(elems[i], ytid);
            } 
            else {
                var href_elems = elems[i].querySelectorAll('[href]');
                for (var j = 0; j < href_elems.length; j++){
                    var href = href_elems[j].getAttribute('href');
                    var m = href.match(/\/channel\/([\w\-]+)/);
                    if (m) {
                        var ytid = m[1];
                        this.setYtid(elems[i], ytid);
                        break;
                    }
                }
            }
        }

        if(this.user_specified && this.userInfo.count < 2){
            if(this.userInfo.ytid === null){
                if(!this.findUserYtid(e)){
                    return;
                }
            }
            // ytid has found.
            if(this.userInfo.Name === null){
                this.findUserName(e);
            }
            this.setYtid4User(e);
        }
    },
    setYtid4User: function(e){
        var elems = document.querySelectorAll('#content, #player');
        for (var i = 0; i < elems.length; i++) {
            this.setYtid(elems[i], this.userInfo.ytid);
            this.userInfo.count++;
        }
    },
    findUserYtid: function(e){
        var meta = e.querySelector('meta[itemprop=channelId][content]');
        if (meta) {
            this.userInfo.ytid = meta.getAttribute('content');
            return true;
        }
    },
    findUserName: function(e){
        var elem = e.querySelector('#watch7-user-header a.yt-user-name');
        if (elem) {
            this.userInfo.Name = elem.textContent;
            return true;
        }
        else {
            elem = e.querySelector('meta[name=title][content]');
            if(elem){
                this.userInfo.Name = elem.getAttribute('content');
                return true;
            }
        }
        return false;
    },
    printUserRule: function(){
        if(typeof this.userInfo.ytid === "string"){
            var ul = document.querySelector("#guide ul");
            if(!ul) return false;
            var li = ul.querySelector("li");
            if(!li) return false;
            var input = document.createElement("textarea");
            input.textContent = this.makeRuleText();
            ul.insertBefore(input, li);
            return true;
        }
        return ture;
    },
    makeRuleText: function(){
    	var rule = 'youtube.com##[' + this.ab_attr + '="' + this.userInfo.ytid + '"]';
        if (this.userInfo.Name === null){
        	this.findUserName(document);
        }
        if (this.userInfo.Name) {
            rule += ' /' + '*' + this.userInfo.Name + '*' + '/';
        }
        console.log(rule);
        return rule;
    }
};

(function () {
    var pa, obs, m = document.URL.match(/^https?:\/\/(?:[\w\-]+\.)*youtube\.com\/(\S*)$/);

    if (!m) {return;}
    pa = m[1];
    if (pa.match(/^subscribe_embed\W/)) {
        return ;
    }

    var blocker = new Blocker(pa.match(/^(?:user|channel|watch|playlist)\W/));

    obs = new MutationObserver(function (mu) {
        mu.forEach(function (m) {
            blocker.observed(m.target);
        });
    });
    obs.observe(document, {attributes: false, subtree: true, childList: true, characterData: false});

    window.addEventListener('DOMContentLoaded', function () {
        if(blocker.user_specified){
            blocker.observed(document.body);
            var try_print = function(d){
                setTimeout(function(){
                    if(!blocker.printUserRule()){
                        if(d < 10000)
                        	try_print(d * 1.3);
                    }
                }, d);
            };
            try_print(1000);
        }

        var i, items = document.querySelectorAll('.spf-link');
        for (i = 0; i < items.length; i++) {
            items[i].classList.remove('spf-link');
        }
        
        if(blocker.user_specified){
            var elems = document.querySelectorAll('#content, #player');
            if(elems.length == 0){
            	document.location = "https://www.youtube.com/";
            }
            for (var i = 0; i < elems.length; i++) {
                var e = elems[i];
                if(this.confirmHidden( e ) ){
                    document.location = "https://www.youtube.com/";
                }
            }
        }
        
        
    }, true);

}) ();
