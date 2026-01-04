// ==UserScript==
// @name        WGV здорового человека
// @namespace   */*
// @include     http://wg-volunteers.ru/*
// @version     1
// @grant       none
// @description Скрипт добавляет на волонтерский портал кнопку "Смены", дабы не искать этот раздел вручную.
// @downloadURL https://update.greasyfork.org/scripts/30465/WGV%20%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/30465/WGV%20%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0.meta.js
// ==/UserScript==

var TargetLink = "/workspace/shifts/3/today";
if (window.location.pathname != TargetLink)
{
  var MenuRoot = document.getElementsByClassName("container-fluid ")[0];
  if (MenuRoot)
  {  
    var DutyButton = document.createElement("a");

    DutyButton.style.color = "#ccc";
    DutyButton.style.position = "absolute"; 
    DutyButton.style.right = "0"; 
    DutyButton.style.position.top = "50";
    DutyButton.style.paddingRight = "10px"; 
    DutyButton.style.paddingLeft = "10px"; 
    DutyButton.style.textAlign = "center"; 
    DutyButton.style.height = "30px"; 
    DutyButton.style.minWidth = "125px"; 
    DutyButton.style.display = "inline-block"; 
    DutyButton.style.borderRadius = "3px"; 
    DutyButton.style.backgroundColor = "#212121"; 
    DutyButton.style.backgroundImage = "url('http://cdn-frm-eu.wargaming.net/4.5/style_images/wg/topic_button.png')"; 
    DutyButton.style.backgroundRepeat = "repeat-x"; 
    DutyButton.style.backgroundAttachment = "scroll"; 
    DutyButton.style.backgroundPosition = "center top"; 
    DutyButton.style.backgroundClip = "border-box"; 
    DutyButton.style.backgroundOrigin = "padding-box"; 
    DutyButton.style.backgroundSize = "auto auto"; 
    DutyButton.style.borderStyle = "solid"; 
    DutyButton.style.borderColor = "#212121"; 
    DutyButton.style.borderWidth = "1px 1px 0px"; 
    DutyButton.style.boxShadow = "0px 1px 0px 0px #5C5C5C inset, 0px 2px 3px rgba(0, 0, 0, 0.2)"; 
    DutyButton.style.textShadow = "0px -1px 0px #191919";
    DutyButton.style.font = "300 12px/30px Helvetica,Arial,sans-serif";
    DutyButton.style.zIndex = "999";

    DutyButton.href = "/workspace/shifts/3/today";
    DutyButton.text = "Смены";

    MenuRoot.insertBefore(DutyButton, MenuRoot.firstChild);
  }
}