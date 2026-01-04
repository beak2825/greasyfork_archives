// ==UserScript==
 
 
// @name        隱藏網頁要求通知權限
// @name:zh-TW   隱藏網頁要求通知權限
// @name:zh-CN   隐藏网页请求通知权限
// @name:ja      ウェブページの通知権限リクエストを非表示にする
// @name:en      Hide Webpage Notification Permission Requests
// @name:es      Ocultar solicitudes de permiso de notificación de página web
// @name:fr      Masquer les demandes de permission de notification de page Web
// @name:de      Webseitenbenachrichtigungsberechtigungsanfragen ausblenden
// @name:it      Nascondi richieste di autorizzazione alle notifiche delle pagine web
// @name:pt      Ocultar pedidos de permissão de notificação da página da web
// @name:ru      Скрыть запросы разрешения на уведомления веб-страницы
// @name:nl      Verberg meldingsmachtigingsverzoeken van webpagina's
// @name:ko      웹 페이지 알림 권한 요청 숨기기
// @name:ar      إخفاء طلبات إذن الإشعار على صفحات الويب
// @name:hi      वेबपेज सूचना अनुमति अनुरोध छुपाएं
// @name:tr      Web sayfası bildirim izni isteklerini gizleme
// @name:id      Sembunyikan permintaan izin pemberitahuan halaman web
// @name:vi      Ẩn yêu cầu quyền thông báo của trang web
// @name:th      ซ่อนคำขอการอนุญาตการแจ้งเตือนของหน้าเว็บ
 
// @version      0.8
 
// @description:zh-TW   自動隱藏所有網頁的通知權限要求。
// @description:zh-CN   自动隐藏所有网页的通知权限请求。
// @description:ja      すべてのウェブページの通知権限要求を自動的に非表示にします。
// @description:en      Automatically hides notification permission requests on all webpages.
// @description:es      Oculta automáticamente las solicitudes de permiso de notificación en todas las páginas web.
// @description:fr      Masque automatiquement les demandes de permission de notification sur toutes les pages Web.
// @description:de      Verbirgt automatisch Benachrichtigungsberechtigungsanfragen auf allen Webseiten.
// @description:it      Nasconde automaticamente le richieste di autorizzazione alle notifiche su tutte le pagine web.
// @description:pt      Oculta automaticamente os pedidos de permissão de notificação em todas as páginas da web.
// @description:ru      Автоматически скрывает запросы на разрешение уведомлений на всех веб-страницах.
// @description:nl      Verbergt automatisch meldingsmachtigingsverzoeken op alle webpagina's.
// @description:ko      모든 웹 페이지에서 알림 권한 요청을 자동으로 숨깁니다.
// @description:ar      يخفي تلقائيًا طلبات إذن الإشعار على جميع صفحات الويب.
// @description:hi      सभी वेबपेजों पर सूचना अनुमति अनुरोधों को स्वचालित रूप से छुपाता है।
// @description:tr      Tüm web sayfalarında bildirim izni isteklerini otomatik olarak gizler.
// @description:id      Secara otomatis menyembunyikan permintaan izin pemberitahuan di semua halaman web.
// @description:vi      Tự động ẩn các yêu cầu quyền thông báo trên tất cả các trang web.
// @description:th      ซ่อนคำขอการอนุญาตการแจ้งเตือนโดยอัตโนมัติบนเว็บไซต์ทั้งหมด
 
 
// @author       Scott
 
// @match        *://*/*
// @grant        none
 
 
// @license      MIT
// @namespace    https://www.youtube.com/c/ScottDoha
 
// @description 自動拒絕所有網頁的通知權限要求。
// @downloadURL https://update.greasyfork.org/scripts/495611/%E9%9A%B1%E8%97%8F%E7%B6%B2%E9%A0%81%E8%A6%81%E6%B1%82%E9%80%9A%E7%9F%A5%E6%AC%8A%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/495611/%E9%9A%B1%E8%97%8F%E7%B6%B2%E9%A0%81%E8%A6%81%E6%B1%82%E9%80%9A%E7%9F%A5%E6%AC%8A%E9%99%90.meta.js
// ==/UserScript==
 
 
 
// 替換 requestPermission() 函數為自定義函數
// Replace requestPermission() function with a custom function
const originalRequestPermission = Notification.requestPermission || function() {};

// 自定義函數，當請求通知權限時調用
// Custom function called when requesting notification permission
Notification.requestPermission = function() {
    // 檢查瀏覽器語言
    // Detect browser language
    var userLanguage = navigator.language || navigator.userLanguage;

    // 輸出對應語言
    // Output corresponding language
    switch(userLanguage) {
        case "zh-CN":
        case "zh-SG":
            console.log("简体中文：通知权限请求已拦截。隐藏通知请求。");
            break;
        case "zh-TW":
        case "zh-HK":
            console.log("繁體中文：通知權限請求已攔截。隱藏通知請求。");
            break;
        case "ja":
            console.log("日本語：通知許可要求がインターセプトされました。通知リクエストが非表示になります。");
            break;
        case "es":
            console.log("Spanish: Solicitud de permiso de notificación interceptada. Ocultando la solicitud de notificación.");
            break;
        case "fr":
            console.log("French: Demande de permission de notification interceptée. Masquage de la demande de notification.");
            break;
        case "de":
            console.log("German: Benachrichtigungsberechtigungsanfrage abgefangen. Benachrichtigungsanfrage ausblenden.");
            break;
        case "it":
            console.log("Italian: Richiesta di autorizzazione alle notifiche intercettata. Nascondi la richiesta di notifica.");
            break;
        case "pt":
            console.log("Portuguese: Solicitação de permissão de notificação interceptada. Ocultando a solicitação de notificação.");
            break;
        case "ru":
            console.log("Russian: Запрос разрешения на уведомление перехвачен. Скрытие запроса на уведомление.");
            break;
        case "nl":
            console.log("Dutch: Meldingsmachtigingsverzoek onderschept. Verbergen van het meldingsverzoek.");
            break;
        case "ko":
            console.log("Korean: 알림 권한 요청이 가로채졌습니다. 알림 요청 숨기기.");
            break;
        case "ar":
            console.log("Arabic: تم اعتراض طلب إذن الإشعار. إخفاء طلب الإشعار.");
            break;
        case "hi":
            console.log("Hindi: अधिसूचना अनुमति अनुरोध रोक दिया गया। अधिसूचना अनुरोध छिपाना।");
            break;
        case "tr":
            console.log("Turkish: Bildirim izni talebi engellendi. Bildirim isteğini gizleme.");
            break;
        case "id":
            console.log("Indonesian: Permintaan izin pemberitahuan disisipkan. Menyembunyikan permintaan pemberitahuan.");
            break;
        case "vi":
            console.log("Vietnamese: Yêu cầu quyền thông báo đã bị chặn. Ẩn yêu cầu thông báo.");
            break;
        case "th":
            console.log("Thai: คำขออนุญาตการแจ้งเตือนถูกดักแล้ว กำลังซ่อนคำขอการแจ้งเตือน");
            break;
        default:
            console.log("English: Notification permission request intercepted. Hiding notification request.");
    }

    // 返回一個已解析的 Promise 對象
    // Return a resolved Promise
    return Promise.resolve();
};