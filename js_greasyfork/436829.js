// ==UserScript==
// @name         视频倍速加速
// @namespace    https://greasyfork.org/users/776006
// @version      0.1
// @description  解决网页倍速范围小的限制，实现更快更慢的播放速度
// @author       屿东
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @downloadURL https://update.greasyfork.org/scripts/436829/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/436829/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
  window.addEventListener('load',function(){
        //盒子
            var btnbox=document.createElement('div');
            btnbox.style.position='fixed';
            btnbox.style.top='40%';
            btnbox.style.zIndex='999999';
            document.body.appendChild(btnbox);
        //圆按钮1
            var btnbox1=document.createElement('div');
            btnbox.appendChild(btnbox1);
            btnbox1.style.width='50px';
            btnbox1.style.height='50px';
            btnbox1.style.borderRadius='100%';
            btnbox1.style.backgroundColor='#2aae67';
            btnbox1.style.position='relative';
            btnbox1.style.textAlign='center';
            btnbox1.style.lineHeight='50px';
            btnbox1.style.fontSize='28px';
            btnbox1.style.color='white';
            btnbox1.style.cursor='pointer';
            btnbox1.innerHTML='×3';
            btnbox1.onclick=function(){
                document.querySelector('video').playbackRate='8';
            }
        })