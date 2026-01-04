// ==UserScript==
// @name         DC_notify
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Utilisation des notifications navigateur pour la réception d'un message sur Dreadcast.
// @author       Damasio
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33538/DC_notify.user.js
// @updateURL https://update.greasyfork.org/scripts/33538/DC_notify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $msg_new,$msg_imgurl,$msg_title,$msg_author, $msg_id, $msg_inner,msg_object, response_xml, $response, $check_event;
    var msg_ids = [];
    var pending = false;

    if (!("Notification" in window)) {
        console.log('[DC_notify] Ce navigateur ne supporte pas les notifications');
    }
    else if (Notification.permission === "granted") {
        console.log('[DC_notify] Notifications acceptées');
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if(!('permission' in Notification)) {
                Notification.permission = permission;
                console.log('[DC_notify] Notifications refusées');
            }

            if (permission === "granted") {
                console.log('[DC_notify] Notifications acceptées');
            }
        });
    }

    $(document).ajaxComplete(function (event, xhr, settings) {

        if(settings.url.endsWith("OpenFolder")){
            console.log(msg_ids);
            if(pending){
                $msg_new = $('.message.new');
                for(let i=0;i<$msg_new.length;i++){
                    $msg_author = $($msg_new[i]).find('.message_auteur').text();
                    $msg_imgurl = $($msg_new[i]).find('img').prop('src');
                    $msg_title = $($msg_new[i]).find('.message_titre').text();
                    if($msg_title.trim()===''){
                        msg_object = '';
                    }else{
                        msg_object = '\nObjet : '+$msg_title;
                    }
                    new Notification("Nouveau message de "+$msg_author, {icon:$msg_imgurl, body:msg_object,lang: 'fr-FR',dir: 'ltr'});
                }
                pending = false;
            }
        }

        if (settings.url.endsWith("Check")) {
            response_xml = $.parseXML( xhr.responseText );
            $response = $( response_xml );
            $check_event = $response.find( "evenement" );
            if($check_event.length>0){
                $msg_inner = $check_event[0].innerHTML;
                $msg_id = /id_conversation="(.*)"/g.exec($msg_inner);
                console.log($msg_id);
                if($msg_id.length>1){
                    pending = true;
                }
            }
        }
    });


})();