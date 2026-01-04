// ==UserScript==
// @name        MOOC显示作业截止时间
// @namespace   Violentmonkey Scripts
// @match       https://www.icourse163.org/*learn/*/learn/testlist
// @include     https://www.icourse163.org/*learn/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant       unsafeWindow
// @version     1.1
// @author      Leger
// @description 2020/9/30 下午7:34:58
// @downloadURL https://update.greasyfork.org/scripts/412280/MOOC%E6%98%BE%E7%A4%BA%E4%BD%9C%E4%B8%9A%E6%88%AA%E6%AD%A2%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/412280/MOOC%E6%98%BE%E7%A4%BA%E4%BD%9C%E4%B8%9A%E6%88%AA%E6%AD%A2%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
$(()=>{
    $("#j-courseTabList > li>a").click(()=>{
      setTimeout(()=>{
            if(location.href.match(/https\:\/\/www\.icourse163\.org\/.*learn\/.*\/learn\/testlist/)){
                if(!$("#exptime").length>0){
                     //添加浮动框
        $(
            '<div id="exptime">'+
            '<div class="exptitle">截止时间</div>'+
            '<div>'+
            '<ul id="expinfo"></ul>'+
            '</div>'+
            '</div>'
            ).appendTo("body");
            //浮动框样式
            let css='<style>'+
        '#exptime{'+
        'position: fixed;'+
        'width:246px;'+
        'height:257px;'+
        'top: 460px;'+
        'left: 1223.5px;'+
        ''+
        'border:  1px solid cadetblue;'+
        'border-radius: 10px;'+
        'overflow:auto;'+
        '}'+
        '.exptitle{'+
        'background-color: azure;'+
        'font-size: 1.2em;'+
        'line-height: 2em;'+
        'text-align: center;'+
        '}'+
        '</style>';
                $(css).appendTo("head");
            //添加数据
        
                  $("h4.j-name.name.f-fl.f-thide").each((k,v)=>{
                  let name=$(v).html();
                  let exptime=$(v).next().html();
                  let listr="<li><i>"+name+"</i><br>"+exptime+"</li>";
                  let timestr=(exptime+"").match(/(?<=截止时间：).*/)[0];
                  let millis=new Date(timestr).getTime();
                  let now=new Date();
                  let nowmilis=now.getTime(); 
                  let duemillis=now.setDate(now.getDate()+7);
                 
                  if(millis>nowmilis){
                    if(millis<duemillis)
                  $(listr).appendTo("#expinfo").css("color","red");
                    else
                      $(listr).appendTo("#expinfo");
                  }
                  
        })
                
      
        
        

                }
              else $("#exptime").show();
              
                            
    }
      else if($("#exptime").length>0){
        $("#exptime").hide();
      }
      },1000);
  
    })
      if(location.href.match(/https\:\/\/www\.icourse163\.org\/.*learn\/.*\/learn\/testlist/)){
                             //添加浮动框
        $(
        '<div id="exptime">'+
        '<div class="exptitle">截止时间</div>'+
        '<div>'+
        '<ul id="expinfo"></ul>'+
        '</div>'+
        '</div>'
        ).appendTo("body");
        //浮动框样式
        let css='<style>'+
    '#exptime{'+
    'position: fixed;'+
    'width:246px;'+
    'height:257px;'+
    'top: 460px;'+
    'left: 1223.5px;'+
    ''+
    'border:  1px solid cadetblue;'+
    'border-radius: 10px;'+
    'overflow:auto;'+
    '}'+
    '.exptitle{'+
    'background-color: azure;'+
    'font-size: 1.2em;'+
    'line-height: 2em;'+
    'text-align: center;'+
    '}'+
        '#expinfo li{'+
        'text-align:center;'+
            'margin-bottom:5px;'+
        '}'+
    '</style>';
            $(css).appendTo("head");
        //添加数据
        document.onreadystatechange = function(){
            if (document.readyState == "complete"){    
              $("h4.j-name.name.f-fl.f-thide").each((k,v)=>{
              let name=$(v).html();
              let exptime=$(v).next().html();
              let listr="<li><i>"+name+"</i><br>"+exptime+"</li>";


              let timestr=(exptime+"").match(/(?<=截止时间：).*/)[0];
              let millis=new Date(timestr).getTime();
              let now=new Date();
              let nowmilis=now.getTime(); 
              let duemillis=now.setDate(now.getDate()+7);
             
              if(millis>nowmilis){
                if(millis<duemillis)
              $(listr).appendTo("#expinfo").css("color","red");
                else
                  $(listr).appendTo("#expinfo");
              }
              
    })
            
            }
        }
    
    
    }
    })