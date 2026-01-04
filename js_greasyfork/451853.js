// ==UserScript==
// @name         B站刷播放
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  松叶萧落哔哩哔哩
// @author       You
// @match        https://www.bilibili.com/video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451853/B%E7%AB%99%E5%88%B7%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/451853/B%E7%AB%99%E5%88%B7%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
//https://space.bilibili.com/450579890,启动页面


    //开启的链接第一个         https://www.bilibili.com/video/BV1ee411M73Z
setTimeout(function(){
    var suffix ='?vd_source=264aaec52c5d3bc40fdf29c29a4acff4'

 var url=new Array
       url[0]='BV1ee411M73Z'
       url[1]='BV1Yd4y167V9'//看一次我就放过你
       url[2]='BV1HG41137wg'//
       url[3]='BV1ee4y1y7WM'
       url[4]='BV1X54y157Bw'//演示视频
       url[5]='BV1uW4y1B7bU'
       url[6]='BV18P4y1Z7Qv'
       url[7]='BV1zG4y1Y7bY'//注意7
       url[8]= 'BV14V4y1x74w'
       url[9]='BV1Nd4y1T7aP'
       url[10]='BV1Sa411N7SP'
       url[11]='BV1zY4y1A7om'
       url[12]='BV1AU4y1q7cj'
       url[13]='BV1nZ4y1i7qn'//360手机
       url[14]='BV1wr4y1g7jF'
       url[15]='BV1yL411A7xq'
       url[16]='BV1va411h7FP'
       url[17]='BV1Lm4y1R7Pu'//会退包
       url[18]='BV1Pr4y1z734'
       url[19]='BV1vq4y1t7Wd'
       url[20]='BV1dT4y1X7hC'
       url[21]='BV1Nm4y1Z7n3'
       url[22]='BV1TT4y1C7FR'
       url[23]='BV1Hq4y1b7vB'
       url[24]='BV14Z4y1o7k5'
       url[25]='BV1iL4y1W7tQ'
       url[26]='BV1BP4y1N7F4'//https://www.bilibili.com/video/BV1BP4y1N7F4?spm_id_from=333.999.0.0
       url[27]='BV18g411w7bS'
       url[28]='BV1Fi4y1d7Vk'//白嫖
       url[29]='BV1gS4y1X7YX'
       url[30]='BV1mg411A7Hm'
       url[31]='BV1HP4y1j7We'
       url[32]='BV193411k7Rh'
       url[33]='BV12U4y1u71L'
       url[34]='BV1hu411o7xK'
       url[35]='BV1vU4y1F7Uw'
       url[36]='BV1Mv411u7Tw'
       url[37]='BV14T4y1o7QK'
       url[38]='BV1Yb4y1Y7dR'
       url[39]='BV1Ef4y177ob'
       url[40]='BV1Tu411Z78r'
       url[41]='BV1BL4y1z7fA'
       url[42]='BV1iL411s7yk'
       url[43]='BV1JR4y1n7Lu'
       url[44]='BV11Q4y1Q7w9'
       url[45]='BV19h411n7GT'
       url[46]='BV1pb4y117nZ'
       url[47]='BV1VM4y137yG'
       url[48]='BV1sq4y1o7fj'
       url[49]='BV12q4y1o7qo'
       url[50]='BV1gq4y1P7h8'
       url[51]='BV1764y187MP'
       url[52]='BV1Rh411p77Q'
       url[53]='BV1BM4y137bR'
       url[54]='BV1XA411F76v'//刷机经验03
       url[55]='BV1mL411x7dF'
       url[56]='BV1L64y1a76w'
       url[57]='BV1g34y1X7nV'
       url[58]='BV1Vq4y1f7ZE'
       url[59]='BV1wA411F7Au'
       url[60]='BV1tL411t7uE'
       url[61]='BV1W3411q7Qx'
       url[62]='BV1q44y187ip'
       url[63]='BV11Q4y117fC'
       url[64]='BV1o54y1J7W8'
       url[65]='BV1wv411574N'
       url[66]='BV1RB4y1u7se'
       url[67]='BV1wp4y1t7GU'
       url[68]='BV13f4y1W7RJ'
       url[69]='BV12y4y1p7Cs'
       url[70]='BV1g5411373Q'
       url[71]='BV1gp4y1b7bf'
       url[72]='BV14f4y1s7VP'
       url[73]='BV1jA411V7rf'
       url[74]='BV1Nh411S7JD'
       url[75]='BV1iB4y1A7Be'//第一辅助软件


       console.log('开始')
       //clearCookie()

       var x=index()
       console.log(url.length)
       console.log(x)
      // window.location.href=url[x]
  if (x==666||x==404){
          console.log('关闭窗口')
          window.open("about:blank","_self").close()}

    document.querySelector('.like').click()//点赞
    triple()

    document.querySelector('#share_copy').click()//分享
    window.open('https://www.bilibili.com/video/'+url[x],'_self')
 //document.cookie="username=;expires=Thu,01 Jan 1970 00:00:00 UTC;path=/;

//这个是自动返回下一个的索引
       function index() {
      var i =0
      while(i<=url.length){
          //console.log(window.location.href)
          //console.log(url[i])
      if (window.location.href.includes(url[i])){

          console.log('判断成功')
          if(i>=20){return('0')}else{return(++i)}
          }
        i++
       }
       return('404')
      console.log('没找到')
       }


},5000)

//每隔一个小时自动刷新页面，防止卡死
    setInterval(function(){location.reload()},360000)

//三连代码
function triple(){
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'https://api.bilibili.com/x/web-interface/archive/like/triple');
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpRequest.withCredentials = true;//设置跨域发送
    let aid=window.__INITIAL_STATE__.aid;
    let sKey="bili_jct";
    let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    httpRequest.send('aid='+aid+'&csrf='+csrf);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
           // console.log(json);
            if(json.code==0){

                document.querySelector('.share').click()//点击分享
                console.log("三连成功!");
            }else{
                console.log("三连失败/(ㄒoㄒ)/~~");
            }
        }
    };
}
//三连结束



    // Your code here...
})();