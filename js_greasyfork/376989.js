// ==UserScript==
// @name         Minimize pics
// @description  Minimize pics/youtube/wikipedia/tweet previews in chat
// @version      0.1
// @author       lois6b
// @include      *chat.stackexchange.com/rooms/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @namespace https://greasyfork.org/users/241254
// @downloadURL https://update.greasyfork.org/scripts/376989/Minimize%20pics.user.js
// @updateURL https://update.greasyfork.org/scripts/376989/Minimize%20pics.meta.js
// ==/UserScript==

(function() {
var img = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_right_48px-128.png";

    jQuery("head").append("<style>\
.rotated{\
-webkit-transform : rotate(90deg);\
-moz-transform: rotate(90deg);\
transform: rotate(90deg);\
}\</style>");


    function tratar(){
        $('.ob-image, .ob-tweet, .ob-wikipedia, .ob-youtube ').each(function(){
            var content =  $(this).parent();
            if(content.children().length == 1){
                content.prepend('<img class="minim rotated" width="20px" heigth="20px" src="'+img+'">')
                content.find('.minim').click(function(){
                    $(this).parent().find('div[class*=ob]').slideToggle()
                    $(this).hasClass('rotated')? $(this).removeClass('rotated'): $(this).addClass('rotated');})
            }
        });
    }


    let mirador = new MutationObserver(async (records, _) => {
        tratar();
    })
    mirador.observe($('#chat')[0], { childList: true, subtree: true });

})();