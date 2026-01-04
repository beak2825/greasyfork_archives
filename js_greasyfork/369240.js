// ==UserScript==
// @name SDpusher
// @namespace Violentmonkey Scripts
// @match *://hd/WorkOrder.do*
// @grant none
// @description SDpusherdesc
// @version 0.0.5
// @downloadURL https://update.greasyfork.org/scripts/369240/SDpusher.user.js
// @updateURL https://update.greasyfork.org/scripts/369240/SDpusher.meta.js
// ==/UserScript==

((jQuery) => {
  jQuery(document).ready(() => {
    
    //http://hd/WorkOrder.do?reqTemplate=15702
    var urlreq = getUrlVars()["reqTemplate"];
    if (urlreq == '15702') {
    
   //var techNameNumb = getUrlVars()["technician"];
    var opisanie_tmp = getUrlVars()["o"];
    var opisanie = decodeURIComponent(opisanie_tmp).replace(/\+/g," ");
    var reshenie_tmp = getUrlVars()["r"];
    var reshenie = decodeURIComponent(reshenie_tmp).replace(/\+/g," ");
    
    var imya_tmp = getUrlVars()["f"];
    var imya = decodeURIComponent(imya_tmp).replace(/\+/g," ");
    var telefon_tmp = getUrlVars()["ph"];
    var telefon = decodeURIComponent(telefon_tmp).replace(/\+/g," ");
    
    
    var ls_tmp = getUrlVars()["l"];
    var ls = decodeURIComponent(ls_tmp).replace(/\+/g," ");
    document.getElementById('reqSearch').value = ls;

    var nazvanie_tmp = getUrlVars()["n"];
    var nazvanie = decodeURIComponent(nazvanie_tmp).replace(/\+/g," ");
    document.getElementsByName('title')[0].value = nazvanie;
    
    jQuery('[name="requestType"] option[selected]').removeAttr('selected');
    var tip_zayavka_kons = getUrlVars()["t"];
    if (tip_zayavka_kons == 'k') {jQuery('[name="requestType"] option[value="3"]').attr('selected', "true");} else {jQuery('[name="requestType"] option[value="1"]').attr('selected', "true");}
    convertToSelect2('requestType');

    
    jQuery('[name="level"] option[selected]').removeAttr('selected');
    var uroven = getUrlVars()["lv"];
    if (uroven == 1) {jQuery('[name="level"] option[value="303"]').attr('selected', "true");}
    if (uroven == 2) {jQuery('[name="level"] option[value="302"]').attr('selected', "true");}
    if (uroven == 3) {jQuery('[name="level"] option[value="1"]').attr('selected', "true");}
    convertToSelect2('level');
    
    jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[selected]').removeAttr('selected');
    var product_tmp = getUrlVars()["eq"];
    var product = decodeURIComponent(product_tmp).replace(/\+/g," ");
    jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="'+product+'"]').attr('selected', "true");
    //jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="ВАТС"]').attr('selected', "true");
    convertToSelect2('WorkOrder_Fields_UDF_CHAR26');
    
    jQuery('[name="technician"] option[selected]').removeAttr('selected');
    jQuery('[name="technician"] option[value="'+userID+'"]').attr('selected', "true");
    convertToSelect2('technician');
        
    jQuery('[name="status"] option[selected]').removeAttr('selected');
    jQuery('[name="status"] option[value="3"]').attr('selected', "true");
    convertToSelect2('status');
    
    var subcategoriya = getUrlVars()["ca"];
    jQuery('[name="subCategory"] option[selected]').removeAttr('selected');
    jQuery('[name="subCategory"] option[value='+subcategoriya+']').attr('selected', "true");
    convertToSelect2('subCategory');
    
    var subitem = getUrlVars()["i"];
    jQuery('[name="item"] option[selected]').removeAttr('selected');
    //jQuery('[name="item"] option[value='+subitem+']').attr('selected', "true");
    invokeCSIPopulation(cat, sct, itm, subcategoriya, subitem, catValue);
    
    var auto_prov = getUrlVars()["c"];
    jQuery('[name="WorkOrder_Fields_UDF_CHAR27"] option[selected]').removeAttr('selected');
    if (auto_prov == 'y') {jQuery('[name="WorkOrder_Fields_UDF_CHAR27"] option[value="Был подвязан до обращения"]').attr('selected', "true");} else if (auto_prov=='n') {jQuery('[name="WorkOrder_Fields_UDF_CHAR27"] option[value="Не был подвязан до обращения"]').attr('selected', "true");}
    convertToSelect2('WorkOrder_Fields_UDF_CHAR27');
    
    var auto_prov_col = getUrlVars()["u"];
    document.getElementsByName('WorkOrder_Fields_UDF_LONG3')[0].value = auto_prov_col;
    //jQuery('#WorkOrder_Fields_UDF_LONG3').value=auto_prov_col;
    
    //var reshenie_tip = getUrlVars()["c"];
    //jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[selected]').removeAttr('selected');
    //if (reshenie_tip == "k") {jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[value="Клиенту даны рекомендации"]').attr('selected', "true");} else {jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[value="Проблема клиента решена"]').attr('selected', "true");}
    //convertToSelect2('WorkOrder_Fields_UDF_CHAR24');
    
    // Взять в работу после создания
    if (decodeURI(getUrlVars()["ot"]) == "В+работу") {
    jQuery('[name="status"] option[selected]').removeAttr('selected');
    jQuery('[name="status"] option[value="602"]').attr('selected', "true");
    convertToSelect2('status');
    }

    // Сдача на группу
    if (decodeURI(getUrlVars()["ot"]) == "На+отдел") {
    document.getElementsByName('title')[0].value = nazvanie;
    jQuery('[name="technician"] option[selected]').removeAttr('selected');
    jQuery('[name="technician"] option[value="0"]').attr('selected', "true");
      convertToSelect2('technician');
    jQuery('[name="status"] option[selected]').removeAttr('selected');
    jQuery('[name="status"] option[value="1"]').attr('selected', "true");
      convertToSelect2('status');
    jQuery('[name="level"] option[selected]').removeAttr('selected');
    jQuery('[name="level"] option[value="1"]').attr('selected', "true");
      convertToSelect2('level');
    jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[selected]').removeAttr('selected');
    jQuery('[name="requestType"] option[selected]').removeAttr('selected');
    jQuery('[name="requestType"] option[value="1"]').attr('selected', "true");
      convertToSelect2('requestType');
    jQuery('#GROUPID option[selected]').removeAttr('selected');
    jQuery('#GROUPID option[value="12002"]').attr('selected', "true");
      convertToSelect2('group');
    //jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="01. ВАТС"]').attr('selected', "true");
    }
    
    // Создание повторки
    if (decodeURI(getUrlVars()["ot"]) == "Повторка") {
    document.getElementsByName('title')[0].value = 'Повторка по '+nazvanie;
    //jQuery('[name="status"] option[selected]').removeAttr('selected');
    //jQuery('[name="status"] option[value="602"]').attr('selected', "true");
    //convertToSelect2('status');
    jQuery('[name="requestType"] option[value="3"]').attr('selected', "true");
      convertToSelect2('requestType');
    jQuery('[name="status"] option[selected]').removeAttr('selected');
    jQuery('[name="status"] option[value="3"]').attr('selected', "true");
    convertToSelect2('status');
    jQuery('[name="level"] option[selected]').removeAttr('selected');
    jQuery('[name="level"] option[value="303"]').attr('selected', "true");
    convertToSelect2('level');
    jQuery('[name="subCategory"] option[selected]').removeAttr('selected');
    jQuery('[name="subCategory"] option[value=22809]').attr('selected', "true");
    convertToSelect2('subCategory');
    jQuery('[name="item"] option[selected]').removeAttr('selected');
    jQuery('[name="item"] option[value=30918]').attr('selected', "true");
    convertToSelect2('item');
      // invokeCSIPopulation(cat, sct, itm, '22809', '30918', catValue);
    jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="01. ВАТС"]').attr('selected', "true");
    convertToSelect2('WorkOrder_Fields_UDF_CHAR26');
    invokeCSIPopulation(cat, sct, itm, '22809', '30918', catValue);
    }
    
    // Создание нецелевого
    if (decodeURI(getUrlVars()["ot"]) == "Нецелевое") {
    document.getElementById('reqSearch').value = 'Нецелевое';
    document.getElementsByName('title')[0].value = 'Нецелевое обращение';
    //jQuery('[name="status"] option[selected]').removeAttr('selected');
    //jQuery('[name="status"] option[value="602"]').attr('selected', "true");
    //convertToSelect2('status');
    jQuery('[name="requestType"] option[value="3"]').attr('selected', "true");
      convertToSelect2('requestType');
    jQuery('[name="status"] option[selected]').removeAttr('selected');
    jQuery('[name="status"] option[value="3"]').attr('selected', "true");
    convertToSelect2('status');
    jQuery('[name="level"] option[selected]').removeAttr('selected');
    jQuery('[name="level"] option[value="303"]').attr('selected', "true");
    convertToSelect2('level');
    jQuery('[name="subCategory"] option[selected]').removeAttr('selected');
    jQuery('[name="subCategory"] option[value=27601]').attr('selected', "true");
    convertToSelect2('subCategory');
    jQuery('[name="item"] option[selected]').removeAttr('selected');
    jQuery('[name="item"] option[value=27601]').attr('selected', "true");
    convertToSelect2('item');
      // invokeCSIPopulation(cat, sct, itm, '22809', '30918', catValue);
    jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="Другое"]').attr('selected', "true");
    convertToSelect2('WorkOrder_Fields_UDF_CHAR26');
    invokeCSIPopulation(cat, sct, itm, '27601', '27601', catValue);
    }

jQuery('.fafr-label')[12].innerHTML = '<span><em class="mandatory">*</em> Лицевой счет</span>';
//jQuery('.alignRight')[15].innerHTML = 'Лицевой Счет';    
    

    
    toggleResolution();
    
    
    
      setTimeout(()=>{
        const iframe = jQuery('iframe.ze_area').get(0);
        iframe.contentDocument.querySelector('.ze_body').innerText = telefon+', '+imya+'\n\n'+opisanie;
        const iframe_reshenie = jQuery('iframe.ze_area').get(1);
        iframe_reshenie.contentDocument.querySelector('.ze_body').innerText = reshenie;
          
        if (decodeURI(getUrlVars()["ot"]) == "Повторка") {
          iframe.contentDocument.querySelector('.ze_body').innerText = telefon+', '+imya;
          iframe_reshenie.contentDocument.querySelector('.ze_body').innerText = 'Сообщена информация по основной заявке';
        }
        
        if (decodeURI(getUrlVars()["ot"]) == "Нецелевое") {
          iframe.contentDocument.querySelector('.ze_body').innerText = telefon;
          iframe_reshenie.contentDocument.querySelector('.ze_body').innerText = 'Нецелевое обращение';
        }
        
        if (tip_zayavka_kons == 'n') {
          jQuery('[name="requestType"] option[selected]').removeAttr('selected');
          jQuery('[name="requestType"] option[value="3"]').attr('selected', "true");
          convertToSelect2('requestType');
          jQuery('[name="level"] option[selected]').removeAttr('selected');
          jQuery('[name="level"] option[value="303"]').attr('selected', "true");
          convertToSelect2('level');
          iframe.contentDocument.querySelector('.ze_body').innerText = telefon+', Недозвон ОЗ, нецелевой, тишина в трубке, срыв звонка';
          iframe_reshenie.contentDocument.querySelector('.ze_body').innerText = 'Недозвон ОЗ, нецелевой, тишина в трубке, срыв звонка';
          document.getElementsByName('title')[0].value = 'Недозвон ОЗ, нецелевой, тишина в трубке, срыв звонка';
          jQuery('[name="subCategory"] option[selected]').removeAttr('selected');
          jQuery('[name="subCategory"] option[value=20416]').attr('selected', "true");
          jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[selected]').removeAttr('selected');
          jQuery('[name="WorkOrder_Fields_UDF_CHAR24"] option[value="Клиенту даны рекомендации"]').attr('selected', "true");
          convertToSelect2('WorkOrder_Fields_UDF_CHAR24');
          document.getElementById('reqSearch').value = 'нецелевое';
          jQuery('[name="WorkOrder_Fields_UDF_CHAR26"] option[value="01. ВАТС"]').attr('selected', "true");
          convertToSelect2('WorkOrder_Fields_UDF_CHAR26');
          invokeCSIPopulation(cat, sct, itm, '20416', '', catValue);
        }    
          
      if (getUrlVars()["ac"]=='1') {jQuery('#addWOButton').click();}
    }, 2000);
    
    }
    
    
  });
})(jQuery);


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}