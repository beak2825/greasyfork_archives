// ==UserScript==
// @name         Esfera
// @namespace    Esfera-CarlesV
// @homepageURL  https://greasyfork.org/en/scripts/436689-esfera
// @version      0.3.2
// @description  Eina per omplit les notes de l'Esfera com a tutor.
// @author       CarlesV
// @match        https://bfgh.aplicacions.ensenyament.gencat.cat/bfgh/avaluacio/*AvaluacioGrupAlumne/*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://www.google.com/s2/favicons?domain=gencat.cat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436689/Esfera.user.js
// @updateURL https://update.greasyfork.org/scripts/436689/Esfera.meta.js
// ==/UserScript==

function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1);
    }
    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1);
    }
    return string;
}

var index=0;

function fer_notes()
{
    var text_notes = $('#notes').val();

    text_notes = text_notes.replaceAll('""',"'");

    const regex = /(.*)\t(.*)\t(("[^"]*")|(.*))/gm;

    //let m;
    //var pos=0;
    //var res=new Array();

    var matches = text_notes.match(regex);
    if (matches == null || matches.length==0)
    {
        const regex2 = /(.*)\t(.*)/gm;
        matches = text_notes.match(regex2);
    }

    if ($('#coemntaris').is(":checked"))
    {
        var x=index;
        {
            var lin=matches[x].split("\t");
            console.log(index + " " + lin[0] + " " + lin[1]);

            if (lin[0]=="TUTO")
            {
                var event_c = new Event('click');
                $(".accions a.btn")[0].dispatchEvent(event_c);

                var com = trimChar(lin[2],'"');

                $("textarea.form-control").val(com);
                var event = new Event('change');
                $("textarea.form-control")[0].dispatchEvent(event);
                //$("textarea.ng-pristine").parent().parent().find("a")[1].click();
            }
            else
            {
                //$("div.ng-binding:contains('" + lin[0] + "')").parent().find(".form-control.ng-pristine").val("string:"+lin[1]);
                var select = $("td.ng-binding:contains('" + lin[0] + "')").parent().find(".form-control.ng-pristine");
                select.val("string:"+lin[1]);
                event = new Event('change');
                select[ 0 ].dispatchEvent(event);

                event_c = new Event('click');
                //$("div.ng-binding:contains('" + lin[0] + "')").parent().find("a")[1].click();
                $("td.ng-binding:contains('" + lin[0] + "')").parent().find("a")[0].dispatchEvent(event_c);

                com = trimChar(lin[2],'"');

                //$("textarea.form-control").val(com);
                $("textarea.form-control")[1].value=com;
                $("textarea.form-control")[1].dispatchEvent(event);
                //$("textarea.ng-pristine").parent().parent().find("a")[1].click();
            }
        }
        index++;
    }
    else
    {
        for (var i=0;i<matches.length;i++)
        {
            lin=matches[i].split("\t");
            if (lin.length==0)
            {
               continue;
            }
            console.log(index + " " + lin[0] + " " + lin[1]);

            select = $("div.ng-binding:contains('" + lin[0] + "')").parent().find(".form-control.ng-pristine");
            select.val("string:"+lin[1]);
            event = new Event('change');
            select[ 0 ].dispatchEvent(event);
            //select.change();
            //select.fireEvent("onchange");

            /* Comentari
            $("div.ng-binding:contains('" + lin[0] + "')").parent().find("a")[1].click();

            var com = trimChar(lin[2],'"');

            $("textarea.ng-pristine").val(com);
            */
            //$("textarea.ng-pristine").parent().parent().find("a")[1].click();
        }
    }
}

(function() {
    'use strict';

    // Your code here...
    setTimeout(
        function()
        {
            $(window).on('hashchange', function(e){
                if (window.location.href.search("arcialAvaluacioGrupAlumneEntradaDades")==-1 && window.location.href.search("inalAvaluacioGrupAlumneEntradaDades")==-1)
                    $("#carles").hide();
                else
                    $("#carles").show();
                $("#notes").val("");
                index=0;
            });

            $(document).on('click', '#fer_notes', function() {
                fer_notes();
            });
            $(document).keypress(function(e){
                /*
                if (e.which == 13 && e.shiftKey){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    fer_notes();
                    return false;
                }
                */
                if (e.which == 13 && e.shiftKey){
                   if ($("div.modal-dialog a.btn:contains('Desa')").is(":visible"))
                   {
                       //e.stopImmediatePropagation();
                       //e.preventDefault();
                       var event_c = new Event('click');
                       $("div.modal-dialog a.btn:contains('Desa')")[1].click();
                       //return false;
                   }
                   else
                   {
                       e.stopImmediatePropagation();
                       e.preventDefault();
                       fer_notes();
                       return false;
                   }
                }
            });
            $(".col-sm-12.main-view.ng-scope").before(`
<div class='row' id='carles'>
  <div class='col-sm-6'>
    <textarea style='width:100%;' spellcheck='false' rows='10' id='notes'></textarea>
  </div>
  <div class='col-sm-6'>
  Esfera Tutors 0.2 - Carles cvallve6@xtec.cat
  <BR>Instruccions:
  <ul>
  <li>Copia del google shhets les 2/3 columnes: Codi materia, Nota, <i>comentari (opcional)<i>.
  <li>Pega al quadre del costat.
  <li>Apreta el boto fer, revisa comentari i desa.
  <li>Torna a apreta el boto fer (fins acabar tots els àmbils).
  </ul>
  <input type="checkbox" id="coemntaris" name="coemntaris" value="si"> Comentaris
  <BR>
  <button id='fer_notes'>Fer</button>
  </div>
</div>`);
                if (window.location.href.search("arcialAvaluacioGrupAlumneEntradaDades")==-1 && window.location.href.search("inalAvaluacioGrupAlumneEntradaDades")==-1)
                    $("#carles").hide();
                else
                    $("#carles").show();
        }, 5000);
})();
