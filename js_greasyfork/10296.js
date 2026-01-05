// ==UserScript==
// @name       MTurkGrindMode
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://www.mturkgrind.com/threads/*
// @match      http://mturkforum.com/showthread.php*
// @copyright  2012+, You
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/10296/MTurkGrindMode.user.js
// @updateURL https://update.greasyfork.org/scripts/10296/MTurkGrindMode.meta.js
// ==/UserScript==


window.addEventListener('load', findTOTables(), false);

function findTOTables() {


    var hostname = window.location.hostname;
    var loc = window.location.search.substr(1);
   //debugger;
    if(loc != "a=0" && document != undefined){


        if(hostname ==" mturkforum.com"){
            var pagenav = document.body.getElementsByClassName("pagination_top");
            var docTables = document.body.getElementsByTagName("table")
            }else{
                var pagenav = document.body.getElementsByClassName("PageNav");
                var docTables = document.body.getElementsByClassName("ctaBbcodeTable")
                }

        var body2 = document.createElement("body");
        var i = 0;
        var div = document.createElement("div");
        var a = document.createElement("a");
        a.href = window.location.href + "?a=0";
        a.textContent = "orig page";
        
        var lastPage = pagenav[0].getAttribute('data-last');
        var makeBeep = false;
        if(sessionStorage.lastPage != null){
            if(lastPage > sessionStorage.lastPage){
                makeBeep = true;
            }
        }
        sessionStorage.lastPage = lastPage;
        div.appendChild(pagenav[0]);
        div.appendChild(a);
        body2.appendChild(div);
        var divTop = div.cloneNode(true);
        var numTables = docTables.length;
        for(i = 0; i < docTables.length;i++){
            var origLen = docTables.length;
            var div = document.createElement("div");
            div.setAttribute("style", "border: 1px solid black");
            var cell = docTables[i].tBodies[0].rows[0].cells[0];
            var a = cell.getElementsByTagName("a");
            var a1 = a[0];
            var href = a1.href.replace("preview","previewandaccept");
            var ahref = document.createElement("a");
            var table = document.createElement("table");
            table = docTables[i];
            ahref.href = href;
            ahref.textContent = "|      Accept";
            cell.childNodes[2].appendChild(ahref);
            var findMsgContent = table.parentElement;
            for(var j = 0; j < 10; j++){
                if(findMsgContent.className == "messageContent"){
                    break;
                }else{
                    findMsgContent = findMsgContent.parentElement;
                }
            }
            if(j == 10) div.appendChild(table.parentElement);
            else div.appendChild(findMsgContent);
            body2.appendChild(div);
            if(origLen > docTables.length) i--;
        }
        body2.appendChild(divTop);
        document.body  = body2;
        
        if(makeBeep || sessionStorage.numTables != null){
            if(makeBeep || numTables > sessionStorage.numTables ){
                var audiofile1 = document.createElement('audio');
                audiofile1.src = 'data:audio/mpeg;base64,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6NXZkdZ3MukNElAAABJwSEsIkoDa9J6aLwOpDW58qmdDWXUFiNJHPRo4pQJ+ihRKPQCFF5gwp9AwlHmQPAELK1QFHG+IiuCz8Nfee1PiJ9AifbrBXFgnHhJ8Kt3449nvscOA1Z0OupSNhkkApuUwUJLaN16X0MFGD+VJfjmP5vIKAU0awsdJspki118OSbGgeHl8ws+hm6UFjLqBWT1ERXqJOncRdLJxFkE1B3h2sxrO4hxKKREawa6ZVVKHUoUHRyBKWNMqEtUdBAAABSgdUZtLaYrMPk4Dmin6sqUuMQn/+5IEDQAC8CpP6ekTcF2GCh09iA4KYNkWp5hJwSsYo6TzDHjAy7kIZg1KbK2ImvREJiEzccWRb/equledEKorNJoUkUlhSSw2Y3hQEvUwUTEolfBU6s62o7Wd87nsSuncSncs//+WljLJ9TAgAAHqHVGSiCBEKUIEgDOHYij0AEbxGTctGTwszXqKr7WtfwLXrlA2FrmsoWX1FTaVAUh7F61f6itfJIdHLXNSv/AselXf9Z3DuCrpIe4O8Sx487XJdn3yvoAaoAB6PA80qh0OKxQ1dZFrkpI2yLJPLkQnz2rZRacnKrar6GoFEylY0tHKyG1LQ0v+Z18rGMb0crBgkejByCMeHVFfW5S3Q51WeS1P6zsSxF0iUFSWcKloR08FWqQEWRKS84StFtl8rUSiVMTMolmlDH/VlbWGpdbjH6xf81WRjXP/pbaqvS/oU6IpZYNf/rLP0z34d/WGpLVVnsiIajBQkbpIjPPxPqRFohFpkYLoEcHRzL9WsBCwsLCwjFWGfFhVixUUFqm8WFxX8VFG1C3ULisVFRZv8VZ/6xRt//uSBB8P8icOMZHpGhBLA2YQPYYWAAABpAAAACAAADSAAAAEQsz/8UbULBeizEbJ4IY4D2KBWQyodkE0E82jWdpOLAijzLzc3Jp2mjTizSj4tnKPFiRoeKC0WFmahcV/ijf6/6xRv6hcVxX1NxbxdlYq3qbULUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
                
                audiofile1.volume = 1;
                audiofile1.play();
            }
        }
        
        sessionStorage.numTables = numTables;
        setTimeout(function () { location.reload(true); }, 30000);
    }

}
