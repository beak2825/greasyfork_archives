// ==UserScript==
// @name         Spellsearcher
// @version      1.1
// @description  I have the Hardcovers im not Paying for digital
// @author       OneDollarDude
// @match        https://www.dndbeyond.com/profile/*
// @match        https://www.dnd-spells.com/spell/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/687935
// @downloadURL https://update.greasyfork.org/scripts/411435/Spellsearcher.user.js
// @updateURL https://update.greasyfork.org/scripts/411435/Spellsearcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if((/www.dndbeyond.com/).test(location.hostname)){
        var checkExist = setInterval(function() {
            if ($(".ct-character-header-desktop, .ct-character-header-tablet").length) {
                startscript();
                clearInterval(checkExist);
            }
        }, 2000);
        var startscript = function(){
            var spellName=null;
            var spellLvl=null;
            var spellType=null;
            var spellDescription=null;
            var csatingTime=null;
            var spellSource=null;
            var forDNDClass=null;
            //------help to get string right-----//
            function nameChange(strName){
                if(typeof(strName) == typeof("string")){
                    strName = strName.toLowerCase();
                    strName = strName.replace(/\s/g,'-');
                    return strName;
                }
                else{return null}
            }
            //----------------------------------//
            //----aufbereitung recieved data---//
            function alertboxString(theData){
                var tempString = "";
                for(let x in theData){
                    tempString = tempString + theData[x]+'\n';
                }
                return tempString;
            }
            //------------------//
            //----listener-----//
            function messFunc(evt){
                var tempData = evt.originalEvent.data;
                var tempOrigin = evt.originalEvent.origin;
                if(!(/www.dnd-spells.com/).test(tempOrigin.toString())){
                    console.log('not spells');
                    return false;
                }
                //window.alert(alertboxString(tempData));
                let textTemp ='<textarea  readonly  id="myTextarea">'+alertboxString(tempData)+'</textarea>';
                $(".mm-navbar__container").append(textTemp);//here the text is inserted
                let tempTextarea = document.getElementById("myTextarea");
                tempTextarea.style.border = 'solid #81DAF5';
                tempTextarea.style.width = '1200px';
                tempTextarea.style.overflow = 'hidden';
                tempTextarea.style.margin = '10px';
                tempTextarea.style.height = tempTextarea.scrollHeight+'px';
                $("#myButton").after('<div class ="ct-character-header-tablet__button" <button id=myButton2 type="button"></button><span class ="ct-character-header-tablet__button-label">Enough of this</span> </div>');
                let tempButton = document.getElementById("myButton2");
                tempButton.style.height = '30px';
                tempButton.style.width ='120px';
                tempButton.style.color = 'white';
                $("#myButton2").on("click",function(){
                    $("#myTextarea").remove();
                    $("#myButton2").remove();
                });
                $('#myIframe').remove();
            }
            $(window).on("message onmessage", messFunc);

            //-----------------//

            //--------------Button-------------//
            $(".ct-character-header-desktop div:eq(0)").after('<div class = "ct-character-header-tablet__button" <button id=myButton type="button"></button><span class ="ct-character-header-tablet__button-label">Spellsearch</span> </div>');
            let tempButton = document.getElementById("myButton");
            tempButton.style.height = '30px';
            tempButton.style.width ='120px';
            tempButton.style.color = 'white';
            $("#myButton").on("click",function(){//opens webiste according to spellname
                if($("#myTextarea").length){
                    $("#myButton2").click();
                   }
                let spellName = prompt("enter spellname");
                if(spellName != null){
                    spellName = nameChange(spellName);
                    if(spellName != null) {
                        let tempUrl = 'https://www.dnd-spells.com/spell/'+spellName;
                        let tempIframeString = '<iframe id="myIframe" src="'+tempUrl+'" width="0" height="0" </iframe>';
                        $(".ct-character-header-desktop, .ct-character-header-tablet").before(tempIframeString);//0x0 iframe for content load
                    }
                }
            });

        }
    }
    //----remove Iframe+ Displayed window---//

    //----------------------//
    //----iframe logic----//
    if((/www.dnd-spells.com/).test(location.hostname)){
        let dataObject = {};
        for(let i=0;i< $(".col-md-12 > p").length; i++){
            if(!(/CREATE AND SAVE YOUR OWN SPELLBOOKS, SIGN UP NOW!/).test($(".col-md-12 > p")[i].innerText)){
                dataObject[i] = $(".col-md-12 > p")[i].innerText;
            }
        }

        window.parent.postMessage(dataObject,'*');

    }


    //-------------------------------//


})();