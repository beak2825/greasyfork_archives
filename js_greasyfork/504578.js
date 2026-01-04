// ==UserScript==
// @name         华东理工大学（ECUST）课程资源直链下载
// @version      1.0.3
// @description  ECUST课程资源直链下载，支持ppt(x),doc(x),pdf,mp4,flv,mp3,avi资源的下载，支持整节课资源批量下载。
// @author       ColdThunder11, bestzyq
// @match        *://*.chaoxing.com/mycourse/studentstudy?chapterId=*&courseId=*&clazzid=*&enc=*
// @match        *://*.chaoxing.com/coursedata?classId=*&courseId=*&type=*&ut=*&enc=*&cpi=*&openc=*
// @match        *://*.chaoxing.com/coursedata?courseId=*&classId=*&type=*&enc=*&ut=*&openc=*
// @match        *://*.chaoxing.com/coursedata/search?dataName=*&courseId=*&classId=*&ut=*&cpi=*&openc=*
// @match        *://*.chaoxing.com/coursedata?courseId=*&classId=*&type=*&ut=*&enc=*&cpi=*&openc=*
// @match        *://*.chaoxing.com/coursedata?courseId=*&dataName=*&dataId=*&type=*&parent=*&flag=*&classId=*&enc*&ut=*&cpi=*&openc=*
// @match        *://*.ecust.edu.cn/mycourse/studentstudy?chapterId=*&courseId=*&clazzid=*&enc=*
// @match        *://*.ecust.edu.cn/coursedata?classId=*&courseId=*&type=*&ut=*&enc=*&cpi=*&openc=*
// @match        *://*.ecust.edu.cn/coursedata?courseId=*&classId=*&type=*&enc=*&ut=*&openc=*
// @match        *://*.ecust.edu.cn/coursedata/search?dataName=*&courseId=*&classId=*&ut=*&cpi=*&openc=*
// @match        *://*.ecust.edu.cn/coursedata?courseId=*&classId=*&type=*&ut=*&enc=*&cpi=*&openc=*
// @match        *://*.ecust.edu.cn/coursedata?courseId=*&dataName=*&dataId=*&type=*&parent=*&flag=*&classId=*&enc*&ut=*&cpi=*&openc=*
// @match        *://*.ecust.edu.cn/mooc-ans/mycourse/studentstudy?chapterId=*&courseId=*&clazzid=*&enc=*
// @grant        none
// @namespace https://greasyfork.org/users/1257528
// @downloadURL https://update.greasyfork.org/scripts/504578/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%88ECUST%EF%BC%89%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/504578/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%88ECUST%EF%BC%89%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var url=document.location.toString();
    if(url.indexOf("coursedata")!=-1){
        setTimeout(()=>{
            if(document.getElementsByClassName("ct11_dl")[0]==null){
                var fileList=document.getElementsByClassName("ZYCon")[0].childNodes[1].childNodes[3].childNodes;
                for(var i=0;i<fileList.length;i++){
                    try{
                        if(fileList[i].getAttribute("type")!="afolder"){
                            let objectid=fileList[i].getAttribute("objectid");
                            var downloadTag = document.createElement("div");
                            downloadTag.setAttribute("href","javascript:void(0)");
                            //downloadTag.setAttribute("href","https://cs.e.ecust.edu.cn/download/"+objectid);
                            downloadTag.setAttribute("style","cursor:pointer;");
                            downloadTag.setAttribute("class","ct11_dl");
                            downloadTag.innerHTML="下载";
                            downloadTag.onclick = function name(params) {
                                window.location = "https://cs.e.ecust.edu.cn/download/"+objectid;
                            }
                            fileList[i].childNodes[3].childNodes[1].appendChild(downloadTag);
                        }
                    }
                    catch(e){}
                }
            }
        },1500);
    }
    else{
        setInterval(()=>{
            var haveResource=false;
            var downloadLinks;
            var iframes=document.getElementsByTagName("iframe");
            for(var i=0;i<iframes.length;i++){
                var frames=iframes[i].contentWindow.document.getElementsByTagName("iframe");
                for(var j=0;j<frames.length;j++){
                    var frame=frames[j];
                    if(!frame) return;
                    var fdiv=frame.parentNode;
                    if(!fdiv) return;
                    if(iframes[i].contentWindow.document.getElementsByClassName("ct11_dl")[j]!=null) return;
                    var data=frame.getAttribute('data');
                    if(data!=null){
                        let jsondata=JSON.parse(data);
                        if(jsondata.type==".ppt"||jsondata.type==".pptx"||jsondata.type==".mp4"||jsondata.type==".pdf"||jsondata.type==".flv"||jsondata.type==".doc"||jsondata.type==".docx"||jsondata.type==".avi"||jsondata.type==".wmv"||jsondata.type==".mpg"||jsondata.type==".mpeg"){
                            if(!haveResource) {
                                haveResource=true;
                                downloadLinks=new Array();
                            }
                            downloadLinks.push("https://cs.e.ecust.edu.cn/download/"+jsondata.objectid)
                            var downloadTag = document.createElement("div");
                            downloadTag.setAttribute("href","javascript:void(0)");
                            //downloadTag.setAttribute("href","https://cs.e.ecust.edu.cn/download/"+jsondata.objectid);
                            downloadTag.setAttribute("class","ct11_dl");
                            downloadTag.setAttribute("style","font-size: 14px;color: #666666;cursor:pointer;");
                            downloadTag.innerHTML="点此下载 "+jsondata.name;
                            downloadTag.onclick = function name(params) {
                                window.location = "https://cs.e.ecust.edu.cn/download/"+jsondata.objectid;
                            }
                            fdiv.appendChild(downloadTag);
                            continue;
                        }
                    }
                    if(frame.getAttribute("name")==null) continue;
                    if(frame.getAttribute("name").substr(frame.getAttribute("name").length-4,4)==".mp3"){
                        if(!haveResource) {
                            haveResource=true;
                            downloadLinks=new Array();
                        }
                        downloadLinks.push("https://cs.e.ecust.edu.cn/download/"+frame.getAttribute("objectid"))
                        let objectId = frame.getAttribute("objectid");
                        var adownloadTag = document.createElement("div");
                        adownloadTag.setAttribute("href","javascript:void(0)");
                        //adownloadTag.setAttribute("href","https://cs.e.ecust.edu.cn/download/"+frame.getAttribute("objectid"));
                        adownloadTag.setAttribute("class","ct11_dl");
                        adownloadTag.setAttribute("style","font-size: 14px;color: #666666;cursor:pointer;");
                        adownloadTag.innerHTML="点此下载 "+frame.getAttribute("name");
                        adownloadTag.onclick = function name(params) {
                            window.location = "https://cs.e.ecust.edu.cn/download/"+ objectId;
                        }
                        continue;
                    }
                }
            }
            if(haveResource){
                if(iframes[0].parentNode.getElementsByClassName("ct11_dl")[0]!=null) iframes[0].parentNode.getElementsByClassName("ct11_dl")[0].remove()
                var allDownloadTag = document.createElement("div");
                allDownloadTag.setAttribute("class","ct11_dl");
                allDownloadTag.setAttribute("style","font-size: 14px;color: #666666;cursor:pointer;");
                allDownloadTag.setAttribute("href","javascript:void(0)");
                allDownloadTag.innerHTML="点此下载本节内的全部资源";
                allDownloadTag.onclick = function name(params) {
                    for(var i=0;i<downloadLinks.length;i++){
                        const iiframe = document.createElement("iframe");
                        iiframe.style.display = "none";
                        iiframe.style.height = 0;
                        iiframe.src = downloadLinks[i];
                        document.body.appendChild(iiframe);
                        setTimeout(()=>{
                            iiframe.remove();
                        }, 10000);
                    }
                }
                iframes[0].parentNode.insertBefore(allDownloadTag,iframes[0])
            }
        },3000);
    }
})();
