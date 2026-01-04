// ==UserScript==
// @name         B站直播间自动切换最高画质
// @version      0.2
// @description  自动切换直播间的最高画质
// @author       JokingAboutLife
// @license      MIT
// @grant        none
// @match        *://live.bilibili.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAAAXNSR0IArs4c6QAABEhJREFUWAm9Vk1oXFUU/s57Q8bYZLLowlIXbRUFkxS6iFhaUUKhixbclGYlJNNKbSmK4MKFLmbhRnCjpdSKzkzAVfxDsUIEjT80tDTVVmdS3CWC0OIPTNqkyaTvHc+9b+6b+968+Qupd3Pv/e53fu7POecCsUbITfXQruE1g6fUhJluY+KJjAapOM9mNbEnmowyKKQVbywRcT9wdMo1YIStJ+fnBvRisTQdLsrAR67cY6TsXpEcAcT5oSoK1/eGi9aY8NLXaRrZuRoubmwwWb4kJ3DPCGsHczN9aq42rg4u0UlmfAPNNqKx3uxCwzbRHqtt6sagT5LGbU2kRMqzVRotqhets/XbEsAQubI0gJf3LtlkPS6ULpLj7GPPn8Cx4UmFBQrkHWHn8AWZPClIcKEMT9bvaMGAGeIMvimrb+L40HuEfPkLcuk5AS+DnNdCgZaDe1uJ3U81RbltXNdA4ZfHULzxaoN8DDdy4TEbAXLSJXm5b5u56Zvh6pQjjccH0xGgNmmGp+S9/EiEZ1Ccn8aD6bEk4QassrLdYNYtDF4kckbMQquemZfB/uvI7n6nFa+jtcADRc2Xxsl1iuz7s8gO72+QfvdShgYyFYXLeYRy9Vv44y99r+qlQbJCRIESzmT+1cLqvVgt0PRh+SRcvEGgbfISg7zD0NZq3D4bl+R2BQulw8iNVQnF36aJ3IOW0k6HVZ5byIS5kMk7AqT+6Uia/bfE26fY4y/rCqyDaatEEiXtIpWLdGKM8lUcqHcfbzauEmnQqH4LBlFxQA9cjcvr+EjAGxQoQSEnxkMS3qCAPe9z9tefjXvQDN/YISova5WswYO45cR5vchxPR9MXnscvf23EgXi4MralIIkFfwk+YAkjHk/oed33A3rc1wkOlcBwOzj6uJBRwr40+x7r+gYj9KazkR2jhfKvThzaC0Mywg7N5PCjoc+kAA6BOLvULl9IrFORIRiE4lgDPS/D6YDUoEuYPHWC8iNhiXWsJMdyP+aJTeVNyRR4DH8b7F052hbR5ThTN/HBOdAmAFEkag4jvHddZ015ckOqMUzP29HJv2ZCtoaV2vRjqytjuHFETvdAE0NS/5aWT+CU3v+DPVYg8CBs+Vt2MJ58VoZ2yKeqw9Hc+csBV0MpfZC5YBl2cRlLNMxnB66SSiUJ8ih87KQ+MvpwkB3VOZ1CYMTkpDLfxPRViMtL3oUi86s/voZcDN69dfc4e8jx50x6qQyiO3Y59YuWIa4mX3cXj2TNLNSmD9HDj+vltmnj5AdPNWMqvEu+W1zoVSMk/Ie5UtMfcG4pXn54HXHb+uAJLzvxWRVUl9VSsIPrc2rU+qO3/4KsoOj8lg6b13y255A55Y3xnSkiNyNiBbnHpWD3OwkJCpFZ/7KI7Yt9rlCkF8duTgrH4n/9zSkJLKH08FOz117GL2pr8SHPbaH92sspq9jdf1ws/pwv+wm6v0PqUzJKtyXGdkAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/1053875
// @downloadURL https://update.greasyfork.org/scripts/463348/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463348/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var player;

    function wait_element_find(dom_selector, func, timeOutSecond = 10) {
        var is_DomExist = false;
        var interval = 300;
        var timeOutCount = (timeOutSecond * 1000) / interval;
        var int_checkDom = setInterval(() => {
            if (is_DomExist || timeOutCount == 0) {
                clearInterval(int_checkDom);
                return;
            }
            if (document.querySelector(dom_selector)) {
                let target_node = document.querySelector(dom_selector);
                is_DomExist = true;
                func(target_node);
            };
            timeOutCount--;
        }, interval);
    };
    
    // 判断是否启用硬件加速
    function isGPUAcceleratorEnabled() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                // const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                return !/SwiftShader/gi.test(renderer);
            }
        }
        return false;
    }

    document.onreadystatechange = function(){
        if(document.readyState == 'complete'){
            // 页面加载完毕
            wait_element_find('video', function(target) {
                player = window.livePlayer;
                if (player == null || player == undefined) {
                    player = window.$P2PLivePlayer;
                }
                var playerInfo = player.getPlayerInfo();
                if (playerInfo.liveStatus == 1){
                    var playing = playerInfo.playingStatus;
                    var interval = 1000;
                    var myInterVal = setInterval(() => {
                        if (!playing) {
                            playerInfo = player.getPlayerInfo();
                            playing = playerInfo.playingStatus;
                        }else{
                            let qnList = playerInfo.qualityCandidates;
                            let qnIndex = 0;
                            // cpu最高使用原画，原画PRO有点卡
                            // let isGPU = isGPUAcceleratorEnabled();
                            // if (!isGPU) {
                            //     qnIndex = qnList.findIndex((o) => !o.desc.endsWith('原画PRO'));
                            // }
                            let qn = qnList[qnIndex].qn;
                            player.switchQuality(qn);
                            clearInterval(myInterVal);
                            return;
                        }
                    }, interval);
                }
            });

            // 移除直播间旁边的2233娘
            wait_element_find('#my-dear-haruna-vm', function(target){
                target.remove();
            });
        }
    }

})();