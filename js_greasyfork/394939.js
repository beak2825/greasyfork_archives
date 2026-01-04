// ==UserScript==
// @name         Aliexpress - Track2Muambator
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @run-at       document-idle
// @description  Script para incluir na tela de pedidos do ALIEXPRESS botões que enviam o código de rastreamento para o muambator
// @author       Fernando Mendes Fonseca
// @match        https://www.aliexpress.com/p/order/detail.html*
// @match        https://www.aliexpress.com/p/order/index.html*
// @match        https://trade.aliexpress.com/order_detail.htm?*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM.xmlHttpRequest


// @downloadURL https://update.greasyfork.org/scripts/394939/Aliexpress%20-%20Track2Muambator.user.js
// @updateURL https://update.greasyfork.org/scripts/394939/Aliexpress%20-%20Track2Muambator.meta.js
// ==/UserScript==
/*
    v0.1 Versão inicial funcionando
    v0.2 Abre o link com informações de rastreamento do pacote, para verificar se já está cadastrado, se não, cadastrar.
    v0.3 Põe a numeração de pacote na descrição somente se houver mais de 1 para aquele pedido.
    v0.4 Tentando buscar no Muambator se o pacote está cadastrado.
    v0.6 ampliado para todos os tracking codes, criado array de produtos e limpeza da descrição
    v1.0 - atualização para o novo site do aliexpress e uso do GM.xmlHttpRequest para buscar os dados já cadastrados do MUAMBATOR
*/
var waitingTime = 9000
var arrProdutos = [
    //Casa
    "Aromatizador Umidificador Ultrassônico Controle Remoto 400ml","Aromatizador Umidificador Ultrassonico KBAYBO c controle",
    "Kit 6 Oleo Essência Difusor Umidificadores Aromoterapia","Kit oleo essencia para difusor Kbaybo 6 unids",
    "10Locks 2 keys Baby Safety Magnetic Locks Set Child Kids Protection Cabinet Door Drawer Locker Security Cupboard Childproof Lock","Kit trava magnética 10 unids",
    //Teclados
    "T6 + Teclado Flymouse Touchpad Retroiluminado S Fio Backlit","T6+ Teclado Com touchpad E Sem Fio",
    "H18+ Teclado Com Touchpad Retroiluminado E Sem Fio! O Melhor","H18+ Teclado Com touchpad E Sem Fio",
    "H18 Teclado Com Touchpad E Sem Fio! O Melhor!","H18 Teclado Com touchpad E Sem Fio",
    "Controle Remoto Amkle G10 Flymouse + Giroscopio + Voz","Controle G10 Amkle",
    //Eletrônicos
    "Carregador Inteligente Bateria Pilha 18650 Liitokala Lii-500","Carregador Liitokala LII-500",
    "Caixa Case Alumínio Projeto Eletrônica Arduino 100x76x35 Diy","Case Aluminio 100x76x35",
    "Caixa Case Alumínio Projeto Eletrônica Arduino100x100x50 Diy","Case Aluminio 100x100x50",
    "Caixa Case Alumínio Projeto Eletrônica Arduino 110x88x38 Diy","Case Aluminio 110x88x38",
    "Caixa Case Alumínio Projeto Eletrônica Arduino 150x105x55mm Diy","Case Aluminio 150x105x55",
    "","",
    "","",
    //Informática
    "Placa Controladora Pcie X4 - 6 Portas Sata 3 6gbps Asmedia V","Placa Controladora Pcie 6 Portas Asmedia V",
    "Placa Controladora Pcie X1 - 6 Portas Sata 3 6gbps Marvell P","Placa Controladora Pcie 6 Portas Marvell P",
    "Switch Hub Gigabit 8 Portas Rj45 Ethernet Rede 10/100/1000","Hub Gigabit 8 portas",
    "Pendrive Samsung Fit Plus 128gb Usb3.1 Ultra Rápido 300mb/s","Pendrive Samsung USB3.1 128GB",
    "Pendrive Samsung Fit Plus 256gb Usb3.1 Ultra Rápido 300mb/s","Pendrive Samsung USB3.1 256GB",
    "","",
    "","",
    //Ferramentas
    "ANENG Q1 digital multimeter 9999 Analog Tester True RMS Professional Multimetro DIY Transistor Capacitor NCV Testers lcr Meter","Multímetro Aneng Q1",
    "Mini Mandril De Aperto Rápido P Parafusadeiras 1/4 0,3a3,6mm","Mini Mandril Aperto Rápido Prata",
    "Mandril Aperto Rápido Para Parafusadeira 1/4","Mandril Aperto Rápido 0,6 a 10mm",
    "Vastar 110/115 in 1 Precision Screwdriver Mini Electric Screwdriver Set for Iphone Huawei Tablet Ipad Home tool set","Kit Ferramentas Precisão 110/115",
    "","",
    "","",
    "","",
    "","",
    "",""
]

/////////////////////  ORDER INDEX  //Se estiver na página de ORDER INDEX / LISTAGEM DE PEDIDOS
//console.log("VERFICA window.location.href.indexOf('order/index.html'): " + window.location.href.indexOf("order/index.html"))
if (window.location.href.indexOf("order/index.html") > -1) {
    //Função para atrasar a execução do código e executar após o carregamento e execução dos scripts do site
    $(document).ready(function() { //Função a ser executada após o carregamento da página
        setTimeout(function() { //Função que cria um Delay para aguardar o carregamento da página e os scripts dela não apagarem o conteúdo criado.

            var trackingNumber = new Array();
            var orderId, i
            var allProducts = document.getElementsByClassName("order-item")
            var description=""

            //Loop entre os pedidos
            for ( i = 0; i < allProducts.length; i++) {
                orderId = allProducts[i].getElementsByClassName("order-item-header-right-info")[0].getElementsByTagName("div")[1].innerText.replace('Order ID: ','').replace('Copy','').trim()
console.log("VERIFICA Pedido[" + (i+1) + "]/" + document.getElementsByClassName("order-item").length + ": (" + orderId + ") / (" ) //+ allProducts[i].getElementsByClassName("order-item-header-icon-wrap").innerText + ")")

                var divMuambator = document.createElement('span');
                divMuambator.setAttribute("id", "divMuambator_" + orderId);
                divMuambator.setAttribute("style", "display: block; line-height: 1;font-size: 10px;white-space: break-spaces;font-weight: normal;width:70%");
                document.getElementsByClassName("order-item-header-status")[i].appendChild(divMuambator)

                // Busca os códigos de rastreamento para o pedido
                getOrderPackets(orderId, description)
            };
        }, waitingTime); //Tempo de 0,8 segundos para carregar a página e o código executar, caso queira mostrar mais itens
    })
}


/////////////////////  ORDER DETAIL  //Se estiver na página de ORDER DETAIL / DETALHES DOS PEDIDOS
//console.log("VERIFICA window.location.href.indexOf('order/detail.html'): " + window.location.href.indexOf("order/detail.html"))
if (window.location.href.indexOf("order/detail.html") > -1) {
    //Função para atrasar a execução do código e executar após o carregamento e execução dos scripts do site
    $(document).ready(function() { //Função a ser executada após o carregamento da página
        var strURL = window.location;
        var orderId = new URLSearchParams(window.location.search).get("orderId");
        var qnt,produto, detalhes
        var allProducts = document.getElementsByClassName("order-detail-item-content-wrap")

//console.log("VERIFICA Quantidade de PRODUTOS no pedido (allProducts.length): " + allProducts.length)

            //Monta a descrição do pacote baseada na quantidade de produtos e divide pelo comprimento máximo de 250 caracteres do MUAMBATOR
            var length = ((250-25)/allProducts.length)*0.8
            var description = "AE "
            for (var i = 0; i < allProducts.length; i++) {
                if(i>=1){description = description + " |+ "}

                qnt = allProducts[i].getElementsByClassName("item-price-quantity")[0].innerText.replace('x','').replace('piece','') + "x "
                produto = allProducts[i].getElementsByClassName("item-title")[0].innerText.substring(0, length);

                if(allProducts[i].getElementsByClassName("item-sku-attr").length > 0 ){
                    detalhes = " (" + allProducts[i].getElementsByClassName("item-sku-attr")[0].innerText.trim() + ")"
                    detalhes = detalhes.toUpperCase();
                    detalhes = detalhes.replace("COLOR: 10 LOCKS 2 KEYS","")
                    detalhes = detalhes.replace("COLOR:10 LOCKS 2 KEYS","")
                    detalhes = detalhes.replace(" 10 LOCKS 2 KEYS","")
                    detalhes = detalhes.replace("10 LOCKS 2 KEYS","")
                    detalhes = detalhes.replace("COLOR: ","")
                    detalhes = detalhes.replace("COLOR:","")
                }
                description = description + qnt + produto + detalhes
            }
        //REPLACES
        description = description.replace("( )", ""); //remove parenteses caso não tenha detalhe
        description = description.replace(/\t/g, " "); //remove tabulações
        description = description.replace(/\s{2,}/g, " "); //remove espaços duplos
        description = description.toString().trim().replace(/(\r\n|\n|\r)/g, ""); //remove quebras de linha
//console.log("description: " + description)

        //Cria a DIV onde, posteriormente, o conteúdo (IMG + Texto com Link) vai ser inserido
        var divMuambator = document.createElement('div');
        divMuambator.setAttribute("id", "divMuambator_"+ orderId);
        divMuambator.setAttribute("class", "order-detail-item");
        document.getElementsByClassName("order-wrap")[0].insertBefore(divMuambator, document.getElementsByClassName("order-detail-item")[0]);

        // Busca os códigos de rastreamento para o pedido
        getOrderPackets(orderId, description)
    }); //Tempo de 0,6 segundos para carregar a página e o código executar, se não os scripts do ML apagam o conteúdo criado.
}




// Busca os códigos de rastreamento para o pedido e envia para o MUAMBATOR
function getOrderPackets(orderId, description){
    var AliTrackingLink = "https://track.aliexpress.com/logistic/getDetail.json?tradeId="
    var trackingNumber = new Array();

    GM.xmlHttpRequest({
        method: "GET",
        url: AliTrackingLink + orderId,
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }
            var arrPacotes = response.responseText.split('tradeOrderInfo');
            var qntPacotes = arrPacotes.length-1
console.log("VERIFICA Quantidade de PACOTES no pedido (arrPacotes.length): " + qntPacotes)

            //Loop pela quantidade de pacotes listados/enviados
            for (var i = 1; i < arrPacotes.length; i++) {
//console.log("######################### arrPacotes["+i+"]: " + arrPacotes[i])
console.log("VERIFICA Quantidade de códigos de RASTREAMENTO dos pacotes (arrPacotes[" + i + "].split('mailNoList=').length): " + arrPacotes[i].split('mailNoList=').length)
                trackingNumber[i] = arrPacotes[i].split("mailNoList=")[1].split('"},{"')[0]
                //Verifica se o código de rastreamento do pacote foi substituído, se sim (contém vírgula), pega o
                if (trackingNumber[i].indexOf(",") > -1) {trackingNumber[i] = trackingNumber[i].split(",")[trackingNumber[i].split(",").length-1]}
                if (trackingNumber[i].indexOf("SY") > -1) {
                    getSyTrack_SunYou_TrackingCode(orderId,i,trackingNumber[i].trim(),description);
                }else{
console.log("Order(" + orderId + ") com mais de um pacote enviado: trackingNumber[" + i + "]): " + trackingNumber[i])
                getMuambatorDescription (orderId,i,trackingNumber[i].trim(),description);
                }
            }
        }
    })
}

//Busca a descrição do pacote cadastrado no MUAMBATOR e insere HTML
function getMuambatorDescription(orderId,seqPack,trackingCode,description){
    var Muambatorimg = 'https://www.muambator.com.br/static/favicons/xfavicon-32x32.png.pagespeed.ic.mzTAgF5tBM.webp';
    var MuambatorimgAlt = 'Enviar o código de rastreamento e order_id para o muambator';
    var Muambatorlinkbase = 'https://www.muambator.com.br/pacotes/';

            let link = "https://www.muambator.com.br/pacotes/pendentes/?trackingnumber=" + trackingCode + "&ordernumber=" + encodeURIComponent(description+" #" + seqPack + " ON_" + orderId)

            //Cria imagem do Muambator com o link
            var imgTag = document.createElement('img');
            imgTag.src = Muambatorimg;
            imgTag.alt = MuambatorimgAlt;
            imgTag.title = MuambatorimgAlt;
            imgTag.height = "15"
            imgTag.width = "15"
            //Define o botão MUAMBATOR com o link
            var linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.id = "muambator_"+seqPack;
            linkTag.target = '_blank';
            linkTag.prepend(imgTag);
            //linkTag.appendChild(document.createElement("br"));
            linkTag.appendChild(document.createTextNode(" (" + trackingCode + "): "));
            //linkTag.appendChild(MuambatorDesc);
            //linkTag.appendChild(MuambatorStatus);

            //Cria o botão com o link
            document.getElementById("divMuambator_"+ orderId).appendChild(linkTag, document.getElementsByClassName("order-detail-item")[0]);


    GM.xmlHttpRequest({
        method: "GET",
        url: Muambatorlinkbase + trackingCode + "/detalhes/",
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onload: function(responseMuambator) {

            var responseMuambatorXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!responseMuambator.responseMuambatorXML) {
                responseMuambatorXML = new DOMParser()
                    .parseFromString(responseMuambator.responseText, "text/html");
            }
console.log("AE ORDER (" + orderId + "): #" + seqPack + "[" + trackingCode + "]: " + description)
console.log("MUAMBATOR (" + trackingCode + "): ") // + responseMuambator.responseText.split("<strong>")[1].split("</strong>")[1])


            // Criar um elemento div temporário para tratar como HTML
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = responseMuambator.responseText;


            //Busca a descrição do pacote
            var MuambatorDesc = document.createElement('strong');
MuambatorDesc.textContent = tempDiv.querySelector(".pacote-header > strong").innerText;
//MuambatorDesc.textContent = " (" + trackingCode + "): " + tempDiv.querySelector(".pacote-header > strong").innerText;
            //MuambatorDesc.textContent = responseMuambator.responseText.split("<strong>")[2].split("</strong>")[0]

            // Busca o status do pacote acessando pelo ID
            // Cria a tag <strong> para colocar o MuambatorStatus em negrito
            var MuambatorStatus = document.createElement('p');
            if(tempDiv.querySelector("#historico > ul > li:nth-child(1) > strong")){
                MuambatorStatus.textContent = tempDiv.querySelector("#historico > ul > li:nth-child(1) > strong").innerText
                if(tempDiv.querySelector("#historico > ul > li:nth-child(1) > span")){
                    MuambatorStatus.textContent = MuambatorStatus.textContent + ": " + tempDiv.querySelector("#historico > ul > li:nth-child(1) > span").innerText;
                }
            }
            else if(responseMuambator.responseText.split("situacao-header")[1].split("/>")[1].split("</p>")[0].replace('<span class="text-muted">','').replace('</span>','')){
                if(responseMuambator.responseText.split("situacao-header")[1].split("/>")[1].split("</p>")[0].replace('<span class="text-muted">','').replace('</span>','').includes("Informações não disponíveis no momento!"))
                      { MuambatorStatus.textContent = "aaa"
                       if(tempDiv.querySelector("#historico > ul > li:nth-child(1)")){
                          MuambatorStatus.textContent = "Este pacote foi marcado como entregue por você!" //tempDiv.querySelector("#historico > ul > li:nth-child(1)").innerText.replace('/\n/g','')
                       }
                      }
            }

                      else if(responseMuambator.responseText.split('class="milestones">')[1].split(">")[2].split("<br>")[0]){
                    //         MuambatorStatus.textContent = responseMuambator.responseText.split('class="milestones">')[1].split(">")[2].split("<br>")[0]
                }
console.log(MuambatorStatus.textContent)

            let link = Muambatorlinkbase + trackingCode + "/detalhes/?trackingnumber=" + trackingCode + "&ordernumber="
            if(seqPack>1){
                link = link + encodeURIComponent(description + " #" + seqPack + " ON_" + orderId)
            }else{
                link = link + encodeURIComponent(description + " ON_" + orderId)
            }

            //Define o botão MUAMBATOR com o link
            var linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.id = "muambator_"+seqPack;
            linkTag.target = '_blank';
            linkTag.prepend(imgTag);
            //linkTag.appendChild(document.createElement("br"));
            //linkTag.appendChild(document.createTextNode(" (" + trackingCode + "): "));
            linkTag.appendChild(MuambatorDesc);
            linkTag.appendChild(MuambatorStatus);

            //Cria o botão com o link
            document.getElementById("divMuambator_"+ orderId).appendChild(linkTag, document.getElementsByClassName("order-detail-item")[0]);
        }
    })}

function getSyTrack_SunYou_TrackingCode(orderId,seqPack,trackingCode,description){
    var SyTrackimg = 'https://track24.net/images/favicons/favicon-16x16.png';
    var SyTrackimgAlt = 'Enviar o código de rastreamento e order_id para o SyTrack';
    var SyTracklinkbase = 'https://track24.net/service/sytrack/tracking/';

    GM.xmlHttpRequest({
        method: "GET",
        url: SyTracklinkbase + trackingCode,
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onload: function(responseSyTrack) {

            var responseSyTrackXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!responseSyTrack.responseSyTrackXML) {
                responseSyTrackXML = new DOMParser()
                    .parseFromString(responseSyTrack.responseText, "text/html");
            }
console.log("AE ORDER (" + orderId + "): #" + seqPack + "[" + trackingCode + "]: " + description)
console.log("SyTrack (" + trackingCode + "): ") //+ responseSyTrack.responseText.split("<strong>")[1].split("</strong>")[0])

            var SyTrackDesc = responseSyTrack.responseText
console.log("SYTRACK (" + trackingCode + "): " + SyTrackDesc)
            let link = SyTracklinkbase + trackingCode

            //Cria imagem do SyTrack com o link
            var imgTag = document.createElement('img');
            imgTag.src = SyTrackimg;
            imgTag.alt = SyTrackimgAlt;
            imgTag.title = SyTrackimgAlt;
            imgTag.height = "15"
            imgTag.width = "15"

            //Define o botão SyTrack com o link
            var linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.id = "muambator_"+seqPack;
            linkTag.target = '_blank';
            linkTag.text = " (" + trackingCode + "): " //+ SyTrackDesc;
            linkTag.prepend(imgTag);
            linkTag.appendChild(document.createElement("br"));

            //Cria o botão com o link
            document.getElementById("divMuambator_"+ orderId).appendChild(linkTag, document.getElementsByTagName("h1")[0].firstChild);                                }
    })}