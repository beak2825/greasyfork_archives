/*
 * @Author: tian.gao
 * @Date: 2020-08-14 11:03:26
 * @LastEditors: tian.gao
 * @LastEditTime: 2020-08-16 09:31:42
 * @Description:
 */
// ==UserScript==
// @name         机动战士敢达ol 活动领取器
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  try to take over the world!
// @author       You
// @match        *://*.9you.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/408726/%E6%9C%BA%E5%8A%A8%E6%88%98%E5%A3%AB%E6%95%A2%E8%BE%BEol%20%E6%B4%BB%E5%8A%A8%E9%A2%86%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/408726/%E6%9C%BA%E5%8A%A8%E6%88%98%E5%A3%AB%E6%95%A2%E8%BE%BEol%20%E6%B4%BB%E5%8A%A8%E9%A2%86%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
(function() {
   // 活动信息
   var posJosn=[]
    const pages=`<div class="mys-page">
    <button class="lin" >
      一键领取
    </button>
    <div class="sid">

    </div>
  </div>`
  $(".main").append(pages)
  var style = document.createElement("style");
  style.type = "text/css";
  var text = document.createTextNode(`  .mys-page{
    width: 200px;
    height: 500px;
    position: fixed;
    right: 10px;
    top: 200px;
    background-color: rgba(255,255,255,0.7);
    overflow: auto;
    z-index:9999
  }
  .lin{
    width: 200px;
    height: 30px;
    background-color: #a6dfa8;
  }
  .sid{
    overflow: auto;
    height: 470px;
  }`); /* 这里编写css代码 */
  style.appendChild(text);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
  // 从码云上获取活动信息
/*   GM_xmlhttpRequest({
  method: "GET",
  url: "http://gaotianvb.gitee.io/mobile_soldier_ol__json/py.json",
  onload: function(response) {
     let a=response.response
     posJosn=JSON.parse(a)
    }
  }); */
  //$.ajaxSettings.async = false; //关闭异步
  // 请求池
  let postlist=[]
  // 请求池中添加请求
  function post(a1,a2) {
    postlist.push([a1,a2])
  }

/*   // 从请求池获取请求参数并请求
  setInterval(() => {
    if(postlist.length){
      let quer=postlist.shift()
        $.ajax({
            type: "post",
            url: quer[0],
            data: quer[1],
            success: function (result) {
                let res=JSON.parse(result)
                if(res.status=='00'){
                  $('.sid').prepend('<p style="color:red">'+res.desc+'</p>')
                }else{
                  $('.sid').prepend('<p >'+res.desc+'</p>')
                }
            },
            error:function(response){
                response=JSON.parse(response.responseText)
                if(response.status=='00'){
                  $('.sid').prepend('<p style="color:red">'+response.desc+'</p>')
                }else{
                  $('.sid').prepend('<p >'+response.desc+'</p>')
                }
            }
        });

    }
   //请求间隔,防止过快请求导致被网站屏蔽
  }, 300); */
          // 从请求池获取请求参数并请求
   setInterval(() => {
    if(postlist.length){
      let quer=postlist.shift()
        $.ajax({
            type: "post",
            url: quer[0]+'/'+quer[1],
            data: eval('('+quer[2]+')'),
            success: function (result) {
                let res=JSON.parse(result)
                if(res.status=='00'){
                  $('.sid').prepend('<p style="color:red">'+res.desc+'</p>')
                }else{
                  $('.sid').prepend('<p >'+res.desc+'</p>')
                }
            },
            error:function(response){
                response=JSON.parse(response.responseText)
                if(response.status=='00'){
                  $('.sid').prepend('<p style="color:red">'+response.desc+'</p>')
                }else{
                  $('.sid').prepend('<p >'+response.desc+'</p>')
                }
            }
        });

    }
   //请求间隔,防止过快请求导致被网站屏蔽
  }, 300);
  $('.lin').click(function () {
      // 遍历活动信息,解析成请求参数
      // ["http://wg-event.9you.com/msact_202017946/do10", {"itemkey": "1"},[1, 5]]
      // 活动信息一般像上面的样子,第一个是请求url,第二个是请求参数,第三个是参数的范围
      // 例如"http://wg-event.9you.com/msact_202017946/do10", {"itemkey": "1"}
      //     "http://wg-event.9you.com/msact_202017946/do10", {"itemkey": "2"}
      //     "http://wg-event.9you.com/msact_202017946/do10", {"itemkey": "3"}
      // 像这样一个url 不同的itemkey对应同个活动的不同按钮  [1,5]表示1-5
/*       for (let i = 0; i < posJosn.length; i++) {
        const element = posJosn[i];
        if(element[2]){
          let key=Object.keys(element[1])
          for (let x = element[2][0]; x <= element[2][1]; x++) {
            let q={}
            if(element[3]){
              for (let y = element[3][0]; y <= element[3][1]; y++) {
                q[key[0]]=x
                q[key[1]]=y
                // sleep(1000)
                post(element[0],q)
              }
            }else{
              q[key[0]]=x
              // sleep(1000)
              post(element[0],q)
            }

          }
        }else{
          // sleep(1000)
          post(element[0],element[1])
          // $.post(element[0],element[1])
        }
      } */
      // $.post("http://wg-event.9you.com/msact_202017912/do10",{itemkey: '1,3,4,5,8'})
          // 所有活动网址
    let activity=[]
    let activityBase=$('.left_list a')
    for(let i=0;i<activityBase.length;i++){
        activity.push(activityBase[i].href)
    }
    activity.push('http://'+window.location.host+'/msact_202018166/part1')
      //把不需要的活动地址放到这
    let notNeed=['http://wg-event.9you.com/msact_202018322','http://wg-event.9you.com/msact_202018302','http://wg-event.9you.com/msact_201914932','http://wg-event.9you.com/msact_201914101/member','http://wg-event.9you.com/msact_202018278','http://wg-event.9you.com/msact_202018212','http://wg-event.9you.com/msact_202018020']
    //console.log(activity).match(/postRequest\(.*?\)/)
    //activity=['http://wg-event.9you.com/msact_202018322']
    for(let i=0;i<activity.length;i++){
        if(notNeed.includes(activity[i])){continue}
        $.get(activity[i],function(data,status,xhr){
            let s=data.match(/postRequest\(.*?\)/g)
            let u=data.match(/LogoutUrl.*?,/g)
            u=u[0].substring(u[0].length-17,u[0].length-2)
            for(let i=0;i<s.length;i++){
                let q=s[i].match(/\(.*?\)/g)
                q[0]=q[0].replace(/\'\,/g,"'|")
                q[0]=q[0].replace(/\,\'/g,"|'")
                let b=q[0].substring(1,q[0].length-1).replace(/\'/g,"")
                //console.log(b.split(","))
                let c=b.split("|")
                c.unshift('http://'+window.location.host+'/'+u)
                postlist.push(c)
                console.log(postlist)
            }
        })
    }
  })


    // Your code here...
})();