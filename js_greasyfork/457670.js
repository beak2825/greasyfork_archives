// ==UserScript==
// @name         湖工校务网登录
// @namespace    none
// @version      0.3
// @description  脚本登录学校教务站点
// @author       yhr
// @match        http://jwglxt.hbeutc.cn:20000/*
// @icon         none
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant GM_listValues
// @grant GM_unregisterMenuCommand
// @grant GM_deleteValue
// @grant unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457670/%E6%B9%96%E5%B7%A5%E6%A0%A1%E5%8A%A1%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/457670/%E6%B9%96%E5%B7%A5%E6%A0%A1%E5%8A%A1%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';    

    var user = {}
    const url = window.location.pathname
    if(url == '/jwglxt/xtgl/login_slogin.html'){
        init()
        login()
        return ;
    }
    function init(){
        GM_registerMenuCommand("添加账号", addUP, "a");
        GM_registerMenuCommand("修改账号", editUP, "e");

        const userList = GM_listValues()
        if(userList.length < 2){addUP(); return ; }

        let hasUser = false
        user.name = GM_getValue('loginUser',null)

        if(user.name != null)
            if(GM_getValue(user.name,null) != null){
                GM_registerMenuCommand('当前登录用户:'+ user.name, ()=>{},null);
                hasUser=true
            }
        for(let i = 0; i < userList.length; i++){
            let name = userList[i]
            if(name == 'loginUser' || name == user.name)continue;
            if(GM_getValue(name,null) != null){
                GM_registerMenuCommand(name, ()=>{setLoginUser(name)}, null)
                hasUser = true
            }
        }

        if(!hasUser) addUP()
    }
    function addUP(){
        let body = document.getElementsByTagName('body')[0]
        let div = document.createElement('div')
        div.style.position='fixed'
        div.style.zIndex='999'
        div.style.top='0px'
        div.style.width='100%'
        div.style.height='100%'        
        let table = document.createElement('table')
        table.style.margin='10% auto'
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        let td2 = document.createElement('td')
        let input = document.createElement('input')
        input.style.marginRight='30px'
        input.style.fontSize='1.7rem'
        input.setAttribute('id','RName')
        td.innerText = '账号:'
        input.type='text'
        td2.appendChild(input)
        tr.appendChild(td);tr.appendChild(td2)
        table.appendChild(tr)
        div.style.background='#efe5d0'
        table.style.background='#e1ceb8'
        table.style.border='thin dotted #7e7e7e'
        table.style.width='250px'
        table.style.height='200px'
        table.style.textAlign='center'
        let caption = document.createElement('caption')
        caption.innerText='添加用户'
        table.appendChild(caption)
         tr = document.createElement('tr')
         td = document.createElement('td')
         td2 = document.createElement('td')
         input = document.createElement('input')
        input.style.marginRight='30px'
        input.style.fontSize='1.7rem'
        input.setAttribute('id','RPw')
        td.innerText = '密码:'
        input.type='password'
        td2.appendChild(input)
        tr.appendChild(td);tr.appendChild(td2)
        table.appendChild(tr)

        tr = document.createElement('tr')
        td = document.createElement('td')
        td2 = document.createElement('td')
        let btn = document.createElement('button')
        let btn2 = document.createElement('button')
        btn.style.width='100px'
        btn.style.marginLeft='20px'
        btn2.style.width='100px'
        btn.innerText='添加'
        btn.addEventListener('click',()=>{
            let rname = document.getElementById('RName').value
            let pw = document.getElementById('RPw').value
            editUserReal(rname,pw)
            GM_registerMenuCommand(rname, ()=>{setLoginUser(rname)}, null)
            setLoginUser(rname)
        })
        btn2.innerText='取消'
        btn2.addEventListener('click',()=>{
            body.removeChild(div)
        })
        td.appendChild(btn);td2.appendChild(btn2);tr.appendChild(td);tr.appendChild(td2)
        table.appendChild(tr)
        table.addEventListener('click',(e)=>e.stopImmediatePropagation())
        div.addEventListener('click',()=>{body.removeChild(div)})
        div.appendChild(table)
        body.appendChild(div)
    }
    function editUserReal(name, pw){
        let user = {};
        user.name=name
        user.pw=pw
        GM_setValue(name,user)
    }
    function setLoginUser(name){
        GM_setValue('loginUser',name)
        window.location.href='http://jwglxt.hbeutc.cn:20000/jwglxt/xtgl/login_slogin.html'
        //window.location.reload()
    }    
    function editUP(e){
        const userList = GM_listValues()
        if(userList.length < 2) return ;
        let body = document.getElementsByTagName('body')[0]
        let div = document.createElement('div')
        div.style.position='fixed'
        div.style.zIndex='999'
        div.style.top='0px'
        div.style.width='100%'
        div.style.height='100%'        
        let table = document.createElement('table')
        table.style.margin='10% auto'
        div.style.background='#efe5d0'
        table.style.background='#e1ceb8'
        table.style.border='thin dotted #7e7e7e'
        table.style.width='250px'
        table.style.textAlign='center'
        let caption = document.createElement('caption')
        caption.innerText='删除用户'
        table.appendChild(caption)
        for(let i = 0; i < userList.length; i++){
            if(userList[i] == 'loginUser' || GM_getValue(userList[i],null) == null) continue;
            let tr = document.createElement('tr')
        let td = document.createElement('td')
        let td2 = document.createElement('td')
        let btn = document.createElement('button')
        btn.innerText='×'
            td.innerText=userList[i]
            btn.addEventListener('click',()=>{GM_deleteValue(userList[i]);if(GM_getValue('loginUser',null) == userList[i])GM_setValue('loginUser',null); table.removeChild(tr);})
            td2.appendChild(btn)
            tr.appendChild(td);tr.appendChild(td2)
            table.appendChild(tr)
        }
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.setAttribute('colspan',2)
        let btn = document.createElement('button')
        btn.innerText='关闭'
        btn.style.width='100px'
        btn.addEventListener('click',()=>{body.removeChild(div);window.location.reload()})
        td.appendChild(btn);tr.appendChild(td);table.appendChild(tr);
        table.addEventListener('click',(e)=>e.stopImmediatePropagation())
        div.addEventListener('click',()=>{body.removeChild(div)})
        div.appendChild(table)
        body.appendChild(div)
    }
    function login(){
    user.name = GM_getValue('loginUser',null)
    if(user.name == null) return ;
    user.pw = GM_getValue(user.name,null)
    if(user.pw==null){ return ;}

    let name = document.getElementById('yhm')
    let pw = document.getElementById('mm')
    name.value = user.name
    pw.value = user.pw.pw
    pw.focus()

    let loginBtn = document.getElementById('dl')
    setTimeout(()=>{
        //loginBtn.click()
    },500)
    }
})();