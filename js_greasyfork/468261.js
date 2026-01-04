// ==UserScript==
// @name         UR列表便筏_List_test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在UR列表中,若每次均需要找项目入口，非常麻烦，把想要的项目标签添加至首页，后续不要再进行查找
// @author       You
// @match        https://prtrack.tpv-tech.com/pts/ProjectList.aspx
// @match        https://prtrack.tpv-tech.com/Pts/ProjectList.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tpv-tech.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468261/UR%E5%88%97%E8%A1%A8%E4%BE%BF%E7%AD%8F_List_test.user.js
// @updateURL https://update.greasyfork.org/scripts/468261/UR%E5%88%97%E8%A1%A8%E4%BE%BF%E7%AD%8F_List_test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const parent =document.querySelector("#ctl00_CP1_Panel1")
    const Tr=document.createElement("tr")
    Tr.id="Trchildren"
    parent.insertBefore(Tr,parent.firstChild)

    const addinput=document.createElement("input")
    addinput.type="button"
    addinput.value="add_URL"
    Tr.appendChild(addinput)
    const clearinput=document.createElement("input")
    clearinput.type="button"
    clearinput.value="Clear_all"
    Tr.appendChild(clearinput)

    //清除按钮，清除所有保存的localstorage
    clearinput.addEventListener("click",function(){
     localStorage.clear()//可改进，清除localstorage 所有包含 DUT 字眼的key值
      location.reload()
     })


    //遍历localStorage，若key包含name，则新建a ，href="对应URL地址"
    for(var i=0;i<localStorage.length;i++)
    {
        var Tkey=localStorage.key(i)
       if (Tkey.includes("DUT"))
       {
         var td1=document.createElement("td")
         var a1=document.createElement("a")
         var span1=document.createElement("span")
         //var span2=document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");

         a1.href=localStorage.getItem(Tkey)
         a1.innerText=Tkey

         span1.innerText="删除"
         //span1.insertAfter(span2,span1)

         var tr=document.getElementById("Trchildren")
          tr.appendChild(td1)
          td1.appendChild(a1)
          td1.appendChild(span1)
           var span2=document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");
           td1.appendChild(span2)
          //td1.appendChild(span2)
       }
    }

    //监听创建的SPAN1控件
    const SPAN1_TR=document.getElementById("Trchildren")
    // 获取 SPAN1_TR 下所有 td 元素
    const tdList = SPAN1_TR.getElementsByTagName('td')

    // 遍历 td 元素
    for (let i = 0; i < tdList.length; i++) {
        // 获取当前 td 元素下所有 span 元素
    const spanList = tdList[i].getElementsByTagName('span')

        // 遍历 span 元素
    for (let j = 0; j < spanList.length; j++) {
    // 给当前 span 元素添加鼠标移入事件监听器
    spanList[j].addEventListener('mouseover', function() {
      // 将字体颜色设置为红色
      spanList[j].style.color = 'red'

    })

    // 给当前 span 元素添加鼠标移出事件监听器
    spanList[j].addEventListener('mouseout', function() {
      // 将字体颜色恢复为默认颜色
      spanList[j].style.color = ''
    })
}
}

    const spans =document.querySelectorAll("tr#Trchildren td span")
     spans.forEach(span=>{
     span.addEventListener("click",()=>{
                var td=span.parentElement
                var link=td.querySelector("a")
                var text=link.textContent
                localStorage.removeItem(text)
                location.reload()
        })
    })





    addinput.addEventListener("click",function(){
    var url1=prompt("输入机种#xxxxx")
       //若填入值，则使用Storage储存href值
       if(url1)
       {
           var url="issuelist.aspx?project="+url1
           var url2=prompt("输入自定义机种名")
           url2="DUT_"+url2
     
          const Tbody=document.querySelector("#ctl00_CP1_ASPxTreeList1_D > tbody")
          Tbody.querySelectorAll("tr").forEach(function(tr){
              tr.querySelectorAll("td").forEach(function(td){
                  var a=td.querySelector("a")
                  //var aspan=td.querySelector("span")
                  if(a)
                  {
                     if (a.href.includes(url1))
                     {

                         var key=url2//aspan.innerText
                         localStorage.setItem(key,url)
                     }
                  }

              })

          })
                //并在做完这些操作后执行页面刷新重新显示新增的控件
                location.reload()

       }


    })



   // Your code here...
})();
