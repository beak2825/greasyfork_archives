// ==UserScript==
// @name         Jupiter+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para adicionar funcionalidades ao JupiterWeb
// @author       Guimel Paranhos (Eng. Elétrica)
// @match        https://uspdigital.usp.br/jupiterweb/*
// @icon         https://uspdigital.usp.br/comumwebdev/imagens/favicon.ico
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/526593/Jupiter%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/526593/Jupiter%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlAtual = window.location.href;
    let funcaoAtual;

    if (urlAtual.startsWith("evolucaoCurso", 37)){
        funcaoAtual = "evolucaoCurso";

        document.getElementById("enviar").addEventListener("click", startContadorCreditos);
    
        function startContadorCreditos(){
            setTimeout(() => {
    
                // Criando um container principal
                let container = document.createElement("div");
                container.style.position = "fixed";
                container.style.bottom = "20px";
                container.style.right = "20px";
                container.style.padding = "10px";
                container.style.background = "rgba(255, 255, 255, 0.95)";
                container.style.color = "#000";
                container.style.fontSize = "14px";
                container.style.borderRadius = "8px";
                container.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
                container.style.textAlign = "center";
                container.style.fontFamily = "Arial, sans-serif";
                container.innerHTML = `
                <style>
                    #meuContainer * { font-family: Arial, sans-serif; }
                    .habilitada { background-color: green; border: 3px solid green; border-radius: 10px; }
                    .desabilitada { background-color: red; border: 3px solid red; border-radius: 10px; }
                    .botao { padding: 8px 12px; margin: 5px; border: none; cursor: pointer; font-size: 14px; border-radius: 5px; }
                    .iniciar { background: #28a745; color: white; }
                    .limpar { background: #dc3545; color: white; }
                    .manual { background: #007bff; color: white; }
                    .parar { background: #ffc107; color: black; }
                    .ativo { border: 2px solid #007bff; }
                    #meuContainer table { width: 100%; border-collapse: collapse; }
                    #meuContainer th, #meuContainer td { padding: 8px; text-align: center; border-bottom: 1px solid #ddd; }
                    #meuContainer th { background: #222; color: #fff; }
                    .cursadas { background: rgb(0, 192, 0); color: white; }
                    .cursando { background: rgb(255, 255, 128); color: black; }
                    .a_cursar { background: rgb(255, 160, 96); color: black; }
                    .eletivas { background: rgb(192, 192, 192); color: black; }
                </style>
    
                <div id="meuContainer">
                    <!-- Container de Contagem Manual -->
                    <div id="contagem_manual">
                        <strong>Contagem Manual</strong>
                        <strong id="manualCountingStatus" class="desabilitada">Desabilitada</strong>
                        <table style="margin-top: 5px;" >
                            <thead>
                                <tr>
                                    <th>Créd. Aula</th>
                                    <th>Créd. Trabalho</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td id="manual_aula">0</td>
                                    <td id="manual_trabalho">0</td>
                                    <td id="manual_total">0</td>
                                </tr>
                            </tbody>
                        </table>
                        <button id="iniciarManual" class="botao manual">Iniciar Contagem</button>
                        <button id="pararManual" class="botao parar">Parar Contagem</button>
                        <button id="limparManual" class="botao limpar">Limpar Contagem Manual</button>
                    </div>
    
                    <hr>
    
                    <!-- Container de Cálculo Automático -->
                    <button id="iniciarCalculo" class="botao iniciar">Iniciar Cálculo Automático</button>
                    <button id="limparCalculo" class="botao limpar">Limpar Contagem Automática</button>
                    <hr>
                    <div id="creditos_total">
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Créd. Aula</th>
                                    <th>Créd. Trabalho</th>
                                    <th>Total</th>
                                    <th>Porcentagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="cursadas">
                                    <td>Cursadas</td>
                                    <td id="ca_cursadas">0</td>
                                    <td id="ct_cursadas">0</td>
                                    <td id="t_cursadas">0</td>
                                    <td id="p_cursadas">0%</td>
                                </tr>
                                <tr class="cursando">
                                    <td>Cursando</td>
                                    <td id="ca_cursando">0</td>
                                    <td id="ct_cursando">0</td>
                                    <td id="t_cursando">0</td>
                                    <td id="p_cursando">0%</td>
                                </tr>
                                <tr class="a_cursar">
                                    <td>A Cursar</td>
                                    <td id="ca_a_cursar">0</td>
                                    <td id="ct_a_cursar">0</td>
                                    <td id="t_a_cursar">0</td>
                                    <td id="p_a_cursar">0%</td>
                                </tr>
                                <tr class="eletivas">
                                    <td>Eletivas</td>
                                    <td id="ca_eletivas">0</td>
                                    <td id="ct_eletivas">0</td>
                                    <td id="t_eletivas">0</td>
                                    <td id="p_eletivas">N/A</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
                document.body.appendChild(container);
    
                // Variáveis de controle
                let creditos = {
                    cursadas: { aula: 0, trabalho: 0 },
                    cursando: { aula: 0, trabalho: 0 },
                    a_cursar: { aula: 0, trabalho: 0 },
                    eletivas: { aula: 0, trabalho: 0 }
                };
    
                let totalCreditosManual = { aula: 0, trabalho: 0 };
                let manualCounting = false;
    
                // Função para calcular créditos automaticamente
                async function obterCreditos(codigoDisciplina) {
                    let url = `https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=${codigoDisciplina}`;
                
                    try {
                        let resposta = await fetch(url);
                        let html = await resposta.text();
                
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(html, "text/html");
                
                        let creditosAula = 0;
                        let creditosTrabalho = 0;
                
                        // Percorre todas as células da tabela para encontrar os créditos
                        let celulas = Array.from(doc.querySelectorAll("td"));

                        for (let i = 0; i < celulas.length; i++) {
                            let texto = celulas[i].textContent.trim();
                
                            if (texto.includes("Créditos Aula")) {
                                creditosAula = parseInt(celulas[i + 1]?.textContent.trim() || "0");
                            } 
                            if (texto.includes("Créditos Trabalho")) {
                                creditosTrabalho = parseInt(celulas[i + 1]?.textContent.trim() || "0");
                            }                            
                        }
                
                        return { aula: creditosAula, trabalho: creditosTrabalho };
                
                    } catch (erro) {
                        console.error(`Erro ao obter créditos da disciplina ${codigoDisciplina}:`, erro);
                        return { aula: 0, trabalho: 0 };
                    }
                }
                
                
                async function calcularCreditosAutomaticamente() {
                    let disciplinas = Array.from(document.querySelectorAll("#grade_curricular td[role='gridcell']"))
                        .filter(celula => celula.textContent.trim() !== "");

                    console.log(disciplinas);
                
                    let disciplinasProcessadas = new Set();
                    let totalAulas = { cursadas: 0, cursando: 0, a_cursar: 0, eletivas: 0 };
                
                    for (let i = 0; i < disciplinas.length; i++) {
                        let celula = disciplinas[i];
                        let bgColor = window.getComputedStyle(celula).backgroundColor;
                
                        let codigoDisciplina = celula.innerHTML;
                
                        let categoria;
                        if (celula.classList.contains("disciplinaCursada")) categoria = "cursadas";
                        else if (celula.classList.contains("disciplinaCursando")) categoria = "cursando";
                        else if (celula.classList.contains("disciplinaA_Cursar")) categoria = "a_cursar";
                        else if (celula.classList.contains("discplinaEletivas")) categoria = "eletivas";
                        else continue;
                
                        if (!disciplinasProcessadas.has(codigoDisciplina)) {
                            let { aula, trabalho } = await obterCreditos(codigoDisciplina);
                
                            console.log("disciplina " + codigoDisciplina + " tem " + aula + " creaula e " + trabalho + " crtrabalho");

                            creditos[categoria].aula += aula;
                            creditos[categoria].trabalho += trabalho;

                            totalAulas[categoria] += aula;
                            disciplinasProcessadas.add(codigoDisciplina);
                
                            document.getElementById(`ca_${categoria}`).textContent = creditos[categoria].aula;
                            document.getElementById(`ct_${categoria}`).textContent = creditos[categoria].trabalho;
                            document.getElementById(`t_${categoria}`).textContent = creditos[categoria].aula + creditos[categoria].trabalho;
                        }
                    }
                
                    let creditosTotaisAula = totalAulas.cursadas + totalAulas.cursando + totalAulas.a_cursar;
                    document.getElementById(`p_cursadas`).textContent = (totalAulas.cursadas / creditosTotaisAula * 100).toFixed(2) + "%";
                    document.getElementById(`p_cursando`).textContent = (totalAulas.cursando / creditosTotaisAula * 100).toFixed(2) + "%";
                    document.getElementById(`p_a_cursar`).textContent = (totalAulas.a_cursar / creditosTotaisAula * 100).toFixed(2) + "%";
                }
    
                // Contagem manual ao clicar nas disciplinas
                document.querySelectorAll("#grade_curricular td[role='gridcell']").forEach(celula => {
                    let bgColor = window.getComputedStyle(celula).backgroundColor;
                    if (bgColor === "rgb(0, 192, 0)") celula.classList.add("disciplinaCursada");
                    else if (bgColor === "rgb(255, 255, 128)") celula.classList.add("disciplinaCursando");
                    else if (bgColor === "rgb(255, 160, 96)") celula.classList.add("disciplinaA_Cursar");
                    else if (bgColor === "rgb(192, 192, 192)") celula.classList.add("discplinaEletivas");

                    celula.addEventListener("click", async function() {
                        if (!manualCounting) return;

                        let codigoDisciplina = celula.innerHTML;
    
                        let { aula, trabalho } = await obterCreditos(codigoDisciplina);

                        setTimeout(() => {
                            totalCreditosManual.aula += aula;
                            totalCreditosManual.trabalho += trabalho;
    
                            document.getElementById("manual_aula").textContent = totalCreditosManual.aula;
                            document.getElementById("manual_trabalho").textContent = totalCreditosManual.trabalho;
                            document.getElementById("manual_total").textContent = totalCreditosManual.aula + totalCreditosManual.trabalho;
                        }, 5);
                    });
                });
    
                // Botões
                document.getElementById("iniciarCalculo").addEventListener("click", calcularCreditosAutomaticamente);
                document.getElementById("limparCalculo").addEventListener("click", () => {
                    Object.keys(creditos).forEach(categoria => {
                        creditos[categoria].aula = 0;
                        creditos[categoria].trabalho = 0;
                        document.getElementById(`ca_${categoria}`).textContent = "0";
                        document.getElementById(`ct_${categoria}`).textContent = "0";
                        document.getElementById(`t_${categoria}`).textContent = "0";
                        document.getElementById(`p_${categoria}`).textContent = "0%";
                    });
                });
                document.getElementById("iniciarManual").addEventListener("click", () => {
                    manualCounting = true;
                    document.getElementById("manualCountingStatus").innerHTML = "Habilitada";
                    document.getElementById("manualCountingStatus").classList.add("habilitada");
                    document.getElementById("manualCountingStatus").classList.remove("desabilitada");
                });
                document.getElementById("pararManual").addEventListener("click", () => {
                    manualCounting = false;
                    document.getElementById("manualCountingStatus").innerHTML = "Desabilitada";
                    document.getElementById("manualCountingStatus").classList.add("desabilitada");
                    document.getElementById("manualCountingStatus").classList.remove("habilitada");
                });
                document.getElementById("limparManual").addEventListener("click", () => {
                    totalCreditosManual = { aula: 0, trabalho: 0 };
                    document.getElementById("manual_aula").textContent = "0";
                    document.getElementById("manual_trabalho").textContent = "0";
                    document.getElementById("manual_total").textContent = "0";
                });
    
            }, 2000);
    
        }
    } else if (urlAtual.startsWith("gradeHoraria", 37)){
        funcaoAtual = "gradeHoraria";
    }

})();