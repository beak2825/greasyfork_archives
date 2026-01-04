// ==UserScript==
// @name         ニコ動に再生スピード、早送り・巻き戻しのショートカットを追加する
// @namespace    http://tampermonkey.net/
// @version      0.6.6
// @description  ニコ動に再生スピード、早送り・巻き戻しのショートカットを追加するスクリプト
// @author       You
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.nicovideo.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493739/%E3%83%8B%E3%82%B3%E5%8B%95%E3%81%AB%E5%86%8D%E7%94%9F%E3%82%B9%E3%83%94%E3%83%BC%E3%83%89%E3%80%81%E6%97%A9%E9%80%81%E3%82%8A%E3%83%BB%E5%B7%BB%E3%81%8D%E6%88%BB%E3%81%97%E3%81%AE%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493739/%E3%83%8B%E3%82%B3%E5%8B%95%E3%81%AB%E5%86%8D%E7%94%9F%E3%82%B9%E3%83%94%E3%83%BC%E3%83%89%E3%80%81%E6%97%A9%E9%80%81%E3%82%8A%E3%83%BB%E5%B7%BB%E3%81%8D%E6%88%BB%E3%81%97%E3%81%AE%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  {
    // ダブルタップでの拡大を禁止する
    let styleTag = document.createElement('style');
    styleTag.textContent = `html {
      touch-action: manipulation;
    }`;
    //styleTag.id = 'addCustomCss1';
    document.head.appendChild(styleTag);
  }

  function ContextMenuDisplayNone()
  {
    if (document.menuHideStyleElement != null){
			document.menuHideStyleElement.remove();
		}

    let styleTag = document.createElement('style');
    styleTag.textContent = 'div[data-styling-id="«r4»"] { display: none; }';
    styleTag.id = 'addCustomCss1';
    document.head.appendChild(styleTag);

    document.menuHideStyleElement = styleTag;
	}

	function ContextMenuRemoveCustomCss()
	{
		if (document.menuHideStyleElement != null){
			document.menuHideStyleElement.remove();
		}

		// let contextMenuElm = document.querySelector('div[data-styling-id="«r4»"]')
		// if (contextMenuElm) {
		// 	contextMenuElm.click();
		// }
	}

  function SetDoubleTapCallback(targetElement, callback)
  {
    let tapCount = 0;
    targetElement.addEventListener( "touchstart", (e) => {
      // シングルタップの場合
      if( !tapCount ) {
        // タップ回数を増加
        ++tapCount ;

        // 350ミリ秒だけ、タップ回数を維持
        setTimeout( () => {
          tapCount = 0 ;
        }, 350 ) ;

        //console.log("シングルタップ");

      } else {
        // ダブルタップの場合


        // ビューポートの変更(ズーム)を防止
        //e.preventDefault() ;

        // ダブルタップイベントの処理内容
        //console.log( "ダブルタップに成功しました!!" ) ;
        callback();

        // タップ回数をリセット
        tapCount = 0 ;
      }
    });
  }

    function SetTapLongPressCallback(targetElement, callbackOn, callbackOff)
    {
        const kLongPressTime = 400;
        let tapCount = 0;
        let longPressTimerId = 0;
        let longPressOn = false;
        targetElement.addEventListener( "touchstart", (e) => {
            if (longPressTimerId != 0) {
                clearTimeout(longPressTimerId);
                longPressTimerId = 0;
            }
            longPressOn = false;

            longPressTimerId = setTimeout(() => {
                // ロングプレスされた場合
                //console.log("LongPress!");
                longPressOn = true;

                // メニューが表示されてしまうのを防ぐ
                ContextMenuDisplayNone();

                callbackOn();

            }, kLongPressTime);
        });

        targetElement.addEventListener( "touchend", (e) => {
            if (longPressTimerId != 0) {
                clearTimeout(longPressTimerId);
                longPressTimerId = 0;
            }
            if (longPressOn) {
                longPressOn = false;
                // ロングプレス終了
                //console.log("LongPress off");

                // メニューが表示されてしまうのを防ぐ
                setTimeout(() => {
                    ContextMenuRemoveCustomCss();
                }, 2000);

                callbackOff();
            }
        });
    }

async function AutoRetrySelectorElement(selector)
{
	for (let i = 0; i < 50; ++i) {
		try {
		let elm = await new Promise((resolve, reject) => {
		    setTimeout(() => {
		    	let elm = document.querySelector(selector);
				if (!elm) {
					reject();
				} else {
					resolve(elm);
		      }
		    }, 50);
	    });
      // 見つかった！
      return elm;

      } catch(err) {
          // retry
          console.log("retry: ", i);
      }
	}

    throw "over max retry: " + selector;
}

async function ChangePlaybackRate(rateIndex)
{
  console.log("ChangePlaybackRate: ", rateIndex);

  // メニューが一瞬表示されてしまうのを防ぐ
	var styleTag = document.createElement('style');
	styleTag.textContent
    = `div[aria-label="プレーヤー設定"] { display: none; }
       div[data-part="positioner"] { display: none; } `;
	document.head.appendChild(styleTag);

	setTimeout((styleTag) => {
		styleTag.remove();
	}, 1000, styleTag);

  // ダブルタップで開いたメニューが消されるので遅延させる
  setTimeout(async ()=> {
    // 設定 open
    let configElm = await AutoRetrySelectorElement('button[aria-label="設定"]');
    configElm.click();

    // 再生速度メニュー open
    let changePlayRateElm = await AutoRetrySelectorElement('button[aria-label="再生速度の変更"]');
    changePlayRateElm.click();

    // xx 再生速度
    let xxRateElm = await AutoRetrySelectorElement(`div[data-value="${rateIndex}"]`);
    xxRateElm.click();

    // 閉じる
    document.querySelector('button[aria-label="Close"]').click();

    DisplayPlaybackRate(rateIndex);
  }, 100);
}



// 再生速度表示の設定
{
    let styleTag = document.createElement('style');
    styleTag.textContent = `
    .fadeout {
        animation: fadeOut 2s; /*keyframesで命名したものを使う。2秒間で消える*/
        animation-fill-mode: both; /*0%の時と100%の時の状態を保つ*/
    }

    @keyframes fadeOut {
        0% {
            opacity: 1; /*初めに存在する*/
        }
        33% {
            opacity: 1;
        }
        100% {
            opacity: 0; /*最後に消える*/
        }
    }
    `;
    document.head.appendChild(styleTag);
}

function DisplayPlaybackRate(rate)
{
    let videoConteiner = document.querySelector('div[data-scope="menu"]');
    if (!videoConteiner) {
      console.log("videoConteiner not found...");
      return ;
    }


    if (document.displayPlaybackRateElm) {
      document.displayPlaybackRateElm.remove();
      document.displayPlaybackRateElm = null;
    }

    const createElement = `<div class="fadeout" id="DisplayPlaybackRate">${rate}</div>`;

    // 最初の子要素として追加
    videoConteiner.insertAdjacentHTML('afterbegin', createElement);

    let displayPlaybackRateElm = document.getElementById("DisplayPlaybackRate");
    displayPlaybackRateElm.style.cssText= `
          z-index: 10;
          background: transparent;
          position: absolute;
          top: 0;
          font-size: xxx-large;
          color: yellow;
      `;
    document.displayPlaybackRateElm = displayPlaybackRateElm;

    //   setTimeout(()=> {
    //     if (document.displayPlaybackRateElm) {
    //       document.displayPlaybackRateElm.remove();
    //       document.displayPlaybackRateElm = null;
    //     }
    //   }, 1000);
}


window.addControllerDivRetryCount = 0;

function AddControllerDiv()
{
  let videoConteiner = document.querySelector('div[data-scope="menu"]');
  if (videoConteiner) {
    {
      const createElement = '<div id="video_backward"></div>';

      // 最初の子要素として追加
      videoConteiner.insertAdjacentHTML('afterbegin', createElement);

      let video_backward = document.getElementById("video_backward");
      video_backward.style.cssText= `
        width: 33%;
        height: 33%;
        z-index: 10;
        background: transparent;
        position: absolute;
        bottom: 0;
      `;
      video_backward.addEventListener("click", (event)=> {
        event.stopPropagation();    // 親へクリックイベントを伝播しないようにする
      });
      SetDoubleTapCallback(video_backward, ()=> {
        // 戻し
        document.querySelector('button[aria-label*="秒戻る"]').click();
      });
    }

    {
      const createElement = '<div id="video_forward"></div>';

      // 最初の子要素として追加
      videoConteiner.insertAdjacentHTML('afterbegin', createElement);

      let video_forward = document.getElementById("video_forward");
      video_forward.style.cssText= `
        width: 33%;
        height: 33%;
        z-index: 10;
        background: transparent;
        position: absolute;
        bottom: 0;
        margin: 0 auto;
        right: 0;
      `;
      video_forward.addEventListener("click", (event)=> {
        event.stopPropagation();    // 親へクリックイベントを伝播しないようにする
      });
      SetDoubleTapCallback(video_forward, ()=> {
        // 送り
        document.querySelector('button[aria-label*="秒送る"]').click();
      });

      	SetTapLongPressCallback(video_forward,()=>
		{	// longpress on
			ChangePlaybackRate("x2.0");
		}, ()=>
		{	// longpress off
			ChangePlaybackRate("x1.0");
		});
    }

    {
      const createElement = '<div id="playbackrate_shortcut"> <div id="playbackrate_200_100_toggle"></div><div  id="playbackrate_150_100_toggle"></div> </div>';

      // 最初の子要素として追加
      videoConteiner.insertAdjacentHTML('afterbegin', createElement);

      let playbackrate_shortcut = document.getElementById("playbackrate_shortcut");
      playbackrate_shortcut.style.cssText= `
          width: 33%;
          height: 50%;
          z-index: 10;
          background: transparent;
          position: absolute;
          right: 0;
      `;

      let playbackrate_200_100_toggle = document.getElementById("playbackrate_200_100_toggle");
      playbackrate_200_100_toggle.style.cssText= `
          width: 100%;
          height: 50%;
      `;
      SetDoubleTapCallback(playbackrate_200_100_toggle, () => {
        let videoPlayer = document.querySelector("video");
        if (videoPlayer.playbackRate == 2) {
          ChangePlaybackRate("x1.0");
        } else {
          ChangePlaybackRate("x2.0");
        }
      });

      SetTapLongPressCallback(playbackrate_200_100_toggle,()=>
      {	// longpress on
        ChangePlaybackRate("x2.0");
      }, ()=>
      {	// longpress off
        ChangePlaybackRate("x1.0");
      });

      let playbackrate_150_100_toggle = document.getElementById("playbackrate_150_100_toggle");
      playbackrate_150_100_toggle.style.cssText= `
          width: 100%;
          height: 50%;
      `;
      SetDoubleTapCallback(playbackrate_150_100_toggle, () => {
        let videoPlayer = document.querySelector("video");
        if (videoPlayer.playbackRate == 1.5) {
          ChangePlaybackRate("x1.0");
        } else {
          ChangePlaybackRate("x1.5");
        }
      });
      SetTapLongPressCallback(playbackrate_150_100_toggle,()=>
      {	// longpress on
        ChangePlaybackRate("x1.5");
      }, ()=>
      {	// longpress off
        ChangePlaybackRate("x1.0");
      });
    }
    console.log("videoConteiner found!");
    window.addControllerDivRetryCount = 0;

    // URLが変化したときに効かなくなるので
    const observer = new MutationObserver(function () {
    // 処理
    
    let video_backward = document.getElementById("video_backward");
    if (!video_backward) {
        console.log("url changed - AddControllerDiv");
        AddControllerDiv();
      }
    })
    observer.observe(videoConteiner, { childList: true, subtree: true });

  } else {
    console.log("videoConteiner not found...", window.addControllerDivRetryCount);
    if (window.addControllerDivRetryCount < 10) {
        window.addControllerDivRetryCount++;
        setTimeout(AddControllerDiv, 2000);
    }
  }
}

AddControllerDiv();

})();


