// ==UserScript==
// @name         USTrademarkSearch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Everest
// @match        http://tmsearch.uspto.gov/bin/showfield*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28285/USTrademarkSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/28285/USTrademarkSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var i = document.getElementsByTagName("tbody");
    console.log(i[2]);
    if (false && i.length > 0) {
        for (var ii = 0; ii < i.length; ii++) {
            var text = i[ii].innerText;
           if(text != undefined && text.indexOf("TESS") == 0) {
               console.log(text);
           }
        }
    }
    
    if(i.length >= 3) {
        let divs = i[2].getElementsByTagName("div");
        let input = document.createElement("input");
        input.setAttribute("id","kw");
        input.setAttribute("type","text");
        input.setAttribute("column","20");
        let ccInput = document.createElement("input");
        ccInput.setAttribute("id","cc");
        ccInput.setAttribute("type","text");
        ccInput.setAttribute("style","width:40px;");
        ccInput.setAttribute("value","2");
        
        let btn = document.createElement("input");
        btn.setAttribute("id", "process");
        btn.setAttribute("value", "Process");
        btn.setAttribute("type", "button");
                      
        let textArea = document.createElement("textarea");
        textArea.setAttribute("name", "output");
        textArea.setAttribute("id", "output");
        textArea.setAttribute("cols", "50");
        textArea.setAttribute("rows", "10");
        textArea.setAttribute("spellcheck", "false");
        
        let textAreaDiv = document.createElement("div");
        textAreaDiv.setAttribute("style", "margin-left:360px;margin-top:10px;");
        textAreaDiv.appendChild(textArea);
        
        btn.addEventListener("click", function(e){
            let p = input.value;
            let pArr = p.split('');
            console.log(pArr);
            let outstr = "";
            let pstr = "";
           
            //？的个数
            let cc = isNaN(ccInput.value) ? 1 : parseInt(ccInput.value);
            console.log(cc);
            for (let i = 1; i <= cc; i++) {
                for(let j = 0; j < pArr.length; j++) {
                    if (i < 3) {
                        j = -1;
                    }
                    for(let jj = j + 1; jj < pArr.length; jj++) {
                        if (i < 2) {
                            jj = -1;
                        }
                        for(let jjj = jj + 1; jjj < pArr.length; jjj++) {
                            pstr = "";
                            for (let jjjj = 0; jjjj < pArr.length; jjjj++) {
                                if( j== jjjj || jj == jjjj || jjj == jjjj) {
                                    pstr += "?";
                                } else {
                                    pstr += pArr[jjjj];
                                }
                            }
                            pstr = "(live)[LD] AND (*"+pstr+"*)[COMB] AND (009)[IC]" + "\r";
                            outstr += pstr;
                            console.log(pstr);
                        }
                        if (jj == -1) {
                            break;
                        }
                    }
                    if (j == -1) {
                        break;
                    }

                }
            }
            
            

            textArea.value = outstr;
        });

        
        divs[0].appendChild(input);
        divs[0].appendChild(ccInput);
        divs[0].appendChild(btn);
        divs[0].parentNode.appendChild(textAreaDiv);
        
    }
    
    
})();