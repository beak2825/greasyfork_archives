// ==UserScript==
// @name         webhook_test
// @namespace    https://www.torn.com
// @version      1.4
// @description  logs torns faction chat messages to our discord server
// @author       Bilbosaggings [2323763]
// @match        https://www.torn.com/profiles.php?XID=2323763
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432710/webhook_test.user.js
// @updateURL https://update.greasyfork.org/scripts/432710/webhook_test.meta.js
// ==/UserScript==
 
const url = "https://discord.com"
const api = "/api/webhooks/"
const webhook = "887439683464867861/dhRRlTIhedl_OUgfJ4orxH5E9BRew3qloH7-aS8anH_h0jBfkeYn7a1MOl6u2wCb0TKE"

alert(url+api+webhook)