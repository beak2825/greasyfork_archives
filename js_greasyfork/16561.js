// ==UserScript==
// @name       ClonPost(v6)
// @version    1.4
// @description  Clonador de posts, clona cualquier post solo poniendo la Id. (el famoso repost)
// @match       *://classic.taringa.net/agregar
// @include     *://*.taringa.net/agregar
// @include     *://*.taringa.net/posts/editar/*
// @copyright  @Cazador4ever
// @namespace http://www.taringa.net/Cazador4ever
// @icon http://o1.t26.net/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/16561/ClonPost%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16561/ClonPost%28v6%29.meta.js
// ==/UserScript==
/* jshint -W097 */
(function($) {
    var boton;
    boton = '<style>.cazador {display: inline-block; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100px; height: 30px; cursor: pointer; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; border: 2px solid rgba(0,93,171,0.18); -webkit-border-radius: 2px; border-radius: 2px; font: normal 15px/normal "Courier New", Courier, monospace; color: rgb(0, 0, 0); -o-text-overflow: ellipsis; text-overflow: ellipsis; background: rgb(237, 246, 255); -webkit-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 502ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .cazador:hover {width: 150px; border: 2px solid rgba(0,93,171,0.32); background: rgb(224, 241, 255); -webkit-transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275); -moz-transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275); -o-transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275); transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275); -webkit-transform: rotateX(3.437746770784939deg) rotateY(5.156620156177409deg) rotateZ(-2.291831180523293deg)   ; transform: rotateX(3.437746770784939deg) rotateY(5.156620156177409deg) rotateZ(-2.291831180523293deg)   ; } .cazador:focus {width: 140px; cursor: default; border: 1px solid #005DAB; font: italic normal normal 15px/normal "Courier New", Courier, monospace; color: rgb(0, 93, 171); background: rgba(211,218,255,1); -webkit-transition: all 601ms cubic-bezier(0.785, 0.135, 0.15, 0.86); -moz-transition: all 601ms cubic-bezier(0.785, 0.135, 0.15, 0.86); -o-transition: all 601ms cubic-bezier(0.785, 0.135, 0.15, 0.86); transition: all 601ms cubic-bezier(0.785, 0.135, 0.15, 0.86); -webkit-transform: none; transform: none; }.btn-caza {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; cursor: pointer; padding: 0.75em 1em; border: none; -webkit-border-radius: 2px; border-radius: 2px; font: normal 11px/normal Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); -o-text-overflow: clip; text-overflow: clip; background: rgb(0, 93, 171); text-shadow: 0 -1px 0 rgb(91,129,17) ; } .btn-caza:hover {background: rgb(0, 140, 255); -webkit-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms; -moz-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms; -o-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms; transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms; -webkit-transform: rotateZ(-6.302535746439055deg)   ; transform: rotateZ(-6.302535746439055deg)   ; } .btn-caza:active {color: rgb(0, 82, 170); background: rgb(155, 210, 255); -webkit-box-shadow: 0 1px 4px 0 rgb(65,105,23) inset; box-shadow: 0 1px 4px 0 rgb(65,105,23) inset; -webkit-transition: none 0 cubic-bezier(0.25, 0.1, 0.25, 1); -moz-transition: none 0 cubic-bezier(0.25, 0.1, 0.25, 1); -o-transition: none 0 cubic-bezier(0.25, 0.1, 0.25, 1); transition: none 0 cubic-bezier(0.25, 0.1, 0.25, 1); -webkit-transform: none; transform: none; }</style><center><input type="text" class="cazador" name="PostId" id="PostId" autocomplete="on" placeholder="Id del post." title="Colocar el Id del post que es el numero que aparece antes del título y espere un momento."><button class="btn-caza" id="clonarpost"><font color="#fff">Clonar</font></button></center>';
    $('#sidebar').prepend(boton);
    $("#clonarpost").on('click', function clon() {
        var id = $('#PostId').val();
        var api = 'http://api.taringa.net/post/view/' + id;
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.title;
            var d = json.body;
            var c = ''+d+'';
            a.val(body+c).click().focus();
            titulo.val(tit).click().focus();});
    });
})(jQuery);