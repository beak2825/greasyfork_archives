// ==UserScript==
// @name         AutoSueta
// @namespace    https://greasyfork.org/ru/users/1180762-nyako
// @version      0.19
// @description  Авто Суетит
// @author       m9xd
// @match        https://lolz.live/threads/*
// @match        https://lolz.live/*
// @icon         https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @run-at       document-body
// @license null
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/476068/AutoSueta.user.js
// @updateURL https://update.greasyfork.org/scripts/476068/AutoSueta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const megaSuetaBBCode = `[URL='https://lztcdn.com/files/49e14e19-1a8d-4199-bf5a-222a2bb8449a.webp'] [IMG=align=left;alt=%5BОпять суета%5D]https://lztcdn.com/files/49e14e19-1a8d-4199-bf5a-222a2bb8449a.webp[/IMG][/URL]`
    const suetaSmilieElement = `<smilie class="fr-deletable" contenteditable="false"><img src="https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp" class="mceSmilie fr-fic fr-dii fr-draggable" title="sueta" alt=":sueta:" data-smilie="yes" style="user-select: auto !important;"></smilie>`
    window.addEventListener("DOMContentLoaded",async (event) => {
        if (await GM.getValue("firstrun") != "ok") {
            XenForo.alert(`Спасибо за установку!<img src="https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp" \>\n\n<p style="color: #626262">Подарить автору шоколадку вы можете <a href="https://zelenka.guru/xyle_smotrish/">отправив денюшку на маркет</a> или же в крипте по реквизитам ниже:</p>\nTON: <i>UQDMck_T5wHBkLyLuqyDH2Yz1eHJmh3n5ZE6Fsw5ERrCP5bc</i>\nUSDT: <i>TWtsJt2RCTZVdwQHQyVR2q9raihHA9Y93p</i>`, "AutoSueta" + suetaSmilieElement);
            await GM.setValue("firstrun", "ok");
            await GM.setValue("suetaModalOpened", false)
            await GM.setValue("suetaEnabled", true)
            await GM.setValue("suetaDefaultKey", "F9")
            await GM.setValue("suetaMegaKey", "Alt")
            await GM.setValue("suetaBgEnabled", false)
        }

        document.addEventListener('keydown', async (event) => {
          var suetaBind = await GM.getValue("suetaDefaultKey")
          var suetaMegaBind = await GM.getValue("suetaMegaKey")
          if ((suetaBind =! null) || (suetaMegaBind =! null)) {
           if(event.key === await GM.getValue("suetaDefaultKey")) {
               $(`div[dir='ltr'] p`).append(`:sueta:`)
           } else if (event.key === await GM.getValue("suetaMegaKey")) {
               $(`div[dir='ltr'] p`).append(megaSuetaBBCode)
           }
        }

    })
    })
    $(document).ready(async function(){
     if (await GM.getValue("suetaBgEnabled")) {
        $(`body`).attr("style", `background-size: cover; background-position: center center; background-attachment: fixed; background-repeat: no-repeat; background-image: url(https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp);`)
     }
     if (await GM.getValue("suetaLogoRemoving")) {
     $(`div[class='hiddenWideUnder fl_l'] a#lzt-logo`).remove()
     $(`div[class='hiddenWideUnder fl_l']`).prepend(`<a href="https://zelenka.guru/" style="background-size: 100%; float: left; height: 36px; width: 36px; margin: 4px 10px 0 0;"><img src="https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp"></a>`)
     }
     //$(`#AccountMenu ul[class='secondaryContent blockLinksList'] li:first`).append(`<li><button id="autosueta-settings">AutoSueta</button></li>`)
     if (await GM.getValue("suetaEnabled")) {
     $(`div[dir='ltr'] p`).append(`:sueta:`)
     }

     $(`a[class='close OverlayCloser']`).click(async () => {
         if (await GM.getValue("suetaModalOpened")) {
            await GM.setValue("suetaModalOpened", false)
         await GM.setValue("suetaEnabled", document.getElementById("sueta_enabled").checked)
         location.reload()
         }
      })


        async function SaveSettings() {
            await GM.setValue("suetaModalOpened", false)
            await GM.setValue("suetaEnabled", document.getElementById("sueta_enabled").checked)
            await GM.setValue("suetaDefaultKey", document.getElementById("sueta_binded_button").value ? document.getElementById("sueta_binded_button").value : null)
            await GM.setValue("suetaMegaKey", document.getElementById("megasueta_binded_button").value ? document.getElementById("megasueta_binded_button").value : null)
            await GM.setValue("suetaLogoRemoving", document.getElementById("sueta_logo_enabled").checked)
            await GM.setValue("suetaBgEnabled", document.getElementById("sueta_bg").checked)
            XenForo.alert('Настройки сохранены!', 1, 10000)
            location.reload()

        }
            async function AutoSuetaMenu() {
                document.querySelectorAll('div.modal.fade').forEach(el => el.remove());
                var SmodalBackdrops = document.querySelectorAll('div.modal-backdrop');

                if (SmodalBackdrops.length > 0) {
                    SmodalBackdrops[LZTMSmodalBackdrops.length - 1].remove();
                }


                var ScontentMenu = `<h3 class="textHeading" style="margin-left: 30px;">Настройки</h3><li style="margin-left: 30px;"><input type="checkbox" id="sueta_enabled"><label for="sueta_enabled">Добавлять суету в сообщения после загрузки страницы</label></li>\n<li style="margin-left: 30px;"><input type="checkbox" id="sueta_bg"><label for="sueta_bg">Фон форума как суета</label></li>\n<li style="margin-left: 30px;"><input type="checkbox" id="sueta_logo_enabled"><label for="sueta_logo_enabled">Замена лого Зеленки на суету</label></li>\n<label for="sueta_binded_button" style="margin-left: 30px; ">Бинд для быстрой суеты:</label> <input id="sueta_binded_button" class="textCtrl" value="${await GM.getValue("suetaDefaultKey")}"><p style="color: #626262; margin-left: 40px;">Только одна кнопка!</p></li><label for="megasueta_binded_button" style="margin-left: 30px; ">Бинд для мега суеты:</label> <input id="megasueta_binded_button" class="textCtrl" value="${await GM.getValue("suetaMegaKey")}"><p style="color: #626262; margin-left: 40px;">Только одна кнопка!</p></li><br><li><button id="saveSettings" class="button" style="margin-bottom: 10px;flex: 1; margin-left: 5px;">Сохранить</a></li></div>
<div style="display: flex;padding-top: 30px;flex-direction: column;">
  <div style="flex: 1;display: flex;justify-content: space-evenly;">
    <p style="color: #626262">Скрипт сделан в юмористических целях. Всем суеты ${suetaSmilieElement}</p>
    <a href="https://greasyfork.org/ru/scripts/476068-autosueta" class="button" id="update_ext" style="margin-bottom: 10px;flex: 1; margin-left: 5px;">Обновление</a>

  </div>
</div>`;
                XenForo.alert(ScontentMenu, 'AutoSueta ' + suetaSmilieElement);
                await GM.setValue("suetaModalOpened", true)
                document.getElementById("saveSettings").addEventListener("click", function() {
                    SaveSettings();
                });
                if (await GM.getValue("suetaEnabled")) {
                    document.getElementById("sueta_enabled").checked = true
                }
                if (await GM.getValue("suetaLogoRemoving")) {
                    document.getElementById("sueta_logo_enabled").checked = true
                }
                if (await GM.getValue("suetaBgEnabled")) {
                    document.getElementById("sueta_bg").checked = true
                }
            }


     var accountMenu = document.querySelector('#AccountMenu > ul > li:nth-child(1) > a');
            if (accountMenu) {
                var newMenuItem = document.createElement('li');
                newMenuItem.innerHTML = '<a id="autosueta-settings"><b>AutoSueta</b></a>';
                accountMenu.parentNode.insertBefore(newMenuItem, accountMenu.nextSibling);
                var separator = document.createElement('div');
                separator.className = 'account-menu-sep';
                accountMenu.parentNode.insertBefore(separator, newMenuItem);
                document.getElementById("autosueta-settings").addEventListener("click", function() {
                    AutoSuetaMenu();
                });
            }
});
})();