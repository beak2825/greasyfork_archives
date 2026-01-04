// ==UserScript==
// @name         AllInOne
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AllInOne - Super Pacotão de Scripts
// @author       VSCoutinho
// @match        */*
// @icon         https://static-00.iconduck.com/assets.00/clock-stop-icon-256x256-evvlirzq.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470112/AllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/470112/AllInOne.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.InjetarAlertaNoSite = function (){
        // Injeta Js do [ SWEET ALERT 2 ]
        const script = document.createElement('script')
        script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/sweetalert2@11')
        script.setAttribute('async', '')
        script.onload = function handleScriptLoaded() {}
        script.onerror = function handleScriptError() {}
        document.head.appendChild(script)
    }
    InjetarAlertaNoSite();
        window.TotalTasks = 0
        window.UrlParaBurlar = document.baseURI;
        window.NumeroContador = 0;
        window.IndicesTrabalhos = [];
        window.NumeroContador2=-1;
        window.MostrarLog = function (mlog){
            //console.log(mlog);
        }

        window.sleep = time => new Promise(resolve=>{
            setTimeout(resolve, time);
        });
        function downpage(){
            window.scrollTo( 0, 100000 );
        }
        window.removetitle = function (numtitle){
            var num = numtitle;
            document.getElementsByClassName("titulopost")[num].innerHTML="[ - Titulo Copiado - ]"
            }

        window.pegarurl = function (numero2,href,titulo){
            var numero = numero2+1;
            var createA = document.createElement('a');
            var createAText = document.createTextNode("> URL --> [ "+numero+" ] --> ");
            createA.setAttribute('href', href);
            createA.appendChild(createAText);
            document.body.appendChild(createA);
            span(titulo,numero2);
            
            }
                 
            window.geraStringAleatoria = function (tamanho) {
                    var stringAleatoria = '';
                    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    for (var i = 0; i < tamanho; i++) {
                        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                    }
                    return stringAleatoria;
                }
                 
                window.antispam = ('#ANTISPAM_'+geraStringAleatoria(7)); 
                 
                 
                window.exploitsprout = function (classet,numeroid){
                try {
                var ExisteClasse = document.getElementsByClassName(classet)[numeroid]
                if (typeof ExisteClasse == 'undefined'){return false;}
                var numid = numeroid+1;
                var str =  document.getElementsByClassName(classet)[numeroid].innerHTML;
                var tit =  document.getElementsByClassName(classet)[numeroid].innerText;
                var patt = /<a[^>]*href=["']([^"']*)["']/g;
                var match = "";
                while(match=patt.exec(str)){
                var resultado=(match[1]+antispam);
                console.log("Url "+numid+" - "+resultado);
                console.log("Titulo "+numid+" : " +tit); 
                console.log("Classe : "+classet);
                console.log(""); 
                pegarurl(numeroid,resultado,tit);
                }} catch(err) {}
                }
                function setCookie(name,value,days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days*24*60*60*1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                }
                function getCookie(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for(var i=0;i < ca.length;i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' ') c = c.substring(1,c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                    }
                    return null;
                }
                function eraseCookie(name) {   
                    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
                window.listurl = function (classeurl){
                NumeroContador2=0
                while (NumeroContador2<11){
                    exploitsprout(classeurl,NumeroContador2);
                    NumeroContador2++;
                }
                }

                function quebralinha(){
                    var createABR = document.createElement('br');
                    var createATextBR =document.createTextNode("");
                    createABR.appendChild(createATextBR);
                    document.body.appendChild(createABR);
                    }

            window.span = function (titulo,numid){
                var createASPAN = document.createElement('span');
                var createATextSPAN =document.createTextNode(titulo);
                createASPAN.setAttribute('class', 'titulopost')
                createASPAN.setAttribute('onclick', 'copiarTexto("'+titulo+'");removetitle('+numid+')');
                createASPAN.appendChild(createATextSPAN);
                document.body.appendChild(createASPAN);
                quebralinha();
                downpage()
                }

            window.tipo01 = /"https:..\/...((.*?)*)"/gm
            window.tipo02 = /"https(.*?)"/gm
            window.tipo03 = /"http(.*?)"/gm

        window.decode = function (str) {
            let txt = document.createElement("textarea");
            txt.innerHTML = str;
            return txt.value;
        }

        window.AtualizarHTML = function (tag){
            document.getElementsByTagName('html')[0].getElementsByTagName(tag)[0].outerHTML=HtmlDoSite.getElementsByTagName(tag)[0].outerHTML
        }

        window.BuscarUrl = function (tipo,codigo){
            try {
                window.URLcodigo=decode(codigo);
                window.ResultadoCodigo = codigo.match(tipo).join("");
                window.SeAchei= "http";
                    if (window.ResultadoCodigo!=""){
                        window.document.title= "[STOPHT] REDIRECIONANDO..."
                        ResultadoCodigo = ResultadoCodigo.replaceAll('"','');
                        window.location= ResultadoCodigo;
                    }
            } catch(err) {}
        }



// Função - Alerta do Script ( Exibe o Valor da Variavel )
window.Alerta = async function (Variavel) {


    if (PararExecucao==true) {
        return false
    }
    await sleep(2000)
    var codigovar = Variavel.trim()
    Swal.fire({
        title: 'Aperte No Botão Abaixo Para Copiar o Codigo',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Copiar Codigo',
        }).then((result) => {
        if (result.isConfirmed) {
        copiarTexto(codigovar);
        Swal.fire('O Codigo do Empregador Foi Copiado!', 'Codigo : '+codigovar, 'success')
        }
        })
        
    
    window.PararExecucao=true;
}
    window.CheckMode = async function(){
        if (document.querySelector(".jobs__item.jobs__item--client-starter") !=null){
                window.CLASSEl="jobs__item jobs__item--client-starter"
                window.CLASSENumEmpregador = "jobs__item-cell jobs__item-cell--success text-center mr-auto"
                window.CLASSEAddName = "js-job-item-name"
                
        } else {
            window.CLASSEl="job-bar job-bar--expanded job-bar--client-starter"
            window.CLASSENumEmpregador = "jobs__item-cell jobs__item-cell--success text-center p-0"
            window.CLASSEAddName = "js-job-item-name"
        }

        await sleep(2000)
        }
        
    

        window.PararExecucao = false;

    window.CriarSpan = function (Texto, Id) {
        // Menu No Topo
        var sp1 = document.createElement('span')
        sp1.setAttribute('id', Id)
        sp1.innerText = Texto
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.Quebradelinha = function () {
        var sp1 = document.createElement('br')
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.CriarDiv = function (Texto, Id, Id2, style1, style2) {
        if (document.getElementById(Id) != null) {
            return false
        }
        var sp1 = document.createElement('div')
        sp1.setAttribute('id', Id)
        sp1.setAttribute('style', style1)
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
        CriarDentro(Texto, Id, Id2, style2)
    }
    window.AtualizarTotal = setInterval(function () {
        var totalvar =window.CLASSEl
        window.total = document.getElementsByClassName(totalvar).length;
        
    }, 2000);

    window.RepetirAteAcharTodos = setInterval(function () {
        if (NumeroContador != total){
            while (NumeroContador < total) {
                extractinfo(NumeroContador);
                NumeroContador++;
            }
        }
    }, 3000);

    window.extractinfo = function (indicehtml) {
        window.Globalvalorindice = indicehtml
        try {
        window.el = document.getElementsByClassName(CLASSEl)[indicehtml];
        window.numeroempregado = el.getElementsByClassName(CLASSENumEmpregador)[0].innerText
        window.IDDOTRABALHO = el.dataset.jobId;
                if (window.document.location.host == "sproutgigs.com"){
                    window.CategoriaSelecionada=document.getElementById("dropdownMainCategory")
                    window.SeValorExiste = CategoriaSelecionada.getElementsByTagName("span")[0].innerHTML;
                    if (SeValorExiste=="SEO + Promote Content + Search + Engage"){
                        if (IndicesTrabalhos.indexOf(IDDOTRABALHO) >= 0) {
                            return false
                        }
                    }
                }
                if (window.document.location.host == "sproutgigs.com"){
                    window.CategoriaSelecionada=document.getElementById("dropdownMainCategory")
                    window.SeValorExiste = CategoriaSelecionada.getElementsByTagName("span")[0].innerHTML;
                    if (SeValorExiste!="SEO + Promote Content + Search + Engage"){
                            return false

                    }
                }
        var site = ("https://sproutgigs.com/jobs/job-details.php?Id=" + IDDOTRABALHO)
        IndicesTrabalhos.push(IDDOTRABALHO)
        fetch(site).then(response => response.text())
            .then(result => scraping(result, "text/html", indicehtml))
        window.scraping = function scraping(string_html, content_type,indicehtml) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(string_html, content_type)
            try {
                window.nomeempregador = doc.querySelector(".py-0.text-decoration-none.fw-light.text-inherit").innerText;
                addname(indicehtml, nomeempregador.trim());

            }
            catch (err) {window.IndicesTrabalhos.push(IDDOTRABALHO)}
            
            
        }
        return console.log("Nome do Empregado : " + nomeempregador.trim() + ", JOBID = " + IDDOTRABALHO);
    } catch(err){window.IndicesTrabalhos.push(IDDOTRABALHO)}}
    window.addname =function (id, empregador) {
        try {
            document.getElementsByClassName(CLASSEAddName)[id].innerHTML = "<h3>" + empregador.trim() + "</h3>";
        }
        catch (err) {
            extractinfo(id)
            window.IndicesTrabalhos.push(IDDOTRABALHO)
        }
    }

    window.CriarBotao = function CriarBotao(ID, Texto, Onclick) {
        if (document.getElementById(ID) != null) {
            return false
        }
        var sp1 = document.createElement('button')
        sp1.setAttribute('onclick', Onclick)
        sp1.setAttribute('id', ID)
        sp1.innerText = Texto
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.CriarDentro = function (Texto, Id, Id2, style) {
        const script = document.createElement('div')
        script.setAttribute('id', Id2)
        script.innerText = Texto
        script.setAttribute('style', style)
        document.getElementById(Id).appendChild(script)
    }

    window.copiarTexto = function (textou) {
        const texto = textou
        var code = ''
        let inputTest = document.createElement('input')
        inputTest.value = texto
        document.body.appendChild(inputTest)
        inputTest.select()
        document.execCommand('copy')
        document.body.removeChild(inputTest)
    }




    window.AlertaS = function (Mensagem) {
        console.log('JOBTURBO DIZ : ' + Mensagem)
        Swal.fire('BOT ( JOBTURBO )', '' + Mensagem, 'success')
    }
    window.CheckCodeCookie=async function(){ 
        window.postlimit= getCookie("postlimit");
        window.postview= getCookie("postview");
        await sleep(2000)
        if (postlimit != postview) {
            if(postlimit==0){
                return false
            
            }
        setCookie('postview',postlimit,1)
        setCookie('postlimit',postlimit,1)
        setCookie('codeview','1',1)
        window.location.reload()
        }
        
    }

    window.ZerarTimer= function () {
        try {
        if (counter != null) {
            counter = 0
        }
        } catch (err) {}
        try {
        if (timer != null) {
            timer = 0
        }
        } catch (err) {}
        try {
        if (timeleft != null) {
            timeleft = 0
        }
        } catch (err) {}
        try {
        if (timeleft != null) {
            timeleft = 0
        }
        } catch (err) {}
        try {
        if (seconds_left != null) {
            seconds_left = 0
        }
        } catch (err) {}
        try {
        josscode_showcode()
        } catch (err) {}
        try {
        $('.timer .count').text('1')
        } catch (err) {}

        try {
        var codigo =
            document.body.getElementsByClassName('button').download.innerText
        if (codigo != null) {
            Alerta(codigo)
        }
        } catch (err) {}
    }

    window.RepeatCode= function () {

        showinvisibility('next-page-btn')
        ZerarTimer()
    }
    setInterval(RepeatCode, 1900)

    window.BuscarNoCodigo = function(tipovar, achado) {
    window.exit = false;

        try {
            if (code != 'undefined' && typeof code[0] === 'string') {
                Alerta(code)
                exit = true
        }
        } catch (err) {}
        try {
            if (cod != 'undefined' && typeof cod[0] === 'string') {
                Alerta(cod)
                exit = true
            }
        } catch (err) {}
        try {
            if (result != 'undefined' && typeof result[0] === 'string') {
            Alerta(result)
            exit = true
            }
        } catch (err) {}

        var tipoescolhido = ''
        var tipo1 = /[v][a][r][ ][c][o][d][e][ ][=][ ]["](.*?)["]/gm
        var tipo2 = /[v][a][r][ ][c][o][d][e][ ][=][ ]['](.*?)[']/gm
        var tipo3 = /[c][o][n][s][t][ ][c][o][d][e][ ][=][ ]['](.*?)['][;]/gm
        //var tipo4 = /const code...'\w+'|$/gm
        var tipo5 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]['][d][e][l][a][y][M][s][g]['][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]['](.*?)['][;]/gm
        var tipo6 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]["][t][i][m][e][r]["][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]['](.*?)[']|$/gm
        var tipo7 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]["][t][i][m][e][r]["][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]["](.*?)["]/gm

        if (tipovar == 1) {
            tipoescolhido = tipo1
        }
        if (tipovar == 2) {
            tipoescolhido = tipo2
        }
        if (tipovar == 3) {
            tipoescolhido = tipo3
        }
        if (tipovar == 4) {
            tipoescolhido = tipo4
        }
        if (tipovar == 5) {
            tipoescolhido = tipo5
        }
        if (tipovar == 6) {
            tipoescolhido = tipo6
        }
        if (tipovar == 7) {
            tipoescolhido = tipo7
        }

try {
    var htmlfonte = document.body.innerHTML
    if (htmlfonte.indexOf(achado) >= 0 || exit == false) {
        exit = true
        var codigor = htmlfonte.match(tipoescolhido).join('')
        if (codigor !== '') {
            codigor = codigor.replaceAll('innerHTML', '')
            codigor = codigor.replaceAll('const code', '')
            codigor = codigor.replaceAll('=', '')
            codigor = codigor.replaceAll('"', '')
            codigor = codigor.replaceAll("'", '')
            codigor = codigor.replaceAll('Code', '')
            codigor = codigor.replaceAll(':', '')
            codigor = codigor.replaceAll('document.getElementById(timer).', '')
            codigor = codigor.replaceAll('document.getElementById(delayMsg).', '')
            codigor = codigor.replaceAll(";","")
            codigor = codigor.replaceAll("Please wait to get the code <span idcountDown>240</span> seconds.... ","")
            Alerta(codigor)
            exit = true
        }
    }
    } catch (err) {}
}

    window.showinvisibility = function (Valor) {
        var classe = '.' + Valor
        var id = '#' + Valor
        try {
            document.getElementById(Valor).style.visibility = 'visible'
        } catch (err) {}
        try {
            document.getElementById(Valor).style.display = ''
        } catch (err) {}
        try {
            document.getElementById(Valor).style.display = ''
        } catch (err) {}
        try {
            $(classe).css('display', '')
        } catch (err) {}
        try {
            $(classe).show()
        } catch (err) {}
        try {
            $(id).css('display', '')
        } catch (err) {}
        try {
            $(id).show()
        } catch (err) {}
    }

window.onload = function () {
    CheckMode();
    CheckCodeCookie();
    listurl("article-loop asap-columns-3");
    listurl("post-box-title");
    listurl("entry-title");
    listurl("post-title");
    listurl("meta-footer-thumb");
    quebralinha();quebralinha();quebralinha();quebralinha();quebralinha();

    fetch(UrlParaBurlar)
        .then((resp)=>resp.text())
        .then(result => FiltrarResultado(result, "text/html"))
            window.FiltrarResultado = function (string_html, content_type) {
                window.parser = new DOMParser();
                window.doc = parser.parseFromString(string_html, content_type)
                    try {

                        window.SeguirAOrdem = function(){
                            try{
                                window.SegundosAntesDoCodigoAparecer=1;
                                window.HtmlDoSite= doc.getElementsByTagName('html')[0]
                                MostrarLog(HtmlDoSite)
                                window.HurryTimer = doc.querySelector('.hurrytimer-campaign');
                                MostrarLog(HurryTimer)
                                window.AtributoContendoCodigoOuUrl = window.HurryTimer.dataset.config
                                MostrarLog(AtributoContendoCodigoOuUrl)
                                window.DataSetConfigParaPegarAtributo = window.HurryTimer.dataset.config;
                                try{BuscarUrl(tipo01,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                try{BuscarUrl(tipo02,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                try{BuscarUrl(tipo03,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                MostrarLog(window.DataSetConfigParaPegarAtributo)
                                window.JSONDoDataSet = JSON.parse(window.DataSetConfigParaPegarAtributo)
                                MostrarLog(window.JSONDoDataSet)
                                window.TimerDuration = window.JSONDoDataSet.duration
                                MostrarLog(TimerDuration)
                                window.HtmlNovoDoSite = window.HtmlDoSite.querySelector(".hurrytimer-campaign").dataset.config.replaceAll(TimerDuration,SegundosAntesDoCodigoAparecer)
                                window.HtmlDoSite.querySelector(".hurrytimer-campaign").dataset.config = window.HtmlNovoDoSite
                                AtualizarHTML("head");
                                AtualizarHTML("body");
                            }catch(err){}
                        }
                    } catch(err){console.log(err.message)}
                        try{SeguirAOrdem()}catch(err){}
        }
}

        BuscarNoCodigo(1, 'var code = "')
        BuscarNoCodigo(2, "var code = '")
        BuscarNoCodigo(3, 'const code')
        // BuscarNoCodigo(4, 'const code')
        BuscarNoCodigo(5, "getElementById('delayMsg').innerHTML")
        BuscarNoCodigo(6, 'document.getElementById("timer").innerHTML')
        BuscarNoCodigo(7, 'document.getElementById("timer").innerHTML')

        showinvisibility('button')
        showinvisibility('download_link')

    window.INJECTJS = function () {
        try {
            document.getElementsByClassName('notif_alert')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[1].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[2].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[3].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[1].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[2].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[3].remove()
        } catch (err) {}
        }
    setInterval(INJECTJS, 1500)

    }
)();