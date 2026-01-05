// ==UserScript==
// @name         tc-rpt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://192.168.0.11/taichungrpt/%E8%AA%BF%E5%BA%A6%E5%8D%B3%E6%99%82%E8%B3%87%E8%A8%8A/tabid/195/Default.aspx
// @match        http://192.168.0.11/taichungrpt/*
// @match        file:///D:/iubik1.html
// @match        D:/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17450/tc-rpt.user.js
// @updateURL https://update.greasyfork.org/scripts/17450/tc-rpt.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...


function tableRowDisplayHide( TableID)  
{
   //var TableID="dnn_ctr594_InqSPARA_grdSPARA";  
   var jsontxt=
    '{"bikes": [ {"sno":3001,"wday":35,"rday":35,"area":"A"},'+
             '{"sno":3002, "wday":50,"rday":55,"area":"A"},'+
             '{"sno":3003,"wday":30,"rday":35,"area":"A"},'+
              '{"sno":3004,"wday":30,"rday":35,"area":"A"},'+  
           '{"sno":3005,"wday":35,"rday":30,"area":"A"},'+
           '{"sno":3006,"wday":20,"rday":25,"area":"A" },'+
           '{"sno":3007,"wday":30,"rday":25,"area":"A" },'+
           '{"sno":3008,"wday":18,"rday":18,"area":"A" },'+
           '{"sno":3009,"wday":20,"rday":22,"area":"B"},'+ 
            '{"sno":3010,"wday":20,"rday":15,"area":"A" },'+
           '{"sno":3011,"wday":35,"rday":25,"area":"A" },'+
           '{"sno":3012,"wday":25,"rday":25,"area":"D" },'+
           '{"sno":3013,"wday":30,"rday":30,"area":"B" },'+
           '{"sno":3014,"wday":25,"rday":25,"area":"C" },'+
           '{"sno":3015,"wday":50,"rday":40,"area":"D" },'+
           '{"sno":3016,"wday":15,"rday":20,"area":"D" },'+
           '{"sno":3017,"wday":30,"rday":30,"area":"B" },'+
           '{"sno":3018,"wday":35,"rday":30,"area":"C" },'+
           '{"sno":3019,"wday":35,"rday":30,"area":"B" },'+
            '{"sno":3020,"wday":35,"rday":30,"area":"B" },'+
           '{"sno":3021,"wday":25,"rday":18,"area":"B" },'+
           '{"sno":3022,"wday":40,"rday":40,"area":"C" },'+
            '{"sno":3023,"wday":25,"rday":25,"area":"B" },'+
           '{"sno":3024,"wday":15,"rday":25,"area":"B" },'+
           '{"sno":3025,"wday":20,"rday":20,"area":"B" },'+
            '{"sno":3026,"wday":6,"rday":24,"area":"C" },'+
           '{"sno":3027,"wday":30,"rday":25,"area":"C" },'+
           '{"sno":3028,"wday":16,"rday":20,"area":"C" },'+
           '{"sno":3029,"wday":30,"rday":30,"area":"D" },'+
            '{"sno":3030,"wday":31,"rday":26,"area":"D" },'+
            '{"sno":3031,"wday":12,"rday":18,"area":"C" },'+
           '{"sno":3032,"wday":10,"rday":26,"area":"D" },'+
           '{"sno":3033,"wday":10,"rday":20,"area":"C"  },'+
            '{"sno":3034,"wday":30,"rday":20,"area":"B" },'+
           '{"sno":3035,"wday":10,"rday":25,"area":"D" },'+
           '{"sno":3036,"wday":30,"rday":30,"area":"B" },'+
           '{"sno":3037,"wday":30,"rday":25,"area":"B" },'+
           '{"sno":3038,"wday":35,"rday":25,"area":"D" },'+
           '{"sno":3039,"wday":25,"rday":25,"area":"D" },'+
           '{"sno":3040,"wday":20,"rday":20,"area":"D" },'+
            '{"sno":3041,"wday":40,"rday":30,"area":"C"},'+
            '{"sno":3042,"wday":10,"rday":25,"area":"C" },'+
           '{"sno":3043,"wday":25,"rday":25,"area":"D" },'+
           '{"sno":3044,"wday":30,"rday":25,"area":"D" },'+
           '{"sno":3045,"wday":30,"rday":35,"area":"A" },'+
           '{"sno":3046,"wday":24,"rday":24,"area":"B" },'+
            '{"sno":3047,"wday":45,"rday":35,"area":"C"},'+
            '{"sno":3048,"wday":20,"rday":20,"area":"A" },'+
            '{"sno":3049,"wday":20,"rday":20,"area":"B" },'+
            '{"sno":3050,"wday":16,"rday":25,"area":"A" },'+
           '{"sno":3051,"wday":20,"rday":18,"area":"A" },'+
           '{"sno":3052,"wday":25,"rday":30,"area":"D" },'+
           '{"sno":3053,"wday":30,"rday":30,"area":"D" },'+
           '{"sno":3054,"wday":23,"rday":23,"area":"B" },'+
            '{"sno":3055,"wday":25,"rday":25,"area":"A" },'+
           '{"sno":3056,"wday":25,"rday":25,"area":"D" },'+
           '{"sno":3058,"wday":20,"rday":20,"area":"C" },'+
            '{"sno":3059,"wday":20,"rday":20,"area":"B" },'+
           '{"sno":3060,"wday":25,"rday":25,"area":"C" },'+
            '{"sno":3057,"wday":20,"rday":25,"area":"C" },'+
            '{"sno":3074,"wday":30,"rday":30,"area":"C" },'+
           '{"sno":3071,"wday":20,"rday":20,"area":"D" },'+
           '{"sno":3063,"wday":20,"rday":20,"area":"C" },'+
            '{"sno":3064,"wday":20,"rday":25,"area":"D" },'+
           '{"sno":3070,"wday":20,"rday":20,"area":"D" },'+
            '{"sno":3072,"wday":18,"rday":20,"area":"C" },'+
            '{"sno":3076,"wday":20,"rday":20,"area":"C" },'+
           '{"sno":3062,"wday":20,"rday":20,"area":"D" },'+
            '{"sno":3061,"wday":20,"rday":20,"area":"C" },'+
            '{"sno":3067,"wday":20,"rday":20,"area":"C" },'+
           '{"sno":3065,"wday":20,"rday":20,"area":"C" } ]  } ';
   
   
   var thistbl = document.getElementById(TableID); 
      // thistbl.write('<tbody>');
   var tablength;
   var trRow=thistbl.getElementsByTagName('tr');
   var i;
   var str1,spanid;
   var tdspans=trRow[1].getElementsByTagName('span');    //tdspans[0].innerHTML=30001, tdspans[1].innerHTML=逢甲大學
   
   var firsttdspans=trRow[0].getElementsByTagName('span');
   firsttdspans[6].innerHTML="平日";    //修改標顯
   firsttdspans[7].innerHTML="假日";    //修改標顯
   
   
   //for(i=0;i<tdspans.length;i++)  { str1=str1+"\n"+i+"="+tdspans[i].innerHTML};
   //alert("tablength "+tdspans[0].innerHTML+","+tdspans[1].innerHTML); 
   
   //隱藏彰化 
  
   for(i=0;i<trRow.length;i++)  
   {  
     tdspans=trRow[i].getElementsByTagName('span');
     spanid=Number(tdspans[0].innerHTML); 
     if(spanid>4000) { 
       trRow[i].style.display = false ? '' : 'none' ; 
     } //隱藏彰化
     var Trtd=trRow[i].getElementsByTagName('td'); 
      Trtd[9].style.display='none';         //隱藏欄位
      Trtd[11].style.display='none'  ;
     // Trtd[10].style.display='none';
     Trtd[12].style.display='none'  ;   
     Trtd[13].style.display='none'  ;
   } 
       
    
  //分區                          
  
   var obj = JSON.parse(jsontxt); 
   var bikes=obj.bikes;
   var j;
   var spanNum,sno,test1; 
                            
   for(i=1;i<trRow.length;i++)  
   {  
     tdspans=trRow[i].getElementsByTagName('span');
     spanid=Number(tdspans[0].innerHTML);
     spanNum=Number(tdspans[3].innerHTML);  
    // if(spanid>4000) {  trRow[i].style.display = false ? '' : 'none';  };  //隱藏彰化     
    //  console.log(spanid);    

   //  if(spanid>4000) { break; }; 
     for(j=0;j<bikes.length;j++)  
     { 
       // spanid=tdspans[0].innerHTML;
       //  sno=bikes[j].sno;
        if (spanid==bikes[j].sno) 
        {         
          //spanNum=spanNum-
         // tdspans[6].innerHTML=bikes[j].wday; //平日 
         // tdspans[7].innerHTML=bikes[j].rday; //假日
         tdspans[6].innerHTML=bikes[j].wday+"("+(spanNum-(Number(bikes[j].wday)))+")"; //平日有計笡
         tdspans[7].innerHTML=bikes[j].rday+"("+(spanNum-(Number(bikes[j].rday)))+")"; //假日有計笡
          
             
          var spanIMG=tdspans[9].getElementsByTagName('IMG');
          var IMGsrc=spanIMG[0].getAttribute('src'); 
         // tdspans[0].style.backgroundColor ='Orange';
          if (IMGsrc=='/images/L02.gif') {tdspans[0].style.backgroundColor ='Yellow'; } //少車
          if (IMGsrc=='/images/L01.gif') {tdspans[0].style.backgroundColor ='red'; } //多車
          if ((tdspans[15].innerHTML!=='') || (tdspans[16].innerHTML!=='')) {tdspans[1].style.backgroundColor ='red'; } //空爆計時
          
          console.log("for j "+tdspans[15].innerHTML+"  "+tdspans[16].innerHTML);   
          break;
        } 
     
     }   
 
   } 

} 


window.onload=tableRowDisplayHide( "dnn_ctr594_InqSPARA_grdSPARA") ;

   
