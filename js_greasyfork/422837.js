// ==UserScript==
// @name         内推二维码（在线教室）
// @namespace    http://tampermonkey.net/
// @icon         https://i.loli.net/2020/02/22/NWPMBYT51rcQauL.jpg
// @version      0.1
// @description  点击按钮，自动生成在线教室所有岗位的内推二维码（属于你自己的！）
// @author       ry
// @match        https://people.bytedance.net/hire/referral/position*
// @include      https://people.bytedance.net/hire/referral/position*
// @run-at       document-body
// @require      https://greasyfork.org/scripts/373256-qrcode-js/code/QRCode-Js.js
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/422837/%E5%86%85%E6%8E%A8%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%88%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AE%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422837/%E5%86%85%E6%8E%A8%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%88%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AE%A4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function showQrcode(){
        //获取token
        var url = 'https://people.bytedance.net/atsx/api/referral/share/encode/';
        const data = {"job_post_id_list":["6704493009779558668","6847297523897420045","6715250990246791437","6813678977220086030","6853679817993406733","6854466800618014990","6807234324413286663","6914246810211010830","6853678284266539278","6933460020646594830","6704508390938249483"]}
        var response,result
        unsafeWindow.fetch(url, {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response)
            //获取短链
            let url1 = 'https://people.bytedance.net/atsx/api/common/snssdk/shortpath'
            const data1= {url:"https://job.toutiao.com/referral/pc/position/share/?token="+response.data.token}
            console.log(data1)
            unsafeWindow.fetch(url1,{
                method:'POST',
                body:JSON.stringify(data1),
                headers: new Headers({
                'Content-Type':'application/json'
                })
            }).then(res=>res.json())
            .catch(err=>console.error('Error',err))
            .then(res=>{
                result=res.data.short_url,
                console.log(result)
            })
        });
        //生成二维码
        var qrcode;
        return function(){
            if(qrcode){
                qrcode.style.display = qrcode.style.display=='none'?'block':'none';
                return qrcode;
            }
            let imgSrc = 'https://i.ibb.co/09675gF/image.png'
            qrcode = document.createElement('div');
            qrcode.innerHTML = "<div style='position:fixed; top:40%; left:0; right:0; margin:0 auto; width:180px !important; height:210px !important; background-color:#ffffff !important; box-shadow:0 0 10px #444444;'>\
                                  <div style='width:180px; height:40px; line-height:40px; font-size:14px; color:#222222 !important; font-weight:bold; text-align:center;'>\
                                    在线教室内推码\
                                  </div>\
                                  <style type='text/css'>\
                                    #qr img{margin:0 !important; border-radius:0 !important; max-width:100% !important;}\
                                  </style>\
                                  <div id='qr' style='width:160px !important; height:160px !important; margin:0 auto;'></div>\
                               </div>"
            qrcode.style.cssText ="display:block; position:fixed; top:0; bottom:0; left:0; right:0; background-color:rgba(10,10,10,.8); z-index:999999;";
            qrcode.setAttribute('title', '点击任意位置即可关闭二维码');
            qrcode.onclick = function(){ this.style.display = 'none'; };
            document.body.append(qrcode);
            new QRCode(document.getElementById("qr"), {width : 160, height : 160, text:result});
            return qrcode;
        }
    }
    GM_registerMenuCommand("生成内推二维码", showQrcode(), "");

    // Your code here...
})();