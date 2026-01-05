// ==UserScript==
// @name       WME Unblock Forum BR
// @namespace  https://greasyfork.org/scripts/5336-wme-unblock-forum-br/code/WME%20Unblock%20Forum%20BR.user.js
// @version    0.1
// @description  Link para fórum de pedido de desbloqueio, por estado.
// @match      
// @copyright  2014+, mikenit
// @include             https://*.waze.com/*editor*
// @include             https://www.waze.com/*/editor/*
// @grant               mikenit
// @downloadURL https://update.greasyfork.org/scripts/5336/WME%20Unblock%20Forum%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/5336/WME%20Unblock%20Forum%20BR.meta.js
// ==/UserScript==

/**
 * Originalmente escrito por DGmike
 * http://code.google.com/p/cidades-estados-js/
 */
function MUV_bootstrap() {
	console.log('init');
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		});
	}
	/* begin running the code! */
	window.setTimeout(MUV_init, 500);
}

/* Dom Ready */
window.onDomReady = function dgDomReady(fn){
        if(document.addEventListener)   //W3C
                document.addEventListener("DOMContentLoaded", fn, false);
        else //IE
                document.onreadystatechange = function(){dgReadyState(fn);}
}

function dgReadyState(fn){ //dom is ready for interaction (IE)
        if(document.readyState == "interactive") fn();
}

/* Objeto */
var dgEstados = function(data) {
  var defaultData = {
    estado: false,
    estadoVal: '',
    change: false
  }
  for (name in defaultData) {
    if (!data[name]) {
      data[name] = defaultData[name];
    }
  }
  var keys = ['estado'];
  if (data['change']) { //caso change: true, não se trata de um select a ser povoado
    var nome, length = keys.length;
    for (var a=0; a<length; a++ ) {
      nome = keys[a];
      if (data[nome].tagName) {
        var opt = document.createElement('select');
        opt.disabled = null
        for (var i = 0; i < data[nome].attributes.length ; i++) {
          var attr = data[nome].attributes[i];
          if (attr.name != 'type') {
            opt.setAttribute(attr.name, attr.value);
          }
        }
        opt.size=1;
        opt.disabled=false;
        data[nome].parentNode.replaceChild(opt, data[nome]);
        data[nome] = opt;
      }
    }
  }
  this.set(data['estado']);
  this.start();

  var nome, length = keys.length;
  for (var i=0; i<length; i++) {
    nome = keys[i]; //estado e cidade

    if (this[nome].getAttribute('value')) {
      data[nome+'Val'] = this[nome].getAttribute('value');
    }

    if (data[nome+'Val']) { //preenche estadoVal e cidadeVal se fornecidos na criação do dgEstados.
                var options = this[nome].options;
                if (nome=='estado') this.estado.onchange(); //se tiver preenchido o estado, dá run() pra preencher as cidades
                for (var j = 0; j<options.length; j++) { //olha cada linha e vê se é a que quer... aí coloca como selected.
                        if (options[j].tagName == 'OPTION') {
                                if (options[j].value == data[nome+'Val']) {
                                        options[j].setAttribute('selected',true);
                                        if (nome=='estado'){ //esses dois passos são necessários pro IE6!
                                                this.estado.selectedIndex=j;
                                                this.estado.onchange();
                                        }
                                }
                        }
                }
        }

  }
  
}

dgEstados.prototype = {
  estado: document.createElement('select'),
  set: function(estado) { //define os elementos DOM a serem preenchidos
    this.estado=estado;
    this.estado.dgEstados=this;
//    this.estado.onchange=function(){this.dgEstados.run()};
  },
  start: function () { //preenche os estados
    var estado = this.estado;
    while (estado.childNodes.length) estado.removeChild(estado.firstChild);
    for (var i=0;i<this.estados.length;i++) this.addOption(estado, this.estados[i][0], this.estados[i][1]);
  },
  /*
  run: function () { //preenche as cidades de acordo com o estado escolhido
        var sel = this.estado.selectedIndex; // estado escolhido
    var itens = this.cidades[sel]; // pega as cidades correspondentes
    var itens_total = itens.length;

    var opts = this.cidade;
    while (opts.childNodes.length) opts.removeChild(opts.firstChild); // limpa a lista atual

    this.addOption(opts, '', 'Selecione uma cidade');
    for (var i=0;i<itens_total;i++) this.addOption(opts, itens[i], itens[i]); // vai adicionando as cidades correspondentes
  },
  */
  addOption: function (elm, val, text) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(text));
    opt.value = val;
    elm.appendChild(opt);
  },
  estados : [
    ['','Selecione um estado'],['AC','Acre'],['AL','Alagoas'],['AM','Amazonas'],['AP','Amapá'],['BA','Bahia'],
    ['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MG','Minas Gerais'],
    ['MS','Mato Grosso do Sul'],['MT','Mato Grosso'],['PA','Pará'],['PB','Paraíba'],['PE','Pernambuco'],['PI','Piauí'],
    ['PR','Paraná'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RO','Rondônia'],['RR','Roraima'],['RS','Rio Grande do Sul'],
    ['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']
  ] 
};

Estados_bootstrap();
