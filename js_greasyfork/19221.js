// ==UserScript==
// @name        Anait+
// @namespace   https://www.anaitgames.com/usuarios/adekus
// @description Haciendo de Anait un lugar un poco mejor
// @author      Adekus
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @include     https://www.anaitgames.com/*
// @version     1.2.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19221/Anait%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/19221/Anait%2B.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
jQuery.fn.reverse = [].reverse;

const IDCOMMENT = "modalcomment";
var apMentionComment = GM_getValue ("apMentionComment", true),
    apMentionForumComment = GM_getValue ("apMentionForumComment", true),
    apGallery = GM_getValue ("apGallery", true),
    apFormButtons = GM_getValue ("apFormButtons", true),
    apAuthor = GM_getValue ("apAuthor", true),
    apActivityAuthor = GM_getValue ("apActivityAuthor", true),
    apMyScore = GM_getValue ("apMyScore", false);

function getUserClass (mention){
    return ('.user-' + mention.text().replace('@', ''));
}

function getLastComment(mention) {
    var usuario = getUserClass (mention);
    return (mention.offsetParent().prevAll(usuario + ':first').find('div.comment-text').html());
}

function addModalComment(mention, comment) {
    var idComment = "#" + IDCOMMENT,
        windowBottom = $(window).scrollTop() + $(window).height(),
        commentHeight,
        commentBottom,
        posTop,
        posLeft = mention.offset().left,
        topBar = parseInt($(".navbar-inner").height(), 10);

    if (($(idComment).length === 0) && mention.is(":hover")) {
        mention.after("<div id=" + IDCOMMENT + " class=\"comment-block comment-text modalcomment\"></div>");
        if (comment) {
            $(idComment).html(comment);
        } else {
            $(idComment).html('<img alt="slowpoke" title=":slowpoke: 4ever" src="https://www.anaitgames.com/img/404.gif" width="60px"><h2 style="color:#d4021c;">FFFFUUUU-</h2>El comentario que est&aacute;s buscando <strong>no est&aacute; escrito</strong>.');
        }

        commentHeight = $(idComment).outerHeight();
        commentBottom = $(idComment).offset().top + commentHeight;

        if (commentBottom > windowBottom) { //El comentario sale por debajo de la ventana
            posTop = windowBottom - commentHeight - 10;
            topBar = parseInt($(".navbar-inner").height(), 10);
            if (posLeft > ($(window).width() / 2)) { //La mencion esta en la derecha
                posLeft -= $(idComment).outerWidth() + 10;
            } else {
                posLeft += mention.width() + 10;
            }
            if (commentHeight > ($(window).height() - topBar)) { //El comentario es mas largo que la ventana
                posTop = $(window).scrollTop() + topBar + 5;
            }
            $(idComment).offset({ top: posTop, left: posLeft});
        }
    }
}

function getCommentFromPrevPage (mention){
    var prevurl = "https://www.anaitgames.com/foro/" + $(".prev > a").attr("href"),
        usuario = getUserClass (mention),
        lastComment;

    $.ajax({
        url: prevurl,
        type:'GET',
        success: function(data){
            lastComment = $(data).find(usuario + ':last').find('div.comment-text').html();
            addModalComment(mention, lastComment);
        }
    });
}

function getAnaitScore() {
    return parseInt($('span[itemprop="ratingValue"]').text(), 10);
}

function setNewScore(newScore) {
    var newScoreClass;
    if (newScore >= 0 && newScore <= 10){
        newScoreClass = "nota puntuacion-" + newScore;
        $("span.nota > span").text(newScore);
        $("span.nota").parent().attr("class", newScoreClass);
    }
}

function currGaleryImg() {
    var urlScreenshot = $("#screenshot").attr("src"),
        img = $('.img-polaroid[url="' + urlScreenshot + '"]').attr("id").replace("img_", "");
    return parseInt(img, 10);
}

function setGalleryButtons(numImages) {
    switch (currGaleryImg()) {
        case 0: //Primera imagen
            $("#aptoprev").css("visibility", "hidden");
            $("#aptonext").css("visibility", "visible");
            break;
        case (numImages-1): //Ultima imagen
            $("#aptoprev").css("visibility", "visible");
            $("#aptonext").css("visibility", "hidden");
            break;
        default:
            $("#aptoprev").css("visibility", "visible");
            $("#aptonext").css("visibility", "visible");
    }
}

function changeScreenshot(urlNew) {
    $("#screenshot").attr("src", urlNew);
    $("#ver_imagen_completa").attr("href", urlNew);
}

function createCheckBox (id, apVal, apName, text) {
    var idCheckBox = "#" + id;
    $("#opcionesplus").append('<div class="checkbox" style="padding-top: 3px;padding-bottom: 3px;"><input id="' + id + '" type="checkbox">' + text + '</div>');
    if (apVal) {
        $(idCheckBox).prop("checked", true);
    } else {
        $(idCheckBox).prop("checked", false);
    }

    $(idCheckBox).click(function(){
        if ($(this).is(':checked')) {
            GM_setValue (apName, true);
        } else {
            GM_setValue (apName, false);
        }
    });
}

function addAuthor (author, elem){
    elem.parent().after('<span class="author">por <a href="https://www.anaitgames.com/usuarios/' + author['usuario'] + '"><span itemprop="author" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name">' + author['nombre'] + '</span></span></a></span>');
}

function addActivityAuthor (author, elem){
    var avatar = $("img[alt='" + author['nombre'] + "']").attr('src');
    if (avatar == null){
        avatar = "https://www.anaitgames.com/images/avatar/" + author['usuario'] + ".jpg";
    }
    elem.prepend('<div style="float:right; "><img style="width: 25px; height: 25px; margin-right: 0px; margin-top: -3px;" src="' + avatar + '"></div>');
}

function saveAuthor (authorList){
    if (Object.keys(authorList).length > 20) {
        delete authorList[Object.keys(authorList)[0]];
    }
    GM_setValue("Authors", JSON.stringify(authorList));
}

function getAuthor (elem, authorList, activity){
    var articulo;
    if (activity){
        articulo = elem.find('.goto').attr("href").split('#')[0];
    } else {
        articulo = elem.attr("href");
    }

    $.ajax({
        url: articulo,
        type:'GET',
        success: function(data){
           var author ={};
           author['usuario'] = $(data).find('.author > a').attr('href').split("/")[4];
           author['nombre'] = $(data).find('span[itemprop="name"]').first().text();
           if (activity){
               addActivityAuthor(author, elem);
           } else {
               addAuthor(author, elem);
           }
           authorList[articulo] = author;
           saveAuthor(authorList);
        }
    });
}

function checkAuthor(elem, authorList){
        if (!elem.parent().next().hasClass("author")){
            if ($.inArray(elem.attr("href"), Object.keys(authorList)) !== -1 ) { //Tenemos guardado el autor del artículo
                addAuthor (authorList[elem.attr("href")], elem);
            } else {
                getAuthor(elem, authorList);
            }
        }
}

function checkActivityAuthor(elem, authorList){
        if (elem.find('.goto').text().indexOf("noticia") != -1){ // actividad en noticia
            var noticia = elem.find('.goto').attr("href").split('#')[0];
            if ($.inArray(noticia, Object.keys(authorList)) !== -1 ) { //Tenemos guardado el autor del artículo
                addActivityAuthor (authorList[noticia], elem);
            } else {
                getAuthor(elem, authorList, true);
            }
        }
}

//Main
var currLoc = window.location.href.split("/");

if (apActivityAuthor || (apAuthor && $('#posts').length)){ // ver autores
    var authorList = JSON.parse(GM_getValue("Authors", "{}"));
    var config = { childList: true };
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                if (mutation.addedNodes.length) {
                    var newNodes = mutation.addedNodes; // DOM NodeList
                    var $nodes = $( newNodes ); // jQuery set
                    if ($('#actividad_reciente_container').is(":visible")){  // autores en actividad
                        $nodes.reverse().each(function() {
                            checkActivityAuthor($(this), authorList);
                        });
                    } else { // autores en portada
                        $nodes.find('h2 > a').reverse().each(function() {
                            checkAuthor($(this), authorList);
                        });
                    }
                }
            }
        }
    };
}

if (apActivityAuthor){  // autores en actividad
    var targetActividad = $("#actividad_reciente_container")[0];
    var observerActividad = new MutationObserver(callback);
    observerActividad.observe(targetActividad, config);
}

if (apAuthor && $('#posts').length) { // autores en portada
    var targetPost = $("#posts")[0];
    var observerPost = new MutationObserver(callback);
    observerPost.observe(targetPost, config);
    $('#posts').find('h2 > a').reverse().each(function () {
        checkAuthor($(this), authorList);
    });
}

if ((apMentionComment && currLoc[3] != "foro") || (apMentionForumComment && currLoc[3] == "foro" && currLoc[4] !=null && currLoc[4].indexOf("hilo") != -1)){ //Comentarios en las menciones

    var myCSS = "<style>" +
            ".modalcomment {" +
                "position: absolute;" +
                "z-index: 1;" +
                "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);" +
                "width: " + $(".comment-block").css("width") + ";" +
            "}" +
            "</style>";
    $("head").append(myCSS);

    $("[class*='rol_']").mouseenter(function(){
        var blockquote = ($(this).parent().prop("tagName") == "BLOCKQUOTE");
        if (!blockquote || (blockquote && !$(this).is(":first-child"))) { //La mencion no es una cita
            var comment = getLastComment($(this));
            $(".body").css("overflow", "visible");
            if ((currLoc[3] == "foro") && !(comment)) {
                getCommentFromPrevPage($(this));
            } else {
                addModalComment($(this), comment);
            }
        }
    });

    $("[class*='rol_']").mouseleave(function(){
        $("#" + IDCOMMENT).remove();
    });
}

if ($(".format-buttons").length && apFormButtons && (currLoc[3] != "foro")) { //botones formulario
        $(".format-buttons").css({"width":"600px", "margin-left":"327px"});
        $("#texto_comentario").css({"width":"588px", "margin-left":"327px"});
        $(".comment-form > .tablet-hide").css("margin-left", "162px");
        $(".uniForm > p").css("margin-left", "162px");
        $(".format-buttons").append('<a accesskey="p" title="Inserta imagen: [img]http://imagen_url[/img]  (alt+p)" onclick="bbstyle(14)" value="Img" name="addbbcode14" class="bb-action"><i class="icon-picture"></i> <span>Imagen</span></a>');
        $(".format-buttons").append('<a title="[youtube]ID[/youtube] - El ID del v&iacute;deo es el n&uacute;mero del final de la URL: http://www.youtube.com/watch?v=XXXXXXXXXXX" onclick="bbstyle(28)" value="Youtube" name="addbbcode28" class="bb-action"><i class="icon-facetime-video"></i> <span>V&iacute;deo</span></a>');
}

if (currLoc[3] == "analisis" && apMyScore) {  //Analisis
    var anaitScore = getAnaitScore(),
        game = currLoc[4],
        userScoreList = JSON.parse(GM_getValue("Games", "{}")),
        myCSSA = "<style>" +
                ".scoreboxover {" +
                    "position: absolute;" +
                    "right: -25px;" +
                    "bottom: -70px;" +
                    "width: 200px;" +
                    "height: 200px;}" +
                ".scorebox {" +
                    "background-color: rgba(255, 255, 255, 0.9);" +
                    "border-radius: 4px;" +
                    "padding: 2px;" +
                    "position: absolute;" +
                    "right: 0px;" +
                    "width: 0px;" +
                    "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);" +
                    "opacity: 0;" +
                    "display: inline-table;" +
                    "transition: 0.2s ease-in;" +
                    "visibility: hidden;}" +
                ".scorebox.show {" +
                    "width: 20px;" +
                    "opacity: 1;" +
                    "right: 11px;" +
                    "visibility: visible;}" +
                ".recbutton {" +
                    "background-color: #d4021c;" +
                    "border-radius: 10px;" +
                    "width: 10px;" +
                    "height: 10px;" +
                    "margin: 5px;}" +
                ".scorebtn {" +
                    "padding: 0;" +
                    "width: 20px;" +
                    "-webkit-user-select: none;" +
                    "-moz-user-select: none;" +
                    "-ms-user-select: none;}" +
                "</style>";

    $("head").append(myCSSA);
    $(".big-foto").append("<div class=\"scoreboxover\">" +
                              "<div class=\"scorebox\" style=\"bottom: 144px;\">" +
                                  "<a class=\"btn scorebtn\" id=\"resetscore\" rel=\"tooltip\" data-original-title=\"La nota de Anait\"><img src=\"https://www.anaitgames.com/images/logros/staff.png\" width=\"16\" style=\"margin-bottom: -3px;\"></img></a>" +
                              "</div>" +
                              "<div class=\"scorebox\" style=\"bottom: 80px;\">" +
                                  "<a class=\"btn scorebtn\" id=\"increasescore\">+</a>" +
                                  "<a class=\"btn scorebtn\" id=\"decreasescore\">-</a>" +
                              "</div>" +
                              "<div class=\"scorebox\" style=\"bottom: 38px;\">" +
                                  "<a class=\"btn scorebtn\" id=\"savescore\" rel=\"tooltip\" data-original-title=\"Guardar nota\"> <div class=\"recbutton\"></div> </a>" +
                              "</div>" +
                          "</div>");

    setNewScore(userScoreList[game]);
    $(".scoreboxover").mouseenter(function(){$(".scorebox").toggleClass("show");});
    $(".scoreboxover").mouseleave(function(){$(".scorebox").toggleClass("show");});
    $("#increasescore").click(function() {setNewScore(getAnaitScore() + 1);});
    $("#decreasescore").click(function() {setNewScore(getAnaitScore() -1);});
    $("#resetscore").click(function() {setNewScore(anaitScore);});
    $("#savescore").click(function() {
        var currentScore = getAnaitScore();
        if (anaitScore == currentScore) {
            delete userScoreList[game];
        } else {
            userScoreList[game] = currentScore;
        }
        GM_setValue("Games", JSON.stringify(userScoreList));
    });
}

if (currLoc[3] == "imagenes" && apGallery) {  //Galeria de imagenes
    var numImages = $(".img-polaroid").length,
        myCSSI = "<style>" +
                ".img-polaroid {" +
                    "cursor: pointer;" +
                    "cursor: hand;}" +
                ".img-polaroid:hover {" +
                    "position: relative;" +
                    "top: -3px;}" +
                ":focus {" +
                    "outline:none;}" +
                "::-moz-focus-inner {" +
                    "border:0;}" +
                ".aptobutton {" +
                    "cursor: pointer;" +
                    "z-index: 3;" +
                    "position: absolute;" +
                    "top: 0;" +
                    "color: #fff;" +
                    "background-color: #000;" +
                    "opacity: 0.7;" +
                    "padding: 10px 20px;" +
                    "display: none;" +
                    "-webkit-user-select: none;" +
                    "-moz-user-select: none;" +
                    "-ms-user-select: none;}" +
                ".aptobutton:hover {" +
                    "opacity: 1;}" +
                 "</style>";

    $("head").append(myCSSI);
    $(".marco").prepend('<div id="aptonext" class="aptobutton" style="right: 0px;">Imagen siguiente <i class="icon-circle-arrow-right icon-white"></i></div>');
    $(".marco").prepend('<div id="aptoprev" class="aptobutton"><i class="icon-circle-arrow-left icon-white"></i> Imagen anterior</div>');

    if (currLoc[4].indexOf("#c")) changeScreenshot($("#img_0").attr("url")); //Llegamos a la galeria mediante un comentario

    $("#to-prev").css("visibility", "hidden");
    $("#to-next").css("visibility", "hidden");
    $("#screenshot").ready(function() {
        setGalleryButtons(numImages);
    });

    $("#aptoprev").click(function (){
        var previmg = currGaleryImg() - 1;
        changeScreenshot($("#img_" + previmg).attr("url"));
        setGalleryButtons(numImages);
    });

    $("#aptonext").click(function (){
        var nextimg = currGaleryImg() + 1;
        changeScreenshot($("#img_" + nextimg).attr("url"));
        setGalleryButtons(numImages);
    });

    $(".marco").mouseenter(function (){
        $(".aptobutton").css("display", "block");
    });

    $(".marco").mouseleave(function (){
        $(".aptobutton").css("display", "none");
    });

    if ($(".img-polaroid").parent().is("a")) $(".img-polaroid").unwrap(); //Eliminamos los enlaces por defecto de las miniaturas
    for (i = 0; i < numImages; i++) {
        $("#img_" + i).wrap("<a href=" + $("#img_" + i).attr("url") + "></a>"); //Creamos los nuevos enlaces
    }

    $(".img-polaroid").parent().click(function(e){
        if (e.which == 1) { //click izquierdo
            e.preventDefault();
        }
    });

    $(".img-polaroid").mousedown(function(e){
        if (e.which == 1) { //click izquierdo
            changeScreenshot($(this).attr("url"));
            setGalleryButtons(numImages);
        }
    });

}

if (currLoc[3] == "usuario") { //Editar perfil
    $("#editar_perfil > .clearfix").before('<div class="seccion" id="opcionesplus"><div class="page-header"><h3>Anait+</h3></div></div>');
    createCheckBox ("commentplus", apMentionComment, "apMentionComment", "Ver &uacute;ltimo comentario en las menciones del blog");
    createCheckBox ("forumcommentplus", apMentionForumComment, "apMentionForumComment", "Ver &uacute;ltimo comentario en las menciones del foro");
    createCheckBox ("formbutttonsplus", apFormButtons, "apFormButtons", "Botones de insertar Imagen y V&iacute;deo en el blog");
    createCheckBox ("galleryplus", apGallery, "apGallery", "Galer&iacute;a Plus");
    createCheckBox ("authorplus", apAuthor, "apAuthor", "Ver los autores de los art&iacute;culos en la portada");
    createCheckBox ("activityauthorplus", apActivityAuthor, "apActivityAuthor", "Ver los autores de los art&iacute;culos en la actividad");
    createCheckBox ("scoreplus", apMyScore, "apMyScore", "Nota Plus");
    $("#opcionesplus").append("<div style=\"font-size: 12px; margin-top: 10px;\"><p>No hace falta pulsar el bot&oacute;n Guardar, las opciones de Anait+ se guardan autom&aacute;ticamente al cambiar.</p></div>");
}