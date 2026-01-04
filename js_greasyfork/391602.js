// ==UserScript==
// @id           tencentanimecartoonresizerbytoprapid
// @name         Tencent anime cartoon picture resizer
// @name:zh-CN   腾讯动漫图片缩放
// @namespace    https://greasyfork.org/en/scripts/391602
// @version      1.0
// @description  Resize tencent cartoon picture
// @description:zh-cn 腾讯动漫图片缩放
// @author       Toprapid
// @copyright    2019+,toprapid
// @match        https://ac.qq.com/ComicView/index/id/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/391602/Tencent%20anime%20cartoon%20picture%20resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/391602/Tencent%20anime%20cartoon%20picture%20resizer.meta.js
// ==/UserScript==
var scaledSize={get(){return parseInt(GM_getValue("scaledSize","1000"))},set(vl){GM_setValue("scaledSize",vl+"")}};var resizePicture=()=>{let z=document.getElementById("comicContain");if(z){let n=z.getElementsByTagName("li");if(n){if(n.length>0){for(let i=0;i<n.length;i++){n[i].style.height=Math.round(scaledSize.get()/n[i].offsetWidth*n[i].offsetHeight)+"px";n[i].style.width=scaledSize.get()+"px"}}}}};var setup=()=>{let setupDiv=document.getElementById("tencent_anime_cartoon_picture_resizer_setup_div");if(!setupDiv){setupDiv=document.createElement("div");setupDiv.id="tencent_anime_cartoon_picture_resizer_setup_div";setupDiv.style.position="fixed";setupDiv.style.zIndex=999;setupDiv.style.left="10%";setupDiv.style.top="1%";setupDiv.style.backgroundColor="#5f71a0";setupDiv.style.color="White";setupDiv.style.borderRadius="5px";setupDiv.innerHTML=`<p><b>请输入想要的图片宽度（请输入100至${window.screen.width}之间的数字)：</b><input type="text"maxlength="4"style="text-align:center;"id="tac_resized_width"value="${scaledSize.get()}"/><button id="tac_ok">保存</button><button id="tac_cancel">取消</button></p>`;setupDiv.style.display="none";document.body.appendChild(setupDiv);document.getElementById("tac_ok").onclick=()=>{let z=document.getElementById("tac_resized_width").value.trim();if(/[0-9]{3,4}/.test(z)){let n=parseInt(z);if(n>=100&&n<=window.screen.width){scaledSize.set(n);resizePicture();document.getElementById("tencent_anime_cartoon_picture_resizer_setup_div").style.display="none";return}}alert("输入的数字格式不对，请重新输入。")};document.getElementById("tac_cancel").onclick=()=>{document.getElementById("tencent_anime_cartoon_picture_resizer_setup_div").style.display="none"}}setupDiv.style.display="block"};GM_registerMenuCommand("设置图片宽度",setup);window.onload=window.onresize=()=>{setTimeout(resizePicture,1000)};