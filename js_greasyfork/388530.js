// ==UserScript==
// @name:en  CampusVirtualUGD::organizarMaterias
// @name     CampusVirtualUGD::organizarMaterias
// @version  6
// @grant    none
// @match https://campusvirtual.ugd.edu.ar/moodle/
// @description:en Organiza las materias del campus virtual UGD por año
// @description: Organiza las materias del campus virtual UGD por año
// @namespace https://greasyfork.org/users/325953
// @description Organiza las materias del campus virtual de la UGD por año
// @downloadURL https://update.greasyfork.org/scripts/388530/CampusVirtualUGD%3A%3AorganizarMaterias.user.js
// @updateURL https://update.greasyfork.org/scripts/388530/CampusVirtualUGD%3A%3AorganizarMaterias.meta.js
// ==/UserScript==
agregarReglasCss();
/**
 * Arreglo de divs con la clase coursebox
 *
 * Estos divs son los links a las materias. Ojo, su estructura no
 * es tan sencilla como podria ser. Para empezar, en lugar de ser
 * divs podrian ser tags <a> y punto...
 */
var materias = document.querySelectorAll(".coursebox");
distribuirMaterias(materiasOrganizadas(materias));
function agregarReglasCss() {
    var css = "\n  .category-header {\n    font-size: 17px;\n    color: rgb(253, 253, 253);\n    line-height: 25px;\n    font-family: \"Oswald\",sans-serif;\n    background-color: rgb(255, 81, 0);\n    height: auto;\n  }\n\n  .coursebox {}\n  ";
    var style = document.createElement('style');
    style.innerText = css;
    document.querySelector('body').append(style);
}
function distribuirMaterias(materias) {
    quitarMateriasDelDocumento(materias);
    var categorias = crearCategorias();
    ubicarEnCategorias(categorias, materias);
    var arregloCategorias = categoriasComoArreglo(categorias);
    arregloCategorias = arregloCategorias.reverse();
    agregarCategoriasAlDocumento(arregloCategorias);
}
function categoriasComoArreglo(categorias) {
    return [
        categorias["primero"],
        categorias["segundo"],
        categorias["tercero"],
        categorias["cuarto"],
        categorias["quinto"],
        categorias["otro"]
    ];
}
function quitarMateriasDelDocumento(materias) {
    for (var clave in materias) {
        var materiasDeAño = materias[clave];
        for (var _i = 0, materiasDeAño_1 = materiasDeAño; _i < materiasDeAño_1.length; _i++) {
            var materia = materiasDeAño_1[_i];
            materia.remove();
        }
    }
}
function crearCategorias() {
    return {
        "primero": elementoCategoria("PRIMERO"),
        "segundo": elementoCategoria("SEGUNDO"),
        "tercero": elementoCategoria("TERCERO"),
        "cuarto": elementoCategoria("CUARTO"),
        "quinto": elementoCategoria("QUINTO"),
        "otro": elementoCategoria("OTRO")
    };
}
function elementoCategoria(nombre) {
    var divPadre = document.createElement('div');
    var n = document.createElement("h3");
    n.innerText = nombre;
    n.classList.add("category-header");
    divPadre.append(n);
    return divPadre;
}
function agregarCategoriasAlDocumento(categorias) {
    var divCursos = document.querySelector(".courses");
    for (var _i = 0, categorias_1 = categorias; _i < categorias_1.length; _i++) {
        var categoria = categorias_1[_i];
        divCursos.append(categoria);
    }
}
function ubicarEnCategorias(categorias, materias) {
    for (var clave in materias) {
        var materiasDeAño = materias[clave];
        var categoria = categorias[clave];
        for (var _i = 0, materiasDeAño_2 = materiasDeAño; _i < materiasDeAño_2.length; _i++) {
            var materia = materiasDeAño_2[_i];
            categoria.appendChild(materia);
        }
    }
}
function materiasOrganizadas(materias) {
    /**
     * Mapa de materias por año. Aca se guardaran las materias luego
     * de ser organizadas.
     */
    var materias_por_año = {
        "primero": [],
        "segundo": [],
        "tercero": [],
        "cuarto": [],
        "quinto": [],
        "otro": []
    };
    materias.forEach(function (materia) {
        var año = añoDeMateria(nombreFormateado(materia));
        materias_por_año[año].push(materia);
    });
    return materias_por_año;
}
function añoDeMateria(nombre) {
    if (esDePrimero(nombre)) {
        return "primero";
    }
    else if (esDeSegundo(nombre)) {
        return "segundo";
    }
    else if (esDeTercero(nombre)) {
        return "tercero";
    }
    else if (esDeCuarto(nombre)) {
        return "cuarto";
    }
    else if (esDeQuinto(nombre)) {
        return "quinto";
    }
    else {
        return "otro";
    }
}
function esDePrimero(nombre) {
    var materias = [
        "ingles i",
        "algoritmos y estructuras i",
        "lengua y comunicacion",
        "introduccion a la informatica",
        "matematica discreta",
        "taller de informatica",
        "ingles ii",
        "programacion estructurada",
        "principios de administracion y organizacion",
        "quimica general",
        "sistemas de representacion",
        "algebra y geometria analitica",
    ];
    return materias
        .some(function (n) { return n == nombre; });
}
function esDeSegundo(nombre) {
    var materias = [
        "analisis matematico i",
        "algoritmos y estructuras ii",
        "sistemas digitales",
        "fisica i",
        "elementos de costos y contabilidad",
        "sistemas de informacion",
        "analisis matematico ii",
        "bases de datos",
        "fisica ii",
        "estadistica",
        "arquitectura de computadoras",
    ];
    return materias
        .some(function (n) { return n == nombre; });
}
function esDeTercero(nombre) {
    var materias = [
        "ingles tecnologico",
        "programacion avanzada i",
        "sistemas operativos i",
        "analisis matematico iii",
        "analisis de sistemas",
        "analisis y diseño de algoritmos",
        "programacion avanzada ii",
        "fisica iii",
        "sistemas operativos ii",
        "diseño de sistemas",
        "comunicacion de datos",
        "paradigmas y lenguajes de programacion",
    ];
    return materias
        .some(function (n) { return n == nombre; });
}
function esDeCuarto(nombre) {
    var materias = [
        "automatas y lenguajes formales",
        "redes de computadoras i",
        "metodologias avanzadas",
        "tecnologias de bases de datos",
        "investigacion operativa",
        "principios de economia",
        "compiladores",
        "redes de computadoras ii",
        "taller de redes",
        "modelos y simulacion",
        "calculo numerico",
        "ingenieria del software",
    ];
    return materias
        .some(function (n) { return n == nombre; });
}
function esDeQuinto(nombre) {
    var materias = [
        "admistracion de recursos humanos",
        "direccion y gerenciamiento",
        "estudios y proyectos",
        "gestion de la calidad y auditoria",
        "inteligencia artificial i",
        "inteligencia artificial ii",
        "introduccion al diseño y desarrollo de videojuegos",
        "investigacion cientifica",
        "legislacion",
        "proyectos informaticos",
        "seguridad laboral y proteccion ambiental",
        "taller de aplicaciones web",
        "taller de formacion y prospectiva profesional",
        "taller de trabajo final",
        "teoria de control"
    ];
    return materias
        .some(function (n) { return n == nombre; });
}
function nombreFormateado(materia) {
    return cadenaSinAcentos(nombreDeMateria(materia).toLowerCase());
}
function cadenaSinAcentos(nombre) {
    return nombre
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u");
}
/**
 * Extrae el nombre del elemento de una materia.
 *
 * El "boton" de una materia tiene la siguiente estructura:
 *
 *    <div class="coursebox ...">
 *      <h3 class="name">nombre de la materia</h3>
 *    </div>
 *
 * @param materia div
 * @returns string
 */
function nombreDeMateria(materia) {
    return materia.querySelector("h3").innerText;
}
