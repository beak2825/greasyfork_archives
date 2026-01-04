// ==UserScript==
// @name         O menino que roubava livros
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  try to take over the world!
// @author       You
// @match        jigsaw.minhabiblioteca.com.br/*
// @match        integrada.minhabiblioteca.com.br/*
// @run-at document-idle
// @noframes
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403099/O%20menino%20que%20roubava%20livros.user.js
// @updateURL https://update.greasyfork.org/scripts/403099/O%20menino%20que%20roubava%20livros.meta.js
// ==/UserScript==

function getValue(nome){
    return GM_getValue(nome);
}

function setValue(nome, valor){
    GM_setValue(nome, valor);
}

const proximaPagina = async (link) => {
    await sleep(15000);
    window.location.href = link
}

const download = async (nome) => {
    await sleep(1000 * getValue('sleep'));
    var link = document.createElement("a");
    link.download = nome;
    link.href = document.getElementsByTagName("iframe")[0].contentDocument.getElementById("pbk-page").src.replace(
        document.getElementsByTagName("iframe")[0].contentDocument.getElementById("pbk-page").src.split('/')[8],'2000');
    console.log(link.href);
    link.click();
    if (getValue('next') == 1){
        await sleep(500);
        setValue('pagina' , parseInt(getValue('pagina')) + 1);
        window.location.href = (document.baseURI.replace(document.baseURI.split("/")[6], getValue('pagina') + '!'));
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const perguntas = async () => {
    await sleep(10000);
    if (confirm("Quer salvar os dados do livro?")){
        setValue("book", document.baseURI.split("/")[5]);
        setValue("nome_do_livro", document.title.split(":")[1]);
        setValue("pagina", document.baseURI.split("/")[7].split("!")[0]);
        setValue("aba", 0);
        setValue('download', 0);
        setValue('next', 0);

        if (confirm("Quer baixar o livro automaticamente?")){
            setValue('download', 1);
            setValue('sleep', prompt('Quantos segundos a cada download para evitar falhas (Ex: 3)?'));
        }

        if (confirm("Quer redirecionar as páginas automaticamente?")){
            setValue('next', 1);
        }

        if (confirm("Podemos iniciar? (em uma nova guia!!!)")){
            getIframeSrc();
        }
    }else{
        setValue("book", document.baseURI.split("/")[4]);
        setValue('download', 0);
        setValue('next', 0);
    }
}

const getIframeSrc = async () => {
    await sleep(4000);
    window.open(document.getElementsByTagName("iframe")[1].src);
}

window.onload = function () {
    if (document.baseURI.substring(0,49 + getValue('book').length) == "https://integrada.minhabiblioteca.com.br/#/books/" + getValue("book")){
        console.log('pronto');
    } else if (document.baseURI.substring(0,44) == "https://jigsaw.minhabiblioteca.com.br/books/"){
        if (getValue('download') == 1){
            try {
                download(getValue('nome_do_livro') + " - pag. " + getValue('pagina') + ".png");
            } catch (e) {
                window.location.href = document.baseURI
            }
        }
        proximaPagina(document.baseURI);

    } else if (document.baseURI.split("/")[6] == "cfi") {
        perguntas();}
}





