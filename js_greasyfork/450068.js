// ==UserScript==
// @name         SXF
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Login
// @author       MovingJ
// @match        https://osm.ipiginc.net/*
// @grant        none
// @license      GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450068/SXF.user.js
// @updateURL https://update.greasyfork.org/scripts/450068/SXF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('MONKEY SXF');



    let username = localStorage.getItem('sxfUsername');
    let pwd = localStorage.getItem('sxfPassword');

    if( !username ){
        console.log('请先输入一次账号密码');
        $("#tldapUserLock").unbind('focus');

        $("#ldapUsername").on('input',function(e){
            username = e.target.value
        })
        $("#tldapUserLock").on('change',function(e){
          setTimeout(()=>{
            pwd = $("#ldapPwd").val();
          },1000)
        })
        $("#do_login").on('click',function(){
            localStorage.setItem('sxfUsername',username);
            localStorage.setItem('sxfPassword',pwd);
        })
        return;
    }

      if( window.location.href.includes('osm.ipiginc.net/fort/login') ) {
            $("#loginMethod").val(8);
            $("#ldapAuthMethod").append('<option value="192.168.32.8">ipig.ad</option>');
            $("#password").hide();
            $("#ldap").show();
            $("#ldapUsername").val(username);
            $("#tldapUserLock").val(pwd);
            $("#ldapPwd").val(pwd);
            $("#tldapUserLock").attr("type","password");
            $("#do_login").click();
      }
      else if(  window.location.href=='https://osm.ipiginc.net/fort/' ){
            $("#content1").on('load',function() {

                while( $((window.frames["content1"].contentWindow).frames['topFrame']).length>0  ){
                    while( $((window.frames["content1"].contentWindow).frames['topFrame'].document).find("#mainFrame").length>0  ){
                        while( $(  (window.frames["content1"].contentWindow).frames['topFrame'].frames['mainFrame'].document ).find("#rigthFrame").length>0  ){

                            $((window.frames["content1"].contentWindow).frames['topFrame'].frames['mainFrame'].frames['rigthFrame'].document).find("#content_table > tbody > tr.t1").click();
                            setTimeout(()=>{
                                $((window.frames["content1"].contentWindow).frames['topFrame'].frames['mainFrame'].frames['rigthFrame'].document).find("#open01 > div > table > tbody > tr > td:nth-child(2) > a:nth-child(1)")[0].click();
                                $("#artIframe").on('load',function(){
                                    $(window.frames['artIframe'].contentWindow.document).find("#ssoAccount").val(username);
                                    $(window.frames['artIframe'].contentWindow.document).find("#ssoPasswd").val(pwd);
                                    $("#okButton").click();
                                })

                            },1000);

                            break;
                        }

                        break;
                    }
                    break;
                }
            })
       }







})();