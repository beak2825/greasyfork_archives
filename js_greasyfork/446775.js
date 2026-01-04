// ==UserScript==
// @name        云南二手车业务平台数据复制
// @namespace   Violentmonkey Scripts
// @match       https://yn.esclt.net/bfdj-show.jsp*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/6/16 下午11:10:32
// @downloadURL https://update.greasyfork.org/scripts/446775/%E4%BA%91%E5%8D%97%E4%BA%8C%E6%89%8B%E8%BD%A6%E4%B8%9A%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%95%B0%E6%8D%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/446775/%E4%BA%91%E5%8D%97%E4%BA%8C%E6%89%8B%E8%BD%A6%E4%B8%9A%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%95%B0%E6%8D%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
  var iIntervalID = window.setInterval(myFunction,1000);
    var bfwgversion = "1.2";
    function myFunction(){
        if(document.getElementById('hp')!=null){
          var hp=document.getElementById('hp').innerHTML;
            document.getElementById('hp').innerHTML=hp+'<span style="font-size:20px;color:red;" >点我复制</span>';
            document.getElementById('hp').addEventListener('click',function(evt){
              $(this).fadeOut('slow').fadeIn('slow');
              let data=new Object();
              data.chepai=hp;
              data.ppxh=document.getElementById('ppxh').value;
               
              var sel=document.getElementById('hpzl');//select元素的id 
              var index=sel.selectedIndex;//获取被选中的option的索引 
              var textsel= sel.options[index].text;//获取相应的option的内容 
              data.phzl=textsel;
              
              data.cllx=document.getElementById('cllx').innerHTML;
              data.clsbdh=document.getElementById('clsbdh').innerHTML;
              
              data.fdjxh=document.getElementById('fdjxh').value;
              data.fdjh=document.getElementById('fdjh').value;
              
              data.syxz=document.getElementById('syxz').innerHTML;
              
              var s1=document.getElementById('ryzl');//select元素的id 
              var i1=s1.selectedIndex;//获取被选中的option的索引 
              var t1= s1.options[i1].text;//获取相应的option的内容 
              data.ryzl=t1;
              
              data.zairen=document.getElementById('zws').value;
              data.zzl=document.getElementById('zzl').value;
              data.zbzl=document.getElementById('zbzl').value;
              
              data.ccdjrq=document.getElementById('ccdjrq').value;
              
              data.isyd=document.getElementById('isyd').innerHTML;
              
              data.chezhu_name=document.getElementById('syr').value;
              data.chezhu_carid=document.getElementById('sfzmhm').innerHTML;
              data.chezhu_address=document.getElementById('dz').value;
              data.chezhu_mobile=document.getElementById('dh').value;
              navigator.clipboard.writeText(JSON.stringify(data));
              console.log(JSON.stringify(data));
              alert('复制成功');
                });
            window.clearInterval(iIntervalID);
        }
    }
	
})();