// ==UserScript==
// @name        Taringa - Anticreadores
// @namespace   https://greasyfork.org/es/users/29399-cl0n3r
// @description Desaparece posts, shouts y comentarios de usuarios con creadores y usuarios bloqueados en Taringa.net
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://www.taringa.net/*
// @version     1.0
// @license     GPLv3
// @icon        http://rebrand.ly/icon498
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34393/Taringa%20-%20Anticreadores.user.js
// @updateURL https://update.greasyfork.org/scripts/34393/Taringa%20-%20Anticreadores.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var path = window.location.pathname;
var url_posts = /^\/$|^\/pagina(\d*)$|^\/posts(\/[\w-]+)?(\/[\w-]+)?$/;
var url_post_dentro = /^\/posts\/[\w-]+\/\d+\/[\w-]+(.html)/;
var url_shouts = /^\/shouts|^\/hashtag/;
var url_shout_dentro = /^\/[\w-]+\/mi\/\w+/;

var bloqueados = [];
var animacion="fast";

/*********************************FUNCIONES GENERALES*********************************/

function onElementHeightChange(elm, callback){
	var lastHeight = elm.clientHeight, newHeight;
	(function run(){
		newHeight = elm.clientHeight;
		if( lastHeight != newHeight )
			callback();
		lastHeight = newHeight;

		if( elm.onElementHeightChangeTimer )
			clearTimeout(elm.onElementHeightChangeTimer);

		elm.onElementHeightChangeTimer = setTimeout(run, 200);
	})();
}


function carga_cache(){
	
	if(logeado() === true){

		if(localStorage.getItem("bloqueados_cache") === null){
			$.ajax({
				url:'//www.taringa.net/cuenta',
				 type:'GET',
				 async: false,
				 success: function(data){
						$(data).find("div#blocked-tab-account > fieldset > div.bloqueadosList > div.list-element > a").each(function(i,obj) {
							bloqueados[i]=$(obj).text();
						});
				 }
			});

			localStorage.setItem("bloqueados_cache", JSON.stringify(bloqueados));
		}
		else{
			bloqueados = JSON.parse(localStorage.getItem("bloqueados_cache"));
		}
		bind_events();
	}
	else{
		clean_cache();
	}
}

function update_cache(){
	clean_cache();
	setTimeout(carga_cache, 1000);
}

function clean_cache(){
	bloqueados.length = 0;
	localStorage.removeItem("bloqueados_cache");
}

function bind_events(){
	
	$("div.perfil-data > div.perfil-info > div.bloquear > a[name='unblock'], div.perfil-data > div.perfil-info > div.bloquear > a[name='uBlock']").click(function(){
		update_cache();
	});
	
	$("div.perfil-data > div.perfil-info > div.bloquear > a[name='block']").click(function(){
		block_warning("div.ui-dialog > div.ui-dialog-buttonpane > div.ui-dialog-buttonset > button.ui-button-positive",200);
	});
	
	$("div.bloqueadosList > div.list-element > span.value > a").click(function(){
		update_cache();
	});
	
	$("aside.nav-user > div.login > div.user-actions > div.user-action > div#tool-profile > ul > li > a#v6_logout").click(function(){
		clean_cache();
	});
	
	$("aside.nav-user > div.fb-login > a.login-btn, aside.nav-user > a.btn-signup").click(function(){
		clean_cache();
	});
	
	$("div#main > div.reg-form > div.reg-wr > div.reg-ct > form > div.divider.bt > a").click(function(){
		clean_cache();
	});
}

function block_warning(selector, delay){
	if($(selector).length > 0){
		$(selector).click(function(){update_cache();});
		return;
	}
	else {
		setTimeout(function() {block_warning(selector, delay);}, delay);
	}
}

function logeado(){
	
	if($("aside.nav-user > div.login > div.user-actions > div.user-action > a.tool-profile > span.user-name").length > 0){
		return true;
	}
	else{
		return false;
	}
}

function es_creador(recompensa,tipo){
	
	if(recompensa === true && tipo !== "points"){
		return true;
	}
	else{
		return false;
	}
}

/*********************************HOME*********************************/

function destacados(){
	
  $("section.content-left > div.list-l > ul > li > div.meta > a.usuario").each(function(i,obj) {
		var user = [];
		var url_img;
		user[i]=$(obj).attr('title');

		if(bloqueados.includes(user[i]) === true){
			$(obj).parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
				if(es_creador(data.rewards_active,data.rewards_type) === true){
					$(obj).parent().parent().fadeOut(animacion, function(){$(this).remove();});
				}
				else{
					url_img=$(obj).parent().parent().children("a.list-l__avatar").children("img[orig]").attr("orig");
					$(obj).parent().parent().children("a.list-l__avatar").children("img[orig]").attr("src", url_img);
				}
			});
		}
  });
	
	$("main.v6-content").css("min-height", "2400px");
}

function tops_recomendados(){
	
  $("section.content-right > div.list-top-posts > ul > li > a, .content-right > div.list-recomendados > ul > li > a").each(function(i,obj) {
		var post = [];
		var post_id = [];
		var nick;
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
	  $.get('https://api.taringa.net/post/view/'+post_id[3], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true){
							$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
	});
	
	$("section.content-right > div.list-recomendados > div.header > div.action-select > ol > li > a").click(function(){
		setTimeout(tops_recomendados, 2500);
	});
}

function mas_buscados(){
	
  $("section.content-right > div.list-seo-posts > ul > li > a").each(function(i,obj) {
		var post = [];
		var post_id = [];
		var nick;
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
	  $.get('https://api.taringa.net/post/view/'+post_id[3], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
  });
}

function top_usuarios(){
	
	$("div.top-usuarios > ul > li > a[href]").each(function(i,obj) {
		var url = [];
		var nick;
		
		url[i]=$(obj).attr('href');
		nick=url[i].substr(1);
											 
		if(bloqueados.includes(nick) === true){
			$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+nick, function(data){
					if(es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

function shouts_trend(){
	
  $("div.shout-sidebar > section.trend > article.shoutsb > a.icon-usuarios > span").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();

		if(bloqueados.includes(user[i]) === true){
			$(obj).parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
					if(es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

/*********************************POSTS*********************************/

function post(){
	
	var user_post=$("div.widget-usuario > div.main-info > a.user").text();
	
	if(bloqueados.includes(user_post) === true){
		$("div.container-post > footer > div.box-acciones > div.row--puntos").remove();
		$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.share-bt").remove();
		$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.favorite-post-post").remove();
		$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.follow-post-post").remove();
		$("div.widget-usuario > div.main-info > div.follow-buttons").remove();
	}
	else{
		$.get('https://api.taringa.net/user/nick/view/'+user_post, function(data){
			if(es_creador(data.rewards_active,data.rewards_type) === true){
				$("div.container-post > footer > div.box-acciones > div.row--puntos").remove();
				$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.share-bt").remove();
				$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.favorite-post-post").remove();
				$("div.container-post > footer > div.box-acciones > div.row--stats > div.post-social-media > a.follow-post-post").remove();
				$("div.widget-usuario > div.main-info > div.follow-buttons").remove();
			}
		});
	}
}

function comentarios(){
	
	$("div.nav-pages > ul.clearfix > li > a,div.nav-pages > a.before,div.nav-pages > a.next").click(function(){
		setTimeout(comentarios, 2500);
	});
	
	$("article.comment-replies-container > div.comment > div.comment-actions > ul > li.bloquear > a").click(function(){
		update_cache();
		block_warning("div.ui-dialog.bloquear-usuario.warning > div.ui-dialog-buttonpane > div.ui-dialog-buttonset > button.bt-bloquear.ui-button-positive",200);	
	});

	respuestas();

	$("article.comment-replies-container > div.comment > div.comment-text > div.comment-author > span > a.hovercard").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();
		
		if(bloqueados.includes(user[i]) === true){
				$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
				if(es_creador(data.rewards_active,data.rewards_type) === true) {
					$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
				}
			});
		}
	});
}

function respuestas(){
	
	$("article.comment-replies-container > div.more-replies > a").click(function(){
		setTimeout(respuestas, 2000);
	});
	
	$("article.comment-replies-container > div.comment-replies > div.comment > div.comment-actions > ul > li.bloquear > a").click(function(){
		update_cache();
		block_warning("div.ui-dialog.bloquear-usuario.warning > div.ui-dialog-buttonpane > div.ui-dialog-buttonset > button.bt-bloquear.ui-button-positive",200);
	});
	
	
	$("article.comment-replies-container > div.comment-replies > div.comment > div.comment-text > div.comment-author > a").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();
		
		if(bloqueados.includes(user[i]) === true){
				$(obj).parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
				if(es_creador(data.rewards_active,data.rewards_type) === true) {
					$(obj).parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
				}
			});
		}
	});
}

function relacionados_destacados_tops(){
	
	recomendados_derecha();
	recomendados();
	
	$("div.reco-container-v2 > div.reco-col-1 > div.clearfix > div.reco-thumb1 > a").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
		$.get('https://api.taringa.net/post/view/'+post_id[5], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
	});
	
	$("div.reco-container-v2 > div.reco-col-2 > div > a").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
		$.get('https://api.taringa.net/post/view/'+post_id[5], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
	});
	
	$("div.reco-container-v2 > div.reco-col-3 > div.reco-rel-container > a").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
		$.get('https://api.taringa.net/post/view/'+post_id[3], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
	});
}

function recomendados_derecha(){
	
	$("div.sidebar > nav > div.widget-relacionados > ul > li.sidebar-reco > a.sidebar-reco__overlay").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
		$.get('https://api.taringa.net/post/view/'+post_id[5], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).hide();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().fadeOut(animacion, function(){$(this).hide();});
						}
				});
			}
		});
	});
}

function recomendados(){
	
	$("div.posts-relacionados > div.item-post > a.item-post__overlay").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");
		
		$.get('https://api.taringa.net/post/view/'+post_id[5], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().animate({opacity: 0}, animacion,function(){$(this).css('visibility', 'hidden');});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().animate({opacity: 0}, animacion,function(){$(this).css('visibility', 'hidden');});
						}
				});
			}
		});
	});
}

function home_posts(){
	
	if(path.match(url_posts)){
		destacados();
		tops_recomendados();
		mas_buscados();
		top_usuarios();
		shouts_trend();
	}
	
	if(path.match(url_post_dentro)){
		post();
		comentarios();
		relacionados_destacados_tops();
		
		$("div.posts-relacionados > button").click(function(){
			$("div.posts-relacionados > div.item-post").css({ opacity: 1, 'visibility':'visible' });
			setTimeout(recomendados, 1000);
		});
		
		$("div.sidebar > nav > div.widget-relacionados > h5.recomendados-title > button").click(function(){
			$("div.sidebar > nav > div.widget-relacionados > ul > li.sidebar-reco").show();
				setTimeout(recomendados_derecha, 1000);
		});
	}
}

/*********************************SHOUTS*********************************/

function shouts(){
	
  $("main.shouts-list > article.shout-item > div.shout-heading > div.shout-user > div.shout-user-info > a.shout-user_name").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();

		if(bloqueados.includes(user[i]) === true){
			$(obj).parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
					if(es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

function shout(){
	
	var user_shout=$("main.v6-content > main.shout-item > div.shout-heading > div.shout-user > div.shout-user-info > a.shout-user_name").text();

	if(bloqueados.includes(user_shout) === true){
		$("main.v6-content > main.shout-item > div.secondary-actions > ul.list-main-actions > li > a.shout-action-like").parent().remove();
		$("main.v6-content > main.shout-item > div.secondary-actions > ul.list-main-actions > li > a.shout-action-share").parent().remove();
		$("main.v6-content > main.shout-item > div.shout-heading > div.shout-user > div.shout-user-info > div.follow-buttons").remove();
		$("main.v6-content > main.shout-item > div.shout-heading > div.wrap-actions > ul.dropdown-primary > li > div.shout-action-fav").parent().remove();
		$("main.v6-content > main.shout-item > div.shout-heading > div.wrap-actions > ul.dropdown-primary > li > div.shout-action-follow").parent().remove();
	}
	else{
		$.get('https://api.taringa.net/user/nick/view/'+user_shout, function(data){
			if(es_creador(data.rewards_active,data.rewards_type) === true){
				$("main.v6-content > main.shout-item > div.secondary-actions > ul.list-main-actions > li > a.shout-action-like").parent().remove();
				$("main.v6-content > main.shout-item > div.secondary-actions > ul.list-main-actions > li > a.shout-action-share").parent().remove();
				$("main.v6-content > main.shout-item > div.shout-heading > div.shout-user > div.shout-user-info > div.follow-buttons").remove();
				$("main.v6-content > main.shout-item > div.shout-heading > div.wrap-actions > ul.dropdown-primary > li > div.shout-action-fav").parent().remove();
				$("main.v6-content > main.shout-item > div.shout-heading > div.wrap-actions > ul.dropdown-primary > li > div.shout-action-follow").parent().remove();
			}
		});
	}
}

function shout_comentarios(){
	
	$("section#comments > article.comment-replies-container > div.comment > div.comment-actions > ul > li > a.comment-action-block").click(function(){
		update_cache();
		block_warning("div.ui-dialog.warning > div.ui-dialog-buttonpane > div.ui-dialog-buttonset > button.ui-button-positive",200);
	});
	
  $("section#comments > article.comment-replies-container > div.comment > div.comment-text > div.comment-author > span > a.comment-author-username").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();

		if(bloqueados.includes(user[i]) === true){
			$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
					if(es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

function shout_respuestas(){
	
	$("section#comments > article.comment-replies-container > div.comment-replies > div.replies-list > article > div.comment > div.comment-actions > ul > li > a.comment-action-block").click(function(){
		update_cache();
		block_warning("div.ui-dialog.warning > div.ui-dialog-buttonpane > div.ui-dialog-buttonset > button.ui-button-positive",200);
	});
	
  $("section#comments > article.comment-replies-container > div.comment-replies > div.replies-list > article > div.comment > div.comment-text > div.comment-author > span > a.hovercard").each(function(i,obj) {
		var user = [];
		user[i]=$(obj).text();

		if(bloqueados.includes(user[i]) === true){
			$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[i], function(data){
					if(es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().parent().parent().parent().parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

function shout_recomendados(){
	
  $("aside.sidebar > div.fixme-shout > div.shouts-related > ul.shouts-related__list > li > a").each(function(i,obj) {
		var shout = [];
		var user = [];;
		shout[i]=$(obj).attr('href');
		user = shout[i].split("/");

		if(bloqueados.includes(user[3]) === true){
			$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
		}
		else{
			$.get('https://api.taringa.net/user/nick/view/'+user[3], function(data){
					if (es_creador(data.rewards_active,data.rewards_type) === true) {
						$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
					}
			});
		}
  });
}

function shout_posts(){
	
  $("aside.sidebar > div.fixme-shout > div.posts-related > ul.posts-related__list > li > a.truncate").each(function(i,obj) {
		var post = [];
		var post_id = [];
		post[i]=$(obj).attr('href');
		post_id = post[i].split("/");

	  $.get('https://api.taringa.net/post/view/'+post_id[5], function(data_post){
			var nick=data_post.owner.nick;
			
			if(bloqueados.includes(nick) === true){
				$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
			}
			else{
				$.get('https://api.taringa.net/user/nick/view/'+nick, function(data_nick){
						if(es_creador(data_nick.rewards_active,data_nick.rewards_type) === true) {
							$(obj).parent().fadeOut(animacion, function(){$(this).remove();});
						}
				});
			}
		});
  });
}

function mi_shouts(){
	
	if(path.match(url_shouts) || path.match(url_shout_dentro)){
		
		shouts();
		
		if(path.match(url_shout_dentro)){
			shout();
			shout_comentarios();
			shout_respuestas();
			shout_recomendados();
			shout_posts();
		}
		
		onElementHeightChange(document.body, function(){
			setTimeout(mi_shouts, 2000);
		});
	}
}

/*********************************MAIN*********************************/
$(function () {
	carga_cache();
	
	$(window).on('load', function () {
		home_posts();
		mi_shouts();
	});
});