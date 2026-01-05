// ==UserScript==
// @name        baboutestWave
// @namespace   *.travian.*
// @include     *://*.travian.*/*
// @version     2.0.2
// @description Babouwave2
// @downloadURL https://update.greasyfork.org/scripts/20037/baboutestWave.user.js
// @updateURL https://update.greasyfork.org/scripts/20037/baboutestWave.meta.js
// ==/UserScript==

(function () {

    function allInOneOpera() {
        var version = '0.5';
        var scriptURL = 'http://userscripts.org/scripts/show/132636';
        notRunYet = false;
        var defInterval = 55;
        var defIntervalBeforeKinder = 800;
        var defDecalage = 250;
        var timeForSwitchingVivi = 1000; // temps utilisé pour recharger le bon village avant de lancer
        full_Imitation = false;

        /*********************** common library ****************************/
        function ajaxRequest(url, aMethod, param, onSuccess, onFailure) {
            var aR = null;

            if (window.XMLHttpRequest) // Firefox 
                aR = new XMLHttpRequest();
            else if (window.ActiveXObject) // Internet Explorer 
                aR = new ActiveXObject("Microsoft.XMLHTTP");
            else { // XMLHttpRequest non supporté par le navigateur 
                alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
                return;
            }


            aR.onreadystatechange = function () {
                if (aR.readyState == 4 && (aR.status == 200 || aR.status == 304))
                    onSuccess(aR);
                else if (aR.readyState == 4 && aR.status != 200)
                    onFailure(aR);
            };
            aR.open(aMethod, url, true);
            if (aMethod == 'POST')
                aR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            aR.send(param);
        }
        ;


        function httpPost(url, data) {
            var xhttp = new XMLHttpRequest();
            data = encodeURI(data);
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            xhttp.send(data);
            return xhttp.responseText;
        }

        function httpGet(url, data) {
            var xhttp = new XMLHttpRequest();
            data = encodeURI(data);
            xhttp.open("GET", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            xhttp.send(data);
            return xhttp.responseText;
        }



        Number.prototype.NaN0 = function () {
            return isNaN(this) ? 0 : this;
        };

        String.prototype.trim = function () {
            return this.replace(/&nbsp;/g, '').replace(/^\s+|\s+$/g, '');
        };

        String.prototype.onlyText = function () {
            return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[\s\S]+?>/g, '');
        };

        function $g(aID) {
            return (aID != '' ? document.getElementById(aID) : null);
        }
        ;
        function $gn(aID) {
            return (aID != '' ? document.getElementsByName(aID) : null);
        }
        ;


        function $gt(str, m) {
            return (typeof m == 'undefined' ? document : m).getElementsByTagName(str);
        }
        ;

        function $gc(str, m) {
            return (typeof m == 'undefined' ? document : m).getElementsByClassName(str);
        }
        ;


        function $at(aElem, att) {
            if (att !== undefined)
            {
                for (var xi = 0; xi < att.length; xi++)
                {
                    aElem.setAttribute(att[xi][0], att[xi][1]);

                    if (att[xi][0].toUpperCase() == 'TITLE')
                        aElem.setAttribute('alt', att[xi][1]);
                }
                ;

            }
            ;
        }
        ;



        function $t(iHTML) {
            return document.createTextNode(iHTML);
        }
        ;


        function $e(nElem, att) {
            var Elem = document.createElement(nElem);
            $at(Elem, att);
            return Elem;
        }
        ;

        function $ee(nElem, oElem, att) {
            var Elem = $e(nElem, att);
            if (oElem !== undefined)
                if (typeof (oElem) == 'object')
                    Elem.appendChild(oElem);
                else
                    Elem.innerHTML = oElem;

            return Elem;
        }
        ;


        function $c(iHTML, att) {
            var tdTemp = $ee('TD', iHTML, att);
            tdTemp.setAttribute('style', 'text-align:center !important;');

            return $ee('TD', iHTML, att);
        }


        function $a(iHTML, att) {
            return $ee('A', iHTML, att);
        }


        function $am(Elem, mElem) {
            if (mElem !== undefined)
                for (var i = 0; i < mElem.length; i++)
                {
                    if (typeof (mElem[i]) == 'object')
                        Elem.appendChild(mElem[i]);
                    else
                        Elem.appendChild($t(mElem[i]));
                }

            return Elem;
        }
        ;


        function $em(nElem, mElem, att) {
            var Elem = $e(nElem, att);

            return $am(Elem, mElem);
        }
        ;


        function dummy() {
            return;
        }
        ;

        jsNone = 'return false;';

        function trImg(cl, et) {
            var ecl = [['class', cl], ['src', 'img/x.gif']];
            if (typeof et != 'undefined')
                ecl.push(['title', et]);
            return $e('IMG', ecl);
        }


//Fonction getRandom dont le nom fait très peur quand on vois qu'elle est utilisé dans le delai entre les vague :D
        function getRandom(x) {								// exemple pour      25 ms    50 ms   100 ms   500 ms	1000 ms
            x = Math.round(x * 0.8);  //                       20       40       80      400      800
            return x + Math.round(Math.random() * x * 0.5);//min : 25		  50 	  100	   500  	1000
            //  0<= Math.random() < 1 				   max : 35		  70      140	   700      1400
        }

        /********** begin of main code block ************/

        function ok() {
            tFormFL = true;
            plus.innerHTML = '+';
        }

        function addWave() {
            if (tFormFL) {
                tFormFL = false;
                plus.innerHTML = 'x';
            } else
                return;

            //Récupere la liste des input du formulaire du jeu
            var tInputs = $gt('INPUT', tForm);

            var needC = true;//Inutile a priori
            var sParams = '';
            var cDescr = '';

            //Recupere les info dans la liste 
            for (var i = 0; i < tInputs.length; i++)
            {
                t = tInputs[i].name;
                if (/redeployHero/.test(t))
                {
                    sParams += "redeployHero=&";
                } else if (/^t\d/.test(t) || /x|y/.test(t))
                {
                    sParams += t + "=" + $gn(t)[0].value + "&";
                } else if (t == "c")
                {
                    if (needC) //Inutile a priori
                    {
                        var iAttackType = $gn('c');
                        for (var q = 0; q < iAttackType.length; q++)
                            if (iAttackType[q].checked)
                            {
                                sParams += "c=" + (q + 2) + "&";
                                cDescr = iAttackType[q].parentNode.innerHTML.onlyText().trim();
                            }
                        needC = false;//Inutile a priori
                    }
                } else
                {
                    sParams += t + "=" + tInputs[i].value + "&";
                }
            }

            sParams = sParams.substring(0, sParams.length - 1);

            //Recupere la page de lancement 
            var rpPage = $ee('div', httpPost(a2bURL, sParams)); //,[['style','display:none;']]);

            var err = $gc('error', rpPage);

            if (err.length > 0 && err[0].innerHTML.length > 1)
            {
                ok();
                alert(err[0].innerHTML.onlyText());
                return;
            }
            err = $gc('alert', rpPage);

            if (err.length > 0 && err[0].innerHTML.length > 1)
            {
                ok();
                if (!confirm(err[0].innerHTML.onlyText()))
                    return;
            }

            tInputs = $gt('INPUT', rpPage);

            sParams = '';

            var tc = new Array(12);

            for (i = 0; i < tInputs.length; i++)
            {
                t = tInputs[i].name;
                if (/^t\d/.test(t))
                {
                    tc[t.match(/\d+/)[0]] = tInputs[i].value;
                }
                if (t == "c")
                {
                    needC = tInputs[i].value;
                }
                sParams += t + "=" + tInputs[i].value + "&";
            }

            sParams = sParams.substring(0, sParams.length - 1);

            // Création du bouton remove wave
            var remBtn = $c($a('-', [['href', '#'], ['onClick', jsNone]]), [['title', 'remove wave'], ['rowspan', 3]]);

            remBtn.appendChild($e('INPUT', [['type', 'hidden'], ['value', sParams]]));
            remBtn.addEventListener('click', remWave, false);

            //création de la ligne
            var nrow = $ee('TR', remBtn);

            for (i = 1; i < 12; i++) {
                nrow.appendChild($c(tc[i]));
            }


            //****************************************
            //recuperation du temps de trajet	

            var inElements = $gc('in', rpPage);

            var spanTime = null;

            if (inElements.length > 0)
            {

                var temp = inElements[0].innerHTML;

                //ATTENTION SPECIFIQUE A LA LANGUE, A MODIFIER PAR UN SPLIT(' ') + in un if (parseInt ) ;)
                temp = temp.substring(5, temp.length - 6);

                var detailTime = temp.split(':');
                if (detailTime.length == 3)
                {

                    spanTime = document.createElement('SPAN');
                    spanTime.innerHTML = temp
                }
            }




            //nrow.appendChild($c(needC,[['title',cDescr]]));

            var nbody = $ee('TBODY', nrow);

            tInputs = $gt('SELECT', rpPage);
            var nrow = $e('TR');
            nrow.appendChild($c(tInputs.length > 0 ? tInputs[0] : '-', [['colspan', 6]]));
            nrow.appendChild($c(tInputs.length > 0 ? tInputs[0] : '-', [['colspan', 5]]));
            nbody.appendChild(nrow);


            var nrow = $e('TR');

            var textMouvement = '';

            if (needC == '2')
                textMouvement = 'Assistance';

            if (needC == '3')
                textMouvement = 'Attaque';

            if (needC == '4')
                textMouvement = 'Pillage';

            nrow.appendChild($c($t(textMouvement), [['colspan', 3], ['style', 'text-align:center !important;']]))

            nrow.appendChild($c(spanTime, [['colspan', 3], ['style', 'text-align:center !important;']]));
            nrow.appendChild($c($e('SPAN'), [['colspan', 3], ['style', 'text-align:center !important;']]));

            var bInputMs = $e('INPUT', [['type', 'text'], ['value', (tbl.tBodies.length % 4 == 3 ? defIntervalBeforeKinder : defInterval)], ['size', 4], ['maxlength', 4]]);
            bInputMs.addEventListener('change', txtMsChanged, false);

            var bTdInputMs = $c(bInputMs, [['colspan', 2], ['style', 'text-align:center !important;']]);
            bTdInputMs.appendChild($t(' ms'));

            nrow.appendChild(bTdInputMs);

            nbody.appendChild(nrow);

            tbl.appendChild(nbody);
            if (!timerOn)
                lanceTimer();

            window.setTimeout(newForm, getRandom(1200));
        }

        function newForm() {
            if (full_Imitation) {
                ajaxRequest(a2bURL, "GET", null, function (ajaxResp) {
                    var rpPage = $ee('div', ajaxResp.responseText, [['style', 'display:none;']]);
                    rpPage = document.evaluate('.//form[@name="snd"]', rpPage, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (rpPage)
                        tForm = rpPage;
                    ok();
                }, ok);
            } else
                ok();
        }

        function remWave() {
            var tb = this.parentNode.parentNode;
            tb.parentNode.removeChild(tb);
        }


        function getTxtTime(sec) {
            var heureTemp = parseInt(Number(sec) / 3600);
            if (heureTemp > 23)
                heureTemp -= 24;

            var minuteTemp = parseInt((Number(sec) % 3600) / 60);

            var secondeTemp = Number(sec) % 60;

            return String.concat(heureTemp, ':', (Number(minuteTemp) > 9 ? '' : '0'), minuteTemp, ':', (Number(secondeTemp) > 9 ? '' : '0'), secondeTemp);
        }

        function getTxtHour(sec) {
            return getTxtTime(adjustSecInTime(sec));
        }


        function getSec(chaine) {
            var detailTime = chaine.split(':');

            //alert(chaine);

            if (detailTime.length != 3)
                return null;

            //alert('ok nb part');

            var htemp = parseInt(detailTime[0], 10)

            var mtemp = parseInt(detailTime[1], 10)

            var stemp = parseInt(detailTime[2], 10)

            if (htemp == undefined || mtemp == undefined || stemp == undefined)
                return null;

            return ((((60 * htemp) + mtemp) * 60) + stemp);
        }

        function adjustSecInTime(bsecTemp) {

            var valTemp = parseInt(bsecTemp, 10);

            if (valTemp == undefined)
                return null;

            while (valTemp > 86400)
                valTemp -= 86400; //enleve 24h tant que ça fait plus de 24h

            while (valTemp < 0)
                valTemp += 86400; // ajoute 24h tant que ça fait moins de 0

            return valTemp;
        }


        function lanceTimer() {
            timerOn = true;
            afficheHeures();
        }

        function lanceSetTimeout() {
            var newTimeServ = getSec(document.getElementById('servertime').childNodes[1].innerHTML);

            if (newTimeServ != servTimeSec) // l'heure serveur viens de changer
            {
                var delaiLanceTemp = (1000 * adjustSecInTime(heureDepart - newTimeServ)) - Number(decalage.value)

                timeOutLancement = window.setTimeout(sendWaves, delaiLanceTemp); // enclanche le lancement des vague pour l'heure voulu (ajouter le parametre décalage ici)

                //timeOutRechargement = window.setTimeout(rechargeVillage, delaiLanceTemp - timeForSwitchingVivi)


                //affiche que c'est en cours de lancement

                timerOn = true; // remet l'affichage des timers en route
                window.setTimeout(afficheHeures, 100); // et relance l'affichage

            } else
                window.setTimeout(lanceSetTimeout, 10) //attends encore pour lancer :D
        }

        function rechargeVillage() {
            if (idViviActif != null)
            {
                httpGet(fullName + 'dorf1.php?newdid=' + idViviActif, null);
            }
        }

        function majBTimers() {
            bTimers = new Array()
            var nbWave = tbl.tBodies.length;
            //alert(tbl.tBodies.length);
            memeTemps = true;
            if (nbWave == 0)
            {
                timerOn = false;
                afficheVide();
                return;
            }

            for (i = 0; i < nbWave; i++)
            {
                //alert(i);
                var autreTemp = tbl.tBodies[i].getElementsByTagName('SPAN');
                //alert(i);
                //alert(autreTemp.length);

                if (autreTemp.length == 2)
                {
                    //alert(i);
                    var timtemp = new Object();
                    timtemp.secondes = Number(getSec(autreTemp[0].innerHTML));
                    timtemp.spanAchange = autreTemp[1];
                    bTimers.push(timtemp);
                    if ((i != 0) && (bTimers[i - 1].secondes != timtemp.secondes))
                    {
                        memeTemps = false;

                    }
                }
            }

            if (!memeTemps)
            {
                afficheErreur();
                return
            }
            // au moins 1 vague et meme temps si plus

            if (arrivAffiched) // si le form arrive est affiché on quitte, fin de la maj
                return;

            afficheArrive();
        }

        function afficheHeures() {

            //alert(tbl.tBodies.length)
            if (bTimers.length != tbl.tBodies.length)
                majBTimers();


            //alert(String.concat('bodies : ', tbl.tBodies.length, ' timers : ', bTimers.length));
            if (timerOn) // timer is On when there is one wave at less
            {
                //Recupere l'heure du serveur
                servTimeSec = getSec(document.getElementById('servertime').childNodes[1].innerHTML);

                // Lance les troupe si il faut et que c'est l'heure  <= rendu inutile par le setTimeOut du lancement
                //if(launchInWait)
                //{
                //var tempRestant = adjustSecInTime(heureDepart - servTimeSec);
                //if (tempRestant = 0 || tempRestant > 86390)
                //{
                //sendWaves();
                //return;
                //}

                //}

                //prends le decalage en compte
                servTimeSec += Math.round(Number(decalage.value) / 1000);


                if (!memeTemps)
                    for (i = 0; i < bTimers.length; i++)
                    {
                        bTimers[i].spanAchange.innerHTML = getTxtHour(Number(bTimers[i].secondes) + Number(servTimeSec));
                    }
                else //memeTemps 
                {
                    if (!arrivBlocked)
                    {
                        //calcul l'heure d'arrivee en sec puis en texte sous la forme hh:mm:ss
                        heureArrivee = adjustSecInTime(Number(bTimers[0].secondes) + Number(servTimeSec));

                        var harrivTemp = getTxtTime(heureArrivee);

                        //met tout les timers des vague a l'heure en question
                        for (i = 0; i < bTimers.length; i++)
                        {
                            bTimers[i].spanAchange.innerHTML = harrivTemp;
                        }

                        //met l'heure d'arrivée globale
                        if (arrivAffiched)
                            $g('txtarrive').value = harrivTemp;


                    } else //arrivBlocked
                    {
                        txtBoxDepart.value = getTxtHour(heureDepart - servTimeSec);

                    }


                }
                window.setTimeout(afficheHeures, 100);
            }
        }

        function afficheArrive() {

            divArriv.innerHTML = '';
            divArriv.appendChild(formArrive);
            arrivAffiched = true;
        }

        function afficheErreur() {

            arrivAffiched = false;
            arrivBlocked = false;
            divArriv.innerHTML = 'Pas les meme temps de route';
        }

        function afficheVide() {
            arrivAffiched = false;
            arrivBlocked = false;
            divArriv.innerHTML = '';
        }

        function blockArrive() {
            arrivBlocked = true;
            arriveTextChanged();
        }

        function deblockArrive() {
            arrivBlocked = false;
        }

        function clickCheck() {
            arrivBlocked = bCkbArriveBlock.checked;

            if (arrivBlocked)
            {
                txtBoxArrive.readOnly = false;
                arriveTextChanged();

            } else
            {
                txtBoxDepart.value = '00:00:00';
                txtBoxArrive.readOnly = true;
            }
        }

        function checkChangeVivi() {



            changeViviAfter = bCkChangeViviAfter.checked;

            bDivForSelectVivi.innerHTML = '';

            if (changeViviAfter)
                bDivForSelectVivi.appendChild(selectViviForChangeAfter);
        }


        function arriveTextChanged() {
            //alert('text changed 1');
            var testHeureArrive = getSec(txtBoxArrive.value);
            //alert('text changed 2');
            if (testHeureArrive != null)
            {

                heureArrivee = adjustSecInTime(testHeureArrive);

                heureDepart = adjustSecInTime(heureArrivee - bTimers[0].secondes);

                var tempTextDep = getTxtTime(heureDepart)

                txtBoxDepart.value = tempTextDep;

                for (i = 0; i < bTimers.length; i++)
                {
                    bTimers[i].spanAchange.innerHTML = tempTextDep;
                }

            }

            txtBoxArrive.value = getTxtTime(heureArrivee);
        }

        function bClickButton() {
            if (!arrivBlocked) // si l'arrivée n'est pas bloqué, lance
            {
                sendWaves();
                return;
            }

            // change la valeur de launchInWait
            launchInWait = !launchInWait;

            //block ou deblock la textBox heure d'arrivée
            txtBoxArrive.readOnly = launchInWait;

            // bloque ou debloque la checkBox
            bCkbArriveBlock.disabled = launchInWait;

            //block ou deblock tout les inputs text decalage vague
            for (ind = 0; ind < tbl.tBodies.length; ind++)
            {
                $gt('INPUT', tbl.tBodies[ind])[1].readOnly = launchInWait;
            }

            //block ou deblock le inputs text decalage 
            decalage.readOnly = launchInWait;

            //block ou déblock la checkBox change Vivi after
            bCkChangeViviAfter.disabled = launchInWait;

            //block ou déblock le select viviChangeAfter
            selectViviForChangeAfter.disabled = launchInWait;


            if (launchInWait) //si on viens de demander le lancement
            {
                timerOn = false; // arreter l'affichage des temps le temps d'etre bien calé

                //Recupere l'heure du serveur
                servTimeSec = getSec(document.getElementById('servertime').childNodes[1].innerHTML);
                window.setTimeout(lanceSetTimeout, 10);
            } else //on viens de demander l'arret
            {
                clearTimeout(timeOutLancement); // supprime le lancement
                //devra afficher que c'est arreté

            }
        }

        function txtMsChanged()
        {
            if (parseInt(this.value))
            {
                this.backvalue = parseInt(this.value)
            }
            this.value = this.backvalue;
        }

        function sendTroops(x) {
            var wBody = tbl.tBodies[x];
            var sParams = $gt('INPUT', wBody)[0].value;
            var tInputs = $gt('SELECT', wBody);
            sParams += tInputs.length > 0 ? "&" + tInputs[0].name + "=" + tInputs[0].value : '';
            sParams += tInputs.length > 1 ? "&" + tInputs[1].name + "=" + tInputs[1].value : '';

            wlog += x + ', ';
            if (x == wCount - 1) {
                wlog += 'OK';
                window.setTimeout(goToPrAndChangeVivi, getRandom(1500));
            }
            cLog.innerHTML = wlog;
            ajaxRequest(a2bURL, "POST", sParams, dummy, dummy);
        }

        function goToPrAndChangeVivi() {

            //Ouvre la Pr pour qu'on vois les vagues
            document.location.href = fullName + 'build.php?' + (ver4FL ? 'tt=1&' : '') + 'id=39';

            //Inutile car chargement du vivi avant de lancer
            //Change de village si demandé
            //if(changeViviAfter)
            //httpGet(fullName + 'dorf1.php?newdid=' + selectViviForChangeAfter.options[selectViviForChangeAfter.selectedIndex].value, null);


        }


        function sendWaves() {
            timerOn = false;

            rechargeVillage();

            cLog = $c(wlog, [['colspan', 13]]);
            tbl.tFoot.appendChild($ee('TR', cLog));
            wCount = tbl.tBodies.length;
            var nextWave = 10;

            for (var i = 0; i < wCount; i++) {

                window.setTimeout(function (x) {
                    return function () {
                        sendTroops(x);
                    }
                }(i), nextWave);

                nextWave += Number($gt('INPUT', tbl.tBodies[i])[1].value) //l'abération qu'il y avais avant : getRandom(intWave);
            }
        }

        var ver4FL = true;
        if (/a2b.php/.test(window.location.href)) {
            var build = $g('content');
            ver4FL = false;
        } else {
            var build = $g('build');
            if (!(build))
                return;
            if (build.getAttribute('class').indexOf('gid16') == -1)
                return;
        }
        var snd = $gn('snd');
        if ($gn('snd').length == 0)
            return;

        var nation = Math.floor(parseInt($gc('unit')[0].getAttribute('class').match(/\d+/)[0]) / 10);
        if (nation < 0)
            return;

        var a2bURL = ver4FL ? "build.php?tt=2&id=39" : "a2b.php";
        var wCount = 0;
        var wlog = '';
        var cLog;
        var tForm = snd[0];
        var tFormFL = true;

        var bTimers = new Array();
        var timerOn = false;
        var memeTemps = true;

        var arrivAffiched = false;
        var arrivBlocked = false;

        var servTimeSec;

        var launchInWait = false;

        var heureArrivee;

        var heureDepart;

        var timeOutLancement;

        var timeOutRechargement;

        var changeViviAfter = false;


        var fullName = window.location.href.match(/^.*\/\/.+\/+?/)[0];
// build table header
        var tbl = $e('TABLE', [['style', 'border:1px solid silver;']]);
        var plus = $a('+', [['href', '#'], ['onClick', jsNone]]);
        var addBtn = $c(plus, [['title', 'append wave']]);
        addBtn.addEventListener('click', addWave, false);
        var hrow = $ee('TR', addBtn);
        for (var i = 1; i < 11; i++) {
            hrow.appendChild($c(trImg('unit u' + (nation * 10 + i))));
        }
        $am(hrow, [$c(trImg('unit uhero'))]);//,$c('c')
        tbl.appendChild($ee('THEAD', hrow));
        if (ver4FL) {
            var sendBtn = $g('btn_ok').cloneNode(true);
            sendBtn.removeAttribute('name');
            sendBtn.removeAttribute('id');
        } else {
            i = $g('btn_ok').getAttribute('alt');
            var sendBtn = $ee('BUTTON', (i ? i : 'Go!'));
        }
        sendBtn.addEventListener('click', bClickButton, false);

        var decalage = $e('INPUT', [['type', 'text'], ['value', defDecalage], ['size', 4], ['maxlength', 4], ['backvalue', defDecalage]]);

        decalage.addEventListener('change', txtMsChanged, false);

        var trFooter = $ee('TR', $em('TD', ['decalage ', decalage, ' ms ', sendBtn,
            $a(' (v' + version + ') ', [['href', scriptURL], ['target', '_blank']])],
                [['colspan', 12], ['style', 'text-align:center !important;']]));

        var divArriv = $e('DIV');

        var btFooter = $ee('TFOOT', $c(divArriv, [['colspan', 12], ['style', 'text-align:center !important;']]));




// inutile car le changement de village se fait juste avant de lancer

        var bCkChangeViviAfter = $e('INPUT', [['type', 'checkbox'], ['name', 'ckchangevivi'], ['value', 'ckchangevivi']]);

        bCkChangeViviAfter.addEventListener('change', checkChangeVivi, false);

        var tdCkChangeVivi = $c(bCkChangeViviAfter, [['colspan', 8], ['style', 'text-align:center !important;']]);


        tdCkChangeVivi.appendChild($t('Changer de vivi après lancement'));

        var rowChangeVivi = $ee('TR', tdCkChangeVivi);

        var bDivForSelectVivi = $e('TD', [['colspan', 4], ['style', 'text-align:center !important;']]);

        rowChangeVivi.appendChild(bDivForSelectVivi);

//btFooter.appendChild(rowChangeVivi);

// fin de zone inutile




        btFooter.appendChild(trFooter)

        tbl.appendChild(btFooter);

        build.appendChild(tbl);

//**************
//Prépare  formArrive

        var formArrive = $e('FORM', [['id', 'formarrive'], ['name', 'formarrive']]);

        var bCkbArriveBlock = $e('INPUT', [['type', 'checkbox'], ['name', 'ckblockarrive'], ['value', 'ckblockarrive']]);

        bCkbArriveBlock.addEventListener('change', clickCheck, false)

        formArrive.appendChild(bCkbArriveBlock);

        formArrive.appendChild($t('Depart dans : '));

        var txtBoxDepart = $e('INPUT', [['type', 'text'], ['name', 'txtdepart'], ['id', 'txtdepart'], ['value', '00:00:00'], ['size', '7'], ['readonly', 'true']]);

        formArrive.appendChild(txtBoxDepart);

        formArrive.appendChild($t(' Pour Arriver a  :  '));

        var txtBoxArrive = $e('INPUT', [['type', 'text'], ['name', 'txtarrive'], ['id', 'txtarrive'], ['value', '00:00:00'], ['size', '7']]);

        txtBoxArrive.readOnly = true;

        txtBoxArrive.addEventListener('change', arriveTextChanged, false);

        formArrive.appendChild(txtBoxArrive);



//récupere la liste des village du compte

        var listViviTemp = document.getElementById('sidebarBoxVillagelist').getElementsByTagName('LI');


// prepare le select avec la liste des villages

        var selectViviForChangeAfter = $e('SELECT')

        var idViviActif = null;

        for (i = 0; i < listViviTemp.length; i++) {
            selectViviForChangeAfter.add(new Option(listViviTemp[i].getElementsByTagName('DIV')[0].innerHTML, listViviTemp[i].getElementsByTagName('A')[0].href.split('=')[1].split('&')[0]), null);
            var className = listViviTemp[i].getAttribute('class')
            if (className != '')
                if (className.indexOf('active') != -1)
                {
                    idViviActif = listViviTemp[i].getElementsByTagName('A')[0].href.split('=')[1].split('&')[0];
                }
        }




        /********** end of main code block ************/
    }

    function backupStart() {
        if (notRunYet) {
            var l4 = document.getElementById('l4');
            if (l4)
                allInOneOpera();
            else
                window.setTimeout(backupStart, 500);
        }
    }

    var notRunYet = true;
    if (/khtml/i.test(navigator.appVersion))
        allInOneOpera();
    else if (window.addEventListener)
        window.addEventListener("load", function () {
            if (notRunYet)
                allInOneOpera();
        }, false);

    window.setTimeout(backupStart, 500);

})();