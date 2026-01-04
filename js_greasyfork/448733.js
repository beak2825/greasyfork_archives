// ==UserScript==
// @name         ebay-paas-helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ebay cloud pages helper!
// @author       pengfchen
// @license      GPL License
// @match        *://*/v2/requests/*
// @match        https://zebra.vip.ebay.com/v2/*
// @match        https://provision.altus.vip.ebay.com/v1/*
// @match        https://cmpaas.cloud.ebay.com/*
// @match        https://deploy.altus.vip.ebay.com/*
// @match        https://cmpaas.vip.ebay.com/*
// @match        https://cmsbrowser.vip.stratus.ebay.com/browser/*
// @match        https://cloud.ebay.com/traffic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448733/ebay-paas-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448733/ebay-paas-helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    // 绝对布局, 浮动
    // Container.style.position="fixed"
    Container.style.right="0px"
    Container.style.top="40px"
    Container.style['z-index']="999999"
    Container.innerHTML =``

    document.body.prepend(Container);


    let nugget = '';
    let envCode = '';

    let url = decodeURIComponent(window.location.href);

    {
        let poolIds = /[a-z0-9-]{1,100}-app__[-a-zA-Z\d]+/.exec(url);
        if (poolIds) {
            let tmp = poolIds[0].split('-app__')
            nugget = tmp[0]
            envCode = tmp[1]
        }

        poolIds = /[a-z0-9-]{1,100}-app:[-a-zA-Z\d]+/.exec(url);
        if (poolIds) {
            let tmp = poolIds[0].split('-app:')
            nugget = tmp[0]
            envCode = tmp[1]
        }

        poolIds = /[a-z0-9-]{1,100}-topo:[-a-zA-Z\d]+/.exec(url);
        if (poolIds) {
            let tmp = poolIds[0].split('-topo:')
            nugget = tmp[0]
            envCode = tmp[1]
        }

    }

    console.log('zebra find nugget: ' + nugget + ', envCode: ' + envCode)

    if (nugget) {
        Container.innerHTML += '<div  class="cp-alink" ><a target="_blank" href="https://cloud.ebay.com/traffic/' + nugget + '-app:' + envCode + '">Traffic</a></div>'
        Container.innerHTML += '<div  class="cp-alink" ><a target="_blank" href="https://cmsbrowser.vip.stratus.ebay.com/browser/repo/cmspaas/branch/main/query?query=TopologyTemplate[@resourceId=%22' + nugget + '-topo:' + envCode + '%22]">WISB</a></div>'
        Container.innerHTML += '<div  class="cp-alink" ><a target="_blank" href="https://cmsbrowser.vip.stratus.ebay.com/browser/repo/cmsdb/branch/main/query?query=ApplicationService[@resourceId=%22' + nugget + '-app:' + envCode + '%22]">WIRI-AS</a></div>'
        Container.innerHTML += '<div  class="cp-alink" ><a target="_blank" href="https://cmsbrowser.vip.stratus.ebay.com/browser/repo/cmsdb/branch/main/query?query=Topology[@resourceId=%22' + nugget + '-topo:' + envCode + '%22]">WIRI-Topology</a></div>'
        Container.innerHTML += '<div  class="cp-alink" ><a target="_blank" href="https://zebra.vip.ebay.com/v2/topologies/' + nugget + '-topo:' + envCode + '/requests">ZebraJobList</a></div>'
    }

    // 个性化页面
    if (new RegExp("^(https://[a-z\\.]+/v\\d/requests/)\\w+?-topo:\\w+?20[\\d-]+?$").test(url)) {
        // https://zebra.vip.ebay.com/v2/requests/mntgwbtst-topo:ENVhwm5trh6ckw49__CREATE_GTM__2022-06-28-22-40-50-271
        Container.innerHTML += '<div class="cp-alink" ><a target="_self" href="' + url + '/details">details</a></div>'
    } else if (new RegExp("^(https://[a-z\\.]+/v\\d/requests/)\\w+?-topo:\\w+?20[\\d-]+?/details$").test(url)) {
        // https://zebra.vip.ebay.com/v2/requests/mntgwbtst-topo:ENVhwm5trh6ckw49__CREATE_GTM__2022-06-28-22-40-50-271/details
        Container.innerHTML += '<div class="cp-alink" ><a target="_self" href="' + url.substr(0, url.length -8) + '">job</a></div>'
    }


    // 添加 css Your code here...
    const css = '.cp-alink {display: inline-block; padding: 0 5px; color: darkblue;}'

	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}

    // Container.innerHTML +=`<button id="myCustomize" style="left:30px; top:20px; width:80px;" onClick="openZebraJobPage()">ZebraJob</button>`
    window.openZebraJobPage = function() {
        let urlTmp = decodeURIComponent(window.location.href);
        // https://cmpaas.cloud.ebay.com/dashboard/configmani…=%2FENVe154ex4hg9%2Fcoreaisvc3-app__ENVe154ex4hg9
        let topoApp = /[a-z0-9-]{1,100}-app__[-a-zA-z\d]+/.exec(urlTmp);
        // ['coreaisvc3-app__ENVe154ex4hg9', index: 115, input: 'https://cmpaas.cloud.ebay.com/dashboard/configmani…=%2FENVe154ex4hg9%2Fcoreaisvc3-app__ENVe154ex4hg9', groups: undefined]
        let topoId = topoApp[0].replace('-app__', '-topo:');
        // 打开新页面
        window.open('https://zebra.vip.ebay.com/v2/topologies/' + topoId + '/requests', '_blank');
    }
    // Your code here...
})();
