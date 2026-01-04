// ==UserScript==
// @name         FootMundo to Popmundo theme
// @namespace    Vicente Ayuso
// @version      1.4
// @description  Change Footmundo theme to popmundo theme
// @author       Vicente
// @match        https://www.footmundo.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT          
// @downloadURL https://update.greasyfork.org/scripts/464778/FootMundo%20to%20Popmundo%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/464778/FootMundo%20to%20Popmundo%20theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Adding custom CSS styles
    GM_addStyle(`
        *{
          font-family: Sans-Serif;
        }
        div.header-p{
          all: unset;
        }
        header{
          border: none !important;
        }
        nav{
          all: unset;
        }
        body {
            background-color: #63767f;
            background-image: url('https://i.imgur.com/tUvUKCY.png');
            background-repeat: repeat-x;
            color: #000;
        }

        div.bloc header {
            font-size: 12px;
            background-image: url(https://i.imgur.com/AXlQCrO.png);
            background-color: #56686f;
            background-repeat: repeat-x;
            color: #fff;
            font-weight: 500;
        }
        div#opcoes h3.menu {
            font-size: 12px;
            background-image: url(https://i.imgur.com/AXlQCrO.png);
            background-color: #56686f;
            background-repeat: repeat-x;
            color: #fff;
            font-weight: 500;
        }

        div.content{
            background-color: #d1d1d1;
            z-index:999;
            box-shadow: 0 2px 15px;
            padding-top:0px;
            margin-top: 40px;
            border-radius: 10px 10px 0 0;

        }
table#centro{
  padding:15px;
}

        .custom-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 993;
            pointer-events: none;
            background-image: url('https://i.imgur.com/tUvUKCY.png');
            background-repeat: repeat-x;
        }
        strong {
            color: #000;
        }
        div.tempo_de_jogo {
            font-family: Arial;
            color: #000;
        }
        div.bloc h3 {
            color: #fff;
            font-weight: normal;
        }
        header.top{
                    font-size: 12px;
                    background-image: url(https://i.imgur.com/AXlQCrO.png);
                    background-color: #56686f;
                    background-repeat: repeat-x;
                    color: #fff;
                    font-weight: 500;
                    max-width: 100%;
                    position: sticky;
                    border-radius: 10px;




        }

        div.header-content{
                      font-size: 12px;
                    background-image: url(https://i.imgur.com/rKIoltZ.jpg);
                    background-color: #56686f;
                    background-repeat: repeat-x;
                    color: #fff;
                    font-weight: 500;
                    border: none !important;
                    margin-bottom: 0;
                    border-radius: 10px 10px 0 0;
                    height: 70px;


        }
div.data{
  top:40%;
}


div#footer{
    font-size: 12px;
    background-image: url(https://i.imgur.com/AXlQCrO.png);
    background-color: #56686f;
    background-repeat: repeat-x;
    color: #fff;
    font-weight: 500;
    max-width:100%;
    position: sticky;
}
        nav.header-content#menu-links{

                            font-size: 12px !important;
                            background-image: url(https://i.imgur.com/LfI6xXc.png) !important;
                            background-color: #56686f !important;
                            background-repeat: repeat-x !important;
                            color: #fff !important;
                            font-weight: 500 !important;
                            display: flex;
                            justify-content: center;
                            flex-wrap: wrap;
                            margin-top:0px;
                            height:35px;

        }

div#info{
  background: none;
}
div#fotoperfil{
  margin:10px;
  border-radius: 10px;
}


        nav.header-content ul.list-auto {
            list-style-type: none;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        nav.header-content ul.list-auto li {
            display: inline-block;
        }
        header.top li a {
            color: #000;
        }
        div.menu-s{
                      font-size: 12px;
                    background-image: url(https://i.imgur.com/AXlQCrO.png);
                    background-color: #56686f;
                    background-repeat: repeat-x;
                    color: #fff;
                    font-weight: 500;
        }
        header.top ul {
            background: linear-gradient(to right, transparent,transparent,transparent);
        }
div.menu-s{
  border: none !important;
  margin-bottom:15px;
}
table.esquema{
  background-color:#b8b9ba;
  color:black !important;
}
table.esquema a{
  color:black !important;
}
tr.ls{
  background-color: #ebeced;
}
        ul .header-content #menu-links{
          left:50%;
        }
        .CriadaAgora .box#conteudo{
          padding-top: 10px;
          font-size: 1.0em;
          color: black;
          background-color:#fff
        }
        span.dinheiro {
            color: black;
            text-shadow: none;

        }
        div.bloc {
            border: none !important;
        }
        div.bloc header {
            height:25px;
        }
        div.menu h3{
          font-size: 13px;
        }
        div.menu a{
          font-size:11px;
        }
        div.bloc h3{
          font-size: 13px;
        }

        div#entradas ul{
          font-size:12px;

        }
        ul#ul-header-links a{
          font-size:11px;
        }
        div.box {
            border: none !important;
        }
        div#blog_post_content{
          border: none !important;
        }
        div#menu-time{
          border: none !important;
        }
        header.top li {
              border: none !important;
        }
.titulo-pagina h2,
.titulo-pagina span, .titulo-pagina h3 {
    color: black !important;
     text-shadow: none !important;
}

div#condicao, div#disposicao, div#fama {
    border: 0.2px solid white;
    min-height:11px;
    height:11px;


}
table#centro img{
  margin-bottom:10px;
  box-shadow: 0 15px 15px;
}


.menu{
  border: none !important;
}

.btn_padrao{
    background: none;
    font-size: 1.0em;
    background-color: #fafafa;
    color:black;
    border-radius: 7px !important;
    padding: 2px 5px;
    border: 1px solid #999;
}
div.right{
  margin-right:15px;
}
div.center{
  margin-left:15px;
  margin-right:15px;
}
div.barra{
  margin-top:0;
}
div#info {
    margin-top: 2%;
    font-size:11px;
}

input[type=submit].btn_padrao, input[type=button].btn_padrao {
    background: #f0f0f0;
    font-size: 1.0em;
    color: black;
}


input[type=submit], input[type=button] {
    border-radius: 7px !important;
    -moz-border-radius: 7px !important;
    -webkit-border-radius: 7px !important;
    padding: 2px 5px !important;
    border: 1px solid #999 !important;
}

input[type=submit]:hover, input[type=button]:hover {
    background-color: #fafafa !important;
}

input[type=submit]:disabled, input[type=button]:disabled {
    background-color: rgba(204, 204, 204, 0.5) !important;
    border: 1px solid #bbb !important;
    color: #777 !important;
    cursor: not-allowed !important;
}

input[type=submit].noround, input[type=button].noround {
    border-radius: 0px !important;
    -moz-border-radius: 0px !important;
    -webkit-border-radius: 0px !important;
    `);

    // Creating the custom background element
    const customBackground = $('<div class="custom-background"></div>');
    $('body').append(customBackground);
    $(".CriadaAgora .box#conteudo").removeAttr("style");

        function replaceImageSources() {
        $('img').each(function () {
            var src = $(this).attr('src');
            if (src === 'img/barra/4.png') {
                $(this).attr('src', 'https://i.imgur.com/2mcBQhJ.gif');
            } else if (src === 'img/barra/2.png') {
                $(this).attr('src', 'https://i.imgur.com/up2DD7p.gif');
            } else if (src === 'img/barra/3.png') {
                $(this).attr('src', 'https://i.imgur.com/ugo34gF.gif');
            } else if (src === 'img/barra/1.png') {
                $(this).attr('src', 'https://i.imgur.com/XXpIDPi.gif');
            }
        });
    }

    $(document).ready(replaceImageSources);

    function addImageToDivWithTitle() {
        $('div[title]').each(function () {
            var title = $(this).attr('title');
            if (title.includes('%')) {
                var img = $('<img>');
                img.attr('src', 'https://i.imgur.com/C8DjBzq.gif');
                img.css({
                    'width': '100%',
                    'height': '100%',
                    'position': 'absolute',
                    'z-index': '3'
                });
                $(this).css('position', 'relative');
                $(this).append(img);
            }
        });
    }

    $(document).ready(addImageToDivWithTitle);

})();
