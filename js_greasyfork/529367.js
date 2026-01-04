// ==UserScript==
// @name         デュラララチャット最新化スクリプト（ビープ音完全オフ）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  デュラララチャットのUIと機能を最新化し、標準ビープ音を完全オフ
// @author       Grok (xAI)
// @match        http://drrrkari.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529367/%E3%83%87%E3%83%A5%E3%83%A9%E3%83%A9%E3%83%A9%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%9C%80%E6%96%B0%E5%8C%96%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%EF%BC%88%E3%83%93%E3%83%BC%E3%83%97%E9%9F%B3%E5%AE%8C%E5%85%A8%E3%82%AA%E3%83%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529367/%E3%83%87%E3%83%A5%E3%83%A9%E3%83%A9%E3%83%A9%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%9C%80%E6%96%B0%E5%8C%96%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%EF%BC%88%E3%83%93%E3%83%BC%E3%83%97%E9%9F%B3%E5%AE%8C%E5%85%A8%E3%82%AA%E3%83%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ライブラリ読み込み関数
    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const loadCSS = (url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    };

    async function init() {
        try {
            await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
            await loadScript('https://code.jquery.com/ui/1.13.2/jquery-ui.min.js');
            loadCSS('https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css');
            loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

            const gaScript = document.createElement('script');
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=UA-53341711-1';
            document.head.appendChild(gaScript);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-53341711-1');

            // SoundManager2を読み込むが、再生は一切しない
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/soundmanager2/2.97a.20170601/script/soundmanager2-jsmin.js');

            disableSound();
            updateScripts();
            enhanceUI();
            improveSecurity();
        } catch (error) {
            console.error('スクリプトの読み込みに失敗しました:', error);
        }
    }

    // ビープ音を完全に無効化する関数
    function disableSound() {
        // SoundManager2の設定を上書き
        window.soundManager = window.soundManager || {};
        soundManager.setup = function(options) {
            console.log('SoundManagerのセットアップが呼び出されましたが、無効化されています');
            // onreadyを空関数に
            if (options && options.onready) {
                options.onready = function() {
                    console.log('音の再生準備がスキップされました');
                };
            }
        };

        // 既存のsoundManager.createSoundやplayを無効化
        soundManager.createSound = function() {
            console.log('createSoundが呼び出されましたが、音は作成されません');
            return {
                play: function() {
                    console.log('音の再生が試みられましたがブロックされました');
                },
                mute: function() {},
                unmute: function() {}
            };
        };

        soundManager.play = function() {
            console.log('soundManager.playが呼び出されましたが無効です');
        };

        // グローバル変数のmessageSoundを監視し、無効化
        Object.defineProperty(window, 'messageSound', {
            get: function() {
                return {
                    play: function() { console.log('messageSound.playがブロックされました'); },
                    mute: function() {},
                    unmute: function() {}
                };
            },
            set: function() {
                console.log('messageSoundへの設定が試みられましたが無視されます');
            }
        });
    }

    function updateScripts() {
        // メッセージ送信時の音再生を監視・ブロック
        $(document).ready(function() {
            $('form#message, form#pmessage').on('submit', function(e) {
                console.log('メッセージ送信が検出されましたが、音は鳴りません');
                if (soundManager && soundManager.getSoundById('messageSound')) {
                    const sound = soundManager.getSoundById('messageSound');
                    sound.play = function() {
                        console.log('送信時の音再生がブロックされました');
                    };
                }
            });

            // サウンドアイコンをオフ状態で固定
            $('.sound')
                .removeClass('fa-volume-up')
                .addClass('fa-volume-mute')
                .off('click')
                .css('cursor', 'default'); // クリック不可を示す
        });

        // ドラッグ＆ドロップ機能
        const body = document.getElementById('body');
        body.addEventListener('dragover', (e) => e.preventDefault());
        body.addEventListener('dragenter', (e) => e.preventDefault());
        body.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 4) {
                alert('一度に4枚までアップロード可能です');
                return;
            }
            for (const file of files) {
                if (!file.type.match('image.*')) {
                    alert('画像ファイルのみアップロード可能です');
                    return;
                }
                if (file.size > 3145728) {
                    alert('ファイルサイズは3MBまでです');
                    return;
                }
                try {
                    const formData = new FormData();
                    formData.append('upimg', 'upimg');
                    formData.append('img_path', file);
                    await fetch('/room/', {
                        method: 'POST',
                        body: formData
                    });
                } catch (error) {
                    alert('アップロード中にエラーが発生しました');
                    console.error(error);
                }
            }
        });

        let isSubmittingImg = false;
        $('.submit input[type="submit"]').on('click', function(e) {
            if (isSubmittingImg) {
                e.preventDefault();
                return;
            }
            isSubmittingImg = true;
            setTimeout(() => isSubmittingImg = false, 2000);
        });
    }

    function enhanceUI() {
        $('.message_box, .pm_box').css({
            'border-radius': '8px',
            'box-shadow': '0 2px 10px rgba(0,0,0,0.1)'
        });
        $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1.0');
    }

    function improveSecurity() {
        $('textarea[name="message"]').on('input', function() {
            const value = $(this).val();
            $(this).val(value.replace(/[<>&"'`]/g, (match) => ({
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#39;',
                '`': '&#96;'
            })[match]));
        });
        $('form').each(function() {
            const token = '<input type="hidden" name="csrf_token" value="' + generateToken() + '">';
            $(this).append(token);
        });
    }

    function generateToken() {
        return Math.random().toString(36).substr(2);
    }

    init();
})();
