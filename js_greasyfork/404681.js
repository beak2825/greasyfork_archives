// ==UserScript==
// @name        科泥鸡挖矿产专业
// @namespace   Violentmonkey Scripts
// @match       https://zjy2.icve.com.cn/*
// @grant       none
// @version     5.31
// @author      -
// @description 2020/5/8 上午9:11:21
// @downloadURL https://update.greasyfork.org/scripts/404681/%E7%A7%91%E6%B3%A5%E9%B8%A1%E6%8C%96%E7%9F%BF%E4%BA%A7%E4%B8%93%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/404681/%E7%A7%91%E6%B3%A5%E9%B8%A1%E6%8C%96%E7%9F%BF%E4%BA%A7%E4%B8%93%E4%B8%9A.meta.js
// ==/UserScript==
window.onload=function(){
  setTimeout(function(){
      if(document.getElementsByClassName("am-progress-bar").length!=0){
      localStorage.setItem("home",window.location.href);
      console.log("刷课地址已储存。")
      var div=document.createElement("div");
      div.setAttribute("style"," color: white;width: 120px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px 40px;font-size:12px")
      div.innerHTML='全局模式<input name="mode" type="radio" value=""/><br>智能搜索模式<input name="mode" type="radio" value=""/>'	    
      document.body.appendChild(div);
      console.log("刷课地址为："+localStorage.getItem("home"));
      if(localStorage.getItem("mode")!=null){
        if(localStorage.getItem("mode")==1){
          document.getElementsByName("mode")[0].checked=true;
          mode1();
        }else{
          document.getElementsByName("mode")[1].checked=true;	
          mode2();
        }
      }
      setInterval(function(){
        if(document.getElementsByName("mode")[0].checked){
          localStorage.setItem("mode",1);
        }
        if(document.getElementsByName("mode")[1].checked){
          localStorage.setItem("mode",2);	
        }
      },100)
    }
  },3000)
    
  function mode1(){
    var res=false;
			var openmenu=setInterval(function(){
        try{
          var fu=document.getElementsByClassName("am-icon-caret-right")[0];
          fu.click();
          var Tasks=fu.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("sh-res_p");
          for(var i = 0;i<Tasks.length;i++){
          if(parseInt(Tasks[i].style.width)<95){
              console.log(Tasks[i].style.width);
              Tasks[i].click();
              break;
            }
         }
				}catch(e){
          res=true;
          console.log(res);
					clearInterval(openmenu);
				}
      },1200);
  }
  function mode2(){
      var zhang;
      var kai;
      if(document.getElementsByClassName("am-progress-bar").length!=0){
        zhang=document.getElementsByClassName("am-progress-bar");
        for(var i =0;i<zhang.length;i++){
            if(parseInt(zhang[i].style.width)<97){
              kai=zhang[i].parentNode.parentNode.getElementsByClassName("am-icon-caret-right")[0];
              if(kai==null){
                kai=zhang[i].parentNode.parentNode.getElementsByClassName("am-icon-caret-down")[0];
              }
              kai.click();
              break;
            }else{
              if(zhang[i].parentNode.parentNode.getElementsByClassName("am-icon-caret-down").length!=0){
                zhang[i].parentNode.parentNode.getElementsByClassName("am-icon-caret-down")[0].click();
              }
            }
          }
          var timegetmenu=setInterval(function(){
            try{
              var ke=kai.parentNode.parentNode.getElementsByClassName("am-icon-caret-right")[0];
              ke.click();
              console.log(ke);
            }catch(e){
              console.log("打开目录完毕");
              clearInterval(timegetmenu);
              getK();
            }
          },1000);
      }
  }
  
  function getK(){
    var all=document.getElementsByClassName("sh-res_p");
    for(var jj =0;jj<=all.length;jj++){
      console.log(parseInt(all[jj].style.width));
      if(parseInt(all[jj].style.width)<95){
          all[jj].click();
          break;
        }
      }
  }
  var mp;
  var nextbtn;
  var a=0;
  setTimeout(function(){
      if(document.getElementsByClassName("jw-video")[0]!=null){
        mp=document.getElementsByClassName("jw-video")[0];
        var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px")
        div.innerHTML='勾选视频页面静音  <input type="checkbox" id="jingyin">';
        document.body.appendChild(div);
        if(localStorage.getItem("muted")=="true"){
          document.getElementById("jingyin").checked=true;
          mp.muted=true;
        }
        document.getElementById("jingyin").onclick=function(){
          if(document.getElementById("jingyin").checked){
            localStorage.setItem("muted","true");
            mp.muted=true;
          }else{
            localStorage.setItem("muted","flase");
            mp.muted=false;
          }
        }
        setInterval(function(){
                mp.onended=function(){
                  setTimeout(function(){
                    window.location.href=localStorage.getItem("home");
                  },5000)
                }
         },1000);
      }
      if(document.getElementsByClassName("MPreview-arrowBottom")[0]!=null){
        var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px;font-size:12px")
        div.innerText="文档页面";
        document.body.appendChild(div);
        console.log("找到下一页按钮");
        var itemcount=parseInt(document.getElementsByClassName("MPreview-pageCount")[0].getElementsByTagName("em")[0].textContent);
        nextbtn=document.getElementsByClassName("MPreview-arrowBottom")[0];
        var ino=setInterval(function(){
        if(a<itemcount){
            console.log(a);
            nextbtn.click();
            a++;
          }else{
            clearInterval(ino);
            window.location.href=localStorage.getItem("home");
          }
        },3000)
      }
      if(document.getElementsByClassName("stage-next-btn")[0]!=null){
        var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px;font-size:12px")
        div.innerText="ppt页面停留120s";
        document.body.appendChild(div);
        console.log("找到下一页按钮");
        nextbtn=document.getElementsByClassName("stage-next-btn")[0];
        var ino=setInterval(function(){
          a++;
          if(a<120){
            console.log(a);
            nextbtn.click();
          }else{
            clearInterval(ino);
            window.location.href=localStorage.getItem("home");
          }
        },1000)
    }
    if(document.getElementById("studyNow")!=null){
      document.getElementById("studyNow").click();
    }
    if(document.getElementsByClassName("np-link-go")[0]!=null){
        var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px")
        div.innerText="压缩包页面"
        document.body.appendChild(div);
      console.log("压缩包页面");
      setTimeout(function(){
          window.location.href=localStorage.getItem("home");
      },5000);
    }
    if(document.getElementsByClassName("iviewer_cursor")[0]!=null){
      var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px")
        div.innerText="图片页面"
        document.body.appendChild(div);
      console.log("图片页面");
      setTimeout(function(){
          window.location.href=localStorage.getItem("home");
      },5000);
    }
    if(document.getElementsByTagName("param")[0]!=null){
      var div=document.createElement("div");
        div.setAttribute("style"," color: white;width: 100px;height: 60px;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px")
        div.innerText="swf页面"
        document.body.appendChild(div);
      console.log("swf页面");
      setTimeout(function(){
          window.location.href=localStorage.getItem("home");
      },5000);
    }
  },3000)
}