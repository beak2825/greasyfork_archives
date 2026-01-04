// ==UserScript==
// @name         将任意网站变成隐患排查（云翰摸鱼专用）
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  将指定网站套一个壳子
// @author       Yesaye
// @match        *://*.weibo.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.google.com/*
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.37
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516558/%E5%B0%86%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%8F%98%E6%88%90%E9%9A%90%E6%82%A3%E6%8E%92%E6%9F%A5%EF%BC%88%E4%BA%91%E7%BF%B0%E6%91%B8%E9%B1%BC%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516558/%E5%B0%86%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%8F%98%E6%88%90%E9%9A%90%E6%82%A3%E6%8E%92%E6%9F%A5%EF%BC%88%E4%BA%91%E7%BF%B0%E6%91%B8%E9%B1%BC%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    changeTitle();

    setInterval(function(){
        console.log('xixi')
        changeTitle();
    },1000);

    function changeTitle() {
        changeFavicon("https://www.baidu.com/favicon.ico123234");

        let host = window.location.host;

        if (host.includes('weibo.com')) {
            document.title = "隐患排查 - sina";
        } else if ((host.includes('zhihu.com'))) {
            document.title = "隐患排查 - zhi";
        } else {
            document.title = "隐患排查 - " + host;
        }
    }

    // 更换图标
    function changeFavicon(link) {
        let $favicon = document.querySelectorAll('link[rel*="icon"]');
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
        if ($favicon && $favicon.length != 0) {
            $favicon.forEach(x => {
                x.href = link;
            })
        } else {
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = link;
            document.head.appendChild($favicon);
        }
    };


    ////////////////////////////////////////////////////////////////



// 等待页面完全加载后执行
window.addEventListener('load', function () {
    // 创建状态栏元素
    var statusBar = document.createElement('div');
    statusBar.style.position = 'fixed';
    statusBar.style.top = '0';
    statusBar.style.left = '0';
    statusBar.style.width = '100%';
    statusBar.style.height = '56px';
    statusBar.style.backgroundColor = '#096dd9';
    statusBar.style.zIndex = '1000000';
    statusBar.style.display = 'flex';
    statusBar.style.alignItems = 'center';
    statusBar.style.justifyContent = 'space-between';
    statusBar.style.padding = '0 20px';
    statusBar.style.color = '#fff';
    statusBar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // 创建logo元素
    var logo = document.createElement('div');
    logo.innerText = '安全生产管理系统'; // 使用文字作为logo
    logo.style.fontSize = '16px';
    logo.style.fontWeight = '600';
    logo.style.color = '#fff';
    logo.style.marginRight = '20px';

    // 创建无序列表容器
    var ulContainer = document.createElement('ul');
    ulContainer.style.display = 'flex';
    ulContainer.style.gap = '10px';
    ulContainer.style.listStyle = 'none';
    ulContainer.style.margin = '0';
    ulContainer.style.padding = '0';
    ulContainer.style.height = '100%'; // 确保ul容器高度与状态栏一致

    // 创建列表项
    function createListItem(text, iconBase64, onClick) {
        var li = document.createElement('li');
        li.style.padding = '0 16px'; // 只设置左右内边距
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.height = '100%'; // 确保li高度与状态栏一致
        li.style.borderRadius = '0px';
        li.style.backgroundColor = '#096dd9';
        li.style.color = '#fff';
        li.style.cursor = 'pointer';
        li.style.fontSize = '14px';
        li.addEventListener('click', onClick);
        li.addEventListener('mouseover', function () {
            li.style.backgroundColor = '#0960d2';
        });
        li.addEventListener('mouseout', function () {
            li.style.backgroundColor = '#096dd9';
        });

        // 创建图标元素
        var icon = document.createElement('img');
        icon.src = iconBase64; // 使用传入的base64图标
        icon.style.width = '18px';
        icon.style.height = '18px';
        icon.style.marginRight = '8px';
        icon.style.filter = 'invert(1)';
        icon.style.userSelect = 'none'; // 禁止文本选择
        icon.style.webkitUserSelect = 'none'; // 对于 Safari
        icon.style.mozUserSelect = 'none'; // 对于 Firefox
        icon.style.msUserSelect = 'none'; // 对于 IE 和 Edge

        // 创建文本元素
        var textNode = document.createElement('span');
        textNode.innerText = text;

        // 将图标和文本添加到li
        li.appendChild(icon);
        li.appendChild(textNode);

        return li;
    }

    var lis = [
        { text: '系统管理', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEAklEQVR4nO2Ya4hNURTHf4S8pbwmkzfNYDDer7xCQlKK+KA8UvOBEabUUPjmleKbqMlnkq9KeUdIKcZ4DsZzMEzj/bjatW6tlnPPOffcc0Tuv3Zz56y91l5r77XXY0MeeeSRx9+M5sB+4B1QBXTNUd54YBdwDXgOfAFqgTPAZqA3MSt/GEip8RpYHkFWCXDSyPIaP4H1cRlwwGchp0y/kHKWAR9CKJ+ScTkuAz4qoaeBh2Yhp1QF0MJHxlLZ1TTPV+AQMAvoIS55S9F/AEviMuCIEuyU7wbsBb4bQy4AnTz4S4HPat4NYJCidwauGuVXEiPc7tSrBZzyDqOB68aInYa3GXBO0d38Dlkqvxg4D6zOxYjlapHvojziNpWKdtvwTVe0T0BfRWsrfu6n/Er57ujf5PQj46TZybTPz1Xfbxqeg4q2z9B2ZKF8SkZZLgb0M1GkUpT/6KPkbUUba2j3FW1tCOXdOE6O2BQQ+qokbyAn9EXtcEsjK01zo72P8jrqucSXE1pItPEz4rAyYo98cxkcnxOolAu93ijvLvgQ9f8TYkAniTbVQI24TVUII/QuO2wP2IirYtRQ9c2tmQi8yg1txG5goOFpA1z0ycKdZd4K9f1EUgaEMcIrU7eRk7gnd8L93Sbf0zil5G1M0oAwRmSLOab8KOQPIC4jioG3RkaiKJXk5GfEPOCohMZnUmaUA62NrPnSJ6R5XwBdklR+hPQIKYk6mYzINKqBAcLXE2hQNJcoJyap/HClfEp+F0Ywok5FqrGSO1wROTlJ5UtMpfpGXMm6g76IW4ACcYl1pjx5AvQXvlKZlxhcgnmlFncXbqTHvGNqjlPeYirQpOY8MlVrInDp/aVatEGV2Ba6lnHdlxemm5Oojbux1xgsUUErP8Zn/jM11y+SzDSV7QOgV9zKFxvl3UUbF8CjOzLn836YLY1Pev69OJNXkYnN7+V9JwjliqcpRFSZY3roOxJac8JA4wqNwIQQ4RVJUtWGNyiuzzP9Qk0uEamd6aycApMCeGaJP7uG3GsD3odwvQXGiEseTVEoVCghH0K4gL6Mjeokijzuj9/ld1gouSPNs4YIuJbFJZzhEQ77mAj20uSOUQEyt6n5Z6MYoJNMd595NpZnSkg2AXplb42exuCs0agEZIoG04yhjwPeTId51E/DfR7W9N3JGrrt2+pBn2KU1/VMUAX7RvG9ktrKYl2uD75lHsVYobhTuXGbOlUWh8FI07TUA4uk/XQRZ5XZnA1RDGgFXAlRDj/1aNzDwEUiXf+no50OoSkJ5bpXzgoFAUbohiQKRssGZJJ/N+Lm/HYSZfJS3Ci7dFmONfLOKHSRbq7O1ELu1aIj/xjayet1Hnnk8b/gF4FJF96C9MQYAAAAAElFTkSuQmCC' },
        // { text: '分析展示', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChUlEQVR4nO2YPWtUQRSGH3cjMayxWxCxCX5EC0tTBLQSjTZBBE0XRfwbFoJEGxHJD1CxkxT+gJgFQezURFTwa6MGLARR/AhajBx4F4YQ4713Zq6XeF+YJpNzZp97zpwzM7C67gKuIuMeAXIVG4UV7CCSXA0i1RGJLFenllSnVmS5OrVyfIkyGp4rIyLrBqQMuRpEqiMSWa7e7FJdtf6XqrUBOABcADpAF/gGLAMfdMWeAkarCtIATgMLOZrkk6qB7NIDQs/nInANOAIMAy1gANgGjAEXgTcroHakBMl7DHkLnAGaGVPwJPBStp+AQ1UAmdGXz6sWcF0+fhSBCU2tIeCzfFzRFw7RlBeZnWWBNL09MaONHkM35fN+Hp8hIBPeniiSTn9SS+XafE+SGMRS6LFsbWObjke8o0xo7mnWqIRu9kWl2EbgXUSQpleaR8sAsT5hGi8I4dZY97LmL8UCWU2zsrPGlkpjWsOOM8lAlmS3m3TarjVsrWQgy7LbTDpt8hpkMpBfsusnnbZojS9lbHY7AKbSsNZ4UQaInWxNtxNUrWOan4sFkqU0TiYAmdb8+ZQgB2X3Ws2r36tkMUD6vAY7khLEjg3PZXuK+Don3w+znqiLgpjOyrYbuQwPetE9kdUoBMRS6oHsbxFHDeCOfHbKOsab9qrOOxWAEDWAq/L1UZ2dskBMh4Gf8nOj4N1k0IuEjWdAO48Dl2C8UgHIkhZ92thLXiR6RWQ+D4z/fBN7dPXkc1RpMqCisEd/m15xh5nT/7UFkRsmphp63vEf3f42Hqk6+RGsBExP+xURu0+8B74DX3V26qhjj6zRJyoFE6q2B2MFYCvrBGb2X/+YUBmMQez7DZDVYJG8PRqNAAAAAElFTkSuQmCC' },
        // { text: '事件处置', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABwUlEQVR4nO2ZPS8EURSGH4StSDZRyEaBTuEX8AM2ISiJSqHaTq3iJ2hEraJWaBUkWrK9Ed+hQUKCI5Oc2WxmZz/M3rvuXfMkp5i5d86bd87ceyYz0DpF4AoQjUDPmcJ2/gpBlUi1mC/5K0TJ6x27nt8/IwvAdUJ54xEXMh0RzebdAvMkcGNYyLYR0RtfQ7NSuvZoSb3xf2MkcGz7lbRGijExGw0x+EX+1EZcQzIjvlVEPIsaus6IL0hmxDEkq4hjiGsVmQByvhvJAWWN0JC3RjZVs5yiKuKKkSngA/gCZlJcLy4Y6QVOVG87ZQ5xwci6al0Cg74aGQNeVCvxK4gvRo5UZ6/NPGLDSAHItzBvVTUegWEcM5IHzoELYLTBvBHgSTVWaB8xbaSgJqLFO1ln3r7OOcQMYuPRCqtyrNc/A9Ox8TkdewXGMYPYWuxhZz7QHG/ArJ4fqvrvUcIcYnPX6gN2NM8nsAbs6vGpNkJTiO3ttwfY0lzfGu8N1o7zfaSk71Fhzg3MI51siIvAGTCAeaTTnb0fO8hfv6KYQjIjjiFZRRxDsoo4hnR9RR4M/a/oZNwnGVnWAfEk7oAl63XPIB0/NQgcKGYhPIMAAAAASUVORK5CYII=' },
        { text: '设备管理', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZElEQVR4nO2YvU0DQRCFHwGCDKowHRAT8CNZUIArwFSAaAAqgMAFYJkGILMEITlEQHLOICHjJGbRSiNkr++851vp/AzzSS+Z2b1943eyrQUMw5iXIwAZAEeqDMBhlUFGBGZdRN5jlG8VK6KKYoM0hFgiZIglQoZYImSIJUKGWCJkiCVChlgiZIglQoZYImSIJUKGWCLLmsgLwU2ii8h7nMkqgA8Coy6id/VayoEu7AX1rtb7aI6+nnkc1Hta35u1+UoXtUse6gdqiq6eeR3U21q/LNu4olf2nwDWiW7oR4GXNfWYqecptnXjTUHvYYGD3Bf4GWjPe57iQpsd8NNRr+dFzWcAOYDNxEN2KnzKfk0KGwC+ADyFjZYecIt0hhUG8WtSudNnbY0XzxbwrZTKiXo+HS8+EvzI1ZX3/ktOYKiu8nCQicKSkP/ZQV4JXpG6mvgnvA/gjcCUm1M+gN3G3wPjP/EDcrREFnaplEkAAAAASUVORK5CYII=' },
        { text: '教育培训', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEElEQVR4nO2aTWxVRRTHf62VPlIivge1usBYFkYD0ULcuJWoVFIp7lB0YVDcFLSQ6EZo2FnZiGnC0rhwyaKIiEYE/Ij4ARoTsJSyQYhBLHFh+eaZE/+TnFzuu+/e19t3G8M/meTeO2fOnJk558yZMxdu4/+LCtAPvAvsBX4DJoErKvZ8QnVGsxooM0tQAl4EPgNuANWM5TqwH1gHtBcxgLnAZuCcE+oycAB4WyvzsGb8TpWyvlndVuBLtQntzwKDmpymYBUw4QT4AVgPzG+A193AK8CPjt8poJcZhM3ULtfhT8BTOfJfCRxz/EdmYnXuleDWwT/AAHBH3p3wH89NwJRb7a68mHdruavyOkuZeTwCjKnPcckwLXQ6ht8DC2keysDX6ntCWtEQSk6dvgU6aD46gO+cmjVkM7ucOtlmVxQWOK0wB5DZxQbDboZNpLGZKclk3i31Zhf2CfNOswWvO+NPpWJb3D4xHRc7TxNxUmVA3xpFG/CzZLNBJaJdoYIRP9lgh+ZdhoC/YmKrv4H3gPsb5P2M+JyrtyrrnIfIiseAj4CrTvDDwBqVw+77VdFamyxocZ70+STCz0VksVMatAJ9rl1VUfAe4PEY+mXAh5HBWpz1klQnDTao3b5aBBWF1ZdTBIBB/8OOb+Ui8A6wKIUwi0R7MRIsDqSwo7LON9dqyblGDL/IqP/m4d5UJJsVJvSr2quy2NEh0Zo23IIdqrTzRBb9N/WaLloz2tGQaIbjmO1V5bMN6n9eWJbCjoL2jMYxOKlKO8XhArag/8Mx+m/vazVDHwAHtWGd1hl90vEI76fV10G1GRKPON5RO/pKdUv0bnmBW3BBlRbbGL5xDLbK9QU8pGPtzQbO6bWK8Tog3gEtUvVAYzKhKNze/4wbyBVVznGhyogT1pIE96lu3J3TLfGwHXgZeAJ4UOeHciRLEt67RbNCbbaLRzi/22oFx/KpG+SIZAobd+i/7kAC+tyMnI+830V+MF6Bb5/68n16JA4kqloeURUIz3mjGunDa4FHompFjT2ug8FICmeu1MkCzffl0X7V3nJexn1TZVLfJkSzR222iIfxCnytjzcidumRaOwfq3J1wkAMj7r3Szkau+dlfSQh0f3ucB4qaSBE9hVL4exU9sMmoQdYrPN+WbPaoudO1fWIdpPaHotkKushcUPsV6VlAKOIdnC8xkCMx3IJ2yXhW1XK+rZYNP01BnK87jDqhChlFzT6uGmFG4g9I2F2O0+XRzFeu8U7CRUXNNb0mvvF1NKYAT7CtWcPY/S08sA7pbO/yKD/kIHfUJnUtwnRjKrNZvFI68pfkyyfJBG94GKbqDfzm1VRaAGOShYLa2qi5I66NkuGt9xA7LlIrJIcZ9JcQwyK+KiSDx1qeKagJF1Am1TSZNtICpScXZhXQR7GSpEYlExjWS6FetVoSsmxotHjNszMVxkjbgbi4q9modNF2+blMqOktFBVieQi7GMecEQyHJnOPWOnArNwrWDvzULFHe5O5XHh0+2WdixFQJeXTYy7veuBvBh3OTWbUu41bUItC9rknS45dbon705KzgFUlVDuzXHHts0u7BPBsGf07n2lW/aqcrEbGvyLoaLYKYQdValSnrfFdVfH1Ov3SPRq4fU2HXyWyG3PUVmgS6PnRHMoEj1b5LCxqD8g2pUV36cjQNbQ/ZoSg2uLGkAc5uugM6zz+AklNMJPNRd0aBoVTV/OWZjbYDbhXxK1LJe5B/MJAAAAAElFTkSuQmCC' },
        { text: '双重预防', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEElEQVR4nO2aTWxVRRTHf62VPlIivge1usBYFkYD0ULcuJWoVFIp7lB0YVDcFLSQ6EZo2FnZiGnC0rhwyaKIiEYE/Ij4ARoTsJSyQYhBLHFh+eaZE/+TnFzuu+/e19t3G8M/meTeO2fOnJk558yZMxdu4/+LCtAPvAvsBX4DJoErKvZ8QnVGsxooM0tQAl4EPgNuANWM5TqwH1gHtBcxgLnAZuCcE+oycAB4WyvzsGb8TpWyvlndVuBLtQntzwKDmpymYBUw4QT4AVgPzG+A193AK8CPjt8poJcZhM3ULtfhT8BTOfJfCRxz/EdmYnXuleDWwT/AAHBH3p3wH89NwJRb7a68mHdruavyOkuZeTwCjKnPcckwLXQ6ht8DC2keysDX6ntCWtEQSk6dvgU6aD46gO+cmjVkM7ucOtlmVxQWOK0wB5DZxQbDboZNpLGZKclk3i31Zhf2CfNOswWvO+NPpWJb3D4xHRc7TxNxUmVA3xpFG/CzZLNBJaJdoYIRP9lgh+ZdhoC/YmKrv4H3gPsb5P2M+JyrtyrrnIfIiseAj4CrTvDDwBqVw+77VdFamyxocZ70+STCz0VksVMatAJ9rl1VUfAe4PEY+mXAh5HBWpz1klQnDTao3b5aBBWF1ZdTBIBB/8OOb+Ui8A6wKIUwi0R7MRIsDqSwo7LON9dqyblGDL/IqP/m4d5UJJsVJvSr2quy2NEh0Zo23IIdqrTzRBb9N/WaLloz2tGQaIbjmO1V5bMN6n9eWJbCjoL2jMYxOKlKO8XhArag/8Mx+m/vazVDHwAHtWGd1hl90vEI76fV10G1GRKPON5RO/pKdUv0bnmBW3BBlRbbGL5xDLbK9QU8pGPtzQbO6bWK8Tog3gEtUvVAYzKhKNze/4wbyBVVznGhyogT1pIE96lu3J3TLfGwHXgZeAJ4UOeHciRLEt67RbNCbbaLRzi/22oFx/KpG+SIZAobd+i/7kAC+tyMnI+830V+MF6Bb5/68n16JA4kqloeURUIz3mjGunDa4FHompFjT2ug8FICmeu1MkCzffl0X7V3nJexn1TZVLfJkSzR222iIfxCnytjzcidumRaOwfq3J1wkAMj7r3Szkau+dlfSQh0f3ucB4qaSBE9hVL4exU9sMmoQdYrPN+WbPaoudO1fWIdpPaHotkKushcUPsV6VlAKOIdnC8xkCMx3IJ2yXhW1XK+rZYNP01BnK87jDqhChlFzT6uGmFG4g9I2F2O0+XRzFeu8U7CRUXNNb0mvvF1NKYAT7CtWcPY/S08sA7pbO/yKD/kIHfUJnUtwnRjKrNZvFI68pfkyyfJBG94GKbqDfzm1VRaAGOShYLa2qi5I66NkuGt9xA7LlIrJIcZ9JcQwyK+KiSDx1qeKagJF1Am1TSZNtICpScXZhXQR7GSpEYlExjWS6FetVoSsmxotHjNszMVxkjbgbi4q9modNF2+blMqOktFBVieQi7GMecEQyHJnOPWOnArNwrWDvzULFHe5O5XHh0+2WdixFQJeXTYy7veuBvBh3OTWbUu41bUItC9rknS45dbon705KzgFUlVDuzXHHts0u7BPBsGf07n2lW/aqcrEbGvyLoaLYKYQdValSnrfFdVfH1Ov3SPRq4fU2HXyWyG3PUVmgS6PnRHMoEj1b5LCxqD8g2pUV36cjQNbQ/ZoSg2uLGkAc5uugM6zz+AklNMJPNRd0aBoVTV/OWZjbYDbhXxK1LJe5B/MJAAAAAElFTkSuQmCC' },
        { text: '积分管理', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABIUlEQVR4nO2XTUoDQRCFPxjBjQsPIOQUbnIJc4J4DLdewaX7XCSZhBDXLgSPIK7FhSkJdEMI+ZnQ1bE7vg+KYXr6TdejiulpEEKII5kCr8DdibXu2FrMgf6JtO7ERD7CdQmMgF5mrTsxmSvgEfgK99/AE3CdSetOTCZyAzwDP2H8E3gALp217mwmE7kFxmvPp85ad3YlExnsmZOidWfbQm2IfXNSte5sW2hz7Bgj1lHrjoygiuRBrYVaKw9qLdRaeVBrodZK4yL8ldofR5vog2EBJgyYpJhogLfwopWharkPJt5Di1VJo2oURKNqFERzLtUY1vqlmhWw2VmHeDlkxCqJRVcj1WMyUhimihSGnVtFrPBoDxkp4RhruU+IQvw3fgHLDfUq4NynUAAAAABJRU5ErkJggg==' },
        { text: '目标管理', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC+UlEQVR4nO2ZzU4UQRSFv4WjuAE36ggrI2EjwQkwykJdwGto9EVIZGeUBHUGDTyAupEoEMJDGE0gojj6AERFENnAQJtKTieVMYzV0381hpN0wtC3u+7tur+nIH0EutoewbEhnqHtduQkMAZMAPPAGvDDMsT8/QF4I5lRoIBHGAJmgW1LaddrC5gBBvM0YBBYalDsE/AIuC0DL1j3uvU/c+8xsN7w7CJQytKA08AUUJcCO1Lscgsx0g88AX5LZh+YBDpIGX3Aihat6+ufTSDYz8mgumTfA72khGvAdy20LjdJOmuVgZrkv+l34kbsaIEFoJP00GXF3q8kjemzduI5cIL0UQBeWDtzKYnAXrF2IgsjbGOWrJiJlQCmrJhI052auVlNOjyIUyfqulwDOw1clQ4mNQ+08oJwW02KzRtV6WJan0gYsordv+pEFjivonkYtfrPyhBTsX1BRTo9jdLFhg3gUW1HHrginTZds+eYHviIf/gs3W64CE946FaN7jWOAxYkfAv/cEe6zbkIr0k4z9pxFIal2yoO+CnhIv6hW7qZ3u8vuI6leSFw1e+/MaQRIfNh5m3f0GO19m0d7OUowT4vYcN2+Ia70u2Vi/A9CRsywDdUoxTEUYuj8g016XbddcTc0gOGd/IFJYt6dR65Zzx0r6p0mo465gYaZgx5ljeKwK4GK9POR8KiR7vyTLq8btUn9zX4J874RcAIcADsxYnZSX2JmqiZrHEG+Cod7sd5UYfIsUCsSpYHMwVgWWu/BU7FfWGveptANGYWxhSAl1pzA7iY1IvLIpTDnelK2Z2WtdZ2Gj1f2dqZmhhAF0QZA0asmNhIs3E1rPg766CnKvIsriFFpdgDKyYSc6dmCeChUnNYNCtNeNlmhpT0MXYls6fsFDuwo2DAavkDy+UqYjuGrRk7PAwt656R+WLdO9SxdT85oiQaczPCWBpYDeB0K21HmjAd6U3NCnOa4sLkEI6nqxqKxsUWZnlwFBt5kxeJ4dgQ35DJjvwBYeI7iFlqr8sAAAAASUVORK5CYII=' },
        { text: '主题管理', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABOklEQVR4nO2YIU4EQRBFHwGBArkJVyB7A+SKMUjsOrgCBoHEIhFruMI6kHAEuECTIDEkGLIUpkhW9A4tCPNrUi8pNS3+7z9V6W4YGR3wAphwFdfZSxEQ2mqml5+FyliLxjTyj1gmIoaNLRHzeuhbpIxVauMiZWxNYxpRwDKRiImUYIdG22SkC2CmrB3jI0zZJtLI0OwBM+ACWEZJZBuYAqfAAngCVpWeuUOMfd/tS9/tt4roT+AZuAHmwCGwNaToHRdxBty6uK+K8Fc3dQ4cAbsMzAFwDFwBj8BHRfS7f7sGToAJYtxXRK/8n194D0y9J6Qxr6VPm5lPn3BYhBHZQhpRfz9uertVoPzF222EngjTM5ZGxLBMRAzLRMSwTEQMy0TEsExEDMtExLCxJFLGcrHqfjET5qrLkHwDNVqLc0fUAqQAAAAASUVORK5CYII='}
    ];

    // 将列表项添加到无序列表容器
    lis.forEach(function (item) {
        ulContainer.appendChild(createListItem(item.text, item.icon, function () {
            if (item.text === '主题管理') {
                menu_setting('checkbox', menu_ALL[0][1], menu_ALL[0][2], []);
            } else {
                window.location = 'http://172.18.0.111:1004';
            }
        }));
    });


    // 创建头像和名称容器
    var profileContainer = document.createElement('div');
    profileContainer.style.display = 'flex';
    profileContainer.style.alignItems = 'center';
    profileContainer.style.marginLeft = 'auto'; // 将容器放在右边
    profileContainer.style.padding = '0 46px';
    profileContainer.style.cursor = 'pointer';
    profileContainer.addEventListener('click', function() {window.location = 'http://172.18.0.111:1004';});

    // 创建铃铛盒
    var bellbox = document.createElement('div');
    bellbox.style.width = '32px';
    bellbox.style.height = '32px';
    bellbox.style.marginRight = '26px';
    bellbox.style.cursor = 'pointer';
    bellbox.style.position = 'relative';
    bellbox.addEventListener('click', function() {window.location = 'http://172.18.0.111:1004';});

    // 创建铃铛
    var bell = document.createElement('img');
    bell.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACnElEQVR4nO2ZW4hNURjHf4w5mBQZvImUeEIhEUpSo8Y1FKEUYZgnIkJyaZA8CIXkknhBDQ+UDskl4l08HLd5wcjlBeNytOqb+lrtvefM2Wtf0vrVejhnn/X/vrX3+q9vr3XA4/F4PJ50WQBcAs4AjeSYfpLgFuAAsFcSL1ttPzljFHAB+BGQbFD7DQwjJ2wAvleQ9CmgqD6vJQdst5L8AzwCDgNbgd3AZWAPUAMcVb81T2tjlsnPt5J/AIzpos9cmT66304yoA54o5K4AfSpsO9Y4Knq+xdYQspsUgm8B+q72b+3DLpT42MVGlVTC7xVwVfHeIrPlc4uUmK5CtoGFGJozVFaJVKgF/BCBd0cU68G+KD0hpIwa1SwL0B/B5r3leYUEqSvNfd3ONK9ozRnkiCHrPla6bLZFSWlO5qEaLAK0EJHukOkDhjNn7LCOWc28FUlf9Oh9jKle9ehLj2BJqtilqX6DnYY56zSNu9OTihYVbKzGQOPxC1tSn+cK9HzVuId8q5v5qtLhqsY36QmxGaSMpVpR4ABJEOjimOWUudz0rTXwL6ElrdtKk6LK9H1ETuqJ0CzQxNfVNorcMhE4BjQHjIQ44nrwOKYxayoNGeQAGY1mgdcidisfwZOA9OBHt3Uf6h0ppIw5qVtJXDbMrlu7+QoxZxQVEKr6pvqjmyEbD5eRvjlsWzYB0XotKjfXyUjJgPHI45VOuROLwrwy3jrac4iQ9qtpMP8Ys6Gpim/nFPXT+ZlABOAdWLSML+U5KyoSX13L8sB3FKJtIrpa2WFCvNJOcA3mdFgJfMrwBdmupwAPoUMwFzPlIMRd7eoTFyQ4/ZrVn1xWo2rxVTnZ2ruv5L3/LCd1kBgFbC0ikKYKHXyX4HH4/H8h/wDWNc07byWyVUAAAAASUVORK5CYII=';
    bell.style.width = '28px';
    bell.style.height = '28px';
    bell.style.borderRadius = '50%';
    bell.style.filter = 'invert(1)';

    // 创建角标元素
    var badge = document.createElement('div');
    badge.innerText = '28';
    badge.style.position = 'absolute';
    badge.style.top = '-4px';
    badge.style.right = '-18px';
    badge.style.width = '32px';
    badge.style.height = '20px';
    badge.style.backgroundColor = '#ff4a4c';
    badge.style.color = 'white';
    badge.style.borderRadius = '10px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontSize = '12px';
    badge.style.border = '0.5px solid #ffffff';

    bellbox.appendChild(bell);
    bellbox.appendChild(badge);

    // 创建头像
    var avatar = document.createElement('img');
    avatar.src = 'data:image/webp;base64,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'; // 替换为实际头像路径
    avatar.style.width = '32px';
    avatar.style.height = '32px';
    avatar.style.borderRadius = '50%';
    avatar.style.marginRight = '8px'; // 头像和名称之间的间距

    // 创建名称
    var name = document.createElement('span');
    name.innerText = 'admin1'; // 替换为实际用户名
    name.style.fontSize = '14px';

    // 将头像和名称添加到容器
    profileContainer.appendChild(bellbox);
    profileContainer.appendChild(avatar);
    profileContainer.appendChild(name);

    // 创建左侧容器，包含logo和按钮
    var leftContainer = document.createElement('div');
    leftContainer.style.display = 'flex';
    leftContainer.style.alignItems = 'center';
    leftContainer.style.height = '100%';

    // 将logo和无序列表容器添加到左侧容器
    leftContainer.appendChild(logo);
    leftContainer.appendChild(ulContainer);

    // 将左侧容器和状态栏文本添加到状态栏
    statusBar.appendChild(leftContainer);
    statusBar.appendChild(profileContainer);

    // 将状态栏添加到页面顶部
    document.body.appendChild(statusBar);

    // 为了不遮挡页面内容，给body添加一个上边距
    document.body.style.marginTop = '56px';








// 创建菜单列元素
var menuColumn = document.createElement('div');
menuColumn.style.position = 'fixed';
menuColumn.style.top = '56px'; // 确保不遮挡状态栏
menuColumn.style.left = '0';
menuColumn.style.width = '240px';
menuColumn.style.height = '100%';
menuColumn.style.backgroundColor = '#fff';
menuColumn.style.zIndex = '10000000';
menuColumn.style.padding = '10px';
menuColumn.style.boxShadow = '1px 0 1px rgba(0,0,0,0.08)';
menuColumn.style.transition = 'transform 0.3s ease';
menuColumn.style.transform = 'translateX(0)'; // 初始不隐藏

    // 为了不遮挡页面内容，给body添加一个左边距
    document.body.style.marginLeft ='260px';
    document.body.style.transition = 'margin 0.3s ease';

// 创建菜单项
function createMenuItem(text) {
    var menuItem = document.createElement('div');
    menuItem.style.display = 'flex';
    menuItem.style.justifyContent = 'space-between';
    menuItem.style.alignItems = 'center';
    menuItem.style.fontSize = '14px'; // 增加字体大小
    menuItem.style.padding = '12px'; // 增加高度
    menuItem.style.cursor = 'pointer';
    menuItem.style.transition = 'background-color 0.3s ease'; // 渐进渐出效果
    menuItem.addEventListener('mouseover', function () {
        menuItem.style.backgroundColor = '#ececec';
    });
    menuItem.addEventListener('mouseout', function () {
        menuItem.style.backgroundColor = '#fff';
    });
    menuItem.addEventListener('click', function(){
        // menu_setting('checkbox', menu_ALL[0][1], menu_ALL[0][2], [])
        window.location = 'http://172.18.0.111:1004';
    });

    var menuText = document.createElement('span');
    menuText.innerText = text;
    menuText.style.color = '#333';

    var menuIcon = document.createElement('img');
    menuIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAeklEQVR4nO3VwQnCQBCG0UeEBLQDzUHEk4pHwQ7FICpYsAgeUoD/HCRfAw92Z2eZ+rcanJLADFccksCAXQpoccc2CTywSQEdnlingDleWKWAxRdYCnbBPgmUHNX40m/ohWvT41v2EMtWStlyHEOf8T4q+E/OaWTKz3sDPmULN6EwCmQAAAAASUVORK5CYII=';
    menuIcon.style.width = '12px';
    menuIcon.style.height = '12px';
    menuIcon.style.transform = 'rotate(180deg)';

    menuItem.appendChild(menuText);
    menuItem.appendChild(menuIcon);

    return menuItem;
}

// 添加菜单项到菜单列
var menuItems = ['隐患排查', '个人隐患', '检查标准', '标准管理', '系统分析'];
menuItems.forEach(function (item) {
    menuColumn.appendChild(createMenuItem(item));
});

// 将菜单列添加到页面
document.body.appendChild(menuColumn);

// 创建一个按钮来控制菜单列的显示和隐藏
var toggleButton = document.createElement('button');
toggleButton.style.position = 'fixed';
toggleButton.style.top = '90px';
toggleButton.style.left = '251px';
toggleButton.style.zIndex = '100000000000';
toggleButton.style.width = '22px'; // 修改宽度
toggleButton.style.height = '22px'; // 修改高度
toggleButton.style.border = 'none';
toggleButton.style.userSelect = 'none'; // 禁止文本选择
toggleButton.style.webkitUserSelect = 'none'; // 对于 Safari
toggleButton.style.mozUserSelect = 'none'; // 对于 Firefox
toggleButton.style.msUserSelect = 'none'; // 对于 IE 和 Edge
toggleButton.style.borderRadius = '50%'; // 圆形按钮
toggleButton.style.backgroundColor = '#fff'; // 背景白色
toggleButton.style.boxShadow = '1px 0 2px rgba(0,0,0,0.2)';
toggleButton.style.cursor = 'pointer';
toggleButton.style.transition = 'all 0.3s ease'; // 跟随菜单移动并旋转
toggleButton.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAeklEQVR4nO3VwQnCQBCG0UeEBLQDzUHEk4pHwQ7FICpYsAgeUoD/HCRfAw92Z2eZ+rcanJLADFccksCAXQpoccc2CTywSQEdnlingDleWKWAxRdYCnbBPgmUHNX40m/ohWvT41v2EMtWStlyHEOf8T4q+E/OaWTKz3sDPmULN6EwCmQAAAAASUVORK5CYII=)';
toggleButton.style.backgroundSize = 'cover';
toggleButton.addEventListener('click', function () {
    if (menuColumn.style.transform === 'translateX(0px)') {
        menuColumn.style.transform = 'translateX(-240px)';
        toggleButton.style.left = '10px';
        toggleButton.style.transform = 'rotate(180deg)';
        document.body.style.marginLeft = '20px';
    } else {
        menuColumn.style.transform = 'translateX(0px)';
        toggleButton.style.left = '251px';
        toggleButton.style.transform = 'rotate(0deg)';
        document.body.style.marginLeft = '260px';
    }
});

    // 将按钮添加到页面
    document.body.appendChild(toggleButton);

    const elements11 = document.querySelectorAll('.cc-cd-lb');
    // 遍历每个元素
    elements11.forEach(el => {
        // 获取元素中的第一个span
        const firstSpan = el.querySelector('span');

        // 如果存在span，修改其文本内容为第一个字
        if (firstSpan && firstSpan.textContent) {
            firstSpan.textContent = firstSpan.textContent.charAt(0);
        }
    });

});



})();