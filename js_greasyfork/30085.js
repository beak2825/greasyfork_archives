// ==UserScript==
// @name         sankaku_image_link
// @namespace    https://gist.github.com/E-Badapple
// @version      1.0
// @description  Add an orignal link under the image.
// @author       E-Badapple(BattleCat)
// @match        https://chan.sankakucomplex.com/*
// @match        https://idol.sankakucomplex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30085/sankaku_image_link.user.js
// @updateURL https://update.greasyfork.org/scripts/30085/sankaku_image_link.meta.js
// ==/UserScript==


//监听函数
function mutationEvent() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var obs = new MutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; ++i) {
            for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                if (mutations[i].addedNodes[j].getAttribute('class') === "content-page") {
                    getPage(mutations[i].addedNodes[j].getAttribute('id'));
                }
            }
        }
    });
    
    obs.observe((document.querySelector('#post-list > div.content')), {
        childList: true
    });
    
}

//获取图片位置
function getPage(id){
    var toop;
    
    if (id !== null) {
        toop = document.querySelectorAll('.content > div[id="' + id + '"] > span');
    } else {
        toop = document.querySelectorAll('.content > div > span');
    }
    for(var i = 0 ; i < toop.length ; i++){
        var idUrl = "/ja/post/show/" + toop[i].getAttribute('id').split('p')[1];
        getURL(idUrl, toop[i].getAttribute('id'));
    }
}

//获取大图网址
function getURL(idUrl,id){
    //var xmlhttp = new XMLHttpRequest();
    var x;
    var url;
    var imageURL;
    
    var toop = document.getElementById(id);
    imageURL = toop.getElementsByClassName('preview')[0].getAttribute('src').match(/preview(.*?)\.jpg/)[1];
    if( window.location.host.indexOf('chan\.sankakucomplex') > -1 )
        url = 'https:\/\/cs\.sankakucomplex\.com\/data' + imageURL;
    else
        url = 'https:\/\/is\.sankakucomplex\.com\/data' + imageURL;
    
    AddImagelink(url,id);
    /*
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            x=xmlhttp.responseText;
            //if( x.indexOf("highres") > -1 ) {
                url = "https://"+xmlhttp.responseText.match(/href=\"\/\/(.*?)\ (.*?)highres/)[1];
            //}
           // else {
           //     url = "https://"+xmlhttp.responseText.match(/href=\"\/\/(.*?)\ (.*?)lowres/)[1];
           // }
            AddImagelink(url,id);
        }
        else if( xmlhttp.status==429 ){
            getURL(idUrl,id);
        }
    };
    xmlhttp.open("GET",idUrl,true);
    xmlhttp.send();
    */
    
    /*
    xmlhttp.open("GET",idUrl,true);
    xmlhttp.onload = function(){
        if( xmlhttp.responseText.indexOf("highres") > -1 ) {
                url = "https://"+xmlhttp.responseText.match(/href=\"\/\/(.*?)\ (.*?)highres/)[1];
            //url = xmlhttp.responseText.split("\" id=\"highres\"")[0];
            //alert(xmlhttp.responseText);
            }
            else {
                //url = xmlhttp.responseText.match(/<a href=(.*?)(.*?)(.*?) id=(.?*)lowres/)[1];
            }
            AddImagelink(url,id);
    };
    xmlhttp.send();
    */
}

//创建link
function AddImagelink(url,id){
    var toop = document.getElementById(id);
    var p = document.createElement('p');
    var p2 = document.createElement('p');
    var ulJPG = document.createElement('ul');
    var ulPNG = document.createElement('ul');
    var urlJPG = url + '\.jpg';
    var urlPNG = url + '\.png';
    var imagelinkJPG = document.createElement('a');
    var imagelinkPNG = document.createElement('a');
    imagelinkJPG.setAttribute('href',urlJPG);
    imagelinkJPG.setAttribute('style','color: #0069b1; background-color:#cceeff; border-radius: 5px; padding: 0 6px;');
    imagelinkJPG.innerHTML = 'Original-link-jpg</br>';
    imagelinkPNG.setAttribute('href',urlPNG);
    imagelinkPNG.setAttribute('style','color: #0069b1; background-color:#cceeff; border-radius: 5px; padding: 0 6px;');
    imagelinkPNG.innerHTML = 'Original-link-png';
    p.setAttribute('style','margin: 5px 0');
    
    p.appendChild(imagelinkJPG);
    p2.appendChild(imagelinkPNG);

    if(!toop.getElementsByTagName('p')[0]){
        toop.appendChild(p);
        toop.appendChild(p2);
        toop.setAttribute('style','height:auto');
    }
}

//打开网页函数
function firstStart(){
    var toop = document.getElementsByClassName('content')[0].getElementsByClassName('thumb');
    for(var i = 0 ; i < toop.length ; i++){
        var idUrl = "/ja/post/show/" + toop[i].getAttribute('id').split('p')[1];
        getURL(idUrl, toop[i].getAttribute('id'));
    }
 }

firstStart();
mutationEvent();