// ==UserScript==
// @name Bitrix24 - Определение региона и времени по телефону v2
// @version 2.1.12
// @author sale5
// @description Определение региона и времени по телефону
// @grant n1one
// @include https://*.bitrix24.ru/*
// @namespace https://greasyfork.org/users/828502
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM.addStyle
// @connect      api.regius.name
// @connect      www.kody.su
// @connect      mklp.us
// @connect      s91374kv.beget.tech
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438451/Bitrix24%20-%20%D0%9E%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8%20%D0%BF%D0%BE%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D1%83%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/438451/Bitrix24%20-%20%D0%9E%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8%20%D0%BF%D0%BE%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D1%83%20v2.meta.js
// ==/UserScript==

var interval1 = null;

(function () {
  "use strict";

  interval1 = setInterval(function () { //var interval1
    var isDeal = ((document.location.href.indexOf("/crm/deal/details/") > -1 || document.location.href.indexOf("/crm/company/details/") > -1) && !!document.getElementsByClassName("crm-entity-widget-client-contact-phone")); // TODO: Добавить обработку company
    var isLead = (document.location.href.indexOf("/crm/lead/details/") > -1 && (!!document.getElementsByClassName("crm-entity-widget-client-contact") || !!document.getElementsByClassName("crm-entity-phone-number")));
    var isContact = (document.location.href.indexOf("/crm/contact/details/") > -1 && !!document.getElementsByClassName("crm-entity-phone-number"));

    if (!isDeal && !isLead && !isContact) {
      return;
    }

    // Проверяем, добавлено ли инфо
    //var infoExists = !!document.querySelector("#phoneInfo");
    var infoExists = !!document.getElementById('phoneInfo');
    if (infoExists) {
      return;
    }

    var phone = null;
    if (isDeal) {
      // Проверяем, подгружена ли карточка
      //phone = document.querySelector(".crm-entity-widget-client-contact-phone");
      phone = document.getElementsByClassName("crm-entity-widget-client-contact-phone");
      if (typeof(phone) == 'undefined' || phone == null || phone.length == 0){
          return;
      }
      phone = phone[0].innerText;
    } else if (isLead || isContact) {
      // Проверяем, подгружена ли карточка
      //phone = document.querySelector(".crm-entity-phone-number");
      if(isLead){
        phone = document.getElementsByClassName("crm-entity-widget-client-contact");
        if(typeof(phone) == 'undefined' || phone == null || phone.length == 0){
          console.info('phone err');
          //return;
          phone = document.getElementsByClassName("crm-entity-phone-number");
          if(typeof(phone) == 'undefined' || phone == null || phone.length == 0){
              console.info('phone err 2');
              return;
          } else {
              phone = phone[0].innerText;
          }
        } else {
          if(phone[0]){
              phone = phone[0].childNodes[0].innerText;
          } else {
              console.info('phone err');
              return;
          }
          //phone = phone[0].childNodes[0].innerText;
        }
      } else if(isContact){
          console.info('phone err');
          phone = document.querySelector(".crm-entity-phone-number");
          if(typeof(phone) == 'undefined' || phone == null){
              console.info('phone err');
              return;
          } else {
              phone = phone.innerText;
          }
      }
    }

    phone = phone.replace(/[^\d]/g, "");

      console.info(phone);

    // vk finder (поиск странички вк по номеру, email и имени) - спасибо за api @demastered
    var fName, fFamily, fEmail;
    if(isLead || isContact){
      /*fName = document.querySelectorAll('.ui-entity-editor-content-block-text')[2];
      if(fName) fName = fName.textContent;
      fFamily = document.querySelectorAll('.ui-entity-editor-content-block-text')[1];*/
      //if(fFamily) fFamily = fFamily.textContent;
      fName = document.getElementsByClassName("crm-entity-widget-client-box-name");
      if(!fName || fName.length > 0){
        // [0].innerText
        fName = fName[0].innerText;
        //document.getElementsByClassName("ui-entity-editor-content-block-text")[1].innerText
      } else {
        fName = document.getElementsByClassName("ui-entity-editor-content-block-text");
        if(fName && fName.length > 0){
          fName = fName[1].innerText + ' ' + fName[2].innerText;
        } else {
          fName = '';
        }
      }
      fEmail = document.querySelector('.crm-entity-email');
      if(fEmail) fEmail = fEmail.textContent;
    } else if(isDeal) {
      fName = document.querySelector('.crm-entity-widget-client-box-name'); // name and family
      if(fName) fName = fName.textContent;
      fFamily = '';
      fEmail = document.querySelector('.crm-entity-widget-client-contact-email');
      if(fEmail) fEmail = fEmail.textContent;
    }

    GM.xmlHttpRequest({
      method: 'GET',
      url: 'http://s91374kv.beget.tech/phoneinfo/phone-geo.php?phone='+phone+'&df=ffyy&token=unlimited_vkfind&mode=vkfind&name=' + encodeURIComponent(fName) + '&family=&email=' + fEmail + '&randnum=' + Math.random(),
      headers:    {
        "X-Id": "phoneInfo_v2"
      },
      onload: reqListener
    });
   
  }, 1500);
})();

function reqListener(response) {
  var isDeal = (document.location.href.indexOf("/crm/deal/details/") > -1 || document.location.href.indexOf("/crm/company/details/") > -1);
  var isLead = document.location.href.indexOf("/crm/lead/details/") > -1;
  var isContact = document.location.href.indexOf("/crm/contact/details/") > -1;

  var phone = null;
  var name = null;
  var phoneInfoContainer = null;

  // Проверяем, добавлено ли инфо
  //var infoExists = !!document.querySelector("#phoneInfo");
  var infoExists = !!document.getElementById('phoneInfo');
  if (infoExists) {
    return;
  }

  if (isDeal) {
    /*phone = document.querySelector(".crm-entity-widget-client-contact-phone");
    if(phone){
        phone = phone.innerText;
    } else {
        console.info('err');
        return;
    }*/

    phone = document.getElementsByClassName("crm-entity-widget-client-contact-phone");
    if (typeof(phone) == 'undefined' || phone == null || phone.length == 0){
          console.info('err');
          return;
    }
    phone = phone[0].innerText;

    name = document.querySelector('.crm-entity-widget-client-box-name').innerText
    // TODO: Найти способ встраивать блок с инфой более прямым способом
    phoneInfoContainer = document.querySelector('.crm-entity-widget-client-address');
  } else if (isLead || isContact) {
    //phone = document.querySelector(".crm-entity-phone-number");
    /*phone = document.getElementsByClassName("crm-entity-widget-client-contact");
    if(phone){
        phone = phone[0].childNodes[0].innerText;
    } else {
        console.info('err');
        return;
    }*/

    ///////
    phone = document.getElementsByClassName("crm-entity-widget-client-contact");
    if(typeof(phone) == 'undefined' || phone == null || phone.length == 0){
      console.info('phone err');
      //return;
      phone = document.getElementsByClassName("crm-entity-phone-number");
      if(typeof(phone) == 'undefined' || phone == null || phone.length == 0){
          console.info('phone err 2');
          return;
      } else {
          phone = phone[0].innerText;
      }
    } else {
      if(phone[0]){
          phone = phone[0].childNodes[0].innerText;
      } else {
          console.info('phone err');
          return;
      }
    }
    ///////

    //name = document.querySelector('.ui-entity-editor-section-content-padding-right > div:nth-child(6) > div.ui-entity-editor-content-block > div').innerText;
    //name = document.querySelectorAll('.ui-entity-editor-content-block-text')[2].textContent;
    name = document.getElementsByClassName("crm-entity-widget-client-box-name");
    if(!name || name.length > 0){
        // [0].innerText
        name = name[0].innerText;
        //document.getElementsByClassName("ui-entity-editor-content-block-text")[1].innerText
    } else {
        name = document.getElementsByClassName("ui-entity-editor-content-block-text");
        if(name && name.length > 0){
            name = name[1].innerText + ' ' + name[2].innerText;
        } else {
            name = '';
        }
    }
    //phoneInfoContainer = document.querySelector(".crm-entity-phone-number").parentElement.parentElement.parentElement;
    phoneInfoContainer = document.getElementsByClassName("crm-entity-widget-client-box-name");
    if(phoneInfoContainer && phoneInfoContainer.length > 0){
        phoneInfoContainer = phoneInfoContainer[0].parentElement.parentElement.parentElement;
    } else {
        phoneInfoContainer = document.getElementsByClassName("crm-entity-phone-number");
        if(phoneInfoContainer && phoneInfoContainer.length > 0){
            phoneInfoContainer = phoneInfoContainer[0].parentElement.parentElement.parentElement;
        } else {
            console.info('phone err 3');
            return;
        }
    }
  }
  phone = phone.replace(/[^\d]/g, "");
  phone = phone.replace(/^8/,"+7");

  var phoneInfoWrapper = document.createElement("div");
  phoneInfoWrapper.id = "phoneInfo";
  phoneInfoWrapper.style.cssText = "display: block;";
  phoneInfoWrapper.innerHTML = '';

  if(!response.responseText || response.responseText.indexOf('token заблокирован') > -1 || response.responseText.indexOf('Превышен лимит запросов') > -1 || response.responseText.indexOf('{') == -1){
      console.info('токен забанен');
      clearInterval(interval1);
      return;
  }

  var result = null;
  if(phone.indexOf('77') == 0){
    result = {
      utc: '+6',
      region: 'Казахстан',
      country: 'Казахстан',
    };
  } else {
    //console.info(response.responseText);
    result = response.responseText;
    if(result.indexOf('{') > -1){
        result = JSON.parse(result);
    }
    result = {
      /*utc: response.responseText.match(/tm\.getUTCHours\(\)([+-\d]+)\;/)[1],
      region: response.responseText.match(/Код сотового оператора: <br><strong>(.*?)<\/strong>/)[1].match(/\[(.*?)\]/)[1],
      country: response.responseText.match(/Страна: <strong>(.*?)<\/strong>/)[1],*/
      utc: result.timezone,
      region: result.region,
      country: result.country
    };
  }
  var date = new Date();
  var time = 0;

  var htmlPhoneInfoWrapper = '';

  var regionManagers = {
      'Республика Татарстан': 'Общий',
      'Республика Башкортостан': 'Адиль',
      'Самарская область': 'Адиль',
      'Тюменская область': 'Адиль',
      'Оренбургская область': 'Адиль',
      'Пермский край': 'Адиль',
      'Алтайский край': 'Адиль',
      'Республика Крым': 'Адиль',
      'Республика Алтай': 'Адиль',

      'Республика Хакасия': 'Ирина',
      'Республика Карелия': 'Ирина',
      'Краснодарский край': 'Ирина',
      'Новосибирская область': 'Ирина',
      'Республика Саха (Якутия)': 'Ирина',
      'Тамбовская область': 'Ирина',
      'Свердловская область': 'Ирина',
      'Ханты-Мансийский автономный округ - Югра': 'Ирина',

      'Санкт-Петербург': 'Андрей',
      'Московская область': 'Андрей',
      'Москва': 'Андрей',

      'Приморский край': 'Михаил',
      'Сахалинская область': 'Михаил',
      'Владимирская область': 'Михаил',
      'Волгоградская область': 'Михаил',
      'Кемеровская область': 'Михаил',
      'Республика Адыгея': 'Михаил',
      'Забайкальский край': 'Михаил',
      'Нижегородская область': 'Михаил',
      'Чеченская республика': 'Михаил',
      'Челябинская область': 'Михаил',
      'Республика Ингушетия': 'Михаил',
      'Рязанская область': 'Михаил',
      'Томская область': 'Михаил',
      'Кабардино-Балкарская республика': 'Михаил',
      'Карачаево-Черкесская Республика': 'Михаил',
      'Республика Северная Осетия - Алания': 'Михаил',
  };

  if (!result.utc) {
    if(phone.indexOf('77') == 0){
        htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
        htmlPhoneInfoWrapper += '<span>' + zeroPad(( date.getUTCHours() + 6 ), 2) + ':' + zeroPad(date.getUTCMinutes(), 2) + ' - Казахстан</span>';
        htmlPhoneInfoWrapper += '</div>';
    } else {
        if(result.region){
            htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">' + result.region + '</div>';
        } else {
            htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">Не определен</div>';
        }
    }
    htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
    htmlPhoneInfoWrapper += '<a target="_blank" href="https://api.whatsapp.com/send?phone=';
    htmlPhoneInfoWrapper += phone;
    htmlPhoneInfoWrapper += '&text=Здравствуйте '+name+'!">Написать в WhatsApp</a></div>';

    htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
    htmlPhoneInfoWrapper += '<p>Чей регион: ' + ( regionManagers.hasOwnProperty(result.region) ? regionManagers[result.region] : '-' ) + '</p>';
    htmlPhoneInfoWrapper += '</div>';

    phoneInfoWrapper.innerHTML = htmlPhoneInfoWrapper;
    phoneInfoContainer.appendChild(phoneInfoWrapper);
    return;
  } else if (result.utc.indexOf("+") > -1) {
    time = date.getUTCHours() + parseInt(result.utc);
  } else {
    time = date.getUTCHours() - parseInt(result.utc);
  }

  //var htmlPhoneInfoWrapper = '';
  htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
  htmlPhoneInfoWrapper += '<span>' + zeroPad(time, 2) + ':' + zeroPad(date.getUTCMinutes(), 2) + ' - ' + result.region + '</span>';
  htmlPhoneInfoWrapper += '</div>';

  htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
  htmlPhoneInfoWrapper += '<a target="_blank" href="https://api.whatsapp.com/send?phone=';
  htmlPhoneInfoWrapper += phone;
  htmlPhoneInfoWrapper += '&text=Здравствуйте '+name+'!">Написать в WhatsApp</a></div>';

  htmlPhoneInfoWrapper += '<div style="background: #feffff; width: 100%; color: #334d74; font-size: 19px; margin-top: 15px;">';
  htmlPhoneInfoWrapper += '<p>Чей регион: ' + ( regionManagers.hasOwnProperty(result.region) ? regionManagers[result.region] : '-' ) + '</p>';
  htmlPhoneInfoWrapper += '</div>';

  phoneInfoWrapper.innerHTML = htmlPhoneInfoWrapper;

  phoneInfoContainer.appendChild(phoneInfoWrapper);
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

