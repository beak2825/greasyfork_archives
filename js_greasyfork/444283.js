// ==UserScript==
// @name         学习通人脸识别|进入人脸课程
// @namespace    卓尔不群
// @version      1.5
// @description  学习通课程遇到人脸识别自动通过，支持点进课程、点进章节
// @author       卓尔不群
// @run-at       document-end
// @match        https://*.chaoxing.com/visit/stucoursemiddle*
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @connect      mooc1-api.chaoxing.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444283/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%7C%E8%BF%9B%E5%85%A5%E4%BA%BA%E8%84%B8%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444283/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%7C%E8%BF%9B%E5%85%A5%E4%BA%BA%E8%84%B8%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function(){
    var timmer = setInterval(function(){
        try{
            /*获取参数*/
            var uuid = unsafeWindow.document.getElementById("uuid").value;
            var qrcEnc = unsafeWindow.document.getElementById("qrcEnc").value;
            var courseId = unsafeWindow.document.getElementById("fccourseId").value;
            var classId = unsafeWindow.document.getElementById("fcclazzId").value;
            /*生成随机objectId*/
            var oidSample = "abcdefttguhhniafunrivvalaffxafcekyu2345678";
              var oidSampleLen = oidSample.length;
              var oid = "";
              for (var i = 0; i < 32; i++) oid += oidSample.charAt(Math.floor(Math.random() * oidSampleLen));
              /*一版本人脸识别*/
            var popElements = unsafeWindow.document.getElementsByClassName("popDiv wid640 faceCollectQrPop popClass");
            var popVideoElements = unsafeWindow.document.getElementsByClassName("popDiv1 wid640 faceCollectQrPopVideo popClass");
            if(popElements.length>0||popVideoElements.length>0){
                console.log("一版本人脸识别");
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
            /*二版本人脸识别*/
            var popElementss = unsafeWindow.document.getElementsByClassName("popDiv wid640");
            if(popElementss.length<1){
                return;
            }
            var faceElement = unsafeWindow.document.getElementById("fcqrimg");
            if(faceElement==null){
                return;
            }
            console.log("二版本人脸识别");
            var knowledgeId = "0";
            var knowledgeIdE = unsafeWindow.document.getElementById("chapterIdid");
            if(knowledgeIdE!==null){
                knowledgeId = knowledgeIdE.value;
            }
            console.log(JSON.stringify ({
                        clazzId : classId,
                        courseId : courseId,
                        knowledgeId : knowledgeId,
                        uuid : uuid,
                        qrcEnc : qrcEnc,
                        objectId : oid
                    }))
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://mooc1-api.chaoxing.com/knowledge/uploadInfo",
                synchronous: true,
                data: "clazzId="+classId+"&courseId="+courseId+"&knowledgeId="+knowledgeId+"&uuid="+uuid+"&qrcEnc="+qrcEnc+"&objectId="+oid,
                headers:  {
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                onload: function(res){
                    console.log(res)
                },
                onerror : function(err){
                    console.log(err);
                }
            });
            //clearInterval(timmer);
        }catch(err){
            console.log(err);
        }
    },5000);
})();