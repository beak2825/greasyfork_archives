// ==UserScript==
// @name         Gofile Link Resolver
// @namespace    GFLR_V1D
// @version      1.0
// @description  resolve link from gofile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gofile.io
// @author       Laria
// @match        https://gofile.io/d/*
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/519883/Gofile%20Link%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/519883/Gofile%20Link%20Resolver.meta.js
// ==/UserScript==
'use strict';
let taskRepID = -1;

const gfsprefix = '[®] ';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function replaceLink(gfdb) {
  //try to get file db list
  let filedb = null;

  let target_db = appdata.fileManager.mainContent.data;
  if (target_db.hasOwnProperty('children')) {
    filedb = target_db.children;
  } else if (target_db.hasOwnProperty('contents')) {//deprecated in V2
    filedb = target_db.contents;
  } else {
    console.error('cannot detect any contents in gofile internal db, please update script..', target_db);
    return;
  }

  //data-item-id : file's uuid
  //
  Array.from(document.querySelector('#filemanager_itemslist').children).filter((i)=>i.getAttribute('data-item-id')).forEach((target)=>{
    let contid = target.getAttribute('data-item-id');
    target.setAttribute('data-uuid', contid); //backup id
    target.removeAttribute('data-item-id'); //remove id prevent interval task
    let contdb = filedb[contid];
    if (!contdb) {
      //no item in gofile db
      console.error('id:', contid, '- not found in gofile file db..');
      return; //skip current item, run next(foreach)
    } else {
      //item in gofile db

      //chk data available
      if(!contdb.hasOwnProperty('name') || !contdb.hasOwnProperty('link')) {
        //no name or link in gofile db
        console.error('id:', contid, '- not found name or link in gofile file db..');
        return; //skip current item, run next(foreach)
      } else {
        //item ok, link,name ok

        //old(with original click event)
        let oldLinkElem = target.querySelector('a.item_open');
        //new(to be replace)
        let newLinkElem = document.createElement("a");

        //copy title
        newLinkElem.innerHTML = gfsprefix+oldLinkElem.innerHTML;
        //file link
        newLinkElem.href = contdb.link;
        newLinkElem.rel = "external nofollow noopener noreferrer";
        newLinkElem.target = "_blank";
        newLinkElem.title = GM.info.script.name + "에 의해 링크 재설정됨";
        //copy class
        newLinkElem.classList = oldLinkElem.classList;
        //remove item open class(remove listner)
        newLinkElem.classList.remove('item_open');


        if (contdb.overloaded) {
          //current item overloaded
          newLinkElem.innerHTML = '[❌] '+newLinkElem.innerHTML;
          newLinkElem.title += ', 다운시도 너무 많아서 일시적 잠김';
        }

        //replace elem
        oldLinkElem.parentNode.replaceChild(newLinkElem, oldLinkElem);
      }
    }
  });
}

async function disableAds() {
  //removed
}

async function intervalTask() {
  await waitForElm('#filemanager_itemslist');
  console.log('wait gofile db..');

  //await gofile db
  while(!appdata.hasOwnProperty('fileManager')) {
    await delay(100);
  }
  await disableAds(); //disable ads

  //await gofile db 2
  while(!appdata.fileManager.mainContent.data) {
    await delay(100);
    await disableAds(); //disable ads
  }
  console.log('db loaded.');

  //check hidden password form created
  await waitForElm('#filemanager_alert_passwordform');

  //await password solved
  //chk form for prevent parent elem refresh
  await disableAds(); //disable ads
  while(!(document.querySelector('#filemanager_alert_passwordform') && document.querySelector('#filemanager_alert_passwordform').classList.contains('hidden'))) {
    await delay(100);
  }
  await disableAds(); //disable ads

  //await gofile db ready
  while(!appdata.fileManager.mainContent.data.canAccess) {
    await delay(100);
    await disableAds(); //disable ads
  }
  await disableAds(); //disable ads

  //hide ads area
  document.querySelector('#index_ads').style.display = 'none';
  await replaceLink(appdata);
  console.log('resolve finished.');
  await disableAds(); //disable ads
}

async function rootProcedure(){
  await intervalTask();
  //taskRepID = setInterval(intervalTask, 100);
  //setTimeout(() => { clearInterval(taskRepID); }, 5000);
}


window.addEventListener('load', () => setTimeout(rootProcedure, 100));