/* ==UserStyle==
@name         乾淨的YouTube Shorts影片
@name:en      Clean YouTube Shorts Video
@name:ja      クリーンなYouTube Shorts動畫
@name:de      Sauberes YouTube Shorts Video
@name:uk      Чисте відео YouTube Shorts
@description  把影片標題、創作者資訊與更多有的沒的改成透明，直到你將滑鼠指向該區域
@description:en Makes the video title, creator info, and other elements transparent until you hover over the area
@description:ja 動畫のタイトル、クリエイター情報、その他の要素をマウスをホバーするまで透明にします
@description:de Macht den Videotitel, die Erstellerinformationen und andere Elemente transparent, bis Sie mit der Maus darüberfahren
@description:uk Робить заголовок відео, інформацію про автора та інші елементи прозорими, доки ви не наведете на них курсор

@author       Max
@namespace    https://github.com/Max46656
@supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues

@version      1.0.1
@license      MPL2.0
@preprocessor default
@downloadURL https://update.greasyfork.org/scripts/546510/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20Shorts%E5%BD%B1%E7%89%87.user.css
@updateURL https://update.greasyfork.org/scripts/546510/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20Shorts%E5%BD%B1%E7%89%87.meta.css
==/UserStyle== */

@-moz-document url-prefix("https://www.youtube.com/") {
    :root {
        --default-opacity: 0;   /* 預設透明度 */
        --hover-opacity: 0.8;   /* 滑鼠懸停時的透明度 */
    }

    ytd-reel-player-overlay-renderer .metadata-container.style-scope {
        opacity: var(--default-opacity) !important;
        transition: opacity 0.3s ease !important;
    }

    ytd-reel-player-overlay-renderer .metadata-container.style-scope:hover {
        opacity: var(--hover-opacity) !important;
    }
}
