// ==UserScript==
// @name         Gableci
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  Gableci za skype
// @author       You
// @match        https://gableci.hr/*
// @icon         https://cdn3.iconfinder.com/data/icons/sympletts-update-one/128/circle-fork-knife-diagonal-512.png
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/462400/Gableci.user.js
// @updateURL https://update.greasyfork.org/scripts/462400/Gableci.meta.js
// ==/UserScript==

/* @require https://code.jquery.com/jquery-3.6.0.min.js */
// https://greasyfork.org/en/scripts/462400-gableci
(function($) {

'use strict';
const DEBUG = 0;
const ELmeni = [
    "Lignje na pariški; pomfrit; kruh 5.90€/44.45KN",
    "Gyros El 5.90€/44.45KN",
    "Hamburger EL 5.90€/44.45KN",
    "Cheeseburger 6.60€/49.73KN",
    "Chickenburger 7,00€/52,74KN",
    "Burger EL  7,00€/52,74KN",
    "Ćevapi u lepinji; ajvar; luk 5.90€/44.45KN",
    "Kebab 5.90€/44.45KN"
];
const s_ico = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><title>Social Skype SVG icon</title><path d="M956.5,569.1c3.1-22.5,4.7-44.5,4.7-65.9c0-128.3-44.5-239.3-132.3-329.8C740.1,82,631.1,35.7,504.8,35.7c-14.7,0-28.8,0.7-42.2,2C422.8,19.2,380.1,10,334.9,10c-84.7,0-160.8,32.1-219.8,92.9C56.9,162.7,26,239.1,26,323.7c0,43.8,8.2,85.3,24.5,123.7c-2.5,18.8-3.7,37.6-3.7,55.9c0,128.4,44.9,239.5,133.3,330c89.1,91.2,198.4,137.4,324.6,137.4c13.4,0,28.8-1.1,47.2-3.2c36.3,14.9,74.2,22.4,113,22.4c83.6,0,159.3-32.3,218.9-93.6c58.8-60.2,90-136.9,90-221.8C974,639,968.1,603.6,956.5,569.1L956.5,569.1z M684.3,676.3c-15,22.5-38.4,41.1-70.5,56.1c-32.1,12.8-69,19.2-110.6,19.2c-50.2,0-92.5-9.1-126.6-27.3c-24.6-13.8-43.9-31.5-57.7-52.8c-15-23.5-22.6-45.4-22.6-65.7c0-12.8,4.9-24.1,14.4-33.7c9.7-9.7,21.9-14.4,36.9-14.4c10.7,0,21.4,3.8,32.1,11.2c8.5,8.5,14.9,19.3,19.2,32.1c1.1,1.1,8.1,13.3,20.9,36.8c5.4,7.4,15,14.9,28.8,22.4c12.9,6.4,29.9,9.6,51.3,9.6c28.9,0,52.9-6.4,72.2-19.2c17.1-11.8,25.6-26.7,25.6-44.9c0-15-4.9-26.2-14.4-33.6c-9.6-9.7-21.8-17.1-36.8-22.5c-4.3-1.1-9.9-2.5-16.8-3.9c-7-1.6-15-3.8-24.1-6.5c-9-2.7-16.9-4.5-23.2-5.6c-36.3-7.4-67.3-17.1-93-28.9c-22.4-8.5-42.7-23.4-60.9-44.8c-14.9-20.3-22.4-44.4-22.4-72.2c0-27.8,8-52.3,24.1-73.7c16-21.4,39-37.4,68.9-48.1c30-11.8,64.2-17.6,102.6-17.6c28.9,0,56.1,3.7,81.7,11.2c24.6,8.5,44.4,18.7,59.4,30.5c13.9,12.8,25.1,25.6,33.7,38.4c7.5,17.1,11.3,31,11.3,41.7c0,13.9-4.9,25.7-14.5,35.2c-10.6,10.7-22.9,16.1-36.8,16.1c-11.7,0-21.9-3.2-30.5-9.7c-5.4-5.3-12.3-14.9-20.9-28.8c-6.4-15-16.6-28.3-30.4-40.1c-12.8-9.6-32.6-14.4-59.4-14.4c-26.7,0-47,5.4-60.9,16.1c-15,9.7-22.4,20.9-22.4,33.7c0,8.5,2.6,15.6,8,20.9c5.4,7.5,12.2,13.4,20.9,17.7c5.4,3.2,14.4,7,27.3,11.2c3.2,1.1,10.4,3,21.6,5.6c11.2,2.8,20.6,4.6,28.1,5.6c14.9,3.2,40.6,10.1,76.9,20.9c21.4,7.4,41.7,17,60.9,28.9c18.2,12.8,31.6,27.2,40.1,43.2c8.5,19.2,12.8,40.6,12.8,64.1c-0.1,28.9-8.1,55.6-24.1,80.2L684.3,676.3z" opacity="0.1"></path></svg>')`;

const naziv_restorana = ($r) => $r.find(".accent-title__in").html().replace(/[\n\t]/g, "");
const poll_restoran = ($r) => {
  let arr = $r.find("li").toArray().map(v =>
    $(v).text()
      .replace(/(?<=\d),(?=\d)/g, ".")
      .replace(/,/g, ";")
      .replace(/🗙/, "")
      .replace(/[\n\t]+/g, " ")
      .replace(/^\s+|\s+$/g, "")
  );
  let tel = $r.find(".restoran__tel").html()
    .replace(/^[\n\t]+|[\n\t]+$/g, "")
    .replace(/\t+/, "; ")
  ;
  return [
    `/poll ${ naziv_restorana($r) } (${tel})`,
    ...arr
  ].join(",\n");
};

let arr = $("div.restoran")
  .css({ "background-image": s_ico, "background-repeat": "no-repeat" })
  .toArray()
;
//
const order = {el: 1, fontana: 2, zvonimir: 3};
arr.map(restoran => {
  let $r = $(restoran);
  let naziv = naziv_restorana($r);
  let m = naziv.match(/\bel\b|fontana|zvonimir/i);
  let ms = m ? m[0].toLowerCase() : "";
  if (ms === "el") {
      $r.find("li:gt(1)").remove().end()
      .find("ul").append(
          ELmeni.map(v => `<li> <b>${v}</b>`)
      );
  }
  return { c: $r.children().detach(), top: ms ? order[ms] : 0 };
})
// return a.naziv>b.naziv ? 1 : a.naziv<b.naziv ? -1 : 0;
.sort((a,b) => b.top-a.top)
.forEach((r,i) => $( arr[i] ).append(r.c) );

let svi = arr.map(restoran => {
  let $r = $(restoran);

  $r.find("li").prepend(
    $(`<span style='color:red;'>🗙</span>`).click(function(){
        $(this).parent().fadeOut(300, function(){
            $(this).remove();
        });
        return false;
    })
  )
  .end().find("ul")
  .css("cursor", "pointer")
  .attr("title", "Kopiraj meni za skype")
  .click(function(){
      let clip = poll_restoran($r);
      GM_setClipboard(clip, "text");
      GM_notification({
          title: "Too, skype gableci, idemoo..",
          text: clip,
          timeout: 1800,
          // onclick: () => alert('I was clicked!')
      });
      $r.fadeOut(40).fadeIn(40);
  });

  return DEBUG ? poll_restoran($r) : "";
});

DEBUG && $("<textarea style='font-size:10pt; width:1200px;height:412px;'></textarea>")
  .insertAfter(".page-header")
  .val( svi.join("\n\n") )
;

})(jQuery);