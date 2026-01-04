// ==UserScript==
// @name             YouTube Cross-Tab Picture-in-Picture/Miniplayer
// @name:ar          تشغيل صورة داخل صورة/مشغل مصغر على YouTube عبر علامات التبويب
// @name:bg          Picture-in-Picture/Минипейър за YouTube през различни табове
// @name:cs          Picture-in-Picture/Minipřehrávač YouTube mezi kartami
// @name:da          YouTube Picture-in-Picture/Minafspiller på tværs af faner
// @name:de          YouTube Bild-in-Bild/Miniplayer über Tabs hinweg
// @name:el          Picture-in-Picture/Μίνι αναπαραγωγή YouTube μεταξύ καρτελών
// @name:en          YouTube Cross-Tab Picture-in-Picture/Miniplayer
// @name:eo          YouTube Bildo-en-Bildo/Miniludilo trans tabuloj
// @name:es          Reproductor de imagen en imagen/minireproductor de YouTube entre pestañas
// @name:fi          YouTube Kuva kuvassa -tila/Miniasoitin eri välilehdissä
// @name:fr          Lecteur Picture-in-Picture/Mini-lecteur YouTube entre onglets
// @name:fr-CA       Lecteur Picture-in-Picture/Mini-lecteur YouTube entre onglets
// @name:he          תמונה בתוך תמונה/נגן מיני של YouTube בין כרטיסיות
// @name:hr          YouTube Picture-in-Picture/Mini-player između tabova
// @name:hu          YouTube Kép-a-képben/Minilejátszó lapok között
// @name:id          Picture-in-Picture/Miniplay YouTube Lintas Tab
// @name:it          Picture-in-Picture/Miniriprodutt ore YouTube tra schede
// @name:ja          YouTube クロスタブ Picture-in-Picture/ミニプレーヤー
// @name:ka          YouTube-ის სურათი სურათში/მინი-დამკვრელი ჩანართებს შორის
// @name:ko          YouTube 크로스 탭 픽처-인-픽처/미니 플레이어
// @name:nb          YouTube Picture-in-Picture/Minispiller på tvers av faner
// @name:nl          YouTube Picture-in-Picture/Minispeler tussen tabbladen
// @name:pl          Obraz w obrazie/Miniodtwarzacz YouTube między kartami
// @name:pt-BR       Picture-in-Picture/Minireprodutor do YouTube entre abas
// @name:ro          Picture-in-Picture/Mini-player YouTube între file
// @name:ru          Picture-in-Picture/Минипроигрыватель YouTube между вкладками
// @name:sk          Picture-in-Picture/Miniprehrávač YouTube medzi kartami
// @name:sr          Picture-in-Picture/Мини плејер YouTube-а између картица
// @name:sv          YouTube Bild-i-bild/Minispelare mellan flikar
// @name:th          Picture-in-Picture/มินิเพลเยอร์ของ YouTube ข้ามแท็บ
// @name:tr          YouTube Çapraz Sekme Resim İçinde Resim/Mini Oynatıcı
// @name:ug          YouTube كىرىش-بەت سۈرەت-ئىچىدە-سۈرەت/كىچىك ئويناتقۇچ
// @name:uk          Picture-in-Picture/Мініплеєр YouTube між вкладками
// @name:vi          Chế Độ Hình Trong Hình/Trình Phát Nhỏ YouTube Giữa Các Thẻ
// @name:zh          跨标签页YouTube画中画/迷你播放器
// @name:zh-CN       跨标签页YouTube画中画/迷你播放器
// @name:zh-HK       跨分頁YouTube畫中畫/迷你播放器
// @name:zh-SG       跨标签页YouTube画中画/迷你播放器
// @name:zh-TW       跨分頁YouTube畫中畫/迷你播放器

// @description      Press Shift+P to toggle Picture-in-Picture/Miniplayer mode on YouTube videos
// @description:ar   اضغط Shift+P للتبديل بين وضع الصورة داخل الصورة/المشغل المصغر على مقاطع YouTube
// @description:bg   Натиснете Shift+P за превключване на режим Picture-in-Picture/Минипейър при видеоклипове в YouTube
// @description:cs   Stiskněte Shift+P pro přepnutí do režimu Picture-in-Picture/Minipřehrávač na videích YouTube
// @description:da   Tryk på Shift+P for at skifte Picture-in-Picture/Miniafspiller-tilstand på YouTube-videoer
// @description:de   Drücken Sie Shift+P, um den Bild-in-Bild-/Miniplayer-Modus bei YouTube-Videos zu wechseln
// @description:el   Πατήστε Shift+P για εναλλαγή λειτουργίας Picture-in-Picture/Μίνι αναπαραγωγής σε βίντεο YouTube
// @description:en   Press Shift+P to toggle Picture-in-Picture/Miniplayer mode on YouTube videos
// @description:eo   Premu Shift+P por ŝalti Bildo-en-Bildo/Miniludilan reĝimon en YouTube-videoj
// @description:es   Presione Shift+P para alternar el modo Picture-in-Picture/Minireproductor en videos de YouTube
// @description:fi   Paina Shift+P vaihtaaksesi Kuva kuvassa -tilaan/Miniasoittimeen YouTube-videoissa
// @description:fr   Appuyez sur Shift+P pour basculer en mode Picture-in-Picture/Mini-lecteur sur les vidéos YouTube
// @description:fr-CA Appuyez sur Shift+P pour basculer en mode Picture-in-Picture/Mini-lecteur sur les vidéos YouTube
// @description:he   לחץ Shift+P כדי להחליף למצב תמונה בתוך תמונה/נגן מיני בסרטוני YouTube
// @description:hr   Pritisnite Shift+P za prebacivanje u Picture-in-Picture/Mini-player način na YouTube videima
// @description:hu   Nyomja meg a Shift+P billentyűket a Kép-a-képben/Minilejátszó mód váltásához YouTube videókon
// @description:id   Tekan Shift+P untuk beralih ke mode Picture-in-Picture/Miniplay di video YouTube
// @description:it   Premere Shift+P per attivare/disattivare la modalità Picture-in-Picture/Miniriprodutt ore nei video di YouTube
// @description:ja   YouTube動画でShift+Pキーを押してピクチャーインピクチャー/ミニプレーヤーモードを切り替え
// @description:ka   დააჭირეთ Shift+P-ს YouTube-ის ვიდეოებზე სურათი სურათში/მინი-დამკვრელის რეჟიმის გადასართავად
// @description:ko   YouTube 동영상에서 Shift+P를 눌러 픽처-인-픽처/미니 플레이어 모드 전환
// @description:nb   Trykk Shift+P for å veksle Picture-in-Picture/Minispiller-modus på YouTube-videoer
// @description:nl   Druk op Shift+P om de Picture-in-Picture/Minispeler-modus in te schakelen op YouTube-video's
// @description:pl   Naciśnij Shift+P, aby przełączyć tryb Obraz w obrazie/Miniodtwarzacza w filmach YouTube
// @description:pt-BR Pressione Shift+P para alternar o modo Picture-in-Picture/Minireprodutor em vídeos do YouTube
// @description:ro   Apăsați Shift+P pentru a comuta modul Picture-in-Picture/Mini-player pe videoclipurile YouTube
// @description:ru   Нажмите Shift+P для переключения режима Picture-in-Picture/Минипроигрывателя на видео YouTube
// @description:sk   Stlačte Shift+P pre prepnutie do režimu Picture-in-Picture/Miniprehrávač na videách YouTube
// @description:sr   Притисните Shift+P за пребацивање у Picture-in-Picture/Мини плејер режим на YouTube видео записима
// @description:sv   Tryck på Shift+P för att växla Bild-i-bild/Minispelare-läge på YouTube-videor
// @description:th   กด Shift+P เพื่อสลับโหมด Picture-in-Picture/มินิเพลเยอร์บนวิดีโอ YouTube
// @description:tr   YouTube videolarında Shift+P'ye basarak Resim İçinde Resim/Mini Oynatıcı modunu değiştirin
// @description:ug   YouTube سىنلىرىدا Shift+P نى بېسىپ سۈرەت-ئىچىدە-سۈرەت/كىچىك ئويناتقۇچ ھالىتىنى ئالماشتۇرۇڭ
// @description:uk   Натисніть Shift+P для перемикання режиму Picture-in-Picture/Мініплеєра на відео YouTube
// @description:vi   Nhấn Shift+P để chuyển đổi chế độ Hình Trong Hình/Trình Phát Nhỏ trên video YouTube
// @description:zh   在YouTube视频中按Shift+P切换画中画/迷你播放器模式
// @description:zh-CN 在YouTube视频中按Shift+P切换画中画/迷你播放器模式
// @description:zh-HK 在YouTube影片中按Shift+P切換畫中畫/迷你播放器模式
// @description:zh-SG 在YouTube视频中按Shift+P切换画中画/迷你播放器模式
// @description:zh-TW 在YouTube影片中按Shift+P切換畫中畫/迷你播放器模式
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @author       aspen138
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://www.youtube.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529980/YouTube%20Cross-Tab%20Picture-in-PictureMiniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/529980/YouTube%20Cross-Tab%20Picture-in-PictureMiniplayer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to toggle Picture-in-Picture
    function togglePictureInPicture(video) {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
                .then(() => {
                    console.log('Exited Picture-in-Picture mode');
                    // Clear the flag when exiting
                    localStorage.removeItem('pipActive');
                })
                .catch(error => {
                    console.error('Error exiting Picture-in-Picture:', error);
                });
        } else if (video) {
            video.requestPictureInPicture()
                .then(() => {
                    console.log('Entered Picture-in-Picture mode');
                    // Set a flag in localStorage
                    localStorage.setItem('pipActive', 'true');
                })
                .catch(error => {
                    console.error('Error entering Picture-in-Picture:', error);
                });
        }
    }

    // Keydown event listener
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key === 'P') {
            const video = document.querySelector('video');
            togglePictureInPicture(video);
        }
    });

    // Storage event listener for cross-tab communication
    window.addEventListener('storage', function(e) {
        if (e.key === 'pipActive' && e.newValue === null) {
            // If another tab exited PiP, try to exit in this tab too
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture()
                    .then(() => {
                        console.log('Cross-tab exit Picture-in-Picture mode');
                    })
                    .catch(error => {
                        console.error('Cross-tab exit error:', error);
                    });
            }
        }
    });

    // Check initial state on load
    window.addEventListener('load', function() {
        if (localStorage.getItem('pipActive') === 'true' && !document.pictureInPictureElement) {
            const video = document.querySelector('video');
            if (video) {
                togglePictureInPicture(video);
            }
        }
    });
})();