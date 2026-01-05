// ==UserScript==
// @name         likeador 3000
// @namespace    Clasificado
// @version      0.2
// @description  likea shouts a un user predeterminado dentro del feed
// @author       Yo
// @match        *://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28376/likeador%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/28376/likeador%203000.meta.js
// ==/UserScript==

$('#sidebar').prepend('<div class="userlike"><textarea id="nickuser" placeholder="Nick del user sin @" style="height: 20px; width: 205px; resize: none"></textarea><button type="button" style="float: right;" class="userlikear btn"><span class="ui-button-text">Likear ♥</span></button></div>');

$(document).on('click','.userlikear',function ass(){
var globaluserkey = $("#key").attr('data-userkey');
$('.avatar').each(function like(){
   var user= '/'+$('#nickuser').val().trim();
    var ver= $(this).attr('href');
    if (ver==user){
        var id= $(this).parents().find('.shout-footer').find('.s-action-list').attr('data-id');
        var owner= $(this).parents().find('.shout-footer').find('.s-action-list').attr('data-owner');
        $.ajax({
		url: '/ajax/shout/vote',
		type: 'post',
		dataType: 'json',
		data: {
			key: globaluserkey,
			owner: owner,
			uuid: id,
			score: 1
		},
        success:function ok(){alert('shout-like: '+id);},
    });
}
});
});