// ==UserScript==
// @name         卫安云视职业健康教育培训数智化管理平台-vx：shuake345
// @namespace    秒考VX：shuake345
// @version      0.1
// @description  自动看课|自动考试|秒考VX：shuake345
// @author       秒考VX：shuake345
// @match        *://sxways.100anquan.com/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526297/%E5%8D%AB%E5%AE%89%E4%BA%91%E8%A7%86%E8%81%8C%E4%B8%9A%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E6%95%B0%E6%99%BA%E5%8C%96%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0-vx%EF%BC%9Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/526297/%E5%8D%AB%E5%AE%89%E4%BA%91%E8%A7%86%E8%81%8C%E4%B8%9A%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E6%95%B0%E6%99%BA%E5%8C%96%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0-vx%EF%BC%9Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() { }
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = '100anquan.com/index'
	var Chuyurl = '100anquan.com/index'

	function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}



	function Shuy() {
            var SPlength=document.querySelector('iframe').contentWindow.document.querySelectorAll('video').length
            if(SPlength!==0){//有视频
                if(document.querySelector('iframe').contentWindow.document.querySelectorAll('li>a>div.table-cell-li>[color="blue"]')[5].innerText=='时间不够'){//视频没看完
                document.querySelector('iframe').contentWindow.document.querySelectorAll('video')[0].play()
                }else if(document.querySelector('iframe').contentWindow.document.querySelectorAll('li>a>div.table-cell-li>[color="blue"]')[5].innerText=='已学习'){//视频看完了。
                    var shipjindu=document.querySelector('iframe').contentWindow.document.querySelectorAll("ul > li > ul > li> ul > li> a > div:nth-child(3)")
                    for (var i = 0; i < shipjindu.length; i++) {
				if (shipjindu[i].innerText == '未学习' || shipjindu[i].innerText == '时间不够') {//找到没看完的视频
					shipjindu[i].click()
					break;
				}
			}
                }
            }

	}
	setInterval(Shuy, 5124)


	function QT(){
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
    }


})();