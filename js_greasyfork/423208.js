// ==UserScript==
// @name         After10
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  try to take over the world!
// @author       elgay!
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423208/After10.user.js
// @updateURL https://update.greasyfork.org/scripts/423208/After10.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*INICIO DEL SCRIPT*/
    /*variables globales*/
var ini_dis = false;
var intentos = 0;
var promesa;
var tiempo_espera = verifica_minimo();
var enviar=false;
var click_lanzador=false;

/*se puede eliminar esta funcion y dejarlo solo como codigo, creo :v*/
async function envia_en10(){
	/*obtener tiempo de inicio*/
	var inicio = await revisa_tiempo(1);
	if(inicio=="err"){
		return
	}else if(tiempo_espera===undefined){
		return
	}else{
		console.log("valor en inicio",inicio);
		/*crear caja*/
		crear_caja();
		/*crear script*/
		crear_script();
		/*crear evento capturador*/
		tecla_evento(inicio);
		mouse_evento(inicio);
        updater();
	}
}
function updater(){
    setTimeout(function(){
        try{
            tiempo_espera = verifica_minimo();
        }catch(e){

        }
        updater();
    },500)
}

/*ejecuta*/
envia_en10();

/*disparador*/
async function disparador(inicio){
	intentos += 1;
	if(intentos>=4){
		/*enviar ignorando todo*/
		console.log("Envia de una vez.")
		clearTimeout(promesa);
		clickea();
	}else if(ini_dis===true){
		console.log("Already running disparador");
		return
	}else{
		ini_dis = true;
		/*obtener el tiempo actual*/
		var actual = await revisa_tiempo(2);
		/*separar tiempo inicio*/
		var ini_m = inicio.split(":")[0];
		var ini_s = inicio.split(":")[1];

		/*verificar si vio el tiempo en 51 - 59 para sumarle eso*/
		if(ini_s>="51" && ini_s<="59"){
			var ini_s_r = ((parseInt(ini_s) - 60) * -1) -0.5;
			console.log("Tiempo de mas:",ini_s_r,"tiempo real obtenido:",ini_s,"tiempo convertido:",parseInt(ini_s) + ini_s_r)
			ini_s = parseInt(ini_s) + ini_s_r;
		}
		/*unificar tiempo de inicio en ms*/
		var ini_ms = (ini_m * 60000) + (ini_s * 1000);

		/*separar tiempo actual*/
		var act_m = actual.split(":")[0];
		var act_s = actual.split(":")[1];
		/*unificar tiempo actual en ms*/
		var act_ms = (act_m * 60000) + (act_s * 1000);

		/*calculos*/
		var transc = ini_ms - act_ms;
		if(transc>=tiempo_espera){
			/*enviar de una vez*/
			console.log("enviar de una vez");
			clickea();
		}else{
			var rest = tiempo_espera - transc;
			/*enviar con promesa*/
			var boton = document.getElementsByClassName("submit btn btn-cf-blue")[0];
			boton.value="Waiting...";
			console.log("enviar con promesa")
			promesa=setTimeout(clickea,rest);
		}

	}
}


/*revisa el tiempo que ha transcurrido en un task*/
async function revisa_tiempo(modo){
	async function revisando(resolve,reject){
		/*tiempo de inicio*/
		var cont = 0;
		do{
			cont += 1;
			var num_ele = document.getElementsByClassName("countdown_row countdown_amount").length;
			if(num_ele===0 || num_ele===undefined){
				var esperando = await espera();
				console.log("reintentando obtener tiempo...");
				if(cont>=30){
					console.error("Tiempo no obtenido. Script cancelado!");
					resolve("err");
				}
			}else{
				var ti = document.getElementsByClassName("countdown_row countdown_amount")[0].innerText;
				console.log("tiempo leido.")
				resolve(ti);
			}
		}while(num_ele==0 || num_ele==undefined)
	}
	return new Promise(revisando);
}


function espera(){
    function esperando(resolve,reject){
        /*console.log("Wait");*/
        setTimeout(resolver, 200);
        function resolver(){
            resolve("1");
        }
    }
    return new Promise(esperando);
}

function clickea(){
	/*cambiamos la variable click_lanzador para permitir enviar*/
	click_lanzador=true;
	/*obtener boton*/
	var boton = document.getElementsByClassName("submit btn btn-cf-blue")[0];
	boton.removeClass("disabled");
	boton.value="Submit & Continue";
	boton.click();
	ini_dis=false;
}

function tecla_evento(inicio){
	window.addEventListener("keypress", function(event){
    if (event.keyCode == 13){
    		/*obtener boton*/
			var boton = document.getElementsByClassName("submit btn btn-cf-blue")[0];
    		boton.addClass("disabled");
	        event.preventDefault();
			console.log("lanzar disparador");
			disparador(inicio)
	    }
	}, false);
}

function mouse_evento(inicio){
	/*obtener boton*/
	var boton = document.getElementsByClassName("submit btn btn-cf-blue")[0];
	boton.addEventListener('click', function(event){
		if(click_lanzador===true){
			console.log("preventDefault null");
			click_lanzador=false;
		}else{
			boton.addClass("disabled");
			event.preventDefault();
			disparador(inicio);
		}
	}, false);

}

function crear_caja(){
	/*crear el nodo a insertar*/
	var newNode = document.createElement("input");
	newNode.style="width:35px;"
	newNode.type="number";
	newNode.id="after10";
	newNode.onchange="cambia_m();"
	/*obtener una referencia al nodo padre*/
	var parentDiv = document.getElementsByClassName("job-title")[0].parentNode;
 
	/*agregar caja*/
	var sp2 = document.getElementsByClassName("job-title")[0];
	parentDiv.insertBefore(newNode,sp2);
 
	/*agregar evento*/
	document.getElementById("after10").setAttribute("onchange","cambia_m();")
	/*agregar valor predeterminado*/
	document.getElementById("after10").value = verifica_minimo_s();
}

function crear_script(){
	var func = 'function cambia_m(){';
	func +=	'var valor = document.getElementById("after10").value;'
	func +=	'if(valor=="" || valor===undefined || valor===null || isNaN(valor)){'
	func +=	'console.log("valor error, set default");';
	func +=	'localStorage.setItem("after10","10");'
	func +=	'}else if(valor<10){'
	func +=	'localStorage.setItem("after10","10");'
	func +=	'console.log("valor muy bajo, set default");'
	func +=	'}else{'
	func +=	'console.log("valor cambiado a",valor);'
	func +=	'localStorage.setItem("after10",valor);'
	func +=	'}'
	func +=	'}'
	func += 'function activa(){'
	func +=	'var boton = document.getElementsByClassName("submit btn btn-cf-blue")[0];'
	func +=	' boton.disabled=false;'
	func +=		'}'
	var newNode = document.createElement("script");
	var newContent = document.createTextNode(func);
	newNode.appendChild(newContent);
	/*obtener una referencia al nodo padre*/
	var parentDiv = document.getElementsByClassName("gauges")[0].parentNode;
	/*agregar script*/
	var sp2 = document.getElementsByClassName("gauges")[0];
	parentDiv.insertBefore(newNode,sp2);
}



function verifica_minimo_s(){
	var ti_s = localStorage.getItem("after10");
	if(ti_s===null){
		/*default 10300ms*/
		return 10;
	}else if(isNaN(ti_s)){
		/*default 10300ms*/
		return 10;
	}else{
		/*pasar de segundos a milisegundos*/
		return ti_s;
	}
}

function verifica_minimo(){
	var ti_s = localStorage.getItem("after10");
	if(ti_s===null){
		/*default 10300ms*/
		return 10300;
	}else if(isNaN(ti_s)){
		/*default 10300ms*/
		return 10300;
	}else{
		/*pasar de segundos a milisegundos*/
		return ti_s * 1000;
	}
}
    /*FIN DEL SCRIPT*/
})();