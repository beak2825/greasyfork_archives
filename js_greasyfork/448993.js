// ==UserScript==
// @name         致远协同办公_直接打开文件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  看文件还要弹个窗口？我就不！
// @author       kakasearch
// @match        https://oa.chinaonebuild.com/seeyon/main.do?method=toDoc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinaonebuild.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448993/%E8%87%B4%E8%BF%9C%E5%8D%8F%E5%90%8C%E5%8A%9E%E5%85%AC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448993/%E8%87%B4%E8%BF%9C%E5%8D%8F%E5%90%8C%E5%8A%9E%E5%85%AC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pdf_direct_download = 0
    function main(){
        //console.log("run main")
    let init = setInterval(
        function(){
            let dataframe = document.querySelector("#dataIFrame")
            if(dataframe && dataframe.contentDocument.getElementById("rightFrame") && dataframe.contentDocument.getElementById("rightFrame").contentDocument.querySelectorAll("#bodyIDdocgrid > tr> td:nth-child(3) > div >a").length ){
                clearInterval(init)
                //console.log("init done")
                let rightframe = dataframe.contentDocument.getElementById("rightFrame")
                let trs = rightframe.contentDocument.querySelectorAll("#bodyIDdocgrid > tr")
                for(let tr of trs){
                    let type_img = tr.querySelector("td:nth-child(2) > div >img")
                    if(!/folder/.test(type_img.src)){
                    //非文件夹。文件夹还在原地打开
                       if(pdf_direct_download && /pdf/.test(type_img.src)){
                            //pdf要更进一步，把下载链接放过来、
                           let sourceid = tr.querySelector(" td > div>input[id^= 'sourceId_' ]").value
                           let a = tr.querySelector(" td:nth-child(3) > div >a")
                           if(/'(\d+)'/.test(a.href)){
                            a.href = "https://oa.chinaonebuild.com/seeyon/fileDownload.do?method=doDownload&filename="+a.innerText+"&fileId="+sourceid +"&response-content-type=application/octet-stream"
                            a.target="_blank"
                        }

                       }else{
                       let a = tr.querySelector(" td:nth-child(3) > div >a")
                        if(/'(\d+)'/.test(a.href)){
                            a.href = "https://oa.chinaonebuild.com/seeyon/doc.do?method=knowledgeBrowse&docResId="+/'(\d+)'/.exec(a.href)[1]
                            a.target="_blank"
                        }
                       }

                    }

                }
            }
        },200
    )
    }
   // ##############################################

    let obser = setInterval(main,1000)
})();