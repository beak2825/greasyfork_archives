// ==UserScript==
// @name         WAZEPT Landmark
// @version      2024.04.26
// @description  Facilitates the standardization of landmarks
// @author       J0N4S13 (jonathanserrario@gmail.com)
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/373077/WAZEPT%20Landmark.user.js
// @updateURL https://update.greasyfork.org/scripts/373077/WAZEPT%20Landmark.meta.js
// ==/UserScript==

(function() {
    var version = GM_info.script.version;
    var validselected = "";
    var validcodigo = "";
    var validindex = 0;
    var indexselected = "";
    var funcselected = "";
    var data_massive = null;
    var array_config_script = {};
    var array_config_country = {};
    var array_dados_func = {};
    var array_emojis = {};
    var array_emojis_title = {};
    var array_categorias_google = {};
    var all_percorrer = [];

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            dataCall();
        } else {
            document.addEventListener('wme-ready', dataCall, { once: true });
        }
    }

    async function dataCall() {
        var temExcel = false;
        var result = await getConfigsScript();
        result = await getConfigsCountry(array_config_script[W.model.getTopCountry().attributes.abbr]);
        for(var chave in array_config_country)
        {
            if(array_config_country[chave]["excel"] != "")
                temExcel = true;
        }
        if(temExcel)
        {
            for(var key in array_config_country)
            {
                if(array_config_country[key]["excel"] != "")
                {
                    temExcel = true;
                    result = await getDataFunc(array_config_country[key],array_config_country[key]["excel"]);
                }
            }
        }
        receiveCategorias();
        if (!$("#LANDMARKS").length) {
            optionsUser();
        }

        var carregarFeature = setInterval(function () {
            if(Object.keys(array_dados_func).length > 0 || !temExcel)
            {
                W.selectionManager.events.register('selectionchanged', null, selectedFeature);
                selectedFeature();
                clearInterval(carregarFeature);
            }
        }, 100);
    }

    function selectedFeature(){
        var typeData = null;
        setTimeout(() => {
            if(typeof W.selectionManager.getSelectedFeatures()[0] != 'undefined')
                typeData = W.selectionManager.getSelectedFeatures()[0]._wmeObject.type;
            if (typeData == "venue")
                myTimer();
        }, 100)
    }

    function getConfigsScript() {
        return new Promise(resolve => {

            fetch('https://docs.google.com/spreadsheets/d/1YIokASCZmcCheePyknPU39IlYz1gOfIuu1GwVzaFoic/gviz/tq?tqx=out:json&sheet=Config')
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                let first = false;
                $(json.table.rows).each(function(){
                    if(first == false)
                    {
                        first = true;
                        return;
                    }
                    array_config_script[verifyNull(this["c"][0])] = verifyNull(this["c"][1]);
                });
            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_config_script).length > 0 && W.model.getTopCountry() != null)
                {
                    clearInterval(timer);
                    resolve('true');
                }
            }

        });
    }

    function getConfigsCountry(link) {
        let timeout = 0;
        return new Promise(resolve => {

            fetch(link)
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                $(json.table.rows).each(function(){
                    if(verifyNull(this["c"][0]))
                    {
                        var elem = {funcionalidade: verifyNull(this["c"][1]), excel: verifyNull(this["c"][5]), percorrerlista: verifyNull(this["c"][6]), campolista: verifyNull(this["c"][7]), valorlista: verifyNull(this["c"][8]), validarCategoria: verifyNull(this["c"][9]), nomeCategoria: verifyNull(this["c"][10]), validarFinal: verifyNull(this["c"][11]), campoFinal: verifyNull(this["c"][12]), emojiNome: verifyNull(this["c"][3]), bloqueio: (verifyNull(this["c"][14]) - 1), categoria: verifyNull(this["c"][23]), tipoNotas: verifyNull(this["c"][15]), emoji: verifyNull(this["c"][2]), codigo: verifyNull(this["c"][16]), id: verifyNull(this["c"][17]), nome: verifyNull(this["c"][18]), secundario: verifyNull(this["c"][19]), rua: verifyNull(this["c"][20]), localidade: verifyNull(this["c"][21]), marca: verifyNull(this["c"][22]), notas: verifyNull(this["c"][24]), site: verifyNull(this["c"][25]), telefone: verifyNull(this["c"][26]), servicos: verifyNull(this["c"][27]), estacionamento: verifyNull(this["c"][28]), tomadas: verifyNull(this["c"][29]), segunda: verifyNull(this["c"][30]), terca: verifyNull(this["c"][31]), quarta: verifyNull(this["c"][32]), quinta: verifyNull(this["c"][33]), sexta: verifyNull(this["c"][34]), sabado: verifyNull(this["c"][35]), domingo: verifyNull(this["c"][36]), latitude: verifyNull(this["c"][37]), longitude: verifyNull(this["c"][38]), campo1: verifyNull(this["c"][39]), verificavalidade: verifyNull(this["c"][13])};
                        array_config_country[ verifyNull(this["c"][1]) ] = elem;
                        var emoji = verifyNull(this["c"][2]);
                        var descricao = verifyNull(this["c"][4]);
                        array_emojis[emoji] = verifyNull(this["c"][1]);
                        array_emojis_title[emoji] = descricao;
                    }
                });
            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_config_country).length > 0 || timeout >= 50)
                {
                    clearInterval(timer);
                    resolve('true');
                }
                timeout = timeout + 1;
            }
        });
    }

    function getDataFunc(func, link) {
        return new Promise(resolve => {

            fetch(link)
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))
                var aux = {};

                $(json.table.rows).each(function(){
                    let horarios = [func.domingo!=""?verifyNull(this["c"][func.domingo]):"",func.segunda!=""?verifyNull(this["c"][func.segunda]):"",func.terca!=""?verifyNull(this["c"][func.terca]):"",func.quarta!=""?verifyNull(this["c"][func.quarta]):"",func.quinta!=""?verifyNull(this["c"][func.quinta]):"",func.sexta!=""?verifyNull(this["c"][func.sexta]):"",func.sabado!=""?verifyNull(this["c"][func.sabado]):""];
                    var elem = {id:func.id!=""?verifyNull(this["c"][func.id]):"", nome:func.nome!=""?verifyNull(this["c"][func.nome]):"",secundario:func.secundario!=""?verifyNull(this["c"][func.secundario]):"", rua:func.rua!=""?verifyNull(this["c"][func.rua]):"", localidade:func.localidade!=""?verifyNull(this["c"][func.localidade]):"", marca:func.marca!=""?verifyNull(this["c"][func.marca]):"", notas:func.notas!=""?verifyNull(this["c"][func.notas]):"", site:func.site!=""?verifyNull(this["c"][func.site]):"", telefone:func.telefone!=""?verifyNull(this["c"][func.telefone]):"", servicos:func.servicos!=""?(isNumeric(func.servicos)?verifyNull(this["c"][func.servicos]):func.servicos):"", tomadas:func.tomadas!=""?verifyNull(this["c"][func.tomadas]):"", categoria:func.categoria!=""?(isNumeric(func.categoria)?verifyNull(this["c"][func.categoria]):func.categoria):"",horario:horarios, latitude:func.latitude!=""?verifyNull(this["c"][func.latitude]):"", longitude:func.longitude!=""?verifyNull(this["c"][func.longitude]):""};
                    if(verifyNull(this["c"][func.codigo]) != "")
                        aux[verifyNull(this["c"][func.codigo])] = elem;
                });
                array_dados_func[func.funcionalidade] = aux;
            })
            resolve('true');
        });
    }

    function receiveCategorias() {
        return new Promise(resolve => {

            fetch('https://docs.google.com/spreadsheets/d/1YIokASCZmcCheePyknPU39IlYz1gOfIuu1GwVzaFoic/gviz/tq?tqx=out:json&sheet=Categorias')
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                let first = false;
                $(json.table.rows).each(function(){
                    if(first == false)
                    {
                        first = true;
                        return;
                    }
                    array_categorias_google[verifyNull(this["c"][0])] = verifyNull(this["c"][1]);
                });
            })
            resolve('true');
        });
    }

    function optionsUser() {

        var $settings = $('<li><a href="#sidepanel-LANDMARKS" data-toggle="tab" aria-expanded="true">LANDMARKS</a></li>');
        $("#user-tabs ul").append($settings);

        var div_sidepnale = document.createElement("div");
        div_sidepnale.id = "sidepanel-LANDMARKS";
        div_sidepnale.className = "tab-pane";

        var atualizar = document.createElement("button");
        atualizar.innerHTML = 'Atualizar Dados';
        atualizar.id = 'btnAtualizar';
        atualizar.style.cssText = 'height: 25px;font-size: 11px;margin-bottom: 20px;width: 100%;background-color: greenyellow;font-weight: bold;';
        atualizar.onclick = function() {
            dataCall();
        };

        div_sidepnale.appendChild(atualizar);

        var label_por_validar = document.createElement("label");
        label_por_validar.innerHTML = "Landmarks por validar";
        label_por_validar.style.cssText = 'font-size:13px;color:blue;';
        div_sidepnale.appendChild(label_por_validar);

        var nav = document.createElement("ul");
        nav.className = "nav nav-tabs";
        nav.style.cssText = 'margin-bottom:15px;';

        $.each(array_emojis, function(emoji , func) {

            if(array_config_country[func]["percorrerlista"])
            {
                all_percorrer.push(func);
                var percorrer_emoji = document.createElement("li");
                percorrer_emoji.id = func;
                percorrer_emoji.innerHTML = '<a href="" data-toggle="tab" aria-expanded="true">' + emoji + '</a>';
                percorrer_emoji.onclick = function() {
                    $("#LANDMARKS").show();
                    $('label[id="DATA_ID"]').text("");
                    $('label[id="DATA_NAME"]').text("");
                    $('label[id="DATA_LINE"]').text("");
                    validcodigo = "";
                    validindex = 0;
                    validselected = func;
                    open_tab(func);
                };

                nav.appendChild(percorrer_emoji);
            }
        });

        div_sidepnale.appendChild(nav);

        var div_landmarks = document.createElement("div");
        div_landmarks.id = "LANDMARKS";
        div_landmarks.style.display = "block";

        var div_info = document.createElement("div");
        div_info.style.display = "block";

        var div_line = document.createElement("div");
        div_line.style.display = "block";

        var label_line = document.createElement("label");
        label_line.innerHTML = "LINHA:";
        label_line.style.cssText = 'font-size:15px;color:blue;';
        div_line.append(label_line);

        var data_line = document.createElement("label");
        data_line.id = 'DATA_LINE';
        data_line.innerHTML = "";
        data_line.style.cssText = 'margin-left:5px;font-size:12px;color:black;';
        div_line.append(data_line);

        var div_id = document.createElement("div");
        div_id.style.display = "block";

        var label_id = document.createElement("label");
        label_id.innerHTML = "CÓDIGO:";
        label_id.style.cssText = 'font-size:15px;color:blue;';
        div_id.append(label_id);

        var data_id = document.createElement("label");
        data_id.id = 'DATA_ID';
        data_id.innerHTML = "";
        data_id.style.cssText = 'margin-left:5px;font-size:12px;color:black;';
        div_id.append(data_id);

        var div_name = document.createElement("div");
        div_name.style.display = "block";

        var label_name = document.createElement("label");
        label_name.innerHTML = "NOME:";
        label_name.style.cssText = 'font-size:15px;color:blue;';
        div_name.append(label_name);

        var data_name = document.createElement("label");
        data_name.id = 'DATA_NAME';
        data_name.innerHTML = "";
        data_name.style.cssText = 'margin-left:5px;font-size:12px;color:black;';
        div_name.append(data_name);

        div_info.append(div_line);
        div_info.append(div_id);
        div_info.append(div_name);

        div_landmarks.prepend(div_info);

        var adicionar = document.createElement("button");
        adicionar.innerHTML = 'Adicionar';
        adicionar.id = 'btnAdicionar';
        adicionar.style.cssText = 'height: 25px;font-size:12px';
        adicionar.onclick = function() {
            var aux = null;
            $.each(array_dados_func[validselected], function(codigo , dados) {

                if(codigo == validcodigo)
                {
                    aux = dados;
                    return true;
                }
            });
            if(aux != null)
                addNewLandmark(aux);
        };

        var seguinte = document.createElement("button");
        seguinte.innerHTML = 'Seguinte';
        seguinte.id = 'btnSeguinte';
        seguinte.style.cssText = 'height:25px;font-size:12px;float:right;';
        seguinte.onclick = function() {
            let count = 1;
            let existe = 0;
            $.each(array_dados_func[validselected], function(codigo , dados) {
                if(dados[array_config_country[validselected]["campoFinal"]] == "0" && count > validindex)
                {
                    let newCenter = new OpenLayers.LonLat(dados.longitude, dados.latitude)
                    .transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
                    W.map.setCenter(newCenter,20);
                    validindex = count;
                    data_massive = dados;
                    $('label[id="DATA_ID"]').text(codigo);
                    $('label[id="DATA_NAME"]').text(dados.nome);
                    $('label[id="DATA_LINE"]').text(count + 1);
                    validcodigo = codigo;
                    existe = 1;
                    return false;
                }
                count++;
            });
            if(existe == 0)
                alert("Já não existem landmarks para validar nesta categoria.");
        };

        div_landmarks.append(adicionar);
        div_landmarks.append(seguinte);

        div_sidepnale.appendChild(div_landmarks);

        $("div.tab-content")[0].prepend(div_sidepnale);

        $("#LANDMARKS").hide();
    }

    function getPermalink() {
        let PL = "";
        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

        PL += window.location.origin;
        PL += window.location.pathname;
        PL += '?env=';
        PL += W.app.getAppRegionCode();
        PL += '&lat=';
        PL += center.lat;
        PL += '&lon=';
        PL += center.lon;
        PL += '&zoom=';
        PL += W.map.getZoom();
        PL += '&venues=';
        PL += W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["id"];
        return PL;
    }

    function open_tab(tab)
    {
        $.each(all_percorrer, function(index , func) {
            $('div[id="' + func + '"]').removeClass("active");
        });
        $('div[id="' + tab + '"]').addClass("active");
        $('div[id="LANDMARKS"]').show();
    }

    var error = {'nome' : 0, 'secundario' : 0, 'marca' : 0, 'categoria' : 0, 'bloqueio' : 0, 'notas' : 0, 'site' : 0, 'telefone' : 0, 'servicos' : 0, 'tomadas' : 0, 'horario' : 0, 'dados' : []};

    function myTimer() {
        error = {'nome' : 0, 'secundario' : 0, 'marca' : 0, 'categoria' : 0, 'bloqueio' : 0, 'notas' : 0, 'site' : 0, 'telefone' : 0, 'servicos' : 0, 'tomadas' : 0, 'horario' : 0, 'dados' : []};

        if($('label[id="DATA_LINE"]').text() != "")
            $("#divassociar").show();

        var landmark = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;

        var final = [];
        var funcionalidade = "";

        $.each(array_config_country, function(func , data) {
            let auxCat = [];

            if(data.validarCategoria == "Sim")
            {
                if(landmark["categories"].includes(data.nomeCategoria))
                {
                    if(data.validarFinal == "ID")
                    {
                        $.each(array_dados_func[func], function(codigo , dados) {
                            if(landmark["id"] == dados[data.campoFinal])
                            {
                                final.push(dados);
                                funcionalidade = func;
                            }
                        });
                    }
                    else if(data.validarFinal == "Nome")
                    {
                        $.each(array_dados_func[func], function(codigo , dados) {
                            if(landmark["name"].indexOf(dados[data.campoFinal]) > 0)
                            {
                                final.push(dados);
                                funcionalidade = func;
                            }
                        });
                    }
                }
            }
            else if(data.validarFinal == "Nome")
            {
                $.each(array_dados_func[func], function(codigo , dados) {
                    if(landmark["name"].indexOf(dados[data.campoFinal]) > 0)
                    {
                        final.push(dados);
                        funcionalidade = func;
                    }
                });
            }
            else if(data.validarFinal == "ID")
            {
                $.each(array_dados_func[func], function(codigo , dados) {
                    if(landmark["id"] == dados[data.campoFinal])
                    {
                        final.push(dados);
                        funcionalidade = func;
                    }
                });
            }

        });

        if(final.length == 1)
        {
            let invalido = 0;
            if(array_config_country[funcionalidade]["verificavalidade"] != "")
                if(final[0][array_config_country[funcionalidade]["verificavalidade"]] != "")
                    $("#divinvalido").hide();
                else
                {
                    $("#divinvalido").show();
                    invalido = 1;
                }
            if(array_config_country[funcionalidade]["verificavalidade"] == "")
                $("#divinvalido").hide();

            if(invalido == 0)
            {
                var aux;
                if(array_config_country[funcionalidade]["nome"] != "")
                {
                    if(array_config_country[funcionalidade]["emojiNome"] != "")
                        aux = array_config_country[funcionalidade]["emojiNome"] + " " + final[0]["nome"];
                    else
                        aux = final[0]["nome"];
                    if(aux != landmark["name"])
                        error["nome"] = 1;
                }
                if(array_config_country[funcionalidade]["secundario"] != "")
                {
                    aux = final[0]["secundario"].split(";");
                    if(aux[0] != "")
                    {
                        $.each(aux, function(index , nome) {
                            if(!landmark["aliases"].includes(nome))
                                error["secundario"] = 1;
                        });
                    }
                }
                if(array_config_country[funcionalidade]["marca"] != "")
                {
                    aux = final[0]["marca"];
                    let marcasPostos = W.model.categoryBrands.GAS_STATION;
                    if(marcasPostos.includes(aux))
                    {
                        if(aux != landmark["brand"])
                            error["marca"] = 1;
                    }
                    else
                    {
                        if(landmark["brand"] != null && landmark["brand"] != "")
                            error["marca"] = 1;
                    }
                }
                if(array_config_country[funcionalidade]["categoria"] != "")
                {
                    aux = final[0]["categoria"].split(";");
                    $.each(aux, function(index , category) {
                        if(!landmark["categories"].includes(category))
                            error["categoria"] = 1;
                    });
                }
                if(array_config_country[funcionalidade]["notas"] != "")
                {
                    aux = final[0]["notas"];
                    if(aux != "")
                    {
                        if(array_config_country[funcionalidade]["tipoNotas"] == "ALL")
                        {
                            if(landmark["description"] != aux)
                                error["notas"] = 1;
                        }
                        else if(landmark["description"].indexOf(aux) == -1)
                            error["notas"] = 1;
                    }
                }
                if(array_config_country[funcionalidade]["bloqueio"] != "")
                {
                    aux = array_config_country[funcionalidade]["bloqueio"];
                    if(landmark["lockRank"] < aux && landmark["lockRank"] < W.loginManager.getUserRank())
                        error["bloqueio"] = 1;
                }
                if(array_config_country[funcionalidade]["site"] != "")
                {
                    aux = final[0]["site"];
                    if(aux != "" && aux != landmark["url"])
                        error["site"] = 1;
                    else
                        if(aux == "" && landmark["url"] != "" && landmark["url"] != null)
                            error["site"] = 1;
                }
                if(array_config_country[funcionalidade]["telefone"] != "")
                {
                    aux = final[0]["telefone"];
                    if(aux != "" && aux != landmark["phone"])
                        error["telefone"] = 1;
                    else
                        if(aux == "" && landmark["phone"] != "" && landmark["phone"] != null)
                            error["telefone"] = 1;
                }
                if(array_config_country[funcionalidade]["servicos"] != "")
                {
                    aux = final[0]["servicos"].split(";");
                    if(aux[0] != "")
                    {
                        $.each(aux, function(index , service) {
                            if(!landmark["services"].includes(service))
                                error["servicos"] = 1;
                        });
                    }
                }
                if(array_config_country[funcionalidade]["tomadas"] != "" && final[0]["categoria"].indexOf("CHARGING_STATION") != -1)
                {
                    let portsSplit = final[0]["tomadas"].split(";");
                    $.each(portsSplit, function(index , port) {
                        let aux = port.split(":");
                        if(aux[1] > 0)
                        {
                            if(aux[0] in landmark["evChargingPorts"])
                            {
                                if(landmark["evChargingPorts"][aux[0]] != aux[1])
                                    error["tomadas"] = 1;
                            }
                            else
                                error["tomadas"] = 1;
                        }
                    });
                }
                error["funcionalidade"] = funcionalidade;
                error["dados"] = final[0];
            }

            if(error["nome"] == 1 || error["secundario"] == 1 || error["marca"] == 1 || error["categoria"] == 1 || error["bloqueio"] == 1 || error["notas"] == 1 || error["site"] == 1 || error["telefone"] == 1 || error["servicos"] == 1 || error["tomadas"] == 1 || error["horario"] == 1)
                var showUniformizar = setInterval(function () {$("#divuniformizar").show(); clearInterval(showUniformizar);}, 100);
            else
                $("#divuniformizar").hide();
        }

        if (!$("#landmarkemoji").length) {
            var landmarkemoji = document.createElement("div");
            landmarkemoji.id = 'landmarkemoji';
            landmarkemoji.style.cssText = 'display: inline-block;';

            $.each(array_emojis, function(emoji , func) {

                var addsign = document.createElement("div");
                addsign.id = 'sign_' + emoji;

                addsign.style.cssText = 'cursor:pointer;float:left;width:34px;height:34px;';
                addsign.onclick =  function() {
                    indexselected = emoji;
                    funcselected = func;

                    if(array_config_country[funcselected]["excel"] == "")
                    {
                        var campo1;
                        if(array_config_country[funcselected]["campo1"] != "")
                            campo1 = prompt(array_config_country[funcselected]["campo1"]);
                        else
                            campo1 = "";

                        if(campo1 != null)
                        {

                            if(array_config_country[funcselected]["categoria"] != "")
                                definecategories(array_config_country[funcselected]["categoria"].split(";"));

                            if(array_config_country[funcselected]["emojiNome"] != "" || array_config_country[funcselected]["nome"] != "")
                            {
                                var emoji = array_config_country[funcselected]["emojiNome"];
                                var nome = array_config_country[funcselected]["nome"];
                                if(array_config_country[funcselected]["emojiNome"].indexOf("{1}") != -1)
                                    emoji = array_config_country[funcselected]["emojiNome"].replace("{1}", campo1)
                                if(array_config_country[funcselected]["nome"].indexOf("{1}") != -1)
                                    nome = array_config_country[funcselected]["nome"].replace("{1}", campo1)
                                if(emoji != "" && nome != "NULL")
                                    defineName(emoji + " " + nome);
                                else
                                    if(emoji != "" && nome == "NULL")
                                        defineName(emoji);
                                else
                                    defineName(nome);
                            }

                            if(array_config_country[funcselected]["secundario"] != "")
                            {
                                if(array_config_country[funcselected]["secundario"] == "")
                                    definealiases(new Array());
                                else
                                    definealiases(array_config_country[funcselected]["secundario"].split(";"));
                            }

                            if(array_config_country[funcselected]["notas"] != "")
                            {
                                var notas = array_config_country[funcselected]["notas"];
                                if(array_config_country[funcselected]["notas"].indexOf("{1}") != -1)
                                    notas = array_config_country[funcselected]["notas"].replace("{1}", campo1)
                                defineDescription(array_config_country[funcselected]["tipoNotas"], notas);
                            }

                            if(array_config_country[funcselected]["servicos"] != "")
                                defineServices(false, array_config_country[funcselected]["servicos"].split(";"));

                            if(array_config_country[funcselected]["bloqueio"] != "")
                                defineLockRank(array_config_country[funcselected]["bloqueio"]);

                            if(array_config_country[funcselected]["rua"] == "NONE" || array_config_country[funcselected]["localidade"] == "NONE")
                                defineStreetLandmark("", "", "");

                            if(array_config_country[funcselected]["estacionamento"] != "")
                                defineAttributesParking(array_config_country[funcselected]["estacionamento"]);
                        }

                    }
                    else
                    {

                        var code = prompt("Código");

                        var aux = [];

                        $.each(array_dados_func[funcselected], function(codigo , dados) {

                            if(codigo == code)
                            {
                                aux = dados;
                                return true;
                            }
                        });

                        let passa = 0;
                        if(array_config_country[funcselected]["verificavalidade"] != "")
                            if(aux[array_config_country[funcselected]["verificavalidade"]] != "")
                                passa = 1;
                        if(array_config_country[funcselected]["verificavalidade"] == "")
                            passa = 1;
                        if(passa == 1)
                            addDataLandmark(aux);
                    };

                }

                var title = "";
                $.each(array_emojis_title, function(emoji_title , tooltip) {
                    if(emoji == emoji_title)
                        title = tooltip;
                });

                var emojivalue = document.createElement("div");
                emojivalue.id = 'emoji_' + emoji;
                emojivalue.style.cssText = 'text-align:center;font-size:14px;visibility:visible;';
                emojivalue.innerHTML = emoji;
                emojivalue.title = title;
                addsign.appendChild(emojivalue);
                landmarkemoji.appendChild(addsign);
            });

            $("div #venue-edit-general").prepend(landmarkemoji);
        }

        if (!$("#divuniformizar").length) {
            var labeluniform = document.createElement("label");
            labeluniform.id = 'labeluniform';
            labeluniform.innerHTML = 'Dados da landmark errados';
            labeluniform.style.cssText = 'font-size:11px;color:red;margin-bottom: 0px;';
            var btnuniformizar = document.createElement("button");
            btnuniformizar.innerHTML = 'Corrigir';
            btnuniformizar.id = 'btnuniformizar';
            btnuniformizar.style.cssText = 'float:right;font-size:11px;height:21px;';
            btnuniformizar.onclick = function() {
                var funcionalidade = error["funcionalidade"];
                if(error["nome"] == 1)
                {
                    if(array_config_country[funcionalidade]["emojiNome"] != "")
                        defineName(array_config_country[funcionalidade]["emojiNome"] + " " + error.dados.nome);
                    else
                        defineName(error.dados.nome);
                }
                if(error["secundario"] == 1)
                {
                    if(array_config_country[funcionalidade]["secundario"] != "")
                    {
                        if(error.dados.secundario == "")
                            definealiases(new Array());
                        else
                            definealiases(error.dados.secundario.split(";"));
                    }
                }
                if(error["categoria"] == 1)
                {
                    definecategories(error.dados.categoria.split(";"));
                }
                if(error["bloqueio"] == 1)
                {
                    defineLockRank(array_config_country[funcionalidade]["bloqueio"]);
                }
                if(error["marca"] == 1)
                {
                    defineBrand(error.dados.marca);
                }
                if(error["notas"] == 1)
                {
                    defineDescription(array_config_country[error.funcionalidade]["tipoNotas"], error.dados.notas);
                }
                if(error["telefone"] == 1)
                {
                    definePhone(error.dados.telefone);
                }
                if(error["site"] == 1)
                {
                    defineUrl(error.dados.site);
                }
                if(error["servicos"] == 1 || error["categoria"] == 1)
                {
                    defineServices(error["categoria"]==1?true:false, error.dados.servicos.split(";"));
                }
                if(error["tomadas"] == 1)
                {
                    definePortsEV(error.dados.tomadas);
                }
                if(error["horario"] == 1)
                {
                    add_horarios(error.dados.horario);
                }
                $("#divuniformizar").hide();
            };
            var divuniformizar = document.createElement("div");
            divuniformizar.id = 'divuniformizar';
            divuniformizar.style.cssText = 'border: groove;padding: 5px;margin-bottom: 10px;';
            divuniformizar.appendChild(labeluniform);
            divuniformizar.appendChild(btnuniformizar);

            $("div #venue-edit-general").prepend(divuniformizar);
            $("#divuniformizar").hide();
        }

        if (!$("#divinvalido").length) {
            var labelinvalido = document.createElement("label");
            labelinvalido.id = 'labelinvalido';
            labelinvalido.innerHTML = 'Este landmark não está validado no excel.';
            labelinvalido.style.cssText = 'width:85%;font-size:11px;color:red;';
            var divinvalido = document.createElement("div");
            divinvalido.id = 'divinvalido';
            divinvalido.style.cssText = 'padding-bottom: 10px;';
            divinvalido.appendChild(labelinvalido);

            $("div #venue-edit-general").prepend(divinvalido);
            $("#divinvalido").hide();
        }

        getNearGooglePlace();

        if(W.selectionManager.getSelectedFeatures().length == 1 && W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categories.includes("CHARGING_STATION"))
        {
            getPCEChargingPorts();
            if(W.model.topState.attributes.countryID == 181)
            {
                getNearPCEMIIO();
                getNearPCEMOBIE();
                getNearPCETesla();
            }
        }
    }
    function getNearGooglePlace () {
        if (!$("#nearbyGooglePlace").length && W.selectionManager.getSelectedFeatures().length > 0) {

            var nearbyGooglePlace = document.createElement("div");
            nearbyGooglePlace.id = 'nearbyGooglePlace';
            nearbyGooglePlace.style.cssText = 'margin-top:5px;';
            $("div .external-providers-control").after(nearbyGooglePlace);

            var click = [];
            var c, r, t;
            var cont = 0;
            var lat, lon;
            var request;
            t = document.createElement('table');
            t.style.cssText = 'font-size: 12px; border: 1px solid black;width:100%;';
            var header = t.createTHead();
            header.style.cssText = 'border: 1px solid black; background: #D3D3D3;';
            var row = header.insertRow(0);
            row.innerHTML = "<b>Name</b>";
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Dist(m)</b>";
            var cell1 = row.insertCell(1);
            var body = t.createTBody();

            var type = "all";

            if(typeof array_categorias_google[W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categories[0]] !== 'undefined')
                type= array_categorias_google[W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categories[0]];

            var coord = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.geometry.getCentroid();
            var geoXY;
            geoXY=new OL.LonLat(coord.x, coord.y).transform('EPSG:3857', 'EPSG:4326').transform(W.map.projection, W.map.displayProjection);

            var centroid = new google.maps.LatLng(geoXY.lat, geoXY.lon);
            request = {
                location: centroid,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: type
            };

            var service = new google.maps.places.PlacesService(new google.maps.Map(document.createElement('div')));
            service.nearbySearch(request, callback);
        }

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    if(typeof results[i]["place_id"] == "undefined" || cont >= 5)
                        return true;
                    else
                    {
                        var centroidGoogle = new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng());
                        r = body.insertRow(cont);
                        c = r.insertCell(0);
                        c.innerHTML = results[i]['name'];
                        c = r.insertCell(1);
                        c.innerHTML = "<b><u>" + Math.round(google.maps.geometry.spherical.computeDistanceBetween(centroid, centroidGoogle)) + "</u></b>";
                        c.style.cssText = 'text-align: center;';
                        c = r.insertCell(2);
                        var b = document.createElement("button");
                        b.innerHTML = "+";
                        b.style.cssText = 'width: 23px;height: 18px;font-size: 10px;display: flex;justify-content: center;align-items: center;';
                        b.id = 'putplace' + cont;
                        b.onclick = function() {
                            let id = this.id.replace("putplace", "");
                            addExternal(click[id]);
                        }
                        c.appendChild(b);
                        click.push([results[i]['name'], results[i]['vicinity']]);
                        cont = cont + 1;
                    }
                    $("#nearbyGooglePlace").append(t);
                }
            }
        }
    }
    function getNearPCEMIIO () {
        if (!$("#nearPCEMIIO").length && W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categoryAttributes.CHARGING_STATION.network != "Tesla") {
            var nearPCEMIIO = document.createElement("div");
            nearPCEMIIO.id = 'nearPCEMIIO';
            nearPCEMIIO.style.cssText = 'margin-top:5px;';
            $("div .aliases").before(nearPCEMIIO);
            var miio = [];
            var c, r, t;
            var cont = 0;
            var lat, lon;
            var request;
            t = document.createElement('table');
            t.style.cssText = 'font-size: 12px; border: 1px solid black;width:100%;';
            var header = t.createTHead();
            header.style.cssText = 'border: 1px solid black; background: #D3D3D3;';
            var row = header.insertRow(0);
            row.innerHTML = "<b>Posto MIIO</b>";
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Dist(m)</b>";
            var cell1 = row.insertCell(1);
            var body = t.createTBody();
            var coord = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.geometry.getCentroid();
            var geoXY;
            geoXY=new OL.LonLat(coord.x, coord.y).transform('EPSG:3857', 'EPSG:4326').transform(W.map.projection, W.map.displayProjection);
            var centroid = new google.maps.LatLng(geoXY.lat, geoXY.lon);
            $.getJSON("https://external.wazept.com/excel/getNearMIIO.php?lat=" + geoXY.lat + "&lon=" + geoXY.lon, function(data) {
                $(data).each(function(){
                    r = body.insertRow(cont);
                    c = r.insertCell(0);
                    c.innerHTML = '<a href="' + this.link + '" target="_blank">' + this.tipo + ' ' + this.posto + '</a>';
                    c = r.insertCell(1);
                    c.innerHTML = "<b><u>" + this.dist + "</u></b>";
                    c.style.cssText = 'text-align: center;';
                    c = r.insertCell(2);
                    var b = document.createElement("button");
                    b.innerHTML = "+";
                    b.style.cssText = 'width: 23px;height: 18px;font-size: 10px;display: flex;justify-content: center;align-items: center;';
                    b.id = 'miio' + cont;
                    b.onclick = function() {
                        let id = this.id.replace("miio", "");
                        definealiases([W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.name]);
                        defineName(miio[id]);
                    }
                    c.appendChild(b);
                    miio.push(this.tipo + " " + this.posto);
                    cont = cont + 1;
                    $("#nearPCEMIIO").append(t);
                });
            });
        }
    }
    function getNearPCEMOBIE () {
        if (!$("#nearPCEMOBIE").length && W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categoryAttributes.CHARGING_STATION.network != "Tesla") {
            var nearPCEMOBIE = document.createElement("div");
            nearPCEMOBIE.id = 'nearPCEMOBIE';
            nearPCEMOBIE.style.cssText = 'margin-top:5px;';
            $("div .aliases").before(nearPCEMOBIE);
            var mobie = [];
            var c, r, t;
            var cont = 0;
            var lat, lon;
            var request;
            t = document.createElement('table');
            t.style.cssText = 'font-size: 12px; border: 1px solid black;width:100%;';
            var header = t.createTHead();
            header.style.cssText = 'border: 1px solid black; background: #D3D3D3;';
            var row = header.insertRow(0);
            row.innerHTML = "<b>Posto MOBIE</b>";
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Dist(m)</b>";
            var cell1 = row.insertCell(1);
            var body = t.createTBody();
            var coord = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.geometry.getCentroid();
            var geoXY;
            geoXY=new OL.LonLat(coord.x, coord.y).transform('EPSG:3857', 'EPSG:4326').transform(W.map.projection, W.map.displayProjection);
            var centroid = new google.maps.LatLng(geoXY.lat, geoXY.lon);
            $.getJSON("https://external.wazept.com/excel/getNearMOBIE.php?lat=" + geoXY.lat + "&lon=" + geoXY.lon, function(data) {
                $(data).each(function(){
                    r = body.insertRow(cont);
                    c = r.insertCell(0);
                    c.innerHTML = this.tipo + ' ' + this.posto;
                    c = r.insertCell(1);
                    c.innerHTML = "<b><u>" + this.dist + "</u></b>";
                    c.style.cssText = 'text-align: center;';
                    c = r.insertCell(2);
                    var b = document.createElement("button");
                    b.innerHTML = "+";
                    b.style.cssText = 'width: 23px;height: 18px;font-size: 10px;display: flex;justify-content: center;align-items: center;';
                    b.id = 'mobie' + cont;
                    b.onclick = function() {
                        let id = this.id.replace("mobie", "");
                        definealiases([W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.name]);
                        defineName(mobie[id]);
                    }
                    c.appendChild(b);
                    mobie.push(this.tipo + " " + this.posto);
                    cont = cont + 1;
                    $("#nearPCEMOBIE").append(t);
                });
            });
        }
    }
    function getNearPCETesla () {
        if (!$("#nearPCETesla").length && W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categoryAttributes.CHARGING_STATION.network == "Tesla") {
            var nearPCETesla = document.createElement("div");
            nearPCETesla.id = 'nearPCETesla';
            nearPCETesla.style.cssText = 'margin-top:5px;';
            $("div .aliases").before(nearPCETesla);
            var tesla = [];
            var c, r, t;
            var cont = 0;
            var lat, lon;
            var request;
            t = document.createElement('table');
            t.style.cssText = 'font-size: 12px; border: 1px solid black;width:100%;';
            var header = t.createTHead();
            header.style.cssText = 'border: 1px solid black; background: #D3D3D3;';
            var row = header.insertRow(0);
            row.innerHTML = "<b>Posto Tesla</b>";
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Dist(m)</b>";
            var cell1 = row.insertCell(1);
            var body = t.createTBody();
            var coord = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.geometry.getCentroid();
            var geoXY;
            geoXY=new OL.LonLat(coord.x, coord.y).transform('EPSG:3857', 'EPSG:4326').transform(W.map.projection, W.map.displayProjection);
            var centroid = new google.maps.LatLng(geoXY.lat, geoXY.lon);
            $.getJSON("https://external.wazept.com/excel/getNearTesla.php?lat=" + geoXY.lat + "&lon=" + geoXY.lon, function(data) {
                $(data).each(function(){
                    r = body.insertRow(cont);
                    c = r.insertCell(0);
                    c.innerHTML = '<a href="' + this.link + '" target="_blank">' + this.posto + '</a>';
                    c = r.insertCell(1);
                    c.innerHTML = "<b><u>" + this.dist + "</u></b>";
                    c.style.cssText = 'text-align: center;';
                    c = r.insertCell(2);
                    var b = document.createElement("button");
                    b.innerHTML = "+";
                    b.style.cssText = 'width: 23px;height: 18px;font-size: 10px;display: flex;justify-content: center;align-items: center;';
                    b.id = 'tesla' + cont;
                    b.onclick = function() {
                        let id = this.id.replace("tesla", "");
                        definealiases([W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.name]);
                        defineName(tesla[id]);
                    }
                    c.appendChild(b);
                    tesla.push(this.tipo + " " + this.nome);
                    cont = cont + 1;
                    $("#nearPCETesla").append(t);
                });
            });
        }
    }
    function getPCEChargingPorts () {
        if(!$("#suggestPCE").length)
        {
            var suggestPCE = document.createElement("div");
            suggestPCE.id = 'suggestPCE';
            suggestPCE.style.cssText = 'margin-top:5px;';
            $("div .aliases").before(suggestPCE);
            let postos = [];
            $.each(W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.categoryAttributes.CHARGING_STATION.chargingPorts, function(index, tomada) {
                let splited = null;
                if(tomada.portId.includes("-"))
                    splited = tomada.portId.split("-");
                else if(tomada.portId.includes("_"))
                    splited = tomada.portId.split("_");
                else if(tomada.portId.includes("*"))
                    splited = tomada.portId.split("*");
                if(splited != null)
                {
                    splited.pop();
                    if(!postos.includes(splited.join("-")))
                        postos.push(splited.join("-"));
                }
                else
                    postos.push(tomada.portId);
            });
            var span = document.createElement("span");
            span.innerHTML = "Nome(s) associados às tomadas:";
            postos.sort();
            $.each(postos, function(index, posto) {
                span.innerHTML = span.innerHTML + "<br>-<b> " + posto + "</b>";
            });
            $("#suggestPCE").append(span);
        }
    }

    function addNewLandmark (aux) {
        let AddLandmark= require("Waze/Action/AddLandmark");
        var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");

        var geometry = new OpenLayers.Geometry.Point();

        let newLocal = new OpenLayers.LonLat(aux.longitude, aux.latitude)
        .transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        geometry.y = newLocal.lat;
        geometry.x = newLocal.lon;

        var poi = new wazefeatureVectorLandmark({geoJSONGeometry:W.userscripts.toGeoJSONGeometry(geometry)});
        poi.attributes.categories = aux.categoria.split(";");
        if(aux.nome != "")
            if(array_config_country[validselected]["emojiNome"] != "")
                poi.attributes.name = array_config_country[validselected]["emojiNome"] + " " + aux.nome;
            else
                poi.attributes.name = aux.nome;

        if(array_config_country[validselected]["secundario"] != "")
        {
            if(aux.secundario != "")
                poi.attributes.aliases = aux.secundario.split(";");
        }

        if(array_config_country[validselected]["bloqueio"] != "")
        {
            var bloquear;
            if(W.loginManager.user.attributes.rank >= array_config_country[validselected]["bloqueio"])
                bloquear = array_config_country[validselected]["bloqueio"];
            else
                bloquear = W.loginManager.user.attributes.rank;
            poi.attributes.lockRank = bloquear;
        }

        if(aux.marca != "")
            poi.attributes.brand = aux.marca;

        if(aux.notas != "")
            poi.attributes.description = aux.notas;

        if(aux.servicos != "")
            poi.attributes.services = aux.servicos.split(";");

        if(aux.site != "")
            poi.attributes.url = aux.site;

        if(aux.telefone != "")
            poi.attributes.phone = aux.telefone;

        if(aux.tomadas != "" && aux.categoria.indexOf("CHARGING_STATION") != -1)
        {
            let finalPorts = {};
            let portsSplit = aux.tomadas.split(";");
            $.each(portsSplit, function(index , port) {
                let aux = port.split(":");
                if(aux[1] > 0)
                    finalPorts[aux[0]] = aux[1];
            });
            poi.attributes.evChargingPorts = finalPorts;
        }

        W.model.actionManager.add(new AddLandmark(poi));
    }

    function addDataLandmark (aux) {
        if(aux.categoria != "")
            definecategories(aux.categoria.split(";"));

        if(aux.nome != "")
            if(array_config_country[funcselected]["emojiNome"] != "")
                defineName(array_config_country[funcselected]["emojiNome"] + " " + aux.nome);
            else
                defineName(aux.nome);

        if(array_config_country[funcselected]["secundario"] != "")
        {
            if(aux.secundario == "")
                definealiases(new Array());
            else
                definealiases(aux.secundario.split(";"));
        }

        if(aux.rua != "" || aux.localidade != "")
            defineStreetLandmark("", aux.rua, aux.localidade);

        if(array_config_country[funcselected]["bloqueio"] != "")
            defineLockRank(array_config_country[funcselected]["bloqueio"]);

        if(aux.marca != "")
            defineBrand(aux.marca);

        if(aux.notas != "")
            defineDescription(array_config_country[funcselected]["tipoNotas"], aux.notas);

        if(aux.servicos != "" || (typeof landmark !== 'undefined' && landmark["services"].length > 0))
            defineServices(false, aux.servicos.split(";"));

        if(aux.site != "")
            defineUrl(aux.site);

        if(aux.telefone != "")
            definePhone(aux.telefone);

        if(aux.tomadas != "" && aux.categoria.indexOf("CHARGING_STATION") != -1)
            definePortsEV(aux.tomadas);

        add_horarios(aux.horario)
    }

    function addExternal (externalID) {
        $('div.external-providers-control .external-provider-add-new').focus().click();
        setTimeout(() => {
            const elem = document
            .querySelector('.external-providers-control > wz-list.external-providers-list > wz-list-item.external-provider-edit > div.external-provider-edit-form > div.form-group > wz-autocomplete')
            .shadowRoot.querySelector('#text-input');
            elem.focus();
            elem.value = externalID[0] + ", " + externalID[1];
            elem.dispatchEvent(new Event('input', {bubbles:true}));
        }, 250);
    }

    function definecategories (categories) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'categories': categories}));
    }

    function definealiases (aliases) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'aliases': aliases}));
    }

    function defineBrand (brand) {
        let marcasPostos = W.model.categoryBrands.GAS_STATION;
        let marca = "";
        if(marcasPostos.includes(brand))
            marca = brand;
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'brand': marca}));
    }

    function defineLockRank (rank) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        var bloquear;
        if(W.loginManager.user.attributes.rank >= rank)
            bloquear = rank;
        else
            bloquear = W.loginManager.user.attributes.rank;
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        let lock = myPlace.attributes.lockRank;
        if(lock < bloquear)
            W.model.actionManager.add(new UpdateObject(myPlace, {'lockRank': bloquear}));
    }

    function defineName (name) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'name': name}));
    }

    function defineServices (categoryChange, services) {
        let aux = [];
        if(!categoryChange)
        {
            let servicos = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.services;
            servicos.forEach(function(element) {
                if(!aux.includes(element))
                    aux.push(element);
            });
        }
        if(services[0] != "")
            services.forEach(function(element) {
                if(!aux.includes(element))
                    aux.push(element);
            });
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'services': aux}));
    }

    function defineUrl (url) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'url': url}));
    }

    function definePhone (numberPhone) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'phone': numberPhone}));
    }

    function defineAttributesParking (type) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        let categoryAttributes = myPlace.attributes.categoryAttributes;
        if(categoryAttributes.PARKING_LOT === undefined)
            categoryAttributes.PARKING_LOT = {canExitWhileClosed: false, costType: "UNKNOWN", estimatedNumberOfSpots: null, hasTBR: false, lotType: [], numberOfSpots: null, parkingType: "PUBLIC", paymentType: []};
        if(type == "FREE")
            categoryAttributes.PARKING_LOT.costType = "FREE";
        categoryAttributes.PARKING_LOT.parkingType = "PUBLIC";
        W.model.actionManager.add(new UpdateObject(myPlace, {'categoryAttributes': categoryAttributes}));
    }

    function definePortsEV (ports) {
        let finalPorts = {};
        let portsSplit = ports.split(";");
        $.each(portsSplit, function(index , port) {
            let aux = port.split(":");
            if(aux[1] > 0)
                finalPorts[aux[0]] = aux[1];
        });
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'evChargingPorts': finalPorts}));
    }

    function defineDescription (type, description) {
        let notas = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.description;
        if(type == "AFTER")
        {
            if(notas.indexOf(description) < 0)
                notas = notas + description;
        }
        else if(type == "BEFORE")
        {
            if(notas.indexOf(description) < 0)
                notas = description + notas;
        }
        else if(type == "ALL")
            notas = description;
        let UpdateObject= require("Waze/Action/UpdateObject");
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'description': notas}));
    }

    function defineOpenning (horarios) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        let OpeningHours = require('Waze/Model/Objects/OpeningHour');
        const hoursObjectArray = [];
        horarios.forEach(function(element) {
            hoursObjectArray.push(new OpeningHours(element));
        });
        let myPlace = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        W.model.actionManager.add(new UpdateObject(myPlace, {'openingHours': hoursObjectArray}));
    }

    function defineStreetLandmark(house, street, city) {
        var wazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
        let UpdateObject= require("Waze/Action/UpdateObject");
        var poi = W.selectionManager.getSelectedFeatures()[0]._wmeObject;
        var poiAddress = poi.getAddress().attributes;

        var newAddressAtts = {
            streetName: street,
            emptyStreet: street==""?true:null,
            cityName: city,
            emptyCity: city==""?true:null,
            stateID: poiAddress.country == null?W.model.getTopState().id:poiAddress.state.id,
            countryID: poiAddress.country == null?W.model.getTopCountry().id:poiAddress.country.id
        };
        W.model.actionManager.add(new wazeActionUpdateFeatureAddress(poi, newAddressAtts));
        //W.model.actionManager.add(new UpdateObject(poi,{houseNumber: poiobject.houseNumber.toUpperCase(),residential: isRH}));
    }

    function add_horarios(horarios)
    {
        var varios_horarios = [];

        $.each(horarios, function(dia , horario) {
            let aux = horario.split(";")
            $.each(aux, function(index , auxhorario) {
                if(auxhorario != "" && varios_horarios.length < 1)
                {
                    varios_horarios.push(auxhorario);
                    return true;
                }
                var existe = 0;
                $.each(varios_horarios, function(index , dif_horario) {
                    if(auxhorario == "" || dif_horario == auxhorario)
                    {
                        existe = 1;
                        return true;
                    }
                });
                if(auxhorario != "" && existe == 0)
                    varios_horarios.push(auxhorario);
            });
        });

        if(varios_horarios.length > 0)
        {
            var arrayhorarios = [];
            var i;

            $.each(varios_horarios, function(index , dif_horario) {
                let hoursObjectAdd;
                hoursObjectAdd = {};
                hoursObjectAdd.days = [];
                $.each(horarios, function(dia , horario) {
                    if(horario.indexOf(dif_horario) != -1)
                    {
                        var horas = dif_horario.split("-");
                        if(horas[0].split(':').map(e => e.padStart(2, 0)).join(':') == "00:00" && horas[1].split(':').map(e => e.padStart(2, 0)).join(':') == "00:00")
                        {
                            hoursObjectAdd.fromHour = "00:00";
                            hoursObjectAdd.toHour = "00:00";
                        }
                        else
                        {
                            hoursObjectAdd.fromHour = horas[0][0] == "0" ? horas[0].substring(1) : horas[0];
                            hoursObjectAdd.toHour = horas[1][0] == "0" ? horas[1].substring(1) : horas[1];
                        }
                        if(dia == 0)
                            hoursObjectAdd.days.push(0);
                        else if(dia == 1)
                            hoursObjectAdd.days.push(1);
                        else if(dia == 2)
                            hoursObjectAdd.days.push(2);
                        else if(dia == 3)
                            hoursObjectAdd.days.push(3);
                        else if(dia == 4)
                            hoursObjectAdd.days.push(4);
                        else if(dia == 5)
                            hoursObjectAdd.days.push(5);
                        else if(dia == 6)
                            hoursObjectAdd.days.push(6);
                    }
                });
                arrayhorarios.push(hoursObjectAdd);
            });
            defineOpenning(arrayhorarios);
        }
    }

    function verifyNull(variable)
    {
        if(variable === null)
            return "";
        if(variable["v"] === null)
            return "";
        return variable["v"];
    }

    function isNumeric(value) {
        return /^\d+$/.test(value);
    }

    bootstrap();
})();