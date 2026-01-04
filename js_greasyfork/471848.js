// ==UserScript==
// @name         chinabett--基础教育教师培训-国培计划
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  秒刷||自动换课||自动刷新||自动完成所有课程------代刷vx：shuake345
// @author       vx：shuake345
// @match        *://*.edueva.org/*
// @match        *://xuexi.chinabett.com/*
// @icon         https://www.google.com/s2/favicons?domain=edueva.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471848/chinabett--%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/471848/chinabett--%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}

document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
    } else if (document.visibilityState == "visible") {if(document.URL.search('PrjStudent/Index')>1 ){setTimeout(function (){window.location.reload()},1000)}}});

function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return "";
      }
    }
    function gsdgasdg(key, value) {
      GM_setValue(key, value);
      if(key === 'Config'){
        if (value) localStorage.ACConfig = value;
      }
    }
    function gsdsdgsd(e, t, r) {
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error("无效的xpath");
      }
    }
    function sdgasdg(xpath, contextNode) {
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      contextNode = contextNode || doc;
      var result = [];
      try {
        var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < query.snapshotLength; i++) {
          var node = query.snapshotItem(i); //if node is an element node
          if (node.nodeType === 1) result.push(node);
        }
      } catch (err) {
        throw new Error(`Invalid xpath: ${xpath}`);
      } //@ts-ignore
      return result;
    }

    function bf(){




        if(document.getElementsByTagName('video').length==1){
            document.getElementsByTagName('video')[0].play()
            var timeall=0
            if(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[2]!==undefined){//小时
            timeall=parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[0]*3600)+parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[1]*60)+parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[2])+10
                console.log('时'+timeall)
            }else{
                timeall=parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[0]*60)+parseInt(document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')[1])+10
                 console.log("no"+timeall)
            }

            document.getElementsByTagName('video')[0].currentTime=timeall
          var videonum= document.getElementsByClassName('iconfont icon_course_res').length
          var vnm1=videonum-1
          if(document.getElementsByClassName('iconfont icon_course_res')[vnm1].nextElementSibling.nextElementSibling.innerText.search('00:00:00')!==0){

              window.close()
          }

        }

    }
 setInterval(bf,2000)
    function qt(){
    var tnum=document.querySelectorAll('div>img').length
    var tnum1=tnum-1

    }
    setInterval(qt,50000)
function next(){
    if(document.URL.search('video.edueva.org')>1){
if(document.getElementsByClassName('layui-layer-btn0').length==1){
document.getElementsByClassName('layui-layer-btn0')[0].click()
}
}
}
setInterval(next,1000)
    function zy(){
    if(document.URL.search('PrjStudent/Index')>1){

       // reloadwatchcourse()
        setTimeout(function(){
            var imgs=document.getElementsByClassName('studyBegin')
        for (var i=0;i<imgs.length;i++){
            if(imgs[i].innerText=="开始学习" || imgs[i].innerText=="继续学习"){
                imgs[i].click()
                setTimeout(function(){

                    document.getElementsByClassName('star')[0].click()

                },1000)
                break;
            }
        }
        },2000)
    }
    }
    setTimeout(zy,2000)

})();