// ==UserScript==
// @name         WebAssign Genius II 
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  WebAssign Genius II uses the First Ever GUI on the WA Platform 
// @author       WebAssign Genius Team 
// @include      https://www.webassign.net/web/Student/Assignment-Responses/*
// @include      http://www.webassign.net/web/Student/Assignment-Responses/*
// @include      http://www.chegg.com/search/*
// @include      http://www.chegg.com/homework-help/questions-and-answers/*
// @include      https://search.yahoo.com/search*

// @downloadURL https://update.greasyfork.org/scripts/370104/WebAssign%20Genius%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/370104/WebAssign%20Genius%20II.meta.js
// ==/UserScript==

if (window.location.href.includes("http://www.chegg.com/search/")){ 
    window.onload = function () { 
        setTimeout(function(){
            if (document.querySelectorAll("a.see-answer").length > 0) { 
            var see_answer = document.querySelectorAll("a.see-answer"); 
            see_answer[0].click();
            } 
        }, 1000);
    }
    
} else if (window.location.href.includes("http://www.chegg.com/homework")){ 
        alert("Your answer is below."); 
        addEventListener("keypress", function(){
            window.scrollBy(0, 620);
        }); //scroll down for demo 
        }

/**Script for Yahoo**/ 
if (window.location.href.includes("search.yahoo.com")){ 

var yahoo_urls = document.querySelectorAll("span.fz-ms.fw-m.fc-12th.wr-bw.lh-17"); 
var yahoo_links = document.querySelectorAll("a.ac-algo.fz-l.ac-21th.lh-24");
for (var i = 0; i < yahoo_urls.length; i++){ 
	if (yahoo_urls[i].innerText.includes("answers.yahoo")){
		yahoo_links[i].click()
	}
}
}

var q = document.querySelectorAll('div.studentQuestionBox.studentQuestionContent'); //finds all the questions 

for (var i = 0; i < q.length; i++){ // adds a button to each question

    document.body.innerHTML = document.body.innerHTML.replace(q[i].innerHTML, q[i].innerHTML+'<button class="chegg" style="background-color:#ff803a;border:1px solid #ff803a;color:#ffffff;display:inline-block;font-family:"Montserrat",Arial, Geneva, sans-serif;font-size:14px;font-weight:700;line-height:30px;text-align:center;text-decoration:none;width:220px;-webkit-text-size-adjust:none;mso-hide:all;"><img src="https://dl.dropboxusercontent.com/s/is4wgsdet69bxhn/cheganswerswords.png?dl=0" style="height: 40px;padding-right: 8px"/></button> <button class="yahoo" style="background-color:#400190;border:1px solid #400190;color:#ffffff;display:inline-block;font-family:"Montserrat",Arial, Geneva, sans-serif;font-size:14px;font-weight:700;line-height:30px;text-align:center;text-decoration:none;width:220px;-webkit-text-size-adjust:none;mso-hide:all;"><img src="https://dl.dropboxusercontent.com/s/x4fm5u64vaem1vt/yahooanswerslogo3.png?dl=0" style="height: 40px;padding-right: 5px"/></button> <button class="google" style="background-color:#FFFFFF;border:1px solid ##FFFFFF;color:#ffffff;display:inline-block;font-family:"Montserrat",Arial, Geneva, sans-serif;font-size:14px;font-weight:700;line-height:30px;text-align:center;text-decoration:none;width:220px;-webkit-text-size-adjust:none;mso-hide:all;"><img src="https://dl.dropboxusercontent.com/s/9yv6gdr8v69e787/googlesearchlogo6.png?dl=0" style="height: 40px;padding-left: 2px;padding-right: 6px"/></button>');

}

/**Function looks up your question on chegg under the study tab of Chegg **/
function chegg_search() { 
	window.open("http://www.chegg.com/search/" + q[index].innerText.trim().replace(/ /g, "%20")+ "/study?");
}

/**Function looks up your question under Yahoo Answers **/
function yahoo_search() { 
	window.open("http://search.yahoo.com/search?p=" + q[index].innerText.trim().replace(/ /g, "%20"));
}

/**Function looks up your question under Google Answers **/
function google_search() { 
	window.open("https://www.google.com/search?q=" + q[index].innerText.trim().replace(/ /g, "%20"));
}


/**Event Listeners that will be able to tell what index of the button we are clicking on --> leading to searching the right question on chegg **/
var index = 0; //index will be used to find where the question is coming from 

var bns_chegg = document.querySelectorAll("button.chegg"); //will get all of the buttons that have the button.chegg query selector 
var bns_yahoo = document.querySelectorAll("button.yahoo"); //will get all of the buttons that have the button.chegg query selector 
var bns_google = document.querySelectorAll("button.google"); //will get all of the buttons that have the button.chegg query selector 

/**Event Listeners that will be able to tell what index of the button we are clicking on --> leading to searching the right question on chegg **/
var index = 0; //index will be used to find where the question is coming from 

if (bns_chegg[0] !== undefined) { 
	bns_chegg[0].addEventListener("click", function(){ 
	index = 0; 
	chegg_search(); 
	});
}
if (bns_chegg[1] !== undefined) { 
	bns_chegg[1].addEventListener("click", function(){ 
	index = 1; 
	chegg_search(); 
	});
}
if (bns_chegg[2] !== undefined) { 
	bns_chegg[2].addEventListener("click", function(){ 
	index = 2; 
	chegg_search(); 
	});
}
if (bns_chegg[3] !== undefined) { 
	bns_chegg[3].addEventListener("click", function(){ 
	index = 3; 
	chegg_search(); 
	});
}
if (bns_chegg[4] !== undefined) { 
	bns_chegg[4].addEventListener("click", function(){ 
	index = 4; 
	chegg_search(); 
	});
}
if (bns_chegg[5] !== undefined) { 
	bns_chegg[5].addEventListener("click", function(){ 
	index = 5; 
	chegg_search(); 
	});
}
if (bns_chegg[6] !== undefined) { 
	bns_chegg[6].addEventListener("click", function(){ 
	index = 6; 
	chegg_search(); 
	});
}
if (bns_chegg[7] !== undefined) { 
	bns_chegg[7].addEventListener("click", function(){ 
	index = 7; 
	chegg_search(); 
	});
}
if (bns_chegg[8] !== undefined) { 
	bns_chegg[8].addEventListener("click", function(){ 
	index = 8; 
	chegg_search(); 
	});
}
if (bns_chegg[9] !== undefined) { 
	bns_chegg[9].addEventListener("click", function(){ 
	index = 9; 
	chegg_search(); 
	});
}
if (bns_chegg[10] !== undefined) { 
	bns_chegg[10].addEventListener("click", function(){ 
	index = 10; 
	chegg_search(); 
	});
}
if (bns_chegg[11] !== undefined) { 
	bns_chegg[11].addEventListener("click", function(){ 
	index = 11; 
	chegg_search(); 
	});
}
if (bns_chegg[12] !== undefined) { 
	bns_chegg[12].addEventListener("click", function(){ 
	index = 12; 
	chegg_search(); 
	});
}
if (bns_chegg[13] !== undefined) { 
	bns_chegg[13].addEventListener("click", function(){ 
	index = 13; 
	chegg_search(); 
	});
}
if (bns_chegg[14] !== undefined) { 
	bns_chegg[14].addEventListener("click", function(){ 
	index = 14; 
	chegg_search(); 
	});
}
if (bns_chegg[15] !== undefined) { 
	bns_chegg[15].addEventListener("click", function(){ 
	index = 15; 
	chegg_search(); 
	});
}
if (bns_chegg[17] !== undefined) { 
	bns_chegg[17].addEventListener("click", function(){ 
	index = 17; 
	chegg_search(); 
	});
}
if (bns_chegg[18] !== undefined) { 
	bns_chegg[18].addEventListener("click", function(){ 
	index = 18; 
	chegg_search(); 
	});
}
if (bns_chegg[16] !== undefined) { 
	bns_chegg[16].addEventListener("click", function(){ 
	index = 16; 
	chegg_search(); 
	});
}
if (bns_chegg[19] !== undefined) { 
	bns_chegg[19].addEventListener("click", function(){ 
	index = 19; 
	chegg_search(); 
	});
}
if (bns_chegg[20] !== undefined) { 
	bns_chegg[20].addEventListener("click", function(){ 
	index = 20; 
	chegg_search(); 
	});
}
if (bns_chegg[21] !== undefined) { 
	bns_chegg[21].addEventListener("click", function(){ 
	index = 21; 
	chegg_search(); 
	});
}
if (bns_chegg[22] !== undefined) { 
	bns_chegg[22].addEventListener("click", function(){ 
	index = 22; 
	chegg_search(); 
	});
}
if (bns_chegg[23] !== undefined) { 
	bns_chegg[23].addEventListener("click", function(){ 
	index = 23; 
	chegg_search(); 
	});
}
if (bns_chegg[24] !== undefined) { 
	bns_chegg[24].addEventListener("click", function(){ 
	index = 24; 
	chegg_search(); 
	});
}
if (bns_chegg[25] !== undefined) { 
	bns_chegg[25].addEventListener("click", function(){ 
	index = 25; 
	chegg_search(); 
	});
}
if (bns_yahoo[0] !== undefined) { 
	bns_yahoo[0].addEventListener("click", function(){ 
	index = 0; 
	yahoo_search(); 
	});
}
if (bns_yahoo[1] !== undefined) { 
	bns_yahoo[1].addEventListener("click", function(){ 
	index = 1; 
	yahoo_search(); 
	});
}
if (bns_yahoo[2] !== undefined) { 
	bns_yahoo[2].addEventListener("click", function(){ 
	index = 2; 
	yahoo_search(); 
	});
}
if (bns_yahoo[3] !== undefined) { 
	bns_yahoo[3].addEventListener("click", function(){ 
	index = 3; 
	yahoo_search(); 
	});
}
if (bns_yahoo[4] !== undefined) { 
	bns_yahoo[4].addEventListener("click", function(){ 
	index = 4; 
	yahoo_search(); 
	});
}
if (bns_yahoo[5] !== undefined) { 
	bns_yahoo[5].addEventListener("click", function(){ 
	index = 5; 
	yahoo_search(); 
	});
}
if (bns_yahoo[6] !== undefined) { 
	bns_yahoo[6].addEventListener("click", function(){ 
	index = 6; 
	yahoo_search(); 
	});
}
if (bns_yahoo[7] !== undefined) { 
	bns_yahoo[7].addEventListener("click", function(){ 
	index = 7; 
	yahoo_search(); 
	});
}
if (bns_yahoo[8] !== undefined) { 
	bns_yahoo[8].addEventListener("click", function(){ 
	index = 8; 
	yahoo_search(); 
	});
}
if (bns_yahoo[9] !== undefined) { 
	bns_yahoo[9].addEventListener("click", function(){ 
	index = 9; 
	yahoo_search(); 
	});
}
if (bns_yahoo[10] !== undefined) { 
	bns_yahoo[10].addEventListener("click", function(){ 
	index = 10; 
	yahoo_search(); 
	});
}
if (bns_yahoo[11] !== undefined) { 
	bns_yahoo[11].addEventListener("click", function(){ 
	index = 11; 
	yahoo_search(); 
	});
}
if (bns_yahoo[12] !== undefined) { 
	bns_yahoo[12].addEventListener("click", function(){ 
	index = 12; 
	yahoo_search(); 
	});
}
if (bns_yahoo[13] !== undefined) { 
	bns_yahoo[13].addEventListener("click", function(){ 
	index = 13; 
	yahoo_search(); 
	});
}
if (bns_yahoo[14] !== undefined) { 
	bns_yahoo[14].addEventListener("click", function(){ 
	index = 14; 
	yahoo_search(); 
	});
}
if (bns_yahoo[15] !== undefined) { 
	bns_yahoo[15].addEventListener("click", function(){ 
	index = 15; 
	yahoo_search(); 
	});
}
if (bns_yahoo[17] !== undefined) { 
	bns_yahoo[17].addEventListener("click", function(){ 
	index = 17; 
	yahoo_search(); 
	});
}
if (bns_yahoo[18] !== undefined) { 
	bns_yahoo[18].addEventListener("click", function(){ 
	index = 18; 
	yahoo_search(); 
	});
}
if (bns_yahoo[16] !== undefined) { 
	bns_yahoo[16].addEventListener("click", function(){ 
	index = 16; 
	yahoo_search(); 
	});
}
if (bns_yahoo[19] !== undefined) { 
	bns_yahoo[19].addEventListener("click", function(){ 
	index = 19; 
	yahoo_search(); 
	});
}
if (bns_yahoo[20] !== undefined) { 
	bns_yahoo[20].addEventListener("click", function(){ 
	index = 20; 
	yahoo_search(); 
	});
}
if (bns_yahoo[21] !== undefined) { 
	bns_yahoo[21].addEventListener("click", function(){ 
	index = 21; 
	yahoo_search(); 
	});
}
if (bns_yahoo[22] !== undefined) { 
	bns_yahoo[22].addEventListener("click", function(){ 
	index = 22; 
	yahoo_search(); 
	});
}
if (bns_yahoo[23] !== undefined) { 
	bns_yahoo[23].addEventListener("click", function(){ 
	index = 23; 
	yahoo_search(); 
	});
}
if (bns_yahoo[24] !== undefined) { 
	bns_yahoo[24].addEventListener("click", function(){ 
	index = 24; 
	yahoo_search(); 
	});
}
if (bns_yahoo[25] !== undefined) { 
	bns_yahoo[25].addEventListener("click", function(){ 
	index = 25; 
	yahoo_search(); 
	});
}
if (bns_google[0] !== undefined) { 
	bns_google[0].addEventListener("click", function(){ 
	index = 0; 
	google_search(); 
	});
}
if (bns_google[1] !== undefined) { 
	bns_google[1].addEventListener("click", function(){ 
	index = 1; 
	google_search(); 
	});
}
if (bns_google[2] !== undefined) { 
	bns_google[2].addEventListener("click", function(){ 
	index = 2; 
	google_search(); 
	});
}
if (bns_google[3] !== undefined) { 
	bns_google[3].addEventListener("click", function(){ 
	index = 3; 
	google_search(); 
	});
}
if (bns_google[4] !== undefined) { 
	bns_google[4].addEventListener("click", function(){ 
	index = 4; 
	google_search(); 
	});
}
if (bns_google[5] !== undefined) { 
	bns_google[5].addEventListener("click", function(){ 
	index = 5; 
	google_search(); 
	});
}
if (bns_google[6] !== undefined) { 
	bns_google[6].addEventListener("click", function(){ 
	index = 6; 
	google_search(); 
	});
}
if (bns_google[7] !== undefined) { 
	bns_google[7].addEventListener("click", function(){ 
	index = 7; 
	google_search(); 
	});
}
if (bns_google[8] !== undefined) { 
	bns_google[8].addEventListener("click", function(){ 
	index = 8; 
	google_search(); 
	});
}
if (bns_google[9] !== undefined) { 
	bns_google[9].addEventListener("click", function(){ 
	index = 9; 
	google_search(); 
	});
}
if (bns_google[10] !== undefined) { 
	bns_google[10].addEventListener("click", function(){ 
	index = 10; 
	google_search(); 
	});
}
if (bns_google[11] !== undefined) { 
	bns_google[11].addEventListener("click", function(){ 
	index = 11; 
	google_search(); 
	});
}
if (bns_google[12] !== undefined) { 
	bns_google[12].addEventListener("click", function(){ 
	index = 12; 
	google_search(); 
	});
}
if (bns_google[13] !== undefined) { 
	bns_google[13].addEventListener("click", function(){ 
	index = 13; 
	google_search(); 
	});
}
if (bns_google[14] !== undefined) { 
	bns_google[14].addEventListener("click", function(){ 
	index = 14; 
	google_search(); 
	});
}
if (bns_google[15] !== undefined) { 
	bns_google[15].addEventListener("click", function(){ 
	index = 15; 
	google_search(); 
	});
}
if (bns_google[17] !== undefined) { 
	bns_google[17].addEventListener("click", function(){ 
	index = 17; 
	google_search(); 
	});
}
if (bns_google[18] !== undefined) { 
	bns_google[18].addEventListener("click", function(){ 
	index = 18; 
	google_search(); 
	});
}
if (bns_google[16] !== undefined) { 
	bns_google[16].addEventListener("click", function(){ 
	index = 16; 
	google_search(); 
	});
}
if (bns_google[19] !== undefined) { 
	bns_google[19].addEventListener("click", function(){ 
	index = 19; 
	google_search(); 
	});
}
if (bns_google[20] !== undefined) { 
	bns_google[20].addEventListener("click", function(){ 
	index = 20; 
	google_search(); 
	});
}
if (bns_google[21] !== undefined) { 
	bns_google[21].addEventListener("click", function(){ 
	index = 21; 
	google_search(); 
	});
}
if (bns_google[22] !== undefined) { 
	bns_google[22].addEventListener("click", function(){ 
	index = 22; 
	google_search(); 
	});
}
if (bns_google[23] !== undefined) { 
	bns_google[23].addEventListener("click", function(){ 
	index = 23; 
	google_search(); 
	});
}
if (bns_google[24] !== undefined) { 
	bns_google[24].addEventListener("click", function(){ 
	index = 24; 
	google_search(); 
	});
}
if (bns_google[25] !== undefined) { 
	bns_google[25].addEventListener("click", function(){ 
	index = 25; 
	google_search(); 
	});
}
