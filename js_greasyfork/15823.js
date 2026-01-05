// ==UserScript==  
// @name        RecoPoringa.
// @namespace   RecoPoringa  
// @match       http://www.poringa.net/posts/
// @description Recomienda posts en Poringa!
// @include     *://www.poringa.net/*
// @version     0.3
// @grant       none  
// @icon        http://o1.t26.net/images/favicon-p.ico
// @downloadURL https://update.greasyfork.org/scripts/15823/RecoPoringa.user.js
// @updateURL https://update.greasyfork.org/scripts/15823/RecoPoringa.meta.js
// ==/UserScript==    
/* jshint -W097 */
(function ($) {
        var boton = '<a rel="nofollow" id="reco" class="btn a" title="Compartir en Mi Poringa"><span class="nombre" style="color:#fff"><i class="ico-shout icon-shouts" title="Share"></i>&nbsp;&nbsp;Recomendar</span></a><img src="https://k61.kn3.net/C/D/5/D/5/3/500.gif" id="loading" width="45" hight="45" style="display:none" /><img src="https://k61.kn3.net/7/B/6/E/4/C/AEA.png" width="45" hight="45" id="listo" style="display:none" /><img src="https://k60.kn3.net/F/2/3/9/A/1/9A1.png" width="45" hight="45" id="error" style="display:none" /></div>';
        $('.social-bar.top').append(boton);
        $('.social-bar.bottom').prepend(boton);
        $('#reco').on('click', function shout() {
            var link = ''+document.URL+'';
            var $split = link.split('/');
            var urlFinal = $split[$split.length-1];
            var urlReplace = link.replace(urlFinal, "");
            var usuario = $('.textlimit').prop('href').replace(/.*?:\/\/www.poringa.net/, "").substring(1).trim();
            var cont = '['+'['+'['+'['+ usuario +']'+']'+']'+']\n'+'@'+ usuario +'';
            var $loading = $('#loading');
            $("#reco").hide();
            $loading.show();
            $.ajax({
                type    : 'POST',
                dataType: 'json',
                url     : '/ajax/shout/attach',
                data    : {
                    url : urlReplace
                },
                success: function(data){
                    $loading.hide();
                    $('#listo').show();
                    $.ajax({
                        type     : 'POST',
                        dataType : 'json',
                        url      : '/ajax/shout/add',
                        data     : {
                            key             : global_data.user_key,
                            body            : cont,
                            privacy         : 0,
                            attachment_type : 3,
                            attachment      : data.data.id

                        } 
                    });
                },
                error: function(){
                    $('#error').show();
                },
                complete: function(){
                    $loading.hide();
                    $('#listo').show();
                }
            });
        });
})(jQuery);