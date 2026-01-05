// ==UserScript==
// @name         Eliminar Shouts a partir de Hashtag
// @namespace    Needrom
// @version      0.4
// @description  Devuelve 10 paginas de shouts con un determinado Hashtag
// @author       Yo
// @include      *://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28669/Eliminar%20Shouts%20a%20partir%20de%20Hashtag.user.js
// @updateURL https://update.greasyfork.org/scripts/28669/Eliminar%20Shouts%20a%20partir%20de%20Hashtag.meta.js
// ==/UserScript==

$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="https://www.taringa.net/hashtag2=eliminar" target=_blank>»Hashtag</a></li>');

if (window.location.href.search("hashtag2=eliminar") !== -1){
	$('.v6-content').remove();
	$('.v6-container').prepend('<div style="float:right"><input type="checkbox" id="marcarTodo"><button id= "shoutelim1">Eliminar</button><button id= "shoutelim">Eliminar y Anotar</button></div><div style="margin: 20px;"><textarea id="hashtags" placeholder="hashtag" style="width:300px; height: 20px;resize: none; "></textarea><br><input type="button" id="ver" value="Obtener" style="height: 28px; background:#4cadfc; color: white; float: left;"/><br></div>');
$(document).on("click","#ver",function(){
    for(j=0;j<11;j++){
    $('.v6-container').append('<div class="mas'+j+' style="margin: 10px;"></div>');
    var h='//www.taringa.net/serv/more/hashtag?tag='+$('#hashtags').val().trim()+'&page='+j+' .shout-item';
    $(".mas"+j).load(h ,function(){
        $('input#myChecke').remove();
        $(".shout-user-info__admin").prepend('<input type="checkbox"  id="myChecke">');
    });
    }
});

$(document).on("click","#shoutelim",function(){
 var r = confirm("Eliminar Shouts seleccionados?");
if (r === true) {
$("input#myChecke:checked").each(function(){
    var shoutid = $(this).parent().parent().parent().parent().parent().attr('data-fetchid');
    var owner = $(this).parent().parent().find(".hovercard").attr('data-uid');
    var linkshouts = $(this).parent().parent().parent().parent().parent().find('.shout-main-content').find('.light-shoutbox').attr('href');
 $.ajax({
            type: 'POST',
            url: '//'+document.domain+'/ajax/shout-delete.php',
            data: {id: shoutid, owner: owner},
            success: function (){
                $.post( "//"+document.domain+"/admin/agregar-nota-historial-users.php", { id: owner, valor: linkshouts });
                var obt='#item_'+shoutid;
                $(obt).remove();}
});
});
}
});
    $(document).on("click","#shoutelim1",function(){
 var r = confirm("Eliminar Shouts seleccionados?");
if (r === true) {
$("input#myChecke:checked").each(function(){
    var shoutid = $(this).parent().parent().parent().parent().parent().attr('data-fetchid');
    var owner = $(this).parent().parent().find(".hovercard").attr('data-uid');
    var linkshouts = $(this).parent().parent().parent().parent().parent().find('.shout-main-content').find('.light-shoutbox').attr('href');
 $.ajax({
            type: 'POST',
            url: '//'+document.domain+'/ajax/shout-delete.php',
            data: {id: shoutid, owner: owner},
            success: function (){
                var obt='#item_'+shoutid;
                $(obt).remove();}
});
});
}
});
    $("#marcarTodo").change(function () {
        if ($(this).is(':checked')) {
            $("input#myChecke").prop('checked', true);
        } else {
            $("input#myChecke").prop('checked', false);
        }
    });

}