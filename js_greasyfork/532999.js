// ==UserScript==
// @name         配信サイト ニコニコ風
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ツイキャス・Twitch・ふわっち・KICKのコメントをニコニコ風にするスクリプト
// @author       machaking
// @match        https://twitcasting.tv/*
// @match        https://whowatch.tv/viewer/*
// @match        https://www.twitch.tv/*
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitcasting.tv
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/532999/%E9%85%8D%E4%BF%A1%E3%82%B5%E3%82%A4%E3%83%88%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%A2%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532999/%E9%85%8D%E4%BF%A1%E3%82%B5%E3%82%A4%E3%83%88%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%A2%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = window.jQuery;

    //URL判定
    var isTwitcasting = window.location.href.indexOf('https://twitcasting.tv') !== -1;
    var isWhowatch = window.location.href.indexOf('https://whowatch.tv/viewer') !== -1;
    var isTwitch = window.location.href.indexOf('https://www.twitch.tv') !== -1;
    var isKick = window.location.href.indexOf('https://kick.com') !== -1;

    //初期設定
    var commentSettings = {
        commentSpeed: localStorage.getItem('commentSpeed') * 1 || 6000,
        commentOpacity: localStorage.getItem('commentOpacity') || 0.6,
        commentSize: localStorage.getItem('commentSize') || 30,
        commentMax: localStorage.getItem('commentMax') || 80,
        commentSpace: localStorage.getItem('commentSpace') || 1,
        commentWellKnownColor: localStorage.getItem('commentWellKnownColor') || '#ffffff'
    };

    var containerWidth = $(".tw-player-page-grid-player").width();

    var commentNumber = 1;
    let commentBlank = 70;

    addGlobalStyle();

    // 処理を遅らせて関数を実行
    if (isWhowatch) {
        containerWidth = $("ww-ivs-broadcast-videos-layout").width() || $(".video-picture").width();
        setTimeout(function () {
            addCommnetContainer();
            commentObservation();
            addSettingPanel();
        }, 2000);
    } else if (isTwitch) {
        containerWidth = $(".video-player__overlay").width();
        setTimeout(function () {
            addCommnetContainer();
            commentObservation();
            addSettingPanel();
        }, 6000);
    } else if (isKick) {
        setTimeout(function () {
            addCommnetContainer();
            commentObservation();
            addSettingPanel();
        }, 1500);
    } else {
        setTimeout(function () {
            addCommnetContainer();
            commentObservation();
            addSettingPanel();
        }, 1000);
    }

    function addCommnetContainer() {
        if ($('.tw-stream-player-video').length) {
            $('.tw-stream-player-video').after(`
                <div class="animation-style-wrap"></div>
                <div class="tw-comment-flow-container">
                </div>
            `);
        } else if ($('.tw-movie-video').length) {
            $('.tw-movie-video').after(`
                <div class="animation-style-wrap"></div>
                <div class="tw-comment-flow-container">
                </div>
            `);
        } else if ($("#video").length) {
            $("#video").after(`
                <div class="animation-style-wrap"></div>
                <div class="tw-comment-flow-container">
                </div>
            `);
        } else {
            if (isWhowatch) {
                $("ww-ivs-broadcast-videos-layout, .video-picture").after(`
                    <div class="animation-style-wrap"></div>
                    <div class="tw-comment-flow-container">
                    </div>
                `);
            } else if (isTwitch) {
                $(".video-player__overlay").after(`
                    <div class="animation-style-wrap"></div>
                    <div class="tw-comment-flow-container">
                    </div>
                `);
            } else if (isKick) {
                $("#injected-channel-player.aspect-video .aspect-video video").after(`
                    <div class="animation-style-wrap"></div>
                    <div class="tw-comment-flow-container tw-comment-flow-container-kick">
                    </div>
                `);
            }
        }
    }

    function flowComment() {
        // コメントを取得（最大20個まで、.comment-flowedが付与されていないもの）
        let targetComments = $(".tw-comment-item:nth-child(-n+20):not(.comment-flowed)");

        if (isWhowatch) {
            targetComments = $(".normal-comment-list ww-comment:nth-of-type(-n+20):not(.comment-flowed)");
        } else if (isTwitch) {
            targetComments = $(".chat-scrollable-area__message-container>div:nth-of-type(n+20):not(.comment-flowed)");
        } else if (isKick) {
            targetComments = $("#chatroom-messages > div > div:nth-of-type(n+20):not(.comment-flowed)");
        }

        targetComments.each(function () {
            const targetComment = $(this);
            let commentText = targetComment.find(".tw-comment-item-comment > span").html();
            let commentTextPlain = targetComment.find(".tw-comment-item-comment > span").text();
            let commentUserImg = targetComment.find(".tw-comment-item-icon > img").attr("src");
            let commentUserId = targetComment.find(".tw-comment-item-screen-id").text();
            let commentStar = targetComment.find(".tw-comment-item-star img").attr("src") || targetComment.find(".tw-comment-item-star").attr("src") || "";

            if (isWhowatch) {
                commentText = targetComment.find("ww-runtime-content div").html();
                commentTextPlain = targetComment.find("ww-runtime-content div").text();
            } else if (isTwitch) {
                commentText = targetComment.find("span[data-a-target='chat-line-message-body']").html();
                commentTextPlain = targetComment.find("span[data-a-target='chat-line-message-body'] .text-fragment").text();
            } else if (isKick) {
                commentText = targetComment.find("span.font-normal").html();
                commentTextPlain = targetComment.find("span.font-normal").text();
            }

            // AA判定
            function checkComment(commentText, commentTextPlain, newComment) {
                if (commentText.length >= 20) {
                    // 日本語とアルファベットの文字数をカウント
                    var validCharCount = (commentTextPlain.match(/[a-zA-Z0-9ぁ-んァ-ン一-龯]/g) || []).length;
                    var newlineCount = (commentText.match("<br>") || []).length;
                    // 日本語とアルファベットの文字数が文字列の半分以下かチェック
                    if (validCharCount <= commentTextPlain.length / 2 && newlineCount >= 1) {
                        newComment.addClass("flow-AA");
                    }
                }
            }

            // 取得したコメントを.tw-comment-flow-container内に表示

            if (!isTwitcasting) {
                $(".tw-comment-flow-container").append(
                    `<div class='tw-comment-flow' style='visibility:hidden;'>
                    <div class='comment-flow-wrap'>
                        <span class='flow-text'>${commentText}</span>
                    </div>
                </div>`);
            } else {
                $(".tw-comment-flow-container").append(
                    `<div class='tw-comment-flow userId-${commentUserId}' style='visibility:hidden;'>
                    <div class='comment-flow-wrap'>
                        <img src='${commentUserImg}' class='flow-img-user'>
                        <img src='${commentStar}' class='flow-img-star'>
                        <span class='flow-colon'>：</span>
                        <span class='flow-text'>${commentText}</span>
                    </div>
                </div>`);
            }

            const newComment = $(".tw-comment-flow:last-child");
            const commentWidth = newComment.outerWidth();

            if (isTwitcasting) {
                checkComment(commentText, commentTextPlain, newComment);
            }

            targetComment.addClass("comment-flowed");

            if (targetComment.find(".tw-comment-membership-badge").length) {
                newComment.addClass("flow-membership");
            }

            if (targetComment.find(".tw-comment-item-star").length) {
                newComment.addClass("flow-item-star");
            }

            if (targetComment.attr("data-type") === "you") {
                newComment.addClass("flow-you");
            }

            // コメントをコメントの幅だけマイナス右に移動
            newComment.css({
                "right": "-" + commentWidth + "px",
                // "width": commentWidth + "px"
            });


            adjustLastElementPosition(newComment, commentWidth);
        });

        let newCommentLength = $(".tw-comment-flow").length;

        // コメント最大数を超えたら最後のコメントを削除
        if (newCommentLength > commentSettings.commentMax) {
            $(".tw-comment-flow:not(.flow-hover, .flow-click)").slice(0, $(".tw-comment-flow").length - commentSettings.commentMax).remove();
        }
    }

    // マウスオーバー&クリック
    $(document).on("mouseenter", ".tw-comment-flow", function () {
        $(this).addClass("flow-hover");
    }).on("mouseleave", ".tw-comment-flow", function () {
        $(this).removeClass("flow-hover");
    }).on("click", ".tw-comment-flow", function () {
        $(this).toggleClass("flow-click");
    });

    // コメントが重なったかの判定（レイヤーを考慮）
    function adjustLastElementPosition(newComment, commentWidth) {
        let $otherElements = $(".tw-comment-flow").not(newComment);
        let isColliding = true;
        let adjustmentCount = 0;
        let commentLayer = 0; // 新しい変数 commentLayer を追加
        let containerHeight = $(".tw-comment-flow-container").outerHeight();
        let commentHeight = newComment.outerHeight();

        function checkCollision() {
            let lastRect = newComment[0].getBoundingClientRect();
            isColliding = false;
            $otherElements.filter(function () {
                // 同じレイヤーの要素のみをフィルタリング
                return $(this).hasClass('commentLayer' + commentLayer);
            }).each(function () {
                let rect = this.getBoundingClientRect();
                if (!(lastRect.right < rect.left - commentBlank ||
                    lastRect.left > rect.right + commentBlank ||
                    lastRect.bottom < rect.top ||
                    lastRect.top > rect.bottom)) {
                    isColliding = true;
                    return false;
                }
            });
            return isColliding;
        }

        // 重なった場合の位置調整
        while (isColliding) {
            if (checkCollision()) {

                adjustmentCount++;

                var topPosition = commentSettings.commentSize * adjustmentCount + (commentSettings.commentSize * (commentSettings.commentSpace * adjustmentCount)); // レイヤーに応じて縦位置を調整

                commentOverHeight();

                //コメントレイヤー2つ目以降は位置を若干ずらす
                if (commentLayer > 0) {
                    let randomOffset = Math.random() * (commentSettings.commentSize * commentSettings.commentSpace * 3); //ランダムな数
                    topPosition += randomOffset;
                    commentOverHeight();
                }

                newComment.css("top", `${topPosition}px`);
            } else {
                break;
            }
        }

        // レイヤー処理
        function commentOverHeight() {
            if (topPosition >= (containerHeight - commentHeight)) {
                adjustmentCount = 0;
                commentLayer++;
                topPosition = 0;
            }
        }

        // レイヤークラスを追加
        newComment.addClass(`commentLayer${commentLayer} adjustedCount${adjustmentCount} start-flow-anime`);

        // コメントの初期位置
        containerWidth = $(".tw-comment-flow-container").outerWidth() + commentWidth;

        if (commentNumber > commentSettings.commentMax) {
            commentNumber = 1;
        }

        const flowKeyframe = `@keyframes flowAnimation${commentNumber} {
                    from {
                        transform: translateX(0px);
                    }
                    to {
                        transform: translateX(-${containerWidth}px);
                    }
                }`;

        if ($(".flow-animation" + commentNumber).length) {
            $(".flow-animation" + commentNumber).text(flowKeyframe);
        } else {
            $(".animation-style-wrap").append(`
                <style class="flow-animation${commentNumber}">
                    ${flowKeyframe}
                </style>
            `);
        }

        newComment.css("visibility", "visible").css("animation-name", "flowAnimation" + commentNumber);

        newComment.one('animationend webkitAnimationEnd', () => newComment.remove());

        commentNumber++;
    }


    // コメントを監視
    function commentObservation() {
        flowComment();

        $(function () {
            let mutationObserver = new MutationObserver(function () {
                flowComment();
            });

            // 監視対象の要素を取得
            let targetElement = document.querySelector('.tw-comment-list-view__scroller>div');

            if (isWhowatch) {
                targetElement = document.querySelector('.comment-box-wrapper>div');
            } else if (isTwitch) {
                targetElement = document.querySelector('.chat-scrollable-area__message-container');
            } else if (isKick) {
                targetElement = document.querySelector('#chatroom-messages > div');
            }

            // 監視を開始
            mutationObserver.observe(targetElement, {
                childList: true
            });

            // タブの表示状態が変更されたときのイベントリスナーを設定
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    // バックグラウンドに切り替えた場合、監視を停止
                    mutationObserver.disconnect();
                    // $(".tw-comment-flow").css("animation-play-state", "paused");
                } else if ($("#switch1").prop("checked")) {
                    // フォアグラウンドに切り替えた場合、監視を再開
                    // $(".tw-comment-flow").css("animation-play-state", "running");
                    mutationObserver.observe(targetElement, {
                        childList: true
                    });
                    flowComment();
                }
            });

            // オンオフスイッチ
            $('#switch1').click(function () {
                if ($(this).prop("checked")) {
                    mutationObserver.observe(targetElement, {
                        childList: true
                    });
                    flowComment();
                    $(".tw-comment-flow").css("visibility", "visible");
                } else {
                    mutationObserver.disconnect();
                    $(".tw-comment-flow").css("visibility", "hidden");
                }
            });
        });
    }


    // 設定パネルを追加
    function addSettingPanel() {
        const addPanelTrigger = $(`body[data-is-mobile="true"] .tw-player-meta__operation,
                                body[data-is-mobile="false"] .tw-movie-control-layout__bottom-item:last-child,
                                body:not([data-is-onlive="true"]) .vjs-theme-twicas .vjs-control-bar,
                                .viewer-toolbar,
                                .metadata-layout__support,
                                #channel-content > div:first-child > div:last-child > div:first-child`);
        addPanelTrigger.append(`
            <div class="nico-setting-button nico-setting-button tw-player-control">
                <button class="settings-button">⚙️ニコ設定</button>
                <div class="settings-panel">
                    <button class="close-button">✕</button>
                    <div class="switchArea">
                        <p class="switch1Title">コメント表示</p>
                        <input type="checkbox" id="switch1" checked>
                        <label for="switch1"><span></span></label>
                        <div id="swImg"></div>
                    </div>
                    <div class="settings-panel-inner">
                        <div class="settings-panel-child">
                            <label for="commentSpeed">コメントの速度: <span id="commentSpeed-value">${commentSettings.commentSpeed / 1000}</span>秒</label>
                            <input type="range" id="commentSpeed" min="1000" max="20000" step="500" value="${commentSettings.commentSpeed}">
                            <label for="commentOpacity">コメントの透明度: <span id="commentOpacity-value">${commentSettings.commentOpacity}</span></label>
                            <input type="range" id="commentOpacity" min="0" max="1" step="0.05" value="${commentSettings.commentOpacity}">
                            <label for="commentSize">コメントのサイズ: <span id="commentSize-value">${commentSettings.commentSize}</span>px</label>
                            <input type="range" id="commentSize" min="10" max="60" step="1" value="${commentSettings.commentSize}">
                            <label for="commentMax">コメント最大数: <span id="commentMax-value">${commentSettings.commentMax}</span></label>
                            <input type="range" id="commentMax" min="20" max="100" value="${commentSettings.commentMax}">
                            <label for="commentSpace">コメントの間隔: <span id="commentSpace-value">${commentSettings.commentSpace}</span></label>
                            <input type="range" id="commentSpace" min="0.1" max="2" step="0.1" value="${commentSettings.commentSpace}">
                        </div>
                        <div class="settings-panel-child">
                            <div class="input-wrap">
                                <input type="checkbox" id="switchIcon">
                                <label for="commentIcon">アイコン表示</label>
                            </div>
                            <label for="commentWellKnownColor">コメントの色（非匿名）</label>
                            <input type="color" id="commentWellKnownColor" value="${commentSettings.commentWellKnownColor}"><span id="commentWellKnownColor-value">${commentSettings.commentWellKnownColor}</span>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // 設定パネルの表示/非表示を切り替える
        $(document).on('click', function(e) {
            if ($(e.target).closest('.settings-panel, .settings-button').length === 0) {
                $('.settings-panel').hide();
            }
        });

        $('.settings-button, .close-button').on('click', function() {
            $('.settings-panel').toggle();
        });

        // 初期設定かどうかのフラグ
        let setDefault = 0;

        //スライダーの値が変更されたときの処理
        function updateSetting(element) {
            const $el = $(element);
            const targetId = $el.attr('id');
            let value = $el.val();

            if (setDefault === 1) value = localStorage.getItem(targetId);

            if (targetId === 'commentSpeed') {
                commentSettings[targetId] = value * 1;
                $('#' + targetId + '-value').text(value / 1000);
            } else {
                commentSettings[targetId] = value;
                $('#' + targetId + '-value').text(value);
            }

            $el.val(commentSettings[targetId]);
        }

        $('.settings-panel input:not(#switch1)').on('input', function () {
            setDefault = 0;
            updateSetting($(this));
            localStorage.setItem($(this).attr('id'), commentSettings[$(this).attr('id')]);
            styleChange();
        });

        styleChange();

        //スタイル初期設定
        function styleChange() {
            $('.tw-comment-flow-style').html(`
                .tw-comment-flow {
                    font-size: min(${commentSettings.commentSize}px, 4vw);
                    opacity: ${commentSettings.commentOpacity};
                    animation-duration: ${commentSettings.commentSpeed}ms;
                }

                .flow-img-user,
                .tw-comment-flow-container-kick .flow-text div:has(img),
                .tw-comment-flow-container-kick span[data-emote-name],
                .comment-flow-wrap .chat-line__message--emote-button,
                .comment-flow-wrap .chat-line__message--emote-button * {
                    width: ${commentSettings.commentSize}px;
                    height: ${commentSettings.commentSize}px;
                }

                .tw-comment-flow:not( :has(img.flow-img-user[src*="guest"])) .flow-text {
                    color: ${commentSettings.commentWellKnownColor};
                }

                @media screen and (max-width: 520px) {
                    .tw-comment-flow {
                        font-size: min(${commentSettings.commentSize}px, 6vw);
                    }
                }
            `);
        }

        // 一時停止
        if (!isTwitch) {
            $(document).on('click', '.tw-comment-flow-container', function (e) {
                if (!$(this).find('.tw-comment-flow:hover').length) {
                    $("video")[0].pause();
                }
            });
        }
    }

    // レスポンシブ　520px以上のみの処理
    if ($(window).width() >= 520) {
        //Ctrlキー+エンターでコメント
        $(window).keydown(function (e) {
            if (e.ctrlKey) {
                if (e.keyCode === 13) {
                    $('.tw-comment-post-operations .tw-button-primary').click();
                }
            }
        });

        // マウススクロールで音量を変更
        function noscroll(e) {
            e.preventDefault();
        }

        $(".tw-player-wrapper").on({
            "mouseenter": function () {
                $(this).addClass("hover");
                document.addEventListener('touchmove', noscroll, { passive: false });
                document.addEventListener('wheel', noscroll, { passive: false });
            },
            "mouseleave": function () {
                $(this).removeClass("hover");
                document.removeEventListener('touchmove', noscroll);
                document.removeEventListener('wheel', noscroll);
            }
        });

        var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
        $(document).on(mousewheelevent, function (e) {
            if (!$(".tw-player-wrapper.hover").length) return; // プレイヤーにホバーしていない場合は何もしない

            e.preventDefault();
            var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
            var volumeHover = $(".tw-player-wrapper.hover .tw-video-volume-slider input[type='range']");
            var volumeProg = parseFloat(volumeHover.val());
            var videoElementHover = $(".tw-player-wrapper.hover video")[0];

            if (delta < 0) {
                // マウスホイールを下にスクロールしたときの処理
                volumeProg = Math.max(0, volumeProg - 4);
            } else {
                // マウスホイールを上にスクロールしたときの処理
                volumeProg = Math.min(100, volumeProg + 4);
            }

            // 音量を0から1の範囲に変換
            videoElementHover.volume = volumeProg / 100;
            volumeHover.val(volumeProg);
        })
    } else {
        setTimeout(function () {
            $(".tw-global-header-secondary").append('<button class="infoOpenButton">›</button>');
            $(".infoOpenButton").on("click", function () {
                $(this).toggleClass("info-open");
                $("body").toggleClass("info-open");
            });
        }, 1000)
    }

    function addGlobalStyle() {
        if (isTwitch) {
            $('body').prepend(`
            <style>
                .tw-comment-flow-container {
                    pointer-events: none;
                }

                .tw-comment-flow {
                    pointer-events: auto;
                }

                .settings-panel label,
                .settings-panel .close-button,
                .switch1Title,
                .switchArea label span:after {
                    font-size: 1.3rem;
                }

                .settings-panel {
                    bottom: 135px;
                }

                .nico-setting-button .settings-button {
                    color: white;
                    font-size: 1.4rem;
                }
            </style>
            `);
        } else if (isKick) {
            $('body').prepend(`
                <style>
                .settings-panel {
                    bottom: 279px;
                }
                </style>
            `);
        }

        if (!isTwitcasting) {
            $('body').prepend(`
            <style>
                .tw-comment-flow-container {
                    position: absolute;
                    top: 0;
                    width: 100%;
                }

                .nico-setting-button .settings-button {
                    color: #4e4d4b;
                }
            </style>
            `);
        }

        $('body').prepend(`
        <style>
            .tw-comment-flow-container {
                position: relative;
                z-index: 2;
                height: 99%;
                margin-top: 1%;
                overflow: hidden;
            }

            .tw-player-enquete-answer-dialog {
                z-index: 5;
            }
            .tw-comment-flow {
                position: absolute;
                display: flex;
                align-items: center;
                opacity: 0.6;
                font-size: min(21px, 4vw);
                font-weight: 600;
                // padding-right: ${commentBlank}px;
                color: white;
                line-height: 1;
                white-space: nowrap;
                font-feature-settings: "palt";
                // letter-spacing: 0.15rem;
                transform: translateX(0px);
                animation-duration: ${commentSettings.commentSpeed}ms;
                animation-timing-function: linear;
                cursor: pointer;
                font-family: "ＭＳ Ｐゴシック", "MS PGothic", "ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro", Osaka, arial, verdana, sans-serif;
            }

            .tw-comment-flow.flow-AA {
                font-family: sans-serif;
            }

            .tw-comment-flow.flow-hover,
            .tw-comment-flow.flow-click {
                animation-play-state: paused;
                z-index: 2;
            }

            .tw-comment-flow.flow-hover .comment-flow-wrap,
            .tw-comment-flow.flow-click .comment-flow-wrap {
                border: 2px solid white;
            }

            .comment-flow-wrap {
                display: flex;
                align-items: center;
                text-shadow: 0 0 2px #686868;
            }

            .flow-text {
                -webkit-filter: drop-shadow(0 0 0.3px #555) drop-shadow(0 0 1px #555);
                filter: drop-shadow(0 0 0.3px #555) drop-shadow(0 0 1px #555);
            }

            .flow-img-user {
                width: ${commentSettings.commentSize}px;
                height: ${commentSettings.commentSize}px;
                border-radius: 50%;
                margin-right: 5px;
            }

            .tw-comment-flow:not( :has(img.flow-img-user[src*="guest"])) .flow-text {
                color: ${commentSettings.commentWellKnownColor};
            }

            .flow-img-star {
                height: ${commentSettings.commentSize}px;
            }

            .tw-comment-flow:not(.flow-hover, .flow-click) :is(.flow-img-user, .flow-img-star, .flow-colon) {
                display: none;
            }

            body:has(#switchIcon:checked) :is(.flow-img-user, .flow-img-star, .flow-colon) {
                display: block;
            }

            .flow-item-star {
                // opacity: 0.7;
            }

            .flow-membership {
                // opacity: 0.8;
            }

            .flow-you .comment-flow-wrap {
                border: 1px solid yellow;
            }

            .comment-flow-wrap .chat-line__message--emote-button,
            .comment-flow-wrap .chat-line__message--emote-button * {
                vertical-align: bottom;
                margin: auto;
            }

            .nico-setting-button {
                display: inline-block;
            }

            body:not([data-is-onlive="true"]) .nico-setting-button {
                display: flex;
            }

            .nico-setting-button .settings-button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                position: relative;
                z-index: 3;
                font-size: 1rem;
            }

            .settings-panel {
                position: absolute;
                bottom: 50px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                display: none;
                z-index: 3;
            }

            .settings-panel-inner {
                display: flex;
                justify-content: left;
                gap: 1rem;
            }

            .settings-panel label {
                display: block;
                margin-bottom: 5px;
                font-size: 0.8rem;
            }

            .settings-panel input {
                width: 100%;
                margin-bottom: 10px;
                cursor: pointer;
            }

            .settings-panel input[type="color"] {
                width: 3rem;
                height: 1.7rem;
                padding: 0.2rem;
            }

            .input-wrap {
                display: flex;
            }

            .input-wrap input {
                width: unset;
                margin-right: 0.1rem;
            }

            body[data-is-onlive="false"] .tw-comment-flow-container {
                pointer-events: none;
            }

            /* === ボタンを表示するエリア ============================== */
            .switchArea {
                line-height: 1;
                letter-spacing: 0;
                text-align: center;
                position: relative;
                margin: auto;
                margin-left: 0;
            }

            /* === チェックボックス ==================================== */
            .switchArea input[type="checkbox"] {
                display: none;
            }

            /* === チェックボックスのラベル（標準） ==================== */
            .switchArea label {
                display: flex;
                box-sizing: border-box;
                width: 57px;
                height: 24px;
                border: 2px solid #999999;
                border-radius: 30px;
                background: white;
                align-items: center;
                justify-content: flex-end;
                cursor: pointer;
            }

            .switchArea label span {
                line-height: 1;
            }

            /* === チェックボックスのラベル（ONのとき） ================ */
            .switchArea input[type="checkbox"]:checked +label {
                border-color: #4589ff;
            }

            /* === 表示する文字（標準） ================================ */
            .switchArea label span:after {
                content: "OFF";
                padding: 0px 9px 0 23px;
                color: #999999;
                font-size: 0.7rem;
            }

            /* === 表示する文字（ONのとき） ============================ */
            .switchArea  input[type="checkbox"]:checked + label span:after {
                content: "ON";
                padding: 0 29px 0 8px;
                color: #4589ff;
            }

            /* === 丸部分のSTYLE（標準） =============================== */
            .switchArea #swImg {
                position: absolute;
                width: 16px;
                height: 16px;
                background: #999999;
                bottom: 4px;
                left: 4px;
                border-radius: 26px;
                transition: .2s;
                pointer-events: none;
            }

            /* === 丸部分のSTYLE（ONのとき） =========================== */
            .switchArea input[type="checkbox"]:checked ~ #swImg {
                transform: translateX(33px);
                background: #4589ff;
            }

            .switch1Title {
                text-align: left;
                margin-bottom: 0.5rem;
                font-size: 0.8rem;
            }

            .close-button {
                position: absolute;
                top: 4px;
                right: 6px;
                color: white;
                background: none;
                border: none;
                border-radius: 30px;
                font-size: 0.7rem;
                line-height: 2;
                z-index: 1;
                cursor: pointer;
            }

            @media screen and (max-width: 520px) {
                .tw-comment-flow-container {
                    position: absolute;
                    z-index: 2;
                    width: 100%;
                    height: 99%;
                    top: 0;
                    // aspect-ratio: 16/9;
                    pointer-events: none;
                }

                .settings-panel {
                    top: -36vw;
                    bottom: unset;
                }

                .settings-button {
                    color: #3381ff;
                    border-radius: 19px;
                    border: 2px solid #3381ff;
                    font-size: 0.7rem;
                    line-height: 1;
                }

                .infoOpenButton {
                    border: none;
                    transform: rotate(90deg);
                    font-size: 1.7rem;
                    color: #9e9e9e;
                    line-height: 0.5;
                }

                .infoOpenButton.info-open {
                    transform: rotate(-90deg);
                }

                body:not(.info-open) :is(.tw-player-page__app-link__buttons, .tw-global-alerts, .tw-user-header, .tw-player-page-grid-title) {
                    display: none;
                }
            }
        </style>
        <style class="tw-comment-flow-style"></style>
        `);
    }
})();