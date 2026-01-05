// ==UserScript==
// @name        WhackAZimp
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @version     1.0711
// @grant       none
// @description Whack a Zimp
// @downloadURL https://update.greasyfork.org/scripts/2444/WhackAZimp.user.js
// @updateURL https://update.greasyfork.org/scripts/2444/WhackAZimp.meta.js
// ==/UserScript==

whacAZimpNum = 0;

var whacAZimp = (function () {
    var CONGRATULATIONS = 'Well done you are The Whac a Zimp champion!',
        HEIGHT = 4,
        WIDTH = 7,
        LEVELUP = 80,
        initialize,
        levelHolder,
        level,
        li,
        liElements = [],
        tronchesZimp = [],
        tronchesGentils = [],
        prevZimp,
        prepGame,
        prepStage,
        renderZimp,
        renderStage,
        setUpEvents,
        scoreHolder,
        score,
        vieHolder,
        vie,
        stage,
        speed = 1100,
        startGame,
        timer,
        diff,
        utils = {
            id: function (id) {
                return document.getElementById(id);
            },
            getNodeAsInt: function (parent) {
                return parent.firstChild.nodeValue - 0;
            },
            setFirstChildValue: function (parentElem, value) {
                parentElem.firstChild.nodeValue = value;
            },
            setTimer: function (func, ms) {
                return setInterval(func, ms);
            }
        };

    initialize = function (a) {
        liElements = [];
        if (undefined !== timer)
            clearInterval(timer);
        prepStage();
        renderStage();
        prepGame();
        setUpEvents();
        startGame(a);
    };

    prepStage = function () {
        li = document.createElement('li');
        li.style.backgroundColor="#ccc";
        li.style.display = "inline-block";
        li.style.height = "50px";
        li.style.margin = "0 0 5px 5px";
        li.style.textDecoration = "none";
        li.style.width = "50px";
        li.style.backgroundImage = "url('http://nsa33.casimages.com/img/2014/06/05/14060503480228466.png')";
        li.style.backgroundSize = "cover";

        stage = document.getElementById('ulStage'+whacAZimpNum);

    };

    renderStage = function () {
        for (var i = 0; i < (HEIGHT * WIDTH); i++) {
            var cloneLi = li.cloneNode(false);

            stage.appendChild(cloneLi);
            liElements.push(cloneLi);
        }
    };

    prepGame = function () {
        levelHolder = utils.id('level'+whacAZimpNum);
        level = utils.getNodeAsInt(levelHolder);
        scoreHolder = utils.id('score'+whacAZimpNum);
        score = utils.getNodeAsInt(scoreHolder);
        vieHolder = utils.id('vie'+whacAZimpNum);
        vie = utils.getNodeAsInt(vieHolder);    
    };

    setUpEvents = function () {
        stage.addEventListener('click', function(e) {
            if (e.target && 'li' === e.target.nodeName.toLowerCase()) {
                if ('zimp' === e.target.className) {
                    score += 10;
                    utils.setFirstChildValue(scoreHolder, score);
	                e.target.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/14060504012010051.jpg')";

                    if (score === level*100) {
                        clearInterval(timer);
                        if (1000 === score) {
                            scoreHolder.parentNode.innerHTML = CONGRATULATIONS;
                        } else {
                            speed -= LEVELUP;
                        
                            if(diff==1)
                             timer = utils.setTimer(renderZimpFacile, speed);
                            else if (diff > 1 || diff == -10)                         
                                timer = utils.setTimer(renderZimp, speed); 
        

                            level++;
                            utils.setFirstChildValue(levelHolder, level);
                        }
                    }
                }
                else //erreur
        		{
                  if('zentil' === e.target.className)
                  {
                     score -= 50;   
                     if(diff > 2 || diff == -10)
                     {
                         if(vie > 0)
                         {
                             vie -= 1;
                             utils.setFirstChildValue(vieHolder, vie);
                         }

                         if(vie == 0)
                         {
                           clearInterval(timer);
                           utils.setFirstChildValue(vieHolder, "Perdu!!");
                         }
                     }
                  }
                  else
                     score -= 10;
                    
        		  utils.setFirstChildValue(scoreHolder, score);
	              e.target.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/14060504012010051.jpg')";
        		  setTimeout(function(){e.target.style.backgroundImage = "url('http://nsa33.casimages.com/img/2014/06/05/14060503480228466.png')";},speed);
        		  
        		  if (level > 1 && score < ((level-1)*100))
        		  {
        		      clearInterval(timer);
                      speed += LEVELUP;
                      if(diff==1)
                         timer = utils.setTimer(renderZimpFacile, speed);
                      else if (diff > 1 || diff == -10)                          
                          timer = utils.setTimer(renderZimp, speed);        
                      
                      level--;
                      utils.setFirstChildValue(levelHolder, level);
        		    } 
        		}
            }
        }, false);
    };

    startGame = function (a) {
        diff = a;
        if(diff==1)
           timer = utils.setTimer(renderZimpFacile, speed);
        else if (diff==-10)
        {
           tronchesZimp = ["Antheim.jpg", "Dann.png","ElfeSombre.jpg","Fitz.jpg","Kinchaka.jpg","Malia.png","Oshean.jpg","Sÿllia.png","Zarah.png"];
           tronchesGentils = ["Odul.png"];
           timer = utils.setTimer(renderZimp, speed);
        }
        else if (diff > 1)
        {
           tronchesZimp = ["Elea.png","Scout.png","Pistache.png","Djino.jpg","Ethayel.jpg","Valmont.jpg","L-X.jpg","Kelvin.jpg","Zalaniz.png","Laetitia.jpg","Kazuki.png","Kmaschta.jpg","Arsenia.png","Alinka.jpg","Ghost.jpg","Saurus.jpg","Manerina.jpg","Ella.jpg","Astaa.png"];
           tronchesGentils = ["Fitz.jpg","Kinchaka.jpg","Malia.png","Oshean.jpg","Odul.png","Sÿllia.png","Zarah.png","Junajo.png","Pixelle.jpg","Lorkah.png","EveR.png","Cyberthorvaldr.jpg","Cherakanon.jpg","Gabrielle.png","Vanity.jpg","Alucard.jpg","Joaw.png","Yenahe.jpg","Gotheve.png","Xiya.jpg","Mik.png","Ghazullmor.jpg","Akiross.png"];
           timer = utils.setTimer(renderZimp, speed);
            
            if(diff == 4)
     		    setInterval(function(){score -= 10; utils.setFirstChildValue(scoreHolder, score);},10000);        
        }
    };

    
    renderZimpFacile = function () {
        if (undefined !== prevZimp) 
        {   
            prevZimp.className = '';
            prevZimp.style.backgroundImage = "url('http://nsa33.casimages.com/img/2014/06/05/14060503480228466.png')";
        }
        prevZimp = liElements[Math.floor((Math.random()*(HEIGHT * WIDTH))+1)-1];
        prevZimp.className = 'zimp';
    	if(level <= 2)
            prevZimp.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/140605035115599491.png')";
    	else
            prevZimp.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/Elea.png')";
     };
  
     
    renderZimp = function () {
       if (undefined !== prevZimp) 
        {   
            prevZimp.className = '';
            prevZimp.style.backgroundImage = "url('http://nsa33.casimages.com/img/2014/06/05/14060503480228466.png')";
        }
        prevZimp = liElements[Math.floor((Math.random()*(HEIGHT * WIDTH))+1)-1];
              	
        var gentilmechant =Math.floor(Math.random()*7);
        if (gentilmechant != 0)
        {
            var tronche = tronchesZimp[Math.floor(Math.random()*tronchesZimp.length)]    
            prevZimp.className = 'zimp';
        }
        else            
        {
            var tronche = tronchesGentils[Math.floor(Math.random()*tronchesGentils.length)]    
            prevZimp.className = 'zentil';
        }

        prevZimp.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/"+tronche+"')";
    }

    return {
        init: initialize
    };
})();


Deck.prototype.executeCommandSave = Deck.prototype.executeCommand;

Deck.prototype.executeCommand=function(a,b){
    var c=$("#"+b+" .ligne_ecriture input").val();
    $.ajaxSetup({async: false});
    this.executeCommandSave(a,b);
    $.ajaxSetup({async: true});    
    
    if(c.toLowerCase() === "waz")
    {
       $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<div>Tapes waz niveauDeDifficulté (en minuscule) avec </br> Facile : Frappes le zimp qui apparaît et tu marques 10 points. Touches un logo rebz et tu perds dix points.</br> Moyen : Oh non c était un rebz! Si tu le confonds avec un zimp et lui éclate le nez tu perds 50 points! </br> Difficile : Moyen + Tu perds la partie si tu exploses trois rebzs! </br> Hardcore : Difficile + Tu perds dix points toutes les dix secondes. </br></br> Élections : Défoules toi sur les candidats! Mais ne touches pas à Odul! Équivalent à difficile</div>');        
    }
    else if(c.toLowerCase() === "waz facile")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="display:none">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(1);
    }
    else if(c.toLowerCase() === "waz moyen")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="display:none;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(2);
    }
    else if(c.toLowerCase() === "waz difficile")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(3);
    }
    else if(c.toLowerCase() === "waz hardcore")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(4);
    }
    else if(c.toLowerCase() === "waz elections")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(-10);
    }
};