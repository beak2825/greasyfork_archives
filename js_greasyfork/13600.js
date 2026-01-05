// ==UserScript==
// @name RETURN_STAR_TO_TWITTER
// @description Возвращает звездочку в Твиттер
// @author PrincessKennyTheBest
// @include https://twitter.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.2.3
// @grant none
// @namespace https://greasyfork.org/users/19508
// @downloadURL https://update.greasyfork.org/scripts/13600/RETURN_STAR_TO_TWITTER.user.js
// @updateURL https://update.greasyfork.org/scripts/13600/RETURN_STAR_TO_TWITTER.meta.js
// ==/UserScript==
(function (window, undefined) {  // [2] нормализуем window
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var w = window;

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/https?:\/\/twitter.com/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
        
		function main() {
			// fav button in notifications
			var $fav = $(".ProfileTweet-action.ProfileTweet-action--favorite");
			$fav.removeClass("withHeartIcon");

			var $button = $fav.find(".ProfileTweet-actionButton");

			$button.find(".IconContainer").attr('title', 'В избранное');
			$button.find(".HeartAnimationContainer").removeClass("HeartAnimationContainer").addClass("Icon").addClass("Icon--favorite").html('');
			$button.find(".u-hiddenVisually").text('В избранное');

			$button = $fav.find(".ProfileTweet-actionButtonUndo");

			$button.find(".IconContainer").attr('title', 'Убрать из избранного');
			$button.find(".HeartAnimationContainer").removeClass("HeartAnimationContainer").addClass("Icon").addClass("Icon--favorite").html('');
			$button.find(".u-hiddenVisually").text('Удалить из избранного');

			// fav icon
			var $favicon = $(".activity-type.activity-type-favorite, .activity-type.activity-type-favorited_mention, .activity-type.activity-type-favorited_media_tag, .activity-type.activity-type-favorited_retweet");
			$favicon.find('.Icon--heartBadge').removeClass('Icon--heartBadge').addClass('Icon--favorited');
			
			// WebToast
			var $webtoast = $(".WebToast-action.js-actionFavorite");
			$webtoast.removeClass('WebToast-action--heart').addClass('WebToast-action--favorite');
			$webtoast.find('.Icon--heart').removeClass('Icon--heart').addClass('Icon--favorite');
			
			$webtoast = $(".WebToast .WebToast-imageBox");
			$webtoast.find('.Icon--heartBadge').removeClass('Icon--heartBadge').addClass('Icon--favorited');
			$webtoast.find('.WebToast-contentBox').each( function() {
				if ($(this).text() == 'Понравилось')
					$(this).text('Добавлено в избранное');
			});
			
			$(".stream-item-content.stream-item-favorite .stream-item-activity-line-notification, .stream-item-content.stream-item-favorited_mention .stream-item-activity-line-notification, .stream-item-content.stream-item-favorited_media_tag .stream-item-activity-line-notification, .stream-item-content.stream-item-favorited_retweet .stream-item-activity-line-notification").each( function() {
				if ($(this).text().search('нрав') > -1)
				    $(this).html($(this).html().replace('нравятся', 'добавил в избранное').replace('нравится', 'добавил в избранное'));
			});
			
			$(".request-favorited-popup").each( function() {
			    if ($(this).text().search('лайк') > -1) {
    				$(this).html($(this).html().replace('лайки', 'избранные').replace('лайка', 'избранных').replace('лайков', 'избранных').replace('лайк', 'избранное'));
	    			$(this).attr('data-activity-popup-title', $(this).attr('data-activity-popup-title').replace('лайки', 'избранные').replace('лайка', 'избранных').replace('лайков', 'избранных').replace('лайк', 'избранное'));
			    }
			});
			$("#activity-popup-dialog-header").each( function() {
				$(this).text($(this).text().replace('Поставили отметку «Нравится»', 'Добавили в избранное'));
			});
			$(".view-all-supplements .show-text").each( function() {
				$(this).text($(this).text().replace('лайки', 'избранные').replace('лайка', 'избранных').replace('лайков', 'избранных').replace('лайк', 'избранное'));
			});
			$(".view-all-supplements .hide-text").each( function() {
				$(this).text($(this).text().replace('лайки', 'избранные').replace('лайка', 'избранных').replace('лайков', 'избранных').replace('лайк', 'избранное'));
			});
			$(".ProfileNav-item.ProfileNav-item--favorites .ProfileNav-stat").each( function(){
				if ($(this).attr('data-original-title'))
					$(this).attr('data-original-title', $(this).attr('data-original-title').replace('лайки', 'избранные').replace('лайка', 'избранных').replace('лайков', 'избранных').replace('лайк', 'избранное'));
			});
			
		}
		
		function mainOnce() {
		    addGlobalStyle('.Icon--favorite:before{content:"\\f147"}.Icon--favorited:before{content:"\\f001"}.Icon--favorited,.Icon--colorFavorited{color:#ffac33}.badge-promoted,.badge-top,.badge-political,.badge-favorited,.badge-tweet-alert,.badge-retweeted{width:16px;height:12px;background-color:transparent;vertical-align:-1px;*vertical-align:middle}.badge-favorited{background-position:-80px -350px}.favorited .dogear{background-position:-30px -450px}.retweeted.favorited .dogear{background-position:-60px -450px}.retweeted .dogear,.favorited .dogear,.retweeted.favorited .dogear{display:block}.activity-follow,.activity-fav,.activity-list,.activity-rt,.activity-reply{height:14px;width:14px}.activity-fav{background-position:-20px -820px}.icon-nav-tweets,.icon-nav-people,.icon-nav-lists,.icon-nav-favorites{background-color:#ccd6dd;height:17px}.icon-nav-favorites{background-position:-90px -1100px;width:16px}.configurator-user,.configurator-search,.configurator-list,.configurator-favorites{margin:-3px 10px 0 0;width:24px;height:22px}.configurator-favorites{background-position:-63px -1220px}.tweet.retweeted .time,.tweet.favorited .time{margin-right:5px}.tweet .unfavorite,.tweet.favorited .favorite,.tweet.retweeted .retweet,.tweet .undo-retweet,.tweet.my-tweet .action-rt-container,.tweet .cannot-retweet,.tweet.user-pinned .user-pin-tweet,.tweet .user-unpin-tweet{display:none}.tweet.retweeted .undo-retweet,.tweet.favorited .unfavorite,.opened-tweet .tweet-actions .close-tweet,.opened-tweet.original-tweet .tweet-actions b,.tweet.retweeted .cannot-retweet,.tweet.user-pinned .user-unpin-tweet,.tweet .user-pin-tweet{display:inline}.grid-tweet .unfavorite,.grid-tweet.favorited .favorite,.grid-tweet.retweeted .retweet,.grid-tweet .undo-retweet,.grid-tweet.my-tweet .action-rt-container,.grid-tweet .cannot-retweet{display:none}.grid-tweet.retweeted .undo-retweet,.grid-tweet.favorited .unfavorite,.grid-tweet.retweeted .cannot-retweet{display:block}.recent-tweets .tweet .action-reply-container,.recent-tweets .tweet .action-fav-container,.recent-tweets .tweet .action-rt-container,.recent-tweets .tweet .action-more-container,.recent-tweets .tweet .action-open-container .separator,.recent-tweets .tweet .tweet-actions .open-tweet{display:none}@media(max-width:1200px){.ProfileCard .favorite-user-button,.ProfileCard .unmute-button,.ProfileCard .mute-button{display:none}}.ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo,.favorited .ProfileTweet-action--favorite .ProfileTweet-actionButton{display:none}.ProfileTweet-action--favorite .ProfileTweet-actionButton:hover,.ProfileTweet-action--favorite .ProfileTweet-actionButton:focus,.ProfileTweet-action--favorite .ProfileTweet-actionCount:hover,.ProfileTweet-action--favorite .ProfileTweet-actionCount:focus,.favorited .ProfileTweet-action--favorite .Icon--favorite,.favorited .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo,.favorited .tweet-actions .Icon--favorite{color:#ffac33}.ProfileTweet-action--favorite .ProfileTweet-actionButton.is-disabled:hover{color:#e1e8ed}.ProfileTweet-action--favorite.is-hoverStateCancelled .ProfileTweet-actionButton:hover,.ProfileTweet-action--favorite.is-hoverStateCancelled .ProfileTweet-actionButton:focus{color:#ccd6dd}.ProfileTweet-action--favorite:not(.withHeartIcon).is-animating .Icon--favorite{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:pulse;animation-name:pulse}.ProfileTweet-dismiss,.ProfileTweet-dismiss:hover,.ProfileTweet-dismiss:focus{color:#aab8c2}.retweeted .ProfileTweet-action--retweet .ProfileTweet-actionCount,.favorited .ProfileTweet-action--favorite .ProfileTweet-actionCount{color:inherit}.retweeted .ProfileTweet-action--retweet .ProfileTweet-actionButtonUndo,.favorited .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo{display:inline-block}.withDarkTweetActions .ProfileTweet-actionButton:not(.is-disabled):not(:hover):not(:focus),.withDarkTweetActions .ProfileTweet-actionCount,.withDarkTweetActions .ProfileTweet-action--retweet.is-hoverStateCancelled .ProfileTweet-actionButton:hover,.withDarkTweetActions .ProfileTweet-action--retweet.is-hoverStateCancelled .ProfileTweet-actionButton:focus,.withDarkTweetActions .ProfileTweet-action--favorite.is-hoverStateCancelled .ProfileTweet-actionButton:hover,.withDarkTweetActions .ProfileTweet-action--favorite.is-hoverStateCancelled .ProfileTweet-actionButton:focus{color:#aab8c2}.stream-container .grid-tweet .grid-tweet-actions .Icon{color:#8899a6}.stream-container .grid-tweet .grid-tweet-actions .favorite .Icon--favorite:hover,.stream-container .grid-tweet .grid-tweet-actions .unfavorite .Icon--favorite{color:#ffac33}.stream-container .grid-tweet .grid-tweet-actions .retweet .Icon:hover,.stream-container .grid-tweet .grid-tweet-actions .undo-retweet .Icon{color:#5c913b}.stream-container .grid-tweet .grid-tweet-actions .is-hoverStateCancelled .favorite .Icon:hover,.stream-container .grid-tweet .grid-tweet-actions .is-hoverStateCancelled .retweet .Icon:hover{color:#8899a6}.favorited .action-fav-container b,.favorited .action-fav-container:hover b,.favorited .action-fav-container a:focus b{color:#ffac33}.favorited .action-fav-container a:focus b{text-decoration:underline}.retweeted .action-rt-container b,.retweeted .action-rt-container:hover b,.retweeted .action-rt-container a:focus b,.opened-tweet.retweeted .tweet-actions .action-rt-container b{color:#5c913b}.PromptbirdPrompt .Icon--favorite{color:#ffcc4d}.media-slideshow-wrapper .tweet.retweeted .time,.media-slideshow-wrapper .tweet.favorited .time,.media-slideshow-wrapper .tweet.favorited .actions,.media-slideshow-wrapper .tweet.retweeted .actions{margin-right:0}.stream-container .media-thumbnail .grid-tweet-action.action-fav-container{width:16px;margin:6px 7px}.WebToast.favorited .Icon--favorite,.WebToast-action--favorite:hover,.WebToast-action--favorite:focus,.WebToast-action--favorite:active{color:#ffac33}.GalleryTweet .tweet.retweeted .time,.GalleryTweet .tweet.favorited .time{margin-right:0}.ProfilePage--withBlockedWarning.is-showingWarning .ProfileNav-item--favorites{display:none}');
			$(".ProfileNav-item.ProfileNav-item--favorites .ProfileNav-label").text('Избранное');
			if ($("#content-main-heading").text() == 'Понравившееся') {
				$("#content-main-heading").text('Избранное');
			}
			document.title = document.title.replace('лайкнутые', 'избранные');
			
		}
		
		main();
		mainOnce();
		
		setInterval(main, 100);
		
    }
    
})(window);