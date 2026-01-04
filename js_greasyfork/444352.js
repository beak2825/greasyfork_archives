// ==UserScript==
// @name        关于百度网盘
// @namespace   Violentmonkey Scripts
// @match       https://pan.baidu.com/mbox/streampage
// @match       https://pan.baidu.com/mbox/homepage
// @match       https://pan.baidu.com/play/video#/video
// @match       https://pan.baidu.com/disk/main
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
//// @grant       GM_registerMenuCommand
//// @grant       GM_openInTab
// @version     1.1
// @author      Docase
// @description 2022/4/30 22:46:41
// @downloadURL https://update.greasyfork.org/scripts/444352/%E5%85%B3%E4%BA%8E%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/444352/%E5%85%B3%E4%BA%8E%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98.meta.js
// ==/UserScript==

GM_addStyle(`
  .gOIbzPb{
    visibility:hidden;
  }
  .video-title-right{
    display:none;
  }
  .vjs-duration-display{
    user-select:none;
    cursor:pointer；
  }
  [class$=footer]{
    text-align:center;
  }
`)


if(location.href.indexOf("https://pan.baidu.com/mbox/homepage") != -1) return

//劫持shadow-mode
Element.prototype._attachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function () {
  return this._attachShadow({mode:'open'});
};



var util = {
  
  GetRequest: function (value) { // for vue
    //url例子：www.bicycle.com?id="123456"&Name="bicycle"； 
    var url = decodeURI(location.href).split("?"); //?id="123456"&Name="bicycle";
    var object = {};
    if(url.length > 1)//url中存在问号，也就说有参数。 url.indexOf("?") != -1
    {  
     //var str = url.substr(1); //得到?后面的字符串
      var str = url[1]
      var strs = str.split("&"); //将得到的参数分隔成数组[id="123456",Name="bicycle"];
      for(var i = 0; i < strs.length; i ++) 
      {  
        object[strs[i].split("=")[0]]=strs[i].split("=")[1]
      }
    }
    return object[value]; 
  }

}




function vedioPalyedRecord (){
  
  
  var arr = util.GetRequest("path").split("%2F")

  if(!arr) return



  var p = arr[ arr.length - 2 ]
  var n = arr[ arr.length - 1 ]

  console.log( p )
  
  


  document.querySelector(".video-title-left").innerText =  p + " / " + n
  
  arr.pop()
  np = "【" + p + "】(" + arr.join("/") + ")"

  var v = GM_getValue(np,[])

  if(v[0]!=n){

    if(v.length >10){
      v.pop()
    }

    v.unshift(n)

  }


  GM_setValue(np , v)
  
  v.splice(1,0,"---")


  document.querySelector(".video-title-left").setAttribute("title",v.join("\n"))

  document.querySelector("[class$=footer]").innerHTML = arr.join("/")
 
}

function palyRate(){
  
  let sroot = document.querySelector("#video-root").shadowRoot
  let op = sroot.querySelectorAll(".vjs-menu-footnote-text")[1].parentNode
  let style = document.createElement("style");
  let liPlus = document.createElement("button")
  let liMinus = document.createElement("button")
  liPlus.className = "liButton"
  liMinus.className = "liButton"
  liPlus.innerText = "+"
  liMinus.innerText = "-"
  
  op.innerHTML = ""

  
  
  style.innerText = `
  .liButton{cursor:pointer;font-weight:700;font-size:22px !important;margin-right:5px;}
  .liButton:nth-child(2){font-weight:900}
  .liButton:hover{color:blue;}
  `
  
  
  
  op.appendChild(liPlus)
  op.appendChild(liMinus)
  sroot.appendChild(style)
  
  
  function refreshRate(){
    let rate = (Math.round(sroot.querySelector("video").playbackRate*10)/10)
    if(rate - 1 == 0){
      rate = "倍速"
    }else{
      rate = rate.toString() + '倍'
    }
    sroot.querySelectorAll(".vjs-full-menu-text")[1].innerText = rate
  }
  
  liPlus.addEventListener("click",function(){
    sroot.querySelector("video").playbackRate += 0.1
    refreshRate()
  })
  
  liMinus.addEventListener("click",function(){
    sroot.querySelector("video").playbackRate -= 0.1
    refreshRate()
  })
  
  console.log( "" )
  
  
  
  
  var isZDown = false
  
  var toThree = function(){
      var sv = sroot.querySelector("video")
      sv.setAttribute("recordRate",sv.playbackRate.toString())
      sv.playbackRate = 3.0
      refreshRate()
  }
  
  sroot.querySelector(".vjs-duration-display").addEventListener("mousedown",(ev)=>{
    if(ev.button == 0){
      toThree()
    }
  })
  sroot.addEventListener("keydown",(ev)=>{
    if(ev.keyCode == 90){
      if(isZDown != true){
        isZDown = true
        toThree()
      }
    }
  })

  
  var backFromThree = function(){ // for mouseout mouseup keyup
    var sv = sroot.querySelector("video")
      sv.playbackRate = parseFloat(sv.getAttribute("recordRate",1.0))
      refreshRate()
  }
  
  sroot.querySelector(".vjs-duration-display").addEventListener("mouseout", (ev)=>{
    if(ev.button == 0){
      backFromThree()
    }
  })
  sroot.querySelector(".vjs-duration-display").addEventListener("mouseup", (ev)=>{
    if(ev.button == 0){
      backFromThree()
    }
  })
  sroot.addEventListener("keyup", (ev)=>{
    if(ev.keyCode == 90){
      isZDown = false
      backFromThree()
    }
  })
  document.body.addEventListener("keyup", (ev)=>{
    if(ev.keyCode == 90){
      isZDown = false
      backFromThree()
    }
  })
  
  
  
  
  
}


window.onload = () => {
  
  vedioPalyedRecord()
  
  setTimeout(function(){
    palyRate()
  },1500)
  
}