// ==UserScript==
// @name        HDFC 02/02/2019
// @namespace   buddhacsc
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     3
// @grant       none
// @description HDFC
// @downloadURL https://update.greasyfork.org/scripts/20842/HDFC%2002022019.user.js
// @updateURL https://update.greasyfork.org/scripts/20842/HDFC%2002022019.meta.js
// ==/UserScript==

function hdfcmain(){
cur_url=document.location.href;
	if(cur_url.indexOf('entry') > -1 )
      {
          otp();     
      }
  else
    {
    if(cur_url.indexOf('merchant') > -1 )
    {
     login();
    }  
    }}

  setInterval(function () {hdfcmain();}, 1000);

function otp(){  
var count =document.frmTxn.querySelector('.formtable a img')
 if(count != null)
           {
             count.click();
           }
              }

function login(){
        var frm = window.parent.frames['bottom_frame'];
        if(frm != null)
        {
            uname_hdfc = frm.document.getElementsByName('fldLoginUserId')[0];
            if(uname_hdfc != null)
            {
                uname_hdfc.value = " "
            };
            pwd_hdfc = window.parent.frames['bottom_frame'].document.getElementsByName('fldPassword')[0];
            if(pwd_hdfc != null)
            {
                pwd_hdfc.value=" "
            };
        }
        cont_pymt = window.parent.frames['bottom_frame'].document.getElementsByTagName('a');
        if(cont_pymt != null)
        {
            for(i=0;i<cont_pymt.length; i++)
            {
				img_pre=cont_pymt[i].getElementsByTagName('img');
				if (img_pre.length != 0)
				{
                if(img_pre[0].getAttribute('alt').indexOf('continue') == 0 )
                {
                    //console.log('about to click');
                    cont_pymt[i].click();
                    
                    //console.log('after completion');
                }
				}
            }
        }}
  
  
