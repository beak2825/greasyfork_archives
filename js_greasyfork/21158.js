// ==UserScript==
// @name         Script para el Elements
// @namespace    Klatu
// @version      2
// @description  Un script para el Elements.
// @author       Klatu
// @match        http://www.kongregate.com/games/zanzarino/elements*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21158/Script%20para%20el%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/21158/Script%20para%20el%20Elements.meta.js
// ==/UserScript==

window.klatu=window.klatu||{};

klatu.pxToFloat=px=>px.substring(0, px.length-2)-0;

klatu.scriptElements=function(){
    //variables editables
    const MARGIN=8;
    //fin de variables editables

    const ANCHO_DE_LA_SCROLLBAR=17;

    var i,
        container,
        chatInputs=$$('.chat_input'),
        pestañas=$$('.tab'),
        maingameStyle=getComputedStyle(maingame),
        chat_tab_paneStyle=getComputedStyle(chat_tab_pane),
        chatWidth=klatu.pxToFloat(maingameStyle.width)-holodeck._html_dimensions.game_frame_width-holodeck._html_dimensions.divider_width,
        style=
        '.dropdownKlatu{'+
        '    transition:all 0.3s;'+
        '    overflow:hidden;'+
        '}'+
        '.preventSelection {'+
        '-webkit-touch-callout: none;'+ /* iOS Safari */
        '-webkit-user-select: none;'+   /* Chrome/Safari/Opera */
        '-khtml-user-select: none;'+    /* Konqueror */
        '-moz-user-select: none;'+      /* Firefox */
        '-ms-user-select: none;'+       /* Internet Explorer/Edge */
        'user-select: none;'+           /* Non-prefixed version, currently not supported by any browser */
        '}'+
        '.boton{'+
        '   align-items: flex-start;'+
        '   background-attachment: scroll;'+
        '   background-clip: border-box;'+
        '   background-color: rgba(0, 0, 0, 0);'+
        '   background-image: linear-gradient(rgb(41, 110, 145), rgb(8, 77, 112));'+
        '   background-origin: padding-box;'+
        '   background-size: auto;'+
        '   border-bottom-color: rgb(6, 54, 80);'+
        '   border-bottom-left-radius: 2px;'+
        '   border-bottom-right-radius: 2px;'+
        '   border-bottom-style: solid;'+
        '   border-bottom-width: 1px;'+
        '   border-collapse: collapse;'+
        '   border-image-outset: 0px;'+
        '   border-image-repeat: stretch;'+
        '   border-image-slice: 100%;'+
        '   border-image-source: none;'+
        '   border-image-width: 1;'+
        '   border-left-color: rgb(6, 54, 80);'+
        '   border-left-style: solid;'+
        '   border-left-width: 1px;'+
        '   border-right-color: rgb(6, 54, 80);'+
        '   border-right-style: solid;'+
        '   border-right-width: 1px;'+
        '   border-top-color: rgb(6, 54, 80);'+
        '   border-top-left-radius: 2px;'+
        '   border-top-right-radius: 2px;'+
        '   border-top-style: solid;'+
        '   border-top-width: 1px;'+
        '   box-shadow: none;'+
        '   box-sizing: border-box;'+
        '   color: rgb(255, 255, 255);'+
        '   cursor: pointer;'+
        '   display: inline-block;'+
        '   font-family: Verdana,'+
        '   sans-serif;'+
        '   font-size: 11px;'+
        '   font-stretch: normal;'+
        '   font-style: normal;'+
        '   font-variant: normal;'+
        '   font-weight: bold;'+
        '   height: 20px;'+
        '   letter-spacing: normal;'+
        '   line-height: 14px;'+
        '   margin-bottom: 0px;'+
        '   margin-left: 0px;'+
        '   margin-right: 0px;'+
        '   margin-top: 0px;'+
        '   padding-bottom: 2px;'+
        '   padding-left: 10px;'+
        '   padding-right: 10px;'+
        '   padding-top: 2px;'+
        '   text-align: center;'+
        '   text-decoration: none;'+
        '   text-indent: 0px;'+
        '   text-rendering: auto;'+
        '   text-shadow: rgba(0, 0, 0, 0.498039) 0px 0px 2px;'+
        '   text-transform: none;'+
        '   vertical-align: middle;'+
        '   white-space: nowrap;'+
        '   word-spacing: 0px;'+
        '   writing-mode: horizontal-tb;'+
        '   -webkit-appearance: none;'+
        '   -webkit-rtl-ordering: logical;'+
        '   -webkit-user-select: none;'+
        '}';

    maingame.style.margin='0 '+MARGIN+'px';
    maingame.style.width=innerWidth-MARGIN*2-klatu.pxToFloat(getComputedStyle(maingame).paddingLeft)-klatu.pxToFloat(getComputedStyle(maingame).paddingRight)-ANCHO_DE_LA_SCROLLBAR+'px';
    maingamecontent.style.margin=0;
    chat_container.style.width=chatWidth+'px';
    chat_tab_pane.style.width=chatWidth-klatu.pxToFloat(chat_tab_paneStyle.paddingLeft)-klatu.pxToFloat(chat_tab_paneStyle.paddingRight)+'px';
    for(i=0; i<chatInputs.length; i++) chatInputs[i].style.width='100%';

    klatu.style=klatu.style||document.createElement('style');
    if(klatu.style.innerHTML.indexOf(style)==-1) klatu.style.innerHTML+=style;
    document.head.appendChild(klatu.style);

    klatu.libs=klatu.libs||new Set();
    if(!klatu.libs.has('https://cdnjs.cloudflare.com/ajax/libs/scriptaculous/1.9.0/builder.min.js')){
        klatu.libs.add('https://cdnjs.cloudflare.com/ajax/libs/scriptaculous/1.9.0/builder.min.js');
        let scriptaculous=document.createElement('script');
        scriptaculous.src='https://cdnjs.cloudflare.com/ajax/libs/scriptaculous/1.9.0/builder.min.js';
        document.head.appendChild(scriptaculous);
    }

    klatu.elements={};

    klatu.elements.mazos=localStorage.klatuMazosElements?JSON.parse(localStorage.klatuMazosElements):[];

    if(!klatu.liDecks){
        klatu.liDecks=document.createElement('li');
        klatu.liDecks.className='tab';
        klatu.liDecks.innerHTML='<a>Decks</a>';
        klatu.liDecks.style.cursor='pointer';
        klatu.liDecks.onclick=function(){
            for(i=0; i<$$('.tab').length; i++) $$('.tab')[i].firstChild.className='';
            klatu.liDecks.firstChild.className='active';
            for(container in holodeck._tabs.containers._object) holodeck._tabs.containers._object[container].style.display='none';
            klatu.divDecks.style.display='';
        };
        main_tab_set.appendChild(klatu.liDecks);

        for(i=0; i<pestañas.length; i++) pestañas[i].firstChild.addEventListener('click', function(){
            klatu.liDecks.firstChild.className='';
            klatu.divDecks.style.display='none';
        });

        klatu.divDecks=document.createElement('div');
        klatu.divDecks.id='divDecks';
        klatu.divDecks.className='chat_message_window';
        klatu.divDecks.style.background='white';
        klatu.divDecks.style.overflow='hidden';
        kong_game_ui.appendChild(klatu.divDecks);
        añadirMazosADiv();
        klatu.divDecks.style.display='none';
        klatu.divDecks.onmouseout=guardarMazos;

        klatu.botonAñadirMazo=document.createElement('button');
        klatu.botonAñadirMazo.innerHTML='Añadir mazo';
        klatu.botonAñadirMazo.className='boton';
        klatu.botonAñadirMazo.onclick=function(){
            añadirMazoAMazos(prompt('Ingresá el nombre del mazo:'), prompt('Ingresá el código del mazo:'));
            añadirMazosADiv();
            guardarMazos();
        };
        kong_game_ui.appendChild(klatu.botonAñadirMazo);
    }
};

function añadirMazoAMazos(nombre, code){
    mazo={nombre:nombre, code:code};
    klatu.elements.mazos.push(mazo);
    return mazo;
}

function añadirMazosADiv(){
    klatu.divDecks.innerHTML='';
    for(let i=0; i<klatu.elements.mazos.length; i++){
        let div=document.createElement('div');
        let mazo=klatu.elements.mazos[i];
        let input=document.createElement('input');
        let span=document.createElement('span');
        let textarea=document.createElement('textarea');
        div.index=i;
        div.id='mazo_'+i;
        klatu.divDecks.appendChild(div);
        input.className='nombreDeck';
        input.value=mazo.nombre;
        input.onchange=function(){
            if(this.value) klatu.elements.mazos[this.parentElement.index].nombre=this.value;
            else{
                klatu.elements.mazos.splice(this.parentElement.index, 1);
                añadirMazosADiv();
            }
            guardarMazos();
        };
        div.appendChild(input);
        span.innerHTML='▼';
        span.style.cursor='pointer';
        span.textarea=textarea;
        span.onclick=function(){
            var selection=getSelection();
            if(selection.rangeCount>0) selection.removeAllRanges();
            if(getComputedStyle(this.parentElement).height==this.parentElement.heightContraido){
                for(let i=0; i<$$('.dropdownKlatu').length; i++){
                    let div=$$('.dropdownKlatu')[i];
                    div.style.height=div.heightContraido;
                }
                this.parentElement.style.height=this.parentElement.heightExpandido;
                this.textarea.selectionStart=0;
                this.textarea.selectionEnd=this.textarea.value.length;
                this.innerHTML='▲<br>';
            }
            else{
                this.parentElement.style.height=this.parentElement.heightContraido;
                this.innerHTML='▼<br>';
            }
        };
        div.appendChild(span);
        div.heightContraido=div.clientHeight+'px';
        span.appendChild(document.createElement('br'));
        textarea.value=mazo.code;
        textarea.onchange=function(){
            if(this.value) klatu.elements.mazos[this.parentElement.index].code=this.value;
            else{
                klatu.elements.mazos.splice(this.parentElement.index, 1);
                añadirMazosADiv();
            }
            guardarMazos();
        };
        div.appendChild(textarea);
        div.heightExpandido=div.clientHeight+'px';
        div.style.height=div.heightContraido;
        div.className='dropdownKlatu';
        if(i%2) div.className+=' even';
    }
    delete Sortable.sortables.divDecks;
    Sortable.create('divDecks', {
        tag:'div',
        onUpdate:function(){
            const mazosViejos=klatu.elements.mazos;
            klatu.elements.mazos=[];
            for(let i=0; i<$$('.dropdownKlatu').length; i++){
                klatu.elements.mazos.push(mazosViejos[$$('.dropdownKlatu')[i].index]);
            }
            añadirMazosADiv();
            guardarMazos();
        }
    });
}

function guardarMazos(){
    localStorage.klatuMazosElements=JSON.stringify(klatu.elements.mazos);
}

addEventListener('dataavailable', klatu.scriptElements);