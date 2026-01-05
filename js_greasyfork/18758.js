// ==UserScript==
// @name NovoPontoEM
// @namespace https://github.com/rafaellott
// @description Informa saldo de horas no ponto do DA
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.0/jquery.mask.min.js
// @include http://intranet.saem.com.br/wp-content/themes/intranetcb/ponto.php*
// @version 2.0.7
// @downloadURL https://update.greasyfork.org/scripts/18758/NovoPontoEM.user.js
// @updateURL https://update.greasyfork.org/scripts/18758/NovoPontoEM.meta.js
// ==/UserScript==

var CARGA_HORARIA = str2min("8:15");
var TOTAL_MES = 0;
var TODAY = new Date();
TODAY = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
var YESTERDAY = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()-1);;
var PONTOS = null;
var myVersion = GM_info.script.version;

// FUNCTIONS
function getLocalStorage() {
    if (window.localStorage.getItem("matriculaponto"))
        jQuery("#matricula").val(window.localStorage.getItem("matriculaponto"));
    if (window.localStorage.getItem("cpfponto"))
        jQuery("#cpf").val(window.localStorage.getItem("cpfponto"));
    if (window.localStorage.getItem("mesponto"))
        jQuery("#mes").val(window.localStorage.getItem("mesponto"));
    if (window.localStorage.getItem("anoponto"))
        jQuery("#ano").val(window.localStorage.getItem("anoponto"));
    if (window.localStorage.getItem("pontos"))
        PONTOS = JSON.parse(window.localStorage.getItem('pontos'));
    else PONTOS = []
}
function setLocalStorage() {
    var matricula_pnt = jQuery("#matricula").val();
    var cpf_pnt = jQuery("#cpf").val();
    var mes_pnt = jQuery("#mes").val();
    var ano_pnt = jQuery("#ano").val();
    if (matricula_pnt !== window.localStorage.getItem('matriculaponto'))
        window.localStorage.setItem('matriculaponto', matricula_pnt);
    if (cpf_pnt !== window.localStorage.getItem('cpfponto'))
        window.localStorage.setItem('cpfponto', cpf_pnt);
    if (mes_pnt !== window.localStorage.getItem('mesponto'))
        window.localStorage.setItem('mesponto', mes_pnt);
    if (ano_pnt !== window.localStorage.getItem('anoponto'))
        window.localStorage.setItem('anoponto', ano_pnt);
    if (PONTOS && PONTOS !== window.localStorage.getItem('pontos')) {
        console.log("salvando no localstorage");
        window.localStorage.setItem('pontos', JSON.stringify(PONTOS));
    }
}
function atualiza_marcacoes() {
    console.log("Atualiza PONTOS com marcações da Intranet");
    var matricula = jQuery("#matricula").val();
    var cpf = jQuery("#cpf").val();
    var mes = jQuery("#mes").val();
    var ano = jQuery("#ano").val();
    if (matricula != '' && cpf != '' && mes != '' && ano != '') {
        jQuery.ajax({
            url: "http://intranet.saem.com.br/wp-content/themes/intranetcb/buscaPonto.php",
            method: 'POST',
            data: {
                'matricula': matricula,
                'cpf': cpf,
                'mes': mes,
                'ano': ano,
            },
            success: function(data) {
                new_data = JSON.parse(data);
                var pos_array = 0;
                var prev_day = 0;
                jQuery(new_data.ponto).each(function(idx, value) {
                    var date = value.data.split("/");
                    var dia = parseInt(date[0]);
                    var mes = parseInt(date[1]) - 1;
                    var ano = parseInt(date[2]);
                    var ponto_date = new Date(ano, mes, dia);
                    pos_array = (prev_day == dia) ? pos_array+1 : 0;
                    if (
                        TODAY.getTime() == ponto_date.getTime() ||
                        YESTERDAY.getTime() == ponto_date.getTime()
                    ) {
                        console.log("Atualizando dados do storage");
                        edit_variable(ano, (mes+1), dia, pos_array, value.ponto);
                    }
                    prev_day = dia;
                });
            },
            error: function(data) {
                console.error("ERROR: " + data);
            }
        });
    }
}
function converte_json_intranet() {
    console.log("Buscando pontos via AJAX");
    var matricula = jQuery("#matricula").val();
    var cpf = jQuery("#cpf").val();
    var mes = jQuery("#mes").val();
    var ano = jQuery("#ano").val();
    if (matricula != '' && cpf != '' && mes != '' && ano != '') {
        jQuery.ajax({
            url: "http://intranet.saem.com.br/wp-content/themes/intranetcb/buscaPonto.php",
            method: 'POST',
            data: {
                'matricula': matricula,
                'cpf': cpf,
                'mes': mes,
                'ano': ano,
            },
            success: function(data) {
                PONTOS = {};
                new_data = JSON.parse(data);
                jQuery(new_data.ponto).each(function(idx, value) {
                    var date = value.data.split("/");
                    var dia = parseInt(date[0]);
                    var mes = parseInt(date[1]);
                    var ano = parseInt(date[2]);
                    if (!PONTOS || !PONTOS.hasOwnProperty(ano)) {
                        PONTOS[ano] = {};
                    }
                    if (!PONTOS[ano].hasOwnProperty(mes)) {
                        PONTOS[ano][mes] = {};
                    }
                    if (!PONTOS[ano][mes].hasOwnProperty(dia)) {
                        PONTOS[ano][mes][dia] = [value.ponto];
                    } else {
                        PONTOS[ano][mes][dia].push(value.ponto);
                    }
                });
                localStorage.setItem('pontos', JSON.stringify(PONTOS));
                localStorage.setItem('funcionario', new_data.funcionario);
                console.log("Renderizando tabela 'FUNC converte_json_intranet'");
                render_table();
            },
            error: function(data) {
                alert("ERROR");
            }
        });
    }
}
function get_employee_name() {
    var employee_name = window.localStorage.getItem('funcionario');
    if (!employee_name) {
        employee_name = "";
    }
    return employee_name;
}
function edit_variable(ano, mes, dia, pos_array, new_value) {
    console.log("Editando localstorage");
    console.log('Ano: ' + ano + ' - Mes: ' + mes + ' - Dia: ' + dia);
    console.log('Pos Array: ' + pos_array + ' - new_value: ' + new_value);
    if (new_value == '') {
        PONTOS[ano][mes][dia].splice(pos_array, 1);
    } else if (PONTOS.hasOwnProperty(ano) && PONTOS[ano][mes] && PONTOS[ano][mes].hasOwnProperty(dia)) {
        PONTOS[ano][mes][dia][pos_array] = new_value;
    } else if (!PONTOS[ano][mes].hasOwnProperty(dia)) {
        var ponto_dia = []
        PONTOS[ano][mes][dia] = [new_value];
    }
    console.log(PONTOS[ano][mes][dia]);
    setLocalStorage();
    update_tr(dia, mes, ano);
}
function str2min(strTime) {
    if (typeof(strTime) != 'string')
        return false;
    if (strTime.substring(0,1) == "-") {
        var result = (parseInt(strTime.split(':')[0]) * 60) + (parseInt(strTime.split(':')[1]) * -1);
    } else {
        var result = (parseInt(strTime.split(':')[0]) * 60) + parseInt(strTime.split(':')[1]);
    }
    return result;
}
function calcTime(time1, time2) {
  return (time2 - time1);
}
function min2str(min) {
    var negative = '';
    if (min < 0) {
        negative = '-';
        min = min * - 1;
    }
    var hours = (parseInt(min / 60));
    var minutes = parseInt(((min / 60) % 1) * 60);
    if (minutes < 10) { minutes = '0' + minutes; }
    return (negative + hours + ':' + minutes);
}
function getTotalBalance42day(pontos) {
    var e1 = str2min(pontos[0]);
    var op = 0;
    if (pontos.length === 1) { op = 1; }
    if (pontos.length >= 2) {
        var s1 = str2min(pontos[1]);
        op = 2;
    }
    if (pontos.length >= 3) {
        var e2 = str2min(pontos[2]);
        op = 3;
    }
    if (pontos.length >= 4) {
        var s2 = str2min(pontos[3]);
        op = 4;
    }
    if (pontos.length >= 5) {
        var e3 = str2min(pontos[4]);
        op = 5;
    }
    if (pontos.length >= 6) {
        var s3 = str2min(pontos[5]);
        op = 6;
    }
    var minLunchTime = 0;
    var maxLunchTime = 0;
    var balance = 0;
    var remaining = CARGA_HORARIA - balance;
    var endTime = '';
    var d = new Date();
    var currentTimeStr = d.getHours()+":"+d.getMinutes();
    var currentTime = str2min(currentTimeStr);
    switch (op) {
        case 1:
            balance += calcTime(e1, currentTime);
            remaining = ((CARGA_HORARIA - balance) + 60);
            endTime = calcForeseenTime(currentTime, remaining);
            minLunchTime = min2str(e1+120);
            maxLunchTime = min2str(e1+360);
            break;
        case 2:
            balance += calcTime(e1, s1);
            remaining = (CARGA_HORARIA - balance);
            break;
        case 3:
            balance += calcTime(e1, s1);
            balance += calcTime(e2, currentTime);
            remaining = (CARGA_HORARIA - balance);
            endTime = calcForeseenTime(currentTime, remaining);
            break;
        case 4:
            balance += calcTime(e1, s1);
            balance += calcTime(e2, s2);
            remaining = CARGA_HORARIA - balance;
            endTime = null;
            break;
        case 5:
            balance += calcTime(e1, s1);
            balance += calcTime(e2, s2);
            balance += calcTime(e3, currentTime);
            remaining = CARGA_HORARIA - balance;
            endTime = calcForeseenTime(currentTime, remaining);
            break;
        case 6:
            balance += calcTime(e1, s1);
            balance += calcTime(e2, s2);
            balance += calcTime(e3, s3);
            remaining = CARGA_HORARIA - balance;
            endTime = null;
            break;
    }
    remaining = (op == 1) ? remaining-60 : remaining ;
    remaining = parseInt(remaining * - 1);
    color = (remaining > 10) ? 'green' : ((remaining < - 10) ? 'red' : 'blue');
    sum = (remaining > 10) ? remaining : ((remaining < - 10) ? remaining : 0);
    // TOTAL_MES += sum;
    endTime = (endTime) ? min2str(endTime) : '';
    return ({
        "parcial_dia": min2str(balance),    // Parcial do dia
        "total_dia": min2str(remaining),    // Horas restantes ou extras
        // "total_dia_oficial": sum,        // Total do dia considerando os +/- 10 min
        "prev_saida": endTime,              // Horário de saída
        "cor_sub_total": color,             // Cor do total
        "minimo_almoco": minLunchTime,      // Horário minímo para ir almoçar
        "maximo_almoco": maxLunchTime       // Horário máximo para ir almoçar
    });
}
function update_tr(dia, mes, ano) {
    if (PONTOS[ano][mes][dia] == '0') {
        jQuery("."+dia+mes+ano).html(create_row_feriado(dia, mes, ano, 'update'));
    } else {
        jQuery("."+dia+mes+ano).html(create_row(dia, mes, ano, PONTOS[ano][mes][dia], 'update'));
    }
    calc_total_mes();
}
function calc_total_mes() {
    var total=0;
    jQuery(".calc_total").each(function( index, value ){
        total += parseInt(str2min(jQuery(value).html()));
    });
    var cor_total = 'blue';
    cor_total = (total < 0) ? 'red' : 'green' ;
    jQuery('.total_mes').html(min2str(total)).css('color', cor_total);
}
function create_row_feriado(dia, mes, ano, option) {
    html_feriado = '';
    if (option != 'update') { html_feriado = "<tr class='row_marcacao "+dia + mes + ano+"'>"; }
    html_feriado = html_feriado + "<td><div align='center'><span id='prazo' class=''>"+dia+"/"+mes+"/"+ano+"</span></div></td>";
    html_feriado += "<td>Feriado</td><td colspan='7'><td>";
    if (option != 'update') { html_feriado += "</tr>"; }
    return html_feriado;
}
function create_row(dia, mes, ano, marcacoes_dia, option) {
    var calculo_dia = getTotalBalance42day(marcacoes_dia);
    var html = "";
    var tam_marcacoes = marcacoes_dia.length;
    if (option != 'update') { html += "<tr class='row_marcacao "+dia + mes + ano+"'>"; }
    html += "<td><div align='center'><span id='prazo' class=''>"+dia+"/"+mes+"/"+ano+"</span></div></td>";
    for (i=0; i<tam_marcacoes; i++) {
        var p = marcacoes_dia[i];
        html += "<td class='"+dia+mes+ano+i+"'><div align='center'><input placeholder='__:__'";
        html += "type='text' id='prazo' class='dados_detalhe not-editing' style='width: 50px; text-align: center;'";
        html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+i+"' value='"+p+"'/ </div></td>";
    }
    if (calculo_dia.prev_saida != '' && dia == String(TODAY.getDate())) {
        if (calculo_dia.maximo_almoco != '' && calculo_dia.minimo_almoco != '') {
            html += "<td><div align='center'><input type='text' placeholder='__:__' id='prazo' class='dados_detalhe not-editing'";
            html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+tam_marcacoes+"' value='"+calculo_dia.minimo_almoco+"' ";
            html += "style='width: 50px; text-align: center; color: #ccc;'></div></td>";
            html += "<td><div align='center'><input type='text' placeholder='__:__' id='prazo' class='dados_detalhe not-editing'";
            html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+tam_marcacoes+"' value='"+calculo_dia.maximo_almoco+"' ";
            html += "style='width: 50px; text-align: center; color: #ccc;'></div></td>";
            tam_marcacoes += 2;
        }
        html += "<td><div align='center'><input type='text' placeholder='__:__' id='prazo' class='dados_detalhe not-editing'";
        html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+tam_marcacoes+"' value='"+calculo_dia.prev_saida+"' ";
        html += "style='width: 50px; text-align: center; color: #ccc;'></div></td>";
        tam_marcacoes++;
    } else if (tam_marcacoes % 2 != 0) {
        html += "<td><div align='center'><input type='text' placeholder='Falta' id='prazo' class='dados_detalhe not-editing'";
        html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+tam_marcacoes+"' value=''";
        html += "style='width: 50px; text-align: center; color: RED;'></div></td>";
        tam_marcacoes++;
    } else {
        html += "<td><div align='center'><input type='text' id='prazo' class='dados_detalhe not-editing'";
        html += "data-dia='"+dia+"' data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+tam_marcacoes+"' value='' placeholder='+'";
        html += "style='width: 50px; text-align: center; color: #ccc;'></div></td>";
        tam_marcacoes++;
    }
    if (tam_marcacoes < 6) {
        html += "<td colspan='"+(6-tam_marcacoes)+"'></td>";
    }
    if (calculo_dia.prev_saida) {
        html += "<td style='text-align: center; color: #bbb;'>"+calculo_dia.parcial_dia+"</td>";
        html += "<td style='color: #bbb; text-align: center;'>"+calculo_dia.total_dia+"</td>";
    } else {
        if (calculo_dia.cor_sub_total != 'blue') {
            class_sum = "calc_total";
        } else {
            class_sum = "";
        }
        html += "<td style='text-align: center;'>"+calculo_dia.parcial_dia+"</td>";
        html += "<td class='"+class_sum+"' style='color: "+calculo_dia.cor_sub_total+"; text-align: center;'>"+calculo_dia.total_dia+"</td>";
    }
    if (option == 'update') { return html; }
    else { return html + "</tr>"; }
}
function calcForeseenTime(lastEntrance, remaining) {
  return lastEntrance + remaining;
}
function faltou_no_dia(dia, mes, ano) {
    var myDate = new Date();
    myDate.setFullYear(ano, (mes-1), dia);
    if(myDate.getDay() == 6 || myDate.getDay() == 0) {
        var html_miss = "<tr class='row_marcacao "+dia+mes+ano+"'><td style='color: #44B;'>";
        html_miss += "<div align='center'><span id='prazo' class=''>"+dia+'/'+mes+'/'+ano+"</span></div></td>";
        html_miss += "<td colspan='6'>&nbsp;&nbsp;Fim de semana</td>";
        html_miss += "<td style='text-align: center; color: #AAA;'>0:00</td>";
        html_miss += "<td style='text-align: center; color: #AAA;'>0:00</td>";
        html_miss += "</tr>";
        return html_miss;
    } else {
        var html_miss = "<tr class='row_marcacao "+dia+mes+ano+"'><td>";
        html_miss += "<div align='center'><span id='prazo' class=''>"+dia+'/'+mes+'/'+ano+"</span></div></td>";
        for (var i=1; i<=5; i++) {
            html_miss += "<td class='"+dia+mes+ano+i+"'><div align='center'><input placeholder='__:__' ";
            html_miss += "type='text' id='prazo' class='dados_detalhe not-editing' data-dia='"+dia+"' style='width: 50px; text-align: center;'";
            html_miss += "data-mes='"+mes+"' data-ano='"+ano+"' data-array='"+i+"' value=''></div></td>";
        }
        html_miss += "<td><button class='marcar_feriado' data-fulldate='"+dia+'/'+mes+'/'+ano+"' style='font-size: 11px; line-height: 10px;'>Marcar Feriado</button></td>";
        html_miss += "<td style='text-align: center;'>-"+min2str(CARGA_HORARIA)+"</td>";
        html_miss += "<td class='calc_total' style='text-align: center; color: #F00;'>-"+min2str(CARGA_HORARIA)+"</td>";
        html_miss += "</tr>";
        return html_miss;
    }
}
function render_table() {

    var mes = parseInt(jQuery("#mes").val());
    var ano = jQuery("#ano").val();
    var datarun = new Date(ano, mes - 1, 16);
    var datanow = new Date(); datanow.setHours(0,0,0,0);
    var start = true;

    while((datarun.getDate() != 16 && datarun <= datanow) || start) {
        console.log(datarun);
        if (!PONTOS[datarun.getFullYear()].hasOwnProperty(datarun.getMonth() + 1))
            PONTOS[datarun.getFullYear()][datarun.getMonth()] = []
        if (typeof PONTOS[datarun.getFullYear()]) {
            if (typeof PONTOS[datarun.getMonth() + 1]) {
                if (typeof PONTOS[datarun.getDate()]) {
                    if (PONTOS[datarun.getFullYear()].hasOwnProperty(datarun.getMonth() + 1)) {
                        var marcacao = PONTOS[datarun.getFullYear()][datarun.getMonth() + 1][datarun.getDate()];
                         !marcacao && jQuery(".row_marcacao:last").after(faltou_no_dia(datarun.getDate(), datarun.getMonth() + 1, datarun.getFullYear()));
                         marcacao && jQuery(".row_marcacao:last").after(create_row(datarun.getDate(), datarun.getMonth() + 1, datarun.getFullYear(), marcacao));
                    } else {
                        console.log("ADICIONAR_FERIAS");
                    }
                } else {
                    jQuery(".row_marcacao:last").after(create_row_feriado(datarun.getDate(), datarun.getMonth() + 1, datarun.getFullYear()));
                }
            }
        }
        start = false;
        datarun.setDate(datarun.getDate()+1);
    }

    var html_footer = '<tr><td><span style="font-size: 10px; padding-left: 15px; text-transform: none;">v'+myVersion+'</span></td>'+
        '<td colspan="7" style=" padding-right: 15px; text-align: right;">Saldo:</td>'+
        '<td class="total_mes" style="padding-left: 10px; text-align: center; font-weight: bold;"></td></tr>';
    jQuery(".row_marcacao:last").after(html_footer);
    calc_total_mes();
}
function load_table() {
    console.log("Iniciando processo");

    console.log("Busca inputs");
    var current_date = new Date();
    var ano = current_date.getFullYear();
    var mes = current_date.getMonth() + 1;

    if (PONTOS && PONTOS.hasOwnProperty(ano) && PONTOS[ano].hasOwnProperty(mes)) {
        console.log("Renderizando tabela 'load_table:401'");
        atualiza_marcacoes();
        render_table();
    } else {
        console.log("Nao exista LS Pontos. Não renderizado");
        converte_json_intranet();
    }
    console.log("Finaliza processo");
}
function add_header_table() {
    new_html = "<thead><tr class='titulo'><td>Funcionário:</td><td colspan='4' class='func_nome'>"+get_employee_name()+"</td>";
    new_html += "<td>Carga H.:</td><td class='carga_hor'>8:15</td><td>Saldo:</td><td class='saldo'>00:00</td></tr></thead>";
    new_html += "<tbody><tr class='titulo row_marcacao'><td align='center'>&nbsp;DATA&nbsp;</td><td align='center'>&nbsp;ENTRADA&nbsp;</td>";
    new_html += "<td align='center'>&nbsp;SAÍDA&nbsp;</td><td align='center'>&nbsp;ENTRADA&nbsp;</td><td align='center'>&nbsp;SAÍDA&nbsp;</td>";
    new_html += "<td align='center'>&nbsp;ENTRADA&nbsp;</td><td align='center'>&nbsp;SAÍDA&nbsp;</td><td align='center'>&nbsp;SUB-TOTAL&nbsp;</td>";
    new_html += "<td align='center'>&nbsp;SALDO&nbsp;</td></tr></tbody>";
    jQuery("#contorno").html(new_html);
}
jQuery(document).ready(function() {
    // Formatação da página
    jQuery(".container").css('width', '1200px');
    jQuery("#pesquisa").css('float', 'left');
    jQuery("#contorno").css('float', 'right');

    jQuery(".logo_rodape").remove();
    jQuery("#usuario").remove();
    jQuery("#senha").remove();

    add_header_table();
    html_option = "<div class='col-ms-12'>";
    html_option += "<div class='col-sm-4'><button id='reset_storage'>Limpa todo Storage</button></div></div>";
    html_option += "<div class='col-ms-12'><br>";
    html_option += "<div class='col-sm-4'><button id='update_storage'>Atualiza últimas marcações</button></div></div>";
    jQuery(html_option).insertAfter(".btn-primary");
    jQuery("#pesquisa button").attr('onclick', '');


    // Tenta buscar do Local Storage
    console.log("Carregando storage");
    getLocalStorage();
    load_table();

    // CSS
    jQuery(".dados_detalhes").css('width', '50px').css('text-align', 'center');
    jQuery(".dados_detalhe").mask('99:99');
    // Triggers
    jQuery(document).on('click', '#pesquisa .btn-primary', function() {
        console.log("Clicou no botao buscar...");
        var matricula = jQuery("#matricula").val();
        var mes = jQuery("#matricula").val();
        var ano = jQuery("#matricula").val();
        if (
            matricula !== window.localStorage.getItem('matriculaponto') ||
            mes !== window.localStorage.getItem('mes') ||
            ano !== window.localStorage.getItem('ano')
        ) {
            console.log("Nova solicitação");
            add_header_table();
            converte_json_intranet();
        } else {
            console.log("Matriculas iguais");
            load_table()
        }
        setLocalStorage();
    });
    jQuery(document).on('click', ".marcar_feriado", function() {
        var data = jQuery(this).data('fulldate').split('/');
        var dia = data[0];
        var mes = data[1];
        var ano = data[2];
        // console.log(ano+' - '+mes+' - '+dia);
        edit_variable(ano, mes, dia, 0, '0');
    });
    jQuery(document).on('change', ".dados_detalhe", function () {
        var novo_valor = String(jQuery(this).val());
        var ano = String(jQuery(this).data('ano'));
        var mes = String(jQuery(this).data('mes'));
        var dia = String(jQuery(this).data('dia'));
        var pos_array = parseInt(jQuery(this).data('array'));
        console.log(novo_valor+' - '+ano+' - '+mes+' - '+dia+' - '+pos_array);
        edit_variable(ano, mes, dia, pos_array, novo_valor);
    });
    jQuery("#save_storage").on('click', function() {
        localStorage.setItem('pontos', JSON.stringify(PONTOS));
    });
    jQuery("#reset_storage").on('click', function() {
        localStorage.clear();
    });
    jQuery(document).on('click', '#update_storage', function() {
        atualiza_marcacoes();
    });
});
