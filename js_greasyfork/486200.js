// ==UserScript==
// @name                [自律]定时关闭网页
// @namespace           https://github.com/ibxff
// @namespace           ibxff@outlook.com
// @version             0.1
// @author              ibxff
// @description         脚本用于定时关闭单个网页
// @description:en      A script used to automatically close individual web pages at scheduled times.
// @description:ja      単一のウェブページを定期的に閉じるためのスクリプトです。
// @require             https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               unsafeWindow
// @license             GPL-3.0
// @match               *://*/*
// @icon                data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSI2MTA4Ij48cGF0aCBkPSJNMzI3LjY4IDE5Ni42MDhoMzc1LjgwOEw1OTIuODk2IDM3NS44MDhsNjkuNjMyIDQzLjAwOCAxNDguNDgtMjQxLjY2NC0zNC44MTYtNjIuNDY0SDI0Ny44MDhsLTMzLjc5MiA2NC41MTIgMjUzLjk1MiAzNTAuMjA4IDIyNi4zMDQgMjk3Ljk4NEgzMjAuNTEyTDQzMC4wOCA2NDkuMjE2bC02OS42MzItNDMuMDA4LTE0Ny40NTYgMjQwLjY0IDM0LjgxNiA2Mi40NjRoNTI4LjM4NGwzMi43NjgtNjUuNTM2TDUzNC41MjggNDgxLjI4eiIgZmlsbD0iIzQzN0RGRiIgcC1pZD0iNjEwOSI+PC9wYXRoPjxwYXRoIGQ9Ik01MTMuMDI0IDIyOS4zNzZoLTc4Ljg0OGw3OC44NDggOTMuMTg0IDc3LjgyNC05My4xODR6TTUxMy4wMjQgNzk0LjYyNGgtNzguODQ4bDc4Ljg0OC05My4xODQgNzcuODI0IDkzLjE4NHoiIGZpbGw9IiM2M0Y3REUiIHAtaWQ9IjYxMTAiPjwvcGF0aD48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/486200/%5B%E8%87%AA%E5%BE%8B%5D%E5%AE%9A%E6%97%B6%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/486200/%5B%E8%87%AA%E5%BE%8B%5D%E5%AE%9A%E6%97%B6%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

function createCountdownMenu(totalMinutes) {

    var _menuItem = GM_registerMenuCommand("剩余" + totalMinutes + "分钟");
    totalMinutes--;

    const timer = setInterval(function() {
        console.log('time-1min')
      totalMinutes--;
      GM_unregisterMenuCommand(_menuItem)
      _menuItem = GM_registerMenuCommand("剩余" + totalMinutes + "分钟");

    }, 60000); 
}

const isValidTime = (timeString) => !isNaN(parseFloat(timeString)) && parseFloat(timeString) >= 0;

const menuItem = GM_registerMenuCommand("开始计时", function() {
    swal("请输入合法倒计时时间", {
        content: "input",
      })
      .then((totalMinutes) => {
        swal(`确定是该时间吗,确定后将无法更改 : ${totalMinutes}`,
            {
            buttons: {
                cancel: true,
                confirm: true,
            },
            }
          ).then(()=>{
            console.log(totalMinutes)
            if(isValidTime(totalMinutes)){
                    GM_unregisterMenuCommand(menuItem)
                    createCountdownMenu(totalMinutes)
                    totalMinutes=parseFloat(totalMinutes)
                    setTimeout(()=>{
                        window.location.href='about:blank'
                    },totalMinutes*60000)
                    setTimeout(()=>{
                        swal(`时间仅剩1/5 ${totalMinutes/5}min`)
                    },totalMinutes*60000/5*4)

            }
            else{
                swal('时间仅能为正数',"error")
                return
            }
            }
          )
    });

});



