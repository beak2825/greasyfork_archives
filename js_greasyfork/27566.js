// ==UserScript==
// @name         JVC réponse live
// @namespace    http://www.jeuxvideo.com/
// @version      1.0.6
// @description  Répondez plus facilement à quelqu'un et voyez qui vous a répondu 
// @author       FriendsBeach
// @match        http://www.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/27566/JVC%20r%C3%A9ponse%20live.user.js
// @updateURL https://update.greasyfork.org/scripts/27566/JVC%20r%C3%A9ponse%20live.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pseudoJVC;
    var dateT = new Date();
    var rTime = dateT.getTime();
    var iAmTheMaster = false;
    var idMaster = Math.random();

    var reponses = [];
    var last_response ;
    var last_response_id ;

    add_picto_delete();

    $('body').append('<div style="padding: 4px; font-weight: bold;background:#535362;position:fixed;right:0px;top:50%" ><span  style="width: 30px; padding: 5px; background: gray; vertical-align: middle; margin-right: 3px; padding-left: 8px; padding-right: 8px; cursor: pointer; color: #ffffff; font-size: 18px;" id="nb-reponses" >0</span><a style="margin-right: 10px;" href="/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm" sl-processed="1"><!-- --><span class="btn btn-actu-new-list-forum"><!-- -->Liste des sujets<!-- --></span><!-- --></a><span style="background-color:#535362;color:white;text-transform: none; padding-right: 0.625rem; padding-left: 1.25rem; background: url(http://static.jvc.gg/1.44.4/img/forum/nb-connect.png) left center no-repeat; font-size: 0.875rem;" class="nb-connect-fofo">'+$('.nb-connect-fofo').html()+'</span></div>');

    function add_picto_delete(){
        $('.jv-editor-toolbar').prepend('<span id="jvc-respond-citation"  style="cursor:pointer;display:none;margin-left: 8px;margin-top: 4px; width: 16px; height: 16px;background: url(http://static.jvc.gg/1.44.4/img/forum/icones-messages.png) -160px 0 no-repeat;" class="pull-right picto-delete-citation" ></span>');
    }

    function reset_form(){
        $("#bloc-formulaire-forum").insertAfter('.bloc-pre-pagi-forum.bloc-outils-bottom');
        $('#jvc-respond-citation').hide();
        $('#message_topic').val('');
        $('.previsu-editor').html('');
        last_response_id = undefined;
        last_response = undefined;
    }

    $('#jvc-respond-citation').click(function(){
        reset_form();
    });

    $('body').on('click', '.picto-msg-quote',function(){
        var bloc = $(this).closest('.bloc-message-forum');
        last_response = bloc;
        last_response_id = bloc.data('id');
        $("#bloc-formulaire-forum").insertAfter('.bloc-message-forum[data-id="'+bloc.data('id')+'"]');
        $('#jvc-respond-citation').show();
    });

    $('#bloc-formulaire-forum .titre-head-bloc').hide();

    function scrollTo(element) {
        element.scrollIntoView();
    }

    addEventListener('topiclive:newmessage', function(event){

        var messageId = event.detail.id;

        var p = $('.bloc-message-forum[data-id="'+ messageId +'"] .bloc-pseudo-msg').html().trim();

        if(p.toLowerCase() == pseudoJVC.toLowerCase()){

            var response_bloc = $('.bloc-message-forum[data-id="'+ messageId +'"]');

            if(last_response !== undefined){

                response_bloc.insertAfter('.bloc-message-forum[data-id="'+ last_response_id +'"]');
                response_bloc.find('blockquote').css('background', 'rgba(255, 123, 123, 0.12)');

                reset_form();
                response_bloc.css('margin-left','20px');
                response_bloc.css('background-color','#e6e6e6!important');

            }

        }

        checkIfNotif();

    });

    $('#nb-reponses').click(function(){
        if(reponses.length > 0){
            var id = reponses[0];
            var element = $('.bloc-message-forum[data-id="'+id+'"]')[0];
            scrollTo(element);
            reponses.splice(0, 1);
            refresh_reponses();
        }
    });

    function refresh_reponses(){
        $('#nb-reponses').html(reponses.length);

        if(reponses.length > 0 ){
            $('#nb-reponses').css('background','#a3b34b');
        }else{
            $('#nb-reponses').css('background','gray');
        }
    }

    function debug(msg){
        console.log('[ JVC-NOTIF ] - ' + msg);
    }

    (function getPseudo() {
        pseudoJVC = document.getElementsByClassName("account-pseudo")[0].innerHTML;
    })();

    function checkIfNotif() {
        debug('Check notification');

        if(pseudoJVC !== undefined) {

            $('.bloc-message-forum').each(function(){
                var id = $(this).data('id');
                var main = $(this);

                if(main.data('done') == 'yes') return true;

                main.data('done','yes');
                $(this).find('.bloc-contenu .blockquote-jv').each(function(){

                    var parent = $(this).parent();
                    if(parent.attr('class') == 'blockquote-jv'){
                        return true;
                    }

                    var p = $(this).find('p');
                    if(p){
                        p = p[0];
                        var html = $(p).html();
                        var index = html.indexOf(pseudoJVC);

                        if(index != -1){

                            $(this).css('background','beige');
                            reponses.push(id);
                            refresh_reponses();

                        }

                    }
                });
            });
        }
    }

    checkIfNotif();

})();