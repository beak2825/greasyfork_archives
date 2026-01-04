// ==UserScript==
// @name         VK Save+Like
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Auto "Like" after click "Save image"
// @author       stalkermiha
// @match        https://vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/374033/VK%20Save%2BLike.user.js
// @updateURL https://update.greasyfork.org/scripts/374033/VK%20Save%2BLike.meta.js
// ==/UserScript==

document.addEventListener('click',function(e){
    var img_class_list = e.srcElement.className.split(' ');
    var img_id = e.srcElement.id;
    //console.log(img_class_list[0]);
    //console.log(img_id);
    if(img_class_list[0] == 'page_post_thumb_wrap' || img_id == 'pv_photo'){
        var timerId = setTimeout(function(){
            if(document.querySelector('#layer_wrap a.like_btn.like._like')){
                var onclickButtonStart = document.querySelector('#layer_wrap a.like_btn.like._like').getAttribute('onclick');
                //console.log(onclickButtonStart);
                var onclickButtonEnd = onclickButtonStart+"Photoview.savePhoto();";
                document.querySelector('#layer_wrap #pv_save_to_me').setAttribute('onclick',onclickButtonEnd);
                clearInterval(timerId);
                //console.log('close');
            }else{
                //console.log('search');
            }
        },500);
    }
    //console.log(img_class_list);
});