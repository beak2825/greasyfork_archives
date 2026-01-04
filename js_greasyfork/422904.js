// ==UserScript==
// @name         内推海报（在线教室）
// @namespace    http://tampermonkey.net/
// @icon         https://i.loli.net/2020/02/22/NWPMBYT51rcQauL.jpg
// @version      1.2
// @description  点击按钮，自动生成在线教室所有岗位的内推二维码和海报（属于你自己的！）
// @author       ry
// @match        https://people.bytedance.net/hire/referral/position*
// @include      https://people.bytedance.net/hire/referral/position*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/373256-qrcode-js/code/QRCode-Js.js
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/422904/%E5%86%85%E6%8E%A8%E6%B5%B7%E6%8A%A5%EF%BC%88%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AE%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422904/%E5%86%85%E6%8E%A8%E6%B5%B7%E6%8A%A5%EF%BC%88%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AE%A4%EF%BC%89.meta.js
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
            //获取二维码短链
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
        var link
        return function(){
            if(document.getElementsByClassName("qr-block").length===0){
                link=result
                //console.log("00000")
            }else{
                let length=document.getElementsByClassName("atsx-input").length
                //console.log("11111",document.getElementsByClassName('atsx-input')[length-1].value)
                link=document.getElementsByClassName("atsx-input")[length-1].value
            }
            qrcode = document.createElement('div');
            qrcode.id ="qrcode"
            qrcode.innerHTML = "<div id='qrcon' style='position:fixed; top:10px; left:0; right:0; margin:0 auto; width:320px !important; height:100% !important; background-color:#ffffff !important; box-shadow:0 0 10px #444444;overflow-y:auto;'>\
                                  <canvas id=canvas></canvas>\
                                  <div id='qr' style='display:none'>\
                               </div>"
            qrcode.style.cssText ="display:block; position:fixed; top:0; bottom:0; left:0; right:0; background-color:rgba(10,10,10,.8); z-index:999999;";
            qrcode.setAttribute('title', '点击任意位置即可关闭二维码');
            qrcode.onclick = function(){ document.getElementById("qrcode").remove();
                                       //console.log("remove")
                                       };
            document.body.append(qrcode);
            //canvas屏幕适配
            var getPixelRatio = function (context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            let canvas=document.getElementById("canvas")
            let ctx=canvas.getContext("2d")
            var ratio = getPixelRatio(ctx);
            canvas.width=320*ratio
            canvas.height=1706*ratio
            canvas.style.width=320+'px'
            canvas.style.height=1706+'px'
            ctx.rect(0,0,canvas.width,canvas.height)
            ctx.fillStyle="#fff"
            ctx.fill();
            //加载海报
            let imgPoster =new Image();
            imgPoster.onload=function(){
                ctx.drawImage(imgPoster,0,0,320*ratio,1706*ratio)
                new QRCode(document.getElementById("qr"), {width : 100*ratio, height : 100*ratio, text:link, colorLight : "#e5e5e5",});
                //console.log("再次生成")
                let imgQRcode=document.getElementById("qr").children[1]
                setTimeout(()=>{ctx.drawImage(imgQRcode,canvas.width/2-50*ratio,canvas.height*0.782,100*ratio,100*ratio)},500)
            }
            imgPoster.src="https://ftp.bmp.ovh/imgs/2021/03/ee450ce10c98e17c.png"
            //生成并加载二维码
            return qrcode;

        }
    }
    let btn=document.createElement('button')
    btn.innerHTML="生成海报"
    btn.style.cssText="display:block;position:absolute; top:80%; right:1%;width:80px;height:40px;border-radius:5px;background-color:#85C1E9 ;z-index:999999 "
    document.body.append(btn)
    btn.addEventListener('click',showQrcode())




    // Your code here...
})();