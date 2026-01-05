// ==UserScript==
// @name         WME Change RUS NameStreet for Belarus
// @version      0.17
// @description  Замена ул на улица и т.д при вставке в поле ввода.
// @author       ixxvivxxi
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*/editor*
// @include      https://*.waze.com/map-editor*
// @include      https://*.waze.com/beta_editor*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/10613-wme-change-rus-namestreet-for-belarus
// @downloadURL https://update.greasyfork.org/scripts/10613/WME%20Change%20RUS%20NameStreet%20for%20Belarus.user.js
// @updateURL https://update.greasyfork.org/scripts/10613/WME%20Change%20RUS%20NameStreet%20for%20Belarus.meta.js
// ==/UserScript==



function replace_status(streetname) {

  streetname = streetname.replace('ул.', 'улица ')
                .replace(/^ул[ ]/, 'улица ')
                .replace(/[ ]ул$/, ' улица')
                .replace('пер.', 'переулок ')
                .replace(/^пер[ ]/, 'переулок ')
                .replace(/[ ]пер$/, ' переулок')
                .replace('просп.', 'проспект')
                .replace(/^просп[ ]/, 'проспект ')
                .replace(/[ ]просп$/, ' проспект')
                .replace('пр-т.', 'проспект')
                .replace(/^пр-т[ ]/, 'проспект ')
                .replace(/[ ]пр-т$/, ' проспект')
                .replace('пр-д.', 'проезд')
                .replace(/^пр-д[ ]/, 'проезд ')
                .replace(/[ ]пр-д/, ' проезд')
                .replace('пл.', 'площадь')
                .replace(/^пл[ ]/, 'площадь ')
                .replace(/[ ]пл$/, ' площадь')
                .replace('ш.', 'шоссе')
                .replace(/^б-р[ ]/, 'бульвар ')
                .replace(/[ ]б-р$/, ' бульвар')
                .replace(/^тр-т[ ]/, 'тракт ')
                .replace(/[ ]тр-т$/, ' тракт')
                .replace('вул.', 'вуліца')
                .replace(/^вул[ ]/, 'вуліца ')
                .replace(/[ ]вул$/, ' вуліца')
                .replace(/^зав[ ]/, 'завулак ')
                .replace(/[ ]зав$/, ' завулак')
                .replace(/^прасп[ ]/, 'праспект ')
                .replace(/[ ]прасп$/, ' праспект')
                .replace('туп.', 'тупик ')
                .replace('м-н.', 'микрорайон ')
                .replace('сп.', 'спуск ')
                .replace(/^На[ ]/, 'на ');

  streetname = streetname.replace(/^[ ](?=[0-9а-яА-Я])/, '').replace(/[ ]+/g, ' ');

  streetname = streetname.replace(/-ая/, '-я')
                .replace(/-ой/, '-й');

  streetname = streetname.replace('Я.Коласа', 'Якуба Коласа')
                .replace('Я. Коласа', 'Якуба Коласа')
                .replace('Я.Купалы', 'Янки Купалы')
                .replace('Я. Купалы', 'Янки Купалы')
                .replace('Ф.Скорины', 'Франциска Скорины')
                .replace('Ф. Скорины', 'Франциска Скорины')
                .replace('Б.Хмельницкого', 'Богдана Хмельницкого')
                .replace('Б. Хмельницкого', 'Богдана Хмельницкого');

  return streetname;
}

function changeName(streetname) {
  var reg = /^[РрНнМмPpHM]-?([0-9])*$/;
    if (reg.test(streetname)) {
        return correctName(streetname);
    } else {
        return replaceParts(streetname);
    }
}

function correctName(streetname) {
    streetname = streetname.replace('р', 'Р').replace('н', 'Н').replace('м', 'М').replace('P', 'Р').replace('p', 'Р').replace('H', 'Н').replace('M', 'М');

    if (streetname.search('-') == -1) {
        streetname = streetname.substring(0, 1) + '-' + streetname.substring(1, streetname.lenth);
    }
    return streetname;
}

function replaceParts(streetname) {
  var arr = streetname.split(' '),
      finalarr = [],
      status = -1,
      number = -1,
      i2 = 0,
      pseudoStatus = false;

  //var withStatus = false;
  for (var i = 0; i < arr.length; i++) {

     if (isStatus(arr[i])) {
       if (arr[i] == 'шоссе' || arr[i] === 'тракт' || arr[i] === 'площадь' || arr[i] === 'шаша'  || arr[i] === 'плошча' || arr[i] === 'спуск' || arr[i] === 'въезд') {
         pseudoStatus = true;
         finalarr[i2]=arr[i];
         i2++;
       } else {
         status = i;
       }
     } else if (isNumber(arr[i])) {
       if (i>0 && arr[i-1].toLowerCase() === 'героев') {
          finalarr[i2]=arr[i];
          i2++;
       } else {
          number = i;
       }

       // console.log("Номер", i);
     } else {
       finalarr[i2]=arr[i];
       i2++;
     }
  }

  if (status !== -1) {
    finalarr.splice(0,0,arr[status]);
  } else if (streetname !== '' && streetname !== 'Железная дорога' && !pseudoStatus && !streetname.startsWith('на')) {
    $('#sidebar .primary-street').append('<div class="bel_message" style="color:red;font-weight:bold">Необходимо добавить статусную часть!</div>');
  }

  if (number != -1) {
    finalarr[finalarr.length] = arr[number];
  }

  streetname = finalarr.join(' ');
  return streetname;
}

function isStatus(partName) {
  switch (partName) {
    case 'улица':
      return true;
    case 'переулок':
      return true;
    case 'проспект':
      return true;
    case 'проезд':
      return true;
    case 'площадь':
      return true;
    case 'шоссе':
      return true;
    case 'бульвар':
      return true;
    case 'тракт':
      return true;
    case 'тупик':
      return true;
    case 'спуск':
      return true;
    case 'въезд':
      return true
    case 'вуліца':
      return true;
    case 'завулак':
      return true;
    case 'праспект':
      return true;
    case 'праезд':
      return true;
    case 'плошча':
      return true;
    case 'шаша':
      return true;
    default:
      return false;
  }
}

function isNumber(number) {
  var reg = /([0-9])-[іыйя]/;
  switch (true) {
    case reg.test(number):
      return true;
    default:
      return false;
  }
}

$('#sidebar').on('input', '.street-name', function() {
  $('.bel_message').remove();
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
    $(this).val(newstr);
  }
});

$('#sidebar').on('change', '.street-name', function() {
  $('.bel_message').remove();
  var newstr = replace_status($(this).val());
  if ($(this).val() != newstr) {
    $(this).val(newstr);
  }
});

$('#sidebar').on('focus', '.street-name', function() {
  $('.bel_message').remove();
  var newstr = replace_status($(this).val());
  newstr = changeName(newstr);
  $(this).val(newstr);
});

$('#sidebar').on('focusout', '.street-name', function() {
  $('.bel_message').remove();
  var newstr = replace_status($(this).val());
  newstr = changeName(newstr).trim();
  $(this).val(newstr);
});