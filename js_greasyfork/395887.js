// ==UserScript==
// @name         term.ptt imgur cors
// @namespace    NoNameSpace
// @version      0.1
// @description  restore term.ptt autologin function
// @match        *://term.ptt.cc
// @match        *://term.ptt.cc/*
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @run-at       document-end
//@require https://code.jquery.com/jquery-3.3.1.min.js
//@require https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @resource    customCSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css
// @downloadURL https://update.greasyfork.org/scripts/395887/termptt%20imgur%20cors.user.js
// @updateURL https://update.greasyfork.org/scripts/395887/termptt%20imgur%20cors.meta.js
// ==/UserScript==

(function() {
    var newCSS = GM_getResourceText ("customCSS");
    GM_addStyle (newCSS);

    //hover時顯示縮圖
    $(document).on("mouseenter", "a", function() {
        console.log(this.href);

        if(/^https:\/\/i.imgur.com\/.*$/.test(this.href))
        {
            displayImage(this.href);
        }

    });
    //click時自動轉址
    $(document).on("click", "a", function() {
        console.log(this.href);

        if(/^https:\/\/i.imgur.com\/.*$/.test(this.href))
        {
            //redirectImgur(this.href);
        }

    });

    //顯示圖片
    function displayImage(url){
    				console.log("取得圖片");
            var imgUrl = 'https://cors-anywhere.herokuapp.com/' + url;
						toDataUrl(imgUrl, function(myBase64) {
                $.fancybox.open({
                  src  : '<img src="' + myBase64 + '" style="width:50vw;height:50vh;" />',
                  type : 'html',
                  opts : {
                    buttons: [
                        "download",
                        "close"
                      ],
                    btnTpl: {
                      download:
                            '<a href="'+imgUrl+'" target="_blank"><span>開新視窗</span></a>'
                    },
                    clickContent: function(current, event) {
                      return current.type === "html" ? "close" : false;
                    },
                    dbclickContent: function(current, event) {
                      window.open(imgUrl);
                    },
                    clickOutside: "close",
                    animationEffect: false,
                  }
                });
            });

    }

    function toDataUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }



})();