// ==UserScript==
// @name         RecoPostRSS
// @match        *://*.taringa.net/mi
// @include      *://*.taringa.net/mi/notificaciones
// @include      *://*.taringa.net/mi/
// @version      2.8
// @description  Recomienda el ultimo post creado del usuario que coloques (sin arroba). (hecho con la ayuda de @Huyi <3)
// @icon         http://o1.t26.net/images/favicon.ico
// @copyright    @Cazador4ever y @Huyi
// @grant        none
// @namespace http://www.taringa.net/Cazador4ever | http://www.taringa.net/Huyi
// @downloadURL https://update.greasyfork.org/scripts/16810/RecoPostRSS.user.js
// @updateURL https://update.greasyfork.org/scripts/16810/RecoPostRSS.meta.js
// ==/UserScript==
/* jshint -W097 */
(function ($){
    var contenido = $('<style>.input-caza {display: inline-block; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100px; height: 25px; cursor: pointer; top: 0; right: 0; bottom: 0; left: 0; padding: 0 20px; overflow: hidden; border: 1px solid #52A8E8; -webkit-border-radius: 2px; border-radius: 2px; font: normal 15px/normal Arial, Helvetica, sans-serif; color: #003d70; text-decoration: normal; -o-text-overflow: ellipsis; text-overflow: ellipsis; background: #bfe4ff; -webkit-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .input-caza:hover {width: 150px; -webkit-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .input-caza:focus {cursor: default; padding: -13px 20px 0; -webkit-border-radius: 5px; border-radius: 5px; font: italic normal normal 15px/normal Arial, Helvetica, sans-serif; color: #005DAB; background: #e5f4ff; -webkit-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); }</style><center><div class="box" Style="border-radius: 5px 5px 5px 5px;-moz-border-radius: 5px 5px 5px 5px;-webkit-border-radius: 5px 5px 5px 5px;border: 0px solid #000000;"><input class="input-caza" type="text" name="user" id="usuario" autocomplete="on" placeholder="Nick del usuario" title="Colocar el nick del Usuario a recomendar sin @ (arroba) y dar click en recomendar."><button id="recom" class="btn a"><font color="#fff">Recomendar</font></button><img src="https://k61.kn3.net/8/2/D/5/2/7/1FE.gif" id="cargando" style="display:none" /><img src="https://k61.kn3.net/FEF3DDEDC.gif" id="error" style="display:none" /></div></center></div>');
    $('#sidebar').prepend(contenido);
    var $recomendar = $('#recom');
    var $usuario = $('#usuario');
    $recomendar.on('click', function reco () {
        $recomendar.addClass("btn.v");
        var user = $usuario.val().trim();
        var api = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fclassic.taringa.net%2Frss%2F'+ user +'%2Fposts%2F';
        $.getJSON( api, function(json) {
            var enlace = json.items[0].link;
            var cont = '@'+ user +''+'\r\n'+'['+ user +']'+' '+'['+'['+ user +']'+']'+' '+'['+'['+'[' + user + ']'+']'+']'+' '+'['+'['+'['+'[' +user + ']'+']'+']'+']'+' '+'['+'['+'['+'['+'['+ user + ']'+']'+']'+']'+']'+'\n';
            $recomendar.hide();
            $usuario.hide();
            $('#cargando').show();
            $.ajax({
                type    : 'POST',
                dataType: 'json',
                url     : '/ajax/shout/attach',
                data    : {
                    url : enlace
                },
                success: function(data){
                    $.ajax({
                        type     : 'POST',
                        dataType : 'json',
                        url      : '/ajax/shout/add',
                        data     : {
                            key             : global_data.user_key,
                            body            : cont,
                            privacy         : 1,
                            attachment_type : 3,
                            attachment      : data.data.id
                        }
                    });
                    $('#cargando').hide();
                },
                error: function(){
                    $recomendar.hide();
                    $usuario.hide();
                    $('#error').show();
                },
                complete: function(){
                    $recomendar.show();
                    $usuario.show();
                    $recomendar.addClass("btn.a");
                    $usuario.val('');
                }
            });
        });
    });
})(jQuery);