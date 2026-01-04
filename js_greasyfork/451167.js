// ==UserScript==
// @name         highlight yahoo tw news title demo
// @description  Unreliable News
// @namespace    tw_yahoo_news_list
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://tw.news.yahoo.com/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEAIACoEAAAJgAAABAQAAABACAAaAQAAM4QAAAoAAAAIAAAAEAAAAABACAAAAAAAIAQAAAAAAAAAAAAAAAAAAAAAAAAhAA7/3ADNchvBDaHbwU2RGQAMAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZAAwBW8FNkRvBDaHbwM0x4QAO/+EADv/cAAz/28AM/9uADP/cQAz+W4BM99yAzfAbgQ1mG8FNnVwBzhQbgU3KWkAMg0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG0AMwtuBTYqcQc4UG8FN3RuBDWbbgM0vm4BM95xADP5bgAz/24AM/9wADP/hAA7/4QAO/9xADP/cwA0/3MANP92ADX/cQA0/3IANP9xADT/cQE0/3EBNf9xAjX/cQI1/3ECNPtwAzT2cgM17nADNO5xAzTucQM07nEDNfRxAjT7cgI1/3ECNf9xAjX/cQE1/3EBNP9xADP/cgA0/3UANf9zADT/cgAz/3AAM/+EADv/hAA7/3QANf93ADX/dgA1/3kANv91ADX/dwE2/3gBN/94Ajf/dwI3/3gCOP95Azj/eQM5/3oEOf96BDn/dgQ3/3cEOf95BDn/egQ5/3YEOP92Azf/dgM4/3YCN/92Ajb/dgI2/3YBNv96ATf/eAA2/3YANf90ADX/cgAz/4QAO/+EADv/dQA1/3gANv97ADf/eQA2/3kBN/96ATj/fAI4/30COf9/Azv/gAQ8/4EEPP9+BDz/fwQ8/4AFPP97BTr/fAU7/30FO/96BTr/ewQ6/3wEOv96BDr/ewQ6/3sDOf97Ajn/gAI6/3sBOP98ATj/dwA2/3QANf90ADX/hAA7/4QAO/92ADX/egA3/38AOf99ATj/fQE5/38COf+AAjv/gAM7/4IEPP+DBD3/ggU9/4MFPv+EBT7/hQU//4AGPf+BBj7/ggY+/4MFPv+EBT7/hAU+/4UFPv+ABDz/gAQ8/4ADO/+FAjz/hAI8/3wBOP9+ATj/eQA2/3QANf+EADv/hAA7/3cANf9/ADn/ggA7/4ABO/+CAjv/ggI7/4QDPP+FBD7/hgQ+/4YFP/+JBUD/iQZB/4gHQf/Vprv/+vX4//r1+P/Wqb3/iAdA/4kHQf+JBkH/hgU//4UFPv+FBD7/hQQ+/4gDPv+HAj3/gwI7/4MBPP99ADj/dgA1/4QAO/+EADv/egA3/4EAOv+GATz/hgI8/4gCPv+JAz//igQ//4sFQf+MBUH/jQZC/44HQ/+OB0P/jwdE/9Sft////////////9Ogt/+NCET/jgdD/40HQv+OB0P/jgZD/44FQv+OBUL/igQ//4gDPv+KAj7/hQI8/30BOP96ADf/hAA7/4QAO/9/ADn/hQE8/4wBP/+JAj7/iQM//4sEQP+MBEH/jgVC/48GQ/+QB0T/kQdF/5MIRv+UCEb/1Jq0////////////1Z22/5UIR/+VCEb/lQhH/5QHRv+UB0X/kgZE/5IFRP+RBEL/kQRB/4sDQf+IAj7/hQE8/3oBOP+EADv/hAA7/38AOP+IAT3/kQJB/48CQf+PBEH/kQRC/5IFRP+UBkT/lQdG/5QHRv+VCEb/lwhI/5gJSP/Qjqv////////////Qkaz/lwpI/5YJSP+WCEj/lQhH/5QHR/+UB0b/lAZF/5IFRP+SBEL/jgRB/44CQf+FAjz/egE4/4QAO/+EADv/gwA7/4wBP/+WAkP/lANE/5QEQ/+VBUT/lwVG/5gHR/+aB0j/mwhJ/5sISv+bCkr/nApL/9GMqv///////////9GMq/+eCkz/mwpK/5oKSv+ZCEn/mQhI/5kHSP+YB0f/lwVG/5UFRP+VBET/kANC/4UCPP94ATf/hAA7/4QAO/96ATj/kQFB/5cCRP+XA0X/mgRH/5sFR/+cBkj/nQdJ/54ISv+fCEv/oApM/6EKTf+hC07/zoCj////////////0IWn/6ALTf+fC03/ngpM/54KS/+dCEv/nQhK/5wHSf+gBkr/ngVI/5oER/+UA0T/iAI+/4IBO/+EADv/hAA7/4YBO/+UAkL/mgJF/50ER/+gBEj/oQVK/6MHS/+jB0v/pAhN/6UJTv+mCk//pgtP/6cLUP/Od53////////////Oe6D/pgxQ/6YLUP+mC0//pwpQ/6IJTf+hCE3/oAdL/6EHS/+fBUj/mgRG/5kERv+RAkL/gwI7/4QAO/+EADv/jAE//5cCQ/+gA0j/oARI/6MFS/+kBUv/pAdN/6YITf+mCE7/qApQ/6kKUP+qC1L/qwxT/9B3n////////////893n/+qDVP/qgxT/6oLUv+qClH/qgpR/6UITv+lCE3/pAdN/6EFSv+gBUr/mQRG/48DQv9+Ajn/hAA7/4QAO/+JAT7/mAJF/6QDSv+lBEv/pwVN/6gGTf+pB0//qghQ/6wIUP+qClH/rAtR/60LU/+vDVT/03mi////////////0nqi/64NVf+uDVT/rQtU/60LU/+qClH/qQhQ/6kIT/+nB07/qgZO/6QFS/+aBEb/jANB/4YCPP+EADv/hAA7/4sBPv+dAkf/oANJ/60ETv+uBU//rwZQ/7AHUP+wCFL/sQlT/7EKVP+yC1T/sgtW/7MNV//vzNv////////////vzdz/sw5Y/7QNV/+yC1b/sgtV/7IKVP+xCVP/sQhT/68HUP+qBk7/qgVO/54ESP+VA0X/iwI+/4QAO/+EADv/jAE//6ECSP+mA0v/rQRO/68FUP+wBlH/sAdR/7EIU/+xCFP/sgpU/7MLVf+zC1b/wz55///////////////////////GQX3/uA1Z/7MLVv+0C1b/swpV/7QIVP+1CFT/sAdR/6wGUP+qBU7/nQRH/5QDRP+IAj7/hAA7/4QAO/+OAUD/pAJK/60DTv+2BFL/uAVU/7gFVf+5B1X/uQhW/7YIVf+7Clj/uwpY/7sLWf/13Of///////////////////////bd6P+7DFr/uAtX/7kKV/+6Clj/ughX/7gIVv+0B1P/sAVR/6sFTv+jBEr/mANG/4wCQP+EADv/hAA7/48BQP+nAkv/rgJP/7sEVP+8BFb/vAVX/74HV/++B1j/vghZ/78JWf+/Clr/01aM////////////+/D1//vw9f///////////9RZkP+8C1n/vApZ/70JWf++CFn/vwdY/7gHVf+zBVP/rwRQ/6EESv+YAkX/iwI//4QAO/+EADv/kQFB/6kBS/+yAlD/vQNV/8AEV//BBVj/wQZZ/8EHWf/BCFr/wQha/8EKW//56fD////////////WYJX/1l2T////////////+uvy/8IKXP/CClz/wgha/8IIW//CB1r/vwZX/7kFVP+zBFH/qQNM/54CSP+AATv/hAA7/4QAO/+TAEH/rQFN/7QCUf/CA1j/wQRX/8EFV//BBVn/wQda/8EHWf/FCFz/3nSi////////////9tvn/8QLXf/EC13/9trm////////////3nil/8QIW//FCFz/xwdc/8UHW//BBVn/vgVW/7IEUf+pA0z/nQJH/4ABOv+EADv/hAA7/5UAQv+wAU7/uQJT/8UCWP/HBFr/xwRb/8gFW//HBlz/xwdc/8gKXv/99fn////////////QOHv/xQpc/8UKXf/QNnr///7+///////99vn/yQ1g/8gHXf/IB1z/yQZc/8gFXP/GBFr/uwRV/7ECUP+aAkX/ggE7/4QAO/+EADv/lQBC/68BTv+5AVP/xQJZ/8cDWv/HBFr/xwRa/8cFW//HBlv/6Z6/////////////8L7U/8UIXP/FCFz/xQlc/8cIXP/wvNP////////////qocH/yQdc/8oGXf/KBVz/yARc/8UEWv+6A1T/sQJQ/6QBSv+DATv/hAA7/4QAO/+cAEb/swBQ/74BVf/IAlr/ygJa/8oDW//KBFz/ygVc/84ca//+/P3///////78/f/LGWj/xwhc/8UIXP/HCFz/xwhd/8sXZ//++/z////////9/v/PHWv/ygVd/8oFXf/LBFz/xANZ/7wCVP+tAk7/nwFH/4QAO/+EADv/hAA7/5cAQ/+yAE//vABU/8cBWv/IAlr/xgJZ/8cDWv/HBFr/88nb////////////5pi7/8IHWv/BB1r/xAda/8QHW//EB1v/xAdb/+WTt/////////////PL3f/IBFv/yARb/8gDWv/FAln/vgJV/7ABUP+sAE3/kgBB/4QAO/+EADv/lQBC/7AATv+5AFP/xQFY/8QBWP/DAlj/wgJY/9NKh/////////////z0+P+8B1f/ugVW/7kFVf+4BlX/uQZW/7oGVv+6BVb/uwZX//zy9////////////9JOiP/CA1j/xwJZ/8UCWf+7AVT/rwFP/6kAS/+QAED/hAA7/4QAO/+PAD//pgBK/68ATv+7AFT/uAFT/7YBUv+2AlH/9dzn//rt8//9+vz/0GqX/7EEUf+wBFH/sAVR/68FUP+wBVD/rwVQ/7AFUf+wBFH/z2OT//34+v/46fD/9Nfk/7gCU/++Alb/uwFU/7ABT/+nAEv/lQBC/4gAPf+EADv/hAA7/44AP/+mAEr/pgBK/6sATf+zAFD/sgFQ/6YBS/+mAkv/pQJL/6QCS/+lA0v/pANK/6QES/+kBEv/owRK/6MES/+hBEr/oQRK/6AESf+lA0v/pgNL/6YCS/+mAkv/pwJM/6wBTf+pAUz/pgBK/5cARP+VAEL/fwA6/4QAO/+EADv/gwA7/48AP/+UAEL/qgBM/6cASv+XAET/lwBE/5cBRP+XAUT/lgJE/5MCQ/+QAkL/jQJB/4kDP/+VA0X/lANE/5EDQ/+PA0L/jAJB/5cCRP+TAkP/kAJB/5cBRP+WAUT/qABL/6gAS/+VAEL/mABE/4gAPv97ADj/hAA7/4QAO/9+ADj/gwA7/44AP/+QAED/hQA7/38AOf97ADf/hQA7/4UBPP9xATT/cAE1/3ABM/xvAjT3bwI07oQCPe6AAjvufQI67ngCOPRzAjb8hQE8/4MBPP+CATv/ggE7/4AAOv+SAEH/kABA/5MAQf+CADv/egA3/3oAN/+EADv/hAA7/3YANf+AADr/fwA5/4AAOvtuATPfbgM0wXwEO5t4BDl3dQc6UG4FNyxqADIPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABuADQNbgQ3LHEHOFBwBTZ1bwQ2m4ADPL+CATvfggA7+4AAOv96ADf/dQA1/4QAO/+EADv/cgM2yG8ENopvBTZGcAA0BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwADQHcwU4RnQEN4pyAzbIhAA7/wf//+AAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAH///gKAAAABAAAAAgAAAAAQAgAAAAAABABAAAAAAAAAAAAAAAAAAAAAAAAG0AM/9tADP/bgAzw24AM2RxATUddAI1EHQCNhF0AjYQdAI2EXQCNhF0AjUQcQE1HG4AM2NuADPHbQAz/20AM/9vADP/dAA1/3UANf91ADX/dAE2/3QCNf90Ajb/dAI2/3QCNv90Ajb/dAI1/3QBNv91ADX/dQA1/3QANf9vADP/cQAz/3kANv99ADn/fgI5/34COf9+BTr/jhtI/////////v7/jhtI/34EOv9+Ajn/fgI5/34AOf95ADb/cQAz/3MANP+AADn/hgI7/4gDPf+JBD7/igVB/6MJTf///////v3+/6QITf+JBUH/iQQ+/4gDPf+HAjv/gAA5/3MANP91ADX/hgE7/48CQf+TBEP/kgZE/5MGRv+UB0b///////////+UB0b/kwZG/5MGRP+TBEP/jgJB/4YBO/91ADX/dwA1840CPv+WBEX/mwVG/5wGSP+cB0n/ngtL///////+/f3/ngtL/50HSf+cBkj/mwVG/5YERf+NAj7/dwA183gANuWTAkL/nwRI/6MGS/+jB03/pglP/60lWf///////v3+/6ofVv+mCU//owdN/6MGS/+eBEj/kgJC/3gANuV5ADfZmwJG/6YFS/+sBk//rQdR/60JUv/SYY3////////////QW4n/rglS/6wHUf+sBk//pQVL/5sCRv95ADfZeQA32Z8CR/+tBU//tAZS/7UHVP+3Clb///////////////////7+/7cKVv+1B1T/tAZS/6wFTv+fAkf/eQA32XsAOOWfAkf/tgRS/7sGVv+8B1f/14Kd///////aiqP/02WQ///+/v/Xgp3/vQdX/7wGVv+1BFH/nwJH/3sAOOV+ADnyrQJO/70EVf/FBVr/xAZb////////////xQdb/8UIXP///////////8UGW//FBVr/vQRV/6wCTv9+ADnygQA5/6oBS//DAlf/ygVd/9/P1f//////1WuU/8YHXP/GB1z/0mGN///////NiaL/ygRc/8MCV/+nAUr/gQA5/4IAOf+rAEv/wARX/8RffP///////////8IGWf/BBlj/wQZY/8IHWv///////////8Riff/BAlb/qwBL/4IAOf9/ADn/oABG/7EBUP/u3OT//////6wET/+rBE7/qQVN/6oFTv+rBE7/rQZQ///+///s1N7/sQBP/54ARf9/ADn/eAA2/4sAPf+UAEL/lQZG/44BQP+IAj3/iAI9/4UCPP+FAjz/iAI9/4gCPf+OAUD/kwBC/5QAQv+KAD3/eAA2/20AM/9vADT/cAA0w3MANWSAATsdiAI9EIgCPRCFAjwQhQI8EYgCPRGIAj0QgAE6HHMANWNwADTHbwA0/20AM/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451167/highlight%20yahoo%20tw%20news%20title%20demo.user.js
// @updateURL https://update.greasyfork.org/scripts/451167/highlight%20yahoo%20tw%20news%20title%20demo.meta.js
// ==/UserScript==
function strikeThrough(text) {
  return text
    .split('')
    .map(char => char + '\u0336')
    .join('')
}
var ary=[['red','中時','中天','CTWANT','時報資訊','旺','工商時報','世界日報'],
         ['blue','聯合','風傳媒','匯流新聞','中華日報'],
         ['green','三立','民視','自由時報']]//There is No War in Ba Sing Se
function main_01() {
    var news_list=document.querySelectorAll('li.js-stream-content');
    //alert("I am an alert box!");
    for(let a = 0; a < news_list.length; a++){//新聞列表
        var news_span=news_list[a].querySelectorAll('span')
        for(let b = 0; b < news_span.length; b++){
            let news_author=news_span[b].innerText;
            //alert(news_author);
            for(let i = 0; i < ary.length; i++){
                for(let j = 0; j < ary[i].length; j++){
                    if(news_author.search(ary[i][j])!=-1){
                        if(news_list[a].querySelectorAll('h3>a')[0]!=undefined){//對不存在的東西進行操作，後面的代碼全都不能執行
                            news_list[a].querySelectorAll('h3>a')[0].className="strike"
                            //news_list[a].querySelectorAll('h3>a')[0].textContent =strikeThrough(news_list[a].querySelectorAll('h3>a')[0].textContent);
                            news_list[a].querySelectorAll('h3>a')[0].style.setProperty("text-decoration", "line-through");
                            news_list[a].querySelectorAll('h3>a')[0].style.color = ary[i][0];
                        }
                        if(news_list[a].querySelectorAll('h4>a')[0]!=undefined){
                            news_list[a].querySelectorAll('h4>a')[0].className="strike"
                            news_list[a].querySelectorAll('h4>a')[0].style.setProperty("text-decoration", "line-through");
                            news_list[a].querySelectorAll('h4>a')[0].style.color = ary[i][0];
                        }
                        break;//没這個就等著卡死吧
                    }
                }
            }//*/
        }
    }
}
function main_02(){
    var news_page=document.querySelectorAll('header.caas-header');
    let news_author=news_page[0].querySelectorAll('img.caas-img')[0].alt
    for(let i = 0; i < ary.length; i++){
        for(let j = 0; j < ary[i].length; j++){
            if(news_author.search(ary[i][j])!=-1){
                news_page[0].querySelectorAll('h1')[0].className="strike"
                news_page[0].querySelectorAll('h1')[0].style.setProperty("text-decoration", "line-through");
                news_page[0].querySelectorAll('h1')[0].style.color = ary[i][0];
                break;//没這個就等著卡死吧
            }
        }
    }
}
(function() {
    'use strict';
    window.setTimeout(( () => main_01() ), 1000);
    var timeoutID = window.setInterval(( () => main_01() ), 5000);//模擬sleep+while用的
    window.setTimeout(( () => main_02() ), 1000);
    // Your code here...
})();