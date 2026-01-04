// ==UserScript==
// @name         YouTube Delete Liked Videos
// @name:zh-TW   YouTube 刪除已喜歡的影片
// @name:zh-HK   YouTube 刪除已喜歡的影片
// @name:zh-CN   YouTube 删除已喜欢的视频
// @name:ja      YouTube 好きな動画を削除する
// @name:kr      YouTube 좋아하는 동영상 삭제하기
// @name:ar      YouTube حذف الفيديوهات المعجب بها
// @name:bg      YouTube Изтриване на харесани видеоклипове
// @name:cs      YouTube Smazání oblíbených videí
// @name:da      YouTube Slet kanalliked videoer
// @name:de      YouTube Löschen von gemochten Videos
// @name:tel     YouTube లైక్ వీడియోలను తొలగించు
// @name:es      YouTube Eliminar vídeos marcados como gustados
// @name:en      YouTube Delete Liked Videos
// @name:fr      YouTube Supprimer les vidéos aimées
// @name:fr-CA   YouTube Supprimer les vidéos aimées
// @name:he      YouTube מחק סרטונים שאהבת
// @name:hu      YouTube Kedvelt videók törlése
// @name:id      YouTube Hapus Video yang Disukai
// @name:it      YouTube Elimina i video preferiti
// @name:ko      YouTube 좋아요 표시한 동영상 삭제하기
// @name:nb      YouTube Slett likte videoer
// @name:nl      YouTube Liked video's verwijderen
// @name:pl      YouTube Usuń polubione filmy
// @name:pt-BR   YouTube Excluir vídeos curtidos
// @name:ro      YouTube Ștergeți videoclipurile apreciate
// @name:ru      YouTube Удаление понравившихся видео
// @name:sk      YouTube Vymazanie obľúbených videí
// @name:sr      YouTube Брисање видеа која су свиђала
// @name:sv      YouTube Ta bort gillade videor
// @name:th      YouTube ลบวิดีโอที่ชอบ
// @name:tr      YouTube Beğenilen Videoları Sil
// @name:uk      YouTube Видалення вподобаних відео
// @name:ug      YouTube قوشۇلغان ۋىديولارنى ئۆچۈرۈش
// @name:vi      YouTube Xóa Video Đã Thích
// @name:hi      YouTube चाहते वीडियो हटाएं
// @description:zh-TW 刪除已喜歡的影片 YouTube
// @description:zh-HK 刪除已喜歡的影片 YouTube
// @description:zh-CN 删除已喜欢的视频 YouTube
// @description:ja    好きな動画を削除する YouTube
// @description:kr    좋아하는 동영상 삭제하기 YouTube
// @description:ar    حذف الفيديوهات المعجب بها على YouTube
// @description:bg    Изтриване на харесани видеоклипове в YouTube
// @description:cs    Smazání oblíbených videí na YouTube
// @description:da    Slet kanalliked videoer på YouTube
// @description:de    Löschen von gemochten Videos auf YouTube
// @description:tel   లైక్ వీడియోలను తొలగించు YouTube
// @description:es    Eliminar vídeos marcados como gustados en YouTube
// @description:en    Delete liked videos on YouTube
// @description:fr    Supprimer les vidéos aimées sur YouTube
// @description:fr-CA Supprimer les vidéos aimées sur YouTube
// @description:he    מחק סרטונים שאהבת ב-YouTube
// @description:hu    Kedvelt videók törlése a YouTube-on
// @description:id    Hapus Video yang Disukai di YouTube
// @description:it    Elimina i video preferiti su YouTube
// @description:ko    좋아요 표시한 동영상 삭제하기 YouTube
// @description:nb    Slett likte videoer på YouTube
// @description:nl    Verwijder gelikete video's op YouTube
// @description:pl    Usuń polubione filmy na YouTube
// @description:pt-BR Excluir vídeos curtidos no YouTube
// @description:ro    Ștergeți videoclipurile apreciate pe YouTube
// @description:ru    Удаление понравившихся видео на YouTube
// @description:sk    Vymazanie obľúbených videí na YouTube
// @description:sr    Брисање видеа која су свиђала на Јутубу
// @description:sv    Ta bort gillade videor på YouTube
// @description:th    ลบวิดีโอที่ชอบใน YouTube
// @description:tr    Beğenilen Videoları Sil YouTube
// @description:uk    Видалення вподобаних відео на YouTube
// @description:ug    يوتۇبدا قوشۇلغان ۋىديولارنى ئۆچۈرۈڭ
// @description:vi    Xóa Video Đã Thích trên YouTube
// @description:hi    चाहते वीडियो हटाएं YouTube
// @description:fr    Supprimer les vidéos aimées sur YouTube
// @description:bn    পছন্দ করা ভিডিও মুছে ফেলুন YouTube
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Adds a button to delete liked videos on YouTube
// @author       toxtodo
// @match        https://www.youtube.com/playlist?list=LL*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500337/YouTube%20Delete%20Liked%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/500337/YouTube%20Delete%20Liked%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        var button = document.createElement('button');
        button.innerHTML = 'Delete Liked Videos';
        button.style.position = 'relative';
        button.style.zIndex = '1000';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px';

        button.onclick = function() {
            deleteLikedVideos();
        };

        var targetElement = document.querySelector('#end');

        if (targetElement) {
            targetElement.insertBefore(button, targetElement.firstChild);
        } else {
            console.log('Target element not found.');
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function deleteLikedVideos() {
        'use strict';
        var oldItems = document.querySelectorAll('#primary ytd-playlist-video-renderer yt-icon-button.dropdown-trigger > button[aria-label]');
        var newItems = document.querySelectorAll('#menu yt-icon-button.dropdown-trigger > button#button');
        var items;
        
        if (oldItems.length > 0) {
            items = oldItems;
        } else if (newItems.length > 0) {
            items = newItems;
        } else {
            console.log('No items found to delete.');
            return;
        }
        
        for (var i = 0; i < items.length; i++) {
            items[i].click();
            await sleep(100);
            
            var listBoxOld = document.querySelector('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer');
            var listBoxNew = document.querySelector('tp-yt-paper-listbox#items');
            var listBox = listBoxOld || listBoxNew;
            
            if (listBox && listBox.lastElementChild) {
                listBox.lastElementChild.click();
            } else {
                console.log('No delete option found.');
            }
            
            await sleep(500);
        }
    }

    window.addEventListener('load', createButton);

})();
