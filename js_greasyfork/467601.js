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
    font-color: #fff;
    line-height: 1.3em;
    outline: none;
    animation: animate 10s linear infinite;
    border: 1px solid black;
    border-radius: 5px;
    animation: blinkingC 1s infinite;
  `;
    const labelStyle2 = `
    position: static;
    font-family: inherit;
    font-size: 1.5em;
    letter-spacing: 0px;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    font-color: #fff;
    line-height: 1.3em;
    outline: none;
    animation: animate 10s linear infinite;
    border: 1px solid black;
    border-radius: 5px;
    animation: blinkingC2 1s infinite;
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
    (function popularTelas() {
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
            var coberturasValoresDiv = document.querySelector("#gbox_GridAcomp")
            coberturasValoresDiv.id = "coberturas-valores"
            inserirElemento("coberturas-valores", "card-Overlay", "label-Overlay-cobertura-Valores", labelStyle, "Confirmar coberturas (inclusive teto solar e carro reserva)");
            var elementoInserido = document.getElementsByClassName("label-Overlay-cobertura-Valores")[0]
            coberturasValoresDiv.prepend(elementoInserido)
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
            document.querySelector("#BoxInforLoc > div:nth-child(3)").id = "BoxInforLoc - div(3)"
            if( document.querySelector("#DIVCondicaoComercial").textContent == 'Residencial' ) {
            inserirElemento("BoxInforLoc - div(3)", "card-Overlay", "label-Overlay-tipo-imovel", labelStyle, "Confirmar endereço e demais informações");}
            var elementoInserido = document.getElementsByClassName("label-Overlay-tipo-imovel")[0];
            document.querySelector("#BoxInforLoc > div:nth-child(3)").appendChild(elementoInserido);
            elementoInserido.style.marginLeft = "0.5em";
        }, 1000, 900000);

        aguardarElemento("#DIVDemaisCarac", function() {
            if( document.querySelector("#DIVCondicaoComercial").textContent == 'Residencial' ) {
            inserirElemento("DIVDemaisCarac", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar se há protecionais e placa solar no local de risco");}
        }, 1000, 900000);

        aguardarElemento("#DIVGridResultado > div > div:nth-child(4) > div > div.col-sm-12.text-center.border-cia > div > div:nth-child(1) > img", function() {
            var xpathFilter = "//img[@src='../img/logo_30015.gif']";
            var xpathResult = document.evaluate(xpathFilter, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < xpathResult.snapshotLength; i++) {
                if ( i == 2 ) { var element = xpathResult.snapshotItem(i) }
            }
            var div = element.parentNode.parentNode.parentNode.parentNode.parentNode
            var divCriada = document.createElement('div')
            var labelCriado = document.createElement('label')
            labelCriado.textContent = 'Allianz indeniza por metragem original no registro de imóveis';
            labelCriado.style.cssText = labelStyle;
            labelCriado.style.fontSize = "1.2em";
            divCriada.appendChild(labelCriado);
            div.appendChild(divCriada)
        }, 1000, 900000);

        aguardarElemento("#BoxgrDadoSegurado", function() {
            inserirElemento("BoxgrDadoSegurado", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar endereço do associado (nem sempre é o mesmo endereço do risco)");
        }, 1000, 900000);

        aguardarElemento("#BoxgrInfoAdicionaisSegurado2", function() {
            inserirElemento("BoxgrInfoAdicionaisSegurado2", "card-Overlay", "label-Overlay", labelStyle, "Confirmar cláusula beneficiária");
        }, 1000, 900000);

        aguardarElemento("#BoxgrpFormaPgto", function() {
            inserirElemento("BoxgrpFormaPgto", "card-Overlay", "label-Overlay", labelStyle2, "Confirmar se o segurado é o titular da conta. Caso não seja, entrar em contato com o titular.");
        }, 1000, 900000);

    })();

})();