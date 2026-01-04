// ==UserScript==
// @name         posts/temas react
// @namespace    taringa.net/Needrom
// @version      0.0
// @description  reactivar post y temas en masa
// @author       Needrom
// @include      *://*.taringa.net/*
// @include      *://*.poringa.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40026/poststemas%20react.user.js
// @updateURL https://update.greasyfork.org/scripts/40026/poststemas%20react.meta.js
// ==/UserScript==
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="https://www.taringa.net/bulk-post" target=_blank>»Bulk posts</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="https://www.taringa.net/bulk-temas" target=_blank>»Bulk temas</a></li>');

if (window.location == "https://www.taringa.net/bulk-post"){
$('.tabbed-d,#sidebar,.colorpicker,#full-col,.tabs').remove();
//$('#main-col').append('<div class="mododios"><textarea id="my-list-ce" class="suggest body form-input-text" tabindex="700" placeholder="Causa de la eliminación" autocomplete="off" style="background: rgb(255, 255, 255); overflow: hidden; width: 651px; height: 30px;"></textarea><br></br><textarea id="my-list-pd" class="suggest body form-input-text" tabindex="700" placeholder="Agregar ID´s de post..." autocomplete="off" style="background: rgb(255, 255, 255); overflow: hidden; width: 651px; height: 300px;"></textarea><br></br><input class="btn a reactivar" value="Reactivar" type="button"><input class="btn r eliminar" value="Eliminar" type="button"><br>');
$('#main-col').append('<div class="mododios"><textarea id="my-list-pr" class="suggest body form-input-text" tabindex="700" placeholder="Agregar ID´s de post..." autocomplete="off" style="background: rgb(255, 255, 255); overflow: hidden; width: 651px; height: 300px;"></textarea><br></br><input class="btn  limp" value="Limpiar lista" type="button"><input class="btn a reactivar" value="Reactivar" type="button"><br>');
$(document).on('click', '.reactivar', function() {
var keys = global_data.user_key;
    var mylist = $('#my-list-pr').val().replace(/$(\s)*/gm, "\n").split("\n");
    for (var i = 0; i < mylist.length; i++) {
       $.ajax({
			url: window.location.protocol+"//"+document.domain+"/admin/reactivar-post.php",
			type: "POST",
			data: {postid: mylist[i], key: keys},
        });
    }
    if(i>=mylist.length){
            alert("Posts reactivados satisfactoriamente!");
        }
});
    $(document).on('click', '.limp', function() {
        $('#my-list-pr').val("");
});
}
if (window.location == "https://www.taringa.net/bulk-temas"){
$('.tabbed-d,#sidebar,.colorpicker,#full-col,.tabs').remove();
$('#main-col').append('<div class="mododios"><textarea id="my-list-tr" class="suggest body form-input-text" tabindex="700" placeholder="Agregar ID´s de temas..." autocomplete="off" style="background: rgb(255, 255, 255); overflow: hidden; width: 651px; height: 300px;"></textarea><br></br><input class="btn  limp" value="Limpiar lista" type="button"><input class="btn a reactivarT" value="Reactivar" type="button"><br>');

$(document).on('click', '.reactivarT', function() {
var keys = global_data.user_key;
    var mylist = $('#my-list-tr').val().replace(/$(\s)*/gm, "\n").split("\n");
    for (var i = 0; i < mylist.length; i++) {
     $.ajax({
			url: window.location.protocol+"//"+document.domain+"/comunidades/tema-reactivar.php",
			type: "POST",
			data: {temaid: mylist[i], key: keys},
        });
}
    if(i>=mylist.length){
            alert("Temas reactivados satisfactoriamente!");
        }
});
    $(document).on('click', '.limp', function() {
        $('#my-list-tr').val("");
});
}