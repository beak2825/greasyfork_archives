// ==UserScript==
// @name         Whitelist All IPs for Salesforce
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Whitelist All IPs for a Salesforce organization
// @author       https://github.com/rdehler (Script by Steven Chong)
// @match        https://*.salesforce.com/05G*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396817/Whitelist%20All%20IPs%20for%20Salesforce.user.js
// @updateURL https://update.greasyfork.org/scripts/396817/Whitelist%20All%20IPs%20for%20Salesforce.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initialize(sid) {
        var pbButton = document.querySelector('.pbButton');

        if (!pbButton) {
            requestAnimationFrame(function() { initialize(sid); });
        } else {
            var loadingImage = createLoadingImage();

            var deleteAllButton = addButton('Delete All', pbButton);
            deleteAllButton.onclick = function() { deleteAll(loadingImage, pbButton, sid, function() { return confirm('This remove ALL trusted IP ranges. Would you like to proceed?'); }); };

            var whitelistAllButton = addButton('Whitelist All IPs', pbButton);
            whitelistAllButton.onclick = function() { allowAll(loadingImage, pbButton, sid); };

            var whitelistMyIpButton = addButton('Whitelist my IP', pbButton);
            whitelistMyIpButton.disabled = true;
            request('https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=text','get').then(function(ip){
                whitelistMyIpButton.value = 'Whitelist my IP (' + ip + ')';
                whitelistMyIpButton.onclick = function() { allowMyIp(loadingImage, pbButton, ip, sid); };
                whitelistMyIpButton.disabled = false;
            });

            if (/^\?deleteall=\d+/.test(location.search)) deleteAll(loadingImage, pbButton, sid, function() { return true; });
        }
    }

    function initSid() {
        var theSid = document.cookie.match(/(^|;\s*)sid=(.+?);/);
        if (!theSid || !theSid[2]) {
            requestAnimationFrame(initSid);
        } else {
            initialize(theSid[2]);
        }
    }

    initSid();

    function addButton(text, pbButton){
        var button = document.createElement('input');
        button.type = 'button';
        button.className = 'btn';
        button.value = text;
        pbButton.appendChild(button);
        return button;
    }

    function createLoadingImage(){
        var loadingImage = document.createElement('img');
        loadingImage.src = '/img/loading.gif';
        loadingImage.className = 'LoadinImage';
        loadingImage.style.verticalAlign = 'middle';
        loadingImage.style.margin = '0.2rem';
        return loadingImage;
    }

    function deleteAll(loadingImage, pbButton, sid, confirmFunc) {
        if(confirmFunc()){
            var actionLinks = [];
            var actionColumns = document.querySelectorAll('.actionColumn');
            for (var i = 0, iL = actionColumns.length; i < iL; i++) {
                var links = actionColumns[i].querySelectorAll('.actionLink');

                for (var j = 0, jL = links.length; j < jL; j++) {
                    var href = links[j].getAttribute('href');
                    if (/^javascript:srcUp\(%27(.+)%27\);$/.test(href)) href = decodeURIComponent(href.replace(/^javascript:srcUp\(%27(.+)%27\);$/, '$1'));
                    console.log(href);
                    if (/\/setup\/own\/deleteredirect\.jsp/.test(href)) {
                        actionLinks.push(href);
                        break;
                    }
                }
            }

           if (actionLinks.length > 0) {
                var ipsLeft = actionLinks.length;

                function doRequest(link) {
                    request(link, 'get', sid).then(function() {
                        console.log(--ipsLeft + ' ips left');
                        counterElement.innerText = 'deleting ' + ipsLeft + '/' + actionLinks.length;
                        if(ipsLeft === 0) location.replace(location.pathname + '?deleteall=' + new Date().getTime() + location.search.replace(/^\?deleteall=\d+&/, '?').replace(/^\?/, '&'));
                    });
                }

                pbButton.innerHTML = '';

                var counterElement = document.createElement('span');
                counterElement.id = 'ipCounter';
                counterElement.innerText = 'deleting 0/' + actionLinks.length;
                pbButton.appendChild(counterElement);

                pbButton.appendChild(loadingImage);

                for (var k = 0, kL = actionLinks.length; k < kL; k++) {
                   doRequest(actionLinks[k]);
                }
            } else if (/^\?deleteall=\d+/.test(location.search)) {
                location.replace(location.pathname + location.search.replace(/^\?deleteall=\d+&/, '?').replace(/^\?deleteall=\d+$/, ''));
            }
        }
    }

    function allowAll(loadingImage, pbButton, sid){
        if(confirm('This will allow users to connect from every computer without verification code or security token. This might present a security threat. Would you like to proceed?')){
            var IP_RANGE = 255;
            pbButton.innerHTML = '';

            var counterElement = document.createElement('span');
            counterElement.id = 'ipCounter';
            counterElement.innerText = 'adding 0/' + IP_RANGE;
            pbButton.appendChild(counterElement);

            pbButton.appendChild(loadingImage);

            var pendingIps = [];

            for(var i = 0 ; i <= IP_RANGE ;i+=2){
                addIp(i, counterElement, pendingIps, sid, IP_RANGE);
            }
        }
    }

    function allowMyIp(loadingImage, pbButton, myIp, sid){
        if(confirm('This will allow users to connect from ' + myIp + ' without verification code or security token. This might present a security threat. Would you like to proceed?')){
            if (pbButton) {
                pbButton.innerHTML = '';
                pbButton.appendChild(loadingImage);
            }
            addMyIp(myIp, sid);
        }
    }

    function addIp(ipPrefix, counterElement, pendingIps, sid, IP_RANGE){
        pendingIps[ipPrefix] = true;
        request('/05G/e', 'get', sid).then(function(result){
            var confirmationToken = result.match(/input type="hidden" name="_CONFIRMATIONTOKEN" id="_CONFIRMATIONTOKEN" value="([^"]*)"/)[1];
            return request('/05G/e?IpStartAddress=' + ipPrefix + '.0.0.0&IpEndAddress=' + (ipPrefix + 1) + '.255.255.255&save=1&_CONFIRMATIONTOKEN=' + confirmationToken, 'post', sid);
        }).then(function(result){
            console.log(ipPrefix + ' is done');
            pendingIps[ipPrefix] = false;
            var ipsLeft = pendingIps.reduce(function(sum,curVal){
                return curVal ? ++sum : sum;
            },0);
            console.log(ipsLeft + ' ips left');
            counterElement.innerText = 'adding ' + (IP_RANGE-ipsLeft) + '/' + IP_RANGE;
            if(ipsLeft === 0) location.reload();
        });
    }

    function addMyIp(myIp, sid){
        request('/05G/e','get', sid).then(function(result){
            var confirmationToken = result.match(/input type="hidden" name="_CONFIRMATIONTOKEN" id="_CONFIRMATIONTOKEN" value="([^"]*)"/)[1];
            return request('/05G/e?IpStartAddress=' + myIp + '&IpEndAddress=' + myIp + '&save=1&_CONFIRMATIONTOKEN=' + confirmationToken, 'post', sid);
        }).then(function(result){
            console.log(myIp + ' is done');
            location.reload();
        });
    }

    function request(url, method, sid){
        method = method || 'GET';
        if(typeof GM_xmlhttpRequest === "function"){
            return new Promise(function(fulfill,reject){
                GM_xmlhttpRequest({
                    method:method,
                    url:url,
                    headers:{
                        Authorization:'Bearer ' + sid,
                        Accept:'*/*'
                    },
                    onload:function(response){
                        if( response.status.toString().indexOf('2') === 0){
                            fulfill(response.response);
                        }else{
                            reject(Error(response.statusText));
                        }
                    },
                    onerror:function(response){
                        rejected(Error("Network Error"));
                    }
                });
            });
        }
        return new Promise(function(fulfill,reject){
            var xhr = new XMLHttpRequest();
            xhr.open(method,url);
            xhr.onload = function(){
                if( xhr.status.toString().indexOf('2') === 0){
                    fulfill(xhr.response);
                }else{
                    reject(Error(xhr.statusText));
                }
            };
            xhr.onerror = function(){
                rejected(Error("Network Error"));
            };
            if (sid) xhr.setRequestHeader('Authorization','Bearer ' + sid);
            xhr.send();
        });
    }
})();