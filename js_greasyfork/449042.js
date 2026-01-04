// ==UserScript==
// @name         火炬火花塞匹配
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  666
// @author       You
// @match        https://market.dat881.com/intell/dir19/xhjApp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449042/%E7%81%AB%E7%82%AC%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/449042/%E7%81%AB%E7%82%AC%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //产品型号匹配数组
    var arr = [
        ["K6RTC","0101"],
        ["K6RBIU","0105"],
        ["K6RIU","0105"],
        ["K6RG","0105"],
        ["K5RAUY-11","0105"],
        ["LDK7RBIU","0102"],
        ["TORCH13-37428","0313"],
        ["TORCH24-37438","0324"],
        ["LD7RBIU","0125"],
        ["LD7RJII-11","0125"],
        ["K6RUY-11","0121"],
        ["KH6RHII-11","0114"],
        ["LD7RIU","0123"],
        ["8747(焰Pro)","0123"],
        ["LD7RLI-11","0123"],
        ["LD7RHII-11","0123"],
        ["TORCH5-3748","0305"],
        ["LD8RHII","0305"],
        ["TORCH21-3477","0321"],
        ["KH7RKII","0321"],
        ["8746（焰Pro）","0103"],
        ["LD6RAIU","0103"],
        ["LD7REII-67717(焰Pro)","0315"],
        ["TORCH15-3777","0315"],
        ["Q6RTP-13","0109"],
        ["QH6RTI-13","0110"],
        ["TORCH17-31416","0317"],
        ["TORCH6-3948","0306"],
        ["TORCH8-3848","0308"],
        ["QH6RTI","0126"],
        ["TORCH27-31426","0307"],
        ["TORCH7-3146","0307"],
        ["OE206","0343"],
        ["8846（焰Pro）","0111"],
        ["YH6RAIU","0111"],
        ["TORCH28-38427","0328"],
        ["TORCH4+3547","0304"],
        ["DK7RHII","0304"],
        ["TORCH20-32417","0320"],
        ["TORCH3-3326","0303"],
        ["A2","A2"],
        ["A1","0301"],
        ["TORCH1+3247","0301"],
        ["K7RHII","0301"],
        ["A1","0301"],
        ["A5","A5"],
        ["DK7RTAI","0112"],
        ["DK7RTA","0112"],
        ["8345（焰Pro）","113"],
        ["K5rTSIU","113"],
        ["K5rTS","113"],
        ["A4","0312"],
        ["KH7RJII","0312"],
        ["LDK7RAUY","0122"],
        ["86417（焰Pro）","0122"],
        ["LDK7RAIU","0122"],
        ["TORCH10-36428","0310"],
        ["LDK7RAUY","0124"],
        ["86417（焰Pro）","0124"],
        ["LDK7RAIU","0124"],
        ["DK7RTC","0107"],
        ["DK7RTI","0107"],
        ["TORCH23-37458","0323"],
        ["K6RTM3","0127"],
        ["OE201","0127"],
        ["LZFR6AI","0127"],
        ["TORCH29-36418","0309"],
        ["LD8RLII","0324"],
        ["TORCH24-37438","0324"],

    ]

    var content =new Array();
	var new_content =new Array();
    // 封装xpath
     function getElebyXpath(xpath){
         var ele = document.evaluate(xpath,document).iterateNext();
         return ele;
     }

    //取节点
    function getXpath(){
        //节点位置
        var xres;
        var path = '//span[@class="productNo"]';
        var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null);
        //console.log(result);
        var xnodes = new Array();
        while(xres = result.iterateNext()){
            xnodes.push(xres.innerHTML.trim());
            //console.log(xres.innerHTML.trim());
        }
        return xnodes;

    }

    let timer = setInterval(function () { //每5秒刷新一次图表
         //定时执行
        content = getXpath();
        //console.log(content.sort().toString());
        //console.log(new_content.sort().toString());

        if(content.sort().toString() != new_content.sort().toString()){
			var cont = 0; //计数器
            new_content = content;

			for(var len=0;len<content.length;len++){
                //console.log(content[len]);
				if (content[len] != ''){
                    var path = '//*[@class="table table-bordered"]/tbody';
                    var r = document.evaluate(path,document).iterateNext();
                    //console.log(r);
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
					//console.log(content[len]);
					for(var a=0;a<arr.length;a++){
					    //console.log(arr[a][0]);
					    console.log(content[len] +"=="+ arr[len][0]);
						if(content[len] == arr[a][0]){
							console.log(content[len]+"="+arr[a][0]+"==="+arr[a][1]);
							td1.innerHTML = "特耐士型号";
                            //显示火花塞型号
							td2.innerHTML = arr[a][0]+"=="+arr[a][1];
                            td2.style.color = 'green';
							r.appendChild(tr);
							tr.appendChild(td1);
							tr.appendChild(td2);
							//console.log(td);
							cont = cont+1;
						}
					//clearInterval(timer);
					}
					}
                if(cont == 0){
						td1.innerHTML = "特耐士型号"
						td2.innerHTML = content[len].textContent+"==匹配不到型号!";
                        td2.style.color = 'red';
                        r.appendChild(tr);
						tr.appendChild(td1);
						tr.appendChild(td2);
				}
			}
		}
    }, 3000);

    //console.log();


    // Your code here...
})();