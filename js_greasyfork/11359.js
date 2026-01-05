// ==UserScript==
// @name       Deal Dispute on Postbit
// @namespace  http://codeinstitution.net/DealDisputePostbit
// @version    1.3
// @description  Deal Disputes will be shown on postbit
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include     *hackforums.net/*
// @copyright  2014+, Saad T (King of Hearts)
// @downloadURL https://update.greasyfork.org/scripts/11359/Deal%20Dispute%20on%20Postbit.user.js
// @updateURL https://update.greasyfork.org/scripts/11359/Deal%20Dispute%20on%20Postbit.meta.js
// ==/UserScript==

URL = window.location.href;
if(URL.indexOf("hackforums.net/showthread.php") > -1){    
    var x = document.querySelectorAll('.navigation > a');
    if(x[1].innerHTML == "Marketplace"){
        injectjs();
      posts = $("#posts").find("td[class='post_author']");
      authorInfo = $("#posts").find("td[class='smalltext post_author_info']");
        var l = posts.length;
        for(var i = 0; i < l; i++){
            username = $(posts[i]).find(".largetext");
            var res = username[0].innerHTML.match(/<a href="(.*)"><span class="(.*)">(.*)<\/span>/);
            
            var uid = (res[1].substr(res[1].indexOf('uid=') + 4));
            usernameN = res[3];
            authorInfo[i].innerHTML += '<br /><div id="dealdispute'+i+'"><a href="javascript:void(0)" onclick="document.getElementById(\'dealdispute'+i+'\').innerHTML = getScams(\''+usernameN+'\', '+uid+');">Checks for Deal Disputes</a></div><br><a href="trustscan.php?uid='+uid+'">Trust Scan</a>';//getScams(usernameN);
        }
    }
}else if(URL.indexOf("hackforums.net/disputedb.php?user=") > -1){
  var user = URL.split("?user=")[1];
  document.body.outerHTML = /<body.*?>([\s\S]*)<\/body>/.exec(getScams(user), -1)[1];
    
}

function getScams(user){
    var data = null;
    $.ajax({
          type: "POST",
        async: false,
          url: "disputedb.php",
          data: {
            username:user,
              action: "do_search",
              submit: "search",
              my_post_key:document.documentElement.innerHTML.split('my_post_key = "')[1].split('";')[0]
          }}
          ).done(function( dataR ) {
            data = dataR;
          });
  return data;
}


function injectjs() {
    $('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" />"<script type="text/javascript">'+ 'function getScams(user, uid){var data = null; var toReturn = ""; if(uid > -1){ console.log(uid); $.ajax({ type: "GET", async: false, url: "reputation.php?uid=" + uid, } ).done(function( dataR ) { var negative = dataR.match(/<a href="reputation\\.php\\?uid=(.*)&amp;show=negative">(.*)<\\/a>/); var neutral = dataR.match(/<a href="reputation\\.php\\?uid=(.*)&amp;show=neutral">(.*)<\\/a>/); if(negative[2] > 0){ toReturn += "<span style=\\"color:red\\">Negative Feedbacks: "+ negative[0] +"</span>"; }else{ toReturn += "<span style=\\"color:green\\">Negative Feedbacks: 0</span>"; } if(neutral[2] > 0){ toReturn += "<br><span style=\\"color:red\\">Neutral Feedbacks: "+ neutral[0] +"</span>"; }else{ toReturn += "<br><span style=\\"color:green\\">Neutral Feedbacks: 0</span>"; } var negativeWordsFound = dataR.match(/(scam|caution|shady|lier)/igm); if(negativeWordsFound && negativeWordsFound.length > 0){toReturn += \"<br>The following negative words were found in the first page rep: <br><span style=\\"color: red\\"> ["+ negativeWordsFound +"]</span>\"} }); }  toReturn += "<br>"; $.ajax({          type: "POST",        async: false,          url: "disputedb.php",          data: {            username:user,              action: "do_search",              submit: "search",              my_post_key:document.documentElement.innerHTML.split("my_post_key = \\"")[1].split("\\";")[0]          }}).done(function(dataR) {            data = dataR;          }); if(data.indexOf("No Results") > -1){toReturn += "<br>Deal Disputes: <span style=\\"color:green\\">None</span>";}else{tds = $(data).find(\'table:eq(1)\').find(\'td\');var count = 0;        for(var i = 5; i < tds.length; i+=5){            if($(tds).eq(i + 5).text() == "Open" &&$(tds).eq(i + 3).text() == user){                count++;            }        }if(count == 0){toReturn += "<br>Deal Disputes: <span style=\\"color:green\\">None</span>";}else {toReturn += "<br>Deal Disputes: <span style=\\"color:red\\"><a href=\\"/disputedb.php?user="+user+"\\">"+count + "</a></span>";}} return toReturn;}' +'</script>').appendTo($('head')); 
}