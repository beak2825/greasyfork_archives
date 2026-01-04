// ==UserScript==
// @name         WemeSmtTest
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      /^https://swag.+\.xyz.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swag555.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442450/WemeSmtTest.user.js
// @updateURL https://update.greasyfork.org/scripts/442450/WemeSmtTest.meta.js
// ==/UserScript==

function GetCookie()
{
     fetch("https://66.42.117.77:3001/getPermission/"+"我没有钱"+"/325139").then(async function(result) {
            let res = await result.json()
            if (res.code == 300) {
                setTip(res.msg)
                return
            }
            let cookieArr = res.data.cookieHeader
            cookieArr.forEach((item) => {
                let temp = item.split(";")[0]
                let tempArr = temp.split("=")
                if (tempArr[0] == 'user') {
                    setCookie('user', tempArr[1], 1)
                } else {
                    setCookie(tempArr[0], tempArr[1])
                }
            })
        })
}
GetCookie();