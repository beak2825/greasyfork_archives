// ==UserScript==
// @name           Twitter Customize
// @namespace      https://github.com/axtuki1
// @version        1.6
// @description    Twitterの小さい部分をカスタマイズできます。
// @author         axtuki1
// @match          https://twitter.com/*
// @grant          none
// @license        public domain
// @downloadURL https://update.greasyfork.org/scripts/31683/Twitter%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/31683/Twitter%20Customize.meta.js
// ==/UserScript==

(function() {
	'use strict';
	if(('localStorage' in window) && (window.localStorage !== null)) {
	} else {
		console.log("LocalStroageが使用できません。。。。");
		return;
	}
	var doc = jQuery("#doc");
	var local = window.localstorage;
	var load = {
		get: function(key, isJSON){
			isJSON = isJSON === undefined ? false : isJSON;
			var data = localStorage.getItem("TwitterCustomize-"+key);
			if(isJSON){
				data = JSON.parse(data);
			}
			return data;
		},
		set: function(key, data, isJSON){
			isJSON = isJSON === undefined ? false : isJSON;
			if(isJSON){
				data = JSON.stringify(data);
			}
			return localStorage.setItem("TwitterCustomize-"+key, data);
		},
		remove: function(key){
			return localStorage.removeItem("TwitterCustomize-"+key);
		}
	};

	var func = {
		"head-home" : {
			jq: jQuery(".global-nav .home"),
			edit: function(t){
				jQuery(".global-nav .home span.text").html(t);
			}
		},
		"head-moment" : {
			jq: jQuery(".global-nav .moments"),
			edit: function(t){
				jQuery(".global-nav .moments span.text").html(t);
			}
		},
		"head-notice" : {
			jq: jQuery(".global-nav .notifications"),
			edit: function(t){
				jQuery(".global-nav .notifications span.text").html(t);
			}
		},
		"head-msg" : {
			jq:	jQuery(".global-nav .dm-nav"),
			edit: function(t){
				jQuery(".global-nav .dm-nav span.text").html(t);
			}
		},
		"head-keyword" : {
			jq: jQuery(".global-nav .form-search").parent(),
			edit: function(t){
				jQuery(".global-nav .form-search input.search-input").attr("placeholder", t);
			},
		},
		"head-tweet-btn" : {
			jq: jQuery(".global-nav .topbar-tweet-btn"),
			edit: function(t){
				jQuery(".topbar-tweet-btn span.text").html(t);
			}
		},
		"body-follow-btn" : {
			jq: jQuery(".tweet div.follow-bar"),
			edit: function(t){
				jQuery(".follow-button .follow-text span").not(".Icon").html(t);
			}
		},
		"body-following-btn" : {
			jq: jQuery(".fadeLayer"),
			edit: function(t){
				jQuery(".follow-button .following-text").html(t);
			}
		},
		"body-unfollow-btn" : {
			jq: jQuery(".fadeLayer"),
			edit: function(t){
				jQuery(".follow-button .unfollow-text").html(t);
			}
		},
		"body-blocked-btn" : {
			jq: jQuery(".fadeLayer"),
			edit: function(t){
				jQuery(".follow-button .blocked-text").html(t);
			}
		},
		"body-unblock-btn" : {
			jq: jQuery(".fadeLayer"),
			edit: function(t){
				jQuery(".follow-button .unblock-text").html(t);
			}
		},
		"body-Live-Container" : {
			jq: jQuery(".VideoGuide"),
			edit: function(t){
				// do nothing.
			}
		},
		"body-NewTweet-btn" : {
			jq: jQuery(".ProfileMessagingActions-actionsContainer .NewTweetButton").parents(".ProfileMessagingActions-buttonWrapper"),
			edit: function(t){
				jQuery(".ProfileMessagingActions-actionsContainer .NewTweetButton-content .NewTweetButton-text").html(t);
			}
		},
		"body-DM-btn" : {
			jq: jQuery(".ProfileMessagingActions-actionsContainer .DMButton").parents(".ProfileMessagingActions-buttonWrapper"),
			edit: function(t){
				jQuery(".ProfileMessagingActions-actionsContainer .DMButton .DMButton-text").html(t);
			}
		}
	};

	var default_set_jp = {
		"head-home" : {
			name: "ホーム",
			isshow: true,
		},
		"head-moment" : {
			name: "モーメント",
			isshow: true,
		},
		"head-notice" : {
			name: "通知",
			isshow: true,
		},
		"head-msg" : {
			name: "メッセージ",
			isshow: true,
		},
		"head-keyword" : {
			name: "キーワード検索",
			isshow: true,
		},
		"head-tweet-btn" : {
			name: "ツイート",
			isshow: true,
		},
		"body-follow-btn" : {
			name: "フォローする",
			isshow: true,
		},
		"body-following-btn" : {
			name: "フォロー中",
			isshow: true,
		},
		"body-unfollow-btn" : {
			name: "解除",
			isshow: true,
		},
		"body-blocked-btn" : {
			name: "ブロック中",
			isshow: true,
		},
		"body-unblock-btn" : {
			name: "ブロック解除",
			isshow: true,
		},
		"body-Live-Container" : {
			name: "",
			isshow: true,
		},
		"body-NewTweet-btn" : {
			name: "ツイート",
			isshow: true,
		},
		"body-DM-btn" : {
			name: "ダイレクトメッセージ",
			isshow: true,
		}
	};

	jQuery.each(default_set_jp, function(k, v){
		if(load.get(k) === undefined || load.get(k) === null){
			load.set(k, v, true);
		}
	});

	var CM_html = `
<div class="menu-header" style="padding: 14px; font-size: 17px; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom: 2px solid #bababa; background-color: #f9f9f9;">
"TwitterCustomize"設定
</div>
<div class="menu-body" style="padding: 18px; font-size: 16px;">

<style>
.header {
  font-size: 18px;
  margin-bottom: 5px;
}
.key {
  display: inline-block;
  text-align: right;
  width: 190px;
  margin-right: 5px;
}
.save-btn, .reset-btn {
  border-radius: 6px;
  margin-top: 10px;
  margin-right: 50px;
  padding: 7px;
  border: 2px solid #c3c3c3;
  background-color: #F0F0F0;
}
.save-btn::focus {
    outline: none;
    overflow : hidden;
}
</style>

<div class="set">

<div class="header">
ヘッダーの変更
</div>

<div class="home">
<div class="key">ホーム:</div> <input type="text" class="head-home text" value=""> 表示: <input type="checkbox" class="head-home show" value="">
</div>

<div class="moment">
<div class="key">モーメント:</div> <input type="text" class="head-moment text" value=""> 表示: <input type="checkbox" class="head-moment show" value="">
</div>

<div class="notice">
<div class="key">通知:</div> <input type="text" class="head-notice text" value=""> 表示: <input type="checkbox" class="head-notice show" value="">
</div>

<div class="msg">
<div class="key">メッセージ:</div> <input type="text" class="head-msg text" value=""> 表示: <input type="checkbox" class="head-msg show" value="">
</div>

<div class="tweet-btn">
<div class="key">ツイート:</div> <input type="text" class="head-tweet-btn text" value=""> 表示: <input type="checkbox" class="head-tweet-btn show" value="">
</div>

<div class="tweet-btn">
<div class="key">キーワード検索:</div> <input type="text" class="head-keyword text" value=""> 表示: <input type="checkbox" class="head-keyword show" value="">
</div>

<div class="follow-btn">
<div class="key">フォローする:</div> <input type="text" class="body-follow-btn text" value=""> 表示: <input type="checkbox" class="body-follow-btn show" value=""> ※ツイート詳細のフォローボタン
</div>

<div class="following-btn">
<div class="key">フォロー中:</div> <input type="text" class="body-following-btn text" value="">
</div>

<div class="unfollow-btn">
<div class="key">(フォロー)解除:</div> <input type="text" class="body-unfollow-btn text" value="">
</div>

<div class="blocked-btn">
<div class="key">ブロック中:</div> <input type="text" class="body-blocked-btn text" value="">
</div>

<div class="unblock-btn">
<div class="key">ブロック解除:</div> <input type="text" class="body-unblock-btn text" value="">
</div>

<div class="NewTweet-btn">
<div class="key">UP ツイートボタン:</div> <input type="text" class="body-NewTweet-btn text" value=""> 表示: <input type="checkbox" class="body-NewTweet-btn show" value="">
</div>

<div class="DM-btn">
<div class="key">UP DMボタン:</div> <input type="text" class="body-DM-btn text" value=""> 表示: <input type="checkbox" class="body-DM-btn show" value="">
</div>

<div class="Live-Container">
<div class="key">ライブ:</div>表示: <input type="checkbox" class="body-Live-Container show" value="">
</div>

</div>

<div class="line" style="border-top: 1.5px solid #d4d4d4; margin-top: 15px; padding-top: 5px;">
※ 別ウィンドウに反映されるのは再読込後です。<br>
※UP: ユーザーページ
</div>

<div class="save">
<button class="save-btn">保存</button>                     <button class="reset-btn">リセット</button>
</div>

</div>
`;
	jQuery("body").prepend('<div class="customize-menu" style="position: fixed; top: 100px; left: 0; right: 0; margin: auto; display: none; background-color: #FFF; border-radius: 6px;	width: 60%;	z-index: 2001;">'+CM_html+'</div>');
	jQuery("body").prepend('<div class="fadeLayer" style="position: fixed; top:0px; left:0px; width:100%; height: 100%; background-color:#000000; opacity:0.5; display: none; z-index: 2000;"></div>');
	doc.find(".dropdown-menu").find('[data-nav="settings"]').after('<li role="presentation"><a class="customize" data-nav="customize" rel="noopener" role="menuitem">"TwitterCustomize"設定</a></li>');
	jQuery(".dropdown-menu .customize").on({
		"click" : function(){

			jQuery.each(default_set_jp, function(k){
				var v = load.get(k, true);
				jQuery(".customize-menu input."+k+".text").val(v.name);
				if(v.isshow){
					jQuery(".customize-menu input."+k+".show").prop('checked', true);
				}
			});

			jQuery(".dropdown.me").removeClass("open");
			jQuery(".dropdown-menu ul").attr('aria-hidden','true');
			jQuery("body").find(".fadeLayer").fadeIn();
			jQuery("body").find(".customize-menu").fadeIn();
		}
	});

	jQuery(".fadeLayer").click(function() {
		jQuery(".fadeLayer").fadeOut();
		jQuery(".customize-menu").fadeOut();
	});

	jQuery(".save-btn").click(function() {
		Save();
		jQuery(".alert-messages span.message-text").html('"TwitterCustomize"の設定を変更しました。');
		jQuery(".alert-messages").removeClass("hidden");
		setTimeout(function(){
			jQuery(".alert-messages").css({"top" : '46px'});
			setTimeout(function(){
				jQuery(".alert-messages").css({"top" : '-40px'});
				setTimeout(function(){ jQuery(".alert-messages").addClass("hidden"); },1000);
			}, 2500);
		},500);
		jQuery(".fadeLayer").fadeOut();
		jQuery(".customize-menu").fadeOut();
	});

	jQuery(".reset-btn").click(function() {
		jQuery.each(default_set_jp, function(k, v){
			load.set(k, v, true);
			exec(k);
		});
		jQuery(".alert-messages span.message-text").html('"TwitterCustomize"の設定を初期値に戻しました。');
		jQuery(".alert-messages").removeClass("hidden");
		setTimeout(function(){
			jQuery(".alert-messages").css({"top" : '46px'});
			setTimeout(function(){
				jQuery(".alert-messages").css({"top" : '-40px'});
				setTimeout(function(){ jQuery(".alert-messages").addClass("hidden"); },1000);
			}, 2500);
		},500);
		jQuery(".fadeLayer").fadeOut();
		jQuery(".customize-menu").fadeOut().animate({"top" : '-500px'},{
			duration: 500,
			queue: false
		});
	});

	function Save(){
		jQuery.each(default_set_jp, function(k){
			var v = load.get(k, true);
		    //console.log(k,jQuery(".customize-menu input."+k+".show").prop('checked'),jQuery(".customize-menu input."+k+".text").val());
			v.name = jQuery(".customize-menu input."+k+".text").val();
			if( jQuery(".customize-menu input."+k+".show").prop('checked') || jQuery(".customize-menu input."+k+".show").prop('checked') === undefined ){
				v.isshow = true;
			} else {
				v.isshow = false;
			}
			load.set(k, v, true);
			exec(k);
		});
	}

	function exec(k, v){
		// デフォルト値のセット
		v = v === undefined ? null : v;
		if(v === null) v = load.get(k, true);
		func[k].edit(v.name);
		if(!v.isshow){
			func[k].jq.hide();
			if(k == "body-NewTweet-btn"){
				func["body-DM-btn"].jq.css({ "width" : "100%"});
			}
			if(k == "body-DM-btn"){
				func["body-NewTweet-btn"].jq.css({ "width" : "100%"});
			}
		} else {
			func[k].jq.show();
			if(k == "body-NewTweet-btn"){
				func["body-DM-btn"].jq.css({ "width" : "50%"});
			}
			if(k == "body-DM-btn"){
				func["body-NewTweet-btn"].jq.css({ "width" : "50%"});
			}
		}
	}

	setTimeout(function(){
		jQuery.each(default_set_jp, function(k){
			var v = load.get(k, true);
			exec(k,v);
		});
	}, 500);

	setInterval(function(){
		jQuery.each(default_set_jp, function(k){
			var v = load.get(k, true);
			exec(k,v);
		});
	}, 1000);


})();
