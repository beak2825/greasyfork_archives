    // ==UserScript==
    // @name        LogcheckerPlus
    // @namespace   LogcheckerPlus
    // @author            TNSepta
    // @description Enhancements for Logchecker
    // @include     http*://*apollo.rip/logchecker.php
    // @include     http*://*passtheheadphones.me/logchecker.php
    // @include     http*://*notwhat.cd/logchecker.php
    // @include     http*://*hydra.zone/logchecker.php
    // @version     1
    // @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26227/LogcheckerPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/26227/LogcheckerPlus.meta.js
    // ==/UserScript==
    upTable = document.getElementsByClassName('forum_post vertical_margin')
    if (upTable.length > 0) {
            GM_addStyle (".LCPtooltip {\
        position: absolute;\
        display: inline-block;\
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */}\
            .LCPtooltip .LCPtooltiptext {\
        visibility: hidden;\
        width: 480px;\
        background-color: black;\
        color: #fff;\
        text-align: center;\
        padding: 5px 0;\
        border-radius: 6px;\
        position: absolute;\
        z-index: 1;}\
            .LCPtooltip:hover .LCPtooltiptext {\
        visibility: visible;}");
        upTable[0].innerHTML = '<tr class = \'colhead\'><td colspan=\'2\'>Bulk Upload Files</td></tr><tr><td> <div id=\'fileselect\'>\t<div id=\'filedrag\'><font size = \'60\'>Drop files here</font></div><div id = \'output\'></div></div> </td></tr>' + upTable[0].innerHTML
            // getElementById
        function $id(id) {
            return document.getElementById(id);
        }
            // output information
        function Output(msg) {
            var m = $id('output');
            m.innerHTML = msg + m.innerHTML;
        }
            // call initialization file
        if (window.File && window.FileList && window.FileReader) {
            Init();
        }else{
                    Output("Error, AJAX upload not supported, check your browser!");
            }
            // initialize
        function Init() {
            var fileselect = $id('fileselect'),
                filedrag = $id('filedrag')
            filedrag.style.height = '100px';
            // file select
            fileselect.addEventListener('change', FileSelectHandler, false);
            // is XHR2 available?
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // file drop
                filedrag.addEventListener('dragover', FileDragHover, false);
                filedrag.addEventListener('dragleave', FileDragHover, false);
                filedrag.addEventListener('drop', FileSelectHandler, false);
                filedrag.style.display = 'block';
            }
        }
            // file drag hover
        function FileDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.target.className = (e.type == 'dragover' ? 'hover' : '');
        } // file selection
     
        function FileSelectHandler(e) {
            // cancel event and hover styling
            FileDragHover(e);
            // fetch FileList object
            var files = e.target.files || e.dataTransfer.files;
            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                UploadFile(f);
            }
        }
     
        function UploadFile(file) {
            var xhr = new XMLHttpRequest();
            var reader = new FileReader();
                    reader.onload = function(e) {
                            var url = "logchecker.php"
                            var params = "action=takeupload&submit=Upload+log&pastelog=" + escape(reader.result)
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr.onreadystatechange = function() { //Call a function when the state changes.
                                    if (xhr.readyState == 4 && xhr.status == 200) {
                                            //Grab the relevant information.
                                            anaOut = xhr.responseText.split("<div id=\"content\">")[1].split("<div id=\"footer\">")[0];
                                            console.log(anaOut);
                                            fname = file.name;
                                            logScore = anaOut.split("<strong>Score:</strong>")[1].split("(out of 100)")[0];
                                            if (anaOut.indexOf("Log validation report:")>=0){
                                                    logReport = anaOut.split("<h3>Log validation report:</h3>")[1].split("</blockquote>")[0];
                                            }else{
                                                    logReport = "No log report found, all is good!";
                                            }
                                            Output("<div class = 'LCPtooltip'>"+logScore+"<span class='LCPtooltiptext'>"+logReport+"</span></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+fname+"</div><br>");
                                    }
                            }
                            xhr.send(params);
                    }
            reader.readAsText(file);
        }
    }