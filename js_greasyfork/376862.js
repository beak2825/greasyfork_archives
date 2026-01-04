// ==UserScript==
// @name Patronite PowerTools
// @namespace Violentmonkey Scripts
// @version 1.0
// @description:pl Skrypt dodający nowe możliwości do panelu autora w serwisie Patronite.pl
// @grant none
// @include https://patronite.pl/moj_profil/*
// @description Skrypt dodający nowe możliwości do panelu autora w serwisie Patronite.pl
// @downloadURL https://update.greasyfork.org/scripts/376862/Patronite%20PowerTools.user.js
// @updateURL https://update.greasyfork.org/scripts/376862/Patronite%20PowerTools.meta.js
// ==/UserScript==



var limitKwoty = 7;



// *******************************
// Poniżej już nic nie zmieniaj :)
// *******************************

var loadMoreBtn = '';
var colorHandle = '';
var freshIcon = '🍀';

function getPatroniForList(page){
  $.getJSON('/moj_profil/lista_patronow?page='+page,function(data){
    
    $.each(data.data,function(k,patron) {
      if (patron.amount>=limitKwoty && patron.status=="aktywna"){
        
        $('#listaCzytelna').val($('#listaCzytelna').val()+patron.first_name + ' ' + (patron.is_anonymous?patron.last_name.substring(0,1)+'.':patron.last_name)+"\n");
        $('#listaEmail').val($('#listaEmail').val()+patron.email+"\n");
      } else {
        $('#listaEx').val($('#listaEx').val()+patron.email+"\n");
      }
    });
    
    if (data.hasNextPage){
      getPatroniForList(page+1);
    }
    
  });
}

function loadNextPatrons(){
  loadMoreBtn = $('#jump-patroni > div.wc > div > div:nth-child(1) > a').first();
  if (loadMoreBtn.length>0 && loadMoreBtn.is(':visible')) {
    loadMoreBtn.click();
    setTimeout(loadNextPatrons,200);
    clearTimeout(colorHandle);
    colorHandle = setTimeout(colorTable,1000);
  }
}

function colorTable(){
  $('#patroni-lista > tbody > tr > td:nth-child(5)').css('font-weight','bold');
  $('#patroni-lista > tbody > tr > td:nth-child(5)').each(function(){
    if ($(this).text().indexOf('nieaktywna')!=-1){
      $(this).css('color','#f00');
    } else {
      $(this).css('color','#00BF00');
    }
  });
  
  $('#patroni-lista > tbody > tr > td:nth-child(8)').each(function(){
    if ($(this).text()==1){ $(this).html($(this).text()+'&nbsp;'+freshIcon)};
  });
}

function search(){
  if ($('#magicBox').val().length>1){
    query = new RegExp($('#magicBox').val(),'i');
    $('#patroni-lista > tbody > tr > td:nth-child(1)').each(function(){
      if (query.test($(this).text())){
        $(this).parent().show();
      } else {
        $(this).parent().hide();
      }
    });
  } else {
    $('#patroni-lista > tbody > tr').show();
  }
}

window.onload = function(){
  if ($('#jump-patroni').length>0){
    $('#jump-patroni').append('<div style="margin-left:10px;" id="patroniteAddon"><p>Patroni od progu <b>'+limitKwoty+'zł</b> w górę</p><textarea id="listaCzytelna" style="width:50%;height:300px;border:1px solid #000;"></textarea><p>Twoja baza danych do mailingu (aktywni)</p><textarea id="listaEmail" style="width:50%;height:300px;border:1px solid #000;"></textarea><p>Baza mail ex-patronow</p><textarea id="listaEx" style="width:50%;height:300px;border:1px solid #000;"></textarea></div>');
    getPatroniForList(1);
    loadNextPatrons();
    $('form.filters-form').append('<p><a href="#patroniteAddon" style="text-decoration:underline;color:#00f;font-size:18px;">Skacz do moich baz danych</a></p>');
    $('<div class="item"><label><b>Medżik Patronajt Serczer</b></label><input type="text" id="magicBox" value="" style="background:#faf5e9"></div>').insertAfter('#jump-patroni > div.wc > form > div:nth-child(3)');
  }
  
  $('#jump-patroni').on('keyup','#magicBox',function(){
    search();
  });

}