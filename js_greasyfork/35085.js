// ==UserScript==
// @name         ARC
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Check amazon rank
// @author       you
// @match        https://www.amazon.com/s/ref=*
// @match        https://www.amazon.co.uk/s*
// @match        https://www.amazon.de/s/ref=*
// @match        https://www.amazon.co.jp/s/ref=*
// @match        https://www.amazon.ca/s/ref=*
// @match        https://www.amazon.fr/s/ref=*
// @match        https://www.amazon.es/s/ref=*
// @match        https://www.amazon.it/s/ref=*
// @match        https://www.amazon.cn/s/ref=*
// @match        https://www.amazon.com.au/s/ref=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35085/ARC.user.js
// @updateURL https://update.greasyfork.org/scripts/35085/ARC.meta.js
// ==/UserScript==

function get_rank(branks){
	var L_rank={};
	var na_rank=0;
	var sp_rank=0;

	for (var i in branks){
		L_rank[branks[i]]=[{},{}];}

	for (var n=0;document.getElementById("result_"+n)===null;n++){
		continue;
		}

	for (n;document.getElementById("result_"+n)!==null;n++){
		var item=document.getElementById("result_"+n);
		if (item.getElementsByClassName("vse-time-img").length===0){
			var sp = item.getElementsByTagName('h5').length;
			var content=item.innerHTML;
			if  (sp === 0){
				na_rank++;
				for (var m in branks){
					brank=branks[m];
					if (content.toUpperCase().indexOf(brank.toUpperCase())>=0){
						L_rank[brank][0][n]=na_rank;
						}
					}
				}
			else{
				sp_rank++;
				for (var o in branks){
					brank=branks[o];
					if (content.toUpperCase().indexOf(brank.toUpperCase())>=0){
						L_rank[brank][1][n]=sp_rank;
						}
					}
				}
			}
		}
	return [L_rank,na_rank,sp_rank];
	}

function append_href(dic){
	var txt='';
	for (var n in dic){
		txt+="<a href='#result_"+n+"'>"+dic[n]+"</a>,";
		}
	if (txt===''){return '0';}
	else{return txt.substring(0,txt.length-1);}
	}

function write_rank(branks){
	var text='';
	var L=get_rank(branks);
	for (var brank in L[0]){
		text+="<br>"+brank+"广告排名"+append_href(L[0][brank][1])+'/'+L[2]+";自然排名"+append_href(L[0][brank][0])+'/'+L[1];
		}
    if (location.origin=="https://www.amazon.de")
        {document.getElementById("leftNavContainer").getElementsByClassName('a-text-normal')[0].innerText='';}
    document.getElementById("s-result-count").innerHTML+=text;
	}
write_rank(['lilysilk','mommesilk']);