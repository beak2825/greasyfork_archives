// ==UserScript==
// @name         GramFree (Pescador de Cripto)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Script desenvolvido para rodar automaticamente. Executar o free roll, assinar os contratos e assistir os videos.
// @author       Jadson Tavares
// @match        *://gramfree.net/*
// @match        *://gramfree.top/*
// @match        *://gramfree.online/*
// @match        *://gramfree.mobi/*
// @match        *://gramfree.one/*
// @match        *://gramfree.network/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402291/GramFree%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402291/GramFree%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

var body = $('.navbar-wrapper');
body.append(
        $('<div/>').attr('style',"z-index:999;width:100%;background-color:#10163a;color: #ffffff; text-align: center;border-radius: 0px 0px 10px 10px;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<a/> text-align: center; color:#ffffff;').text("Script desenvolvido por Jadson Tavares. Seja meu referido! ;) (Clique para copiar o link)"))
                    .append($('<p/>')
                    )
            ).click(function(){
            var $temp = $('<input>').val("https://GramFree.world/?r=174440");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 0px;  text-align: center; }")
)

//GramFree
function gramFree() {
$(document).ready(function(){
	setInterval(function(){
		var cardText = $('.time-next-roll').text();
		if (cardText == ' ' || cardText == '') {
			$('.time-roll').find(':button').click();
		}
	},5000);
	/*setTimeout(function(){
			if ($('.custom-control-label').is(':visible')) {
				$('.custom-control-label').click();
			}
	},1000);*/
    //Free Roll
	setInterval(function(){
		if ($('#next-roll-time').text() == 'Time to Roll!') {
			$('#roll-button').click();
            setInterval(function(){
                window.location.href = '/smartContracts';
            }, 5000);
		}
	},5000);
    //Videos
    if($(".add-to-cart").is(':visible')){
        $(".badge-primary").each(function(i) {
            var btn = $(this);
            var whtVideo = btn.parent().parent().parent().parent().find('.watch-btn');
            setTimeout(whtVideo.trigger.bind(whtVideo, "click"), i * 65000);
        });
        setInterval(function(){
            if(!$(".badge-primary").is(':visible')){
                window.location.href = '/free';
            }
        }, 5000);
    }
    //Contracts
    if($(".content-header-title").text() == 'Smart Contracts'){
        $('#sing-butn').click();
        setTimeout($(".take-contract").click(), 1000);
        setTimeout(function(){
            $(".send-contract").each(function(i) {
                var btn = $(this);
                var cnf = $('.btn-primary');
                setTimeout(btn.trigger.bind(btn, "click"), i * 3000);
                setInterval(function(){
                    if($('.btn-primary').is(':visible')){
                        $('.btn-primary').click();
                    }
                }, 2000);
            });
        }, 3000);
        setInterval(function(){
            if(!$(".send-contract").is(':visible') && !$(".take-contract").is(':visible')){
                window.location.href = '/videos';
            }
        }, 5000);
    }
	setInterval(function(){
		if(!$(".watch-btn").is(':visible')){
			window.history.go(0);
		}
    },300000);
});
}

gramFree();
})();