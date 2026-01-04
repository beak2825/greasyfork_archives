// ==UserScript==
// @name         Chegg Button
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  integrates w chegg
// @author       erik
// @include      https://www.webassign.net/web/Student/Assignment-Responses/*
// @include      http://www.chegg.com/search/*
// @include      http://www.chegg.com/homework-help/questions-and-answers/*



// @downloadURL https://update.greasyfork.org/scripts/369049/Chegg%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/369049/Chegg%20Button.meta.js
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


var q = document.querySelectorAll('div.studentQuestionBox.studentQuestionContent'); //finds all the questions 

for (var i = 0; i < q.length; i++){ // adds a button to each question 
    
    document.body.innerHTML = document.body.innerHTML.replace(q[i].innerHTML, q[i].innerHTML+'<button class="chegg" style="background-color:#ff803a;border:1px solid #ff803a;color:#ffffff;display:inline-block;font-family:"Montserrat",Arial, Geneva, sans-serif;font-size:14px;font-weight:700;line-height:30px;text-align:center;text-decoration:none;width:220px;-webkit-text-size-adjust:none;mso-hide:all;"><img src="https://dl.dropboxusercontent.com/s/is4wgsdet69bxhn/cheganswerswords.png?dl=0" style="height: 40px;padding-right: 8px"/></button>');


}

/**Function looks up your question on chegg under the study tab of Chegg **/
function chegg() { 
	window.open("http://www.chegg.com/search/" + q[index].innerText.trim().replace(/ /g, "%20")+ "/study?");
}

var bns = document.querySelectorAll("button.chegg"); //will get all of the buttons that have the button.chegg query selector 

/**Event Listeners that will be able to tell what index of the button we are clicking on --> leading to searching the right question on chegg **/
var index = 0; //index will be used to find where the question is coming from 

if (bns[0] !== undefined) { 
	bns[0].addEventListener("click", function(){ 
	index = 0; 
	chegg(); 
	});
}
if (bns[1] !== undefined) { 
	bns[1].addEventListener("click", function(){ 
	index = 1; 
	chegg(); 
	});
}
if (bns[2] !== undefined) { 
	bns[2].addEventListener("click", function(){ 
	index = 2; 
	chegg(); 
	});
}
if (bns[3] !== undefined) { 
	bns[3].addEventListener("click", function(){ 
	index = 3; 
	chegg(); 
	});
}
if (bns[4] !== undefined) { 
	bns[4].addEventListener("click", function(){ 
	index = 4; 
	chegg(); 
	});
}
if (bns[5] !== undefined) { 
	bns[5].addEventListener("click", function(){ 
	index = 5; 
	chegg(); 
	});
}
if (bns[6] !== undefined) { 
	bns[6].addEventListener("click", function(){ 
	index = 6; 
	chegg(); 
	});
}
if (bns[7] !== undefined) { 
	bns[7].addEventListener("click", function(){ 
	index = 7; 
	chegg(); 
	});
}
if (bns[8] !== undefined) { 
	bns[8].addEventListener("click", function(){ 
	index = 8; 
	chegg(); 
	});
}
if (bns[9] !== undefined) { 
	bns[9].addEventListener("click", function(){ 
	index = 9; 
	chegg(); 
	});
}
if (bns[10] !== undefined) { 
	bns[10].addEventListener("click", function(){ 
	index = 10; 
	chegg(); 
	});
}
if (bns[11] !== undefined) { 
	bns[11].addEventListener("click", function(){ 
	index = 11; 
	chegg(); 
	});
}
if (bns[12] !== undefined) { 
	bns[12].addEventListener("click", function(){ 
	index = 12; 
	chegg(); 
	});
}
if (bns[13] !== undefined) { 
	bns[13].addEventListener("click", function(){ 
	index = 13; 
	chegg(); 
	});
}
if (bns[14] !== undefined) { 
	bns[14].addEventListener("click", function(){ 
	index = 14; 
	chegg(); 
	});
}
if (bns[15] !== undefined) { 
	bns[15].addEventListener("click", function(){ 
	index = 15; 
	chegg(); 
	});
}
if (bns[17] !== undefined) { 
	bns[17].addEventListener("click", function(){ 
	index = 17; 
	chegg(); 
	});
}
if (bns[18] !== undefined) { 
	bns[18].addEventListener("click", function(){ 
	index = 18; 
	chegg(); 
	});
}
if (bns[16] !== undefined) { 
	bns[16].addEventListener("click", function(){ 
	index = 16; 
	chegg(); 
	});
}
if (bns[19] !== undefined) { 
	bns[19].addEventListener("click", function(){ 
	index = 19; 
	chegg(); 
	});
}
