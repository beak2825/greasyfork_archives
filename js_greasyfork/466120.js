// ==UserScript==
// @name        (Semi) Auto IHK-Uploader
// @namespace   Violentmonkey Scripts
// @match       https://azubionline-ihk.de/tibrosBB/azubiHeftEditForm.jsp*
// @match       https://azubionline-ihk.de/tibrosBB/azubiHeft.jsp*
// @grant       none
// @version     1.9.4
// @author      Der_Floh
// @description Füllt automatisch alle Infofelder aus, lässt dich deine Datei sofort auswählen und speichert oder sendet den Ausbildungsnachweis direkt, sobald du eine Datei ausgewählt hast
// @icon        https://azubionline-ihk.de/tibrosBB/images/logo.png
// @homepageURL	https://greasyfork.org/de/scripts/466120-semi-auto-ihk-uploader
// @supportURL	https://greasyfork.org/de/scripts/466120-semi-auto-ihk-uploader/feedback
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/466120/%28Semi%29%20Auto%20IHK-Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/466120/%28Semi%29%20Auto%20IHK-Uploader.meta.js
// ==/UserScript==

let department = localStorage.getItem("department");
let emailB = localStorage.getItem("emailB");
let emailA = localStorage.getItem("emailA");
let sendDirectly = localStorage.getItem("sendDirectly");

const isOverview = window.location.toString().split('?')[0] == "https://azubionline-ihk.de/tibrosBB/azubiHeft.jsp";
let run;

if (!department) {
  department = prompt('Bitte gib deinen Ausbildungsabschnitt/-abteilung an. Diese kann später in der "Ausbildungsnachweise Übersicht" geändert werden.');
  localStorage.setItem("department", department);
}
if (!emailB) {
  emailB = prompt('Bitte gib die E-Mail von deinem Betreuer an. Diese kann später in der "Ausbildungsnachweise Übersicht" geändert werden.');
  localStorage.setItem("emailB", emailB);
}
if (!emailA) {
  emailA = prompt('Bitte gib die E-Mail von deinem Ausbilder an. Diese kann später in der "Ausbildungsnachweise Übersicht" geändert werden.');
  localStorage.setItem("emailA", emailA);
}
if (!sendDirectly) {
  sendDirectly = confirm('Möchtest du das Ausbildungsnachweise automatisch versendet werden wenn du eine Datei gewählt hast? Dies kann später in der "Ausbildungsnachweise Übersicht" geändert werden.');
  localStorage.setItem("sendDirectly", sendDirectly);
}

let intervalId;

window.onload = (event) => {
  if (isOverview)
    createOptions();
  else {
    run = localStorage.getItem("run");
    if (run == "false")
      return;

    run = false;
    localStorage.setItem("run", run);
    document.getElementsByName("ausbMail")[0].value = emailB;
    document.getElementsByName("ausbMail2")[0].value = emailB;
    document.getElementsByName("ausbilderMail")[0].value = emailA;
    document.getElementsByName("ausbabschnitt")[0].value = department;

    let input = document.querySelector('input[type="file"][name="file"]');
    if (input)
      input.click();

    intervalId = setInterval(checkPicked, 100);
  }
};

function checkPicked() {
  const input = document.querySelector('input[type="file"][name="file"]');
  if (input.value) {
    clearInterval(intervalId);
    if (sendDirectly == "true") {
      const sent = document.querySelector('button[type="submit"][name="sent"]');
      if (sent)
        sent.click();
    } else {
      const save = document.querySelector('button[type="submit"][name="save"]');
      if (save)
        save.click();
    }
  }
}

function createOptions() {
	const nocTable = document.querySelectorAll('div[class="noc_table "]')[1];
	const buttonContainer = nocTable.querySelector('button[class="button2"][type="submit"][name="neu"]').parentNode.parentNode;
	const buttonRow = buttonContainer.parentNode;
  const runButtonContainer = buttonContainer.cloneNode(true);
  const runButton = runButtonContainer.querySelector('button[class="button2"][type="submit"][name="neu"]');
  runButton.textContent = "Neuer Eintrag (AIHKU)";
  runButton.addEventListener("click", () => {
    run = true;
    localStorage.setItem("run", run);
  });
  buttonRow.insertBefore(runButtonContainer, buttonRow.firstChild);

  let row1 = document.createElement("div");
  row1.className = "row";
  row1.style.marginBottom = "8px";
  let row1InputWrapper1 = document.createElement("div");
  row1InputWrapper1.className = "input-wrapper col-sm-12 col-md-4";
  let changeEMailBInput = document.createElement("input");
  changeEMailBInput.value = emailB;
  changeEMailBInput.addEventListener("input", (event) => {
    emailB = event.target.value;
    localStorage.setItem("emailB", emailB);
  });
  let changeEMailBInputText = document.createTextNode("Betreuer E-Mail");
  let row1InputWrapper2 = document.createElement("div");
  row1InputWrapper2.className = "input-wrapper col-sm-12 col-md-4";
  let changeEMailAInput = document.createElement("input");
  changeEMailAInput.value = emailA;
  changeEMailAInput.addEventListener("input", (event) => {
    emailA = event.target.value;
    localStorage.setItem("emailA", emailA);
  });
  let changeEMailAInputText = document.createTextNode("Ausbilder E-Mail");
  row1InputWrapper1.appendChild(changeEMailBInput);
  row1InputWrapper1.appendChild(changeEMailBInputText);
  row1InputWrapper2.appendChild(changeEMailAInput);
  row1InputWrapper2.appendChild(changeEMailAInputText);
  row1.appendChild(row1InputWrapper1);
  row1.appendChild(row1InputWrapper2);

  let row2 = document.createElement("div");
  row2.className = "row";
  row2.style.marginBottom = "16px";
  let row2InputWrapper1 = document.createElement("div");
  row2InputWrapper1.className = "input-wrapper col-sm-12 col-md-4";
  let changeDepartmentInput = document.createElement("input");
  changeDepartmentInput.value = department;
  changeDepartmentInput.addEventListener("input", (event) => {
    department = event.target.value;
    localStorage.setItem("department", department);
  });
  let changeDepartmentInputText = document.createTextNode("Ausbildungsabschnitt/-abteilung");
  let row2InputWrapper2 = document.createElement("div");
  row2InputWrapper2.className = "input-wrapper col-sm-12 col-md-4";
  let changeSendDirectlyInput = document.createElement("input");
  changeSendDirectlyInput.type = "checkbox";
  changeSendDirectlyInput.checked = sendDirectly == "true";
  changeSendDirectlyInput.addEventListener("change", (event) => {
    sendDirectly = event.target.checked;
    localStorage.setItem("sendDirectly", sendDirectly);
  });
  let changeSendDirectlyInputText = document.createTextNode("Direkt Senden");
  row2InputWrapper1.appendChild(changeDepartmentInput);
  row2InputWrapper1.appendChild(changeDepartmentInputText);
  row2InputWrapper2.appendChild(changeSendDirectlyInput);
  row2InputWrapper2.appendChild(changeSendDirectlyInputText);
  row2.appendChild(row2InputWrapper1);
  row2.appendChild(row2InputWrapper2);

  let showHideRow = document.createElement("div");
  showHideRow.className = "row";
  showHideRow.style.marginBottom = "10px";
  showHideRow.style.marginLeft = "0px";
  let showHideRowInputWrapper = document.createElement("div");
  let showHideSettingsText = document.createElement("strong");
  showHideSettingsText.textContent = "Auto IHK-Uploader Einstellungen:";
  showHideRowInputWrapper.appendChild(showHideSettingsText);
  showHideRow.appendChild(showHideRowInputWrapper);

  let rowLine = document.createElement("div");
  rowLine.className = "row reihe";
  rowLine.style.marginBottom = "8px";

  let settingsForm = document.querySelector('form[class="content-form"][action="azubiHeft.jsp"]');
  settingsForm.insertBefore(rowLine.cloneNode(true), settingsForm.firstChild);
  settingsForm.insertBefore(row2, settingsForm.firstChild);
  settingsForm.insertBefore(row1, settingsForm.firstChild);
  settingsForm.insertBefore(showHideRow, settingsForm.firstChild);
  settingsForm.insertBefore(rowLine.cloneNode(true), settingsForm.firstChild);
}
