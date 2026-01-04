// ==UserScript==
// @name         Game8 Idola - この状態異常何？
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  キャラクターのページに直接に状態異常などの説明を表示させる
// @author       You
// @match        https://game8.jp/idola/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415082/Game8%20Idola%20-%20%E3%81%93%E3%81%AE%E7%8A%B6%E6%85%8B%E7%95%B0%E5%B8%B8%E4%BD%95%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/415082/Game8%20Idola%20-%20%E3%81%93%E3%81%AE%E7%8A%B6%E6%85%8B%E7%95%B0%E5%B8%B8%E4%BD%95%EF%BC%9F.meta.js
// ==/UserScript==

var crumbs = document.querySelectorAll('.l-breadcrumb__list > li');
if (crumbs[2].innerText == 'キャラクター' && crumbs.length >= 5){
    wrapper();
}

function wrapper(){
    var statusurl ='/idola/315246';
    var pagebody = document.getElementsByClassName('l-3colMain__center')[0];
    var allstatus = [];
    var parsed = false;
    var allinfo = document.querySelectorAll("td:not([class])");
    var allinfomatches = [];

    for (let i = 0, end = allinfo.length; i < end; i++){
        allinfo[i].addEventListener('mouseenter',function(){hoverevent(i);});
        allinfo[i].addEventListener('mouseleave',unhoverevent);
    }

    var overlay = document.createElement('div');
    overlay.className = 'myoverlay';
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.overflow = 'hidden';
    overlay.style.background = 'rgba(255,255,255,1)';
    overlay.style.zIndex = '10001';
    var overlaycontents = document.createElement('div');
    overlay.appendChild(overlaycontents);
    document.body.appendChild(overlay);

    function hoverevent0(index){
        var elem = allinfo[index];
        var status = elem.innerText.replace(/[\［\］']+/g,'');
        if(!parsed && allstatus.length==0){
            parsed = true;
            grabstatus(status);
        }
        for (let i = 0, end = allstatus.length; i < end; i++){
            if(allstatus[i].innerText == status){
            }
        }
    }

    function hoverevent(index){
        if (allstatus.length == 0 && parsed == false){
            grabstatus(function(){hoverevent(index)});
        } else {
            if (Array.isArray(allinfomatches[index]) == false){
                allinfomatches[index] = creatematches(index);
            }
            displaystatus(allinfomatches[index]);
            positionoverlay(index);
        }
    }

    function unhoverevent(){
        overlay.style.display = 'none';
    }

    function creatematches(index){
        var info = allinfo[index];
        var content = info.innerText;
        var output = [];
        var keywords = (content.match(/\[.+?\]/g)||[]).concat(content.match(/\［.+?\］/g)||[]).map(function(str) {return str.slice(1,-1)});
        for (let i = 0, end = allstatus.length; i < end; i++){
            var text = allstatus[i].querySelector('td').innerText.trim();
            if(keywords.indexOf(text)>-1){
                output.push(i);
            }
        }
        return output;
    }

    function displaystatus(indexes){
        while(overlaycontents.hasChildNodes()){
            overlaycontents.removeChild(overlaycontents.lastChild);
        }
        for (let i = 0, end = indexes.length; i < end; i++){
            allstatus[indexes[i]].querySelectorAll('td').forEach(element => element.style.border = '1px solid #d1d8e2');
            overlaycontents.appendChild(allstatus[indexes[i]]);
        }
    }

    function positionoverlay(index){
        if(overlaycontents.hasChildNodes()){
            var rect = allinfo[index].closest('tr').getBoundingClientRect();
            var x = rect.right;
            var y = rect.top;
            var offx = window.pageXOffset;
            var offy = window.pageYOffset;
            overlay.style.display = '';
            overlay.style.position = 'absolute';
            overlay.style.top = (y+offy)+'px';
            overlay.style.left = (x+offx)+'px';;

        }
    }

    function grabstatus(task){
        if(parsed)return;
        console.log('fetching status data');
        getHTML(statusurl,function(statushtml){
            var parser = new DOMParser().parseFromString(statushtml, 'text/html');
            var alltr = parser.querySelectorAll('tr');
            if(allstatus.length >= alltr.length) return;
            for (let tr = 0, trend = alltr.length; tr < trend; tr++){
                var td = alltr[tr].querySelector('td');
                if(td && td.innerText.length > 0){
                    allstatus.push(alltr[tr]);
                }
            }
            parsed = true;
            if(task){task()};
        });
    }

    function getHTML(link, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", link, false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.responseText);
            }
        };
        xhr.send(null);
    }
}