// ==UserScript==
// @author      Fleepeur | fleepeur.deviantart.com | xcottens.free.fr
// @name        Equideow help manager
// @description Tool for help to play to Equideow
// @include     https://*.equideow.com/*
// @version     1
// @icon        https://www.equideow.com/favicon.ico
// @grant       none
// @namespace https://greasyfork.org/users/150275
// @downloadURL https://update.greasyfork.org/scripts/32578/Equideow%20help%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/32578/Equideow%20help%20manager.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////
// Calcul des compétences pour les compétitions classiques :
function get_competences()
{
    var endurance = parseFloat( document.getElementById( "enduranceValeur" ).textContent ) ;
    var vitesse   = parseFloat( document.getElementById( "vitesseValeur" ).textContent ) ;
    var dressage  = parseFloat( document.getElementById( "dressageValeur" ).textContent ) ;
    var galop     = parseFloat( document.getElementById( "galopValeur" ).textContent ) ;
    var trot      = parseFloat( document.getElementById( "trotValeur" ).textContent ) ;
    var saut      = parseFloat( document.getElementById( "sautValeur" ).textContent ) ;
    var competences = new Array( endurance, vitesse, dressage, galop, trot, saut ) ;
    return competences ;
}

function get_bonus( id_cheval )
{
    var liste_bonus = document.querySelectorAll( "tr.dashed td.last.align-left p" );
    var e = 0, v = 0, d = 0, g = 0, t = 0, s = 0 ;
    var long = liste_bonus.length;
    var p ;
    for (var i = 0 ; i < long ; i++){
        p = liste_bonus[i].textContent.split(', ');
        for (var j =0 ; j < p.length ; j++){
            if (p[j].indexOf('endurance') != -1){
                e += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
            if (p[j].indexOf('vitesse') != -1){
                v += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
            if (p[j].indexOf('dressage') != -1){
                d += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
            if (p[j].indexOf('galop') != -1){
                g += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
            if (p[j].indexOf('trot') != -1){
                t += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
            if (p[j].indexOf('saut') != -1){
                s += parseInt(p[j].substring(p[j].indexOf('+')+1));
            }
        }
    }
    var bonus = new Array( e, v, d, g, t, s ) ;

    return bonus;
}

function calc_classique( id_cheval )
{
    var competences = get_competences() ;
    var bonus = get_bonus( id_cheval );

    var e = competences[0] ;
    var v = competences[1] ;
    var d = competences[2] ;
    var g = competences[3] ;
    var t = competences[4] ;
    var s = competences[5] ;

    var Trot     = Math.round( ( t + v + d ) * 100 ) / 100 ;
    var Galop    = Math.round( ( g + v + d ) * 100 ) / 100 ;
    var Dressage = Math.round( ( d + t + g ) * 100 ) / 100 ;
    var Cross    = Math.round( ( e + d + s ) * 100 ) / 100 ;
    var Cso      = Math.round( ( s + d + v ) * 100 ) / 100 ;

    var ctrot = document.getElementsByClassName("action action-style-4 competition-trot")[0].lastChild;
    var cgalop = document.getElementsByClassName("action action-style-4 competition-galop")[0].lastChild;
    var cdressage = document.getElementsByClassName("action action-style-4 competition-dressage")[0].lastChild;
    var cross = document.getElementsByClassName("action action-style-4 competition-cross")[0].lastChild;
    var cso = document.getElementsByClassName("action action-style-4 competition-saut")[0].lastChild;
    var gp;

    var moyenne  = Math.round( ( ( Trot + Galop + Dressage + Cross + Cso ) / 5 ) * 110 ) / 100 ;

    Trot     = Math.round( ( t + v + d + bonus[4] + bonus[1] + bonus[2] ) * 100 ) / 100 ;
    Galop    = Math.round( ( g + v + d + bonus[3] + bonus[1] + bonus[2] ) * 100 ) / 100 ;
    Dressage = Math.round( ( d + t + g + bonus[2] + bonus[4] + bonus[3] ) * 100 ) / 100 ;
    Cross    = Math.round( ( e + d + s + bonus[0] + bonus[2] + bonus[5] ) * 100 ) / 100 ;
    Cso      = Math.round( ( s + d + v + bonus[5] + bonus[2] + bonus[1] ) * 100 ) / 100 ;

    if( Trot > moyenne )      { ctrot.setAttribute("style", ";color: #0000ff;"); }
    else                      { ctrot.setAttribute("style", ";color: #ff0000;"); }
    ctrot.innerHTML = "Trot " + Trot ;

    if( Galop > moyenne )     { cgalop.setAttribute("style", ";color: #0000ff;"); }
    else                      { cgalop.setAttribute("style", ";color: #ff0000;"); }
    cgalop.innerHTML = "Galop " + Galop ;

    if( Dressage > moyenne )  { cdressage.setAttribute("style", ";color: #0000ff;"); }
    else                      { cdressage.setAttribute("style", ";color: #ff0000;"); }
    cdressage.innerHTML = "Dressage " + Dressage ;

    if( Cross > moyenne )     { cross.setAttribute("style", ";color: #0000ff;"); }
    else                      { cross.setAttribute("style", ";color: #ff0000;"); }
    cross.innerHTML = "Cross " + Cross ;

    if( Cso > moyenne )       { cso.setAttribute("style", ";color: #0000ff;"); }
    else                      { cso.setAttribute("style", ";color: #ff0000;"); }
    cso.innerHTML = "Cso " + Cso ;

    try {
        gp = document.getElementsByClassName("action action-style-4 competition-coupe")[0].lastChild;
        gp.innerHTML = "Grand Prix " + moyenne ;
    } catch (Exception){
        gp = document.getElementsByClassName("middle top bottom")[0] ;
        var a = document.createElement( "a" );
        a.setAttribute("class", "action action-style-4 none");
        a.innerHTML = "<span class='text new-console'>Moyenne " + moyenne + "</span>" ;
        document.styleSheets[0].addRule('a.action.action-style-4.none','cursor: default;');
        document.styleSheets[0].addRule('a.action.action-style-4.none:before','background-image: url("");');
        document.styleSheets[0].addRule('a.action.action-style-4.none:hover','background: linear-gradient(to bottom,rgba(219,217,130,1) 0,rgba(207,208,114,1) 53%,rgba(223,223,144,1) 88%,rgba(228,228,154,.2) 100%);');
        document.styleSheets[0].addRule('a.action.action-style-4.none:hover:after','opacity: .8; background: -webkit-linear-gradient(top,rgba(245,244,193,.46) 0,rgba(245,244,193,.43) 6%,rgba(248,247,209,.48) 10%,rgba(248,247,210,.46) 13%,rgba(249,248,215,.35) 29%,rgba(250,250,227,.23) 45%,rgba(254,254,249,.13) 61%,rgba(255,255,255,.13) 65%,rgba(255,255,255,.13) 100%);');
        gp.appendChild( a ) ;
    }
}

function calc_western( id_cheval )
{
    var competences = get_competences() ;
    var bonus = get_bonus( id_cheval );

    var e = competences[0] ;
    var v = competences[1] ;
    var d = competences[2] ;
    var g = competences[3] ;
    var t = competences[4] ;
    var s = competences[5] ;

    var Barrel_racing    = Math.round( ( v + e + g ) * 100 ) / 100 ;
    var Cutting          = Math.round( ( e + d + v ) * 100 ) / 100 ;
    var Trail_class      = Math.round( ( d + t + s ) * 100 ) / 100 ;
    var Reining          = Math.round( ( g + d + e ) * 100 ) / 100 ;
    var Western_pleasure = Math.round( ( t + e + d ) * 100 ) / 100 ;

    var barrel = document.getElementsByClassName("action action-style-4 competition-barrel")[0].lastChild;
    var cutting = document.getElementsByClassName("action action-style-4 competition-cutting")[0].lastChild;
    var trail = document.getElementsByClassName("action action-style-4 competition-trail-class")[0].lastChild;
    var reining = document.getElementsByClassName("action action-style-4 competition-reining")[0].lastChild;
    var western = document.getElementsByClassName("action action-style-4 competition-western-pleasure")[0].lastChild;
    var gp;

    var moyenne  = Math.round( ( ( Barrel_racing + Cutting + Trail_class + Reining + Western_pleasure ) / 5 ) * 105 ) / 100 ;

    Barrel_racing    = Math.round( ( v + e + g + bonus[1] + bonus[0] + bonus[3] ) * 100 ) / 100 ;
    Cutting          = Math.round( ( e + d + v + bonus[0] + bonus[2] + bonus[1] ) * 100 ) / 100 ;
    Trail_class      = Math.round( ( d + t + s + bonus[2] + bonus[4] + bonus[5] ) * 100 ) / 100 ;
    Reining          = Math.round( ( g + d + e + bonus[3] + bonus[2] + bonus[0] ) * 100 ) / 100 ;
    Western_pleasure = Math.round( ( t + e + d + bonus[4] + bonus[0] + bonus[2] ) * 100 ) / 100 ;

    if( Barrel_racing > moyenne )    { barrel.setAttribute("style", ";color: #0000ff;"); }
    else                             { barrel.setAttribute("style", ";color: #ff0000;"); }
    barrel.innerHTML = "Barrel racing " + Barrel_racing ;

    if( Cutting > moyenne )          { cutting.setAttribute("style", ";color: #0000ff;"); }
    else                             { cutting.setAttribute("style", ";color: #ff0000;"); }
    cutting.innerHTML = "Cutting " + Cutting ;

    if( Trail_class > moyenne )      { trail.setAttribute("style", ";color: #0000ff;"); }
    else                             { trail.setAttribute("style", ";color: #ff0000;"); }
    trail.innerHTML = "Trail class " + Trail_class ;

    if( Reining > moyenne )          { reining.setAttribute("style", ";color: #0000ff;"); }
    else                             { reining.setAttribute("style", ";color: #ff0000;"); }
    reining.innerHTML = "Reining " + Reining ;

    if( Western_pleasure > moyenne ) { western.setAttribute("style", ";color: #0000ff;"); }
    else                             { western.setAttribute("style", ";color: #ff0000;"); }
    western.innerHTML = "Western pleasure " + Western_pleasure ;

    try {
        gp = document.getElementsByClassName("action action-style-4 competition-coupe-western")[0].lastChild;
        gp.innerHTML = "Grand Prix " + moyenne ;
    } catch (Exception){
        gp = document.getElementsByClassName("middle top bottom")[0] ;
        var a = document.createElement( "a" );
        a.setAttribute("class", "action action-style-4 none");
        a.innerHTML = "<span class='text new-console'>Moyenne " + moyenne + "</span>" ;
        document.styleSheets[0].addRule('a.action.action-style-4.none','cursor: default;');
        document.styleSheets[0].addRule('a.action.action-style-4.none:before','background-image: url("");');
        document.styleSheets[0].addRule('a.action.action-style-4.none:hover','background: linear-gradient(to bottom,rgba(219,217,130,1) 0,rgba(207,208,114,1) 53%,rgba(223,223,144,1) 88%,rgba(228,228,154,.2) 100%);');
        document.styleSheets[0].addRule('a.action.action-style-4.none:hover:after','opacity: .8; background: -webkit-linear-gradient(top,rgba(245,244,193,.46) 0,rgba(245,244,193,.43) 6%,rgba(248,247,209,.48) 10%,rgba(248,247,210,.46) 13%,rgba(249,248,215,.35) 29%,rgba(250,250,227,.23) 45%,rgba(254,254,249,.13) 61%,rgba(255,255,255,.13) 65%,rgba(255,255,255,.13) 100%);');
        gp.appendChild( a ) ;
    }
}

//////////////////////////
// Page de son cheval
if( window.location.href.match( /https:\/\/(ouranos|gaia)\.equideow\.com\/elevage\/chevaux\/cheval\?id=(.*)($|\&.*)/ ) )
{
    var nom_cheval = document.title ;
    var id_cheval_xpath = '/html/body/div/main/div/section/div/div/div/div/div/div/div/h1/a' ;
    var id_cheval = document.evaluate( id_cheval_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.toString().split('id=')[1] ;
    var comp_cheval_xpath = '/html/body/div/main/div/section/div/div/div/div/div/div/div/div/div/table/tbody/tr/td/a/span' ;
    var comp_cheval = document.evaluate( comp_cheval_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.textContent ;
    if( comp_cheval == 'Trot' ){ calc_classique( id_cheval ) ; }
    if( comp_cheval == 'Barrel racing' ) { calc_western( id_cheval ) ; }
}


//////////////////////////
// Page des trophées
if( window.location.href.match( /https:\/\/(ouranos|gaia)\.equideow\.com\/joueur\/collection\// ) )
{
    var liste_trophees = document.querySelectorAll("li.trophee-item.float-left.case-1x1.hoverable");
    for (var i = 0 ; i < liste_trophees.length ; i++ ){
        var valeurs = (liste_trophees[i].dataset.tooltip.substring(liste_trophees[i].dataset.tooltip.indexOf("(")+1, liste_trophees[i].dataset.tooltip.indexOf(")"))).split(" / ");
        var div = document.createElement("div");
        liste_trophees[i].firstChild.setAttribute("style","height: 90%;");
        div.setAttribute("style","height: 10%; background-color: #e2e18b;");
        div.innerHTML = '<div style="height: 100%; background-color: #b0ae48; width:'+94/valeurs[1]*valeurs[0]+'px;"></div>' ;
        liste_trophees[i].appendChild(div);
    }
}
