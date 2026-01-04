// ==UserScript==
// @name         CSGOCLICKER HACK - AUTO MISSIONS - DO MISSIONS FOR YOU!
// @namespace    http://Xingy.xyz/
// @version      2
// @description  Makes life ez on csgoclicker.net
// @author       XingyCoderXYZ
// @match        https://csgoclicker.net/missions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397207/CSGOCLICKER%20HACK%20-%20AUTO%20MISSIONS%20-%20DO%20MISSIONS%20FOR%20YOU%21.user.js
// @updateURL https://update.greasyfork.org/scripts/397207/CSGOCLICKER%20HACK%20-%20AUTO%20MISSIONS%20-%20DO%20MISSIONS%20FOR%20YOU%21.meta.js
// ==/UserScript==


(function() {


 setTimeout(function(){
      var amountRecruit = (document.getElementsByClassName("recruit").length );
      var amountRegular = (document.getElementsByClassName("regular").length );
      var amountVeteran = (document.getElementsByClassName("veteran").length );
      var amountExpert = (document.getElementsByClassName("expert").length );
      var amountSpecialOps = (document.getElementsByClassName("specialOps").length );



function veteran(v){

        while(v < amountVeteran){
            try {
                var veteran = document.querySelector(".mission.veteran").remove();
            }
            catch (error){

            }
            v++;
        }

    }


    function expert(e){

        while(e < amountExpert){
            try {
                var expert = document.querySelector(".mission.expert").remove();
            }
            catch (error){

            }
            e++;
        }

    }
    function specialOps(so){

        while(so < amountSpecialOps){
            try {
                var expert = document.querySelector(".mission.specialOps").remove();
            }
            catch (error){

            }
            so++;
        }

    }

    function regular(r){

        while(r < amountRegular){
            try {
                var regular = document.querySelector(".mission.regular").remove();
            }
            catch (error){

            }
            r++;
        }


    }

    function keepthreeRecruit(){


        for (var re = 0; re < amountRecruit - 3; re++){
            try{
                document.querySelector(".recruit").remove();
            }
            catch (error){

            }

        }

}



    function alwayskeepThreeMissions(){

        if (amountRecruit > 2){
            keepthreeRecruit();
            regular(0);
            veteran(0);
            expert(0);
            specialOps(0);
            
        }
        else if (amountRegular !== 0) {
            keepthreeRecruit();
            regular(1);
            veteran(0);
            expert(0);
            specialOps(0);
            

        }
        else if (amountVeteran !== 0){
            keepthreeRecruit();
            regular(0);
            veteran(1);
            expert(0);
            specialOps(0);
            
        }
        else if (amountExpert !== 0){
            keepthreeRecruit();
            regular(0);
            veteran(0);
            expert(1);
            specialOps(0);
            
        }
        else if (amountSpecialOps !== 0){
            keepthreeRecruit();
            regular(0);
            veteran(0);
            expert(0);
            specialOps(1);
            
        }

    }




        alwayskeepThreeMissions();






    function startmission() {
        document.getElementsByClassName("startOverlay")[0].click();
        document.getElementsByClassName("startOverlay")[1].click();
        document.getElementsByClassName("startOverlay")[2].click();
    }


     ///////////////////////
    function redeem(esketit) {
    var pos = esketit;
    var cpos = document.getElementsByClassName('btn')[pos];

    if (cpos !== "btn pressed locked"){
        cpos.click();
    }


}
    function redeemMission() {
       
        redeem(2);
        redeem(1);
        redeem(0);
    }

/////////////////////////
    setTimeout(function() {

        setInterval(
            function()
            {

                try {
                    startmission();
                }
                catch (error){

                }


            }, 2000
        );

        setInterval(
            function()
            {

                try {
                    redeemMission();
                }
                catch (error){

                }

            }, 2000
        );

    }, 2000);

},5000);

    setTimeout(function(){
        location.reload();
    },1800000);

})();