// ==UserScript==
// @name         Rede Canais modo simplificado
// @name:pt      Rede Canais modo simplificado
// @name:pt-BR   Rede Canais modo simplificado
// @name:pt-PT   Rede Canais modo simplificado
// @name:en      Rede Canais simplified mode
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Simplifica a pagina Rede Canais removendo elementos de contato, comentarios e outros. Além de adicionar alguns botões para ajudar a encontrar mais filmes
// @description:pt  Simplifica a pagina Rede Canais removendo elementos de contato, comentarios e outros. Além de adicionar alguns botões para ajudar a encontrar mais filmes
// @description:pt-BR  Simplifica a pagina Rede Canais removendo elementos de contato, comentarios e outros. Além de adicionar alguns botões para ajudar a encontrar mais filmes
// @description:pt-PT  Simplifica a pagina Rede Canais removendo elementos de contato, comentarios e outros. Além de adicionar alguns botões para ajudar a encontrar mais filmes
// @description:en  Simplifies the Rede Canais page by removing contact elements, comments and others. As well as adding some buttons to help you find more movies
// @author       Pedro Henrique
// @match        *://redecanais.la/*
// @match        *://redecanaistv.la/*
// @match        *://redecanais.zip/*
// @match        *://redecanaistv.zip/*
// @match        *://redecanais.dad/*
// @match        *://redecanaistv.dad/*
// @match        *://redecanais.mov/*
// @match        *://redecanaistv.mov/*
// @match        *://redecanais.dev/*
// @match        *://redecanaistv.dev/*
// @match        *://redecanais.ps/*
// @match        *://redecanaistv.ps/*
// @match        *://redecanais.ms/*
// @match        *://redecanaistv.ms/*
// @match        *://redecanais.ac/*
// @match        *://redecanaistv.ac/*
// @match        *://xn--90afacv0ct3a1ct.xn--p1ai/*
// @match        *://xn--90afacaz8cml9ac9f.xn--p1ai/*
// @match        *://xn--90afacv0cu2a3cr.xn--p1ai/*
// @match        *://xn--90afacv0clj6ac0dxa.xn--p1ai/*
// @icon         https://redecanais.la/templates/echo/img/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467339/Rede%20Canais%20modo%20simplificado.user.js
// @updateURL https://update.greasyfork.org/scripts/467339/Rede%20Canais%20modo%20simplificado.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getElementByXpath(path, elem = undefined) {
        let e = elem;
        if (e == undefined)
            e = document
        return document.evaluate(path, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function getElementsByXpath(path, elem = undefined) {
        let e = elem;
        if (e == undefined)
            e = document
        var nodes = document.evaluate(path, e, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var result = [];
        for (var i = 0; i < nodes.snapshotLength; i++) {
            result.push(nodes.snapshotItem(i));
        }
        return result;
    }
    var Config = {
        UI_barra_comentarios: true,
    }
    var u = window.document.URL;
    function IniciarScript() {
        GM_registerMenuCommand("📚Abrir Mapa do Site📚", () => {
            window.open("https://redecanais.zip/mapa.html");
        });
        GM_registerMenuCommand("🎥Abrir Mapa dos filmes🎥", () => {
            window.open("https://redecanais.zip/mapafilmes.html");
        });
        const _bc = Config.UI_barra_comentarios ? "✔️" : "❌"
        GM_registerMenuCommand(_bc + "Barra de comentários", () => {
            if (Config.UI_barra_comentarios == true) {
                Save_Config("UI_barra_comentarios", false);
                window.location.reload();
            }
            else {
                Save_Config("UI_barra_comentarios", true);
                window.location.reload();
            }

        });
        // CRIA INTERFACES
        let link = new URL(u)
        if (link.pathname == "/mapafilmes.html" || link.pathname == "/mapa.html") { // ADICIONA UM SISTEMA DE BUSCA MELHOR NO MAPA DE FILMES
            Build_UI_Search(link);
        } else {
            Build_UI_Main();
        }
    }
    function Build_UI_Search(link) {
        let search = "";
        if (link.search != "") { // APLICA PARAMETROS DE PESQUISA
            search = link.searchParams.get('search');
        }
        document.getElementById("cool_find_div").remove(); // Deleta aquele botão de procurar que fica no inferior direito
        let mainspan = getElementByXpath("//span[@style='color: rgb(255, 255, 255);']/span");
        let clonemainspan = mainspan.cloneNode(true);
        let maindiv = document.createElement("div");
        maindiv.style = "margin: 20px;color:white;background-color:rgb(20,20,20)";
        maindiv.id = "divprincipal";
        maindiv.append(clonemainspan);
        document.body.append(maindiv);
        mainspan.remove();
        let listadefilmes = DM.Construir_Array_Lista_FilmesSeries();
        maindiv.childNodes[0].childNodes[1].childNodes[0].remove();

        // ADICIONA UMA NOVA BARRA DE PESQUISA
        let barra = maindiv.childNodes[0].childNodes[1];
        let div = document.createElement("div");
        // Avisar ao usuario que o site foi modificado
        addlabel(div, "A pagina foi modificado pelo script, removendo o botão de pesquisar e adicionando um sistema de busca melhor. Os resutado da pesquisa aparecerão abaixo. A pesquisa é com base na lista disponivel abaixo");
        div.append(document.createElement("br"));
        addbutton(div, "Ver lista completa", "", () => {
            maindiv.childNodes[1].style.display = "block";
        }, "150;30");
        div.append(document.createElement("hr"));
        addlabel(div, "Nome do Filme : ");
        let _nomefilmeinput = addinput(div, search, "Digite o nome do filme", "text", "inputnome");
        _nomefilmeinput.style.width = "100%";
        _nomefilmeinput.placeholder = "Ex:. Vingadores, Bob Esponja, One piece..."
        _nomefilmeinput.oninput = () => { getResults(listadefilmes) };
        div.append(document.createElement("hr"));
        addlabel(div, "Ano : ");
        div.append(document.createElement("br"));
        let anoinput = addinput(div, "", "Ano do filme\r\nDeixe vazio para ignorar", "text", "anoinput");
        anoinput.placeholder = "Ex:. 2012";
        anoinput.oninput = () => { getResults(listadefilmes) };
        div.append(document.createElement("hr"));
        addlabel(div, "Tipo de pesquisa : ");
        div.append(document.createElement("br"));
        let typesearch = [
            "Contém texto",
            "Pesquisa Linear",
        ]
        var dropdowntypesearch = document.createElement("select");
        dropdowntypesearch.id = "typesearch";
        dropdowntypesearch.style = "font-size:16px";
        dropdowntypesearch.oninput = () => { getResults(listadefilmes) };
        createOptions(dropdowntypesearch, typesearch);
        div.append(dropdowntypesearch);

        div.append(document.createElement("hr"));
        addlabel(div, "Resolução : ");
        div.append(document.createElement("br"));
        let _resnone = addinput(div, "Nenhum", "", "checkbox", "resnone");
        _resnone.onclick = () => {
            document.getElementById("resnone").checked = true;
            document.getElementById("res1080p").checked = false;
            document.getElementById("res720p").checked = false;
            document.getElementById("res480p").checked = false;
            getResults(listadefilmes);
        };
        addinput(div, "1080p", "", "checkbox", "res1080p").onclick = () => {
            document.getElementById("resnone").checked = false;
            document.getElementById("res1080p").checked = true;
            document.getElementById("res720p").checked = false;
            document.getElementById("res480p").checked = false;
            getResults(listadefilmes);
        };
        addinput(div, "720p", "", "checkbox", "res720p").onclick = () => {
            document.getElementById("resnone").checked = false;
            document.getElementById("res1080p").checked = false;
            document.getElementById("res720p").checked = true;
            document.getElementById("res480p").checked = false;
            getResults(listadefilmes);
        };
        addinput(div, "480p", "", "checkbox", "res480p").onclick = () => {
            document.getElementById("resnone").checked = false;
            document.getElementById("res1080p").checked = false;
            document.getElementById("res720p").checked = false;
            document.getElementById("res480p").checked = true;
            getResults(listadefilmes);
        };
        _resnone.checked = true;
        div.append(document.createElement("hr"));
        addlabel(div, "Outros : ");
        div.append(document.createElement("br"));
        addinput(div, "Dublado", "", "checkbox", "dubinput").onclick = () => { getResults(listadefilmes) };
        div.append(document.createElement("br"));
        addinput(div, "Legendado", "", "checkbox", "leginput").onclick = () => { getResults(listadefilmes) };;
        div.append(document.createElement("br"));
        addinput(div, "Nacional", "", "checkbox", "nacinput").onclick = () => { getResults(listadefilmes) };;
        div.append(document.createElement("hr"));
        addlabel(div, "Resultado : ");
        div.append(document.createElement("br"));
        let resultados = document.createElement("div");
        resultados.id = "results";
        resultados.style = "padding:20px;background-color: rgb(10, 10, 10); border: solid rgb(50, 50, 50);";
        div.append(resultados);
        maindiv.append(div)
        maindiv.insertBefore(div, maindiv.childNodes[0])
        maindiv.childNodes[1].style.display = "none";
        if (link.search != "") {
            getResults(listadefilmes);
        }
    }
    function Build_UI_Main() {
        let inputgroup = getElementByXpath("//div[@class='input-group']");
        if (inputgroup.parentNode.className != "search-channel") {
            // Cria botão de procurar site
            let sitesearchspan = document.createElement("span");
            sitesearchspan.className = "input-group-btn";
            let sitesearchspanbutton = document.createElement("span");
            sitesearchspanbutton.innerHTML = "🔎📚";
            sitesearchspanbutton.title = "Pesquisar no Mapa do Site";
            sitesearchspanbutton.onclick = () => {
                let input = document.getElementById("pm-search").value;
                window.location.href = `https://redecanais.zip/mapa.html?search=${input}`
            }
            sitesearchspanbutton.className = "btn btn-default";
            sitesearchspan.append(sitesearchspanbutton);

            let filmesearchspan = document.createElement("span");
            filmesearchspan.className = "input-group-btn";
            let filmesearchspanbutton = document.createElement("span");
            filmesearchspanbutton.innerHTML = "🔎🎥";
            filmesearchspanbutton.title = "Pesquisar no Mapa de Filmes";
            filmesearchspanbutton.onclick = () => {
                let input = document.getElementById("pm-search").value;
                window.location.href = `https://redecanais.zip/mapafilmes.html?search=${input}`
            }
            filmesearchspanbutton.className = "btn btn-default";
            filmesearchspan.append(filmesearchspanbutton);
            inputgroup.append(sitesearchspan);
            inputgroup.append(filmesearchspan);
        }
        let barra = document.getElementById("content-main");
        let div = document.createElement("div");
        div.id = "BARRA";
        if (barra != null) {
            // ADICIONA BOTÕES
            let b2 = document.createElement("button");
            b2.setAttribute("class", "btn btn-default");
            b2.innerText = "📚Mapa do Site📚";
            div.append(b2);
            b2.onclick = () => {
                window.open("/mapa.html");
            };
            let b3 = document.createElement("button");
            b3.setAttribute("class", "btn btn-default");
            b3.innerText = "🎥Mapa de Filmes🎥";
            div.append(b3);
            b3.onclick = () => {
                window.open("/mapafilmes.html");
            };
            barra.append(div);
            barra.insertBefore(div, barra.childNodes[0])
            if (document.getElementsByName("Player")[0] != null) { // Se houver um player de video, adicione esse botão
                let b = document.createElement("button");
                b.setAttribute("class", "btn btn-default");
                b.innerText = "💿Redirecionar ao Url do Filme💿";
                div.append(b);
                b.onclick = () => {
                    window.location.href = document.getElementsByName("Player")[0].src;
                };
                CarregarListaDeEpisódios();
            }
        }

        // Apaga aquela barra de comentarios
        if (Config.UI_barra_comentarios == false) {
            getElementByXpath("//div[contains(@class,'pm-video-watch-sidebar')]")?.remove();
        }

        // Apaga aquela barra vermelha onde aparece todos contato do Rede Canais
        document.getElementsByClassName("alert alert-danger")[0]?.remove();
        // Remove a barra vermelha do Rede Canais TV
        document.getElementsByClassName("alert")[0]?.remove();
        // Remove Anuncio do rede Cansi TV
        const ad = document.getElementsByTagName("center");
        if (ad.length != 0) {
            ad[ad.length - 1].remove();
        }
        // Apaga anuncio para apps da Rede Canais
        getElementByXpath("//div/a[@href='./android/']").parentNode.remove()
        // Apaga aquele texto em baixo
        document.getElementsByClassName("col-xs-12 col-sm-12 col-md-10")[1]?.remove();
        // Remove links abaixos
        document.getElementsByClassName("col-xs-4 col-sm-2 col-md-2")[0]?.remove();
    }
    function CarregarListaDeEpisódios() { // INSERE O BOTÃO DE PULAR PRO PROXIMO EPISÓDIO
        /*
        Quando você estiver assistindo uma serie, nesta pagina não amazena nenhum link que leva ao proximo episodio, ou seja, o usuário teria que procurar sozinho o proximo episódio saindo da propria pagina e eu terei que usar fetch para solucionar isso
        - O que eu fiz: fiz um codigo que pega nome da serie a partir do nome disponivel que tem no site e cria um link, nesse link é onde fica a lista de episodios
            Ex : "https://redecanais.dad/loki-1a-temporada-episodio-01-proposito-glorioso_fb7c023db.html" >>> "https://redecanais.dad/browse-loki-videos-1-date.html" (Acredito eu que todas as series seguem esse formato de url)
        - Como nos temos a temporada atual e o eposodio atual, apenas pegaremos o proximo episodio e criarmos o botão, esté e o funcionamento dessa função
        */
        if (DM.Get_Nome_Serie_Completo(2) != null && !DM.Get_Nome_Serie_Completo(2).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes("episodio")) {
            return;
        }
        u = window.document.URL;
        let link, nomeepisodio;
        if (DM.Get_Nome_Serie_Completo(2) != null)
            link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(2)));
        else if (DM.Get_Nome_Serie_Completo(1) != null)
            link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(1)));
        else
            link = DM.Construir_link(DM.Get_Nome_Serie_Completo(0));
        nomeepisodio = DM.Get_Eposide_Name(DM.Get_Nome_Serie_Completo(2));

        console.log(link);
        obter_pagina_lista_episodios(link);
        function obter_pagina_lista_episodios(url, tentativa = 0) {
            fetch(url)
                .then(function (response) {
                    // When the page is loaded convert it to text
                    return response.text()
                })
                .then(function (html) {

                    // Initialize the DOM parser
                    var parser = new DOMParser();
                    // Parse the text
                    var doc = parser.parseFromString(html, "text/html");
                    // Obtem o elemento da lista de episodios e insere na pagina atual
                    let episodiosdiv = doc.querySelector(".pm-category-description");
                    let div = document.getElementById("BARRA");
                    if (document.getElementById("episodiodiv") == null) {
                        episodiosdiv.id = "episodiodiv";
                        episodiosdiv.style.display = "none";
                        episodiosdiv.children[0].children[0].remove();
                        episodiosdiv.children[0].children[0].remove();
                        div.append(episodiosdiv);
                        div.insertBefore(episodiosdiv, div.childNodes[div.childNodes.length - 1]);
                    }
                    if (document.getElementById("btnlistaepisodios") == null) {
                        let listepisodios = document.createElement("button");
                        listepisodios.setAttribute("class", "btn btn-default");
                        listepisodios.innerText = "🔢Lista de Episódios";
                        listepisodios.id = "btnlistaepisodios";
                        listepisodios.title = "Disponibiliza a lista de eposódios na pagina atual";
                        listepisodios.onclick = () => {
                            if (episodiosdiv.style.display == "none")
                                episodiosdiv.style.display = "block";
                            else
                                episodiosdiv.style.display = "none";
                        };
                        div.append(listepisodios);
                        div.insertBefore(listepisodios, div.childNodes[0]);
                    }

                    let ListaEpisódios = DM.Construir_Array_Episodios(nomeepisodio);

                    let nextepisode = document.createElement("button");
                    nextepisode.setAttribute("class", "btn btn-default");
                    nextepisode.innerText = "▶️Proximo Episódio";
                    nextepisode.onclick = () => {
                        let episodioindex = ListaEpisódios.findIndex((e) => e[0] == nomeepisodio)
                        window.location.href = ListaEpisódios[episodioindex + 1][2];
                    };
                    div.append(nextepisode);
                    div.insertBefore(nextepisode, div.childNodes[0]);
                    console.log("Serie encontrada");
                })
                .catch(function (err) {
                    console.log(url);
                    if (tentativa == 0) {
                        console.error('Serie não encontrada, tentando novamente', err);
                        link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(2)), 1);
                        obter_pagina_lista_episodios(link, 1);
                    }
                    else if (tentativa == 1) {
                        console.error('Serie não encontrada. tentando novamente(2)', err);
                        link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(2), true));
                        obter_pagina_lista_episodios(link, 2);
                    } else if (tentativa == 2) {
                        console.error('Serie não encontrada. tentando novamente(3)', err);
                        link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(2)), 3);
                        obter_pagina_lista_episodios(link, 3);
                    } else if (tentativa == 3) {
                        console.error('Serie não encontrada. tentando novamente(4)', err);
                        link = DM.Construir_link(DM.Get_Apenas_Nome(DM.Get_Nome_Serie_Completo(2)), 4);
                        obter_pagina_lista_episodios(link, 4);
                    }
                });
        }

    }
    window.onload = () => {
        if (u.includes("contador.php?static=true") || u.startsWith("https://sinalpublico")) // IGNORAR A EXECUÇÃO DO SCRIPT NESSES URL
            return;
        Load_Config();
    }
    window.document._DM = function () { return DM };
    var DM = { // Funções para decifrar link e construir arrays
        Get_Num_Season(e) {
            let m = e.toLowerCase().match(/(\d+)a-temporada/);
            if (m != null) {
                let int = parseInt(m[1]);
                if (int == 0)
                    int++;
                return int;
            }
            else
                return undefined
        },
        Get_Num_Episode(e) {
            let a = e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (a.match(/episodio-(\d+)/) != null)
                a = a.match(/episodio-(\d+)/)[1];
            else
                a = a.match(/episodio:-(\d+)/)[1];
            return a;
        },
        Get_Eposide_Name(name) {
            let array = name.split("-");
            return array[array.length - 1].trim();
        },
        Get_Nome_Serie_Completo(e = 0) { // Obtem o nome da serie ou filme
            switch (e) {
                case 0:
                    return window.document.URL; // Exemplo : https://redecanais.dad/loki-1a-temporada-episodio-01-proposito-glorioso_fb7c023db.html
                case 1:
                    return pm_video_data.url; // Exemplo : '/loki-1a-temporada-episodio-01-proposito-glorioso_fb7c023db.html'
                case 2:
                    return getElementByXpath("//h1[@itemprop='name']").innerText.toLowerCase(); // Exemplo : Loki - 1ª Temporada - Episódio 01 - Propósito Glorioso
                default:
                    return ""
            }
        },
        Get_Apenas_Nome(nome, semespaços = false) {
            if (nome.includes(" - ")) // converte em link cru
                nome = DM.Construir_Nome_Serie_Cru(nome);

            if (nome.includes("temporada"))
                nome = nome.match(/([^\/]+)-\d+a-temporada-/)[1];
            else
                nome = nome.match(/([^]+)-episodio-/)[1];
            nome = nome.replace(/-legendado/g, "");
            if (semespaços == true)
                nome = nome.replaceAll("-", "");
            return nome;
        },
        Construir_Nome_Serie_Cru(nome) {
            // Exemplo : "Os Simpsons - 1ª Temporada - Episodio 01 - O prêmio de Natal"
            nome = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // deixa minusculo e remove acéntos
            nome = nome.replace(/[\/\(\)\#\.\,]+/g, "")
            nome = nome.replaceAll("ª", "a");
            nome = nome.split(" ").join("-")
            nome = nome.replaceAll("---", "-")
            return nome; // Deve retornar : 'os-simpsons-1a-temporada-episodio-01-o-prêmio-de-natal'
        },
        Construir_link(nome, type = 0) {
            switch (type) {
                case 0:
                    return new URL(window.document.URL).origin + "/browse-" + nome.replaceAll("&", "and") + "-videos-1-date.html";
                case 1:
                    return new URL(window.document.URL).origin + "/browse-" + nome.replaceAll("&", "e") + "-videos-1-date.html";
                case 2:
                    return new URL(window.document.URL).origin + "/browse-" + nome.replaceAll(" ", "") + "-videos-1-date.html";
                case 3:
                    return new URL(window.document.URL).origin + "/browse-" + nome.replaceAll("&", "to") + "-videos-1-date.html";
                case 4:
                    return new URL(window.document.URL).origin + "/browse-" + nome.replaceAll(" ", "to") + "-videos-1-date.html";
                default:
                    return ""
            }
        },
        Construir_Array_Episodios(episodioatual) { // DECIFRAR OS ELEMENTOS DA LISTA DE ÉPISÓDIO
            let _array = [];
            try {
                let epdiv = document.getElementById("episodiodiv").children[0];
                for (let i = 0; i < epdiv.childNodes.length; i++) {
                    const element = epdiv.childNodes[i];
                    if (element.nodeName == "#text") {
                        if (element.textContent == " / " || element.textContent == "" || element.textContent == " ")
                            continue;
                        let link, epnumber;
                        let nomeep = element.textContent.split("-")[0].trim().toLocaleLowerCase();
                        // ENCONTRA O LINK DO PROXIMO EPISÓDIO
                        link = element.nextElementSibling.href || element.nextElementSibling.children[0].href;
                        // PINTA DE AMARELO O EPISÓDIO ATUAL
                        if (nomeep == episodioatual)
                            element.previousSibling.style.color = "yellow";
                        epnumber = element.previousSibling.textContent || element.previousSibling.innerHTML;
                        epnumber = epnumber.split("-")[0].trim().toLocaleLowerCase()
                        // FINALIZA
                        _array.push([nomeep, epnumber, link]);
                    }

                }
                console.log(_array);
                return _array;
            } catch (error) {
                alert(`função encontrou um erro ao decifrar elementos da lista de episódios, essa função ainda não é perfeita, veja o console`);
                console.error("Erro na função : ", error, _array);
            }
        },
        Construir_Array_Lista_FilmesSeries() {
            let _array = []; // Essa lista é no formato array : [[NOME DO FILME, LINK], ...]
            let tempelem = []; // variavel temporaria
            let listelem = document.getElementById("divprincipal").childNodes[0].childNodes;
            for (let i = 11; i < listelem.length; i++) {
                const node = listelem[i];
                if (node.nodeName.toLowerCase() == "#text") { // elemento de texto
                    tempelem.push(node.textContent);
                }
                else if (node.nodeName.toLowerCase() == "a") { // elemento link
                    let finaltext = "";
                    for (let v = 0; v < tempelem.length; v++) {
                        const element = tempelem[v];
                        finaltext += element;
                    }
                    _array.push([finaltext.replaceAll("\n", ""), node]);
                    tempelem = [];

                } else if (node.nodeName.toLowerCase() == "b") { // elemento negrito
                    if (node.hasChildNodes()) {
                        if (node.childNodes[0].nodeName.toLowerCase() == "a") { // se dentro houver link do filme dentro do elemento negrito
                            let finaltext = "";
                            for (let v = 0; v < tempelem.length; v++) {
                                const element = tempelem[v];
                                finaltext += element;
                            }
                            _array.push([finaltext.replaceAll("\n", ""), node.childNodes[0]]);
                            tempelem = [];
                        }
                        else { // caso for outra coisa no negrito
                            if (node.innerHTML == 'Números &amp; Símbolos') // ignorar esse elemento
                                continue;
                            tempelem.push(node.innerHTML);
                        }
                    } else {
                        tempelem.push(node.innerHTML);
                    }
                }
            }
            console.log("Lista de filmes/series : ", _array);
            return _array;
        }
    }
    window.document.dm = DM;
    function Save_Config(name, value) {
        // SALVA O VALOR DE UMA VARIAVEL E MANTEM OS OUTROS
        if (name != undefined) {
            Config[name] = value;
            GM.setValue("Config", Config);
            return;
        }
        // SALVA TUDO
        GM.setValue("Config", Config);

    };
    async function Load_Config() {// OBTEM OS VALORES DA CONFIGURAÇÃO
        let _config = await GM.getValue("Config");
        if (_config != undefined) {
            for (var k in _config) {
                Config[k] = _config[k]
            }
        }
        console.log("Script Settings", _config);
        // COMEÇA A MODIFICAÇÃO DA PAGINA DO REDE CANAIS
        IniciarScript();
    };
    function getResults(_array, index = 0, clear = true) { // Obtem os resultado da procura
        let divresults = document.getElementById("results");
        if (clear == true)
            divresults.innerHTML = "";
        const _originalinput = document.getElementById("inputnome").value;
        const _input = document.getElementById("inputnome").value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // deixa minusculo e remove acentos;
        let anoinput = document.getElementById("anoinput");
        var find = 0;
        for (index; index < _array.length; index++) {
            let filme = _array[index];
            function _othersvalues() {
                if (anoinput != "")
                    if (!filme[0].toLowerCase().includes(anoinput.value.toLowerCase()))
                        return true;
                if (document.getElementById("dubinput").checked == true)
                    if (!filme[0].toLowerCase().includes("dublado"))
                        return true;
                if (document.getElementById("leginput").checked == true)
                    if (!filme[0].toLowerCase().includes("legendado"))
                        return true;
                if (document.getElementById("nacinput").checked == true)
                    if (!filme[0].toLowerCase().includes("(nacional)"))
                        return true;
                if (document.getElementById("res1080p").checked == true)
                    if (!filme[0].toLowerCase().includes("1080p"))
                        return true;
                if (document.getElementById("res720p").checked == true)
                    if (!filme[0].toLowerCase().includes("720p"))
                        return true;
                if (document.getElementById("res480p").checked == true)
                    if (!filme[0].toLowerCase().includes("480p"))
                        return true;
                return false;
            }
            if (document.getElementById("typesearch").selectedIndex == 0) { // PESQUISA USANDO "INCLUDES"
                if (!filme[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(_input)) {
                    continue;
                }
                if (_othersvalues()) continue;

            } else { // PESQUISA LINEAR
                if (_input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") !== filme[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, _input.length)) {
                    continue;
                }
                if (_othersvalues()) continue;
            }
            let _label = addlabel(divresults, filme[0], 0);
            if (document.getElementById("typesearch").selectedIndex == 0) {
                const regEx = new RegExp(_originalinput, "ig");
                _label.innerHTML = _label.innerHTML.replaceAll(regEx, "<span style='color:yellow'>" + _originalinput + "</span>");
            } else {
                let strarray = (_label.innerHTML.substring(0, _originalinput.length) + "|" + _label.innerHTML.substring(_originalinput.length)).split("|");
                _label.innerHTML = "<span style='color:yellow'>" + strarray[0] + "</span>" + strarray[1];
            }

            divresults.append(filme[1].cloneNode(true)) // URL
            divresults.append(document.createElement("br"));
            find++;
            if (find > 20) // Esse é o comprimento da lista, caso chege ao limite, aparecera o botão de "Mostrar mais"
            {
                addbutton(divresults, "Mostrar Mais", "Mostra mais filmes", (e) => {
                    e.target.remove();
                    getResults(_array, index + 1, false);
                }, "150;30");
                break;
            }

        }
    }
    function addlabel(elem, text, type = 0) {
        const _elementotipo = type == 0 ? "span" : "p"
        const l = document.createElement(_elementotipo);
        l.innerHTML = text;
        elem.append(l)
        return l;
    }
    function addinput(elem, text = "", title = "", type = "text", id = "") {
        const _input = document.createElement("input");
        _input.type = type;
        _input.innerHTML = text;
        _input.value = text;
        _input.title = title;
        _input.style = "font-size:16px";
        _input.setAttribute("id", id);
        elem.append(_input);
        if (type == "checkbox") {
            addlabel(elem, text, 0);
        }
        return _input;
    }
    function addbutton(elem, text, title, func, width = "100;30") {
        const b = document.createElement("button");
        b.innerHTML = text
        b.title = title;
        b.onclick = func;
        let w = width.split(";")[0];
        let h = width.split(";")[1];
        b.style = ` display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: ${w}px;
        height: ${h}px;
        margin: 5px;
        border: 10px solid var(--base-color);
        font-size: 16px;
        cursor: pointer;`;
        elem.append(b);
    }
    function createOptions(selectelem, list) { // CRIA OPÇÕES
        list.forEach((a, i) => {
            let _op = document.createElement("option");
            _op.value = i;
            if (a.textContent != undefined)
                _op.innerHTML = a.textContent;
            else
                _op.innerHTML = a;
            selectelem.append(_op);
        });
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var debug = false; // TESTES NO MEU SCRIPT DEIXE "false" PARA NÃO USAR ESSA FUNÇÃO. ISSO FAZ COM QUE O REDE CANAIS NÃO BLOQUEIE A PÁGINA INTEIRA
    if (debug == true) {
        const window = unsafeWindow;
        GM_registerMenuCommand("(DEBUG) Abrir Console", () => { // ABRIR CONSOLE
            window.prompt(`Rede Canais automaticamente fecha a página quando usúarios tentam usar o console, para resolver isso :

Com essa caixa de alerta aberta, Aperte F12 para abrir o console, clique em "Network" e bloqueie a solicitação "cdn.jsdelivr.net/npm/console-ban@4.1.0/dist/console-ban.min.js"

- Clique Ctrl+F8 para desativar o loop do debugger infinito caso estiver sendo executado

- Já existe um script no greasyfork que desbloqueia o clique com o botão direito se você quiser usar`);
        });
        // DESATIVA FUNÇÃO DE FECHAR A PAGINA E DESATIVA O HISTÓRICO DE VOLTAR
        void (window.ConsoleBan = undefined);
        void (window.closeWindow = undefined);
        void (window.close = undefined);
        void (history.go = undefined);
        void (history.back = undefined);
        void (history.forward = undefined);
        void (window.history.go = undefined);
        void (window.history.back = undefined);
        void (window.history.forward = undefined);
        void (window.open = undefined);
        // EVITAR SAIR DA PAGINA
        /*
        function internalHandler(e) {
            e.preventDefault(); // required in some browsers
            e.returnValue = ""; // required in some browsers
            return "Custom message to show to the user"; // only works in old browsers
        }
        if (window.addEventListener) {
            window.addEventListener('beforeunload', internalHandler, true);
        } else if (window.attachEvent) {
            window.attachEvent('onbeforeunload', internalHandler);
        }
        window.onbeforeunload = internalHandler;
        window.close = function () {
            alert("rede canais forçou a fechar a pagina");
        }*/
    }
})();