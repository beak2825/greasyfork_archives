// ==UserScript==
// @name         NGK火花塞匹配
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  666
// @author       You
// @match        https://market.dat881.com/intell/ngk/ngkApp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449041/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/449041/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //产品型号匹配数组
    var arr = [
        ["ILZFR5B","0104"],
        ["LZFR5F","0104"],
        ["BKR6EIX","0101"],
        ["BKR6EIX-11","0121"],
        ["BKR5EIX","0101"],
        ["SIFR6B7G","0101"],
        ["SIFR6B7G","0320"],
        ["BKR6EIX","0101"],
        ["ILZKR7B11S","0102"],
        ["LZKAR6AP-11","0103"],
        ["LZFR6AI","0104"],
        ["IZFR6K11","0105"],
        ["BKR5EIX-11","0106"],
        ["DCPR7EIX","0107"],
        ["BPR6EIX","0108"],
        ["ITR6F13","0109"],
        ["ILTR-5A13G","0110"],
        ["SILZNAR6D9","0111"],
        ["ZKER6A-10EG","0112"],
        ["ZFR5P-G","0113"],
        ["DILFR6D11","0114"],
        ["IFR6T11","0121"],
        ["SILZKR6B10E","0122"],
        ["ILKAR7B11","0123"],
        ["SILZKR7B11","0124"],
        ["DILKAR7G11GS","0125"],
        ["ILTR6E11","0126"],
        ["LFR6AIX-11","0127"],
        ["PFR7S8EG","0301"],
        ["PZFR6R","0303"],
        ["PKER7A8EGS","0304"],
        ["DILKAR8J9G","0305"],
        ["SILZNAR8C7H","0306"],
        ["ILTR6M9G","0307"],
        ["ILNAR8B7G","0308"],
        ["SILZKR8E8G","0310"],
        ["PLFER7A8EG","0312"],
        ["ILZKAR8H8S","0313"],
        ["SILZKAR7E8S","0314"],
        ["DILKAR7D11H","0315"],
        ["SILZKER8A8E","0319"],
        ["PFR6Q","0320"],
        ["DILFR7K9G","0321"],
        ["ILKFR8B7G","0323"],
        ["ILKER8C7G","0325"],
        ["ILZNAR8A7G","0326"],
        ["ILNFR7A7G","0328"],
        ["LKR8GI-8","0329"],
        ["ILZKAR8J8SY","0342"],
        ["LKAR8CI-8","0343"],
        ["ILKGR8A8","0344"],
        ["ILKAR7C10","0348"],
        ["SILZKAR8G7Y","0349"],
        ["LDK8RTBIP","0350"],
        ["ILTR7J8","0351"],
        [" ILKR9Q7G","0352"],
        ["PFR8S8EG","A2"],
        ["ILZKR8A","A5"],
        ["SILZKBR8D8S","B1"],
        ["ILZKBR7B8DG","B2"],
        ["ILZFR6D11","B3"],
        ["IZFR6H11","B4"],
        ["SILZKGR8B8S","B5"],
        ["ZKBR7A-HTU","B6"],
        ["PLKR7A","C1"],
        ["SILZKFR8D7S","C3"],
        ["ILFR6A","C6"],
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
        var path = '//tr[@class="result_table_tr"]/td[2]/b/text()';
        var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null);
        console.log(result);
        var xnodes = new Array();
        while(xres = result.iterateNext()){
            xnodes.push(xres);
        }
        //console.log(xnodes);
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
				if (content[len].textContent != ''){
                    var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody';
                    var r = document.evaluate(path,document).iterateNext();
                    //console.log(r);
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
					//console.log(content[len].textContent);
					for(var a=0;a<arr.length;a++){
					   // console.log(arr[a][0]);
					   // console.log(content[len].textContent == arr[len][0]);
						if(content[len].textContent == arr[a][0]){
							console.log(content[len].textContent+"="+arr[a][0]+"==="+arr[a][1]);
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