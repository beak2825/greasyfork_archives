// ==UserScript==
// @name         Caixa Inútil do Facebook
// @description  Remove o popup que diz que você deve fazer login ou se cadastrar no facebook.
// @namespace    http://linkme.bio/jhonpergon/?userscript=bannerfb
// @version      1.2
// @author       Jhon Pérgon
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACTUlEQVRYR2NkGGDAOMD2M5DvgPqjxxn+/bMAe4CJ6QRDo7UlOZ4h3QFNZ3QZfn+/hNUyVk49hjqTy6Q4hDQH1B7+T5ThzbZEm0ucwtoj/xgY/hOnFu5Cxv8MzTZMhByM39CG4/MY/v5JJGQIXnlmlvkMDZZJuNRgd0DDMSGGv3/fUmQxumZmZmGGBqt36MKYDiA2noEmWUtzM6yO0kYxU655L8MfDl7cbkdLH+Q74P9/hmdl5hgW0c0B17MNGPi52OAOqF9xkOHj958Max4zMfzj5KN9CDwrNYNbIlOzmeEfvzhxSYZaUYDsAKnWAwwMbFwjwQF/fjE8q7TB61OpzuPAuoGZRmmAGAd0n8IfFRSlgQF3AJLfRmgiHA0BeoQAo2PJ//82/gRLNXISIeORjQz/9/egVIAYtSGjS+V/BmBN919CnoFBSQenQ0hywL0rDIwvHjIwMDIy/N/Tjt8BYBvdG4QY//96C3aIFTA0/v3GdMj9s8BWGrClBgIyQIeycWKqYWJlYDy2EWIxI5sww84GIhokSMYweTXMA7YEExn+/WH4b+JOMFqQFTCe2QksklkYgC3D+f+2NZDYJEOziimwHdwo/f/vL8N/PQe8DmG8dICBEVwXAJWvr6SwUYrukMh+YLP8P8M/STUGBm5+VNmvHxmYnt8CWczwb3kh0S1oohXCbUuYqcvE+O8SKP7/KUEaJUz3gBUQI7Al9Pe/PsOiLOydFhzhRroDoAYxZi44DtQM7poBg+XE/+kJdOqakZQUCSsmOwQIG02cCgCcNOQhNTVMDwAAAABJRU5ErkJggg==

// @name:pt         Caixa Inútil do Facebook
// @name:pt-BR      Caixa Inútil do Facebook
// @name:pt-PT      Caixa Inútil do Facebook
// @name:es         Caja Inútil de Facebook
// @name:en         Facebook Useless Box
// @name:fr         Boîte Inutile Facebook
// @name:ru         Бесполезная коробка Facebook
// @name:ja         フェイスブックの無駄なボックス
// @name:ko         페이스북 쓸모없는 박스
// @name:zh-TW      Facebook 無用盒
// @name:zh-CN      Facebook 无用盒
// @name:id         Kotak Tidak Berguna Facebook
// @name:ug         Facebook Heqiqi Quti
// @name:ar         صندوق فيسبوك الغير مفيد
// @name:he         קופסת פייסבוק לא שימושית
// @name:hi         फेसबुक यूज़लेस बॉक्स
// @name:th         กล่องไร้ประโยชน์ของ Facebook
// @name:bg         Фейсбук Безполезна Кутия
// @name:ro         Cutie Inutilă Facebook
// @name:fi         Facebookin Hyödytön Laatikko
// @name:it         Scatola Inutile di Facebook
// @name:el         Αντίστοιχο Κουτί Μηχανισμού του Facebook
// @name:eo         Senutila Skatolo de Facebook
// @name:hu         Facebook Haszontalan Doboz
// @name:nb         Facebook Nytteløs Boks
// @name:sk         Facebook Bezobsahová Schránka
// @name:sv         Facebook Onödig Låda
// @name:sr         Фејсбук Бескорисна Кутија
// @name:pl         Bezsensowne Pudełko Facebooka
// @name:nl         Nutteloze Doos van Facebook
// @name:de         Facebook Nutzlose Box
// @name:da         Facebook Brugløs Boks
// @name:cs         Facebook Zbytečná Krabice
// @name:uk         Непотрібна скринька Facebook
// @name:tr         Facebook Gereksiz Kutu
// @name:vi         Hộp Vô Dụng của Facebook
// @name:fr-CA      Boîte Inutile de Facebook

// @description:pt       Remove o popup que diz que você deve fazer login ou se cadastrar no facebook.
// @description:pt-BR    Remove o popup que diz que você deve fazer login ou se cadastrar no facebook.
// @description:pt-PT    Remove o popup que diz que você deve fazer login ou se cadastrar no facebook.
// @description:en       Remove the box that says you must register or log in to view this page on Facebook.
// @description:es       Elimina la caja que dice que debes registrarte o iniciar sesión para ver esta página en Facebook.
// @description:fr       Supprimez la boîte qui indique que vous devez vous inscrire ou vous connecter pour voir cette page sur Facebook.
// @description:ru       Уберите окно, которое говорит, что для просмотра этой страницы на Facebook необходимо зарегистрироваться или войти в систему.
// @description:ja       Facebookでこのページを表示するには登録またはログインする必要があると表示されているボックスを取り除きます。
// @description:ko       Facebook에서 이 페이지를 보려면 등록하거나 로그인해야한다는 상자를 제거합니다.
// @description:zh-TW    移除顯示在 Facebook 上查看此頁面必須註冊或登錄的框。
// @description:zh-CN    删除在 Facebook 上查看此页面必须注册或登录的框。
// @description:id       Hapus kotak yang menyatakan Anda harus mendaftar atau masuk untuk melihat halaman ini di Facebook.
// @description:ug       Facebookdiki bu sahifini ko'rish uchun ro'yxatdan o'tish yoki kirish kiritishni aytadigan qutini olib tashlang.
// @description:ar       قم بإزالة الصندوق الذي يقول إنه يجب عليك التسجيل أو تسجيل الدخول لعرض هذه الصفحة على فيسبوك.
// @description:he       הסר את התיק בו כתוב שעליך להירשם או להתחבר כדי לראות דף זה בפייסבוק.
// @description:hi       उस बॉक्स को हटाएं जिसमें कहा गया है कि आपको इस पृष्ठ को देखने के लिए पंजीकरण करना या लॉगिन करना होगा।
// @description:th       ลบกล่องที่ระบุว่าคุณต้องลงทะเบียนหรือเข้าสู่ระบบเพื่อดูหน้านี้ใน Facebook ออก
// @description:bg       Премахнете кутията, която казва, че трябва да се регистрирате или влезете, за да видите тази страница във Facebook.
// @description:ro       Eliminați cutia care spune că trebuie să vă înregistrați sau să vă autentificați pentru a vizualiza această pagină pe Facebook.
// @description:fi       Poista laatikko, joka sanoo, että sinun on rekisteröidyttävä tai kirjauduttava sisään nähdäksesi tämän sivun Facebookissa.
// @description:it       Rimuovi la casella che dice che devi registrarti o accedere per visualizzare questa pagina su Facebook.
// @description:el       Αφαιρέστε το κουτί που λέει πρέπει να εγγραφείτε ή να συνδεθείτε για να δείτε αυτή τη σελίδα στο Facebook.
// @description:eo       Forigilo la skatolon kiu diras ke vi devas registriĝi aŭ ensaluti por vidi tiun paĝon sur Facebook.
// @description:hu       Távolítsa el azt a dobozt, amely azt mondja, hogy regisztrálnia vagy bejelentkeznie kell a Facebookon történő oldalnézéshez.
// @description:nb       Fjern boksen som sier at du må registrere deg eller logge inn for å se denne siden på Facebook.
// @description:sk       Odstráňte box, ktorý hovorí, že sa musíte prihlásiť alebo zaregistrovať, aby ste videli túto stránku na Facebooku.
// @description:sv       Ta bort rutan som säger att du måste registrera dig eller logga in för att se den här sidan på Facebook.
// @description:sr       Уклоните кутију која каже да се морате регистровати или пријавити да бисте видели ову страницу на Фејсбуку.
// @description:pl       Usuń pole, które mówi, że musisz się zarejestrować lub zalogować, aby zobaczyć tę stronę na Facebooku.
// @description:nl       Verwijder de box die zegt dat je je moet registreren of inloggen om deze pagina op Facebook te bekijken.
// @description:de       Entfernen Sie die Box, die besagt, dass Sie sich registrieren oder anmelden müssen, um diese Seite auf Facebook zu sehen.
// @description:da       Fjern boksen, der siger, at du skal registrere dig eller logge ind for at se denne side på Facebook.
// @description:cs       Odeberte pole, které říká, že se musíte zaregistrovat nebo přihlásit, abyste mohli zobrazit tuto stránku na Facebooku.
// @description:uk       Видаліть коробку, яка каже, що для перегляду цієї сторінки на Facebook потрібно зареєструватися або увійти.
// @description:tr       Facebook'ta bu sayfayı görmek için kaydolmanız veya giriş yapmanız gerektiğini söyleyen kutuyu kaldırın.
// @description:vi       Loại bỏ hộp thông báo bạn phải đăng ký hoặc đăng nhập để xem trang này trên Facebook.
// @description:fr-CA    Supprimez la boîte qui indique que vous devez vous inscrire ou vous connecter pour voir cette page sur Facebook.

// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://m.facebook.com/*
// @match        https://facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/*
// @match        http://facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/*

// @license      MIT
// @grant        none
// @run-at       document-start

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/480649/Caixa%20In%C3%BAtil%20do%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/480649/Caixa%20In%C3%BAtil%20do%20Facebook.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeFx(){
      let checarMargin = document.querySelectorAll('div');
        if(checarMargin){
          checarMargin.forEach(function (elementoD) {
            // Tira a margem de outra coisa para aumentar o espaço em tela
            if(elementoD.style.top == "56px"){
              elementoD.style.top = '-5px';
              elementoD.style.marginTop = '-5px';
            }
          });
      }
    }

    // Caso o carregamento seja lento
    window.setTimeout(removeFx, 250);
    window.setTimeout(removeFx, 550);
    window.setTimeout(removeFx, 1050);
    window.setTimeout(removeFx, 1550);
    window.setTimeout(removeFx, 2500);

  function removeBoxdown(){
     let checarDivs = document.querySelectorAll('div[data-nosnippet]');
        if(checarDivs){
          checarDivs.forEach(function (elementoN) {
            elementoN.style.display = 'none';
          });
      }
    let checarExist = document.querySelector('#pagelet_growth_expanding_cta');
    if(checarExist){
        checarExist.style.display = 'none';
    }
  }

   const checkBanner = setInterval(() => {
        removeBoxdown()
    }, 500);

  setTimeout(() => {
      clearInterval(checkBanner);
  }, 12000);

})();
