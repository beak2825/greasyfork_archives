// ==UserScript==
// @name         重置默认值
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  下版需要修改增加/在原版框内设置全组人的选项,测试状态需直接实现：直接能看到三个选项，且点击哪个就搜索哪个选项的状态,统计close数，plan数，ongoing数
// @author       W
// @match        http://172.16.30.90:8000/DataInquiry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=30.90
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466119/%E9%87%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/466119/%E9%87%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
   document.getElementById("ContentPlaceHolder1_txtQry0").type="list"
    //var node = document.createElement("datalist")
    //var Option_Name=document.create
    //document.querySelector("#ContentPlaceHolder1_pnl > table > tbody > tr:nth-child(3) > td:nth-child(3)").appendchild()
    var Datalist_Name=document.querySelector("#ContentPlaceHolder1_pnl > table > tbody > tr:nth-child(3) > td:nth-child(3)").insertBefore(document.createElement("datalist"),document.getElementById("ContentPlaceHolder1_txtQry0"))
    Datalist_Name.id="Datalist_Name"
    //Datalist_Name.addChild()

    //document.getElementById("ContentPlaceHolder1_txtQry1").remove();
    //document.getElementById("ContentPlaceHolder1_txtQry1").append("<select name="ctl00$ContentPlaceHolder1$txtQry1" value="Plan" maxlength="1500" id="ContentPlaceHolder1_txtQry1" style="background-color:White;height:16px;width:128px;">");

    if(document.getElementById("ContentPlaceHolder1_ddlCondition0").value=='')
     {
         Default_Value()
      //console.log("未转载")
      //0.3版本根据登录的自动填写登入人的plan机种
    
     }
    function Default_Value(){
     document.getElementById("ContentPlaceHolder1_ddlCondition0").value="AND TS_DQEModel.TestEng like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_ddlCondition1").value="AND TS_DQEModel.TestStatus like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_ddlCondition2").value="AND TS_DQEModel.DQEGroup like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_ddlCondition3").value="AND TS_DQEModel.OuterModel like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_ddlCondition4").value="AND TS_DQEModel.InnerModel like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_ddlCondition5").value="AND TS_DQEModel.TestCustomer like N'PXCONDITION%'"
     document.getElementById("ContentPlaceHolder1_txtQry0").value=document.getElementById("lblempAD").innerText
     document.getElementById("ContentPlaceHolder1_txtQry2").value="FOS"
     document.getElementById("ContentPlaceHolder1_txtQry1").value="Plan"
        for(var i=3;i<10;i++)
        {
            var Concat_String="#ContentPlaceHolder1_txtQry"
            var Temp
            Temp=Concat_String.concat(i.toString())
            document.querySelector(Temp).value=null
        }

     document.getElementById("ContentPlaceHolder1_imgsearch").click()
    }
    //得到 tr数，length-1获得最后一个tr数（最后的tr）
    //document.append("<input type ="button" onclick=(test())>")

    //需修改为可控按键
   // let select_btn = '<div id = "select_btn" style = "float:right;padding:10px 20px;background:green z-index:999;position:relative">'
   //document.querySelector("#form1 > div:nth-child(9)").appendChild(document.createElement("input"))
   //var test_table =document.querySelector("#form1 > div:nth-child(9) > table")
   var test1=document.querySelector("#ContentPlaceHolder1_pnl > table > tbody > tr:nth-child(3) > td.auto-style18").insertBefore(document.createElement("INPUT"),document.getElementById("ContentPlaceHolder1_ddlExcel"))
   //test_table.id="test_table"
   //var test1 =document.querySelector("#form1 > div:nth-child(9)").appendChild(document.createElement("INPUT"))
   test1.type="button"
   test1.id="test_btn"
   //test1.innerText="click"
   test1.value="下一页"//改进，能直接跳转至最后一页
   test1.style="positon:relative;margin-top:-100px"
   test1.onclick = function(){
    if(document.getElementById("ContentPlaceHolder1_txtQry1").value=="close"){
    var Table_tr_Number = document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children.length-1;
    document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children[Table_tr_Number].querySelector("td>a").click()
    }
   }
    document.querySelector("#ContentPlaceHolder1_txtQry9").placeholder="输入Last跳转最后一页"
    if(document.querySelector("#ContentPlaceHolder1_txtQry9").value=="Last")
    {
    var Table_tr_Number = document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children.length-1;
    document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children[Table_tr_Number].querySelector("td>a").click()

    }


    //清空
    var test2=document.querySelector("#ContentPlaceHolder1_pnl > table > tbody > tr:nth-child(3) > td.auto-style18").insertBefore(document.createElement("INPUT"),document.querySelector("#test_btn"))
    test2.type="button"
    test2.id="test_btn2"
    test2.value="清空"
    test2.style="positon:relative"
    test2.onclick = function(){
    //var target =document.querySelector("#ContentPlaceHolder1_pnl > table > tbody ")
    //var Second_Children = document.querySelector("#ContentPlaceHolder1_pnl > table > tbody ").children[2]
    //var Children_length =document.querySelector("#ContentPlaceHolder1_pnl > table > tbody ").children.length-1
        for(var i=0;i<10;i++)
    {
        var Concat_String="#ContentPlaceHolder1_txtQry"
        var Temp
        Temp=Concat_String.concat(i.toString())
//alert(Temp)
        document.querySelector(Temp).value=null
//document.querySelector("#ContentPlaceHolder1_pnl > table > tbody ").chidren[i].querySelector("td:nth-child(3)>input").value=null
    }
    }

    var test3=document.querySelector("#ContentPlaceHolder1_pnl > table > tbody > tr:nth-child(3) > td.auto-style18").insertBefore(document.createElement("INPUT"),document.querySelector("#test_btn"))
    test3.type="button"
    test3.id="test_btn3"
    test3.value="默认"
    test3.style="positon:relative"
    test3.onclick = function(){
    Default_Value()
    }
   // var test2=document.querySelector("#ContentPlaceHolder1_ddlCondition9").appendChild(document.createElement("OPTION"))
   // test2.id="test2_Option"
    //test2.innerText="倒叙查询"

    //test1.onclick=myFunction()
 // function myFunction(){
  //}


   // if(document.getElementById("ContentPlaceHolder1_txtQry1").value==" ")
    //{
      //  var Table_tr_Number = document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children.length-1;


    //var Table_tr_Number = document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children[10] length-1
    //最后一页点击
    //document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody>tr").children[Table_tr_Number].querySelector("td>a").click()
     //document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(10) > a")
//document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td > table > tbody")
  //  }
    //确认到 表的1，23，4那行tbody上
//document.querySelector("#ContentPlaceHolder1_dvResult > tbody > tr:nth-child(1) > td>table>tbody")


})();