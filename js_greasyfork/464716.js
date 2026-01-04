// ==UserScript==
// @name         AnimeFLV custom CSS
// @namespace    RocaKirby#4633
// @version      1.2.18.1
// @description  un CSS personalizado a la página de AnimeFLV
// @author       Samgamer494
// @icon         https://cdn.discordapp.com/attachments/801908710648578058/1099738765926355035/AnimeFLVLogo.png
// @match        https://www3.animeflv.net/*
// @exclude      https://www3.animeflv.net/condiciones-de-uso.html
// @exclude      https://www3.animeflv.net/politica-de-privacidad.html
// @exclude      https://www3.animeflv.net/sobre-animeflv.html
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464716/AnimeFLV%20custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/464716/AnimeFLV%20custom%20CSS.meta.js
// ==/UserScript==

/*=======================================================================================================
RECOMIENDO ABSOLUTAMENTE QUE USEN UN BLOQUEADOR DE ANUNCIOS (UBLOCK ORIGIN, ADGUARD, ETC) PARA EVITAR
VENTANAS EMERGENTES, ANUNCIOS, ETC, ETC....
=======================================================================================================*/

(async () => {

    const selectors = [
        { selector: "main.Main section.WdgtCn:nth-of-type(1)", id: "Sinopsis" },
        { selector: "main.Main section.WdgtCn:nth-of-type(2)", id: "Episodios" },
        { selector: "main.Main section.WdgtCn:nth-of-type(3)", id: "Disqus" },
        { selector: "div.CpCnC section.WdgtCn:nth-of-type(1)", id: "Kudasai" },
        { selector: "div.CpCnB div.WdgtCn:nth-of-type(4)", id: "Disqus" }
    ];

    const addId = async (selector, id) => {
        const element = await document.querySelector(selector);
        if (element) {
            element.id = id;
        }
    };

    const addIds = async () => {
        const promises = selectors.map(({ selector, id }) => addId(selector, id));
        await Promise.allSettled(promises);
    };

    const isAnimeFlvPage = () => {
        const { href } = window.location;
        return href.includes("https://www3.animeflv.net/anime/") || href.includes("https://www3.animeflv.net/ver/");
    };

    document.addEventListener("DOMContentLoaded", async () => {
        if (isAnimeFlvPage()) {
            await addIds();
        }
    });
})();
//Añade Id's a elementos para facilitar su edicion.

(async () => {

    const removeElements = async () => {
        const botonVisto = document.querySelector(".BtnNw.CVst.BxSdw.fa-eye");
        const divLogin = document.querySelector("div.Login");
        if (botonVisto?.parentNode) {
            botonVisto.remove();
        }
        if (divLogin?.parentNode) {
            divLogin.remove();
        }

        const botonesFacebook = document.querySelectorAll(".fa-facebook");
        for (const boton of botonesFacebook) {
            if (boton?.parentNode) {
                boton.remove();
            }
        }

        const Bugs = document.querySelectorAll(
            "ul.ListAnmBnts, div#add_pending, span.Estreno, a.Active, .ShrCnB, .div-84413"
        );
        for (const bug of Bugs) {
            if (bug?.parentNode) {
                bug.remove();
            }
        }
    };
    document.addEventListener("DOMContentLoaded", async () => {
        await removeElements();
    });
})();
//Elimina algunas cosas de la pagina ya que no funciona o estan bugueadas, por ahora.


async function VideoExpand() {
//SI USAS EL SCRIPT EN CEL O TIENES UNA PANTALLA DE TAMAÑO REDUCIDA NO FUNCIONARA.
    await new Promise((resolve) => {
        window.addEventListener("DOMContentLoaded", () => {
            const btnExpandido = document.querySelector("i.fa-expand");
            if (btnExpandido) {
                btnExpandido.click();
            }
            resolve();
        });
    });
}
//SI USAS EL SCRIPT EN CEL O TIENES UNA PANTALLA DE TAMAÑO REDUCIDA NO FUNCIONARA.
if (window.location.href.includes("https://www3.animeflv.net/ver/")) {
    document.addEventListener("DOMContentLoaded", async () => {
        await VideoExpand();
    });
};
//Autoclickea en el boton "Expandir" automaticamente, si no te gusta puedes desactivarlo quitando el "i.fa-expand".


//ALGUNAS VECES NO PUEDE CARGAR, SI ESO PASA SOLO RECARGA LA PAGINA, SI EL PROBLEMA PERSISTE CONTACTAME.
//EN CHROME ALGUNAS PARTES ESTAN BUGUEADAS.
GM_addStyle(` /*Lo principal, el diseño de la pagina etc etc...*/
html
{
  scrollbar-color: #fff #212324;   /*Solo soportado por Firefox*/
  scrollbar-width: thin;   /*Solo soportado por Firefox*/
  scrollbar-gutter: stable;   /*No soportado por Safari, Firefox*/
  -webkit-text-size-adjust: auto;   /*No soportado por Safari, Firefox*/
  text-size-adjust: auto;   /*No soportado por Safari, Firefox Desktop*/
  image-rendering: optimizequality;
}

body,
div.Body
{
  background: #32383e;
}

.Header,
.Footer
{
  background-color: #272c2f;
  box-shadow: 0 0 0.625rem 0.0625rem #000;
}

.Header > .Mid .Search > form input
{
  background-color: #444;
  border: 0.0625rem solid #595959;
}

.ListResult > li > a > .title:hover,
.Brdcrmb a:hover
{
  color: #01bcf3 !important;
  transition: all .2s linear;
}

article.Anime.alt.B:hover,
img[src="https://animeflv.net/img/v2_300x100.png"]:hover
{
  transform: scale(1.1);
  transition-property: all;
  transition-duration: 0.1s;
  z-index: 2 !important;
}

article.Anime.alt.B:not(:hover),
img[src="https://animeflv.net/img/v2_300x100.png"]:not(:hover)
{
  transition-duration: 0.1s;
  z-index: 1;
}

img[src="https://www3.animeflv.net/assets/animeflv/img/Banner-Merchi.jpg"],
img[src="https://animeflv.net/img/v2_300x100.png"]
{
  border: 0.0625rem solid #000;
}

div.Title.Page h2,
div.Title.Page.fa-star.B12 h1,
div.Title.Page.fa-star h2
{
  color: #fff;
  text-align: center;
  text-shadow: 0.25rem 0.0625rem #000;
  border: 0.0625rem #000 solid;
  background-color: #2e3437;
  border-radius: 0.625rem;
}

div.Title.Page.fa-star h2
{
  margin-left: -1.993rem;
  margin-right: -1.25rem;
}

.Anime.alt > a > .Title,
.CpCnA .CapiTop .Title,
.ListCaps > li .Stts,
.CpCn.show .CpCnA .CapiTop .SubTitle,
.CpCnA .CapiTop h2.SubTitle,
.Title,
.ListAnmRel > li > a,
a,
.Wdgt.Emision > .Top,
.ListResult > li
{
  color: #fff;
}

li .Type
{
  opacity: 0.8;
}

.Anime.alt .Image
{
  background-color: #aeb4b8;
  box-shadow: 0 0 0.4375rem 0.0313rem #000;
}

#Sinopsis.WdgtCn .Top .Title,
#Episodios.WdgtCn .Top .Title,
.WdgtCn.Sm .Top,
.CpCnA .CapiTop .Title
{
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.875rem;
  letter-spacing: -0.0625rem;
}
div.CpCnA
{
  color: #66b750;
}

section#Sinopsis.WdgtCn
{
  text-align: center;
}

#Disqus.WdgtCn,
section#Sinopsis.WdgtCn,
section#Episodios.WdgtCn,
section#Kudasai.WdgtCn,
.Wdgt.Emision,
.ListEpisodios,
.ListAnimes,
.WdgtCn.Sm,
.DwsldCn.show, .DwsldCn,
.ListResult,
.Anime.alt.B .Description
{
  color: #fff;
  background-color: #2e3437;
  border: 0.0625rem groove #241d1d;
  border-radius: 0.75rem;
  box-shadow: 0 0 0.1875rem 0.03125rem #000;
  padding: 0.9375rem 1.25rem 1.25rem;
  margin-bottom: 1.25rem;
}

.ListEpisodios,
.ListAnimes
{
  padding-top: 0.0625rem;
}

.DwsldCn,
.ListResult
{
  padding: 0;
}

.Wdgt.Emision
{
  right: 1em;
  position: relative;
  padding: 0;
  margin-top: auto;
}

.Wdgt.Emision > .Top,
.ListResult > li
{
  border-bottom: 0.0625rem groove #282121;
}

.ListResult > li.MasResultados
{
  border-bottom: 0;
  border-bottom-right-radius: 0.625rem;
  border-bottom-left-radius: 0.625rem;
}

.Anime.alt.B .Description
{
  padding: 0.9375rem;
  left: 100% !important;
  top: -35%;
}


.BtnNw,
.CapNv
{
  background-color: #54595b;
  color: #fff;
}

.CapiTcn
{
  border: 0.125rem solid #1f292e;
}

.Title.Page.fa-star
{
  right: 1.4375rem;
}
.Title.Page.fa-star::after,
.Title.Page.fa-star::before,
.opivw,
.opivw input
{
  display: none !important;
}

.Title .Order
{
  position: relative;
}

.filters
{
  margin-bottom: 1.5625rem !important;
  text-align: center;
}

a.CapNvLs.fa-th-list,
a.CapNvPv.fa-chevron-left,
a.CapNvNx.fa-chevron-right
{
  border-radius: 1.25rem 1.25rem 1.25rem 1.25rem;
  box-shadow: none;
}

ul.ListAnmRel li
{
  color: #dd0a0a;
  line-height: 1.563rem;
}

.AnimeCover
{
  background-color: #aeb4b8;
  box-shadow: 0 0 0.625rem 0.0625rem #aeb4b8;
}

a.fa-play::before
{
  right: 0.5rem;
  border-radius: 0.625rem;
  box-shadow: 0 0 0.5625rem 0.1875rem #000;
  background-color: #000;
}

.DpdwCnt.TtCn
{
  background-color: unset;
}

.Anime.alt.B .Image::after
{
  background-color: rgba(0,0,0,.4);
}

`);
//EN CHROME ALGUNAS PARTES ESTAN BUGUEADAS.
//ALGUNAS VECES NO PUEDE CARGAR, SI ESO PASA SOLO RECARGA LA PAGINA, SI EL PROBLEMA PERSISTE CONTACTAME.
