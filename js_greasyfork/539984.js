// ==UserScript==
// @name         Season start
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  Pro season starty
// @author       You
// @match        https://lnpscoreboard.webpont.com/?nat=all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webpont.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539984/Season%20start.user.js
// @updateURL https://update.greasyfork.org/scripts/539984/Season%20start.meta.js
// ==/UserScript==



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function otevriPopupAVerifikujAMenu() {
  let trElements = Array.from(document.querySelectorAll('tr[data-id]'));

  for (let prvniTr of trElements) {
    console.log('Zpracovávám TR:', prvniTr);

    let iconText = prvniTr.querySelector('.icon--text');

    if (iconText) {
      console.log('Element s třídou .icon--text nalezen:', iconText);

      iconText.click();
      console.log('.icon--text kliknuto.');

      await delay(1000);

      let popup = document.getElementById('cml_instance_0_box_wrapper');

      if (popup) {
        console.log('Popup s ID "cml_instance_0_box_wrapper" byl nalezen:', popup);

        let menu2 = popup.querySelector('.menu2');

        if (menu2) {
          console.log('Element s třídou .menu2 nalezen:', menu2);

          let activeLink = menu2.querySelector('a.act');
          let kvidoLink = menu2.querySelector('a[data-action-id="cml_instance_0_menu-9afd30230eca87e8fd2acbdfa023600e-click"][data-param-hash="f2wd1q"]');

          if (activeLink) {
            console.log('Aktivní sekce nalezena:', activeLink.textContent);

            if (activeLink === kvidoLink) {
              console.log('Kvido aktivní, žádné přepínání není potřeba.');
            } else {
              if (kvidoLink) {
                kvidoLink.click();
                console.log('Kliknuto na odkaz Kvido, protože aktivní sekce nebyla Kvido.');
              }
            }
          } else {
            if (kvidoLink) {
              kvidoLink.click();
              console.log('Žádná aktivní sekce nalezena, klikám na Kvido.');
            }
          }

          let sortableDiv = popup.querySelector('#cml_instance_0_1_sortable');
          if (sortableDiv) {
            console.log('Div s ID "cml_instance_0_1_sortable" byl nalezen:', sortableDiv);
            console.log('Zavírám popup, protože bylo nalezeno #cml_instance_0_1_sortable.');
            closePopup();
            console.log('Doplněno');
            continue;
          } else {
            console.log('Div s ID "cml_instance_0_1_sortable" nebyl nalezen, pokračuji v klonování.');
          }

          let tabCloneDiv = popup.querySelector('#cml_instance_0_tab_clone');
          if (tabCloneDiv) {
            let h3Element = tabCloneDiv.querySelector('h3');
            if (h3Element && h3Element.textContent.trim() === 'Clone') {
              console.log('Element s ID "cml_instance_0_tab_clone" obsahující <h3>Clone</h3> byl nalezen:', tabCloneDiv);

              let tournamentSelect = tabCloneDiv.querySelector('#cml_instance_0_tab_clone_tournament_input');
              if (tournamentSelect) {
                console.log('<select> element nalezen:', tournamentSelect);

                let options = tournamentSelect.querySelectorAll('option');

                let option2024 = Array.from(options).find(option => option.textContent.includes('2024'));
                let option2023 = Array.from(options).find(option => option.textContent.includes('2023'));

                if (option2024) {
                  tournamentSelect.value = option2024.value;
                  console.log('Nastavena hodnota selectu na první výskyt roku 2024:', option2024.textContent);

                  let event = new Event('change');
                  tournamentSelect.dispatchEvent(event);
                  await delay(1000);

                  let cloneButton = tabCloneDiv.querySelector('button[data-action-id="cml_instance_0_tab_clone-doClone-click"]');
                  if (cloneButton) {
                    cloneButton.click();
                    console.log('Tlačítko Clone bylo kliknuto.');

                    await checkSuccessMessage();

                    await waitForSortableDiv(10000);
                    closePopup();
                  } else {
                    console.log('Tlačítko Clone nebylo nalezeno.');
                  }
                } else if (option2023) {
                  tournamentSelect.value = option2023.value;
                  console.log('Nastavena hodnota selectu na první výskyt roku 2023:', option2023.textContent);

                  let event = new Event('change');
                  tournamentSelect.dispatchEvent(event);
                  await delay(1000);

                  let cloneButton = tabCloneDiv.querySelector('button[data-action-id="cml_instance_0_tab_clone-doClone-click"]');
                  if (cloneButton) {
                    cloneButton.click();
                    console.log('Tlačítko Clone bylo kliknuto.');

                    await checkSuccessMessage();

                    await waitForSortableDiv(10000);
                    closePopup();
                  } else {
                    console.log('Tlačítko Clone nebylo nalezeno.');
                  }
                } else {
                  console.log('Nebyla nalezena žádná možnost obsahující rok 2024 ani 2023. Zavírám popup.');
                  closePopup();
                }
              } else {
                console.log('<select> element s ID "cml_instance_0_tab_clone_tournament_input" nebyl nalezen.');
              }
            } else {
              console.log('Element s ID "cml_instance_0_tab_clone" nalezen, ale neobsahuje správný <h3>Clone</h3>.');
            }
          } else {
            console.log('Element s ID "cml_instance_0_tab_clone" nebyl nalezen.');
          }
        } else {
          console.log('Element s třídou .menu2 nebyl nalezen.');
        }
      } else {
        console.log('Popup s ID "cml_instance_0_box_wrapper" nebyl nalezen.');
      }
    } else {
      console.log('Element s třídou .icon--text nebyl uvnitř tohoto <tr> nalezen.');
    }

    console.log('Doplněno');
  }

  console.log('Všechna TR byla zpracována.');
}

function closePopup() {
  let closeButton = document.querySelector('a[data-test="popup-close"]');
  if (closeButton) {
    closeButton.click();
    console.log('Popup byl zavřen.');
  } else {
    console.log('Zavírací odkaz nebyl nalezen.');
  }
}

async function waitForSortableDiv(timeout) {
  let maxChecks = timeout / 500;
  let attempts = 0;

  return new Promise(resolve => {
    let intervalId = setInterval(() => {
      attempts++;

      let sortableDiv = document.getElementById('cml_instance_0_1_sortable');
      if (sortableDiv) {
        console.log('#cml_instance_0_1_sortable byl nalezen.');
        clearInterval(intervalId);
        resolve();
      } else if (attempts >= maxChecks) {
        console.log('#cml_instance_0_1_sortable nebyl nalezen do limitu 10 sekund.');
        clearInterval(intervalId);
        resolve();
      }
    }, 500);
  });
}

async function checkSuccessMessage() {
  let maxChecks = 20;
  let checkInterval = 500;
  let attempts = 0;

  return new Promise(resolve => {
    let intervalId = setInterval(() => {
      attempts++;

      let successMessage = Array.from(document.querySelectorAll('div[id^="flash_message_msg_"]'))
                               .find(msg => msg.textContent.includes('Successfully cloned') &&
                                            window.getComputedStyle(msg).display !== 'none');

      if (successMessage) {
        console.log('Úspěšná zpráva: "Successfully cloned" je nyní viditelná.');
        clearInterval(intervalId);
        resolve();
      } else if (attempts >= maxChecks) {
        console.log('Úspěšná zpráva nebyla nalezena jako viditelná do limitu 10 sekund.');
        clearInterval(intervalId);
        resolve();
      }
    }, checkInterval);
  });
}

otevriPopupAVerifikujAMenu();