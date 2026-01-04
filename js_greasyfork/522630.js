// ==UserScript==
// @name         ygn - otof5 V5
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Try to take over the world!
// @author       Your Name
// @license      MIT
// @grant        none
// @match        *://*/*
// ==/UserScript==
function y(x,y="boş"){
	if(x.indexOf(" ")==-1){
    	if(y=="boş"){
        	return document.querySelectorAll(x);
        }else{
        	return document.querySelectorAll(x)[y];
        }
    }else{
    	return document.getElementsByClassName(x);
    }
}
if(window.location.href.indexOf("viewer")==-1){
    document.cookie = "otof5=true";
    var old,c,readyfor=0,name,kik,i,much,kactane,link;
    var root="ygn";

    function unsavedChangesWarning(){
        window.onbeforeunload = function(){
            console.log("ygm");
        };
    }

    if(window.location.href.indexOf("https://gartic.io/")!==-1 && window.location.href.indexOf("?bot")==-1){
        c = setInterval(function(){
            if(document.title.indexOf("#") !== -1){
                if(y("#popUp")[0].style.display == "block"){
                    clearInterval(c);
                }
                y('btYellowBig ic-playHome')[0].click();
            }
        });

        setTimeout(function(){
            clearInterval(c);
        },6000);

        setInterval(function(){
            if(y("contentPopup roomCreated").length > 0 || y("contentPopup rules").length > 0){
                y("btYellowBig ic-yes")[0].click();
                setTimeout(function(){
                    if(y("msg alert").length > 0){
                        y("msg alert")[y("msg alert").length-1].innerText = "ygn";
                        readyfor = 1;
                    }
                    readyfor = 1;
                    y("user you")[0].style.backgroundColor = "#ffee00";
                    if(y(".off").length==0){
                        y("#sounds")[0].click();
                    }
                },500);
            }

            if(document.body.innerText.indexOf("BEKLE")!==-1){
                window.location.href=window.location.href;
            }

            if(y("contentPopup confirm").length > 0){
                y("btYellowBig ic-yes")[0].click();
            }

            if(y(".selected").length > 0){
                y("btYellowBig ic-playHome")[0].click();
                y(".selected")[0].setAttribute("class","");
            }

            if(y("content profile").length > 0){
                name = y(".contentPopup")[0].innerText;
                if(document.cookie.indexOf(name)==-1){
                    document.cookie = "a="+name;
                    y("input",4).value = name;
                    y(".close")[0].click();
                    y("input",4).value = "​ " + name;
                    y("input",4).select();
                    document.execCommand("copy");
                    y("input",4).value = "";
                }else{
                    if(y("btYellowBig ic-votekick").length > 0){
                        y("btYellowBig ic-votekick")[0].click();
                    }else{
                        y(".close")[0].click();
                    }
                }
            }

            if(y("msg alert").length > 0 && readyfor == 1){
                if(document.cookie.indexOf("otof5=true")!==-1 && y("msg alert")[y("msg alert").length-1].innerText.split(" ").indexOf(root) > 0){
                    y("msg alert")[y("msg alert").length-1].innerText = "ygn";
                    old=window.location.href;
                    y("#exit")[0].click();
                    setTimeout(function(){
                        unsavedChangesWarning();
                        window.location.href=old;
                    },300);
                }
            }
        },100);
    }
}



























