// ==UserScript==
// @name         1doc
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  mod 1doc!
// @license       MIT
// @author       Dione
// @match        https://rolandia.1doc.com.br/?pg=doc/*
// @match        https://rolandia.1doc.com.br/?pg=painel/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.3.3/papaparse.min.js
// @resource     csv  https://drive.google.com/uc?export=download&id=1CcJqb-Fk-AG4iN46oNrGtDWk0ECmN0Q5
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/430668/1doc.user.js
// @updateURL https://update.greasyfork.org/scripts/430668/1doc.meta.js
// ==/UserScript==

// contats alt. com wp https://drive.google.com/uc?export=download&id=1WLdEKU5roDkJN_KGaJUKsu-6-0t_nJbj
//identificador	nome	email	email2	cpf_cnpj	funcao	data_nasc	telefone	telefone2

(function() {
    'use strict';
    var paginaAtual = window.location.href;

    var divTitFixa = document.querySelectorAll('.tit')[document.querySelectorAll('.tit').length -1]
    document.onscroll = function() {
        if (window.scrollY > 800) {
            document.querySelectorAll(".envolucro")[0].appendChild(divTitFixa);
        } else if (window.scrollY < 100){
            document.querySelectorAll(".div_em_titulo")[document.querySelectorAll('.div_em_titulo').length -1].appendChild(divTitFixa);
        }
    };

    $(".link_voltar").css('top', '140px');
    if (paginaAtual.search(/pg=painel\/listar/g) > 1) {
        var btn86 = document.createElement('a');
        btn86.className = "btn btn_nav btn-mini";
        btn86.id = "btn86";
        btn86.onclick = verificaAssinaturas;
        btn86.innerHTML = "<i class='icon-fire'></i>"
        var ref = document.querySelectorAll('.navega_caixa_refresh')[0]
        ref.insertAdjacentElement('afterend', btn86)
    }else if(paginaAtual.search(/pg=doc\/ver/g) > 1){
        var elmAss;
        agrupaAssinaturas();
        setInterval(function() {
            if (paginaAtual != window.location.href) {
                paginaAtual = window.location.href
                if (paginaAtual.search(/pg=doc\/ver/g) > 1) {
                    agrupaAssinaturas();
                } else {
                    document.getElementById('ass86').remove();
                }
            }
        }, 500);

        Papa.parse(GM_getResourceURL("csv"), {
            download: true,
            header: true,
            complete: function(results) {
                var divinfo = document.getElementsByClassName('media-heading-user-info');
                for (let index = 0; index < divinfo.length; index++) {

                    var nome = divinfo[index].firstElementChild.dataset.content
                    var contato = results.data.find(function(contato) { return contato.nome == nome; })
                    var pai = divinfo[index].parentNode.parentNode;
                    //elmInfo.append("telefone:",contato.telefone2)
                    var elmInfo = document.createElement("span");
                    elmInfo.class = 'inf86';
                    if(contato?.fone == undefined)continue
                    elmInfo.append("Telefone:", contato?.fone)
                    pai.append(elmInfo)
                }
            }
        });
    }

    function verificaAssinaturas() {
        let obj = document.querySelectorAll('.link_emissao_a');
        for (let p of obj) {
            if(p.parentElement.parentElement.children[4].lastElementChild.nodeName == 'SMALL')continue
            let xhr = new XMLHttpRequest();
            xhr.open('GET', p.href);
            xhr.responseType = 'document';
            xhr.onload = function() {
                var local = p.parentElement.parentElement.lastElementChild.previousElementSibling;
                if (xhr.status == 200) {
                    var assinados = xhr.response.querySelectorAll('.badge-success');
                    var pendentes = xhr.response.querySelectorAll('.badge-warning');
                    if (pendentes.length > 0) {
                        local.innerHTML += "<span style='color: #f3581c'><b>" + `Assinaturas:${assinados.length}/${pendentes.length+assinados.length}` + "<b></span>";
                    } else {
                        local.innerHTML += "<span style='color: #1b901b'><b>" + `Assinaturas:${assinados.length}/${pendentes.length+assinados.length}` + "<b></span>";
                    }

                    for (let n = 0; n < pendentes.length; n++) {
                        local.innerHTML += "<br>" + pendentes[n].title.replace(" ainda", '');
                    }
                } else {
                    alert(`Error ${xhr.status}: ${xhr.statusText}`);
                }
            };
            xhr.onerror = function() {
                alert("Request failed");
            };
            xhr.send();
        }
        verificaAssinaturas = undefined
    }

    function agrupaAssinaturas(t) {
        if(elmAss){return}
        elmAss = document.createElement("div");
        elmAss.id = 'ass86';
        var ook = document.getElementsByClassName('badge-success');
        var not = document.getElementsByClassName('badge-warning');
        var linha = [];
        document.body.append(elmAss);

        not.forEach(function(val) {
            linha.push("<span class='badge badge_env badge-warning tt' data-placement='left'><i class='icon-certificate'></i> Pendente </span>");
            linha.push(val.dataset.originalTitle);
        });
        ook.forEach(function(val) {
            linha.push("<span class='badge badge_env badge-success tt' data-placement='left'><i class='icon-certificate'></i> Assinado</span>");
            linha.push(val.dataset.originalTitle);
        });

        for (let li of linha) {
            elmAss.innerHTML += (li);
        }

        elmAss.style.setProperty('font-weight', 'initial');
        elmAss.style.setProperty('font-size', '12px');
        elmAss.style.setProperty('display', 'flex');
        elmAss.style.setProperty('position', 'fixed');
        elmAss.style.setProperty('top', '240px');
        elmAss.style.setProperty('right', '70px');
        elmAss.style.setProperty('flex-direction', 'column');

    };



})();