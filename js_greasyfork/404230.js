// ==UserScript==
// @name        Sagrada Familia Plus
// @namespace   JMGK
// @match       https://acesso.sdp.org.br/sdpMentorWebG5/jsf/central/mensageria/*
// @grant       none
// @version     1.2
// @author      -
// @description Adiciona marcadores e lixeira ao sistema de mensagens do Colégio Sagrada Família de Blumenau/SC
// @license     GPL-2.0-or-later
// @copyright   2020, jmgk77 (https://openuserjs.org/users/jmgk77)
// @downloadURL https://update.greasyfork.org/scripts/404230/Sagrada%20Familia%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/404230/Sagrada%20Familia%20Plus.meta.js
// ==/UserScript==

//click no marcador
function mark() {
    var c = localStorage.getItem(this.id) || 0;
    c++;
    c %= m.length;
    localStorage.setItem(this.id, c);
    this.src = "data:image/svg+xml;utf-8," + m[c];
}

//click na lixeira (inbox)
function trash() {
    trash_generic(this.id);
    processa_inbox();
}

//click na lixeira (msg)
function trash_msg() {
    if (trash_generic(this.id)) {
        //adicionou, muda icone
        this.src = t[1];
    } else {
        //removeu, volta icone original
        this.src = t[0];
    }
}

//insere/deleta da lixeira
function trash_generic(i) {
    var r = true;
    var x = localStorage.getItem("TRASH") || "";
    i += ",";
    if (x.includes(i)) {
        x = x.replace(i, "");
        r = false;
    } else {
        x += i;
    }
    localStorage.setItem("TRASH", x);
    return r;
}

//click no menu
function inbox() {
    var i = localStorage.getItem("INBOX");
    this.innerHTML = (i == 1) ? "Ver Inbox" : "Ver Lixeira";
    i = (i == 1) ? 0 : 1;
    localStorage.setItem("INBOX", i);
    processa_inbox();
}

//processa mensagens na pagina
function processa_inbox() {
    var tr = document.getElementsByTagName("tr");
    if (!tr) return;
    for (var i = 0; i < tr.length; i++) {
        if (!tr[i].getAttribute("data-ri")) continue;
        //ja foi processado
        if (tr[i].sfmm) {
            var y = (tr[i].getElementsByTagName("img"))[0].id;
            var x = localStorage.getItem("TRASH") || "";

            //esta na lista da lixeira?
            var l = x.includes(y);

            //se estamos vendo a lixeira, inverte logica
            l = (localStorage.getItem("INBOX") == 1) ? l : !l;
            tr[i].style.display = (l == 1) ? "none" : "";
        } else {
            //processa
            tr[i].sfmm = 1;

            //pega div externo
            var d = (tr[i].getElementsByClassName("Container100"))[0];
            d.removeAttribute("style");
            //salva codigo e remove onclick antigo
            var c = (/remoteCommandSelecaoCaixaEntrada.+?value.+?(\d+)/gm.exec(d.onclick))[1];
            d.onclick = function() { return false; };

            //pega div interno (pela classe)
            d = (tr[i].getElementsByClassName("rept"))[0];
            var s = d.getElementsByTagName("span");
            //adiciona o estilo e onclick antigo no primeiro
            s[0].style.cursor = "pointer";
            s[0].onclick = new Function("localStorage.setItem('VIEW'," + c + ");remoteCommandSelecaoCaixaEntrada([{name:'mensagemEnviadaDestID',value:'" + c + "'}]);");

            //cria um novo element img (estrela)
            var n = document.createElement("img");
            n.id = c;
            n.style.float = "right";
            n.style.cursor = "pointer";
            n.onclick = mark;
            //bota marcador correspondente
            x = localStorage.getItem(c) || 0;
            n.src = 'data:image/svg+xml;utf-8,' + m[x];
            s[(s.length - 1)].appendChild(n);

            //cria um novo element img (lixo)
            n = document.createElement("img");
            n.id = c;
            n.style.float = "right";
            n.style.cursor = "pointer";
            n.onclick = trash;
            n.src = t[0];
            s[(s.length - 1)].appendChild(n);
        }
    }
}

//gera array de estrelas coloridas
var m = [];
var s = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M15 21l-6 3 1-7-5-5 7-1 3-7 3 7 7 1-5 5 1 7zm0 0" fill="white" stroke-width=".2" stroke="black"/></svg>';
m.push(s);
//escolhidas pela Marcela...
m.push(s.replace("white", "DeepPink"));
m.push(s.replace("white", "Cyan"));
m.push(s.replace("white", "BlueViolet"));

//lixeira
var t = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAiElEQVRIie2ROwqAMBAFR8U7eEYR7CwED+AFvJxgZW8tCLGxWEJijFG0yIOFJZ+ZfMCdCpgApdUMNEBygWFNaQDrVYcIxgPSArkYz4DumBvPAPJ6KuQkNnb6MPQfcX2qqwoJe/2JPhcknr23IDhREAVREAU3BavolWev7zcKen3RxWzAACxycAcbwC9ITbeDjwAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAdklEQVRIS2NkIAD+MzAAEX7AyMAARNgBTgmQcmIMB6mjmgUwg9AtJsoCYl1LKLhg8jBL4UFEcwuIdRmp6jAimRo+QY6TYW4ByKuwICOGjZ6CoHkENdqQ44AYQ5HVjFpAMD5Gg2g0iCBpYDSjodfRQ6+4Rm8AAACThZgZuRwx+gAAAABJRU5ErkJggg=="
];

//estamos vendo a caixa ou a mensagem?
var u = window.location.pathname;
if (u.includes("caixaMensagemCon.jsf")) {
    //adiciona inbox/lixeira no menu
    var n = document.createElement("a");
    n.style.background = "#DAE8EF";
    n.onclick = inbox;
    n.innerHTML = "Ver Lixeira";
    document.getElementById("toggleEllipsisOpcoes").appendChild(n);
    localStorage.setItem("INBOX", 1);

    //adiciona marcardor/lixeira em cada msg (roda a cada 3s)
    setInterval(function() {
        processa_inbox();
    }, 1000);
} else if (u.includes("mensagem.jsf")) {
    //adiciona marcardor/lixeira na msg
    var c = localStorage.getItem("VIEW");
    if (c) {
        //encontra cabeçalho da mensagem
        var p = document.querySelector('[id^="formPrincipal:j_idt"]');

        //cria um novo elemento img (lixo)
        n = document.createElement("img");
        n.id = c;
        n.style.float = "right";
        n.onclick = trash_msg;
        //ja está na lixeira?
        n.src = t[(localStorage.getItem("TRASH") || "").includes(c) ? 1 : 0];
        p.insertBefore(n, p.childNodes[0]);

        //cria um novo elemento img (estrela)
        n = document.createElement("img");
        n.id = c;
        n.style.float = "right";
        n.onclick = mark;
        //bota marcador correspondente
        var x = localStorage.getItem(c) || 0;
        n.src = 'data:image/svg+xml;utf-8,' + m[x];
        p.insertBefore(n, p.childNodes[0]);
    }
}