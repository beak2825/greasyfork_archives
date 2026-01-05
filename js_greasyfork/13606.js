// ==UserScript==
// @name         Better Taringo
// @namespace    http://dorgan.bl.ee/
// @version      0.9
// @description  Hace que los shouts de taringa sean menos feos
// @author       Dorgan
// @match        http://www.taringa.net/*
// @match        https://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13606/Better%20Taringo.user.js
// @updateURL https://update.greasyfork.org/scripts/13606/Better%20Taringo.meta.js
// ==/UserScript==


// Spaghetti.begin()
    
var getShoutObject = function(shout_id, callback) {
        var self
        self = this
        return $.get(location.protocol+'//api.taringa.net/shout/view/' + shout_id, function(body) {
            return callback(body)
        })
    }
var getCurrentPathParts = function(){
    var pathArray = window.location.pathname.split( '/' )
    var paths = ""
    for (i = 0; i < pathArray.length; i++) {
        paths += "/"
        paths += paths[i]
    }
    return paths
}

var betterShout = function() {
	// Si no estamos en un shout lo dejamos ahí
	var paths = getCurrentPathParts()
    var reg = /(.*)\/mi\/(.*)/
    var loc = window.location.pathname
    var match = reg.test(loc)
    if( paths[0] == 'shouts' || !match ) return

    // guardamos el ID del shout
    var shoutID = $('.shout-item').data('fetchid')
    var owner
    getShoutObject(shoutID, function(data){
        owner = data.owner.id

        var userData = {}
        $.ajax({
            url: location.protocol+'//api.taringa.net/user/view/'+owner,
            type: 'GET',
            success: function(val){
                userData = val
                
                var bkg = []
                bkg['m'] = location.protocol+'//k30.kn3.net/1/5/9/C/1/1/C4A.png'
                bkg['f'] = location.protocol+'//k30.kn3.net/0/9/D/E/2/1/55D.png'
                
                $('head').append('<style>body .shout-detail .shout-main-content .article-content-wrapper, body .shout-detail .shout-main-content iframe, body .shout-detail .shout-main-content embed, body .shout-detail .shout-main-content .webm-js video {width: 100%;}.v6-content {min-height: 320px;}#userCard {overflow: hidden;}#userCard a{font-weight: bold}#userCard .avatar > img{cursor: pointer;border-radius: 50%;border: 5px #CCC solid; width:100px; height:100px; position: absolute;display: block;margin: 0 auto;top: -60px;left: 0;right: 0;}#userCard .listBtn{display:inline-block;color:#fff;position:relative;overflow:hidden;z-index:1;width:37px;height:37px;line-height:37px;padding:0;background-color:#9C27B0;border-radius:50%;transition:.5s ease-in-out;cursor:pointer;vertical-align:middle}#userCard .magicList li{-webkit-animation-duration: 0.3s;-moz-animation-duration: 0.3s;animation-duration: 0.3s;}#userCard .magicList{left:0;right:0;text-align:center;position:absolute;bottom:170px;margin:0 auto; width: 37px;}#userCard .avatar.online > img{border-color: #47CA47;}.magicList > li {opacity: 0; display: none;} #userCard .card-body{padding-top: 60px;} #userCard .card-header{min-height: 150px;width: 100%;background: url('+bkg[userData.gender]+');}#userCard ul.user-stats li {width: 96px;display: inline-block;padding: 5px;box-sizing: border-box;text-align: center;}#userCard .range{text-align: center;padding: 5px 0 5px 0;color: #666;}.mpForm {position: absolute;top: -150px;left: 0;text-align: center;transition: .4s ease;animation: .4s ease; z-index: 1;display: none;width: 100%;height: 316px;padding-top: 20px;}.listBtn.expanded {transform: scale(20);}.listBtn.expanded>i {opacity: 0;}.mpForm input[type="text"], .mpForm textarea {display: block;margin: 0 auto;padding: 10px;margin-bottom: 20px;width: 250px;border-radius: 2px;border: none;}.mpForm textarea {height: 150px;}.mpForm .mpBtn {margin-top: -5px;color: #fff;background-color: #CE64E0;}.mpForm .sendMp:hover {background-color: #D882E6;}.shouts-related__list img {width: 150px;height: 150px;}.shouts-related__list li {width: 150px;margin: 0!important;}.shouts-related__list li {width: 150px!important;height: 150px!important;}.fixme-shout {position: relative!important;top: 0!important;}</style>')
                $('head').append('<style>.range.Gold{background-color:#ffd7d4}.range.Silver{background-color:#d3f3f3}.range.Platinum{background-color:#d0eccb}.range.Diamond,.range.Patrocinador{background-color:#f5e3d3}.range.Troll,.range.Flamer,.range.Músico{background-color:#cecece}.range.Inexperto{background-color:#e4a9c3}.range.Iniciado{background-color:#f2eab6}.range.Aprendiz,.range.Amateur{background-color:#e2a7ce}.range.Regular{background-color:#ffdaca}.range.Experto{background-color:#FDEEC6}.range.Avanzado{background-color:#ebf9cb}.range.Elite{background-color:#e0f6ca}.range.Moderador{background-color:#c5e8ff}.range.Oficial{background-color:#8de0c9}.range.Desarrollador{background-color:#de8b89}</style>')
                
                var shoutItem = $('.shout-item')
                var commentsDiv = $('#comments')
                var shoutUser = $('.shout-user')
                var nextShout = $('a.btn[alt="Ver siguiente shout"]')
                var postsRelated = $('.posts-related')
                var relatedShouts = $('.shouts-related')
                
                postsRelated.addClass("card")
                relatedShouts.addClass("card")

                nextShout.remove()
                
                $('aside.sidebar div').last().remove()

                shoutItem.addClass('card')
                commentsDiv.addClass('card')
                
                $.ajax({
                    url: location.protocol+'//api.taringa.net/user/stats/view/'+owner,
                    method: 'GET',
                    success: function(data){
                        var userStats = data
                        var sidebar = $('.sidebar')
                        var userCard = $("<div id='userCard' class='card'><div class='card-header' style='background: url() cover no-repeat;'></div><div class='card-body'><div class='actionMenu'><div class='avatar'><img src='"+userData.avatar.big+"'></div><ul class='magicList'></ul></div><center><a class='user-link' href='"+userData.canonical+"'>"+userData.nick+"</a></center></div><div class='card-footer'><div class='range "+userData.range.name+"'>"+userData.range.name+"</div><ul class='user-stats'><li><b>"+userStats.shouts+"</b><br>Shouts</li><li><b>"+userStats.points+"</b><br>Puntos</li><li><b>"+userStats.followers+"</b><br>Seguidores</li></ul></div></div>")
                        if(global_data.user && userData.id != global_data.user){
                            $(userCard).find('.magicList').append("<li><a class='listBtn mpBtn' href='#'><i class='icon-mensajes'></i></a></li>")
                            $(userCard).find('.card-body').append("<div class='mpForm'><input type='text' name='topic' placeHolder='Asunto'><textarea></textarea><button class='mpBtn closeMp fab'><i class='zmdi zmdi-close'></i></button><button class='mpBtn sendMp fab'><i class='zmdi zmdi-mail-send'></i></button></div>")
                        }
                        sidebar.prepend(userCard)

                        var shoutUserNew = shoutUser.clone()
                        if(shoutUser.children('.shout-user-info').children('.state').hasClass('online')) {
                            $(userCard).find('.avatar').addClass('online')
                        }

                        shoutUser.children('a').remove()
                        shoutUser.children('.shout-user-info').children('span.state').remove()
                        shoutUser.children('.shout-user-info').children('a.hovercard').remove()
                        shoutUser.children('.shout-user-info').children('.follow-buttons').remove()

                        var magicList = $('#userCard .magicList li')
                        
                        $(userCard).find('.avatar').click(function(){
                            if( $(this).hasClass('active')){
                                magicList.addClass('fadeOutDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                    $(this).removeClass('fadeOutDown animated')
                                    magicList.css('opacity', '0')
                                    magicList.hide()
                                })
                            }else{
                                magicList.show()
                                magicList.addClass('fadeInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                    $(this).removeClass('fadeInUp animated')
                                    magicList.css('opacity', '1')
                                })
                            }
                            $(this).toggleClass('active')
                        })

                        var avatarTimer
                        $(userCard).find('.avatar').mousedown(function() {
                            avatarTimer = setTimeout(function(){
                                window.location.href = userData.canonical
                            }, 3000);
                        }).bind('mouseup mouseleave', function() {
                            clearTimeout(avatarTimer);
                        });

                        $(userCard).find('.mpBtn').click(function(e){
                        	e.preventDefault()
                        	if($(this).hasClass('expanded')) return
                        	$(this).addClass('expanded').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
						        if($(this).hasClass('retracting')){
						        	$(this).removeClass('retracting')
						        	return
						        }
						        $(userCard).find('.mpForm').fadeIn('fast')
						    })
                        })

                        $(userCard).find('.sendMp').click(function(){
                        	var mpForm = $(userCard).find('.mpForm')
                        	var textarea = mpForm.find('textarea')
                        	if(textarea.val() == ''){
                        		textarea.addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                    $(this).removeClass('shake animated')
                                })
                        		return
                        	}
                        	var toSend={'msgSubject': mpForm.find('input[name="topic"]').val(),
							            'msgText':textarea.val(),
							            'msgTo':userData.nick};

							$.post('/ajax/mp/compose',toSend,function(){
								$(userCard).find('.mpForm').fadeOut('fast', function(){
	                        		$(userCard).find('.mpBtn').removeClass('expanded').addClass('retracting')
	                        	})
	                        	mpForm.find('input[name="topic"]').val('')
	                        	textarea.val('')
							});
                        	
                        })

                        $(userCard).find('.closeMp').click(function(){
                        	$(userCard).find('.mpForm').fadeOut('fast', function(){
                        		$(userCard).find('.mpBtn').removeClass('expanded').addClass('retracting')
                        	})
                        })
                        
                        
                        var commentsPosY = $('#comments').position().top+$('#comments').outerHeight(true)
                        var posY = $('.posts-related').position().top+$('.posts-related').outerHeight(true)
                        if(commentsPosY < posY){
                            $('footer.contentinfo').css('margin-top',posY-100)
                        }

                    }
                })
            }
        })
    })
}

var betterShouts = function(){

	$('.shout-item').addClass('card')
	$('.facebook-box').addClass('card')

}

$(document).ready(function(){

	// Agregamos estilos
	// Sí, es un asco así, ya sé
	// Si tienen una mejor idea avisen
    $('head').append('<style>.posts-related.card li {list-style: none;border-top: 1px solid #ccc;}.posts-related.card {padding: 10px;width: 280px!important;}.secondary-actions {margin-bottom: 0;}.shout-item:before {height: 10px!important;margin-top: 0!important;}.card{margin-bottom: 15px!important;background-color: #fff;transition: box-shadow .25s;border-radius: 2px;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);position: relative;}.card-body{padding: 10px;position: relative;}.comments-primary{width: auto;margin-top: 20px;}#comments {padding: 0;padding-top: 10px;}.shout-user { height: 55px; position: relative; } .shout-user-info { position: relative; color: #C4C2C2; height: 48px; margin-left: 60px; } .shout-user-info .state { width: 10px; height: 10px; border-radius: 30px; background: #b3bab6; float: left; margin: 1px 5px 0 0; } .shout-user-info .shout-user_name { font-size: 14px; font-weight: bold; display: inline-block; line-height: 13px; height: 16px; vertical-align: top; color: #52a3ed; } .shout-user-info .icon-tiempo { top: 0; right: 25px; left: inherit; } .shout-user-info .follow-buttons { position: absolute; left: 0; top: 0; }.shout-user_img {border-radius: 4px;width: 48px;height: 48px;float: left;margin-right: 12px;}.shout-user-info .icon-tiempo {font-size: 13px;display: block;top: 20px;left: 0;position: absolute;cursor: pointer;padding: 0 0 10px 0;}.shout-user-info .state.online {background: #01db59;}.shout-heading .shout-user-info,.shout-heading .shout-user{height:20px!important;}.shout-item .wrap-actions {margin-right: 13px;} .shout-item .shout-heading, .shout-item .shout-txt, .shout-item .secondary-actions {padding: 0 13px 0 13px;} .shout-detail{padding: 13px 0 13px 0!important;}.shout-detail .secondary-actions {margin-bottom: 0px!important;}.list-main-actions {float: right!important;}.list-main-actions li {margin-right:0!important; margin-left: 15px;}.fab {border-radius: 50%;width: 37px;height: 37px;}</style>');
    $('head').append('<link href="https://daneden.github.io/animate.css/animate.min.css" rel="stylesheet">')
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.1.2/css/material-design-iconic-font.min.css">')
	
    var socialMedia = $('.list-social-media')
    socialMedia.remove()

	betterShout()
	betterShouts()

})

