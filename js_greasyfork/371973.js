// ==UserScript==
// @name        Muambator - Botoes de acesso aos pedidos + Insere no form os dados enviados pela URL
// @namespace   http://tampermonkey.net/
// @description Adiciona o link de acesso aos pedidos dentro do Mercado Livre, AliExpress, Banggoog e Correios em cada pacote listado no site do Muambator.
// @author      Fernando Mendes Fonseca
// @icon        https://www.muambator.com.br/static/favicons/xfavicon-32x32.png.pagespeed.ic.dU-XCtxOUz.webp
// @license     MIT
// @include     https://www.muambator.com.br/pacotes/*
// @version     1.0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/371973/Muambator%20-%20Botoes%20de%20acesso%20aos%20pedidos%20%2B%20Insere%20no%20form%20os%20dados%20enviados%20pela%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/371973/Muambator%20-%20Botoes%20de%20acesso%20aos%20pedidos%20%2B%20Insere%20no%20form%20os%20dados%20enviados%20pela%20URL.meta.js
// ==/UserScript==

//VISUALIZAÇÃO
    //Redimensiona a largura da coluna de pacotes para ficar mais visível
    if (document.getElementsByClassName("col-md-8").length>0){document.getElementsByClassName("col-md-8")[0].style.width="100%";}
    document.getElementsByClassName("container")[0].style.width="90%";
    document.getElementsByClassName("container")[1].style.width="90%";
    document.getElementsByClassName("container")[2].style.width="90%";
    document.getElementsByClassName("container")[3].style.width="100%";
    document.getElementsByClassName("main-ads")[0].style.display="none";
    //Remove propaganda inferior
    var all = document.getElementsByClassName('col-sm-8');
    for (var i = 0; i < all.length; i++) {
        all[i].style.width = '100%';
    }

//Verifica se possui o formulário de cadastro.
if(window.location.pathname.indexOf("pesquisar") == -1){
    //Redimensiona campos para cadastro de novo pacote
    document.getElementById("id_codigo").parentNode.style.width="15%";
    document.getElementById("id_nome").parentNode.style.width="48%";
    document.getElementById("id_email").parentNode.parentNode.style.width="12%";
//Insere dados enviados pela URL para os campos de formulário
    let params = (new URL(document.location)).searchParams;
    let CodRastreio = params.get('trackingnumber');
    if (CodRastreio == null) {CodRastreio=''};
    let OrderNum = params.get('ordernumber');
    if (OrderNum == null) {OrderNum=''};
    let OrderData = params.get('orderdata');
    if (OrderData == null) {OrderData=''};
    document.getElementById("id_codigo").value = CodRastreio;
    document.getElementById("id_nome").value = OrderNum;
    document.getElementById("id_tags").value = OrderData
}

//PADRÃO
    var strURL, link, allLines, linkDetalhes, imgTag, linkTag;
    var imgTagheight, imgTagwidth;
    var trackingNumber, OrderNumber, trk;
    var MLimg, MLimgAlt, MLlinkbase, MLform, MLinput;
    var AEimg, AEimgAlt, AElinkbase;
    var BGimg, BGimgAlt, BGlinkbase;
    var SROimg, SROimgAlt, SROimgAltPag, SROLinkRastreio,SROLinkPagamento, SROinput, SROform, Situacao

    imgTagheight = "25"
    imgTagwidth = "25"

    // Imagem gif do logo dos Correios codificada em base64.
    SROimg = 'data:image/gif;base64,R0lGODlhIAAZAPcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAAAUNgAlSAAxWQByzQA8ZACGywBahwBKcgCn+ABvogCEuAB6rACZ1ACOwwCx6gCq5ACj2/zWAfXNA+7GBerABui7B+W4COK0Cd+vCtyrC9mmDNaiDdOdDtGbD8+YEMmOD8yUEMOHEtWEBbl5FMp9DK5qF6VdGf///yH5BAEAAP8ALAAAAAAgABkAAAj/AP8JHEiwoMGDCBMK5MZQm8Ns2bydU0jxH0NuDh9iK3euW8WEFzNi+2bOHLmPIBtm04auZEeUB5811FbOHLpzNj3CLChT27hzwdDdNKlz50BtyNCVC0ZOaElyRY3+Kyeu3NKmOM+dNPjOXTt27NatU0c2nUBw48RVDcZ0KDqD8OB1/Rp2rDqz4MKlrXpV6MSC8uLJnQtWrNl/4ZCN22u1rcF58gLLdecV7AKB4bwh08t46UF6kOMJftfVnTqB274h28xZbbmD+OrNCx2X9DrU3LxpZr1YrcF182LPlgyv3WWL33TvDsf5YDp29fCBjizPKz+pA9O9s2cP9Lx47fL1R9OHXWA6ePi6z2t3r9++feUFqpOX/h09f+735Yv/b51sefi9p99+5aXjDjz9BPhePvngE99z+yg4YHrxzddPfhPaw9+G/wQEADs=';
    SROimgAlt = 'RASTREAMENTO - Abrir site dos correios para rastreamento';
    SROimgAltPag = 'PAGAMENTO - Abrir site dos correios para pagamento';
    SROLinkRastreio = 'https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlRastreamento.cfm';
    SROLinkPagamento = 'https://apps.correios.com.br/portalimportador?encomenda=';

    MLimg = 'https://cdn2.iconfinder.com/data/icons/universal-simple-1/288/Simple-36-512.png'; //Ícone de mensagem/carta
    MLimgAlt = 'Abrir mensagens no Mercado Livre';
    MLlinkbase = 'https://www.mercadolivre.com.br/vendas/novo/mensagens/';

    AEimg = 'https://img.icons8.com/color/480/aliexpress.png' //'https://ae01.alicdn.com/images/eng/wholesale/icon/aliexpress.ico';
    AEimgAlt = 'Abrir o pedido no AliExpress';
    AElinkbase = 'https://trade.aliexpress.com/order_detail.htm?orderId=';

    BGimg = 'https://www.banggood.com/favicon.ico'
    BGimgAlt = 'Abrir o pedido no BangGood';
    BGlinkbase = 'https://www.banggood.com/index.php?com=account&t=ordersDetail&version=2&status=0&ordersId='

    //Cria função que irá verificar se há trecho de texto pelo SPLIT
    var canSplit = function(str, token){
        return (str || '').split(token).length > 1;
    }

//DETALHE DO PACOTE
    //Adiciona o link nos detalhes do pacote atual.
if(document.getElementsByClassName("pacote-header").length > 0){
    linkDetalhes = document.getElementsByClassName("pacote-header")[0];
    linkDetalhes = document.getElementsByClassName("pacote-header")[0].childNodes[3];

    strURL = window.location.pathname;
    trackingNumber = strURL.split('/')[2];

    //Verifica se possui ON_ na descrição do pacote
    if(canSplit(linkDetalhes.textContent, 'ON_')){
        //Possui o ON_ na descrição do pacote, então verifica os 2 primeiros caracteres para saber de qual site é o pedido e pega o número do pedido no final da descrição, após o ON_
for (let x = 1; x < linkDetalhes.textContent.split('ON_').length; x++) {

        OrderNumber = linkDetalhes.textContent.split('ON_')[x].split(' ')[0].trim();

        //MERCADO LIVRE
        if((linkDetalhes.textContent.trim()).substring(0,2)=='ML'){
            link = MLlinkbase + OrderNumber + "?codrastreamento=" + trackingNumber;
            imgTag = document.createElement('img');
            imgTag.src = MLimg;
            imgTag.alt = MLimgAlt;
            imgTag.title = MLimgAlt;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth
        }
        //BANGGOOD
        if((linkDetalhes.textContent.trim()).substring(0,2)=='BG'){
            link = BGlinkbase + OrderNumber;
            imgTag = document.createElement('img');
            imgTag.src = BGimg;
            imgTag.alt = BGimgAlt;
            imgTag.title = BGimgAlt;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth
        }
        //ALIEXPRESS
        if((linkDetalhes.textContent.trim()).substring(0,2)=='AE'){
            link = AElinkbase + OrderNumber;
            imgTag = document.createElement('img');
            imgTag.src = AEimg;
            imgTag.alt = AEimgAlt;
            imgTag.title = AEimgAlt;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth
        }
        //Define o botão com o link
        linkTag = document.createElement('a');
        linkTag.href = link;
        linkTag.onclick="javascript:GM_setClipboard('aaa')"
        linkTag.target = '_blank';
        linkTag.appendChild(imgTag);
        //Cria o botão com o link
        linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);
}

//MLV# - DropShipping -- Seguir padrão: AE 1x Produto MLV#2566560179 ON_8016954066680495
        //Verifica se possui MLV# na descrição do pacote
        if(canSplit(linkDetalhes.textContent, 'MLV#')){
            //Possui o MLV# na descrição do pacote, então verifica os 2 primeiros caracteres para saber de qual site é o pedido e pega o número do pedido no final da descrição, após o ON_
            OrderNumber = linkDetalhes.textContent.split('MLV#')[1].split('ON_')[0].trim();

            //MERCADO LIVRE
            link = MLlinkbase + OrderNumber + "?codrastreamento=" + trackingNumber;
            imgTag = document.createElement('img');
            imgTag.src = MLimg;
            imgTag.alt = MLimgAlt;
            imgTag.title = MLimgAlt;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth

            //Define o botão com o link
            linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.onclick="javascript:GM_setClipboard('aaa')"
            linkTag.target = '_blank';
            linkTag.appendChild(imgTag);
            //Cria o botão com o link
            linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);}
//MLV# Fim

    // CORREIOS - SISTEMA DE RASTREIO E PAGAMENTO
        Situacao = document.getElementsByClassName("situacao-header")[0];
      //Define a imagem para enviar o formulario de PAGAMENTO
        if(Situacao.textContent.trim()=='Aguardando pagamento do despacho postal'||Situacao.textContent.trim()=='Aguardando pagamento'){
            link = SROLinkPagamento + trackingNumber
            imgTag = document.createElement('img');
            imgTag.src = SROimg;
            imgTag.alt = SROimgAltPag;
            imgTag.title = SROimgAltPag;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth
            //Define o botão com o link
            linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.target = '_blank';
            linkTag.appendChild(imgTag);
            //Cria o botão com o link para enviar o formulario de PAGAMENTO
            linkDetalhes = document.getElementsByClassName("situacao-header")[0].childNodes[0];
            linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);
        }
      //Define a imagem para enviar o formulario de RASTREAMENTO
        link = 'javascript:document.getElementById("sroForm").submit();'
        imgTag = document.createElement('img');
        imgTag.src = SROimg;
        imgTag.alt = SROimgAlt;
        imgTag.title = SROimgAlt;
        imgTag.height = imgTagheight
        imgTag.width = imgTagwidth
        //Define o botão com o link
        linkTag = document.createElement('a');
        linkTag.href = link;
        linkTag.target = '_blank';
        linkTag.appendChild(imgTag);
        //Cria o botão com o link para enviar o formulario de RASTREAMENTO
        linkDetalhes = document.getElementsByTagName("small")[0].childNodes[0];
        linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);

    // FORMULÁRIOS DE RASTREIO E PAGAMENTO
      //Define o formulario para PAGAMENTO
        SROform = document.createElement('form');
        SROform.name='formTelaPgto';
        SROform.id='formTelaPgto';
        SROform.method='post';
        SROform.action= SROLinkPagamento;
        SROform.target='_blank';
        //Define o input do tracking number
        SROinput = document.createElement('input');
        SROinput.type='hidden';
        SROinput.name='ObjDespachoApagar';
        SROinput.id='ObjDespachoApagar';
        SROinput.value=trackingNumber;
        SROform.appendChild(SROinput);
        //Cria o formulario para PAGAMENTO
        linkDetalhes = document.getElementsByTagName("small")[0];
        linkDetalhes.parentNode.insertBefore(SROform, linkDetalhes);
     //Define o formulario para RASTREAMENTO
        SROform = document.createElement('form');
        SROform.name='sroForm';
        SROform.id='sroForm';
        SROform.method='post';
        SROform.action= SROLinkRastreio;
        SROform.method='post';
        SROform.target='_blank';
        //Define o input do tracking number
        SROinput = document.createElement('input');
        SROinput.type='hidden';
        SROinput.name='objetos';
        SROinput.id='objetos';
        SROinput.value=trackingNumber;
        SROform.appendChild(SROinput);
        //Cria o formulario para RASTREAMENTO
        linkDetalhes.parentNode.insertBefore(SROform, linkDetalhes.parentNode.firstChild);
    }
}

//LISTAGEM GERAL
    //Adiciona o link na listagem de pacotes.
else {
    allLines = document.evaluate(
        "//table/tbody/tr/td/a[contains(@href, '/pacote')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    //Conta quantos pacotes tem na lista
    for (var i = 0; i < allLines.snapshotLength; i++) {
        linkDetalhes = allLines.snapshotItem(i);

        //Verifica se possui ON_ na descrição do pacote
        if(canSplit(linkDetalhes.textContent, 'ON_')){
            //Se possui o ON_ na descrição do pacote, verifica os 2 primeiros caracteres para saber de qual site é o pedido e pega o número do pedido no final da descrição, após o ON_
for (let x = 1; x < linkDetalhes.textContent.split('ON_').length; x++) {

    OrderNumber = linkDetalhes.textContent.split('ON_')[x].split(' ')[0].trim();
    strURL = linkDetalhes.href;
    trackingNumber = strURL.split('/')[4];

        //MERCADO LIVRE
            if((linkDetalhes.textContent.trim()).substring(0,2)=='ML'){
                strURL = linkDetalhes.href;
                trackingNumber = strURL.split('/')[4]

                link = MLlinkbase + OrderNumber + "?codrastreamento=" + trackingNumber;
                imgTag = document.createElement('img');
                imgTag.src = MLimg;
                imgTag.alt = MLimgAlt;
                imgTag.title = MLimgAlt;
                imgTag.height = imgTagheight
                imgTag.width = imgTagwidth
            }
        //BANGGOOD
            if((linkDetalhes.textContent.trim()).substring(0,2)=='BG'){
                link = BGlinkbase + OrderNumber;
                imgTag = document.createElement('img');
                imgTag.src = BGimg;
                imgTag.alt = BGimgAlt;
                imgTag.title = BGimgAlt;
                imgTag.height = imgTagheight
                imgTag.width = imgTagwidth
            }
        //ALIEXPRESS
            if((linkDetalhes.textContent.trim()).substring(0,2)=='AE'){
                link = AElinkbase + OrderNumber;
                imgTag = document.createElement('img');
                imgTag.src = AEimg;
                imgTag.alt = AEimgAlt;
                imgTag.title = AEimgAlt;
                imgTag.height = imgTagheight
                imgTag.width = imgTagwidth
            }

            //Define o botão com o link
            linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.target = '_blank';
            linkTag.appendChild(imgTag);

            //Cria o botão com o link
            linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);
        }}

//MLV# - DropShipping -- Seguir padrão: AE 1x Produto MLV#2566560179 ON_8016954066680495
        //Verifica se possui MLV# na descrição do pacote
        if(canSplit(linkDetalhes.textContent, 'MLV#')){
            //Possui o MLV# na descrição do pacote, então verifica os 2 primeiros caracteres para saber de qual site é o pedido e pega o número do pedido no final da descrição, após o ON_
            OrderNumber = linkDetalhes.textContent.split('MLV#')[1].split('ON_')[0].trim();
               strURL = linkDetalhes.href;
               trackingNumber = strURL.split('/')[4]
            //MERCADO LIVRE
            link = MLlinkbase + OrderNumber + "?codrastreamento=" + trackingNumber;
            imgTag = document.createElement('img');
            imgTag.src = MLimg;
            imgTag.alt = MLimgAlt;
            imgTag.title = MLimgAlt;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth

            //Define o botão com o link
            linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.onclick="javascript:GM_setClipboard('aaa')"
            linkTag.target = '_blank';
            linkTag.appendChild(imgTag);
            //Cria o botão com o link
            linkDetalhes.parentNode.insertBefore(linkTag, linkDetalhes.parentNode.firstChild);}
//MLV# Fim

    // CORREIOS - SISTEMA DE RASTREIO E PAGAMENTO
        if(linkDetalhes.parentNode.parentNode.getElementsByClassName("situacao ")[0].textContent.trim()=='Aguardando pagamento do despacho postal'||linkDetalhes.parentNode.parentNode.getElementsByClassName("situacao ")[0].textContent.trim()=='Aguardando pagamento'){
            link = SROLinkPagamento + trackingNumber;
            imgTag = document.createElement('img');
            imgTag.src = SROimg;
            imgTag.alt = SROimgAltPag;
            imgTag.title = SROimgAltPag;
            imgTag.height = imgTagheight
            imgTag.width = imgTagwidth
            //Define o botão com o link
            linkTag = document.createElement('a');
            linkTag.href = link;
            linkTag.target = '_blank';
            linkTag.appendChild(imgTag);
            //Cria o botão com o link para enviar o formulario de PAGAMENTO
            linkDetalhes.parentNode.parentNode.getElementsByClassName("situacao ")[0].insertBefore(linkTag, linkDetalhes.parentNode.parentNode.getElementsByClassName("situacao ")[0].firstChild);
        }
      //Define a imagem para enviar o formulario de RASTREAMENTO
        link = 'javascript:document.getElementById("sroForm'+i+'").submit();'
        imgTag = document.createElement('img');
        imgTag.src = SROimg;
        imgTag.alt = SROimgAlt;
        imgTag.title = SROimgAlt;
        imgTag.height = '15';
        imgTag.width = '15';
        //Define o botão com o link
        linkTag = document.createElement('a');


        //Mostra o código de rastreamento em cada item da lista
        trk=document.createElement('small');
        trk.innerHTML = trackingNumber + ' ' + linkDetalhes.parentNode.getElementsByTagName("small")[0].innerHTML;
        linkTag.appendChild(trk);
//      linkTag.firstChild.appendChild(imgTag);
//      linkTag.firstChild.innerHTML=linkTag.firstChild.innerHTML+trackingNumber
//linkTag.innerHTML=trackingNumber + ' ' + linkDetalhes.parentNode.getElementsByTagName("small")[0].innerHTML;
       linkTag.href = link;
       linkTag.target = '_blank';
        //Cria o botão com o link para enviar o formulario de RASTREAMENTO
       linkDetalhes.parentNode.getElementsByTagName("small")[0].innerHTML='';
       linkDetalhes.parentNode.getElementsByTagName("small")[0].insertBefore(linkTag, linkDetalhes.parentNode.getElementsByTagName("small")[0].firstChild);

    // FORMULÁRIOS DE RASTREIO E PAGAMENTO
      //Define o formulario para PAGAMENTO
        SROform = document.createElement('form');
        SROform.name='formTelaPgto'+i;
        SROform.id='formTelaPgto'+i;
        SROform.method='post';
        SROform.action= SROLinkPagamento;
        SROform.target='_blank';
        //Define o input do tracking number
        SROinput = document.createElement('input');
        SROinput.type='hidden';
        SROinput.name='ObjDespachoApagar';
        SROinput.id='ObjDespachoApagar';
        SROinput.value=trackingNumber;
        SROform.appendChild(SROinput);
        //Cria o formulario para PAGAMENTO
        linkDetalhes.parentNode.insertBefore(SROform, linkDetalhes.parentNode.firstChild);
     //Define o formulario para RASTREAMENTO
        SROform = document.createElement('form');
        SROform.name='sroForm'+i;
        SROform.id='sroForm'+i;
        SROform.method='post';
        SROform.action= SROLinkRastreio;
        SROform.method='post';
        SROform.target='_blank';
        //Define o input do tracking number
        SROinput = document.createElement('input');
        SROinput.type='hidden';
        SROinput.name='objetos';
        SROinput.id='objetos';
        SROinput.value=trackingNumber;
        SROform.appendChild(SROinput);
        //Cria o formulario para RASTREAMENTO
        linkDetalhes.parentNode.insertBefore(SROform, linkDetalhes.parentNode.firstChild);
    }
}