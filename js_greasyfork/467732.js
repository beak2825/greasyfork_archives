function aguardarElemento(seletorReferencia, callback, FrequenciaMs, timeoutMs) {
    var InicioMs = Date.now();

    function loopPesquisa() {

        if (document.querySelector(seletorReferencia) !== null) {
            callback();
            return;
        } else {
            setTimeout(function() {
                if (timeoutMs && Date.now() - InicioMs > timeoutMs) {
                    return;
                }
                loopPesquisa();
            }, FrequenciaMs);
        }
    }

    loopPesquisa();
}

(function() {
    'use strict';
    function inserirElemento(divReferencia, divClassName, labelClassName, styleName, labelText) {
        var referencia = document.getElementById(divReferencia);
        let div = document.createElement('div')
        div.className = divClassName
        let label = document.createElement('label');
        label.className = labelClassName
        label.textContent = labelText;
        label.style.cssText = styleName;
        referencia.appendChild(div);
        div.appendChild(label)
    }
    const labelStyle = `
    position: static;
    font-family: inherit;
    font-size: 1.5em;
    letter-spacing: 0px;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    font-color: #f5f5f5;
    line-height: 1.3em;
    padding: 0.2em;
    outline: none;
    border: 0px solid black;
    border-radius: 2px;
    animation: blinkingC 1s linear infinite;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);
  `;
    const labelStyle2 = `
    position: static;
    font-family: inherit;
    font-size: 1.5em;
    letter-spacing: 0px;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    font-color: #f5f5f5;
    line-height: 1.3em;
    padding: 0.2em;
    outline: none;
    border: 0px solid black;
    border-radius: 2px;
    animation: blinkingC2 1s linear infinite;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);
  `;
    const blinkAnimation = `
    @keyframes blinkingC {
      0% {
        color: white;
        background: #03a600;
      }
      100% {
        color: lightcyan;
        background: #bfbf10;
      }
    }
  `;
    const blinkAnimation2 = `
    @keyframes blinkingC2 {
      0% {
        color: white;
        background: #bfbf10;
      }
      100% {
        color: lightcyan;
        background: #03a600;
      }
    }
  `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(blinkAnimation));
    style.appendChild(document.createTextNode(blinkAnimation2));
    document.head.appendChild(style);

    // AUTOMÓVEL
    aguardarElemento("#DIVPadrao2000_Observacoes", function() {
        inserirElemento("DIVPadrao2000_Observacoes", "card-Overlay", "label-Overlay", labelStyle, "Informe que a ligação está sendo gravada");
    }, 1000, 900000);

    aguardarElemento("#BoxDadosSegurado", function() {
        inserirElemento("BoxDadosSegurado", "card-Overlay", "label-Overlay", labelStyle2, "Verificar grupo de afinidade");
    }, 1000, 900000);

    aguardarElemento("#DIVPadrao2000_Cobertura190 > div", function() {
        inserirElemento("DIVPadrao2000_Cobertura190", "card-Overlay", "label-Overlay-tipo-uso", labelStyle, "Esclarecer que uso particular implica em não utilizar o veículo para atividade comercial");
        var elementoInserido = document.getElementsByClassName("label-Overlay-tipo-uso")[0]
        document.querySelector("#BoxInforLoc > div > div:nth-child(1)").appendChild(elementoInserido)
        elementoInserido.style.marginLeft = "0.5em";

    }, 1000, 900000);

    aguardarElemento("#BoxCobsBasicas", function() {
        inserirElemento("BoxCobsBasicas", "card-Overlay", "label-Overlay", labelStyle2, "Verificar se as coberturas atendem o segurado");
    }, 1000, 900000);

    aguardarElemento("#BoxBoxRenovacao", function() {
        inserirElemento("BoxBoxRenovacao", "card-Overlay", "label-Overlay", labelStyle, "Verificar se o segurado acionou o seguro na última vigência");
    }, 1000, 900000);

    aguardarElemento("#DIVDadosCondutor", function() {
        inserirElemento("BoxInforCond", "card-Overlay", "label-Overlay-dados-condutor", labelStyle2, "Principal condutor: Deve ser o condutor mais jovem de uso frequente");
        var cardCondutor = document.querySelector("#DIVPadrao2000_Condutor01_Propriosegurado").style.display
        var slider = document.getElementsByClassName("slider round")[0]
        var elementoInserido = document.getElementsByClassName("label-Overlay-dados-condutor")[0]
        if(cardCondutor === 'none') { elementoInserido.style.display = "none"; elementoInserido.id = "label-slider-inativo"; } else { elementoInserido.style.display = ""; elementoInserido.id = "label-slider-ativo";};
        slider.addEventListener("click", () => { switch(elementoInserido.id) {
            case 'label-slider-inativo':
                elementoInserido.style.display = "";
                elementoInserido.id = "label-slider-ativo";
                break;
            case 'label-slider-ativo':
                elementoInserido.style.display = "none";
                elementoInserido.id = "label-slider-inativo";
                break
        }})
    }, 1000, 9000000);

    aguardarElemento("#gview_GridAcomp > div:nth-child(2)", function() {
        if ( (document.querySelector("#DIVCondicaoComercial").textContent !== 'Residencial') && (document.querySelector("#DIVCondicaoComercial").textContent !== 'Empresarial') ) {
            var coberturasValoresDiv = document.querySelector("#gbox_GridAcomp")
            coberturasValoresDiv.id = "coberturas-valores"
            inserirElemento("coberturas-valores", "card-Overlay", "label-Overlay-cobertura-Valores", labelStyle, "Confirmar coberturas (inclusive teto solar e carro reserva)");
            var elementoInserido = document.getElementsByClassName("label-Overlay-cobertura-Valores")[0]
            coberturasValoresDiv.prepend(elementoInserido)}
    }, 1000, 900000);

    aguardarElemento("#BoxInforCondAdicionais", function() {
        inserirElemento("BoxInforCondAdicionais", "card-Overlay", "label-Overlay", labelStyle, "Além do condutor principal, existem outros condutores mais jovens que venham a conduzir o veículo dois ou mais na semana?");
    }, 1000, 900000);

    aguardarElemento("#DIVDadosCondutor", function() {
        inserirElemento("BoxGrupoJovensCondutores", "card-Overlay", "label-Overlay-dados-jovem", labelStyle2, "Informar condutores eventuais abaixo de 26 anos");
        var cardJovem = document.querySelector("#DIVJovensCondutores").style.display
        var slider = document.getElementsByClassName("slider round")[2]
        var elementoInserido = document.getElementsByClassName("label-Overlay-dados-jovem")[0]
        if(cardJovem === 'none') { elementoInserido.style.display = "none"; elementoInserido.id = "label-slider-jovem-inativo"; } else { elementoInserido.style.display = ""; elementoInserido.id = "label-slider-jovem-ativo";};
        slider.addEventListener("click", () => { switch(elementoInserido.id) {
            case 'label-slider-jovem-inativo':
                elementoInserido.style.display = "";
                elementoInserido.id = "label-slider-jovem-ativo";
                break;
            case 'label-slider-jovem-ativo':
                elementoInserido.style.display = "none";
                elementoInserido.id = "label-slider-jovem-inativo";
                break
        }})
    }, 1000, 9000000);

    // RESIDENCIAL
    aguardarElemento("#BoxDadosSeg", function() {
        inserirElemento("BoxDadosSeg", "card-Overlay", "label-Overlay", labelStyle2, "Informe que a ligação está sendo gravada");
    }, 1000, 900000);

    aguardarElemento("#BoxGrupo1", function() {
        inserirElemento("BoxGrupo1", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar nome, proprietário e grupo de afinidade");
    }, 1000, 900000);

    aguardarElemento("#BoxInforLoc > div:nth-child(3)", function() {
        if( document.querySelector("#DIVCondicaoComercial").textContent === 'Residencial' ) {
            inserirElemento("BoxInforLoc", "card-Overlay", "label-Overlay-tipo-imovel", labelStyle, "Oferecer cobertura prédio e conteúdo.         Apartamento: até 2 andares HDI e Porto considera casa. Residência sobre comércio, Mapfre considera casa.");
            var elementoInserido = document.getElementsByClassName("label-Overlay-tipo-imovel")[0];
            document.querySelector("#BoxInforLoc > div:nth-child(3)").appendChild(elementoInserido);
            elementoInserido.style.marginLeft = "0.5em";}
    }, 1000, 900000);

    aguardarElemento("#DIVDemaisCarac", function() {
        if( document.querySelector("#DIVCondicaoComercial").textContent === 'Residencial' ) {
            inserirElemento("DIVDemaisCarac", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar se há protecionais, placa solar no local de risco e se há energia compartilhada.");}
    }, 1000, 900000);


    aguardarElemento("#DIVGridResultado > div > div:nth-child(4) > div > div.col-sm-12.text-center.border-cia > div > div:nth-child(1) > img", function() {
       if ( document.querySelector("#DIVCondicaoComercial").textContent === 'Residencial' ) {
        var xpathFilter = "//img[@src='../img/logo_30015.gif']";
        var xpathResult = document.evaluate(xpathFilter, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            if ( i == 2 ) { var element = xpathResult.snapshotItem(i) }
        }
        var div = element.parentNode.parentNode.parentNode.parentNode.parentNode
        var divCriada = document.createElement('div')
        var labelCriado = document.createElement('label')
        labelCriado.textContent = 'Allianz indeniza por metragem original no registro de imóveis e averbado na prefeitura';
        labelCriado.style.cssText = labelStyle;
        labelCriado.style.fontSize = "1.2em";
        divCriada.appendChild(labelCriado);
        div.appendChild(divCriada)}
    }, 1000, 900000);

    aguardarElemento("#gview_GridAcomp > div:nth-child(2)", function() {
        if ( document.querySelector("#DIVCondicaoComercial").textContent === 'Residencial') {
            var coberturasValoresDiv = document.querySelector("#gbox_GridAcomp")
            coberturasValoresDiv.id = "coberturas-valores"
            inserirElemento("coberturas-valores", "card-Overlay", "label-Overlay-cobertura-Valores", labelStyle, "Allianz indeniza por metragem original no registro de imóveis e averbado na prefeitura");
            var elementoInserido = document.getElementsByClassName("label-Overlay-cobertura-Valores")[0]
            coberturasValoresDiv.prepend(elementoInserido)}
    }, 1000, 900000);

    aguardarElemento("#BoxgrDadoSegurado", function() {
        if ( (document.querySelector("#DIVCondicaoComercial").textContent == 'Residencial') || (document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial') ) {
        inserirElemento("BoxgrDadoSegurado", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar endereço do associado (nem sempre é o mesmo endereço do risco)");}
    }, 1000, 900000);

    aguardarElemento("#BoxgrInfoAdicionaisSegurado2", function() {
        inserirElemento("BoxgrInfoAdicionaisSegurado2", "card-Overlay", "label-Overlay", labelStyle, "Confirmar cláusula beneficiária");
    }, 1000, 900000);

    aguardarElemento("#BoxgrpFormaPgto", function() {
        inserirElemento("BoxgrpFormaPgto", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar se o segurado é o titular da conta. Caso não seja, entrar em contato com o titular.");
    }, 1000, 900000);

    //EMPRESARIAL

    aguardarElemento("#DIVPadrao4000_Cobertura9103", function() {
        if ( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            var classeConstrucao = document.querySelector("#DIVPadrao4000_Cobertura9103 > div")
            classeConstrucao.id = "div-classe-construcao"
            inserirElemento("div-classe-construcao", "card-Overlay", "label-Overlay-classe-construcao", labelStyle, ">");
            var elementoInserido = document.getElementsByClassName("label-Overlay-classe-construcao")[0]
            classeConstrucao.style.display = "flex";
            classeConstrucao.prepend(elementoInserido)
            elementoInserido.style.fontSize = "1.5em"
            elementoInserido.style.fontWeight = "600"
            elementoInserido.style.width = "10%"
            elementoInserido.style.marginTop = "0.3em"
            elementoInserido.style.animation = 'blinkingC2 3s infinite'
    }}, 1000, 900000);

    aguardarElemento("#DIVPadrao4000_Cobertura9103", function() {
        if ( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            var classeConstrucao = document.querySelector("#DIVPadrao4000_Cobertura9101 > div")
            classeConstrucao.id = "div-classe-contrata-cobertura"
            inserirElemento("div-classe-contrata-cobertura", "card-Overlay", "label-Overlay-contrata-cobertura", labelStyle, ">");
            var elementoInserido = document.getElementsByClassName("label-Overlay-contrata-cobertura")[0]
            classeConstrucao.style.display = "flex";
            classeConstrucao.prepend(elementoInserido)
            elementoInserido.style.fontSize = "1.5em"
            elementoInserido.style.fontWeight = "600"
            elementoInserido.style.width = "6%"
            elementoInserido.style.marginTop = "0.2em"
            elementoInserido.style.animation = 'blinkingC2 3s infinite'
    }}, 1000, 900000);

    aguardarElemento("#DIVDemaisCarac", function() {
        if( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            inserirElemento("DIVPadrao4000_Cobertura9108", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar se há protecionais e placa solar no local de risco");}
    }, 1000, 900000);

    aguardarElemento("#BoxInforAtiv", function() {
        if ( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            var empAtividades = document.getElementById("BoxInforAtiv")
            inserirElemento("BoxInforAtiv", "card-Overlay", "overlay-emp-atividade", labelStyle, "Confirmar atividade principal");
            var elementoInserido = document.getElementsByClassName("overlay-emp-atividade")[0]
            empAtividades.prepend(elementoInserido)}
    }, 1000, 900000);

    aguardarElemento("#gview_GridAcomp > div:nth-child(2)", function() {
        if ( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            var coberturasValoresDiv = document.querySelector("#gbox_GridAcomp")
            coberturasValoresDiv.id = "coberturas-valores-empresarial"
            inserirElemento("coberturas-valores-empresarial", "card-Overlay", "label-Overlay-cobertura-Valores-empresarial", labelStyle, "Confirmar se coberturas e assistências estão atendendo o segurado");
            var elementoInserido = document.getElementsByClassName("label-Overlay-cobertura-Valores-empresarial")[0]
            coberturasValoresDiv.prepend(elementoInserido)}
    }, 1000, 900000);

    aguardarElemento("#BoxInspecao", function() {
        if( document.querySelector("#DIVCondicaoComercial").textContent == 'Empresarial' ) {
            inserirElemento("BoxInspecao", "card-Overlay", "label-Overlay", labelStyle, "Confirmar cláusula beneficiária, nome completo e informações de contato");}
    }, 1000, 900000);
})();