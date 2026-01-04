// ==UserScript==
// @name        Cok gizli bir script
// @namespace   aurorayicokseviyorum
// @Author      %100 hanimci.
// @version     0.3333
// @description Kimsenin bilmemesi gereken seyler.
// @include      *
// @require      http://code.jquery.com/jquery-3.2.1.js
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/34763/Cok%20gizli%20bir%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/34763/Cok%20gizli%20bir%20script.meta.js
// ==/UserScript==

console.log('Daha fazla bilgim olsa, daha fazla suslemek isterdim. Hak ettigin bundan cok daha fazlasi ancak her gunumu, her saniyemi seni daha fazla mutlu edebilmek icin harcayacagim. Bunun sozunu veriyorum ve sana tapiyorum. 1. Ayimiz kutlu olsun sevgilim!  ');

 var notificationDetails = {
     text: '1. Ayimiz kutlu olsun, Seni cok seviyorum!      ~Galib',
     image: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/pink-jelly-icons-animals/014276-pink-jelly-icon-animals-animal-rabbit2-sc25.png' ,



    title: 'Tavsanim',
    timeout: 20000,
    onclick: function() { window.focus(); },
  };
GM_notification(notificationDetails);
