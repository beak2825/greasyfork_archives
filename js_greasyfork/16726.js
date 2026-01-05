// ==UserScript==
// @name       TemaCLon(v6)
// @version    1.1
// @description  Clonador de temas.
// @match      *://*.taringa.net/comunidades/*/agregar/
// @include    *://*.taringa.net/comunidades/*/agregar/
// @copyright  @Cazador4ever
// @icon http://o1.t26.net/images/favicon.ico
// @namespace http://www.taringa.net/Cazador4ever
// @downloadURL https://update.greasyfork.org/scripts/16726/TemaCLon%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16726/TemaCLon%28v6%29.meta.js
// ==/UserScript==
(function($) {
    var clonar = $('<style type="text/css">'+
                   '.input-tema {display: inline-block; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100px; height: 30px; cursor: pointer; top: 0; right: 0; bottom: 0; left: 0; padding: 0 20px; overflow: hidden; border: 1px dotted rgba(140,140,140,1); -webkit-border-radius: 10px; border-radius: 10px; font: normal 12px/normal "Courier New", Courier, monospace; color: rgba(0,0,0,1); text-decoration: normal; -o-text-overflow: ellipsis; text-overflow: ellipsis; background: rgba(0,93,171,0.08); -webkit-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .input-tema:hover {width: 120px; border: 1px dashed rgba(140,140,140,1); -webkit-border-radius: 21px; border-radius: 21px; color: rgba(0,93,171,0.5); background: rgba(0,93,171,0.13); -webkit-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .input-tema:focus {width: 150px; cursor: default; padding: -13px 20px 0; border: 1px solid rgba(140,140,140,1); color: rgba(0,93,171,1); background: rgba(0,93,171,0.35); -webkit-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 601ms cubic-bezier(0.68, -0.75, 0.265, 1.75); }'+
                   '.CL-BTN {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 50px; height: 20px; content: ; cursor: pointer; top: auto; right: auto; bottom: auto; left: auto; outline: none; border: none; -webkit-border-radius: 100px; border-radius: 100px; font: normal 12px/normal Arial, Helvetica, sans-serif; color: rgba(255,255,255,0.9); text-decoration: none; text-align: center; text-indent: 0; -o-text-overflow: clip; text-overflow: clip; letter-spacing: 0; white-space: normal; word-spacing: 0; word-wrap: ; background: rgba(52,106,216,1); -webkit-transition: all 0 cubic-bezier(0.25, 0.25, 0.75, 0.75); -moz-transition: all 0 cubic-bezier(0.25, 0.25, 0.75, 0.75); -o-transition: all 0 cubic-bezier(0.25, 0.25, 0.75, 0.75); transition: all 0 cubic-bezier(0.25, 0.25, 0.75, 0.75); } .CL-BTN:hover {opacity: ; outline: ; background: rgba(92,134,219,1); } .CL-BTN:active {background: rgba(157,178,219,1); }'+
                   '</style><center><input type="text" class="input-tema" name="TemaId" id="TemaId" autocomplete="on" placeholder="Id del tema." title="Colocar el Id del tema que es el numero que aparece antes del título y espere un momento."><input type="button" id="clonartema" class="CL-BTN" value="Clonar" /></center>');
    $('#sidebar').prepend(clonar);
    $('#clonartema').on('click', function clon() {
        var id = $('#TemaId').val();
        var api = 'http://api.taringa.net/topic/view/' + id;
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.title;
            var d = json.body;
            var c = ''+d+'';
            a.val(body+c).click().focus();
            titulo.val(tit).click().focus();
        });
    });
})(jQuery);