// ==UserScript==
// @name        YouTube Channel Video Searcher
// @namespace   http://www.diamonddownload.weebly.com
// @version     1.2.0
// @description Searches for videos by keywords and returns them with title and link in the textbox.
// @include     *youtube.com/user/*/videos*
// @copyright   2014+, RGSoftware
// @author      R.F Geraci
// @icon64      http://icons.iconarchive.com/icons/treetog/i/64/Search-icon.png
// @licence     MIT
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/4650/YouTube%20Channel%20Video%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/4650/YouTube%20Channel%20Video%20Searcher.meta.js
// ==/UserScript==

var count = 0;
var i;
var filter; 
var reject;
var Int;
var titles = document.getElementsByClassName('yt-uix-sessionlink yt-uix-tile-link  yt-ui-ellipsis yt-ui-ellipsis-2');//yt-uix-sessionlink yt-uix-tile-link  spf-link  yt-ui-ellipsis yt-ui-ellipsis-2
var splitterAdded = false;
var lastMethodType = "";
var ajaxInterval;
var AbstractTextAlreadyExists = false;
var labelAnimInt;
var AnimCount = 0;
var AnimInterval;
var alreadyAdded = false;

var p = document.getElementsByClassName('branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-has-top-row branded-page-v2-secondary-column-hidden')[0];

var ele = document.createElement('textarea');
ele.id = "myTextBox";
ele.className = "   yt-card  clearfix";
ele.setAttribute('style', 'width: 100%; height: 285px; position: relative; outline: none; margin: 0px !important; max-width: 100%;'); //border: 1px dashed deepskyblue;
p.appendChild(ele);

var Sbox = document.createElement('input');
Sbox.type = 'text';
Sbox.className = "   yt-card  clearfix";
Sbox.setAttribute('style', 'margin: 0px 0px 5px 0px !important;'); //border: 1px dashed deepskyblue;
Sbox.placeholder = "Search Term";
Sbox.id = "mySearch";
p.appendChild(Sbox);

var rbox = document.createElement('input');
rbox.type = 'text';
rbox.className = "   yt-card  clearfix";
rbox.setAttribute('style', 'margin: 0px 0px 5px 5px !important;'); //border: 1px dashed deepskyblue;
rbox.placeholder = "Reject Term";
rbox.id = "myReject";
p.appendChild(rbox);

var lbl = document.createElement('label');
lbl.id = "mylbl";
lbl.setAttribute('style', 'margin-left: 5px;');
lbl.innerText = "Case Sensitive";
p.appendChild(lbl);

var ckBox = document.createElement('input');
ckBox.type = 'checkbox';
ckBox.setAttribute('style', 'position: relative; top: 2px;');
ckBox.checked = false;
ckBox.id = "myCkBox";
p.appendChild(ckBox);
/*
var lbl_MatchWord = document.createElement('label');
lbl_MatchWord.id = "mylbl_MatchWord";
lbl_MatchWord.setAttribute('style', 'margin-left: 5px;');
lbl_MatchWord.innerText = "Match As Word";
p.appendChild(lbl_MatchWord);

var ckbox_MatchWord = document.createElement('input');
ckbox_MatchWord.type = 'checkbox';
ckbox_MatchWord.checked = true;
ckbox_MatchWord.setAttribute('style', 'position: relative; top: 2px;');
ckbox_MatchWord.id = "myCkBox_MatchWord";
p.appendChild(ckbox_MatchWord);
*/
var log_label = document.createElement('label');
log_label.id = "log_label";
log_label.setAttribute('style', 'float: right; display: none; margin-top: 5px;');
log_label.innerText = "Status:";
p.appendChild(log_label);

var btn = document.createElement('button');
btn.type = 'button';
btn.innerText = 'Search Videos';
btn.id = "myBtn";
btn.className = "yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more browse-items-load-more-button";
p.appendChild(btn);


function addData(){
    
    var title = titles[i].title + "\n";
    var href = titles[i].href.slice(0, -30);
    
    if (ele.value.indexOf(href) == -1){
        
        /*
        if (ele.value != "" && ele.value.indexOf("http") == -1){
            if (!AbstractTextAlreadyExists){
                ele.value += "\n\n";
                AbstractTextAlreadyExists = true;
            }
        }
        */
        
        ele.value += title + href + "\n\n";
        
        //titles[i].className = "Title-Done"; 
        count++;
    } else{
        alreadyAdded = true;
    }
}

function searchWithCase(){
    
    if (reject != "" && filter == ""){
        
        if (titles[i].innerHTML.indexOf(reject) == -1){
            addData();
        } 
        
        
    }else if (filter != "" && reject == ""){
        
        if (titles[i].innerHTML.indexOf(filter)> -1){
            addData();
        } 
    }else if (reject != "" && filter != ""){
        if (titles[i].innerHTML.indexOf(filter) > -1 &&  titles[i].innerHTML.indexOf(reject) == -1){
            addData();
        } 
    }
        }

function searchWithOutCase(){
    
    if (reject != "" && filter == ""){
        
        if (titles[i].innerHTML.toLowerCase().indexOf(reject.toLowerCase()) == -1){
            addData();
        } 
        
    }else if (filter != "" && reject == ""){
        
        if (titles[i].innerHTML.toLowerCase().indexOf(filter.toLowerCase())> -1){
            addData();
        } 
    }else if (reject != "" && filter != ""){
        if (titles[i].innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1 && titles[i].innerHTML.toLowerCase().indexOf(reject.toLowerCase()) == -1){
            addData();
        } 
    }
        }

function ElementValueIncrement(e){
    
    switch (AnimCount){
        case 0:
            e.innerText = 'Auto Searching';
            break;
        case 1:
            e.innerText = 'Auto Searching.';
            break;
        case 2:
            e.innerText = 'Auto Searching..';
            break;    
        case 3:
            e.innerText = 'Auto Searching...';
            AnimCount = 0;
            break;  
    }
    
    AnimCount++;
    
}

function search(){
    
    
    for (i = 0; i < titles.length; i++){
        
        if (filter != "" || reject != ""){
            
            if (ckBox.checked){
                //window.clearInterval(Int); //Checkbox would normally stop auto add to box
                searchWithCase();
                
            }else{
                //window.clearInterval(Int); //Checkbox would normally stop auto add to box
                searchWithOutCase();
            }
        }else{
            addData(); 
            
        }  
        
    }
    
    if (count != 0){
        if (count == 1){
            log_label.innerText = "Status: " + count + " " + "Result Found";
        }else{
            log_label.innerText = "Status: " + count + " " + "Results Found";
        }
    }else{
        if (alreadyAdded){
            log_label.innerText = "Status: Already Added"; 
        }else{
            log_label.innerText = "Status: No Results"; 
        }
    }
    
    
    
    var ajaxBtn = document.getElementsByClassName('yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more browse-items-load-more-button')[0];
    
    if (ajaxBtn != undefined){
        if(!ajaxBtn.hasAttribute('id')){
            btn.disabled = true;
            window.scrollTo(0,document.body.scrollHeight);
            ajaxBtn.click();
            ele.scrollTop = ele.scrollHeight;
            ElementValueIncrement(btn);
            
        }else{
            
            btn.innerText = 'Search Videos';
            window.scrollTo(0,document.body.scrollHeight);
            ele.scrollTop = ele.scrollHeight;
            btn.disabled = false;
            clearInterval(Int);   
            return;
        }
    }  
}

btn.onclick = function(){
    
    filter = Sbox.value;
    reject = rbox.value;  
    
    /*
    if (ckbox_MatchWord.checked){
        filter += ""; //doesn't work
        reject += ""; //doesn't work
    }
    */
    alreadyAdded = false;
    window.clearInterval(Int);
    Int = window.setInterval(search, 250);
    log_label.style.display = 'block';
    // log_label.innerText = "Status:";
    count = 0;
};

ele.onkeydown = function(){
    window.clearInterval(Int);  
    btn.innerText = 'Search Videos';
};


Sbox.onkeydown = function(){
    
    window.clearInterval(Int);  
    btn.innerText = 'Search Videos';
    
};

rbox.onkeydown = function(){
    
    window.clearInterval(Int);  
    btn.innerText = 'Search Videos';
    
};

ele.onblur = function(){
    // Int = window.setInterval(function(){search();}, 100);
};
//yt-uix-sessionlink yt-uix-tile-link  yt-ui-ellipsis yt-ui-ellipsis-2





