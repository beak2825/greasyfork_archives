// ==UserScript==
// @name        Griddo Meta Display
// @namespace   GridoMetaDisplayBox
// @description Display Meta data of Griddo Site pages
// @author      Toni Castillo
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @version     1.0.2
// @author      -
// @icon        https://www.google.com/s2/favicons?sz=64&domain=griddo.io
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceURL
// @license     Copyright Secuoyas 2023

// @downloadURL https://update.greasyfork.org/scripts/454872/Griddo%20Meta%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/454872/Griddo%20Meta%20Display.meta.js
// ==/UserScript==

//👇 Aquí ponemos las metas que queremos mirar
//formato para búsqueda de contenidos: 'TAG:ATRIBUTO-DE-BUSQUEDA:VALOR-DE-BUSQUEDA:ATRIBUTO-A-IMPRIMIR1[:ATRIBUTO-A-IMPRIMIT2...]
const metasToScrape = [
    'meta:property:debug:content',
    'meta:name:robots:content',
    'link:rel:alternate:hreflang:href',
]

//🚫 No tocar a partir de aquí
// Función para mostrar una ventana emergente con la configuración actual


const checkIsVisible = () => GM_getValue('isVisible', true);

// Función para alternar el estado del checkbox y guardar en el almacenamiento local
function toggleIsVisible() {
  const isVisible = checkIsVisible()
  updatePanelVisibility(!isVisible);
  registerMenuIsVisibleComand(!isVisible);
  GM_setValue('isVisible', !isVisible);

}

// Agregar el checkbox en el menú de usuario
function registerMenuIsVisibleComand(tIsVisible){
  GM_unregisterMenuCommand('Panel visible ✅')
  GM_unregisterMenuCommand('Panel visible ⬛')
  GM_registerMenuCommand('Panel visible '+(tIsVisible ? '✅' : '⬛'), toggleIsVisible);
}

  function mostrarmatchSites() {
    const matchSites = obtenermatchSites();

    alert('Los sites actuales son:\n' + matchSites.join('\n'));
  }

// Función para procesar el cambio en la configuración
function cambiarmatchSites() {
  const matchSitesString = GM_getValue('nombre_matchSites', '');
  console.log('Ejemplo: https?:\/\/([A-Za-z0-9.-]*\.griddo\.[A-Za-z0-9.-]*)\/')
  const nuevamatchSites = prompt('Ingrese las URLs o RegExp de sites separadas por comas:\nEjemplo: https?:\/\/([A-Za-z0-9.-]*\.griddo\.[A-Za-z0-9.-]*)\/', matchSitesString);
  const urls = nuevamatchSites.split(',').map(url => url.trim());
  guardarmatchSites(urls);
  alert('La configuración se ha actualizado correctamente.');
}

// Obtener la configuración guardada
function obtenermatchSites() {
  const matchSitesString = GM_getValue('nombre_matchSites', '');
  return matchSitesString.split(',');

}

// Guardar la configuración
function guardarmatchSites(matchSites) {
  const matchSitesString = matchSites.join(',');
  GM_setValue('nombre_matchSites', matchSitesString);
}

// Verificar si el sitio web actual coincide con la configuración
function verificarMatch(matchSites) {
  const sitioActual = window.location.href;
  return !!matchSites.length && matchSites.some(regexExpressionString => regexExpressionString!== '' && new RegExp(regexExpressionString).test(sitioActual));
}

// Comprobar el match y ejecutar el código correspondiente
const matchSites = obtenermatchSites();

// Agregar el campo de configuración en el menú de usuario
GM_registerMenuCommand('Mostrar configuración', mostrarmatchSites);
GM_registerMenuCommand('Cambiar configuración', cambiarmatchSites);

registerMenuIsVisibleComand(checkIsVisible())



const metas = metasToScrape.map(meta => {
    var metaParts = meta.split(":")
    return {
        tag: metaParts[0],
        attr: metaParts[1],
        val: metaParts[2],
        contents: metaParts.slice(3)
    }
});

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

let creationDate = null
let sourceDocument = null

const getCreationDate = (data) => {
  //onsole.log("getCreationDate");
  const dateMetaData = data.filter(d => d.meta.tag === 'meta' && d.meta.val === 'debug')
  if(!!dateMetaData.length && !!dateMetaData[0].values){
    const regexData = /\@ (.*?)\(/;
    let m;
    if ((m = regexData.exec(dateMetaData[0].values[0])) !== null) {
      creationDate = Date.parse(m[1]);
    }
  }
}



    function getSourceCode(){
        //onsole.log("getSourceCode");
        fetch(location.href).then((response) => response.text()).then((text) => {
            sourceDocument = document.createElement( 'html' );
            sourceDocument.innerHTML = text;
            scrapeGriddoData();
        });
    }
    function scrapeGriddoData(){
        //onsole.log("scrapeGriddoData");
        const data = []
        metas.map(meta => {
            var metaDomElements = sourceDocument.querySelectorAll(meta.tag + '[' + meta.attr + '="' + meta.val + '"]')
            metaDomElements.forEach(metaDomElement => {
                var values = []
                meta.contents.map(content => {
                    values.push(metaDomElement.getAttribute(content));
                })
                data.push(
                    {
                        meta: meta,
                        values: values,
                    }
                )
            })
        })
        getCreationDate(data)
        showData(data)
    }
    function updatePanelVisibility(tIsVisible){
      const div = document.getElementById('griddo-meta-display-box')
      if(tIsVisible){
        div.classList.add('isVisible')
      } else {
        div.classList.remove('isVisible')
      }
    }
    function showData(data){
            var boxDomElement = document.createElement('div');
            boxDomElement.id="griddo-meta-display-box";
            boxDomElement.innerHTML = "<span>Griddo Debug Info v0.7</span>"
            document.body.appendChild(boxDomElement);
            if(creationDate){
              var dateElement = document.createElement('div');
              dateElement.classList.add("timeAgo")
              dateElement.innerHTML = "Modified " + moment(creationDate).fromNow()
              boxDomElement.appendChild(dateElement);
            }

            var listDomElement = document.createElement('ul');
            metas.map(meta => {
                let itemHtml = '<hr /><div>'+meta.tag+'|'+meta.attr+': <strong>'+meta.val+'</strong></div>';
                var listItemDomElement = document.createElement('li');
                const dataOfThisMeta = data.filter(d => d.meta === meta)
                dataOfThisMeta.map(dataItem => {
                    itemHtml += '<ul>'
                    dataItem.values.map((value, idx)=>{
                        itemHtml += '<li><strong>'+dataItem.meta.contents[idx]+':</strong> '+value+'</li>'
                    })
                    itemHtml += '</ul>'


                });
                listItemDomElement.innerHTML = itemHtml
                    listDomElement.appendChild(listItemDomElement);
                boxDomElement.appendChild(listDomElement)
            });
            updatePanelVisibility(checkIsVisible())
    }


addStyle(`
#griddo-meta-display-box{
    display: none;
    position: fixed;
    width: 300px;
    padding: 24px;
    top: 24px;
    right: 24px;
    box-shadow: 2px 3px 4px -1px rgba(0,0,0,0.4);
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #777;
    color: #000;
    font-family: sans-serif;
    z-index: 9999999;
    transition: all 0.3s;
    transform: translateX(98%);
    opacity: 0.3;
}
#griddo-meta-display-box:hover{
    transform: translateX(0%);
    opacity: 1;
}
#griddo-meta-display-box::before{
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 100%;
    width: 25px;
    height: 100%;
    background-color: transparent;
}
#griddo-meta-display-box span{
    display: block;
    margin-bottom: 20px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
}
#griddo-meta-display-box ul{
    list-style: none;
    padding: 0;
    font-size: 12px;
}
#griddo-meta-display-box li > div {
    display: block;
    background-color: #eee;
    margin-top: 8px;
}
#griddo-meta-display-box .timeAgo{
    font-size: 12px;
    font-weight: 600;
}
#griddo-meta-display-box.isVisible{
    display: block;
}
hr{
    border: 0;
    height: 1px;
    background-color: #999;
    margin-top: 8px;
}
`);
(function() {
    if (verificarMatch(matchSites)) {
      getSourceCode()
    }
})();