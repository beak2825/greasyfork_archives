// ==UserScript==
// @name         龙知网-全自动脚本-带评论
// @namespace    vx:shuake345
// @version      0.3
// @description  自动看课|10倍速|自动切换|自动翻页
// @author       vx:shuake345
// @match        *://longzhi.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=longzhi.net.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477945/%E9%BE%99%E7%9F%A5%E7%BD%91-%E5%85%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC-%E5%B8%A6%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477945/%E9%BE%99%E7%9F%A5%E7%BD%91-%E5%85%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC-%E5%B8%A6%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var Zhuyurl = 'myCourseIndex'
    var Chuyurl = 'session'
    var Shuyurl = 'study'
    var Fhuyurl = '&courseware'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
            //yincang
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(Zhuyurl) > 1 ) {
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

    function Zhuy() {
        var KCjd = document.querySelectorAll("#myCourse > div > div > ul > li > div > div.view-intro > div.view-progressbar.pc-progressbar.plearn-pb > div > div.progressbar-value > span")
        var KC = document.querySelectorAll('[class="icon-play"]')//[0].click()
        var is
        var KCbiaoti=document.querySelectorAll("#myCourse > div > div > ul > li > div > div.view-intro > h3 > span")//[0].innerText
        is=localStorage.getItem('nowKC')+""
        for (var i = 0; i < KCjd.length; i++) {
            if(is.indexOf(KCbiaoti[i].innerText)==-1){
                KC[i].click()
                break;
            }else if(i==KCjd.length-1){
                document.querySelector("#page-next").click()
                setTimeout(Zhuy,1255)
            }
        }
    }

    function Chuy() {
        if (document.URL.search('bulletin') > 2) {//课程信息处
            document.querySelector('[title="章节导航"]').click()
        }
        if(document.querySelector('[class="icon-play01 icon-disabled "]')!==null){//playbutton
            document.querySelector('[class="icon-play01 icon-disabled "]').click()
        }else if(document.querySelector('[class="icon-note icon-disabled "]')!==null){//isplayend
            document.querySelector('[class="icon-note icon-disabled "]').click()//clickNote
        }else if(document.querySelector('[class="icon-play-done"]')!==null){//isplayend
            localStorage.setItem('nowKC',localStorage.getItem('nowKC')+document.querySelector("div> div > div > h3").innerText)
            document.querySelector('[class="link-default mycourse"]').click()//clickmystudy
        }
    }

    function Shuy() {
        //if (document.URL.search(Shuyurl) > 2) {
        var zzKC = document.querySelectorAll('tbody>tr>td>span')
        var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
        if (document.getElementsByTagName('video').length == 1) {
            var SP=document.getElementsByTagName('video')[0]
            SP.volume = 0
            SP.playbackRate=SDs
            if(document.querySelector('[class="study-over-video-doc"]').style[0]=='display'){//ends
                document.querySelector('[class="link-default mycourse"]').click()//clickmystudy
            }
        }else if(document.getElementById('post_area')!==null){//评论
            document.getElementById('post_area').firstChild.innerText=document.getElementsByClassName('reply-content')[0].innerText
            document.getElementById('btn_submit_post').click()
            setTimeout(function (){document.querySelector('[class="link-default mycourse"]').click()},1212)
        }
    }
    //setInterval(Shuy, 3124)
    var SDsks=99542125
    var SDqksq=347747665
    var SDs=2
    var SDiqpq=13958546655
    function Fhuy() {
        if (document.getElementsByTagName('video').length == 1) {
            var SP=document.getElementsByTagName('video')[0]
            SP.volume = 0
            SP.play()
            SP.playbackRate=SDs
        }

        /*if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}*/
    }
    function QT(){
        if (document.URL.search(Shuyurl) > 2) {
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
    }
    //setTimeout(QT,20)
    function Pd() {
        if (document.URL.search(Shuyurl) > 2) {
            setTimeout(Shuy, 20)
        } else if (document.URL.search(Chuyurl) > 2) {
            setTimeout(Chuy, 10)
        } else if (document.URL.search(Zhuyurl) > 2) {
            setTimeout(Zhuy, 24)
        }
    }
    setInterval(Pd,3254)

})();