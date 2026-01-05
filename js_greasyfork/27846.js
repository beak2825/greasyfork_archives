// ==UserScript==
// @name         Gigrawars Rückkehr Skript
// @namespace    http://board.gigrawars.de
// @version      1.0
// @description  Berechnet wann eine Flotte wieder beim Angreifer zurück ist
// @author       Magnum Mandel (lolofufu@bk.ru)
// @match        http://uni2.gigrawars.de/game_messages_events/typ/otherfleet/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27846/Gigrawars%20R%C3%BCckkehr%20Skript.user.js
// @updateURL https://update.greasyfork.org/scripts/27846/Gigrawars%20R%C3%BCckkehr%20Skript.meta.js
// ==/UserScript==

$(document).ready(function () {
  $('.row').each(function (index) {
    var dateStart = parseDate($(this).find('.date').eq(0).attr('original-title'));
    var dateImpactString = $(this).find('.text').eq(0).text().trim();
    var dateImpact = parseDate(dateImpactString.substring(dateImpactString.length - 21));
    var dateHome = new Date(dateImpact.getTime() + (dateImpact.getTime() - dateStart.getTime()));
    console.log(dateHome);
    $(this).find('.date').eq(0).text($(this).find('.date').eq(0).text() + ' Zurück: ' + dateHome.getHours() + ':' + dateHome.getMinutes() + ':' + dateHome.getSeconds());
  });
});

function parseDate(ds) {
  var dat = new Date(ds.substring(6, 10), parseInt(ds.substring(3, 5)) - 1, ds.substring(0, 2), ds.substring(13, 15), ds.substring(16, 18), ds.substring(19, 21));
  return dat
}