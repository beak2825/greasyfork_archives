// ==UserScript==
// @name         VK top comments
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Топовые комментарии VK!
// @author       Me
// @match       *://vk.com/*
// @match       *://*.vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22157/VK%20top%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/22157/VK%20top%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function CommentSorter(box) {
        if (window.location.host == 'vk.com') {
            box.setAttribute("data-sorter-init", "true");
            this.rootNode = box;
            this.statNode = box.querySelector('.post_full_like');
            if (this.statNode === null && this.rootNode.id == "wl_post") {
                this.statNode = box.querySelector('#wl_post_actions_wrap');
                this.singlePost = true;
            }
            this.init();
        }
}

CommentSorter.getResource = function () {
    var scriptNode = document.querySelector("#VKCommentsSorterRootEx");
    return JSON.parse( scriptNode.getAttribute("data-resource") );
};

CommentSorter.hookComments = function () {
    var arCommentsBox = document.querySelectorAll(".post");
    var box = null;
    var commentBox = null;
    var i;
    for (i = 0; i < arCommentsBox.length; i++) {
        box = arCommentsBox[i];
        commentBox = null;
        if (
            !box.hasAttribute("data-sorter-init") && (commentBox = box.querySelector(".replies_wrap.clear")) && commentBox.style.display != "none"
        )
        {
            box.commentSorter = new CommentSorter(box);
        }
    }
    box = document.getElementById('wl_post');
    if ( box &&
        !box.hasAttribute("data-sorter-init") && (commentBox = box.querySelector(".wl_replies")) && commentBox.style.display != "none"
    )
    {
        //console.log("Init for post");
        box.commentSorter = new CommentSorter(box);
    }
    arCommentsBox = document.querySelectorAll(".wall_fixed");
    box = null;
    commentBox = null;
    for (i = 0; i < arCommentsBox.length; i++) {
        box = arCommentsBox[i];
        commentBox = null;
        if (
            !box.hasAttribute("data-sorter-init") && ((commentBox = box.querySelector(".replies_wrap.clear")) || (commentBox = box.querySelector('.wall_fixed_replies'))) && commentBox.style.display != "none"
        )
        {
            box.commentSorter = new CommentSorter(box);
        }
    }
};

CommentSorter.setSortAfterInit = function () {
    CommentSorter.sortAfterInit = true;
};

CommentSorter.getSortAfterInit = function () {
    if (CommentSorter.sortAfterInit) {
        CommentSorter.sortAfterInit = false;
        return true;
    } else {
        return false;
    }
};


CommentSorter.getTextOnBtn = function () {
    return 'Топ';//CommentSorter.getResource().lang.top;
};

CommentSorter.getButtonNodeForFullPost = function(self) {
    var btn = document.createElement("a");
    btn.className = "flat_button secondary button_light wl_action_link wl_post_share";
    btn.href = "#";
    btn.innerHTML = "<img style='margin-left:5px; float:right; margin-top:1px; width:17px' src='http://topcomments.burlaka.net/icon.svg'><span>"+CommentSorter.getTextOnBtn()+"</span>";
    btn.addEventListener("click", function (event) {
        event.preventDefault();
        self.onSortFullPostClick(event);
    });
    return btn;
};

CommentSorter.getButtonNode = function (self) {
    if (self.singlePost) {
        return CommentSorter.getButtonNodeForFullPost(self);
    }
    var btn = document.createElement("div");
    btn.className = "post_share fl_r";
    btn.innerHTML = "<img style='float:right; margin-top:0px;width:17px;opacity:0.5' src='http://topcomments.burlaka.net/icon.svg'>"+'<span style="display: block" class="post_share_link fl_l">'+CommentSorter.getTextOnBtn()+'</span>';
    btn.style.position = "absolute";
    btn.style.width = "40px";
    btn.style.left = "-48px";
    btn.addEventListener("click", function (event) {self.onSortClick(event);} );
    return btn;
};

CommentSorter.prototype.init = function () {
    var btn = CommentSorter.getButtonNode(this);
    if (this.singlePost) {
        this.btnText = btn.querySelector("span");
    } else {
        this.btnText = btn.querySelector('.post_share_link');
    }
    if (this.statNode) {
        this.statNode.appendChild( btn );
    } else {
        //console.log("Init without button");
    }
    if (CommentSorter.getSortAfterInit()) {
        btn.click();
    }
};

CommentSorter.prototype.onFinishLoadAllComment = function () {
    this.btnText.innerHTML = CommentSorter.getTextOnBtn();
    clearInterval(this.loaderTimer);
    this.sortingAnimation = false;
};

CommentSorter.prototype.onStartLoadAllComment = function() {
    if (this.sortingAnimation) return false;
    this.sortingAnimation = true;
    this.btnTextPonts = ".";
    this.btnText.innerHTML = CommentSorter.getTextOnBtn()+this.btnTextPonts;
    var self = this;
    this.loaderTimer = setInterval( function () { self.onLoadProgress(); }, 400 );
    return true;
};

CommentSorter.prototype.onLoadProgress = function () {
  if (this.btnTextPonts.length >= 3) {
      this.btnTextPonts = ".";
  } else {
      this.btnTextPonts += '.';
  }
    this.btnText.innerHTML = CommentSorter.getTextOnBtn()+this.btnTextPonts;
};

CommentSorter.prototype.onSortClick = function (event) {
    CommentSorter.setSortAfterInit();
    //console.log(event);
    var obj;
    if (obj == this.rootNode.querySelector(".wall_post_text")) {
        obj.click();
    }
    if (obj == this.rootNode.querySelector(".published_comment") ) obj.click();
    if (obj == this.rootNode.querySelector(".reply_link_wrap") ) obj.click();
    if (obj == this.rootNode.querySelector(".post_media") ) obj.click();
    if (obj == this.rootNode.querySelector(".event_share") ) obj.click();
    if (obj == this.rootNode.querySelector(".public_share") ) obj.click();
    if (obj == this.rootNode.querySelector(".group_share") ) obj.click();
    this.rootNode.click();
    //return;
    /*this.onStartLoadAllComment();
    var commentLoader = this.rootNode.querySelector('.wr_header');
    var self = this;
    if (commentLoader) {
        var progressBar = commentLoader.querySelector('.progress');
        if (progressBar && progressBar.style.display == "block") {
            setTimeout( function () {self.onSortClick(null);}, 100 );
            //console.log("Load wait");
        } else {
            if (!commentLoader.classList.contains('wrh_all')) {
                commentLoader.click();
                setTimeout( function () {self.onSortClick(null);}, 100 );
                //console.log("open all");
            }
            if (event === null) {
                setTimeout(function () {
                    self.resortComments();
                }, 400);
                //console.log("resort all after load");
                this.onFinishLoadAllComment();
            }
        }
    }
    this.resortComments();*/
};

CommentSorter.prototype.onSortFullPostClick = function (event) {
    var self = this;
    if (this.onStartLoadAllComment()) {
        this.resortComments();
    }
    if (wkcur)
        wkcur.limit = 100;
    var loaderState = this.rootNode.querySelector('#wl_replies_more_link');
    if (loaderState && loaderState.style.display != 'none' ) {
        var progressBar = this.rootNode.querySelector('#wl_replies_more_progress');
        if (progressBar && progressBar.style.display != 'block') {
            loaderState.click();
            //console.log("Click on load more");
            this.resortComments();
        } else {
            //console.log("Progress bar is hidden");
        }
        //console.log("Wait for loader");
        setTimeout( function () {self.onSortFullPostClick(0);}, 100 );
    } else {
        //console.log("Loader is hidden");
        if (event !== -1 && event !== -2) {
            setTimeout( function () {self.onSortFullPostClick(-1);}, 400 );
            //console.log("Waiting for loader this");
        } else {
            //console.log("Waiting twice");
            if (event !== -2) {
                setTimeout( function () {self.onSortFullPostClick(-2);}, 1200 );
            } else {
                //console.log("Loading too long, return");
                this.resortComments();
                this.onFinishLoadAllComment();
            }
        }
    }
};

CommentSorter.prototype.resortComments = function () {
    var arComments = this.rootNode.querySelectorAll(".reply.reply_dived");
    var arSort = [];
    console.log("Start sort "+arComments.length);
    for (var i = 0; i < arComments.length; i++) {
        var node = arComments[i];
        var sortObject = {"node":node, "rating":0};
        var likeNode = node.querySelector(".like_count");
        if (likeNode && likeNode.innerHTML.length) {
            sortObject.rating = parseInt( likeNode.innerHTML );
        }
        arSort.push(sortObject);
    }

    arSort.sort( function compare(b, a) {
        if (a.rating < b.rating) {
            return -1;
        }
        if (a.rating > b.rating) {
            return 1;
        }
        return 0;
    } );

    for (var j = 0; j < arSort.length; j++) {
        var prent = arSort[j].node.parentNode;
        prent.removeChild(arSort[j].node);
        prent.appendChild(arSort[j].node);
    }
};

CommentSorter.hookComments();
setInterval(function () {CommentSorter.hookComments();}, 500);
})();