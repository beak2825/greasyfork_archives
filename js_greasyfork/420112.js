// ==UserScript==
// @name            WCM模板编辑框美化
// @author          徐交彬
// @namespace       徐交彬
// @description     添加行号，代码高亮、视频库可以不使用Flash上传视频
// @match           http://10.1.33.244:7001/wcm/app/template/*
// @match           http://10.1.55.3:8080/wcm/app/template/*
// @match           http://10.9.41.4:8080/wcm/app/template/*
// @match           http://10.207.19.118:7001/wcm/app/template/*
// @match           http://10.207.19.118:7001/wcm/app/video/video_addedit.jsp*
//   @require    https://code.bdstatic.com/npm/jquery@3.5.1/dist/jquery.min.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/lib/codemirror.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/selection/selection-pointer.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/css-hint.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/html-hint.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/javascript-hint.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/show-hint.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/xml-hint.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/mode/xml/xml.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/mode/javascript/javascript.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/mode/css/css.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/mode/vbscript/vbscript.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/mode/htmlmixed/htmlmixed.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/scroll/annotatescrollbar.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/matchesonscrollbar.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/match-highlighter.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/jump-to-line.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/dialog/dialog.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/searchcursor.js
//   @require    https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/search.js
// @version         0.3.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420112/WCM%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%BE%91%E6%A1%86%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/420112/WCM%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%BE%91%E6%A1%86%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

$(document).ready(function (){
const href = window.location.href
if(href.includes("template")){
$("body").append(`
<link href="https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.3/codemirror.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.3/addon/hint/show-hint.min.css">
<link href="https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.3/addon/dialog/dialog.css" rel="stylesheet">
<style>
.CodeMirror{
    overflow-y: auto;
    overflow-x: hidden;
    height:100%;
}
.CodeMirror-sizer{font-size:13px;}
</style>
`);
 setTimeout(() => {
    var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null
            },
            {
                matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript"
            }]
        };
        var editor = CodeMirror.fromTextArea(document.getElementById("txtContent"), {
            mode: mixedMode,
            selectionPointer: true,
            lineNumbers: true,
            extraKeys: { "Ctrl": "autocomplete" }
        });
}, 500);
}
if(href.includes("video")){
 $("body").prepend(`
 <style>
        #progressBar {
            width: 100%;
            background-color: #f3f3f3;
        }
        #progressBar div {
            width: 0%;
            height: 30px;
            background-color: #4caf50;
            text-align: center;
            line-height: 30px;
            color: white;
        }
 </style>
 	    <form id="uploadForm" onsubmit="window.upload(event)" method="post" style="height:100px">
        <input type="file" name="uf" id="file">
        <input type="text" hidden name="Upload" value="Submit Query">
        <input type="submit" value="上传视频">
    </form>
    <div id="progressBar"><div>0%</div></div>
    <div id="saveDocument" style="display:none">
       <p>编辑标题（可不修改直接保存视频）</p>
       <input type="text" class="saveTitleInput">
       <button class="saveTitle" onclick="window.saveTitle()">保存标题</button>
       <button onclick="window.saveDocument()"  >保存视频</button>
    </div>
    
 `)
}
})
var uploadFile;
unsafeWindow.upload = function(event){

            event.preventDefault(); // 阻止表单的默认提交行为

            let form = $('#uploadForm')[0];
            let formData = new FormData(form);
            // 获取上传文件的名称
            let fileInput = document.getElementById('file');
            if (fileInput.files.length > 0) {
                let fileName = fileInput.files[0].name;
                formData.append('Filename', fileName);
            }
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "http://10.207.4.239:8080/mas/service/upload?appKey=wcm",
                    data: formData,
                    processData: false, // 告诉jQuery不要处理发送的数据
                    contentType: false, // 告诉jQuery不要设置Content-Type请求头
                    dataType: "json",
                    xhr: function() {
                       var xhr = new XMLHttpRequest();
                       xhr.upload.addEventListener('progress', function(event) {
                           if (event.lengthComputable) {
                               var percentComplete = (event.loaded / event.total) * 100;
                               $('#progressBar div').css('width', percentComplete + '%');
                               $('#progressBar div').text(Math.round(percentComplete) + '%');
                           }
                       }, false);
                       return xhr;
                },
                    success: function (response) {
                        // 请求成功回调
                        alert("视频上传成功");
                        uploadFile = response;
                        $("#saveDocument").show()
                        $(".saveTitleInput").val(response.originName)
                    },
                    error: function (e) {
                        // 请求失败回调
                        if (e.statusText == "timeout") {
                            alert("请求超时");
                        } else {
                            alert("上传失败");
                        }
                    }
            });

            })
}

unsafeWindow.saveDocument = function(){
const {bps,width,height,srcFileName,originName} = uploadFile;
const docRelTime = $("#DocRelTime").val()
        function getQueryParams() {
            const params = {};
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            urlParams.forEach((value, key) => {
                params[key] = value;
            });

            return params;
        }
const {ChannelId} = getQueryParams();
let xmlData = `<post-data><method type="save">wcm61_video</method><parameters><DOCTITLE><![CDATA[${originName}]]></DOCTITLE><DOCPEOPLE><![CDATA[]]></DOCPEOPLE><DOCKEYWORDS><![CDATA[]]></DOCKEYWORDS><DOCAUTHOR><![CDATA[]]></DOCAUTHOR><DOCRELTIME><![CDATA[${docRelTime}]]></DOCRELTIME><DOCSOURCE><![CDATA[]]></DOCSOURCE><DOCSOURCENAME><![CDATA[]]></DOCSOURCENAME><TOPFLAG><![CDATA[0]]></TOPFLAG><TOPINVALIDTIME><![CDATA[${docRelTime}]]></TOPINVALIDTIME><DEFINESCHEDULE><![CDATA[]]></DEFINESCHEDULE><SCHEDULETIME><![CDATA[${docRelTime}]]></SCHEDULETIME><UNPUBJOB><![CDATA[]]></UNPUBJOB><UNPUBSCHID><![CDATA[0]]></UNPUBSCHID><UNPUBTIME><![CDATA[]]></UNPUBTIME><DOCABSTRACT><![CDATA[]]></DOCABSTRACT><DOCEDITOR><![CDATA[${UserName}]]></DOCEDITOR><TITLECOLOR><![CDATA[null]]></TITLECOLOR><DOCCONTENT><![CDATA[]]></DOCCONTENT><DOCHTMLCON><![CDATA[]]></DOCHTMLCON><DIRECTLYPUBLISH><![CDATA[0]]></DIRECTLYPUBLISH><OBJECTID><![CDATA[0]]></OBJECTID><CHANNELID><![CDATA[${ChannelId}]]></CHANNELID><SRCFILENAME><![CDATA[${srcFileName}]]></SRCFILENAME><DURATION><![CDATA[14]]></DURATION><WIDTH><![CDATA[${width}]]></WIDTH><HEIGHT><![CDATA[${height}]]></HEIGHT><FPS><![CDATA[0]]></FPS><BITRATE><![CDATA[${bps}]]></BITRATE><SAMPLEID><![CDATA[undefined]]></SAMPLEID><FLOWDOCID><![CDATA[0]]></FLOWDOCID></parameters><method type="setTopDocument">wcm6_document</method><parameters><TOPFLAG><![CDATA[0]]></TOPFLAG><CHANNELID><![CDATA[${ChannelId}]]></CHANNELID><POSITION><![CDATA[0]]></POSITION><DOCUMENTID><![CDATA[0]]></DOCUMENTID><TARGETDOCUMENTID><![CDATA[0]]></TARGETDOCUMENTID><INVALIDTIME><![CDATA[]]></INVALIDTIME><FLOWDOCID><![CDATA[0]]></FLOWDOCID></parameters><method type="saveDocumentPublishConfig">wcm6_publish</method><parameters><OBJECTID><![CDATA[0]]></OBJECTID><DETAILTEMPLATE><![CDATA[0]]></DETAILTEMPLATE><SCHEDULETIME><![CDATA[]]></SCHEDULETIME><FLOWDOCID><![CDATA[]]></FLOWDOCID></parameters><method type="saveAppendixes">wcm6_document</method><parameters><DOCID><![CDATA[0]]></DOCID><APPENDIXTYPE><![CDATA[10]]></APPENDIXTYPE><APPENDIXESXML><![CDATA[<OBJECTS></OBJECTS>]]></APPENDIXESXML><FLOWDOCID><![CDATA[]]></FLOWDOCID></parameters><method type="saveAppendixes">wcm6_document</method><parameters><DOCID><![CDATA[0]]></DOCID><APPENDIXTYPE><![CDATA[20]]></APPENDIXTYPE><APPENDIXESXML><![CDATA[<OBJECTS></OBJECTS>]]></APPENDIXESXML><FLOWDOCID><![CDATA[]]></FLOWDOCID></parameters><method type="saveAppendixes">wcm6_document</method><parameters><DOCID><![CDATA[0]]></DOCID><APPENDIXTYPE><![CDATA[40]]></APPENDIXTYPE><APPENDIXESXML><![CDATA[<OBJECTS></OBJECTS>]]></APPENDIXESXML><FLOWDOCID><![CDATA[]]></FLOWDOCID></parameters><method type="saveRelation">wcm6_document</method><parameters><DOCID><![CDATA[0]]></DOCID><RELATIONSXML><![CDATA[<OBJECTS></OBJECTS>]]></RELATIONSXML><FLOWDOCID><![CDATA[]]></FLOWDOCID></parameters></post-data>`
            $.ajax({
                type: "POST",
                url: "http://10.207.19.118:7001/wcm/app/video/video_addedit_dowith.jsp",
                data: xmlData,
                contentType: "application/xml",
                processData: false,
                success: function(response) {
                    alert("保存成功", response);
                },
                error: function(e) {
                    console.error("上传失败", e);
                }
            });
}

unsafeWindow.saveTitle = function(){
   uploadFile.originName = $(".saveTitleInput").val()
    alert("修改成功")
}

