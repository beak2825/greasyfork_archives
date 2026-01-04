/* ==UserStyle==
@name         乾淨的YouTube 影片結尾
@name:en      Clean YouTube Video Ending
@name:ja      クリーンなYouTube動畫の終了
@name:de      Sauberes YouTube-Videoende
@name:uk      Чисте завершення відео YouTube
@description  把其他推薦影片、創作者資訊與更多有的沒的改成透明，直到你將滑鼠指向該區域
@description:en Makes other recommended videos, creator info, and other elements transparent until you hover over the area
@description:ja 他の推薦動畫、クリエイター情報、その他の要素をマウスをホバーするまで透明にします
@description:de Macht andere empfohlene Videos, Erstellerinformationen und andere Elemente transparent, bis Sie mit der Maus darüberfahren
@description:uk Робить інші рекомендовані відео, інформацію про автора та інші елементи прозорими, доки ви не наведете на них курсор
 
@author       Max
@namespace    https://github.com/Max46656
@supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues
 
@version      2.0.0
@license      MPL2.0
@preprocessor default
@downloadURL https://update.greasyfork.org/scripts/549809/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20%E5%BD%B1%E7%89%87%E7%B5%90%E5%B0%BE.user.css
@updateURL https://update.greasyfork.org/scripts/549809/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20%E5%BD%B1%E7%89%87%E7%B5%90%E5%B0%BE.meta.css
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