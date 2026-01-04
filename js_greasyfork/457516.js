// ==UserScript==
// @name         MapFonda_DrawLL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  use LeaderLine Api to replace the anim() on the map
// @author       LaTTy
// @grant        none
// @match        https://fondationjeu.com/jeu/map.php
// @require      https://cdn.jsdelivr.net/npm/leader-line@1.0.7/leader-line.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457516/MapFonda_DrawLL.user.js
// @updateURL https://update.greasyfork.org/scripts/457516/MapFonda_DrawLL.meta.js
// ==/UserScript==

(function() {
    'use strict';
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
    function calcul_parsec(p1,p2) {
        let result = 0;
        let p = get_stored('planetes');
        let diff_x = Math.abs(p.find(o=>o.nom==p1).x - p.find(o=>o.nom==p2).x);
        let diff_y = Math.abs(p.find(o=>o.nom==p1).y - p.find(o=>o.nom==p2).y);
        result = (diff_x+diff_y)*10;
        return parseInt(result);
    }
    //on coupe la boucle anim()
    if(totanim){
        cptanim=100;coordx=destx;coordy=desty;objvol[101]=0;
        setTimeout(function() { $("#obj1").css('visibility','hidden'); },100);
    }
    //on la remplace par la lib LeaderLine (avant j'avais fait du simple svg)
    var lines = [];
    var marchand_line = [];
    //let svg='';
    let label = ['Indépendant','Indépendant3','Empire','Marchand','Fondation','Indépendant2','Mulet','Leader'];
    for(let i=0;i<totanim;i++) {
        //svg+= '<line x1="'+depy[i]+'" x2="'+arry[i]+'" y1="'+depx[i]+'" y2="'+arrx[i]+'" stroke="'+(objvol[i]==7?'red':'blue')+'" style="stroke-width:2;"></line>';
        let elemStart = $('.divplanete[style=" left:'+depy[i]+'px;top:'+depx[i]+'px;"]')[0];
        let elemFinish = $('.divplanete[style=" left:'+arry[i]+'px;top:'+arrx[i]+'px;"]')[0];
        if(elemStart === undefined) $('body').append('<div class="divplanete" style=" left:'+depy[i]+'px;top:'+depx[i]+'px;"></div>');
        if(elemFinish === undefined) $('body').append('<div class="divplanete" style=" left:'+arry[i]+'px;top:'+arrx[i]+'px;"></div>');
        elemStart = $('.divplanete[style=" left:'+depy[i]+'px;top:'+depx[i]+'px;"]')[0];
        elemFinish = $('.divplanete[style=" left:'+arry[i]+'px;top:'+arrx[i]+'px;"]')[0];
        let rndmclr = 'hsl('+Math.floor(Math.random() * 360)+' 50% 50%)';
        let labello = false;
        if(label[objvol[i]]=='Leader') {//c'est un de mes leaders, on recherche lequel en se basant sur son historique
            let leaders = get_stored('leaders');
            $.each(leaders.find(o=>o.player==localStorage.playerName).leaders,function(i,v) {
                if(!v.pose && v.visited !== undefined && !v.visited.slice(-1)[0].includes("Inconnu")) {
                    if(v.visited.slice(-1)[0].split('>')[1].split('</')[0].trim() == $(elemStart).find('img').first().attr('id')) labello = v.nom;
                    else if(v.visited.length==1 && v.visited.slice(-1)[0].split('>')[1].split('</')[0].trim() == $(elemFinish).find('img').first().attr('id')){
                        labello = v.nom;
                        leaders[leaders.findIndex(o=>o.player==localStorage.playerName)].leaders[i].visited = ['<a href="detail.php?x='+get_stored('planetes').find(o=>o.nom==$(elemStart).find('img').first().attr('id')).x+'&y='+get_stored('planetes').find(o=>o.nom==$(elemStart).find('img').first().attr('id')).y+'" target="fenetre">'+$(elemStart).find('img').first().attr('id')+'</a> Le '+new Date(Date.now()).toLocaleString()].concat(leaders.find(o=>o.player==localStorage.playerName).leaders[i].visited);
                        set_stored('leaders',leaders);
                    }
                }
            });
        }else {//c'est un mouvement d'astro, on enregistre dans l'elemFinish quel est l'elemStart correspondant (ou vice versa) pour avoir l'info dans le panneau d'attaque
            let planetes = get_stored('planetes');
            if($(elemStart).find('img').length>0 && planetes && planetes.find(o=>o.nom==$(elemStart).find('img').first().attr('id').trim())!=undefined){
                planetes.find(o=>o.nom==$(elemStart).find('img').first().attr('id').trim()).attakm = $(elemStart).find('img').first().attr('id').trim()+' Attaque '+($(elemFinish).find('img').length>0?$(elemFinish).find('img').first().attr('id').trim():'une planète inconnue')+($('div.explosion[style="'+$(elemFinish).attr('style').trim()+'"]').length>0?', en cours':'')+', avec des astros '+label[objvol[i]];
            } else if($(elemFinish).find('img').length>0 && planetes && planetes.find(o=>o.nom==$(elemFinish).find('img').first().attr('id').trim())!=undefined) {
                planetes.find(o=>o.nom==$(elemFinish).find('img').first().attr('id')).ciblem = $(elemFinish).find('img').first().attr('id').trim()+' est ciblée par '+($(elemStart).find('img').length>0?$(elemStart).find('img').first().attr('id').trim():'une planète inconnue')+' avec des astros '+label[objvol[i]]+($('div.explosion[style="'+$(elemFinish).attr('style').trim()+'"]').length>0?'. L\'attaque est en cours !':'');
            }
            set_stored('planetes',planetes);
        }
        lines[i] = [null,'onHover',elemStart,elemFinish,{
            middleLabel:LeaderLine.pathLabel((!labello?label[objvol[i]]:labello),{outlineColor:''}),
            startLabel:LeaderLine.captionLabel((parseInt((depx[i]>arrx[i]?depx[i]-arrx[i]:arrx[i]-depx[i])/100)+parseInt((depy[i]>arry[i]?depy[i]-arry[i]:arry[i]-depy[i])/90))*10+' parsecs',{outlineColor:''}),
            dash:false,
            color:rndmclr,
            //path:'grid',
            endPlug:'crosshair',
            endPlugSize:0.5,
        }];
    }
    //$("body").append('<svg style="width:100%;height:100%;">'+svg+'</svg>');
    //insert boutons
    $("div.row .col-md-5").removeClass();
    $("div.row").css('display','flex').css('align-items','center').css('justify-content','space-between').append('<span><button class="btn btn-alt" onclick="location.href=\'map.php\'"><span class="glyphicon glyphicon-refresh"></span></button><button class="btn btn-alt" id="togal"><i class="fa fa-turn-up"></i>&nbsp;Galaxie</button><div class="switch-holder pull-right"><div class="switch-label" style="--width-label: 100px"><span class="glyphicon glyphicon-screenshot"></span><span>Animation</span></div><div class="switch-toggle"><input type="checkbox" '+(lines.length && lines[0][1]=='visible'?'checked':'')+' id="showallline"><label style="--width-toggle: 120px;--width-button: 55px;--bgcolor-checked: green;" for="showallline" from="HIDE" to="SHOW"></label></div></div></span><span id="consect" class="pull-right"></span>');
    $("#togal").on('click',function() { window.parent.postMessage(JSON.stringify({type:'galaxie'})); });
    function redraw_lines(param=null) {
        if(lines.length>0) {
            $.each(lines,function(i,v) {
                if(lines[i][0]!=null) lines[i][0].remove();
                lines[i][0] = new LeaderLine(((param==null && lines[i][1]=='onHover') || param=='visible'?LeaderLine.areaAnchor(lines[i][2],'circle',{x:'25%',y:'25%',width:'50%',height:'50%',radius:10}):LeaderLine.mouseHoverAnchor($(lines[i][2]).find('img').length>0?$(lines[i][2]).find('img')[0]:lines[i][2],'draw',{style:{backgroundColor: null},hoverStyle:{backgroundColor: lines[i][4].color}})),LeaderLine.pointAnchor(lines[i][3]));
                lines[i][4].dash = (param==null && lines[i][1]=='onHover') || param=='visible'?{len:6,gap:3,animation:true}:false
                lines[i][0].setOptions(lines[i][4]);
                lines[i][1] = ((param==null && lines[i][1]=='onHover') || param=='visible'?'visible':'onHover');
            });
            window.parent.postMessage(JSON.stringify({type:'line',value:lines[0][1]}));
            $("#showallline").attr('checked',lines[0][1]!='onHover');
        }
    }
    $("#showallline").on('change',function() { redraw_lines(); });
    function changeZoom(val) {
        document.body.style.zoom = val+'%';
        //$.each(lines,function(i,v) { v[0].position(); });
    }
    window.addEventListener('scroll',function() {
        //pas moyen de corriger le decalage lors du scroll, ca depend des mesures de la frame d'au dessus... ca a l'air de se decaler de 30px par 100 scroll
        //console.log(window.scrollX+', re-positionning...');
        //$.each(lines,function(i,v) { v[0].position(); });
    }, false);
    window.addEventListener("message", function(e){
        let datas = JSON.parse(e.data);
        if(datas.type=='zoom') changeZoom(datas.value);
        else if(datas.type=='don') window.parent.postMessage(JSON.stringify(datas));
        else if(datas.type=='stat') window.parent.postMessage(JSON.stringify(datas));
        else if(datas.type=='line') redraw_lines(datas.value);
        else if(datas.type=='drawtour') {
            //console.log(datas);
            //let top = window.scrollY;
            //let left = window.scrollX;
            //$('html, body').animate({scrollTop: 0, scrollLeft: 0},100,'linear');
            let elemStart = $('img[id="'+datas.prev+'"]')[0];
            let elemFinish = $('img[id="'+datas.cur+'"]')[0];
            if(marchand_line[parseInt(datas.index)-1]!=null) marchand_line[parseInt(datas.index)-1].remove();
            let opt = {
                middleLabel:LeaderLine.captionLabel(calcul_parsec(datas.prev,datas.cur)+' parsecs',{color:'gold',outlineColor:''}),
                color:'gold',
                //path:'grid',
            };
            if(datas.index<6 && datas.next!==false) {
                //opt.endLabel = LeaderLine.captionLabel(get_stored('planetes').find(o=>o.nom==datas.cur).offre,{color:'gold',outlineColor:''});// LeaderLine.pathLabel(get_stored('planetes').find(o=>o.nom==datas.cur).offre,{outlineColor:''});
                let elemNext = $('img[id="'+datas.next+'"]')[0];
                if(marchand_line[datas.index]!=null) marchand_line[datas.index].remove();
                let opt2 = {...opt,...{middleLabel:LeaderLine.captionLabel(calcul_parsec(datas.cur,datas.next)+' parsecs',{color:'gold',outlineColor:''}),}};
                if(datas.index==5) opt2 = {...opt2,...{ endPlug:'crosshair', endPlugSize:0.5/*, endLabel:LeaderLine.captionLabel('déchargement',{color:'gold',outlineColor:''})*/}};
                marchand_line[datas.index] = new LeaderLine(LeaderLine.pointAnchor($(elemFinish).parent()[0]),LeaderLine.pointAnchor($(elemNext).parent()[0]),opt2);
            }else opt = {...opt,...{ endPlug:'crosshair', endPlugSize:0.5/*, endLabel:LeaderLine.captionLabel('déchargement',{color:'gold',outlineColor:''})*/}};
            marchand_line[parseInt(datas.index)-1] = new LeaderLine(datas.index==1?LeaderLine.areaAnchor($(elemStart).parent()[0],'circle',{x:'25%',y:'25%',width:'50%',height:'50%',radius:10}):LeaderLine.pointAnchor($(elemStart).parent()[0]),LeaderLine.pointAnchor($(elemFinish).parent()[0]),opt);
            //$('html, body').animate({scrollTop: top, scrollLeft: left},100,'linear');
        }
        else if(datas.type=='scrollto') $('html, body').animate({scrollTop: datas.planete && $('#'+datas.planete).length>0?$('#'+datas.planete).offset().top:(datas.dir=='top'?0:(datas.dir=='bottom'?2000:window.scrollY)), scrollLeft: datas.planete && $('#'+datas.planete).length>0?$('#'+datas.planete).offset().left-100:(datas.dir=='left'?0:(datas.dir=="right"?2000:window.scrollX))},350,'linear');
        //else if()
    },false);
})();