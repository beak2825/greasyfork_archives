// ==UserScript==
// @name         Enodia
// @description  Améliore les déplacements en jeu
// @match        https://www.pirates-caraibes.com/fr/jeu/*
// @version      2.1.4
// @author       Gyeongeun
// @license      CC-BY-SA-4.0
// @namespace    pcPathfinding
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pirates-caraibes.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/485093/Enodia.user.js
// @updateURL https://update.greasyfork.org/scripts/485093/Enodia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var param = {
        nstop: true,
        tmin: true,
        ndisplay: false,
    }
    if(localStorage.param){
        param=JSON.parse(localStorage.param);
    }

    var pdocument, targ, wframe;
    try{
        document.querySelector('frame[src="main.php"]').addEventListener("load", function (){
            startEnodia();
        });
        if(document.querySelector('frame[src="main.php"]').contentDocument.readyState==='complete'){
            startEnodia();
        }
    }catch{
        pdocument=document;
        wframe = window;
        Enodia();
    }

    function startEnodia(){
        pdocument=document.querySelector('frame[src="main.php"]').contentDocument;
        wframe = window.frames.main_pirates;
        Enodia();
    }

function Enodia(){
    setgStyle();
    var timeLeft, ctBlock, ysq, clp, anchor=pdocument.getElementById('tblAvatarJoueur');
    if(anchor!=null){
        ctBlock=anchor.querySelectorAll('tr')[3].querySelector('td');
        timeLeft=FourMinute(ctBlock.innerHTML);
        ysq=false;
        clp='click';
        anchor.querySelector('.Avatar').removeAttribute('onmouseout');
        anchor.querySelector('.Avatar').removeAttribute('onmouseover');
        anchor.querySelector('.Avatar').setAttribute('onclick','afficheOrdreRencontre(this, 0, 0);');
        anchor.querySelector('.Avatar').style.marginLeft='0px';
        anchor.querySelector('.Avatar').style.marginTop='5px';
        anchor.querySelector('.Avatar').style.cursor='pointer';
        anchor.querySelector('.Avatar').style.border='1px solid #4E4637';
        anchor.querySelector('.Avatar').addEventListener('mouseenter',function(){this.style.border='1px solid #F3EEDB'})
        anchor.querySelector('.Avatar').addEventListener('mouseout',function(){this.style.border='1px solid #4E4637'})
    }else{
        anchor=pdocument.getElementById('pvsPersonnage');
        ctBlock=anchor.parentNode.parentNode.querySelectorAll('div')[3].querySelector('b');
        timeLeft=FourMinute(ctBlock.innerHTML);
        ysq=true;
        clp='dblclick';
    }

    function FourMinute(duration) {
        var time = duration.split(":");
        var minutes = parseInt(time[0])*60+parseInt(time[1]);
        return minutes;
    }
    if(param.tmin){
        ctBlock.innerHTML=timeLeft.toString()+" min";
    }

    ctBlock.addEventListener('click',mindisplay);
    function mindisplay(){
        if(param.tmin){
            let hr = Math.floor(timeLeft/60);
            let min = timeLeft % 60;
            ctBlock.innerHTML=hr.toString().padStart(2, '0')+":"+min.toString().padStart(2, '0');
            param.tmin=false;
        }else{
            ctBlock.innerHTML=timeLeft.toString()+" min";
            param.tmin=true;
        }
        localStorage.param=JSON.stringify(param);
    }

    //removeElt(pdocument.getElementById('tooltip'));
    removeElt(pdocument.getElementById('l_CadreRouge'));
    var gMap=pdocument.querySelector('#img_perso_joueur').parentNode.parentNode.parentNode;
    var trList=gMap.querySelectorAll('tr');
    var mapw=gMap.querySelector('tr').querySelectorAll('td').length;
    var startCell={}, arrivalSq={}, path=[], nMap=[], gsum;

    setMap();
    if(sessionStorage.moving=="true"){
        followPath();
    }else{
        sessionStorage.moving=false;
    }

    function followPath(){
        var pathLite=JSON.parse(sessionStorage.pathLite);
        if(pathLite.length>0){
            sessionStorage.moving=true;
            let nx, ny, nextc;
            nextc=pathLite.shift();
            nx=startCell.x+nextc.mx;
            ny=startCell.y+nextc.my;

            let nxC=nMap[ny][nx];
            var nURL;
            if(nxC.u!=undefined && nxC.u!=null){
                nURL=nMap[ny][nx].u;
            }else if(param.nstop==true && nxC.u!=null){
                // poursuite du chemin en option
                // reconstituer le chemin pour trouver l'arrivée
                for(let step of pathLite){
                    nextc=pathLite.shift();
                    nx+=nextc.mx;
                    ny+=nextc.my;
                }
                arrivalSq=nMap[ny][nx];
                findPath();
                pathLite=JSON.parse(sessionStorage.pathLite);
                if(pathLite.length>0){
                    nextc=pathLite.shift();
                    nx=startCell.x+nextc.mx;
                    ny=startCell.y+nextc.my;
                    nURL=nMap[ny][nx].u;
                }
            }else{
                resetp();
                console.log("Rencontre");
                return;
            }
            sessionStorage.pathLite=JSON.stringify(pathLite);
            try{
                wframe.open(nURL,'_self');
            }catch(error){
                console.error('Une erreur s\'est produite :', error);
                resetp();
            }
            return;
        }else{
            sessionStorage.moving=false;
        }
        return;
    }
    function resetp(){
        let pathzero=[];
        sessionStorage.pathLite=JSON.stringify(pathzero);
        sessionStorage.moving=false;
    }

    function getArrivalSq(){
        let tdid=parseInt(this.getAttribute('name'));
        let aCoord=getCoord(tdid, mapw);
        arrivalSq=nMap[aCoord.y][aCoord.x];
        if(sessionStorage.moving=="false" && startCell.index!=arrivalSq.index){
            findPath();
            drawPath();
        }
        if(ysq){
            this.addEventListener('touchstart',followPath);
        }
    }

    function drawPath(){
        var asq;
        for(let ac of path){
            asq=trList[ac.y].querySelectorAll('td')[ac.x];
            asq.querySelector('.wLayer').style.display='block';
        }
    }

    function makePath(){
        path.length=0;
        var pathLite=[];
        let checkpoint={x:arrivalSq.x, y:arrivalSq.y};
        let ac=arrivalSq;
        gsum=arrivalSq.g;
        var lastdir=0, sqc=-1;
        while(ac.p>0){
            path.unshift({x:ac.x, y:ac.y});
            sqc+=1;
            let ncc=getCoord(ac.p, mapw);
            let dx = ac.x - ncc.x;
            let dy = ac.y - ncc.y;
            let dir=INS(dx,dy);
            if(lastdir!=dir && lastdir!=0 || sqc==5){
                dx=checkpoint.x-ac.x;
                dy=checkpoint.y-ac.y;
                pathLite.unshift({mx:dx,my:dy});
                checkpoint={x:ac.x,y:ac.y};
                sqc=0;
            }
            lastdir=dir;
            ac=nMap[ncc.y][ncc.x];
        }
        if(ac.p<0){
            let dx=checkpoint.x-ac.x;
            let dy=checkpoint.y-ac.y;
            pathLite.unshift({mx:dx,my:dy});
            checkpoint={x:ac.x,y:ac.y};
        }
        sessionStorage.pathLite=JSON.stringify(pathLite);

        function INS(dx,dy){
            if (dx === 0) {
                if (dy === 1) return 1; // S
                if (dy === -1) return 2; // N
            } else if (dy === 0) {
                if (dx === 1) return 3; // E
                if (dx === -1) return 4; // O
            } else if (dx === 1) {
                if (dy === 1) return 5; // SE
                if (dy === -1) return 6; // NE
            } else if (dx === -1) {
                if (dy === 1) return 7; // SO
                if (dy === -1) return 8; // NO
            }
            // aucun déplacement :
            return 0;
        }
    }

    function findPath(){
        var openSet=[{id:startCell.index,f:startCell.f}], closedSet=[];
        var currentNode=startCell;

        if(startCell.index==arrivalSq.index){ return; }

        while(openSet.length>0){
            if(currentNode.index==arrivalSq.index){
                openSet.length=0;
                makePath();
                // console.log('ok !');
                return;
            }
            scanNeighborhood();
        }
        gsum="Inaccessible";
        return console.log('Path not found');

        function scanNeighborhood(){
            let x,y,g,h,f,nEntry;
            x=currentNode.x;
            y=currentNode.y;

            const dirs = [
                { dx: 0, dy: -1 }, // haut
                { dx: 0, dy: 1 }, // bas
                { dx: -1, dy: 0 }, // gauche
                { dx: 1, dy: 0 }, // droite
                { dx: -1, dy: -1 }, // diagonale haut-gauche
                { dx: 1, dy: -1 }, // diagonale haut-droite
                { dx: -1, dy: 1 }, // diagonale bas-gauche
                { dx: 1, dy: 1 } // diagonale bas-droite
            ];
            // Parcourir toutes les directions et vérifier les voisins
            for (const direction of dirs) {
                const nx = x + direction.dx;
                const ny = y + direction.dy;

                // Vérifier si le nouveau voisin est à l'intérieur de la grille
                if(nx >= 0 && nx < mapw && ny >= 0 && ny < trList.length){
                    let nCell=nMap[ny][nx];
                    if(!nCell.imp && !closedSet.includes(nCell.index)){
                    if(openSet.map(c=>c.id).includes(nCell.index)){
                        g=currentNode.g+nCell.c;
                        h=seth(x,y,nx,ny);
                        f=g+h;
                        if(f<nCell.f){
                            nCell.g=g;
                            nCell.f=f;
                            nCell.p=currentNode.index;
                            opSetUpdate(nCell.index,f);
                        }
                    }else{
                        nCell.g=currentNode.g+nCell.c;
                        h=seth(x,y,nx,ny);
                        nCell.f=nCell.g+h;
                        nCell.p=currentNode.index;
                        nEntry={id:nCell.index, f:nCell.f};
                        openSet.push(nEntry);
                    }}
                }
            }
            // trier la liste ouverte et récup bestF
            openSet.sort(objArrComp);
            let bcc=getCoord(openSet[0].id,mapw);
            currentNode=nMap[bcc.y][bcc.x];
            closedSet.push(openSet[0].id);
            openSet.shift();

            function seth(x,y,nx,ny){
                let dx, dy, h;
                dx=Math.abs(nx-x);
                dy=Math.abs(ny-y);
                h=Math.max(dx,dy);
                return h;
            }

            function opSetUpdate(id,fvalue){
                let opSetIndex=openSet.findIndex(c => c.id === id);
                if(opSetIndex !== -1){
                    openSet[opSetIndex] = {...openSet[opSetIndex], f:fvalue};
                }
            };
        }

        function objArrComp(a,b){
            if(a.f<b.f){
                return -1;
            }
            if(a.f>b.f){
                return 1;
            }
            return 0;
        }
    }

    function setMap(){
        var aColor;
        for(let y=0; y<trList.length; y++){
            var tdList=trList[y].querySelectorAll('td');
            var nRow=[];
            for(let x=0; x<tdList.length; x++){
                let c, imp, index, url;
                index=getIndex(x,y,tdList.length);
                tdList[x].className='sq';
                let isch=tdList[x].getAttribute('onclick');
                if(isch!=null && isch.includes("afficheOrdreRencontre")){
                    if(param.ndisplay==true && !tdList[x].id.includes('pnj')){
                            let ard=tdList[x].querySelector('.div_ar');
                            ard.removeAttribute('style');
                            ard.style.display="block";
                            ard.className='div_br';
                    }
                }
                let omov=tdList[x].getAttribute('onmouseover');
                omov=omov.replace('selectionCase(this,"l_CadreRouge",0);','');
                tdList[x].setAttribute('onmouseover',omov);
                tdList[x].setAttribute('name',index);
                var info=tdList[x].getAttribute('infocase');
                if(!isNaN(info) && info!==null && tdList[x].id!='img_perso_joueur'){
                    c=parseInt(info);
                    imp=false;
                    // fonctionnalité
                    tdList[x].addEventListener(clp,followPath);
                    tdList[x].addEventListener('mouseenter',getArrivalSq);
                    tdList[x].addEventListener('mouseleave',resetPath);
                    aColor='rgba(255,255,255,0.25)';
                    url=getLink(tdList[x]);
                    tdList[x].removeAttribute('onclick');
                }else if(tdList[x].innerHTML.includes('Cadavre d un pnj fixe déjà tué')){
                    info=tdList[x].querySelector('img[src^="/media/zone/"]').alt;
                    c=parseInt(info);
                    tdList[x].setAttribute('infocase',c);
                    imp=false;
                    url=null;
                    aColor='rgba(255,150,0,0.25)';
                    tdList[x].addEventListener('mouseenter',getArrivalSq);
                    tdList[x].addEventListener('mouseleave',resetPath);
                }else{
                    c=Infinity;
                    imp=true;
                    aColor='transparent';
                    tdList[x].addEventListener('mouseleave',resetSq);
                }
                var nCell={
                    x:x,
                    y:y,
                    c:c,
                    g:Infinity,
                    f:Infinity,
                    p:-1,
                    u:url,
                    imp:imp, //impediment
                    index:index,
                };
                if(tdList[x].id=='img_perso_joueur'){
                    nCell.g=0;
                    nCell.p=-1;
                    nCell.imp=true;
                    startCell=nCell;
                    aColor='transparent';
                }
                nRow.push(nCell);
                makeDiv(tdList[x],aColor);
                tdList[x].removeAttribute('title');
                tdList[x].addEventListener('mouseenter',borderland);
            }
            nMap.push(nRow);
        }
    }

    function makeDiv(tdsq,color){
        let ndiv = pdocument.createElement('div');
        ndiv.className='wLayer';
        ndiv.style.backgroundColor= color;
        tdsq.appendChild(ndiv);
        if(tdsq.getAttribute('infocase')=="changementZone" && ysq==true){
            let ydiv = pdocument.createElement('div');
            ydiv.className='cdzLayer enodiv';
            tdsq.appendChild(ydiv);
        }

        let infod = pdocument.createElement('div');
        infod.className='infotip enodiv';
        tdsq.appendChild(infod);
    }

    function borderland(){
        let asq=this.querySelector('.wLayer');
        let infoc=this.getAttribute('infocase');
        if(!isNaN(infoc) && infoc!==null && this.id!='img_perso_joueur'){
            if(timeLeft>=gsum){
                asq.style.border='1px solid #00FF00';
                this.querySelector('.infotip').innerHTML=gsum+" min";
            }else if(!isNaN(gsum)){
                asq.style.border='1px solid #FF0000';
                this.querySelector('.infotip').innerHTML=gsum+" min";
            }else{
                asq.style.border='1px solid #FF0000';
                asq.style.backgroundColor = 'transparent';
                asq.style.display='block';
                this.querySelector('.infotip').innerHTML=gsum;
            }
            this.querySelector('.infotip').style.display='block';
        }else if(infoc=="changementZone"){
            asq.style.border='1px solid #FFFF00';
            asq.style.display='block';
            this.querySelector('.infotip').innerHTML="Changement de zone";
            this.querySelector('.infotip').style.display='block';
        }else if(this.id=='img_perso_joueur'){
            asq.style.border='1px solid rgba(238, 238, 238, .8)';
            asq.style.display='block';
        }else{
            asq.style.border='1px solid #FF0000';
            asq.style.display='block';
            let isch=this.getAttribute('onclick');
            if(isch==null){
                this.querySelector('.infotip').innerHTML="Infranchissable";
                this.querySelector('.infotip').style.display='block';
            }
            if(isch!=null && isch.includes("afficheOrdreFouille")){
                asq.style.border='1px solid #00FFFF';
                this.querySelector('.infotip').innerHTML="Fouille";
                this.querySelector('.infotip').style.display='block';
            }
        }
    }

    function removeElt(elt){
        if(elt){
            elt.remove();
        }else{
            console.log('Element not found - cannot remove.');
        }
        return;
    }

    function resetPath(){
        for(let asq of gMap.querySelectorAll('.wLayer')){
            asq.style.display='none';
            asq.style.border='none';
        }
        path.length=0;
        this.querySelector('.infotip').style.display='none';
        if(ysq){
            this.removeEventListener('touchstart',followPath);
        }
    }

    function resetSq(){
        let asq=this.querySelector('.wLayer');
        asq.style.display='none';
        asq.style.border='none';
        this.querySelector('.infotip').style.display='none';
    }


    function getIndex(x,y,dx){
        let index=x+dx*y;
        return index;
    }

    function getCoord(index,dx){
        let x,y;
        y=Math.floor(index/dx);
        x= index % dx;
        let coord={x:x,y:y};
        return coord;
    }

    function getLink(tdsq){
        if(tdsq.getAttribute('onclick')){
            let nLink=tdsq.getAttribute('onclick');
            nLink=nLink.replace('ouvertureFenetre("','');
            nLink=nLink.replace('","_self","");','');
            return nLink;
        }
        return false;
    }

    var mdun=pdocument.getElementById('sousMenu1');
    var mdde=pdocument.getElementById('sousMenu2');
    var mdtr=pdocument.getElementById('sousMenu3');
    mdtr.parentNode.querySelector('a').innerHTML='Gestion';
    try{
        mdtr.appendChild(mdde.querySelector('a[href="calque_ilePerso.php"]').parentNode);
        mdtr.appendChild(mdde.querySelector('a[onclick^="ouvertureFenetre(\'journalDeBord.php\',\'"]').parentNode);
        mdtr.appendChild(mdun.querySelector('a[href="calqueParamDons.php"]').parentNode);
        mdtr.appendChild(mdun.querySelector('a[href="calqueDistinctionPerso.php"]').parentNode);
        mdtr.appendChild(mdun.querySelector('a[href="calqueManipulerPNJ.php"]').parentNode);
        mdtr.appendChild(mdun.querySelector('a[onclick^="ouvertureFenetre(\'main.php?u_i_music=1\',"]').parentNode);
        mdtr.appendChild(mdun.querySelector('a[onclick^="ouvertureFenetre(\'main.php?u_i_survole=1\',"]').parentNode);
    }catch{
        console.log('530 - Menu gestion');
    }
    let sbm=pdocument.createElement('div');
    let aelt=pdocument.createElement('a');
    aelt.href = "#";
    aelt.style.textAlign ='left';
    aelt.innerHTML=getparam();
    aelt.addEventListener("click",goOnOff);
    sbm.appendChild(aelt);
    mdtr.appendChild(sbm);
    function goOnOff(){
        if(param.nstop){
            this.innerHTML="🧭 Arrêt rencontre";
            param.nstop=false;
        }else{
             this.innerHTML="🧭 Poursuivre son chemin";
            param.nstop=true;
        }
        localStorage.param=JSON.stringify(param);
    }
    function getparam(){
        let txt="🧭 Arrêt rencontre";
        if(param.nstop){
            txt="🧭 Poursuivre son chemin";
        }
        return txt;
    }

    let asbm=pdocument.createElement('div');
    let anelt=pdocument.createElement('a');
    anelt.id='ndisplay';
    anelt.href = "#";
    anelt.style.textAlign ='left';
    anelt.innerHTML=getnaparam();
    anelt.addEventListener("click",nadisplay);
    asbm.appendChild(anelt);
    mdtr.appendChild(asbm);
    function nadisplay(){
        if(param.ndisplay){
            this.innerHTML="🏷️ Légender";
            param.ndisplay=false;
        }else{
             this.innerHTML="🏷️ Légender";
            param.ndisplay=true;
        }
        localStorage.param=JSON.stringify(param);
        try{
            wframe.location.reload();
        }catch(err){
            console.error(err);
        }
    }
    function getnaparam(){
        let txt="🏷️ Légender";
        if(param.ndisplay){
            txt="🏷️ Légender";
        }
        return txt;
    }

    function setgStyle(){
        let gstyle=pdocument.createElement('STYLE');
        pdocument.head.appendChild(gstyle);
        gstyle.id='gstyle';
        gstyle.innerHTML=`
        .wLayer{
           position:absolute;
           top: 0;
           left: 0;
           box-sizing: border-Box;
           width: 100%;
           height: 100%;
           z-index: 6;
           display:none;
           border:none;
        }

        .infotip{
           position: absolute;
           top : 35px;
           left: 28px;
           width: max-content;
           display:none;
           z-index: 3000;
           border: 1px solid #111;
           background-color: #eee;
           padding: 3px;
           opacity: 0.95;
           font-family: Verdana;
           font-size: 10px;
           color: black;
           font-weight: bold;
        }

        .cdzLayer{
           position:absolute;
           top: 0;
           left: 0;
           box-sizing: border-Box;
           width: 100%;
           height: 100%;
           z-index: 5;
           border: 1px solid #DDDD00;
        }

        .div_br {
          position: absolute;
          bottom: 0px;
          right: 0px;
          border: 1px solid black;
          font-size: 10px;
          z-index: 7;
          background-color: white;
          white-space: nowrap;
          overflow: hidden;
          width: 32px;
          height: 11px;
        }`;
    }
}

})();