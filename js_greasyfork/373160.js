// ==UserScript==
// @name         Put.HK User Hide
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Block someone
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       Marseille vs. Porto
// @match        http://put.hk/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/373160/PutHK%20User%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/373160/PutHK%20User%20Hide.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...

    //Background Color
    var theme_bgc = "WHITE";

    //Main Background
    document.body.style.background = theme_bgc;
    //Table Background
    var thetds = document.getElementsByTagName('td');
    for (var j = 0; j < thetds.length; j++) {
        thetds[j].style.backgroundColor = theme_bgc;
    }

    // Newsgroup frame check
    var ngUrl = window.location.href;
    if(ngUrl.includes("newsgroup")){
    }

    // Headline frame Check
    var hlUrl = window.location.href;
    if(hlUrl.includes("headline")){

        //Navgation bar
        var hlNav = document.createElement("div");
        hlNav.id ="hlNav";
        hlNav.setAttribute("style", "height:13px;");
        document.body.insertBefore(hlNav, document.body.firstChild);

        // Block list text box
        var addName=document.createElement("input");
        addName.type="text";
        addName.id="addName";
        addName.size="12";
        addName.setAttribute("style", "font-size:10px;position:absolute;top:1px;left:8px;");
        hlNav.appendChild(addName);

        // Block button
        var submitBtn=document.createElement("input");
        submitBtn.type="button";
        submitBtn.value="Add";
        submitBtn.onclick = listUpdate;
        submitBtn.setAttribute("style", "font-size:10px;position:absolute;top:1px;left:95px;");
        hlNav.appendChild(submitBtn);

        //Press Enter to add user
        document.getElementById("addName").onkeypress = function(event)
        {
            if (event.keyCode == 13 || event.which == 13){
                listUpdate();
            }
        };

        //User list update function
        var userUpdate="";
        function listUpdate()
        {

            var x = document.getElementById("addName").value.replace('<','&lt;').replace('>', '&gt;');
            if(x!=""){
                GM_setValue("userAdd", x);
                //User list update
                if(GM_getValue("userList")==null){
                    GM_setValue("userList",(GM_getValue("userAdd")));

                }else {
                    userUpdate = GM_getValue("userList").concat("," + (GM_getValue("userAdd")));
                    GM_setValue("userList", userUpdate);
                }
            }
            location.reload();
        }

        console.log("Block user recent added: " + GM_getValue("userAdd"));
        console.log("Block list: " + GM_getValue("userList"));

        //Hide block user
        var rows = document.getElementsByTagName("table")[0].rows;
        var userBlock = "";

        if(GM_getValue("userList")!=null){
            userBlock = GM_getValue("userList").split(',');
        }

        for (var k = 0; k < userBlock.length; k++){
            for (var i = rows.length; i--;) {
                var cellContent=rows[i].cells[2].innerHTML;
                var cellLength=cellContent.length;
                var cellName=cellContent.substring(99,cellLength-11);
                if(cellName.localeCompare(userBlock[k]) == 0) {
                    rows[i].parentNode.removeChild( rows[i] );
                }
            }
        }

        //Remove select list
        var selectList=document.createElement("select");
        selectList.id="selectList";
        selectList.size="1";
        selectList.setAttribute("style", "font-size:12px;position:absolute;top:1px;left:133px;width:80px;");
        hlNav.appendChild(selectList);

        //Block list pull down menu
        if(userBlock != null){
            for ( k = 0; k < userBlock.length; k++){
                var listElement=document.createElement("option");
                var textnode = document.createTextNode(userBlock[k]);
                listElement.appendChild(textnode);
                selectList.appendChild(listElement);
            } }

        //Remove List element button
        var removeBtn=document.createElement("input");
        removeBtn.type="button";
        removeBtn.value="Del";
        removeBtn.onclick = removeElement;
        removeBtn.setAttribute("style", "font-size:10px;position:absolute;top:1px;left:217px;");
        hlNav.appendChild(removeBtn);

        // String remove function
        String.prototype.removeWord = function(searchWord){
            var str = this;
            var n = str.search(searchWord);
            while(str.search(searchWord) > -1){
                n = str.search(searchWord);
                str = str.substring(0, n) + str.substring(n + searchWord.length, str.length);
            }
            return str;
        }

        //UserList element remove
        function removeElement() {
            var removeString=selectList.value;
            //         selectList.remove(selectList.selectedIndex);
            switch(selectList.selectedIndex){

                case null:
                    break;

                case 0:
                    if (userBlock.length==1){
                        GM_setValue("userList", null);
                    }else{
                        removeString=removeString.concat(",");}
                    break;

                default:
                    removeString=(",").concat(removeString);

            }

            if (GM_getValue("userList")!=null){
                userUpdate=GM_getValue("userList").removeWord(removeString);
                GM_setValue("userList", userUpdate);
            }
            location.reload();
        }

    }

    // Article frame check
    var afUrl = window.location.href;
    if(ngUrl.includes("article")){
        // Image resize
        var image = document.getElementsByTagName('img');
        var imgTogBtn = document.createElement("input");
        imgTogBtn.type = "button";
        imgTogBtn.onclick = imageModeUpdate;
        imgTogBtn.setAttribute("style", "font-size:12px;position:fixed;top:5px;right:20px;");
        if(image.length==0){imgTogBtn.style.visibility = 'hidden'};
        document.body.appendChild(imgTogBtn);
        //Display mode handle
        switch (GM_getValue("imageMode")){
            case 1:
                imgTogBtn.value="Width Fit";
                break;
            case 2:
                imgTogBtn.value="Vertical Fit";
                break;
            default:
                imgTogBtn.value="Original";
        }

        function imageModeUpdate(){
            switch (GM_getValue("imageMode")){
                case 1:
                    GM_setValue("imageMode",2);
                    break;
                case 2:
                    GM_setValue("imageMode",0);
                    break;
                default:
                    GM_setValue("imageMode",1);
            }
            location.reload();
        }

        resize(GM_getValue("imageMode"));

        //Image resize fit window size function
        function resize(mode){
            var img = image;
            var winDim = getWinDim();
            for(var a =0 ; a < img.length; a++){
                switch(mode){

                    case 1:
                        img[a].style.width = (winDim.x * 0.9) + "px";
                        break;

                    case 2:
                        img[a].style.height = (winDim.y * 0.9) + "px";
                        break;

                    default :
                }
            }
        }

        //Get window dimension function
        function getWinDim()
        {
            var body = document.documentElement || document.body;

            return {
                x: window.innerWidth || body.clientWidth,
                y: window.innerHeight || body.clientHeight
            }
        }
    }
})();