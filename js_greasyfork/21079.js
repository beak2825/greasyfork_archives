// ==UserScript==
// @name         Hacker Experience Utils
// @namespace    https://greasyfork.org/en/users/52481-gusd-nide
// @version      1.1
// @description  Remover MSG HE2; Auto BTC Compras; Auto Log Edit;
// @match        http://*.hackerexperience.com/*
// @match        http://hackerexperience.com/*
// @match        https://*.hackerexperience.com/*
// @match        https://hackerexperience.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @author       gusdnide
// @downloadURL https://update.greasyfork.org/scripts/21079/Hacker%20Experience%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/21079/Hacker%20Experience%20Utils.meta.js
// ==/UserScript==
var Usuario_Conta = ""//Escreva o id da sua conta aqui
var Usuario_IP = GM_getValue("bot_userip", "");
var Bot_btcPreco = GM_getValue("bot_btcpreco", "");
var Usuario_Dinheiro = GM_getValue("bot_userdin", "");
var SuaAssinatura = `
──────────────── ────██
────────────────────█─░█
────────────────────█───█
────────────────────█───█
────────────────────█───█
────────────────────█───█
────────────────────█───█▓
────────────────────█───▓█
────────────────────█───░█
────────────────────█───░█
────────────────────█░░░─█
─────────────▓███──██▓▓███
─────────────██──▓██▓────██
─────────────█▓────█▓─────▓█
─────────────█▓─────█──────░█
████████─────█▓─────█────────█
██████████▓███░──────█──█▓────█
██░░░░░░██───────────█░███────█▓
▓████████─────────────█▓██────██
█████████░────────────────────▓█
▓████████░────────────────────░█
▓████████░────────────────────▓█
▓████████░────────────────────█▓
▓████████░────────────────────█
▓████████░───────────────────██
▓█████░██░──────────────────█
▓█████──████████████████████
█████████
       by gusdzika
        `;
if (window.self !== window.top) return;

Array.prototype.contains = function(s) {
    return this.indexOf(s) !== -1;
};
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

function InGame() {
    if (document.getElementById("login-form") === null) {
        return true;
    } else {
        return false;
    }
}

var node = document.getElementById("he2");
if (node !== undefined) {
    node.remove();
}



function MandarRequest(Metodo, Pagina, Parametros, Retorno, XmlAdc) {
    var xmlhttp = new XMLHttpRequest();
    var Resultado = "";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            Resultado = xmlhttp.responseText;
        }
    };
    if (Metodo === "POST") {
        xmlhttp.open(Metodo, Pagina, Retorno);
    } else {
        xmlhttp.open(Metodo, Pagina + Parametros, Retorno);
    }

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlhttp.setRequestHeader("Accept", "*/*");
    if (XmlAdc) {
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    }
    if (Metodo === "POST") {
        xmlhttp.send(Parametros);
    } else {
        xmlhttp.send();
    }
    return Resultado;
}

function ComprarBitcoins(Conta, Quantidade) {
    MandarRequest("POST", "bitcoin.php", "func=btcBuy&amount=" + Quantidade + "&acc=" + Conta, false, true);
}

function BuscarBtcPreco() {
    var ResultadoReq = MandarRequest("POST", "bitcoin.php", "func=btcBuy", false, true);
    var Valor = "";
    try {
        Valor = JSON.parse(JSON.parse(ResultadoReq).msg)[0].value;
    } catch (error) {
        console.log(error.message);
    }
    return Valor;
}

function Main() {

    if (!InGame()) {
        return;
    }
    if (Usuario_Conta === "") {
        var Logado = confirm("Você verificou si voce já esta logado com a sua conta btc?");
        if (!Logado) {
            confirm("Desative o bot, e logue na conta btc!");
            return;
        }
        var UsuarioConta = prompt("Digite uma conta de banco! (obs: sem o #)", "4645546564");
        var prg = confirm("Voce tem certesa que sua conta ér:" + UsuarioConta.replace("#", ""));
        if (!prg) {
            location.reload();
            return;
        }
        Usuario_Conta = UsuarioConta.toString();
        Editar("bot_userconta", Usuario_Conta.toString());
    }
}

function Editar(variavel, valor) {
    GM_setValue(variavel, valor);
}

function Pegar(variavel) {
    return GM_getValue(variavel, "");
}


Main();

setTimeout(function() {
    var s = "\n" + $(".logarea").text();
    if (s !== "" && s !== SuaAssinatura) {
        $(".logarea").val(SuaAssinatura);
        $("form.log").submit();
    }
}, 1);
setTimeout(function() {
    if (Usuario_IP === "") {
        Usuario_IP = document.getElementsByClassName("header-ip-show")[0].innerText.trim();
        Editar("bot_userip", Usuario_Conta.toString());
    }
}, 500);
setTimeout(function() {
    if (location.pathname == "index") {
        location.href = ("https://" + location.host + "/software");
    }
    Usuario_Dinheiro = document.getElementsByClassName("small nomargin green header-finances")[0].innerText.replace("$", "").replace(".", "").replace(",", "").trim();
    Editar("bot_userdin", Usuario_Dinheiro.toString());
    Bot_btcPreco = BuscarBtcPreco();
    Editar("bot_btcpreco", Bot_btcPreco.toString());
}, 600);
setTimeout(function() {
    var v1 = parseInt(Usuario_Dinheiro.toString());
    var v2 = parseInt(Bot_btcPreco.toString());
    if (v1 > v2) {
        var Quantidade = Math.floor(v1 / v2);
        if (Quantidade > 0) {
            ComprarBitcoins(Usuario_Conta.toString(), Quantidade.toString());
        }
    }
}, 800);