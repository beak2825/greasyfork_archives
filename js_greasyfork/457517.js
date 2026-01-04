// ==UserScript==
// @name         MainFonda
// @namespace    mailto:bug@me.com
// @version      4.1.7
// @description  try to take over the GALAXY!
// @author       LaTTy
// @match        https://fondationjeu.com/jeu/index.php
// @match        https://fondationjeu.com/index.php?deco=1
// @match        https://fondationjeu.com/jeu/intermission.php
// @match        https://fondationjeu.com/jeu/stats.php*
// @match        https://fondationjeu.com/jeu/alliance.php
// @match        https://fondationjeu.com/jeu/croiseurs.php
// @match        https://fondationjeu.com/jeu/politique.php
// @match        https://fondationjeu.com/jeu/regles.php
// @match        https://fondationjeu.com/jeu/forum.php
// @match        https://fondationjeu.com/jeu/classements.php
// @match        https://fondationjeu.com/jeu/galaxie.php
// @match        https://fondationjeu.com/jeu/confreries.php
// @match        https://fondationjeu.com/jeu/carte_amb.php*
// @match        https://fondationjeu.com/jeu/messages.php*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457517/MainFonda.user.js
// @updateURL https://update.greasyfork.org/scripts/457517/MainFonda.meta.js
// ==/UserScript==
// @require      https://code.jquery.com/jquery-3.6.1.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.5.1/jquery.nicescroll.min.js
// @require      https://cdn.jsdelivr.net/npm/ddslick@1.0.3/dist/jquery.ddslick.min.js
// @require      https://cdn.jsdelivr.net/npm/leader-line@1.0.7/leader-line.min.js
// @require      https://fondationjeu.com/jeu/js/functions.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js
// @noframes //This tag makes the script running on the main pages, but not at iframes.

(function() {
    'use strict';
    var my_script = document.createElement('script');
    my_script.setAttribute('src','https://www.gstatic.com/charts/loader.js');
    document.head.appendChild(my_script);
    var debug = false; var init = true;
    if(!window.location.href.includes('deco=1')) localStorage.playerName = $("#profile-menu h4.m-0").text();
    var img_chiffre = ['https://i.ibb.co/0F4MpyK/pngegg.png','https://i.ibb.co/71S3s7T/1.png','https://i.ibb.co/0YfGDZH/2.png','https://i.ibb.co/pdX66ht/3.png','https://i.ibb.co/zNQrdKs/4.png','https://i.ibb.co/vx8WSq0/5.png','https://i.ibb.co/s1dVyy4/6.png','https://i.ibb.co/tsw98xP/7.png','https://i.ibb.co/sykydFs/8.png','https://i.ibb.co/ysF2j89/9.png','https://i.ibb.co/PxG11yS/10.png','https://i.ibb.co/kqX0HSL/11.png','https://i.ibb.co/Tk4Bqk2/12.png','https://i.ibb.co/fDDS9sY/13.png','https://i.ibb.co/tskfC49/14.png','https://i.ibb.co/G05mBHx/15.png','https://i.ibb.co/5c2hQNn/20.png'];
    //declaration fonctions => generiques en premier
    function getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }
    function dateDiff(date1, date2,concat=false){
        let diff = {};// Initialisation du retour
        let tmp = parseInt(date2) - parseInt(date1);
        tmp = Math.floor(tmp/1000);// Nombre de secondes entre les 2 dates
        diff.sec = tmp % 60;// Extraction du nombre de secondes
        tmp = Math.floor((tmp-diff.sec)/60);// Nombre de minutes (partie entière)
        diff.min = tmp % 60;// Extraction du nombre de minutes
        tmp = Math.floor((tmp-diff.min)/60);// Nombre d'heures (entières)
        diff.hour = tmp % 24;// Extraction du nombre d'heures
        tmp = Math.floor((tmp-diff.hour)/24);// Nombre de jours restants
        diff.day = tmp;
        return !concat?diff:(diff.day+'j '+diff.hour+'h '+diff.min+'m');
    }
    function merge(a, b, prop) {
        if(debug) console.log('merging...');
        if(!a) return b;
        if(!b) return a;
        let reduced = [];
        for (let i = 0; i < a.length; i++) {
            let aitem = a[i];
            let found = false;
            for (let ii = 0; ii < b.length; ii++) {
                if (aitem[prop] === b[ii][prop]) {
                    found = true;
                    break;
                }
            }
            if (!found) reduced.push(aitem);
        }
        return reduced.concat(b);
    }
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    function wheel($div, deltaY) {
        var step = 30;
        var pos = $div.scrollTop();
        var nextPos = pos + (step * (-deltaY))
        $div.scrollTop(nextPos);
    }
    function mymousewheel(event, delta, deltaX, deltaY) {
        if (delta > -2 && delta < 2) {
            wheel($(this), deltaY);
            event.preventDefault();
        }
    }
    /*function merge_planete(oplan,plant,type){
        let arr=['attak'+type,'cible'+type];
        if(type=='s') arr = [...arr,...['etat','couleur']];
        $.each(arr,function(i,v) { oplan[v] = plant[v] });
        oplan.events = merge(plant.events,oplan.events);
        return oplan;
    }*/
    /*function mymap(lista,listb,prop='nom',type='m') {
        $.each(lista,function(indexa,objeta){
            let found=false; let at;
            if(listb[indexa]!==undefined && objeta.nom==listb[indexa].nom) {
                found = listb[indexa];
                at = indexa;
            }else {
                for(let indexb; indexb<listb.length;indexb++){
                    if(objeta[prop]==listb[indexb][prop]) {
                        found = listb[indexb];
                        at = indexb;
                        break;
                    }
                }
            }
            if(found) {
                //la liste d'objet B est rempli avec les objets de la liste A qu'elle ne contenait pas, et les elements qu'elle contenait etant present dans A et ayant une valeur dans A ont ete mis a jour
                //avec les valeurs de A et les eventuels proprietes presentes dans A sans l'etre dans B mais sans que les valeurs presente dans les 2 mais etant vide dans A ecrase le contenu present dans B
                //$.each(objeta,function(keya,valuea) {
                    //if(!valuea) lista[indexa][keya] = found[keya];
                    //listb[at] = {...listb[at],...objeta};
                //});
                //a la place on defini une liste de propriete par type d'objet pour lesquel on va forcement ecrasé et d'autre non
                listb[at] = merge_planete(objeta,found,type);
            } else listb.push(objeta);
        });
        return listb;
    }*/
    function test_stored_json(kay) {
        try {
            let k = JSON.parse(kay);
            if (typeof k === "object" && k !== null) return true;
            else return false;
        } catch (e) {
           return false;
        }
    }
    function exist_stored(key=0) {
        let kay=[];
        for(let y=0; y < localStorage.length; y++){
            kay.push(localStorage.key(y));
        }
        return kay.includes(key);
    }
    function exist_for_player(key=0){
        let kay=null;
        for(let y=0; y < localStorage.length; y++){
            if(localStorage.key(y)==key) kay = localStorage.getItem(key);
        }
        return kay!=null && test_stored_json(kay) ? (JSON.parse(kay)[localStorage.playerName] != undefined ? true : false) : false;
    }
    function get_stored(nom){
        return exist_stored(nom)?(JSON.parse(localStorage.getItem(nom))[localStorage.playerName] != undefined?JSON.parse(localStorage.getItem(nom))[localStorage.playerName]:[]):[];
    }
    function set_stored(nom,item){
        let l = {};
        if(exist_stored(nom) && test_stored_json(localStorage.getItem(nom))) {
            l = JSON.parse(localStorage.getItem(nom));
            l[localStorage.playerName] = item;
            localStorage.setItem(nom,JSON.stringify(l));
        }else {
            l[localStorage.playerName] = item;
            localStorage.setItem(nom,JSON.stringify(l));
        }
    }
    function reset_secteur(l){
        if(debug) console.log('reset planetes');
        set_stored('planetes',[]);
        let tools = get_stored('tools');
        tools.autozn.destination==null;
        $.each(tools,function(i,t) { if(tools[i].leaders!=undefined) tools[i].leaders = []; });
        set_stored('tools',tools);
        $.each(l.find(o=>o.player===localStorage.playerName).leaders,function(i,lead) { l.find(o=>o.player===localStorage.playerName).leaders[i].automat.action = []; l.find(o=>o.player===localStorage.playerName).leaders[i].visited = ['Inconnu']; });
        return l;
    }
    //define default values if not exist
    if(!exist_for_player('custommap')) set_stored('custommap',"1");
    if(!exist_for_player('val_tempo')) set_stored('val_tempo',60);
    if(!exist_for_player('ecranspec_actif')) set_stored('ecranspec_actif','0');
    if(!exist_for_player('planetes')) set_stored('planetes',[]);
    if(!exist_for_player('leaders')) set_stored('leaders',[]);
    if(!exist_for_player('messages')) set_stored('messages',[]);
    var init_tools = {
        autoexplo:{active:false,leaders:[]},
        automouv:{active:true,leaders:[]},
        autoconstrB:{active:false,wait:true,leaders:[]},
        autoconstrA:{active:false,leaders:[]},
        autocomm:{active:false},
        autoastro:{active:false,deadline:6},
        autobrouil:{active:false},
        autotrace:{active:false},
        automaj:{active:true,freq:30,maj:1,map:true},
        autozn:{active:false,rotate:false,destination:null},
        autoscroll:{active:false},
        autoconf:{active:false,palais:false}
    };
    if(!exist_for_player('tools')) set_stored('tools',init_tools)
    //reconnexion auto
    if(!exist_for_player('passwd')) set_stored('passwd',prompt('Pour la reconnexion auto, saisissez votre mot de passe'));
    if(window.location.href.includes('deco=1') && exist_for_player('passwd') && get_stored('passwd')!="") {
        if(debug) console.log('re-log');
        $("#login").val(localStorage.playerName);
        $("#pwd").val(get_stored('passwd'));
        $('form[action="chargement.php"]').first().submit();
    }
    //reinitialisation lors de changement de mission
    else if(window.location.href.includes('intermission.php')) {
        let l = get_stored('leaders');
        reset_secteur(l);
        set_stored('leaders',l);
        throw new Error('reinitialisation terminée');
    }
    //on ajoute nos containers specifiques au container global pour les remplir
    $("a.logo").text('MY-FOND@TION V'+GM_info.script.version.substr(0,3));
    //modif menu latteral
    $("div.side-widgets").find('a[href="objectif.php"]').first().parents('div.s-widget').remove();//on deplace le lien objectif dans la sidebar
    $('ul.side-menu').first().append('<li><a class="sa-side-" href="objectif.php" target="fenetre" style="background-image:url(images/picto/icon-objectives.png);background-size:40px;"><span class="menu-item">Objectifs</span></a></li>');
    $('ul.side-menu').first().append('<li><a class="sa-side- holobzr" href="#" target="fenetre" style="background-image:url(images/pass-market.png);background-size:40px;"><span class="menu-item">Holo-Baazzaar</span></a></li>');
    let menu = $("ul.side-menu").get(0).outerHTML;
    $("ul.side-menu").remove();
    $("#main").append(menu);
    $("ul.side-menu").css('position','absolute').css('top','0px').css('left','0px');
    let css_btn_class_exclude = 'select,input,span,.push_button';
    //remet la fleche sur les selects
    //select{-webkit-appearance:auto !important;}
    //ajoute une fleche
    //select.btn::after{position: absolute;content: "";top: 14px;right: 10px;width: 0;height: 0;border: 6px solid transparent;border-color: #fff transparent transparent transparent;}
    let css_btn = '<style>.btn {border-radius: 4px !important;} .btn:not('+css_btn_class_exclude.replace('.push_button','')+'),{cursor: pointer;} .btn:not(.agit,.anul,'+css_btn_class_exclude+'){box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.3);} .btn:not(.agit,.anul,'+css_btn_class_exclude+'):hover{background-color:white !important;color:black;font-weight:bold;box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.6);} .btn:not(.agit,.anul,'+css_btn_class_exclude+'):active{transform:translateY(5px);box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1);} .btn.agit{border:2px solid green !important;box-shadow: 1px 1px 1px rgba(0, 255, 0, 0.3);} .btn.agit:hover{background-color:green !important;color:white;box-shadow: 1px 1px 1px rgba(0, 255, 0, 0.6);} .btn.agit:active{transform:translateY(5px);box-shadow: 1px 1px 1px rgba(0, 255, 0, 0.1);} .btn.anul{border:2px solid red !important;box-shadow: 1px 1px 1px rgba(255, 0, 0, 0.3);} .btn.anul:hover{background-color:red !important;color:white;box-shadow: 1px 1px 1px rgba(255, 0, 0, 0.6);} .btn.anul:active{transform:translateY(5px);box-shadow: 1px 1px 2px rgba(255, 0, 0, 0.1);}</style>';
    let css_toggleswicth_checkbox = '<style>.switch-holder { display: flex; padding: 5px 10px; border-radius: 10px !important; border:1px solid rgba(255,255,255,0.6); justify-content: space-between; align-items: center; } .switch-label { width: var(--width-label,80px); color: rgba(255,255,255); } .switch-label i { margin-right: 5px; } .switch-toggle { height: 28px; } .switch-toggle input[type="checkbox"] { position: absolute; opacity: 0; z-index: -2; } .switch-toggle input[type="checkbox"] + label { position: relative; display: inline-block; width: var(--width-toggle,140px); height: 28px; border-radius: 20px !important; margin: 0; cursor: pointer; box-shadow: inset -8px -8px 15px rgba(255,255,255,.6),inset 10px 10px 10px rgba(0,0,0, .25); } .switch-toggle input[type="checkbox"] + label::before { position: absolute; content: attr(from); font-size: 13px; text-align: center; line-height: 23px; top: 1px; left: 5px; width: var(--width-button,65px); height: 23px; border-radius: 20px; background-color: rgba(0,0,0); color: rgba(255,255,255); box-shadow: -3px -3px 5px rgba(255,255,255,.5),3px 3px 5px rgba(0,0,0, .25); transition: .3s ease-in-out; } .switch-toggle input[type="checkbox"]:checked + label::before { left: 50%; content: attr(to); color: #fff; background-color: var(--bgcolor-checked,#00b33c); box-shadow: -3px -3px 5px rgba(255,255,255,.5),3px 3px 5px var(--shadowcolor-checked,#00b33c); }</style>';
    //template html pour toggleswitch :
    //'<div class="switch-holder"><div class="switch-label" style="--width-label: 100px"><i class="fa fa-map-marker"></i></i><span>Animation</span></div><div class="switch-toggle"><input type="checkbox" id="location"><label style="--width-toggle: 140px;--width-button: 65px;--bgcolor-checked: red;--shadowcolor-checked:red;" for="location" from="HIDE" to="SHOW"></label></div></div>'
    //let css_digital_numb = '<style>#hour1, #hour2, #min1, #min2, .sep{display:inline-block;width:12px;font-size:5px;margin:0 2px 0 2px;}.sep{font-size:20px;text-align:center;}.clck{border-color:white;border-radius:20% !important;border-width:3px;}.clckun.clcktop, .clckun.clckbot, .clckqu.clckbot, .clckse.clckbot{border-top-style:hidden;border-right-style:solid;border-bottom-style:hidden;border-left-style:hidden;}.clckde.clcktop, .clcktr.clcktop{border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:hidden;}.clckde.clckbot{border-top-style:hidden;border-right-style:hidden;border-bottom-style:solid;border-left-style:solid;}.clcktr.clckbot, .clckci.clckbot, .clckne.clckbot{border-top-style:hidden;border-right-style:solid;border-bottom-style:solid;border-left-style:hidden;}.clckqu.clcktop, .clcksi.clckbot, .clckhu.clckbot, .clckze.clckbot{border-top-style:hidden;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;}.clckci.clcktop, .clcksi.clcktop{border-top-style:solid;border-right-style:hidden;border-bottom-style:solid;border-left-style:solid;}.clckse.clcktop{border-top-style:solid;border-right-style:solid;border-bottom-style:hidden;border-left-style:hidden;}.clckhu.clcktop, .clckne.clcktop{border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;}.clckze.clcktop{border-top-style:solid;border-right-style:solid;border-bottom-style:hidden;border-left-style:solid;}</style>';
    $('head').append(css_toggleswicth_checkbox+css_btn+'<style>body.modal-open{overflow:auto;} .menu-active #content {margin-left: 30px;}#insertcrois .temprest{position:relative;}#insertcrois .temprest>span::before{content:"";position:absolute;top:10px;left:1px;width:96%;height:40%;background-color:white;z-index:-1;}</style><link href="https://fonts.cdnfonts.com/css/digital-dark-system" rel="stylesheet">');//<link href="https://fonts.cdnfonts.com/css/digital-7-mono" rel="stylesheet">  ==> 'Digital-7'
    //modif menu haut
    $("#top-menu").append('<div class="pull-left tm-icon"><a data-drawer="custom0" class="drawer-toggle"><img src="images/picto/message.png" width="40" height="40"><i id="badge-mess" class="n-count animated">0</i><span>News</span></a></div>');
    $("#top-menu").append('<div class="pull-left tm-icon"><a data-drawer="custom1" class="drawer-toggle"><img src="images/picto/hyperespace.png" width="40" height="40"><i id="badge-fight" class="n-count animated">0</i><span>Combats</span></a></div>');
    $("#top-menu").append('<div class="pull-left tm-icon"><a data-drawer="custom2" class="drawer-toggle"><img src="images/picto/decouverte.png" width="40" height="40" title="Stats Planètes"><i id="decompte_tempo" class="n-count animated"></i><span>Planetes</span></a></div>');
    $("#top-menu").append('<div class="pull-left tm-icon"><a data-drawer="custom3" class="drawer-toggle" style="padding-top:5px;padding-left:8px;"><img src="images/picto/auto-repair.png" width="30" height="30" title="Tools"><span>Tools</span></a></div>');
    $("#top-menu").append('<div class="switch-holder pull-right"><div class="switch-label" style="--width-label: 60px"><i class="fa fa-globe"></i></i><span>MAP</span></div><div class="switch-toggle"><input type="checkbox" '+(get_stored('custommap')=="1"?'checked':'')+' id="custom_map"><label style="--width-toggle: 140px;--width-button: 65px;--bgcolor-checked: green;" for="custom_map" from="CLASSIC" to="CUSTOM"></label></div></div><button class="btn btn-alt pull-right" id="clear_modal" style="display:none;">Tout fermer</button>');
    var parentstyle="height:254px;overflow:auto;";
    if($("#messages").length) {
        $("#messages div.media").eq(0).find('span.drawer-close').before('<button id="refresh_msg" class="btn btn-alt btn-xs glyphicon glyphicon-refresh" style="margin-left:10px;height:23px;"></button>');
        $("#messages div.media").eq(0).html($("#messages div.media").eq(0).html().replace('non lus',''));
        //let p = $('#messages div.overflow').first().get(0).style;
        //p.overflow='auto';
        //parentstyle = p.cssText
        $('#messages div.overflow').first().get(0).removeAttribute('style');
    }
    let css_loader = '<style>#loader { position: absolute; left: 50%; top: 50%; z-index: 1000; width: 120px; height: 120px; margin: -76px 0 0 -76px; border: 16px solid #f3f3f3; border-radius: 50% !important; border-top: 16px solid #3498db; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite;} @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style><div id="loader" style="display:none;"></div>';
    let css_push_buttons = '<style>.push_button{ border-radius:5px; border:solid 1px #D94E3B; text-align:center; -webkit-transition: all 0.1s; -moz-transition: all 0.1s; transition: all 0.1s; -webkit-box-shadow: 0px 9px 0px #84261a; -moz-box-shadow: 0px 9px 0px #84261a; box-shadow: 0px 9px 0px #84261a;} .push_button.activer{ -webkit-box-shadow: 0px 2px 0px #84261a; -moz-box-shadow: 0px 2px 0px #84261a; box-shadow: 0px 2px 0px #84261a; position:relative; top:7px; }</style>';
    let css_noscroll = '<style>.unvisiblescroll::-webkit-scrollbar { display: none; } .unvisiblescroll { -ms-overflow-style: none; scrollbar-width: none; overflow: auto;}</style>';
    let css_customscroll = '<style>::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-button { background-size: 100%; height: 8px; width: 8px; -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); } ::-webkit-scrollbar-track { background: transparent; -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1); } ::-webkit-scrollbar-thumb { background: #aaa; -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); border-radius: 5px; } ::-webkit-scrollbar-thumb:hover { background: #989898; } ::-webkit-scrollbar-thumb:active { background: #808080; -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3); }::-webkit-scrollbar-button:horizontal:increment { display: none; } ::-webkit-scrollbar-button:horizontal:decrement { display: none; } ::-webkit-scrollbar-button:vertical:increment { display:none; } ::-webkit-scrollbar-button:vertical:decrement { display:none; }</style>';
    let css_timeline = '<style>.timeline-container{position:relative;padding-top:4px;margin-bottom:32px}.timeline-container:last-child{margin-bottom:0}.timeline-container:before{content:"";display:block;position:absolute;left:28px;top:0;bottom:0;border:1px solid #e2e3e7;background-color:#e7eaef;width:4px;border-width:0 1px}.timeline-container:first-child:before{border-top-width:1px}.collapsed.fullscreen>.widget-header,.timeline-container:last-child:before{border-bottom-width:1px}.timeline-item{position:relative;margin-bottom:8px}.timeline-item .widget-box{background-color:#f2f6f9;color:#595c66;margin:0 0 0 60px;position:relative;max-width:none}.timeline-item .transparent.widget-box{border-left:3px solid #dae1e5}.timeline-item .transparent .widget-header{background-color:#ecf1f4;border-bottom-width:0}.timeline-item .transparent .widget-header>.widget-title{margin-left:8px}.timeline-item:nth-child(2n) .widget-box{background-color:#f3f3f3;color:#616161}.timeline-item:nth-child(2n) .widget-box.transparent{border-left-color:#dbdbdb!important}.timeline-item:nth-child(2n) .widget-box.transparent .widget-header{background-color:#eee!important}.timeline-item .widget-main{margin:0;position:relative;max-width:none;border-bottom-width:0}.timeline-item .widget-body{background-color:transparent}.timeline-item .widget-toolbox,.timeline-style2 .timeline-item .transparent .widget-header{background-color:transparent!important}.timeline-item .widget-toolbox{padding:4px 8px 0!important;border-width:0!important;margin:0!important}.timeline-info{float:left;width:60px;text-align:center;position:relative}.timeline-info img{border-radius:100%;max-width:25px}.timeline-info .badge,.timeline-info .label{font-size:12px}.timeline-container:not(.timeline-style2) .timeline-indicator{opacity:1;border-radius:100%;display:inline-block;font-size:16px;height:36px;line-height:30px;width:36px;text-align:center;text-shadow:none!important;padding:0;cursor:default;border:3px solid #fff!important}.timeline-label{display:block;clear:both;margin:0 0 18px 34px}.timeline-item img{border:1px solid #aaa;padding:2px;background-color:#000}.collapsed>.widget-body,.popover-notitle+.popover .popover-title,.popover.popover-notitle .popover-title,.timeline-style2 .timeline-item:last-child:before,.timeline-style2:before,.widget-toolbar.no-border:before{display:none}.timeline-style2 .timeline-item{padding-bottom:22px;margin-bottom:0}.timeline-style2 .timeline-item:last-child{padding-bottom:0}.timeline-style2 .timeline-item:before{content:"";display:block;position:absolute;left:90px;top:5px;bottom:-5px;border-width:0;background-color:#ddd;width:2px;max-width:2px}.timeline-style2 .timeline-item:first-child:before{display:block}.timeline-style2 .timeline-item .transparent.widget-box{background-color:transparent!important;border-left:none!important}.timeline-style2 .timeline-info{width:100px}.timeline-style2 .timeline-indicator{font-size:0;height:12px;line-height:12px;width:12px;border-width:1px!important;background-color:#fff!important;position:absolute;left:85px;top:3px;opacity:1;border-radius:100%;display:inline-block;padding:0}.timeline-style2 .timeline-date{display:inline-block;width:72px;text-align:right;margin-right:25px;color:#777}.timeline-style2 .timeline-item .widget-box{margin-left:112px}.timeline-style2 .timeline-label{width:75px;margin-left:0;margin-bottom:10px;text-align:right;color:#666;font-size:14px}.timeline-time{text-align:center;position:static}.widget-box{padding:0;box-shadow:none;margin:3px 0;border:1px solid #ccc}@media only screen and (max-width:767px){.widget-box{margin-top:7px;margin-bottom:7px}}.widget-header{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;position:relative;min-height:38px;background:repeat-x #f7f7f7;background-image:-webkit-linear-gradient(top,#fff 0,#eee 100%);background-image:-o-linear-gradient(top,#fff 0,#eee 100%);background-image:linear-gradient(to bottom,#fff 0,#eee 100%);color:#669fc7;border-bottom:1px solid #ddd;padding-left:12px}.widget-header:after,.widget-header:before{content:"";display:table;line-height:0}.widget-header:after{clear:right}.widget-box.collapsed>.widget-header{border-bottom-width:0}.widget-header-flat{background:#f7f7f7}.widget-header-large{min-height:49px;padding-left:18px}.widget-header-small{min-height:20px;padding-left:10px}.widget-header>.widget-title{line-height:36px;padding:0;margin:0;display:inline}.widget-header>.widget-title>.ace-icon{margin-right:5px;font-weight:400;display:inline-block}.infobox .infobox-content:first-child,.infobox>.badge,.infobox>.stat,.percentage{font-weight:700}.widget-header-large>.widget-title,.widget-header-large>.widget-toolbar{line-height:48px}.widget-header-small>.widget-title,.widget-toolbar>.btn-minier.bigger{line-height:19px}.widget-toolbar{display:inline-block;padding:0 10px;line-height:37px;float:right;position:relative}.widget-header-small>.widget-toolbar,.widget-toolbar>.btn-minier{line-height:18px}.widget-main.no-padding,.widget-main.padding-0,.widget-toolbar.no-padding{padding:0}.widget-toolbar.padding-5{padding:0 5px}.widget-toolbar:before{display:inline-block;content:"";position:absolute;top:3px;bottom:3px;left:-1px;border:1px solid #d9d9d9;border-width:0 1px 0 0}.widget-header-large>.widget-toolbar:before{top:6px;bottom:6px}[class*=widget-color-]>.widget-header>.widget-toolbar:before{border-color:#eee}.widget-color-orange>.widget-header>.widget-toolbar:before{border-color:#fea}.widget-color-dark>.widget-header>.widget-toolbar:before{border-color:#222;box-shadow:-1px 0 0 rgba(255,255,255,.2),inset 1px 0 0 rgba(255,255,255,.1)}.widget-toolbar label{display:inline-block;vertical-align:middle;margin-bottom:0}.widget-toolbar>.widget-menu>a,.widget-toolbar>a{font-size:14px;margin:0 1px;display:inline-block;padding:0;line-height:24px}.widget-toolbar>.widget-menu>a:hover,.widget-toolbar>a:hover{text-decoration:none}.widget-header-large>.widget-toolbar>.widget-menu>a,.widget-header-large>.widget-toolbar>a{font-size:15px;margin:0 1px}.widget-toolbar>.btn{line-height:27px;margin-top:-2px}.widget-toolbar>.btn.smaller{line-height:26px}.widget-toolbar>.btn.bigger{line-height:28px}.widget-toolbar>.btn-sm{line-height:24px}.widget-toolbar>.btn-sm.smaller,.widget-toolbar>.btn-xs.bigger{line-height:23px}.widget-toolbar>.btn-sm.bigger{line-height:25px}.widget-toolbar>.btn-xs{line-height:22px}.widget-toolbar>.btn-xs.smaller{line-height:21px}.widget-toolbar>.btn-minier.smaller{line-height:17px}.widget-toolbar>.btn-lg{line-height:36px}.widget-toolbar>.btn-lg.smaller{line-height:34px}.widget-toolbar>.btn-lg.bigger{line-height:38px}.widget-toolbar-dark{background:#444}.widget-toolbar-light{background:rgba(255,255,255,.85)}.widget-toolbar>.widget-menu{display:inline-block;position:relative}.widget-toolbar>.widget-menu>a[data-action],.widget-toolbar>a[data-action]{-webkit-transition:transform .1s;-o-transition:transform .1s;transition:transform .1s}.widget-toolbar>.widget-menu>a[data-action]>.ace-icon,.widget-toolbar>a[data-action]>.ace-icon{margin-right:0}.widget-toolbar>.widget-menu>a[data-action]:focus,.widget-toolbar>a[data-action]:focus{text-decoration:none;outline:0}.widget-toolbar>.widget-menu>a[data-action]:hover,.widget-toolbar>a[data-action]:hover{-moz-transform:scale(1.2);-webkit-transform:scale(1.2);-o-transform:scale(1.2);-ms-transform:scale(1.2);transform:scale(1.2)}.widget-body{background-color:#fff}.widget-main,.widget-main.padding-12{padding:12px}.widget-main.padding-32{padding:32px}.widget-main.padding-30{padding:30px}.widget-main.padding-28{padding:28px}.widget-main.padding-26{padding:26px}.widget-main.padding-24{padding:24px}.widget-main.padding-22{padding:22px}.widget-main.padding-20{padding:20px}.widget-main.padding-18{padding:18px}.widget-main.padding-16{padding:16px}.widget-main.padding-14{padding:14px}.widget-main.padding-10{padding:10px}.widget-main.padding-8{padding:8px}.widget-main.padding-6{padding:6px}.widget-main.padding-4{padding:4px}.widget-main.padding-2{padding:2px}.widget-toolbar .progress{vertical-align:middle;display:inline-block;margin:0}.widget-toolbar>.dropdown,.widget-toolbar>.dropup{display:inline-block}.widget-toolbox.toolbox-vertical,.widget-toolbox.toolbox-vertical+.widget-main{display:table-cell;vertical-align:top}.widget-box>.widget-header>.widget-toolbar>.widget-menu>[data-action=settings],.widget-box>.widget-header>.widget-toolbar>[data-action=settings],.widget-color-dark>.widget-header>.widget-toolbar>.widget-menu>[data-action=settings],.widget-color-dark>.widget-header>.widget-toolbar>[data-action=settings]{color:#99cadb}.widget-box>.widget-header>.widget-toolbar>.widget-menu>[data-action=reload],.widget-box>.widget-header>.widget-toolbar>[data-action=reload],.widget-color-dark>.widget-header>.widget-toolbar>.widget-menu>[data-action=reload],.widget-color-dark>.widget-header>.widget-toolbar>[data-action=reload]{color:#acd392}.widget-box>.widget-header>.widget-toolbar>.widget-menu>[data-action=collapse],.widget-box>.widget-header>.widget-toolbar>[data-action=collapse],.widget-color-dark>.widget-header>.widget-toolbar>.widget-menu>[data-action=collapse],.widget-color-dark>.widget-header>.widget-toolbar>[data-action=collapse]{color:#aaa}.widget-box>.widget-header>.widget-toolbar>.widget-menu>[data-action=close],.widget-box>.widget-header>.widget-toolbar>[data-action=close],.widget-color-dark>.widget-header>.widget-toolbar>.widget-menu>[data-action=close],.widget-color-dark>.widget-header>.widget-toolbar>[data-action=close]{color:#e09e96}.widget-box[class*=widget-color-]>.widget-header{color:#fff}.widget-color-blue{border-color:#307ecc}.widget-color-blue>.widget-body,.widget-color-blue>.widget-footer,.widget-color-blue>.widget-header{background:#307ecc;border-color:#307ecc}.widget-color-blue2{border-color:#5090c1}.widget-color-blue2>.widget-body,.widget-color-blue2>.widget-footer,.widget-color-blue2>.widget-header{background:#5090c1;border-color:#5090c1}.widget-color-blue3{border-color:#6379aa}.widget-color-blue3>.widget-body,.widget-color-blue3>.widget-footer,.widget-color-blue3>.widget-header{background:#6379aa;border-color:#6379aa}.widget-color-green{border-color:#82af6f}.widget-color-green>.widget-body,.widget-color-green>.widget-footer,.widget-color-green>.widget-header{background:#82af6f;border-color:#82af6f}.widget-color-green2{border-color:#2e8965}.widget-color-green2>.widget-body,.widget-color-green2>.widget-footer,.widget-color-green2>.widget-header{background:#2e8965;border-color:#2e8965}.widget-color-green3{border-color:#4ebc30}.widget-color-green3>.widget-body,.widget-color-green3>.widget-footer,.widget-color-green3>.widget-header{background:#4ebc30;border-color:#4ebc30}.widget-color-red{border-color:#e2755f}.widget-color-red>.widget-body,.widget-color-red>.widget-footer,.widget-color-red>.widget-header{background:#e2755f;border-color:#e2755f}.widget-color-red2{border-color:#e04141}.widget-color-red2>.widget-body,.widget-color-red2>.widget-footer,.widget-color-red2>.widget-header{background:#e04141;border-color:#e04141}.widget-color-red3{border-color:#d15b47}.widget-color-red3>.widget-body,.widget-color-red3>.widget-footer,.widget-color-red3>.widget-header{background:#d15b47;border-color:#d15b47}.widget-color-purple{border-color:#7e6eb0}.widget-color-purple>.widget-body,.widget-color-purple>.widget-footer,.widget-color-purple>.widget-header{background:#7e6eb0;border-color:#7e6eb0}.widget-color-pink{border-color:#ce6f9e}.widget-color-pink>.widget-body,.widget-color-pink>.widget-footer,.widget-color-pink>.widget-header{background:#ce6f9e;border-color:#ce6f9e}.widget-color-orange{border-color:#e8b10d}.widget-color-orange>.widget-body,.widget-color-orange>.widget-footer,.widget-color-orange>.widget-header{color:#855d10!important;border-color:#e8b10d;background:#ffc657}.widget-color-dark{border-color:#5a5a5a}.widget-color-dark>.widget-body,.widget-color-dark>.widget-footer,.widget-color-dark>.widget-header{border-color:#666;background:#404040;color:#fff}.widget-color-grey{border-color:#9e9e9e}.widget-color-grey>.widget-body,.widget-color-grey>.widget-footer,.widget-color-grey>.widget-header{border-color:#aaa;background:#848484}.widget-box.light-border[class*=widget-color-]:not(.fullscreen),.widget-box.no-border,.widget-box.transparent{border-width:0}.widget-box.transparent>.widget-header{background:0 0;border-width:0;border-bottom:1px solid #dce8f1;color:#4383b4;padding-left:3px}.widget-box.transparent>.widget-header-large{padding-left:5px}.widget-box.transparent>.widget-header-small{padding-left:1px}.widget-box.transparent>.widget-body{border-width:0;background-color:transparent}[class*=widget-color-]>.widget-header>.widget-toolbar>.widget-menu>[data-action],[class*=widget-color-]>.widget-header>.widget-toolbar>[data-action]{text-shadow:0 1px 1px rgba(0,0,0,.2)}[class*=widget-color-]>.widget-header>.widget-toolbar>.widget-menu>[data-action=settings],[class*=widget-color-]>.widget-header>.widget-toolbar>[data-action=settings]{color:#d3e4ed}[class*=widget-color-]>.widget-header>.widget-toolbar>.widget-menu>[data-action=reload],[class*=widget-color-]>.widget-header>.widget-toolbar>[data-action=reload]{color:#deead3}[class*=widget-color-]>.widget-header>.widget-toolbar>.widget-menu>[data-action=collapse],[class*=widget-color-]>.widget-header>.widget-toolbar>[data-action=collapse]{color:#e2e2e2}[class*=widget-color-]>.widget-header>.widget-toolbar>.widget-menu>[data-action=close],[class*=widget-color-]>.widget-header>.widget-toolbar>[data-action=close]{color:#ffd9d5}.widget-color-orange>.widget-header>.widget-toolbar>.widget-menu>[data-action],.widget-color-orange>.widget-header>.widget-toolbar>[data-action]{text-shadow:none}.widget-color-orange>.widget-header>.widget-toolbar>.widget-menu>[data-action=settings],.widget-color-orange>.widget-header>.widget-toolbar>[data-action=settings]{color:#559aab}.widget-color-orange>.widget-header>.widget-toolbar>.widget-menu>[data-action=reload],.widget-color-orange>.widget-header>.widget-toolbar>[data-action=reload]{color:#7ca362}.widget-color-orange>.widget-header>.widget-toolbar>.widget-menu>[data-action=collapse],.widget-color-orange>.widget-header>.widget-toolbar>[data-action=collapse]{color:#777}.widget-color-orange>.widget-header>.widget-toolbar>.widget-menu>[data-action=close],.widget-color-orange>.widget-header>.widget-toolbar>[data-action=close]{color:#a05656}.widget-box.light-border[class*=widget-color-]:not(.fullscreen)>.widget-header{border:1px solid;border-color:inherit}.widget-box.light-border[class*=widget-color-]:not(.fullscreen)>.widget-body{border:1px solid #d6d6d6;border-width:0 1px 1px}.widget-box.fullscreen{position:fixed;margin:0;top:0;bottom:0;left:0;right:0;background-color:#fff;border-width:3px;z-index:1040!important}.widget-box.fullscreen:not([class*=widget-color-]){border-color:#aaa}.widget-body .table{border-top:1px solid #e5e5e5}.widget-body .table thead:first-child tr{background:#fff}</style>';
    let panels = '<div id="custom0" class="tile drawer animated"><div class="listview narrow"><div class="media">News <span id="btnFiltres"></span><span class="drawer-close">×</span></div><div class="overflow" style="height: 254px; outline: none;" tabindex="5003" id="spec_content0"></div></div></div>';
    panels += '<div id="custom1" class="tile drawer animated"><div class="listview narrow"><div class="media">Combats<span class="drawer-close">×</span></div><div class="overflow" style="height: 254px; outline: none;" tabindex="5003" id="spec_content1"></div></div></div>';
    panels += '<div id="custom2" class="tile drawer animated"><div class="listview narrow"><div class="media">Stats Planètes<span class="pull-right" style="margin-right:50px;"><span margin-right:100px;"><input id="filtreplan" style="background-color:black;height:20px;" type="text" name="filtreplan" class="filtreplan" value=""><button class="btn btn-alt btn-xs valid_search" style="width:20px;"><i class="fa fa-search"></i></button></span><button class="btn btn-alt btn-xs" id="openTabSpec">Ouvrir</button></span><span class="drawer-close">×</span></div><div class="overflow" style="height: 240px; outline: none;" tabindex="5003" id="spec_content2"><div class="col-md-12"><table style="font-size:x-small;" class="tablespec" class="tile table table-condensed table-bordered table-striped"><thead><tr><th>Coord.</th><th>Nom</th><th>Own</th><th><img src="images/picto/protection.png" width="20" title="Astronefs présents"></th><th><img src="../images/ico_or.gif" height="20" width="20" title="Quantité or (+ si production)"></th><th><img src="../images/ico_etain.gif" height="20" width="20" title="Quantité etain (+ si production)"></th><th><img src="../images/ico_fer.gif" height="20" width="20" title="Quantité fer (+ si production)"></th><th><img src="../images/ico_vivre.gif" height="20" width="20" title="Quantité vivres (+ si production)"></th><th><img src="../images/ico_manu.gif" height="20" width="20" title="Quantité Produits manufacturés (+ si production)"></th><th><img src="images/picto/leader.png" width="20" title="Leaders présents" alt=""></th><th><img src="images/picto/popularite.png" width="16" height="16" title="Influence politique"></th><th><img src="images/picto/ambassade.png" width="16" title="Ambassade présente"></th><th>Status</th><th><img src="images/picto/message.png" width="16" height="16"></th></tr></thead><tbody></tbody></table></div></div><div class="media whiter"><button class="btn btn-alt btn-xs" id="reset" style="border:1px solid orange;">Reset Infos Planètes stockées</button></div></div></div>';
    panels += '<div id="custom3" class="tile drawer animated"><div class="listview narrow"><div class="media">Tools<span class="drawer-close">×</span></div><div class="overflow" style="height: 240px; outline: none;" id="spec_content3"></div><div class="media whiter"></div></div></div>';
    $("#content").prepend(css_loader+css_timeline+css_push_buttons+css_noscroll+css_customscroll+panels);
    $("#custom0 div.overflow").addClass('unvisiblescroll');
    $("#custom1 div.overflow").addClass('unvisiblescroll');
    $("#custom2 div.overflow").addClass('unvisiblescroll');//.niceScroll({cursorcolor:'#2E2E2E',cursorborder:'0'});
    //$("#custom3 div.overflow").niceScroll({cursorcolor:'#2E2E2E',cursorborder:'0'});;
    let btnFiltres ='';
    const filtre = ['leader','leader_politique','leader_inactif','working','assassin1','assassin2','mort','arpenter','navette','decouverte','message','vivres','manuf','popu','mecontent','cycle','offre','renfort','interception','transfert','cible','explosion','protection','combat_gagne','present','shop','brouilleur','ambassade','demantele'];
    var filtre_actif = JSON.parse(JSON.stringify(filtre));
    //remplace lien stats - ouvre direct la page avec ressources
    if($('a.sa-side-stats').length>0) $('a.sa-side-stats').attr('href','stats.php?voir_ressources=1');
    //met l'image du profil dans le menu deroulant (on clic sur le nom pour l'ouvrir) - gagne de la place dans le menu gauche
    let pic = $('#profile-menu').find('img.profile-pic').first().get(0).cloneNode();
    let h4 = $("#profile-menu").find('h4').first().get(0).cloneNode(true);
    $(h4).css('display','inline');
    $("#profile-menu").find('h4').first().remove();
    $("#profile-menu").find('a').first().get(0).appendChild(h4);
    $("#profile-menu").find('a').first().after('<h4 id="statut_promo" style="margin:2px 0;"></h4>');
    $('#profile-menu').find('img.profile-pic').first().remove();
    let li = document.createElement("li");
    li.appendChild(pic);
    $("#profile-menu").find('ul.profile-menu').first().get(0).insertBefore(li,$("#profile-menu").find('ul.profile-menu').first().get(0).children[0]);
    $("#profile-menu").removeClass('m-b-25').css('margin-bottom',0);
    //modif taille iframes
    $(".container").css('position','relative').css('transition','margin-right .5s');
    if($("#lamap").length>0) {
        $("body").append('<style>#arrleft, #arrright{position:absolute;top:55%;z-index:100;} #arrleft{left:0;} #arrright{right:30px;}</style>');
        $("#content div.col-md-9").first().append('<button class="btn btn-alt" id="arrleft">&lt;&lt;</button><button class="btn btn-alt" id="arrright">&gt;&gt;</button>');
        $("#arrleft").on('click',function() { window.frames.lamap.postMessage(JSON.stringify({type:'scrollto',dir:'left'})); });
        $("#arrright").on('click',function() { window.frames.lamap.postMessage(JSON.stringify({type:'scrollto',dir:'right'})); });
        $("div.col-sm-9").append('<style>input[type="range"]{writing-mode: bt-lr; -webkit-appearance: slider-vertical;}</style><span id="zoominput" style="position:absolute;top:30%;right:5px;width:50px;height:380px;text-align:right;"><datalist id="zoommarks" style="position:relative;display:inline-block;width:30px;height:100%;top:-10px;font-size:11.5px;"><option value="130" label="130%">&nbsp;</option><option value="125">&nbsp;</option><option value="120">&nbsp;</option><option value="115">&nbsp;</option><option value="110">&nbsp;</option><option value="105">&nbsp;</option><option value="100">100%</option><option value="95">&nbsp;</option><option value="90">&nbsp;</option><option value="85">&nbsp;</option><option value="80" label="80%">&nbsp;</option><option value="75">&nbsp;</option><option value="70">&nbsp;</option><option value="65">&nbsp;</option><option value="60">&nbsp;</option><option value="55">&nbsp;</option><option value="50">&nbsp;</option><option value="45">&nbsp;</option><option value="40">&nbsp;</option><option value="35">&nbsp;</option><option value="30" label="30%">&nbsp;</option></datalist><input type="range" min="30" max="130" step="5" id="valzoom" class="form-control" value="80" style="position:relative;display:inline-block;width:20px;height:100%;padding:0;" orient="vertical" list="zoommarks"></span>');
        $("#valzoom").on('input',function() { window.frames.lamap.postMessage(JSON.stringify({type:'zoom',value:$(this).val()})); });
        $("div.col-sm-9").append('<style>.fadeoutmap{animation: outmap 1s linear;} .fadeoutgal{animation: outgal 1s linear;} .fadeinmap{animation: inmap 1s linear;} @keyframes inmap {0%{transform:scale(0.1);}25%{transform:scale(0.3);}50%{transform:scale(0.5);}75%{transform:scale(0.7);}100%{transform:scale(1);}} @keyframes outgal {0%{transform:scale(1);}25%{transform:scale(3);}50%{transform:scale(5);}75%{transform:scale(8);}100%{transform:scale(11);}} @keyframes outmap {0%{transform:scale(1);}25%{transform:scale(0.8);}50%{transform:scale(0.5);}75%{transform:scale(0.3);}100%{transform:scale(0.1);}} .secteur{color:#FFFFFF;font-family:verdana;font-size:10px;width:60px;height:70px;transition:tranform .2s;} .secteur:hover{transform:scale(1.5);} .yourehere img{position:absolute;transform:scale(0.5);}</style>');
        $("div.col-sm-9").append('<div id="galaxie" style="display:none;"></div>').css('background','#000000');
        $("div.col-sm-9").append('<div id="tablespecplan" style="display:none;"><div class="row"><input id="filtreplantab" style="background-color:black;height:20px;" type="text" name="filtreplantab" class="filtreplan" value=""><button id="search_filtreplantab" class="btn btn-alt btn-xs valid_search">Search</button><button class="btn btn-alt btn-xs" id="close_filtreplantab">Retour Map</button></div><div class="col-md-12"><table style="font-size:x-small;" class="tablespec" class="tile table table-condensed table-bordered table-striped"><thead><tr><th>Coord.</th><th>Nom</th><th>Own</th><th><img src="images/picto/protection.png" width="20" title="Astronefs présents"></th><th><img src="../images/ico_or.gif" height="20" width="20" title="Quantité or (+ si production)"></th><th><img src="../images/ico_etain.gif" height="20" width="20" title="Quantité etain (+ si production)"></th><th><img src="../images/ico_fer.gif" height="20" width="20" title="Quantité fer (+ si production)"></th><th><img src="../images/ico_vivre.gif" height="20" width="20" title="Quantité vivres (+ si production)"></th><th><img src="../images/ico_manu.gif" height="20" width="20" title="Quantité Produits manufacturés (+ si production)"></th><th><img src="images/picto/leader.png" width="20" title="Leaders présents" alt=""></th><th><img src="images/picto/popularite.png" width="16" height="16" title="Influence politique"></th><th>Status</th><th><img src="images/picto/message.png" width="16" height="16"></th></tr></thead><tbody></tbody></table></div></div>');
    }
    $("#content div.col-md-9").first().removeClass('col-md-9').addClass('col-md-10');
    $("#content div.col-md-10").next().removeClass('col-md-3').addClass('col-md-2');
    $("#content div.col-md-2").css('position','relative').append('<a class="btn btn-alt fa fa-home" href="debut.php" target="fenetre" style="position:absolute;bottom:0;right:0;"></a>')
        .after('<span id="stats_toggle" style="width:15px;height:40px;position:fixed;top:50%;right:0;border:1px solid grey;border-radius:15px;display:none;"><i class="fa fa-bars" style="position:relative;top:25%;left:5%;"></i></span>'+
            '<div id="stats_canvas" style="width: 0; position: fixed; z-index: 1; height: 100%; top: 0; right: 0; overflow-x: hidden; transition: 0.5s; padding-top: 60px;font-size:smaller;"><div class="offcanvas-header"><h5 class="offcanvas-title">Timeline Planète</h5></div><div class="offcanvas-body" id="stats_content"></div></div>');
    $("#stats_toggle").on('click',function() {
        if($("#stats_canvas").width()==0) {
            $("#stats_canvas").width("300px");
            $(".container, #stats_toggle").css('margin-right','300px');
        }else {
            $("#stats_canvas").width("0");
            $(".container, #stats_toggle").css('margin-right','0');
        }
    });
    //ajout container notifs
    $("#content div.col-md-2").append('<style>.toast-close{float:right;opacity:0.6;border:none;}.toast-close:hover{opacity:1;scale(1.3);}.toast{overflow:hidden;transform: translateX(calc(100% + 30px));transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35)} .toast.active{transform: translateX(0%);} .toast-progress:before {content: "";position: absolute;bottom: 0;right: 0;height: 100%;width: 100%;background-color: #4070f4;}.toast-progress.active:before {animation: progress var(--time-toast) linear forwards; }@keyframes progress {100% {right: 100%;}}</style><div aria-live="polite" aria-atomic="true"><div id="toastr_cntnr" style="position: absolute; top: 0; right: 0;"></div></div>');//Toast est pas dans boostrap 3.3
    function mnotify(classe,text,ttimer=false) {
        let temp_id = Math.floor(Math.random() * 10000); let t1,t2,t3;
        if(!classe || typeof classe != 'string') classe='';
        $("#toastr_cntnr").prepend('<div id="mnotify-'+temp_id+'" class="toast '+classe+'" role="alert" style="--time-toast:'+(ttimer/1000)+'s;border-radius:10px !important;background-color:'+(classe.includes('info')?'#d9edf7':(classe.includes('warning')?'#fcf8e3':(classe.includes('danger')?'#f2dede':classe.includes('success')?'#dff0d8':'rgba(255,255,255,0.3)')))+';"><div class="toast-header"><button type="button" class="ml-2 mb-1 toast-close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body">'+text+'</div>'+(ttimer?'<div class="toast-footer toast-progress" style="position:absolute;bottom:0;left:0;width:100%;height:3px;"></div>':'')+'</div>');
        setTimeout(()=>{ $("#mnotify-"+temp_id).addClass('active'); },200);
        if(ttimer) {
            $("#mnotify-"+temp_id+" .toast-progress").addClass('active');
            t1 = setTimeout(()=>{ $("#mnotify-"+temp_id).removeClass("active"); },ttimer);
            t2 = setTimeout(()=>{ $("#mnotify-"+temp_id+" .toast-progress").removeClass("active"); },(ttimer+300));
            t3 = setTimeout(()=>{ $("#mnotify-"+temp_id).remove(); },(ttimer+1500));
        }
        $(".toast-close").off('click').on('click',function() {
            $(this).parent().parent().removeClass("active");
            setTimeout(() => { $(this).parents('.toast').first().find('toast-progress').removeClass("active"); }, 300);
            setTimeout(() => { $(this).parents('.toast').first().remove(); }, 1500);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        });
        return temp_id;
    }
    function switchMenu(elem,event){
        if(!event.target.className.includes('myplusgen')){
            let tog=false;
            if($(elem).next().css('display')=='none') tog=true;
            if(tog) {
                $(elem).next().css('display','block');
                $("div.side-widgets").find('div.s-widget > h2.tile-title').each(function() { if(this!==elem && parseInt($(this).parents('.side-widgets').first().css('height'))-140<(parseInt($(this).next().css('height'))+parseInt($(elem).next().css('height')))) $(this).next().css('display','none'); });
            }else $(elem).next().css('display','none');
        }
    }//switch l'affichage entre leaders et croiseurs
    //generation du selectbox pour les attaques/bombardement/etc..
    var cibleslct='<option value="">Choisir</option>';
    function trigger_clic_cibleslct(){
        $("#croisslctdropdown option").off('click').on('click',function(){
            $("#cible_crois").val($(this).val());
            $(".gobtn.btnlead img").attr('src','images/leader-transfert.png');
            $(".gobtn.btncrois img").attr('src',$("#cible_crois option[value='"+$(this).val()+"']").data('owner')==localStorage.playerName?'images/picto/defense.png':'images/picto/bombarder.png');
            $(".gobtn.btnx33 img").attr('src','images/picto/frappe.png');
            $("#croisslctinput").val($(this).text());
            $("#croisslctdropdown").hide();
        });
    }
    function alim_cible_select(force=false,insert=false,disabled=true) {
        if(force) cibleslct = '<option value="">Choisir</option>';
        if(cibleslct=='<option value="">Choisir</option>') $.each([...[...get_stored('planetes').filter(o=>o.proprio==localStorage.playerName).sort((a,b) => (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0)),...get_stored('planetes').filter(o=>o.proprio!=localStorage.playerName && (get_stored('leaders').find(l=>l.player==o.proprio)?get_stored('leaders').find(l=>l.player==o.proprio).ally:false)).sort((a,b) => (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0))],...get_stored('planetes').filter(o=>o.proprio!=localStorage.playerName && (get_stored('leaders').find(l=>l.player==o.proprio)?!get_stored('leaders').find(l=>l.player==o.proprio).ally:false)).sort((a,b) => (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0))],function(i,v) { cibleslct+='<option data-owner="'+v.proprio+'" '+(v.proprio!=localStorage.playerName && (get_stored('leaders').find(l=>l.player==v.proprio)?get_stored('leaders').find(l=>l.player==v.proprio).ally:false) && disabled?'disabled':'')+' style="color:'+(v.proprio==localStorage.playerName?'green':((get_stored('leaders').find(l=>l.player==v.proprio)?get_stored('leaders').find(l=>l.player==v.proprio).ally:false)?'black':'red'))+';" value="'+v.x+'-'+v.y+'-'+v.nom+'">'+v.nom+(v.proprio!=localStorage.playerName?' ('+v.proprio+')':'')+'</option>'; });
        if(insert) {
            $(".cibleslctwrapper").empty().append(cibleslct);
            trigger_clic_cibleslct();
        }
    }
    alim_cible_select(false,false,false);
    //panneau gauche
    let cssfieldset = '<style>.the-legend { border-style: none; border-width: 0; font-size: 12px; line-height: 20px; margin-bottom: 0; width: auto; padding: 0 10px; border: 1px solid #e0e0e0;color:white; } .the-fieldset { border: 1px solid #e0e0e0; padding: 3px; display:inline-block;}</style>';
    let cssflip = '<style>.sibl { display: inline-block; } .flip { perspective: 1000px; } .innerflip { position: relative;width: 100%;height: 100%;transition: transform 0.8s;transform-style: preserve-3d; } .frontflip, .backflip {position: absolute;width: 100%;height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden;  } .backflip { color: white;transform: rotateY(180deg); }.frontflip:before {content: "";position: absolute;top: 0;right: 0;border-style: solid;box-shadow: 1px 1px 5px rgba(0,0,0,0.4);width: 0;border-width: 0px;border-color: rgba(0,0,0,0) rgba(0,0,0,0) rgba(255,255,255,0.5) rgba(255,255,255,0.5);border-radius: 0 0 0 5px;transition: border-width 1s;}.frontflip:hover {border-radius: 5px 0 5px 5px;}.frontflip:hover:before {border-width: 12px;}.backflip:before {content: "";position: absolute;top: 0;left: 0;border-style: solid;box-shadow: 1px 1px 5px rgba(0,0,0,0.4);width: 0;border-width: 0px;border-color: rgba(0,0,0,0) rgba(255,255,255,0.5) rgba(255,255,255,0.5) rgba(0,0,0,0);border-radius: 0 0 5px 0;transition: border-width 1s;}.backflip:hover {border-radius: 0 5px 5px 5px;}.backflip:hover:before {border-width: 12px;}</style>';// .flip:hover .innerflip { transform: rotateY(180deg); }</style>';
    let cssdrop = '<style>#croisslctdropdown option:hover{background-color:lightblue;} .dropdown-contain{ position: relative; display: inline-block; } .dropdown-content { z-index: 1001; display: none; position:absolute; background-color: black; min-width:20px; border: 1px solid rgba(255, 255, 255, 0.31); } .dropdown-content li{ display: block; margin-left: 7px; } .dropdown-contain:hover .dropdown-content { display: block; } .dropdown-content li:hover { background-color: #ddd; }</style>';
    $("div.side-widgets").find('div.s-widget').eq(1).find('h2.tile-title').first().attr('id','tog_lead').prepend(cssfieldset+cssdrop+cssflip+'<div class="dropdown-contain"><i class="btn btn-alt btn-xs fa fa-sort dropdown-button" style="border: 1px solid rgba(255, 255, 255, 0.31);padding:3px 7px;"></i><div class="dropdown-content"><li class="fa fa-sort-asc myplusgen"></li><li class="fa fa-sort myplusgen"></li><li class="fa fa-sort-desc myplusgen"></li></div></div><span class="addjme"> Suivi des <span>')
        .before('<div class=row"><label style="margin-bottom:0;" class="col-lg-6">Destination : </label><input class="col-lg-6 btn btn-xs" type="search" autocomplete="off" name="inptcibleslct" placeholder="Choisir.." id="croisslctinput" onfocus="this.select();" onclick="this.select();"></div><div class="row" id="croisslctdropdown" style="position:absolute;display:none;overflow-y:auto;max-height:150px;width:137px;background-color:white;margin-left:50px;z-index:100;font-size:smaller;text-align:center;">'+cibleslct+'</div><select class="btn btn-alt btn-xs" id="cible_crois" style="display:none;">'+cibleslct+'</select>');//<input list="opt1" class="btn btn-alt btn-xs" id="cible_crois"><datalist id="opt1" class="cibleslctwrapper">'+cibleslct+'</datalist>');
    trigger_clic_cibleslct();
    $("#croisslctinput").on('click',function(){
        $("#croisslctdropdown").toggle();
        $(this).trigger('keyup');
    }).on('focusout',function(){
        setTimeout(function(){ $("#croisslctdropdown").hide(); },200);
    }).on('keyup',function() {
        if(!$(this).val()) {
            $("#cible_crois").val('');
            $(".gobtn img").attr('src','images/picto/empire.png');
        }
        $("#croisslctdropdown option").each(function() {
            if ($(this).val()!="" && $(this).text().toUpperCase().indexOf($("#croisslctinput").val().toUpperCase()) > -1) $(this).css('display','');
            else $(this).css('display','none');
        });
        $("#croisslctdropdown").show();
    });
    $("#tog_lead").off('click').on('click',function(e) { switchMenu(this,e); });
    if($("div.side-widgets").find('div.s-widget').length>2 && $("div.side-widgets").find('div.s-widget').eq(2).find('h2').first().text().trim().includes('Croiseur')) $("div.side-widgets").find('div.s-widget').eq(2).remove();
    $("div.side-widgets").find('div.s-widget').eq(1).after('<div class="s-widget"><h2 class="tile-title" id="tog_crois"><div class="dropdown-contain"><i class="btn btn-alt fa fa-sort dropdown-button" style="border: 1px solid rgba(255, 255, 255, 0.31);padding:3px 7px;"></i><div class="dropdown-content"><li class="fa fa-sort-asc myplusgen"></li><li class="fa fa-sort myplusgen"></li><li class="fa fa-sort-desc myplusgen"></li></div></div> Parc Croiseurs<span style="position:absolute;right:0px;"><span id="cntZN"></span></span></h2><div id="insertcrois" class="s-widget-body dropdown-menu profile-menu" style="color:white;"></div></div>');
    $("#tog_crois").off('click').on('click',function(e) { switchMenu(this,e); });
    $(".myplusgen").off('click').on('click',function() {
        if($(this).parents('h2').first().next('div').css('display')=='none') $(this).parents('h2').first().trigger('click');//declenche le clic sur le dropdown du s-widget s'il est masqué (si on choisi un affichage, c'est pour l'afficher...)
        let c = $(this).hasClass('fa-sort-asc')?'fa-minus':($(this).hasClass('fa-sort-desc')?'fa-plus':'fa');//defini la classe à donner selon le choix fait
        $(this).parents('h2').first().next('div').find('i.myplus').each(function() { if($(this).hasClass(c)) $(this).trigger('click'); });
        $(this).parent().prev().removeClass('fa fa-sort fa-sort-asc fa-sort-desc').addClass($(this).attr('class')).removeClass('myplusgen');
    });
    $("div.side-widgets").find('div.s-widget').find('h2.tile-title:not(.spe)').each(function(i,va) {
        $(this).next().addClass('dropdown-menu profile-menu').css('opacity',0).css('color','white').css('padding-bottom',0).css('margin-bottom','5px');
    });
    $("div.side-widgets").find('div.s-widget').removeClass('m-b-25');
    $("div.side-widgets").find('div.s-widget').eq(1).find('div.s-widget-body div.row').each(function(y,v){//pour chaque leader
        let imglead = $(v).find('div.col-xs-6').eq(1).text().includes('Transfert')?'<img src="images/leader-transfert.png" width="20">':($(v).find('div.col-xs-6').eq(1).text().includes('Politique')?'<img src="images/picto/leader_politique.png" style="width:20px;">':($(v).find('div.col-xs-6').eq(1).text().includes('Assassin')?'<img src="images/picto/assassin1.png" style="width:20px;">':($(v).find('div.col-xs-6').eq(1).text().includes('Prospection')?'<img src="images/picto/new-planet.png" width="20">':($(v).find('div.col-xs-6').eq(1).text().includes('marchand')?'<img src="images/picto/offre.png" width="20">':('<img src="images/picto/working.png" style="width:20px;">')))));
        $(v).prepend('<i class="btn btn-alt btn-xs fa fa-minus myplus" style="position:absolute;top:0;left:0;z-index:1000;"></i><span style="display:none;position:absolute;top:0;left:35px;font-size:12px;width:80%;"><span class="icolead">'+imglead+'</span><a href="'+$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href')+'" target="fenetre">'+$(v).find('div.col-xs-6').eq(0).find('a').first().text().trim()+'</a><i data-leadid="'+$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href').split('id_leader=')[1].split('&x=')[0]+'" class="btn btn-alt fa fa-tasks openmodlead" style="border: 1px solid rgba(255, 255, 255, 0.31);padding:3px 5px;top:0;right:0;position:absolute;"></i></span>');
    });
    $(".myplus").off('click').on('click',function(){
        $(this).siblings().toggle();
        //if($(this).parent().find("select.sibl").css('display')=='block') $(this).parent().find("select.sibl").css('display','inline');
        if($(this).hasClass('fa-plus')) $(this).removeClass('fa-plus').addClass('fa-minus');
        else $(this).removeClass('fa-minus').addClass('fa-plus');
    });
    if($("#tog_crois").next().css('display')=='none' && $("#tog_lead").next().css('display')=='none') $("#tog_lead").trigger('click');
    function rt_to_map(prov='main') {
        if($("#lamap").length>0) {
            //voir la cible sur la carte a chaque fois qu'on passe la souris sur un lien d'une planete
            let elem = prov=='main'? $('a[href^="detail.php?x="]'):$("#fenetre").contents().find('a[href^="detail.php?x="]');
            elem.off('mouseover').off('mouseout');
            elem.on('mouseover',function(){
                //lien special pour Prospection :
                if($(this).text().trim()=='Nouvelle Planete') {
                    //on va considérer que la premiere planete qui apparait sur la carte est sur le premier secteur...
                    let secteur_x = $('#lamap').contents().find('div.divplanete').eq(0).find('img').first().data('onclick').split('x=')[1].split('&y')[0].substr(0,2);
                    let secteur_y = $('#lamap').contents().find('div.divplanete').eq(0).find('img').first().data('onclick').split('y=')[1].substr(0,2);
                    let full_x = $(this).attr('href').split('x=')[1].split('&y=')[0];
                    let full_y = $(this).attr('href').split('y=')[1];
                    $('#lamap').contents().find('body').append('<div class="divplanete" id="'+$(this).text().trim()+'" style="left:'+((secteur_y==full_y.substr(0,2)?0:900)+(90*parseInt(full_y.substr(2,1))))+'px;top:'+((secteur_x==full_x.substr(0,2)?50:1050)+(100*parseInt(full_x.substr(2,1))))+'px;"><img class="temptarg" src="images/picto/empire.png" alt="cible" style="margin-top:-170px;margin-right:1px;"></div>');
                }else $('#lamap').contents().find('div.divplanete > img[id="'+$(this).text().trim()+'"]').parent().append('<img class="temptarg" src="images/picto/empire.png" alt="cible" style="margin-top:-170px;margin-right:1px;">');
                if(get_stored('tools').autoscroll.active) window.frames.lamap.postMessage(JSON.stringify({type:'scrollto',planete:$(this).text().trim()}));
            }).on('mouseout',function() {
                if($(this).text().trim()=='Nouvelle Planete') $('#lamap').contents().find('.temptarg').parent().remove();
                else $('#lamap').contents().find('.temptarg').remove();
            });
            /*if(prov!="main") $.each(elem,function(i,e){
                ll[i] = new LeaderLine(LeaderLine.mouseHoverAnchor(e,'draw',{style:{backgroundColor: null},hoverStyle:{backgroundColor: 'black'}}),LeaderLine.pointAnchor($('#lamap').contents().find('div.divplanete > img[id="'+$(this).text().trim()+'"]').parent()));
                ll[i].setOptions({
                    middleLabel:LeaderLine.pathLabel('',{outlineColor:''}),
                    startLabel:LeaderLine.captionLabel(' parsecs',{outlineColor:''}),
                    dash:{len:6,gap:3,animation:true},
                    color:'black',
                    //path:'grid',
                    endPlug:'crosshair',
                    endPlugSize:0.5,
                });
            });*/
        }
    }
    //fonction de generation des forms pour les tools
    function ll_auto(type) {
        let ll_auto = "";
        $.each(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders,function(a,b) {
            ll_auto += '<div><label><input type="checkbox" value="'+b.id+'" style="opacity:1;">'+b.nom+'</label>';
            if(type=='mouv') ll_auto += '&nbsp;&nbsp;<select class="btn btn-alt btn-xs cibleslctwrapper" id="'+b.id+'">'+cibleslct+'</select>';
            ll_auto += '</div>';
        });
        return ll_auto;
    }//plus utilisé (old tools);
    function calc_or() {
        let tot = 0; let totmine = 0; let totprod = 0;
        $.ajax({url:'objectif.php',type:'GET',success:function(j) {
            let date_fin = '';
            $.each($(j).find('div.tab-pane').first().get(0).childNodes,function(ind,n) { if(n.nodeName=="#text" && n.data.includes('acheve')) date_fin = n.data.split('le ')[1].split('.')[0]; });
            date_fin = date_fin.split('-')[1]+'-'+date_fin.split('-')[0]+'-'+new Date().getFullYear();
            $.each(get_stored('planetes'),function(i,p) {
                if(!isNaN(parseInt(p.or))){
                    tot += parseInt(p.or);
                    if(p.proprio==localStorage.playerName) totmine += parseInt(p.or);
                }
                if(p.prod_or) {
                    let diff = Math.floor((new Date(date_fin).getTime()-(Date.now()+(parseInt(p.next_cycle.split(' ')[1])*60*60*1000)))/(1000*60*60));
                    totprod += (1+Math.floor(diff/parseInt(p.cycle.split(' ')[1])));
                }
            });
            $("#resultor").html('<table style="font-size:10px;width:100%;"><tr><td>sur planète actuellement</td><td style="text-align:right;">'+tot+'</td></tr><tr><td>que je possède</td><td style="text-align:right;">-'+totmine+'</td></tr><tr><td>produit d\'ici la fin de mission</td><td style="text-align:right;">+'+totprod+'</td></tr><tr><td>restant à récupérer en '+Math.ceil((new Date(date_fin).getTime()-Date.now())/(1000*60*60*24))+'jours</td><td style="text-align:right;">'+(tot-totmine+totprod)+'</td></tr></table>');
        }});
    }
    function constr_menu_tools() {
        alim_cible_select(true);
        let leaders = get_stored('leaders');
        let tools = exist_for_player('tools')?get_stored('tools'):init_tools;
        let content = {
            me:"relance le leader en explo dès qu'il se pose",
            me1:"Lors de l'exploration continue et seulement si la planète n'est pas en conflit, permet de voir les objets à acheter",
            md:"envoi le leader sur une autre planete. Est réinitialisé après le lancement de l'action",
            md1:"attends que le leader ai fini de politiser la planète (pas du 100%, seulement le nécessaire pour la contrôler)",
            mb:"lance la construction d'un brouilleur sur la planete où le leader s'est posé",
            mb1:"Attend que le leader ai politisé la planète (pas du 100%, seulement le nécessaire pour la contrôler)",
            ma:"lance la construction d'une ambassade sur la planète où le leader s'est posé",
            mp1:"génère une offre commerciale s\'il n\'y en a pas déjà une",
            mp2:"déplace les astros sur une planète stable si son degré d'urgence est au plus haut (on va perdre la planète au prochain cycle)",
            mp2b:"Le délai avant la fin du prochain cycle (nombre d'heures) passé lequel l'action s'enclenche",
            mp3:"déclenche le brouilleur de champs si un leader est présent",
            mp4:"place un traceur sur les leaders présents",
            a0:"Si une planète sur laquelle il est possible d'activer l'action de confrérie est trouvée, on l'active automatiquement",
            a1:"recharge la map à chaque mise à jour (pour le panneau de combat)",
            a2:"lance la lecture de toutes les planètes individuellement (prend du temps et des ressources, a utiliser avec parcimonie)",
            a3:"scroll automatiquement la map vers la planete quand on survole un <a style='color:lightgreen;'>lien </a>",
            c1:"Envoi des croiseurs en protection (si pas de choix de destination: 1ère planète du joueur trouvée, si rotation: change pour chaque) dès qu'on dépasse les 5 parqués en ZN"
        };
        let cibledef = '';
        $.each(get_stored('planetes').filter(o=>o.proprio==localStorage.playerName).sort((a,b) => (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0)),function(i,v) { cibledef+='<option value="'+v.x+'-'+v.y+'-'+v.nom+'">'+v.nom+'</option>'; });
        //let html = '<style>#freqmaj::-webkit-outer-spin-button,#freqmaj::-webkit-inner-spin-button,#freqmaj0::-webkit-outer-spin-button,#freqmaj0::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } #freqmaj,#freqmaj0 { -moz-appearance: textfield;}</style>';
        //html += '<div class="col-md-2"><fieldset><legend style="color:white;">Explo Auto&nbsp;<span class="pop" style="font-size:small;" data-type="me">&#9432;</span></legend><label><input type="checkbox" id="activ_autoexplo" style="opacity:1;">Arpenter avant décollage</label>&nbsp;<span class="pop" data-type="me1">&#9432;</span><!--div id="ll_autoexplo">'+ll_auto('explo')+'</div--></fieldset></div>';
        //html += '<div class="col-md-3"><fieldset><legend style="color:white;">Deplacement Auto&nbsp;<span class="pop" style="font-size:small;" data-type="md">&#9432;</span></legend><label><input type="checkbox" id="activ_automouv" style="opacity:1;">Attendre putch</label>&nbsp;<span class="pop" data-type="md1">&#9432;</span><div id="ll_automouv">'+ll_auto('mouv')+'</div></fieldset></div>';
        //if(leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,9)=='Fondation') html += '<div class="col-md-2"><fieldset><legend style="color:white;">Brouilleur&nbsp;<span class="pop" style="font-size:small;" data-type="mb">&#9432;</span></legend><!--label><input type="checkbox" id="activ_autoconstrB" style="opacity:1;">Activer</label--><label><input type="checkbox" id="wait_autoconstrB" style="opacity:1;">Posseder la planète</label>&nbsp;<span class="pop" data-type="mb1">&#9432;</span><div id="ll_autoconstrB">'+ll_auto('constrB')+'</div></fieldset></div>';
        //TODO_old: if(leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,16)=='Indépendant Niv3') html += '<div class="col-md-2"><fieldset><legend style="color:white;">Ambassade&nbsp;<span class="pop" style="font-size:small;" data-type="ma">&#9432;</span></legend><!--label><input type="checkbox" id="activ_autoconstrA" style="opacity:1;">Activer</label--><div id="ll_autoconstrA">'+ll_auto('constrA')+'</div></fieldset></div>';
        let tempoffre = {offre:'', demande:''};
        $.each(['offre','demande'],function(i0,type) {
            $.each(['or','etain','fer','vivres','manuf'],function(i1,prod) {
                if(!(type=='demande' && i1==0)) for(let o=1;o<=(type=='offre'?25:5);o++) tempoffre[type]+='<option value="'+prod+'-'+o+'">'+type+' '+o+' '+prod+'</option>';
            });
        });
        let cnt = 0, temptroup = new Array(12).fill(null).map(()=>'<option value="'+(++cnt)+'">'+(cnt)+'</option>').join('');
        let mineslct = '';
        $.each(get_stored('planetes').filter(o=>o.proprio==localStorage.playerName).sort((a,b) => (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0)),function(i,v) { mineslct+='<option data-coord="'+v.x+'-'+v.y+'" value="'+v.nom+'">'+v.nom+'</option>'; });
        let html = '<div class="col-md-3"><fieldset><legend style="color:white;">Planète <select id="planto" class="btn btn-xs">'+mineslct+'</select></legend><div>'+
            '<label>Planifier une action : </label><select id="acteto" class="btn btn-xs"><option value="astro" title="prévoir attaque/transfert">Mvt troupes</option><option value="noastro" title="annuler attaque/transfert">annuler astros</option><option value="commerce" title="prévoir une offre">Passer offre</option><option value="nocommerce" title="annuler une offre">Annuler offre</option><option value="don" title="prévoir de donner la planète à un autre joueur">Don</option>'+(leaders.find(o=>o.player==localStorage.playerName).niv.includes('Fondation')?'<option value="brou" title="déclencher brouilleur">Brouiller</option>':'')+'</select><br>'+
            '<div id="as"><label>Mvt troupes : </label><select class="btn btn-xs" id="troupes">'+temptroup+'</select> vers <select class="btn btn-xs" id="ciblemvt">'+cibleslct+'</select></div>'+
            '<div id="co" style="display:none;"><label>Publier l\'offre : </label><select id="offre1" class="btn btn-xs">'+tempoffre.offre+'</select> contre <select id="demande" class="btn btn-xs">'+tempoffre.demande+'</select></div>'+
            '<div id="do" style="display:none;"><label>Donner à : </label><select id="dest" class="btn btn-xs">'+leaders.filter(l=>l.sector && l.ally && l.player!=localStorage.playerName).map(l=>'<option value="'+l.player+'">'+l.player+'</option>').join('')+'</select></div>'+
            '<label>Quand : </label><input class="btn btn-xs" type="datetime-local" id="le" value="'+new Date(Date.now()).toISOString('en-US',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit'}).substr(0,11)+$("#hours").text()+':'+$("#min").text()+'" min="'+new Date(Date.now()).toISOString('en-US',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit',timeZone:new Intl.Locale('fr-FR').timeZones[0]}).substr(0,11)+$("#hours").text()+':'+$("#min").text()+'">'+
            '<button class="btn btn-alt btn-xs" id="save_act"><i class="fa fa-save"></i></button></div></fieldset><div style="font-size:13px;"><ul id="listplanifplanets"></ul></div></div>';
        html += '<div class="col-md-2"><fieldset><legend style="color:white;">Planètes</legend><div><label><input type="checkbox" id="activ_autocomm" style="opacity:1;">Commerce auto</label>&nbsp;<span class="pop" data-type="mp1">&#9432;</span></div><div><label><input type="checkbox" id="activ_autoastro" style="opacity:1;">Déplacer astros</label>&nbsp;<span class="pop" data-type="mp2">&#9432;</span><br><label>Deadline : </label><input type="number" class="btn btn-xs" style="width:40px;" id="deadlineastro" name="deadlineastro" value="">&nbsp;<span class="pop" data-type="mp2b">&#9432;</span></div>'+(leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,9)=='Fondation'?'<div><label><input type="checkbox" id="activ_autobrouil" style="opacity:1;">Brouillage auto</label>&nbsp;<span class="pop" data-type="mp3">&#9432;</span></div><div><label><input type="checkbox" id="activ_autotrace" style="opacity:1;">Traçage auto</label>&nbsp;<span class="pop" data-type="mp4">&#9432;</span></div>':'')+(leaders.find(o=>o.player==localStorage.playerName).niv.includes('Marchand')?'<button class="btn btn-alt btn-xs" id="calcor">Calculer Or</button><span id="resultor"></span>':'')+(leaders.find(o=>o.player==localStorage.playerName).niv.includes('Niv3')?'<div><label><input type="checkbox" id="activ_autoconf" style="opacity:1;">Action de confrérie</label>&nbsp;<span class="pop" data-type="a0">&#9432;</span><br><input type="checkbox" id="autoconf_palais" style="opacity:1;">Seulement Palais</label></div>':'')+'</fieldset></div>';
        html += '<div class="col-md-3"><fieldset><legend style="color:white;">Général</legend><div><label><input type="checkbox" id="activ_autoexplo" style="opacity:1;">Arpenter avant décollage</label>&nbsp;<span class="pop" data-type="me1">&#9432;</span></div><div><label><input type="checkbox" id="reload_map" style="opacity:1;">reload Map</label>&nbsp;<span class="pop" data-type="a1">&#9432;</span></div><div><label>Recharger toutes les </label><input class="btn btn-xs" type="number" id="freqmaj0" value="1" style="width:40px;"> min</div><div><label style="display:inline;"><input type="checkbox" id="activ_automaj" style="opacity:1;">Maj détails</label>&nbsp;<span class="pop" data-type="a2">&#9432;</span> - <label style="display:inline;">Fréquence</label>&nbsp;<input type="number" class="btn btn-xs" id="freqmaj" value="30" class="form-control" style="width:40px;"><button class="btn btn-alt btn-xs" id="launchmaj">Lancer</button><br>Dernière maj : '+(new Date(parseInt(get_stored('cnt_detail'))).toLocaleString())+'</div><div><label><input type="checkbox" id="activ_autozn" style="opacity:1;">Décret Branno</label>&nbsp;<span class="pop" data-type="c1">&#9432;</span><select class="btn btn-xs cibledefwrapper" id="dest_autozn">'+cibledef+'</select><label><input type="checkbox" id="rotate_autozn" style="opacity:1;"><i class="fa fa-refresh fa-xs"></i></label></div><div><label><input type="checkbox" id="activ_autoscroll" style="opacity:1;">map scroll auto</label>&nbsp;<span class="pop" data-type="a3">&#9432;</span></div></fieldset></div>';
        html += '<div class="col-md-2"></div>';
        html += '<div class="col-md-2"></div>';
        $("#spec_content3 span.pop").each(function() { $(this).popover('destroy'); });
        $("#spec_content3").empty().append('<div class="row col-md-12">'+html+'</div>');
        $("#spec_content3 span.pop").each(function() { $(this).popover({html:true,placement:"bottom",trigger:"hover",content:content[$(this).data('type')],template:'<div class="popover" style="z-index:1000;" role="tooltip"><div class="arrow"></div><!--h3 class="popover-title"></h3--><div class="popover-content" style="font-size:13px;"></div></div>'}); });
        //re-affiche les valeurs enregistrées
        $('input[id^="activ_"]').each(function() {
            $(this).prop('checked',tools[$(this).attr('id').replace('activ_','')].active);
        });
        /*if(tools.autoexplo.leaders.length>0) $.each(tools.autoexplo.leaders,function(a,b) {
            $("#ll_autoexplo").find('input[value="'+b.id+'"]').first().prop('checked',b.active);
        });
        if(tools.automouv.leaders.length>0) $.each(tools.automouv.leaders,function(a,b) {
            $("#ll_automouv").find('input[value="'+b.id+'"]').first().prop('checked',b.active);
            $("#ll_automouv").find('select[id="'+b.id+'"]').first().val(b.dest);
        });
        if(tools.autoconstrB.leaders.length>0) $.each(tools.autoconstrB.leaders,function(a,b) {
            $("#ll_autoconstrB").find('input[value="'+b.id+'"]').first().prop('checked',b.active);
        });
        if(tools.autoconstrA.leaders.length>0) $.each(tools.autoconstrA.leaders,function(a,b) {
            $("#ll_autoconstrA").find('input[value="'+b.id+'"]').first().prop('checked',b.active);
        });*/
        $("#reload_map").prop('checked',tools.automaj.map);
        $("#freqmaj").val(tools.automaj.freq);
        $("#freqmaj0").val(tools.automaj.maj);
        $("#dest_autozn").val(tools.autozn.maj);
        $("#rotate_autozn").prop('checked',tools.autozn.rotate);
        $("#deadlineastro").val(tools.autoastro.deadline);
        $("#autoconf_palais").val(tools.autoconf.palais);
        //enregistre les valeurs choisies
        $('input[id^="activ_"]').off('change').on('change',function() {
            tools[$(this).attr('id').replace('activ_','')].active = $(this).is(':checked');
            set_stored('tools',tools);
        });
        /*$("#ll_autoexplo input").off('change').on('change',function() {
            if(tools.autoexplo.leaders.find(o=>o.id==$(this).val())!=undefined) tools.autoexplo.leaders.find(o=>o.id==$(this).val()).active = $(this).is(':checked');
            else tools.autoexplo.leaders.push({id:$(this).val(),active:$(this).is(':checked')});
            set_stored('tools',tools);
        });
        $("#ll_automouv input").off('change').on('change',function() {
            if(tools.automouv.leaders.find(o=>o.id==$(this).val())!=undefined) tools.automouv.leaders.find(o=>o.id==$(this).val()).active = $(this).is(':checked');
            else tools.automouv.leaders.push({id:$(this).val(),active:$(this).is(':checked')});
            set_stored('tools',tools);
        });
        $("#ll_automouv select").off('change').on('change',function() {
            if(tools.automouv.leaders.find(o=>o.id==$(this).attr('id'))!=undefined) tools.automouv.leaders.find(o=>o.id==$(this).attr('id')).dest = $(this).val();
            else tools.automouv.leaders.push({id:$(this).attr('id'),dest:$(this).val()});
            set_stored('tools',tools);
        });
        $("#ll_autoconstrB input").off('change').on('change',function() {
            if(tools.autoconstrB.leaders.find(o=>o.id==$(this).val())!=undefined) tools.autoconstrB.leaders.find(o=>o.id==$(this).val()).active = $(this).is(':checked');
            else tools.autoconstrB.leaders.push({id:$(this).val(),active:$(this).is(':checked')});
            set_stored('tools',tools);
        });
        $("#wait_autoconstrB").off('change').on('change',function() {
            tools.autoconstrB.wait = $(this).is(':checked');
            set_stored('tools',tools);
        });
        $("#ll_autoconstrA input").off('change').on('change',function() {
            if(tools.autoconstrA.leaders.find(o=>o.id==$(this).val())!=undefined) tools.autoconstrA.leaders.find(o=>o.id==$(this).val()).active = $(this).is(':checked');
            else tools.autoconstrA.leaders.push({id:$(this).val(),active:$(this).is(':checked')});
            set_stored('tools',tools);
        });*/
        $("#freqmaj").off('change').on('change',function() {
            tools.automaj.freq = $(this).val();
           set_stored('tools',tools);
        });
        $("#freqmaj0").off('change').on('change',function() {
            tools.automaj.maj = $(this).val();
            set_stored('tools',tools);
        });
        $('#reload_map').off('change').on('change',function() {
            tools.automaj.map = $(this).is(':checked');
            set_stored('tools',tools);
        });
        $("#dest_autozn").off('change').on('change',function(){
            tools.autozn.destination = $(this).val();
            set_stored('tools',tools);
        });
        $("#rotate_autozn").off('change').on('change',function(){
            tools.autozn.rotate = $(this).is(':checked');
            set_stored('tools',tools);
        });
        $("#deadlineastro").off('change').on('change',function(){
            tools.autoastro.deadline = $(this).val();
            set_stored('tools',tools);
        });
        $("#launchmaj").off('change').on('click',function() { console.log('force check detail'); check(true); });
        $("#calcor").off('click').on('click',calc_or);
        $("#autoconf_palais").off('chang').on('change',function() {
            tools.autoconf.palais = $(this).is(':checked');
            set_stored('tools',tools);
        });
        //planif planetes
        $("#planto").off('change').on('change',function() {
            let planet = get_stored('planetes').find(o=>o.nom==$(this).val());
            $("#offre1").empty();
            $.each(['or','etain','fer','vivres','manuf'],function(i1,prod) { for(let o=1;o<=(planet[prod]<25?planet[prod]:25);o++) $("#offre1").append('<option value="'+prod+'-'+o+'">offre '+o+' '+prod+'</option>'); });
            let acnt=0;
            $("#troupes").empty().append(new Array(parseInt(planet.astros)).fill(null).map(()=>'<option value="'+(++acnt)+'">'+(acnt)+'</option>').join(''));
        });
        $("#acteto").off('change').on('change',function(){
            $("#as, #co, #do").hide();
            $("#"+$(this).val().substr(0,2)).show();
        });
        $("#save_act").off('click').on('click',function(){
            let planetes = get_stored('planetes');
            if(planetes.find(o=>o.nom==$("#planto").val()).planif==undefined) planetes.find(o=>o.nom==$("#planto").val()).planif = []
            let cntexist = planetes.find(o=>o.nom==$("#planto").val()).planif.length;
            planetes.find(o=>o.nom==$("#planto").val()).planif.push({acte:$("#acteto").val(),offre:$("#offre1").val(),demande:$("#demande").val(),dest:$("#dest").val(),troupes:$("#troupes").val(),cible:$("#ciblemvt").val(),quand:Date.parse($("#le").val())});
            set_stored('planetes',planetes);
            mnotify('alert alert-success','action planifiée',2000);
            $("#listplanifplanets").append('<li id="'+$("#planto").val()+'_'+cntexist+'">Depuis '+$("#planto").val()+', '+$("#acteto option:selected").text()+' le '+new Date(Date.parse($("#le").val())).toLocaleString()+' <button data-planete="'+$("#planto").val()+'" data-ind="'+cntexist+'" class="delplanifplanet" style="background-color:#d9534f;"><i class="fa fa-trash"></i></button></li>');
            $(".delplanifplanet").off('click').on('click',function() {
                let p = get_stored('planetes');
                p.find(o=>o.nom==$(this).data('planete')).planif.splice($(this).data('ind'),1);
                $(this).parent('li').remove();
                set_stored('planetes',p);
            });
            $("#planto, #troupes, #cible, #le, #quand").val('');
        });
        let t = get_stored('planetes').filter(f=>f.planif.length>0);
        let txt='';
        $.each(t,function(i,v){
            $.each(v.planif,function(j,w){
                let corresp = {astro:w.troupes+' astros vers '+w.cible.split('-')[2],noastro:'Annuler mvt troupes',commerce:'Passer offre : '+w.offre+' contre '+w.demande,nocommerce:'Annuler Offre',don:'Doner planète à '+w.dest};
                txt+='<li id="'+v.nom+'_'+j+'">Depuis '+v.nom+', '+corresp[w.acte]+' le '+new Date(w.quand).toLocaleString()+' <button data-planete="'+v.nom+'" data-ind="'+j+'" class="delplanifplanet" style="background-color:#d9534f;"><i class="fa fa-trash"></i></button></li>';
            });
        });
        $("#listplanifplanets").append(txt);
        $(".delplanifplanet").off('click').on('click',function() {
            let p = get_stored('planetes');
            p.find(o=>o.nom==$(this).data('planete')).planif.splice($(this).data('ind'),1);
            $(this).parent('li').remove();
            set_stored('planetes',p);
        });
    }
    //--gen news
    function reorder_news(type=JSON.parse(JSON.stringify(filtre))) {
        let tm = '';
        if(typeof type === 'string') type = [type];
        $.each(get_stored('planetes'),function(y,planet){
            let news = '';
            if(planet.events.length>0) {
                $.each(planet.events.reverse(),function(w,newo) { if(type.includes(newo.ico.split('/')[2].split('.')[0])) news+='<img src="'+newo.ico+'" style="width:20px;"><small class="text-muted">'+new Date(newo.date?newo.date:Date.now()).toLocaleString('fr-FR')+'</small>&nbsp;&nbsp;'+newo.msg+(planet.events.length!=w?'<br>':''); });
                if(news!='') tm+= '<div class="media addjme"><div class="pull-left"><a style="color:lightgreen" class="testdet" href="detail.php?x='+planet.x+'&y='+planet.y+'" target="fenetre">'+planet.nom+'</a></div><div class="media-body">'+/*'<small class="text-muted">'+mess.nom+'</small><br>'+*/news+'</div></div>';
            }
        });
        $("#spec_content0").empty().html(tm);
        rt_to_map();
        //return tm;
    }
    $.each(filtre,function(i,v){
        $("#btnFiltres").append('<div id="'+v+'" class="push_button activer btn btn-xs"><img src="images/picto/'+v+'.png" style="width:20px;"></div>');
        $("#"+v).on('click',function() {
            if($(this).hasClass('activer')) {
                if(filtre_actif.length>1) {
                    $(this).removeClass('activer');
                    if(filtre_actif.includes($(this).attr('id'))) filtre_actif.splice(filtre_actif.indexOf($(this).attr('id')),1)
                } // else rien car on veut avoir au moins un filtre d'activé sinon la liste retourne rien...
            } else {
                $(this).addClass('activer')
                if(!filtre_actif.includes($(this).attr('id'))) filtre_actif.push($(this).attr('id'));
            }
            $("#spec_content0").html(reorder_news(filtre_actif));
        });
    });
    $("#btnFiltres").append('<div id="switchAll" class="push_button activer btn btn-xs">SW</div>');
    $("#switchAll").on('click', function() {
        if($(this).hasClass('activer')) {
            filtre_actif = ['leader'];
            $(".push_button").each(function(i,v) { if($(v).hasClass('activer')) $(v).removeClass('activer'); });
            $("#leader").addClass('activer');
        } else {
            filtre_actif = JSON.parse(JSON.stringify(filtre));
            $(".push_button").each(function(i,v) { if(!$(v).hasClass('activer')) $(v).addClass('activer'); });
        }
        $("#spec_content0").html(reorder_news(filtre_actif));
    });
    //draggable code : fonctions
    var indChild;
    function onDragStartCrois(e) {
        let elemen = $(e.srcElement).hasClass('m-b-5') ? $(e.srcElement) : $(e.srcElement).parents('div.m-b-5').first();
        let ico = elemen.find('div:has(> img):not(div.col-sm-offset-2)').first().find('img').first();
        let objcrois = {id:elemen.find('a[href^="croiseur.php"]').first().text().split(' ')[2],type:elemen.find('a[href^="croiseur.php"]').first().text().split(' ')[0],etat:elemen.find('.progress div').eq(1).text().split(' ')[0],actif:ico.attr('src').includes('zoneneutre')?false:true};
        e.dataTransfer.setData("croiseur/fondation.jeu", JSON.stringify(objcrois));
        e.dataTransfer.setData("text/plain",objcrois.id);
        let img = elemen.find('img[src^="images/vaisseau"]').first();
        let clonedimg = img.get(0).cloneNode(false);
        clonedimg.height = 100;
        indChild=document.body.appendChild(clonedimg);
        e.dataTransfer.setDragImage(clonedimg, 0, 0);
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.dropEffect = "link";
    }
    function onDragEndCrois(e) {
        if(indChild) document.body.removeChild(indChild);
        indChild=undefined;
    }
    function onDragStartAtelier(e) {
        let elemen = $(e.srcElement);
        let ico = elemen.find('div:has(> img):not(div.col-sm-offset-2)').first().find('img').first();
        let objcrois = {id:elemen.attr('title').split(' ')[1],type:elemen.attr('title').split(' ')[2],etat:e.srcElement.nextSibling.textContent.replace('%',''),actif:false};
        e.dataTransfer.setData("croiseur/fondation.jeu", JSON.stringify(objcrois));
        e.dataTransfer.setData("text/plain",objcrois.id);
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.dropEffect = "link";
    }
    function onDragStartLead(e) { //$(elem).on('dragstart',function(e){ e.originalEvent.dataTransfer.setData('text/plain','test');
        let elemen = $(e.srcElement).hasClass('m-b-5') ? $(e.srcElement) : $(e.srcElement).parents('div.m-b-5').first();
        e.dataTransfer.setData("leader/fondation.jeu", JSON.stringify(get_stored('leaders').find(j=>j.player==localStorage.playerName).leaders.find(l=>l.nom==elemen.find('a[href^="leader.php"]').first().text().trim())));
        e.dataTransfer.setData("text/plain",elemen.find('a[href^="leader.php"]').first().text());
        let img = elemen.find('.piclead');
        let clonedimg = img.get(0).cloneNode(false);
        indChild=document.body.appendChild(clonedimg);
        clonedimg.width=108;
        clonedimg.height=108;
        e.dataTransfer.setDragImage(clonedimg, 0, 0);
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.dropEffect = "link";
    }
    function onDragEndLead(e) {
        if(indChild) document.body.removeChild(indChild);
        indChild=undefined;
    }
    function onDragOverLead(e) { if(e.dataTransfer.types.includes('leader/fondation.jeu')) e.preventDefault(); }
    function onDropLead(e) {
        e.preventDefault();
        if(indChild) document.body.removeChild(indChild);
        indChild=undefined;
        let fromlead = JSON.parse(e.dataTransfer.getData('leader/fondation.jeu'));
        let tolead = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(l=>l.nom==$(e.target).parents('.m-b-5').first().find('a[href^="leader.php"]').first().text().trim());
        let planet = get_stored('planetes').find(p=>p.nom==$(e.target).parents('.m-b-5').first().find('a[href^="detail.php"]').first().text().trim());
        if(fromlead.nom != tolead.nom){
            if(planet==undefined) mnotify('alert alert-warning',"Je ne sais pas où se trouve actuellement "+tolead.nom+" !",3000);
            else if(!fromlead.activite.includes('Politique')) mnotify('alert alert-warning','Je suis actuellement occupé, j\'irai passer le bonjour à '+tolead.nom+' sur '+planet.nom+' un autre jour !',3000);
            else {
                if(confirm('Envoyer '+fromlead.nom+' sur '+planet.nom+' ?')) {
                    call_lead({id_leader:fromlead.id,action:1,planete:planet.x+'-'+planet.y+'-'+planet.nom},planet);
                    //mnotify('alert alert-warning','Eh beh quoi on veut voir '+e.dataTransfer.getData('text/plain')+' et '+$(e.target).parents('.m-b-5').first().find('a[href^="leader.php"]').first().text()+' se bécotter ?',5000);
                }
            }
        }
    }
    function onDragStartPlanet(e) {
        let elem = $(e.srcElement).hasClass('divplanete') ? $(e.srcElement) : $(e.srcElement).parents('div.divplanete').first();
        e.dataTransfer.setData("planete/fondation.jeu", JSON.stringify(get_stored('planetes').find(p=>p.nom==elem.find('img').first().attr('id').trim())));
        e.dataTransfer.setData("text/plain",elem.find('img').first().attr('id').trim());
        e.dataTransfer.setDragImage(elem.find('.popover.in').get(0)||elem.get(0), 0, 0);
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.dropEffect = "link";
    }
    function onDragOverPlanet(e) { if(e.dataTransfer.types.filter(o=>o.includes('fondation.jeu')).length) e.preventDefault(); }
    function onDragEnterPlanet(e) {
        $(e.target).parents('.divplanete').first().css('box-shadow','8px 8px 100px rgba(255,255,255,0.7)');
        //$(e.target).css('transform','scale(1.5)');
        $(e.target).popover('show');
        if(e.dataTransfer.types.includes('leader/fondation.jeu')) e.preventDefault();
    }
    function onDragLeavePlanet(e) {
        $(e.target).parents('.divplanete').first().css('box-shadow','none');
        //$(e.target).css('transform','scale(1)');
        $(e.target).popover('hide');
        if(e.dataTransfer.types.includes('leader/fondation.jeu')) e.preventDefault();
    }
    function onDropPlanet(e) {
        e.preventDefault();
        if(indChild) document.body.removeChild(indChild);
        indChild=undefined;
        $(e.target).parents('.divplanete').first().css('box-shadow','none');
        //$(e.target).css('transform','scale(1)');
        $(e.target).popover('hide');
        let from;
        const supportedTypes = [ 'leader/fondation.jeu', 'planete/fondation.jeu', 'croiseur/fondation.jeu', ];
        let types = e.dataTransfer.types.filter((type) => supportedTypes.includes(type));
        if(!types.length) mnotify("alert alert-warning","Entité non reconnue",3000);
        else {
            from = JSON.parse(event.dataTransfer.getData(types[0]));
            let toplanet = get_stored('planetes').find(p=>p.nom==($(e.target).parents('.divplanete').first().find('span.btn').length?$(e.target).parents('.divplanete').first().find('span.btn').first().text().trim():$(e.target).parents('.divplanete').first().find('button').first().text().trim()));
            if(types[0].split('/')[0]=='leader' && !from.activite.includes('Politique')) mnotify('alert alert-warning',from.nom+' : <i>Je suis actuellement occupé, j\'irai visiter '+toplanet.nom+' un autre jour !</i>',3000);
            else if(types[0].split('/')[0]=='croiseur' && from.actif) mnotify("alert alert-warning","Le croiseur "+from.type+" N° "+from.id+" est actuellement occupé",3000);
            else if(types[0].split('/')[0]=='planete' && parseInt(from.astros)==0) mnotify("alert alert-warning","Il n'y a aucun astronefs sur "+from.nom+", on risque pas de faire grand chose ...",3000);
            else if(!(types[0].split('/')[0]=='planete' && from.nom == toplanet.nom)){
                let action = types[0].split('/')[0]=='leader'?1:(toplanet.proprio==localStorage.playerName?(types[0].split('/')[0]=='croiseur'?4:2):(get_stored('leaders').find(o=>o.player==toplanet.proprio).ally?(types[0].split('/')[0]=='croiseur'?(from.type=='X33'?5:-1):0):(types[0].split('/')[0]=='croiseur'?5:(parseInt(toplanet.astros)==0?0:3))));
                if(action<0) mnotify('alert alert-warning',toplanet.nom+" est une planète alliée, aucun mouvement militaire n'est possible vers cette destination !",3000);
                else if(action==0) mnotify('alert alert-warning',"Aucun astronefs disponible sur "+toplanet.nom+" !",3000);
                else {
                    let msg='';
                    if(['3','5'].includes(action) && $(e.target).parents('.divplanete').first().next().find('img[src="images/picto/protection.png"]').length > 0) msg += $(e.target).parents('.divplanete').first().next().find('img[src="images/picto/protection.png"]').attr('title').trim().split(' ')[0]+' croiseurs en protection !';
                    if(action==3 && toplanet.proprio!='Neutre' && from.pol.find(k=>k.player==toplanet.proprio)!=undefined) msg += (msg==''?'':'En plus, ')+toplanet.proprio+' détient '+from.pol.find(k=>k.player==toplanet.proprio).pol+' de politique sur '+from.nom+'. Il faut s\'attendre à des désertions.';
                    if(confirm('Envoyer '+(types[0].split('/')[0]=='leader'?from.nom:(types[0].split('/')[0]=='croiseur'?'le croiseur '+from.type+' N° '+from.id+' ('+from.etat+'%)':'des astros'))+' sur '+toplanet.nom+' ?'+msg)) {
                        if(action==1) {//leader
                            //mnotify('alert alert-success','On va envoyer '+e.dataTransfer.getData('text/plain')+' sur '+$(e.target).parents('.divplanete').first().find('span.btn').first().text()+' dès que possible !',5000);
                            call_lead({id_leader:from.id,action:1,planete:toplanet.x+'-'+toplanet.y+'-'+toplanet.nom},toplanet);
                        }else if(action>3) {//croiseur
                            if(from.type!='X33') call_ajax_croiseur({id_croiseur:from.id,action:toplanet.proprio==localStorage.playerName?1:2,cible:toplanet.x+'-'+toplanet.y+'-'+toplanet.nom,cibledef:toplanet.x+'-'+toplanet.y+'-'+toplanet.nom,});
                            else {
                                let contentmod='<h5>Choisir la zone à bombarder sur '+toplanet.nom+'</h5><div><input type="hidden" id="popprixtype"><input type="hidden" id="popprixplanto"><input type="hidden" id="popprixcroisid"><select id="popprixsel" class="btn btn-xs"><option value="hangar">Hangar</option><option value="ambass" '+(!toplanet.amb?'disabled title="Pas d\'ambassade sur cette planète !"':'')+'>Ambassabe</option><option value="brou" '+(!toplanet.brouilleur?'disabled title="Pas de brouilleur sur cette planète !"':'')+'>Brouilleur</option><option value="centre">Centre ville</option></select><div id="popprixinfo">Etat du croiseur : <span style="color:'+(parseInt(from.etat)<50?'red':(parseInt(from.etat)<70?'orange':'green'))+';">'+from.etat+'</span><br>Astros en défense : '+toplanet.astros+(msg!=''?'<br>Croiseurs en défense : '+msg.split(' ')[0]:'')+'</div></div>';
                                $("#popprixmod .modal-body").html(contentmod);
                                $("#popprixtype").val('x33');
                                $("#popprixplanto").val(toplanet.x+'-'+toplanet.y+'-'+toplanet.nom);
                                $("#popprixcroisid").val(from.id);
                                $("#popprixsel").val('hangar');
                                $("#popprixmod").modal({backdrop:'static',keyboard:false});
                            }
                        }else {//planete
                            let cnts=0;
                            let contentmod=(action==3?'<h5>Choisir combien envoyer d\'astros de '+from.nom+' en renfort sur '+toplanet.nom+'</h5>':'<h3>Attaque de '+toplanet.nom+' ('+toplanet.proprio+')</h3>Depuis '+from.nom+'('+from.astros+' astros)'+(from.pol.find(p=>p.player==toplanet.proprio)!=undefined?'<span style="color:red;">'+from.pol.find(p=>p.player==toplanet.proprio).pol+'</span>':'')+'<br>Astros en défense : '+toplanet.astros+(msg.includes('croiseurs')?'<br>Croiseurs en défense : '+msg.split(' ')[0]:''))+'<div><input type="hidden" id="popprixtype"><input type="hidden" id="popprixplanto"><input type="hidden" id="popprixplanfrom"><select id="popprixsel" class="btn" style="width:50px;margin-left:25px;">'+new Array(parseInt(from.astros)).fill(null).map(()=>'<option value="'+(++cnts)+'">'+cnts+'</option>').join('')+'</select></div>';
                            $("#popprixmod .modal-body").html(contentmod);
                            $("#popprixtype").val('astro');
                            $("#popprixplanto").val(toplanet.nom);
                            $("#popprixplanfrom").val(from.nom);
                            $("#popprixsel").val(1);
                            $("#popprixmod").modal({backdrop:'static',keyboard:false});
                        }
                    }
                }
            }
        }
    }
    //--gen custom map
    function custom_map_pl(div) {
        let oldimgsrc = $(div).find('img').first().attr('src');
        if($(div).find('img').first().attr('onclick')) {//on zappe les div créé pour LeaderLine
            let planet = get_stored('planetes').find(o=>o.nom==$(div).find('img').first().attr('id')); //on fait que de la lecture, on recup direct l'objet
            function custom_map_pl_s() {
                let leaders = get_stored('leaders');
                planet = get_stored('planetes').find(o=>o.nom==$(div).find('img').first().attr('id')); //au cas ou on l'avait pas et qu'on a du appeler la maj
                let pol = '';//toutes les pol de la planete lue
                let polF = 10;//le % de pol qu'on peut gagner en 8h par notre leader le plus experimenté (mini 10, on va y ajouter notre pol deja acquise et la pol neutre de la planete si on est fondateur)
                let maxXP = 0;//l'xp en pol du leader le plus experimenté
                if(leaders.length>0) $.each(leaders.find(o=>o.player==localStorage.playerName).leaders,function(k,p) { if(parseInt(p.xp.politique)>maxXP) maxXP = parseInt(p.xp.politique); });
                maxXP = 100-(Math.floor(maxXP/10)*10);//le polF necessaire sur une planete pour que le leader qui a le plus d'xp puisse la putcher en 1 fois
                if(planet && planet.pol) $.each(planet.pol,function(j,o) {
                    pol += o.pol+'('+o.player+')<br>';
                    if(planet.proprio!=localStorage.playerName && (o.player=='Neutre' && leaders.length>0 && leaders.find(q=>q.player==localStorage.playerName) && leaders.find(q=>q.player==localStorage.playerName).niv && leaders.find(q=>q.player==localStorage.playerName).niv.substr(0,9)=='Fondation') || o.player==localStorage.playerName) polF += parseInt(o.pol.replace('%',''));
                });
                let test = $(div).find('span').first().attr('data-original-title');
                if(test===undefined) test = $(div).find('button').first().attr('data-original-title');//cas tres specifique des capitale secteurs en I3 qui ont un bouton au lieu du label sur la carte alors que le label est de toute facon clickable
                let owner0 = test.split('_')[1];
                let owner = '<span style="width:45px;">'+(leaders.find(o=>o.player==owner0)!=undefined?(leaders.find(o=>o.player==owner0).ally?'<img src="images/icons/alliance.png" height="20px">':(leaders.find(o=>o.player==owner0).ally==null?'<img src="img/icon/home.png" heigth="20px" style="background-color:black;">':'<img src="../images/emplacements/eclateur.gif" width="20px">')):'')+owner0+' '+(leaders.find(o=>o.player==owner0)!=undefined && leaders.find(o=>o.player==owner0).niv?(leaders.find(o=>o.player==owner0).niv.substr(0,1).toUpperCase()+(!Number.isNaN(parseInt(leaders.find(o=>o.player==owner0).niv.substr(-1)))?leaders.find(o=>o.player==owner0).niv.substr(-1):'1')+(leaders.find(o=>o.player==owner0).niv.includes('Niv3') && leaders.find(o=>o.player==owner0).conf?'<span style="font-size:8px;"> ('+leaders.find(o=>o.player==owner0).conf.toUpperCase()+')</span>':'')):'')+'</span>'+(planet && planet.brouilleur?'<img src="images/picto/ondes.png" height="20px">':'')+(planet && planet.amb?(typeof planet.amb === 'string'?'<br>':'')+'<img src="images/picto/ambassade.png" width="20">'+(typeof planet.amb === 'string'?planet.amb:''):'');// ou src="../images/alliance.gif"
                let dev = $(div).next().find('span.label').length>0?$(div).next().find('span.label').first():false;
                let tp = '<div class="label addjme" style="color:black;background-color:'+(planet.urgent==3?'red':(planet.urgent==2?'orange':(planet.urgent==1?'yellow':'green')))+'">'+planet.x+'/'+planet.y+'</div>'+(leaders.find(o=>o.player==localStorage.playerName) && leaders.find(o=>o.player==localStorage.playerName).niv && leaders.find(o=>o.player==localStorage.playerName).niv.includes('Fondation') && planet.deviation !== false?'<div style="color:'+(planet.deviation!=planet.proprio?'orange':'green')+';">'+(dev!==false?dev.html():planet.deviation)+'</div>':'')+'<div style="font-size:small;margin:3px;"><img src="images/vaisseaux/'+(planet.proprio=='mulet'?'mulet':(get_stored('leaders').find(o=>o.player==planet.proprio) != undefined && get_stored('leaders').find(o=>o.player==planet.proprio).niv?get_stored('leaders').find(o=>o.player==planet.proprio).niv.split(' ')[0].toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""):'independant'))+'.png" width="20"> : <span style="'+(planet.etain>0&&planet.fer>0?'background-color:green;':'')+'">'+planet.astros+'</span>'+($(div).next().find('img[src="images/picto/protection.png"]').length > 0?' <span><img src="images/picto/protection.png" width="20"/> : '+$(div).next().find('img[src="images/picto/protection.png"]').attr('title').trim().split(' ')[0]+'</span>':'')+'</div><div style="'+(planet.prod_or?'background-color:green;':(planet.or<3?'background-color:red;':''))+'font-size:small;"><img src="../images/ico_or.gif" height="20" width="20" title="Quantité or (+ si production)"> : '+(planet.prod_or?'+':'')+planet.or+'</div><div style="'+(planet.prod_etain?'background-color:green;':(planet.etain<3?'background-color:red;':''))+'font-size:small;border:1px solid black;border-bottom-style:none;"><img src="../images/ico_etain.gif" height="20" width="20" title="Quantité etain (+ si production)"> : '+(planet.prod_etain?'+':'')+planet.etain+'</div><div style="'+(planet.prod_fer?'background-color:green;':(planet.fer<3?'background-color:red;':''))+'font-size:small;border:1px solid black;border-top-style:none;"><img src="../images/ico_fer.gif" height="20" width="20" title="Quantité fer (+ si production)"> : '+(planet.prod_fer?'+':'')+planet.fer+'</div><div style="'+(planet.prod_vivres?'background-color:green;':(planet.vivres<3?'background-color:red;':''))+'font-size:small;border:1px solid black;border-bottom-style:none;"><img src="../images/ico_vivre.gif" height="20" width="20" title="Quantité vivres (+ si production)"> : '+(planet.prod_vivres?'+':'')+planet.vivres+'</div><div style="'+(planet.prod_manuf?'background-color:green;':(planet.manuf<3?'background-color:red;':''))+'font-size:small;border:1px solid black;border-top-style:none;"><img src="../images/ico_manu.gif" height="20" width="20" title="Quantité Produits manufacturés (+ si production)"> : '+(planet.prod_manuf?'+':'')+planet.manuf+'</div><div style="font-size:xx-small;font-weight:bolder;">'+pol+'</div><div style="font-size:xx-small;font-weight:bolder;"><img src="../images/constructing.gif" width="25" title="Heures avant fin du cycle de production">'+planet.next_cycle.split('dans ')[1].split(' Heure')[0]+' / '+planet.cycle.split('cycle ')[1].split(' Heure')[0]+'</div>'+(planet.offre?'<div style="font-size:xx-small;font-weight:bolder;"><img src="../images/commerce_mini.gif" height="16" width="16" title="Offre commerciale publiée">'+planet.offre+'</div>':'');
                if(dev!==false) {
                    if(leaders.find(o=>o.player==localStorage.playerName) && leaders.find(o=>o.player==localStorage.playerName).niv && leaders.find(o=>o.player==localStorage.playerName).niv.includes('Fondation')) {
                        dev.remove();
                        //$(div).css('border','2px dashed '+(planet.deviation==planet.proprio?'green':'orange'));
                        $(div).css('background-color',(planet.deviation==planet.proprio?'green':'orange'));
                    } else {//if(leaders.find(o=>o.player==localStorage.playerName).niv.includes('Marchand')){//on gere l'affichage des conf I3 comme les offres marchandes
                        $(div).prepend('<style>.hoverpop::before{ content:" • ";} .hoverpop{position:absolute;top:-5px;left:0;width:5px;overflow:hidden;padding-left:5px;transition:transform .2s;} .hoverpop:hover { width:auto;overflow:visible;z-index:10;transform:scale(1.3);}</style>');
                        if(leaders.find(o=>o.player==localStorage.playerName) && leaders.find(o=>o.player==localStorage.playerName).niv && leaders.find(o=>o.player==localStorage.playerName).niv.includes('Marchand') && dev.text().includes('or')) $(div).css('background-color','gold');
                        dev.addClass('hoverpop');
                    }
                }
                if($(div).nextUntil('.divplanete','.explosion').length) {
                    $(div).append('<img src="../images/explode2.gif" alt="" style="position:absolute;left:0;top:0;">');
                    $(div).nextUntil('.divplanete','.explosion').remove();
                }
                $(div).find('img').first().replaceWith('<img '+/*'class="'+$(div).find('img').first().prop('class')+'"'+*/' id="'+$(div).find('img').first().attr('id')+'" data-onclick="'+$(div).find('img').first().attr('onclick')+'" src="'+(planet.proprio==localStorage.playerName?"https://i.ibb.co/9VS2TjT/TERRElune.webp":$(div).find('img').first().attr('src'))+'" alt="" style="display: inline-block; opacity: 1; width: 90px; height: 80px;'+(planet.proprio==localStorage.playerName?'border:5px solid blue;':'')+'">');
                $(div).find('span').first().replaceWith('<span class="btn btn-xs" style="width:100%;background-color:'+(planet.couleur?planet.couleur:'inherit')+';'+(polF>=maxXP && polF>0?'border:2px dashed '+(polF==100?'blue':'yellow')+';':'')+'" data-onclick="'+$(div).find('span').first().attr('onclick')+'" >'+planet.nom+'</span>');
                //$(div).find('span').first().popover({html:true,title:$(div).find('span.btn').first().text(),content:owner+'<br>'+tp,trigger:"hover",placement:"right"});
                //ajout icone planif
                if(planet.planif.length) $(div).next('.ligneico').append('<span class="glyphicon glyphicon-tasks" title="tache planifiée le '+new Date(planet.planif[0].quand).toLocaleString()+'"></span>');
                //troll F2
                if(planet.troll) $(div).after('<div align="center" class="ligneico addjme"" style="left:'+$(div).attr('style').split('left:')[1].split(';')[0].trim()+';top:'+(parseInt($(div).attr('style').split('top:')[1].split('px;')[0].trim())+25)+'px;"><div style="color:white;border-color:red;background-color:red;">&#x26A0;&nbsp;Troll</div></div>');
                //add_astro
                $(div).append('<img class="addjme" data-onclick="'+$(div).find('img').first().data('onclick')+'" src="'+(planet.astros<=15?img_chiffre[planet.astros]:img_chiffre[16])+'" alt="'+planet.astros+'" style="margin-top:-150px;width:50%;height:50%;position:relative;">');
                //search critere
                //if(planet.astros<5) $(div).append('<img onclick="'+$(div).find('img').first().data('onclick')+'" src="../images/target.gif" alt="cible" style="margin-top:-150px;">');
                //a l'ajout des iframe j'ai changer l'attribut "onclick" par "data-onclick" pour surcharger le onclick, le hack pour le reactiver sans rechanger d'attribut :
                //$(div).find('img, span').off('click').on('click',function(e){ window.frames.fenetre.src = $(this).data('onclick'); });
                $(div).on('shown.bs.popover',function(){
                    $.each($(window.frames.lamap.document).find('.popover'),function() {
                        if($(this).find('iframe').length>0 && parseInt($(this).css('top').replace('px',''))<0){
                            $(this).children('.arrow').css('top',(parseInt($(this).css('top').replace('px',''))+200)+'px');
                            $(this).css('top','0');
                        }
                    });
                });
                $(div).popover({html:true,title:'',content:'<iframe width="200" height="400" onload="window.parent.postMessage(JSON.stringify({type:\'customiframe\',value:this.id}))" src="detail.php?x='+planet.x+'&y='+planet.y+'" id="ifrm_'+planet.nom+'" name="'+planet.nom+'"></iframe>',placement:"right"});
                $(div).find('img').popover({html:true,title:$(div).find('span.btn').first().text(),content:owner+'<br>'+tp,trigger:"hover",placement:"right"});
                //draggable code : triggers planetes
                $(div).find('img').each(function(i,n) { n.setAttribute('draggable',false); });
                if(planet.proprio==localStorage.playerName) {
                    $(div).get(0).setAttribute('draggable',true);
                    $(div).get(0).removeEventListener("dragstart",onDragStartPlanet);
                    $(div).get(0).addEventListener("dragstart",onDragStartPlanet);
                }
                $(div).get(0).removeEventListener("dragenter", onDragEnterPlanet);
                $(div).get(0).addEventListener("dragenter", onDragEnterPlanet);
                $(div).get(0).removeEventListener("dragover", onDragOverPlanet);
                $(div).get(0).addEventListener("dragover", onDragOverPlanet);
                $(div).get(0).removeEventListener("dragleave", onDragLeavePlanet);
                $(div).get(0).addEventListener("dragleave", onDragLeavePlanet);
                $(div).get(0).removeEventListener("drop", onDropPlanet);
                $(div).get(0).addEventListener("drop", onDropPlanet);
            }
            if(planet===undefined) planete_update($(div).find('img').first().attr('onclick').split('(\'')[1].split('\')')[0]).then((data)=>{custom_map_pl_s()});
            else custom_map_pl_s();
        }
        return oldimgsrc;
    }
    $("#custom_map").on('change',function() {
        if($('#lamap').length==0 || $("#lamap").contents().find('div.divplanete').length==0) $("#content div.col-md-9").empty().append('<div class="embed-responsive embed-responsive-4by3 col-lg-12 col-md-12 col-sm-12 col-xs-12"><iframe class="embed-responsive-item" id="lamap" name="lamap" style="width: 100%; margin: 0px; border: 0px; height: 887px;" src="map.php"></iframe></div>');
        if($(this).is(':checked')) set_stored('custommap',"1");
        else set_stored('custommap',"0");
        document.getElementById("lamap").src = "map.php";
    });
    $("#clear_modal").on('click',function() { $(".modal").each(function() { $(this).find('button[data-dismiss="modal"]').first().trigger('click'); }); });
    var ll=[];
    //--gen planete html
    function planete_maker() {
        let a = {
            x : '000',
            y : '000',
            nom: '',
            proprio : '',
            conflit:false,
            //etat : '',
            //couleur:'',
            astros : '',
            croiseurs:0,
            prod_astro: null,
            or:0,
            prod_or:false,
            etain:0,
            prod_etain:false,
            fer:0,
            prod_fer:false,
            vivres:0,
            prod_vivres:false,
            manuf:0,
            prod_manuf:false,
            cycle:'cycle X Heure',
            next_cycle:'dans X Heure',
            amb:null,
            navette:null,
            offre:null,
            pol:[],
            events:[],
            urgent:0,
            attaks:false,
            cibles:false,
            leaders:[],
            brouilleur:false,
            planif:[],
        };
        return a;
    };
    function gen_combat(v) {
        let planetes = get_stored('planetes');
        //on créé les joueurs qui ne sont pas encore stockés (ca devrait jamais arriver)
        let leaders = get_stored('leaders');
        if(planetes[v.source]) if(leaders.find(o=>o.player===planetes[v.source].proprio)===undefined && planetes[v.source].proprio) leaders.push({player:planetes[v.source].proprio,img:false,niv:false,sector:true,ally:(planetes[v.source].proprio===localStorage.playerName?null:false),leaders:[]});
        if(planetes[v.cible]) if(leaders.find(o=>o.player===planetes[v.cible].proprio)===undefined && planetes[v.cible].proprio) leaders.push({player:planetes[v.cible].proprio,img:false,niv:false,sector:true,ally:(planetes[v.cible].proprio===localStorage.playerName?null:false),leaders:[]});
        set_stored('leaders',leaders);
        //on retourne le tableau généré
        return '<table style="width:333px;font-size:smaller;"><tr style="height:20px;">'+
            '<td rowspan="5" style="height:100px;width:25%;"><img style="height:100px;width:80px;" src="'+(planetes[v.source]?(planetes[v.source].proprio=='Neutre'?'images/planetes/illustr/planete_2.jpg':(planetes[v.source].proprio=='Empire'?'images/planetes/illustr/planete_3.jpg':([false,undefined].includes(leaders.find(o=>o.player===planetes[v.source].proprio).img)?'../images/leaders/leader2_11.png':leaders.find(o=>o.player===planetes[v.source].proprio).img))):'https://upload.wikimedia.org/wikipedia/commons/a/af/Question_mark.png')+'"></td>'+
            '<td style="width:25%;">'+(planetes[v.source]?('<a style="color:lightgreen" href="detail.php?x='+planetes[v.source].x+'&y='+planetes[v.source].y+'" target="fenetre">'+planetes[v.source].nom+'</a>'):'Inconnu')+'</td>'+
            '<td rowspan="5" style="height:100px;width:25%;"><img style="height:100px;width:80px;" src="'+(planetes[v.cible]?(planetes[v.cible].proprio=='Neutre'?'images/planetes/illustr/planete_2.jpg':(planetes[v.cible].proprio=='Empire'?'images/planetes/illustr/planete_3.jpg':([false,undefined].includes(leaders.find(o=>o.player===planetes[v.cible].proprio).img)?'../images/leaders/leader2_11.png':leaders.find(o=>o.player===planetes[v.cible].proprio).img))):'https://upload.wikimedia.org/wikipedia/commons/a/af/Question_mark.png')+'"></td>'+
            '<td style="width:25%;">'+(planetes[v.cible]?'<a style="color:lightgreen" href="detail.php?x='+planetes[v.cible].x+'&y='+planetes[v.cible].y+'" target="fenetre">'+planetes[v.cible].nom+'</a>':'Inconnu')+'</td>'+
          '</tr><tr style="height:20px;">'+
            '<td><b>'+(planetes[v.source]?planetes[v.source].proprio:'')+'</b></td>'+
            '<td><b>'+(planetes[v.cible]?planetes[v.cible].proprio:'')+'</b></td>'+
          '</tr><tr style="height:20px;">'+
            '<td>'+(planetes[v.source]?(leaders.find(o=>o.player===planetes[v.source].proprio).niv?leaders.find(o=>o.player===planetes[v.source].proprio).niv:''):'')+'</td>'+
            '<td>'+(planetes[v.cible]?(leaders.find(o=>o.player===planetes[v.cible].proprio).niv?leaders.find(o=>o.player===planetes[v.cible].proprio).niv:''):'')+'</td>'+
          '</tr><tr style="height:20px;">'+
            '<td>'+(planetes[v.source] && planetes[v.source].attakdetail?planetes[v.source].attakdetail.split('<br>')[0]:'')+'</td>'+
            '<td>'+(planetes[v.cible]?'Troupes : '+planetes[v.cible].astros+(planetes[v.cible].croiseurs?' + '+planetes[v.cible].croiseurs+' Croiseurs':''):'')+'</td>'+
          '</tr><tr style="height:20px;">'+
            '<td>'+(planetes[v.source] && planetes[v.source].attakdetail?planetes[v.source].attakdetail.split('<br>')[1].split('contre')[0].trim():'')+'</td>'+
            '<td>'+(planetes[v.source] && planetes[v.source].attakdetail?'Renforts : '+planetes[v.source].attakdetail.split('<br>')[1].split('contre')[1].trim():'')+'</td>'+
          '</tr><tr><td colspan="4">'+(planetes[v.source] && planetes[v.source].attakdetail?planetes[v.source].attakdetail.split('<br>')[2]:'&nbsp;')+'</td>'+
          '</tr><tr><td colspan="4">'+(planetes[v.source]?/*(planetes[v.source].attakp?planetes[v.source].attakp:*/(planetes[v.source].attaks?planetes[v.source].attaks:(planetes[v.source].attakm?planetes[v.source].attakm:''))/*)*/:(planetes[v.cible]?/*planetes[v.cible].ciblep?planetes[v.cible].ciblep:(*/planetes[v.cible].cibles?planetes[v.cible].cibles:(planetes[v.cible].ciblem?planetes[v.cible].ciblem:'')/*)*/:''))+'</td></tr><tr><td colspan="4"><hr></td></tr></table>';
    }
    function make_combat() {
        let planetes = get_stored('planetes');
        let chasseurs=[];
        let proies=[];
        if(planetes.length >0) {
            $.each(planetes,function(y,planet){
                //pour panneau combats
                /*if(planet.attakp) chasseurs.push({ source:y, cible:planetes.find(o=>planet.attakp.includes(o.nom))?planetes.findIndex(o=>o.nom==(planet.attakp.includes('Transfert')?planet.attakp.split('Transfert ')[1].split(',')[0].trim():planet.attakp.split('Attaque ')[1].split(',')[0].trim())):false });
                else */if(planet.attaks) chasseurs.push({ source:y, cible:planetes.find(o=>planet.attaks.includes(o.nom))?planetes.findIndex(o=>o.nom==(planet.attaks.includes('Transfert ')?planet.attaks.split('Transfert ')[1].split(',')[0].trim():planet.attaks.split('Attaque ')[1].split(',')[0].trim())):false });
                else if(planet.attakm) chasseurs.push({ source:y, cible:planetes.find(o=>planet.attakm.includes(o.nom))?planetes.findIndex(o=>o.nom==(planet.attakm.includes('Transfert ')?planet.attakm.split('Transfert ')[1].split(',')[0].trim():planet.attakm.split('Attaque ')[1].split(',')[0].trim())):false });
                else {
                    planetes[y].attakdetail = false;
                    set_stored('planetes',planetes);
                }
                /*if(planet.ciblep) proies.push({source:planetes.find(o=>planet.ciblep.includes(o.nom))?planetes.findIndex(o=>o.nom===planet.ciblep.split('par ')[1].trim()):false, cible:y });
                else */if(planet.cibles) proies.push({source:planetes.find(o=>planet.cibles.includes(o.nom))?planetes.findIndex(o=>o.nom===planet.cibles.split('par ')[1].trim()):false, cible:y });
                else if(planet.ciblem) proies.push({source:planetes.find(o=>planet.ciblem.includes(o.nom))?planetes.findIndex(o=>o.nom===planet.ciblem.split('par ')[1].trim()):false, cible:y });
            });
        }
        let patk = '<div class="col-md-12"><table class="fight" id="inserttabfight">';
        let tatk = [];
        let cntpatk=0;
        if(chasseurs.length>0) $.each(chasseurs,function(i,v) {
            //patk += (cntpatk%2==1?'<td style="width:50px;"></td>':'<tr>')+'<td>'+gen_combat(v)+'</td>'+(cntpatk%2==1?'</tr>':'');
            tatk.push(gen_combat(v));
            cntpatk++;
            //if(chasseurs.filter(c=>c.source!=v.source && c.cible==v.cible).length==0 && proies.findIndex(o=>o.cible===v.cible) !== -1) proies.splice(proies.findIndex(o=>o.cible===v.cible),1);
             if(proies.findIndex(o=>o.cible==v.cible) !== -1) proies.splice(proies.findIndex(o=>o.cible===v.cible),1);
        });
        if(proies.length>0) $.each(proies,function(i,v){
            //patk += (cntpatk%2==1?'<td style="width:50px;"></td>':'<tr>')+'<td>'+gen_combat(v)+'</td>'+(cntpatk%2==1?'</tr>':'');
            //if(chasseurs.filter(c=>c.cible==v.source && c.source==v.source).length==0)
                tatk.push(gen_combat(v));
            cntpatk++;
        });
        //if(cntpatk%2==1) patk += '<td style="height:140px;"></td><td style="height:140px;"></td>';
        let TDbyTR=($("#content").width()-15)%333>=((Math.floor(($("#content").width()-15)/333)-1)*40)?Math.floor(($("#content").width()-15)/333):Math.floor(($("#content").width()-15)/333)-1;//Math.floor(($("#content").width()-15)/370)
        for(let z=0; z<tatk.length; z++) {
            if(z%TDbyTR==0) patk += '<tr>';
            patk += '<td style="vertical-align:top;">'+tatk[z]+'</td>';
            if(z%TDbyTR!=TDbyTR-1) patk += '<td style="width:40px;"></td>';
            if(z%TDbyTR==TDbyTR-1 || z==tatk.length) patk += '</tr>';
        }
        patk+='</table></div>';
        $("#inserttabfight").remove();
        $("#spec_content1").empty().html(patk);
        $("#badge-fight").text(cntpatk);
        rt_to_map();
    }
    function set_triggers_tabplan() {
        $('button.valid_offre').off('click').on('click',function() {
            let form = $(this).parent();
            passer_commande(get_stored('planetes').findIndex(o=>o.nom===$(this).data('nom')),true,{offre:$(form).find('select[name="offre"]').val(),demande:$(form).find('select[name="demande"]').val()});
        });
        $('a.annul_offre').off('click').on('click',function() {
            let planetes = get_stored('planetes');
            planetes.find(o=>o.nom===$(this).data('nom')).offre = false;
            set_stored('planetes',planetes);
            make_planetes($("#filtreplan").val());
        });
        $('button.valid_attak').off('click').on('click',function() {
            let form = $(this).parent();
            lancer_flotte(get_stored('planetes').findIndex(o=>o.nom===$(this).data('nom')),true,{cible:$(form).find('input[name="cible"]').val(),troupes:$(form).find('input[name="troupes"]').val()});
        });
        $('a.annul_attak').off('click').on('click',function() {
            $.ajax({
                url:'detail_ordre.php',
                type:'POST',
                data:{x:get_stored('planetes').find(o=>o.nom===$(this).data('nom')).x,y:get_stored('planetes').find(o=>o.nom===$(this).data('nom')).y,annuler:1},
                success:function(html){
                    if(debug) console.log('call detail_ordre.php - annulation');
                    let planetes = get_stored('planetes');
                    //planetes.find(o=>o.nom===$(this).data('nom')).attakp = false;
                    planetes.find(o=>o.nom===$(this).data('nom')).attakm = false;
                    planetes.find(o=>o.nom===$(this).data('nom')).attaks = false;
                    planetes.find(o=>o.nom===$(this).data('nom')).attakdetail = false;
                    set_stored('planetes',planetes);
                    make_planetes($("#filtreplan").val());
                    mnotify($(html).find('div.alert').get(0).className,$(html).find('div.alert').first().html(),5000);
                }
            });
        });
        $('button.don_planet').off('click').on('click',function() {
            if($(this).prev().val()=='') alert('choisis un bénéficiaire!');
            else donner_planete($(this).attr('id'),$(this).prev().val());
        });
    }
    function make_planetes(filtre=false) {
        let planetes = get_stored('planetes');
        alim_cible_select(true);
        let emp = 0; let empm = 0;
        let leaders = get_stored('leaders');
        let tp = '';
        if(planetes.length >0) {
            $.each(planetes,function(y,planet){
                if(planet.nom.includes('Empire')) {
                    emp++;
                    if(planet.proprio==localStorage.playerName) empm++;
                }
                if(!filtre || (planet.nom.includes(filtre) || planet.proprio.includes(filtre))) {//tableau stats planetes
                    let news = '', pol = '', lead = '', nbastrslct = '';
                    if(planet.events.length > 0) $.each(planet.events,function(w,newo) {
                        news+='<img src="'+newo.ico+'" style="width:20px;">'+newo.msg+(newo.msg=='Un brouilleur est ici' && leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,9)=='Fondation'?'<a class="btn btn-alt btn-xs" href="detail_ordre.php?x=470&y=466&champs=1">activer amplificateur</a>':'')+(planet.events.length!=w?'<br>':'');
                    });
                    if(planet.pol.length > 0) $.each(planet.pol,function(i,o) { pol += o.pol+'('+o.player+')<br>'; });
                    if(planet.leaders && planet.leaders.length>0) $.each(planet.leaders,function(i,o) {
                        if(o.split('(')[1].split(')')[0].trim() != localStorage.playerName) lead += '<img src="images/picto/leader_'+(planet.pol.find(v=>v.player===o.split('(')[1].split(')')[0])===undefined?'politique':(planet.pol.find(v=>v.player===o.split('(')[1].split(')')[0]).pol.replace('%','')<100?'politique':'inactif'))+'.png" width="20" title="'+o+'" alt="">';
                        //else TODO: pour mes leaders, prevoir l'icone images/picto/working.png dans le cas d'une contruction (brouilleur,ambassade) ou l'ico images/picto/assassin1.png dans le cas d'un assassinat, ...
                    });
                    let opt = {offre:'', demande:''};
                    $.each(['offre','demande'],function(i0,type) {
                        $.each(['or','etain','fer','vivres','manuf'],function(i1,prod) {
                            if(!(type=='demande' && i1==0)) for(let o=1;o<=(type=='offre'?(((planet.proprio=='Neutre' || planet.proprio == 'Empire') && leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,8)=='Marchand')?(planet[prod]<7?planet[prod]:7):(planet[prod]<25?planet[prod]:25)):5);o++) opt[type]+='<option value="'+prod+'-'+o+'">'+type+' '+o+' '+prod+'</option>';
                        });
                    });
                    tp += '<tr style="'+(planet.proprio==localStorage.playerName?'border:solid 5px green;':'')+'">';
                    tp += '<td style="color:black;background-color:'+(planet.urgent==3?'red':(planet.urgent==2?'orange':(planet.urgent==1?'yellow':'green')))+'">'+planet.x+' / '+planet.y+'</td>';
                    for(let i=1; i<=planet.astros; i++) { nbastrslct+='<option value="'+i+'">'+i+'</option>'; }
                    tp += '<td style="text-align:center;background-color:'+(planet.couleur?planet.couleur:'inherit')+'"><a style="color:lightgreen;" href="detail.php?x='+planet.x+'&y='+planet.y+'" target="fenetre">'+planet.nom+'</a>'+(planet.conflit?'<br><img style="height:20px;width:20px;" src="../images/explode2.gif" alt="">Sous attaque !':((planet.cibles||planet.ciblem/*||planet.ciblep*/?('<br><img style="height:20px;width:20px;" src="images/picto/empire.png" alt="">'+(planet.cibles||planet.ciblem/*||planet.ciblep*/)):'')+(planet.proprio==localStorage.playerName||(/*TODO: condition pour la sf ?*/false)?(planet.attaks||planet.attakm/*||planet.attakp*/?('<br><img style="height:20px;width:20px;" src="images/picto/colonisation.png" alt="">'+(planet.attaks||planet.attakm/*||planet.attakp*/)+'<button class="btn anul btn-alt btn-xs annul_attak" data-nom="'+planet.nom+'">Annuler</button>'):'<br><form><select class="btn btn-xs" name="troupes">'+nbastrslct+'</select><select class="btn btn-xs" name="cible">'+cibleslct+'</select><button class="btn agit btn-alt btn-xs valid_attak" data-nom="'+planet.nom+'"><img src="images/picto/empire.png" width="15"></button></form>'):'')))+'</td>';
                    let form_don = '<br><select class="btn btn-xs" name="benef"><option value="">choisir</option>';
                    $.each(leaders,function(i,l) {
                        if(l.sector && l.ally && l.player!=localStorage.playerName) form_don += '<option value="'+l.player+'">'+l.player+'</option>';
                    });
                    form_don += '</select><button class="btn agit btn-alt btn-xs don_planet" id="'+y+'"><img src="images/picto/present.png" width="15"></button>';
                    let curle=get_stored('leaders').find(o=>o.player==planet.proprio);
                    tp += '<td style="'+(planet.deviation!==false?(planet.deviation!=planet.proprio?'background-color:orange;color:red;':'style="background-color:green;'):'')+'"><a target="fenetre" href="fiche.php?joueur='+planet.proprio+'" style="color:lightgreen;">'+planet.proprio+'</a> '+(!curle || !curle.niv?'':(curle.niv.substr(0,1).toUpperCase()+(!Number.isNaN(parseInt(curle.niv.substr(-1)))?curle.niv.substr(-1):'1')+(curle.niv.includes('Niv3')?' (<a style="color:lightgreen;" href="confrerie.php?confrerie='+curle.conf+'" target="fenetre">'+curle.conf.toUpperCase()+'</a>)':'')))+(planet.deviation!==false?(planet.deviation!=planet.proprio?' ('+planet.deviation+')':''):'')+(leaders.find(o=>o.player==planet.proprio)===undefined?'<br><span style="color:black;">Ennemi</span>':leaders.find(o=>o.player==planet.proprio).ally?'<br><img src="../images/alliance.gif" alt="alliance"><spans style="color:green;">Allié</span>':(leaders.find(o=>o.player==planet.proprio).ally==null?(planet.deviation!==false?(planet.deviation!=planet.proprio?'<a class="btn agit btn-alt btn-xs" target="fenetre" href="alliance.php?cadeau='+planet.x+'-'+planet.y+'-'+planet.nom+'&benef='+planet.deviation+'">Attribuer</a>':''):(leaders.find(o=>o.player==localStorage.playerName).niv.includes('Empire') && planet.nom.includes('Empire')?'<span class="btn agit btn-info btn-xs renomage" style="display:none;" data-href="detail_ordre.php?renomme=1&x='+planet.x+'&y='+planet.y+'">Renommer planète</span>':form_don)):'<br><span style="color:red;">Ennemi</span>'))+'</td>';
                    tp += '<td style="text-align:center;">'+planet.astros+'</td><td style="border:0.5px solid rgba(255,255,255,0.3);padding:2px;">'+(planet.prod_or?'+':'')+planet.or+'</td><td style="border:0.5px solid rgba(255,255,255,0.3);padding:2px;">'+(planet.prod_etain?'+':'')+planet.etain+'</td><td style="border:0.5px solid rgba(255,255,255,0.3);padding:2px;">'+(planet.prod_fer?'+':'')+planet.fer+'</td><td style="border:0.5px solid rgba(255,255,255,0.3);padding:2px;">'+(planet.prod_vivres?'+':'')+planet.vivres+'</td><td style="border:0.5px solid rgba(255,255,255,0.3);padding:2px;">'+(planet.prod_manuf?'+':'')+planet.manuf+'</td><td>'+lead+'</td><td>'+pol+'</td>';
                    tp += '<td>'+(planet.amb?'<img src="images/picto/ambassade.png" width="15">'+(typeof planet.amb == 'string'?planet.amb:''):'')+'</td><td><div class="label">'+planet.etat+'</div><br><img src="../images/constructing.gif" width="25" title="Heures avant fin du cycle de production">'+planet.next_cycle+' / '+planet.cycle+(planet.offre?'<br><img src="../images/commerce_mini.gif" height="16" width="16" title="Offre commerciale publiée">'+planet.offre+(planet.proprio==localStorage.playerName?'<a class="annul_offre btn anul btn-alt btn-xs" data-nom="'+planet.nom+'" href="detail.php?x='+planet.x+'&y='+planet.y+'&annuler_offre=1" target="fenetre">Annuler</a>':''):(planet.proprio==localStorage.playerName || ((planet.proprio=='Neutre' || planet.proprio == 'Empire') && leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,8)=='Marchand')?'<form><select class="btn btn-xs" name="offre">'+opt.offre+'</select><select class="btn btn-xs" name="demande">'+opt.demande+'</select><button class="btn agit btn-alt btn-xs valid_offre" type="button" data-nom="'+planet.nom+'"><img src="images/picto/offre.png" width="15"></button></form>':''))+'</td><td><div class="overflow unvisiblescroll" style="max-height:60px;overflow-y:auto;">'+news+'</div></td></tr>';
                }
            });
        }
        $(".tablespec tbody").html(tp);//tableau stats planetes
        $('.tablespec select[name="cible"]').on('change',function() { if($(this).val()=='') $(this).next().find('img').attr('src','images/picto/empire.png'); else if($(this).find('option:selected').data('owner')==localStorage.playerName) $(this).next().find('img').attr('src','images/picto/transfert.png'); else $(this).next().find('img').attr('src','images/picto/interception.png'); });
        if(leaders.find(o=>o.player==localStorage.playerName) && leaders.find(o=>o.player==localStorage.playerName).niv && leaders.find(o=>o.player==localStorage.playerName).niv.includes('Empire Niv2') && empm>=125) {
            $("#spec_content2").find('.renomage').css('display','block');
            $("#spec_content2").find('.renomage').append(' ('+(empm-125)+'restant/'+(emp-125)+')');
            $("#spec_content2").find('.renomage').off('click').on('click',function() { if(confirm('On est sur de renommer ?')) document.getElementById('fenetre').src = $(this).data('href'); });
        }
        //$("#spec_content2 div.overflow").css('overflow-y','auto');//.addClass('unvisiblescroll');
        //bouton qui ouvre le tableau des planetes a la place de la map
        $("#openTabSpec").off('click').on('click',function() {
            set_stored('ecranspec_actif','1');
            if($('#tablespecplan').length==0) window.location.href = window.location.origin+'/jeu/index.php';
            else {
                //$("#tablespecplan .tablespec>tbody").html($("#spec_content2 .tablespec>tbody").get(0).innerHTML);
                $("span.drawer-close").trigger('click');
                $('#tablespecplan:not(:visible), #lamap:visible, #galaxie:visible, #arrleft, #arrright').toggle();
            }
        });
        //maintenir et maj de l'ecran tableau stat
        if((exist_for_player('ecranspec_actif')?get_stored('ecranspec_actif')=='1':false)) $("#openTabSpec").trigger('click');
        $(".tablespec").tablesorter();
        set_triggers_tabplan();
        rt_to_map();
        //return tp;
    }
    $.each($(".valid_search"),function() { $(this).on('click',function() { make_planetes($('#filtreplan').val()); }); });
    $.each($(".filtreplan"), function() { $(this).bind('blur keyup',function(e) { if (e.type === 'blur' || e.keyCode === 13) make_planetes($(this).val()); }); });
    $("#filtreplantab").on('change',function(e) { $("#filtreplan").val($(this).val()); });
    $("#close_filtreplantab").on('click',function() { set_stored('ecranspec_actif','0'); $("#lamap, #tablespecplan, #arrleft, #arrright").toggle(); });
    function sort_news(news){
        let combat = ["interception.png","cible.png","transfert.png","renfort.png","combat_gagne.png"];
        let leader = ["leader_inactif.png","leader.png","working.png","leader_politique.png","assassin1.png","assassin2.png","mort.png"];
        let cycle = ["cycle.png","offre.png","vivres.png","manuf.png","mecontent.png",];
        let politique = ["popu.png"];
        return politique.includes(news.ico.split('/')[2])?'Politique':(combat.includes(news.ico.split('/')[2])?'Combat':(leader.includes(news.ico.split('/')[2])?'Leader':(cycle.includes(news.ico.split('/')[2])?'Cycle':'Divers')));
    }
    function gen_timeline_planete(planet) {
        if(debug) console.log('gen_stat '+planet.nom);
        let html = '<div class="timeline-container"><div>';
        let current=Date.parse('25 Dec 2022 00:12:00 GMT');
        $.each(planet.events.reverse(),function(i,v) {
            if(dateDiff(v.date,current).day!=0) {
                html+= '</div><div class="timeline-label"><span class="label label-info arrowed-in-right label-lg"><b>'+new Date(v.date).toLocaleDateString('fr-FR',{dateStyle:'medium'})+'</b></span></div><div class="timeline-items">';
                current = v.date;
            }
            let title = sort_news(v);
            html += '<div class="timeline-item clearfix"><div class="timeline-info"><img alt="" src="'+v.ico+'"><span class="label label-primary label-sm">'+new Date(v.date).toLocaleTimeString()+'</span></div><div class="widget-box widget-color-'+(title=='Combat'?'red':(title=='Leader'?'green':'dark'))+'"><div class="widget-header widget-header-small"><h5 class="widget-title smaller">'+title+'</h5></div><div class="widget-body"><div class="widget-main">'+v.msg+'</div></div></div></div>';
        });
        return html+"</div></div><div id='firstchart'></div>";
    }
    function gen_ressource_chart(type,planId,nbj) {
        let res;
        if(type=="all") res = ["astros","or","etain","fer","vivres","manuf"];
        else res = type;
        let planet = get_stored('planetes')[planId];
        let col = ["red","yellow","aqua","darkblue","purple","darkgreen"]
        let obj = {};
        let ticks = [];
        var ressources = new google.charts.Line(document.getElementById('ressources_chart'));
        var data_ress = [];
        var dt_ressources = new google.visualization.DataTable();
        dt_ressources.addColumn({ type: 'datetime', id: 'Date' });
        $.each(res,function(i,o){
            obj[o]={};
            dt_ressources.addColumn({ type: 'number', id: o });
            obj[o].val = Number(planet[o]);
            obj[o].chart = new google.visualization.LineChart(document.getElementById(o+'_chart'));
            obj[o].data = [];
            obj[o].dataTab = new google.visualization.DataTable();
            obj[o].dataTab.addColumn({type: 'datetime', id: 'Date' });
            obj[o].dataTab.addColumn({type: 'number', id: 'Qte' });
            obj[o].dataTab.addColumn({type: 'string', role: 'style' });
            if(planet.offre && [planet.offre.split(' ')[2],planet.offre.split(' ')[5]].includes(o)) {
                obj[o].dataTab.addColumn({type:'number', role:'interval'});
                obj[o].dataTab.addColumn({type:'number', role:'interval'});
                obj[o].dataTab.addColumn({type:'string', role:'annotation'});
                obj[o].dataTab.addColumn({type:'string', role:'annotationText'});
                obj[o].dataTab.addColumn({type:'boolean',role:'certainty'});
            }
        });
        let date_deb = Date.now();
        ticks.push(new Date(date_deb));
        let date_fin = Date.now() + (nbj*24*60*60*1000);
        //fin de cycle courant
        $.each(res,function(i,o) {
            let row = [];
            let calc = ["fer","etain"].includes(o)?(obj.etain.val>0&&obj.fer.val>0?(planet['prod_'+o]?obj[o].val:obj[o].val--):(planet['prod_'+o]?obj[o].val++:obj[o].val)):(["vivres","manuf"].includes(o)?(["Neutre","Empire"].includes(planet.proprio)?(planet['prod_'+o]?obj[o].val++:obj[o].val):(planet['prod_'+o]?obj[o].val:obj[o].val--)):(o=="astros"?(obj[o].val>12?obj[o].val--:(obj.etain.val>0&&obj.fer.val>0&&obj[o].val<12?obj[o].val++:obj[o].val)):(planet['prod_'+o]?obj[o].val++:obj[o].val)));
            let calc_offre_max = calc+(planet.offre?parseInt(planet.offre.split(' ')[4])-(["vivres","manuf"].includes(o) && calc<=0?1 :0):0);//TODO: faire pareil pour les ["etain","fer","astros"], ce qui va demander de stocker les valeurs et changer d'autres charts...
            if(planet.offre && [planet.offre.split(' ')[2],planet.offre.split(' ')[5]].includes(o)) row = [
                new Date(date_deb),
                calc<0?0:calc,
                'color : '+col[i],
                planet.offre.split(' ')[2]==o?(calc-parseInt(planet.offre.split(' ')[1])<0?0:calc-parseInt(planet.offre.split(' ')[1])):calc<0?0:calc,
                planet.offre.split(' ')[5]==o?calc_offre_max<0?0:calc_offre_max:calc<0?0:calc,
                'ⓘ',
                planet.offre.split(' ')[2]==o?"-"+planet.offre.split(' ')[1]+" si offre acceptée":"+"+planet.offre.split(' ')[4]+" si offre acceptée",
                true
            ];
            else row = [new Date(date_deb),calc<0?0:calc,'color: '+col[i]];
            obj[o].data.push(row);
        });
        data_ress.push([new Date(date_deb),obj.astros.val,obj.or.val,obj.etain.val,obj.fer.val,obj.vivres.val,obj.manuf.val]);
        date_deb += parseInt(planet.next_cycle.split(' ')[1])*60*60*1000;
        ticks.push(new Date(date_deb));
        //cycles suivants
        let cnt_cycle = 1;
        while(date_deb < date_fin) {
            $.each(res,function(i,o) {
                //if(parseInt(obj[o].val)<=0) obj[o].val=0;
                let row = [];
                let calc = ["fer","etain"].includes(o)?(obj.etain.val>0&&obj.fer.val>0?(planet['prod_'+o]?obj[o].val:obj[o].val--):(planet['prod_'+o]?obj[o].val++:obj[o].val)):(["vivres","manuf"].includes(o)?(["Neutre","Empire"].includes(planet.proprio)?(planet['prod_'+o]?obj[o].val++:obj[o].val):(planet['prod_'+o]?obj[o].val:obj[o].val--)):(o=="astros"?(obj[o].val>12?obj[o].val--:(obj.etain.val>0&&obj.fer.val>0&&obj[o].val<12?obj[o].val++:obj[o].val)):(planet['prod_'+o]?obj[o].val++:obj[o].val)));
                let calc_offre_max = calc+(planet.offre?parseInt(planet.offre.split(' ')[4])-(["vivres","manuf"].includes(o) && calc<=0?1 :0):0);//TODO: faire pareil pour les ["etain","fer","astros"], ce qui va demander de stocker les valeurs et changer d'autres charts...
                if(planet.offre && [planet.offre.split(' ')[2],planet.offre.split(' ')[5]].includes(o)) row = [
                    new Date(date_deb),
                    calc<0?0:calc,
                    'color : '+col[i],
                    planet.offre.split(' ')[2]==o?(calc-parseInt(planet.offre.split(' ')[1]))<0?0:(calc-parseInt(planet.offre.split(' ')[1])):calc<0?0:calc,
                    planet.offre.split(' ')[5]==o?calc_offre_max<0?0:calc_offre_max:calc<0?0:calc,
                    'ⓘ',
                    planet.offre.split(' ')[2]==o?"-"+planet.offre.split(' ')[1]+" si offre acceptée":"+"+planet.offre.split(' ')[4]+" si offre acceptée",
                    true
                ];
                else row = [new Date(date_deb),calc<0?0:calc,'color: '+col[i]];
                obj[o].data.push(row);
            });
            data_ress.push([new Date(date_deb),obj.astros.val,obj.or.val,obj.etain.val,obj.fer.val,obj.vivres.val,obj.manuf.val]);
            date_deb += parseInt(planet.cycle.split(' ')[1])*60*60*1000;
            ticks.push(new Date(date_deb));
            cnt_cycle++;
        }
        ticks.push(new Date(date_fin));
        //var datares = google.visualization.arrayToDataTable(arrayres);
        dt_ressources.addRows(data_ress);
        var opt_pour_tous = {
            chart: {},
            width: 390,
            height: 200,
            hAxis: {
                format: 'dd/MM/yy',
                gridlines: { units: { hours: { interval : '12' } } },
                ticks: ticks,
                textStyle:{ color: '#4a667a', fontSize: 10, bold: false, italic: false}
            },
            vAxis: {
                gridlines: {color: 'none'},
                //{format: 'percent'}
                minValue: 0,
                textStyle: {color: '#4a667a', fontSize: 10, bold: false, italic: false },
            },
            crosshair: { trigger: 'both', selected: { color: 'red'} },
            pointSize: 5,
            pointShape: 'square',
            legend: { position: 'none' },
            animation: { duration: 3000, startup: true},
            backgroundColor: '#24303a',
            chartArea: { backgroundColor: '#1e2730', width:'80%', height:'80%' },
            lineWidth: 2,
            selectionMode: 'multiple',

        };
        var option_gen = {
            chart: { title: 'Prévision Stock Ressources' },
            colors: col,
        };
        if(planet.offre) option_gen.chart.subtitle = planet.offre;
        ressources.draw(dt_ressources,google.charts.Line.convertOptions({...opt_pour_tous,...option_gen}));
        $.each(res,function(i,o){
            let option_spe = {...opt_pour_tous,...{chart : { title: 'Prévision stock '+o }, colors: [col[i]], }};
            if(planet.offre && [planet.offre.split(' ')[2],planet.offre.split(' ')[5]].includes(o)) option_spe.chart.subtitle = planet.offre;
            obj[o].dataTab.addRows(obj[o].data);
            obj[o].chart.draw(obj[o].dataTab,google.charts.Line.convertOptions(option_spe));
        });
    }
    function gen_timeline_chart(planId) {
        let planet = get_stored('planetes')[planId];
        var timeline = new google.visualization.Timeline(document.getElementById('timeline_chart'));
        var dt_timeline = new google.visualization.DataTable();
        dt_timeline.addColumn({ type: 'string', id: 'Type' });
        dt_timeline.addColumn({ type: 'string', id: 'Message' });
        dt_timeline.addColumn({ type: 'datetime', id: 'Start' });
        dt_timeline.addColumn({ type: 'datetime', id: 'End' });
        if(planet.events!=undefined && planet.events.length>0) $.each(planet.events,function(i,v) { dt_timeline.addRow([sort_news(v),v.msg,new Date(v.date),new Date(["Combat","Leader","Politique"].includes(sort_news(v))&&v.date_last!=undefined?v.date_last:(v.date+1000*60*5))]); });
        let opt= {
            height: 200,
            width:1500,
            timeline: {
                groupByRowLabel: true,
                rowLabelStyle: { color: 'gray', fontSize: 10, bold: false, italic: false },
                showBarLabels: false,
            },
            backgroundColor: '#24303a',
            chartArea: { backgroundColor: '#1e2730', width:'80%', height:'80%' },
            hAxis: {
                format: 'dd/MM HH:mm',
                textColor: 'white',
                //gridlines: { units: { hours: { interval : '12' } } },
                //textStyle:{ color: 'white', fontSize: 10, bold: false, italic: false}
            }
        };
        timeline.draw(dt_timeline,opt);
    }
    function gen_politique_chart(planId,nbj){
        let planet = get_stored('planetes')[planId];
        let data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', '%_ss_offre');
        data.addColumn('string', 'title_ss_offre');
        data.addColumn('string', 'text_ss_offre');
        let offre={
            is:planet.offre && (["vivres","manuf"].includes(planet.offre.split(' ')[2]) || ["vivres","manuf"].includes(planet.offre.split(' ')[5])),
            msg_cur:0,
            pol_cur: planet.pol.find(o=>o.player==localStorage.playerName)!=undefined?parseInt(planet.pol.find(o=>o.player==localStorage.playerName).pol.replace('%','')):0
        };
        if(offre.is) {
            data.addColumn('number', '%_av_offre');
            data.addColumn('string', 'title_av_offre');
            data.addColumn('string', 'text_av_offre');
        }
        function gen_line(d1,d2) {
            let res=[];
            if(offre.is) {
                if(d2==undefined) res = d1.concat([undefined,undefined,undefined]);
                else res = d1.concat(d2);
            }else res = d1;
            return res;
        }
        let lines =[];
        //passée
        let pol = ["images/picto/popu.png","images/picto/mecontent.png"];
        let news = planet.events.filter(o=> pol.includes(o.ico)).sort(function(a,b){ a.date < b.date ? -1 : 1});
        $.each(news,function(i,n) { lines.push(gen_line([new Date(n.date),n.ico.includes('popu')?parseInt(n.msg.split(':')[1].replace('%','').trim()):0,n.ico.split('/')[2].replace('.png',''),n.msg])); });
        //actuelle
        let date_cur = Date.now();
        let pol_cur = planet.pol.find(o=>o.player==localStorage.playerName)!=undefined?parseInt(planet.pol.find(o=>o.player==localStorage.playerName).pol.replace('%','')):0;
        lines.push(gen_line([new Date(date_cur),pol_cur,"maintenant","politique actuelle"]));
        //prochaine
        let futur_pol = [];
        if(planet.leaders.filter(o=>o.includes(localStorage.playerName)).length>0) {
            let mylead = [];
            $.each(planet.leaders.filter(o=>o.includes(localStorage.playerName)),function(i,l){
                let lead = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(o=>o.nom==l.split(' (')[0].trim());
                let elem;
                $("div.s-widget").eq(1).find('a[href^=""]').each(function() { if($(this).text().trim()==lead.nom) elem = $(this).parents('div.row'); });
                if(lead.activite.includes('Politique')) mylead.push($(elem).find('.frontflip').first().text().split('dans ')[1]);
            });
            if(mylead.length>0) $.each(mylead,function(i,v) {
                let timep = (v.includes('h ')?parseInt(v.split('reste ')[1].split('h ').trim())*60:0)+(v.includes('h ')?parseInt(v.split('h ')[1].split('min')[0].trim()):parseInt(v.split('reste ')[1].split('min')[0].trim()));
                futur_pol.push(date_cur+timep*60*1000);
            });
        }
        let manuf_cur = planet.prod_manuf;
        let vivres_cur = planet.prod_vivres;
        date_cur += parseInt(planet.next_cycle.split(' ')[1])*60*60*1000;
        let msg_cur=0;
        if(planet.proprio==localStorage.playerName) {
            if(!planet.prod_vivres) vivres_cur--;
            if(!planet.prod_manuf) manuf_cur--;
            if(offre.is) {
                if(["vivres","manuf"].includes(planet.offre.split(' ')[2])) offre[planet.offre.split(' ')[2]+"-cur"] = (planet.offre.split(' ')[2]=="vivres"?vivres_cur:manuf_cur)-parseInt(planet.offre.split(' ')[1]);
                if(["vivres","manuf"].includes(planet.offre.split(' ')[5])) offre[planet.offre.split(' ')[5]+"_cur"] = (planet.offre.split(' ')[5]=="vivres"?vivres_cur:manuf_cur)+parseInt(planet.offre.split(' ')[4]);
            }
            if(vivres_cur==0) msg_cur-=10;
            if(manuf_cur==0) msg_cur-=10;
            if(offre.vivres_cur==0) offre.msg_cur-=10;
            if(offre.manuf_cur==0) offre.msg_cur-=10;
            $.each(futur_pol,function(i,f){ if(date_cur>futur_pol) { msg_cur+=10; offre.msg_cur+=10; futur_pol.splice(i,1); } });
            lines.push(gen_line([new Date(date_cur),pol_cur+msg_cur<0?pol_cur=0:pol_cur+=msg_cur,"fin de cycle","politique "+msg_cur+"%"],[offre.pol_cur+offre.msg_cur<0?offre.pol_cur=0:offre.pol_cur+=offre.msg_cur,"fin de cycle","politique "+offre.msg_cur+"%"]));
        }else {
            $.each(futur_pol,function(i,f){ if(date_cur>futur_pol) { msg_cur+=10; offre.msg_cur+=10; futur_pol.splice(i,1); } });
            lines.push(gen_line([new Date(date_cur),pol_cur<0?pol_cur=0:pol_cur,"fin de cycle",msg_cur==0?"pas de changement":"politique "+msg_cur+"%"]));
        }
        //a venir
        let date_fin = Date.now() + (nbj*24*60*60*1000);
        while(date_cur < date_fin) {
            msg_cur=0;
            offre.msg_cur=0;
            if(planet.proprio==localStorage.playerName) {
                if(!planet.prod_vivres) {
                    vivres_cur--;
                    if(offre.is) offre.vivres_cur--;
                }
                if(!planet.prod_manuf) {
                    manuf_cur--;
                    if(offre.is) offre.manuf_cur--;
                }
                if(vivres_cur==0) msg_cur-=10;
                if(manuf_cur==0) msg_cur-=10;
                if(offre.vivres_cur==0) offre.msg_cur-=10;
                if(offre.manuf_cur==0) offre.msg_cur-=10;
                $.each(futur_pol,function(i,f){ if(date_cur>futur_pol) { msg_cur+=10; offre.msg_cur+=10; futur_pol.splice(i,1); } });
                lines.push(gen_line([new Date(date_cur),pol_cur+msg_cur<0?pol_cur=0:pol_cur+=msg_cur,"fin de cycle","politique "+msg_cur+"%"],[offre.pol_cur+offre.msg_cur<0?offre.pol_cur=0:offre.pol_cur+=offre.msg_cur,"fin de cycle","politique "+offre.msg_cur+"%"]));
            }else {
                $.each(futur_pol,function(i,f){ if(date_cur>futur_pol) { msg_cur+=10; offre.msg_cur+=10; futur_pol.splice(i,1); } });
                lines.push(gen_line([new Date(date_cur),pol_cur<0?pol_cur=0:pol_cur,"fin de cycle",msg_cur==0?"pas de changement":"politique "+msg_cur+"%"]));
            }
            date_cur += parseInt(planet.cycle.split(' ')[1])*60*60*1000;
        }
        data.addRows(lines);
        let politique = new google.visualization.AnnotationChart(document.getElementById('politique_chart'));
        let options = {
            displayAnnotations: true,
            width: 900,
            height: 450,
        };
        politique.draw(data, options);
    }
    //init googlechart api
    function drawCharts(planId,nbj) {
        gen_timeline_chart(planId);//timeline
        gen_ressource_chart("all",planId,nbj);//ressources
        gen_politique_chart(planId,nbj);//politique
    }
    function init_googlechart(planId,nbj) {
        google.charts.load("current", {packages:["corechart","line","timeline","annotationchart"],language:'fr'});
        google.charts.setOnLoadCallback(function() { drawCharts(planId,nbj); });
    }
    //add modals containers
    function gen_modal_chart(planId) {
        let planet = get_stored('planetes')[planId];
        let res = ["politique","astros","etain","fer","ressources","or","vivres","manuf","timeline"];
        let x = 45,y = 50,cnt = 0;
        $("div[id^='modal-stat']").remove();
        $.each(res,function(i,type) {
            $('body').append('<div class="modal modal-content" id="modal-stat_'+type+'" style="width:'+(type=='timeline'?'1500':'400')+'px;height:240px;overflow:hidden;resize:both;position:absolute;top:'+(cnt%4>0?y:(cnt==0?y:(y+=240)))+'px;left:'+(cnt%4>0?(cnt==0?x:(x+=400)):(cnt==0?x:(x=45)))+'px;border:2px solid white;">'+
                '<div class="modal-header" style="width:100%;height:40px;" id="modal-stat_'+type+'header"><h3 class="modal-title" style="display:block;text-align:center;width:90%;font-size:medium;font-weight:bolder;">'+
                    '<span style="color:palegreen;">'+planet.nom+' ('+planet.proprio+')</span>&nbsp;&nbsp;&nbsp;<span style="color:steelblue;">'+type+'</span></h3>'+
                    '<input type="hidden" name="oldheight"><button class="close minify" style="position:absolute;top:10px;right:40px;"><i class="fa fa-minus"></i></button><button class="close" style="position:absolute;top:10px;right:10px;" data-dismiss="modal"><span>&times;</span></button></div>'+
                '<div class="modal-body" id="'+type+'_chart" style="width:100%;height:90%;overflow:auto;color:black;background:rgba(0, 0, 0, 0.9);padding:0;"></div></div>');
            cnt++;
            $("#modal-stat_"+type).modal({backdrop:false});
            dragElement(document.getElementById('modal-stat_'+type));
            $("#modal-stat_"+type).on('hide.bs.modal',function() { $("#modal-stat_"+type).remove(); });
            $("#modal-stat_"+type+" .minify").off('click').on('click',function(){
                if($(this).find('i').first().hasClass('fa-plus')) {
                    $(this).parents('div.modal-content').css('height',$(this).prev().val()).css('overflow','auto').css('resize','both');
                    $(this).find('i').first().removeClass('fa-plus').addClass('fa-minus');
                }else {
                    //$(this).parents('div.modal').first().css('z-index','100');
                    $(this).prev().val($(this).parents('div.modal-content').css('height'));
                    $(this).parents('div.modal-content').css('height','40px').css('overflow','hidden').css('resize','none');
                    $(this).find('i').first().removeClass('fa-minus').addClass('fa-plus');
                }
            });
        });
        $.each(document.getElementsByClassName('modal-content'),function(i,v) {
            v.addEventListener('pointerenter',(event)=>{ this.style.zIndex = 1200; });
            v.addEventListener('pointerleave',(event)=>{ this.style.zIndex = 200; });
        });
    }
    //launch global charts generation
    function stat_plan(planId,nbj=7){
        init_googlechart(planId,nbj);
        gen_modal_chart(planId);
    }
    function urgence(obj0) {
        if(obj0===undefined) return 0;
        let degre_urg = 0;//Tout va bien (par defaut)
        let pol = obj0.pol.find(o=>o.player === localStorage.playerName)?parseInt(obj0.pol.find(o=>o.player === localStorage.playerName).pol.replace('%','').trim()):0;
        if(obj0.proprio == localStorage.playerName && ((!obj0.prod_vivres && obj0.vivres<3) || (!obj0.prod_manuf && obj0.manuf<3))) {
            degre_urg = 1;//3eme niveau danger
            if((!obj0.prod_vivres && obj0.vivres==0) || (!obj0.prod_manuf && obj0.manuf==0)) {
                if(pol >= ((parseInt(!obj0.prod_vivres && obj0.vivres==0)+parseInt(!obj0.prod_manuf && obj0.manuf==0))*10)) degre_urg = 2;//2eme niveau danger : il manque un des deux ou les deux produits de 1ere necessite mais la pol suffira pour cette fois
                else degre_urg = 3;//1er niveau danger : il manque un des deux ou les deux produits de 1ere necessite et la pol est insuffisante
            }
        }
        return degre_urg;
    }
    function get_Planete(x,y,json) {
        if(debug) console.log('merge get '+$(json).find("#info h3").first().text().split(' ')[1].trim());
        let pol = [];
        $(json).find("#pol table.table tr").each(function(i,v) { pol.push({player: $(v).find('td').eq(0).find('b').text().trim(), pol: $(v).find('td').eq(1).find('font').text().replace('.0','')}); });
        let event = [];
        let ruff = $(json).find('#info').html().split('ments');//les evenements de l'ecran planetes
        if(ruff.length>1) $.each(ruff[1].split('<br>'),function(j,w) {
            if($(w).find('img').length>0 && $(w).find('img').first().attr('src') !== undefined) event.push({ico:$(w).find('img').first().attr('src'),msg:$(w).find('img').remove().text().replaceAll('"',''),date:Date.now()});
        });
        let amb=null;
        if($(json).find('#pol').find('img[src="images/picto/embassy.png"]').length>0) {
            amb = true;
            $.each($(json).find('#pol').get(0).childNodes,function(i,v) { if(v.nodeType==1 && v.src == window.location.origin+"/jeu/images/picto/embassy.png" && $(json).find('#pol').get(0).childNodes[i+1].nodeName=='A' && $(json).find('#pol').get(0).childNodes[i+1].innerText.includes('ambassade')) amb = $(json).find('#pol').get(0).childNodes[i+1].innerText.trim().split(' ')[1]; });
        }
        /*let ciblep='';
        if($(json).find('#ordre img[src^="images/combat"]').length > 0 || $(json).find('#ordre').html().includes('bataille est en cours')) {
            for(let cnt=0; cnt<$(json).find('#ordre').get(0).childNodes.length; cnt++) {
                if($(json).find('#ordre').get(0).childNodes[cnt].nodeName=='#text') ciblep += $(json).find('#ordre').get(0).childNodes[cnt].data.replace('\n','').replace('\t','');
            }
        }
        else if($(json).find('#ordre div.alert-info').lenfth>0 && $(json).find('#ordre div.alert-info').first().text().includes('par une attaque')) ciblep = 'Une attaque arrive';
        else ciblep = false;*/
        let planete = {
            x:x,
            y:y,
            nom:$(json).find("#info h3").first().text().split(' ')[1].trim(),
            proprio:$(json).find("#info").first().get(0).childNodes[3].data.split(' ')[1],
            astros:$(json).find("#astro h3").text().split(' ')[0],
            croiseurs:$(json).find("#astro").find('img[src="../images/croiseur_x32.gif"]').length+$(json).find("#astro").find('img[src="../images/croiseur_x31.gif"]').length+$(json).find("#astro").find('img[src="../images/croiseur_g.gif"]').length,
            prod_astro: $(json).find("#astro").html().split('<br>')[1],//etain > 0 && fer >0
            conflit:$(json).find('#ordre img[src^="images/combat"]').length > 0 ? true : false,
            or:$(json).find('#ressource table.table tr').eq(1).find('td').eq(1).text(),
            prod_or:$(json).find('#ressource table.table tr').eq(1).find('td').eq(2).find('img[title="Production locale"]').length>0?true:false,
            etain:$(json).find('#ressource table.table tr').eq(2).find('td').eq(1).text(),
            prod_etain:$(json).find('#ressource table.table tr').eq(2).find('td').eq(2).find('img[title="Production locale"]').length>0?true:false,
            fer:$(json).find('#ressource table.table tr').eq(3).find('td').eq(1).text(),
            prod_fer:$(json).find('#ressource table.table tr').eq(3).find('td').eq(2).find('img[title="Production locale"]').length>0?true:false,
            vivres:$(json).find('#ressource table.table tr').eq(4).find('td').eq(1).text(),
            prod_vivres:$(json).find('#ressource table.table tr').eq(4).find('td').eq(2).find('img[title="Production locale"]').length>0?true:false,
            manuf:$(json).find('#ressource table.table tr').eq(5).find('td').eq(1).text(),
            prod_manuf:$(json).find('#ressource table.table tr').eq(5).find('td').eq(2).find('img[title="Production locale"]').length>0?true:false,
            cycle:'cycle '+$(json).find('#ressource table.table tr').eq(6).find('td').eq(0).text().split(" / ")[1].replace(' h',' Heure(s)'),
            next_cycle:'dans '+$(json).find('#ressource table.table tr').eq(6).find('td').eq(0).text().split('dans ')[1].split(" / ")[0],
            amb:amb,
            capitale:$(json).find('#pol').find('img[src="images/picto/palais.png"]').length>0,
            navette:null,//info news depuis map en I3
            offre:$(json).find('#ressource span.label-success').text().split(' ').map(e=>e.replace('Echange','Off.').replace('contre','<=>')).join(' '),
            pol:pol,
            events:get_stored('planetes').findIndex(o=>o.nom===$(json).find("#info h3").first().text().split(' ')[1].trim())===-1?event:merge(get_stored('planetes').find(o=>o.nom===$(json).find("#info h3").first().text().split(' ')[1].trim()).events,event,'msg'),
            //ciblep:ciblep,
            //attakp:$(json).find('#ordre').html().includes('destination')?$(json).find('#ordre').html().split('destination ')[1].split('!')[0].replace('de ','Attaque').trim()+($(json).find('#ordre input[name="annuler"]').length>0?', saut dans '+$(json).find('#ordre').html().split('dans ')[2]:($(json).find('#ordre').html().includes('combat')?', fin du combat dans '+$(json).find('#ordre').html().split('encore ')[1]:', arrivée dans '+$(json).find('#ordre').html().split('dans ')[1])):false,
            brouilleur:$(json).find('#info img[src="../images/brouilleur.gif"]').length > 0 ? true : false,
        };
        planete.urgent = urgence(planete);
        return {...(get_stored('planetes').find(o=>o.nom==planete.nom)==undefined?planete_maker():get_stored('planetes').find(o=>o.nom==planete.nom)),...planete};
    }
    function planete_update(url,draw=true) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url:url,
                type:'GET',
                success:function(json){
                    if(debug) { console.log('call '+url); console.log($(json).find('#info h3').first().text()); }
                    let planetes = get_stored('planetes');
                    planetes[planetes.findIndex(o=>o.nom === $(json).find('#info h3').first().text().split(' ')[1])] = get_Planete(url.split('x=')[1].split('&')[0],url.split('y=')[1].substr(0,3),json);
                    set_stored('planetes',planetes);
                    if(draw) make_planetes($("#filtreplan").val());
                    resolve(json);
                },
                error: function (error) { reject(error) }
            });
        });
    }
    function passer_commande(idPlan,reload=true,datasup=null) {
        let planet = get_stored('planetes')[idPlan];
        let data = { x: planet.x, y: planet.y, action:3 };
        if(datasup!=null) data = {...data,...datasup};
        return new Promise((resolve,reject) => {
            if(!data.offre || !data.demande || !data.x || !data.y) {
                mnotify('alert alert-danger','Données manquantes',2000);
                resolve();
            } else {
                //1ere requete pour recup la somme de controle
                if(debug) console.log('call detail (commerce) x='+planet.x+' y='+planet.y);
                $.ajax({
                    url:'detail.php?x='+planet.x+'&y='+planet.y,
                    type:'GET',
                    async:false,
                    success:function(json) {
                        if(debug) console.log('call detail_ordre (commerce) x='+planet.x+' y='+planet.y);
                        //on lance l'ordre
                        $.ajax({
                            url:'detail_ordre.php',
                            type:'POST',
                            async:false,
                            data:{...data,...{ctrl:$(json).find('input[name="ctrl"]').val()}},
                            success:function(reponse) {
                                if(debug) console.log('call detail_ordre (commerce) x='+data.x+' y='+data.y);
                                let node = $(reponse).filter(r=>r.nodeName=='DIV' && r.className.includes('alert'))[0];
                                mnotify(node.className,node.innerText,5000);
                                if(reload) planete_update('detail.php?x='+data.x+'&y='+data.y).then((data)=>{ resolve(reponse); });
                                else resolve(reponse);
                            }
                        });
                    }
                });
            }
        });
    }
    function lancer_flotte(idPlan,reload=true,datasup=null,noconfirm=false) {
        let planet = get_stored('planetes')[idPlan];
        let data = { x: planet.x, y: planet.y, action:2 };
        if(datasup!=null) data = {...data,...datasup};
        return new Promise((resolve,reject)=>{
            if(!data.cible || !data.troupes || !data.x || !data.y) {
                mnotify('alert-danger','Données manquantes',2000);
                resolve();
            }else {
                //1ere requete pour recup la somme de controle
                if(debug) console.log('call detail (attaque) x='+planet.x+' y='+planet.y);
                $.ajax({
                    url:'detail.php?x='+planet.x+'&y='+planet.y,
                    type:'GET',
                    success:function(json) {
                        if(debug) console.log('call detail_ordre (attaque) x='+planet.x+' y='+planet.y);
                        //on lance l'ordre
                        $.ajax({
                            url:'detail_ordre.php',
                            type:'POST',
                            data:{...data,...{ctrl:$(json).find('input[name="ctrl"]').val()}},
                            success:function(reponse) {
                                if($(reponse).find('div.alert-danger').length>0) {
                                    alert($(reponse).find('div.alert-danger').text());//moral trop bas, ou nombre max de transferts atteint
                                    resolve(reponse);
                                } else if(get_stored('planetes').find(o=>o.nom==data.cible.split('-')[2]).proprio != localStorage.playerName) { //ce n'est pas un transfert, il faut confirmer
                                    let txt = $(reponse).find('div.tile').first().get()[0].childNodes[4].data.split(' contre')[0]+'/'+planet.astros+'<br>'+$(reponse).find('div.tile').first().get()[0].childNodes[6].data.replace('estimés','')+'<br>Proba. réussite '+$(reponse).find('div.pie-chart-tiny').data('percent')+'%';
                                    // on confirme l'ordre:
                                    if(noconfirm || (!noconfirm && window.confirm(txt+' <br>Confirmer ?'))) {
                                        if(debug) console.log('call detail_ordre confirm (attaque) x='+data.x+' y='+data.y);
                                        $.ajax({
                                            url:'detail_ordre.php',
                                            type:'POST',
                                            data:{
                                                conf:$(reponse).find('input[name="conf"]').val(),
                                                troupes:$(reponse).find('input[name="troupes"]').val(),
                                                x:$(reponse).find('input[name="x"]').val(),
                                                y:$(reponse).find('input[name="y"]').val(),
                                                action:$(reponse).find('input[name="action"]').val(),
                                                ctrl:$(reponse).find('input[name="ctrl"]').val(),
                                                cible:$(reponse).find('input[name="cible"]').val()
                                            },
                                            success:function(html) {//l'attaque est lancé
                                                //save dans l'objet les infos detaillés de l'attaque (nb astro, renfort ,proba reussite...)
                                                let planetes = get_stored('planetes');
                                                planetes[idPlan].attakdetail = txt;
                                                set_stored('planetes',planetes);
                                                //met a jour les données et l'affichage
                                                mnotify($(html).filter(f=>f.nodeName=='DIV' && f.className.includes('alert'))[0].className,$(html).filter(f=>f.nodeName=='DIV' && f.className.includes('alert'))[0].outerHTML,5000);
                                                if(reload) planete_update('detail.php?x='+planetes[idPlan].x+'&y='+planetes[idPlan].y).then((data)=>{ resolve(reponse); });
                                                else resolve(reponse);
                                            }
                                        });
                                    }else resolve(reponse);
                                } else {//le transfert est lancé
                                    //met a jour les données et l'affichage
                                    mnotify($(html).filter(f=>f.nodeName=='DIV' && f.className.includes('alert'))[0].className,$(html).filter(f=>f.nodeName=='DIV' && f.className.includes('alert'))[0].outerHTML,5000);
                                    if(reload) planete_update('detail.php?x='+planetes[idPlan].x+'&y='+planetes[idPlan].y).then((data)=>{ resolve(reponse); });
                                    else resolve(reponse);
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    function donner_planete(idPlan,benef) {
        return new Promise((resolve,reject)=>{
            if(!benef) {
                mnotify('alert alert-danger','Aucun destinataire choisi',2000);
                resolve();
            }else {
                let planet = get_stored('planetes')[idPlan];
                if(debug) console.log('call alliance.php (don planete) x='+planet.x+' y='+planet.y);
                $.ajax({
                    url:'alliance.php',
                    type:'POST',
                    data:{cadeau:planet.x+'-'+planet.y+'-'+planet.nom,benef:benef},
                    success:function(json) {
                        let reponse = json.split('$.notify(')[1].split(')')[0].split('\',\'');
                        mnotify('alert alert-'+(reponse[1].replace('\'','')=='error'?'danger':reponse[1].replace('\'','')),reponse[0].replace('\'',''),5000);
                        if(reponse[1].replace('\'','')=='success') planete_update('detail.php?x='+planet.x+'&y='+planet.y).then(data=>{ resolve(); });
                        else resolve();
                    }
                });
            }
        });
    }
    function calcul_parsec(p1,p2) {
        let result = 0;
        let p = get_stored('planetes');
        let diff_x = Math.abs(p.find(o=>o.nom==p1).x - p.find(o=>o.nom==p2).x);
        let diff_y = Math.abs(p.find(o=>o.nom==p1).y - p.find(o=>o.nom==p2).y);
        result = (diff_x+diff_y)*10;
        return parseInt(result);
    }
    function find_nom_pl(text) {
        let planetes = get_stored('planetes');
        let bodytab = text.replace(/[,!.?]/g,' ').split(' ');
        if(bodytab.length>0) {
            $.each(bodytab,function(index,morceau) {
                //if(['de','par','sur','à','planète'].includes(morceau)) {
                //    if(planetes.find(o=>o.nom==bodytab[index+1])!=undefined) bodytab[index+1] = '<a style="color:lightgreen;" href="detail.php?x='+planetes.find(o=>o.nom==bodytab[index+1]).x+'&y='+planetes.find(o=>o.nom==bodytab[index+1]).y+'" target="fenetre">'+bodytab[index+1]+'</a>';
                //}else if(morceau.includes('Empire') && planetes.find(o=>o.nom==morceau)!=undefined) bodytab[index] = '<a style="color:lightgreen;" href="detail.php?x='+planetes.find(o=>o.nom==morceau).x+'&y='+planetes.find(o=>o.nom==morceau).y+'" target="fenetre">'+morceau+'</a>';
                if(planetes.find(o=>o.nom==morceau)!=undefined) bodytab[index] = '<a style="color:lightgreen;" href="detail.php?x='+planetes.find(o=>o.nom==morceau).x+'&y='+planetes.find(o=>o.nom==morceau).y+'" target="fenetre">'+morceau+'</a>';
            });
        }
        return bodytab.join(' ');
    }
    //----process les messages (appellé seulement lors du click sur le menu message de base ou le bouton "reload" ajouté dedans)
    function checkMail(html,type,alert=true) {
        let css_bdr = "<style>details:not([open])>*:not(summary){display:none;}details>summary{display:block;}details>summary:not(.bdr, .be,:only-child)::before{content:'\u25ba';padding-right:0.3rem;font-size:0.7em;}details[open]>summary:not(.bdr, .be,:only-child)::before{content:'\u25bc';}summary[open='true']{background-color:rgba(0,0,0,0.2);}summary{cursor:pointer;border-bottom: 1px solid rgba(0,0,0,0.5);}summary:hover{background-color:#C0e0ff;color:black;}details details {margin-left:10pt;display:block;}#treeview{border:inset 2px lightGray;}</style>";
        $('#messages div.overflow').first().empty().append(css_bdr+'<div class="col-md-2" id="treeview" style="'+parentstyle+'"><details><summary class="bdr" id="bdr">Boite de réception</summary></details><details><summary class="be" id="be">Boite d\'envoi</summary></details><details id="archives"><summary class="ark">Archives</summary></details></div><div class="col-md-10" style="'+parentstyle+'" id="afficheright"><div class="row">Boite '+(type==1?'de réception <button id="arkivall" class="btn btn-alt btn-xs" style="margin-left:10px;"><i class="fa fa-download"></i> Tout archiver</button>':"d'envoi")+'</div></div>');
        let messages = get_stored('messages');
        $.each(messages,function(i,m) {
            let img = m.type=="croiseur"?'images/vaisseaux/cruiser-2.png':(m.type=="leader"?'images/picto/leader_politique.png':(m.type=="player"?'images/picto/leader.png':(m.type=="planetes"?'images/picto/decouverte.png':(m.type=="diver"?'images/picto/message.png':''))));
            if($("#archives").find('#'+m.type).length==0) $('#archives').append('<details id="'+m.type+'"><summary class="'+m.type+'"><img src="'+img+'" class="'+m.type+'" style="width:15px;height:15px;">'+(m.type=='player'?'joueur':m.type)+'s</summary></details>');
            let link = (m.type=="leader"?'<a href="leader.php?id_leader='+get_stored('leaders').find(p=>p.player==localStorage.playerName).leaders.find(l=>l.nom==m.expediteur.replace('_',' ')).id+'" target="fenetre" style="color:lightgreen;">'+m.expediteur.replace('_',' ')+'</a>':(m.type=="planetes"?'<a href="detail.php?x='+get_stored('planetes').find(p=>p.nom==m.expediteur).x+'&y='+get_stored('planetes').find(p=>p.nom==m.expediteur).y+'" target="fenetre" style="color:lightgreen;">'+m.expediteur+'</a>':(m.type=="player"?'<a href="fiche.php?joueur='+m.expediteur+'" target="fenetre" style="color:lightgreen;">'+m.expediteur+'</a>':(m.type=="croiseur"?'<a href="croiseur.php?id_croiseur='+m.expediteur+'" target="fenetre" style="color:lightgreen;">Croiseur N°'+m.expediteur+'</a>':m.expediteur))));
            if($("#archives #"+m.type).find('#'+m.expediteur).length==0) $("#archives #"+m.type).append('<details id="'+m.expediteur+'"><summary class="'+m.expediteur+' affich">'+link+'</summary></details>');
        });
        //corps (listes des messages)
        if(type==1) {
            if($(html).find('div.message-list div.media').length) $(html).find('div.message-list div.media').each(function(i,v) {
            let msg='', type = false, ico = false, from = false, when = false, body = '';
            let txt1='', planetes = get_stored('planetes'), leaders = get_stored('leaders');
            if($(v).find('div.media-body').last().find('a.btn').length==0) {//messages classiques
                txt1 = $(v).find('div.media-body').last().get(0).childNodes[0].data;
                from = txt1.split(' le ')[0].replace('Croiseur ','').replace('Planète ','').replace('Planet ','').substr(3).trim();//contient 'Planète' => debut d'attaque, contient 'Planet' => resultat d'attaque, contient aucun : defense,renfort,bombardement,interception
                when = txt1.split(' le ')[1].trim();
                if($(v).find('a.media-body').first().attr('href') && !['Confrérie','Holo-Baazaar','Fondation','Maintenance','Banque Trantorienne'].includes($(v).find('a.media-body').first().attr('href').split('joueur=')[1])) {
                    if(leaders.find(o=>o.player===from)!==undefined) ico = leaders.find(o=>o.player===from).img;
                    type = 'player';
                    from = '<a style="color:lightgreen" target="fenetre" href="fiche.php?joueur='+from+'">'+from+'</a>';
                } else if(planetes.find(o=>o.nom===from)!==undefined) {//Message d'une planete
                    type = 'planetes';
                    ico = leaders.find(q=>q.player===planetes.find(r=>r.nom===from).proprio)!==undefined?leaders.find(q=>q.player===planetes.find(r=>r.nom===from).proprio).img:false;
                    from = '<a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===from).x+'&y='+planetes.find(o=>o.nom===from).y+'">'+from+'</a> ('+planetes.find(o=>o.nom===from).proprio+')';
                } else if($("div.side-widgets").find('div.s-widget').eq(2).find('a[href^="croiseur.php?id_croiseur='+from+'"]').length>0) { //Message d'un croiseur
                    type = 'croiseur';
                    ico = $("div.side-widgets").find('div.s-widget').eq(2).find('a[href^="croiseur.php?id_croiseur='+from+'"]').last().parent().prev().find('img').first().attr('src');
                    from = '<a style="color:lightgreen" target="fenetre" href="croiseur.php?id_croiseur='+from+'">Croiseur N°'+from+'</a>';
                } else {
                    if(leaders.find(o=>o.player==localStorage.playerName).leaders.length>0) $.each(leaders.find(o=>o.player==localStorage.playerName).leaders,function(l,lead) {
                        if(lead.nom===from) {//message d'un leader
                            type = 'leader';
                            ico = lead.pic?lead.pic:leaders.find(o=>o.player===localStorage.playerName).img;
                            from ='<a style="color:lightgreen;" target="fenetre" href="leader.php?id_leader='+lead.id+'">'+from+'</a> ('+localStorage.playerName+')';
                            return;
                        }
                    });
                    if(!type) {
                        //je connais pas encore ce type de message...
                    }
                }
                for(let cnt=0; cnt<$(v).find('div.media-body').last().get(0).childNodes.length; cnt++) {
                    if($(v).find('div.media-body').last().get(0).childNodes[cnt].nodeName=='#text' && cnt>2) body += $(v).find('div.media-body').last().get()[0].childNodes[cnt].data;
                    else if($(v).find('div.media-body').last().get(0).childNodes[cnt].nodeName=='I') body += $(v).find('div.media-body').last().get()[0].childNodes[cnt].outerHTML;//la balise utilisé pour les messages de l'holo-bazaar (pas sur que ce soit un <i> ... )
                }
                if(body=='') body = $(v).find('div.media-body').last().text().replace(from,'');
            } else {//message avec btn (forcement un message d'offre commerciale d'une de mes planetes)
                type = 'planetes';
                from = $(v).find('a.btn').first().find('img').get(0).nextSibling.data.trim();
                let o = $(v).find('a.btn').parent().get(0).childNodes;
                when = o[2].data.split('le ')[1];
                body = o[5].data;
                if(!body) body = $(v).find('a.btn').parent().find('a').remove().text().replace('le '+when,'');
                ico = planetes.find(r=>r.nom===from)!=undefined?(leaders.find(q=>q.player===planetes.find(r=>r.nom===from).proprio)!==undefined?leaders.find(q=>q.player===planetes.find(r=>r.nom===from).proprio).img:false):false;
                from = planetes.find(r=>r.nom===from)!=undefined?'<a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===from).x+'&y='+planetes.find(o=>o.nom===from).y+'">'+from+'</a> ('+planetes.find(o=>o.nom===from).proprio+')':from;
            }
            //on cherche des nom de planete dans le corps pour y ajouter le lien
            body = find_nom_pl(body);
            $('#afficheright').append('<div class="media" data-type="'+(type?type:'diver')+'"><div class="pull-left"><img width="40" src="'+(ico?ico:"../images/leaders/leader2_11.png")+'" alt=""></div><div class="media-body"><small class="text-muted">De <span class="from">'+from+'</span> le <span class="when">'+when+'</span>  <img data-msg="'+$(v).find('input[name^="efface"]').val()+'" class="btn anul btn-alt btn-sm del_msg" src="img/icon/delete.png" style="padding:3px;" height="24px"><button class="btn btn-alt btn-xs arkive"><i class="fa fa-download"></i></button></small><br><span class="body">'+body+'</span></div></div>');
        });
            else $('#afficheright').append('Aucun messages');
        }else {
            if($(html).find('div.message-list div.media').length) $(html).find('div.message-list div.media').each(function(i,v) {
                let when = $(v).find('div.media-body').first().get(0).childNodes[0].data.replace('le ','').trim();
                let to = $(v).find('div.media-body').first().find('div.label-success').text().replace('A ','').trim();
                while($(v).find('div.media-body').first().contents()[0].nodeName!='DIV'){ $(v).find('div.media-body').first().contents().filter(function(i,n){ return i==0; }).remove();};
                $(v).find('div.media-body').first().find('div.label-success').remove();
                let msgsend = $(v).find('div.media-body').first().text();
                $('#afficheright').append('<div class="media" data-type="player"><div class="pull-left"><img width="40" src="'+(get_stored('leaders').find(p=>p.player==to)?get_stored('leaders').find(p=>p.player==to).img:"../images/leaders/leader2_11.png")+'" alt=""></div><div class="media-body"><small class="text-muted">A <span class="from"><a href="fiche.php?joueur='+to+'" target="fenetre" style="color:lightgreen;">'+to+'</a></span> le <span class="when">'+when+'</span>  <!--img data-msg="" class="btn anul btn-alt btn-sm del_msg" src="img/icon/delete.png" style="padding:3px;" height="24px"><button class="btn btn-alt btn-xs arkive"><i class="fa fa-download"></i></button--></small><br><span class="body">'+msgsend+'</span></div></div>');
            });
            else $('#afficheright').append('Aucun messages');
        }
        rt_to_map();
        //entete (boutons) et modal
        if(alert && $("#warnmsgbtn").length) {
            $("#warnmsgbtn").popover('hide')
            $("#warnmsgbtn").remove();
        }
        if($("#btn_send_msg").length==0) $('<a id="btn_send_msg" class="btn btn-alt btn-xs" data-toggle="modal" href="#compose-message" title="Nouveau" style="margin-left:10px;"><i class="fa fa-plus"></i></a>').insertAfter("#refresh_msg");
        if($("#btn_add_blcklist").length==0) $('<a id="btn_add_blcklist" class="btn btn-alt btn-xs" data-toggle="modal" href="#blacklist" title="Vos indésirables" style="margin-left:10px;">Blacklist</a>').insertAfter('#btn_send_msg');
        if(alert && $(html).find('div.message-list div.alert-danger').length) {
            $("#messages").find('span.drawer-close').first().before('<button id="warnmsgbtn" class="btn btn-alt btn-xs" style="background-color:#d9534f!important;margin-left:40%;"><i class="fa fa-warning btn-danger"></i></button>');
            $("#warnmsgbtn").popover({html:true,placement:"bottom",trigger:"focus",content:'Plus de 50 messages dans la boite '+(type==1?'de réception':"d'envoi")+', il faut penser à faire du tri !<br>C\'est à ça que sert l\'archivage !',template:'<div class="popover" style="background-color:#E02C29;color:white;" role="tooltip"><div class="arrow"></div><i class="fa fa-warning fa-2x pull-left" style="padding:30px 20px 30px 20px;border-right: 2px solid white; margin-right:10px;"></i><span class="popover-content" style="font-size:13px;padding:0;"></span></div>',container:'body'});
            setTimeout(()=>$("#warnmsgbtn").popover('show'),1000);
            setTimeout(()=>$("#warnmsgbtn").popover('hide'),6000);
        }
        if($("#content").find('#compose-message').length==0) {
            let newmsg = $(html).find("#compose-message").first().get(0).cloneNode(true);
            newmsg.setAttribute('data-backdrop','static');
            $("#content").find('#compose-message').remove();
            $("#content").get(0).appendChild(newmsg);
            $("#content").find('#compose-message form').first().attr('id','form_msg');
            $('#compose-message input[type="submit"]').first().replaceWith('<button type="button" class="btn pull-left" data-dismiss="modal">Fermer</button><button type="button" class="btn agit pull-right" id="send_msg"><i class="fa fa-envelope"></i> envoyer</button>');
        }
        if($("#content").find('#blacklist').length==0) {
            let blcklist = $(html).find("#blacklist").first().get(0).cloneNode(true);
            blcklist.setAttribute('data-backdrop','static');
            $("#content").find('#blacklist').remove();
            $("#content").get(0).appendChild(blcklist);
            $("#content").find('#blacklist form').first().attr('id','form_blcklist');
            $('#blacklist input[type="submit"]').first().replaceWith('<button type="button" class="btn pull-left" data-dismiss="modal">Fermer</button><button type="button" class="btn agit pull-right" id="save_blcklist"><i class="fa fa-plus"></i> ajouter</button>');
        }
        //triggers
        $('#send_msg').off('click');
        $('#send_msg').on('click',function() { $.ajax({url:'messages.php',type:'POST',data:$("#form_msg").serialize(),success:function(rep) { mnotify($(rep).find('div.alert').get(0).className,$(rep).find('div.alert').first().html(),5000); $("#compose-message button.close").trigger('click');}}); });
        $("#save_blcklist").off('click').on('click',function() { $.ajax({url:'messages.php',type:'POST',data:$("#form_blcklist").serialize(),success:function(resp){ mnotify($(resp).find('div.alert').get(0).className,$(resp).find('div.alert').first().html(),5000); $("#blacklist button.close").trigger('click'); } }); });
        $('.del_msg').off('click');
        $('.del_msg').on('click',function(i,v) { $.ajax({url:'messages.php',type:'POST',data:{'efface[1]':$(this).data('msg')},success:function(html) { checkMail(html,1,false); } }); });
        $(".arkive").off('click').on('click',function() {
            let msg = $(this).parents('.media').first();
            let messages = get_stored('messages');
            let date = new Date(Date.now()).getFullYear()+'-'+msg.find('.when').text().trim().split(' ')[0].split('/')[1]+'-'+msg.find('.when').text().trim().split(' ')[0].split('/')[0]+' '+msg.find('.when').text().trim().split(' ')[msg.find('.when').text().trim().split(' ').length-1]+':00';
            let from = ['leader','planetes','croiseur'].includes(msg.data('type'))?msg.find('.from').text().trim().split(' (')[0].replace(' ','_').replace('Croiseur_N°',''):msg.find('.from').text().trim();
            from = from?from:'Inconnu';
            if(messages.find(m=>m.expediteur==from)==undefined) messages.push({expediteur:from,type:msg.data('type'),ico:msg.find('div.pull-left>img').first().attr('src'),messages:[{when:Date.parse(date),body:msg.find('.body').first().html()}]});
            else messages.find(m=>m.expediteur==from).messages.push({when:Date.parse(date),body:msg.find('.body').first().html()});
            set_stored('messages',messages);
            msg.find('.del_msg').first().trigger('click');
        });
        $("#arkivall").off('click').on('click',function() { $("#afficheright").find('.arkive').each(function() { $(this).trigger('click'); }); });
        $("summary").off('click').on('click',function() {
            if($(this).hasClass('affich')) {
                $("#afficheright").html('<div class="row">Messages de '+(this.parentNode.parentNode.id=='leader'?this.parentNode.id.replace('_',' '):(this.parentNode.parentNode.id=='croiseur'?'Croiseur N°'+this.parentNode.id:this.parentNode.id))+'</div>');
                let exp = messages.find(f=>f.expediteur==this.parentNode.id);
                if(exp) $.each(exp.messages.sort((a,b)=>{ return a.when < b.when ? 1 : (a.when>b.when?-1:0)}),function(i,m) {
                    $("#afficheright").append('<div class="media" data-inde="'+exp.messages.findIndex(z=>z.when==m.when)+'" data-exp="'+exp.expediteur+'" data-type="'+exp.type+'"><div class="pull-left"><img width="40" src="'+(exp.ico?exp.ico:"../images/leaders/leader2_11.png")+'" alt=""></div><div class="media-body"><small class="text-muted">Le <span class="when">'+new Date(m.when).toLocaleString()+'</span>  <img class="btn anul btn-alt btn-sm del_ark" src="img/icon/delete.png" style="padding:3px;" height="24px"></small><br><a href="messages.php" class="body">'+m.body+'</a></div></div>');
                });
                $(".del_ark").off('click').on('click',function() {
                    let m = get_stored('messages');
                    if(m.find(m=>m.expediteur==$(this).parents('.media').first().data('exp')).messages.length==1) m.splice(m.findIndex(m=>m.expediteur==$(this).parents('.media').first().data('exp')),1);
                    else m.find(m=>m.expediteur==$(this).parents('.media').first().data('exp')).messages.splice(parseInt($(this).parents('.media').first().data('inde')),1);
                    set_stored('messages',m);
                    $(this).parents('.media').first().remove();
                });
            }else if($(this).hasClass('bdr')) check_inbox(false);
            else if($(this).hasClass('be')) get_send(false);
            else {
                if(this.hasAttribute('open')) this.removeAttribute('open');
                else this.setAttribute('open',true);
            }
        });
    }
    function get_send(alert=true) { $.ajax({url:'messages.php?voir_exp=2', type:'GET', success:function(html) { if(debug) console.log('call messages recus'); checkMail(html,2,alert); } }); }
    function check_inbox(alert=true) { $.ajax({ url:'messages.php', type:'GET', success:function(html) { if(debug) { console.log('call messages'); console.log($(html).find('div.message-list div.media').first()); } checkMail(html,1,alert); } }); }
    $("#refresh_msg").on('click',function(){check_inbox(false);});
    //traitement leaders/croiseurs
    function clear_leaders() {
        let leaders = get_stored('leaders');
        if(leaders.length>0) {
            for(let a=0; a<leaders.length; a++) {//on peut pas utiliser $.each car la boucle sur l'objet modifie la taille de l'objet
                //efface les leaders des joueurs des anciens secteurs
                //if(!leaders[a].sector) leaders.splice(a,1);
                //efface mes leaders
                //if(leaders[a].player==localStorage.playerName) leaders[a].leaders = [];
                //efface les joueurs sans leaders
                //if(leaders[a].leaders.length==0) leaders.splice(a,1);
                //on verifie les leaders de ceux qu'on vire pas
                if(leaders[a].leaders.length>0) $.each(leaders[a].leaders,function(c,d) {
                    /*if(d.leave===undefined) {//ils ont été enregistré avant l'ajout de cette fonctionalité, on l'ajoute pour pas qu'ils pop comme nouvellement detecté
                        let mtnt = new Date(Date.now());
                        leaders[a].leaders[c].leave = mtnt.setHours(mtnt.getHours()-2);
                    }*/
                    //ancien format foireux à transformer
                    /*if(d.visited.length>0) $.each(d.visited,function(e,f){
                        if(!f.includes('</a>')) {
                            let tmp = f.toLowerCase().split('le');
                            if(tmp[0].substr(0,5)=='empire') tmp[0] = tmp[0].substr(0,1).toUpperCase()+tmp[0].substr(1);
                            let planet = get_stored('planetes').find(o=>o.nom===tmp[0].trim());
                            leaders[a].leaders[c].visited[e] = '<a style="color:lightgreen" target="fenetre" href="detail.php?x='+(planet !== undefined? planet.x+'&y='+planet.y:'')+'">'+tmp[0].trim()+'</a> Le '+(tmp[1]?tmp[1]:new Date(Date.now()).toLocaleString());
                        }else {
                            let tmp = f.split('</a>');
                            if(tmp[1].includes(' Le ')) tmp[1] = tmp[1].split(' Le ')[0];
                            else tmp[1] = tmp[1].toLowerCase().split(' le ')[0];
                            leaders[a].leaders[c].visited[e] = tmp[0]+'</a> Le '+(tmp[1]?tmp[1]:new Date(Date.now()).toLocaleString());
                        }
                    });*/
                    //efface l'historique des planetes visites de mes leaders
                    //if(leaders[a].player==localStorage.playerName) leaders[a].leaders[c].visited = ['Inconnu'];
                    //limite l'historique des planetes visites à 25 par leader
                    if(d.visited !== undefined && d.visited.length>25) d.visited.splice(25,d.visited.length);
                    //supprime l'histo des actions de mes leaders
                    //if(leaders[a].player==localStorage.playerName) leaders[a].leaders[c].automat.action=[];
                });
            }
            set_stored('leaders',leaders);
        }
    }//supprime les joueurs sans leader (neutre,empire,mulebot) et nettoie les données mal formatées
    function init_leaders() {
        clear_leaders();
        let leaders = get_stored('leaders');
        if(leaders.length>0) {
            if(debug) console.log('reinit joueurs');
            $.each(leaders,function(a,b){
                if(b.player != localStorage.playerName) {
                    leaders[a].sector = false; //on reset le secteur de tt le monde sauf moi
                    //leaders[a].ally = false;//on reset l'alliance de tt le monde -- plus mtnt qu'on met cette info a jour lors du call a alliance.php
                } else {
                    leaders[a].sector = true; //moi je suis forcement sur secteur
                    leaders[a].ally = null;//je m'allie pas a moi meme ...
                }
            });
        }else if(localStorage.playerName) leaders.push({player:localStorage.playerName,sector:true,img:false,niv:false,ally:null,leaders:[]});
        set_stored('leaders',leaders);
    }//re-initialise les variables des joueurs (alliance, presence)
    function calcul_diff_lead(nb=0) {
        let cnt_cgt_lead = 0;
        let cnt_tot_lead = 0;
        let leaders = get_stored('leaders');
        if(leaders.length > 0) $.each(leaders,function(y,o) {
            $.each(o.leaders,function(j,p) {
                if(o.player!=localStorage.playerName) {
                    cnt_tot_lead++;
                    if(nb!==false && !p.traite) {
                        if(p.pose !== false) {//les leaders qu'on savait posé qqpart et qu'on ne voit plus
                            if(!p.visited.slice(-1)[0].includes(' Le ')) leaders[y].leaders[j].visited.splice(-1,1,p.visited.slice(-1)[0]+' Le '+new Date(p.pose).toLocaleString());//on enregistre la date de visite de la derniere planete dans l'histo avant de l'ecraser
                            leaders[y].leaders[j].pose = false;
                            leaders[y].leaders[j].leave = Date.now();
                        }//else : les leaders deja en vol depuis longtemps (genre ancien secteur)
                        leaders[y].leaders[j].traite = true;
                    }
                    if(((p.pose && dateDiff(p.pose,Date.now()).hour == 0 && dateDiff(p.pose,Date.now()).day == 0) || (p.leave && dateDiff(p.leave,Date.now()).hour == 0 && dateDiff(p.leave,Date.now()).day == 0))) cnt_cgt_lead++;//on compte les leaders qui ont bougé depuis moins d'une heure
                }
            });
            if(nb!==false) set_stored('leaders',leaders);
        });
        if($("#badge-lead").length>0) $("#badge-lead").text(cnt_cgt_lead);
        /*if(cnt_cgt_lead > 0) {
            alert('changement(s) leaders détecté(s) ('+nb+' sur écran '+cnt_tot_lead+' stockés '+cnt_cgt_lead+' modifiés)');
            console.log(leaders);
        }*/
    }//traite les leaders enregistrés qu'on ne voit pas sur l'ecran (et qui n'ont donc pas ete traité dans la boucle de save_info_stat())
    function constr_menu_leader() {
        let styl = '<style>.dropdown-spe-menu { display:none; } .dropdown-spe-menu.open { display:inline-block;} .un:before,.de:before{cursor:pointer;width:23px;height:18px;display:inline-block;text-align:center;border-radius:4px;border:1px solid rgba(255,255,255,0.3);font-weight:bold;} .nextclose:before{content:" + ";} .nextopen:before{content:" - ";} .dropdown-spe-toggle.un { padding-left:7px; font-size:small;} .dropdown-spe-toggle.de { padding-left:15px; font-size:x-small; } .un,.de{position:relative;}</style>';
        if(!$("#spe_lead").length) $("div.side-widgets").find('div.s-widget').eq(1).find('div.s-widget-body').append('<div id="spe_lead" class="row m-b-5" style="border: double black; position: relative; min-height: 25px;">'+styl+'<div class="dropdown-spe-toggle"><t class="btn btn-alt btn-xs fa fa-plus"></t><h2 class="tile-title spe" style="display:inline;"><img src="images/picto/leader.png" height="20" title="Leaders connus">Autres Joueurs<i id="badge-lead" style="top:-15px;right:2px;" class="n-count animated" style="margin:0;">0</i></h2></div><span class="dropdown-spe-menu"><div id="filterlead" style="display:flex;align-items:center;justify-content:space-evenly;"><span id="filterHS" class="label label-success" title="afficher les joueurs hors secteur">HS</span></div></span></div>');
        let leaders = get_stored('leaders');
        let tl='';
        if(leaders.length > 0) $.each(leaders,function(y,play) {
            if(play.player!==localStorage.playerName && !['empire','neutre','mulet'].includes(play.player.toLowerCase())) {
                let nouv = false; let cntnouv=0;
                let hype = false;
                let txt='';
                if(play.img && (($("#filterHS").hasClass('label-danger') && play.sector) || $("#filterHS").hasClass('label-success'))) {//on n'affiche que les joueurs non pnj autre que moi (meme sans leaders encore vu, pour les alliances)
                    $.each(play.leaders,function(j,leader) {
                        nouv = (leader.pose && dateDiff(leader.pose,Date.now()).hour == 0 && dateDiff(leader.pose,Date.now()).day == 0) || (leader.leave && dateDiff(leader.leave,Date.now()).hour == 0 && dateDiff(leader.leave,Date.now()).day == 0);
                        hype = hype || leader.traceur != undefined;
                        txt+='<div class="dropdown-spe-toggle nextclose  de"><span style="font-weight:bold;color:white;"><i>'+leader.nom+'</i></span><span style="'+(nouv && !leader.mort?'color:green;':(!leader.pose || leader.mort?'color:red;':'color:white;'))+'">'+(leader.mort!=undefined&&leader.mort===true?' <img src="images/picto/mort.png" height="10"> Assassiné':(leader.pose?((leader.traceur != undefined?' <img src="../images/hyper_ondes.gif" width=10, height=10> '+leader.traceur:' Posé sur '+leader.visited[leader.visited.length-1])+' depuis '+dateDiff(leader.pose,Date.now(),true)):((leader.traceur != undefined?' <img src="../images/hyper_ondes.gif" width=10, height=10> '+leader.traceur:'')+' A quitté '+leader.visited[leader.visited.length-1]+(leader.leave?' depuis '+dateDiff(leader.leave,Date.now(),true):''))))+(nouv?'<button id="'+y+'_'+j+'" class="btn btn-xs lu">Vu</button>':'')+'</span></div><span class="dropdown-spe-menu">';
                        if(leader.visited.length > 0) {
                            txt+='<ul style="font-size:x-small;">';
                            $.each(leader.visited,function(k,plane) { txt += '<li>'+(k!=leader.visited.length?plane:(leader.pose?'A attéri sur ':'A quitté ')+'<a href="detail.php?x=">'+plane+'</a>'+(' il y a '+dateDiff(leader.pose?leader.pose:leader.leave,Date.now(),true)))+'</li>'; });
                            txt+='</ul>';
                        }
                        txt+='</span>';
                        cntnouv += nouv === true ? 1 : 0;
                    });
                    tl+='<div class="dropdown-spe-toggle nextclose un"><a href="fiche.php?joueur='+play.player+'" target="fenetre" style="color:lightgreen;padding-left:5px;">'+play.player+'</a> '+(play.sector&&play.ally?'<img '+(play.renforts?'title="Apporte '+play.renforts+' astros en soutien"':'')+' src="../images/alliance.gif" width="15">':'')+'<span '+(!play.sector?'style="color:red;"':'')+'>'+play.niv.substr(0,1).toUpperCase()+(!Number.isNaN(parseInt(play.niv.substr(-1)))?play.niv.substr(-1):'1')+(play.niv.includes('Niv3') && play.conf?'<span style="font-size:8px;"> (<a href="confrerie.php?confrerie='+play.conf+'" target="fenetre" style="color:lightgreen;">'+play.conf.toUpperCase()+'</a>)</span>':'')+' ['+play.leaders.length+'/5]</span>'+(cntnouv?'<i style="top:-15px;right:2px;" class="n-count animated" style="margin:0;">'+cntnouv+'</i>':'')+(hype?'&nbsp;&nbsp;<img src="../images/hyper_ondes.gif" width=10, height=10>':'')+(['Marchand','Fondation','Empire'].includes(play.niv.split(' ')[0]) && play.sector?'<button type="button" data-player="'+play.player+'" data-niv="'+play.niv+'" class="btn btn-alt btn-xs classementplayer" ><!--img src="images/picto/reorg.png" width=15--><i class="fa fa-calendar"></i></button>':'')+'</div><div class="dropdown-spe-menu">'+txt+'</div>';
                    if(play.leaders.length>5) {
                        if(!play.canardalert) {
                            mnotify('alert alert-danger','Je crois qu\'on a trouvé un canard parmis les leaders de '+play.player+' !');
                            leaders.find(o=>o.player==play.player).canardalert = true;
                        }
                    }else leaders.find(o=>o.player==play.player).canardalert = false;
                    set_stored('leaders',leaders);
                }
            }
        });
        $("#filterlead").siblings().remove();
        $("#filterlead").after(tl);
        calcul_diff_lead(false);
        $(".lu").off('click').on('click',function() {
            let leaders = get_stored('leaders');
            let ids = $(this).attr('id').split('_');
            let lead = leaders[ids[0]].leaders[ids[1]];
            if(lead.leave) leaders[ids[0]].leaders[ids[1]].leave = new Date(lead.leave).setHours(new Date(lead.leave).getHours()-1);
            else leaders[ids[0]].leaders[ids[1]].pose = new Date(lead.pose).setHours(new Date(lead.pose).getHours()-1);
            set_stored('leaders',leaders);
            constr_menu_leader();
        });
        $('.dropdown-spe-toggle').off('click').on('click',function(e) {
            if(!['A','I','BUTTON'].includes(e.target.nodeName)){//if(!$(e.target).hasClass('classementplayer')){
                let already_open = $(this).next().hasClass('open');
                $(this).parent().find('.open').each(function(y,l) { $(this).removeClass('open'); if($(this).prev().hasClass('un')||$(this).prev().hasClass('de')) $(this).prev().toggleClass('nextopen nextclose'); });
                if(!already_open) { $(this).next().addClass('open'); if($(this).hasClass('un')||$(this).hasClass('de')) $(this).toggleClass('nextopen nextclose'); }
                if($(this).find('t').length) $(this).find('t').toggleClass('fa-plus fa-minus');
            }
        });
        $(".classementplayer").off('click').on('click',function() {
            let prom = '';
            let nom = $(this).data('player');
            $("#"+nom).off('hide.bs.modal');
            if($("#"+nom).length>0) $("#"+nom).remove();
            $('body').append('<div class="modal modal-content" id="'+nom+'" style="width:430px;height:200px;overflow:auto;position:absolute;top:50%;left:50%;border:2px solid white;"><div class="modal-header" id="'+nom+'header"><h3 class="modal-title" style="display:block;text-align:center;width:90%;">Classement de '+nom+'</h3><input type="hidden" name="oldheight"><button class="close minify" style="position:absolute;top:10px;right:40px;"><i class="fa fa-minus"></i></button><button class="close" style="position:absolute;top:10px;right:10px;" data-dismiss="modal"><span>&times;</span></button></div><div class="modal-body" style="background:rgba(0, 0, 0, 0.9);">Aucun classement trouvé</div></div>');
            dragElement(document.getElementById(nom));
            $("#"+nom).on('hide.bs.modal',function() { $("#"+nom).remove(); });
            $.each(document.getElementsByClassName('modal-content'),function(i,v) {
                v.addEventListener('pointerenter',(event)=>{ this.style.zIndex = 1200; });
                v.addEventListener('pointerleave',(event)=>{ this.style.zIndex = 200; });
            });
            $("#"+nom+" .minify").off('click').on('click',function(){
                if($(this).find('i').first().hasClass('fa-plus')) {
                    $(this).parents('div.modal-content').css('height',$(this).prev().val()).css('overflow','auto').css('resize','both');
                    $(this).find('i').first().removeClass('fa-plus').addClass('fa-minus');
                }else {
                    //$(this).parents('div.modal').first().css('z-index','100');
                    $(this).prev().val($(this).parents('div.modal-content').css('height'));
                    $(this).parents('div.modal-content').css('height','40px').css('overflow','hidden').css('resize','none');
                    $(this).find('i').first().removeClass('fa-minus').addClass('fa-plus');
                }
            });
            if($(this).data('niv').toLowerCase().substr(0,4)=='empi') prom = $(this).data('niv').toLowerCase().includes('niv2')?'marech':'empi';
            else if($(this).data('niv').toLowerCase().substr(0,4)=='marc') prom = $(this).data('niv').toLowerCase().includes('niv2')?'marchan':'march';
            else if($(this).data('niv').toLowerCase().substr(0,4)=='fond') prom = $(this).data('niv').toLowerCase().includes('niv2')?'fonda2':'fonda';
            let promdates = [];
            $.ajax({
                url:'classements.php',
                type:'GET',
                success:function(htmlclass) {
                    $(htmlclass).find('select[name="fichier"] option').each(function(){ if(!promdates.includes($(this).val().substr(-5))) promdates.push($(this).val().substr(-5)); });
                    if(promdates.length>0) $.each(promdates,function(j,d) {
                        if(d) $.ajax({
                            url:'promo.php',
                            type:'POST',
                            data:{fichier:prom+d},
                            dataType:"html",
                            success:function(htmlprom) {
                                $('#tempprom').remove();
                                $('body').append('<div id="tempprom">'+htmlprom+'</div>');
                                $.each($('#tempprom').find('table').first().find('tr'),function(i,t) {
                                    if($(t).find('td').first().text().trim()==nom) {
                                        $("#tempprom").find('table').first().find('tr').eq(i).css('background-color','lightgrey');
                                        $("#"+nom+' .modal-body').first().empty().append($("#tempprom").find('table').get(0).outerHTML);
                                        $("#"+nom).css('height',(parseInt($("#tempprom").find('table').get(0).clientHeight)+100)+'px').modal({backdrop:false});
                                    }
                                });
                                $('#tempprom').remove();
                            }
                        });
                    });
                }
            });
        });
        $("#filterlead span.label").each(function() {
            let fil = $(this);
            fil.off('click').on('click',function() {
                fil.toggleClass('label-success label-danger');
                constr_menu_leader();
            });
        });
        return tl;
    }//exploite la var leaders pour construire le menu deroulant des leaders des autres joueurs
    //croiseurs (direct sur ecran si moins de 4, sinon sur page specifique)
    function call_ajax_croiseur(data) {
        return new Promise((resolve,reject)=> {$.ajax({
            url:'croiseur.php',
            type:'POST',
            data:data,
            success:function(html) {
                if(debug) console.log($(html).find('div.alert').first().text());
                if($(html).find('div.alert').first().hasClass('alert-danger') && $(html).find('div-alert').first().text().includes('Le croiseur s est crashé !  La mission a échoué')) maj_crois_global();
                else document.getElementById('fenetre').src = 'croiseur.php?id_croiseur='+data.id_croiseur;//$('body').html()=="Erreur, ce croiseur n'est plus en état !"
                mnotify($(html).find('div.alert').length>0?$(html).find('div.alert').get(0).className:'alert-info',$(html).find('div.alert').length>0?$(html).find('div.alert').first().html():'action executée',5000);
                resolve(html);
            }
        });});
    }
    function call_trigger_launch_crois() {
        $("button.launch_crois").off('click');
        $("button.launch_crois").on('click',function() {
            if(debug) console.log('call croiseur bombardement/protection');
            let data = {
                id_croiseur:$(this).data('crois'),
                action:($(this).data('action')?$(this).data('action'):($("#cible_crois :selected").data('owner')===localStorage.playerName?1:2))
            };
            if($(this).hasClass('btnx33')) {//revient à $(this).data('action')==8
                data.zone = $(this).prev().val();
                data.frappe = $("#cible_crois").val();
                call_ajax_croiseur(data).then((result) => {
                    data.action="9";
                    $.each($(result).find('#ordre').get(0).childNodes,function(i,n) { if(n.nodeName=='#text' && n.data.includes('Etat croiseur')) data.contr = n.data.split(' : ')[1].split(' %')[0]; });
                    call_ajax_croiseur(data);
                });
            }else {
                data.cible = $("#cible_crois").val();
                data.cibledef = $("#cible_crois").val();
                call_ajax_croiseur(data);
            }
        });
        $("button.pat_crois").off('click');
        $("button.pat_crois").on('click',function() {
            if(debug) console.log('call croiseur envoi patrouille');
            call_ajax_croiseur({ id_croiseur : $(this).data('crois'), action:5 });
        });
    }
    var slctx33 = '<select name="zone" class="btn btn-xs x33slct" style="width:25px;height:23px;" title="Choisir Zone Cible"><option value="hangar" selected data-imagesrc="../images/arpenter/hangar.jpg" title="Hangar">H</option><option value="ambass" data-imagesrc="images/picto/ambassade.png" title="Ambassabe">A</option><option value="brou" data-imagesrc="images/picto/brouilleur.png" title="Brouilleur">B</option><option value="centre" data-imagesrc="images/picto/frappe.png" title="Centre ville">C</option></select>';
    function actions_croiseur(type,id) {
        return '<span style="float:right;position:relative;top:-3px;right:3px;">'+(type=='X33'?slctx33:(type=='X32'?'<button data-crois="'+id+'" class="btn agit btn-alt btn-xs pat_crois" title="Lancer Patrouille">P</button>':''/*TODO:PorteNef:select choix decharger/charger,explorateur?*/))+
            '<button'+(type=='X33'?' data-action="8"':'')+' data-crois="'+id+'" class="'+(type=="X33"?'btnx33':'btncrois')+' btn agit btn-alt btn-xs gobtn launch_crois"><img src="'+($("#cible_crois").val()==""?'images/picto/empire.png':(type=="X33"?'images/picto/frappe.png':($("#cible_crois option:selected").data('owner')==localStorage.playerName?'images/picto/defense.png':'images/picto/bombarder.png')))+'" width="15"></button></span>';
    }
    function envoi_zn(id) {//envoi en protection pour garder moins de 6 croiseurs en ZN
        let tools = get_stored('tools');
        let dest='';
        if(tools.autozn.destination==null || (tools.autozn.destination!=null && (get_stored('planetes').find(o=>o.nom==tools.autozn.destination.split('-')[2]) == undefined || (get_stored('planetes').find(o=>o.nom==tools.autozn.destination.split('-')[2]) != undefined && get_stored('planetes').find(o=>o.nom==tools.autozn.destination.split('-')[2]).proprio!=localStorage.playerName)))) dest = $("#croisslctdropdown option[data-owner='"+localStorage.playerName+"']").first().val();
        else if(tools.autozn.rotate){ let ctrl=0; while(dest==tools.autozn.destination||ctrl<=5) { dest = $("#croisslctdropdown option[data-owner='"+localStorage.playerName+"']").eq(Math.floor(Math.random()*($("#croisslctdropdown option[data-owner='"+localStorage.playerName+"']").length-1))).val(); ctrl++; } }
        else dest = tools.autozn.destination;
        //TODO: preserve (rotate en fonction du %age de santé)
        //voir mieux : une option qui fait en sorte d'envoyer le croiseur en protection puis d'annuler avant son arrivé et de le relancer, en boucle
        tools.autozn.destination = dest;
        set_stored('tools',tools);
        call_ajax_croiseur({id_croiseur:id, action:1, cibledef:dest});
    }
    function filtrecrois(type){
        $(".filtercrois[data-type='"+type+"']").first().toggleClass('label-success label-danger');
        $("#insertcrois").children(".row").each(function(i,v){
            if($("#filtercrois .label[data-type='"+$(v).find('a[href^="croiseur.php"]').first().text().trim().split(' ')[0]+"']").first().hasClass('label-success')) $(v).css('display','block');
            else $(v).css('display','none');
        });
    }
    function maj_crois_global() {
        alim_cible_select(true,true);
        /*$("div.side-widgets").find('div.s-widget').eq(2).find('.addjme').remove();
        $("div.side-widgets").find('div.s-widget').eq(2).find('h2').first().attr('id','tog_crois').prepend('<span class="addjme">Parc </span>');
        $("div.side-widgets").find('div.s-widget').eq(2).find('div.side-border').each(function(y,v){//pour chaque croiseur
            if($(v).find('a.btn').first().text().includes('X33')) $(v).find('img').first().attr('src','images/vaisseaux/x33.jpg');
            else if($(v).find('a.btn').first().text().includes('X27')) $(v).find('img').first().attr('src','../images/croiseur_g.gif');
            else if($(v).find('a.btn').first().text().includes('X31')) $(v).find('img').first().attr('src','images/vaisseaux/Croiseur x31.png');//.attr('src','../images/croiseur_x31.gif');
            else if($(v).find('a.btn').first().text().includes('X32')) $(v).find('img').first().attr('src','../images/croiseur_x32.gif');
            else if($(v).find('a.btn').first().text().includes('Nef')) $(v).find('img').first().attr('src','../images/illustr_4_var4.png');
            $(v).find('a.btn').first().text($(v).find('a.btn').first().text().split(' ')[1]+' N°'+$(v).find('a.btn').first().attr('href').split('=')[1]);
        });
        $("div.side-widgets").find('div.s-widget').eq(2).find('.progress').css('margin',0);*/
        $("div.side-widgets").find('div.s-widget').find('.s-widget-body').css('padding','0 10px');
        $("div.side-widgets").find('div.s-widget').find('.tile-title').css('padding','10px 0');
        if(debug) console.log('call croiseurs.php');
        return new Promise((resolve,reject)=>{$.ajax({
            url:'croiseurs.php',
            type:'GET',
            success:function(html) {
                let cntAjaxCall = 0, cntAjaxDone = 0;
                let croiseurs=''; let types = [];
                let cntzn=0, cntrep=0, cntoqp=0, cnttorep=0;
                $($(html).find('tr').get().reverse()).each(function(i,tr) {
                    let type = $(tr).parents('table').first().prev().attr('src').split('.')[0].substr(-1);
                    type = parseInt(type)>0?'X3'+type:'X27';
                    if(!types.includes(type)) types.push(type);
                    let id = $(tr).find('td').eq(0).find('a').first().text().split(' ')[1];
                    let imgcrois = ($(tr).find('td').eq(2).text().includes('Protection')?'<img src="images/picto/defense.png" width="20">':($(tr).find('td').eq(2).text().includes('Bombardement')?'<img src="images/picto/bombarder.png" width="20">':
                          ($(tr).find('td').eq(2).text().includes('Repli')?'<img src="images/picto/defense.png" width="20">':($(tr).find('td').eq(2).text().includes('Patrouille')?'<img src="images/picto/ut.png" width="20">':'<img src="images/picto/zoneneutre.png" width="20">'))));
                    if(!imgcrois.includes('zoneneutre')) cntoqp++;
                    croiseurs += '<div class="row m-b-5" style="font-size:12px;border:double black;position:relative;min-height:25px;"><i class="addjme btn btn-alt btn-xs fa fa-minus myplus" style="position:absolute;top:0;left:0;z-index:1000;"></i><span class="addjme" style="display:none;position:absolute;top:0;left:35px;">'+imgcrois+'<a href="croiseur.php?id_croiseur='+id+'" target="fenetre" style="border-bottom:1px solid #428bca;border-image: linear-gradient(to right, green '+$(tr).find('td').eq(1).text().replace(' ','')+', red '+$(tr).find('td').eq(1).text().replace(' ','')/*((100-parseInt($(tr).find('td').eq(1).text().replace(' %','')))+'%')*/+') 100% 1;">'+type+' N° '+id+'</a></span><div class="row">';
                    croiseurs += '<div class="col-sm-3 col-sm-offset-2"><img src="'+$(tr).parents('table').first().prev().attr('src')+'" height="30"></div><div class="col-sm-7"><a class="btn btn-alt btn-xs" style="float:right;position:relative;top:1px;right:3px;" href="croiseur.php?id_croiseur='+id+'" target="fenetre">'+type+' N° '+$(tr).find('td').eq(0).find('a').first().text().split(' ')[1]+'</a></div></div>';
                    croiseurs += '<div>'+imgcrois+'&nbsp;&nbsp;'+$(tr).find('td').eq(2).html()+(imgcrois=='<img src="images/picto/zoneneutre.png" width="20">'?actions_croiseur(type,id):' <span class="temprest" data-crois_id="'+id+'"></span><a class="btn btn-alt btn-xs" style="float:right;position:relative;top:-3px;right:3px;" href="" target="fenetre">Annuler</a>')+'</div>';
                    croiseurs += '<div class="progress" style="position:relative;width:100%;"><div class="progress-bar" style="line-height:1.5;width:'+$(tr).find('td').eq(1).text().replace(' ','')+';"></div><div style="position:absolute;top:-2px;left:45%;font-size:smaller;">'+$(tr).find('td').eq(1).text()+'</div></div></div>';
                    if($(tr).find('td').eq(2).text().includes('Bombardement') || $(tr).find('td').eq(2).text().includes('Protection') || $(tr).find('td').eq(2).text().includes('Repli') || $(tr).find('td').eq(2).text().includes('Patrouille')) {
                        cntAjaxCall++;
                        $.ajax({
                            url:'croiseur.php?id_croiseur='+$(tr).find('td').eq(0).find('a').first().text().split(' ')[1],//call croiseur pour temps restant
                            type:'GET',
                            success:function(json) {
                                if(debug) { console.log('call croiseur.php '+$(json).find('#info h3').first().text()); }
                                if($(json).find('#ordre h2').first().text().includes('?')) {
                                    $('.temprest[data-crois_id="'+id+'"]').html('').next().replaceWith('<button data-crois="'+id+'" data-action="10" style="float:right;position:relative;top:-3px;right:3px;" class="btn anul btn-alt btn-xs launch_crois">Retour ZN</button>');
                                    call_trigger_launch_crois();
                                }else {
                                    //$('.temprest[data-crois_id="'+id+'"]').html($(json).find('#ordre h2').first().text());
                                    let tempstring = (Math.floor(parseInt($(json).find('#ordre h2').first().text().trim().split(' ')[1])/60).toString().padStart(2,'0')+':'+(parseInt($(json).find('#ordre h2').first().text().trim().split(' ')[1])%60).toString().padStart(2,'0'));
                                    $('.temprest[data-crois_id="'+id+'"]').html('<span style="font-family: \'digital dark system\', sans-serif;font-size:28px;color:black;position:relative;display:inline-block;">'+tempstring+'</span>');
                                    //let coresp = ['ze','un','de','tr','qu','ci','si','se','hu','ne'];
                                    //$('.temprest[data-crois_id="'+id+'"]').html('<span style="white-space:nowrap;"><div id="hour1"><div class="clck clcktop clck'+coresp[parseInt(tempstring.substr(0,1))]+'">&nbsp;</div><div class="clck clckbot clck'+coresp[parseInt(tempstring.substr(0,1))]+'">&nbsp;</div></div><div id="hour2"><div class="clck clcktop clck'+coresp[parseInt(tempstring.substr(1,1))]+'">&nbsp;</div><div class="clck clckbot clck'+coresp[parseInt(tempstring.substr(1,1))]+'">&nbsp;</div></div><div class="sep">'+tempstring.substr(2,1)+'</div><div id="min1"><div class="clck clcktop clck'+coresp[parseInt(tempstring.substr(3,1))]+'">&nbsp;</div><div class="clck clckbot clck'+coresp[parseInt(tempstring.substr(3,1))]+'">&nbsp;</div></div><div id="min2"><div class="clck clcktop clck'+coresp[parseInt(tempstring.substr(4,1))]+'">&nbsp;</div><div class="clck clckbot clck'+coresp[parseInt(tempstring.substr(4,1))]+'">&nbsp;</div></div></span>');
                                    if($(tr).find('td').eq(2).text().includes('Repli')) $('.temprest[data-crois_id="'+id+'"]').next().remove();
                                    else $('.temprest[data-crois_id="'+id+'"]').next().attr('href','croiseur.php?id_croiseur='+id+'&annuler=1').addClass('anul');
                                    if($(tr).find('td').eq(2).text().includes('Patrouille')) $('.temprest[data-crois_id="'+id+'"]').append(' x'+$(json).find('#ordre').get(0).childNodes[8].data.substr(0,3));
                                }
                                cntAjaxDone++;
                                if(cntAjaxDone==cntAjaxCall) resolve();
                            }
                        });
                    }else {
                        cntzn++;
                        if(cntzn>5 && get_stored('tools').autozn.active) {
                            envoi_zn(id);
                            cntzn--;
                        }
                    }
                });
                if(types.length) croiseurs = '<div id="filtercrois" style="display:flex;align-items:center;justify-content:space-evenly;margin-bottom:5px;">'+types.map(t=>'<span class="label label-success filtercrois" data-type="'+t+'">'+t+'</span>').join('')+'</div>'+croiseurs;
                let etat_types = []; let dis_crois = [];
                $("#insertcrois .myplus").each(function(i,v) { dis_crois[$(v).next('span').find('a').first().text().trim().split(' ')[2]] = $(v).hasClass('fa-plus'); });
                $(".filtercrois").each(function(i,v){ etat_types[$(v).data('type')] = $(v).hasClass('label-danger'); });
                $("#insertcrois").empty().html(croiseurs);
                $(".filtercrois").off('click').on('click',function(){ filtrecrois($(this).text()); });
                $(".filtercrois").each(function(i,v){ if(etat_types[$(v).data('type')]) $(v).trigger('click'); });
                $("#insertcrois").find('.btn-alt').addClass('btn-xs');
                $("#insertcrois").find('a[href^="detail.php"]').removeClass('btn btn-alt btn-xs').css('color','lightgreen');
                $('#insertcrois').children('div.row').each(function(i,c){
                    if($(c).find('a[onclick*="atelier.php"]').length>0) cntrep++;
                    $.each($(c).find('a[onclick*="atelier.php"]'),function(i,v){ $(v).text('Atelier').css('color','lightgreen').get(0).className=""; });
                    if($(c).find('img[src="images/picto/zoneneutre.png"]').length>0 && $(c).find('a[onclick*="atelier.php"]').length==0 && parseInt($(c).find('.progress-bar').css('width').replace('%',''))<100) cnttorep++;
                    //draggable code : triggers croiseurs
                    $(c).find('a').each(function(i,n) { n.setAttribute('draggable',false); });
                    $(c).get(0).setAttribute('draggable',true);
                    $(c).get(0).removeEventListener("dragstart",onDragStartCrois);
                    $(c).get(0).addEventListener("dragstart",onDragStartCrois);
                    $(c).get(0).removeEventListener("dragend",onDragEndCrois);
                    $(c).get(0).addEventListener("dragend",onDragEndCrois);
                });
                $("#cntZN").css("color",cntzn>5?'red':'green').css('border','1px solid '+(cntzn>5?'red':'green')).css('font-size','12px').css('padding','2px').text('ZN '+cntzn+'/5').popover({html:true,container:'body',trigger:'hover',placement:'bottom',content:'<span style="font-size:10px;">- '+cntrep+' croiseurs en réparation<br>- '+cnttorep+' croiseurs en attente de réparation<br>- '+cntoqp+' croiseurs occupés</span>'});
                $(".myplus").off('click').on('click',function(){
                    $(this).siblings().toggle();
                    if($(this).parent().find("select.sibl").css('display')=='block') $(this).parent().find("select.sibl").css('display','inline');
                    if($(this).hasClass('fa-plus')) $(this).removeClass('fa-plus').addClass('fa-minus');
                    else $(this).removeClass('fa-minus').addClass('fa-plus');
                });
                $("#insertcrois .myplus").each(function(i,v) { if(dis_crois[$(v).next('span').find('a').first().text().trim().split(' ')[2]]) $(v).trigger('click'); });
                /*if($('.x33slct').length>0) $('.x33slct').each(function(i,v) {
                    $(this).ddslick({
                        data: [
                            {text: "Hangar",value: "hangar",selected: false,description: "detruit les astros",imageSrc: "../images/arpenter/hangar.jpg"},//<option value="hangar" data-imagesrc="../images/arpenter/hangar.jpg" data-description="detruit les astros">H</option>
                            {text: "Ambassade",value: "ambass",selected: false,description: "rase l'ambassabe",imageSrc: "images/picto/ambassade.png"},//<option value="ambass" data-imagesrc="images/picto/ambassade.png" data-description="rase l'ambassabe">A</option>
                            {text: "brouilleur",value: "brou",selected: false,description: "detruit le brouilleur",imageSrc: "images/picto/brouilleur.png"},//<option value="brou" data-imagesrc="images/picto/brouilleur.png" data-description="detruit le brouilleur">B</option>
                            {text: "centre ville",value: "centre",selected: false,description: "tue les leaders",imageSrc: "images/picto/frappe.png"},//<option value="centre" data-imagesrc="images/picto/frappe.png" data-description="tue les leaders sans bouclier hors du spacioport">C</option>
                        ],
                        width: 20,
                        height: 20,
                        imagePosition: "left",
                        selectText: "",
                        onSelected: function (data) { console.log(data); }
                    });
                });*/
                call_trigger_launch_crois();
                if(cntAjaxCall==0) resolve();
            }
        });});
        //}
    }//recup les infos sur mes croiseurs perso (croiseurs.php (all) > croiseur.php (unique ID) - on stock rien) pour générer/maj le menu de gauche
    function maj_crois_unite(html) {
        let cntzn=0, cntrep=0, cntoqp=0, cnttorep=0;
        $("#insertcrois").children('div.row').each(function() {
            let id = $(this).find('a[href^="croiseur.php"]').first().attr("href").split('id_croiseur=')[1];
            if(id == $(html).find('#info h3').first().text().split('n° ')[1].trim()) {
                //get planete on/to
                let planetes = get_stored('planetes');
                let planet='';
                let bodytab = $(html).find('#ordre').first().text().split(' ');
                let repa = false;
                if(bodytab.length>0) {
                    $.each(bodytab,function(index,morceau) {
                        if(planetes.find(o=>o.nom==morceau)!=undefined) planet = '<a style="color:lightgreen;" href="detail.php?x='+planetes.find(o=>o.nom==morceau).x+'&y='+planetes.find(o=>o.nom==morceau).y+'" target="fenetre">'+morceau+'</a>';
                        if(morceau.includes('Atelier')) repa = true;
                    });
                }
                //vie
                $(this).find('div.progress-bar').first().css('width',$(html).find('.progress-bar').first().css('width')).next().text($(html).find('.progress-bar').first().css('width').replace('%',' %'));
                $(this).find('span.addjme a').first().css('border-image','linear-gradient(to right, #428bca '+$(html).find('.progress-bar').first().css('width')+', red '+(100-parseInt($(html).find('.progress-bar').first().css('width').replace('%','')))+') '+$(html).find('.progress-bar').first().css('width')+' 1');
                //activite
                if($(this).find('a[href^="croiseur.php"]').first().text().substr(0,3)!='X33') {
                    let acti = '';
                    let tempstring = (Math.floor(parseInt($(html).find('#ordre h2').first().text().trim().split(' ')[1])/60).toString().padStart(2,'0')+':'+(parseInt($(html).find('#ordre h2').first().text().trim().split(' ')[1])%60).toString().padStart(2,'0'));
                    if($(html).find('#ordre > img[src="images/picto/zoneneutre.png"]').length>0) {//croiseur est en ZN ou retourne en ZN
                        if($(html).find("#ordre h2").first().text().includes("Reste")){
                            acti = '<img src="'+$(this).find('span.addjme img').first().attr('src')+'" width="20">&nbsp;&nbsp;Repli en zone neutre... <span class="temprest" data-crois_id="'+id+'"><span style="font-family: \'digital dark system\', sans-serif;font-size:28px;color:black;position:relative;display:inline-block;">'+tempstring+'</span></span>';
                        } else {
                            acti = '<img src="images/picto/zoneneutre.png" width="20">&nbsp;&nbsp;'+(repa?'<a style="color:lightgreen;" href="javascript:;" onclick="ouvrefen(\'atelier.php\')">Atelier</a>':'En zone neutre')+actions_croiseur($(this).find('a[href^="croiseur.php"]').first().text().substr(0,3),id);
                            $(this).find('span.addjme img').first().attr('src','images/picto/zoneneutre.png');
                        }
                    }else if($(html).find('img[src="images/picto/defense.png"]').length>0) {//croiseur est en defense ou va en defense
                        if($(html).find("#ordre h2").first().text().includes("Reste")) acti = '<img src="images/picto/defense.png" width="20">&nbsp;&nbsp;Protection à '+planet+'&nbsp;<span class="temprest" data-crois_id="'+id+'"><span style="font-family: \'digital dark system\', sans-serif;font-size:28px;color:black;position:relative;display:inline-block;">'+tempstring+'</span></span><a class="btn anul btn-alt btn-xs" style="float:right;position:relative;top:-3px;right:3px;" href="croiseur.php?id_croiseur='+id+'&annuler=1" target="fenetre">Annuler</a>';
                        else acti = '<img src="images/picto/defense.png" width="20">&nbsp;&nbsp;Protection à '+planet+'<button data-crois="'+id+'" data-action="10" style="float:right;position:relative;top:-3px;right:3px;" class="btn anul btn-alt btn-xs launch_crois">Retour ZN</button>';
                        $(this).find('span.addjme img').first().attr('src','images/picto/defense.png');
                    }else if($(html).find('img[src="images/picto/bombarder.png"]').length>0) {//croiseur va bombarder ou a bombardé
                        if($(html).find("#ordre h2").first().text().includes("Reste")) acti = '<img src="images/picto/bombarder.png" width="20">&nbsp;&nbsp;Bombardement sur '+planet+'&nbsp;<span class="temprest" data-crois_id="'+id+'"><span style="font-family: \'digital dark system\', sans-serif;font-size:28px;color:black;position:relative;display:inline-block;">'+tempstring+'</span></span><a class="btn anul btn-alt btn-xs" style="float:right;position:relative;top:-5px;right:3px;" href="croiseur.php?id_croiseur='+id+'&annuler=1" target="fenetre">Annuler</a>';
                        $(this).find('span.addjme img').first().attr('src','images/picto/bombarder.png');
                    }else {//Croiseur en patrouille
                        if($(html).find("#ordre h2").first().text().includes("Reste")) acti = '<img src="images/picto/ut.png" width="20">&nbsp;&nbsp;Patrouille en cours... <span class="temprest" data-crois_id="'+id+'"><span style="font-family: \'digital dark system\', sans-serif;font-size:28px;color:black;position:relative;display:inline-block;">'+tempstring+'</span> x'+($(html).find('#ordre span').length==2?$(html).find('#ordre span').eq(1).text().substr(0,3):$(html).find('#ordre').get(0).childNodes[8].data.substr(0,3))+'</span><a class="btn anul btn-alt btn-xs" style="float:right;position:relative;top:-3px;right:3px;" href="croiseur.php?id_croiseur='+id+'&annuler=1" target="fenetre">Annuler</a>';
                        else acti = '<img src="images/picto/ut.png" width="20">&nbsp;&nbsp;Patrouille en cours...';
                        $(this).find('span.addjme img').first().attr('src','images/picto/ut.png');
                    }
                    $(this).children('div').eq(1).empty().append(acti);
                }
                call_trigger_launch_crois();
            }
            if($(this).find('span.addjme img').first().attr('src').includes('zoneneutre')) cntzn++;
            if(cntzn>5 && get_stored('tools').autozn.active) { envoi_zn(id); cntzn--; }
            $('#insertcrois').children('div.row').each(function(i,c){
                if($(c).find('img[src="images/picto/zoneneutre.png"]').length==0) cntoqp++;
                else if($(c).find('a[onclick*="atelier.php"]').length>0) cntrep++;
                else if($(c).find('img[src="images/picto/zoneneutre.png"]').length>0 && $(c).find('a[onclick*="atelier.php"]').length==0 && parseInt($(c).find('.progress-bar').css('width').replace('%',''))<100) cnttorep++;
            });
            $("#cntZN").css("color",cntzn>5?'red':'green').css('border','1px solid '+(cntzn>5?'red':'green')).css('font-size','12px').css('padding','2px').text('ZN '+cntzn+'/5').popover({html:true,container:'body',trigger:'hover',placement:'bottom',content:'<span style="font-size:10px;">- '+cntrep+' croiseurs en réparation<br>- '+cnttorep+' croiseurs en attente de réparation<br>- '+cntoqp+' croiseurs occupés</span>'});
        });
    }//recup les infos sur mes croiseurs perso (depuis les infos du menu gauche deja créé > croiseur.php (unique ID) - on stock rien) pour mettre à jour un seul element du menu de gauche
    function explore(lead_id){
        let leaders = get_stored('leaders');
        $.ajax({
            url:'leader.php',
            type:'POST',
            data:{id_leader:lead_id, action:2 },
            success:function(htmlresp) {
                leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.id===lead_id).activite = 'Prospection';
                set_stored('leaders',leaders);
                mnotify('alert alert-success',htmlresp.split("alert-success'>")[1].split('</div')[0]);
            }
        });
    }//plus utilisé (old tools)
    function mouv_lead(planetes,leaders,lead,tools) {
        $.ajax({
            url:'leader.php',
            type:'POST',
            data:{id_leader:lead.id, action:1,planete:tools.automouv.leaders.find(o=>o.id==lead.id).dest},
            //dataType:"html",
            success:function(htmlresp) {
                if(htmlresp.includes('alert-success')) {
                    leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.id===lead.id).activite = 'Transfert à <a target="fenetre" href="detail.php?x='+(planetes.find(o=>o.nom==tools.automouv.leaders.find(o=>o.id==lead.id).dest.split('-')[2])!=undefined?planetes.find(o=>o.nom==tools.automouv.leaders.find(o=>o.id==lead.id).dest.split('-')[2]).x:'?')+'&y='+(planetes.find(o=>o.nom==tools.automouv.leaders.find(o=>o.id==lead.id).dest.split('-')[2])!=undefined?planetes.find(o=>o.nom==tools.automouv.leaders.find(o=>o.id==lead.id).dest.split('-')[2]).y:'?')+'">'+tools.automouv.leaders.find(o=>o.id==lead.id).dest.split('-')[2]+'</a>';
                    set_stored('leaders',leaders);
                    tools.automouv.leaders.find(o=>o.id==lead.id).active = false;
                    tools.automouv.leaders.find(o=>o.id==lead.id).dest = null;
                    set_stored('tools',tools);
                    $('#ll_automouv input[value="'+lead.id+'"]').prop('checked',false);
                    $("#ll_automouv #"+lead.id).val(null);
                    mnotify('alert alert-success',htmlresp.split("alert-success'>")[1].split('</div>')[0]);
                }
            }
        });
    }//plus utilisé (old tools)
    function propo_tournee(leadid){
        let nomPl = $("div.s-widget").eq(1).find('a[href^="leader.php?id_leader='+leadid+'"]').parent().next().find('a[href^="detail.php"]').first().text().trim();
        let res = [];
        let tempor = [];
        let other = [];
        let mine = [];
        let parsec = 0;
        //rempli les tableau d'offres en or (tempor), d'offres en autres (other), et de mes planetes (mine)
        $.each(get_stored('planetes'),function(i,p) {
            if(p.offre) {
                if(p.offre.includes('or')) tempor.push([p.nom,p.offre]);
                else other.push([p.nom,p.offre]);
            }
            if(p.proprio==localStorage.playerName) mine.push(p.nom);
        });
        //other = other.sort(function(a,b){return (parseInt(a[1].split(' ')[1])-parseInt(a[1].split(' ')[4]))<(parseInt(b[1].split(' ')[1])-parseInt(b[1].split(' ')[4]))?-1:1});//trié par gain (diff(offre-demande))
        //rempli le tableau de resultat (res)
        while(res.length<5) {
            let cur;
            if(tempor.length>0) {
                cur = tempor.sort(function(a,b){return calcul_parsec(a[0],nomPl)<calcul_parsec(b[0],nomPl)?-1:1;}).splice(0,1)[0];
                let pcur = get_stored('planetes').find(o=>o.nom==cur[0]);
                if($("#fenetre").contents().find('select[name^="com"]').first().find('option[value="'+pcur.x+'-'+pcur.y+'-'+pcur.nom+'-'+pcur.offre.split(' ')[2]+'-'+pcur.offre.split(' ')[1]+'-'+pcur.offre.split(' ')[5]+'-'+pcur.offre.split(' ')[4]+'"]').length>0) {
                    parsec += calcul_parsec(cur[0],nomPl);
                    nomPl = cur[0];
                    res.push(cur);
                }//sinon c'est que l'offre est réservé
            } else {
                let cur = other.sort(function(a,b){return calcul_parsec(a[0],nomPl)<calcul_parsec(b[0],nomPl)?-1:1;}).splice(0,1)[0];
                let pcur = get_stored('planetes').find(o=>o.nom==cur[0]);
                if($("#fenetre").contents().find('select[name^="com"]').first().find('option[value="'+pcur.x+'-'+pcur.y+'-'+pcur.nom+'-'+pcur.offre.split(' ')[2]+'-'+pcur.offre.split(' ')[1]+'-'+pcur.offre.split(' ')[5]+'-'+pcur.offre.split(' ')[4]+'"]').length>0) {
                    parsec += calcul_parsec(cur[0],nomPl);
                    nomPl = cur[0];
                    res.push(cur);
                }//sinon c'est que l'offre est réservé
            }
        }
        //s'appuie sur le tableau de resultat pour alimenter les selectbox
        $.each(res,function(i,r) {
            let p = get_stored('planetes').find(o=>o.nom==r[0]);
            $("#fenetre").contents().find('select[name^="com"]').eq(i).val(p.x+'-'+p.y+'-'+p.nom+'-'+p.offre.split(' ')[2]+'-'+p.offre.split(' ')[1]+'-'+p.offre.split(' ')[5]+'-'+p.offre.split(' ')[4]);
        });
        //renseigne la planete de dechargement
        let p = get_stored('planetes').find(o=>o.nom==mine.sort(function(a,b){return calcul_parsec(a,nomPl)<calcul_parsec(b,nomPl)?-1:1;})[0]);
        $("#fenetre").contents().find('select[name^="com"]').eq(5).val(p.x+'-'+p.y+'-'+p.nom);
        //affiche le temps prévu
        parsec += calcul_parsec(mine[0],nomPl);
        $("#fenetre").contents().find('#tempstournee').text((parsec/10)+' heures');
        //declenche le draw des LeaderLine
        $("#fenetre").contents().find('select[name^="com"]').trigger('change');
        $("#loader").css('display','none');
    }
    function get_cible(val,affiche=false) {
        let llop = get_stored('planetes').find(o=>o.nom==val.split('-')[2]).leaders.find(p=>!p.includes(localStorage.playerName));
        return llop===undefined?undefined:get_stored('leaders').find(o=>o.player==llop.split('(')[1].split(')')[0].trim()).leaders.find(p=>p.nom==llop.split('(')[0].trim())[affiche?'nom':'id'];
    }
    function call_lead(data,planet) {
        return new Promise((resolve,reject)=>{
        let affcible = '';
        if(data.action==3) {
            affcible = get_cible(data.cible,true);
            data.cible = get_cible(data.cible,false);
        }
        if(debug) console.log('call leader action auto '+JSON.stringify(data));
        $.ajax({
            url:'leader.php',
            type:'POST',
            data:data,
            async:false,
            success:function(htmlresp) {
                let leaders = get_stored('leaders');
                if(htmlresp.includes('alert(')) { mnotify('alert alert-danger',htmlresp.split('alert(')[1].split(')')[0],5000); resolve(); }
                else if(htmlresp.includes('Mission annul')) {
                    let last = leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).visited.slice(-1)[0]
                    leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?' à '+last.split(' Le')[0]:' à <a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                    set_stored('leaders',leaders);
                    mnotify('alert alert-info','Mission annulée',2000);
                    maj_lead(false,data.id_leader).then(data=>resolve(),data=>reject());
                }
                else if(htmlresp.includes('alert-success') || htmlresp.includes('alert-info')) {
                    //si on lance une explo alors qu'on connait toutes les planetes, on supprime l'explo sur tous les leaders (coupe la boucle d'explo continue)
                    if(data.action==2 && htmlresp.includes("il n'y a pas d'autres planètes dans ce secteur")) {
                        $.each(leaders.find(o=>o.player==localStorage.playerName).leaders,function(i,l){
                            $.each(l.automat.action,function(j,a) {
                                if(a.acte==2) leaders.find(o=>o.player==localStorage.playerName).leaders[i].automat.action.splice(j,1);
                            });
                        });
                    }
                    if(data.action==3) leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.id===data.id_leader).automat.killing = affcible;
                    if(['1','2'].includes(data.action) &&!leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).visited.slice(-1)[0].includes(' Le ')) leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).visited.splice(-1,1,leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).visited.slice(-1)[0]+' Le '+new Date(Date.now()).toLocaleString());
                    leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).activite = data.action?((data.action==1?'Transfert':(data.action==2?'Prospection':(data.action==3?'Assassinat':(data.action==4?'Tournée marchande':(data.action==5?'Construction brouilleur':(data.action==10?'Etablissement Ambassade':(data.action==11?'Démantèlement ambassade':'')))))))+(![2,4].includes(data.action)?(data.action==1?' vers ':' à ')+'<a style="color:lightgreen;" target="fenetre" href="detail.php?x='+(data.action!=1?(planet.x+'&y='+planet.y+'">'+planet.nom):(data.planete.split('-')[0]+'&y='+data.planete.split('-')[1]+'">'+data.planete.split('-')[2]))+'</a>':'')):'Politique à <a'+leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==data.id_leader).visited.slice(-1)[0].split('<a')[1].split('</a')[0]+'</a>';
                    set_stored('leaders',leaders);
                    let div = false;
                    $.each($(htmlresp),function(i,o){ if(o.localName=='div') div = o; });
                    mnotify($($(div)[0]).get(0).className,$($(div)[0]).get(0).innerHTML,3000);
                    if($("#fenetre").contents().find('input[name="id_leader"]').first().val()==data.id_leader) {
                        window.frames.fenetre.src = 'leader.php?id_leader='+data.id_leader
                        resolve();
                    }else maj_lead(false,data.id_leader).then(data=>resolve());
                }else {
                    mnotify('alert alert-danger','What happend ?',5000);
                    reject();
                }
            }
        });});
    }
    function traite_next(lead,planet) {
        let leaders = get_stored('leaders');
        let action_to_launch = lead.automat.action.find(a=>{a.quand && (a.quand-Date.now()<=0)}) != undefined?lead.automat.action.splice(lead.automat.action.findIndex(a=>{a.quand && (a.quand-Date.now()<=0)}),1)[0]:(lead.automat.action[0].acte==2 && lead.automat.action[0].wait==-1?lead.automat.action.slice(0,1)[0]:leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).automat.action.splice(0,1)[0]);
        set_stored('leaders',leaders);
        if(action_to_launch.acte==99) {
            let lc = leaders.find(o=>o.player==localStorage.playerName).leaders.find(l=>l.nom==action_to_launch.cible);
            if(lead.activite.split('>')[1].split('</a')[0].trim() == lc.activite.split('>')[1].split('</a')[0].trim() && lead.objets.length>0) for(let ind=0;ind<lead.objets.length;ind++) { let ob = lead.objets[ind]; if(ob) {//$.each(lead.objets,function(ind,ob) {
                $.ajax({url:'leader.php',type:'POST',async:false,data:{id_leader:lead.id,action:13},success:function(r1) {
                    $.ajax({url:'arpenter.php',type:'POST',async:false,data:{id_leader:lead.id,voirleader:lc.id},success:function(r2) {
                        $.ajax({url:'arpenter.php',type:'POST',async:false,data:{id_leader:lead.id,id_cible:lc.id,objet:ob.nom.replace(' ','+'),donnerobjet:1},success:function(r3) {
                            let leaders = get_stored('leaders');
                            if(parseInt(ob.qte)>1) {
                                ob.qte = parseInt(ob.qte)-1;
                                lead.objets[ind] = ob;
                            } else {
                                lead.objets.splice(ind,1);
                                ind--;//?
                            }
                            leaders.find(o=>o.player==localStorage.playerName).leaders[leaders.find(o=>o.player==localStorage.playerName).leaders.findIndex(l=>l.id==lead.id)] = lead;
                            set_stored('leaders',leaders);
                        }});
                    }});
                }});
            }}//);
        }else {
            let data = {id_leader:lead.id,action:action_to_launch.acte};
            if(action_to_launch.acte==1) data.planete = action_to_launch.cible;
            else if(action_to_launch.acte==3) data.cible = action_to_launch.cible;
            if(!planet.conflit && ((action_to_launch.acte==2 && get_stored('tools').autoexplo.active) || (action_to_launch.acte==3 && get_cible(action_to_launch.cible,false)===undefined))){
                $.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id,action:13},//on arpente pour générer la news contenant les objets à acheter ou pour enregistrer l'id des leaders present
                    success:function(resp) {
                        if(action_to_launch.acte==2) {
                            init = true;
                            if(document.getElementById('lamap')) document.getElementById('lamap').contentWindow.location.reload(true);//raffraichir la map fait apparaitre la nouvelle news et l'enregistre
                        }
                        call_lead(data,planet).then(data=>{ init=false; });
                    }
                });
            }else if(action_to_launch.acte==4) {
                document.getElementById('fenetre').src = "marchand.php?id_leader="+lead.id;
                propo_tournee(lead.id);
                //TODO:
                //trigger click sur estimer
                //trigger click sur valider
            } else {call_lead(data,planet);}
        }
    }
    function add_list_ordre(lead,content,del) {
        let translat = {'1':'deplacement','2':'exploration','3':'assassinat','4':'tournée','5':'construction brouilleur','10':'construction ambassade','11':'démantèlement ambassade','99':'Donner objets'};
        if((lead.automat.active || del) && lead.automat.action.length>0) {
            content += '<ol '+(del?'>':'style="padding-left:15px;">');
            $.each(lead.automat.action,function(i,a){
                content +='<li>'+(a.cancel?'<span style="color:red;">Top Priorité</span> ':(a.quand?'Le '+new Date(a.quand).toLocaleString()+' ':(a.wait && a.wait != -1?(a.wait===true?'après putsch, ':'dès '+a.wait+'% pol atteint, ')+(parseInt(a.preserve)>0?(a.preserve==1?'- seulement si ennemi ':'- seulement si neutre '):'')+(a.quicky?'et si rapide ':''):'sans politiser, ')))+translat[a.acte]+(a.acte==3 && get_cible(a.cible,true)!==undefined?" de "+get_cible(a.cible,true):(a.acte==2 && a.wait=="-1"?' continue':''))+(a.acte!=2 && a.cible?(a.acte==99?(' à '+a.cible):((a.acte==1?' vers ':' sur ')+'<a href="detail.php?x='+get_stored('planetes').find(o=>o.nom==a.cible.split('-')[2]).x+'&y='+get_stored('planetes').find(o=>o.nom==a.cible.split('-')[2]).y+'" target="fenetre" style="color:lightgreen;">'+a.cible.split('-')[2]+'</a>')):'')+(del?'<button data-ind="'+i+'" class="dellordre_'+lead.id+'" style="background-color:#d9534f;"><i class="fa fa-trash"></i></button>':'')+'</li>';
            });
            content += '</ol>';
        }else content += '<span class="err" style="color:red;">Aucun ordre en attente</span>';
        return content;
    }
    function action_fdr(idl,type,elem){
        let l1 = get_stored('leaders');
        let l1p = l1.findIndex(o=>o.player==localStorage.playerName);
        let l1i = l1[l1p].leaders.findIndex(o=>o.id==idl);
        if(debug) console.log(type+' '+idl);
        if(type=="active") {
            l1[l1p].leaders[l1i].automat.active = $(elem).children().hasClass('fa-check');
            if($(elem).css('background-color','#d9534f').children().hasClass('fa-check')) $(elem).children().removeClass('fa-check').addClass('fa-times');
            else $(elem).css('background-color','#5cb85c').children().removeClass('fa-times').addClass('fa-check');
        }
        if(type=="delete") l1[l1p].leaders[l1i].automat.action.splice(parseInt($(elem).data('ind')),1);
        if(type=="add") {
            if($("#modal-lead_"+idl+" select[name='wait']").val()=="") alert("Choisir l'attente (temps passé à politiser)");
            else if($("#modal-lead_"+idl+" select[name='action']").val()=="") alert("Choisir l'action");
            else if(($("#modal-lead_"+idl+" select[name='action']").val()==1 && $("#modal-lead_"+idl+" select[name='cible']").val()=="")||($("#modal-lead_"+idl+" select[name='action']").val()==99 && $("#modal-lead_"+idl+" select[name='lc']").val()=="")) alert("Choisir la cible");
            else {
                if(!l1[l1p].leaders[l1i].automat.active) {
                    l1[l1p].leaders[l1i].automat.active = true;
                    $(elem).parent().parent().find('button[id^="activ_"] i').first().removeClass('fa-check').addClass('fa-times').parent().css('background-color','#d9534f');
                }
                l1[l1p].leaders[l1i].automat.action.push({
                    acte:$("#modal-lead_"+idl+" select[name='action']").val()=="2b"?"2":$("#modal-lead_"+idl+" select[name='action']").val(),
                    wait:$("#modal-lead_"+idl+" select[name='action']").val()=="2b"?-1:($("#modal-lead_"+idl+" select[name='wait']").val()=="2"?($("#modal-lead_"+idl+" input[name='pol']").val()<=10?10:($("#modal-lead_"+idl+" input[name='pol']").val()>=100?100:$("#modal-lead_"+idl+" input[name='pol']").val())):($("#modal-lead_"+idl+" select[name='wait']").val()=="1"?true:false)),
                    cible:$("#modal-lead_"+idl+" select[name='action']").val()==99?$("#modal-lead_"+idl+" select[name='lc']").val():$("#modal-lead_"+idl+" select[name='cible']").val(),
                    quicky:$("#modal-lead_"+idl+" select[name='quicky']").is(':checked')?true:false,
                    preserve:$("#modal-lead_"+idl+" select[name='preserve']").val(),
                    cancel:$("#modal-lead_"+idl+" select[name='wait']").val()=="-1"?true:false,
                    quand:$("#modal-lead_"+idl+" select[name='wait']").val()=="3"?($("#modal-lead_"+idl+" input[name='type']").val()=="date"?Date.parse($("#modal-lead_"+idl+" input[name='jour']").val()+' '+$("#modal-lead_"+idl+" input[name='heure']").val()):(Date.now()+($("#modal-lead_"+idl+" input[name='heure']").val().split(':')[0]*60*60*1000)+($("#modal-lead_"+idl+" input[name='heure']").val().split(':')[1]*60*1000))):false
                });
                $("#modal-lead_"+idl+" select[name='wait']").val('')
                $("#modal-lead_"+idl+" select[name='action']").val('');
                $("#modal-lead_"+idl+" select[name='cible']").val('');
                $("#modal-lead_"+idl+" select[name='lc']").val('');
                $("#modal-lead_"+idl+" input[name='heure']").val('00:00');
                $("#modal-lead_"+idl+" input[name='jour']").val(new Date(Date.now()).toISOString('en-US',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit'}).substr(0,10));
            }
        }
        set_stored('leaders',l1);
        $("#modal-lead_"+idl+" #list_"+idl).first().empty().append(add_list_ordre(l1[l1p].leaders[l1i],'',true));
        $(".dellordre_"+idl).off('click').on('click',function() { action_fdr(idl,'delete',this); });
    }
    function feuille_de_route(lead,nomPl,temps,annulable,nodetext,tournee){
        let content = '';
        let planet = get_stored('planetes').find(o=>o.nom==nomPl);
        let action = lead.automat.action.length?(lead.automat.action.find(a=>a.quand && parseInt(a.quand)-Date.now()<=0)? lead.automat.action.find(a=>a.quand && parseInt(a.quand)-Date.now()<=0) : lead.automat.action.filter(a=>!a.quand || (a.quand && parseInt(a.quand)-Date.now()>0)).slice(0,1)[0]):null;
        if(lead.activite.toLowerCase().includes('politique')){
            let pol = planet.pol.find(o=>o.player==localStorage.playerName)!=undefined?parseInt(planet.pol.find(o=>o.player==localStorage.playerName).pol.replace('%','')):0;
            let futur_pol = pol+(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation') && planet.pol.find(o=>o.player=='Neutre')!=undefined?parseInt(planet.pol.find(o=>o.player=='Neutre').pol.replace('%','')):10);
            if(futur_pol>100) futur_pol = 100;
            if(lead.automat.active && action!=null) {
                if((!action.wait && !action.quand) || (!action.wait && action.quand && parseInt(action.quand)-Date.now()<=0) || (Number.isInteger(action.wait) && pol >= parseInt(action.wait)) || (action.wait===true && planet.proprio==localStorage.playerName)) {
                    //on change d'action, on a atteint le but
                    content = "Je m'en vais commencer ma prochaine action !";
                    traite_next(lead,planet);
                } else if((action.wait===true && futur_pol >= (100-(Math.floor(parseInt(lead.xp.politique)/10)*10))) || (Number.isInteger(action.wait) && futur_pol >= parseInt(action.wait)))
                    //l'action sera terminé au prochain cycle
                    content = (Number.isInteger(action.wait)?"J'aurais atteins "+action.wait+"% de pol sur ":"J'aurais pris le contrôle de ")+"<a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a>"+(' dans '+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min');
                else {
                    let nb_cycle = 0;
                    while((Number.isInteger(action.wait) && (futur_pol+(nb_cycle*10)) < parseInt(action.wait)) && (action.wait===true && (futur_pol+(nb_cycle*10)) < (100-(Math.floor(parseInt(lead.xp.politique)/10)*10)))) {
                        nb_cycle++;
                    }
                    //l'action sera terminé dans :
                    content = "J'en aurais pas fini sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> avant encore "+(temps>=60?(parseInt(temps/60)+(8*nb_cycle))+'h ':(8*nb_cycle)+'h ')+parseInt(temps%60)+'min';
                }
            }else {
                if(temps==9999) content = "J'ai vraiment plus rien à foutre sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a>";
                else if(planet.proprio!=localStorage.playerName && futur_pol >= (100-(Math.floor(parseInt(lead.xp.politique)/10)*10))) content = "Je renverserai le régime sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min';
                else if(planet.proprio==localStorage.playerName) content = "Je gagnerai "+(futur_pol-pol)+"% de politique sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min';
                else {
                    let nb_cycle = 0;
                    while((futur_pol+(nb_cycle*10)) < (100-(Math.floor(parseInt(lead.xp.politique)/10)*10))) {
                        nb_cycle++;
                    }
                    content = "Je continue à politiser doucement <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> ... "+futur_pol+"% dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min'+", putch dans "+(temps>=60?(parseInt(temps/60)+(8*nb_cycle))+'h ':(8*nb_cycle)+'h ')+parseInt(temps%60)+'min';
                }
            }
        }else if(lead.activite.toLowerCase().includes('transfert')) {
            //le transfert est découpé en 2 phases (sauf pour E1/M qui n'ont que la 2eme) : 1ere = decolage avant saut annulable puis 2eme = atterissage apres saut non annulable
            if(lead.automat.active && action!=null && !action.wait){
                if(annulable && action.cancel) {
                    //on doit annuler pour passer a la suite
                    content = "Je vais annuler mon tranfert et passer à la suite.";
                    call_lead({id_leader:lead.id,annuler:1},null);
                    /*$.ajax({
                        url:'leader.php',
                        type:'POST',
                        data:{id_leader:lead.id,annuler:1},
                        success:function(rep) {
                            let last = lead.visited.slice(-1)[0]
                            let l = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:'<a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                            set_stored('leaders',l);
                            mnotify('alert alert-info',$(rep).get(16).data,5000);
                            document.getElementById('fenetre').src = "leader.php?id_leader="+lead.id;
                        }
                    });*/
                } else content = "Je vais attendre de me poser sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> dans "+(temps>=60?(parseInt(temps/60)+(annulable?2:0))+'h ':(annulable?'2h ':''))+parseInt(temps%60)+"min avant de passer à la suite.";
            } else content = "Je me poserai sur <a href='detail.php?x="+planet.x+"&y="+planet.y+"' target='fenetre' style='color:lightgreen;'>"+planet.nom+"</a> dans "+(temps>=60?(parseInt(temps/60)+(annulable?2:0))+'h ':(annulable?'2h ':''))+parseInt(temps%60)+'min';
        }else if(lead.activite.toLowerCase().includes('assassin')) {
            //l'assassinat est decoupé en 2 phases : 1ere = repérage (environ 16h sans xp, 15min--/xp, annulable) puis 2eme = assassinat (8h incompressible non annulable)
            if(annulable && (planet.leaders.find(o=>o.includes(lead.automat.killing))===undefined || (lead.automat.active && action!=null && !action.wait && action.cancel))) {
                //on doit annuler pour passer a la suite
                content = "Je devais assassiner "+lead.automat.killing+(planet.leaders.find(o=>o.includes(lead.automat.killing))===undefined?" mais je l'ai raté !":" mais apparemment y'a plus urgent !")+" Cette mission est annulée, je passe à la suite.";
                call_lead({id_leader:lead.id,annuler:1},null);
                /*$.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id,annuler:1},
                    success:function(rep) {
                        let last = lead.visited.slice(-1)[0]
                        let l = get_stored('leaders');
                        l.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:'<a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                        l.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).killing = false;
                        set_stored('leaders',l);
                        mnotify('alert alert-info',$(rep).get(16).data,5000);
                        document.getElementById('fenetre').src = "leader.php?id_leader="+lead.id;
                    }
                });*/
            }else {
                if(annulable && (lead.automat.active && action!=null && !action.wait && !action.cancel)) content = "Je pourrais annuler, mais je préfère aller jusqu'au bout : ";
                content += "Je suis sur les pas de "+lead.automat.killing+". Si tout se passe bien, je lui aurais reglé son compte dans "+(temps>=60?(parseInt(temps/60)+(annulable?8:0))+'h ':(annulable?'8h ':''))+parseInt(temps%60)+'min';
            }
        }else if(lead.activite.toLowerCase().includes('prospection')) {
            //la prospection est découpé en 2 phases: 1ere = decolage avant saut annulable la 1ere fois mais echouable et donc repetable sans pouvant etre annule par la suite, puis 2eme = atterissage si succes du saut non annulable
            if(annulable && temps<100 && lead.automat.active && action!=null && !action.wait && action.cancel) {
                content = "Je partais en exploration mais je suis rappelé à la base avec de nouveaux ordres.";
                //on doit annuler pour passer a la suite
                call_lead({id_leader:lead.id,annuler:1},null);
                /*$.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id,annuler:1},
                    success:function(rep) {
                        let last = lead.visited.slice(-1)[0]
                        let l = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:'<a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                        set_stored('leaders',l);
                        mnotify('alert alert-info',$(rep).get(16).data,5000);
                        document.getElementById('fenetre').src = "leader.php?id_leader="+lead.id;
                    }
                });*/
            }else {
                if(annulable && temps<100 && lead.automat.active && action!=null && !action.wait && !action.cancel) content = "Je pourrais annuler, mais je suis trop excité ! : ";
                content += "Je pars en exploration ! "+(annulable?("Je vais tenter mon premier saut dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min'):(nodetext.includes('Bingo')?(" J'ai trouvé une destination ! Je m'y poserai dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min'):("J'ai raté mon saut ! J'en retente un dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+"min, je n'arriverai pas avant au moins "+(temps>=60?(parseInt(temps/60)+2)+'h ':'2h ')+parseInt(temps%60)+'min')));
            }
        }else if(lead.activite.toLowerCase().includes('marchand')) {
            content = "Tournée en cours<ul style='padding-left:15px;margin-bottom:0;'>";
            $.each($(tournee).find('li:not(li:last)'),function(){ var a=this; $.each($(this).get(0).childNodes,function(j,n) { if(n.nodeName=='B') content += "<li>"+find_nom_pl(n.innerText)+" &rarr; "+$(a).get(0).childNodes[j+1].data.split(' ')[2]+"h "+$(a).get(0).childNodes[j+1].data.split(' ')[4]+" ("+$(a).get(0).childNodes[j+1].data.split(' ')[7]+$(a).get(0).childNodes[j+1].data.split(' ')[9]+")</li>"; }); });
            $.each($(tournee).find('li:last').first().get(0).childNodes,function(j,n) { if(n.nodeName=='B') content += "<li>"+find_nom_pl(n.innerText)+" &rarr; "+$(tournee).find('li:last').first().get(0).childNodes[j+1].data.split(' ')[2]+"h "+$(tournee).find('li:last').first().get(0).childNodes[j+1].data.split(' ')[4]+" (déchargement)</li>"; });
            content+= '</ul>';
        }else if(lead.activite.toLowerCase().includes('ambassade')) {
            if(annulable && lead.automat.active && action!=null && !action.wait && action.cancel) {
                content = "La construction de l'ambassade avançait bien mais je pose ma truelle pour suivre les nouveaux ordres.";
                //on doit annuler pour passer a la suite
                call_lead({id_leader:lead.id,annuler:1},null);
                /*$.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id,annuler:1},
                    success:function(rep) {
                        let last = lead.visited.slice(-1)[0]
                        let l = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:'<a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                        set_stored('leaders',l);
                        mnotify('alert alert-info',$(rep).get(16).data,5000);
                        document.getElementById('fenetre').src = "leader.php?id_leader="+lead.id;
                    }
                });*/
            }else {
                if(annulable && lead.automat.active && action!=null && !action.wait && !action.cancel) content = "Je pourrais annuler, mais j'aime pas perdre du temps. ";
                content += "J'aurais fini la construction de l'ambassade sur <a href=\"detail.php?x="+planet.x+"&y="+planet.y+"\" target=\"fenetre\" style=\"color:lightgreen;\">"+nomPl+"</a> dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min';
            }
        }else if(lead.activite.toLowerCase().includes('démantèlement')) {
            if(annulable && lead.automat.active && action!=null && !action.wait && action.cancel) {
                content = "Le démantèlement de l'ambassade avançait bien mais je pose ma masse pour suivre les nouveaux ordres.";
                //on doit annuler pour passer a la suite
                call_lead({id_leader:lead.id,annuler:1},null);
                /*$.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id,annuler:1},
                    success:function(rep) {
                        let last = lead.visited.slice(-1)[0]
                        let l = get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==lead.id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:'<a style="color:lightgreen;" href="detail.php?x='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).x+'&y='+get_stored('planetes').find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                        set_stored('leaders',l);
                        mnotify('alert alert-info',$(rep).get(16).data,5000);
                        document.getElementById('fenetre').src = "leader.php?id_leader="+lead.id;
                    }
                });*/
            }else {
                if(annulable && lead.automat.active && action!=null && !action.wait && !action.cancel) content = "Je pourrais annuler, mais je fini toujours un boulot jusqu'au bout. ";
                content += "J'aurais fini le démantèlement de l'ambassade sur <a href=\"detail.php?x="+planet.x+"&y="+planet.y+"\" target=\"fenetre\" style=\"color:lightgreen;\">"+nomPl+"</a> dans "+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'min';
            }
        }
        return content;
    }
    $('body').append('<div id="popprixmod" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="eLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" style="width:200px;" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" style="display:inline;" id="eLabel">Choisir</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div><div class="modal-footer"><button id="popprixcan" type="button" class="btn btn-alt" data-dismiss="modal">Annuler</button><button id="popprixval" type="button" class="btn btn-alt agit">Valider</button></div></div></div></div>');
    $("#popprixval").on('click',function() {
        if($("#popprixsel").val()) {
            if($("#popprixtype").val()=='sell') {
                $.ajax({
                    url:'holo-vente.php',
                    type:'POST',
                    data:{id_leader:$("#popprixleadid").val(),objet:$("#popprixobj").val(),achat:0,prix:$("#popprixsel").val()},
                    success:function(resp) {
                        let node = '';
                        let obj = '';
                        $(resp).each(function() {
                            if(this.nodeName=='DIV' && this.className.includes('alert-success')) node=this;
                            if(this.nodeName=='#text' && this.data.includes('Objet : ')) obj=this.data.split(': ')[1];
                        });
                        if(obj!='') {
                            let l = get_stored('leaders');
                            let obj2delIndex = l.find(j=>j.player==localStorage.playerName).leaders.find(le=>le.id==$("#popprixleadid").val()).objets.findIndex(o=>o.nom==obj);
                            if(obj2delIndex!=-1) {
                                let obj2del = l.find(j=>j.player==localStorage.playerName).leaders.find(le=>le.id==$("#popprixleadid").val()).objets[obj2delIndex];
                                if(parseInt(obj2del.qte)>1) l.find(j=>j.player==localStorage.playerName).leaders.find(le=>le.id==$("#popprixleadid").val()).objets[obj2delIndex].qte = parseInt(obj2del.qte)-1;
                                else l.find(j=>j.player==localStorage.playerName).leaders.find(le=>le.id==$("#popprixleadid").val()).objets.splice(obj2delIndex,1);
                                set_stored('leaders',l);
                            }
                        }
                        mnotify(node.className,node.innerText,3000);
                        $("#popprixmod").modal('hide');
                    }
                });
            }
            else if($("#popprixtype").val()=='astro') {
                let ptemp = get_stored('planetes').find(p=>p.nom==$("#popprixplanto").val());
                lancer_flotte(get_stored('planetes').findIndex(o=>o.nom==$("#popprixplanfrom").val()),true,{cible:ptemp.x+'-'+ptemp.y+'-'+ptemp.nom+'-'+calcul_parsec($("#popprixplanfrom").val(),ptemp.nom),troupes:$("#popprixsel").val()}).then(data=>$("#popprixmod").modal('hide'));
            }
            else if($("#popprixtype").val()=='x33') {
                let data = {id_croiseur:$("#popprixcroisid").val(),action:8,zone:$("#popprixsel").val(),frappe:$("#popprixplanto").val()};
                call_ajax_croiseur(data).then((result) => {
                    data.action="9";
                    $.each($(result).find('#ordre').get(0).childNodes,function(i,n) { if(n.nodeName=='#text' && n.data.includes('Etat croiseur')) data.contr = n.data.split(' : ')[1].split(' %')[0]; });
                    call_ajax_croiseur(data);
                });
            }
            //else if() {}
            else mnotify('alert alert-danger',"J'ai pas compris, on fait quoi ?",3000);
        }else mnotify('alert alert-danger','quand faut choisir, ...',3000);
    });
    //$("#popprixmod").on('hide.bs.modal',function() { $("#popprixsel").off('change'); });
    $('body').on('show.bs.modal',function() { $("#clear_modal").css('display','block'); }).on('hide.bs.modal',function() { if($(".modal.in").length==0) $("#clear_modal").css('display','none'); });
    function get_lead(html,elem,nomPlan=false,fromstat=false) {
        let leaders = get_stored('leaders');
        let planetes = get_stored('planetes');
        //on cherche le nom du leader
        let lead_nom;
        if($(html).find("#marchand").length>0) $.each($(html).find('#marchand').get(0).childNodes,function(l,n) { if(n.nodeName=='#text' && n.data.includes(' suis ')) lead_nom = n.data.split('suis ')[1].split(',')[0].trim(); });
        else if($(html).find("#info b").first().text().includes(' suis ')) lead_nom = $(html).find("#info b").first().text().includes(' sur ')?$(html).find("#info b").first().text().split('suis ')[1].split(' sur')[0].trim():$(html).find("#info b").first().text().split('suis ')[1].trim();
        else lead_nom = $(elem).find('div.col-xs-6').eq(0).find('a').text().trim();//en dernier recours on s'appuie pas sur l'ecran leader mais sur la page generale
        if(leaders.find(o=>o.player===localStorage.playerName)===undefined && localStorage.playerName) leaders.push({player:localStorage.playerName,sector:true,img:false,niv:false,ally:null,leaders:[]});//je me créé dans l'objet leaders si j'y suis pas deja
        if(leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom)===undefined && lead_nom) {
            leaders.find(o=>o.player===localStorage.playerName).leaders.push({
                nom : lead_nom,
                visited:['Inconnu'],
                traite: true,
                objets:[],
                automat:{active:false,action:[]}
            });
        }//je créé mon leaders s'il existe pas deja
        let lead = leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom);
        //on recup le nom de la planete
        let nom = $(html).find("#info b").first().text().includes(' sur ') && planetes.find(o=>o.nom==$(html).find("#info b").first().text().split(' sur ')[1])!=undefined?$(html).find("#info b").first().text().split(' sur ')[1]:(lead.activite && lead.activite.includes('>') && planetes.find(o=>o.nom==lead.activite.split('>')[1].split('</a')[0].trim())!=undefined?lead.activite.split('>')[1].split('</a')[0].trim():(nomPlan!=undefined && nomPlan!=false && nomPlan!='Nouvelle Planete' && planetes.find(o=>o.nom==nomPlan)!=undefined?nomPlan:null));
        nom = nom!=null?nom.trim():null;
        //on met a jour notre objet
        let lm = {
            id : $(html).find('input[name="id_leader"]').length>0?$(html).find('input[name="id_leader"]').val():$(elem).find('div.col-xs-6').eq(0).find('a').first().attr('href').split('id_leader=')[1].split('&')[0],
            pose : ['Politique','Assassina','Construct'].filter(o=>o==lead.activite.substr(0,9)).length>0?Date.now():false,
            leave : ['Politique','Assassina','Construct'].filter(o=>o==lead.activite.substr(0,9)).length>0?false:Date.now()
        };
        lm.activite = $(html).find("#marchand").length?'Tournéee marchande':($(html).find('#actions').html().includes('exploration')?'Prospection':($(html).find('#actions').html().includes('Je fais de la politique')?('Politique'):
        (/*$(html).find('#actions').html().includes('Avant de pratiquer le saut en hyper-espace')||*/$(html).find('#actions').html().includes('destination')?('Transfert'):
         ($(html).find('#actions').html().includes('sanglante')/*||$(html).find('#actions').html().includes('')*/?('Assassinat'):
          ($(html).find('#actions').html().includes('tablir une ambassade')?('Etablissement ambassade'):
           ($(html).find('#actions').html().includes('ambassade sera d')?('Démantèlement ambassade'):
            ($(html).find('#actions').html().includes('brouilleur')?'Pose brouilleur':
             //impossible de faire la distinction entre decolage pour transfert et decolage pour prospection... donc on reprend ce qu'on a deja
             //($(elem).find('div.col-xs-6 .frontflip').get(0).childNodes[0].data)
             (lead.activite.includes('vers')?lead.activite.split(' vers')[0]:lead.activite.split(' à ')[0]))))))));
        if($(html).find("#marchand").length==0 && lm.activite != 'Prospection') lm.activite += (nom==null?'':' à <a style="color:lightgreen;" target="fenetre" href="detail.php?x='+(planetes.find(o=>o.nom==nom)?planetes.find(o=>o.nom===nom).x:'')+'&y='+(planetes.find(o=>o.nom===nom)?planetes.find(o=>o.nom===nom).y:'')+'">'+nom+'</a>');
        //if(fromstat||$(html).find("#tournee ul").length>0) lm.activite = $(html).find("#tournee ul").length>0?'Tournée marchande':$(elem).find('div.col-xs-6').eq(1).get(0).childNodes[1].data+($(elem).find('div.col-xs-6').eq(1).find('a').length>0?' '+$(elem).find('div.col-xs-6').eq(1).find('a')[0].outerHTML:'');
        if($(html).find("#marchand").length==0) {
            if(!leaders.find(o=>o.player===localStorage.playerName).niv.includes('Seconde')) lm.xp = {assassin:$(html).find("#info").first().html().split("<br>")[2].split(' : ')[1].split(' ')[0],politique:$(html).find("#info").first().html().split("<br>")[2].split(' : ')[3],explo:$(html).find("#info").first().html().split("<br>")[2].split(' : ')[2].split(' ')[0]};
            lm.pic = $(html).find("#info img").first().attr('src');
        }else lm.pic = $(html).find("#marchand img").first().attr('src');
        if(lead.automat===undefined) lm.automat = {active:false,action:[]};
        leaders.find(o=>o.player===localStorage.playerName).leaders[leaders.find(o=>o.player===localStorage.playerName).leaders.findIndex(p=>p.nom===lead_nom)] = {...lead,...lm};
        if(nom) {//on a une planete (il peut etre dessus ou se diriger vers elle)
            if(lead.visited.slice(-1)[0].includes('>')) {//on a une planete dans l'histo
                if(lead.visited.slice(-1)[0].split('>')[1].split('<')[0].trim() != nom) {//la planete de l'histo est differente de la nouvelle
                    if(!lead.visited.slice(-1)[0].includes(' Le ')) leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).visited.splice(-1,1,lead.visited.slice(-1)+' Le '+new Date(Date.now()).toLocaleString());//l'histo n'a pas de date, on la rajoute
                    if(lead.pose) leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).visited.push('<a href="detail.php?x='+($(elem).find('div.col-xs-6').eq(1).find('a').attr('href')!=undefined?$(elem).find('div.col-xs-6').eq(1).find('a').attr('href').split('x=')[1].split('&')[0]:'?')+'&y='+($(elem).find('div.col-xs-6').eq(1).find('a').attr('href')!=undefined?$(elem).find('div.col-xs-6').eq(1).find('a').attr('href').split('y=')[1]:'?')+'" style="color:lightgreen" target="fenetre">'+nom+'</a>');//on ajoute la nouvelle
                }//else : si c'est la meme que dans l'histo on fait rien
            } else {//on a pas de planete dans l'histo
                if(lead.visited.slice(-1)[0].includes('Inconnu')) leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).visited.splice(-1,1);//on vire l'init du tableau
                //if(lead.pose)
                    leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).visited.push('<a href="detail.php?x='+($(elem).find('div.col-xs-6').eq(1).find('a').attr('href')!=undefined?$(elem).find('div.col-xs-6').eq(1).find('a').attr('href').split('x=')[1].split('&')[0]:'?')+'&y='+($(elem).find('div.col-xs-6').eq(1).find('a').attr('href')!=undefined?$(elem).find('div.col-xs-6').eq(1).find('a').attr('href').split('y=')[1]:'?')+'" style="color:lightgreen" target="fenetre">'+nom+'</a>');//on ajoute la nouvelle
            }
        }
        set_stored('leaders',leaders);
        lead = leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom);
        //action auto : (old version plus utilisée)
        /*let tools = exist_for_player('tools')?get_stored('tools'):init_tools;
        //deplacer les leaders qui politise des qu'ils ont fini
        if(tools.automouv.leaders.find(o=>o.id==lead.id)!=undefined && tools.automouv.leaders.find(o=>o.id==lead.id).active) {
            //if($(html).find('#actions h3').first().text().indexOf('Max')>=0) { //attend d'avoir atteint les 100% de pol
            //pour les deplacer des que le putsh est realisé, il faut que les infos pol de la planetes soient maj...
            if(tools.automouv.active) {
                document.getElementById("fenetre").src = "detail.php?x="+planetes.find(o=>o.nom==nom).x+"&y="+planetes.find(o=>o.nom).y;
                setTimeout(function() {
                    if(nom && ((tools.automouv.active===true && get_stored('planetes').find(o=>o.nom==nom).proprio==localStorage.playerName) || (Number.isInteger(tools.automouv.active) && parseInt(get_stored('planetes').find(o=>o.nom==nom).pol.find(p=>p.player==localStorage.playerName).pol.replace('%','')) >= tools.automouv.active)))
                        mouv_lead(planetes,leaders,lead,tools);
                },3000);
            }else mouv_lead(planetes,leaders,lead,tools);
        }
        //relancer les leader en explo des qu'ils se posent :
        if(tools.autoexplo.leaders.find(o=>o.id==lead.id)!=undefined && tools.autoexplo.leaders.find(o=>o.id==lead.id).active) {
            if(nom) {
                if(tools.autoexplo.active) {
                    document.getElementById("fenetre").src = "detail.php?x="+planetes.find(o=>o.nom==nom).x+"&y="+planetes.find(o=>o.nom).y;
                    setTimeout(function() {
                        if(!get_stored('planetes').find(o=>o.nom==nom).conflit)
                            $.ajax({
                                url:'leader.php',
                                type:'POST',
                                data:{id_leader:lead.id,action:13},//on arpente pour générer la news contenant les objets à acheter
                                success:function(resp) {
                                    document.getElementById('lamap').contentWindow.location.reload(true);//raffraichir la map fait apparaitre la nouvelle news et l'enregistre
                                    setTimeout(explore(lead.id),2000);
                                }
                            });
                        else explore(lead.id);
                    },3000);
                } else explore(lead.id);
            }
        }
        //construire un brouilleur des qu'un leader se pose
        if(tools.autoconstrB.leaders.find(o=>o.id==lead.id)!=undefined && tools.autoconstrB.leaders.find(o=>o.id==lead.id).active) {
            if(nom && ((tools.autoconstrB.wait && planetes.find(o=>o.nom==nom).proprio==localStorage.playerName) || !tools.autoconstrB.wait))
                $.ajax({
                    url:'leader.php',
                    type:'POST',
                    data:{id_leader:lead.id, action:5},
                    success:function(htmlresp) {
                        leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.id===lead.id).activite = 'Pose brouilleurs à <a target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom==nom).x+'&y='+planetes.find(o=>o.nom==nom).y+'">'+nom+'</a>';
                        set_stored('leaders',leaders);
                        //maj_lead();
                        tools.autoconstrB.leaders.find(o=>o.id==lead.id).active = false;
                        $('ll_autoconstrB input[value="'+lead.id+'"]').prop('checked',false);
                        mnotify($(htmlresp).find('div.alert').get(0).className,$(htmlresp).find('div.alert').first().html());
                    }
                });
        }*/
        let pose = $(html).find('#actions img[src="images/picto/new-planet.png"]').length > 0 ? true : false;
        //on modifie le DOM pour afficher
        let dis = $(elem).find('div.col-xs-6').eq(1).css('display');
        $(elem).find(".addjme, .piclead").remove();
        //encart spécial d'infos sociales (autres leaders sont/vont sur la meme planete ou je vais/suis) (on en profite pour stocker les id des leaders des autres joueurs présent sur la meme planete)
        if(nom && planetes.find(o=>o.nom==nom) != undefined) {
            let tab='';let mine=[];
            if(planetes.find(o=>o.nom==nom).leaders !== undefined && planetes.find(o=>o.nom===nom).leaders.length>0) {
                $.each(planetes.find(o=>o.nom==nom).leaders,function(z,b) {
                    mine[z] = b.split('(')[1].split(')')[0]==localStorage.playerName;
                    if(b != lead_nom+' ('+localStorage.playerName+')' && (leaders.find(o=>o.player==localStorage.playerName).niv.includes('Seconde') && b.split('(')[0].trim() != leaders.find(o=>o.player==localStorage.playerName).leaders[0].nom)) tab += '<li style="backgroud-color:'+(mine[z]?'blue':'red')+';">'+b+'</li>';
                });
            }
            //si planete dans info hypertraceur
            if(leaders.find(o=>o.player===localStorage.playerName).niv.includes('Fondation')) {
                $.each(leaders,function(y,play) {
                    if(play.player!==localStorage.playerName) {
                        if(play.leaders.length > 0) $.each(play.leaders,function(j,leader) {
                            if(leader.traceur != undefined && leader.traceur.includes(nom)) tab +='<li style="background-color:'+(leader.traceur.includes('approche')?'red':'black')+';">'+play.player+' : '+leader.traceur+'</li>';
                        });
                    }
                });
            }
            if(tab!='') $(elem).append('<div class="col-xs-12 addjme sibl" style="font-size:x-small;background-color:'+(['politique','brouilleur','ambassade'].filter(f=>lead.activite.toLowerCase().includes(f)).length?(mine.includes(false)?'red;">On a de la compagnie ! :':'blue;">Soirée poker entre collègues ;)'):(lead.activite.includes('Transfert')?(mine.includes(false)?'red;">Y\'a un type chelou qui m\'attend :/':'green;">On va voir des copains ?'):(lead.activite.includes('Assassinat')?'black;color:white;">Ah non c\'est pas des copains...':'Ben qui c\'est ?')))+'<ul style="margin-bottom:0px;">'+tab+'</ul></div>');
            if($(html).find("#marchand").length==0) $(html).find('#actions select[name="cible"]').find('option').each(function(i,dv) {
                $.each(leaders,function(j,k){ if(k.leaders.find(p=>p.nom==$(dv).text()) != undefined) leaders[j].leaders[k.leaders.findIndex(p=>p.nom==$(dv).text())].id = $(dv).val(); });
            });
        }
        //on construit le frontflip (on commence par l'activité)
        let front='';
        if(lead.activite) front = /*'<i class="fa fa-long-arrow-right"></i>'+*/lead.activite;//on remplace l'activité par celle stocké dans le leader (a jour)
        else front = $(elem).find('div.col-xs-6').eq(1).innerHTML;//sinon on garde celle de l'html
        //on ajoute la pol (si c'est l'action de/vers/sur une planete) a la suite et le temps restant (ou "terminé" si inactif)
        let temps = $(html).find("#tournee ul").length>0?-1:($(html).find('#marchand').length==0?($(html).find('#actions h3').first().text().indexOf('Max')>=0||$(html).find('#actions h3').first().text().indexOf('terminé')>=0?9999:parseInt($(html).find('#actions h3').first().text().split(' - ').length>1?$(html).find('#actions h3').first().text().split(' - ')[1].split('este ')[1].split('minute')[0]:$(html).find('#actions h3').first().text().split(' dans ')[1].split('MIN ')[0])):$(elem).find('div.col-xs-6').eq(1).text().split('')[0]);
        let tempstxt = (temps<0?' '+$(html).find('#tournee li:last').text().split('dans ')[1].split(' pour')[0].replace(' heures','h'):(temps>0?(temps==9999?'Terminé !':' reste '+(temps>=60?parseInt(temps/60)+'h ':'')+parseInt(temps%60)+'m'):''));
        let tempstring = (temps<0?$(html).find('#tournee li:last').text().split('dans ')[1].split(' pour')[0].replace(' heures',':').split(':').map(m=>m.padStart(2,'0')).join(':'):(temps>0?(temps==9999?'00:00':(temps>=60?parseInt(temps/60).toString().padStart(2,'0')+':':'00:')+parseInt(temps%60).toString().padStart(2,'0')):'00:00'));
        let nodetext = '';
        if(lead.activite=='Prospection' && $(html).find('#actions input[name="formu"]').length==0) {
            $.each($(html).find('#actions').first().get(0).childNodes,function(i,v) { if(v.nodeName=="#text" && v.data.trim().length>0) { nodetext = v.data; return false; } });
            tempstxt += nodetext.includes('Bingo')?' (trouvé!)':' (raté!)';
        }
        front += '<span class="addjme">'+(lead.activite=='Prospection'?(' vers <a style="color:lightgreen;" href="detail.php?x='+$(elem).find('div.col-xs-6').eq(0).find('a').first().attr('href').split('x=')[1]+'">Nouvelle Planete</a>'):
            // %age politique
            (nom&&lead.activite.includes('Politique')?(planetes.find(o=>o.nom===nom).pol.find(p=>p.player.trim()===localStorage.playerName)?' ('+planetes.find(o=>o.nom===nom).pol.find(p=>p.player.trim()===localStorage.playerName).pol+') ':' (0%) '):
             //prochaine planete tournee marchande
            (temps<0?' vers <a href="detail.php?x='+(planetes.find(o=>o.nom==$(html).find('#tournee li:first').get(0).innerHTML.split('<b>')[1].split('</b>')[0].trim())!=undefined?planetes.find(o=>o.nom==$(html).find('#tournee li:first').html().split('<b>')[1].split('</b>')[0].trim()).x:'')+'&y='+(planetes.find(o=>o.nom==$(html).find('#tournee li:first').html().split('<b>')[1].split('</b>')[0].trim())!=undefined?planetes.find(o=>o.nom==$(html).find('#tournee li:first').html().split('<b>')[1].split('</b>')[0].trim()).y:'')+'" target="fenetre">'+$(html).find('#tournee li:first').html().split('<b>')[1].split('</b>')[0].trim()+'</a>':'')))+
            //temps restant + bouton d'annulation
            tempstxt+($(html).find('#actions input[name="formu"]').length>0 || ($(html).find('#tournee input[value^="Annuler"]').length>0 && parseInt($(html).find('#stock tr').eq(1).find('td').eq(1).text())<20)?'<button data-leadid="'+lead.id+'" data-url="'+($(html).find('#marchand').length>0?'marchand':'leader')+'" class="btn anul btn-alt btn-xs annul_lead"'+(lead.activite=='Prospection' && temps>100?' disabled':'')+'>Annuler'+(lead.activite=='Prospection' && temps>100?' ('+(temps-100)+')':'')+'</button>':'')+
            '</span>';
        //et les boutons arpenter/explorer/assassiner/...
        front += '<div class="addjme">'+
            (nom && !planetes.find(o=>o.nom===nom).conflit && pose?'<a class="btn agit btn-alt btn-xs" href="leader.php?id_leader='+lead.id+'&action=13" target="fenetre"><img src="images/picto/arpenter.png" width=15></a>':'')+
            (pose?'<button data-lead="'+lead.id+'" class="btn agit btn-alt btn-xs explead"><img src="images/picto/decouverte.png" width="15"></button>'+
             '<button data-lead="'+lead.id+'" class="btn agit btn-alt btn-xs gobtn btnlead launch_lead"><img src="'+($("#cible_crois").val()==""?'images/picto/empire.png':'images/leader-transfert.png')+'" width="15"></button>'+
             ($(html).find('#actions img[src="images/picto/assassiner.png"]').length>0?'<button class="btn agit btn-alt btn-xs assass" data-lead="'+lead.id+'" data-cible="'+$(html).find('#actions select[name="cible"]:first').val()+'" data-planete="'+nom+'"><img src="images/picto/assassiner.png" width="15"></button>':'')+
             ($(html).find('#actions img[src="images/picto/offre.png"]').length>0?'<a class="btn btn-alt btn-xs" href="marchand.php?id_leader='+lead.id+'" target="fenetre"><img src="images/picto/offre.png" width="15"></a>':'')+
             (leaders.find(o=>o.player===localStorage.playerName).niv.includes('Niv3')?(((planetes.find(o=>o.nom===nom).proprio==localStorage.playerName || (leaders.find(l=>l.player==planetes.find(o=>o.nom===nom).proprio)?leaders.find(l=>l.player==planetes.find(o=>o.nom===nom).proprio).ally:false)) && !planetes.find(o=>o.nom===nom).amb && parseInt(planetes.find(o=>o.nom===nom).pol.find(p=>p.player==localStorage.playerName)!=undefined?planetes.find(o=>o.nom===nom).pol.find(p=>p.player==localStorage.playerName).pol.replace('%',''):0)>=10)?'<button class="btn agit btn-alt btn-xs ambass" data-lead="'+lead.id+'" data-planete="'+nom+'"><img src="images/picto/ambassade.png" width="15"></button>':(planetes.find(o=>o.nom==nom).amb && typeof planetes.find(o=>o.nom==nom).amb=='string' && planetes.find(o=>o.nom==nom).amb != get_stored('leaders').find(p=>p.player==localStorage.playerName).conf && (planetes.find(o=>o.nom===nom).proprio==localStorage.playerName || (parseInt(planetes.find(o=>o.nom===nom).pol.find(p=>p.player==localStorage.playerName)!=undefined?planetes.find(o=>o.nom===nom).pol.find(p=>p.player==localStorage.playerName).pol.replace('%',''):0)>=(100-lead.xp.pol) && (leaders.find(l=>l.player==planetes.find(o=>o.nom===nom).proprio)?leaders.find(l=>l.player==planetes.find(o=>o.nom===nom).proprio).ally:false)))?'<button class="btn agit btn-alt btn-xs demantele" data-lead="'+lead.id+'" data-planete="'+nom+'"><img src="images/picto/demantele.png" width="15"></button>':'')):'')
            /*+(true?'<a class="btn btn-alt btn-xs" href="arpenter.php?id_leader='+lead.id+'&dormir=1">Zz</a>':'')*/:'')+'</div>';
        //on construit le backflip (c'est l'appel à la fonction feuille_de_route() qui se charge de gérer la planif leader)
        let fdr = feuille_de_route(lead,nom,temps,$(html).find('#actions input[name="formu"]').length>0,nodetext,$(html).find("#tournee"));
        let back = '<div style="width:100%">mon plan :<i data-leadid="'+lead.id+'" class="btn btn-alt fa fa-tasks openmodlead" style="position:absolute;top:0;right:0;border: 1px solid rgba(255, 255, 255, 0.31);padding:3px 5px;"></i></div>'+fdr+add_list_ordre(lead,($(html).find('#marchand').length==0?'<br>':'')+'Et ensuite : <br>',false);
        //on alimente le systeme de flipcard
        $(elem).find('div.col-xs-6').eq(1).empty().append('<div class="innerflip"><div class="frontflip">'+front+'</div><div class="backflip" style="padding:0;">'+back+'</div></div>').addClass("flip");
        if($("#list_"+lead.id).length>0) $("#list_"+lead.id).empty().append(add_list_ordre(lead,'',true));
        //on construit la model de planif leader
        $(".dellordre_"+lead.id).off('click').on('click',function() { action_fdr(lead.id,'delete',this); });
        if($("#fdr_"+lead.id).length>0) $("#fdr_"+lead.id).empty().append(fdr);
        $(".openmodlead").off('click',).on('click',function(e) {
            let el = $(this);
            let idl = el.data('leadid');
            let cntl=0;
            //modal saisie feuille de route
            if($("#modal-lead_"+idl).length==0) { //$("#modal-lead_"+idl).remove();//.modal('dispose')
                alim_cible_select(true,false,false);
                $('body').append('<div class="modal modal-content" id="modal-lead_'+idl+'" style="width:460px;height:340px;overflow:auto;position:absolute;resize:both;border:2px solid white;"><div class="modal-header" id="modal-lead_'+idl+'header"><h3 class="modal-title" style="display:block;text-align:center;width:90%;">Feuille de route de '+get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==idl).nom+'</h3><input type="hidden" name="oldheight"><button class="close minify" style="position:absolute;top:10px;right:40px;"><i class="fa fa-minus"></i></button><button class="close" style="position:absolute;top:10px;right:10px;" data-dismiss="modal"><span>&times;</span></button></div><div class="modal-body" style="background:rgba(0, 0, 0, 0.9);"><input type="hidden" name="leadid" value="'+idl+'"></div></div>');
                $("#modal-lead_"+idl+" .modal-body").first().append('<div class="row" id="fdr_'+idl+'" style="margin-bottom:10px;padding:10px;border:1px solid white;"></div><div class="row" style="position:relative;">'+
                              '<fieldset class="the-fieldset"><legend class="the-legend">Politique</legend><fieldset style="display:inline;"><select class="btn btn-alt btn-xs" title="attente" name="wait"><option value="">Choisir la limite</option><option value="0" title="on passe à la suite immédiatement, sauf si une autre action est en cours">Aucune</option><option value="-1" style=color:red;" title="On annule toute action en cours pour passer à la suite">Top Priorité</option><option value="1" style="color:green;" title="on attend que la planète nous appartienne pour passer à la suite">Putsch</option><option style="color:green;" value="2" title="on attend d\'avoir autant de politique avant de passer à la suite">% Pol</option><option value="3" title="spécifier une heure ou un delai">temps</option></select>'+
                                '<br><input class="btn btn-alt" title="pourcentage de pol à atteindre" type="number" max="100" min="10" name="pol" step="10" value="" style="width:100%;" disabled><span class="timer"><input class="btn btn-alt" type="time" name="heure"><br><label><input type="radio" name="type" value="delai" style="opacity:1;">délai</label>&nbsp;<label><input type="radio" name="type" value="date" style="opacity:1;">heure</label><span class="temps"><br><input class="btn btn-alt" type="date" name="jour" min="'+new Date(Date.now()).toISOString('en-US',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit'}).substr(0,10)+'" value="'+new Date(Date.now()).toISOString('en-US',{hour12:false,year:'numeric',month:'2-digit',day:'2-digit'}).substr(0,10)+'"></span></span><br><label title="seulement si objectifs atteints en fin de cycle""><input type="checkbox" name="quicky" style="opacity:1;" value="1" disabled>quicky</label>'+
                                '</fieldset><fieldset class="the-fieldset" style="display:inline;margin-left:3px;"><legend class="the-legend">Putsch</legend><label title="Putsch toutes planetes" style="margin:0;"><input type="radio" style="opacity:1;" name="preserve" value="0" disabled>Toutes</label><br><label title="Putsch pas les alliés" style="margin:0;"><input type="radio" name="preserve" style="opacity:1;" value="1" disabled>Non allié</label><br><label title="Putsch aucun joueur" style="margin:0;"><input type="radio" name="preserve" style="opacity:1;" value="2" disabled>Neutre</label>'+
                              '</fieldset></fieldset><fieldset class="the-fieldset" style="margin-left:15px;padding-top:20px;"><legend class="the-legend">Action </legend><select class="btn btn-alt btn-xs" title="Action" name="action" style="margin-bottom:10px;width:100%;"><option value="">Choisir</option><option value="1">Déplacement</option><option value="2">Exploration</option><option value="2b">Exploration continue</option><option value="3">Assassinat</option>'+(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Marchand')?'<option value="4">Tournée auto</option>':'')+(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation')?'<option value="5">Constr. brouilleur</option>':'')+(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3')?'<option value="10">Constr. ambassade</option><option value="11">Démant. ambassade</option>':'')+'<option value="99">Donner objets</option></select>'+
                                '<br><select class="btn btn-alt btn-xs" title="Cible" name="cible" style="width:100%" disabled>'+cibleslct+'</select><select class="btn btn-alt btn-xs" title="Leader coffre" name="lc" style="width:100%;display:none;">'+new Array(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.length-1).fill(null).map(()=>'<option value="'+get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.filter(p=>p.id!=idl)[cntl].nom+'">'+get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.filter(p=>p.id!=idl)[cntl++].nom+'</option>').join('')+'</select>'+
                              '</fieldset><button class="" title="ajoute" id="addordre_'+idl+'" style="margin-left:10px;padding: 2px 10px 3px;background-color:#5cb85c;"><i class="fa fa-plus"></i></button>'+
                              '<button data-leadid="'+idl+'" class="btn btn-alt" style="position:absolute;right:0;top:0;" title="maj" id="lance_'+idl+'"><i class="fa fa-refresh"></i></button><button title="'+(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==idl).automat.active?'desactive':'active')+'" style="position:absolute;right:0;top:40px;padding: 2px 10px 3px;background-color:'+(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==idl).automat.active?'#d9534f':'#5cb85c')+';" id="activ_fdr_'+idl+'"><i class="fa fa-'+(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==idl).automat.active?'times':'check')+'"></i></button></div><div class="row" style="margin-top:10px;padding:10px;border:1px solid white;min-height:100px;" id="list_'+idl+'">'+add_list_ordre(get_stored('leaders').find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==idl),'',true)+'</div>');
                dragElement(document.getElementById('modal-lead_'+idl));
                $('#modal-lead_'+idl+' select[name="wait"]').off('change').on('change',function() {
                    if($(this).val()==3) {
                        $(this).parents('.modal').first().find('input[name="preserve"]').prop('disabled',true);
                        $(this).parents('.modal').first().find('input[name="quicky"]').prop('disabled',true);
                        $(this).parents('.modal').first().find('input[name="pol"]').css('display','none').prop('disabled',true);
                        $(this).parents('.modal').first().find('.timer').css('display','inline');
                        $(this).parents('.modal').first().find('.temps').css('display','none');
                        $(this).parents('.modal').first().find('input[name="type"][value="delai"]').prop('checked',true);
                    } else {
                        $(this).parents('.modal').first().find('.timer').css('display','none');
                        $(this).parents('.modal').first().find('input[name="preserve"]').prop('disabled',false);
                        $(this).parents('.modal').first().find('input[name="quicky"]').prop('disabled',false);
                        if($(this).val()==2) $(this).parents('.modal').first().find('input[name="pol"]').css('display','inline').prop('disabled',false);
                        else {
                            $(this).parents('.modal').first().find('input[name="pol"]').css('display','inline').prop('disabled',true);
                            if($(this).val()!=1) {
                                $(this).parents('.modal').first().find('input[name="preserve"]').prop('disabled',true);
                                $(this).parents('.modal').first().find('input[name="quicky"]').prop('disabled',true);
                            }
                        }
                    }
                });
                $('#modal-lead_'+idl+' input[name="type"]').off('change').on('change',function() {
                    if($(this).val()=='delai' && $(this).is(':checked')) $(this).parents('.modal').first().find('.temps').css('display','none');
                    else $(this).parents('.modal').first().find('.temps').css('display','inline');
                });
                $("#modal-lead_"+idl+' select[name="action"]').off('change').on('change',function(){
                    if($(this).val()==1 || $(this).val()==3 || $(this).val()==5) {
                        $(this).parents('.modal').first().find('select[name="cible"]').css('display','inline').attr('disabled',false);
                        $(this).parents('.modal').first().find('select[name="lc"]').css('display','none');
                    } else {
                        if($(this).val()==99) {
                            $(this).parents('.modal').first().find('select[name="cible"]').css('display','none');
                            $(this).parents('.modal').first().find('select[name="lc"]').css('display','inline');
                            //$(this).parents('.modal').first().find('select[name="lc"]').val('');
                        }else {
                            $(this).parents('.modal').first().find('select[name="lc"]').css('display','none');
                            $(this).parents('.modal').first().find('select[name="cible"]').css('display','inline').attr('disabled',true);
                        }
                        $(this).parents('.modal').first().find('select[name="cible"]').val('');
                    }
                });
                $("#lance_"+idl).off('click').on('click',function() { document.getElementById('fenetre').src = "leader.php?id_leader="+idl; });
                $("#activ_fdr_"+idl).off('click').on('click',function() { action_fdr(idl,"active",this); });
                $("#addordre_"+idl).off('click').on('click',function() { action_fdr(idl,'add'); });
                $(".dellordre_"+idl).off('click').on('click',function() { action_fdr(idl,'delete',this); });
                $("#modal-lead_"+idl+" select[name='wait']").val('').trigger('change');
                $("#modal-lead_"+idl+" select[name='action']").val('');
                $("#modal-lead_"+idl+" select[name='cible']").val('');
                $("#lance_"+idl).trigger('click');
                $("#modal-lead_"+idl).modal({backdrop:false});
                $("#modal-lead_"+idl).on('hide.bs.modal',function() { $("#modal-lead_"+idl).remove(); });
                $.each(document.getElementsByClassName('modal-content'),function(i,v) {
                    v.addEventListener('pointerenter',(event)=>{ this.style.zIndex = 1200; });
                    v.addEventListener('pointerleave',(event)=>{ this.style.zIndex = 200; });
                });
                $(".minify").off('click').on('click',function(){
                    if($(this).find('i').first().hasClass('fa-plus')) {
                        $(this).parents('div.modal-content').css('height',$(this).prev().val()).css('overflow','auto').css('resize','both');
                        $(this).find('i').first().removeClass('fa-plus').addClass('fa-minus');
                    }else {
                        //$(this).parents('div.modal').first().css('z-index','100');
                        $(this).prev().val($(this).parents('div.modal-content').css('height'));
                        $(this).parents('div.modal-content').css('height','40px').css('overflow','hidden').css('resize','none');
                        $(this).find('i').first().removeClass('fa-minus').addClass('fa-plus');
                    }
                });
            }
        });
        //on met a jour l'icone et l'info-bulle dans la vue reduite
        $(elem).find('.icolead').first().empty().html(lead.activite.includes('Transfert')?'<img src="images/leader-transfert.png" width="20">':(lead.activite.includes('Politique')?'<img src="images/picto/leader_politique.png" style="width:20px;">':(lead.activite.includes('Assassin')?'<img src="images/picto/assassin1.png" style="width:20px;">':(lead.activite.includes('Prospection')?'<img src="images/picto/new-planet.png" width="20">':(lead.activite.includes('marchand')?'<img src="images/picto/offre.png" width="20">':('<img src="images/picto/working.png" style="width:20px;">'))))));
        if($(elem).find('.icolead').first().next().data('bs.popover')!=undefined) $(elem).find('.icolead').first().next().popover('destroy');
        $(elem).find('.icolead').first().next().popover({content:'<span style="font-family: \'digital dark system\', sans-serif;font-size:28px;">'+tempstring+'</span>',html:true,placement:'bottom',trigger:'hover',container:'body'});
        //on remplace le type btn par le type lien vert sur le nom de la planete
        $(elem).find('div.col-xs-6 .frontflip').find('a').first().css('color','lightgreen').removeClass('btn btn-alt');
        //on rajoute l'infobulle sur le lien de la planete (si y'en a un)
        if(nom) $(elem).find('a[style="color:lightgreen"]').first().popover({html:true,placement:'auto',container:'body',trigger:'hover',title:planetes.find(o=>o.nom===nom).proprio,content:(planetes.find(o=>o.nom===nom).ally?'<img src="images/icons/alliance.png" heigth="20px">':(planetes.find(o=>o.nom===nom).proprio==localStorage.playerName?'<img src="img/icon/home.png" heigth="20px" style="background-color:black;">':'<img src="../images/emplacements/eclateur.gif" height="20px">'))+planetes.find(o=>o.nom===nom).astros+' astros<br>'+planetes.find(o=>o.nom===nom).pol.map(p=>p.player+' : '+p.pol).join('<br>')});
        //on ajoute les stats du leader et sa pic au dessus du btn du nom du leader
        $((lead.pic?'<img height="70px" width="75px" draggable="true" class="piclead profile-pic animated" style="margin:0;" onclick="ouvrefen(\''+$(elem).find('div.col-xs-6').eq(0).find('a').first().attr('href')+'\');" src="'+lead.pic+'">':'')+'<span style="font-size:9px;" class="addjme">K: '+lead.xp.assassin+' P: '+lead.xp.politique+' E: '+lead.xp.explo+'</span>').insertBefore($(elem).find('div.col-xs-6').eq(0).find('a'));
        //style du lien du nom du leader
        $(elem).find('div.col-xs-6').eq(0).find('a').first().css('width','75px').css('overflow','hidden');
        //on ajoute la selectbox des objets
        let opt2 = '<option>'+(leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).objets.length>0?leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).objets.map(q=>q.nom+(parseInt(q.qte)>1?'('+q.qte+')':'')).join('</option><option>'):'Aucun')+'</option>';
        //on ajoute la selectbox d'historique des planetes visitées par mes leaders
        let opt = '';
        $.each(leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.nom===lead_nom).visited.reverse(),function(i,v) { opt += '<option>'+v+'</option>'; });
        $(elem).append('<div style="width:176px;" class="addjme sibl"><select style="width:'+(lead.holo?'64px':'85px')+';" class="btn btn-xs">'+opt2+'</select>'+(lead.holo?'<button data-leadid="'+lead.id+'" title="Vendre objet" class="btn btn-alt btn-xs sell" data-toggle="modal" data-target="#popprixmod">$</button>':'')+'<select style="width:85px;margin-left:5px;" class="btn btn-xs">'+opt+'</select></div>').css('border','double black').addClass('m-b-5').css('position','relative').css('min-height','25px');
        //on garde l'affichage qui etait en cours (plié/déplié)
        $(elem).find(".sibl").css('display',dis);
        if($(elem).find(".sibl").css('display')=='block') $(elem).find(".sibl").css('display','inline-block');
        //on stylise le systeme de flipcard
        $(elem).find('div.col-xs-6').eq(1).find('.frontflip').css('font-size','12px').css('min-height','115px').css('overflow','auto');
        $(elem).find('div.col-xs-6').eq(1).find('.backflip').css('font-size','9px').css('min-height','115px').css('overflow','auto');//.css('height',$(elem).find('div.col-xs-6').eq(0).get(0).offsetHeight).css('overflow','auto');
        $(elem).find('div.col-xs-6').eq(1).find('.backflip, .frontflip').addClass('unvisiblescroll');
        $(".innerflip").off('click').on('click',function(e) {
            if(!['IMG','I','A','BUTTON'].includes(e.target.nodeName)){//($(e.target).hasClass('openmodlead')){
                if($(this).css("transform")=='none') $(this).css("transform","rotateY(180deg)");
                else $(this).css("transform","");
            }
        });
        //form pour acheter un objet : (il faut que le leader soit sur le quartier urbain des boutiques (U vert) -_-)
        //<form method="post" target="fenetre" action="arpenter.php"><input type="hidden" name="achat" value="commerce2"><input type="hidden" name="id_leader" value="'+lead.id+'"><input class="btn btn-alt btn-sm" name="formu" type="submit" value="1cr" onclick="this.form.submit(); this.form.formu.disabled=true;"></form>
        //les trigger des boutons
        $(".launch_lead").off('click').on('click',function() {
            let id = $(this).data('lead');
            call_lead({action:1,id_leader:id,planete:$("#cible_crois").val()},planetes.find(o=>o.nom===$("#cible_crois :selected").text().split(' ')[0]));
            /*if(debug) console.log('call leader');
            $.ajax({
                url:'leader.php',
                type:'POST',
                data:{
                    id_leader:id,
                    action:1,
                    planete:$("#cible_crois").val(),
                },
                success:function(html) {
                    if(debug) console.log($(html).find('div.alert').first().text());
                    if(html.includes('alert(')) mnotify('alert alert-danger',html.split('alert(')[1].split(')')[0],5000);
                    else {
                        if(!leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).visited.slice(-1)[0].includes(' Le ')) leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).visited.splice(-1,1,leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).visited.slice(-1)[0]+' Le '+new Date(Date.now()).toLocaleString());
                        leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).activite = 'Transfert vers <a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===$("#cible_crois :selected").text()).x+'&y='+planetes.find(o=>o.nom===$("#cible_crois :selected").text()).y+'">'+$("#cible_crois :selected").text()+'</a>';
                        set_stored('leaders',leaders);
                        maj_lead(false,id);
                        let div = false;
                        $.each($(html),function(i,o){ if(o.localName=='div') div = o; });
                        mnotify($($(div)[0]).get(0).className,$($(div)[0]).get(0).innerHTML,5000);
                    }
                }
            });*/
        });
        $(".explead").off('click').on('click',function() {
            call_lead({action:2,id_leader:$(this).data('lead')},null);
            /*$.ajax({url:'leader.php?id_leader='+$(this).data('lead')+'&action=2',success:function(h){
                if(h.includes("alert('Vous avez quitté le spatioport et disposez de moins de 5 unités de temps, vous ne pouvez pas décoller !')")) mnotify('alert alert-danger',"Pas assez d'UT pour décoller!",3000);
                else {
                    let node='';
                    $(h).each(function(){ if(this.nodeName=='DIV' && this.className.includes('alert')) node=this; })
                    let l = get_stored('leaders');
                    l.find(o=>o.player==localStorage.playerName).leaders.find(p=>h.includes(p.nom)).activite = 'Prospection';
                    set_stored('leaders',l);
                    if(node!='') mnotify(node.className,node.innerText,3000);
                }
            }});*/
        });
        $(".assass").off('click').on('click',function() {
            let id = $(this).data('lead');
            let cible = $(this).data('cible');
            let nomp = $(this).data('planete');
            call_lead({id_leader:id,action:3,cible:cible},planetes.find(o=>o.nom===nomp));
            /*if(debug) console.log('call leader');
            $.ajax({
                url:'leader.php',
                type:'POST',
                data:{
                    id_leader:id,
                    action:3,
                    cible:cible,
                },
                success:function(html) {
                    if(debug) console.log($(html).find('div.alert').first().text());
                    if(html.includes('alert(')) mnotify('alert alert-danger',html.split('alert(')[1].split(')')[0],5000);
                    else {
                        leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).activite = 'Assassinat à <a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===nomp).x+'&y='+planetes.find(o=>o.nom===nomp).y+'">'+nomp+'</a>';
                        $.each(leaders,function(j,k) { if(k.leaders.find(o=>o.id==cible) != undefined) leaders.find(o=>o.player===localStorage.playerName).leaders.find(p=>p.id===data.id_leader).automat.killing = k.leaders.find(o=>o.id==cible).nom+' ('+k.player+')'; });
                        set_stored('leaders',leaders);
                        maj_lead(false,id);
                        mnotify($(html).find('div.alert').first().className,$(html).find('div.alert').first().html(),5000);
                    }
                }
            });*/
        });
        $(".annul_lead").off('click').on('click',function() {
            let id = $(this).data('leadid');
            call_lead({id_leader:id,annuler:1},null);
            /*$.ajax({
                url:$(this).data('url')+'.php',
                type:'POST',
                data:{id_leader:id,annuler:1},
                success:function(rep) {
                    let last = leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).visited.slice(-1)[0]
                    leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).activite = 'Politique'+(last!='Inconnu'?(last.split(' Le')[0].includes('</a>')?last.split(' Le')[0]:' à <a style="color:lightgreen;" href="detail.php?x='+planetes.find(o=>o.nom==last.split(' Le')[0]).x+'&y='+planetes.find(o=>o.nom==last.split(' Le')[0]).y+'" target="fenetre">'+last.split(' Le')[0]+'</a>'):'');
                    set_stored('leaders',leaders);
                    maj_lead(false,id);
                    mnotify('alert alert-info',rep.includes('Mission annul')?'Mission annulée':'What happend ?',5000);
                }
            });*/
        });
        $(".ambass").off('click').on('click',function() {
            let id = $(this).data('lead');
            let nomp = $(this).data('planete');
            call_lead({id_leader:id,action:10},planetes.find(o=>o.nom===nomp));
            /*if(debug) console.log('call leader');
            $.ajax({
                url:'leader.php',
                type:'POST',
                data:{ id_leader:id, action:10 },
                success:function(html) {
                    if(debug) console.log($(html).find('div.alert').first().text());
                    if(html.includes('alert(')) mnotify('alert alert-danger',html.split('alert(')[1].split(')')[0],5000);
                    else {
                        leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).activite = 'Ambassade à <a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===nomp).x+'&y='+planetes.find(o=>o.nom===nomp).y+'">'+nomp+'</a>';
                        set_stored('leaders',leaders);
                        maj_lead(false,id);
                        mnotify($(html).find('div.alert').first().className,$(html).find('div.alert').first().html(),5000);
                    }
                }
            });*/
        });
        $(".demantele").off('click').on('click',function() {
            let id = $(this).data('lead');
            let nomp = $(this).data('planete');
            call_lead({id_leader:id,action:11},planetes.find(o=>o.nom===nomp));
            /*if(debug) console.log('call leader');
            $.ajax({
                url:'leader.php',
                type:'POST',
                data:{ id_leader:id, action:11 },
                success:function(html) {
                    if(debug) console.log($(html).find('div.alert').first().text());
                    if(html.includes('alert(')) mnotify('alert alert-danger',html.split('alert(')[1].split(')')[0],5000);
                    else {
                        leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>p.id==id).activite = 'Démantèlement à <a style="color:lightgreen" target="fenetre" href="detail.php?x='+planetes.find(o=>o.nom===nomp).x+'&y='+planetes.find(o=>o.nom===nomp).y+'">'+nomp+'</a>';
                        set_stored('leaders',leaders);
                        maj_lead(false,id);
                        mnotify($(html).find('div.alert').first().className,$(html).find('div.alert').first().html(),5000);
                    }
                }
            });*/
        });
        $(".sell").off('click',).on('click',function(){
            if($(this).data('leadid') && $(this).prev().val()) {
                //$('body').append('<div id="popprixmod" style="position:absolute;top:25%;left:25%;width:120px;background-color:white;color:black;"><h4>Choisir un prix</h4><h5>Pour '+obj+'</h5><div><select id="popprixsel" style="width:50px;margin-left:25px;">'+new Array(15).fill(null).map(()=>'<option value="'+(cnts+2)+'">'+((++cnts)+' à '+(cnts+5))+'</option>').join('')+'</select>Cr.</div><div style="margin-top:15px;"><button id="popprixval" style="background-color:green;color:white;float:right;">OK</button><button id="popprixcan" style="background-color:red;color:white;float:left;">Annuler</button></div></div>');
                let cnts=0;let contentmod='<h4>Choisir un prix pour </h4><h5 id="popprixinfo"></h5><div><input type="hidden" id="popprixtype"><input type="hidden" id="popprixleadid"><input type="hidden" id="popprixobj"><select id="popprixsel" class="btn" style="width:50px;margin-left:25px;">'+new Array(15).fill(null).map(()=>'<option value="'+(cnts+2)+'">'+((++cnts)+' à '+(cnts+5))+'</option>').join('')+'</select>Cr.</div>';
                $("#popprixmod .modal-body").html(contentmod);
                $("#popprixtype").val('sell');
                $("#popprixleadid").val($(this).data('leadid'));
                $("#popprixobj").val($(this).prev().val().split('(')[0]);
                $("#popprixinfo").html($("#popprixobj").val());
                $("#popprixmod").modal({backdrop:'static',keyboard:false});
            }
        });
        //draggable code : triggers leaders
        $(elem).get(0).setAttribute('draggable',true);
        $(elem).find('a').each(function(i,n) { n.setAttribute('draggable',false); });
        $(elem).get(0).removeEventListener("dragstart",onDragStartLead);
        $(elem).get(0).removeEventListener("dragover", onDragOverLead);
        $(elem).get(0).removeEventListener("drop", onDropLead);
        $(elem).get(0).addEventListener("dragstart",onDragStartLead);
        $(elem).get(0).addEventListener("dragover", onDragOverLead);
        $(elem).get(0).addEventListener("drop", onDropLead);
        $(elem).get(0).removeEventListener("dragend",onDragEndLead);
        $(elem).get(0).addEventListener("dragend",onDragEndLead);
        //on regenere les trigger pour afficher la cible des liens sur la map
        rt_to_map();
    }
    function maj_lead(html=false,leadid=false) {
        if(debug) console.log('maj leaders ! '+new Date(Date.now()).toLocaleTimeString());
        //if($("#tog_lead").next().css('display')=='none' && $("#tog_crois").length>0 && $("#tog_crois").next().css('display')=='none') $("#tog_lead").trigger('click');
        return new Promise((resolve,reject)=>{
        let leaders = get_stored('leaders');
        let cntAjaxCall=0, cntAjaxDone=0;
        $("div.side-widgets").find('div.s-widget').eq(1).find('div.s-widget-body div.row:not(#spe_lead)').each(function(y,v){//pour chaque leader
            //on met a jour l'action en cours du leader dynamiquement (seulement si lancé depuis check() avec le DOM de stats.php)
            if(html) {
                if($(html).find("div.side-widgets").find('div.s-widget').eq(1).find('div.row').eq(y).find('div.col-xs-6').length>1) {
                    //console.log($(v).find('div.col-xs-6').eq(1).text()+' - '+$(html).find("div.side-widgets").find('div.s-widget').eq(1).find('div.row').eq(y).find('div.col-xs-6').eq(1).text());
                    let dis = $(v).find('div.col-xs-6').eq(1).css('display');
                    $(v).find('div.col-xs-6').eq(1).replaceWith($(html).find("div.side-widgets").find('div.s-widget').eq(1).find('div.row').eq(y).find('div.col-xs-6').eq(1));
                    $(v).find('div.col-xs-6').eq(1).css('display',dis);
                }//else { console.log('pas de remplacement, div non trouvée'); console.log($(html).find("div.side-widgets").find('div.s-widget').eq(1)); }
            }
            let nom = $(v).find('div.col-xs-6').eq(1).find('a[style="color:lightgreen"]').first().text().trim();
            if($(v).find('div.col-xs-6').eq(0).find('a').first().attr('href') != undefined){
                if(!leadid ||(leadid && leadid==$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href').split('id_leader=')[1].split('&')[0])) {
                    cntAjaxCall++;
                    $.ajax({
                        url:$(v).find('div.col-xs-6').eq(1).text().includes('marchande')?'marchand.php?id_leader='+$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href').split('id_leader=')[1].split('&')[0]:$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href'),//call leader
                        type:'GET',
                        async:false,
                        success:function(json) {
                            if(debug) console.log('call '+$(v).find('div.col-xs-6').eq(0).find('a').first().attr('href')+' ('+$(v).find('div.col-xs-6').eq(0).find('a').first().text()+')');
                            //get les infos de la planete si y'en a une
                            let url = $(v).find('div.col-xs-6').eq(1).find('a').first().text().includes('Nouvelle plan')?undefined:$(v).find('div.col-xs-6').eq(1).find('a').first().attr('href');
                            if(url !== undefined)
                                $.ajax({
                                    url:url,//call planete
                                    type:'GET',
                                    async:false,
                                    success:function(json_plan) {
                                        if(debug) { console.log('call '+url+' ('+nom+')'); console.log($(json_plan).find('#ordre')); }
                                        let planetes = get_stored('planetes');
                                        if(planetes.find(o=>o.nom==$(json_plan).find('#info h3').first().text().split(' ')[1].trim()) === undefined) {
                                            if(debug) console.log(planetes.length+' + menu push -'+$(v).find('div.col-xs-6').eq(1).find('a[style="color:lightgreen"]').first().text().trim()+'-');
                                            planetes.push(get_Planete(url.split('x=')[1].split('&')[0],url.split('y=')[1].substr(0,3),json_plan));
                                        }//si la planete existe pas dans l'objet
                                        else planetes[planetes.findIndex(o=>o.nom === $(json_plan).find('#info h3').first().text().split(' ')[1])] = get_Planete(url.split('x=')[1].split('&')[0],url.split('y=')[1].substr(0,3),json_plan);
                                        set_stored('planetes',planetes);
                                        get_lead(json,v,$(json_plan).find('#info h3').first().text().split(' ')[1].trim(),html?true:false);
                                        cntAjaxDone++;
                                        if(cntAjaxCall==cntAjaxDone) resolve();
                                    },error:function(err){cntAjaxDone++; if(cntAjaxCall==cntAjaxDone) reject(err);}
                                });
                            else {
                                get_lead(json,v,nom,html?true:false);
                                cntAjaxDone++;
                                if(cntAjaxCall==cntAjaxDone) resolve();
                            }
                        },error:function(err){cntAjaxDone++; if(cntAjaxCall==cntAjaxDone) reject(err);}
                    });
                }
            }
        });});
    }//recup les infos sur mes leaders perso (leader.php - on stock l'id dans leaders) pour modifier le menu de gauche
    //--gen global html
    function js_2_html(html=false) {
        return new Promise((resolve,reject)=>{
            //panneau news
            reorder_news(filtre_actif);
            //menu leaders
            constr_menu_leader();
            maj_lead(html).then((data)=>{
                //menu croiseurs
                function suite() {
                    //panneau combats, mtnt que les infos viennent principalement de la map, on le declenche apres le $("#lamap").on('load'), sauf si on est sur une autre page ou qu'on a desactivé son reload
                    if($("#lamap").length == 0 || (!get_stored('tools').automaj.map) && !init) make_combat();
                    //ecran stats planetes (seulement si ouvert, sinon il se rechargera a l'ouverture de toute facon)
                    if($("#custom_2").hasClass('toggled')) make_planetes($("#filtreplan").val());
                    resolve();
                }
                /*if($("#insertcrois').html()=='')*/ maj_crois_global().then((data)=>{ suite(); });
                /*else {
                    let cnt = 0;
                    $.each($("#insertcrois").children('div.row'),function(i,o) {
                        $.ajax({url:$(o).find('a[href^="croiseur.php"]').first().attr("href"), type:'GET', success:function(reponse){ maj_crois_unite(reponse); cnt++; if(cnt==$("#insertcrois").children('div.row').length-1) suite(); }});
                    });
                }*/
            });
        });
    }
    //----process les infos depuis les listes de planetes de stat.php
    function clean_planetes() {
        let planetes = get_stored('planetes');
        $.each(planetes,function(i,p) {
            //re-init les infos attaques (sauf les attakdetail qu'on peut plus re-recup sinon)
            //planetes[i] = {...planetes[i],...{attakm:false,attakp:false,attaks:false,ciblem:false,ciblep:false,cibles:false}};
            //limite la taille des events
            if(p.events.length>20) planetes[i].events.splice(20,p.events.length);
        });
        set_stored('planetes',planetes);
    }
    function get_stat_news(type,v,nomPl,planetes) {
        let inconnu = false;
        let msg = (type=='lead'?'Un leader stationne sur cette planète : ':'')+$(v).attr('title');
        if(msg.includes('Nous sommes attaqu')) planetes.find(o=>o.nom==nomPl).conflit = true;
        else if(msg.includes('Transfert') || msg.includes('Attaque')) planetes.find(o=>o.nom==nomPl).attaks = msg;
        let founded = false;
        if(planetes.find(o => o.nom === nomPl).events.length>0) {
            $.each(planetes.find(o => o.nom === nomPl).events,function(k,vi) {
                if((vi.msg.length>25?vi.msg.substr(0,25):vi.msg) == (msg.length>25?msg.substr(0,25):msg)) {//news deja enregistré
                    founded = k;
                }
            });
        }
        if(founded === false){ // nouvelle liste de news pour la planete
            planetes[planetes.findIndex(o => o.nom === nomPl)].events.push({ico:$(v).attr('src'),msg:msg,date:Date.now()});
            inconnu = true;
            if(debug) console.log('Planet '+nomPl+' - insert news : '+$(v).attr('title'));
        }else {
            planetes.find(o => o.nom === nomPl).events[founded].date_last = Date.now();//ecrasement news from stat over news from map
            if(debug) console.log('Planet '+nomPl+' - update news : '+$(v).attr('title'));
        }
        return [inconnu,planetes];
    }
    var actconf=false;
    async function save_info_stat(planetes,leaders,type,tab,with_detail=false) {
        var cntL=0;var cntM=0;var cntP = 0;var news=[];
        let tools = exist_for_player('tools')?get_stored('tools'):init_tools;
        tab.find('tr').each(async function(y,tr) {
            let t = await new Promise(function(resolve,reject) {
                let cntCallAjax = 0, cntCallDone = 0;
                //infos planetes
                let coord = $(tr).find('td').first().find('a').attr('href').split('?')[1].split('#')[0];
                let nomPl = $(tr).find('td').first().find('a').text().trim();
                //si la planete existe pas on la créée
                if(planetes.length == 0 ||(planetes.length > 0 && planetes.find(o => o.nom === nomPl) === undefined)) {//nouvelle planete
                    cntP++;
                    if(debug) console.log(planetes.length+'+ stat push '+nomPl);
                    planetes.push({...planete_maker(),...{
                        x : coord.split('&')[0].split('=')[1],
                        y : coord.split('&')[1].split('=')[1],
                        nom: nomPl
                    }});
                }
                let planet = planetes.find(o => o.nom == nomPl);
                function trait_plan() {
                    //on re-initialise les leaders de la planete
                    if(planet) planetes.find(o => o.nom == nomPl).leaders = [];
                    //infos leaders
                    if($(tr).find('img[src="images/picto/leader.png"]').length>0)
                        $(tr).find('img[src="images/picto/leader.png"]').each(function(y,v) {
                            cntL++;
                            let lead = $(v).attr('title').split('(')[0].trim(), player = $(v).attr('title').split('(')[1].split(')')[0].trim(); player = player?player:'SF';
                            planetes.find(o => o.nom == nomPl).leaders.push(lead+' ('+player+')');
                            if(!leaders.find(o=>o.player==localStorage.playerName).niv.includes('Seconde') || (leaders.find(o=>o.player==localStorage.playerName).niv.includes('Seconde') && lead != leaders.find(o=>o.player==localStorage.playerName).leaders[0].nom)) {
                                if((leaders.length==0 || (leaders.length > 0 && leaders.find(o=>o.player==player) === undefined))) leaders.push({player:player,sector:true,img:false,niv:false,ally:(player===localStorage.playerName?null:false),leaders:[]});//creation player
                                if(leaders.find(o=>o.player==player).leaders.find(p=>p.nom == lead) === undefined) {
                                    if(player==localStorage.playerName) {
                                        if(leaders.find(o=>o.player=='canard')== undefined || leaders.find(o=>o.player=='canard').leaders(p=>p.nom == lead)==undefined) {
                                            leaders.push({
                                                player:'canard',
                                                sector:true,
                                                img:false,
                                                niv:'SF',
                                                ally:false,
                                                leaders:[{
                                                    nom: lead,
                                                    visited : ['<a href="detail.php?x='+planet.x+'&y='+planet.y+'" style="color:lightgreen" target="fenetre">'+nomPl+'</a>'],
                                                    pose : Date.now(),
                                                    leave : false,
                                                    traite: true,
                                                }]
                                            });
                                            mnotify('alert alert-danger',"Un canard se fait passer pour moi ! "+lead);
                                        }
                                        player = 'canard';
                                    } else if(lead) leaders.find(q=>q.player===player).leaders.push({
                                        nom : lead,
                                        visited : ['<a href="detail.php?x='+planet.x+'&y='+planet.y+'" style="color:lightgreen" target="fenetre">'+nomPl+'</a>'],
                                        pose : Date.now(),
                                        leave : false,
                                        traite: true,
                                    });//creation leader
                                }
                                //else {
                                let slead = leaders.find(o=>o.player===player).leaders.find(p=>p.nom===lead);
                                let nomP2 = '';
                                if(slead.visited.slice(-1)[0].includes('</a>')) nomP2 = slead.visited.slice(-1)[0].split('>')[1].split('</a')[0];
                                else {
                                    nomP2 = slead.visited.slice(-1)[0].toLowerCase().split(' le ')[0];
                                    if(nomP2.substr(0,5)=='empire') nomP2 = nomP2.substr(0,1).toUpperCase()+nomP2.substr(1);
                                }
                                if(nomP2.trim() != nomPl.trim()) { //leader exist sur nouvelle planete
                                    if(slead.pose) leaders.find(q=>q.player===player).leaders.find(r=>r.nom===lead).visited.splice(-1,1,'<a href="detail.php?x='+(planetes.find(o => o.nom === nomP2)!=undefined?planetes.find(o => o.nom === nomP2).x:'?')+'&y='+(planetes.find(o => o.nom === nomP2)!=undefined?planetes.find(o => o.nom === nomP2).y:'?')+'" style="color:lightgreen" target="fenetre">'+nomP2+'</a> Le '+new Date(Date.now()).toLocaleString());//on l'a pas vu en vol, on met a jour la derniere planete visité avec l'heure actuelle (au lieu de l'heure d'envol)
                                    //else : on a deja enregistrer l'heure a laquel il a quitte la planete precedente
                                    leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).visited.push('<a href="detail.php?x='+coord.split('&')[0].split('=')[1]+'&y='+coord.split('&')[1].split('=')[1]+'" style="color:lightgreen" target="fenetre">'+nomPl+'</a>');//dans tous les cas on enregistre la nouvelle planete
                                    leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).pose = Date.now();//avec la date
                                }else if(!slead.pose) {//on devrait pas avoir besoin de ca
                                    if(slead.visited.slice(-1)[0].includes(' Le ')) {
                                        let datefr = slead.visited.slice(-1)[0].split('Le ')[1].split('/');
                                        leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).pose = Date.parse(datefr[1]+'/'+datefr[0]+'/'+datefr[2]);
                                    }else leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).pose = Date.now();
                                }
                                leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).leave = false;
                                leaders.find(o=>o.player===player).leaders.find(o=>o.nom===lead).traite = true;
                                //}
                                let res = get_stat_news('lead',v,nomPl,planetes);
                                cntM += res[0]?1:0;
                                planetes = res[1];
                                if(res[0]) news.push($(v).attr('title'));
                            }
                        });
                    //brouillage auto des qu'un leader est sur une planete avec brouilleur  <img src="images/picto/ondes.png" width="20'">
                    if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation') && tools.autobrouil.active && planet.brouilleur && planet.leaders.length>0) {
                        cntCallAjax++;
                        let _promise5 = new Promise(function(resolve5,reject5) {
                            $.ajax(
                                "detail_ordre.php?x="+planet.x+"&y="+planet.y+"&champs=1"
                            ).done((data)=>{ resolve5(); });
                        }).then((data)=>{ cntCallDone++; if(cntCallDone==cntCallAjax) resolve(); });
                    }
                    //tracage auto des leaders
                    if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation') && tools.autotrace.active && planet.proprio==localStorage.playerName && planet.leaders.length>0) {
                        cntCallAjax++;
                        let _promise6 = new Promise(function(resolve6,reject6) {
                            $.ajax({
                                url:'detail.php?x='+planet.x+'&y='+planet.y,
                                type:'GET',
                                success:function(r) {
                                    let cnt=0;
                                    $(r).find('#pol').first().find('a').each(function(i,a){
                                        document.getElementById("fenetre").src = $(a).attr('href');
                                        cnt++;
                                    });//<a class="btn btn-alt btn-sm" href="detail_ordre.php?x=519&amp;y=453&amp;action=10&amp;cible=3435344&amp;nom_cible=Wanda Pirenne">Placer hypertraceur</a>
                                    //on rappel politique.php pour mettre a jour les infos leaders avec le nouveau traceur -- c'est pas super, on est dasn un process ou la var leader se fait balader, la stocker ici risque un ecrasement...
                                    if(cnt>0) {
                                        $.ajax({ url:'politique.php', type:'GET', success:function(html) {
                                            if($(html).find('img[src="../images/hyper_ondes.gif"]').length>0) {//on a des traceurs de posé
                                                $.each($(html).find('img[src="../images/hyper_ondes.gif"]').first().parent().next().get(0).childNodes,function(i,node) {
                                                    if(node.nodeName=="#text" && node.data.trim().length>0) { //chaque traceur
                                                        let nom_l = node.data.split('(')[0].trim();
                                                        let nom_p = node.data.split('(')[1].split(')')[0].trim();
                                                        if(leaders.find(o=>o.player==nom_p)!=undefined && leaders.find(o=>o.player==nom_p).leaders.find(p=>p.nom==nom_l)!=undefined) leaders.find(o=>o.player==nom_p).leaders.find(p=>p.nom==nom_l).traceur = find_nom_pl(node.data.split(')')[1].trim());
                                                    }
                                                });
                                                set_stored('leaders',leaders);
                                                resolve6();
                                            }else resolve6();
                                        }});
                                    } else resolve6();
                                }
                            });
                        }).then((data)=>{ cntCallDone++; if(cntCallDone==cntCallAjax) resolve(); });
                    }
                    //action de confrerie automatique
                    //gere le cas spécial du palais (action différente : propogation politique depuis les planetes possedants une ambassade - attente apres action : 12h)
                    if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3') && !actconf && tools.autoconf.active && planet.amb && planet.amb==get_stored('leaders').find(o=>o.player==localStorage.playerName).conf && ((tools.autoconf.palais && planet.capitale) || (!tools.autoconf.palais && !planet.capitale))) {
                        actconf = true;
                        $.ajax({url:'ambassade.php?x='+planet.x+'&y='+planet.y,async:false,success:function(resp){
                            let nodeErr='', nodeSuc='';
                            $(resp).each(function(){
                                if(this.nodeName=='DIV' && this.className.includes('alert-warning')) nodeErr=this;
                                else if(this.nodeName=='A') nodeSuc=this;
                            })
                            if(nodeErr!='') mnotify(nodeErr.className,nodeErr.innerText,3000);
                            else if(nodeSuc!='') $.ajax({url:nodeSuc.href,async:false,success:function(response){ console.log($(response)); mnotify($(response).find('div.alert').get(0).className,$(response).find('div.alert').first().html(),3000); }});
                        }});
                    }
                    //news planetes
                    if($(tr).find('img[src="images/picto/message.png"]').length>0)
                        $(tr).find('img[src="images/picto/message.png"]').each(function(y,v) {
                            let res = get_stat_news('news',v,nomPl,planetes);
                            cntM += res[0]?1:0;
                            planetes = res[1];
                            if(res[0]) news.push($(v).attr('title'));
                            if($(v).attr('title').includes('été assassiné')) {
                                $.each(leaders,function(i,p) {
                                    if(p.leaders.find(o=>o.nom==$(v).attr('title').split('leader ')[1].split(' a été')[0].trim())!=undefined) leaders[i].leaders[p.leaders.findIndex(o=>o.nom==$(v).attr('title').split('leader ')[1].split(' a été')[0].trim())].mort = true;
                                });
                            }
                        });
                    //news attaques
                    if($(tr).find('img[src="images/picto/protection.png"]').length>0)
                        $(tr).find('img[src="images/picto/protection.png"]').each(function(y,v) {
                            let res = get_stat_news('news',v,nomPl,planetes);
                            cntM += res[0]?1:0;
                            planetes = res[1];
                            if(res[0]) news.push($(v).attr('title'));
                        });
                    if(cntCallAjax==0) resolve();
                }
                function maj_plan() {
                    //si tempo, boucle par planete pour infos supp
                    if(with_detail) planete_update('detail.php?'+coord,false).then((data)=>{ trait_plan(); });
                    //sinon mise a jour minimale
                    else new Promise(function(resolve2,reject2) {
                        let cntCallAjax2 = 0, cntCallDone2 = 0 ;
                        let obj = {
                            proprio : type==1?localStorage.playerName:$(tr).find('td').eq(1).text(),
                            etat : $(tr).find('td').last().find('div.label').text(),
                            couleur: $(tr).find('td').last().find('div.label-danger').length>0 && $(tr).find('td').last().find('div.label-danger').text().includes('viable')?'red':($(tr).find('td').last().find('div.label-success').length>0 && $(tr).find('td').last().find('div.label-success').text().includes('Autonome')?'green':($(tr).find('td').last().find('div.label-info').length>0 && $(tr).find('td').last().find('div.label-info').text().toLowerCase().includes('viable')?'blue':($(tr).find('td').last().find('div.label-warning').length>0 && $(tr).find('td').last().find('div.label-warning').text().includes('Fragile')?'orange':'black'))),
                            astros : $(tr).find('.btn-green').text(),
                            urgent : urgence(planet),
                            deviation: get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation') && $(tr).find('td').last().find('span.label').length>0?$(tr).find('td').last().find('span.label').first().text().trim():false,
                            attaks: $(tr).find('img[src="images/picto/interception.png"]').length>0?$(tr).find('img[src="images/picto/interception.png"]').first().attr('title'):($(tr).find('img[src="images/picto/transfert.png"]').length>0?$(tr).find('img[src="images/picto/transfert.png"]').first().attr('title'):false),
                            cibles: $(tr).find('img[src="images/picto/cible.png"]').length>0?$(tr).find('img[src="images/picto/cible.png"]').first().attr('title'):false,
                            brouilleur: $(tr).find('img[src="images/picto/brouilleur.png"]').length>0
                        }
                        if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3') && $(tr).find('td').last().find('span.label').length>0) obj.amb = $(tr).find('td').last().find('span.label').text().trim().split(' ')[1];
                        if(type==1) {//la planete m'appartient, on a qq infos en plus...
                            obj = {...obj,...{
                                prod_astro:$(tr).find('td').eq(5).text().includes('+') && $(tr).find('td').eq(6).text().includes('+'),
                                or:$(tr).find('td').eq(4).text().replace('+','').replace('épuisé',0).replace('!',''),
                                prod_or:$(tr).find('td').eq(4).text().includes('+'),
                                etain:$(tr).find('td').eq(5).text().replace('+','').replace('épuisé',0).replace('!',''),
                                prod_etain:$(tr).find('td').eq(5).text().includes('+'),
                                fer:$(tr).find('td').eq(6).text().replace('+','').replace('épuisé',0).replace('!',''),
                                prod_fer:$(tr).find('td').eq(6).text().includes('+'),
                                vivres:$(tr).find('td').eq(7).text().replace('+','').replace('épuisé',0).replace('!',''),
                                prod_vivres:$(tr).find('td').eq(7).text().includes('+'),
                                manuf:$(tr).find('td').eq(8).text().replace('+','').replace('épuisé',0).replace('!',''),
                                prod_manuf:$(tr).find('td').eq(8).text().includes('+'),
                                next_cycle:'dans '+$(tr).find('td').eq(3).text()+' Heure(s)',
                                offre:$(tr).find('td').eq(2).find('img').length>0?$(tr).find('td').eq(2).find('img').attr('title'):null
                            }};
                            //commerce auto a ma sauce
                            if(tools.autocomm.active) {
                                //TODO: annul offre pourrie precedente ?
                                if(!obj.offre && leaders.find(o=>o.player==localStorage.playerName).niv.substr(0,8)!='Marchand') {
                                    let res = [{t:'or',qte:obj.or.trim(),p:obj.prod_or,u:0},{t:'manuf',qte:obj.manuf.trim(),p:obj.prod_manuf,u:2},{t:'vivres',qte:obj.vivres.trim(),p:obj.prod_vivres,u:2},{t:'etain',qte:obj.etain.trim(),p:obj.prod_etain,u:1},{t:'fer',qte:obj.fer.trim(),p:obj.prod_fer,u:1}];
                                    //on demande la ressource la plus urgente non produite dont on a le moins (vivre et manuf sont plus urgent que etain et fer)
                                    let demand = res.filter(a=>a.u==2 && !a.p).length?res.filter(a=>a.u==2 && !a.p).sort(function(a,b){return a.qte-b.qte})[0].t:(res.filter(a=>a.u==1 && !a.p).length?res.filter(a=>a.u==1 && !a.p).sort(function(a,b){return a.qte-b.qte})[0].t:null);
                                    //on offre de l'or si on en a, sinon la ressource qui n'est pas la ressource demandée, qui est produite (en priorite), la moins urgente et dont on a le plus)
                                    let offre = obj.or>=7?'or':(res.filter(c=>c.t!=demand && c.p && c.u==1).length?res.filter(c=>c.t!=demand && c.p && c.u==1).sort(function(a, b){return b.qte-a.qte})[0].t:(res.filter(c=>c.t!=demand && c.p && c.u==2).length?res.filter(c=>c.t!=demand && c.p && c.u==2).sort(function(a, b){return b.qte-a.qte})[0].t:(res.filter(c=>c.t!=demand && c.qte>5).length?res.filter(c=>c.t!=demand && c.qte>5).sort(function(a,b){return b.qte-a.qte})[0].t:(obj.or.qte>0?'or':null))));
                                    if(demand && offre) {
                                        let qt_demand = obj[offre].trim()>=7?5:(obj[offre].trim()>2?obj[offre].trim()-2:(obj[offre].trim()>1?obj[offre].trim()-1:1));
                                        let qt_offre = obj[offre].trim()>=7?7:(obj[offre].trim()?obj[offre].trim():1);
                                        cntCallAjax2++;
                                        let _promise4 = new Promise(function(resolve4,reject4) {
                                            mnotify("alert alert-info",'action auto realisée : offre commerciale passée sur '+nomPl+' : '+offre+'-'+qt_offre+' contre '+demand+'-'+qt_demand);
                                            passer_commande(planetes.findIndex(o=>o.nom==nomPl),false,{offre:offre+'-'+qt_offre,demande:demand+'-'+qt_demand}).then((data)=>{ resolve4(); });
                                        }).then((data)=>{ cntCallDone2++; if(cntCallDone2==cntCallAjax2) resolve2(); });
                                    }
                                }
                            }
                            //deplacement astro auto avant revolte
                            if(tools.autoastro.active) {
                                if(parseInt(obj.urgent)==3 && parseInt(obj.astro)>0 && parseInt(obj.next_cycle.split(' ')[1])<=parseInt(tools.autoastro.deadline)) {
                                    let creat = false
                                    if($("#cible_"+nomPl).length==0) {
                                        $("body").append('<input type="hidden" id="cible_'+nomPl+'" name="cible_'+nomPl+'" value="">');
                                        creat=true;
                                    }
                                    if($("#troupes_"+nomPl).length==0) {
                                        $("body").append('<input type="hidden" id="troupes_'+nomPl+'" name="troupes_'+nomPl+'" value="">');
                                        creat=true;
                                    }
                                    cntCallAjax2++;
                                    let _promise3 = new Promise(function(resolve3,reject3) {
                                        let ptemps = planetes.filter(o=>o.proprio==localStorage.playerName&&o.nom!=nomPl&&o.astros<12);//une liste des planetes m'appartenant autre que celle en question et qui ont moins de 12 astros
                                        let ptemp = ptemps.sort(function(a,b) { return calcul_parsec(a)-calcul_parsec(b); })[0];//on trie la liste pour recup la planetes la plus pres de celle en question
                                        mnotify("alert alert-info",'action auto realisée : déplacement astros depuis '+nomPl+' vers '+ptemp.nom);
                                        lancer_flotte(planetes.findIndex(o=>o.nom==nomPl),false,{cible:ptemp.x+'-'+ptemp.y+'-'+ptemp.nom+'-'+calcul_parsec(nomPl,ptemp.nom),troupes:obj.astros}).then((data)=>{resolve3();});
                                    }).then((data)=>{
                                        if(creat) $("#cible_"+nomPl+", #troupes_"+nomPl).remove()
                                        cntCallDone2++; if(cntCallDone2==cntCallAjax2) resolve2();
                                    });
                                }
                            }
                        }
                        planetes[planetes.findIndex(o => o.nom === nomPl)] = {...planet,...obj};
                        if(cntCallAjax2 == 0) resolve2();
                    }).then((data)=>{ trait_plan(); });
                }
                //avant les actions auto (donc avant la maj) on traite les actions planifiées par le joueur
                if(planet.planif && planet.planif.length && planet.planif.find(p=>p.quand && parseInt(p.quand)-Date.now()<=0)) {
                    new Promise((resolve0,reject0)=>{
                        let inde = planet.planif.findIndex(p=>p.quand && parseInt(p.quand)-Date.now()<=0);
                        let action = planet.planif.splice(inde,1)[0];
                        if(action.acte == 'astro') {
                            //if(parseInt(action.troupes)<=parseInt(planetes.find(o => o.nom == nomPl).astros) ||(parseInt(action.troupes)>parseInt(planet.astros) && confirm("La planète "+nomPl+" ne possède plus que"+planet.astros+" astros (au lieu des "+action.troupes+" prévus). Lancer quand même l'action avec "+planet.astros+" astros ?"))) {
                            if(parseInt(action.troupes)>parseInt(planet.astros)) action.troupes = planet.astros;
                            if(!planet.conflit && !planet.attakm && /*!planet.attakp && */!planet.attaks && !planet.attakdetail /*&& !planet.ciblem && !planet.cibles && !planet.ciblep*/) {
                                lancer_flotte(get_stored('planetes').findIndex(o=>o.nom==nomPl),false,{cible:action.cible,troupes:action.troupes},true).then(data0=>resolve0());
                                $("#listplanifplanets").find('#'+planet.nom+'_'+inde).remove();
                            }else {
                                mnotify("alert alert-warning","<span class='muted'>Le "+new Date(Date.now()).toLocaleString()+"</span>La planète "+nomPl+" est déjà occupée, on ré-essayera dans 30min.");
                                action.quand = Date.now()+(30*60*1000);
                                planetes.find(p=>p.nom==nomPl).planif.push(action);
                            }
                        }
                        else if(action.acte == 'noastro') $.ajax({
                            url:'detail_ordre.php',
                            type:'POST',
                            data:{x:planetes.find(o=>o.nom===nomPl).x,y:planetes.find(o=>o.nom===nomPl).y,annuler:1},
                            success:function(html){
                                if(debug) console.log('call detail_ordre.php - annulation');
                                let planetes = get_stored('planetes');
                                //planetes.find(o=>o.nom===nomPl).attakp = false;
                                planetes.find(o=>o.nom===nomPl).attakm = false;
                                planetes.find(o=>o.nom===nomPl).attaks = false;
                                planetes.find(o=>o.nom===nomPl).attakdetail = false;
                                mnotify($(html).find('div.alert').get(0).className,$(html).find('div.alert').first().html(),5000);
                                resolve0();
                            }
                        });
                        else if(action.acte == 'commerce') passer_commande(planetes.findIndex(o=>o.nom==nomPl),false,{offre:action.offre,demande:action.demande}).then(data0=>resolve0());
                        else if(action.acte == 'don') donner_planete(nomPl,action.dest).then(data0=>resolve0());
                        else if(action.acte == 'nocommerce' && planet.offre) $.ajax('detail.php?x='+planetes.find(o=>o.nom===nomPl).x+'&y='+planetes.find(o=>o.nom===nomPl).y+'&annuler_offre=1').done((data0)=>{
                                let planetes = get_stored('planetes');
                                planetes.find(o=>o.nom===nomPl).offre = false;
                                set_stored('planetes',planetes);
                                make_planetes($("#filtreplan").val());
                                resolve0();
                            });
                        //else if(action.acte == 'brou') $.ajax("detail_ordre.php?x="+planetes.find(o => o.nom === nomPl).x+"&y="+planetes.find(o => o.nom === nomPl).y+"&champs=1").done((data0)=>{ resolve0(); });
                    }).then(data=>{ maj_plan(); });
                }else maj_plan();
            });
        });
        return [[leaders,cntL],[cntM,news],[planetes,cntP]];
    }
    var tempo = false;
    var working = true;
    //maj l'objet planetes et l'objet leaders avec les infos de la page de stat (peut lancer la maj de l'objet planetes detaillé)(appel save_info_stat() pour le process)
    function get_stat(tempo) {
        if(!working) {
            working = true; actconf = false;
            return new Promise((resolve,reject)=>{$.ajax({
                url:'stats.php?voir_ressources=1',
                type:'GET',
                success:function(html) {
                    if(debug) { console.log('call stats'); console.log($(html).find('#vosplanetes tbody')); }
                    //maj des badges de messages :
                    if(html.includes('deco=1')) window.location.reload();
                    $('a[data-drawer="messages"] i.n-count').text($(html).find('a[data-drawer="messages"] i.n-count').first().text());
                    $('a[data-drawer="notifications"] i.n-count').text($(html).find('a[data-drawer="notifications"] i.n-count').first().text());
                    let txt='';
                    let leaders = get_stored('leaders');
                    let planetes = get_stored('planetes');
                    if(leaders.length > 0) $.each(leaders,function(y,o) { $.each(o.leaders,function(j,p) { leaders[y].leaders[j].traite = false; }); });
                    //enregistrement infos
                    let timid=false;
                    if(tempo) timid = mnotify('alert alert-warning','Debut Mise à jour planètes');
                    let na,na2,na3;
                    save_info_stat(planetes, leaders, 1, $(html).find('#vosplanetes tbody'), tempo).then(na=>{
                        save_info_stat(na[2][0], na[0][0], 2, $(html).find('#ennemies tbody'), tempo).then(na2=>{
                            save_info_stat(na2[2][0], na2[0][0], 3, $(html).find('#allie tbody'), tempo).then(na3=>{
                                $.each(na3[2][0],function(i,p) { na3[2][0][i].troll = undefined; });
                                if($(html).find("#fonda").length>0) $(html).find("#fonda a").each(function() { if(na3[2][0].find(o=>o.nom==$(this).text().trim())!=undefined) na3[2][0].find(o=>o.nom==$(this).text().trim()).troll = true; });
                                if(tempo) {
                                    $("#mnotify-"+timid).remove();
                                    setTimeout(function() { mnotify('alert alert-success','Mise à jour planètes terminée',5000); },1000);
                                    na3[2][0].sort(function(a,b) {return b.urgent - a.urgent;});//trie par urgence
                                    set_stored('cnt_detail',Date.now());
                                }
                                set_stored('leaders',na3[0][0]);
                                set_stored('planetes',na3[2][0]);
                                calcul_diff_lead(isNaN(parseInt(na[0][1])+parseInt(na2[0][1])+parseInt(na3[0][1]))?0:parseInt(na[0][1])+parseInt(na2[0][1])+parseInt(na3[0][1]));
                                //calcul diff news
                                if((parseInt(na[1][0])+parseInt(na2[1][0])+parseInt(na3[1][0])) > 0) {
                                    txt+=' - '+(parseInt(na[1][0])+parseInt(na2[1][0])+parseInt(na3[1][0]))+' nouvelle(x) news détectée(s)'+(parseInt(na[1][0])+parseInt(na2[1][0])+parseInt(na3[1][0])<5?' : '+[na[1][1].join('<br>'),na2[1][1].join('<br>'),na3[1][1].join('<br>')].join('<br>'):'');
                                    $("#badge-mess").text(parseInt(na[1][0])+parseInt(na2[1][0])+parseInt(na3[1][0]));
                                }
                                //calcul diff planetes
                                if((parseInt(na[2][1])+parseInt(na2[2][1])+parseInt(na3[2][1])) > 0) txt+=' - '+(parseInt(na[2][1])+parseInt(na2[2][1])+parseInt(na3[2][1]))+' nouvelle(s) planète(s) détectée(s)';
                                if(txt!='') mnotify("alert alert-success",txt,15000);
                                js_2_html(html).then((data)=>{ resolve(); });//generation affichage
                            });
                        });
                    });
                }
            });});
        }else return new Promise((resolve,reject)=>{ resolve(); });
    }
    //-------Le point d'entré du process :
    //-------commence par appeller get_stat() pour maj les infos global (planetes, leaders posé)
    //-------qui appellera js_2_html() pour la suite du process :
    //-------maj_lead() (pour recup les infos sur mes leaders et maj le html de l'ecran avec)
    //-------puis maj_crois() (pour recup les infos sur mes croiseurs et maj le html de l'ecran avec)
    //-------puis génération du html supplementaire restant (menu autres leaders, ecran news)(l'ecran planetes se genere au clic et l'ecran combat se genere soit au load de la map)
    function check(force=false) {
        let automaj = exist_for_player('tools')?get_stored('tools').automaj:init_tools.automaj;
        let cnt_detail = exist_for_player('cnt_detail')?get_stored('cnt_detail'):Date.now();
        if(!exist_for_player('cnt_detail')) force=true;
        if(debug) console.log('check '+(force?'force':'')+'! '+new Date(Date.now()).toLocaleTimeString()+' (dernier detail à '+new Date(parseInt(cnt_detail)).toLocaleTimeString()+' toutes les '+automaj.freq+' min)');
        set_stored('val_tempo',(parseInt(automaj.maj)<=0?1:parseInt(automaj.maj))*60);
        tempo = (force || (automaj.active && (dateDiff(cnt_detail,Date.now()).min >= parseInt(automaj.freq) || dateDiff(cnt_detail,Date.now()).hour > 0 || dateDiff(cnt_detail,Date.now()).day > 0))) ? true : false;
        if(tempo) set_stored('cnt_detail',Date.now());
        clean_planetes();
        if(!init && $("#lamap").length>0 && automaj.map) {//l'option maj de la map est activé, on la lance
            //on nettoie les nodes pour optimiser le js ?
            if($("#lamap").contents().find('.addjme').length>0) {
                $("#lamap").contents().find('div.divplanete img').each(function() { $(this).popover('destroy'); });
                $("#lamap").contents().find('.addjme').remove();
                //TODO: nettoyage au cas ou ce n'est pas la map qui est affichée mais le tableau des planetes ?
            }
            //document.getElementById('lamap').contentWindow.location.reload(true);
            document.getElementById('lamap').src = 'map.php';
            //setTimeout(function(){ get_stat(tempo); },5000);
        } else get_stat(tempo).then((data)=>{ working = init = tempo = false; });
    }
    //bouton reset && re-rempli var planete
    $("#reset").on('click',function() {
        let l = get_stored('leaders');
        l = reset_secteur(l);
        set_stored('leaders',l);
        check();
    });
    $(".holobzr").css('display','none').attr('href','#');
    //enchainement des calls uniques (à l'init, pas besoin de maj plus tard)
    init_leaders();
    var infosect=false;
    document.getElementById('fenetre').src = 'objectif.php';
    new Promise((res1,rej1)=>{
        //-------recup la carte de la galaxie (stocké dans le DOM)
        if(debug) console.log('call galaxie.php');
        $.ajax({
            url:'galaxie.php',
            success:function(html) {
                $("#galaxie").html($(html).find('table').get(0).outerHTML);
                if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3')){
                    //-------recup la carte des amb/conf (decoupé, associé et stocké dans les cellules de la carte de la galaxie)
                    $.ajax({
                        url:'carte_amb.php',
                        success:function(htmlconf){
                            if(!get_stored('leaders').find(o=>o.player==localStorage.playerName).conf) {
                                //-------recup le nom de la confrerie du joueur
                                $.ajax({
                                    url:'confreries.php',
                                    success:function(htconf) {
                                        let leaders = get_stored('leaders');
                                        leaders.find(o=>o.player==localStorage.playerName).conf = $(htconf).find("#fenetre").first().attr('src').trim().split('confrerie=')[1];
                                        set_stored('leaders',leaders);
                                        res1(htmlconf);
                                    }
                                });
                            } else res1(htmlconf);
                        }
                    });
                } else res1();
            }
        });
    }).then(conf=>{
        if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3')) $("#profile-menu a").first().after(' (<a href="confrerie.php?confrerie='+get_stored('leaders').find(o=>o.player==localStorage.playerName).conf+'" target="fenetre">'+get_stored('leaders').find(o=>o.player==localStorage.playerName).conf.toUpperCase()+'</a>)');
        $("#galaxie").append('<style>.blinkactif{animation:blinkinga 5s steps(5, end) infinite}.blinkboth{animation:blinkingb 5s steps(5, end) infinite} @keyframes blinkinga {0%{border:none;}100%{border:1px solid red;}} @keyframes blinkingb{0%{border:1px dotted rebeccapurple;}100%{border:1px solid red;}}</style>');
        $("#galaxie tr:not(:first,:last)").each(function(i,r){
            $(r).find('td:not(:nth-child(-n+1)),:last').each(function(j,c) {
                if($(c).find('div.secteur').length==0) $(c).append('<div class="secteur"></div>');
                $(c).find('div.secteur').first().find('br:first').remove();
                $(c).find('div.secteur').first().attr('id',(45+i)+'_'+(44+j)).prepend((conf!=null&&j>0?'<div style="display:none;" class="i3">'+($(conf).find('table tbody').children('tr').eq(i).children('td').eq(j-1).find('table').length?$(conf).find('table tbody').children('tr').eq(i).children('td').eq(j-1).find('table').first().find('tr').eq(0).find('td').eq(0).html():'')+'</div>':'')+'<p style="width:100%;font-size:10px;margin:0;">'+(45+i)+'/'+(44+j)+'</p>')
                    .find('br:nth-child(-n+'+($(c).find('div.secteur').first().find('br').length<2?'1':'2')+')').remove();
                if(conf!=null&&j>0&&$(conf).find('table tbody').first().children('tr').eq(i).children('td').eq(j-1).find('table').length>0) {
                    $(c).find('div.secteur .i3').get(0).childNodes[0].remove();//N° secteur (on l'a deja)
                    $(c).find('div.secteur .i3').html('Confréries : <br>'+$(c).find('div.secteur .i3').html().replaceAll('#33FF00','rebeccapurple'));
                    let hasactif = false;
                    let hasmine = false;
                    if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).conf && $(c).find('div.secteur .i3').html().includes(get_stored('leaders').find(o=>o.player==localStorage.playerName).conf)) hasmine = true;
                    if($(c).find('div.secteur .i3').find('font[color="#FF3300"]').length) hasactif = true;
                    if(hasactif && hasmine) $(c).find('div.secteur').addClass('blinkboth');
                    else if(hasactif) $(c).find('div.secteur').addClass('blinkactif');
                    else if(hasmine) $(c).find('div.secteur').css('border','1px dotted rebeccapurple');
                    $(c).find('div.secteur').first().popover({html:true,trigger:'hover',content:$(c).find('div.i3').first().html()});
                }
            });
        });
        new Promise((res2,rej2)=>{
            //-------recup les infos sur les joueurs du secteur (alliances.php, puis fiche.php - stocké dans var leaders)
            if(debug) console.log('call alliance.php');
            if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Seconde')) $.ajax({
                url:'alliance2.php',
                type:'GET',
                success:function(json) {
                    if(debug) console.log($(json).find('table.table'));
                    let callAjax = 0; let callDone = 0;
                    $(json).find('table.table tr:has(td)').each(function(i,v) {
                        //if($(v).find('td a').length>0 && $(v).find('td a').first().attr('onclick').includes('fiche.php')) {//on ne traite que les lignes ayant un lien vers la description d'un joueur -- plus d'actualité, mtnt on a besoin de Empire, Neutre, Mulet
                            let nom = $(v).find('td').eq(0).text().split('(')[0].trim();
                            //si le joueur est pas encore dans l'objet, on le créé
                            let leaders = get_stored('leaders');
                            if(leaders.find(o=>o.player===nom)===undefined && nom) leaders.push({player:nom,sector:true,img:false,niv:$(v).find('td').eq(0).text().split('(')[1].split(')')[0].trim(),ally:false,renforts:false,leaders:[]});
                            else if(nom){
                                leaders.find(o=>o.player===nom).sector = true;
                                leaders.find(o=>o.player===nom).ally = false;
                                leaders.find(o=>o.player===nom).renforts = false;
                                if(/*!leaders.find(o=>o.player===nom).niv && */!['neutre','empire','mulet'].includes($(v).find('td').eq(1).text().toLowerCase().trim())) leaders.find(o=>o.player===nom).niv = $(v).find('td').eq(0).text().split('(')[1].split(')')[0].trim();
                            }
                            set_stored('leaders',leaders);
                            //si son avatar a pas encore ete recup (ou sa conf si c'est un I3), on fait l'appel a la fiche joueur (sauf pour Empire/Neutre/Mulet)
                            if(!leaders.find(o=>o.player===nom).img || ($(v).find('td').eq(0).text().split('(')[1].split(')')[0].includes('Niv3') && !leaders.find(o=>o.player===nom).conf)) {
                                callAjax++;
                                new Promise((res3,rej3)=>{
                                    if(debug) console.log('call fiche '+nom);
                                    $.ajax({
                                        url:'fiche.php?joueur='+nom,
                                        type:'GET',
                                        success:function(j1) {
                                            if(debug) console.log($(j1).find('#joueur').html());
                                            let leaders2 = get_stored('leaders');
                                            leaders2.find(o=>o.player===nom).img = $(j1).find('#photo img').first().attr('src');
                                            console.log($(j1).find('#photo img').first().attr('src'));
                                            //if(!leaders2.find(o=>o.player===nom).niv) leaders2.find(o=>o.player===nom).niv = $(j1).find('#joueur').html().split('<br>')[1].split('> ')[1].trim();
                                            if(leaders2.find(o=>o.player===nom).niv.includes('Niv3')) {
                                                let conf='';
                                                $.each($(j1).find('#joueur').get(0).childNodes,function(i,n) { if(n.nodeName=='#text' && n.data.includes('onfrérie')) conf = n.data.trim().split(' ')[1]; });
                                                leaders2.find(o=>o.player===nom).conf = conf;
                                            }
                                            set_stored('leaders',leaders2);
                                            res3();
                                        }
                                    });
                                }).then((data)=>{ callDone++; if(callAjax==callDone) res2(); });
                            }
                        //}
                    });
                    if(callAjax==0) res2();
                }
            });
            else $.ajax({
                url:'alliance.php',
                type:'GET',
                success:function(json) {
                    if(debug) console.log($(json).find('table tr'));
                    let callAjax = 0; let callDone = 0;
                    $(json).find('table tr:not(tr:nth-last-child(-n+2), tr:has(th))').each(function(i,v) {
                        //if($(v).find('td a').length>0 && $(v).find('td a').first().attr('onclick').includes('fiche.php')) {//on ne traite que les lignes ayant un lien vers la description d'un joueur -- plus d'actualité, mtnt on a besoin de Empire, Neutre, Mulet
                            let nom = $(v).find('td').eq(0).find('a').length?$(v).find('td').eq(0).find('a').text().trim():$(v).find('td').eq(0).text().trim();
                            //si le joueur est pas encore dans l'objet, on le créé
                            let leaders = get_stored('leaders');
                            if(leaders.find(o=>o.player===nom)===undefined && nom) leaders.push({player:nom,sector:true,img:false,niv:!$(v).find('td').eq(1).text().toLowerCase().includes('neutre')?$(v).find('td').eq(1).text().trim():false,ally:$(v).find('img[src="../images/alliance.gif"]').length>0?true:false,renforts:$(v).find('td').eq(3).text().includes('Soutien')?parseInt($(v).find('td').eq(3).text().split('Soutien : ')[1].trim()):false,leaders:[]});
                            else {
                                leaders.find(o=>o.player===nom).sector = true;
                                if(leaders.find(o=>o.player===nom).ally && $(v).find('img[src="../images/alliance.gif"]').length == 0) mnotify("alert alert-danger",'Alliance rompue avec '+nom,5000);
                                if(!leaders.find(o=>o.player===nom).ally && $(v).find('img[src="../images/alliance.gif"]').length > 0) mnotify("alert alert-success",'Alliance signée avec '+nom,5000);
                                leaders.find(o=>o.player===nom).ally = $(v).find('img[src="../images/alliance.gif"]').length > 0 ? true : false;
                                 leaders.find(o=>o.player===nom).renforts = $(v).find('td').eq(3).text().includes('Soutien')?parseInt($(v).find('td').eq(3).text().split('Soutien : ')[1].trim()):false;
                                if(/*!leaders.find(o=>o.player===nom).niv && */!['neutre','empire','mulet'].includes($(v).find('td').eq(1).text().toLowerCase().trim())) leaders.find(o=>o.player===nom).niv = $(v).find('td').eq(1).text().trim();
                            }
                            set_stored('leaders',leaders);
                            //si son avatar a pas encore ete recup (ou sa conf si c'est un I3), on fait l'appel a la fiche joueur (sauf pour Empire/Neutre/Mulet)
                            if($(v).find('td').eq(0).find('a').length && !leaders.find(o=>o.player===nom).img || ($(v).find('td').eq(1).text().includes('Niv3') && !leaders.find(o=>o.player===nom).conf)) {
                                callAjax++;
                                new Promise((res3,rej3)=>{
                                    if(debug) console.log('call fiche '+nom);
                                    $.ajax({
                                        url:'fiche.php?joueur='+nom,
                                        type:'GET',
                                        success:function(j1) {
                                            if(debug) console.log($(j1).find('#joueur').html());
                                            leaders.find(o=>o.player===nom).img = $(j1).find('#photo img').first().attr('src');
                                            //if(!leaders.find(o=>o.player===nom).niv) leaders.find(o=>o.player===nom).niv = $(j1).find('#joueur').html().split('<br>')[1].split('> ')[1].trim();
                                            if(leaders.find(o=>o.player===nom).niv.includes('Niv3')) {
                                                let conf='';
                                                $.each($(j1).find('#joueur').get(0).childNodes,function(i,n) { if(n.nodeName=='#text' && n.data.includes('onfrérie')) conf = n.data.trim().split(' ')[1]; });
                                                leaders.find(o=>o.player===nom).conf = conf;
                                            }
                                            set_stored('leaders',leaders);
                                            res3();
                                        }
                                    });
                                }).then((data)=>{ callDone++; if(callAjax==callDone) res2(); });
                            }
                        //}
                    });
                    if(callAjax==0) res2();
                }
            });
        }).then(data=>{
            clear_leaders();
            new Promise((res4,rej4)=>{
                //-------recup mes leaders avec des infos poussées (pour recup id holo a la base) et genere le menu tools
                if(debug) console.log('call politique.php');
                $.ajax({
                    url:'politique.php',
                    type:'GET',
                    success:function(html) {
                        let leaders = get_stored('leaders');
                        if(leaders.find(o=>o.player===localStorage.playerName)===undefined && localStorage.playerName) leaders.push({player:localStorage.playerName,sector:true,img:false,niv:false,ally:null,leaders:[]});
                        $(html).find('table').first().find('tr').each(function(k,n) {
                            if(leaders.find(o=>o.player===localStorage.playerName).leaders.findIndex(p=>p.nom==$(n).find('td').eq(1).find('a').first().text().trim())==-1) leaders.find(o=>o.player===localStorage.playerName).leaders.push({
                                nom : $(n).find('td').eq(1).find('a').first().text().trim(),
                                visited : [$(n).find('td').eq(2).html().includes(' à ') && $(n).find('td').eq(2).find('a').length>0?'<a href="detail.php?x='+$(n).find('td').eq(2).find('a').first().attr('href').split('x=')[1].split('&y=')[0]+'&y='+$(n).find('td').eq(2).find('a').first().attr('href').split('y=')[1].split('#')[0]+'" style="color:lightgreen" target="fenetre">'+$(n).find('td').eq(2).find('a').first().text().trim()+'</a>':'Inconnu'],
                                pose : $(n).find('td').eq(2).html().includes(' à ')?Date.now():false,
                                leave : !$(n).find('td').eq(2).html().includes(' à ')?Date.now():false,
                                traite: true,
                            });
                            let id_lead = leaders.find(o=>o.player===localStorage.playerName).leaders.findIndex(p=>p.nom==$(n).find('td').eq(1).find('a').first().text().trim());
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].pic = $(n).find('td').eq(0).find('img').first().attr('src');
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].xp = {assassin:0,politique:0,explo:0};
                            $.each($(n).find('td').eq(1).get(0).childNodes,function(i,q){
                                if(q.nodeName=='#text') {
                                    if(q.data.includes('Assa')) leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].xp.assassin = q.data.split('.')[1].trim();
                                    else if(q.data.includes('Pol')) leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].xp.politique = q.data.split('.')[1].trim();
                                    else if(q.data.includes('Exp')) leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].xp.explo = q.data.split('.')[1].trim();
                                }
                            });
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].holo = $(n).find('td').eq(3).find('a').last().text()=='Holo-Baazaar'?true:false;
                            let cntObj=0;
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].objets = [];
                            $.each($(n).find('td').eq(3).get(0).childNodes,function(g,b) {
                                if(b.nodeName=='A' && b.innerText!='Holo-Baazaar') {
                                    let n1 = false;
                                    if($(n).find('td').eq(3).get(0).childNodes[g+1]!==undefined) n1 = $(n).find('td').eq(3).get(0).childNodes[g+1].nodeName=='#text'?parseInt($(n).find('td').eq(3).get(0).childNodes[g+1].data.replace('(','').replace(')','').trim()):false;
                                    leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].objets.push({nom:b.innerText,qte:n1?n1:1});
                                    cntObj = cntObj+(n1?n1:1);
                                }
                            });
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].total_objets = cntObj;
                            if(leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].holo) $(".holobzr").css('display','inline-block').attr('href','holo-vente.php?id_leader='+leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].id+'&achat=1#debut');
                            leaders.find(o=>o.player===localStorage.playerName).leaders[id_lead].activite = $(n).find('td').eq(2).html();
                        });
                        infosect = $(html).find('#connaissance').get(0).childNodes[0].data.split(': ')[1].replace(' planètes sur ','/')+($(html).find('#connaissance').get(0).childNodes[3].nodeName=='BR'?'':'('+$(html).find('#connaissance').get(0).childNodes[3].data.trim().split(' ')[0]+')');
                        //TODO: info sonde mental ?
                        $.each(leaders,function(ind,l) { $.each(l.leaders,function(inde,le) { leaders[ind].leaders[inde].traceur = undefined; }); });
                        if($(html).find('img[src="../images/hyper_ondes.gif"]').length>0) {//on a des traceurs de posé
                            $.each($(html).find('img[src="../images/hyper_ondes.gif"]').first().parent().next().get(0).childNodes,function(i,node) {
                                if(node.nodeName=="#text" && node.data.trim().length>0) { //chaque traceur
                                    let nom_l = node.data.split('(')[0].trim();
                                    let nom_p = node.data.split('(')[1].split(')')[0].trim();
                                    if(leaders.find(o=>o.player==nom_p)!=undefined && leaders.find(o=>o.player==nom_p).leaders.find(p=>p.nom==nom_l)!=undefined) leaders.find(o=>o.player==nom_p).leaders.find(p=>p.nom==nom_l).traceur = find_nom_pl(node.data.split(')')[1].trim());
                                }
                            });
                        }
                        set_stored('leaders',leaders);
                        res4();
                    }
                });
            }).then(data=>{
                new Promise((res5,rej5)=>{
                    if(get_stored('leaders').find(o=>o.player===localStorage.playerName) !== undefined && get_stored('leaders').find(o=>o.player===localStorage.playerName).img === false) {
                        //on recup l'img de profil du joueur si on l'a jamais fait (et le niveau si on l'a pas encore depuis le load de #fenetre > debut.php)
                        if(debug) console.log('call fiche '+localStorage.playerName);
                        $.ajax({
                            url:'fiche.php?joueur='+localStorage.playerName,
                            type:'GET',
                            success:function(j1) {
                                if(debug) console.log($(j1).find('#joueur'));
                                let leaders = get_stored('leaders');
                                if(leaders.find(o=>o.player===localStorage.playerName)===undefined && localStorage.playerName) leaders.push({player:localStorage.playerName,sector:true,img:false,niv:false,ally:null,leaders:[]});
                                leaders.find(o=>o.player===localStorage.playerName).img = $(j1).find('#photo img').first().attr('src');
                                if(!leaders.find(o=>o.player===localStorage.playerName).niv) leaders.find(o=>o.player===localStorage.playerName).niv = $(j1).find('#joueur').html().split('<br>')[1].split('> ')[1];
                                set_stored('leaders',leaders);
                                res5();
                            }
                        });
                    } else res5();
                }).then(data=>{
                    working = false;
                    /*if(!exist_for_player('val_tempo') || !exist_for_player('planetes')) */check();
                    //else js_2_html();//les variables necessaire a genere l'affichage existe, pas besoin de les mettre a jour tout de suite
                });
            });
        });
    });
    //surcharge d'un trigger existant pour declencher la gen html associée
    $('body').off('click touchstart', '.drawer-toggle');
    $('body').on('click touchstart', '.drawer-toggle', function(e){
        e.preventDefault();
        let drawer = $(this).attr('data-drawer');
        $('.drawer:not("#'+drawer+'")').removeClass('toggled');
        if($('#'+drawer).hasClass('toggled')) {
            $('#'+drawer).removeClass('toggled');
            if(drawer=='custom0') $("#spec_content0").empty();
            else if(drawer=='custom1') $("#spec_content1").empty();
            else if(drawer=='custom2') $("#spec_content2").empty();
            else if(drawer=='messages') { $("#messages").find('div.overflow').empty(); if($("#warnmsgbtn").length) $("#warnmsgbtn").popover('hide'); }
            else if(drawer=='custom3') $("#spec_content3").empty();
        }else{
            $('#'+drawer).addClass('toggled');
            if(drawer=='custom0') reorder_news(filtre_actif);
            else if(drawer=='custom1') make_combat();
            else if(drawer=='custom2') make_planetes($("#filtreplan").val());
            else if(drawer=='messages') check_inbox();
            else if(drawer=='custom3') constr_menu_tools();
        }
    });
    //script de lecture de la carte du secteur (1ere iframe)
    var line = 'onHover';
    var attakdetail =[];
    var marchand_line = [];
    var reloadmap_bygal = false;
    if($("#lamap").length > 0) $("#lamap").on('load',function() {
        if(window.frames.lamap.location.href.includes('carte_secteur')) $("#lamap").contents().find('body').append('<button class="btn btn-alt" style="float:right;" onclick="window.parent.postMessage(JSON.stringify({type:\'galaxie\'}))"><i class="fa fa-turn-up"></i>&nbsp;Galaxie</button>');
        $("#lamap").contents().find('body').append('<style>.popover{max-width:100%;}.popover-content{padding:0;}.popover-title{padding:0;}</style>'+css_btn+css_noscroll+css_customscroll+css_toggleswicth_checkbox);
        //recup les news
        if(debug) console.log('get news from map...');
        $("#lamap").contents().find('div.ligneico').each(function(i,v){
            let planets = get_stored('planetes');
            let l = $(this).attr('style').split('left:')[1].split('px')[0];
            let t = $(this).attr('style').split('top:')[1].split('px')[0];
            let img = $(v).parent().find('div.divplanete[style=" left:'+(l-5)+'px;top:'+(t-5)+'px;"]').find('img').first();//ico generale
            if(img.attr('id')==undefined) img = $(v).prev().find('img').first();//le calcul des coord s'est mal fait ? on se base sur le DOM alors, pour les ico générale
            if(img.attr('id')!=undefined) {
                if(planets.find(o=>o.nom===img.attr('id')) === undefined){
                    if(debug) console.log(planets.length+' + map push '+img.attr('id'));
                    planets.push({...planete_maker(),...{
                        x:img.data('onclick')!=undefined?img.data('onclick').split('x=')[1].split('&')[0]:img.attr('onclick').split('x=')[1].split('&')[0],
                        y:img.data('onclick')!=undefined?img.data('onclick').split('y=')[1].split('&')[0]:img.attr('onclick').split('y=')[1].split('&')[0],
                        nom:img.attr('id'),
                        owner:img.attr('title').split('_')[0]
                    }});//la planete n'existe pas dans l'objet, on l'ajoute
                }
                planets.find(o=>o.nom===img.attr('id')).attakmn = false;
                planets.find(o=>o.nom===img.attr('id')).ciblemn = false;
                $(v).find('span[class^="pict"]').each(function(j,w){// le class^=pict permet de ne pas traiter les specifiques missions (dev en F, offre en M), on les fait séparement
                    if($(w).find('img').first().attr('src') !== undefined) {//du coup ici c'est redondant...
                        if($(w).find('img').first().attr('src') == "images/picto/interception.png" || $(w).find('img').first().attr('src') == "images/picto/colonisation.png") { planets.find(o=>o.nom===img.attr('id')).attakmn = $(w).find('img').first().attr('title'); }
                        else if($(w).find('img').first().attr('src') == "images/picto/cible.png") { planets.find(o=>o.nom===img.attr('id')).ciblemn = $(w).find('img').first().attr('title'); }
                        else if($(w).find('img').first().attr('src') == "images/picto/transfert.png") planets.find(o=>o.nom===img.attr('id')).attakmn = $(w).find('img').first().attr('title');
                        else if($(w).find('img').first().attr('src') == "images/picto/mort.png") {
                            let leaders = get_stored('leaders');
                            $.each(leaders,function(i,p) {
                                if($(w).find('img').first().attr('title').includes('leader')) if(p.leaders.find(o=>o.nom==$(w).find('img').first().attr('title').split('leader ')[1].split(' a été')[0].trim())!=undefined) leaders[i].leaders[p.leaders.findIndex(o=>o.nom==$(w).find('img').first().attr('title').split('leader ')[1].split(' a été')[0].trim())].mort = true;
                            });
                            set_stored('leaders',leaders);
                        }else if($(w).find('img').first().attr('src') == "images/picto/navette.png") planets.find(o=>o.nom==img.attr('id')).navette = true;
                        //else {
                            if($(w).find('img').first().attr('src') == "images/picto/leader.png" && planets.find(o=>o.nom==img.attr('id')).leaders.length>0) $(w).find('img').first().attr('title','Leader(s) présent(s) : '+planets.find(o=>o.nom===img.attr('id')).leaders.join(', '));
                            let founded=false;
                            if(planets.find(o=>o.nom===img.attr('id')).events.length>0)
                                $.each(planets.find(o=>o.nom===img.attr('id')).events,function(k,vi) {
                                    if((vi.msg.length>25?vi.msg.substr(0,25):vi.msg) == ($(w).find('img').first().attr('title').length>25?$(w).find('img').first().attr('title').substr(0,25):$(w).find('img').first().attr('title'))) founded = k;
                                });
                            if(founded === false) planets.find(o=>o.nom===img.attr('id')).events.push({ico:$(w).find('img').first().attr('src'),msg:$(w).find('img').first().attr('title'),date:Date.now()});
                            else {
                                planets.find(o=>o.nom===img.attr('id')).events[founded].ico = $(w).find('img').first().attr('src');
                                planets.find(o=>o.nom===img.attr('id')).events[founded].date_last = Date.now();
                            }
                        //}
                    }
                });
                $(v).find('span[class^="label"]').each(function(j,w){
                    if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv){
                        if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Marchand')) {
                            //on stock les offres, c'est plus rapide que d'attendre une maj detaillée
                            if(!$(w).text().includes('Réservé')) planets.find(o=>o.nom===img.attr('id')).offre = 'Off. '+$(w).text().split('-')[1]+' '+$(w).text().split('-')[0]+' <=> '+$(w).text().split('-')[3]+' '+$(w).text().split('-')[2];
                        } else if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation')){
                            //TODO: stocker dev ?  planets.find(o=>o.nom===img.attr('id')).dev = $(w).text();
                        } else if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('niv3')) {
                            //TODO: stocker les amb ?  planets.find(o=>o.nom===img.attr('id')).amb = $(w).text();
                        }
                    }
                });
            }
            img = $(v).parent().find('div.divplanete[style=" left:'+(l-5)+'px;top:'+(t-45)+'px;"]').find('img').first();//ico pour mes leaders
            if(img.attr('id')==undefined) img = $(v).prev().prev().find('img').first();//basé sur le DOM pour l'ico de mes leaders
            if(img.attr('id')!=undefined) {
                $(v).find('a').each(function(k,x) {
                    let founded=false;
                    if(planets.find(o=>o.nom===img.attr('id')).events.length>0)
                        $.each(planets.find(o=>o.nom===img.attr('id')).events,function(k,vi) {
                            //en fonction de l'icone
                            let mess='';
                            if($(x).find('img').first().attr('src')=="images/picto/assassin1.png") mess = " assassine";
                            else if($(x).find('img').first().attr('src')=="images/picto/working.png") mess = " construit";
                            else if($(x).find('img').first().attr('src')=="images/picto/leader_politique.png") mess = " politise";//TODO: a remplacer par images/picto/aura-leader.png, mais pour les autres ?
                            else if($(x).find('img').first().attr('src')=="images/picto/leader_inactif.png") mess = " glande rien";//images/picto/leader-awaiting.png
                            if(mess!='' && !$(x).find('img').first().attr('title').includes(mess)) $(x).find('img').first().attr('title',$(x).find('img').first().attr('title')+mess);
                            if(vi.msg == $(x).find('img').first().attr('title')) founded = k;
                        });
                    if(founded === false) planets.find(o=>o.nom===img.attr('id')).events.push({ico:$(x).find('img').first().attr('src'),msg:$(x).find('img').first().attr('title'),date:Date.now()});
                    else planets.find(o=>o.nom===img.attr('id')).events[founded].ico = $(x).find('img').first().attr('src');
                });
            }
            set_stored('planetes',planets);
        });
        if(debug) console.log('... got news from map');
        //custom
        if(get_stored('custommap')=="1"){
            let a = [];
            $("#lamap").contents().find('div.divplanete').each(function(i,v){ a.push(custom_map_pl(v)); });
            //on switch les images de planetes
            //let chgtplan = [{src:'https://i.ibb.co/jLyjJVW/a8.gif',scale:1},{src:'https://i.ibb.co/QcSdhpx/09090908400740454417914.gif',scale:1},{src:'https://i.ibb.co/FxbqkGP/bv000077.gif',scale:0.7},{src:'https://i.ibb.co/zHtqtzH/bv000088-1.gif',scale:0.7},{src:'https://i.pinimg.com/originals/1f/21/29/1f2129c6421c0a5ad3e2f9631604ed7b.gif',scale:1},{src:'',scale:1},{src:'',scale:1},{src:'https://i.ibb.co/8x5d4hL/terre-qui-tourne.gif',scale:0.6},{src:'',scale:1}];
            let chgtplan = [{src:'https://i.ibb.co/RNWgfsT/soleil-rouge.gif',scale:1},{src:'https://i.ibb.co/QcSdhpx/09090908400740454417914.gif',scale:1},{src:'https://i.ibb.co/5nK0cq2/ceres.gif',scale:1},{src:'https://i.ibb.co/tJNkkQF/blackhole.webp',scale:1},{src:'https://i.ibb.co/TPQGTSk/mars.webp',scale:1},{src:'https://i.ibb.co/F0yg52f/LUNEterre.webp',scale:1},{src:'https://i.ibb.co/559stxX/jupiter.webp',scale:1},{src:'https://i.ibb.co/VVwnqBj/red-sun.webp',scale:1},{src:'https://i.ibb.co/zHtqtzH/bv000088-1.gif',scale:0.7}];//https://i.ibb.co/6PtvxSZ/galaxy2.webp
            a = [...new Set(a)];
            a.splice(a.findIndex(a=>a=="images/planetes/planete62.png"),1);//les miennes ont deja ete remplacées
            $.each(a,function(i,u) { if(chgtplan[i] && chgtplan[i].src!='') $("#lamap").contents().find('img[src="'+u+'"]').attr('src',chgtplan[i].src).css('object-fit','contain');/*.css('transform','scale('+chgtplan[i].scale+')');*/ });
            if(debug) console.log('... map customized');
        }
        //on lance l'init de LeaderLine
        window.frames.lamap.postMessage(JSON.stringify({type:'line',value:line}));
        //on remet la bonne valeur du zoom
        window.frames.lamap.postMessage(JSON.stringify({type:'zoom',value:$("#valzoom").val()||80}));
        //info secteur depuis politique.php
        //total nombre de planetes tous secteurs selon mission : ((get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.substr(0,1).split('').map(i=>['E','M','I','S'].includes(i)?1:2)[0]+(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.toLowerCase().includes('niv2')?(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.substr(0,1)=='F'?2:1):0))*100)
        if(infosect) $("#lamap").contents().find('#consect').html('Planètes inconnues : '+(parseInt(infosect.split('/')[1])-parseInt(infosect.split('(')[0]))+'/'+infosect.split('/')[1].split('(')[0]+(infosect.includes('(')?'&nbsp;&nbsp;&nbsp;'+(parseInt(infosect.split('(')[1].split(')')[0])>0?'<br>dont '+infosect.split('(')[1].split(')')[0]+' non revendiquées':''):'')).css('color',parseInt(infosect.split('/')[0])==parseInt(infosect.split('/')[1].split('(')[0])?'green':'red');
        if(!init&&!reloadmap_bygal) get_stat(tempo).then((data)=>{ working = tempo = false; make_combat(); });
        else if(!reloadmap_bygal) make_combat();
    });
    //document.getElementById('lamap').addEventListener('scroll',function() { $.each(ll,function(i,l) { l.position(); }); },false);
    //script pour la 2eme iframe (multi fenetres)
    window.addEventListener("message", function(e){
        let datas = JSON.parse(e.data);
        if(datas.type=='don') donner_planete(datas.planId,datas.benef);
        else if(datas.type=='line') line = datas.value;
        else if(datas.type=='stat') stat_plan(datas.planId);
        else if(datas.type=='tour') { $("#loader").show(); window.setTimeout(function(){ propo_tournee(datas.leadid); },100); }
        else if(datas.type=="drawtour") window.frames.lamap.postMessage(e.data);
        else if(datas.type=='galaxie') {
            //$(".fadeoutgal").removeClass('fadeoutgal');
            $("#lamap").removeClass('fadeinmap').addClass('fadeoutmap');
            window.setTimeout(function(){
                $("#galaxie, #lamap, #arrleft, #arrright, #zoominput").toggle();
                window.setTimeout(function(){
                    if($("#galaxie .yourehere").length==0){
                        let sect = [];
                        let niv = get_stored('leaders').find(o=>o.player==localStorage.playerName).niv;
                        //on va considérer que la premiere planete qui apparait sur la carte est sur le premier secteur...
                        let aPlan = $("#lamap").contents().find('div.divplanete img').first().data('onclick');
                        sect.push(aPlan.split('x=')[1].split('&')[0].substr(0,2)+'_'+aPlan.split('y=')[1].split('&')[0].substr(0,2));
                        if(niv=='Empire niv2'|| niv=='Fondation Niv2') sect.push((parseInt(aPlan.split('x=')[1].split('&')[0].substr(0,2))+1)+'_'+aPlan.split('y=')[1].split('&')[0].substr(0,2));
                        if(niv=='Marchand Niv2' || niv.includes('Fondation')) sect.push(aPlan.split('x=')[1].split('&')[0].substr(0,2)+'_'+(parseInt(aPlan.split('y=')[1].split('&')[0].substr(0,2))+1));
                        if(niv=='Fondation Niv2') sect.push((parseInt(aPlan.split('x=')[1].split('&')[0].substr(0,2))+1)+'_'+(parseInt(aPlan.split('y=')[1].split('&')[0].substr(0,2))+1));
                        $.each(sect,function(i,c) { $("#"+c).prepend('<span class="yourehere"><img style="width:60px;top:'+
                                                                     (document.getElementById(c).getBoundingClientRect().top-document.getElementById('galaxie').getBoundingClientRect().top-50)+
                                                                     'px;left:'+(document.getElementById(c).getBoundingClientRect().left-document.getElementById('galaxie').getBoundingClientRect().left+10)+
                                                                     'px;" src="https://img.uxwing.com/wp-content/themes/uxwing/download/location-travel-map/you-are-here-icon.png"></span>'); });
                        $.each($("#galaxie tr"),function(i,tr) {
                            $.each($(tr).find('td'),function(j,td) {
                                if($(td).find('.yourehere').length==0) {
                                    $(td).find('div.secteur').first().on('click',function() {
                                        $("#lamap").removeClass('fadeoutmap').addClass('fadeinmap');
                                        /*$(this).addClass('fadeoutgal');
                                        setTimeout(function() { */
                                        reloadmap_bygal = true;
                                        document.getElementById("lamap").src = 'carte_secteur.php?basex='+$(this).attr('id').split('_')[0]+'&basey='+$(this).attr('id').split('_')[1];
                                        $("#galaxie, #lamap, #arrleft, #arrright, #zoominput").toggle();
                                        /*},1000);*/
                                    });
                                }else $(td).find(".yourehere").parent().off('click').on('click',function() {
                                    $("#lamap").removeClass('fadeoutmap').addClass('fadeinmap');
                                    /*$(this).addClass('fadeoutgal');
                                    setTimeout(function() { */
                                    if(reloadmap_bygal) {
                                        document.getElementById("lamap").src = 'map.php';
                                        reloadmap_bygal = false;
                                    }
                                    $("#galaxie, #lamap, #arrleft, #arrright, #zoominput").toggle();
                                    /*},1000);*/
                                });
                            });
                        });
                    }
                },200);
            },1000);
        }
        else if(datas.type=='ally') $.ajax({url:'alliance.php',type:'POST',data:{'alliance[]':datas.value+'-'+(get_stored('leaders').find(o=>o.player==datas.value).ally?'0':'1')},success:function(resp){ mnotify('alert alert-success',$(resp).find('div.alert-success').first().text()); }});
        else if(datas.type=="customiframe") {
            let contxt = window.frames.lamap.frames[datas.value.split('_')[1]];
            contxt.document.body.style.zoom = '80%';
            if(contxt.document.body.childNodes[0].nodeName=='BR' && contxt.document.body.childNodes[2]==undefined) mnotify('alert alert-success',contxt.document.body.childNodes[1].data,5000);//c'est le retour de l'action de conf, il faut l'afficher en notif
            if(contxt.location.href.includes('ambassade.php')||contxt.location.href.includes('detail_ordre.php')) contxt.document.body.style.backgroundColor = 'black';
            if(contxt.location.href.includes('detail.php')) load_detail_iframe(contxt.document);
            else if(contxt.location.href.includes('detail_ordre.php')) load_ordre_iframe(contxt.document);
        }
        //else if()
    },false);//workaround qui permet de lancer des triggers entre iframes pour pas copier/coller du code dans le script d'une autre page
    function load_detail_iframe(frmcontents) {
        if(frmcontents.constructor.name=='HTMLDocument') {
            frmcontents = $(frmcontents);
            frmcontents.find('#debut').append(css_btn+'<style>.spanbtnwrpr:hover{background-color:white;}</style>'+css_noscroll+css_customscroll);
            frmcontents.find('.nav-tabs').css('display','none');
        }
        let planetes = get_stored('planetes');
        let planet = planetes.findIndex(o=>o.nom===frmcontents.find('#info h3').first().text().split(' ')[1]);
        //maj info planete dans var
        planetes[planet] = get_Planete(planetes[planet].x,planetes[planet].y,frmcontents);
        set_stored('planetes',planetes);
        if($("#custom_2").hasClass('toggled')) make_planetes($("#filtreplan").val());
        //ajout panneau timeline
        $("#stats_toggle").css('display','block');
        $("h5.offcanvas-title").text('Timeline '+planetes[planet].nom);
        $("#stats_content").empty().append(gen_timeline_planete(planetes[planet]));
        //modif design existant
        let todel = {pol:'ambassade',ordre:'NB :'};
        $.each(frmcontents.find('div.tab-pane'),function(i,z) {
            for(let a=0; a < $(z).get(0).childNodes.length; a++) {
                let n = $(z).get(0).childNodes[a];
                if(n.nodeName=='BR' || (n.nodeName == "#text" && todel[$(z).attr('id')] != undefined && n.data.includes(todel[$(z).attr('id')]))) {
                    frmcontents.find('div.tab-pane').eq(i).get(0).removeChild(n);
                    a--;
                }else if(n.nodeName == "#text" && n.data.length>50) {
                    let t = document.createElement('div');
                    t.innerHTML = find_nom_pl(n.data);
                    t.className = "unvisiblescroll";
                    t.setAttribute('style','overflow:scroll;height:60px;resize:vertical;');
                    frmcontents.find('div.tab-pane').eq(i).get(0).replaceChild(t,n);
                    frmcontents.find('div.tab-pane').eq(i).get(0).childNodes[a].addEventListener('mousewheel', mymousewheel);
                }
            }
        });
        frmcontents.find('.tab-pane, li').removeClass('active');//$("#fenetre").contents().find('.tab-pane').remove();
        //ajout de l'onglet custom
        frmcontents.find('ul.nav-tabs').append('<li class="active"><a href="#custom" data-toggle="tab"><img src="images/picto/auto-repair.png" width="25"></a></li>');//$("#fenetre").contents().find('ul.nav-tabs').remove();
        let elemen = document.createElement("div"); elemen.className = "tab-pane active"; elemen.id = "custom";
        $.each(frmcontents.find('#info').get(0).childNodes,function(i,v) {
            if(v.nodeName=='H3'&& v===frmcontents.find('#info h3').first().get(0)) {
                elemen.appendChild(v.cloneNode(true));//nom planete
                let jou = document.createElement('h3');
                jou.className = "block-title";
                let pla = get_stored('leaders').find(o=>o.player==frmcontents.find('#info').get(0).childNodes[i+1].data.split(' ')[1]);
                jou.innerHTML = 'Contrôle <a style="color:lightgreen;" href="fiche.php?joueur='+frmcontents.find('#info').get(0).childNodes[i+1].data.split(' ')[1]+'" target="fenetre">'+frmcontents.find('#info').get(0).childNodes[i+1].data.split(' ')[1]+'</a> '+
                    (!pla.niv?'':(pla.niv.substr(0,1).toUpperCase()+(!Number.isNaN(parseInt(pla.niv.substr(-1)))?pla.niv.substr(-1):'1')+(pla.niv.includes('Niv3')?' (<a style="color:lightgreen;" href="confrerie.php?confrerie='+pla.conf+'" target="fenetre">'+pla.conf.toUpperCase()+'</a>)':'')));
                elemen.appendChild(jou);//proprio + niv + conf
            }
        });
        elemen.appendChild(frmcontents.find('#pol').first().get(0).cloneNode(true));//tableau pol
        elemen.appendChild(frmcontents.find('#astro h3').first().get(0).cloneNode(true));//nb d'astros
        if(frmcontents.find('#ordre .alert').length==0) elemen.appendChild(frmcontents.find('#ordre').first().get(0).cloneNode(true));//form astros
        elemen.appendChild(frmcontents.find('#ressource').first().get(0).cloneNode(true));//tableau ressources
        frmcontents.find('.tab-content').append(elemen);
        //formulaire d'attaque : on vire le bootstrap-select pour garder le basic qu'on va custom nous meme
        frmcontents.find('#custom').first().find(".bootstrap-select").remove();
        frmcontents.find('#custom').first().find(".select").css('display','inline').removeClass('select').addClass('btn btn-sm').css('padding','2px');
        frmcontents.find("#custom #cible").css('width','100%');
        frmcontents.find('#custom').first().find('#pol>h3, #ressource>h3, #ordre>h3').remove();
        //formulaire d'attaque : on remplace l'input type submit par nos boutons custom
        if(frmcontents.find('#custom').first().find("input[name='formu'][value='Valider!']").length>0) {
            frmcontents.find('#custom').first().find("input[name='formu'][value='Valider!']").css('display','none').after('<button type="button" id="ciblermplc" class="btn agit btn-alt btn-xs" onclick="$(this).prev().click()"><img src="images/picto/empire.png" width="15"></button>');
            let head = frmcontents.head || frmcontents.get(0).getElementsByTagName('head')[0];//document.getElementById("fenetre").contentWindow.document.head || document.getElementById("fenetre").contentWindow.document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.innerText = 'function ciblechgt() { if($("#custom #cible option:selected").css("color")=="rgb(255, 0, 0)") $("#custom #ciblermplc img").attr("src","images/picto/interception.png"); else $("#custom #ciblermplc img").attr("src","images/picto/transfert.png"); }';
            head.appendChild(script);
            frmcontents.find('#custom').first().find("select#cible").first().get(0).setAttribute('onchange','ciblechgt()');
        }
        frmcontents.find('#custom').first().find("input[name='formu'][value='Annuler mission']").css('display','none').after('<button type="button" class="btn anul btn-alt btn-xs" onclick="$(this).prev().click()">Annuler</button>');
        if(frmcontents.find('#custom').first().find("input[value='Commercer']").length>0) frmcontents.find('#custom').first().find("input[value='Commercer']").first().css('display','none').after('<button type="button" class="btn agit btn-alt btn-xs" id="commrmplc" onclick="$(this).prev().click()"><img src="images/picto/offre.png" width="15"></button>');
        //compression design
        frmcontents.find('#custom img[src="../images/constructing.gif"]').attr('width','20px');
        frmcontents.find("#custom .block-title").css('margin','0px').css('display','block');
        frmcontents.find('#custom').first().find('#pol table').find('img').remove();
        frmcontents.find('#custom').first().find('table').css('margin','10px 0px');
        frmcontents.find("#custom").css('font-size','small').find('td').css('padding','0px');
        frmcontents.find('.tab-content').css('padding','10px 0px');
        //lien sur nom planete + bouton des stats
        frmcontents.find('#custom h3').first().html(find_nom_pl(frmcontents.find('#info h3').first().text())+
                                                    '<span class="spanbtnwrpr" style="position:absolute;right:0;top:0;border:1px solid white;padding:2px;border-radius:4px !important;"><button class="btn btn-alt" style="background-color:white !important;padding:0;line-height:unset;" id="stats" onclick="window.parent.postMessage(JSON.stringify({type:\'stat\',planId:'+planet+'}))"><img src="images/picto/popu.png" width="15"></button></span>').css('position','relative');
        frmcontents.find('#custom a[href*="annuler_offre"]').addClass('anul');
        //ajoute le bouton d'attribution de dev (fondateur)
        if(get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Fondation')) {
            if(planetes[planet].deviation!==false && planetes[planet].proprio==localStorage.playerName && planetes[planet].deviation!=planetes[planet].proprio) {
                frmcontents.find("#ordre, #custom>h3:nth-child(2)").append('<br><span class="label label-warning"><img src="images/picto/deviation.png" width="20" height="20">'+planetes[planet].deviation+'</span><a class="btn agit btn-alt" href="alliance.php?cadeau='+planetes[planet].x+'-'+planetes[planet].y+'-'+planetes[planet].nom+'&benef='+planetes[planet].deviation+'">Attribuer</a>');
            }
        }
        //ajoute le formulaire de don de planete
        if(planetes[planet].proprio==localStorage.playerName && planetes[planet].deviation===false && (!get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Empire') || !planetes[planet].nom.includes('Empire'))) {
            let form_don = '<br><select class="btn btn-xs" name="benef" id="benef"><option value="">choisir</option>';
            let leaders = get_stored('leaders');
            $.each(leaders,function(i,l) {
                if(l.sector && l.ally && l.player!=localStorage.playerName) form_don += '<option value="'+l.player+'">'+l.player+'</option>';
            });
            form_don += '</select><button class="btn agit btn-alt btn-xs" onclick="window.parent.postMessage(JSON.stringify({type:\'don\',planId:'+planet+',benef:$(\'#benef\').val()}))"><img src="images/picto/present.png" width="15"></button>';
            frmcontents.find("#custom>h3:nth-child(2)").append(form_don);
        }
        rt_to_map('fenetre');
    }
    function load_ordre_iframe(frmcontents) {
        if(frmcontents.constructor.name=='HTMLDocument') {
            frmcontents = $(frmcontents);
            frmcontents.find('#debut').append(css_btn+'<style>.spanbtnwrpr:hover{background-color:white;}</style>'+css_noscroll+css_customscroll);
            frmcontents.find('.nav-tabs').css('display','none');
        }
        let planetes = get_stored('planetes');
        if(frmcontents.find('img[src="images/picto/target-planet.png"]').length>0) {//etait images/picto/interception.png
            //on recup les details de l'attaque avant de confirmer
            attakdetail.push({
                source:planetes.find(o=>o.nom==frmcontents.find('h2.block-title').first().text().split(' :')[0].trim()).nom,
                cible:frmcontents.find('div.tile').first().get()[0].childNodes[1].data.split(': ')[1].split(' (')[0].trim(),
                info:frmcontents.contents().find('div.tile').first().get()[0].childNodes[4].data.split(' contre')[0]+'/'+planetes.find(o=>o.nom==frmcontents.find('h2.block-title').first().text().split(' :')[0].trim()).astros+'<br>'+frmcontents.find('div.tile').first().get()[0].childNodes[6].data.replace('estimés','')+'<br>Proba. réussite '+frmcontents.find('div.pie-chart-tiny').data('percent')+'%'
            });
        }else{
            let nomplan = false;
            if(frmcontents.find('div.alert-info').length>0) {
                if(frmcontents.find('div.alert-info').first().text().includes('ordre de coloniser est donn')) {
                    //l'attaque est confirmée, on stocke les details dans la var planetes
                    nomplan = frmcontents.find('div.alert-info').first().text().split(' :')[0].trim();
                    let atkdet = attakdetail.findIndex(o=>o.source==nomplan);
                    if(atkdet != -1) {
                        planetes.find(p=>p.nom===attakdetail[atkdet].source).attakdetail = attakdetail[atkdet].info;
                        set_stored('planetes',planetes);
                        attakdetail.splice(atkdet,1);
                    }
                }else if(frmcontents.find('div.alert-info').first().text().includes('renomm')) {
                    nomplan = frmcontents.find('h2.block-title').first().text().split(' :')[0].trim();
                    planetes.splice(planetes.findIndex(o=>o.nom==nomplan),1);
                    set_stored('planetes',planetes);
                }
                mnotify('alert alert-info',frmcontents.find('div.alert-info').first().html(),3000);
            }else {
                if(frmcontents.find('div.alert').length>0) {
                    mnotify(frmcontents.find('div.alert').first().attr('class'),frmcontents.find('div.alert').first().html(),3000);
                }else {
                    //resultat brouillage (entre autre j'imagine ?)
                    let txt = frmcontents.find('h2').first().text()+'<br>'
                    $.each(frmcontents.find('h2').first().parent().get()[0].childNodes,function(i,node) { if(node.nodeName=="#text" && node.data.trim().length>0) txt += node.data+'<br>'; });
                    mnotify('alert alert-success',txt,3000);
                }
            }
            if(nomplan) document.getElementById('fenetre').src = 'detail.php?x='+planetes.find(o=>o.nom==nomplan).x+'&y='+planetes.find(o=>o.nom==nomplan).y;
        }
    }
    $("#fenetre").on('load',function() {
        $("#fenetre").contents().find('#debut').append(css_btn+'<style>.spanbtnwrpr:hover{background-color:white;}</style>'+css_noscroll+css_customscroll);
        $("#stats_toggle").css('display','none');
        if($("#stats_canvas").width()>0 && !window.frames["fenetre"].location.href.includes('detail.php')) {
            $("#stats_canvas").width("0");
            $(".container, #stats_toggle").css('margin-right','0');
        }
        if(window.frames["fenetre"].location.href.includes('leader.php')) {
            if($("#fenetre").contents().find('#actions').length) {//page normale (contient #info/#actions/#aide)
                let elemlead = null;
                $("div.side-widgets").find('div.s-widget').eq(1).find('a[href^="leader.php"]').each(function(k,o) {
                    if($(o).text().trim()==$("#fenetre").contents().find('#info b').first().text().split('suis ')[1].split(' sur ')[0].trim()) elemlead = $(o).parents('div.row').first();
                });
                function mod_lead_window() {
                    $.each($("#fenetre").contents().find('div.tab-pane'),function(i,z) {
                        for(let a=0; a < $(z).get(0).childNodes.length; a++) {
                            if($(z).get(0).childNodes[a].nodeName=='BR') {
                                $("#fenetre").contents().find('div.tab-pane').eq(i).get(0).removeChild($(z).get(0).childNodes[a]);
                                a--;
                            } else if($(z).get(0).childNodes[a].nodeName == "#text" && $(z).get(0).childNodes[a].data.length>50) {
                                let t = document.createElement('div');
                                t.innerHTML = find_nom_pl($(z).get(0).childNodes[a].data);
                                t.className = "unvisiblescroll";
                                t.setAttribute('style','overflow:scroll;height:60px;resize:vertical;');
                                $("#fenetre").contents().find('div.tab-pane').eq(i).get(0).replaceChild(t,$(z).get(0).childNodes[a]);
                                $("#fenetre").contents().find('div.tab-pane').eq(i).get(0).childNodes[a].addEventListener('mousewheel', mymousewheel);
                            }
                        }
                    });
                    $("#fenetre").contents().find('#actions, #info').removeClass('tab-pane');
                    $("#fenetre").contents().find("#info .unvisiblescroll").css('font-size','12px');
                    $("#fenetre").contents().find("input[value='Valider']").addClass('agit');
                    $("#fenetre").contents().find("input[name='formu']").addClass('anul');
                    rt_to_map('fenetre');
                }
                if(elemlead.find('a[href^="detail.php?x="]').length && !elemlead.find('a[href^="detail.php?x="]').first().text().toLowerCase().includes('ouvelle plan')) planete_update(elemlead.find('a[href^="detail.php?x="]').first().attr('href'),false).then(data=>{
                    get_lead($("#fenetre").contents(),elemlead);
                    mod_lead_window();
                });
                else {
                    get_lead($("#fenetre").contents(),elemlead);
                    mod_lead_window();
                }
                /*$.each($("#fenetre").contents().find("#actions a[href^='detail.php']"),function(i,e){
                    ll[i] = new LeaderLine(LeaderLine.mouseHoverAnchor(e,'draw',{style:{backgroundColor: null},hoverStyle:{backgroundColor: 'black'}}),LeaderLine.pointAnchor(document.getElementById('lamap').contentDocument.getElementById($(this).text().trim())));//$('#lamap').contents().find('div.divplanete > img[id="'+$(this).text().trim()+'"]')
                    ll[i].setOptions({
                        middleLabel:LeaderLine.pathLabel('',{outlineColor:''}),
                        startLabel:LeaderLine.captionLabel(' parsecs',{outlineColor:''}),
                        dash:{len:6,gap:3,animation:true},
                        color:'white',
                        //path:'grid',
                        endPlug:'crosshair',
                        endPlugSize:0.5,
                    });
                });*/
            }else { //juste un msg alert
                let leaders = get_stored('leaders');
                let nodes = $("#fenetre").contents().find('div.alert').first();
                let nodesText = [];
                $.each(nodes.get(0).childNodes,function(i,node) {
                    if(node.nodeName=='#text') nodesText.push(node.data);
                    if(node.nodeName=='I') nodesText.push(node.innerText);
                });
                let planet = get_stored('planetes').find(o=>nodesText.filter(b=>b.includes(o.nom)).length>0/*o.nom===nodes.find('i').first().text().split(' ,')[0]*/);
                leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>nodesText.filter(b=>b.includes(p.nom)).length>0/*p.nom==nodes.get(0).childNodes[0].data.replace(':','').trim()*/).activite = nodesText.filter(b=>b.includes('exploration')).length>0/*nodes.text().includes('exploration')*/?
                    'Prospection':
                    (nodesText.filter(b=>b.includes('destination')).length>0/*nodes.find('i').first().text().includes('destination')*/?
                      'Transfert à <a style="color:lightgreen;" target="fenetre" href="detail.php?x='+planet.x+'&y='+planet.y+'">'+planet.nom+'</a>':
                      (nodesText.filter(b=>b.includes('brouilleurs')).length>0/*nodes.find('i').first().text().includes('brouilleurs')*/?
                        'Pose brouilleurs':// à <a target="fenetre" href="detail.php?x='+planet.x+'&y='+planet.y+'">'+planet.nom+'</a>':
                        (nodes.find('i').first().text().includes('sanglante')?'Assassinat à <a target="fenetre" href="detail.php?x='+planet.x+'&y='+planet.y+'">'+planet.nom+'</a>':
                          (nodes.find('i').first().text().includes('ambassade')?'Ambassade':'TODO')
                        )
                      )
                    )
                ;
                set_stored('leaders',leaders);
                mnotify(nodes.get(0).className,nodes.html(),5000);
                maj_lead(false,leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>nodesText.filter(b=>b.includes(p.nom)).length>0/*p.nom==nodes.get(0).childNodes[0].data.replace(':','').trim()*/).id);
                document.getElementById('fenetre').src = 'leader.php?id_leader='+leaders.find(o=>o.player==localStorage.playerName).leaders.find(p=>nodesText.filter(b=>b.includes(p.nom)).length>0/*p.nom==nodes.get(0).childNodes[0].data.replace(':','').trim()*/).id+'&x='+planet.x+'&y='+planet.y;
            }
            //{action:1, planete:534-528-Empire68653, id_leader:3490987 },//deplacer
            //{action:2},//explorer
            //{action:3}, cible:'3267001'}//assassiner
            //{action:4},//mode marchand
            //{action:5},//construire brouilleur
            //{action:10},//construire amb
            //{action:11},//démanteler amb
            //{action:13}, //arpenter
            //{x:534,y:526,id_leader:3490987},//get
        }
        else if(window.frames["fenetre"].location.href.includes('detail.php')) { load_detail_iframe($('#fenetre').contents()); }
        else if(window.frames["fenetre"].location.href.includes('detail_ordre.php')) { load_ordre_iframe($("#fenetre").contents()); }
        else if(window.frames["fenetre"].location.href.includes('croiseur.php')) { //$("#fenetre").contents().find('#ordre').length>0 && $("#fenetre").contents().find('#aide').length>0 (contient #info/#ordre/#aide)
            for(let a=0; a < $("#fenetre").contents().find('#ordre').get(0).childNodes.length; a++) {
                let n = $("#fenetre").contents().find('#ordre').get(0).childNodes[a];
                if(n.nodeName=='BR') {
                    $("#fenetre").contents().find('#ordre').get(0).removeChild(n);
                    a--;
                }else if(n.nodeName == "#text" && n.data.length>10) {
                    let t = document.createElement('span');
                    t.innerHTML = find_nom_pl(n.data);
                    $("#fenetre").contents().find('#ordre').get(0).replaceChild(t,n);
                }
            }
            rt_to_map('fenetre');
            maj_crois_unite($("#fenetre").contents());
        }
        else if(window.frames["fenetre"].location.href.includes('objectif.php')) { // $("#fenetre").contents().find('#obj').length>0 (contient #obj)
            $("#fenetre").contents().find('#obj tr').each(function(i,v) {
                if($(v).find('td').eq(0).text().trim()==localStorage.playerName) {
                    $("#statut_promo").html($(v).find('td').eq(2).text().split(' ')[0]+' ('+$(v).find('td').eq(1).text().trim()+')');
                    $("#statut_promo").css('color',$(v).find('td').eq(2).text().split(' ')[0]=='Promotion'?'green':($(v).find('td').eq(2).text().split(' ')[0]=='Regression'?'red':'orange'));
                }else if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && $(v).find('td').eq(0).text().trim()==get_stored('leaders').find(o=>o.player==localStorage.playerName).conf){
                    let top = parseInt($($("#fenetre").contents().find('#obj tr:has(td)').sort((a,b)=>{parseInt($(a).find('td').eq(1).text().trim().split(' ')[0]) > parseInt($(b).find('td').eq(1).text().trim().split(' ')[0]) ? 1 : (parseInt($(b).find('td').eq(1).text().trim().split(' ')[0]) > parseInt($(a).find('td').eq(1).text().trim().split(' ')[0]) ? -1 : 0)})[0]).find('td').eq(1).text().trim().split(' ')[0]);
                    let mine = parseInt($(v).find('td').eq(1).text().trim().split(' ')[0]);
                    let dem = $("#fenetre").contents().find('#obj h3.block-title').first().text().trim().split(' ')[1];
                    $("#statut_promo").html((mine-top)+' Amb. / '+(parseInt(dem)-20)+' Démant.').css('color',(mine-top)==0||(parseInt(dem)-20)==0?'green':'red');
                }
                if(get_stored('leaders').find(o=>o.player==localStorage.playerName) && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv && get_stored('leaders').find(o=>o.player==localStorage.playerName).niv.includes('Niv3')) {
                    $(v).find('td').eq(1).text($(v).find('td').eq(1).text().replace(/(ambassade)s*/,''));
                    if($(v).find('td').length==2) $(v).append('<td>amb.</td>');
                }
            });
        }
        else if(window.frames["fenetre"].location.href.includes('arpenter.php')) {
            //{ achat: 'commerce1', id_leader:'3490987' },//acheter
            //{ utiliser:'Guide+sabotage', id_leader='3490987'},//utiliser
            //{ deplacement:'gauche', id_leader='3490987'},//arpenter
            //{objet:'Lance-missile+X33',donnerobjet:1,id_leader:'340987',id_cible:'349086'}//donner objet
            //{objet:'Lance-missible+X33',autreobjet:'',assemblage:1,id_leader:'3490987'},//assembler
            //{id_leader:'3490987',voirleader:'3490986'},//voir
            //{id_leader:'3490986';idcible:'3490987',bonjour:1},//dire bonjour
            //{id_leader='3492107',chirurgie=1},//change visage
            //{id_leader='3492107',chirurgie=2},//change nom
            //TODO: carte planete (est connu seulement par le leader qui arpente, ne devient pas connu pour les autres leaders)
            //TODO: stocker id leaders autres joueurs présents
            //TODO: stocker UT leader
            //TODO: stocker objet acheté
        }
        else if(window.frames.fenetre.location.href.includes('debut.php')) {
            let l = get_stored('leaders');
            if(l.find(o=>o.player===localStorage.playerName)===undefined) l.push({player:localStorage.playerName,sector:true,img:false,niv:false,ally:null,leaders:[]});
            if(l.find(o=>o.player==localStorage.playerName).niv != $("#fenetre").contents().find('#obj b').first().text()) {
                l.find(o=>o.player==localStorage.playerName).niv = $("#fenetre").contents().find('#obj b').first().text();
                l = reset_secteur(l);
                set_stored('leaders',l);
            }
        }
        else if(window.frames.fenetre.location.href.includes('holo-vente.php')) {
            //TODO achat auto sous un certain prix, avec liste objet interessant ?  id_lead = window.frames.fenetre.location.href.split('=')[1].split('&')[0];
        }
        else if(window.frames.fenetre.location.href.includes('marchand.php')) {
            let elemlead = $("div.side-widgets").find('div.s-widget').eq(1).find('a[href^="leader.php?id_leader='+$("#fenetre").contents().find('input[name="id_leader"]').first().val()+'"]');
            if(elemlead.length==0) {
                let lead_nom;
                $.each($("#fenetre").contents().find('#marchand').get(0).childNodes,function(l,n) { if(n.nodeName=='#text' && n.data.includes(' suis ')) lead_nom = n.data.split('suis ')[1].split(',')[0].trim(); });
                $("div.side-widgets").find('div.s-widget').eq(1).find('a[href^="leader.php"]').each(function(k,o) { if($(o).text().trim()==lead_nom) elemlead = $(o); });
            }
            get_lead($("#fenetre").contents(),elemlead.parents('div.row').first());
            $.each($("#fenetre").contents().find('#stock tr:not(tr:first)'),function(i,z) {
                $(z).find('td').eq(1).text($(z).find('td').eq(1).text().replace('containers','').trim());
            });
            if($("#fenetre").contents().find('#tournee li').length>0) {
                $.each($("#fenetre").contents().find('#tournee li'),function(i,z) {
                    $(z).html(find_nom_pl($(z).html().replace('Je serai à','').replace('pour charger','&rarr;').replace('cont. ','').replace('<b>','').replace('</b>','')));
                });
                $("#fenetre").contents().find('#tournee li:last').html($("#fenetre").contents().find('#tournee li:last').html().split("l'or")[0]);
            }
            $("#fenetre").contents().find('#stock, #tournee').removeClass('tab-pane').css('font-size','small');
            rt_to_map('fenetre');
            $("#fenetre").contents().find('#tournee input[type="submit"]').first().after('<button class="btn btn-alt" type="button" onclick="window.parent.postMessage(JSON.stringify({type:\'tour\',leadid:'+$("#fenetre").contents().find('input[name="id_leader"]').first().val()+'}))">Proposer</button><span id="tempstournee"></span>');
            $("#fenetre").contents().find("select[name^='com']").off('change').on('change',function() {
                let inde = parseInt($(this).attr('name').split('[')[1].split(']')[0]);
                if(!isNaN(inde)) {
                    window.parent.postMessage(JSON.stringify({
                        type:'drawtour',
                        index:inde,
                        prev:$(this).prevAll('select').length>0?$(this).prevAll('select').eq(0).val().split('-')[2]:$("div.s-widget").eq(1).find('a[href^="leader.php?id_leader='+$("#fenetre").contents().find('input[name="id_leader"]').first().val()+'"]').parent().next().find('a[href^="detail.php"]').first().text().trim(),
                        cur:$(this).val().split('-')[2],
                        next:inde<6 && $(this).nextAll('select').eq(0).val()!=undefined?$(this).nextAll('select').eq(0).val().split('-')[2]:false
                    }));
                }
            });
        }
        else if(window.frames.fenetre.location.href.includes('confrerie.php')){
            //TODO: stocker les infos de la conf ? (liste membres, orientation,...)
            //on affiche le retour de l'action de conf en notif
            if(window.frames.fenetre.document.body.childNodes[0].nodeName=='BR' && window.frames.fenetre.document.body.childNodes[2]==undefined) mnotify('alert alert-success',window.frames.fenetre.document.body.childNodes[1].data,5000);
        }
        else if(window.frames.fenetre.location.href.includes('ambassade.php')){
            //TODO ?
        }
        else if(window.frames.fenetre.location.href.includes('fiche.php')){
            //ajoute l'action proposer/rompre l'alliance si le joueur est sur secteur
            let p = get_stored('leaders').find(l=>l.player==window.frames.fenetre.location.href.split('=')[1]);
            if(p.sector) $("#fenetre").contents().find('div.tab-content').append('<button onclick="window.parent.postMessage(JSON.stringify({type:\'ally\',value:\''+p.player+'\'}))" class="btn btn-alt '+(p.ally?'anul">Rompre':'agit">Proposer')+' Alliance</button>');
        }
        else if(window.frames.fenetre.location.href.includes('atelier.php')) {
            //draggable code : triggers croiseurs
            $("#fenetre").contents().find('p>img:not(.img-responsive)').each(function(){
                this.removeEventListener("dragstart",onDragStartAtelier);
                this.addEventListener("dragstart",onDragStartAtelier);
            });
        }
    });
    //ETAPE CRUCIALE : on declenche le minuteur qui va appeller la chaine de fonctions
    //on lance un setInterval toutes les secondes qui va afficher un compte a rebours avant de lancer la maj des données (check())
    window.setInterval(function() {
        set_stored('val_tempo',parseInt(get_stored('val_tempo'))-1);
        $('#decompte_tempo').text(get_stored('val_tempo'));
        if(parseInt(get_stored('val_tempo'))<=0 && !init) check();
    }, 1000);
})();