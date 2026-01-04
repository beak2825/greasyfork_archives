// ==UserScript==
// @name         Maleficium TopicLive
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Don't bother F5 Pages !
// @author       Miyun
// @match        http://maleficium.forumactif.com/t*
// @downloadURL https://update.greasyfork.org/scripts/393646/Maleficium%20TopicLive.user.js
// @updateURL https://update.greasyfork.org/scripts/393646/Maleficium%20TopicLive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // On n'est pas sur la dernière page
    if($(".pagination .sprite-arrow_prosilver_right").length > 0) return;

    var notificationList = document.getElementById("notif_list");

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // element added to DOM
                for (var node of mutation.addedNodes){
                    if(node.id != "" && node.id != undefined && node.id != null){
                        //Vérifications, les notifications peuvent être des MPs
                        var link = $(node).find('a[href*="/t"]')[0] ? $(node).find('a[href*="/t"]')[0].href : undefined;
                        var topic = link ? link.substring(link.indexOf("t"), link.indexOf("-")) : undefined;

                        if(link && topic && location.href.indexOf(topic) > -1){ //Tout s'est bien passé

                            //Est-ce que le post existe déjà sur la page ?
                            var postId = "p" + link.substring(link.indexOf("#")+1);
                            var alreadyExist = $.makeArray($(".post")).filter(a => a.id == postId).length > 0;

                            //Si le post n'est pas déjà présent
                            if(!alreadyExist){
                                $.ajax({
                                    url: link,
                                    dataType: 'text',
                                    type: 'GET',
                                    success: function(p){
                                        var h = document.createElement('div');
                                        h.innerHTML = p;
                                        var post = $(h).find("#" + postId)[0];
                                        if (post){
                                            $(post).hide();
                                            $(".post").last().after(post);
                                            $(post).show('normal');
                                            $(node).find(".delete")[0].click();
                                        }
                                    }
                                });
                            }else{
                                $(node).find(".delete")[0].click();
                            }

                        }
                    }
                }
            }
        });
    });

    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };

    observer.observe(notificationList, config);

    while ($(notificationList).find("li").length > 1){
        $(notificationList).find("li").each(function(){
            if($(this).find(".unseen")[0]) $(this).find(".unseen")[0].click();
        });
    }
})();