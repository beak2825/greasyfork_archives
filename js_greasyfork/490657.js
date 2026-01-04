// ==UserScript==
// @name        DTF FUFreeList
// @namespace   Violentmonkey Scripts
// @match       https://dtf.ru/*
// @grant       none
// @version     1.5
// @author      zycck
// @description Возвращает список лайков.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490657/DTF%20FUFreeList.user.js
// @updateURL https://update.greasyfork.org/scripts/490657/DTF%20FUFreeList.meta.js
// ==/UserScript==
const storageChangeHandler = async (event) => {

    if (event.key === 'user' && JSON.parse(event.newValue)?.isPlus === false) {
      console.log(event)
        await editLocal();
    }
};

window.addEventListener('storage', storageChangeHandler);

const editLocal = async () => {
    const copy = JSON.parse(localStorage.getItem('user'));
    copy.isPlus = true;
    copy.isPro = true;

    localStorage.setItem('user', JSON.stringify(copy));

    window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        oldValue: JSON.stringify(localStorage.user),
        newValue: JSON.stringify(copy),
        url: window.location.href,
        storageArea: localStorage
    }));

   return

};

async function check() {
    let count = 0
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const user = JSON.parse(localStorage.getItem('user'));
        editLocal()
        if(user.isPlus && count > 2){
          break
        }else{
          count++
        }
    }
}

check();
