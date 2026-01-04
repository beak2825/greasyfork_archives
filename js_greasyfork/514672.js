// ==UserScript==
// @name         mei94-古诗文-空白
// @namespace    vx:shuake345
// @version      2024-10-24
// @description  vx:shuake345
// @author       vx:shuake345
// @match        http://gu.mei94.com/xiao/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mei94.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514672/mei94-%E5%8F%A4%E8%AF%97%E6%96%87-%E7%A9%BA%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514672/mei94-%E5%8F%A4%E8%AF%97%E6%96%87-%E7%A9%BA%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

//---------------------------------------------------------------下面删掉2个“/”然后复制软件里面内容进行题目添加---------------------------------------------------------------
    //var arrayA = 
    //var arrayB = 
//---------------------------------------------------------------上面删掉2个“/”然后复制软件里面内容进行题目添加---------------------------------------------------------------
    function findCorrespondingValue(text) {
            const index = arrayA.indexOf(text);
            if (index!== -1) {
                return arrayB[index];
            } else {
                return null;
            }
        }

    function DAti(){
        var Tm=document.querySelectorAll("div.tiMuBox> div.dan-bt")
        for (var i = 0; i < Tm.length; i++) {
            if (Tm[i].attributes[1].value=='display: block;') {
                var Timu=Tm[i].innerText.split(" ").join("");
                //console.log(Timu)
                const inputText = Timu;
                const result = findCorrespondingValue(inputText);
                //console.log(result);
                var DAan="img.xuan-"+result
                //console.log(DAan);
                if(document.querySelector(DAan)!==null){
                document.querySelector(DAan).click()
                }
                break;
            }
        }
    }
    setInterval(DAti,1000)

})();