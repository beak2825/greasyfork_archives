// ==UserScript==
// @name        foreignStorage
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/16/2022, 9:49:50 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440157/foreignStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/440157/foreignStorage.meta.js
// ==/UserScript==

{
  const url = localStorage.foreign_storage_dev
    ? 'http://localhost:3000/'
    : 'https://foreign-storage.herokuapp.com/'
  
  window.foreignStorage = {
    async setItem(key, str) {
      if (arguments.length < 2 || typeof key != 'string' || typeof str != 'string') {
        throw new Error('Exactly two arguments of type string required')
      }
      const options = { method: 'POST', headers: { key }, body: str }
      const answer = await fetch(url + 'setItem', options)
        .then(resp => resp.json())

      if (answer.success) return true
      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
    },

    async getItem(key) {
      if (arguments.length < 1 || typeof key != 'string') {
        throw new Error('One argument of type string required')
      }
      const options = { method: 'GET', headers: { key } }
      const answer = await fetch(url + 'getItem', options)
        .then(resp => resp.json())

      if (answer.errors?.[0] == 'undefined') return undefined
      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
      return answer
    },

    async removeItem(key) {
      if (arguments.length < 1 || typeof key != 'string') {
        throw new Error('One argument of type string required')
      }
      const options = { method: 'DELETE', headers: { key } }
      const answer = await fetch(url + 'removeItem', options)
        .then(resp => resp.json())

      if (answer.success) return true
      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
    },

    async clear() {
      const answer = await fetch(url + 'clear', { method: 'DELETE' })
        .then(resp => resp.json())

      if (answer.success) return true
      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
    },

    async getLength() {
      const answer = await fetch(url + 'getLength')
        .then(resp => resp.json())

      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
      return answer
    },

    async listKeys() {
      const answer = await fetch(url + 'listKeys')
        .then(resp => resp.json())

      if (answer.errors) throw new Error(answer.errors?.join('; ') || answer)
      return answer
    }
  }
  
}





