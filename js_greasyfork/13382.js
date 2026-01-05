// ==UserScript==
// @name         revadburst - PTC Main
// @namespace    http://revadburst.com
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://revadburst.com/ptcads.php
//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13382/revadburst%20-%20PTC%20Main.user.js
// @updateURL https://update.greasyfork.org/scripts/13382/revadburst%20-%20PTC%20Main.meta.js
// ==/UserScript==

////*[@id="contain"]/article/div/div[1]/table/tbody/tr/td/div[5]/a/table/tbody/tr[3]/td/table/tbody/tr/td[2]
//var x = document.getElementsByTagName("BUTTON")[0].childNodes[0].nodeValue;

//var x = document.getElementsByTagName("BUTTON")[0].childNodes[0].nodeValue ;


function check(path) { 

    var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    alert(result.singleNodeValue.textContent);
    if (result.singleNodeValue.textContent.length>2) return false
    else return true;
}
function get(path) { 

    var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    result.singleNodeValue.click();
    return result.singleNodeValue.textContent;
}

function quet(){
    var x,y, isViewed, linkView, myDivNode,path,result, section,i, node;

    var evaluator = new XPathEvaluator(); 

    section=1; 
    path = '//*[@id="contain"]/article/div/div[1]/table/tbody/tr/td';

    result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    // alert(result.singleNodeValue.textContent);
    i = result.singleNodeValue.children.length;
    alert('length=' + i);
    if (i>1)
        for (var j=1; j<=i; j++){
            x = '//*[@id="contain"]/article/div/div[1]/table/tbody/tr/td/div[' +j+ ']/a/table/tbody/tr[3]/td/table/tbody/tr/td[2]';
            y= '//*[@id="contain"]/article/div/div[1]/table/tbody/tr/td/div[' +j+ ']/a/table/tbody/tr[1]/td/div/a';
            //alert('x='+x);
            if (check(x)) {
                
                alert(get(y));
                break;
            }
        }
    else {
        x = '//*[@id="contain"]/article/div/div[1]/table/tbody/tr/td/div/a/table/tbody/tr[3]/td/table/tbody/tr/td[2]';
        y= '//*[@id="contain"]/article/div/div[1]/table/tbody/tr/td/div/a/table/tbody/tr[1]/td/div/a';
        //if (check(x)) {alert(get(y));break;}
    }



}
quet();






