// ==UserScript==
    // @name         El País - CLEANED PAGE & Sin Límite de noticias 😁
    // @namespace    http://zequi.es
    // @version      0.70
    // @description  Limpieza visual de ELPAIS.COM quitando publi y un montón de módulos molestos que no aportan mucho a la lectura. Además nos saltamos el Muro de nº de noticias y el Muro de Login.
    // @author       @zequi
    // @match        https://elpais.*/*
    // @include      https://elpais.com/*
    // @include      https://www.elmundo.es/*
    // @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
    // @grant        none
    // @run-at       document-start
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/393417/El%20Pa%C3%ADs%20-%20CLEANED%20PAGE%20%20Sin%20L%C3%ADmite%20de%20noticias%20%F0%9F%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/393417/El%20Pa%C3%ADs%20-%20CLEANED%20PAGE%20%20Sin%20L%C3%ADmite%20de%20noticias%20%F0%9F%98%81.meta.js
    // ==/UserScript==



    // Mensaje importante:
    // Código ÑAPA: el código es bastante ñapa y hecho a toda leche, para uso personal. Pero si quieres echar una mano. Contacta conmigo! ;)
    //        - ñapa: se usa Jquery, pero se puede quitar perfectamente.
    //        - ñapa: la mayoría del código es para editar estilos, pero se hace a lo bruto, hay que cambiar el enfoque.
    //        - ñapa: se ejecuta el script varias veces para asegurar en vez de poner un listener.
    // Código LEGACY: se ha ido añadiendo nuevo código, pero no hemos mantenido el código viejo (hay muchas líneas que seguro que ya no son necesarias).
    //
    // Lo dicho, si quieres ayudar a mejorar el código o añadir funcionalidad, contacta sin problema.

    (function() {
      "use strict";

      // Capar la ejecución de ciertos JS externos (ej: saltar el Muro de Login)
      //    Ejecutamos lo antes posible estas líneas antes de ready, para evitar la ejecución de algunos Scripts de Javascript,
      //    Quizás algunos de estos JS ya se capán por el browser por algún plugin, pero no viene mal caparlos también aquí para acelerar la carga de página y la privacidad.
      //    Usamos una librería de github, q hemos copiado directamente en nuestro código justo abajo
      checkForBadJavascripts ( [
          [true, /arcsubscriptions.elpais.com/i, function(){console.log("zeq.script - url blocked = arcsubscriptions.elpais.com");} ],
          [true, /pmwall.min.js/i, function(){console.log("zeq.script - url blocked = pmwall.min.js");} ],
          [true, /privacy-center.org/i, null ],
          [true, /adobedtm.com/i, null ],
          [true, /outbrain.com/i, null ],
          [true, /fundingchoicesmessages.google.com/, null ],
          [true, /pxlctl.elpais.com/, null ],
          [true, /s.go-mpulse.net/, null ],
          [true, /ENP-outbrain.js/i, null ],
          [true, /publicapi/i, function(){console.log("zeq.script - url blocked = publicapi");} ],
          [true, /news\.google\.com/i, function(){console.log("zeq.script - url blocked = news.google.com");} ],
          [true, /closed-article-layer.js/i, function(){console.log("zeq.script - url blocked = closed-article-layer.js");} ],
      ] );
      // Inyección de Librería checkForBadJavascripts()
      //    copiada literalmente de: https://gist.github.com/tbrugz/2dd8b53bb6f125c64be9
      //    sólo se ha copiado una función, hay algo más de código no copiado.
      //    y pasada por un minifier (quizás se podría poner sin minimizar para facilitar auditorías de seguridad del código)
      function checkForBadJavascripts(e){return e.length?(checkForBadJavascripts=function(t){for(var r=e.length-1;r>=0;--r){var a=e[r][0],n=e[r][1];if(a){if(n.test(t.target.src))return c(r),!1}else if(n.test(t.target.textContent))return c(r),!1}function c(a){t.stopPropagation(),t.preventDefault();var n=e[r][2];"function"==typeof n&&n(t.target),t.target.parentNode.removeChild(t.target),e.splice(r,1),e.length||window.removeEventListener("beforescriptexecute",checkForBadJavascripts,!0)}},window.addEventListener("beforescriptexecute",checkForBadJavascripts,!0),checkForBadJavascripts):null}

      // UTILS - función para que el Elemento html, se ponga de color gris por defecto, y con mouseover se ponga en color gris oscuro.
      function elementHoverize(selector, color_non_hovered = "lightgrey",  color_hovered = "darkgrey") {
          $(selector).css("color", color_non_hovered)
          $(selector).hover(function(){$(this).css("color",color_hovered);}, function(){$(this).css("color",color_non_hovered);})
      }


      $(document).ready(function() {

        // Hay una pequeño código para limpiar la basura de periódico de ElMundo, pero no está mantenida esta función.
        function cleanElmundo() {
            // CABECERA
            $(".ue-c-seo-links-container").remove();

            // PORTADA
            $(".ue-c-newsletter-widget").remove(); // modulo de newsletter
            //$(".ue-c-cover-content__byline-list").remove(); // nombre del periodista en cada noticia
            $(".ue-c-cover-content__byline-name").remove();
            $(".servicios_vwo").remove(); //módulos de servicios
            $(".ue-c-cover-content__icon-premium").parent().parent().css("background-color", "#edab3b").css("opacity", "0.4"); //marca visualmente las noticias de pago

            // PageNOTICIA > post-CUERPO
            $(".ue-c-article__trust").remove(); // seccion TrustProject

            // PaginaNoticia > LATERAL derecho ENTERO!
            $(".ue-l-article__secondary-column").remove(); // fuera columna derecha entera

            // PaginaNoticia > LATERAL derecho ENTERO!
            $(".ue-c-article__share-tools").remove(); //botones de compartir
        }





        function cleanElpais() {

          // ANTI-WALL > resetea el número de noticias gratis
          if (window.location.href!="https://elpais.com/") {  //no se ejecuta en portada
              localStorage.removeItem('ArcP');
          }
            /*antiguo reseter
              var aa = JSON.parse(localStorage.getItem('ArcP'));
              aa.anonymous.rc["8"].c = -99;
              localStorage.setItem('ArcP', JSON.stringify(aa));
            */

          // CABECERA
          $(".editions").remove(); //links a otras ediciones/idiomas: inglés/catalán/...
          $(".subscribe").remove(); //botón Subscribirse al lado del botón login
          $(".horizontal_scroll_wrapper").remove(); //links a otras secciones
          $(".alertBar").remove(); //quita el breaking-news (algo supuestamente urgente)
          $(".ad-giga-1").remove(); //quita la publi de arriba del todo (v2021oct)
          // Espacios en blanco en la cabecera
            //$(".x").css("padding", "8px"); //quitarle a la cabecera espacios en blanco por encima y debajo de logo elpais
            //$(".x-nf").css("padding-top","3px").css("padding-bottom","0px");
            $("#ctn_head").css("padding","0px");
            //$("#csw").css("margin-top","-4px")
            $(".x-nf .x_w").css("padding-top","0.2rem").css("padding-bottom","0.2rem"); //quitarle a la cabecera espacios en blanco por encima y debajo
            if (window.location.href=="https://elpais.com/") { //solo portada
                $(".x_bh").css("margin-top","0px"); $(".ep_l").css("margin-top","0px"); //quitarle a la cabecera espacios en blanco por encima de logo elpais
                $("h1.ep_l a img.ep_sl").remove() //bajo logo, quita img "periódico global"
                $("h1.ep_l a").css("height","2.75rem") // logo, quitar espacio debajo
                // experimentos o viejo
                   //$("h1.ep_l").css("margin-top", "-6px").css("margin-bottom", "-6px") //tunning posicion logo, ligeramente hacia arriba,
                   //$("h1.ep_l a img.ep_i").css("margin-top", "-1rem")
                   //$("h1.ep_l a img.ep_i").css("height","75%").css("width","75%")
                   //$(".x-nf.x-p .ep_e").css("background-image",'url("https://static.elpais.com/dist/resources/images/logos/primary/el-pais.svg")')
            }
          $(".al._g-o").remove(); // se quita el Breaking News de alertas, porque no suelen ser realmente urgentes. Y siempre está en portada.
          // en la subcabecera de todo el portal, donde están los topics:
            // quitar tanta altura
            $("._g._g-xs.cs").css("padding-top","0.4rem");
            $(".sm._df a").css("padding", "0.4rem 0.4rem");
            $(".x-ph").css("min-height", "0px");
            // fondo transparente de los topics
            $("._g-o.csw").css('background', 'rgba(255, 255, 255, 0)');
            $("#containerCounterLayer").css("background-color", "white")




          //*****  PORTAL-ENTERO > CABECERA *****//
             // Subcabecera Topics
                $(".z-he").css("background", "none") // SubCabecera topics = fondo gris
                elementHoverize(".sm._df > a", "grey", "black"); // SubCabecera > Topics: cambiar color de texto a gris, y negro en hover.
                $("main").css("margin-top", "-1.6em") // SubCabecera topics = minimiza espacio debajo.



          //*****  PORTADA *****//
          // código pensado en portada, pero se ejecuta en todo el portal, se podría reorganizar el código
          		$("ul.menu").remove(); //en cada sección, quitar el submenú de la izquierda.
          		$(".author").remove(); $(".separator").remove(); $(".capitalize").remove();  //quita el nombre del periodista y ciudad
          		$(".c_a").css("color", "#d9d9d9"); //
          		$(".c_t").css("margin-bottom","6px") //encima de la firma, quita un poco de espacio entre titular y firma.
          		$(".c_k.c_k-s").remove(); // portada > mod_noticia ==> borrar el texto de "contenido exclusivo"

          // quitar módulos de publi y auto-promoción
            $(".classifieds_widget").remove();  //modulo de publicidad
            $("classifieds_widget").remove();  //modulo de servicios
            $("#el-pais-que-hacemos").remove() //quita la sección entera de auto-promoción del propio elpais
            $(".c-bra").css("color", "#ddd") // articulos pagados por publicidad, los ponemos en gris claro
            $(".b-eci_txt").remove(); //eliminar gran módulo único en portada  autopromocional
            $(".ad-giga").remove(); //eliminar módulo de publi giga
            $(".b-bra-brandedmix").remove()
          // esquinas redondeadas del conteneder principal (portada y pf_noticia)
            $("main").css("border-radius","8px"); $("article").css("border-radius","8px")
          // fix: arreglar un problema visual del Logotipo repetido, solo en portada principal.
            $(".ep_e").css("background-image", "");




            //*****  PORTADA > CONTENEDORES *****//
            // explicación de selectores de portada
            // "main section._g-o"	= contenedor entero (no aplica a contenedores de final de página)
            // "main header._pr"		= contenedor > titulo superior

                // CONTENEDORES > espacio entre ellos (aplica a * containers)
                        $("main section._g-o").css("margin-top", "1rem")  // altura entre contenedores
                // CONTENEDORES > espacio entre ellos (aplica adhoc en los dos primeros containers)
                        $("main section._g-o:eq(0)").css("margin-top", "-1.0rem") // contenedor 1º = subir un poco (reescribe!!)
                        $("main section._g-o:eq(1)").css("top", "-2.5rem").css("background-color", "pink") //¿¿¿¿¿¿¿¿¿¿¿¿???????????????
                        $("._g-o.z_hr").remove() // adhoc! borrar un espacio entre contenedor 1º y 2º (muy adhoc, facil q se rompa)
                // CONTENEDORES > color fondo blanco, redondeado
                        $("main section._g-o").css("background-color", "white")
                        $("main section._g-o").css("border-radius","15px"); $("article").css("border-radius","15px");
                // CONTENEDORES > TITULO > espacios
                        $("main section._g-o > header").css("padding-top", "0.6rem").css("margin-bottom", '0.6rem') //quita aire encima/debajo del titulo del container
                //$("main header._pr").css("border-bottom", '0px') // portada > contenedor > TITULO borde inferior = eliminado --> DESACTIVADO
                // CONTENEDORES > borrar líneas horizontales
                        $("main header._pr").css("border-top", '0px') // portada > contenedor > borde superior gordo negro = eliminado
                        $("main .b-t_w").css("border-bottom", '0px') // portada > contenedor > borde inferior doble fino = eliminado (no es completo, no arregla * los contenedores con borde-inferior)
                // CONTENEDOR 1º (cambio ADHOC, cuidado)
                        $("main section._g-o:eq(0)").css("padding-top", "1rem") // contenedor 1º > arriba = meter un poco de aire






          // PageNOTICIA > pre-CUERPO (HEADER-noticia:título/entradilla/foto)
          if (window.location.href!="https://elpais.com/") {  //no se ejecuta en portada
              // para limpiar agresivamente la cabecera en la PáginaNoticia, NO en la portada.
              $("#u_c_dv").remove(); //quitar botón de registro
              $(".x_e._dn").remove(); //quitar botón de idioma
              // Cabecera blanca
                  $(".x_ep._df > span, .x_ep._df > div").css("margin-top", 0) //quitar espacio vacío encima del logo
                  $("#ctn_head").css("padding", "0px");  //quitar espacio vacío encima/debajo del logo
              // Subcabecera con tópicos
                  $(".cs").css("padding-top", "0.6rem"); // SubCabecera de Topics = espacio en gris encima de  subheader.topics
                  $("article._g").css("margin-top", "0.001rem"); // SubCabecera de Topics = espacio en gris debajo de subheader.topics
                  $(".cs_t_e").css("font-weight","600") // SubCabecera > categoría principal (arriba izq) = letra más delgada
                  $(".cs_t_e").css("font-size","1.7rem") // SubCabecera > categoría principal (arriba izq) = letra más pequeña
                  //$(".cs_t_e").after().css("height","0.15rem") // SubCabecera > categoría principal (arriba izq) > subrayado = más fino
                  $(".cs_t_e").css("margin-bottom", "-0.7rem") // SubCabecera > categoría principal (arriba izq) = quita espacio de abajo
                  $(".z-he").css("background", "none") // SubCabecera > fondo gris

              //pre-foto
                  $("article > Header.a_e").css("padding-top", "0.5rem"); //
                  $("article > Header > div.a_e_txt").css("color", "#ddd"); // Pre-Titular
              //eliminar módulo de Lotería del lateral de la noticia
                  //$("aside._pr>div").remove();.
          }

          // PageNOTICIA > CUERPO
          if (window.location.href!="https://elpais.com/") {  //no se ejecuta en portada
              $(".a_q").css("color", "#d9d9d9");
              $("section#cta_id").remove(); //elimina el módulo de Subscripción insertado en medio del texto de la noticia

              // post-foto: descripción foto
                  //$(".sb").remove(); //compartir
                  //$(".f_c span.f_a").remove(); //en las imágenes, en el pie de foto se quita nombre del fotógrafo o agencia
                  $(".w_rs").remove(); //eliminar botones compartir
                  //$(".a_e_txt").css("padding-bottom", "1.5rem");  //eliminar botones compartir
                  $(".a_e").css("border-bottom", "0px"); //eliminar la línea horizontal encima del autor
                  //$("article>header figure>figcaption>span").hide()
                  $("figure>figcaption.a_m_p").css("border-bottom-width","0px") // quitar linea debajo descripcion foto en ciertas pf_noticias
                  $("figure>figcaption.a_m_p>span.a_m_m").hide() //en las imágenes, en el pie de foto se quita nombre del fotógrafo o agencia
                  elementHoverize("figcaption.a_m_p")



              // post-foto: Bloque Autor
                  $("article > Header").css("margin-bottom", "8px"); // BloqueAutor > reducir espacio vacío por arriba.
                  $("article > div.a_md").css("margin-top","-2.6rem") // BloqueAutor > reducir espacio vacío por encima.
                  $("article > div.a_md").css("margin-bottom", "0.5rem"); // BloqueAutor > reducir espacio vacío por debajo.
                  $("article .a_md_a").css("margin-bottom","-0.3rem") // BloqueAutor >  quita espacio entre líneas de autor y fecha
                  $("article .a_md_txt").css("margin-top","0.5rem").css("margin-left","-1.7rem") // BloqueAutor > texto => posicionarlo mejor
                  elementHoverize("article .a_md_txt") // BloqueAutor > texto => en gris clarito
                  $("article .a_md_txt > .a_md_f").css("border-bottom-width", "0px"); // BloqueAutor > quitar la línea inferior

          }


          // PageNOTICIA > post-CUERPO
               $("#ctn_closed_article").remove(); //si la noticia concreta está protegida por el 'Muro de Login', se elimina el módulo para logarse.
               $(".a_tp").remove(); // seccion TrustProject
               $(".a_com_l").remove(); // en seccion comentarios, eliminar link a "normas"
               $("#ctn_freemium_article").remove(); // caja de "Contenido exclusivo para suscriptores"


          // PaginaNoticia > LATERAL derecho
               $(".w_b .w_tx").remove(); // en la página de noticia, en lateral > se borra el texto de la newsletter, aunque dejamos el botón

               // publi disfrazada de noticia: borrar
               $("aside._pr>aside.c-brr").remove()

               // módulo newsletter: gris clarito
               $(".w-cta").css("color", "#ddd");
               $(".w-cta > h3").css("color", "#ddd")
               $(".w-cta > h3").css("border-bottom", "0px")

               // módulo Lo más visto
               elementHoverize("section.w-lmv")
               $(".w-lmv").css("border-bottom-width","0px") //quitar línea inferior del módulo
               $(".w_t").css("color","lightgrey")


          // PIE de PAGINA
          $(".fo").css("display", "none") //no se remove() este elemento, xq produce problemas (se pierde la hamburguesa y la barra de avance de lectura)
          $("#footer-lazy").css("display","none"); // oculta el footer entero, pero evitamos usar remove() xq rompe la hamburguesa.
          $("#classified_el-pais").css("display", "none")

          // BORDE y FONDO
          //if (window.location.href!="https://elpais.com/") {  //no se ejecuta en portada
              $(".fusion-app").css({background: 'radial-gradient(#d7dbe0 40%, grey)'}); //cambio visual para mejor Lectura = para que los bordes de la página sean gris, para mejor lectura
          //}
          document.body.style.background = '#d7dbe0'; //cambio visual para mejor Lectura = poner la barra desplazadora lateral derecha más oscura
          document.body.style.scrollbarFaceColor = '#747575';


          //LEGACY - from original code
          //   pendiente revisar si sigue siendo necesario
          $(".fc-dialog-container").fadeOut();
          $(".fc-dialog-overlay").fadeOut();
          $(".fc-whitelist-root").remove();
          $(".fc-ab-root").remove();
          $(".salida_articulo").css("overflow", "visible");

          //LEGACY - codigo extra personalizado por mi
          //   pendiente revisar si sigue siendo necesario
          $(".articulo-trust").remove();
          $(".a_tp").remove(); // seccion TrustProject
          $(".a_d").remove(); // seccion Subscríbete
          $(".articulo-extras").remove();
          $(".articulo_branded").remove();
          $(".pie").remove();
          $(".navegacion-sucripcion").remove();
          $(".bloque-patrocinador").remove();
          $(".bloque_tematico_rsc_2019").remove();
          $(".contenedor_clasificados").remove();
          $(".antetitulo_comercial_generico").parent().remove();
          //v0.7
            $(".articulo_opinion > .articulo__interior > .noticia-cerrada").parent().parent().remove()
            $(".articulo_opinion > .articulo__interior > .noticia-cerrada-cintillo").parent().parent().remove()
          //v0.8
            $(".contenedor_servicios_new").remove();
          //0.9
            $('a[rel="sponsored"]').remove();
          //0.10
            $('#bloque_tematico_deportes').remove();
          //0.11
            $('.bloque_tematico_especial-publi').remove();
        }




        function cleanElpaisDelayed() {
            //este código se ejecuta unos cuantos segundos después de renderizarse la página
            //módulo amarillo Límite de Lectura
            $("#articlesLeftMsg > span").text("tropocientos");
            $(".sc_b").remove(); // borrado el botón para más información de promociones de subscripción elpais
            if  ( $("#ctn_head .ed span:first").text()  == "España" ) {
                $("#ctn_head .ed span:first").text("Espanistán!");
            } ;
        }


        setTimeout(cleanElmundo, 200); setTimeout(cleanElpais, 10);
        setTimeout(cleanElmundo, 500); setTimeout(cleanElpais, 500);
        setTimeout(cleanElmundo, 1400); setTimeout(cleanElpais, 1400);
        setTimeout(cleanElpaisDelayed, 4000);
      });
    })();
