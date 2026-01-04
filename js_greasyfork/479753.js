// ==UserScript==
// @name         BBCode Forum Ragnarok Online BR
// @namespace    http://tampermonkey.net/
// @version      20251014
// @description  Converte BB Code em texto formatado, corrige problemas de formatação de ctrl+v de outros sites e ao selecionar texto permite a pesquisa deste no divine-pride
// @author       You
// @match        https://forum.playragnarokonlinebr.com/index.php?/topic/*
// @match        https://forum.playragnarokonlinebr.com/index.php?/forum/*/&do=add
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playragnarokonlinebr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479748/BBCode%20Forum%20Ragnarok%20Online%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/479748/BBCode%20Forum%20Ragnarok%20Online%20BR.meta.js
// ==/UserScript==

$(document).ready(function(){

  $("head").append(`
  <style>
    #adopt-controller-button {
      display: none !important;
    }
  >/style>
  `);

  $("body").append('<div id="formatar" style="cursor:pointer;z-index: 10;position: fixed;width: 58px;height: 58px;display: block;background:linear-gradient(0deg, #a1512b, #ebb680);border:1px solid #562c1b;border-radius: 50%;padding-top:15px;text-align: center;font-size: 9px;color: white;left: 20px;bottom: 51px;">formatar<br>bb code</div>')

  $("#formatar").click(function(){
      $("div.cke_wysiwyg_div p").each(function() {
          if($(this).html().indexOf("[center]") >= 0) $(this).css("text-align","center");
      });

      let htmlinicial = $("div.cke_wysiwyg_div").html();

      htmlinicial = htmlinicial.replaceAll("[center]","");
      htmlinicial = htmlinicial.replaceAll("[/center]","");
      htmlinicial = htmlinicial.replaceAll("<p>","<p style='font-family:Arial'>");
      htmlinicial = htmlinicial.replaceAll("[b]","<b>");
      htmlinicial = htmlinicial.replaceAll("[/b]","</b>");
      htmlinicial = htmlinicial.replaceAll("[i]","<i>");
      htmlinicial = htmlinicial.replaceAll("[/i]","</i>");
      htmlinicial = htmlinicial.replaceAll(/\[color=(#?)(\w*)\]/gi,"<span style='color:$1$2'>");
      htmlinicial = htmlinicial.replaceAll("[/color]","</span>");
      htmlinicial = htmlinicial.replaceAll(/\[url=((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))\]/gi,"<a href='$1' target='_blank'>");
      htmlinicial = htmlinicial.replaceAll("[/url]","</a>");
      htmlinicial = htmlinicial.replaceAll(/\[img=(http|https)(:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))\]/gi,"<img src='https$2' data-src='https$2' alt='' class='ipsImage' data-loaded='true' style='height: auto;'>");
      htmlinicial = htmlinicial.replaceAll(/\[img\](http|https)(:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))\[\/img\]/gi,"<img src='https$2' data-src='https$2' alt='' class='ipsImage' data-loaded='true' style='height: auto;'>");
      htmlinicial = htmlinicial.replaceAll("[hr]","<hr style='background-color:#ffffff;color:#353c41;font-size:14px;'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?7]/gi,"<span style='font-size:28px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?6]/gi,"<span style='font-size:24px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?5]/gi,"<span style='font-size:18px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?4]/gi,"<span style='font-size:14px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?3]/gi,"<span style='font-size:12px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?2]/gi,"<span style='font-size:10px'>");
      htmlinicial = htmlinicial.replaceAll(/\[size=\+?1]/gi,"<span style='font-size:8px'>");
      htmlinicial = htmlinicial.replaceAll("[/size]","</span>");
      htmlinicial = htmlinicial.replaceAll("[list]<br>","<ul>");
      htmlinicial = htmlinicial.replaceAll("[list]","<ul>");
      htmlinicial = htmlinicial.replaceAll("[*]","<li>");
      htmlinicial = htmlinicial.replaceAll("[/list]","</li></ul>");
      htmlinicial = htmlinicial.replaceAll("[spoiler]",`<div tabindex="-1" contenteditable="false" data-cke-widget-wrapper="1" data-cke-filter="off" class="cke_widget_wrapper cke_widget_block cke_widget_ipsquote cke_widget_wrapper_ipsQuote" data-cke-display-name="blockquote" data-cke-widget-id="0" role="region" aria-label="blockquote widget"><blockquote class="ipsQuote cke_widget_element" data-ipsquote="" data-gramm="false" data-cke-widget-keep-attr="0" data-widget="ipsquote" data-cke-widget-data="%7B%22classes%22%3A%7B%22ipsQuote%22%3A1%7D%7D"><div class="ipsQuote_citation">Detalhes</div><div class="ipsQuote_contents ipsClearfix cke_widget_editable" data-gramm="false" contenteditable="true" data-cke-widget-editable="content" data-cke-enter-mode="1"><p>`);
      htmlinicial = htmlinicial.replaceAll("[/spoiler]",`</p></div></blockquote><span class="cke_reset cke_widget_drag_handler_container" style="background: url(&quot;//forum.playragnarokonlinebr.com/applications/core/interface/ckeditor/ckeditor/plugins/widget/images/handle.png&quot;) rgba(220, 220, 220, 0.5); top: -15px; left: 0px;"><img class="cke_reset cke_widget_drag_handler" data-cke-widget-drag-handler="1" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" width="15" title="Click and drag to move" height="15" role="presentation"></span></div>`);

      $("div.cke_wysiwyg_div").html(htmlinicial);

      $("div.cke_wysiwyg_div p").each(function() {
          if($(this).html().indexOf("[table]") >= 0) {
              let thisHTML = $(this).html();
              thisHTML = thisHTML.replaceAll("[table]","");
              thisHTML = thisHTML.replaceAll("[/table]","");
              thisHTML = thisHTML.replaceAll("[tr]","<tr>");
              thisHTML = thisHTML.replaceAll("[/tr]","</tr>");
              thisHTML = thisHTML.replaceAll("[td]",'<td style="padding:2px 6px 2px 3px;vertical-align:middle;">');
              thisHTML = thisHTML.replaceAll("[/td]","</td>");
              thisHTML = thisHTML.replaceAll("<br>","");
              $(this).replaceWith( '<table border="1" cellpadding="0" cellspacing="0" dir="ltr" style="border-collapse:collapse;border:none;">' + thisHTML + "</table>" );
          }
      });
      $("div.cke_wysiwyg_div td").each(function() {
          if(!(/[a-zA-Z]/g).test($(this).html())) $(this).css("text-align","right").css("font-family","monospace");
      });

      $("div.cke_wysiwyg_div ul > br").remove();
  });

  // Pesquisa no Divine Pride
  $(document).on("mouseup", function() {
    setTimeout(function() {
      let selectedText = window.getSelection().toString().trim();
      $(".ipsTooltip .divinepride").remove();

      if (selectedText.length > 0) {
          // Acontece algo aqui
          $(".ipsTooltip").append(`<a href="https://www.divine-pride.net/database/search?q=${selectedText}" target="_blank" class="ipsButton ipsButton_veryVerySmall ipsButton_veryLight divinepride">   Divine Pride     </a>`);
      }
    }, 100);
  });

  // Corrigir formatação de posts com conteúdo copiado de outros sites
  $("body").append('<div id="sem-negrito" style="cursor:pointer;z-index: 10;position: fixed;width: 58px;height: 58px;display: block;background:linear-gradient(0deg, #a1512b, #ebb680);border:1px solid #562c1b;border-radius: 50%;padding-top:13px;text-align: center;font-size: 9px;color: white;right: 20px;bottom: 51px;">corrigir formatação</div>')

  $("#sem-negrito").click(function(){
      $("b[id^=docs-internal-guid]").each(function() {
          let conteudo = $(this).html();
          $(this).replaceWith(conteudo);
      });
      while($("p b span").length > 0) {
          let conteudo = $("p b span").eq(0).closest("b").html();
          $("p b span").eq(0).closest("b").replaceWith(conteudo);
      }
      $(".cke_wysiwyg_div *").filter(function() {
          var $this = $(this);
          return $this.css("background")
          || $this.css("background-color");
      }).each(function() {
          console.log($(this).css("background-color").indexOf("#"));
          console.log($(this).css("background-color").substring(1));
          console.log($(this).css("background-color").replace(/\D/g,''));
          console.log("---");
          if( /[1-9]/.test($(this).css("background-color").indexOf("#") >= 0 ? $(this).css("background-color").substring(1) : $(this).css("background-color").replace(/\D/g,'')) ) {
              console.log("entrou")
              $(this).css("background-color","");
              $(this).css("color","");
          }
      });
  });

});