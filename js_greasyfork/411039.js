// ==UserScript==
// @name         Crowdestor Investments Single View
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Basic script for displaying all payments schedules, delays and updates in Crowdestor investments page
// @author       Juanvi -- Telegram @Juanvi78
// @match        https://crowdestor.com/*/clients/investments
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411039/Crowdestor%20Investments%20Single%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/411039/Crowdestor%20Investments%20Single%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var grace_period_days=7; //You can change for choosing another grace period duration (salmon payments)
    var color=["tomato","lightsalmon","lawngreen","gray"];
    var hoy = new Date();
    var recovery = new Date(2020,5,12);
    var resumen=document.createElement("div");
    resumen.id="resumen";
    var crono=document.createElement("tbody");
    crono.id="crono";
    crono.style.display = "none";
    var esp=window.location.href.toString().includes("/es/");
    document.getElementsByClassName("grid-x grid-margin-x")[2].style.display = "none";
    $("#investments-list").hide();
    $(".clients--box.clients--box-small-mr.clients--box-small-pdd").append(esp?"<p><b>Código de pagos:</b></p><p><span style='background-color:tomato;margin: 6px;'> Retrasado > 7 días </span> <span style='background-color:lightsalmon;margin: 6px;'> Retrasado < 7 días </span><span style='background-color:lawngreen;margin: 6px;'> Cobrado después de la prórroga COVID (i.e. después del 12 de junio)</span></p><p><b>Código de proyectos:</b></p><div class='col_estado_0'></div>Al menos un pago retrasado > 7 días<div class='col_estado_1'></div>Solo pagos retrasados < 7 días</p><p><div class='col_estado_2'></div>Al día con pagos después de la prórroga <div class='col_estado_3'></div>Al día sin pagos después de la prórroga":"<p><b>Payments code:</b></p><p><span style='background-color:tomato;margin: 6px;'>Delayed > 7 days </span><span style='background-color:lightsalmon;margin: 6px;'>Delayed < 7 days</span>  <span style='background-color:lawngreen;margin: 6px;'>Collected after the COVID extension (i.e. after June 12)</span></p><p><b>Projects code:</b></p><div class='col_estado_0'></div>At least 1 payment delayed > 7 days<div class='col_estado_1'></div>Only delayed < 7 days payments</p><p><div class='col_estado_2'></div>On time with payments after Covid <div class='col_estado_3'></div>On time, no payments after Covid");
    for (var c=0;c<4;c++) $(".col_estado_"+c).css(bolita(c));
    $("#investments_length_change").html("<option value='-1'/>");
    $("#investments_filter-transactions").click();
    $("#resumen").html("<p align=center>"+(esp?"Esperando datos":"Waiting for data")+"</p>");
    setTimeout(cartera,10000);
    function cartera(){
         if (document.getElementsByClassName("cell medium-shrink clients--side sticky-container")[0].style.height=="0px")
             $(".clients--box.clients--box-small-mr.clients--box-small-pdd").append(resumen)
        else $(".clients--box").first().after(resumen);
        $(".clients--box.clients--box-small-mr.clients--box-small-pdd").after(crono);
        $(".clients--box.clients--box-small-mr.clients--box-small-pdd").after("<div style='background-color: white;padding: 10px;margin: 5px;'><div style='width: 25%;float: left;' id='estado_0'><b>"+((esp)?"Retrasado":"Delayed")+"</b><div class='col_estado_0'></div></div><div style='width: 25%;float: left;' id='estado_1'><b>"+((esp)?"Periodo de gracia":"Grace Period")+"</b><div class='col_estado_1'></div></div><div style='width: 25%;float: left;' id='estado_2'><b>"+((esp)?"Al día después de COVID":"On time after COVID")+"</b><div class='col_estado_2'></div></div><div style='width: 25%;float: left;' id='estado_3'><b>"+((esp)?"Al día antes de COVID":"On time before COVID")+"</b><div class='col_estado_3'></div></div><div style='clear: both;'></div></div>");
        $(".grid-x.clients--pagination").hide();
        for (c=0;c<4;c++) $(".col_estado_"+c).css(bolita(c));
        var cabecera = document.getElementsByTagName("thead")[0];
        cabecera.parentNode.removeChild(cabecera);
        var proyectos =document.getElementsByTagName("tbody")[1].rows;
        var i=0;
        var pagos_retrasados=0;
        var retrasados=0;
        var pagos_masretrasados=0;
        var masretrasados=0;
        var completados=0;
        var principal=0;
        function bucle(){
            setTimeout(function(){
                if (proyectos[i].cells[2].childNodes.length==2) {
                    proyectos[i].style.display = "none";
                    completados++;
                }else {
                    var aux = document.createElement('td');
                    aux.id = i+"_aux_id";
                    proyectos[i].appendChild(aux);
                    var marca_proy=document.createElement("a");
                    marca_proy.name="proj_"+i;
                    marca_proy.style="top: -200px;position: relative";
                    proyectos[i].cells[0].appendChild(marca_proy);
                    var url = proyectos[i].getElementsByClassName("transactions--subinfo-more transactions--repayment has-tip")[0].href;
                    proyectos[i].getElementsByClassName("transactions--subinfo")[2].style.display="none";
                    //proyectos[i].getElementsByClassName("transactions--subinfo")[3].style.display="none";
                    $("#"+i+"_aux_id").load(url+" tbody", function(){
                        var pagos = this.firstElementChild.rows;
                        var i=parseInt(this.id);
                        var retrasado = false;
                        var masretrasado = false;
                        var verde = false;
                        var nombre=proyectos[i].getElementsByClassName("transactions--name")[0].innerText;
                        var principal_proy=limpiaeuro(proyectos[i].getElementsByClassName("transactions--amount")[0]);
                        for (var j=2; j<pagos.length-1; j=j+2){
                            var fecha_str=pagos[j].cells[1].innerText;
                            var fecha=new Date(fecha_str.substring(0,4),fecha_str.substring(5,7)-1,fecha_str.substring(8,10),23,59,59);
                            var dias=(hoy.getTime()-fecha.getTime())/86400000;
                            var pagado=(pagos[j].cells[6].childNodes.length==1);
                            if (pagado) principal_proy-=limpiaeuro(pagos[j].cells[2]);
                            if (dias>0 && !pagado) {
                                var cantidad=limpiaeuro(pagos[j].cells[5]);
                                pagos_retrasados+=cantidad;
                                retrasado=true;
                                if (dias>grace_period_days){
                                    pagos[j].style.backgroundColor=color[0];
                                    pagos_masretrasados+=cantidad;
                                    masretrasado=true;
                                } else pagos[j].style.backgroundColor=color[1];
                            } else if (fecha>recovery && pagado) {
                                pagos[j].style.backgroundColor=color[2];
                                verde=true;
                            }
                            var copia_fila=pagos[j].cloneNode(true);
                            copia_fila.deleteCell(0);
                            copia_fila.cells[3].innerHTML="<a style=color:darkslategray; onclick=$('#crono,#investments-list').toggle();window.location.href='#proj_"+i+"'>"+nombre+"</a><div class='proj_class_"+i+"'/>";
                            crono.insertBefore(copia_fila,busca_sitio(fecha_str));
                        }
                        pagos[pagos.length-1].remove();
                        if (retrasado){
                            retrasados++;
                            /*var aux_update = document.createElement('div');
                            aux_update.id = this.id+"_update";
                            aux_update.style.paddingTop = "30px";
                            proyectos[i].getElementsByClassName("transactions--info")[0].appendChild(aux_update);
                            var url= proyectos[i].getElementsByClassName("transactions--subinfo-more has-tip")[1].href.replace("/es/","/en/").replace("/de/","/en/");
                            $("#"+aux_update.id).load(url+" .single-project--inner > p");*/
                        }
                        principal+=principal_proy;
                        var estado=3;
                        if (masretrasado) {
                            masretrasados++;
                            estado=0;
                        } else if (retrasado) estado=1;
                        else if (verde) estado=2;
                        $(".proj_class_"+i).css(bolita(estado));
                        $("#estado_"+estado).append("<p>"+"<a style=color:darkslategray; onclick=$('#investments-list').show();$('#crono').hide();window.location.href='#proj_"+i+"'>"+nombre+" ("+parseFloat(principal_proy).toFixed(2)+"€)</a></p>");
                    });
                }
                $("#resumen").html("<p align=center>"+(esp?"Cargando proyecto "+i+" de "+proyectos.length:"Loading project "+i+" of "+proyectos.length)+"</p>");
                i++;
                if (i<proyectos.length) bucle();
                //if (i<5) bucle();
                else {
                    var marca_tiempo=document.createElement("a");
                    marca_tiempo.name="lastweek";
                    var fecha_marca=new Date(hoy.getTime() - 1209600000);
                    crono.insertBefore(marca_tiempo,busca_sitio(fecha_marca.getFullYear()+"-"+(fecha_marca.getMonth()+ 101).toString().substring(1, 3)+"-"+(fecha_marca.getDate()+ 100).toString().substring(1, 3)));
                    setTimeout(function(){
                          $("#resumen").html("<p align=center><a onclick=$('#crono,#investments-list').toggle();window.location.href='#lastweek' class='header-main--button'>"+(esp?"Cambiar vista préstamos/tiempo":"Toggle loans/timeline view")+"</a></p>"+(esp?"<div><ul><li>Principal:<b> "+parseFloat(principal).toFixed(2)+"€ </b></li><li> Proyectos completados:<b> "+completados+" </b></li><li> Proyectos activos:<b> "+(i-completados)+"</b></li><li> Proyectos retrasados: <b>"+retrasados+" </b>(<b>"+parseFloat(100*retrasados/(i-completados)).toFixed(2)+"% </b> de activos)</li><li>Proyectos con retrasos > 7 días: <b>"+masretrasados+" </b>(<b>"+parseFloat(100*masretrasados/(i-completados)).toFixed(2)+"%</b> de activos)</li><li>Cantidad retrasada: <b>"+parseFloat(pagos_retrasados).toFixed(2)+"€ </b>(<b>"+parseFloat(100*pagos_retrasados/principal).toFixed(2)+"% </b> del principal)</li><li>Retrasado > días:<b> "+parseFloat(pagos_masretrasados).toFixed(2)+"€</b> (<b>"+parseFloat(100*pagos_masretrasados/principal).toFixed(2)+"% </b> del principal)</li></ul></div>":"<div><ul><li>Principal:<b> "+parseFloat(principal).toFixed(2)+"€ </b></li><li> Repaid projects:<b> "+completados+" </b></li><li> Active projects:<b> "+(i-completados)+"</b></li><li> Delayed projects: <b>"+retrasados+" </b>(<b>"+parseFloat(100*retrasados/(i-completados)).toFixed(2)+"% </b> of active)</li><li>Projects w/ payment(s) delayed > 7 days: <b>"+masretrasados+" </b>(<b>"+parseFloat(100*masretrasados/(i-completados)).toFixed(2)+"%</b> of active)</li><li>Due amount: <b>"+parseFloat(pagos_retrasados).toFixed(2)+"€ </b>(<b>"+parseFloat(100*pagos_retrasados/principal).toFixed(2)+"% </b> of principal)</li><li>Due > 7 days:<b> "+parseFloat(pagos_masretrasados).toFixed(2)+"€</b> (<b>"+parseFloat(100*pagos_masretrasados/principal).toFixed(2)+"% </b> of principal)</li></ul></div>"));
                          $("#investments-list").show();
                    },2000);
                }
              },1000)
        }
        bucle();
        function limpiaeuro(d){
         return parseFloat(d.innerText.replace("€",""));
        }
        function busca_sitio(fecha_str){
            for (var k=0; k<crono.rows.length; k++)
                if (crono.rows[k].cells[0].innerText>fecha_str) return crono.rows[k];
        }
    }
        function bolita(estado){
         return {"background":color[estado],"border-radius":"50%","margin-left":"6px","margin-right":"6px","width":"12px","height":"12px","display":"inline-block"};
        }
})();