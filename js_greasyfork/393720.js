// ==UserScript==
// @name         4kmao去广告-1，判断ID值，挺号的
// @namespace    http://*/*
// @version      0.1
// @description  try to take over the world!
// @author       eggplant
// @match        http://m.kkkkmao.com/*
// @grant        none
// @compatible   chrome
// @incompatible IE678
// @downloadURL https://update.greasyfork.org/scripts/393720/4kmao%E5%8E%BB%E5%B9%BF%E5%91%8A-1%EF%BC%8C%E5%88%A4%E6%96%ADID%E5%80%BC%EF%BC%8C%E6%8C%BA%E5%8F%B7%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/393720/4kmao%E5%8E%BB%E5%B9%BF%E5%91%8A-1%EF%BC%8C%E5%88%A4%E6%96%ADID%E5%80%BC%EF%BC%8C%E6%8C%BA%E5%8F%B7%E7%9A%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.setTimeout(main,500);       
window.setTimeout(main,1000);      
    
//    main();								
    function main()				
    {                              
        var list1 = document.getElementsByTagName("img");
        var list12 = document.getElementsByTagName("div");
        var list2 = document.getElementsByTagName("brde");
        var alllist=[list12,list2];


        for(var i = 0 ; i < list1.length ; i++)				
        {		
            if(list1[i].id&&list1.length)					
            {
                var tmp=list1[i].id.substr(0,4);			//获取ID，然后截取字符串的前四位（和父ID的前几位是相同的，搜索前几位就行）			
                for(var k = 0 ; k < alllist.length ; k++)	
                {
                    for(var j = 0 ; j < alllist[k].length ; j++)  
                    {
                        var Lid=alllist[k][j].id;
                        if(Lid&&alllist[k].length)					
                        {
                            if(Lid.indexOf(tmp)>-1)						//判断和广告图片id前几位相同的元素，		
                            {						
                                alllist[k][j].style.display = "none";		
                            }
                        }
                    }	
                }	

            }
        }	
    }
    // Your code here...
})();

