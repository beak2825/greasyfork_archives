// ==UserScript==
// @name        Mercado Livre - Botoes Msg Envio e Entrega + Muambator
// @namespace   http://tampermonkey.net/
// @version     0.6.20
// @icon        https://www.google.com/s2/favicons?domain=mercadolivre.com.br
// @run-at      document-idle
// @license     GPLv3
// @description Script para incluir na tela de mensagens dos pedidos botões com mensagens padrão de Envio e Entrega e na tela de detalhes o link para incluir no Muambator
// @author      Fernando Mendes Fonseca
// @match       https://www.mercadolivre.com.br/vendas/*
// @match       https://myaccount.mercadolivre.com.br/messaging/orders/*
// @match       https://www.mercadolivre.com.br/vendas/novo/mensagens/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371651/Mercado%20Livre%20-%20Botoes%20Msg%20Envio%20e%20Entrega%20%2B%20Muambator.user.js
// @updateURL https://update.greasyfork.org/scripts/371651/Mercado%20Livre%20-%20Botoes%20Msg%20Envio%20e%20Entrega%20%2B%20Muambator.meta.js
// ==/UserScript==

//Função para atrasar a execução do código e executar após o carregamento e execução dos scripts do site
$(document).ready(function() { //Função a ser executada após o carregamento da página
setTimeout(function() { //Função que cria um Delay para aguardar o carregamento da página e os scripts dela não apagarem o conteúdo criado.
 var description, txtMESMO, Muambatorimg, MuambatorimgAlt, Muambatorlinkbase, OrderNumber, trackingNumber, i

    var arrProdutos = [
// MEnsagem final
/*
Olá FULANO, BOM DIA
Tudo joia?
Acabei de verificar no site dos Correios e lá informa que o seu produto foi entregue.. 🙌'
Já conseguiu conferir se chegou tudo certinho?
Gostou? Está conforme esperava?
Se tiver alguma dúvida, pode entrar em contato comigo.
E se tiver algum problema também..
Estou à disposição..
abraços e um ótimo final de semana
*/

//Casa
        "Aromatizador Umidificador Ultrassônico Controle Remoto 400ml","Aromatizador Umidificador Ultrassonico KBAYBO c controle","testar e utilizar",
        "Kit 6 Oleo Essência Difusor Umidificadores Aromoterapia","Kit oleo essencia para difusor Kbaybo 6 unids","utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit C 50","Kit trava magnética 50 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit C 40","Kit trava magnética 40 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit C 30","Kit trava magnética 30 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit C 20","Kit trava magnética 20 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit C 10","Kit trava magnética 10 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit 15/3","Kit trava magnética 15_3 unids","instalar e utilizar",
        "Tranca Magnética Gaveta Armário Porta Criança - Kit C 10","Kit trava magnética 10 unids","instalar e utilizar",
        "Tranca Magnética Invisível Kit 10 Gavetas Armários Crianças","Kit trava magnética 10 unids","instalar e utilizar",
        "Kit 10 Travas Magnéticas Gavetas Portas Segurança P Crianças","Kit trava magnética 10 unids","instalar e utilizar",
        "Trava Magnética Gavetas Armários Portas Crianças - Kit 5 Un","Kit trava magnética 05 unids","instalar e utilizar",
        "Chave Trava Magnética Gavetas Armários Portas Crianças 2unid","Chave Trava Magnética 02 unids","instalar e utilizar? Eu também vendo as travas e, às vezes, o mesmo fabricante envia unidades com polaridade invertida. Então pode acontecer das chaves não funcionarem nas suas travas e precisarmos inverter o ímã, mas é bem simples.. Se isso acontecer, me avisa por aqui e te ligo pra explicar como faz, mas realmente é bem simples, ok",
        "Chave Trava Magnética Gavetas Armários Portas Crianças 1unid","Chave Trava Magnética 01 unid","instalar e utilizar? Eu também vendo as travas e, às vezes, o mesmo fabricante envia unidades com polaridade invertida. Então pode acontecer das chaves não funcionarem nas suas travas e precisarmos inverter o ímã, mas é bem simples.. Se isso acontecer, me avisa por aqui e te ligo pra explicar como faz, mas realmente é bem simples, ok",
        "Nebulizador Inalador Portátil Silencioso Usb Ultrasônico","Nebulizador Usb Ultrasônico","testar e utilizar",
        "Tranca Magnética Gaveta Armário Porta Criança - Kit C 10","Kit trava magnética 10 unids","instalar e utilizar",
   //Teclados
        "T6 + Teclado Flymouse Touchpad Retroiluminado S Fio Backlit","T6+ Teclado Com touchpad E Sem Fio","testar e utilizar",
        "H18+ Teclado Com Touchpad Retroiluminado E Sem Fio! O Melhor","H18+ Teclado Com touchpad E Sem Fio","testar e utilizar",
        "H18 Teclado Com Touchpad E Sem Fio! O Melhor!","H18 Teclado Com touchpad E Sem Fio","testar e utilizar",
        "Controle Remoto Amkle G10 Flymouse + Giroscopio + Voz","Controle G10 Amkle","testar e utilizar",
//Eletrônicos
        "Carregador Inteligente Bateria Pilha 18650 Liitokala Lii-500","Carregador Liitokala LII-500","testar e utilizar",
        "Carregador Inteligente Liitokala Lii-500 Cabo Carro Isqueiro","Carregador Liitokala LII-500","testar e utilizar",
        "Carregador Inteligente Litokala Lii-500s Bateria Pilha 18650","Carregador Liitokala LII-500S","testar e utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino 100x76x35 Diy","Case Aluminio 100x76x35","utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino100x100x50 Diy","Case Aluminio 100x100x50","utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino 110x88x38 Diy","Case Aluminio 110x88x38","utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino 150x105x55mm Diy","Case Aluminio 150x105x55","utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino 150x105x55mm","Case Aluminio 150x105x55","utilizar",
        "Caixa Case Alumínio Projeto Eletrônica Arduino 150x145x54mm","Case Aluminio 150x145x54","utilizar",
        "Fone De Ouvido Sem Fio Xiaomi Redmi Airdots Preto","Fone De Ouvido Xiaomi Redmi Airdots","utilizar e testar",
//Informática
        "Placa Controladora Pcie X4 - 6 Portas Sata 3 6gbps Asmedia V","Placa Controladora Pcie 6 Portas Asmedia V","instalar e testar",
        "Placa Controladora Pcie X1 - 6 Portas Sata 3 6gbps Marvell P","Placa Controladora Pcie 6 Portas Marvell P","instalar e testar",
        "Placa Controladora Pcie X1 - 4 Portas Sata 3 6gbps Asmedia V","Placa Controladora Pcie 4 Portas Asmedia V","instalar e testar",
        "Placa Controladora Pcie X1 - 4 Portas Sata 3 6gbps Marvell P","Placa Controladora Pcie 4 Portas Marvell P","instalar e testar",
        "Switch Hub Gigabit 8 Portas Rj45 Ethernet Rede 10/100/1000","Hub Gigabit 8 portas","instalar e testar",
        "Pendrive Samsung Fit Plus 128gb 3.1 Gen 1 Titan Grey","Pendrive Samsung USB3.1 128GB","testar e utilizar",
        "Pendrive Samsung Fit Plus 128gb Usb3.1 Ultra Rápido 300mb/s","Pendrive Samsung USB3.1 128GB","testar e utilizar",
        "Pendrive Samsung Fit Plus 128gb Titan Grey","Pendrive Samsung USB3.1 128GB","testar e utilizar",
        "Pendrive Samsung Fit Titan Plus 128gb Preto","Pendrive Samsung USB3.1 128GB","testar e utilizar",
        "Pendrive Samsung Fit Plus 256gb Usb3.1 Ultra Rápido 300mb/s","Pendrive Samsung USB3.1 256GB","testar e utilizar",
        "Pendrive Samsung Fit Plus 256gb 3.1 Gen 1 Titan Grey","Pendrive Samsung USB3.1 256GB","testar e utilizar",
        "Kit 4x Cabo Sata 3 6 Gb/s | Promoção","Kit Cabo SATA 04 unids","testar e utilizar",
//Ferramentas
        "Pistola De Jato De Areia (jateadora) Com 4 Bicos Cerâmicos","Jateadora de areia com mangueira 4 Bicos Cerâmicos","testar e utilizar",
        "Pistola De Jato De Areia (jateadora) Com Mangueira 3 Bicos","Jateadora de Areia com Mangueira e 3 Bicos","testar e utilizar",
        "Multímetro Digital Aneng Q1 True-rms Auto Range Capacimetro","Multímetro Aneng Q1","testar e utilizar",
        "Multimetro Aneng An8002 Digital True Rms 6000 Counts Ac/dc","Multimetro Aneng An8002","testar e utilizar",
        "Mini Mandril De Aperto Rápido P Parafusadeiras 1/4 0,3a3,6mm","Mini Mandril Aperto Rápido Prata","testar e utilizar",
        "Mandril Aperto Rápido Para Parafusadeira 1/4","Mandril Aperto Rápido 0,6 a 10mm","testar e utilizar",
        ]
    var arrMes = ["","janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]
    var arrMesAbv= ["","jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
    var data,nome,nomeProduto

function mydiff(date1,interval) {
    var date2, second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date();
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

/////////////////////  MENSAGENS
//Se estiver na página de MENSAGENS
if (window.location.href.indexOf("mensagens") > -1) {
//Cria caixa SPAN para receber os textos de mensagens
    var divMLMensagens = document.createElement('span');
    divMLMensagens.setAttribute("id", "divMensagens");
    divMLMensagens.setAttribute("style", "display: block; line-height: 1;font-size: 10px;white-space: break-spaces;font-weight: normal;width:70%");
    document.querySelector("#item_status").appendChild(divMLMensagens)
//  document.getElementById("divMuambator_"+ orderId).appendChild(linkTag, document.getElementsByTagName("h1")[0].firstChild);

//Pega o primeiro nome do comprador nas informações do pedido
    if(document.querySelector("#user_header > p")){
        nome = document.querySelector("#user_header > p").textContent.toLowerCase()
        nomeProduto = document.getElementsByClassName("user_header")[0].textContent
        }
    else {
        nome = document.querySelector("#chatbox > div.user-header > p").textContent.toLowerCase()
        nomeProduto = document.getElementsByClassName("andes-list__item-primary")[0].textContent
        }
    nome = nome.split(' ')[0];
    nome = nome.charAt(0).toUpperCase() + nome.substring(1);//titleCase(nome);

//Verifica se é sexta feira ou sábado e deseja um bom final de semana, se é segunda ou terça feira deseja boa semana.
    var varFDS = " 👍";
    var Hoje = new Date();
    if(Hoje.getDay()==5||Hoje.getDay()==6){varFDS = " e um ótimo final de semana! 😉";} //Sexta ou sábado
    if(Hoje.getDay()==1||Hoje.getDay()==2){varFDS = " e uma ótima semana! 😉";} //Segunda ou terça

//Verifica horário para dizer bom dia, boa tarde ou boa noite
    var saudacao
    var mdata
    var mhora
    mdata = new Date()
    mhora = mdata.getHours()
    if (mhora < 12)
    saudacao='bom dia';
    else if(mhora >=12 && mhora < 18)
    saudacao='boa tarde';
    else if(mhora >= 18 && mhora < 24)
    saudacao='boa noite';

//Verifica se o status não é 'Entregue' e, se não for, mostra mensagens de envio.
//NAO FOI ENTREGUE
//if(document.body.contains(document.getElementById("item_status").getElementsByClassName("header")[0].getElementsByClassName("default")[0]) || document.getElementById("item_status").getElementsByClassName("header")[0].getElementsByClassName("default")[0].textContent != "Entregue")
{
//if(document.body.contains(document.getElementsByClassName("messaging-order__status messaging-order__status--normal")[0])                   || document.body.contains(document.getElementsByClassName("messaging-order__status messaging-order__status--high")[0]) || document.getElementsByClassName("messaging-order__status messaging-order__status--low")[0].textContent != "Entregue" || document.getElementsByTagName("h2")[0].textContent == "Você está atrasado"){
   //document.getElementsByClassName("messaging-order__status messaging-order__status--normal")[0]) || document.body.contains(document.getElementsByClassName("messaging-order__status messaging-order__status--high")[0]) || document.getElementsByClassName("messaging-order__status messaging-order__status--low")[0].textContent != "Entregue" || document.getElementsByTagName("h2")[0].textContent == "Você está atrasado"){
//console.log("Tela de Mensagens: ainda não foi entregue")

var datacompleta = document.getElementsByClassName("andes-breadcrumb__link")[2].textContent
var mes = document.getElementsByClassName("andes-breadcrumb__link")[2].textContent.split(' ')[7]
    mes = mes.charAt(0).toUpperCase() + mes.substring(1); //titleCase(mes);
    data = new Date(new Date().getFullYear(), //ANO
                    arrMes.indexOf(mes.toLowerCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})-1, //MÊS
                    parseInt(datacompleta.split(' ')[5]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})); //DIA


//MENSAGEM DE ENVIO 1
$('<button/>', {
    text: "Envio",
    id: 'Envio1Btn',
    click: function () {
if(mydiff(data,"days") < 2){txtMESMO = " hoje mesmo"}else{txtMESMO = ""}
        $("#Envio1Btn").text("Colando Mensagem...");
        document.getElementById("content_side").innerHTML  = 'Olá ' + nome + ', ' + saudacao + '!\nTudo joia?\nEstou entrando em contato apenas pra informar que seu produto foi enviado' + txtMESMO + '.';
        //document.getElementById("content_side")[0].style="height: 120px;" //Corrige altura do campo de texto
        $("#Envio1Btn").text("OK");
    }}).appendTo(".user_header");

    $('<button/>', {
    text: "Envio Ontem",
    id: 'Envio1OntBtn',
    click: function () {
if(mydiff(data,"days") < 2){txtMESMO = " mesmo"}else{txtMESMO = ""}
        $("#Envio1OntBtn").text("Colando Mensagem...");
        document.getElementById("divMensagens").innerHTML  = 'Olá ' + nome + ', ' + saudacao + '!\nTudo joia?\nEstou entrando em contato apenas pra informar que seu produto foi enviado ontem' + txtMESMO + '.';
        //document.getElementById("divMensagens").style="height: 300px;" //Corrige altura do campo de texto
        $("#Envio1OntBtn").text("OK");
    }}).appendTo(".user_header");

//MENSAGEM DE ENVIO 2
$('<button/>', {
    text: "Rastreamento",
    id: 'Envio2Btn',
    click: function () {

    var NumPedido
    NumPedido = window.location.href
    NumPedido = NumPedido.substring(55, NumPedido.length);
        //Recupera o código de rastreamento enviado pelo link através do script do Muambator: https://greasyfork.org/en/scripts/371973-muambator-botoes-acesso-ao-pedido/code
        let params = (new URL(document.location)).searchParams;
        let CodRastreio = params.get('codrastreamento');
        if (CodRastreio == null) {
            CodRastreio='XX11111111111XX'
        }
        $("#Envio2Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'O código de rastreio é ' + CodRastreio + '\nO prazo de entrega, segundo os correios, é de 10 dias úteis, mas provavelmente receberá em menos tempo, pois postei na agência do aeroporto, que é a que despacha mais rápido aqui na cidade.\nVocê pode acompanhar as informações sobre o envio consultando esse pedido em suas compras.\nEu também vou ficar acompanhando e, assim que receber, entro em contato para saber se chegou tudo certo.\nabraços' + varFDS;
//        document.getElementsByTagName("textarea")[0].value = 'O código de rastreio é ' + CodRastreio + '\nO prazo de entrega, segundo os correios, é de 12 dias úteis, mas devido à greve tenho tido diversos atrasos na entrega.\nVocê pode acompanhar as informações sobre o envio consultando esse pedido em suas compras.\nEu também vou ficar acompanhando e, assim que receber, entro em contato para saber se chegou tudo certo.\nabraços' + varFDS;
//        document.getElementsByTagName("textarea")[0].value = 'O código de rastreio é ' + CodRastreio + '\nO prazo de entrega, segundo os correios, é de 9 dias úteis, mas ultimamente estão entregando em menos tempo.\nVocê pode acompanhar as informações sobre o envio consultando esse pedido em suas compras.\nEu também vou ficar acompanhando e, assim que receber, entro em contato para saber se chegou tudo certo.\nabraços' + varFDS;
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        document.getElementsByTagName("button")[9].disabled = false //Habilita botao de enviar
        $("#Envio2Btn").text("OK");
    }}).appendTo(".user_header");

//MENSAGEM DE ENVIO 3 ============ TRAVA
if (nomeProduto.indexOf("Magnética") > -1) {
    $('<button/>', {
    text: "Instalação Trava",
    id: 'Envio3Btn',
    click: function () {
        $("#Envio3Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'Ah, uma dica para quando for instalar: antes de colar as peças, limpa bem o local e espera secar. Dessa forma aumenta bastante a aderência.\nQuando colar, tenta apenas encostar as peças, sem apertar, e testa com a chave antes de fechar a porta ou gaveta para ver se funciona direitinho. Se funcionar, fecha a porta/gaveta e vê se ficou tudo ok. Se sim, aí é só abrir e apertar bem as peças para fixar bem a cola e as peças ficarem firmes. Dessa forma a trava suporta até 20kg.\nSe não funcionou, dá pra remover e reposicionar.\n E se danificar a fita adesiva não tem problema. Enviei algumas extras para poder remover e instalar novamente, se necessitar.\nQualquer dúvida é só falar.\nabraços';
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        document.getElementsByTagName("button")[9].disabled = false //Habilita botao de enviar
        $("#Envio3Btn").text("OK");
    }}).appendTo(".user_header");
}
//MENSAGEM DE ENVIO 4 ============ CHAVE
if (document.getElementsByClassName("andes-list__item-primary")[0].textContent.indexOf("Chave") > -1) {
    $('<button/>', {
    text: "Chave Magnética",
    id: 'Envio3Btn',
    click: function () {
        $("#Envio3Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'Ah, eu também vendo as travas e, as vezes, o mesmo fabricante envia unidades com polaridade invertida. Então pode acontecer das chaves não funcionarem e precisarmos inverter o ímã, mas é bem simples..\nSe isso acontecer, me avisa por aqui e te ligo pra explicar como faz, mas realmente é bem simples.\nAbraços' + varFDS;
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        document.getElementsByTagName("button")[9].disabled = false //Habilita botao de enviar
        $("#Envio3Btn").text("OK");
    }}).appendTo(".user_header");
}

//MENSAGEM DE ENVIO Padrao
$('<button/>', {
    text: "Envio Padrao",
    id: 'Envio4Btn',
    click: function () {
        $("#Envio4Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'E agora uma mensagem padrão:\n\nAs entregas são de responsabilidade do Mercado Envios, os prazos previstos são estimados, podendo sofrer alterações a critério do Mercado Livre. Após o produto ser despachado, não temos como cancelar ou alterar o endereço de entrega, nem como intervir nas previsões de entrega.\nO Mercado Envios Coleta utiliza Transportadoras em todos os envios, somente em casos específicos pedem apoio aos Correios para as entregas.\nObs: Caso a embalagem do produto esteja danificada ou com sinais de violação (caixa amassada/rasgada etc) CONFIRA O PRODUTO NO ATO DO RECEBIMENTO, e se você constatar que o produto foi danificado rejeite a entrega no ato.\nAgora é só aguardar...';
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        document.getElementsByTagName("button")[9].disabled = false //Habilita botao de enviar
        $("#Envio4Btn").text("OK");
    }}).appendTo(".user_header");

$('</BR>').appendTo(".user_header");
}

//Verifica se o status é 'Entregue' ou 'A caminho' e se for mostra mensagens de recebimento. "a caminho" porque pode ter sido entregue no mesmo dia e o mercado livre ainda não atualizou.
//if(document.getElementsByClassName("messaging-order__status messaging-order__status--low")[0].textContent == "Entregue" || document.getElementsByClassName("messaging-order__status messaging-order__status--low")[0].textContent == "A caminho"){

//MENSAGEM DE ENTREGA 1
$('<button/>', {
    text: "Entrega",
    id: 'Entrega1Btn',
    click: function () {

        $("#Entrega1Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'Olá ' + nome + ', '+saudacao+'!\nTudo joia?\nAcabei de verificar no site dos Correios e lá informa que o seu produto foi entregue.. 🙌';
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        $("#Entrega1Btn").text("OK");
    }}).appendTo(".user_header");

//MENSAGEM DE ENTREGA 2
var txtInstalou
if(arrProdutos.indexOf(document.getElementsByClassName("andes-list__item-primary")[0].textContent) == -1){txtInstalou = "instalar testar e utilizar"}
else{txtInstalou = arrProdutos[arrProdutos.indexOf(document.getElementsByClassName("andes-list__item-primary")[0].textContent)+2]}
if(txtInstalou == ""){txtInstalou = "instalar testar e utilizar"}

$('<button/>', {
    text: "Entrega2",
    id: 'Entrega2Btn',
    click: function () {
        $("#Entrega2Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'Chegou tudo certinho?\nJá conseguiu ' + txtInstalou + '? Gostou?\nEstá conforme esperava?\nSe tiver alguma dúvida, pode entrar em contato comigo.\nE se tiver algum problema também..\nEstou à disposição..\nSe preferir, pode me ligar no telefone (61) 9 8425-8469 (WhatsApp normalmente eu demoro).\n;)\nabraços' + varFDS;
        document.getElementsByClassName("messagewrapper__text")[0].style="max-height: 300px;"
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        $("#Entrega2Btn").text("OK");
    }}).appendTo(".user_header");

//MENSAGEM DE Agradecimento
$('<button/>', {
    text: "Agredecimento",
    id: 'Entrega3Btn',
    click: function () {
        $("#Entrega3Btn").text("Colando Mensagem...");
        document.getElementsByTagName("textarea")[0].value = 'Oi ' + nome + ', bom dia!\nFico muito feliz com sua mensagem.\nJá tive péssimas experiências em algumas compras e não desejo isso a ninguém..\nMuito pelo contrário, todo mundo merece um atendimento excelente.\nPrimeiro pelo respeito ao ser humano, segundo, entendo que é uma responsabilidade inerente ao trabalho de venda..\n😉\nQue seu dia seja abençoado\nabraços 👍'
        document.getElementsByTagName("textarea")[0].style="height: 300px;" //Corrige altura do campo de texto
        $("#Entrega3Btn").text("OK");
    }}).appendTo(".user_header");

if(mydiff(data,"days") < 2){txtMESMO = " hoje mesmo"}else{txtMESMO = ""}
    var NumPedido
    NumPedido = window.location.href
    NumPedido = NumPedido.substring(55, NumPedido.length);
        //Recupera o código de rastreamento enviado pelo link através do script do Muambator: https://greasyfork.org/en/scripts/371973-muambator-botoes-acesso-ao-pedido/code
        let params = (new URL(document.location)).searchParams;
        let CodRastreio = params.get('codrastreamento');
        if (CodRastreio == null) {
            CodRastreio='XX11111111111XX'}
document.getElementById("divMensagens").innerHTML = '<p>Olá ' + nome + ', ' + saudacao + '!\nTudo joia?\nEstou entrando em contato apenas pra informar que seu produto foi enviado' + txtMESMO + '.</p>'+
'<p>Olá ' + nome + ', ' + saudacao + '!\nTudo joia?\nEstou entrando em contato apenas pra informar que seu produto foi enviado ontem' + txtMESMO + '.</p>'+
'<p>O código de rastreio é ' + CodRastreio + '\nO prazo de entrega, segundo os correios, é de 10 dias úteis, mas provavelmente receberá em menos tempo, pois postei na agência do aeroporto, que é a que despacha mais rápido aqui na cidade.\nVocê pode acompanhar as informações sobre o envio consultando esse pedido em suas compras.\nEu também vou ficar acompanhando e, assim que receber, entro em contato para saber se chegou tudo certo.\nabraços' + varFDS+'</p>'+
'<p>Ah, uma dica para quando for instalar: antes de colar as peças, limpa bem o local e espera secar. Dessa forma aumenta bastante a aderência.\nQuando colar, tenta apenas encostar as peças, sem apertar, e testa com a chave antes de fechar a porta ou gaveta para ver se funciona direitinho. Se funcionar, fecha a porta/gaveta e vê se ficou tudo ok. Se sim, aí é só abrir e apertar bem as peças para fixar bem a cola e as peças ficarem firmes. Dessa forma a trava suporta até 20kg.\nSe não funcionou, dá pra remover e reposicionar.\n E se danificar a fita adesiva não tem problema. Enviei algumas extras para poder remover e instalar novamente, se necessitar.\nQualquer dúvida é só falar.\nabraços</p>'+
'<p>Ah, eu também vendo as travas e, as vezes, o mesmo fabricante envia unidades com polaridade invertida. Então pode acontecer das chaves não funcionarem e precisarmos inverter o ímã, mas é bem simples..\nSe isso acontecer, me avisa por aqui e te ligo pra explicar como faz, mas realmente é bem simples.\nAbraços' + varFDS+'</p>'+
'<p>E agora uma mensagem padrão:\n\nAs entregas são de responsabilidade do Mercado Envios, os prazos previstos são estimados, podendo sofrer alterações a critério do Mercado Livre. Após o produto ser despachado, não temos como cancelar ou alterar o endereço de entrega, nem como intervir nas previsões de entrega.\nO Mercado Envios Coleta utiliza Transportadoras em todos os envios, somente em casos específicos pedem apoio aos Correios para as entregas.\nObs: Caso a embalagem do produto esteja danificada ou com sinais de violação (caixa amassada/rasgada etc) CONFIRA O PRODUTO NO ATO DO RECEBIMENTO, e se você constatar que o produto foi danificado rejeite a entrega no ato.\nAgora é só aguardar...</p>';

//Verifica se o status é 'Entregue' ou 'A caminho' e se for mostra mensagens de recebimento. "a caminho" porque pode ter sido entregue no mesmo dia e o mercado livre ainda não atualizou.
if(document.getElementsByClassName("default")[0].textContent == "Entregue" || document.getElementsByClassName("default")[0].textContent == "A caminho"){
document.getElementById("divMensagens").innerHTML = document.getElementById("divMensagens").innerHTML + 'Olá ' + nome + ', '+saudacao+'!\nTudo joia?\nAcabei de verificar no site dos Correios e lá informa que o seu produto foi entregue.. 🙌'+
'<p>Chegou tudo certinho?\nJá conseguiu ' + txtInstalou + '? Gostou?\nEstá conforme esperava?\nSe tiver alguma dúvida, pode entrar em contato comigo.\nE se tiver algum problema também..\nEstou à disposição..\nSe preferir, pode me ligar no telefone (61) 9 8425-8469 (WhatsApp normalmente eu demoro).\n;)\nabraços' + varFDS+"</p>"+
'<p>Oi ' + nome + ', bom dia!\nFico muito feliz com sua mensagem.\nJá tive péssimas experiências em algumas compras e não desejo isso a ninguém..\nMuito pelo contrário, todo mundo merece um atendimento excelente.\nPrimeiro pelo respeito ao ser humano, segundo, entendo que é uma responsabilidade inerente ao trabalho de venda..\n😉\nQue seu dia seja abençoado\nabraços 👍</p>';
}

}else{











console.log("Não está na tela de Mensagens")

//////////////       TRACK2MUAMBATOR + Nome de arquivo para salvar o PDF
//Se estiver na página de detalhes do pedido

var qnt,produto, detalhes, nomeArquivo

Muambatorimg = 'https://www.muambator.com.br/static/favicons/xfavicon-32x32.png.pagespeed.ic.mzTAgF5tBM.webp';
MuambatorimgAlt = 'Enviar o código de rastreamento e order_id para o muambator';
Muambatorlinkbase = 'https://www.muambator.com.br/pacotes/';

    OrderNumber = window.location.pathname.split('/')[2];

    trackingNumber = "XX000000000CN"
    var arrClassesTrackingCode = document.getElementsByClassName("sc-title-subtitle-action sc-title-subtitle-action--default")
    for ( i = 0; i < arrClassesTrackingCode.length; i++) {
        if(arrClassesTrackingCode[i].textContent.search("rastreamento") !== -1 ){
            trackingNumber = arrClassesTrackingCode[i].textContent.slice(arrClassesTrackingCode[i].textContent.search(":")+2)}

    }
    // Captura o TrackingCode através de um ID
    //    if(document.body.contains(document.getElementById("trackShipment"))) {trackingNumber = document.getElementById("trackShipment").textContent}else{trackingNumber="XX000000000CN"}
    //    if(document.body.contains(document.getElementsByClassName("sc-row-header").parent.getElementsByTag("DIV")[3])) {trackingNumber = document.getElementById("trackShipment").textContent}else{trackingNumber="XX000000000CN"}
console.log("Tela de Pedido: trackingNumber:" + trackingNumber)
    qnt=document.getElementsByClassName("sc-quantity")[0].textContent.replace(" unidades","x ").replace(" unidade","x ").replace(" unidad","x ")
console.log("Tela de Pedido: qnt:" + qnt)
    if(arrProdutos.indexOf(document.getElementsByClassName("sc-title")[0].getElementsByClassName("sc-title-subtitle-action__label")[0].textContent) == -1)
    {produto = document.getElementsByClassName("sc-title")[0].getElementsByClassName("sc-title-subtitle-action__label")[0].textContent}
    else{produto = arrProdutos[arrProdutos.indexOf(document.getElementsByClassName("sc-title")[0].getElementsByClassName("sc-title-subtitle-action__label")[0].textContent)+1]}
    detalhes = ""
    if(document.body.contains(document.getElementsByClassName("sc-product")[0].getElementsByClassName("sc-title-subtitle-action__sublabel")[0])){
        detalhes = " (" + document.getElementsByClassName("sc-product")[0].getElementsByClassName("sc-title-subtitle-action__sublabel")[0].textContent + ")"
    }

//REPLACES
detalhes = detalhes.replace("Voltagem: 110V/220V (Bivolt)","");
detalhes = detalhes.replace("Voltagem: 5V","");
detalhes = detalhes.replace(" | ","");
detalhes = detalhes.replace("/","_");
detalhes = detalhes.replace("Cor: ","");
detalhes = detalhes.replace("Nome do desenho: Preto","");
detalhes = detalhes.toUpperCase();


    //Dados de PREÇOS
    var allValues = document.getElementsByClassName("sc-account-rows__list")
            var valores=" ["
            for ( i = 0; i < allValues.length; i++) {
                if (i > -1){valores = valores + "(" + allValues[i].textContent.replace(" de venda","").replace("Total","Total ").trim() + ")"}
            }
    valores = valores + "]"

var link = Muambatorlinkbase + trackingNumber.trim() + "/detalhes/?trackingnumber=" + trackingNumber.trim() + "&ordernumber="
    if (document.getElementsByClassName("nav-header-username")[0].textContent == "Larissa") {description = "MLLV "} else {description = "MLV "}
    description = encodeURIComponent(description + qnt + produto + detalhes + valores + " ON_" + OrderNumber) + "&orderdata=";
    description = description.replace("  ", " ")

    //Dados de Envio
    if(document.body.contains(document.getElementsByClassName("sc-title-subtitle-action__sublabel")[1])){
        console.log("Possui detalhes do pedido 1")
        var texto = document.getElementsByClassName("sc-title-subtitle-action__sublabel")[1].textContent

        if(texto.indexOf("rastreamento") !== -1){
            console.log("Detalhes do pedido 1 contém 'rastreamento'")
        }else{
            description = description + "D1(" + encodeURIComponent(document.getElementsByClassName("sc-title-subtitle-action__sublabel")[1].textContent.replace("Envio normal","").replace(" - "," ").replace("CEP ","CEP").replace("CEP: ","CEP").replace("CPF ","CPF").replace(", ","_").replace(",","_").replace("_ ","_").replace("Tel.: ","TEL").replace("Referencia: ","REF_")) + "),"
            console.log("Detalhes do pedido 1 não contém 'rastreamento'")
        }

    }else{
        console.log("Não possui detalhes do pedido 1")}
    if(document.body.contains(document.getElementsByClassName("sc-title-subtitle-action__sublabel")[0])){
            console.log("Possui detalhes do pedido 0")
            description = description + "D0(" + encodeURIComponent(document.getElementsByClassName("sc-title-subtitle-action__sublabel")[0].textContent.replace("Envio normal","").replace(" - "," ").replace("CEP ","CEP").replace("CEP: ","CEP").replace("CPF ","CPF").replace(", ","_").replace(",","_").replace("_ ","_").replace("Tel.: ","TEL").replace("Referencia: ","REF_")) + "),"
    }else{console.log("Não possui detalhes do pedido 0")}
    //Dados de NF
    if(document.body.contains(document.querySelector("#root-app > div > div.sc-detail-section > div > div:nth-child(5) > div > div > div.sc-title-subtitle-action__container.sc-title-subtitle-action__account- > div > p"))){
        console.log("Possui dados de NF")
        description = description + "NF("    + encodeURIComponent(document.querySelector("#root-app > div > div.sc-detail-section > div > div:nth-child(5) > div > div > div.sc-title-subtitle-action__container.sc-title-subtitle-action__account- > div > p").textContent.replace(/(?:\r\n|\r|\n)/g, ' || ').replace("Envio normal","").replace(" - "," ").replace("CEP ","CEP").replace("CEP: ","CEP").replace("CPF ","CPF").replace(", ","_").replace(",","_").replace("_ ","_").replace("Tel.: ","TEL").replace("Referencia: ","REF_")) + "),"
    }else{console.log("Não possui dados de NF")}
    link = link + description
    link = link.replace("%20%20", "%20").replace("%20%20", "%20")
console.log("link: " + link)

var imgTag = document.createElement('img');
    imgTag.src = Muambatorimg;
    imgTag.alt = MuambatorimgAlt;
    imgTag.title = MuambatorimgAlt;
    imgTag.height = "30"
    imgTag.width = "30"

    //Define o botão MUAMBATOR com o link
var linkTag = document.createElement('a');
    linkTag.href = link;
    linkTag.target = '_blank';
    linkTag.text = ""//trackingNumber;
    linkTag.appendChild(imgTag);


    //NOME DO ARQUIVO
    data = document.querySelector("#root-app > div > div.sc-detail-section > div > div.sc-detail-title > div").textContent.split(' ')[4]+"_"+arrMesAbv.indexOf(document.querySelector("#root-app > div > div.sc-detail-section > div > div.sc-detail-title > div").textContent.split(' ')[3].toLowerCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "_" + parseInt(document.querySelector("#root-app > div > div.sc-detail-section > div > div.sc-detail-title > div").textContent.split(' ')[2],10).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    nomeArquivo = data + " - " + qnt + produto + " " + detalhes + " [" + trackingNumber + "]" + valores + " ON_" + OrderNumber;
console.log("Tela de Pedido: data:" + data)
console.log("Tela de Pedido: nomeArquivo:" + nomeArquivo)

    //Cria o botão com o link
    document.getElementsByClassName("sc-detail-title")[0].appendChild(document.createElement('br'));
    document.getElementsByClassName("sc-detail-title")[0].innerHTML += "<BR>" + nomeArquivo + "<BR>";
    document.getElementsByClassName("sc-detail-title")[0].appendChild(linkTag, document.getElementsByTagName("h1")[0].firstChild);

}
}, 2000); //Tempo de 0,6 segundos para carregar a página e o código executar, se não os scripts do ML apagam o conteúdo criado.
});