// ==UserScript==
// @name         GPA Calculator
// @version      1.2.1
// @description  A GPA Calculator of WHU
// @author       Jeoy_Pei
// @license MIT
// @match        https://jwgl.whu.edu.cn/cjcx/cjcx_cxDgXscj.html?*
// @grant        none
// @namespace https://greasyfork.org/users/929066
// @downloadURL https://update.greasyfork.org/scripts/447008/GPA%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/447008/GPA%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //方法count用来将该行表格统计入相应的数组
    function count(oTd, arr1, arr2)
    {
        var kcxz=oTd[5].innerText;
        kcxz=kcxz.substring(kcxz.length-2);
        var kcbj=oTd[13].innerText;
        var xf=Number(oTd[6].innerText);
        var xfj=Number(oTd[24].innerText);
        var cj=oTd[7].innerText;
        var xq=Number(oTd[2].innerText);
        var xfcj;
        var check=oTd[0].children[0];
        var checked=1;
        if(check.checked==true||check.checked==false)
        {
            checked=(check.checked?1:0);
        }

        if(cj!=="缓考")
        {
            xfcj=Number(cj)*xf;
            if(kcbj=="主修")
            {
                if(kcxz=="必修")
                {
                     arr1[xq*4-4]+=xfj*checked;
                     arr2[xq*4-4]+=xfcj*checked;
                     arr1[xq*4-3]+=xf*checked;
                     arr2[xq*4-3]+=xf*checked;
                }
                else
                {
                     arr1[xq*4-2]+=xfj*checked;
                     arr2[xq*4-2]+=xfcj*checked;
                     arr1[xq*4-1]+=xf*checked;
                     arr2[xq*4-1]+=xf*checked;
                }
            }
            else
            {
                 arr1[xq*2+10]+=xfj*checked;
                 arr2[xq*2+10]+=xfcj*checked;
                 arr1[xq*2+11]+=xf*checked;
                 arr2[xq*2+11]+=xf*checked;
            }
        }
    }

    //方法statistics用来将数据整理
    function statistics(term,score,avg,avgs)
    {
        avg[0]=term[0]/term[1];
        avg[1]=(term[0]+term[2])/(term[1]+term[3]);
        avg[2]=term[4]/term[5];
        avg[3]=(term[4]+term[6])/(term[5]+term[7]);
        avg[4]=term[8]/term[9];
        avg[5]=(term[8]+term[10])/(term[9]+term[11]);
        avg[6]=(term[0]+term[4]+term[8])/(term[1]+term[5]+term[9]);
        avg[7]=(term[0]+term[4]+term[8]+term[2]+term[6]+term[10])/(term[1]+term[5]+term[9]+term[3]+term[7]+term[11]);
        avg[8]=term[12]/term[13];
        avg[9]=term[14]/term[15];
        avg[10]=(term[12]+term[14])/(term[13]+term[15])
        avgs[0]= score[0]/ score[1];
        avgs[1]=( score[0]+ score[2])/( score[1]+ score[3]);
        avgs[2]= score[4]/ score[5];
        avgs[3]=( score[4]+ score[6])/( score[5]+ score[7]);
        avgs[4]= score[8]/ score[9];
        avgs[5]=( score[8]+ score[10])/( score[9]+ score[11]);
        avgs[6]=( score[0]+ score[4]+ score[8])/( score[1]+ score[5]+ score[9]);
        avgs[7]=( score[0]+ score[4]+ score[8]+ score[2]+ score[6]+ score[10])/( score[1]+ score[5]+ score[9]+ score[3]+ score[7]+ score[11]);
        avgs[8]= score[12]/ score[13];
        avgs[9]= score[14]/ score[15];
        avgs[10]=( score[12]+ score[14])/( score[13]+ score[15])
    }

    $(document).ready(function()
    {
        //插入统计表
        var div_data=document.getElementById("div-data");
        var innerContainer=document.getElementById("innerContainer");
        var oRes=document.createElement("div");
        oRes.innerHTML='<table class="jsres">    <tr class="jsres" id="row_0">        <th class="jsres" colspan="3">总平均</th>        <th class="jsres" colspan="4">学年</th>        <th class="jsres" colspan="4">学年</th>        <th class="jsres" colspan="4">学年</th>        <th class="jsres" colspan="4">学年</th>    </tr>    <tr class="jsres">        <th class="jsres" >必修课程</th>        <th class="jsres" >全部课程</th>        <th class="jsres" >辅修课程</th>        <th class="jsres" >学期</th>        <th class="jsres" >必修课程</th>        <th class="jsres" >全部课程</th>        <th class="jsres" >辅修课程</th>        <th class="jsres" >学期</th>        <th class="jsres" >必修课程</th>        <th class="jsres" >全部课程</th>        <th class="jsres" >辅修课程</th>        <th class="jsres" >学期</th>        <th class="jsres" >必修课程</th>        <th class="jsres" >全部课程</th>        <th class="jsres" >辅修课程</th>        <th class="jsres" >学期</th>        <th class="jsres" >必修课程</th>        <th class="jsres" >全部课程</th>        <th class="jsres" >辅修课程</th>    </tr>    <tr class="jsres" id="row_1">        <td class="jsres" rowspan="4"> </td>        <td class="jsres" rowspan="4"> </td>        <td class="jsres" rowspan="4"> </td>        <td class="jsres">1</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">1</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">1</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">1</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>    </tr>    <tr class="jsres" id="row_2">        <td class="jsres">2</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">2</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">2</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres">2</td>        <td class="jsres"> </td>        <td class="jsres"> </td>        <td class="jsres"> </td>    </tr>    <tr class="jsres" id="row_3">        <td class="jsres" >3</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >3</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >3</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >3</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>    </tr>        <tr class="jsres" id="row_4">        <td class="jsres" >总计</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >总计</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >总计</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" >总计</td>        <td class="jsres" > </td>        <td class="jsres" > </td>        <td class="jsres" > </td>    </tr>    </table><table><tr>        <td id="du" colspan="19" ><input type="button" id="select" value="多选模式"/>&nbsp&nbsp&nbsp<input type="button" id="dudu" value="嘟嘟"/></td>    </tr></table>';
        innerContainer.insertBefore(oRes,div_data);
        var oResss=document.getElementById("du");
        oResss.style.cssText="text-align:right;padding:16px;width:10000px";
        oRes.style.cssText="padding:40px；width:500px;overflow:auto;";
        var oRess=document.getElementsByClassName("jsres");
        for(var i=0;i<oRess.length;i++)
        {
            oRess[i].style.cssText="border:1px solid silver;text-align:center;padding:4px";
        }
        var dudu=document.getElementById("dudu");
        var select=document.getElementById("select");
        var sel_all=document.getElementById("jqgh_tabGrid_ck");
        select.onclick=function()
        {
            //加入复选框

            sel_all.innerHTML='<div id="jqgh_tabGrid_ck" class="ui-jqgrid-sortable"><input type="checkbox" /><span class="s-ico" style="display:none"><span sort="asc" class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"></span><span sort="desc" class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"></span></span></div>';
            var oTab=document.getElementById("tabGrid");
            var oTr=oTab.getElementsByTagName("tr");
            for(var i=1;i<oTr.length;i++)
            {
                oTr[i].children[0].innerHTML='<td role="gridcell" style="text-align:center;" title="" aria-describedby="tabGrid_ck"><input type="checkbox" /></td>';
            }

        }

        //判断是否点击了全选

        sel_all.onclick=function()
        {
            var checked=sel_all.children;
            checked=checked[0].children;
            checked=checked[0].checked;
            var oTab=document.getElementById("tabGrid");
            var oTr=oTab.getElementsByTagName("tr");
            if(checked)
            {

                for(var i=1;i<oTr.length;i++)
                {
                    oTr[i].children[0].children[0].checked=true;
                }
            }
            if(!checked)
            {
                for(var i=1;i<oTr.length;i++)
                {
                    oTr[i].children[0].children[0].checked=false;
                }
            }
        }


        //按键后动作
        dudu.onclick=function()
        {
            //获取表格元素
            var oTab=document.getElementById("tabGrid");
            var oTr=oTab.getElementsByTagName("tr");
            //构建学年数组，字符串类型
            var term=['0'];
            for(var i=1;i<oTr.length;i++)
            {   var flag=true;
                var oTrs=oTr[i];
                var xn;
                for(var j=0;j<term.length;j++)
                {
                    var oTds=oTrs.children;
                    if(oTds.length>2)
                    xn=oTds[1].innerText;
                    if(term[j]==xn)
                    flag=false;
                }
                if(flag==true)
                term.push(xn);
            }
            term.sort;
            //构建四个学年的每学期的必修，选修，辅修的学分绩之和和学分和
            var term_1=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var term_2=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var term_3=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var term_4=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var score_1=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var score_2=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var score_3=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var score_4=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            //遍历每一行，并将统计结果统计入上述四个数组
            for(i=1;i<oTr.length;i++)
            {
                var oTrs=oTr[i];
                var oTds=oTrs.children;
                if(oTds.length>1)
                {
                    var xn=oTds[1].innerText;
                    switch(xn)
                    {
                        case term[1]:
                            count(oTds,term_1,score_1);
                            break;
                        case term[2]:
                            count(oTds,term_2,score_2);
                            break;
                        case term[3]:
                            count(oTds,term_3,score_3);
                            break;
                        case term[4]:
                            count(oTds,term_4,score_4);
                            break;
                    }
                }

            }
            //将统计结果整理
            var avg_1=[0,0,0,0,0,0,0,0,0,0,0];
            var avg_2=[0,0,0,0,0,0,0,0,0,0,0];
            var avg_3=[0,0,0,0,0,0,0,0,0,0,0];
            var avg_4=[0,0,0,0,0,0,0,0,0,0,0];
            var avgs_1=[0,0,0,0,0,0,0,0,0,0,0];
            var avgs_2=[0,0,0,0,0,0,0,0,0,0,0];
            var avgs_3=[0,0,0,0,0,0,0,0,0,0,0];
            var avgs_4=[0,0,0,0,0,0,0,0,0,0,0];
            statistics(term_1,score_1,avg_1,avgs_1);
            statistics(term_2,score_2,avg_2,avgs_2);
            statistics(term_3,score_3,avg_3,avgs_3);
            statistics(term_4,score_4,avg_4,avgs_4);
            var avg_all=[0,0,0];
            avg_all[0]=(term_1[0]+term_1[4]+term_1[8]+term_2[0]+term_2[4]+term_2[8]+term_3[0]+term_3[4]+term_3[8]+term_4[0]+term_4[4]+term_4[8])/(term_1[1]+term_1[5]+term_1[9]+term_2[1]+term_2[5]+term_2[9]+term_3[1]+term_3[5]+term_3[9]+term_4[1]+term_4[5]+term_4[9]);
            avg_all[1]=(term_1[0]+term_1[4]+term_1[8]+term_2[0]+term_2[4]+term_2[8]+term_3[0]+term_3[4]+term_3[8]+term_4[0]+term_4[4]+term_4[8]+term_1[2]+term_1[6]+term_1[10]+term_2[2]+term_2[6]+term_2[10]+term_3[2]+term_3[6]+term_3[10]+term_4[2]+term_4[6]+term_4[10])/(term_1[1]+term_1[5]+term_1[9]+term_2[1]+term_2[5]+term_2[9]+term_3[1]+term_3[5]+term_3[9]+term_4[1]+term_4[5]+term_4[9]+term_1[3]+term_1[7]+term_1[11]+term_2[3]+term_2[7]+term_2[11]+term_3[3]+term_3[7]+term_3[11]+term_4[3]+term_4[7]+term_4[11]);
            avg_all[2]=(term_2[12]+term_2[14]+term_3[12]+term_3[14]+term_4[12]+term_4[14])/(term_2[13]+term_2[15]+term_3[13]+term_3[15]+term_4[13]+term_4[15]);
            var avgs_all=[0,0,0];
            avgs_all[0]=(score_1[0]+score_1[4]+score_1[8]+score_2[0]+score_2[4]+score_2[8]+score_3[0]+score_3[4]+score_3[8]+score_4[0]+score_4[4]+score_4[8])/(score_1[1]+score_1[5]+score_1[9]+score_2[1]+score_2[5]+score_2[9]+score_3[1]+score_3[5]+score_3[9]+score_4[1]+score_4[5]+score_4[9]);
            avgs_all[1]=(score_1[0]+score_1[4]+score_1[8]+score_2[0]+score_2[4]+score_2[8]+score_3[0]+score_3[4]+score_3[8]+score_4[0]+score_4[4]+score_4[8]+score_1[2]+score_1[6]+score_1[10]+score_2[2]+score_2[6]+score_2[10]+score_3[2]+score_3[6]+score_3[10]+score_4[2]+score_4[6]+score_4[10])/(score_1[1]+score_1[5]+score_1[9]+score_2[1]+score_2[5]+score_2[9]+score_3[1]+score_3[5]+score_3[9]+score_4[1]+score_4[5]+score_4[9]+score_1[3]+score_1[7]+score_1[11]+score_2[3]+score_2[7]+score_2[11]+score_3[3]+score_3[7]+score_3[11]+score_4[3]+score_4[7]+score_4[11]);
            avgs_all[2]=(score_2[12]+score_2[14]+score_3[12]+score_3[14]+score_4[12]+score_4[14])/(score_2[13]+score_2[15]+score_3[13]+score_3[15]+score_4[13]+score_4[15]);

            //将结果插入表格
            var row_0=document.getElementById("row_0").children;
            for(var i=1;i<term.length;i++)
            {
                row_0[i].innerText=term[i];
            }

            var row_1=document.getElementById("row_1").children;
            var row_2=document.getElementById("row_2").children;
            var row_3=document.getElementById("row_3").children;
            var row_4=document.getElementById("row_4").children;
            row_1[0].innerText=avg_all[0].toFixed(3)+"/"+avgs_all[0].toFixed(3);
            row_1[1].innerText=avg_all[1].toFixed(3)+"/"+avgs_all[1].toFixed(3);
            row_1[2].innerText=avg_all[2].toFixed(3)+"/"+avgs_all[2].toFixed(3);
            for(var i=0;i<3;i++)
            {
                if(row_1[i].innerText=="NaN/NaN")
                    row_1[i].innerText=" ";
            }

            for(var i=3;i<row_1.length;i++)
            {
                var avg;
                var avgs;
                var k=i-3;
                var j=Math.floor(k/4);
                switch(j)
                {
                    case 0:avg=avg_1;avgs=avgs_1;break;
                    case 1:avg=avg_2;avgs=avgs_2;break;
                    case 2:avg=avg_3;avgs=avgs_3;break;
                    case 3:avg=avg_4;avgs=avgs_4;break;
                }
                switch(k-4*j)
                {
                    case 0:break;
                    case 1:row_1[i].innerText=avg[0].toFixed(3)+"/"+avgs[0].toFixed(3);break;
                    case 2:row_1[i].innerText=avg[1].toFixed(3)+"/"+avgs[1].toFixed(3);break;
                    case 3:row_1[i].innerText=avg[8].toFixed(3)+"/"+avgs[8].toFixed(3);break;
                }
                if(row_1[i].innerText=="NaN/NaN")
                    row_1[i].innerText=" ";
            }

            for(var i=0;i<row_2.length;i++)
            {
                var avg;
                var k=i;
                var j=Math.floor(k/4);
                switch(j)
                {
                    case 0:avg=avg_1;avgs=avgs_1;break;
                    case 1:avg=avg_2;avgs=avgs_2;break;
                    case 2:avg=avg_3;avgs=avgs_3;break;
                    case 3:avg=avg_4;avgs=avgs_4;break;
                }
                switch(k-4*j)
                {
                    case 0:break;
                    case 1:row_2[i].innerText=avg[2].toFixed(3)+"/"+avgs[2].toFixed(3);break;
                    case 2:row_2[i].innerText=avg[3].toFixed(3)+"/"+avgs[3].toFixed(3);break;
                    case 3:row_2[i].innerText=avg[9].toFixed(3)+"/"+avgs[9].toFixed(3);break;
                }
                if(row_2[i].innerText=="NaN/NaN")
                    row_2[i].innerText=" ";
            }

            for(var i=0;i<row_3.length;i++)
            {
                var avg;
                var k=i;
                var j=Math.floor(k/4);
                switch(j)
                {
                    case 0:avg=avg_1;avgs=avgs_1;break;
                    case 1:avg=avg_2;avgs=avgs_2;break;
                    case 2:avg=avg_3;avgs=avgs_3;break;
                    case 3:avg=avg_4;avgs=avgs_4;break;
                }
                switch(k-4*j)
                {
                    case 0:break;
                    case 1:row_3[i].innerText=avg[4].toFixed(3)+"/"+avgs[4].toFixed(3);break;
                    case 2:row_3[i].innerText=avg[5].toFixed(3)+"/"+avgs[5].toFixed(3);break;
                    case 3:row_3[i].innerText="NaN";break;
                }
                if(row_3[i].innerText=="NaN/NaN"||row_3[i].innerText=="NaN")
                    row_3[i].innerText=" ";
            }

            for(var i=0;i<row_4.length;i++)
            {
                var avg;
                var k=i;
                var j=Math.floor(k/4);
                switch(j)
                {
                    case 0:avg=avg_1;avgs=avgs_1;break;
                    case 1:avg=avg_2;avgs=avgs_2;break;
                    case 2:avg=avg_3;avgs=avgs_3;break;
                    case 3:avg=avg_4;avgs=avgs_4;break;
                }
                switch(k-4*j)
                {
                    case 0:break;
                    case 1:row_4[i].innerText=avg[6].toFixed(3)+"/"+avgs[6].toFixed(3);break;
                    case 2:row_4[i].innerText=avg[7].toFixed(3)+"/"+avgs[7].toFixed(3);break;
                    case 3:row_4[i].innerText=avg[10].toFixed(3)+"/"+avgs[10].toFixed(3);break;
                }
                if(row_4[i].innerText=="NaN/NaN")
                    row_4[i].innerText=" ";
            }

        }
    }
)})();