// ==UserScript==
// @name         Iwara Animation Script
// @name:ja      Iwara Animation Script
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Animate Iwara video thumbnail when mouse over. to make iwara easier to see.
// @description:ja  Iwaraの動画サムネをマウスオーバーしたときにサムネをアニメーションさせる。ちょっと見やすくする。
// @author       iwayen
// @match        *://*.iwara.tv/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396979/Iwara%20Animation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/396979/Iwara%20Animation%20Script.meta.js
// ==/UserScript==

/*
Description: //説明:
1.Makes the text on the thumbnail easier to see when loading the page. //ページ読み込み時にサムネイル上の文字を見やすく縁取りをする。
2.Zoom thumbnails on mouse over. //マウスオーバーしたときにサムネイルをズームする。
3.Then animate the thumbnail. //そのときサムネイルをアニメーションする。
About having problems: //不具合について：
1.Some videos cannot be switched because their thumbnails are 403. //一部の動画ではサムネイルが403のため切り替えできない。
2.It may take about 700ms to read an image and it may fail. //画像読み取りに700ms近くかかるため失敗することがある。
3.If the switching time is too early, the image cannot be downloaded. Once cached, they can be displayed faster, but are not yet supported. //切り替えの時間が早すぎると画像をダウンロードできない。一度キャッシュしていれば早くしても見えるがまだ対応していない。
*/

(function() {

	//Set here if you want to change the settings 設定を変更したい場合はここで
	// var animerepeat = 1 ; // How many times do the five thumbnails repeat? Even if you increase it, the load does not increase if it is already cached. [It has been disabled] //5枚のサムネイルを何回繰り返すか。[無効になりました]
	// Currently repeated during mouse over. //現在、マウスオーバー中リピートされる。
	var imagezoomscale = 1.2; //Magnification of how much to enlarge the hop-up image //ホップアップした画像をどれくれい拡大するかの倍率
	var youtubezoomscale = 2.0; //Magnification of how much you want to enlarge the hop-up image for YouTube //ホップアップしたYouTube用画像をどれくらい拡大するかの倍率
	//If you want to change the following settings, look carefully 設定を変更したい場合はここまで 以下は分かる場合。
	var index = 0;
	var img = undefined; //# undefinedと比較しているところがあるので統一
	var youtubeimg = undefined;
	var srcimg = undefined;
	var idx = 0;
	var viewimg = '';
	var nownum = 0;
	var divid = '';
	var id;
	//# hover時のマウスポインターの位置サムネイルのサイズが小さい場合にプルプルするのを防止
	var clientX;
	var clientY;

	//Easy to see at border line //文字に縁取りで見やすく
        console.log('■■■DOMContentLoaded');
		$(".icon-bg").css('text-shadow',
			'1px 1px 2px black,-1px 1px 2px black,1px -1px 2px black,-1px -1px 2px black'
		);


	$('.field-item').hover(function(evt) { //# マウスポインターの位置を取得するためにevtを受け取る
		img = undefined; //# 最初に確実に初期化
		if (evt.clientX == clientX && evt.clientY == clientY) { //# 前回のマウスポインターと同じ位置の場合は実行しない。（プルプル防止）
			return;
		}
		// Specify what you want to hover. have not confirmed anything other than ".field-item". //ホバーしたい対象を指定する。「.field-item」以外は確認していません。
		// .field-item : Image part //画像部分
		// .views-column : Video list page //動画一覧ページ用
		// .col-xs-6 : User page //ユーザーページ用
		// .video-js : Video page //動画ページ用
		// Separate with ",". If you enter more than one, write ('.views-column,.col-xs-6,.video-js') //「,」で区切る。 複数入れると('.views-column,.col-xs-6,.video-js') と書く

		// console.log('■■■');

		//Get the id of the iwara video, if unsure, set to undefined. //iwara動画のidを取得、分からない場合はundefinedにする。
		//divid = $(this).children('.node-video').attr('id');
		divid = $(this).find('.node-video,.node-image').attr('id');

		if (divid === undefined) {
			divid = $(this).attr('id');

			if (divid === undefined) {
				divid = $(this).parents('.node-video,.node-image').attr('id');

				if (divid === undefined) {
					img = undefined //
				} else {
					img = $(this).find("img").attr("src");
				}
			}
		}

		srcimg = img;

		if (img !== undefined) {
			if (img.match(/\/photos\//)) { //# 動画ページでサムネイル以外も大きくなってしまうので除外。リストページでも除外される
				img = undefined; //# 初期化して未実行状態であることを主張
				return;
			}

            if (img.match(/iwara.tv/)) {
                //20210824
            }else{
                img = undefined; //# 初期化
                return;
			}

			//Appearance change during mouse over //マウスオーバー中の見た目変更
			//# 実行することが決まったのでマウスポインターの位置を保持
			clientX = evt.clientX;
			clientY = evt.clientY;

			var transform; //# ctrlキーのありなしで大きさと
			var transition; //# 拡大速度を変える
			if (evt.ctrlKey) { //# ctrlキーを押しながらの場合画面の中央に大きく表示
				var padding = 40;

				var offset = $(this).offset();
				var itemWidth = $(this).width();
				var itemHeight = $(this).height();

				var zoomWidth = window.innerWidth - padding * 2;
				var zoomHeight = window.innerHeight - padding * 2;

				var scale = zoomWidth / itemWidth;
				if (zoomHeight < itemHeight * scale) {
					scale = zoomHeight / itemHeight;
				}

				var moveX = (window.innerWidth - itemWidth) / 2 + $(window).scrollLeft() -
					offset.left;
				var moveY = (window.innerHeight - itemHeight) / 2 + $(window).scrollTop() -
					offset.top;

				transform = 'translate(' + moveX + 'px,' + moveY + 'px) scale(' + scale +
					')';
				transition = '1.4s';
			} else {
				transform = 'scale(' + imagezoomscale + ')';
				transition = '0.3s';
			}

			$(this).css('transform', transform);
			$(this).css('font-size', '0.3em'); //This has no meaning in the initial state. //これは初期状態の場合意味がありません。対象が含まれないので。
			$(this).css('z-index', '100');
			$(this).css('position', 'relative'); //go to front //前面にする
			$(this).css('background-color', 'rgba(255,255,255,0.9)');
			$(this).css('transition', transition);

			//# iwaraの動画は /thumbnail-759754_0004.jpg? のようになっているので正規表現で引っかける。
			if (img.match(/\/thumbnail-(\d+)_(\d+).jpg/)) { //If img contains this string //imgにこの文字列を含む場合
				var videono = Number(RegExp.$1); //# 一つ目の括弧 759754
				nownum = Number(RegExp.$2); //# 二つ目の括弧 0004

				//Effective if not sidebar. Through without executing sidebar. 除外処理 サイドバーの場合でなければ実効 サイドバーなら実行せずにスルー
				// if ( img.match('/sidebar_preview/') === null) {
				img = img.replace('/sidebar_preview/', '/thumbnail/'); //# サイドバーを除外していたようだがこのでの置換だけで何とかなりそうなので受け入れる

				if (evt.ctrlKey) {
					img = img.replace('/styles/thumbnail/public/videos/', '/videos/'); //■高画質用; //# ctrlキーの場合は大きくするし毎回ではないので高画質にする。
				} else {
					img = img.replace('/thumbnail/', '/medium/');
				}

				// nownum = img.indexOf('_000');
				// nownum = nownum + 4 ;
				// nownum = (img[nownum]) ;
				// nownum = nownum - 0 ;

				// index = img.indexOf('.jpg');

				// index = index - 1 ;
				// img = img.substring(0, index);

				// act();

				//# タイマー方式からイベント方式へ
				//# 付いていなかったら付けるというより、イベントを全部はずしてイベントを付ける
				$(this).find("img").off('load');
				$(this).find("img").on('load', act2);

				if (792500 <= videono) { //# 一つずつ動画を確認したところ、このあたりから15個使えるようになっているようである。
					maxNownum = 15;
				} else {
					maxNownum = 5;
				}
				count = 0; //# イベント用変数初期化
				timer = 0;
				act2(); //# 初回は手動実行
				// } //# if ( img.match('/sidebar_preview/') === null) { の閉じ括弧
			} else {
				//When "_000" is not included in imgURL. This is for YouTube and images. //imgURLに「_000」 が入っていない場合 Youtubeや画像の場合はこれ
				//console.log('_000 not match. Youtube or image?');

				//youtube or image //youtubeかimageか判定
				if ($('#' + divid).find('.field-type-image,.field-type-file').length) { //".Field-type-file" is for confirmation and has no meaning. //「.field-type-file」は確認用で意味は無い。
					//console.log('This is probably image これはたぶん画像です');
				} else {
					//console.log('This is probably Youtube これはたぶんYoutubeです');
					//Add a comment for Youtube. Add the "add_ani" class to the video id if it does not already exist. //Youtubeの場合はコメントを追加する。 動画id部分に「add_ani」クラスがまだないなら追加する。
					if (($('#' + divid).find('.add_ani').length) === 0) {
						$(this).append('<div class="add_ani"><p class="add_comment_youtube">YouTube</p><div>');
						$(this).find('p').css('text-shadow','1px 1px 2px black,-1px 1px 2px black,1px -1px 2px black,-1px -1px 2px black');
						$(this).find('p').css('position', 'relative');
						$(this).find('p').css('position', 'absolute');
						$(this).find('p').css('bottom', '-10px');
						$(this).find('p').css('left', '20px');
						$(this).find('p').css('color', 'white');
						$(this).find('p').css('font-size', '0.5em');
					}
					$(this).css('transform', 'scale(' + youtubezoomscale + ')'); //Scale size for youtube. //youtubeの場合のスケールサイズ。

					//It doesn't have to be a YouTube URL, but I added it later. //YoutubeのURLにする しなくてもいいけどあとから追加した
					if (img.indexOf('/youtube/') >= 0) { //If it does not exist after searching, it becomes -1. //念のために検索 youtube以外ではないはずだが 存在しない場合は-1となる。
						youtubeimg = $(this).find("img").attr("src");
						//console.log('this is youtube. youtubeでした '+img);
						youtubeimg = img.replace('//i.iwara.tv/sites/default/files/styles/thumbnail/public/video_embed_field_thumbnails/youtube/' , 'https://img.youtube.com/vi/');
						youtubeimg = img.replace('//i.iwara.tv/sites/default/files/styles/sidebar_preview/public/video_embed_field_thumbnails/youtube/' , 'https://img.youtube.com/vi/');
						index = img.indexOf('.jpg');
						youtubeimg = img.substring(0, index);
						youtubeimg = img + '/hqdefault'; //youtube image size maxresdefault(1280x720) sddefault(640x480) hqdefault(480x360)

						//Change youtube image URL //youtube用画像URLを変更
						viewimg = youtubeimg + ".jpg";
						$('#' + divid).find("img").attr("src", viewimg);

					} else {}

				}

			}
		} else {
			// If you are reacting to something that is not the target image, this may respond, but it is old and unknown. 目的の画像ではないものに反応している場合はここが反応するかもしれない。
			// console.log('undefined NG!!!!');

		}

	}, function() {
		$(this).find("img").off('load'); //# イベント除去

		//Restore appearance by releasing mouse over //マウスオーバー解除で見た目を戻す
		if (img !== undefined) { //If img is undefined, it has not been changed and will not be returned //imgがundefinedだったら変更していないので戻さない
			$(this).find("img").attr("src", srcimg);
			clearTimeout(id);
			$(this).css('transform', 'scale(1.0)');
			$(this).css('transition', '0.2s');
			$(this).css('transform', 'scale(1.0)');
			$(this).css('z-index', '0');
			$(this).css('img src', 'rgba(255,255,255,0.9)');
			$(this).css('font-size', '1.1em');

			img = undefined; //# 初期化して終了したことを主張 戻したものをタイマー発火で変えられるのを防止
			srcimg = undefined;
		}
	});

    //actは無効
	function act() {
		var count = 0;

		var countup = function() {
			count++
			//console.log('in act:'+divid);

			if (nownum >= 5) {
				nownum = 0;
			} //If the thumbnail number is 5 or more, return to 0 and start from 1 //サムネ番号が5以上なら0に戻して1からにする

			//change image URL //画像URLを変更
			idx = nownum + 1;
			//console.log('youtube img: '+(img.indexOf( '/youtube/' )));
			if (img.indexOf('youtube') == -1) { //If not youtube then execute //youtubeでなければ次を実行)
				viewimg = img + idx + ".jpg";
				$('#' + divid).find("img").attr("src", viewimg);
			} else {}

			nownum++;

			//var id = setTimeout(countup, 800);
			//if(count > ( 5 * animerepeat) - 1 ){
			// clearTimeout(id);　//id is specified by clearTimeout. //idをclearTimeoutで指定
			//}
			id = setTimeout(countup, 800);
		}
		countup();
	}

	var count = 0; //# ロードカウンター
	var timer = 0; //# ストップウォッチ ロードにかかった時間を計る
	var maxNownum = undefined;

	function act2() {
		if (nownum >= maxNownum) {
			nownum = 0;
		}
		nownum++;

		var timeout = 800;
		//# 最大数未満の場合、ロードに時間がかかっていると思われるので、次回読み込みまでの時間を調整。
		//# 最大数以降の場合は、キャッシュに入っていると思われるので調整なし
		if (0 <= timer && count < maxNownum) {
			timeout = 800 - ((new Date()).getTime() - timer); //# getTime()はmilisecなので、今からポチった時間と引けばかかった時間がわかるのでそれの分引く。
			if (timeout < 0) {
				timeout = 0;
			}
		}
		count++;

		id = setTimeout(function() {
			if (img !== undefined) { //# タイマー発火ですでにimgが初期化されていたら実行しない
				timer = (new Date()).getTime(); //# ストップウォッチ ポチッ
				viewimg = img.replace(/\/thumbnail-(\d+)_(\d+).jpg/, '/thumbnail-$1_' +
					('0000' + nownum).slice(-4) + '.jpg'); //# 変えているのは 0004 の部分だけ
				$('#' + divid).find("img").attr("src", viewimg); //# srcを指定したので、画像が読み込まれたときにloadイベントが発生し、act2が呼ばれる。
			}
		}, timeout);
	}

})();