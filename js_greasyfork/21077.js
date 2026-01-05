// ==UserScript==
// @name         HE Banco de Dados Grabber
// @namespace    https://greasyfork.org/en/users/52481-gusd-nide
// @version      1.0
// @description  Pega todo seu banco de dados e suas informaçoes
// @match        http://*.hackerexperience.com/*
// @match        http://hackerexperience.com/*
// @match        https://*.hackerexperience.com/*
// @match        https://hackerexperience.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/21077/HE%20Banco%20de%20Dados%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/21077/HE%20Banco%20de%20Dados%20Grabber.meta.js
// ==/UserScript==
if (window.self !== window.top) return;

Array.prototype.contains = function(s) {
    return this.indexOf(s) !== -1;
};
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

var g_IP = GM_getValue("gusd_IP", "");
var g_isRodando = GM_getValue("gusd_Rodando", "false") == "true";
var g_UltimaPage = GM_getValue("gusd_UltimaPage", 1);
var g_IpsSalvo = GM_getValue("gusd_Salvo", "");

function PegarIP() {
    var IPTeste = document.getElementsByClassName("header-ip-show")[0].innerText.trim();
    if (IPTeste !== null && IPTeste !== undefined && IPTeste !== "" && IPTeste !== " " && IPTeste !== g_IP) {
        g_IP = IPTeste;
        GM_setValue("gusd_IP", g_IP);
    }
}
setTimeout(function() {
    PegarIP();
}, 500);

function CriarGUI() {
    var NavBotoes = document.getElementsByClassName("nav btn-group")[0];
    var g_Botao = document.createElement('button');
    g_Botao.setAttribute("id", "btn_gusd");
    g_Botao.setAttribute("class", "btn btn-inverse");
    if (g_isRodando) {
        g_Botao.innerText = "Parar!";
    } else {
        g_Botao.innerText = "Pegar Ips";
    }
    NavBotoes.appendChild(g_Botao);
    document.getElementById("btn_gusd").addEventListener("click", btnClicado, false);
}

function UltimaFunc() {
    if (g_isRodando) {
        var d_div = document.createElement("div");
        d_div.innerHTML = "<center><textarea style=\"width:80%\" rows=\"50\">"  + g_IpsSalvo + "</textarea></center>";
        d_div.setAttribute("style", "position:fixed;bottom:0;left:0;top:0;right:0;font-size:20px;background:blue;border:3pxoutsetblack;margin:5px;opacity:0.9;z-index:222;padding:2px2px;text-align:center;");
        document.body.appendChild(d_div);
    }
    g_isRodando = false;
    GM_setValue("gusd_Rodando", g_isRodando.toString());
    LimparIPDB();
    document.getElementById("btn_gusd").innerText = "Pegar Ips";

}

function GerarLogIP() {
    if (g_isRodando) {

        if (window.location.pathname == ("/list")) {
            if (PegarPagina() === "/list") {
                location.href = "https://" + window.location.host + "/list?page=" + g_UltimaPage;
                return;
            }

            var node = document.getElementsByClassName("span12")[0];
            if (node !== null && node !== undefined) {
                var Lista = document.getElementById("list");
                var Items = Lista.getElementsByTagName("li");

                for (var i = 0; i < Items.length; i++) {

                    var Item = Items[i];
                    var PrimeiraDiv = Item.getElementsByClassName("span4")[0];
                    var SegundaDiv = Item.getElementsByClassName("span4")[1];
                    var TerceiraDiv = Item.getElementsByClassName("span3")[0];
                    var PrimeiraDivIP = PrimeiraDiv.getElementsByClassName("list-ip")[0];
                    var IP = PrimeiraDivIP.getElementsByTagName("a")[0].getAttribute("href").replace("internet?ip=", "").trim();
                    var UserSenha = PrimeiraDiv.getElementsByClassName("list-user")[0].getElementsByClassName("small")[0].innerText + ":" + PrimeiraDiv.getElementsByClassName("list-user")[0].getElementsByClassName("small")[1].innerText;
                    var VirusInstalado = SegundaDiv.getElementsByClassName("list-virus")[0].innerText;
                    var Hadware = TerceiraDiv.getElementsByClassName("span6")[0].getElementsByClassName("small hide-phone")[0].innerText + ":" + TerceiraDiv.getElementsByClassName("span6")[0].getElementsByClassName("small hide-phone")[1].innerText;
                    var StrSalvar = "";
                    if(VirusInstalado == "Nenhum vírus instalado"){
                        StrSalvar += IP +/* "|" + UserSenha + "|" + VirusInstalado + "|" + Hadware +*/ "\n";
                        AdicionarIPDB(StrSalvar);
                    }
                }

                if (parseInt(PegarPagina()) == PegarMaxPage()) {
                    UltimaFunc();
                    return;
                } else {
                    g_UltimaPage++;
                    GM_setValue("gusd_UltimaPage", g_UltimaPage);
                    location.href = "https://" + window.location.host + "/list?page=" + g_UltimaPage;
                }
            }
        }else{
            location.href = "https://" + window.location.host + "/list?page=1";
            return;
        }
    } else {
        
    }
}

function PegarPagina() {
    var HostAtual = window.location.host;
    var PaginaAtual = window.location.href.replace(HostAtual, "").replace("/list?page=", "").replace("https://", "").replace("http://", "");
    return PaginaAtual.trim();
}

function AdicionarIPDB(ip) {
    if (g_isRodando) {
        g_IpsSalvo += ip;
        GM_setValue("gusd_Salvo", g_IpsSalvo);
    }
}

function PegarMaxPage() {
    var PageNav = document.getElementsByClassName("pagination alternate")[0];
    var Items = PageNav.getElementsByTagName("li");
    var Ultimo = 1;
    for (var i = 1; i < Items.length - 1; i++) {
        Ultimo = parseInt(Items[i].getElementsByTagName('a')[0].innerText.trim());
    }
    return Ultimo;
}

function LimparIPDB() {
    g_IpsSalvo = "";
    GM_setValue("gusd_Salvo", g_IpsSalvo);
    GM_setValue("gusd_UltimaPage", 1);

}

function btnClicado(e) {
    g_isRodando = !g_isRodando;
    GM_setValue("gusd_Rodando", g_isRodando.toString());

    if (!g_isRodando) {
        LimparIPDB();
    }
    location.reload();
}
CriarGUI();
PegarMaxPage();
GerarLogIP();