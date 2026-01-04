// ==UserScript==
// @name         OSticket Feautres
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       Maxeo90
// @match        https://seviren.gcrm.it/assistenza/scp/*
// @match        https://support.i-call.it/scp/*
// @match        https://support.gfi.it/scp/*
// @namespace    https://greasyfork.org/it/users/88678
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394428/OSticket%20Feautres.user.js
// @updateURL https://update.greasyfork.org/scripts/394428/OSticket%20Feautres.meta.js
// ==/UserScript==
$(document).ready(function () {
 $('body').on('dblclick', '.ticket_info.custom-data td[width="200"]', function () {
  var mydata = $(this).parent().find('td:eq(1)').text().trim()
  if (mydata != '—Empty—') {
   copyToClipboard(mydata)
  }
 })

 setInterval(function () {
  $('#sub_nav > .item [data-queue-id]').each(
   function () {
    let queueID = $(this).data('queue-id');
    if (Number.isInteger(queueID) && queueID > 14) {
     if ($('#advsearch #parent option[value="' + queueID + '"]').length == 0) {
      let newVal = $(this).next().text().trim();
      if (newVal != $('h2>a[title]').text().trim()) {
       $('#advsearch #parent').append('<option value="' + queueID + '">Custom - ' + newVal + '</option>')
      }
     }
    }
   })
 }, 1000)

 function copyToClipboard(text) {
  var et = $('<textarea/>', {
   css: {
    opacity: '0',
    position: 'fixed'
   }
  });
  $('body').append(et);
  $(et) [0].value = text;
  $(et).focus().select();
  document.execCommand('copy');
  $(et).remove();
  viewSoftPopup('copiato');
 }

 //Solo Seviren

 setInterval(function () {
   var aAdvSrc = $('h2 a[title="Aggiorna"]:contains("Ricerca avanzata")');
   if (aAdvSrc.length) {
    if ($('#ask-states').length == 0) {
     aAdvSrc.parent().append('<button type="button" class="action-button" id="ask-states"><i class="icon-play-circle"></i></button>');
     var timeDid = 0;
     $('#ask-states').on('click', function () {
      if (timeDid == 0) {
       timeDid++;
       $('#ask-states').off('click');
       $('#ask-states').css('display', 'none')
       var data = new FormData();
       $('.list.queue.tickets tbody tr td:nth-child(2)').each(function (index) {
        data.append("stato[" + index + "]", $(this).text().trim());
       })

       var xhr = new XMLHttpRequest();
       xhr.withCredentials = true;

       xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
         var myres = JSON.parse(this.responseText)
         $('.list.queue.tickets thead tr').append('<th>Status</th>')
         $('.list.queue.tickets tbody tr').each(function () {
             var correctNum=$(this).find('td:eq(1)').text().trim();
             var correctStete="undefined";
             for(var index=0;index<myres.list.length;index++){
                 if(myres.list[index].number==correctNum){
                     correctStete=myres.list[index].status_name;
                     break;
                 }
             }
          $(this).append('<td>' + correctStete + '</td>')
         })
            $('.list.queue.tickets tfoot tr').append('<td></td>')
        }
       });

       xhr.open("POST", "https://seviren.gcrm.it/api/verifica-stato-ticket.php");

       xhr.send(data);
      }
     })
    }

   }
  }
  , 1000)
});

 function viewSoftPopup(message) {
  var el = $('<div class="softPopup" style="position: fixed;left: 50%;top: 50%;-ms-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);padding: 10px;background-color: rgba(0,0,0,0.9);z-index: 1001;color: #FFF;border-radius: 8px;opacity: 0;transition: .3s;font-family: sans-serif;font-size: 19px;"/>')
  $('body').append(el)
  setTimeout(function () {
   $(el).css('opacity', 1).html(message)
  }, 100)
  setTimeout(function () {
   $(el).css('opacity', 0).css('transition', '1s')
  }, 1600)
  setTimeout(function () {
   $(el).remove()
  }, 2700)
 }