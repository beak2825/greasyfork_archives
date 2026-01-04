// ==UserScript==
// @name         Back to Top
// @namespace    https://github.com/maijz128
// @version      0.2
// @description  Scroll Back To Top Button
// @author       MaiJZ
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    const BUTTON_ID = "btnBackToTop";
    const TOP_FUNCTION_NAME = "btnBackToTop_TopFunction";

    addButtonStyle();
    addFunction();
    addButton();

    function addButtonStyle() {
        var style = '#' + BUTTON_ID + '{';
        style += 'display:none; position:fixed; bottom:20px; right:30px; z-index:99; ';
        style += 'font-size:15px; border:0; outline:0; background-color:#fff; color:#8590a6; ';
        style += 'cursor:pointer; text-align: center; width: 40px; height: 40px; ';
        style += 'border-radius:4px; box-shadow:0 1px 3px rgba(26,26,26,.1); ';
        style += '}';

        style += '#' + BUTTON_ID + ':hover { background-color: #d3d3d3;  }';

        addStyle(style);
    }

    function addFunction() {
        window.addEventListener("scroll", function () {
            var minScrollTop = 50;
            if (document.body.scrollTop > minScrollTop || document.documentElement.scrollTop > minScrollTop) {
                document.getElementById(BUTTON_ID).style.display = "block";
            } else {
                document.getElementById(BUTTON_ID).style.display = "none";
            }
        });

        var strFun = 'function ' + TOP_FUNCTION_NAME + '()';
        // strFun += '{ document.body.scrollTop = 0; document.documentElement.scrollTop = 0;}';
        strFun += '{ var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;';
        strFun += 'var increment = scrollHeight / 100;';
        strFun += 'var gotoTop= function(){ var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;';
        strFun += 'currentPosition -= increment; if(currentPosition>0){window.scrollTo(0,currentPosition)}else{window.scrollTo(0,0);clearInterval(timer);timer = null}}; ';
        strFun += 'var timer=setInterval(gotoTop,1); }';

        var elScript = document.createElement("script");
        elScript.innerHTML = strFun;
        document.head.appendChild(elScript);
    }

    function addButton() {
        var strSVG = '<svg class="" title="Back to Top" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24">';
        strSVG += '<path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg>';


        var elButton = document.createElement("button");
        elButton.setAttribute('id', BUTTON_ID);
        elButton.setAttribute("onclick", TOP_FUNCTION_NAME + '()');
        elButton.setAttribute('title', "Back to Top");
        elButton.innerHTML = strSVG;

        document.body.appendChild(elButton);
    }


    function addStyle(styleContent) {
        var elStyle = document.createElement("style");
        elStyle.innerHTML = styleContent;
        document.head.appendChild(elStyle);
    }
})(); 