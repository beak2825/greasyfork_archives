

// ==UserScript==
// @name         get free patreon content
// @version      0.1
// @description  Pick all the links from patreon (only the free content) and store it in a file.txt
// @author       Viatana35
// @match        https://www.patreon.com/*/posts
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/1007048
// @downloadURL https://update.greasyfork.org/scripts/460261/get%20free%20patreon%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/460261/get%20free%20patreon%20content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("scrolling");
    var links = [];
    //class of loading -> sc-iJKOTD eYLrDe

    //if the page is loading, we wait 2 seconds and then we call the function again
    function is_loading (){
        if(document.getElementsByClassName("sc-iJKOTD eYLrDe").length != 0){
            console.log("loading");
            return true;
        }
        else
        {
            return false;
        }
    }

    function get_all_links()
    {
        // for each link with the class sc-kLwhqv cKZpkw we pick the url of the link and push it to the links array
        for(var i = 0; i < document.getElementsByClassName("sc-kLwhqv cKZpkw").length; i++){
            //if the link is not in the array, we push it
            if(links.indexOf(document.getElementsByClassName("sc-kLwhqv cKZpkw")[i].href) == -1){
                links.push(document.getElementsByClassName("sc-kLwhqv cKZpkw")[i].href);
            }
        }
    }

    function scrolling(){
        //we scroll to the bottom of the page
        window.scrollTo(0,document.body.scrollHeight);
    }

    function is_bottom()
    {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight
    }

    function can_load_more_content()
    {
        return document.getElementsByClassName("sc-dPiLbb lddyrY").length != 0;
    }

    function load_more_content()
    {
        document.getElementsByClassName("sc-dPiLbb lddyrY")[0].click();
    }



    function download_links()
    {
        var text = "";
        for(var i = 0; i < links.length; i++){
            text += links[i] + "\n";
        }
        var file = new File([text], "links.txt", {type: "text/plain;charset=utf-8"});

        //create a ObjectURL in order to download the created file
        var url = window.URL.createObjectURL(file);

        //create a hidden link and set the href and click it
        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = file.name;
        a.click();

        window.URL.revokeObjectURL(url);
    }



    var interval = setInterval(function(){
        if(is_loading() == false){
            if (is_bottom() == false){
                scrolling();
            }
            else if(is_bottom() == true && can_load_more_content() == true){
                load_more_content();
            }
            else if(is_bottom() == true && can_load_more_content() == false){
                get_all_links();
                download_links();
                clearInterval(interval);
            }
        }
    } , 500);

})();