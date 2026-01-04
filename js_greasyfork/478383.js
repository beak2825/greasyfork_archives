// ==UserScript==
// @name         重庆人社网-我的培训班mooc-工程类
// @version      0.1
// @namespace    vx：shuake345
// @description  代刷vx：shuake345
// @author       vx：shuake345
// @match        *://mooc1.cqrspx.cn/*
// @match        *://i.cqrspx.cn/*
// @match        *://*.cqrspx.cn/studentspace/*
// @match        *://*.cqrspx.cn/mycourse/*
// @match        *://*.cqrspx.cn/mooc2-ans/mycourse/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478383/%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E7%BD%91-%E6%88%91%E7%9A%84%E5%9F%B9%E8%AE%AD%E7%8F%ADmooc-%E5%B7%A5%E7%A8%8B%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/478383/%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E7%BD%91-%E6%88%91%E7%9A%84%E5%9F%B9%E8%AE%AD%E7%8F%ADmooc-%E5%B7%A5%E7%A8%8B%E7%B1%BB.meta.js
// ==/UserScript==

//var n=0


document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
			if (document.URL.search('openc=') > 1 ) {
				//setTimeout(gbclose, 1000)
		}

        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search('space') > 1 ) {
				setTimeout(sxrefere, 1000)
			}
		}
	});


function ye2(){
    if(document.URL.search('mooc2-ans/mycourse')>1){//2ye
        var WEIkan=document.querySelectorAll("div > div.catalog_task > div > span.catalog_points_yi")
        if(WEIkan.length>0){
            WEIkan[0].click()
        }
    }
}
setTimeout(ye2,5241)


function zy(){
    if(document.URL.search('backUrl=')>1 || document.URL.search('projectClassListUI')>1){
        var wz=document.querySelector('iframe').src
        window.location.replace(wz)
        var KCn=document.querySelectorAll('[class="alc"]')
        var KCnnum=KCn.length
        if(KCnnum!==0){
            for (var i=0;i<KCnnum;i++){
                if(KCn[i].innerText=="进入学习"){
                    KCn[i].click()
                    break
                }
            }
        }
    }
}
setTimeout(zy,6000)
/*function bei16(){
    if(document.URL.search('studentstudy')>1){
        console.log('16s')
if(document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('video').playbackRate!==16){
    n++
document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('video').playbackRate=16
}else{
    if(n>10){
        if(document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('video').playbackRate!==16){
            setTimeout(sxrefere,110)
        }
    }
}
}
}*/
function secendye(){

    if(document.URL.search('space')>1){
        var kcmu=document.querySelectorAll(" div > div.l_tcourse_center.studentCourse > dl > dd > div > p")//[5].attributes[1].nodeValue.search('100')
        for (var i=0;i<kcmu.length;i++){
            if(kcmu[i].attributes[1].nodeValue.search('100')<2){
                document.querySelectorAll(" div > div.px_form_btn > a")[i].click()
                break;
            }//else if(i==kcmu.length-1){
               // document.querySelector("#page > ul > li.xl-nextPage").click()
                //setTimeout()
            //}
    }
}
}
//setTimeout(secendye,15424)
function cy(){
    if(document.URL.search('studentstudy')>1 && doings.search('3')>0){
        var xxan=document.querySelectorAll('li>div>div>a')
        if(xxan.length>0){
        if(xxan[0].innerText=="进入学习"){xxan[0].click()}
        }

        if(document.querySelector(".posCatalog_select.posCatalog_active").children[1].className=='icon_Completed prevTips'){
            if(document.querySelector('[class="jobUnfinishCount"]')!==null){
            document.querySelector('[class="jobUnfinishCount"]').previousElementSibling.click()//dian 未完成课程
            }else{setTimeout(gbclose,451)}
        }else if(document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('[class="vjs-duration-display"]').innerText==document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('[class="vjs-current-time-display"]').innerText){
            //播放时间=总时长，已完成
            document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('video').play()
            setTimeout(sxrefere,600000)
        }else{document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow.document.querySelector('video').play()}
    }
    if(document.URL.search('classId=')>1){
        var kcmu=document.querySelectorAll('div>div>div>ul>li')
        for (var i=0;i<kcmu.length;i++){
            if(kcmu[i].getElementsByClassName('l_sprogress_text mal10')[0]!==undefined){
            var baifb=kcmu[i].getElementsByClassName('l_sprogress_text mal10')[0].innerText
            if(baifb.search('100%')==-1){
                kcmu[i].getElementsByClassName('l_sprogress_text mal10')[0].click()
                clearInterval(cy1)
                break;
            }else if(i==kcmu.length-1){
            document.getElementsByClassName('xl-nextPage')[0].click()
            }
            }
        }
    }

}
var cy1=setInterval(cy,5000)
function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}
var News1=new Date
var doings=News1.getFullYear ()+''
function sy(){
    if(document.URL.search('.cqrspx.cn/mycourse/stu')>1 ){
        var kc1s
        if(document.getElementsByClassName('catalog_name').length>0){
            kc1s=document.getElementsByClassName('catalog_name')
        kc1s[1].click()
        setTimeout(function(){
        kc1s[2].click()
            setTimeout(function(){
            kc1s[3].click()
            },1000)
        },1000)
        }else if(document.getElementsByClassName('articlename').length>0){
        kc1s=document.getElementsByClassName('articlename')
            kc1s[1].click()
        setTimeout(function(){
        kc1s[2].click()
            setTimeout(function(){
            kc1s[3].click()
            },1000)
        },1000)
        }
    }
}
setInterval(sy,8000)
