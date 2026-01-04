// ==UserScript==
// @name         Soma de Pares e Ímpares
// @namespace    https://exemplo.com/
// @version      1.0
// @description  Calcula a soma de números pares e ímpares até um valor inserido pelo usuário
// @author       EmersonxD
// @license      MIT
// @include      https://chat.openai.com/chat/*  
// @downloadURL https://update.greasyfork.org/scripts/464371/Soma%20de%20Pares%20e%20%C3%8Dmpares.user.js
// @updateURL https://update.greasyfork.org/scripts/464371/Soma%20de%20Pares%20e%20%C3%8Dmpares.meta.js
// ==/UserScript==

// Função para obter um número inteiro positivo do usuário
function obterNumeroInteiroPositivo() {
    let numero;
    do {
        numero = parseInt(prompt("Digite um número inteiro positivo:"));
    } while (isNaN(numero) || numero <= 0);
    return numero;
}

// Função para calcular a soma dos números pares até o valor inserido
function calcularSomaPares(numero) {
    let soma = 0;
    for (let i = 2; i <= numero; i += 2) {
        soma += i;
    }
    return soma;
}

// Função para calcular a soma dos números ímpares até o valor inserido
function calcularSomaImpares(numero) {
    let soma = 0;
    for (let i = 1; i <= numero; i += 2) {
        soma += i;
    }
    return soma;
}

// Função principal para executar o script
function executarScript() {
    const numero = obterNumeroInteiroPositivo();
    const somaPares = calcularSomaPares(numero);
    const somaImpares = calcularSomaImpares(numero);
    console.log(`A soma dos números pares até ${numero} é: ${somaPares}`);
    console.log(`A soma dos números ímpares até ${numero} é: ${somaImpares}`);
}

// Chamar a função principal para executar o script
executarScript();
