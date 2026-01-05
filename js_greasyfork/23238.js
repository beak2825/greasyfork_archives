// ==UserScript==
// @name        BDDynamic
// @namespace   bddynamic
// @description fuck baidu
// @match     http://tieba.baidu.com/*
// @match     https://tieba.baidu.com/*
// @version     1
// @grant     unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/23238/BDDynamic.user.js
// @updateURL https://update.greasyfork.org/scripts/23238/BDDynamic.meta.js
// ==/UserScript==

window.onload = weak;

function stopVideo(){
    if(document.getElementById('video_frs_head')!==null){
        document.getElementById('video_frs_head').remove();
    }
    var vList=document.getElementsByClassName('threadlist_video');
    var j=vList.length;
    for(var i=0;i<j;++i){
        var link = vList[i].children[1].getAttribute('data-video');
        vList[i].children[1].setAttribute('data-video','');
    }
}

function weak(){
    stopVideo();
    var loc = parseInt(unsafeWindow.PageData.forum.id);
    var list = document.getElementById('thread_list').children;
    var j = list.length;
    for (var i = 0; i < j; ++i) {
        if (list[i].className == 'thread_top_list_folder') {
            //do nothing
        }
        else if (list[i].className != ' j_thread_list clearfix') {
            //hide advertisements
            list[i].remove();
            i--;
            j--;
        }
        else if (list[i].getElementsByClassName('threadlist_btn_play j_m_flash').length > 0) {
            if (list[i].getElementsByClassName('threadlist_btn_play j_m_flash') [0].getAttribute('data-forumid') != loc) {
                list[i].remove();
                i--;
                j--;
            }
        }
        else if (list[i].getElementsByClassName('thumbnail vpic_wrap').length > 0){
            if(list[i].getElementsByClassName('thumbnail vpic_wrap')[0].children[0].getAttribute('bpic').match('forum/pic/item/723d269759ee3d6d81a184654b166d224f4ade3d')){
                list[i].remove();
                i--;
                j--;
            }
        }
    }
}






function strong() {

    stopVideo();

    var list = document.getElementById('thread_list').children;
    var j = list.length;
    for (var i = 0; i < j; ++i) {
        if (list[i].className == 'thread_top_list_folder') {
            //do nothing
        }
        else if (list[i].className != ' j_thread_list clearfix') {
            //hide advtisements
            list[i].remove();
            i--;
            j--;
        }
        else if (list[i].getElementsByClassName('threadlist_btn_play j_m_flash').length > 0) {
            if (list[i].getElementsByClassName('threadlist_btn_play j_m_flash') [0].getAttribute('data-type') == 'movideo') {
                list[i].remove();
                i--;
                j--;
            }
        }
        else if (list[i].getElementsByClassName('thumbnail vpic_wrap').length > 0){
            if(list[i].getElementsByClassName('thumbnail vpic_wrap')[0].children[0].getAttribute('bpic').match('forum/pic/item')){
                list[i].remove();
                i--;
                j--;
            }
        }
    }
}
