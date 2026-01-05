// ==UserScript==
// @name         osu! Nickname
// @namespace    http://wa.vg/
// @version      0.1
// @description  Add a Nickname under name to help recognizing someone
// @author       ieb <1@wa.vg>
// @match        https://osu.ppy.sh/*
// @match        http://osu.ppy.sh/*
// @downloadURL https://update.greasyfork.org/scripts/10952/osu%21%20Nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/10952/osu%21%20Nickname.meta.js
// ==/UserScript==

$('.profile_friend a').each(function(){
	if ($(this).attr('href').match(/\/u\/(\d+)/)){
        if ($(this).text().replace(/\s/g,'')!=''){
            ID = $(this).attr('href').match(/\/u\/(\d+)/)[1];
            if (localStorage.getItem('/nick/' + ID)){
                console.log($(this).text());
                Nick = localStorage.getItem('/nick/' + ID)
                $(this).html($(this).html() + ' <span style="color:red">('+Nick+')</span>');
            }
        }
	}
});
$('a.postauthor').each(function(){
	if ($(this).attr('href').match(/\/u\/(\d+)/)){
        if ($(this).text().replace(/\s/g,'')!=''){
            ID = $(this).attr('href').match(/\/u\/(\d+)/)[1];
            if (localStorage.getItem('/nick/' + ID)){
                console.log($(this).text());
                Nick = localStorage.getItem('/nick/' + ID)
                $(this).html($(this).html() + '<br/><span style="font-weight:600;font-size:12px;color:#0077ff">('+Nick+')</span>');
            }
        }
	}
});
if ($('.profile-username')[0] !== null){
    t = $($('.profile-username')[0]);
    ID = userId;
    if (localStorage.getItem('/nick/' + ID)){
        console.log($(t).text());
        Nick = localStorage.getItem('/nick/' + ID);
        if (Nick.replace(/\s/g,'')=='') {
            localStorage.removeItem('/nick/' + ID);
            Nick = "Set Nickname";
        }
    }else{
        Nick = "Set Nickname"
    }
    $(t).html($(t).html() + '<br/><span style="font-weight:600;font-size:13px;color:#0077ff" onclick="localStorage.setItem(\'/nick/'+ ID + '\',prompt(\'Nickname\'));document.location.reload()">'+Nick+'</span>');
}