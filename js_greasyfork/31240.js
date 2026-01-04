// ==UserScript==
// @name         Polchive
// @namespace Polchive
// @version      0.2
// @description  Archive everything, hide nothing. (Requires 4Chan-X)
// @author       You
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/31240/Polchive.user.js
// @updateURL https://update.greasyfork.org/scripts/31240/Polchive.meta.js
// ==/UserScript==
console.log("ASDFASDFA");
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback/*, thisArg*/) {

    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat while k < len.
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator.
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c.
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined.
  };
}

var Archiveify = true;

//Wait for 4Chan X to initialize.
var waitTime = 0;
while(document.querySelector('.fourchan-x') == null){
    console.log("Waiting for 4chanX");
    waitTime++;
}


var threadElem = document.querySelector('.thread');
var getRegex = /(.)\1+$/;
var archiveRegex = /archive.is|archive.fo|web.archive.com/;



var Post = function(id){
    var _this = {};
    _this.id =  id;
    _this.element = document.querySelector('#pc' + id);
    _this.message = "";
    _this.imageURL = "";
    _this.links = [];
    _this.isGet = (function(id){
        return getRegex.test(id);
    })(id);
    _this.replies = [];
    _this.element.querySelectorAll('.postInfo.desktop > .container a').forEach(function(elem){
        var fuckme = '#pc' + elem.innerText.slice(2).replace("(You)", "").trim();
       _this.replies.push(document.querySelector(fuckme));
    });
    _this.element.querySelectorAll('.linkify').forEach(function(elem){
        if(Archiveify){
            if(!archiveRegex.test(elem.href)){
                elem.href = "http://archive.is/" + elem.href;
            }
        }
        _this.links.push(elem);
    });
    return _this;
};
var PostCollection = (function(){


    var _this = {};
    _this.posts = [];
    document.querySelectorAll('.postInfo.desktop a[title="Reply to this post"]').forEach(function(post){
       _this.posts.push(new Post(post.textContent)); 
    });
    _this.getPost = function(postNumber){
     for(var i = 0; i < _this.posts.length; i++){
         if(_this.posts[i].id == postNumber)
            return _this.posts[i];
     }
    }
    _this.screenShotView = function(postNumber){
      _this.posts.forEach(function(post){
         post.element.style.display = "none";
      });
      threadElem.style.columnCount = "3";
      var post = _this.getPost(postNumber);
      post.element.style.display = "block";
      post.replies.forEach(function(reply){
         reply.style.display = "inline-flex";
         reply.style.float = "";
         reply.style.width = "50%";
         reply.style.position = "relative";
         reply.style.webkitTransform =  "translateX(0)";
         reply.style.mozTransform = "translateX(0)";
         reply.style.transform = "translateX(0)";
         reply.querySelector('div').style.display = "none";
      });
    }
    return _this;
})();