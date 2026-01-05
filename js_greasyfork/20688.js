// ==UserScript==
// @name         Indiegala Helper
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       Kasper
// @match        https://www.indiegala.com/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/20688/Indiegala%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/20688/Indiegala%20Helper.meta.js
// ==/UserScript==
$(document).ready(function(){
	if(window.location.href.indexOf('profile') > -1){
		$('.giveaway-completed').parent().find('.giveaways-list-cont').prepend('<input id="checkAllGiveaways" type="submit" class="btn palette-background-1 right" style="color:white;" value="Check All Giveaways" />');
		$(".giveaway-completed [rel=completed]").attr("onclick","justToggleGivCompletedLib=false;");
		$('#checkAllGiveaways').click(function(e){
			e.preventDefault();
			$('.btn-check-if-won').each(function(i){
				var $this = $(this);
				var entry_id = $( 'input[name="entry_id"]', $this.parent() ).val();
				var response = {};
				response.is_winner = 'false';
				console.log( "### Check if won ajax ### $this.attr('rel'): "+ $this.attr('rel') );
				if ( $this.attr('rel') !== '' ){
					response.is_winner = 'true';
					response.serial = $this.attr('rel');
				}
				handle_check_if_won_response( $this, response, i);

				$.ajax({
					type: "POST",
					url: '/giveaways/check_if_won',
					data: JSON.stringify({ 'entry_id': entry_id }),
					dataType: "json",
					context: $this,
					beforeSend: function(){
						checkIfWonAjaxSemaphore = false;
					},
					success: function(data){}, 
					error: function(){},
					complete: function(){
						checkIfWonAjaxSemaphore = true;
					},
				});
			});
		});
	}else if(window.location.href.indexOf('giveaways') > -1){
		setTimeout(function(){
			window.mode = 0; //0 -Вступать во все раздачи   1-Вступать только в те которых нету     2-Вступать только в те которые есть
			window.b = 0;
			window.z = 0;
			window.k = 0;
			window.k = 0;
			window.k = 0;
			window.k = 0;
			var i,ticket = {};
			for(i = 0;$('.tickets-col').length-1>=i;i++){
				if((mode === 0 || mode === 1) && $('.tickets-col:eq('+i+')').attr('style') === undefined){ 
					ticket[k++] = {
						price:$('.tickets-col:eq('+i+') .ticket-price strong').text(),
						id:$('.tickets-col:eq('+i+') .game-img-cont a').attr('href').replace(/[^0-9]/gim,''),
						name:$('.tickets-col:eq('+i+') .box_pad_5 h2').text()
					};
				}else if((mode === 0 || mode === 2) && ($('.tickets-col:eq('+i+')').attr('style') === 'display: block;' || $('.tickets-col:eq('+i+')').attr('style') === 'display: none;')){
					ticket[k++] = {
						price:$('.tickets-col:eq('+i+') .ticket-price strong').text(),
						id:$('.tickets-col:eq('+i+') .game-img-cont a').attr('href').replace(/[^0-9]/gim,''),
						name:$('.tickets-col:eq('+i+') .box_pad_5 h2').text()
					};
				}
			}
			for(i = 0;(k-1)>=i;i++){
				$.post('/giveaways/new_entry',JSON.stringify({giv_id: ticket[i].id,ticket_price: ticket[i].price})).done(function(data){
					console.log('%c'+(window.z++)+'%c'+data, 'background: #222; color: #f44336', 'background: #222; color: #bada55');
				});
			}
			var x = setInterval(function(){
				b = +$('.right.coins-amount strong').text();
				if(b<=0){
					clearInterval(x);
					GM_notification('Закончились ic\'оны','Indiegala Auto Joiner');
				}
				if(window.z>=(k-1)){
					clearInterval(x);
					if(b>=0){
						window.location = $('.prev-next:eq(2)').attr('href');
					}
				}
				console.log('%c'+window.z+'>='+(k-1), 'background: #222; color: #bada55');
			},500);
		},1000);	
	}
});
function handle_check_if_won_response($this, response, i){
	if (response.is_winner == 'true' ){
		$this.parent().parent().html( '<div class="serial-won"><input value="'+response.serial+'" readonly="" type="text"></div>' );
	}else if ( response.is_winner == 'false' ){
		// not winner
		$this.attr('disabled', true);
		$this.html("You did't win :(");
		setTimeout( function(){ 
			$this.parents('li').fadeOut(400, function(){ $(this).remove(); });
		}, 2000+(i*50));
	}else{
		// error
		$( '.fa', $this ).remove();
		$this.html('<i class="fa fa-refresh" aria-hidden="true"></i> Error. Retry');
	}
}
