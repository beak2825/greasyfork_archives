// ==UserScript==
// @name        changeEleSID
// @description 更改浏览器cookie的SID
// @author      yies
// @version     0.1
// @include     *://*.ele.me/*
// @run-at      document-idle
// @grant       GM_cookie
// @grant       GM_xmlhttpRequest
// @grant       GM.cookie
// @connect     service-if5ais6a-1253987267.gz.apigw.tencentcs.com
// @namespace   https://greasyfork.org/users/854266
// @downloadURL https://update.greasyfork.org/scripts/437171/changeEleSID.user.js
// @updateURL https://update.greasyfork.org/scripts/437171/changeEleSID.meta.js
// ==/UserScript==


const selectBaseStyle = 'position:absolute;z-index:10;right:12px;top:24px;width:100px;height:30px;border:none;background:#fff;border-radius:4px;';
const loginBtnBaseStyle = 'position:absolute;z-index:10;right:12px;top:24px;color:#fff;text-decoration: underline;cursor:pointer;';

let loginDebugToken = '';


async function getSIDValue(){
    return new Promise((resolve)=>{
        GM_cookie('list', { name: 'SID' }, function(cookies, error) {
            if (error || cookies.length===0) resolve(undefined);
            resolve(cookies[0].value);
        });
    })
}

async function getEleList(password,debugToken){
    return new Promise((resolve)=>{
        const baseUrl = 'https://service-if5ais6a-1253987267.gz.apigw.tencentcs.com/release/';
        GM_xmlhttpRequest({method:'GET',url:`${baseUrl}?password=${password}&debug_token=${debugToken}`,responseType:'json',onload:(res)=>{
            if(res.status===200){
                if(res.response.data.debugToken){
                    loginDebugToken = res.response.data.debugToken;
                }
                resolve(res.response.data.list)
            }else{
                alert(res.responseText)
            }
        }})
    })
}

function changeSID(value){
    GM.cookie.set({ name: 'SID', value: value, secure: true ,httpOnly:true, domain:'.ele.me',path:'/',sameSite:'no_restriction'})
        .then(function() {
        location.href = location.href += (loginDebugToken===''?loginDebugToken:`&debug_token=${loginDebugToken}`);
    }, function(error) {
        alert(error)
    })
}



async function addSelect(SID,Options){
    const container = document.querySelector('body ');
    if(!container)return;
    container.style = 'position:relative';

    const select = document.createElement('select');
    select.style = selectBaseStyle;
    select.autocomplete = 'off';

    Options.forEach((optionItem,optionIndex)=>{
        select.options[optionIndex] = new Option(optionItem.label,optionItem.value,);
        if(optionItem.value===SID){
            select.selectedIndex = optionIndex;
        }
    })


    select.onchange = (e)=>{
        const value = e.target.selectedOptions[0].value;
        if(!value)return;
        changeSID(value)
    }
    container.prepend(select)
}

async function addLoginBtn(loginNext){
    const params = new URLSearchParams(location.search.replace('?',''));
    const debugToken = params.get('debug_token');
    if(debugToken){
        loginNext({debugToken:debugToken});
        return;
    }

    const container = document.querySelector('body ');
    if(!container)return;
    container.style = 'position:relative';
    const a = document.createElement('a');
    a.id = 'change-sid-login-btn';
    a.innerHTML = '获取账号';
    a.style = loginBtnBaseStyle;
    a.onclick = ()=>{
        const password = prompt('请输入密码','');
        if(password === null)return;
        loginNext({password:password});
    }
    container.prepend(a);
}

async function checkLogin(payload){
    const { password = '', debugToken = '' } = payload;
    const SID = await getSIDValue();
    const eleList = await getEleList(password,debugToken);
    if(!SID){
        if(eleList.length===0)return;
        changeSID(eleList[0].value);
        return;
    };

    const loginBtn = document.getElementById('change-sid-login-btn');
    if(loginBtn){
        loginBtn.style = loginBtnBaseStyle+'display:none;';
    }
    addSelect(SID,eleList)
}

(async function() {
    'use strict';

    addLoginBtn(checkLogin);

})();