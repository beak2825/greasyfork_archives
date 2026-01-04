// ==UserScript==
// @name         D2RUAUTOSUBSCRIBER
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Автоподписыватель на пользователей д2ру
// @author       S30N1K
// @match        https://dota2.ru/
// @match        https://esportsgames.ru/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/421002/D2RUAUTOSUBSCRIBER.user.js
// @updateURL https://update.greasyfork.org/scripts/421002/D2RUAUTOSUBSCRIBER.meta.js
// ==/UserScript==

(async function () {
  const offset = 864000
  const lastDate = parseInt(localStorage.getItem("lastSubscribeTime")) || 0
  let lastUser = parseInt(localStorage.getItem("lastSubscribeUser")) || 100


  const nextUser = async () => {
    lastUser += 1;
    localStorage.setItem("lastSubscribeUser", lastUser.toString())
    await subscribe()
  }

  const subscribe = async () => {
    const response = await fetch("/forum/api/user/subscribe", {
      method: 'POST',
      body: JSON.stringify({uid: lastUser}),
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    })
    const result = await response.json()
    switch (result.status){
      case "already": {
        console.log(`${lastUser} уже подписан`)
        await nextUser()
        break
      }
      case "success": {
        console.log(`${lastUser} успешно подписались`)
        await nextUser()
        break
      }
      case "invalidUser":{
        await nextUser()
        break
      }
      case "accessDenied": {
        Utils.notify("Лимит подписок на сегодня исчерпан")
        localStorage.setItem("lastSubscribeTime", (+new Date() + offset).toString())
        break
      }
      default: {
        console.log(result)
      }
    }
  }

  if ((+new Date()) > lastDate) {
    await subscribe()
  }

})();