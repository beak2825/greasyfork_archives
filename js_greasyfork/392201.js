// ==UserScript==
// @name              fuck off ?tdsourcetag=s_pctim_aiomsg
// @name:zh-CN        去除?tdsourcetag=s_pctim_aiomsg
// @namespace         https://greasyfork.org/zh-CN/scripts/392201
// @homeurl           https://greasyfork.org/zh-CN/scripts/392201
// @version           1.2
// @description       try to take over the world!
// @description:zh-cn try to take over the world!
// @author            ScrapW
// @create            2019-11-10
// @update            2019-11-15
// @match             http://*/*?tdsourcetag=s_pctim_aiomsg
// @match             https://*/*?tdsourcetag=s_pctim_aiomsg
// @grant             none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/392201/fuck%20off%20tdsourcetag%3Ds_pctim_aiomsg.user.js
// @updateURL https://update.greasyfork.org/scripts/392201/fuck%20off%20tdsourcetag%3Ds_pctim_aiomsg.meta.js
// ==/UserScript==

window.location.replace(window.location.href.substr(0,window.location.href.lastIndexOf("?tdsourcetag=s_pctim_aiomsg")))