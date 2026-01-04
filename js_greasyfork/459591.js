// ==UserScript==
// @name         Manga-TR Bolum Yorumlarini Otomatik Olarak Ac
// @namespace    https://github.com/DeadLyBro
// @version      2.1
// @description  Manga-TR sitesinde bölüm yorumlarını otomatik olarak açar. (Sayfa açıldıktan 5 saniye sonra.)
// @author       DeadLyBro
// @copyright    2022, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @license      MIT
// @match        https://manga-tr.com/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/////////////////AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/////////////////AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/////////////////AAAA/wAAAP///////////wAAAP8AAAD/////////////////AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP//////////////////////AAAA/////////////////wAAAP8AAAD/AAAA/wAAAP////////////////////////////////////////////////////////////////8AAAD/AAAA/wAAAP8AAAD///////////////////////////8AAAD/AAAA////////////////////////////AAAA/wAAAP8AAAD/AAAA//////////////////////8AAAD/AAAA/wAAAP8AAAD//////////////////////wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459591/Manga-TR%20Bolum%20Yorumlarini%20Otomatik%20Olarak%20Ac.user.js
// @updateURL https://update.greasyfork.org/scripts/459591/Manga-TR%20Bolum%20Yorumlarini%20Otomatik%20Olarak%20Ac.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       DeadLyBro
// ==/OpenUserJS==

setTimeout(function(){
    $("#load-comments-button").off("click");

    const cid = window.location.href.match(/id-(\d+)/)[1];

    $('#load-comments-button').click(function() {
        var currentURL = window.location.href;
        $.ajax({
            url: 'yorum.php',
            type: 'POST',
            data: {
                chapter_id: cid,
                current_page_url: currentURL
            },
            success: function(response) {
                $('#comments-container').html(response);
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", xhr, status, error);
                $('#comments-container').html("<p>Yorumlar yüklenirken bir hata oluştu.</p>");
            }
        });
    });

    let siteURL = window.location.href;
    if (siteURL.split('/').slice(2)[1].startsWith('id') && !document.querySelector('.reaction-container') || siteURL.split('/').slice(2)[1].startsWith('read') && !document.querySelector('.reaction-container')) {
        document.querySelector('#load-comments-button').click();
    }
}, 5*1000) // 5 saniye sonra kod çalışır.