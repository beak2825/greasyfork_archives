// ==UserScript==
// @name         Tutoriel premium RG
// @namespace    https://realitygaming.fr/
// @version      0.1
// @description  Réponse prédéfinie sur RG
// @author       Paradise
// @include      https://realitygaming.fr/threads/*
// @include      https://realitygaming.fr/conversations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24026/Tutoriel%20premium%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/24026/Tutoriel%20premium%20RG.meta.js
// ==/UserScript==

$(document).ready(function(){

        function reply_bonjour(){
     var rl = '<br>\n';
     var txt = "Bonjour" + rl + "Comment ça va ?";
     reply(txt);
        }

            var style= '<style>#barre{text-align:center;border-radius:5px;border:1px solid rgb(210,210,210);padding:10px;}#barre a{margin-right:8px;margin-left:8px;}</style>';
            var bjr = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="bjr" data-message=""><i class="fa fa-angellist"></i>  Bonjour</a>';


    $('#QuickReply').find('.submitUnit').before('<br>' + style + '<div class="barre" id="barre">' + bjr + '</div></br>');

    $('#barre a').on('click', function(){
        if($(this).data('action') == "bjr"){
           reply_bonjour();
        }
    });
});