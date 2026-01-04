// ==UserScript==
// @name         Trello Esti
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Thibault
// @description Estimated Trello
// @description:fr estimation trello
// @match        https://*trello.com/b/*
// @match        https://*trello.com/c/*
// @include      https://*trello.com/b/*
// @include      https://*trello.com/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406304/Trello%20Esti.user.js
// @updateURL https://update.greasyfork.org/scripts/406304/Trello%20Esti.meta.js
// ==/UserScript==


(function() {
    function DisplayEsti()
    {
        $(".window-header").append("<br><div id='Esti'><label>To: </label><input id='To' type='number'> <label> Tm: </label><input id='Tm' type='number'> <label>Tp: </label><input id='Tp' type='number'> <br> Result: <span id='result'></span>&nbsp;&nbsp;<span id='ValidateEsti' class='icon-sm icon-check' style='background: #61bd4f;border-radius: 5px; cursor:pointer'></span></div>")
        $("#ValidateEsti").click(function(e)
                                 {
            title = $(".mod-card-back-title ").val();
            $(".mod-card-back-title.js-card-detail-title-input").addClass("is-editing");
            $(".mod-card-back-title.js-card-detail-title-input").focus();
            $(".mod-card-back-title ").val('('+result+')' +title);
            $(".card-detail-title-assist.js-title-helper").val('('+result+') ' +title);
            $(".card-detail-title-assist.js-title-helper").html('('+result+') ' +title);
            $(".mod-card-back-title.js-card-detail-title-input").focusout();
            $(".comment-box-input.js-new-comment-input").val(details);
            $(".primary.confirm.js-add-comment").removeAttr("disabled")
            $(".primary.confirm.js-add-comment").click();

        })
    }


    $(document).ajaxComplete(function() {

        if ($("#Esti").length <= 0){
            DisplayEsti();
            $("#ValidateEsti").hide();

            $("#To").keyup(function(){
                $To = parseFloat($("#To").val());
                $Tm = parseFloat($("#Tm").val());
                $Tp = parseFloat($("#Tp").val());
                result=($To + 4*$Tm + $Tp)/6;
                console.log(result);
                result = Math.ceil(result);
                details = "To: " + $To + "Tm: "+ $Tm + "Tp: "+ $Tp;
                $("#result").html(result);
                if (result >= 0)
                {
                    $("#ValidateEsti").show()
                }
                else{
                    $("#ValidateEsti").hide()
                }
            })

            $("#Tm").keyup(function(){
                $To = parseFloat($("#To").val());
                $Tm = parseFloat($("#Tm").val());
                $Tp = parseFloat($("#Tp").val());
                result=($To + 4*$Tm + $Tp)/6;
                console.log(result);
                result = Math.ceil(result);
                details = "To: " + $To + "  Tm: "+ $Tm + "  Tp: "+ $Tp;
                $("#result").html(result);
                if (result >= 0)
                {
                    $("#ValidateEsti").show()
                }
                else{
                    $("#ValidateEsti").hide()
                }
            })

            $("#Tp").keyup(function(){
                $To = parseFloat($("#To").val());
                $Tm = parseFloat($("#Tm").val());
                $Tp = parseFloat($("#Tp").val());
                result=($To + 4*$Tm + $Tp)/6;
                console.log(result);
                result = Math.ceil(result);
                details = "To: " + $To + " Tm: "+ $Tm + " Tp: "+ $Tp;
                $("#result").html(result);
                if (result >= 0)
                {
                    $("#ValidateEsti").show()
                }
                else{
                    $("#ValidateEsti").hide()
                }
            })
        }
    })
})();