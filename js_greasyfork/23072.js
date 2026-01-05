// ==UserScript==
// @name 	    Smug anime faces for vk.com
// @author      Anza Nyanza
// @namespace  	vk.com/nyanza
// @version    	1.0
// @description Заменяет [smug anime face] в сообщениях ВК на случайную smug anime face.
// @match       *.vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/23072/Smug%20anime%20faces%20for%20vkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/23072/Smug%20anime%20faces%20for%20vkcom.meta.js
// ==/UserScript==

var images = ['PqDC4Fz', 'WP0phl9', 'im0Iws8', '7E9JTXC', '8q6We1B', 'kqOBOAd', '4frMQdk', 'NS4Bfmd', 'NRqqwWp', '9Jsh3ql', 'JrQqeas', 'w5hlq7F', 'Ld4Lbjz', 'QlteqfD'];

function repl(str){
    var id = Math.floor(Math.random() * images.length) + 1;
    var img = images[id];
    str = str.replace('[smug anime face]', '<div class="_im_msg_media9823"><div class="page_post_sized_thumbs clear_fix" style="width: 300px; height: 300px;"><a style="width: 300px; height: 300px; background-image: url(http://imgur.com/' + img + '.jpg)" class="page_post_thumb_wrap image_cover page_post_thumb_last_column page_post_thumb_last_row"></a></div></div>');
    return str;
}

function smugIt(){
	for(var i = 0; typeof document.getElementsByClassName('_im_log_body')[i] != 'undefined'; i++){
        var string = document.getElementsByClassName('_im_log_body')[i].innerHTML;
        if (string.indexOf('[smug anime face]') > -1){
            document.getElementsByClassName('_im_log_body')[i].innerHTML = repl(string);
        }
    }
    for(var i2 = 0; typeof document.getElementsByClassName('nim-dialog--preview _dialog_body')[i2] != 'undefined'; i2++){
        var string2 = document.getElementsByClassName('nim-dialog--preview _dialog_body')[i2].innerHTML;
        if (string2.indexOf('[smug anime face]') > -1){
            document.getElementsByClassName('nim-dialog--preview _dialog_body')[i2].innerHTML = string2.replace('[smug anime face]', '<span class="nim-dialog--preview nim-dialog--preview-attach">Smug anime face</span>');

        }
    }
}
var timer = setInterval(smugIt, 100);