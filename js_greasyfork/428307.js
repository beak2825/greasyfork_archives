// ==UserScript==
// @name        小扩展
// @namespace   Violentmonkey Scripts
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/6/22 下午1:56:48
// @downloadURL https://update.greasyfork.org/scripts/428307/%E5%B0%8F%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/428307/%E5%B0%8F%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

var getcodeno = setInterval(forID, "300")

function forID(){
    if (btnEasyHelper!=null) {
        clearInterval(getcodeno)
        Anni()
    }
}

function Anni(){
    var button = btnEasyHelper.cloneNode(true)
    button.setAttribute("title","下载全部"); 
    button.setAttribute("id","aotudw"); 
    button.children[0].children[1].innerHTML='全部下载'
    btnEasyHelper.parentNode.appendChild(button);
    button.addEventListener("click",function(){
        aotudw();
    },false);
    var anniu = document.getElementsByClassName('file-name')
    var min = 5//5分钟
    var key = true
    async function aotudw(){
        for (let index = 0; index < anniu.length-1; index++) {
            if (document.getElementsByClassName('file-name')[index].parentNode.children[1].getAttribute("class") != "whrhn6D0 dir-small") {
                key = false
                anniu[index].click()
                await sleep(200);
                btnEasyHelper.click()
                await sleep(1000);
                var cycle = true
                for (; cycle; ) {
                    if (dialogOpTips!=null) {
                        cycle = false
                    }
                    await sleep(1000);
                }
                console.log(dialogOpTips.textContent);
                if (dialogOpTips.textContent.indexOf('获取直链成功，请在下方选择下载方式')!=-1) {
                    console.log('投递信息成功');
                    var DwUrl = dialogBtnIdm.getAttribute('data-clipboard-text')
                    window.location.href='IDMAPI://'+DwUrl;
                }
                else{
                    alert('投递信息失败')
                    key = true
                }
                await sleep(1000);
                document.getElementsByClassName('swal-button swal-button--confirm')[0].click()
                if (key=false) {
                    await sleep(min*60*1000);
                }else{
                    await sleep(1000);
                }
            }else{
                console.log(index+1+'号文件为文件夹');
            }
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}