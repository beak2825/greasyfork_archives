// ==UserScript==
// @name         海天下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       z'y'l
// @match        https://anno.horizon.ai/web/html-program/program_list_b.html
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/392676/%E6%B5%B7%E5%A4%A9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392676/%E6%B5%B7%E5%A4%A9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

    function batchDownload(filesForDownload){
        var temporaryDownloadLink = document.createElement("a");
        temporaryDownloadLink.style.display = 'none';

        document.getElementById("root").appendChild( temporaryDownloadLink );

        for( var n = 0; n < filesForDownload.length; n++ )
        {
            var download = filesForDownload[n];
            temporaryDownloadLink.innerText = "dianjixiazai";
            temporaryDownloadLink.style.float = 'right';
            temporaryDownloadLink.setAttribute( 'href', download.path );
            temporaryDownloadLink.setAttribute( 'download', download.name );
            temporaryDownloadLink.click();
        }

        document.body.removeChild( temporaryDownloadLink );
    }

    setInterval(function(){
        if(!document.querySelector('#yijianxia')){
             let btn = document.createElement('a');
            btn.type = 'button';
            btn.id = 'yijianxia';
            btn.textContent = '一键下载音频'
            btn.href = 'javascript:void(0)'
            btn.style = 'margin-left:10px'
            let div = document.querySelector(".table tbody tr td:last-child");
            div.appendChild(btn);
            btn.onclick = function(){
                /*let videos = document.querySelectorAll('video');
                let srcs =[];
                let strings = "";
                for(let i =0;i < videos.length;i++){
                    let src = videos[i].src.replace(/^http/, 'https');
                    srcs.push(src);
                    strings += src
                    if(i != videos.length - 1){
                        strings += '\n'
                    }
                }*/
                //alert(1)
                let projectId =this.parentNode.parentNode.firstChild.textContent;
                 //alert(projectId);
                 GM_xmlhttpRequest({
                url : 'https://anno.horizon.ai/datasys/disp/data/dispose/?project='+projectId+'&seq=0&type=2&mode=1&tool_type=label&tool_name=%E6%A0%87%E6%B3%A8&ori_path=/web/html-program/program_list_b.html',
                method : 'GET',
                onload :function(data){
                    let responseText = JSON.parse(data.responseText);
                    //GM_log(responseText);
                    let strings = "";
                    let list = responseText.data.content.map(e=>{
                        return e.img.major.url;
                    });
                    for(let i in list){
                        strings += "https:" + list[i] + "\n";
                    }
                    copyStringToClipboard(strings)
                }, onerror: function(data){
                    GM_log('error', data);
                }
            });
                //copyStringToClipboard(strings);
               //batchDownload(srcs.map((s,i)=>{return {path : s , name : i+".wav"}}));
            }
        }
    }, 1500);

    // Your code here...
})();