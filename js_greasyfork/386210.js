// ==UserScript==
// @name         [DEPRECATED] MangaDex Filter
// @version      0.1.1
// @description  A userscript to sort mangadex manga by language scanlation
// @author       SkullCarverCoder
// @homepage     https://github.com/SkullCarverCoder
// @match        https://mangadex.org/settings
// @match        https://www.mangadex.org/settings
// @match        https://mangadex.org/title/*
// @match        https://www.mangadex.org/title/*
// @match        https://mangadex.cc/settings
// @match        https://www.mangadex.cc/settings
// @match        https://mangadex.cc/title/*
// @match        https://www.mangadex.cc/title/*
// @icon         https://mangadex.cc/favicon.ico
// @icon         https://mangadex.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/309990
// @downloadURL https://update.greasyfork.org/scripts/386210/%5BDEPRECATED%5D%20MangaDex%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/386210/%5BDEPRECATED%5D%20MangaDex%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';
      let scanlations_groups = [...GetPageScanlations().values()];
      let languages_page = [...GetPageLanguages().values()];
      languages_page.unshift('All');
      scanlations_groups.unshift('All');

      //inject languages dropdown
      $('div.col-auto span.fas.fa-globe').before('<div class="btn-group"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div>');
      $('div.col-auto button.btn.dropdown-toggle').append($('div.col-auto span.fas.fa-globe'));
      $('div.col-auto button.btn.dropdown-toggle span.fas.fa-globe').after('<div  id="sortbylang" class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position:absolute;will-change: transform; top:0px;left:0px;transform: translate3d(-51px, 34px, 0px); max-height:60vh;overflow:auto"></div>');
      var langdropdown = $('#sortbylang')
      $.each(languages_page, function(val,text){
        var element= '<a id="{lang}" stuff="{minilang}" class="dropdown-item" href="#"></a>'
        langdropdown.append(
            $(element.replace(/{lang}/g, val).replace(/{minilang}/g, text)).html(text)
        );
        if(text == 'All'){
            $('a[stuff="{minilang}"]'.replace(/{minilang}/g, text)).click(function(){
                reverse();
            });
        }else{
            $('a[stuff="{minilang}"]'.replace(/{minilang}/g, text)).click(function(){
                SortByLanguage($(this).attr('stuff'));
            });
        }
      });

    //   // inject Scanlation dropdown
      $('div.col.order-lg-5 span.fas.fa-users').before('<div class="btn-group"><button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div>');
      $('div.col.order-lg-5 button.btn-success.dropdown-toggle').append($('div.col.order-lg-5 span.fas.fa-users'));
      $('div.col.order-lg-5 button.btn-success.dropdown-toggle span.fas.fa-users').after('<div  id="sortbyscan" class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position:absolute;will-change: transform; top:0px;left:0px;transform: translate3d(-51px, 34px, 0px); max-height:60vh;overflow:auto"></div>');
      var scandropdown = $('#sortbyscan');
      $.each(scanlations_groups, function(val,text){
        var element= '<a id="{lang}" stuff="{minilang}" class="dropdown-item" href="#"></a>'
        scandropdown.append(
            $(element.replace(/{lang}/g, text).replace(/{minilang}/g, text)).html(text)
        );
        if(text == 'All'){
            $('a[stuff="{minilang}"]'.replace(/{minilang}/g, text)).click(function(){
                reverse();
                console.log('done');
            });
        }else{
            $('a[stuff="{minilang}"]'.replace(/{minilang}/g, text)).click(function(){
                SortByScanlation($(this).attr('stuff'));
            });
        }
      });

      function GetPageScanlations(){
          let dirty = [];
          let catcher = $('div.chapter-list-group a');
          for (let index = 0; index < catcher.length; index++){
              dirty.push(catcher[index].innerText);
          }
          return new Set(dirty);
      }
      function GetPageLanguages(){
          let dirty = [];
          let catcher = $('div.chapter-list-flag.col-auto span');
          for (let index = 0; index < catcher.length; index++){
            dirty.push(catcher[index].title);
        }
        return new Set(dirty);
      }
      function SortByScanlation(Group){
        reverse();
        let selector = 'div.chapter-list-group a'
        let catcher = $(selector);
        for (let index = 0; index < catcher.length; index++) {
            const element = catcher[index]
            if (element.innerText != Group){
                element.parentNode.parentElement.parentNode.style.display = 'none';
            }
        }
      }

      function reverse(){
          $('div.col').filter(function(){
              return $(this).css('display') === 'none';
          }).css('display', '');
      }
      function SortByLanguage(lang){
        reverse();
        let selector = 'div.chapter-list-flag span[title="{language}"]';
        let current_lang_present = false;
        //verify if language present
        if ($(selector.replace('{language}', lang).length > 0)){
            current_lang_present = true;
        }else{
            current_lang_present = false;
        }
        if(current_lang_present){
            let languages = languages_page;
            for (let index = 0; index < languages.length; index++) {
                let newselector = selector.replace('{language}', languages[index]);
                let element = $(newselector);
                if(element.attr('title') != lang && element.length > 0){
                    element.parent().parent().parent().css('display','none');
                }
            }
        }
    }
})();