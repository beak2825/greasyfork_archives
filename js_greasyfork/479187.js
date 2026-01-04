// ==UserScript==
// @name        无锡市人才人事综合业务平台
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  自动学习|自动换课|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        https://61.160.99.102:8031/WXJXJY/*
// @icon         https://xxqh.xuexiqh.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479187/%E6%97%A0%E9%94%A1%E5%B8%82%E4%BA%BA%E6%89%8D%E4%BA%BA%E4%BA%8B%E7%BB%BC%E5%90%88%E4%B8%9A%E5%8A%A1%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/479187/%E6%97%A0%E9%94%A1%E5%B8%82%E4%BA%BA%E6%89%8D%E4%BA%BA%E4%BA%8B%E7%BB%BC%E5%90%88%E4%B8%9A%E5%8A%A1%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==


(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'MyEventList'
	var Chuyurl = 'trainingcenter'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 || document.URL.search(Shuyurl) > 1) {
				setTimeout(sxrefere, 1000)
			}
		}
	});

	function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}
    setTimeout(sxrefere, 130000)

	function Zhuy() {
		var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText == '[未完成]') {
				window.open(KC[i].href)
				break;
			}
		}
	}

	function Chuy() {
            var KCjd=document.querySelectorAll("  div> div> div.tree > ul > li > ul > li")
            var elements = document.getElementsByClassName('getcourse');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains('getcourse licheck')) {
                console.log('licheck ing是第' + (i + 1) + '个class');
                break;
            }
        }

		if(parseInt(localStorage.getItem('key'))==NaN){
            localStorage.setItem('key',0)
        }
        var Lookdpage = parseInt(localStorage.getItem('key'))
		var zKC = document.querySelectorAll('tbody>tr>td>a')
        var zKCnum=zKC.length-1//2num kc
	}

	function Shuy() {
		if (document.URL.search(Shuyurl) > 2) {
			var zzKC = document.querySelectorAll('tbody>tr>td>span')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
			for (var i = 0; i < zzKC.length; i++) {
				if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
					localStorage.setItem('Surl', window.location.href)
					window.location.replace(zzKCurl[i].href)
					break;
				} else if (i == zzKC.length - 1) {
					setTimeout(gbclose, 1104)
				}
			}
		}
	}

	function Fhuy() {
		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}
	function QT(){
        var d1=document.getElementsByClassName('main main-note-scroll')[0];
        var img=document.createElement("img");
        var img1=document.createElement("img");
        img.style="width:230px; height:230px;"
        img1.style="width:230px; height:230px;"
        img1.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
        d1.appendChild(img1);
    }
	function Pd() {
		if (document.URL.search(Fhuyurl) > 2) {
			setTimeout(QT,20)
			setInterval(Fhuy, 5520)
            setTimeout(function(){
            window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
		} else if (document.URL.search(Chuyurl) > 2) {
			setInterval(Chuy, 4210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
		}
	}
	setTimeout(Pd, 1254)
    /*
    // 监听浏览器数据发送事件
window.addEventListener('beforeunload', function(event) {
  // 获取所有的网络请求
  var requests = performance.getEntriesByType('resource');

  // 遍历网络请求
  for (var i = 0; i < requests.length; i++) {
    var request = requests[i];

    // 判断是否是POST请求且URL包含指定地址
    if (request.initiatorType === 'xmlhttprequest' && request.name.includes('https://61.160.99.101/WXJXJY/Pages') && request.transferSize > 0) {
      // 获取请求的上传数据
      var postData = request.requestBody.formData;

      // 判断是否存在上传数据
      if (postData) {
        // 修改上传数据中的0%为100%
        postData['progress'] = ['100%'];

        // 输出修改后的上传数据
        console.log(postData);
      }
    }
  }
});
*/

})();