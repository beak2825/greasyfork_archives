// ==UserScript==
// @name         CazaTools(BETA)(v6)
// @namespace    CazaTools
// @version      0.9
// @description  Herramientas para automatizar acciones en Taringa.net (v6). (BETA)
// @author       @Cazador4ever
// @match        http*://*.taringa.net/mi
// @include      http*://*.taringa.net/posts/*
// @include      http*://*.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24506/CazaTools%28BETA%29%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24506/CazaTools%28BETA%29%28v6%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    function cazaTools() {
        function getRnd(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        var exists = !!$('#cazaTools').length;
        if ( !exists ) {
            $('body').append('<style type="text/css">.cTools {-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; float: right; width: 100px; position: fixed; top: 44%; left: 2px; padding: 10px 0; overflow: auto; border: none; -webkit-border-radius: 10px; border-radius: 10px; font: normal 16px/1 "Lucida Console", Monaco, monospace; color: rgb(255, 255, 255); text-align: center; -o-text-overflow: ellipsis; text-overflow: ellipsis; background: rgba(40,40,40,0.11); -webkit-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); -moz-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); -o-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); } .cTools:hover {font: normal normal bold 16px/1 "Lucida Console", Monaco, monospace; background: rgba(0,0,0,0.25); }</style>' +
                             '<style type="text/css">.cBtn {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 30px; height: 30px; cursor: pointer; margin: auto; padding: 0 auto auto; border: 1px solid rgba(255,255,255,0.3); -webkit-border-radius: 5px; border-radius: 5px; font: normal 12px/normal "Lucida Console", Monaco, monospace; color: rgba(255,255,255,0.9); -o-text-overflow: clip; text-overflow: clip; background: #000000; -webkit-box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) ; box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) ; -webkit-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); -moz-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); -o-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); } .cBtn:hover {border: 1px solid rgba(255,255,255,0.5); } .cBtn:active {border: 1px solid rgba(255,255,255,0.58); -webkit-box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) inset; box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) inset; }</style>' +
                             '<div id="cazaTools" class="cTools" style="position: fixed;">' +
                             '<button id="reload" title="Recargar la pagina" class="cBtn"><img src="https://k60.kn3.net/8/2/2/B/7/7/B79.png" height="24" width="24"></button>' +
'<button id="save" title="Guardar la apgina en archive.is" class="cBtn"><img src="http://www.scienceclass411.com/images/stylistica-icons-set/png/128x128/save.png" height="24" width="24"></button>'+
                             '<button id="likeador" title="Dar like a shouts" class="cBtn"><img src="https://k60.kn3.net/A/3/2/D/D/C/99C.png" height="24" width="24"></button>' +
                             '<button id="recomendar" title="Recomendar un post (funciona solo cuando estemos en el mismo post)" class="cBtn"><img src="https://k61.kn3.net/9/1/B/B/B/E/F0B.png" height="24" width="24"></button>' +
                             '<button id="compartir" title="Compartir la pagina en donde estamos" class="cBtn"><img src="https://k61.kn3.net/6/F/7/D/4/D/ABF.png" height="24" width="24"></button>' +
                             '<button id="scroll" class="cBtn" title="¡Subir Arriba!"><img src="http://o1.t26.net/img/arrowtop.png" height="24" width="24"></button>'+
                             '</div>');


        }
        $('#reload').on('click', function(){
            location.reload(true);
        });
$('#save').on('click', function(){
            void(open('https://archive.is/?run=1&url='+encodeURIComponent(document.location)));
        });
        $('#likeador').on('click', function(){
            $(".require-login.button-action-s.action-vote.hastipsy.pointer").click();
        });
        $('#scroll').click(function() {
            scrollTo(0, 0);
        });
        $('#compartir').on('click', function(){
            var link = ''+document.URL+'';
            var cont;
            $.ajax({
                type    : 'POST',
                dataType: 'json',
                url     : '/ajax/shout/attach',
                data    : {
                    url : link
                },
                success: function(data){
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
                    alert('¡Error, no se pudo compartir el link, intente nuevamente!');
                },
                complete: function(){
                    console.info('¡Listo!');
                }
            });

        });
        $('#recomendar').on('click', function() {
            var link = ''+document.URL+'';
            var usuario = $('.user.textlimit.truncate').text();
            var cont = '['+'['+'['+'['+ usuario +']'+']'+']'+']\n'+'@'+ usuario +'';
            $.ajax({
                type    : 'POST',
                dataType: 'json',
                url     : '/ajax/shout/attach',
                data    : {
                    url : link
                },
                success: function(data){
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
                    alert('¡Error, no se pudo compartir el post, intente nuevamente!');
                },
                complete: function(){
                    console.info('¡Listo!');
                }
            });
        });
    }
    console.info('-¿Para que nos caemos? -Para aprender a levantarnos.');
cazaTools();
})(jQuery);