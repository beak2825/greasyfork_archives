// ==UserScript==
// @name         Endchan Plus
// @namespace    https://greasyfork.org/en/scripts/380490-endchan-plus
// @version      0.5
// @description  Small improvements for users.
// @author       Doc
// @include      https://endchan.xyz/*
// @match https://endchan.org/*/*
// @match https://endchan.net/*/*
// @match https://endchan.xyz/*/*
// @grant        none
// @copyright 2019, drchloe2 (https://openuserjs.org//users/drchloe2)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/380490/Endchan%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/380490/Endchan%20Plus.meta.js
// ==/UserScript==


//NAME SAVER
 var name = '';
if (localStorage.getItem("name")){
    name = localStorage.getItem("name")
} else {
    localStorage.setItem("name", "")
}

document.addEventListener('keyup', function(e){
if (e.target.id == 'fieldName' || e.target.id == 'qrname'){
    name = e.target.value;
    localStorage.setItem("name", name)
} else {
document.querySelector('#fieldName').value = name;
document.querySelector('#qrname').value = name;
}
});



var old = '';
var preview = document.createElement('div');
preview.style = 'position:absolute;right:0px;';

var latch = false;
setInterval(function(){
    if (JSON.stringify(selectedFiles) != old){
        old = JSON.stringify(selectedFiles);
        makethumbs();
    };
    if (latch){return};
    if (document.querySelector('#fieldName').name == "name"){
        document.querySelector('nav').appendChild(preview);
        latch = true;
        //go();
    }
}, 200);

setTimeout(function(){go();
                     document.querySelector('#fieldName').value = name;
document.querySelector('#qrname').value = name;
                     }, 2000)

function makethumbs(){
    if (window.FileReader) {
        preview.innerHTML = '';
        for (var i = 0; i < selectedFiles.length; i++) {
            var Reader = new FileReader();
            var file = selectedFiles[i];
            if (file.type.indexOf("video") > -1) {
                Reader.onload = function (event) {
                    var t = document.createElement('video');
                    t.autoplay = true;
                    t.muted = true;
                    t.style = "max-height:150px;margin-left:2px;";
                    t.src = event.target.result;
                    preview.appendChild(t);
                };
                Reader.readAsDataURL(file);

            } else {

                Reader.onload = function (event) {
                    var t = document.createElement('img');
                    t.style = "max-height:150px;margin-left:2px;";
                    t.src = event.target.result;
                    preview.appendChild(t);
                };
                Reader.readAsDataURL(file);

            };
        }
    } else {
        alert('no filereader');
    }

};

//HOVER
var hover = document.createElement('img');
var vhover = document.createElement('video');
vhover.autoplay = true;
vhover.muted = true;
vhover.loop = true;
document.body.appendChild(vhover);
document.body.appendChild(hover);
var s = 'position:fixed;max-height:90vh;top:0px;right:0px;pointer-events:none;z-index:9999;';
hover.style = s;
vhover.style = s;

document.addEventListener('mouseover', function (e) {
    if (e.target.nodeName == 'IMG') {
        if (e.target.parentNode.className == 'imgLink' && e.target.className != 'imgExpanded') {
            hover.src = e.target.parentNode.href;
        };
        if (e.target.src.indexOf('video') != -1) {
            vhover.src = e.target.src.replace('t_', '') + '.' + e.target.src.split('video')[1]
        }
    } else {
        hover.src = '';
        vhover.src = '';
    }
});


function go(){
    console.log('go');
    //POST WATCHER
    var targetNode = document.querySelector('.divPosts');
    var config = {childList : true};
    var newpost = function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                var mut = mutation.addedNodes[0].querySelector('.divMessage');
                mut.outerHTML = '<br>'+mut.outerHTML;
                console.log(mutation.addedNodes);
            }
        }
    };
    var observer = new MutationObserver(newpost);
    observer.observe(targetNode, config);
};

