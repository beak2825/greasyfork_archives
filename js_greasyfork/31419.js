// ==UserScript==
// @name         PRF - Lib - Valida CPF CNPJ
// @namespace    br.gov.prf.scripts.lib.validacpfcnpj
// @description  Biblioteca para valida CPF e CNPJ
// @version      1.2
// @author       Marcelo Barros
// @grant        none
// ==/UserScript==

'use strict';

let pesoCPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
let pesoCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcularDigito(str, peso) {
    let soma = 0;
    for (let indice = str.length - 1, digito; indice >= 0; indice--) {
        digito = str.substr(indice, 1);
        soma += digito * peso[peso.length - str.length + indice];
    }
    soma = 11 - soma % 11;
    return soma > 9 ? 0 : soma;
}

function isValidDocument(document, tamanho, peso) {
    if (tamanho) {
        if (!document || document.length !== tamanho)
            return false;
        let raizDocument = document.substring(0, tamanho - 2);
        let digito1 = calcularDigito(raizDocument, peso);
        let digito2 = calcularDigito(raizDocument + digito1, peso);
        return document === raizDocument + digito1 + digito2;
    } else {
        return isValidCPF(document) || isValidCNPJ(document);
    }
}

function isValidCPF(cpf) {
    return isValidDocument(cpf, 11, pesoCPF);
}

function isValidCNPJ(cnpj) {
    return isValidDocument(cnpj, 14, pesoCNPJ);
}