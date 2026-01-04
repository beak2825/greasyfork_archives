// ==UserScript==
// @name         ARC-Aerfgo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check amazon rank.
// @author       leseul
// @match        https://www.amazon.com/s/ref=*
// @match        https://www.amazon.co.uk/s/ref=*
// @match        https://www.amazon.de/s/ref=*
// @match        https://www.amazon.co.jp/s/ref=*
// @match        https://www.amazon.ca/s/ref=*
// @match        https://www.amazon.fr/s/ref=*
// @match        https://www.amazon.es/s/ref=*
// @match        https://www.amazon.it/s/ref=*
// @match        https://www.amazon.cn/s/ref=*
// @match        https://www.amazon.com.au/s/ref=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36529/ARC-Aerfgo.user.js
// @updateURL https://update.greasyfork.org/scripts/36529/ARC-Aerfgo.meta.js
// ==/UserScript==

var text="";
var na_Aerfgo={};
var sp_Aerfgo={};
var na_rank=0;
var sp_rank=0;
var n;

for (var o=0;o<10000;o++){
	if(document.getElementById("result_"+o)!==null){
		n=o;
		break;
		}
	}

for (n;document.getElementById("result_"+n)!==null;n++){
    var item=document.getElementById("result_"+n);
    if (item.getElementsByClassName("vse-time-img").length===0){
        var sp = item.getElementsByTagName('h5').length;
        if (sp === 0){
            na_rank++;
            na=item.innerHTML;
            if(na.toUpperCase().indexOf('AERFGO')>=0){
                na_Aerfgo[na_rank]=n;
            }

        }
        else{
            sp_rank++;
            sp=item.innerHTML;
            if(sp.toUpperCase().indexOf('AERFGO')>=0){
                sp_Aerfgo[sp_rank]=n;
            }
        }
    }
}

function append_href(dic){
	var txt='';
	for (var rank in dic){
		txt+="<a href='#result_"+dic[rank]+"'>"+rank+"</a>,";
		}
	if (txt===''){return '0';}
	else {return txt.substring(0,txt.length-1);}
	}

text='<br>Aerfgo广告排名'+append_href(sp_Aerfgo)+'/'+sp_rank+';自然排名'+append_href(na_Aerfgo)+'/'+na_rank;
document.getElementById("s-result-count").innerHTML+=text;