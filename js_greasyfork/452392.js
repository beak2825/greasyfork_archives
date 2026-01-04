// ==UserScript==
// @name         Z-aN Better
// @namespace    https://twitter.com/vvto33_
// @version      2025.03.16
// @description  [←][→][,][.]キーでのシーク・コマ送り機能の追加, 簡易タイムスタンプの追加, 一時停止イラストの非表示
// @author       tototo
// @match        https://www.zan-live.com/*/live/play/*/*
// @icon         https://icons.duckduckgo.com/ip2/zan-live.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452392/Z-aN%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/452392/Z-aN%20Better.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function seekTimestamp(e) {
        const btn = e.target.parentNode;
        if (btn.getAttribute('aria-disabled').toLowerCase() === 'true') {
            return;
        }
        const video = document.querySelector('video');
        const index = btn.getAttribute('target');
        video.currentTime = timestamp[index].seconds;
    }

    function seekTime(time) {
        const video = document.querySelector('video');
        if (!video) return;
        video.pause();
        const seekedTime = video.currentTime + time;
        if (seekedTime < 0) {
            video.currentTime = 0;
        } else if (video.duration < seekedTime) {
            video.currentTime = video.duration;
        } else {
            video.currentTime = seekedTime;
        }
        video.pause();
    }

    function generateBtn(id, src) {
        const btn = document.createElement('button');
        btn.className = 'prism-volume';
        btn.id = id;
        btn.innerHTML = `<div class="volume-icon" style="background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\&quot;http://www.w3.org/2000/svg\&quot; version=\&quot;1.1\&quot; viewBox=\&quot;0 0 24 24\&quot;><path fill=\&quot;%23FFFFFF\&quot; d=\&quot;${src}\&quot; /></svg>');"></div>`;
        btn.setAttribute('aria-disabled', false);
        return btn;
    }

    function HMStoS(str) {
        return +(str.split(/[,\.]/g)[0].replace(/[^\d:]/g, '').split(':').reduce((acc, time) => (60 * acc) + +time));
    }

    function getItemFromTime(currentTime) {
        for (let i = timestamp.length - 1; 0 <= i; i--) {
            if (timestamp[i].seconds <= currentTime) {
                return i;
            }
        };
        return -1;
    }

    function updateTimestamp() {
        const video = document.querySelector('video');
        const currentIndex = getItemFromTime(video.currentTime);
        btnPrev.setAttribute('aria-disabled', currentIndex <= 0);
        btnPrev.setAttribute('target', currentIndex - 1);
        btnNext.setAttribute('aria-disabled', currentIndex + 1 === timestamp.length);
        btnNext.setAttribute('target', currentIndex + 1);
        btnReload.setAttribute('target', Math.max(currentIndex, 0));
        const text = 0 < currentIndex ? `${timestamp[currentIndex].timestamp} ${timestamp[currentIndex].text}` :
            '0:00 ' + document.querySelector('meta[property="og:title"]').content;
        const span = document.createElement('span');
        span.className = 'timestamp-current';
        span.innerText = text;
        while (btnDisplay.firstChild) {
            btnDisplay.removeChild(btnDisplay.firstChild);
        }
        btnDisplay.insertBefore(span, null);
    }

    document.addEventListener('keydown', function (e) {
        const frame = 1 / 60;
        if (e.code === 'ArrowLeft') {
            seekTime(-10);
        } else if (e.code === 'ArrowRight') {
            seekTime(+10);
        } else if (e.code === 'Commna') {
            seekTime(-frame);
        } else if (e.code === 'Period') {
            seekTime(+frame);
        } else if (e.code === 'Space') {
            e.preventDefault();
            const video = document.querySelector('video');
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    })

    const newStyle = document.createElement('style');
    newStyle.innerHTML = `button.prism-volume {
    background-color: unset;
    border: none;
    float: left;
    margin-left: 8px;
    margin-top: 0px;
    padding: 0;
    height: 24px;
}

button#timestamp_current {
    color: white;
    float: left;
    background-color: unset;
    border: none;
    margin-left: 8px;
    margin-top: 0px;
    padding: 0;
    line-height: 24px;
    height: 24px;
}

button.prism-volume div.volume-icon {
    height: 24px !important;
    width: 24px !important;
    background-repeat: no-repeat;
}

div[class="tap-to-start-img"] {
    background-image: unset !important;
}

div.timestamp-list {
    z-index: 9999;
    position: absolute;
    bottom: calc(44px + 5px);
    left: 5px;
    max-width: calc(30%);
    max-height: calc(50%);
    background-color: rgba(0, 0, 0, 0.3);
    overflow-x: auto;
    white-space: pre-wrap;
    transform: rotateZ(0.03deg);
}

span.time-text {
    font-weight: 600;
}

span.time-text:hover {
    text-decoration: underline;
    cursor: pointer;
}

span#timestamp-text {
    font-size: 80%;
    font-weight: 400;
}

div.prism-time-display,
button.prism-time-display {
    transform: rotateZ(0.03deg);
}`;
    document.body.insertBefore(newStyle, null);

    const bar = document.querySelector('.prism-controlbar');
    const btnVolume = document.querySelector('.prism-volume')
    const btnPrev = generateBtn('timestamp_prev', 'M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12');
    const btnNext = generateBtn('timestamp_next', 'M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12');

    const data = {
        '2606': '0:00:00\tLife Like a Live!8 第一公演\n\n0:30:28\tカウントダウン\n0:31:16\tストーリー①\n0:33:27\t出演者紹介\n0:38:33\tストーリー②\n\n0:39:01\tオープニングライブ『Life Like a Live!』\n\nまりなす [鈴鳴すばる/燈舞りん]\n0:45:22\tNEXT ARTIST\n0:45:39\t《さまーりなすメドレー》\n0:45:42\tSpace Fire!!\n0:47:22\tPOLYFULL\n0:48:52\tSPARK×SPARK\n0:50:56\tオーエ・ニャーモ\n0:52:46\tGiMME! GiVE U!\n0:54:03\tブランニュー！\n0:55:34\tSense of Wonder\n0:57:00\tPRISM\n0:58:09\tWONDERLAND\n\n季咲あんこ (ななしいんく)\n1:00:58\tNEXT ARTIST\n1:01:16\tQ&Aリサイタル!\n1:06:06\tBooo!\n1:08:59\tMCパート\n1:10:58\tきらめきわーるど\n\nGEMS COMPANY [有栖川レイカ/小瀬戸らむ/奈日抽ねね/星菜日向夏]\n1:15:44\tNEXT ARTIST\n1:16:06\tプリンセス・フィロソフィー\n1:19:41\tぴよぴよシェフにおまかせあれ！\n1:23:01\tMCパート\n1:25:50\tチアリータ♡チアガール\n\nゆみるメロン\n1:31:47\tNEXT ARTIST\n1:32:05\t恋のメロメロサマー\n1:36:01\tMCパート\n1:38:11\t運命的エモーショナリズム\n\n暁みかど (LiLYPSE)\n1:44:01\tNEXT ARTIST\n1:44:21\t君と夏フェス\n1:48:06\tMCパート\n1:50:16\t《アハ！夏と言えば太陽！みかど様よ！もっとアツくなれよメドレー》\n1:50:19\tラブ！エビバディ！\n1:52:09\tanemone\n1:54:47\tクオリア\n\n1:58:11\tリフレッシュタイム\n\n天籠りのん (VEE)\n2:04:07\tNEXT ARTIST\n2:04:28\t虚無虚無です\n2:08:11\tMCパート\n2:10:11\t深海少女\n\n夢瞳カナウ (virtual avex AVALON)\n2:14:51\tNEXT ARTIST\n2:15:12\tシャルゐぃDreams?\n2:18:42\tMCパート\n2:20:54\tロケットサイダー\n\n家入ポポ (ななしいんく)\n2:25:27\tNEXT ARTIST\n2:25:48\t恋になりたいAQUARIUM\n2:30:54\tMCパート\n2:33:58\tBOOM-BOOM SHAKE!\n\n鬼頭みさき (ぶいぱい)\n2:44:04\tNEXT ARTIST\n2:44:20\tMCパート\n2:46:19\t太陽系デスコ\n\n神楽すず (どっとライブ)\n2:51:09\tNEXT ARTIST\n2:51:25\tMCパート\n2:52:49\tかがやきサマーデイズ\n\nマイタイ・サマー [家入ポポ/神楽すず/鬼頭みさき/星菜日向夏/夢瞳カナウ]\n3:00:33\tNEXT ARTIST\n3:00:51\tMCパート\n3:11:39\tSupreme!\n3:15:59\tMCパート\n\n3:17:07\tご視聴ありがとうございました',
        '2608': '0:00:00\tLife Like a Live!8 第二公演\n\n0:30:24\tカウントダウン\n0:31:13\tストーリー③\n0:32:37\t出演者紹介\n0:34:44\tストーリー④\n\nGEMS COMPANY [赤羽ユキノ/一文字マヤ]\n0:35:05\tNEXT ARTIST\n0:35:27\tLIMINOUS BUTTERFLY\n0:39:27\tMCパート\n0:42:10\tRealityDrop\n0:45:28\tDESIGNED LOVE\n0:49:18\tMCパート\n\nもこ田めめめ (.LIVE)\n0:50:29\tNEXT ARTIST\n0:50:48\tTIPPA\n0:54:04\tMCパート\n0:56:28\t夏に去りし君を想フ\n0:59:12\tMCパート\n\nえのぐ [白藤環/鈴木あんず/日向奈央]\n1:00:29\tNEXT ARTIST\n1:00:48\tSUN HIGH SUMMER!!!\n1:05:10\tビリパリッ!!!\n1:08:28\tMCパート\n1:10:24\tLIVE IV LIFE\n1:14:34\tMCパート\n\nぶいごま\n1:16:09\tNEXT ARTIST\n1:16:29\t泡沫サタデーナイト！\n1:20:23\tMCパート\n1:21:56\tEYES\n1:25:38\tMCパート\n\nvirtual avex AVALON [アイデス/暁おぼろ/暁みかど/鈴鳴すばる/燈舞りん/ぶいごま/夢瞳カナウ]\n1:27:10\tBABY! 恋に KNOCK OUT!\n\n1:31:28\tリフレッシュタイム\n\nPalette Project [暁月クララ/江波キョウカ/常磐カナメ]\n1:37:50\tNEXT ARTIST\n1:38:11\tドリームインブルーム！\n1:42:09\tMCパート\n1:47:44\tSweet♡Hert☆Palette♪\n1:51:31\tキミイロクロニクル\n1:55:15\tMCパート\n\nVALIS [VITTE/CHINO/NEFFY/RARA]\n1:56:23\tNEXT ARTIST\n1:56:42\t侵略ノススメ☆\n2:01:22\t乙女解剖\n2:05:15\tMCパート\n2:07:39\tVALISライブメドレー1\n\n九楽ライ (Re:AcT)\n2:19:53\tNEXT ARTIST\n2:20:13\tさらば我が儚く来し追憶のブルー\n2:23:36\tMCパート\n2:26:44\tDive to Blue\n\n橙里セイ (ななしいんく)\n2:32:56\tNEXT ARTIST\n2:33:17\tかくれんぼ\n2:38:17\tMCパート\n\nスペシャルユニット [橙里セイ/蛇宵ティア/鈴鳴すばる]\n2:39:06\tMCパート\n2:42:25\tEngrossing Time\n\n常夏ビューティー [暁月クララ/一文字マヤ/九楽ライ/橙里セイ/日向奈央]\n2:48:30\tNEXT ARTIST\n2:48:48\tMCパート\n3:02:43\tHeventh Chord\n3:06:29\tMCパート\n\n3:07:17\tご視聴ありがとうございました',
        '2610': '0:00:00\tLife Like a Live!8 第三公演\n\n0:30:19\tカウントダウン\n0:31:07\tストーリー⑤\n0:32:22\t出演者紹介\n0:33:53\tストーリー⑥\n\nLiLYPSE [暁おぼろ/暁みかど]\n0:34:15\tNEXT ARTIST\n0:34:36\tIII\n0:37:46\tMCパート\n0:41:17\t《LiLYPSE夏メドレー》\n0:41:20\tりりっぷすの歌\n0:43:36\t金魚蒔絵の水飛沫\n0:47:56\tプラグマ\n\n蛇宵ティア (ななしいんく)\n0:53:00\tNEXT ARTIST\n0:53:19\tめ組のひと\n0:56:44\tMCパート\n0:59:48\tFall In Mystery\n\nスペシャルユニット [蛇宵ティア/暁おぼろ/暁みかど]\n1:03:58\tMCパート\n1:06:33\tROLLiNG DOLL\n1:10:14\tMCパート\n\nカルロ・ピノ (.LIVE)\n1:12:25\tNEXT ARTIST\n1:12:44\t花に亡霊\n1:16:45\tMCパート\n1:19:36\t少女レイ\n\nえのぐ [白藤環/鈴木あんず/日向奈央]\n1:25:08\tNEXT ARTIST\n1:25:28\tkotonoha\n1:30:43\tあおげば尊し☆ぱらだいす!!\n1:34:52\tなないろ\n\n1:38:59\tリフレッシュタイム\n\nVALIS [VITTE/CHINO/NEFFY/RARA]\n1:44:50\tNEXT ARTIST\n1:45:09\tミカヅキ\n1:49:42\tゆずれない願い\n1:53:46\tVALISライブメドレー2\n\nトゥルシー・ナイトメア (VEE)\n2:02:03\tNEXT ARTIST\n2:02:29\t革命のオーバーチュア\n2:05:31\tMCパート\n2:07:33\t失楽ペトリ\n2:10:39\tMCパート\n\n月紫アリア (Re:AcT)\n2:12:25\tNEXT ARTIST\n2:12:43\tARIADONE\n2:16:02\tMCパート\n2:19:14\t恋スル人魚姫\n\n燈舞りん (まりなす)\n2:25:24\tNEXT ARTIST\n2:25:42\tHOT LIMIT\n2:29:25\tMCパート\n2:31:24\t《りんの生脚疾走メドレー》\n2:31:33\tMy Venus\n2:32:58\tCANDY HAPPY LOVE PARADE\n2:34:28\tROYAL BLOOD\n2:35:40\t凛として、疾走 feat. ヒゲドライバー\n2:37:24\tMCパート?\n\n紅蓮罰まる(ぶいぱい)\n2:38:37\tNEXT ARTIST\n2:38:57\tしゅわ恋\n2:41:50\tMCパート\n\nラブ♡ラバ♡フロー [暁みかど/紅蓮罰まる/月紫アリア/燈舞りん/トゥルシー・ナイトメア]\n2:45:40\tNEXT ARTIST\n2:45:58\tMCパート\n2:57:43\tエンドレスサマー\n3:01:32\tMCパート\n\n3:02:49\tご視聴ありがとうございました',
        '2612': '0:00:00\tLife Like a Live!8 第四公演\n\n0:30:33\tカウントダウン\n0:31:22\tストーリー⑦\n0:32:50\t出演者紹介\n0:34:36\tストーリー⑧\n\nえのぐ [白藤環/鈴木あんず/日向奈央]\n0:34:55\tNEXT ARTIST\n0:36:03\t僕色インフィニティ\n0:40:14\tMCパート\n0:42:50\tSUN HIGH SUMMER!!!\n0:46:22\t常夏パーティタイム\n0:50:13\tMCパート\n\n夢川かなう (Re:AcT)\n0:52:33\tNEXT ARTIST\n0:52:53\tJelly-selfish\n0:56:46\tMCパート\n0:59:33\tいつか恋をした\n1:03:36\tウンディーネ\n\nSIRO (.LIVE)\n1:10:10\tNEXT ARTIST\n1:10:29\tしゃにむにランナー\n1:14:23\tMCパート\n1:15:58\tきゅうくらりん\n1:19:33\tMCパート\n1:19:55\tまっしゅあっぷ!\n\nGEMS COMPANY [有栖川レイカ/音羽雫/長谷みこと]\n1:25:08\tNEXT ARTIST\n1:25:29\tファビュラスTOKYO\n1:30:13\tMCパート\n1:33:43\t君影草\n1:38:00\tメッセージ\n\n1:42:59\tリフレッシュタイム\n\nアイドルマスターコラボ [上水流宇宙/白藤環/鈴鳴すばる/灯里愛夏/水科葵/レトラ]\n1:49:07\tNEXT ARTIST\n1:49:26\tビーチブレイバー\n1:53:17\tMCパート\n1:56:48\t深層マーメイド\n2:00:54\tMCパート\n2:04:06\tJET to the Future\n2:08:55\tMCパート\n\n鈴鳴すばる (まりなす)\n2:12:27\tNEXT ARTIST\n2:12:43\t《すばるのブチ抜きメドレー》\n2:12:46\tボーダーレイン\n2:14:22\tChainGANG\n2:15:47\tHEADSHOT\n2:17:04\tShooting my shot!\n2:19:42\tMCパート\n2:22:32\tBehavior\n\n花京院ちえり (.LIVE)\n2:27:06\tNEXT ARTIST\n2:27:26\t世界は恋に落ちている\n2:32:40\tMCパート\n2:34:47\tGO! GO! ちえり!\n\n十六夜ちはや (ぶいぱい)\n2:39:25\tNEXT ARTIST\n2:39:41\tMCパート\n2:41:40\tFire◎Flower\n2:46:01\tMCパート?\n\nエルセ\n2:47:50\tNEXT ARTIST\n2:48:14\tBLUE\n2:53:13\tMCパート\n2:56:38\t声の海\n\n暁おぼろ (LiLYPSE)\n3:02:19\tNEXT ARTIST\n3:02:40\t夕立のりぼん\n3:06:29\tMCパート\n3:08:06\t《おぼろの沈めちゃうぞメドレー》\n3:08:09\t毒裁\n3:10:10\thappy∞-less\n3:12:43\tMoonlight\n3:15:11\tMCパート\n\nブルーマーメイド [暁おぼろ/十六夜ちはや/エルセ/音羽雫/鈴木あんず]\n3:16:43\tNEXT ARTIST\n3:17:00\tMCパート\n3:23:35\tdrop\n3:27:25\tMCパート\n\n3:28:16\tご視聴ありがとうございました',
        '2614': '0:00:00\tLife Like a Live!8 第五公演\n\n0:32:07\tカウントダウン\n0:32:56\tストーリー⑨\n0:34:31\t出演者紹介\n0:39:38\tストーリー⑩\n\nカオス・クイーン [茜音カンナ/音門るき/鈴鳴すばる/長谷みこと/ヤマト イオリ]\n0:40:09\tNEXT ARTIST\n0:40:30\tカオス DE フルコース\n0:44:42\tMCパート\n\nヤマト イオリ (.LIVE)\n0:50:42\tNEXT ARTIST\n0:50:59\tMCパート\n0:52:38\tシカ色デイズ\n0:56:00\tMCパート\n\n音門るき (VEE)\n0:57:39\tNEXT ARTIST\n0:58:00\tきっとビタミン\n1:01:12\tMCパート\n1:02:46\t晩餐歌\n1:06:20\tMCパート?\n\n茜音カンナ (ななしいんく)\n1:07:48\tNEXT ARTIST\n1:08:06\tNobody knows\n1:11:41\tMCパート\n1:13:20\tアデュー、サロー\n\nスペシャルユニット [茜音カンナ/鈴鳴すばる]\n1:15:56\tMCパート\n1:18:40\tREALIZE!\n1:23:13\tMCパート?\n\n1:23:25\tリフレッシュタイム\n\nvα-liv [上水流宇宙/灯里愛夏/レトラ]\n1:29:30\tNEXT ARTIST\n1:29:49\t"HELLO!!"\n1:34:00\tMCパート\n1:40:54\tリローディング\n1:44:58\tMCパート\n1:47:40\t愛なんだぜ\n\nアイデス (virtual avex AVALON)\n1:50:26\tNEXT ARTIST\n1:50:45\tポニーテールとシュシュ\n1:55:13\tMCパート\n1:56:35\tつくろう\n1:59:42\tMCパート\n2:00:41\tあの夢をなぞって\n2:04:48\tMCパート?\n　\nLiLYPSE [暁おぼろ/暁みかど]\n2:06:13\tNEXT ARTIST\n2:06:33\t8時だョ! 全員集合オープニング・テーマ\n2:08:32\tハレ晴レユカイ\n2:12:24\tMCパート\n2:13:12\tannuLus＆Sparkle\n2:17:25\tMCパート\n2:18:34\tYATTA!\n\nGEMS COMPANY [赤羽ユキノ/有栖川レイカ/一文字マヤ/音羽雫/小瀬戸らむ/奈日抽ねね/長谷みこと/星菜日向夏/水科葵]\n2:24:46\tNEXT ARTIST\n2:25:06\tメロウ\n2:30:13\tMCパート\n2:32:32\t夏色DROPS\n2:37:08\t渚ブルーのSensation\n\nまりなす [鈴鳴すばる/燈舞りん]\n2:43:00\tNEXT ARTIST\n2:43:26\tスターマイン\n2:47:14\tMCパート\n2:50:40\tsecret base ～君がくれたもの～\n\nまりなす×vα-liv [鈴鳴すばる/燈舞りん/上水流宇宙/灯里愛夏/レトラ]\n2:56:58\tNEXT ARTIST\n2:57:15\tMCパート\n3:02:15\t亜空の先へ\n3:06:02\tMCパート\n\n3:07:11\tエンディングライブ『Life Like a Live!』\n\n3:12:18\tエンディングクレジット\n\n3:20:49\tストーリー⑪\n\n3:22:23\tご視聴ありがとうございました',
    }

    let match = document.location.pathname.match(/.*?live\/play\/\d+\/(\d+)/);
    if (!match) return

    let num = match[1];
    if (!(num in data)) return;

    const timestamp = data[num].split(/[\r\n]+/g).filter(line => line.includes("\t")).map(line => {
        const s = line.split("\t");
        return {
            'timestamp': s[0],
            'seconds': HMStoS(s[0]),
            'text': s[1],
        }
    });

    const btnReload = generateBtn('timestamp_reload', 'M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z');
    const btnDisplay = document.createElement('button');
    btnDisplay.className = 'prism-time-display';
    btnDisplay.id = 'timestamp_current';
    btnDisplay.setAttribute('aria-disabled', false);
    btnDisplay.addEventListener('click', toggle);

    function toggle() {
        const div = document.querySelector('#timestamp-list');
        div.style.display = div.style.display === '' ? 'none' : '';
    }

    btnNext.addEventListener('click', seekTimestamp);
    btnReload.addEventListener('click', seekTimestamp);
    btnPrev.addEventListener('click', seekTimestamp);

    bar.insertBefore(btnDisplay, btnVolume.nextElementSibling);
    bar.insertBefore(btnNext, btnVolume.nextElementSibling);
    bar.insertBefore(btnReload, btnVolume.nextElementSibling);
    bar.insertBefore(btnPrev, btnVolume.nextElementSibling);

    const timeStampListSpan = document.createElement('span');
    timeStampListSpan.className = 'timestamp-text';
    timeStampListSpan.innerHTML = data[num].split("\n").map(line => {
        if (line.includes("\t")) {
            const splitted = line.split("\t");
            const obj = {
                'timestamp': splitted[0],
                'seconds': HMStoS(splitted[0]),
                'text': splitted[1],
            }
            return `<span class="time-text" time="${obj.seconds}">${obj.timestamp}</span> ${obj.text}`;
        }
        return line;
    }).join("\n");
    const timeStampListDiv = document.createElement('div');
    timeStampListDiv.id = 'timestamp-list';
    timeStampListDiv.className = 'timestamp-list';
    timeStampListDiv.style.display = 'none';
    timeStampListDiv.insertBefore(timeStampListSpan, null);
    const player = document.querySelector('#player-con');
    player.insertBefore(timeStampListDiv, null);

    function clickSeek(e) {
        const btn = e.target;
        const video = document.querySelector('video');
        video.currentTime = btn.getAttribute('time');
    }
    document.querySelectorAll('span.time-text').forEach(span => span.addEventListener('click', clickSeek));


    /* 現在時刻の監視 */
    /* https://stackoverflow.com/questions/7381293/how-to-intercept-innerhtml-changes-in-javascript */

    const observer = new MutationObserver(function () {
        updateTimestamp();
    });
    observer.observe(document.querySelector('span.current-time'), {
        characterData: false,
        childList: true,
        attributes: false
    });

    const controlBar = document.querySelector('div.prism-controlbar');
    const timestampList = document.querySelector('#timestamp-list');
    timestampList.style.display = 'none';

    const observer2 = new MutationObserver(function () {
        if (window.getComputedStyle(controlBar).getPropertyValue('display') === 'none') {
            timestampList.style.display = 'none';
        }
    });
    observer2.observe(controlBar, { attributes: true, attributeFilter: ['style'] });
})()