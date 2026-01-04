// ==UserScript==
// @name        CodingBat FULL cheat - codingbat.com
// @namespace   SaigyoujiYuyuko233
// @match       https://codingbat.com/python/*
// @match       https://codingbat.com/python
// @match       https://codingbat.com/prob/*
// @grant       none
// @version     1.0
// @author      SaigyoujiYuyuko233
// @description Fake stars and check mark, auto fetch answer in github raw
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404056/CodingBat%20FULL%20cheat%20-%20codingbatcom.user.js
// @updateURL https://update.greasyfork.org/scripts/404056/CodingBat%20FULL%20cheat%20-%20codingbatcom.meta.js
// ==/UserScript==

let answer = new Map()

// python - logic - 1
answer.set('p191645', "https://raw.githubusercontent.com/diezguerra/codingbat-python-solutions/master/list-1.py")
answer.set('p195669', "https://raw.githubusercontent.com/snowpolar/codingbat-solutions/master/Python/Logic-1/cigar_party.py");
answer.set('p129125', "https://raw.githubusercontent.com/snowpolar/codingbat-solutions/master/Python/Logic-1/date_fashion.py");
answer.set('p135815', "https://raw.githubusercontent.com/snowpolar/codingbat-solutions/master/Python/Logic-1/squirrel_play.py")
answer.set('p137202', "https://raw.githubusercontent.com/snowpolar/codingbat-solutions/master/Python/Logic-1/caught_speeding.py")
answer.set('p119867', "https://raw.githubusercontent.com/snowpolar/codingbat-solutions/master/Python/Logic-1/alarm_clock.py")
answer.set('', "")
answer.set('', "")
answer.set('', "")
answer.set('', "")
answer.set('', "")
answer.set('', "")


$("img[src='/c1.jpg']").each(function (n, el){
  $(el).attr("src", "/c2.jpg");
});

$("img[src='/s1.jpg']").each(function (n, el){
  $(el).attr("src", "/s2.jpg");
});

let url = window.location.href;
if (url.includes("prob") == true) {
  let problemID = url.split("/")[4];
  let problemAnswerUrl = answer.get(problemID);
  
  if (problemAnswerUrl == undefined) {
    console.log("No answer for question: " + problemID);
    return;
  }
  
  console.log("answer: " + problemAnswerUrl);
  
  let ret = $.ajax({
    url: problemAnswerUrl,
    method: "GET",
    async: false
  });
  
  let responseAnswer = ret.responseText;
  editor.setValue(responseAnswer);
}
