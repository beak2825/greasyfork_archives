// ==UserScript==
// @name         CTRL+Z 隐藏图片
// @name:zh      CTRL+Z 隐藏图片
// @name:en      CTRL+Z Hide Images
// @name:ja      CTRL+Z 画像を非表示
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  通过按Ctrl+Z键依次切换：开启隐藏图片、开启缩小图片、开启隐藏图片但保持布局、关闭
// @description:zh  通过按Ctrl+Z键依次切换：开启隐藏图片、开启缩小图片、开启隐藏图片但保持布局、关闭
// @description:en  Press Ctrl + Z to toggle between hiding images, scaling images, hiding images while maintaining layout, and closing the effects.
// @description:ja  Ctrl + Z を押して画像の非表示、画像の縮小、画像の非表示（レイアウトを維持）、効果を閉じるを切り替えます。
// @author       aotmd
// @match        *://*/*
// @noframes
// @license MIT
// @run-at document-body
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490150/CTRL%2BZ%20%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/490150/CTRL%2BZ%20%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
 
( function() {
	let SETTING = {
        /*可以自定义快捷键,单个字母(ctrl+[key]生效);Customize shortcut keys, single letter (ctrl + [key] is effective);ショートカットキーをカスタマイズして、単一の文字（ctrl + [key]）が有効です*/
        key:"Z",
		/*也对background-image设置的图片进行隐藏;Also hides images set with background-image.;background-image で設定された画像も非表示にします。*/
		background_image: false,
		/*background-image的宽高大于此值时才生效;The effect only applies when the width and height of the background-image are greater than this value.;background-imageの幅と高さがこの値より大きい場合にのみ効果が適用されます。*/
		width: 100,
		height: 100,
	}
 
 
	let url = window.location.origin;
	const head = document.getElementsByTagName( "head" )[ 0 ];
 
	let List = GM_getValue( "List" ) ? GM_getValue( "List" ) : {};
	let flag = List[ url ] ? List[ url ] : {};
 
	const hideNode = createStyleNode( "hideNode", "img{display:none!important;}.hide-background-image{background-image:none!important;}" );
	const scaleNode = createStyleNode( "scaleNode", "img{transform: scale(0.5);}.hide-background-image{background-size: 50% 50% !important;background-position: center;}" );
	const opacityNode = createStyleNode( "opacityNode", "img{transform: scale(0.5);opacity: 0!important; transition: opacity 0.3s ease-in-out;}.hide-background-image{background-size: 0 0 !important;background-position: center;transition: background-size 0.3s ease-in-out;}" );
 
	head.appendChild( hideNode );
	head.appendChild( scaleNode );
	head.appendChild( opacityNode );
 
	applyStyles();
 
	function applyStyles() {
		if ( flag ) {
			// 设置隐藏图片样式;Set hidden image style;隠れた画像スタイルを設定します。
			hideNode.type = flag.hide ? "text/css" : "text";
			// 设置缩小图片样式;Set reduced image style;縮小された画像スタイルを設定します。
			scaleNode.type = flag.scale ? "text/css" : "text";
			// 设置透明隐藏图片样式;Set transparent hidden image style;透明な非表示画像スタイルを設定します。
			opacityNode.type = flag.opacity ? "text/css" : "text";
		}
	}
 
	function createStyleNode( id, css ) {
		const styleNode = document.createElement( "style" );
		styleNode.id = id;
		styleNode.innerHTML = css;
		styleNode.type = "text";
		return styleNode;
	}
    if(SETTING.key.charCodeAt(0)>97){
        SETTING.key=String.fromCharCode(SETTING.key.charCodeAt(0)-32);
    }
    if(SETTING.key.charCodeAt(0)<65 ||SETTING.key.charCodeAt(0)>97){
        console.error("快捷键设置错误，请设置为单个字母。;The shortcut key setting is incorrect. Please set it to a single letter. ;ショートカットキーの設定が間違っています。1文字に設定してください。");
        return;
    }
	document.addEventListener( "keydown", function( e ) {
		if ( e.ctrlKey && e.keyCode == SETTING.key.charCodeAt(0) ) {
			if ( flag.hide ) { //第二次按,生效scale;Second press, scale effect;2回目の押し, スケール効果
				flag = {}
				flag.scale = true;
			} else if ( flag.scale ) { //第三次按,生效透明;Third press, transparent effect;3回目の押し, 透明な効果
				flag = {}
				flag.opacity = true;
			} else if ( flag.opacity ) { //第四次按,取消全部;Fourth press, cancel all;4回目の押し, すべてキャンセル
				flag = {}
			} else { //第一次按生效hide;First press, hide effect;最初の押し, 非表示効果
				flag = {}
				flag.hide = true;
			}
			applyStyles();
			//重新读取同步数据;Reload synchronous data;同期データを再読み込み
			List = GM_getValue( "List" ) ? GM_getValue( "List" ) : {};
 
			if(Object.keys(flag).length === 0){
				delete List[ url ]
			}else{
				List[ url ] = flag;
			}
			GM_setValue( "List", List );
		}
	} );
	if ( SETTING.background_image ) {
		window.addEventListener( 'load', function() {
			// 加载完成后执行的代码;Code to run after loading;読み込み後に実行するコード
			// 选择所有元素;Select all elements;すべての要素を選択
			var elements = document.querySelectorAll( '*' );
 
			// 遍历所有元素;Iterate over all elements;すべての要素を繰り返し処理
			elements.forEach( function( element ) {
				// 获取元素的 computedStyle;Get the computed style of the element;要素の計算済みスタイルを取得
				var style = window.getComputedStyle( element );
				// 检查是否有 background-image 属性;Check if the element has a background-image property;要素が background-image プロパティを持っているかどうかを確認
				if ( style.getPropertyValue( 'background-image' ) !== 'none' &&
					style.getPropertyValue( 'background-image' ).includes( 'url' ) &&
					parseInt( style.width ) > SETTING.width &&
					parseInt( style.height ) > SETTING.height ) {
					// 添加一个新的类来隐藏元素;Add a new class to hide the element;要素を非表示にする新しいクラスを追加
					element.classList.add( 'hide-background-image' );
				}
			} );
		}, false );
	}
} )();