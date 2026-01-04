// ==UserScript==
// @name             Hide Baidu Wenku "Document Assistant" Floating Window
// @name:ar          إخفاء النافذة المنبثقة للمساعد المستندي على Baidu Wenku
// @name:bg          Скриване на изскачащия прозорец "Документен асистент" в Baidu Wenku
// @name:cs          Skrýt plovoucí okno "Dokumentní asistent" na Baidu Wenku
// @name:da          Skjul "Dokumentassistent" flydende vindue på Baidu Wenku
// @name:de          Schwebendes "Dokumentations-Assistenten"-Fenster auf Baidu Wenku ausblenden
// @name:el          Απόκρυψη αναδυόμενου παραθύρου "Βοηθού Εγγράφων" στο Baidu Wenku
// @name:en          Hide Baidu Wenku "Document Assistant" Floating Window
// @name:eo          Kaŝi "Dokumentan Asistanton" fluantan fenestron en Baidu Wenku
// @name:es          Ocultar ventana flotante del "Asistente de Documentos" en Baidu Wenku
// @name:fi          Piilota Baidu Wenkun "Dokumenttiavustaja" kelluva ikkuna
// @name:fr          Masquer la fenêtre flottante de l'"Assistant de document" sur Baidu Wenku
// @name:fr-CA       Masquer la fenêtre flottante de l'"Assistant de document" sur Baidu Wenku
// @name:he          הסתר את החלון הצף של "עוזר המסמכים" ב-Baidu Wenku
// @name:hr          Sakrij plutajući prozor "Dokumentnog asistenta" na Baidu Wenku
// @name:hu          Baidu Wenku "Dokumentum asszisztens" lebegő ablakának elrejtése
// @name:id          Sembunyikan Jendela Mengambang "Asisten Dokumen" di Baidu Wenku
// @name:it          Nascondi la finestra mobile dell'"Assistente documenti" su Baidu Wenku
// @name:ja          Baidu Wenku の「ドキュメントアシスタント」フローティングウィンドウを非表示
// @name:ka          Baidu Wenku-ზე "დოკუმენტის ასისტენტის" მოძრავი ფანჯრის დამალვა
// @name:ko          Baidu Wenku의 "문서 도우미" 플로팅 창 숨기기
// @name:nb          Skjul "Dokumentassistent" flytende vindu på Baidu Wenku
// @name:nl          Zwevend venster "Documentassistent" op Baidu Wenku verbergen
// @name:pl          Ukryj pływające okno "Asystenta dokumentów" w Baidu Wenku
// @name:pt-BR       Ocultar janela flutuante do "Assistente de Documentos" no Baidu Wenku
// @name:ro          Ascunde fereastra plutitoare a "Asistentului de Documente" pe Baidu Wenku
// @name:ru          Скрыть всплывающее окно "Помощника документов" на Baidu Wenku
// @name:sk          Skryť plávajúce okno "Dokumentového asistenta" na Baidu Wenku
// @name:sr          Сакриј лебдећи прозор "Документ асистента" на Baidu Wenku
// @name:sv          Dölj "Dokumentassistentens" flytande fönster på Baidu Wenku
// @name:th          ซ่อนหน้าต่างลอยของ "ผู้ช่วยเอกสาร" บน Baidu Wenku
// @name:tr          Baidu Wenku'daki "Belge Asistanı" kayan penceresini gizle
// @name:ug          Baidu Wenku دىكى "ھۆججەت ياردەمچىسى" قاڭقىش دېرىزىسىنى يوشۇرۇش
// @name:uk          Приховати спливаюче вікно "Помічника документів" на Baidu Wenku
// @name:vi          Ẩn cửa sổ nổi "Trợ lý Tài liệu" trên Baidu Wenku
// @name:zh          隐藏百度文库内"文档助手"悬浮窗
// @name:zh-CN       隐藏百度文库内"文档助手"悬浮窗
// @name:zh-HK       隱藏百度文庫內「文檔助手」懸浮窗
// @name:zh-TW       隱藏百度文庫內「文檔助手」懸浮窗
// @namespace    http://tampermonkey.net/
// @version      0.4.12
// @description       Remove the intrusive "Document Assistant" floating window on Baidu Wenku
// @description:ar    إزالة النافذة المنبثقة المزعجة للمساعد المستندي على Baidu Wenku
// @description:bg    Премахване на досадния изскачащ прозорец "Документен асистент" в Baidu Wenku
// @description:cs    Odstranění obtěžujícího plovoucího okna "Dokumentní asistent" na Baidu Wenku
// @description:da    Fjern det forstyrrende "Dokumentassistent" flydende vindue på Baidu Wenku
// @description:de    Entfernen des störenden schwebenden "Dokumentations-Assistenten"-Fensters auf Baidu Wenku
// @description:el    Αφαίρεση του ενοχλητικού αναδυόμενου παραθύρου "Βοηθός Εγγράφων" στο Baidu Wenku
// @description:en    Hide Baidu Wenku's hover window named "Document Assistant"
// @description:eo    Forigi la ĝenantam "Dokumentan Asistanton" fluantan fenestron en Baidu Wenku
// @description:es    Eliminar la ventana flotante molesta del "Asistente de Documentos" en Baidu Wenku
// @description:fi    Poista häiritsevä Baidu Wenkun "Dokumenttiavustaja" kelluva ikkuna
// @description:fr    Masquer la fenêtre flottante encombrante de l'"Assistant de document" sur Baidu Wenku
// @description:fr-CA Masquer la fenêtre flottante encombrante de l'"Assistant de document" sur Baidu Wenku
// @description:he    הסתר את החלון הצף המעצבן של "עוזר המסמכים" ב-Baidu Wenku
// @description:hr    Ukloni dosadnu plutajuću prozor "Dokumentnog asistenta" na Baidu Wenku
// @description:hu    A Baidu Wenku zavaró "Dokumentum asszisztens" lebegő ablakának elrejtése
// @description:id    Hapus jendela mengambang yang mengganggu "Asisten Dokumen" di Baidu Wenku
// @description:it    Rimuovi la fastidiosa finestra mobile dell'"Assistente documenti" su Baidu Wenku
// @description:ja    Baidu Wenku の邪魔な「ドキュメントアシスタント」フローティングウィンドウを非表示
// @description:ka    Baidu Wenku-ზე "დოკუმენტის ასისტენტის" მომაბეზრებელი მოძრავი ფანჯრის დამალვა
// @description:ko    Baidu Wenku의 성가신 "문서 도우미" 플로팅 창 숨기기
// @description:nb    Fjern den forstyrrende "Dokumentassistent" flytende vinduet på Baidu Wenku
// @description:nl    Verwijder het hinderlijke zwevende venster "Documentassistent" op Baidu Wenku
// @description:pl    Usuń irytujące pływające okno "Asystenta dokumentów" w Baidu Wenku
// @description:pt-BR Remover a janela flutuante irritante do "Assistente de Documentos" no Baidu Wenku
// @description:ro    Ascunde fereastra plutitoare deranjantă a "Asistentului de Documente" pe Baidu Wenku
// @description:ru    Скрыть надоедливое всплывающее окно "Помощника документов" на Baidu Wenku
// @description:sk    Odstrániť obťažujúce plávajúce okno "Dokumentového asistenta" na Baidu Wenku
// @description:sr    Уклони досадни лебдећи прозор "Документ асистента" на Baidu Wenku
// @description:sv    Ta bort det störande "Dokumentassistentens" flytande fönster på Baidu Wenku
// @description:th    ลบหน้าต่างลอยที่น่าหงุดหงิดของ "ผู้ช่วยเอกสาร" บน Baidu Wenku
// @description:tr    Baidu Wenku'daki can sıkıcı "Belge Asistanı" kayan penceresini gizle
// @description:ug    Baidu Wenku دىكى ئالدىراش "ھۆججەت ياردەمچىسى" قاڭقىش دېرىزىسىنى يوشۇرۇش
// @description:uk    Приховати надокучливе спливаюче вікно "Помічника документів" на Baidu Wenku
// @description:vi    Ẩn cửa sổ nổi khó chịu của "Trợ lý Tài liệu" trên Baidu Wenku
// @description:zh    隐藏百度文库名为"文档助手"的悬浮窗
// @description:zh-CN 隐藏百度文库名为"文档助手"的悬浮窗
// @description:zh-HK 隱藏百度文庫名為「文檔助手」的懸浮窗
// @description:zh-TW 隱藏百度文庫名為「文檔助手」的懸浮窗
// @author      aspen138
// @match       *://wenku.baidu.com/*
// @match       *://wenku.baidu.com/?_wkts_=*
// @match       *://wenku.baidu.com/view/*
// @match       *://wenku.baidu.com/share/*
// @match       *://wenku.baidu.com/link*
// @match       *://wenku.baidu.com/aggs/*
// @match       *://wenku.baidu.com/ndPureView/*
// @grant        GM_addStyle
// @icon         https://edu-wenku.bdimg.com/v1/pc/view/NavMenu/wenku-logo-small.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475801/Hide%20Baidu%20Wenku%20%22Document%20Assistant%22%20Floating%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/475801/Hide%20Baidu%20Wenku%20%22Document%20Assistant%22%20Floating%20Window.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`#wk-chat { display: none !important; }
                .wk-chat-modal.open { display: none !important; }
                #app-right{display:none!important}
                #right-wrapper-id{display:none!important}
                .right-chat-wrapper{display:none!important}
                .banner-wrapper{display:none!important}
                .vip-activity-content {display:none!important}
                .wkapp-wrap  {display:none!important}
                .theme-enter-wrap {display:none!important}`);
    window.onload = function () {
        document.querySelector(".editor-plugin-wrap").parentElement.removeChild(document.querySelector(".editor-plugin-wrap"))
    }


    let t = setInterval(function () {
        if ($('.chat-header .close').length > 0) {
            $('.chat-header .close').click();
        }

        if ($('.fold-page-text .btn.unfold').length > 0 && $('.fold-page-text .btn.unfold').text().indexOf('查看剩余全文') > -1) {
            $('.fold-page-text .btn.unfold').click();
        }

        if ($('.liter-head-fold-btn').length > 0 && $('.liter-head-fold-btn').text().indexOf('展开更多信息') > -1) {
            $('.liter-head-fold-btn').click();
        }
    }, 1000);

})();