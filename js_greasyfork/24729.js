// ==UserScript==
// @name         Prolific Export
// @namespace    https://github.com/Kadauchi/
// @version      1.1.0
// @description  Forum export for surveys on Prolific
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.prolific.ac/studies*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/24729/Prolific%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/24729/Prolific%20Export.meta.js
// ==/UserScript==

function exportStudy (id) {
  const study = document.getElementById(id);
  const attrs = study.getElementsByTagName(`li`);

  const link = study.querySelector(`a[href^="/studies/"]`).href;
  const title = study.getElementsByTagName(`h3`)[0].textContent;
  const researcher = attrs[0].textContent.split(':')[1];
  const reward = attrs[1].textContent.split(':')[1].split(`$`)[0];
  const perhour = attrs[2].textContent.split(':')[1];
  const available = attrs[3].textContent.split(':')[1];
  const time = attrs[4].textContent.split(':')[1];
  const completion = attrs[5].textContent.split(':')[1];
  const exchangeRate = localStorage.getItem(`exchangeRate`);

  const exportcode =
        `[table][tr][td]` +
        `[b][size=5][color=red]PROLIFIC STUDY[/color][/size][/b]\n` +
        `[b]Title:[/b] [url=${link}]${title}[/url]\n` +
        `[b]Hosted by : [/b] ${researcher}\n` +
        `[b]Reward : [/b][color=green][b] ${reward}[/color] ${exchangeRate ? `| [color=green]$${(+exchangeRate * +reward.replace(/[^0-9.]/g, ``)).toFixed(2)}[/color]` : ``}[/b]\n` +
        `[b]Avg. Reward Per Hour : [/b] ${perhour} ${exchangeRate ? `| $${(+exchangeRate * +perhour.replace(/[^0-9.]/g, ``)).toFixed(2)}/hr` : ``}\n` +
        `[b]Available Places : [/b] ${available}\n` +
        `[b]Maximum Allowed Time : [/b] ${time}\n` +
        `[b]Avg. Completion Time : [/b] ${completion}\n` +
        `[/td][/tr][/table]`
  ;

  GM_setClipboard(exportcode);
  alert(`Forum export has been copied to your clipboard.`);
}

for (let elem of document.getElementsByClassName(`study`)) {
  elem.insertAdjacentHTML(
    `beforebegin`,
    `<button class="exporter" type="button" data-id="${elem.id}">Forum Export</button>`
  );
}

document.addEventListener(`click`, function (event) {
  const elem = event.target;

  if (elem.matches(`.exporter`)) {
    exportStudy(elem.dataset.id);
  }
});
