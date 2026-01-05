// ==UserScript==
// @name         RecoBotón.
// @namespace    http://www.taringa.net/Cazador4ever
// @match        *://*.taringa.net/posts/*
// @include      *://*.taringa.net/comunidades/*
// @include      *://*.taringa.net/posts/*
// @version      3.1
// @description  Botón para recomendar posts y temas.
// @icon         http://o1.t26.net/images/favicon.ico
// @copyright    @Cazador4ever
// @downloadURL https://update.greasyfork.org/scripts/17431/RecoBot%C3%B3n.user.js
// @updateURL https://update.greasyfork.org/scripts/17431/RecoBot%C3%B3n.meta.js
// ==/UserScript==
(function ($) {
    $('.social-bar.social-bar--bottom').append('<style type="text/css">.reco-caza {-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 100%; height: 40px; cursor: pointer; border: 0 solid rgb(255,255,255); border-bottom: 3px solid rgba(86,135,97,1); -webkit-border-radius: 5em 5em 50em 50em; border-radius: 5em 5em 50em 50em; font: normal 100%/40px Arial, Helvetica, sans-serif; color: rgba(255,255,255,1); text-align: center; -o-text-overflow: clip; text-overflow: clip; background: url("https://k61.kn3.net/6/E/6/1/8/0/AC4.png"), rgb(84, 171, 134); background-repeat: no-repeat; background-position: 27% 40%; -webkit-background-origin: padding-box; background-origin: padding-box; -webkit-background-clip: border-box; background-clip: border-box; -webkit-background-size: 20px auto; background-size: 20px auto; text-shadow: 4px 4px 6px rgba(255,255,255,0.3) ; -webkit-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); } .reco-caza:hover {background: url("https://k61.kn3.net/6/E/6/1/8/0/AC4.png"), rgba(35,155,103,1); background-repeat: no-repeat; background-position: 26% 40%; -webkit-background-origin: padding-box; background-origin: padding-box; -webkit-background-clip: border-box; background-clip: border-box; -webkit-background-size: 20px auto; background-size: 20px auto; } .reco-caza:active {border: none; color: #08683d; background: url("https://k61.kn3.net/6/E/6/1/8/0/AC4.png"), #54AB86; background-repeat: no-repeat; background-position: 26% 40%; -webkit-background-origin: padding-box; background-origin: padding-box; -webkit-background-clip: border-box; background-clip: border-box; -webkit-background-size: 20px auto; background-size: 20px auto; -webkit-transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); -moz-transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); -o-transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }</style><center><HR NOSHADE SIZE=5 COLOR=WHITE><div id="reco" class="reco-caza" title="Compartir en Mi Taringa!">COMPARTIR EN MI TARINGA!</div><img src="https://k61.kn3.net/C/D/5/D/5/3/500.gif" id="loading" width="45" hight="45" style="display:none" /><img src="https://k61.kn3.net/7/B/6/E/4/C/AEA.png" width="45" hight="45" id="listo" style="display:none" /><img src="https://k60.kn3.net/F/2/3/9/A/1/9A1.png" width="45" hight="45" id="error" style="display:none" /></center>');
    $('#reco').on('click', function shout() {
        $('.icon-pulgararriba').click();
        var link = ''+document.URL+'';
        var $split = link.split('/');
        var urlFinal = $split[$split.length-1];
        var urlReplace = link.replace(urlFinal, "");
        var usuario = $('.user.textlimit.truncate').prop('href').replace(/.*?:\/\/classic.taringa.net/, "").substring(1).trim();
        var cont = '@'+ usuario +''+'\r\n'+'['+ usuario +']'+' '+'['+'['+ usuario +']'+']'+' '+'['+'['+'[' + usuario + ']'+']'+']'+' '+'['+'['+'['+'[' +usuario + ']'+']'+']'+']'+' '+'['+'['+'['+'['+'['+ usuario + ']'+']'+']'+']'+']'+'\n';
        var $loading = $('#loading');
        $("#reco").hide();
        $loading.show();
        $.ajax({
            type    : 'POST',
            dataType: 'json',
            url     : '/ajax/shout/attach',
            data    : {
                url : link
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
            }
        });
    });
})(jQuery);