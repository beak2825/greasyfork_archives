// ==UserScript==
// @name         WAZEPT Excel
// @version      2025.10.14
// @description  WAZEPT Excel SDK
// @author       J0N4S13 (jonathanserrario@gmail.com)
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/537665/WAZEPT%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/537665/WAZEPT%20Excel.meta.js
// ==/UserScript==

(function () {
    // --- State ---
    let wmeSDK;
    const version = GM_info.script.version;
    const configFuncionalidades = {};
    const dadosFuncionalidades = {};
    let linhaAtual = null;
    let indexAtual = 0;
    let funcionalidadeSelecionada = "";
    let historico = [];

    // --- Estilos centralizados ---
    const styles = {
        button: 'height:30px;font-size:13px;margin-bottom:15px;width:100%;background-color:#05c5cc;color:white;font-weight:bold;border:none;border-radius:5px;cursor:pointer;',
        navTabs: 'margin-bottom:15px;',
        infoContainer: 'margin-bottom:10px;padding:10px;border-radius:5px;background:#f8f9fa;',
        label: 'font-weight:600;color:#0077aa;',
        dataLabel: 'margin-left:8px;color:#333;',
        anterior: 'height:30px;font-size:13px;background-color:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;min-width:90px;',
        adicionar: 'height:30px;font-size:13px;background-color:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;min-width:90px;',
        seguinte: 'height:30px;font-size:13px;background-color:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;min-width:90px;',
        associar: 'height:30px;font-size:13px;width:100%;background-color:#17a2b8;color:white;border:none;border-radius:4px;cursor:pointer;margin-top:0px;margin-bottom:10px;'
    };


    // --- Bootstrap ---
    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            setConfigs();
        } else {
            document.addEventListener('wme-ready', setConfigs, { once: true });
        }
    }

    // --- Carregamento de dados principais ---
    async function setConfigs() {
        wmeSDK = getWmeSdk({
            scriptId: "9ed08f31-78ca-4c20-b20e-a3e629cbb872",
            scriptName: "WAZEPT Excel"
        });

        console.log(wmeSDK.DataModel.ManagedAreas);
        console.log(wmeSDK.DataModel.ManagedAreas.getAll());

        await carregarConfiguracoes();

        dataCall();

        if (!document.getElementById("WAZEPT_EXCEL")) {
            criarSidebar();
        }

        // Aguarda dados carregados antes de ativar eventos
        await waitForData(dadosFuncionalidades, 50);

        wmeSDK.Events.on({
            eventName: "wme-selection-changed",
            eventHandler: onFeatureSelecionada
        });
    }

    // --- Carregamento de dados principais ---
    async function dataCall() {
        const temExcel = Object.values(configFuncionalidades).some(cfg => cfg.excel);

        if (temExcel) {
            await Promise.all(
                Object.values(configFuncionalidades)
                .filter(cfg => cfg.excel)
                .map(cfg => carregarDadosFuncionalidade(cfg, cfg.excel))
            );
        }

        indexAtual = 0;
    }


    // --- Carrega configurações da planilha ---
    async function carregarConfiguracoes() {
        const json = await fetchJSON('https://docs.google.com/spreadsheets/d/1C8oQ1hcOwZ6taW1q0aRPHHi-3RCE4-jPXK8H_9Jipew/gviz/tq?tqx=out:json&sheet=Config');
        json.table.rows.forEach(row => {
            if (verifyNull(row.c[0])) {
                const elem = parseConfigRow(row);
                configFuncionalidades[elem.funcionalidade] = elem;
            }
        });
    }

    // --- Carrega dados de cada funcionalidade ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async function carregarDadosFuncionalidade(func, link) {
        const json = await fetchJSON(link);
        const aux = [];
        json.table.rows.forEach(row => {
            const elem = parseDataRow(func, row);
            const codigo = verifyNull(row.c[func.codigo]);
            if (codigo) aux.push(elem);
        });
        shuffleArray(aux);
        dadosFuncionalidades[func.funcionalidade] = aux;
    }



    // --- Cria Sidebar UI ---
    function criarSidebar() {
        wmeSDK.Sidebar.registerScriptTab().then(result => {
            result.tabLabel.textContent = 'WAZEPT EXCEL';
            const content = document.createElement('div');
            content.style.cssText = 'font-family: "Segoe UI", sans-serif; padding: 10px; color: #333;';

            // Botão atualizar
            content.appendChild(criarBotaoAtualizar());

            // Tabs de funcionalidades
            content.appendChild(criarTabsFuncionalidades());

            const selectGrupoDiv = document.createElement('div');
            selectGrupoDiv.id = 'selectGrupoDiv';
            content.appendChild(selectGrupoDiv);

            const divInfo = document.createElement('div');
            divInfo.id = 'infoContainer';
            divInfo.style.cssText = styles.infoContainer;

            // Info container
            content.appendChild(divInfo);

            // Container flex para os botões de navegação
            const navButtonsContainer = document.createElement('div');
            navButtonsContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`;

            // Botão Anterior
            const btnAnterior = criarBotaoAnterior();
            // Botão Adicionar (centralizado num sub-container)
            const centerContainer = document.createElement('div');
            centerContainer.style.flex = '1';
            centerContainer.style.display = 'flex';
            centerContainer.style.justifyContent = 'center';
            centerContainer.appendChild(criarBotaoAdicionar());
            // Botão Seguinte
            const btnSeguinte = criarBotaoSeguinte();

            navButtonsContainer.appendChild(btnAnterior);
            navButtonsContainer.appendChild(centerContainer);
            navButtonsContainer.appendChild(btnSeguinte);

            content.appendChild(navButtonsContainer);


            // Container principal
            const divLandmarks = document.createElement('div');
            divLandmarks.id = 'WAZEPT_EXCEL';
            divLandmarks.style.display = 'block';
            divLandmarks.appendChild(content);
            result.tabPane.appendChild(divLandmarks);
        });
    }

    // --- Componentes UI ---
    function criarBotaoAtualizar() {
        const btn = document.createElement('button');
        btn.textContent = '🔄 Atualizar Dados';
        btn.id = 'btnAtualizar';
        btn.style.cssText = styles.button;
        btn.onclick = dataCall;
        return btn;
    }

    function criarTabsFuncionalidades() {
        const nav = document.createElement('ul');
        nav.className = 'nav nav-tabs';
        nav.style.cssText = styles.navTabs;

        Object.entries(configFuncionalidades).forEach(([_, func]) => {
            const tab = document.createElement('li');
            tab.id = func.funcionalidade;

            const anchor = document.createElement('a');
            anchor.href = "#";
            anchor.dataset.toggle = "tab";
            anchor.textContent = func.emoji;
            anchor.style.cssText = 'text-decoration:none;color:inherit;';

            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("WAZEPT_EXCEL").style.display = 'block';
                linhaAtual = null;
                indexAtual = 0;
                funcionalidadeSelecionada = func.funcionalidade;

                document.querySelectorAll('#WAZEPT_EXCEL .nav-tabs li').forEach(li => {
                    li.classList.remove('active');
                    li.style.backgroundColor = '';
                });
                tab.classList.add('active');
                tab.style.backgroundColor = '#e6f7ff';

                if (func.funcionalidade === 'LD_ESCOLAS') {
                    criarSelectGrupo();
                } else {
                    const antigo = document.getElementById('selectGrupo');
                    if (antigo) antigo.remove();
                }

            });

            tab.appendChild(anchor);
            nav.appendChild(tab);
        });
        return nav;
    }

    function criarSelectGrupo() {
        const antigo = document.getElementById('selectGrupo');
        if (antigo) antigo.remove();

        const select = document.createElement('select');
        select.id = 'selectGrupo';
        select.style.cssText = 'margin-bottom:10px;width:100%;padding:5px;';
        select.required = true;

        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.text = 'Selecione o grupo';
        select.appendChild(optionDefault);

        for (let i = 1; i <= 2; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = 'Grupo ' + i;
            select.appendChild(option);
        }

        select.addEventListener('change', function() {
            indexAtual = 0;
        });

        const selectGrupoDiv = document.getElementById('selectGrupoDiv');
        // Insere o select ANTES do primeiro filho do infoContainer
        selectGrupoDiv.insertBefore(select, selectGrupoDiv.firstChild);
    }


    function criarInfoContainer(dados = {}) {
        const divInfo = document.getElementById('infoContainer');
        if (divInfo)
            divInfo.innerHTML = '';

        if (dados.camposInfo) {
            Object.entries(dados.camposInfo).forEach(([campo, valor]) => {
                const divField = document.createElement('div');
                divField.style.cssText = 'margin-bottom:5px;font-size:14px;';

                const label = document.createElement('label');
                label.textContent = `📄 ${campo}:`;
                label.style.cssText = styles.label;
                divField.appendChild(label);

                const dataLabel = document.createElement('label');
                dataLabel.textContent = valor !== undefined && valor !== null ? valor : '';
                dataLabel.style.cssText = styles.dataLabel;
                dataLabel.id = `WAZEPTEXCEL_EXTRA_${campo.toUpperCase()}`;
                divField.appendChild(dataLabel);

                divInfo.appendChild(divField);
            });
        }

        return divInfo;
    }


    function criarBotaoAnterior() {
        const btn = document.createElement('button');
        btn.textContent = '🔙 Anterior';
        btn.id = 'btnAnterior';
        btn.style.cssText = styles.anterior;
        btn.onclick = handleAnterior;
        return btn;
    }

    // --- Lógica do botão Seguinte ---
    function handleAnterior() {
        if (!funcionalidadeSelecionada) return alert("Selecione uma funcionalidade.");
        if (historico.length < 2) return alert("Não tem mais historico.");
        let count = 1;
        let encontrado = false;
        let dadosFunc = dadosFuncionalidades[funcionalidadeSelecionada] || {};

        for (const [codigo, dados] of Object.entries(dadosFunc)) {
            if (dados.codigo == historico[historico.length - 2].codigo) {
                wmeSDK.Map.setMapCenter({
                    lonLat: { lat: parseFloat(dados.latitude), lon: parseFloat(dados.longitude) },
                    zoomLevel: 20
                });
                indexAtual = count;
                criarInfoContainer(dados);
                linhaAtual = dados;
                encontrado = true;
                historico.pop();
                break;
            }
            count++;
        }
        if (!encontrado) alert("Já não existem landmarks para validar nesta categoria.");
    }

    function criarBotaoAdicionar() {
        const btn = document.createElement('button');
        btn.textContent = '➕ Adicionar';
        btn.id = 'btnAdicionar';
        btn.style.cssText = styles.adicionar;
        btn.onclick = handleAdicionar;
        return btn;
    }

    // --- Lógica do botão Seguinte ---
    function handleAdicionar() {
        if (linhaAtual == null) return alert("Faça seguinte primeiro.");
        const point = {
            type: "Point",
            coordinates: [Number(linhaAtual.longitude), Number(linhaAtual.latitude)]
        };
        wmeSDK.DataModel.Venues.addVenue({category: linhaAtual.categoria, geometry: point});
    }

    function criarBotaoSeguinte() {
        const btn = document.createElement('button');
        btn.textContent = '➡️ Seguinte';
        btn.id = 'btnSeguinte';
        btn.style.cssText = styles.seguinte;
        btn.onclick = handleSeguinte;
        return btn;
    }

    // --- Lógica do botão Seguinte ---
    function handleSeguinte() {
        if (!funcionalidadeSelecionada) return alert("Selecione uma funcionalidade.");
        let grupoSelecionado = null;

        if (funcionalidadeSelecionada === 'LD_ESCOLAS') {
            const selectGrupo = document.getElementById('selectGrupo');
            if (!selectGrupo || !selectGrupo.value) {
                alert("É preciso selecionar o grupo.");
                return;
            }
            grupoSelecionado = selectGrupo.value;
        }

        let count = 1;
        let encontrado = false;
        let dadosFunc = dadosFuncionalidades[funcionalidadeSelecionada] || {};

        // FILTRO DO GRUPO 1
        /*if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "1") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Lisboa") || extra.includes("Castelo Branco") || extra.includes("Beja") || extra.includes("Ilha da Madeira") || extra.includes("Ilha da Graciosa");
                })
            );
        }
        else if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "2") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Porto") || extra.includes("Santarém") || extra.includes("Évora") || extra.includes("Vila Real") || extra.includes("Ilha de São Miguel") || extra.includes("Ilha Terceira");
                })
            );
        }
        else if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "3") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Braga") || extra.includes("Leiria") || extra.includes("Coimbra") || extra.includes("Faro") || extra.includes("Portalegre") || extra.includes("Ilha do Faial") || extra.includes("Ilha de Santa Maria") || extra.includes("Ilha de São Jorge");
                })
            );
        }
        else if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "4") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Setúbal") || extra.includes("Aveiro") || extra.includes("Viseu") || extra.includes("Viana do Castelo") || extra.includes("Guarda") || extra.includes("Bragança") || extra.includes("Ilha do Pico") || extra.includes("Ilha das Flores") || extra.includes("Ilha de Porto Santo") || extra.includes("Ilha do Corvo");
                })
            );
        }*/

        // FILTRO DO GRUPO 2
        if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "1") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Aveiro") || extra.includes("Portalegre") || extra.includes("Faro") || extra.includes("Braga")
                    || extra.includes("Coimbra") || extra.includes("Leiria") || extra.includes("Évora")
                    || extra.includes("Ilha da Madeira") || extra.includes("Ilha Terceira")
                    || extra.includes("Ilha de Santa Maria") || extra.includes("Ilha do Faial");
                })
            );
        }
        else if (funcionalidadeSelecionada === 'LD_ESCOLAS' && grupoSelecionado === "2") {
            dadosFunc = Object.fromEntries(
                Object.entries(dadosFunc).filter(([codigo, dados]) => {
                    const extra = (dados.extra || "");
                    return extra.includes("Viseu") || extra.includes("Viana do Castelo") || extra.includes("Porto") || extra.includes("Santarém")
                    || extra.includes("Guarda") || extra.includes("Vila Real") || extra.includes("Lisboa") || extra.includes("Bragança")
                    || extra.includes("Castelo Branco") || extra.includes("Setúbal") || extra.includes("Beja")
                    || extra.includes("Ilha do Pico") || extra.includes("Ilha de São Miguel") || extra.includes("Ilha do Corvo");
                })
            );
        }


        for (const [codigo, dados] of Object.entries(dadosFunc)) {
            if (dados.id.toString() === "0" && dados.latitude != "" && dados.longitude != "" && count > indexAtual) {
                wmeSDK.Map.setMapCenter({
                    lonLat: { lat: parseFloat(dados.latitude), lon: parseFloat(dados.longitude) },
                    zoomLevel: 20
                });
                indexAtual = count;
                linhaAtual = dados;
                criarInfoContainer(dados);
                encontrado = true;
                historico.push(dados);
                break;
            }
            count++;
        }
        if (!encontrado) alert("Já não existem landmarks para validar nesta categoria.");
    }


    // --- Evento ao selecionar feature ---
    function onFeatureSelecionada() {
        const selectedData = wmeSDK.Editing.getSelection();
        if (selectedData.ids.length === 1) {
            setTimeout(() => inserirBotaoAssociar(selectedData.objectType), 1000);
        }
    }

    // --- Botão de associação ao Excel ---
    function inserirBotaoAssociar(typeSelected) {
        if (linhaAtual == null || !funcionalidadeSelecionada) return;
        if (document.getElementById('btnAssociar')) return; // Evita múltiplos botões
        if (!configFuncionalidades[funcionalidadeSelecionada][typeSelected]) return;
        const pl = wmeSDK.Map.getPermalink();
        if (pl.indexOf(typeSelected) == -1) return;

        const btn = document.createElement('button');
        btn.innerHTML = 'Associar ao Excel';
        btn.id = 'btnAssociar';
        btn.style.cssText = styles.associar;
        btn.onclick = async function () {
            const confirmar = confirm(`Associar a "${configFuncionalidades[funcionalidadeSelecionada]['descricao']}" com o código "${linhaAtual.codigo}"?`);
            if (!confirmar) return;

            const data = new FormData();
            data.append("funcionalidade_id", funcionalidadeSelecionada);
            data.append("typeSelected", typeSelected);
            data.append("pl", pl);
            data.append("codigo", linhaAtual.codigo);
            data.append("editor", wmeSDK.State.getUserInfo().userName);

            try {
                await enviarAssociacao(data);
                dataCall();
                alert("Associado!");
            } catch {
                alert("Falha ao associar.");
            }
        };

        let target = null;
        if(typeSelected == 'permanentHazard')
            target = document.querySelector('.permanent-hazard-feature-editor .sidebar-column wz-tabs');
        else
            target = document.querySelector('#' + typeSelected + '-edit-general');

        if (target) target.prepend(btn);
    }

    async function enviarAssociacao(formData) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    xhr.status === 200 ? resolve() : reject();
                }
            };
            xhr.open("POST", "https://external.wazept.com/scripts/excel.php");
            xhr.send(formData);
        });
    }

    // --- Funções auxiliares ---
    async function fetchJSON(url) {
        const res = await fetch(url);
        const text = await res.text();
        return JSON.parse(text.substring(47).slice(0, -2));
    }

    function parseConfigRow(row) {
        return {
            funcionalidade: verifyNull(row.c[1]),
            emoji: verifyNull(row.c[2]),
            descricao: verifyNull(row.c[3]),
            excel: verifyNull(row.c[4]),
            venue: verifyNull(row.c[5]),
            segment: verifyNull(row.c[6]),
            permanentHazard: verifyNull(row.c[7]),
            codigo: verifyNull(row.c[8]),
            id: verifyNull(row.c[9]),
            nome: verifyNull(row.c[10]),
            latitude: verifyNull(row.c[11]),
            longitude: verifyNull(row.c[12]),
            extra: verifyNull(row.c[13]),
            categoria: verifyNull(row.c[14]),
            camposInfo: verifyNull(row.c[15])
        };
    }

    function parseDataRow(func, row) {
        const camposInfo = Object.fromEntries(
            Object.entries(JSON.parse(func.camposInfo)).map(
                ([key, idx]) => [key, verifyNull(row.c[idx])]
            )
        );

        return {
            id: func.id ? verifyNull(row.c[func.id]) : "",
            codigo: func.codigo ? verifyNull(row.c[func.codigo]) : "",
            nome: func.nome ? verifyNull(row.c[func.nome]) : "",
            categoria: func.categoria ? func.categoria : "",
            latitude: func.latitude ? verifyNull(row.c[func.latitude]) : "",
            longitude: func.longitude ? verifyNull(row.c[func.longitude]) : "",
            extra: func.extra ? verifyNull(row.c[func.extra]) : "",
            camposInfo: camposInfo ? camposInfo : ""
        };
    }

    function waitForData(data, maxAttempts) {
        let attempts = 0;
        return new Promise(resolve => {
            const timer = setInterval(() => {
                if (Object.keys(data).length > 0 || attempts >= maxAttempts) {
                    clearInterval(timer);
                    resolve(true);
                }
                attempts++;
            }, 100);
        });
    }

    function verifyNull(variable) {
        try {
            return variable?.v ?? "";
        } catch {
            return "";
        }
    }

    // --- Inicialização ---
    bootstrap();
})();