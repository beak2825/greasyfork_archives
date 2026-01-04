// ==UserScript==
// @name         Cadastro no Open4School
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  Importa os dados so sigeduca para o Open
// @license MIT
// @author       Lucas Monteiro
// @match        http://sigeduca.seduc.mt.gov.br/ged/hwmconaluno.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @homepage      https://github.com/lksoumon/superSigeduca/blob/main/Open4School_link_sigeduca.js
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502088/Cadastro%20no%20Open4School.user.js
// @updateURL https://update.greasyfork.org/scripts/502088/Cadastro%20no%20Open4School.meta.js
// ==/UserScript==

//CSS DOS BOTÕES
var styleSCT = document.createElement('style');
styleSCT.type = 'text/css';
styleSCT.innerHTML = 'span.button-like{display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;border:1px solid #007bff;border-radius:4px;cursor:pointer;text-align:center;text-decoration:none}span.button-like:hover{background-color:#0056b3;border-color:#0056b3}';
document.getElementsByTagName('head')[0].appendChild(styleSCT);

//Variáveis
var vetAluno = [0];
var n = 0;
var a = "";
var k = 0;
var cabecalho;
var codigo;

var divCorpo = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(divCorpo);
var ifrIframe1 = document.createElement("iframe");
ifrIframe1.setAttribute("id","iframe1");
ifrIframe1.setAttribute("src","about:blank");
ifrIframe1.setAttribute("style","height: 100px; width: 355px;display:none");
divCorpo.appendChild(ifrIframe1);
parent.frames.document.getElementById('MAINFORM').removeAttribute("action");

function coletaDados1(codigo) {
	a='';
        //Dados gerais do Aluno
        a = a + document.getElementById('span_vGERPESCODCHAR_0001').innerHTML +";"; cabecalho = "Cod Aluno;"; //Cod Aluno
        a = a + parent.frames[0].document.getElementById('span_CTLGEDALUIDINEP').innerHTML +";"; cabecalho = cabecalho+"Nº INEP;"; //Matrícula INEP
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOM').innerHTML +";"; cabecalho = cabecalho+"Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4") +";"; cabecalho = cabecalho+"CPF do Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRG').innerHTML +";"; cabecalho = cabecalho+"RG do aluno;";
		a = a + parent.frames[0].document.getElementById('span_CTLGERORGEMICOD').innerHTML +";"; cabecalho = cabecalho+"Órgão Expedidor;";
		a = a + parent.frames[0].document.getElementById('span_CTLGERPESUFEXP').innerHTML +";"; //UNIDADE DA FEDERAÇÃO
		a = a + parent.frames[0].document.getElementById('span_CTLGERPESDTAEXP').innerHTML +";"; //DATA DE EXPEDIÇÃO
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESSEXO').innerHTML +";"; cabecalho = cabecalho+"Sexo do Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESDTANASC').innerHTML +";"; cabecalho = cabecalho+"Data de Nascimento;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNATDSC').innerHTML +";"; cabecalho = cabecalho+"Naturalidade;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNATUF').innerHTML +";"; cabecalho = cabecalho+"UF;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMMAE').innerHTML +";"; cabecalho = cabecalho+"Filiação 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMPAI').innerHTML +";"; cabecalho = cabecalho+"filiação 2;";

        //Contatos responsável 1
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP').innerHTML+";"; cabecalho = cabecalho+"Nome do responsável 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4")+";"; cabecalho = cabecalho+"CPF do responsável 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDDRESP').innerHTML+")"; //DDD Residencial
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELRESRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Res Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDDRESP').innerHTML+")"; //DDD Celular
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCELRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Celular Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDDRESP').innerHTML+")"; //DDD Comercial
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCOMRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDDRESP').innerHTML+")"; //DDD Contato
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCONRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Contato Resp 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESEMAILRESP').innerHTML+";"; cabecalho = cabecalho+"E-mail Resp 1;";

        //Contatos responsável 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP2').innerHTML+";"; cabecalho = cabecalho+"Nome do responsável 2;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF2').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4")+";"; cabecalho = cabecalho+"CPF do responsável 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELRESDDDRESP2').innerHTML+")"; //DDD Residencial
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELRESRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Res Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCELDDDRESP2').innerHTML+")"; //DDD Celular
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCELRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Celular Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCOMDDDRESP2').innerHTML+")"; //DDD Comercial
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCOMRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCONDDDRESP2').innerHTML+")"; //DDD Contato
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCONRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Contato Resp 2;";
        a = a + parent.frames[0].document.getElementById('CTLGERPESEMAILRESP2').innerHTML+";"; cabecalho = cabecalho+"E-mail Resp 2;";

        //Contato da seção final da página (ENDEREÇO)
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDD').innerHTML+")"; //DDD Residencial 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELRES').innerHTML+";"; cabecalho = cabecalho+"Tel Residencial;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDD').innerHTML+")"; //DDD Celular 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCEL').innerHTML+";"; cabecalho = cabecalho+"Tel Celular;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDD').innerHTML+")"; //DDD Comercial 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCOM').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDD').innerHTML+")"; //DDD Contato 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCON').innerHTML+";"; cabecalho = cabecalho+"Tel Contato;";

        //Endereço
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESEND').innerHTML+";"; cabecalho = cabecalho+"Endereço Rua;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNMRLOG').innerHTML+";"; cabecalho = cabecalho+"Número;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCMPLOG').innerHTML+";"; cabecalho = cabecalho+"Complemento;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESBAIRRO').innerHTML+";"; cabecalho = cabecalho+"Bairro;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESENDCIDDSC').innerHTML+";"; cabecalho = cabecalho+"Cidade;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESENDUF').innerHTML+";"; cabecalho = cabecalho+"UF;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCEP').innerHTML+";"; cabecalho = cabecalho+"CEP;";
        a = a + "\n";

       //alert('O botão vai enviar a seguinte array para o link do open <br>'+a);
        n=n+1;

   // var sendData = function() {
      //  $.post('https://192.168.2.70/Open4School/secretaria/importa_sigeduca.php', {
         //   data: a
      //  }, function(response) {

           // console.log(response);
           // console.log('foi');
        //});
    //}

    //if(tabelas.length>3){
        //sendData();
    //}
    //submit_post_via_hidden_form('https://192.168.2.70/Open4School/secretaria/importa_sigeduca.php',a);
    submit_post_via_hidden_form('https://open4school.com.br/open/secretaria/importa_sigeduca.php',a);

}
function submit_post_via_hidden_form(url, params) {
    console.log(params);
    var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
        action: url
    }).appendTo(document.body);

    //for (var i in params) {
        //if (params.hasOwnProperty(i)) {
            $('<input type="hidden" />').attr({
                value: params,
                name: 'data'
            }).appendTo(f);
        //}
   // }

    f.submit();

    f.remove();
}
function addCopyBtn() {
    //console.log('as');
    var botao = document.createElement("span");
    botao.innerHTML = "Encaminhar dados para Open";
    botao.className = "button-like";
    botao.onclick = () => {
        if(document.getElementById('span_vGERPESCODCHAR_0001')){
           ifrIframe1.src= "http://sigeduca.seduc.mt.gov.br/ged/hwtmgedaluno.aspx?"+document.getElementById('span_vGERPESCODCHAR_0001').innerHTML+",,HWMConAluno,DSP,1,0";
           ifrIframe1.addEventListener("load", coletaDados1);
        }else{alert('Pesquise um aluno pelo código antes de clicar em enviar.')}
    }
    var tabela = document.getElementById("TABLE4");
    tabela.parentNode.insertBefore(botao, tabela.nextSibling);
}
(function() {
'use strict';

    addCopyBtn()

})();
