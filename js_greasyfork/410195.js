// ==UserScript==
// @name        miyabi.academyParser
// @namespace   Violentmonkey Scripts
// @match       https://marathon.miyabi.academy/
// @grant       vitekkor
// @version     2.0
// @author      -
// @description 29.08.2020, 19:45:53
// @downloadURL https://update.greasyfork.org/scripts/410195/miyabiacademyParser.user.js
// @updateURL https://update.greasyfork.org/scripts/410195/miyabiacademyParser.meta.js
// ==/UserScript==
document.body.onload = addElement();
function addElement() {
  var downloadButton = document.createElement('button');
  downloadButton.id = "parse";
  downloadButton.style.zIndex = "999";
  downloadButton.style.position = "fixed";
  downloadButton.innerHTML = '<img style="z-index:999;" src="https://image.flaticon.com/icons/svg/860/860801.svg" width="50" height="50">';
  downloadButton.onclick = function(){
  var buttons, innerButton, content, i, j;
  var day = 'день' +document.querySelector('div.page-heading').innerHTML;
  var allContent = "";
  var notHead = document.querySelectorAll('div.miyabi-wrapper')[2];
  let head = notHead.querySelectorAll('span');
    for (i = 0; i < head.length; i++) {
    let elem = head[i].innerHTML;
    if (elem.search(/<span .*>.*<\/span>/g) != 0 && elem != '<br>' && elem != '&nbsp;' && elem.match(/<img src=.*>/g) == null) {
      let newElem = elem.replace(/<span class="fr-emoticon fr-deletable fr-emoticon-img" .*>&nbsp;<\/span>/g, '').replace(/&nbsp;/g, '');
      allContent = allContent + newElem + '\n';
    }
  }
  download(day+'_заголовок', allContent);
  allContent = '';
  buttons = document.querySelectorAll('button.collapsed');
  for (i = 0; i < buttons.length; i++) {
    buttons[i].click();
    innerButton = document.querySelector('button.exe-description');
    innerButton.click();
    content = document.querySelectorAll('div.exercise-detail span');
    if (content.length == 0 || content.length == 1) content =  document.querySelectorAll('div.exercise-detail p');
    for (j = 0; j < content.length; j++) {
      let elem = content[j].innerHTML;
      if (elem.search(/<span .*>.*<\/span>/g) != 0 && elem != '<br>' && elem != '&nbsp;' && elem.match(/<img src=.*>/g) == null)
      allContent = allContent + content[j].innerHTML.replace(/&nbsp;/g, '').replace(/<span class="fr-emoticon.*><\/span>/g, '') + '\n';
    };
    download(day+buttons[i].innerHTML.replace(/<!----><span>/g, '').replace(/<\/span><!---->/g, ''), allContent);
    allContent = '';
  };
 
};
  document.body.insertBefore(downloadButton, document.querySelector('mdb-root'));
}
//setTimeout(myFun, 1000);

function download(name, downloadContent){
  let link = document.createElement('a');
    link.onclick = function() {                  
                        var csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(downloadContent);
                        this.href = csvData;
                        this.target = '_blank';
                        this.download = name +'.txt';
                    };
  link.click();
}
