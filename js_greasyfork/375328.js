// ==UserScript==
// @name         WAZEPT Help Info
// @version      2025.03.12
// @description  Facilitates the standardization of landmarks
// @author       J0N4S13 (jonathanserrario@gmail.com)
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace    https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/375328/WAZEPT%20Help%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/375328/WAZEPT%20Help%20Info.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global $ */

var array_roads = [];

var array_data = {};

var array_incendios = [];

var version = "2.0.0";
var last_link = "";
var wmeSDK;

function start(timeout = 1) {
    if (W && W.map && W.model && W.loginManager.user)
    {
        wmeSDK = getWmeSdk({
            scriptId: "1b2ccee0-3885-4d95-bf85-39dbaa2bce84",
            scriptName: "WAZEPT Help Info"
        });
        wmeSDK.Shortcuts.createShortcut({
            callback: () => {
                getPKEstradas();
            },
            description: 'Ponto Quilométrico (Estradas)',
            shortcutId: 'GetPKEstradas',
            shortcutKeys: 'S+k',
        });

        wmeSDK.Shortcuts.createShortcut({
            callback: () => {
                getPKFerrovia();
            },
            description: 'Ponto Quilométrico (Ferrovia)',
            shortcutId: 'GetPKFerrovia',
            shortcutKeys: 'S+f',
        });

        setTimeout(() => {dataCall();}, 500);
    }
    else if (timeout < 1000)
        setTimeout(function () {start(timeout++);}, 200);
}

start();

function receivedata() {
    return new Promise(resolve => {

        fetch('https://docs.google.com/spreadsheets/d/1GPvf5wighlHNey8n9pWmIloY6pXLrAXs8DfHHVMDqBg/gviz/tq?tqx=out:json&sheet=Base')
            .then(res => res.text())
            .then(text => {
            const json = JSON.parse(text.substr(47).slice(0, -2))

            $(json.table.rows).each(function(){
                var elem = [verifyNull(this["c"][1]), verifyNull(this["c"][2])]
                array_data[verifyNull(this["c"][0])] = elem;
            });
        })
        var timer = setInterval(check_data, 100);

        function check_data() {
            if(typeof array_data['RD_ESTRADAS'] != 'undefined')
            {
                clearInterval(timer);
                resolve('true');
            }
        }

    });
}

function optionsUser() {
    wmeSDK.Sidebar.registerScriptTab()
        .then(result => {
        result.tabLabel.textContent = 'INFO';

        // Criar o conteúdo da nova aba
        const content = document.createElement('div');

        // Criar a div para a aba ROADS
        const divEstrada = document.createElement('div');
        const labelEstrada = document.createElement('label');
        labelEstrada.innerHTML = 'Redirecionar para:';
        labelEstrada.style.cssText = 'font-size: 15px;';
        divEstrada.appendChild(labelEstrada);

        // Função para criar inputs
        const criarInput = (id, labelTexto, type = 'text') => {
            const div = document.createElement('div');
            const label = document.createElement('label');
            label.innerHTML = labelTexto;
            const input = document.createElement('input');
            input.id = id;
            input.type = type;
            input.style.cssText = 'width:50%;height:20px;float:right;position:relative;';
            div.appendChild(label);
            div.appendChild(input);

            // Adicionar o autocomplete ao input (se for o 'input_road')
            if (id === 'input_road') {
                input.addEventListener('input', function() {
                    const value = this.value;
                    closeAllLists(); // Fechar qualquer sugestão aberta

                    if (!value) return; // Se o input estiver vazio, não mostrar sugestões

                    const suggestionBox = document.createElement("div");
                    suggestionBox.setAttribute("id", input.id + "-autocomplete-list");
                    suggestionBox.setAttribute("class", "autocomplete-items");
                    suggestionBox.style.position = "absolute"; // Alinha diretamente abaixo do input
                    suggestionBox.style.zIndex = "99";
                    suggestionBox.style.backgroundColor = "#fff";
                    suggestionBox.style.border = "1px solid #d4d4d4";
                    suggestionBox.style.maxHeight = "200px";
                    suggestionBox.style.overflowY = "auto";

                    // Calcular a posição à esquerda do input
                    const inputLeft = input.offsetLeft;
                    suggestionBox.style.left = inputLeft + "px"; // Alinha a lista com o input

                    input.parentNode.appendChild(suggestionBox);

                    // Simula sugestões (substitua com sua lógica para buscar dados reais)
                    const suggestions = [
                        'A1', 'A10', 'A11', 'A12', 'A13', 'A13-1', 'A14', 'A15', 'A16', 'A17', 'A19',
                        'A2', 'A20', 'A21', 'A22', 'A23', 'A24', 'A25', 'A26', 'A27', 'A28', 'A29', 'A3',
                        'A32', 'A33', 'A4', 'A41', 'A42', 'A43', 'A44', 'A5', 'A6', 'A7', 'A8', 'A8-1', 'A9',
                        'EN1', 'EN1-12', 'EN1-13', 'EN1-14', 'EN1-15', 'EN1-3', 'EN1-4', 'EN1-5', 'EN1-6',
                        'EN1-7', 'EN1-8', 'EN10', 'EN10-1', 'EN10-2', 'EN10-3', 'EN10-4', 'EN10-6', 'EN10-8',
                        'EN101', 'EN101-1', 'EN101-2', 'EN101-3', 'EN101-4', 'EN101-5', 'EN102', 'EN102-1',
                        'EN103', 'EN103-1', 'EN103-2', 'EN103-3', 'EN103-5', 'EN103-6', 'EN103-7', 'EN103-9',
                        'EN104', 'EN105', 'EN105-2', 'EN106', 'EN106-1', 'EN106-2', 'EN106-3', 'EN108',
                        'EN108-1', 'EN108-2', 'EN108-3', 'EN109', 'EN109-2', 'EN109-4', 'EN109-5', 'EN109-7',
                        'EN109-9', 'EN11', 'EN11-2', 'EN110', 'EN110-2', 'EN110-3', 'EN111', 'EN111-1', 'EN112',
                        'EN113', 'EN113-1', 'EN114', 'EN114-1', 'EN114-2', 'EN114-3', 'EN115', 'EN115-1',
                        'EN115-2', 'EN115-3', 'EN115-4', 'EN115-5', 'EN116', 'EN117', 'EN117-1', 'EN118',
                        'EN118-1', 'EN118-2', 'EN118-5', 'EN119', 'EN12', 'EN120', 'EN120-1', 'EN120-2',
                        'EN121', 'EN122', 'EN122-1', 'EN123', 'EN123-1', 'EN124', 'EN124-1', 'EN124-3',
                        'EN125', 'EN125-10', 'EN125-3', 'EN125-4', 'EN125-6', 'EN125-9', 'EN13', 'EN13-3',
                        'EN13-5', 'EN13-6', 'EN14', 'EN15', 'EN15-3', 'EN15-4', 'EN16', 'EN16-2', 'EN16-3',
                        'EN17', 'EN18', 'EN18-10', 'EN18-3', 'EN18-6', 'EN18-7', 'EN18-8', 'EN2', 'EN2-3',
                        'EN2-8', 'EN2-9', 'EN201', 'EN202', 'EN202-1', 'EN202-2', 'EN202-3', 'EN203', 'EN203-2',
                        'EN204', 'EN204-3', 'EN204-5', 'EN205', 'EN205-1', 'EN205-3', 'EN205-4', 'EN206',
                        'EN206-1', 'EN207-1', 'EN207-2', 'EN207-4', 'EN208', 'EN209', 'EN209-1', 'EN209-2',
                        'EN210', 'EN211', 'EN211-1', 'EN211-2', 'EN212', 'EN213', 'EN213-1', 'EN214', 'EN215',
                        'EN216', 'EN217', 'EN217-1', 'EN218', 'EN218-1', 'EN218-2', 'EN218-3', 'EN220', 'EN221',
                        'EN221-1', 'EN221-3', 'EN221-4', 'EN221-6', 'EN221-7', 'EN222', 'EN222-3', 'EN223',
                        'EN224', 'EN224-1', 'EN224-2', 'EN224-3', 'EN224-4', 'EN225', 'EN226', 'EN226-1', 'EN227',
                        'EN228', 'EN229', 'EN229-1', 'EN229-2', 'EN230', 'EN230-1', 'EN230-2', 'EN230-6',
                        'EN231', 'EN232', 'EN232-2', 'EN233', 'EN233-2', 'EN233-3', 'EN234', 'EN234-1',
                        'EN234-6', 'EN235', 'EN236', 'EN236-1', 'EN237', 'EN237-1', 'EN238', 'EN238-1',
                        'EN239', 'EN240', 'EN241', 'EN241-1', 'EN242', 'EN242-1', 'EN242-4', 'EN242-5',
                        'EN243', 'EN244', 'EN244-2', 'EN244-3', 'EN245', 'EN245-1', 'EN246', 'EN246-1', 'EN247',
                        'EN247-1', 'EN247-2', 'EN247-3', 'EN247-4', 'EN247-5', 'EN248', 'EN248-1', 'EN248-2',
                        'EN248-3', 'EN249', 'EN249-2', 'EN249-3', 'EN249-4', 'EN250', 'EN250-2', 'EN251',
                        'EN251-1', 'EN252', 'EN253', 'EN253-1', 'EN253-2', 'EN254', 'EN254-1', 'EN255',
                        'EN255-1', 'EN256', 'EN256-1', 'EN257', 'EN258', 'EN258-1', 'EN258-2', 'EN259', 'EN260',
                        'EN261', 'EN261-1', 'EN261-2', 'EN261-3', 'EN261-4', 'EN262', 'EN263', 'EN264', 'EN265',
                        'EN266', 'EN266-4', 'EN268', 'EN268-2', 'EN269', 'EN269-1', 'EN269-2', 'EN270', 'EN3',
                        'EN3-1', 'EN3-12', 'EN3-13', 'EN3-2', 'EN3-3', 'EN3-5', 'EN3-7', 'EN3-9', 'EN301',
                        'EN302', 'EN302-1', 'EN302-2', 'EN303', 'EN304', 'EN304-1', 'EN304-3', 'EN305',
                        'EN305-1', 'EN306', 'EN306-1', 'EN307', 'EN308', 'EN308-3', 'EN308-4', 'EN309',
                        'EN310', 'EN311', 'EN311-3', 'EN312', 'EN313', 'EN314', 'EN314-1', 'EN315', 'EN316',
                        'EN317', 'EN318', 'EN318-1', 'EN319', 'EN319-2', 'EN319-3', 'EN320', 'EN320-1',
                        'EN321', 'EN321-1', 'EN321-2', 'EN322', 'EN322-1', 'EN322-2', 'EN323', 'EN323-1',
                        'EN324', 'EN325', 'EN325-1', 'EN326', 'EN327', 'EN327-1', 'EN328', 'EN328-1', 'EN329',
                        'EN329-1', 'EN329-2', 'EN330', 'EN330-1', 'EN331', 'EN331-1', 'EN332', 'EN332-2',
                        'EN332-3', 'EN332-4', 'EN333', 'EN333-3', 'EN334-1', 'EN335', 'EN335-1', 'EN336',
                        'EN337', 'EN337-4', 'EN338', 'EN338-1', 'EN339-1', 'EN340', 'EN341', 'EN341-1',
                        'EN342', 'EN342-1', 'EN342-2', 'EN342-3', 'EN342-4', 'EN343', 'EN344', 'EN345',
                        'EN345-3', 'EN345-4', 'EN346', 'EN347', 'EN348', 'EN349-1', 'EN349-2', 'EN349-3',
                        'EN350', 'EN351', 'EN352', 'EN353', 'EN354', 'EN355', 'EN356', 'EN356-1', 'EN356-2',
                        'EN357', 'EN358', 'EN358-1', 'EN358-2', 'EN358-3', 'EN359', 'EN359-1', 'EN359-6',
                        'EN360', 'EN361', 'EN361-1', 'EN362', 'EN363', 'EN364', 'EN365', 'EN365-2', 'EN365-4',
                        'EN366', 'EN367', 'EN368', 'EN368-1', 'EN369', 'EN370', 'EN370-1', 'EN371', 'EN372',
                        'EN372-1', 'EN373', 'EN374', 'EN374-2', 'EN375', 'EN377', 'EN377-1', 'EN378', 'EN378-1',
                        'EN379', 'EN379-1', 'EN379-2', 'EN380', 'EN382', 'EN383', 'EN386', 'EN387', 'EN388',
                        'EN389-1', 'EN390', 'EN391', 'EN392', 'EN393', 'EN393-1', 'EN393-2', 'EN395', 'EN396',
                        'EN396-2', 'EN397', 'EN398', 'EN4', 'EN4-2', 'EN5', 'EN5-2', 'EN6', 'EN6-1', 'EN6-2',
                        'EN6-3', 'EN6-7', 'EN8', 'EN8-2', 'EN8-3', 'EN8-4', 'EN8-5', 'EN9', 'EN9-1', 'EN9-2',
                        'EN9-3', 'Ramal EN122', 'Ramal EN13-9', 'Ramal EN16', 'ER1-14', 'ER114-4', 'ER124',
                        'ER125', 'ER15', 'ER16', 'ER17-1', 'ER18-1', 'ER18-3', 'ER2', 'ER2-6', 'ER203', 'ER204',
                        'ER205', 'ER205-3', 'ER205-4', 'ER206', 'ER207', 'ER207-3', 'ER209', 'ER210', 'ER216',
                        'ER218', 'ER219', 'ER222', 'ER225', 'ER226', 'ER227', 'ER228', 'ER230', 'ER231-1',
                        'ER231-2', 'ER236', 'ER238', 'ER240', 'ER242-2', 'ER243', 'ER243-1', 'ER244', 'ER246',
                        'ER247', 'ER253', 'ER253-1', 'ER254', 'ER255', 'ER257', 'ER258', 'ER261', 'ER261-2',
                        'ER261-5', 'ER265', 'ER265-1', 'ER266', 'ER267', 'ER268', 'ER270', 'ER301', 'ER304',
                        'ER305', 'ER308', 'ER310', 'ER311', 'ER311-1', 'ER314', 'ER315', 'ER319', 'ER321',
                        'ER322', 'ER322-3', 'ER323', 'ER324', 'ER326-1', 'ER327', 'ER330', 'ER331', 'ER332',
                        'ER333', 'ER333-2', 'ER333-3', 'ER334', 'ER335', 'ER335-1', 'ER336', 'ER337', 'ER338',
                        'ER339', 'ER342', 'ER344', 'ER346', 'ER347', 'ER347-1', 'ER348', 'ER349', 'ER350',
                        'ER351', 'ER353', 'ER354', 'ER355', 'ER355-1', 'ER356', 'ER357', 'ER359', 'ER361',
                        'ER367', 'ER370', 'ER371', 'ER373', 'ER374', 'ER377', 'ER379-1', 'ER381', 'ER384',
                        'ER385', 'ER389', 'ER390', 'ER393', 'ER5', 'ER8-6', 'IC1', 'IC10', 'IC12', 'IC13',
                        'IC15', 'IC16', 'IC17', 'IC19', 'IC2', 'IC20', 'IC21', 'IC22', 'IC27', 'IC28',
                        'IC3', 'IC33', 'IC5', 'IC6', 'IC8', 'IC9', 'IP2', 'IP3', 'IP4', 'IP5', 'IP6',
                        'IP7', 'EXIP4', 'EXIP5'
                    ];

                    suggestions.forEach(suggestion => {
                        if (suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                            const suggestionItem = document.createElement("div");
                            suggestionItem.innerHTML = highlightMatch(suggestion, value);  // Função para destacar a correspondência
                            suggestionItem.style.padding = "10px";  // Ajuste o padding
                            suggestionItem.style.cursor = "pointer"; // Alterar o cursor para indicar clicável
                            suggestionItem.style.borderBottom = "1px solid #ddd";  // Estilo para separar as sugestões

                            // Efeito hover: mudança de fundo, sem alterar a fonte
                            suggestionItem.onmouseover = function() {
                                this.style.backgroundColor = "#f1f1f1";  // Cor de fundo ao passar o mouse
                            };
                            suggestionItem.onmouseout = function() {
                                this.style.backgroundColor = "#fff";     // Cor de fundo original
                            };

                            suggestionItem.addEventListener('click', function() {
                                input.value = suggestion;
                                closeAllLists();
                            });
                            suggestionBox.appendChild(suggestionItem);
                        }
                    });
                });

                // Função para destacar as letras que correspondem à busca em negrito
                function highlightMatch(suggestion, value) {
                    const regex = new RegExp('(' + value + ')', 'gi');
                    return suggestion.replace(regex, "<strong>$1</strong>");
                }

                // Função para fechar as listas de sugestões
                function closeAllLists() {
                    const items = document.querySelectorAll('.autocomplete-items');
                    items.forEach(item => item.parentNode.removeChild(item));
                }

                // Fechar a lista de sugestões quando o usuário clicar fora
                document.addEventListener('click', function(e) {
                    if (e.target !== input) {
                        closeAllLists();
                    }
                });
            }

            return div;
        };

        divEstrada.appendChild(criarInput('input_road', 'Estrada:'));
        divEstrada.appendChild(criarInput('input_km', 'Kilometro:', 'number'));

        const btnRD = document.createElement('button');
        btnRD.innerHTML = 'Ir!';
        btnRD.id = 'btnRD';
        btnRD.onclick = function() {
            $.getJSON(array_data['RD_ESTRADAS'][0] + "?road=" + $("#input_road").val() + "&km=" + $("#input_km").val(), function(data) {
                if (data.x && data.y) {
                    wmeSDK.Map.setMapCenter({ lonLat: {lat: parseFloat(data.y), lon: parseFloat(data.x)}, zoomLevel:20 });
                }
            });
        };
        divEstrada.appendChild(btnRD);

        content.appendChild(divEstrada);

        result.tabPane.appendChild(content);
    });
}

async function dataCall() {
    var result;
    result = await receivedata();
    optionsUser();
    //result = await receiveRoads();
}

function SortByHumans(a, b){
    if (a[5] == b[5]) { return 0; }
    if (a[5] < b[5])
    {
        // if a should come after b, return 1
        return 1;
    }
    else
    {
        // if b should come after a, return -1
        return -1;
    }
}

function receiveIncendios() {
    return new Promise(resolve => {
        $.getJSON(array_data['RD_INCENDIOS'][0], function(data) {
            $(data.data).each(function(){
                var elem = [this.date, this.hour, this.localidade, this.aerial, this.terrain, this.man, this.lat, this.lng, this.status]
                array_incendios.push(elem);
            });
        });
        resolve('true');
    });
}

function get_incendios()
{
    $("ul#ul-INCENDIOS").remove();
    var ul_lista_incendios = document.createElement("ul");
    ul_lista_incendios.className = "feed-list";
    ul_lista_incendios.id = "ul-INCENDIOS";

    $.each(array_incendios, function(index , dados) {
        var a_linha_incendio = document.createElement("a");
        a_linha_incendio.style.cssText = 'text-decoration:none;';
        a_linha_incendio.onclick = function() {
            let newCenter = new OpenLayers.LonLat(dados[7], dados[6])
            .transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
            W.map.setCenter(newCenter,20);
        }
        var li_linha_incendio = document.createElement("li");
        li_linha_incendio.className = "feed-item feed-issue feed-issue-open feed-issue-ur severity-high";
        var div_lista_incendios_inner = document.createElement("div");
        div_lista_incendios_inner.className = "inner";
        var div_lista_incendios_content = document.createElement("div");
        div_lista_incendios_content.className = "content";
        var span_lista_incendios_content_title = document.createElement("span");
        span_lista_incendios_content_title.className = "type";
        span_lista_incendios_content_title.style.cssText = 'font-size: 12px;font-weight: bold;';
        span_lista_incendios_content_title.innerHTML = dados[2] + " (" + dados[8] + ")";

        var div_lista_incendios_timestamp = document.createElement("div");
        div_lista_incendios_timestamp.className = "timestamp";
        div_lista_incendios_timestamp.style.cssText = 'margin-bottom:5px;';
        var span_lista_incendios_content_timestamp = document.createElement("span");
        span_lista_incendios_content_timestamp.className = "type";
        span_lista_incendios_content_timestamp.style.cssText = 'margin-left:3px;font-size: 10px; color: #8c8c8c;';

        span_lista_incendios_content_timestamp.innerHTML = dados[0] + " " + dados[1];

        var div_lista_incendios_subtext = document.createElement("div");
        div_lista_incendios_subtext.className = "subtext";
        div_lista_incendios_subtext.style.cssText = 'font-size: 11px; color: #8c8c8c;';
        var span_lista_incendios_content_subtext = document.createElement("span");
        span_lista_incendios_content_subtext.className = "street";
        span_lista_incendios_content_subtext.innerHTML = "Operacionais: " + dados[5] + " / Meios:" + dados[4] + " / Aereos:" + dados[3];


        div_lista_incendios_content.appendChild(span_lista_incendios_content_title);
        div_lista_incendios_timestamp.appendChild(span_lista_incendios_content_timestamp);
        div_lista_incendios_inner.appendChild(div_lista_incendios_content);
        div_lista_incendios_inner.appendChild(div_lista_incendios_timestamp);
        div_lista_incendios_subtext.appendChild(span_lista_incendios_content_subtext);
        div_lista_incendios_inner.appendChild(div_lista_incendios_subtext);
        li_linha_incendio.appendChild(div_lista_incendios_inner);
        ul_lista_incendios.appendChild(li_linha_incendio);
        a_linha_incendio.appendChild(li_linha_incendio);
        ul_lista_incendios.appendChild(a_linha_incendio);
    });

    $("div#INFO-INCENDIOS").prepend(ul_lista_incendios);
}

function getPKEstradas() {
    var coord = ($('.wz-map-ol-control-span-mouse-position')[0].innerHTML).split(" ");
    $.getJSON("https://external.wazept.com/getRoad.php?lon=" + coord[1] + "&lat=" + coord[0], function(data) {
        alert("Distrito: " + data.distrito + "\nConcelho: " + data.concelho + "\nGestão: " + data.gestao + "\nCategoria: " + data.categoria + "\nEstrada: " + data.road + "\nPK: " + data.metrica);
    });
}

function getPKFerrovia() {
    var coord_fer = ($('.wz-map-ol-control-span-mouse-position')[0].innerHTML).split(" ");
    $.getJSON(array_data['RD_FERROVIA_NOME'][0] + "?lon=" + coord_fer[1] + "&lat=" + coord_fer[0], function(data) {
        if(data.cod_linha != ""){
            alert("Código: " + data.cod_linha + " | Linha: " + data.desig_linha + " | Métrica: " + data.metrica);
        }
    });
}

function verifyNull(variable)
{
    if(variable === null)
        return "";
    return variable["v"];
}