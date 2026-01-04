// ==UserScript==
// @name        Younge Ace UP Comic Viewer
// @namespace   phodra
// @description ヤングエースUPの漫画を見開きで表示する
// @include     https://web-ace.jp/youngaceup/contents/*
// @require     https://greasyfork.org/scripts/36978-arrayex/code/ArrayEx.js?version=240772
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36289/Younge%20Ace%20UP%20Comic%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/36289/Younge%20Ace%20UP%20Comic%20Viewer.meta.js
// ==/UserScript==

(()=>{
	//親コンテナの幅制限を解除
	$(".col-viewer").width("auto");
	$(".inner-delivery-contents").css( 'padding', "10px 0 0 0");
	$(".top-brand-logo, .global-navigation, .sub-navigation, .containerMain, .footer").css(
		{
			'max-width': "initial",
			'min-width': "initial",
		}
	);
	$(".displayFlex").css( 'flex-flow', "row wrap");
	$(".nav-youngaceup").hide();
  
	// 元の画像を非表示
	$("head").append("<style type='text/css'> div[id^=img] {display:none} </style>");
	
	let _preblank = true;
	// ページ組み換えボタン
	let $reconst = $("<div id='constraction' />").text("Construction");
	$reconst.css(
		{
			'background-color': "darkgray",
			'flex-grow': 1,
		}
	);
	$reconst.click(
		// なにかの不具合でページが構築されていないときのため初期化もできるようにしておく
		// クリックするたびにページ組みを切り替える
		() => pages==null? InitImage(): Centering(!_preblank)
	);

	// ロード不全の画像を読み込む
	let $suppley = $("<div id='suppley'>").text("Suppley");
	$suppley.css(
		{
			'background-color': "gray",
			'flex-basis': "70px",
			'padding': "0 10px",
		}
	);
	$suppley.click(
		() => {
			pages.forEach(
				val => {
					if( val.error )
					{
						loaded--;
						val.$image.attr(
							'src',
							val.src + "?" + String(Math.random()).slice(2)
						);
						console.log(val.index, val.$image );
					}
				}
			);
		}
	);

	let $control = $("<div id='control' />").css(
		{
			'position': "fixed",
			'display': "flex",
			'left': 0,
			'top': 0,
			'width': "100%",
			'opacity': 0,
			
			'height': "20px",
			'text-align': "center",
			'line-height': "20px",
		}
	);
	// コントロールバーを隠しておく
	let AutoHide = (_this, mark) => {
		$(_this).stop();
		$(_this).animate(
			{
				'opacity': mark
			}, "fast"
		);
	}
	$control.hover(
		function(){ AutoHide(this, 0.8); },
		function(){ AutoHide(this, 0); }
	);
	$control.append($reconst);
	$control.append($suppley);
	$("body").append($control);

	// ページのテンプレート
	const $sheet = $("<div class='page'/>").css(
		{
			'position': "relative",
			'pointer-events': "none",
			
			'margin': 0,
			'margin-bottom': "10px",
			'width': "50%",
			'display': "flex",
			'align-items': "center",
		}
	);
	
	// ページを入れるコンテナ
	let $IMAGE_CONTAINER = $(".lazy-container").css( 'width', "auto" );

	// 各ページを管理する配列
	let pages;
	// ロード済みの画像をカウント
	let loaded = 0;
	// ページを作成
	let InitImage = () => {
		// 画像一覧を取得
		pages = [];
		$.getJSON(
			$IMAGE_CONTAINER.data("url"),
			idata => {
				idata.forEach(
					(val, i) => {
						let $i = $("<img>").attr(
							{
								'src': val,
								'num': i
							}
						);
						
						// ロードした画像が見開きっぽければ、属性とスタイルを追加
						// （見開き関連の処理はヤングエースUPでは必要ないけど……）
						$i.on(
							{
								'load': () => {
									if( loaded==0 ) Centering();
								},
								// 画像が読み込み不全になった場合
								'error': function(){
									let index = $(this).attr('index');
									if( index )
									{
										pages[index].error = true;
									}
									console.log("error", index, pages[index]);
								},
							}
						);

						let $s = $sheet.clone();
						$s.append($i);
						
						// 管理配列にページ情報を追加
						pages.push(
							{
								'index': i,
								'src': val,
								'$sheet': $s,
								'$image': $i,
								'error': null,
								'side': null,
								'pos': 0,
							}
						);
					}
				);
				
				// 一応ページ順をソートしておく
				pages.sort( (v1, v2) =>  v1.index<v2.index? -1: 1 );
				
				// ページを追加していく
				// ページ画像
				pages.forEach(
					val => $IMAGE_CONTAINER.append( val.$sheet )
				);

				// clearfix
				$IMAGE_CONTAINER.append(
					$("<div class='clearfix'>").css(
						{
							'height': 0,
							'clear': "both",
						}
					)
				);

				// クリックスクロール用領域
				let $scrL = $("<div/>").css(
					{
						'position': "absolute",
						'width': "50%",
						'height': "100%",
						'top': 0
					}
				);
				let $scrR = $scrL.clone();
				$scrL.css( 'left', 0);
				$scrR.css( 'right', 0);
				$IMAGE_CONTAINER.prepend($scrL);
				$IMAGE_CONTAINER.prepend($scrR);

				// 次か前のページにスクロールする
				let ScrollToPage = delta => {
					let st = $(window).scrollTop();
					let i;
					for( i=pages.length-1; i>=0; i-- )
					{
						// 次のページ
						if( delta>0 && st >= pages[i].pos )
						{
							i++;
							break;
						}
						// 前のページ
						else if( delta<0 && !(st <= pages[i].pos) )
						{
							break;
						}
					}

					$('html,body').stop();
					$('html,body').animate({
						scrollTop: pages.round(i).pos
					},300);
				};

				// エピソード移動
				let MoveEpisode = ($nav, homepos) => {
					if( $nav.length>0 &&
						$(window).scrollTop() == homepos )
					{
						location.href = $nav.attr('href');
					}
				};

				$scrL.on(
					{
						// 左側クリックで次のページへ
						'click': (e) => {
							e.stopPropagation();
							ScrollToPage(1);
						},

						// 最後の左ページをダブルクリックで次の話
						'dblclick': () => {
							MoveEpisode( $(".viewerbtn a"), pages.lastv().pos );
						}
					}
				);
				$scrR.on(
					{
						// 右側クリックで前のページへ
						'click': (e) => {
							e.stopPropagation();
							ScrollToPage(-1);
						},
					}
				);

				// ロード完了まで暫定的にセンタリングする
				// 　画像がキャッシュされていないサイズが取得できないので、
				// 　すべての画像がロードされた時もう一度中央寄せする必要がある
				Centering();
				// サイズ調整
				Resize();
			}
		);
	};
	
	// スクロール位置を記録しておく配列
	let PosUpdate = () =>{
		pages.forEach(
			val => val.pos = Math.ceil(val.$sheet.offset().top)
		);
	};
	
	// 各ページの画像を真ん中に寄せる
	let Centering = blankin => {
		if( _preblank != null &&
			blankin != null ) _preblank = blankin;

		let count = 0;
		// フラグが立っていれば前見返しを表示
		if( _preblank ) count++;

		pages.forEach(
			val => {
				let $s = val.$sheet;
				// 偶数カウントであれば右ページ（画像は左寄せ）
				if( count%2==0 )
				{
					val.side = "right";
					$s.attr( 'side', "right");
					$s.css(
						{
							'float': "right",
							'justify-content': "flex-start",
						}
					);
				}
				else
				{
					val.side = "left";
					$s.attr( 'side', "left");
					$s.css(
						{
							'float': "none",
							'justify-content': "flex-end",
						}
					);
				}
				
				count++;
			}
		);
		
		PosUpdate();
	};

	const sqt = Math.sqrt(2);
	let Resize = () => {
		let wh = $(window).height();
		let ww = $(window).width();
		$IMAGE_CONTAINER.css( 'width', ww );

		pages.forEach(
			val => {
				val.$sheet.css( 'height', wh);
				if( wh*sqt<ww )
				{
					//横長
					val.$image.css(
						{
							'width': "auto",
							'height': wh,
						}
					);
				}
				else
				{
					//縦長
					val.$image.css(
						{
							'width': ww,
							'height': "auto",
						}
					);
				}
			}
		);

		PosUpdate();
	};
	

	$(document).on(
		{
			'ready': () => {
				InitImage();
			},
		}
	);
	$(window).on(
		{
			// readyで初期化できていなかった場合
			'load': () => {
				if( pages==null ) InitImage();
			},
			// リサイズ時に画像サイズをアジャスト
			'resize': () => {
				Resize();
			}
		}
	);
})();
