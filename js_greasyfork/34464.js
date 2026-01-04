// ==UserScript==
// @name         Common Framework
// @version      0.6
// @description  Framework to be used by most DF requesters/scripts
// @author       A Meaty Alt
// @grant        none
// ==/UserScript==
var params = $("#flashAlt1")[0].children[0].value;
var sc = params.match(/sc=(.*?)\&/)[1];
var userId = params.match(/userID=(.*?)\&/)[1];
var hashedPassword = params.match(/password=(.*?)\&/)[1];
var pageTime = 0;
getPagetime();
function getPagetime(){
    $.get("https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
      (response) => {
          pageTime = response.match(/pagetime=(.*?)\&/)[1];
      }
  );
}

setInterval(getPagetime, 60000);

function buildSecureBody(){
    return {
        pagetime: pageTime,
        userID: userId,
        sc: sc,
        password: hashedPassword
    };
}

function isOldFirefox(){
    var match = navigator.userAgent.match(/Firefox\/(.*?)\./);
    if(match){
        var version = match[1];
        return version <= 40;
    }
    return false;
}

function isOldishFirefox(){
    var match = navigator.userAgent.match(/Firefox\/(.*?)\./);
    if(match){
        var version = match[1];
        return 40 < version && version <= 50;
    }
    return false;
}