// ==UserScript==
// @name         老實人超星腳本
// @namespace    ColdSword
// @version      0.2
// @description  老實人專用的超星爾雅平台挂機腳本，適用於有閒置設備、只想要安安靜靜挂機刷課的老實人，能在視頻播放前跳過人臉校驗環節，避免部分課程教師開啟人臉校驗所帶來的紛擾，降低使用某些過視頻腳本造成掛科等風險
// @author       ColdSword
// @run-at       document-end
// @match        https://*.chaoxing.com/visit/stucoursemiddle*
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @connect      mooc1-api.chaoxing.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444935/%E8%80%81%E5%AF%A6%E4%BA%BA%E8%B6%85%E6%98%9F%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444935/%E8%80%81%E5%AF%A6%E4%BA%BA%E8%B6%85%E6%98%9F%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
    var timmer = setInterval(function(){
        try{
            /*getElementById*/
            var uuid = unsafeWindow.document.getElementById("uuid").value;
            var qrcEnc = unsafeWindow.document.getElementById("qrcEnc").value;
            var courseId = unsafeWindow.document.getElementById("fccourseId").value;
            var classId = unsafeWindow.document.getElementById("fcclazzId").value;
            /*outRandomoid*/
            var oidSample = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
              var oidSampleLen = oidSample.length;
              var oid = "";
              for (var i = 0; i < 32; i++) oid += oidSample.charAt(Math.floor(Math.random() * oidSampleLen));
            var popElements = unsafeWindow.document.getElementsByClassName("popDiv wid640 faceCollectQrPop popClass");
            var popVideoElements = unsafeWindow.document.getElementsByClassName("popDiv1 wid640 faceCollectQrPopVideo popClass");
            if(popElements.length>0||popVideoElements.length>0){
                console.log("faceVideoCheckFailCoun");
                var failTimeEs = unsafeWindow.document.getElementsByClassName("faceVideoCheckFailCount");
                  var failCount = "0";
                  if(failTimeEs.length>0){
                      failCount = failTimeEs[0].innerHTML;
                  }
                GM_xmlhttpRequest({
                    method: "post",
                    url: "https://mooc1-api.chaoxing.com/qr/updateqrstatus",
                    data: "clazzId="+classId+"&courseId="+courseId+"&uuid="+uuid+"&objectId="+oid+"&qrcEnc="+qrcEnc+"&failCount="+failCount+"&compareResult=0",
                    synchronous: true,
                    headers:  {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(res){
                        console.log(res)
                    },
                    onerror : function(err){
                        console.log(err);
                    }
                });
                return;
            }
            //clearInterval(timmer);
        }catch(err){
            console.log(err);
        }
    },5000);
})();