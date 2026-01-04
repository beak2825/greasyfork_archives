// ==UserScript==
// @name         TD: Análise dos preços do TD
// @namespace    TD_analise_dos_precos
// @version      1
// @description  Análise dos sobre preços e taxas do Tesouro Direto!
// @author       John Doe
// @match        https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm
// @require      https://cdnjs.cloudflare.com/ajax/libs/luxon/1.25.0/luxon.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423212/TD%3A%20An%C3%A1lise%20dos%20pre%C3%A7os%20do%20TD.user.js
// @updateURL https://update.greasyfork.org/scripts/423212/TD%3A%20An%C3%A1lise%20dos%20pre%C3%A7os%20do%20TD.meta.js
// ==/UserScript==
/*global $:false, luxon:false, jQuery:false, debug:false, alasql:false, toastr:false, jscolor:false */

/*
// json format
{
  "responseStatus": 200,
  "responseStatusText": "success",
  "statusInfo": "OK",
  "response": {
    "BdTxTp": {
      "cd": 0
    },
    "TrsrBondMkt": {
      "opngDtTm": "2021-03-12T09:15:00",
      "clsgDtTm": "2021-03-15T05:00:00",
      "qtnDtTm": "2021-03-12T15:22:40.953",
      "stsCd": 4,
      "sts": "Fechado"
    },
    "TrsrBdTradgList": [
      {
        "TrsrBd": {
          "cd": 171,
          "nm": "Tesouro Selic 2024",
          "featrs": "Título com rentabilidad...",
          "mtrtyDt": "2024-09-01T00:00:00",
          "minInvstmtAmt": 107.35,
          "untrInvstmtVal": 10735.78,
          "invstmtStbl": "Como não paga juros semestrais, é mais interessante para quem pode deixar o dinheiro render até o vencimento do investimento\r\n",
          "semiAnulIntrstInd": false,
          "rcvgIncm": "Indicado para aqueles que querem realizar investimentos de curto prazo\r\n",
          "anulInvstmtRate": 0.1708,
          "anulRedRate": 0.1808,
          "minRedQty": 0.01,
          "untrRedVal": 10732.07,
          "minRedVal": 107.32,
          "isinCd": "BRSTNCLF0008",
          "FinIndxs": {
            "cd": 17,
            "nm": "SELIC"
          }
        }
      }
    ],
    "BizSts": {
      "cd": "0",
      "dtTm": "2021-03-13T08:47:00"
    }
  }
}
// Titulos do TD
cd  nm
159 = Tesouro Selic 2023
171 = Tesouro Selic 2024
164 = Tesouro Selic 2025
172 = Tesouro Selic 2027

163 = Tesouro Prefixado 2022
155 = Tesouro Prefixado 2023
146 = Tesouro Prefixado com Juros Semestrais 2023
173 = Tesouro Prefixado 2024
161 = Tesouro Prefixado 2025
151 = Tesouro Prefixado com Juros Semestrais 2025
165 = Tesouro Prefixado 2026
157 = Tesouro Prefixado com Juros Semestrais 2027
162 = Tesouro Prefixado com Juros Semestrais 2029
166 = Tesouro Prefixado com Juros Semestrais 2031

103 = Tesouro IPCA+ 2024
84 = Tesouro IPCA+ com Juros Semestrais 2024
170 = Tesouro IPCA+ 2026
156 = Tesouro IPCA+ com Juros Semestrais 2026
167 = Tesouro IPCA+ com Juros Semestrais 2030
138 = Tesouro IPCA+ 2035
111 = Tesouro IPCA+ com Juros Semestrais 2035
168 = Tesouro IPCA+ com Juros Semestrais 2040
160 = Tesouro IPCA+ 2045
93 = Tesouro IPCA+ com Juros Semestrais 2045
147 = Tesouro IPCA+ com Juros Semestrais 2050
169 = Tesouro IPCA+ com Juros Semestrais 2055
65 = Tesouro IGPM+ com Juros Semestrais 2021
66 = Tesouro IGPM+ com Juros Semestrais 2031

CSS GRID: https://simplegrid.io/
*/

(function() {
    'use strict';
    var TITULOS = [];

    var HEAD_APPEND = `
<style>
.simple-grid{line-height:1.5}.simple-grid h1{font-size:2.5rem}.simple-grid h2{font-size:2rem}.simple-grid h3{font-size:1.375rem}.simple-grid h4{font-size:1.125rem}.simple-grid h5{font-size:1rem}.simple-grid h6{font-size:.875rem}.simple-grid p{font-size:1.125rem;font-weight:200;line-height:1.8}.simple-grid .font-light{font-weight:300}.simple-grid .font-regular{font-weight:400}.simple-grid .font-heavy{font-weight:700}.simple-grid .left{text-align:left}.simple-grid .right{text-align:right}.simple-grid .center{text-align:center;margin-left:auto;margin-right:auto}.simple-grid .justify{text-align:justify}.simple-grid .container{width:90%;margin-left:auto;margin-right:auto}.simple-grid .row{position:relative;width:100%}.simple-grid .row [class^=col]{float:left;margin:.5rem 2%;min-height:.125rem}.simple-grid .col-1,.simple-grid .col-10,.simple-grid .col-11,.simple-grid .col-12,.simple-grid .col-2,.simple-grid .col-3,.simple-grid .col-4,.simple-grid .col-5,.simple-grid .col-6,.simple-grid .col-7,.simple-grid .col-8,.simple-grid .col-9{width:96%}.simple-grid .col-1-sm{width:4.33%}.simple-grid .col-2-sm{width:12.66%}.simple-grid .col-3-sm{width:21%}.simple-grid .col-4-sm{width:29.33%}.simple-grid .col-5-sm{width:37.66%}.simple-grid .col-6-sm{width:46%}.simple-grid .col-7-sm{width:54.33%}.simple-grid .col-8-sm{width:62.66%}.simple-grid .col-9-sm{width:71%}.simple-grid .col-10-sm{width:79.33%}.simple-grid .col-11-sm{width:87.66%}.simple-grid .col-12-sm{width:96%}.simple-grid .row::after{content:"";display:table;clear:both}.simple-grid .hidden-sm{display:none}@media only screen and (min-width:33.75em){.simple-grid .container{width:80%}}@media only screen and (min-width:45em){.simple-grid .col-1{width:4.33%}.simple-grid .col-2{width:12.66%}.simple-grid .col-3{width:21%}.simple-grid .col-4{width:29.33%}.simple-grid .col-5{width:37.66%}.simple-grid .col-6{width:46%}.simple-grid .col-7{width:54.33%}.simple-grid .col-8{width:62.66%}.simple-grid .col-9{width:71%}.simple-grid .col-10{width:79.33%}.simple-grid .col-11{width:87.66%}.simple-grid .col-12{width:96%}.simple-grid .hidden-sm{display:block}}@media only screen and (min-width:60em){.simple-grid .container{width:75%;max-width:60rem}}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.js-alert {
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-flow: row;
    -ms-flex-flow: row;
    flex-flow: row;
        flex-direction: row;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.25);
    border-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
    /* height: 15rem; */
    min-width: 22rem;
    padding: 1rem;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    margin-right: -7em;
    z-index: 10 !important;
}
.js-alert-sticky {
    position: fixed !important;
    bottom: 0;
    z-index: 3;
    right: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    -webkit-animation: slideInUp .5s;
    animation: slideInUp .5s;
        animation-delay: 0s;
        animation-fill-mode: none;
    -webkit-animation-fill-mode: backwards;
    animation-fill-mode: backwards;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
}

.js-alert__title {
    font-size: 1.6rem;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #000;
    margin-bottom: auto;
}
#js-alert-content TD {
    padding: 4px;
}
</style>
    `;


    function log(msg, color = "black") {
        // let color = color || "black";
        // https://www.w3schools.com/colors/colors_names.asp
        let bgc = "White";
        switch (color) {
            case "success":
                color = "DarkGreen";
                bgc = "LimeGreen";
                break;
            case "info":
                color = "DodgerBlue";
                bgc = "AliceBlue";
                break;
            case "error":
                color = "Red";
                bgc = "Black";
                break;
            case "start":
                color = "OliveDrab";
                bgc = "PaleGreen";
                break;
            case "warning":
                color = "Tomato";
                bgc = "Black";
                break;
            case "end":
                color = "FloralWhite";
                bgc = "MediumVioletRed";
                break;
            default:
                color = color;
        }

        if (typeof msg == "object") {
            console.log(msg);
        } else if (typeof color == "object") {
            console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
            console.log(color);
        } else {
            console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
        }
    }

    function convert_to_float(currency) {
        //currency = "R$ -123.324,123,323"
        let regex = /([+-]?[0-9|^.|^,]+)[\.|,]([0-9]+)$/igm
        let result = regex.exec(currency);
        let floatResult = result? result[1].replace(/[.,]/g, "")+ "." + result[2] : currency.replace(/[^0-9-+]/g, "");
        return Number(floatResult);
    }

    function getTitulo(cd){
        return TITULOS.find(x => x.TrsrBd.cd === cd).TrsrBd;
    }

    const formatter_percent = new Intl.NumberFormat('pt-br', {
        style: 'percent',
        minimumFractionDigits: 2
    });


    function build_widget(){
        //let lista_titulo_nome = ''; TITULOS.forEach(function(t, i){ lista_titulo_nome += `${t.TrsrBd.cd} = ${t.TrsrBd.nm}\n`;}); log(lista_titulo_nome);

        let t_prefixado_2024 = getTitulo(173); // prefixado 2024
        let t_prefixado_2026 = getTitulo(165); // prefixado 2026
        let t_prefixado_2031_cjs = getTitulo(166); // prefixado 2031


        let t_ipca_2026 = getTitulo(170); // ipca2026
        let t_ipca_2035 = getTitulo(138); // ipca2035
        let t_ipca_2045 = getTitulo(160); // ipca2045

        let t_ipca_2024_cjs = getTitulo(84); // ipca2024 c/juros
        let t_ipca_2030_cjs = getTitulo(167); // ipca2030 c/juros
        let t_ipca_2040_cjs = getTitulo(168); // ipca2040 c/juros
        let t_ipca_2055_cjs = getTitulo(169); // ipca2055 c/juros

        let dif_40_e_45 = formatter_percent.format( (t_ipca_2040_cjs.untrInvstmtVal - t_ipca_2045.untrInvstmtVal)/ t_ipca_2045.untrInvstmtVal );
        log('dif. % de PREÇO entre ipca 2045 e 2040(c/j): '+ dif_40_e_45, "info");
        log('se a diferença ficar muito alta: é porque o IPCA45 ficou barato. 220% comprar IPCA 40, acima de 250% melhor IPCA 45', "success");

        let dif_30_e_35 = formatter_percent.format( (t_ipca_2030_cjs.untrInvstmtVal - t_ipca_2035.untrInvstmtVal)/ t_ipca_2035.untrInvstmtVal );
        log('dif. % de PREÇO entre ipca 2035 e 2030(c/j): '+ dif_30_e_35, "info");

        let dif_30_e_26 = formatter_percent.format( (t_ipca_2030_cjs.untrInvstmtVal - t_ipca_2026.untrInvstmtVal)/ t_ipca_2026.untrInvstmtVal );
        log('dif. % de PREÇO entre ipca 2026 e 2030(c/j): '+ dif_30_e_26, "info");

        let dif_35_e_45 = formatter_percent.format( ((t_ipca_2035.untrInvstmtVal/t_ipca_2045.untrInvstmtVal) - 1 ) );
        log('dif. % de PREÇO entre ipca 2035 e 2045: '+ dif_35_e_45, "info");
        log('diferença ficar maior 50%: comprar ipca 45', "success");

        let inflacao_implicita_24 = formatter_percent.format( ((1+ t_prefixado_2024.anulInvstmtRate/100)/(1+ t_ipca_2024_cjs.anulRedRate/100)) - 1 );
        log('Inflação implícita prefixado 24 / ipca 24 cjs: '+ inflacao_implicita_24, "info");

        let inflacao_implicita_26 = formatter_percent.format( ((1+ t_prefixado_2026.anulInvstmtRate/100)/(1+ t_ipca_2026.anulInvstmtRate/100)) - 1 );
        log('Inflação implícita prefixado 26 / ipca 26: '+ inflacao_implicita_26, "info");

        let inflacao_implicita_31 = formatter_percent.format( ((1+ t_prefixado_2031_cjs.anulInvstmtRate/100)/(1+ t_ipca_2030_cjs.anulInvstmtRate/100)) - 1 );
        log('Inflação implícita prefixado 31 / ipca 30 cjs: '+ inflacao_implicita_31, "info");

        let inflacao_que_aguenta_prefixado2024 = formatter_percent.format( ((t_prefixado_2024.anulInvstmtRate* 0.85) - 0.25)/100 ) ;
        log('Inflação suportada pelo Prefixado 2024 : '+ inflacao_que_aguenta_prefixado2024, "info");


        let body_append = `
        <style>
        </style>
        <div class="simple-grid">
            <div class="container">
                <div id="js-alert" class="js-alert js-alert-sticky" style="left: 70px;">
                    <div class="noselect row">
                        <div class="col-8-sm left font-heavy"> <span id="js-alert-content-toggle" style="cursor:pointer;">Infomações&#8661;</span> </div>
                        <div class="col-4-sm right"> <span id="js-alert-content-close" style="cursor:pointer;">&#x2715;</span> </div>
                    </div>
                    <div class="row">
                        <td class="col">
                            <div id="js-alert-content">
                                <table border="1" >
                                    <tbody>
                                        <tr><td>dif. % de PREÇO entre ipca 2045 e 2040(c/j)</td><td>${dif_40_e_45}</td></tr>
                                        <tr><td>dif. % de PREÇO entre ipca 2035 e 2030(c/j)</td><td>${dif_30_e_35}</td></tr>
                                        <tr><td>dif. % de PREÇO entre ipca 2026 e 2030(c/j)</td><td>${dif_30_e_26}</td></tr>
                                        <tr><td>dif. % de PREÇO entre ipca 2035 e 2045</td><td>${dif_35_e_45}</td></tr>
                                        <tr><td>Inflação suportada pelo Prefixado 2024</td><td>${inflacao_que_aguenta_prefixado2024}</td></tr>
                                        <tr><td>Inflação implícita prefixado 24 / ipca 24 cjs</td><td>${inflacao_implicita_24}</td></tr>
                                        <tr><td>Inflação implícita prefixado 26 / ipca 26</td><td>${inflacao_implicita_26}</td></tr>
                                        <tr><td>Inflação implícita prefixado 31 / ipca 30 cjs</td><td>${inflacao_implicita_31}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
        `;
        document.body.insertAdjacentHTML('beforeend', body_append);

        let toggle_btn = document.getElementById("js-alert-content-toggle");
        toggle_btn.addEventListener('click', function(evt){
            let x = document.getElementById("js-alert-content");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        });
        let close_btn = document.getElementById("js-alert-content-close");
        close_btn.addEventListener('click', function(evt){
            let x = document.getElementById("js-alert");
            x.remove();
        });
    }


    async function main(){
        log("--------- starting -------", "start");

        document.head.insertAdjacentHTML('beforeend', HEAD_APPEND);
        await fetch('/json/br/com/b3/tesourodireto/service/api/treasurybondsinfo.json')
            .then(response => response.json())
            .then(function(json_data){
            TITULOS = json_data.response.TrsrBdTradgList;
            build_widget();
        });

        log("--------- finished -------", "end");
    }

    main();

})();