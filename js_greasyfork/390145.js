// ==UserScript==
// @name         TokyoTech Portal Login 東工大ポータルログイン
// @version      0.1
// @description  A login script for TokyoTech Portal.
// @author       minkmaguro
// @match        https://portal.nap.gsic.titech.ac.jp/GetAccess/Login?Template=*
// @grant        none
// @namespace https://greasyfork.org/users/371200
// @downloadURL https://update.greasyfork.org/scripts/390145/TokyoTech%20Portal%20Login%20%E6%9D%B1%E5%B7%A5%E5%A4%A7%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/390145/TokyoTech%20Portal%20Login%20%E6%9D%B1%E5%B7%A5%E5%A4%A7%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.meta.js
// ==/UserScript==

(
    function(d,w,n,j,i,p,m){
        var l=d.login,f=d.getElementsByTagName('input'), t, c;
        switch(n.search.replace(/[&?]Template=([^&]*)(&.*)?/,'$1')){
            case 'userpass_key':
                l.usr_name.value=i;
                l.usr_password.value=p;
                l.submit();
                break;
            case 'idg_key':
                while(++j-4){
                    t=f.item(j);
                    c=t.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('th')[0].innerHTML;
                    t.value=m[c.match(/[1-7]/)[0].charCodeAt(0)-'1'.charCodeAt(0)].charAt(c.match(/[A-J]/)[0].charCodeAt(0)-'A'.charCodeAt(0));
                    }
                    l.submit();
                break;
            default:
                if(n.host+n.pathname=='wlanauth.noc.titech.ac.jp/fs/customwebauth/login.html'){
                    d.getElementById('username').value=i;
                    d.getElementById('password').value=p;
                    submitAction();
                }else{
                    w.open('https://portal.nap.gsic.titech.ac.jp/GetAccess/Login?Template=userpass_key&AUTHMETHOD=UserPassword', '_blank');
                }
        }
    }
)
// Type your name, password and matrix codes.
(document,window,location,0,'00B00000','password',['1111111111','2222222222','3333333333','4444444444','5555555555','6666666666','7777777777']);
