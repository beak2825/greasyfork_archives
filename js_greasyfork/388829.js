// ==UserScript==
// @name         muahahaha sourceforge
// @namespace    muahahaha
// @version      1.0
// @match        https://sourceforge.net/projects/*/files/*
// @description  copy data from sourceforge files
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388829/muahahaha%20sourceforge.user.js
// @updateURL https://update.greasyfork.org/scripts/388829/muahahaha%20sourceforge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let boton=$('<a class="button orange" tabindex="0">Get Updates</a>').appendTo('.btn-set');

    console.log('boton',boton);

    boton.on('click',function(){

        let salida=$('<textarea/>')
            .css({
                margin:'10vh 0 0 10vw',
                height:'80vh',
                width:'80vw',
                fontFamily:'monospace',
            })
            .click(function(event){
                event.stopPropagation();
                event.target.select();
            })
            .appendTo(
                $('<div/>')
                    .css({
                        position:'fixed',
                        top:'0',
                        left:'0',
                        height:'100vh',
                        width:'100vw',
                        zIndex:'9999',
                        background:'rgba(0,0,0,0.85)',
                    })
                    .click(function(event){
                        $(event.target).remove();
                        $('body').css({overflow:'visible'});
                    })
                    .appendTo(
                        $('body').css({overflow:'hidden'})
                    )
            )
        ;

        console.log('salida',salida);

        let carpeta=$('.current-dir').parent().text().replace(/\s+/g,' ').trim();

        if(!carpeta)carpeta='Home';

        carpeta=carpeta+' /';

        console.log('carpeta',typeof carpeta,carpeta)

        $('#files_list tr[title]').each(function(i,e){
            e=$(e);
            console.log(e)
            salida.val(
                salida.val()
                +carpeta+'\t'
                +e.find('th:nth-child(1)').text().replace(/\s+/g,' ').trim()+'\t'
                +e.find('th:nth-child(1) a').prop('href')+'\t'
                +e.find('td:nth-child(2)').text()+'\t'
                +e.find('td:nth-child(3)').text()+'\t'
                +net.sf.files[e.attr('title')].sha1+'\n'
            );
        });

        salida.select();

    });

})();