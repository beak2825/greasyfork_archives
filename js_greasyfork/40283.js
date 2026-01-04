// ==UserScript==
// @name        Huomao html5 player
// @namespace   https://greasyfork.org/
// @description 火猫全站启用html5播放器
// @include     http://www.huomao.com/*
// @include     https://www.huomao.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40283/Huomao%20html5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/40283/Huomao%20html5%20player.meta.js
// ==/UserScript==
(function() {

    var flashUrl = location.href;
    var normalUrl = /^https?:\/\/www\.huomao\.com\/(\d+)$/ , topicUrl = /^https?:\/\/www\.huomao\.com\/zt\/(\w*)\.html\?room_number=(\d+)$/;
    if(normalUrl.test(flashUrl)){
       location.href = "?h5player";
    }else if(topicUrl.test(flashUrl)){
       location.href = "#h5player";
    }else{
        $(document).ready(function(){
            var delLoginPopItvl = setInterval(function(){
                if($('#stream-delay-tip.show').length > 0){
                    $('#stream-delay-tip.show').remove();
                    clearInterval(delLoginPopItvl);
                }
            }, 1000);
        });
    }
    
})();