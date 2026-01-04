// ==UserScript==
// @name         statusInvestFunctions
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Fornece funçoes de ajuda nos scripts
// @author       @josias-soares
// @license      MIT
// ==/UserScript==

function calcularDiasDecorridos(dataFornecida) {

    // Hoje
    const hoje = new Date();

    // Converte a data fornecida para um objeto Date
    const dataFornecidaDate = new Date(dataFornecida);

    // Calcula a diferença em milissegundos
    const diferencaEmMilissegundos = dataFornecidaDate - hoje;

    // Converte a diferença em dias
    const diasDecorridos = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

    return diasDecorridos;
}

function getDataHojeFormatada(){
    // Hoje
    const hoje = new Date();

    // Obtém o ano, mês e dia da data atual
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero (janeiro = 0)
    const dia = String(hoje.getDate()).padStart(2, '0');

    // Cria a string no formato 'YYYY-MM-DD'
    return `${ano}-${mes}-${dia}`;
}