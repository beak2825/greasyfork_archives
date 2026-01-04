// ==UserScript==
// @name        New script - arizona-rp.com
// @namespace   Violentmonkey Scripts
// @match       https://forum.arizona-rp.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 15.04.2023, 20:33:51
// @downloadURL https://update.greasyfork.org/scripts/464087/New%20script%20-%20arizona-rpcom.user.js
// @updateURL https://update.greasyfork.org/scripts/464087/New%20script%20-%20arizona-rpcom.meta.js
// ==/UserScript==

var buttonname = "Fast Answer"; // Название кнопки
var nickname = "Nick Name"; // Ваш никнейм
var rang = "Окружной судья"; // Ваша должность
/////////////////////////////////////////////////////////////////////
function createbuttons() {
  buttonsh_add(
    "Принятие дела",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT][/CENTER]<br>[RIGHT][FONT=courier new]Судейская коллегия штата Tucson<br>При Верховном судье Fernando Dias<br>" +
      rang +
      " " +
      nickname +
      "[/FONT][/RIGHT]<br>[CENTER]<br>[FONT=courier new]Доброго времени суток.<br>Принялся рассматривать ваше дело, ожидайте ответа в течении<br>48 часов[/FONT][/CENTER]"
  );
  buttonsh_add(
    "Запрос опровержения МЮ",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT][/CENTER]<br>[RIGHT][FONT=courier new]Судейская коллегия штата Tucson<br>При Верховном судье Fernando Dias<br>" +
      rang +
      " " +
      nickname +
      "[/FONT][/RIGHT]<br>[CENTER]<br>[FONT=courier new]Рассмотрел доказательство<br>Запрашиваю полную видеофиксацию,<br>пояснения у сотрудника ORGANIZATION NickName<br>Даю 24 часа на предоставление.[/FONT][/CENTER]"
  );
  buttonsh_add(
    "Иск не по форме",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT][/CENTER]<br>[RIGHT][FONT=courier new]Судейская коллегия штата Tucson<br>При Верховном судье Fernando Dias<br>" +
      rang +
      " " +
      nickname +
      "<br>[/FONT][/RIGHT]<br>[CENTER][FONT=courier new]Я, " +
      rang +
      " штата Tucson, руководствуясь принципами справедливости, а также законами штата Tucson.<br><br>П О С Т А Н О В Л Я Ю<br><br>1. Закрыть исковое заявления без вынесения вердикта в связи с незнанием правил подачи искового заявления.[/FONT][/CENTER]"
  );
  buttonsh_add(
    "Передача уголовного дела от МЮ",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT][/CENTER]<br>[RIGHT][FONT=courier new]Судейская коллегия штата Tucson<br>При Верховном судье Fernando Dias<br>" +
      rang +
      " " +
      nickname +
      "[/FONT][/RIGHT]<br>[CENTER][FONT=courier new]<br>Я, " +
      rang +
      " штата Tucson, руководствуясь принципами справедливости, а также законами штата Tucson, выношу решение по исковому заявлению #НомерИска, поступившего от xx.xx.xxxx от гражданина NickName.<br><br>П О С Т А Н О В Л Я Ю<br><br>1. Признать гражданина NickName виновным в нарушении статьи XXX Уголовного Кодекса ш. Туксон.<br>2. Выписать ордер Прокуратурой штата Туксон на арест гражданина NickName.<br>3. Провести правомерный арест гражданина NickName.<br>4. Закрыть дело по исполнению его Прокуратурой штата.<br><br>Приговор вступает в законную силу с момента его вынесения.<br>Дело по данному исковому делу считать закрытым с момента вынесения приговора.<br>Приговор подлежит обжалованию в Апелляционном суде в течении 3 рабочих дней.<br>Все судебные издержки по исполнению данного приговора покрываются за счет государства.<br>Судебные издержки по обжалованию приговора покрываются за счет осужденных и их законных представителей.[/FONT][/CENTER]"
  );
  buttonsh_add(
    "Вердикт Окружного суда",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT][/CENTER]<br>[RIGHT][FONT=courier new]Судейская коллегия штата Tucson<br>При Верховном судье Fernando Dias<br>" +
      rang +
      " " +
      nickname +
      "[/FONT][/RIGHT]<br>[CENTER][FONT=courier new]<br>Я, " +
      rang +
      " штата Tucson, руководствуясь принципами справедливости, а также законами штата Tucson, выношу решение по исковому заявлению #НомерИска, поступившего от xx.xx.xxxx от гражданина NickName.<br><br>П О С Т А Н О В Л Я Ю<br><br>1. ...<br>2. ...<br>3. ...<br><br>Приговор вступает в законную силу с момента его вынесения.<br>Дело по данному исковому делу считать закрытым с момента вынесения приговора.<br>Приговор подлежит обжалованию в Апелляционном суде в течении 3 рабочих дней.<br>Все судебные издержки по исполнению данного приговора покрываются за счет государства.<br>Судебные издержки по обжалованию приговора покрываются за счет осужденных и их законных представителей.[/FONT][/CENTER]"
  );
  buttonsh_add(
    "Вердикт Апелляционного суда",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG]<br><br>[COLOR=rgb(182, 10, 255)]TUCSON STATE COURT OF APPEALS[/COLOR]<br><br>РЕШЕНИЕ<br><br>по делу, возбужденному по исковому заявлению #[COLOR=rgb(226, 80, 65)]НомерИска[/COLOR][COLOR=rgb(204, 204, 204)] [/COLOR]от [COLOR=rgb(226, 80, 65)]xx.xx.xxxx[/COLOR] г.<br><br>Апелляционный суд штата Туксон в лице " +
      rang +
      " " +
      nickname +
      ", ознакомился с апелляционной жалобой в адрес судьи [COLOR=rgb(226, 80, 65)]NickName[/COLOR].<br><br>В ходе пересмотра Апелляционный суд повторно рассмотрел материалы дела.<br>Было установлено, что в данном исковом заявлении[COLOR=rgb(204, 204, 204)] [/COLOR][COLOR=rgb(226, 80, 65)]ОПИСАНИЕ СИТУАЦИИ[/COLOR]<br><br>Таким образом, суд не усматривает халатности в действиях судьи [COLOR=rgb(226, 80, 65)]NICK NAME[/COLOR].<br><br><br>На основании вышеизложенного, Апелляционный суд штата Туксон в лице " +
      rang +
      " " +
      nickname +
      " постановил:<br><br>1. ...<br>2. ...<br>3. ...<br><br>Приговор вступает в законную силу с момента его вынесения.<br>Дело по данному исковому делу считать закрытым с момента вынесения приговора.<br>Приговор подлежит обжалованию в Верховном суде в течении 3 рабочих дней.<br><br><br>" +
      rang +
      " " +
      nickname +
      "<br>[/FONT]<br>[FONT=courier new][COLOR=rgb(148, 0, 211)]" +
      today +
      "[/COLOR][/FONT][/CENTER]"
  );
  buttonsh_add(
    "Вердикт Верховного суда",
    "[CENTER][FONT=courier new][IMG width=274px]https://i.yapx.ru/S5k00.png[/IMG]<br>[IMG]https://i.yapx.ru/S56i1.png[/IMG][/FONT]<br>[FONT=courier new]Верховный суд штата Tucson<br>Определение.[/FONT][FONT=courier new]<br>Я, " +
      rang +
      " штата Tucson, руководствуясь принципами справедливости, а также законами штата Tucson, выношу решение по исковому заявлению #НомерИска, поступившего от xx.xx.xxxx от гражданина NickName.<br><br>П О С Т А Н О В Л Я Ю<br><br>1. ...<br>2. ...<br>3. ...<br><br>Приговор вступает в законную силу с момента его вынесения.<br>Дело по данному исковому делу считать закрытым с момента вынесения приговора.<br>Приговор подлежит обжалованию в Апелляционном суде в течении 3 рабочих дней.<br>Все судебные издержки по исполнению данного приговора покрываются за счет государства.<br>Судебные издержки по обжалованию приговора покрываются за счет осужденных и их законных представителей.[/FONT][/CENTER]"
  );
}
///////////////////////////////////////////////////////////////////////////////////////////////////
window.button_id = 0;
$(".button--icon--reply").after(
  '<input type="button" class="button shabs" value="' +
    buttonname +
    '" id="shabs" style="margin-left: 3px;">'
);
$(document).ready(function () {
  $("#shabs").click(function () {
    // При клике на кнопку скрипта
    $("div.overlay-container").remove();
    XF.alert(`<div id="shabscontent"></div>`, buttonname);
    createbuttons();
  });
});
var today = new Date().toLocaleDateString();
function buttonsh_add(title, text) {
  $("#shabscontent").append(
    '<input type="button" class="button js-overlayClose" value="' +
      title +
      '" id="shabs_' +
      window.button_id +
      '" style="margin-top: 3px;margin-left: -5px;">'
  );
  $("body").append(
    '<script>\
$("#shabs_' +
      window.button_id +
      '").click(function () {\
$(".fr-element").html("' +
      text +
      '");\
$("#exposeMask").click();\
document.getElementsByClassName("fr-placeholder")[document.getElementsByClassName("fr-placeholder").length - 1].style = "display: none;";\
})\
</script>'
  );
  window.button_id++;
}
