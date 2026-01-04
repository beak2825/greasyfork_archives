// ==UserScript==
// @name         Filtrar carteles con palabras en Desmo
// @version      0.11.8
// @description  Ocultar carteles que tengan ciertas palabras en Desmo
// @author       ArtEze
// @match        *://desmotivaciones.es/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/419686/Filtrar%20carteles%20con%20palabras%20en%20Desmo.user.js
// @updateURL https://update.greasyfork.org/scripts/419686/Filtrar%20carteles%20con%20palabras%20en%20Desmo.meta.js
// ==/UserScript==

var g = {};
window.g = g;

g.tener_css_todos = function(nodo,css){
    return Array.from(nodo.querySelectorAll(css));
};
g.concatenar_arrays = function(a,b){
    return a.concat(b);
};
g.filtrar_por_atributo = function(nodo,atributo,regex){
    return nodo.filter(function(x){
        return x.attributes[atributo] && regex.test(x.attributes[atributo].value);
    });
};

/* Comienzo de análisis de imágenes */

g.obtener_pixeles = function(canvas,contexto){
    var datos_imagen = {};
    datos_imagen = contexto.getImageData(
        0,0,canvas.width,canvas.height
    );
    var bytes = datos_imagen.data;
    return bytes;
};
g.obtener_bytes = function(cartel,imagen){
    // console.log("obtener_bytes",cartel,imagen);
    var canvas = document.createElement("canvas");
    imagen.setAttribute("crossOrigin","");
    canvas.width = imagen.width;
    canvas.height = imagen.height;
    var contexto = canvas.getContext("2d");
    contexto.drawImage(imagen,0,0);
    var datos = g.obtener_pixeles(canvas,contexto);
    //document.body.appendChild(canvas);
    /*
    if(cartel.nodos.canvas==undefined){
        cartel.nodos.canvas = [];
        cartel.nodos.canvas.push(canvas);
    }
    * */
    canvas.remove();
    return datos;
};
g.tiene_colores = function(cartel,imagen){
    var devuelve = [];
    g.puede_analizar = false;
    // console.log("tiene_colores",cartel,imagen);
    var d = [];
    try{
        g.puede_analizar = false;
        d = g.obtener_bytes(cartel,imagen);
        var total_factor_gris = 0;
        var cantidad_factores = 0;
        for(var i=0;i<d.length/Math.pow(7,2);++i){
            var j = Math.floor(Math.random()*d.length/4)*4;
            if(
                d[j+0]!=0&&d[j+0]!=255&&
                d[j+1]!=0&&d[j+1]!=255&&
                d[j+2]!=0&&d[j+2]!=255
            ){
                var factor_gris_1 = Math.abs(d[j]-d[j+1]);
                var factor_gris_2 = Math.abs(d[j]-d[j+2]);
                var factor_gris_3 = Math.abs(d[j+1]-d[j+2]);
                var factor_gris = factor_gris_1+factor_gris_2+factor_gris_3;
                total_factor_gris += factor_gris;
                ++cantidad_factores;
            }
        }
        devuelve = [
            total_factor_gris,
            total_factor_gris/cantidad_factores,
            cantidad_factores
        ];
        g.puede_analizar = true;
    }catch(e){
        devuelve = [0,NaN,0];
    }
    g.puede_analizar = true;
    return devuelve;
};

/* Fin de análisis de imágenes */

g.tamaño_original = function(){
    g.carteles = Array.from(document.querySelectorAll(".demot-small"));
    g.carteles.map(function(x){
        x.attributes.class.value=".cartel";
        x.querySelector("a").setAttribute("target","_blank");
        x.querySelector(".img-small").attributes.class.value=".imagen";
    });
};
g.obtener_carteles = function(){
    var demotes = g.tener_css_todos(document,".demot");
    var carteles = g.filtrar_por_atributo(demotes,"id",/d\d+/);
    var es_usuario = false;
    if(carteles.length==0){
        carteles = g.tener_css_todos(document,".small");
        es_usuario = true;
    }
    return [es_usuario,carteles];
};

g.carteles = g.obtener_carteles();
g.es_usuario = g.carteles[0];

// console.log("carteles",g.carteles);

g.json_carteles = g.carteles[1].map(
    !g.es_usuario?function(x){
        // console.log("no es usuario");
        var enlace = x.querySelector("a");
        var imagen = x.querySelector("img");
        var título_nodo = x.querySelector(".demot-title");
        var etiquetas_nodo = x.querySelector(".wrap");
        var etiquetas_nodos = g.tener_css_todos(etiquetas_nodo,"a");
        var nombre_nodo = x.querySelector(".color0,.color1,.color2,.color3,.color4");
        var título_enlace = enlace.href.split("/").slice(-1)[0];
        var devuelve = {
            nodos: {
                cartel: x,
                título: título_nodo,
                etiquetas_nodo: etiquetas_nodo,
                etiquetas_nodos: etiquetas_nodos,
                nombre_nodo: nombre_nodo,
                imagen: imagen
            },
            textos: {
                alternativo: "",
                nombre: nombre_nodo.textContent,
                título: título_nodo.childNodes[0].textContent,
                título_enlace: título_enlace,
                detalles: "",
                analizado: false,
                etiquetas: etiquetas_nodos.map(function(x){return x.textContent;})
            }
        };
        // console.log("imagen",imagen);
        if(imagen){
            //devuelve.textos.tiene_colores = g.tiene_colores(devuelve,imagen);
        }
        return devuelve;
    }:function(x){
        // console.log("es usuario");
        var enlace = x.querySelector("a");
        var imagen = x.querySelector("img");
        var nombre_nodo = document.querySelector(".color0,.color1,.color2,.color3,.color4");
        var título_enlace = enlace.href.split("/").slice(-1)[0];
        var longitud_guión = " - ".length;
        var longitud_enlace = título_enlace.length;
        var índice_descripción = imagen && imagen.alt.indexOf(" - ");
        var índice_mayor = longitud_enlace>índice_descripción?longitud_enlace:índice_descripción;

        var devuelve = {
            nodos: {
                cartel: x,
                enlace: enlace,
                nombre_nodo: nombre_nodo,
                imagen: imagen
            },
            textos: {
                nombre: nombre_nodo.textContent,
                título_enlace: título_enlace,
                índice_descripción: índice_descripción,
                índice_mayor: índice_mayor,
                alternativo: imagen && imagen.alt,
                título: imagen && imagen.alt.slice(0,índice_mayor),
                detalles: imagen && imagen.alt.slice(índice_mayor+longitud_guión),
                analizado: false,
                etiquetas: []
            }
        };
        // console.log("imagen",imagen);
        if(imagen){
            //devuelve.textos.tiene_colores = g.tiene_colores(devuelve,imagen);
        }
        return devuelve;
    }
);

g.procesar_lista = function(x){
    return x.split(/[\x20\x0a]+/g).filter(function(x){return x;});
};

g.ocultar_carteles = function(){
    g.carteles_filtrados = g.json_carteles.filter(function(x){
        var textos = [
            x.textos.título,
            x.textos.detalles,
            x.textos.nombre
        ].concat(x.textos.etiquetas);
        var objeto_booleano = {
            booleano: false
        };
        g.prueba_regex = function(regex,objeto_booleano,textos){
            if(!objeto_booleano.booleano){
                for(var i=0;i<textos.length;++i){
                    var z = textos[i];
                    var coincide = regex.test(z);
                    if(coincide){
                        console.log(regex,z);
                        objeto_booleano.booleano = true;
                        i = textos.length;
                    }
                }
            }
            return objeto_booleano;
        };
        g.lista_filtros.contiene.map(function(y){
            var w = y.replace(/-/g," ");
            var regex = new RegExp(w,"i");
            g.prueba_regex(regex,objeto_booleano,textos);
        });
        g.lista_filtros.completas.map(function(y){
            var w = y.replace(/-/g," ");
            var regex = new RegExp("\\b"+w+"\\b","i");
            g.prueba_regex(regex,objeto_booleano,textos);
        });
        if( x.textos.título && (x.textos.título.toUpperCase()==x.textos.título) ){
            objeto_booleano.booleano = true;
        }
        // console.log("objeto_booleano",objeto_booleano)
        return objeto_booleano.booleano;
    });
    g.carteles_filtrados.map(function(x){
        x.nodos.cartel.remove();
        // x.nodos.cartel.style.display = "none";
    });
    var facebook_banner = document.querySelector("#fb-root");
    var facebook_2 = document.querySelector("#likebox");
    console.log("facebook_banner",facebook_banner);
    console.log("facebook_banner 2",facebook_2);
    var eliminar_banner_facebook = facebook_banner && facebook_banner.remove();
    var eliminar_facebook_2 = facebook_2 && facebook_2.remove();
    Array.from(document.querySelectorAll(".demot>div br")).map(function(x){x.remove();});
};

g.esperar_análisis = [];
g.analizados = 0;

g.intervalo_NaN = setInterval(function(){
    var i = 0;
    g.json_carteles.map(function(x){
        if(x.textos.analizado==false){
                if(!g.esperar_análisis.includes(i)){
                    g.esperar_análisis.push(i);
                }
        }else{
            if(x.nodos.cartel){
                x.nodos.cartel.style["background-color"] = "#000000e0";
            }
        }
        ++i;
    });
},50);

setTimeout(function(){
    g.intervalo_análisis = setInterval(function(){
        if(g.puede_analizar==undefined){
            g.puede_analizar = true;
        }
        if(g.puede_analizar){
            if(g.esperar_análisis.length>0){
                g.puede_analizar = false;
                var índice_aleatorio = Math.floor(Math.random()*g.esperar_análisis.length);
                var y = g.esperar_análisis[índice_aleatorio];
                var x = g.json_carteles[y];
                var color100 = (100+Math.random()*100)%100;
                x.nodos.cartel.style["background-color"]="#4020ffe0";
                var tiene = g.tiene_colores(x,x.nodos.imagen);
                if(!isNaN(tiene[1])){
                    if(tiene[1]<27){
                        console.log("borrado",tiene,x.textos.título/*,x.nodos.canvas*/);
                        x.nodos.cartel.remove();
                        //document.querySelector("#tag-cloud").appendChild(x.nodos.canvas.slice(-1)[0]);
                    }else{
                        console.log("permanece",tiene,x.textos.título/*,x.nodos.canvas*/);
                    }
                    x.textos.analizado = true;
                    ++g.analizados;
                    g.esperar_análisis = (
                        g.esperar_análisis.slice(0,índice_aleatorio).concat(
                            g.esperar_análisis.slice(índice_aleatorio+1)
                        )
                    );
                }else{
                    x.nodos.cartel.style["background-color"]="#ff"+color100+"20e0";
                }
                x.textos.tiene_colores = tiene.join(" ");
                g.puede_analizar = true;
            }else{
                if(g.analizados>=g.json_carteles.length){
                    clearInterval(g.intervalo_NaN);
                }
                clearInterval(g.intervalo_análisis);
                console.log("Análisis completado");
            }
        }else{
            console.log("Cartel ocupado");
        }
    },900);
},6000);

document.body.addEventListener("keyup", function(event){
    if (event.key.toLowerCase()=="s"){
        event.preventDefault();
        document.querySelector("a[rel='next']").click();
    }
});

g.agregar_botones_páginas = function(){
    var páginas = document.querySelector(".page-links");
    if(páginas){
        páginas.style.height = (30*9) + "px";
        var página_actual = +location.href.split("/").slice(-1)[0];
        var lista_números = [
                       1,2,3,5
            ,        10,20,30,50
            ,      100,200,300,500
            ,    1000,2000,3000,5000
            ,  10000,20000,30000,50000
            ,100000,200000,300000,500000
        ].map(function(x){
			for(var i=0;i<2;++i){
				var y = i==0?x:-x;
				var sm = página_actual + y;
				if(sm>0){
					var a = document.createElement("a");
					a.innerHTML = (i==0?"+":"-") + x + " "+ sm;
					a.href = "/cola/" + sm;
					a.className = "page page3 page-inactive";
					páginas.appendChild(a);
				}
			}
        })
    }
}

g.agregar_botones_opciones = function(){
	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.top = "100px";
	div.style.left = "10px";
	var subdiv = document.createElement("div");
	var botón = document.createElement("button");
	var b = document.createElement("b");
	var botones = [
		["block","desplazador","0","x",[
			["click",function(x){
				var elementos = Array.from(document.querySelectorAll(".menú"));
				var muestra = elementos[0].style.display == "block";
				if(muestra){
					elementos.map(function(x){
						x.style.display = "none";
						return x;
					})
				}else{
					elementos.map(function(x){
						x.style.display = "block";
						return x;
					})
				}
				return x;
			}],
			["mouseenter",function(x){
				document.querySelector(".desplazador").style.opacity = "1";
				var elementos = Array.from(document.querySelectorAll(".menú"));
				elementos.map(function(x){
					x.style.opacity = "1";
					return x;
				})
				return x;
			}],
			["mouseleave",function(x){
				document.querySelector(".desplazador").style.opacity = "0";
				var elementos = Array.from(document.querySelectorAll(".menú"));
				elementos.map(function(x){
					x.style.opacity = "0";
					return x;
				})
				return x;
			}]
		]],
		["none","menú","1","Hola",[
			["click",function(x){
				console.log(x)
			}]
		]]
	].map(function(x){
		var subdiv = document.createElement("div");
		var botón = document.createElement("button");
		var b = document.createElement("b");
		subdiv.style.display = x[0];
		subdiv.classList.add(x[1]);
		subdiv.style.opacity = x[2];
		b.innerHTML = x[3];
		botón.style["color"] = "#ffffffe0";
		botón.style["background-color"] = "#007f00e0";
		x[4].map(function(x){
			subdiv.addEventListener(x[0],x[1])
		})
		botón.appendChild(b);
		subdiv.appendChild(botón);
		div.appendChild(subdiv);
	});
	document.querySelector("body").appendChild(div)
}

g.lista_filtros = {
    contiene: g.procesar_lista(`
nuevo-año año-nuevo
anonuevo nuevoano navidad nabida
dinero guapo
whisky troll stupid
porn coj sex nalg webo fetich mamad vagin fuck scroto
abortat perv
genocid
bolud pelotud idiota
testícul testicul
suscrib
confía confia
mierd
joto laucha patada
weon weón weona
puta
pho
pokemon monster covid smith smok shin furro
messi fred tenn auron
emerit
facebook poke
novia hija gata
novio hijo gato
caga cumea trolea tortura
cago cumeo troleo torturo
nazi
`), completas: g.procesar_lista(`
coca-cola paco-y-yo feliz-vanidad pana-miguel punto-g me-corrí
mario-bros
cocacola
amo amor desamor
ligar machista
cordura
dinero dinerito
moco mocos mocoso
nochebuena
cumpleanos cumpleaños
distanciado distanciamiento punzada pandemia coronavirus
matar funar
autismo
loli hentai onichan
uwu nya nyu unu
simp
maricon maricón
chupalo forro
culiao tonto
mamon mamón
wtf
watafac watafak watefac watefak guatafac guatafak
watafoc watafok watefoc watefok guatafoc guatafok
wotafac wotafak wotefac wotefak guotafac guotafak
wotafoc wotafok wotefoc wotefok guotafoc guotafok
wtefak wtefok
follar folle follé follador
beso besos besar besando
celo celos
abrazo abrazos
rey reina reino
teta tetas tetón tetona
cum polla verga pene dildo
caca culo orto ass
pedo pedofilo pedófilo
cachondo
ano chingas
grasoso
gay gays gey geys gei geis
pajas capaja tangas pajero pijas joto ostias china chinos pete
paja capajas tanga pajeros pija jotos ostia chinas chino petes
puta putas pucha puchas
puto putos pucho puchos
tonta tontas parida paridas chinga marica mariconas chota coña coñas
tonto tontos parido paridos chingo marico maricones choto coño coños
asco asquea asqueao
chori choripan choripán
alcohol licor
ingles inglés lovelive starwars
night moon
fire sun
rich under cake park guitar hi cringe fock chocolat how what kinder
music death glad light but white foot
among universe bimbo naruto vegetto fortnite zelda dragonball
sonic puercoespin
spidiman blastoise volvasor
disney mickey mike clarence
jake freddie brad luigi anne soros ben dalas cabrera harry vladimir lil
cerati dross goku
isabella perry
fernan fernanfloo
messi mesi
sovietico soviético militares
carajo carajos
pipí puber
cristo jesus jesús jesucristo dios vaticano
resurreccion resurrección
amen amén
bad god good
satan satán
larreta willyrex yoshi rubius
lacra
20\\d{2}
    `)
};

g.ocultar_carteles();
g.tamaño_original();
g.agregar_botones_páginas();
g.agregar_botones_opciones();
