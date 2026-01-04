// ==UserScript==
// @license MIT
// @name         單手救星
// @namespace    https://greasyfork.org/zh-TW/scripts/482985-%E5%96%AE%E6%89%8B%E6%95%91%E6%98%9F
// @version      23.12.24
// @description  Release your busily hand for peace !!
// @author       Fourteen
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @match        https://lurl.cc/*
// @match        https://myppt.cc/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/482985/%E5%96%AE%E6%89%8B%E6%95%91%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/482985/%E5%96%AE%E6%89%8B%E6%95%91%E6%98%9F.meta.js
// ==/UserScript==

/*

功能 : 預設密碼 - 自動填入上傳日期作為預設密碼

*/

// ====== Variable

  var Domain ;

// ====== Window

  window.onload = function() {

    const Url = window.location.href ;

    // ====

    console.log( "頁面讀取完畢，開始進行過濾 !!" )

    // ====

    Domain = Array.from(Url.matchAll(/\:\/\/(.*)\/\*?/g), md => md[1])[0] ;

    Domain_Action(Domain) ;

  }


// ====== Funtion

  function Domain_Action(DA_Domain) {

    let Update_Time = null, Password = null ;

    // ====

    switch (DA_Domain) {

      case "lurl.cc" :

        if ( $("input#password").length )
        {

          Update_Time = $("#form_password span.login_span").text() ;

          Password = (Array.from(Update_Time.matchAll(/\d{4}-(\d{2}\-\d{2})/g), m => m[1])[0]).replace("-", "") ;

          $("input#password").val(Password) ;

          // ==

          $("#form_password span.login_span").parent().append(`<br /><span style='font-size: 0.9rem; font-weight:bold; color:#BFBFBF;'>單手救星又解救了您忙碌的另一隻手，世界又美了 !!`).last() ;

        }

        break ;

      case "myppt.cc" :

        if ( $("input#pasahaicsword").length )
        {

          Update_Time = $("#form_paskznblsword .login_span").text() ;

          Password = (Array.from(Update_Time.matchAll(/\d{4}-(\d{2}\-\d{2})/g), m => m[1])[0]).replace("-", "") ;

          $("input#pasahaicsword").val(Password) ;

          // ==

          $("#form_paskznblsword span.login_span").parent().append(`<br /><span style='font-size: 0.9rem; font-weight:bold; color:#555555;'>單手救星又解救了您忙碌的另一隻手，世界又美了 !!`).last() ;

        }

        break ;

    }

  }
