// ==UserScript==
// @name        topraider
// @namespace   8b0ef7981263ec53a6d8d477a9f69680
// @include     *.ogame*gameforge.com/game/index.php*
// @include     http://*topraider.eu/*
// @include     https://websim.speedsim.net*
// @include     http://ogame1304.de/game/index.php*
// @author      Vulca
// @version     2.5.6.3
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @connect        topraider.eu
// @description Script pour ogame
// @downloadURL https://update.greasyfork.org/scripts/17012/topraider.user.js
// @updateURL https://update.greasyfork.org/scripts/17012/topraider.meta.js
// ==/UserScript==


/******************* Paramettres Globales ************************/

var VersionReel = '2.5.6-3'; // Reel
var Version = VersionReel.split('-')[0]; // MaJ
var www = "";


/******************* Fonctions Globales ************************/

function trim(string)
{
    return string.replace(/(^\s*)|(\s*$)/g, '');
}

function addPoints(nombre)
{
    var signe = '';
    if (nombre < 0)
    {
        nombre = Math.abs(nombre);
        signe = '-';
    }
    nombre = parseInt(nombre);
    var str = nombre.toString(), n = str.length;
    if (n < 4)
    {
        return signe + nombre;
    }
    else
    {
        return  signe + (((n % 3) ? str.substr(0, n % 3) + '.' : '') + str.substr(n % 3).match(new RegExp('[0-9]{3}', 'g')).join('.'));
    }
}

function GM_getValueOLD(key, defaultVal)
{
    var retValue = localStorage.getItem(key);
    if (!retValue)
    {
        return defaultVal;
    }
    return retValue;
}

function GM_setValueOLD(key, value)
{
    localStorage.setItem(key, value);
}

/*
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
var CryptoJS = CryptoJS || function (e, m)
{
    var p = {}, j = p.lib = {}, l = function ()
    {}, f = j.Base = {extend: function (a)
        {
            l.prototype = this;
            var c = new l;
            a && c.mixIn(a);
            c.hasOwnProperty("init") || (c.init = function ()
            {
                c.$super.init.apply(this, arguments)
            });
            c.init.prototype = c;
            c.$super = this;
            return c
        }, create: function ()
        {
            var a = this.extend();
            a.init.apply(a, arguments);
            return a
        }, init: function ()
        {}, mixIn: function (a)
        {
            for (var c in a)
                a.hasOwnProperty(c) && (this[c] = a[c]);
            a.hasOwnProperty("toString") && (this.toString = a.toString)
        }, clone: function ()
        {
            return this.init.prototype.extend(this)
        }}, n = j.WordArray = f.extend({init: function (a, c)
        {
            a = this.words = a || [];
            this.sigBytes = c != m ? c : 4 * a.length
        }, toString: function (a)
        {
            return(a || h).stringify(this)
        }, concat: function (a)
        {
            var c = this.words, q = a.words, d = this.sigBytes;
            a = a.sigBytes;
            this.clamp();
            if (d % 4)
                for (var b = 0; b < a; b++)
                    c[d + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((d + b) % 4);
            else if (65535 < q.length)
                for (b = 0; b < a; b += 4)
                    c[d + b >>> 2] = q[b >>> 2];
            else
               
                c.push.apply(c, q);
            this.sigBytes += a;
            return this
        }, clamp: function ()
        {
            var a = this.words, c = this.sigBytes;
            a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
            a.length = e.ceil(c / 4)
        }, clone: function ()
        {
            var a = f.clone.call(this);
            a.words = this.words.slice(0);
            return a
        }, random: function (a)
        {
            for (var c = [], b = 0; b < a; b += 4)
                c.push(4294967296 * e.random() | 0);
            return new n.init(c, a)
        }}), b = p.enc = {}, h = b.Hex = {stringify: function (a)
        {
            var c = a.words;
            a = a.sigBytes;
            for (var b = [], d = 0; d < a; d++)
            {
                var f = c[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                b.push((f >>> 4).toString(16));
                b.push((f & 15).toString(16))
            }
            return b.join("")
        }, parse: function (a)
        {
            for (var c = a.length, b = [], d = 0; d < c; d += 2)
                b[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
            return new n.init(b, c / 2)
        }}, g = b.Latin1 = {stringify: function (a)
        {
            var c = a.words;
            a = a.sigBytes;
            for (var b = [], d = 0; d < a; d++)
                b.push(String.fromCharCode(c[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
            return b.join("")
        }, parse: function (a)
        {
            for (var c = a.length, b = [], d = 0; d < c; d++)
                b[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4);
            return new n.init(b, c)
        }}, r = b.Utf8 = {stringify: function (a)
        {
            try
            {
                return decodeURIComponent(escape(g.stringify(a)))
            }
            catch (c)
            {
                throw Error("Malformed UTF-8 data");
            }
        }, parse: function (a)
        {
            return g.parse(unescape(encodeURIComponent(a)))
        }}, k = j.BufferedBlockAlgorithm = f.extend({reset: function ()
        {
            this._data = new n.init;
            this._nDataBytes = 0
        }, _append: function (a)
        {
            "string" == typeof a && (a = r.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        }, _process: function (a)
        {
            var c = this._data, b = c.words, d = c.sigBytes, f = this.blockSize, h = d / (4 * f), h = a ? e.ceil(h) : e.max((h | 0) - this._minBufferSize, 0);
            a = h * f;
            d = e.min(4 * a, d);
            if (a)
            {
                for (var g = 0; g < a; g += f)
                    this._doProcessBlock(b, g);
                g = b.splice(0, a);
                c.sigBytes -= d
            }
            return new n.init(g, d)
        }, clone: function ()
        {
            var a = f.clone.call(this);
            a._data = this._data.clone();
            return a
        }, _minBufferSize: 0});
    j.Hasher = k.extend({cfg: f.extend(), init: function (a)
        {
            this.cfg = this.cfg.extend(a);
            this.reset()
        }, reset: function ()
        {
            k.reset.call(this);
            this._doReset()
        }, update: function (a)
        {
            this._append(a);
            this._process();
            return this
        }, finalize: function (a)
        {
            a && this._append(a);
            return this._doFinalize()
        }, blockSize: 16, _createHelper: function (a)
        {
            return function (c, b)
            {
                return(new a.init(b)).finalize(c)
            }
        }, _createHmacHelper: function (a)
        {
            return function (b, f)
            {
                return(new s.HMAC.init(a, f)).finalize(b)
            }
        }});
    var s = p.algo = {};
    return p
}(Math);
(function ()
{
    var e = CryptoJS, m = e.lib, p = m.WordArray, j = m.Hasher, l = [], m = e.algo.SHA1 = j.extend({_doReset: function ()
        {
            this._hash = new p.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        }, _doProcessBlock: function (f, n)
        {
            for (var b = this._hash.words, h = b[0], g = b[1], e = b[2], k = b[3], j = b[4], a = 0; 80 > a; a++)
            {
                if (16 > a)
                    l[a] = f[n + a] | 0;
                else
                {
                    var c = l[a - 3] ^ l[a - 8] ^ l[a - 14] ^ l[a - 16];
                    l[a] = c << 1 | c >>> 31
                }
                c = (h << 5 | h >>> 27) + j + l[a];
                c = 20 > a ? c + ((g & e | ~g & k) + 1518500249) : 40 > a ? c + ((g ^ e ^ k) + 1859775393) : 60 > a ? c + ((g & e | g & k | e & k) - 1894007588) : c + ((g ^ e ^ k) - 899497514);
                j = k;
                k = e;
                e = g << 30 | g >>> 2;
                g = h;
                h = c
            }
            b[0] = b[0] + h | 0;
            b[1] = b[1] + g | 0;
            b[2] = b[2] + e | 0;
            b[3] = b[3] + k | 0;
            b[4] = b[4] + j | 0
        }, _doFinalize: function ()
        {
            var f = this._data, e = f.words, b = 8 * this._nDataBytes, h = 8 * f.sigBytes;
            e[h >>> 5] |= 128 << 24 - h % 32;
            e[(h + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
            e[(h + 64 >>> 9 << 4) + 15] = b;
            f.sigBytes = 4 * e.length;
            this._process();
            return this._hash
        }, clone: function ()
        {
            var e = j.clone.call(this);
            e._hash = this._hash.clone();
            return e
        }});
    e.SHA1 = j._createHelper(m);
    e.HmacSHA1 = j._createHmacHelper(m)
})();

/* **************************************************************/
/* ****************** FONCTIONS RC V6****************************/
/* **************************************************************/

function parseInt0(n)
{
    if (n == '')
        n = 0;
    return parseInt(n);
}

function SeekDepart(coord)
{
    var min = 10000000000000000;
    var g, ss, gRc, ssRc, Coord_Depart, Coordi, distG, distSS;

    gRc = parseInt(coord.split(':')[0].replace(/[^0-9]/g, ''))
    ssRc = parseInt(coord.split(':')[1].replace(/[^0-9]/g, ''))

    var listCoord = document.getElementsByClassName('planet-koords');
    for (var i = 0; i < listCoord.length; i++)
    {
        Coordi = listCoord[i].textContent.replace(/[^0-9:]/g, '');
        g = parseInt(Coordi.split(':')[0])
        ss = parseInt(Coordi.split(':')[1])

        distG = Math.abs(g - gRc);
        distG = Math.min(distG, 9 - distG)

        distSS = Math.abs(ssRc - ss);
        distSS = Math.min(distSS, 499 - distSS)

        if (distG * 190 + distSS < min)
        {
            Coord_Depart = Coordi;
            min = distG * 190 + distSS;
        }
    }



    return Coord_Depart;

}

function sendAllRcUnParUn(i)
{
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
    var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var serveur = document.getElementsByName('ogame-universe')[0].content;
    var pseudo = document.getElementsByName('ogame-player-name')[0].content;
    var spedtech = GM_getValue('techno' + serveur.split('.')[0] + idPlayer, '0|0|0|').split('|');


    var savedLoots = GM_getValue('loots' + idPlayer + serveur, '');
    var savedRecyle = GM_getValue('recycle' + idPlayer + serveur, '');
    var savedMIP = GM_getValue('mip' + idPlayer + serveur, '');
    var bc = 0;
    if (document.getElementById('helper').getElementsByTagName('img')[0])
        if (/[es]{2}[pohi]+[ameg]{4}\.[mco]{3}.+[ahr]{3}i2.[pgj]{3}/.test(document.getElementById('helper').getElementsByTagName('img')[0].src))
            bc = 10;

    if (email == '')
    {
        email = prompt(txtMail);
        if (email + '' != 'null')
            GM_setValue('topraideremail' + idPlayer, email);
        else
            email = '';
    }
    if (MDP == '' && email != '')
    {
        MDP = prompt(txtMDP);
        if (MDP + '' != 'null')
            GM_setValue('topraiderMDP' + idPlayer, MDP);
        else
            MDP = '';
    }

    if (MDP != '' && email != '')
    {

        var msg = document.getElementsByClassName("msg");
        var EnvoiEnCours = false;

        if (document.getElementsByClassName("msg")[i].getElementsByClassName("combatLeftSide")[0] || document.getElementsByClassName("msg")[i].getElementsByClassName("missilesAttacked")[0])
        {

            if (document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0])
            {
                //*********************************************************************************************//
                //***********************************SEND ALL RC / MIP ****************************************//
                //*********************************************************************************************//

                if (/((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.test(document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey")))
                {
                    var CR_KEY = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey"))[0];

                    var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                    var crkeyReg = new RegExp(CR_KEY.split('-')[3], "g");



                    if (!crkeyReg.test(listeRC))
                    {
                        var TR = document.getElementsByClassName("msg")[i].getElementsByClassName('topraider')[0];

                        var dateFormat = TR.getAttribute("dateFormat");
                        var Coords = TR.getAttribute("Coords");

                        var met = parseInt(TR.getAttribute("loots_met"));
                        var cri = parseInt(TR.getAttribute("loots_cri"));
                        var deut = parseInt(TR.getAttribute("loots_deut"));
                        var useAPI = TR.getAttribute("useAPI");
                        var Coords_Depart = TR.getAttribute("Coords_Depart");

                        EnvoiEnCours = true;

                        var newI = i;
                        var isActiv = 1;
                        var ID_RC_og = CR_KEY.split('-')[3];

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://' + www + 'topraider.eu/' + (useAPI == '0' ? 'readexpe' : 'addrcv6') + '.php',
                            data: '&Name=' + pseudo +
                                    '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                    '&CR_KEY=' + CR_KEY +
                                    '&isActiv=' + isActiv +
                                    '&combu=' + spedtech[0] +
                                    '&impu=' + spedtech[1] +
                                    '&prop=' + spedtech[2] +
                                    '&loots_met=' + met +
                                    '&loots_cri=' + cri +
                                    '&loots_deut=' + deut +
                                    '&useAPI=' + useAPI +
                                    '&Date_rc=' + dateFormat +
                                    '&Coords=' + Coords +
                                    '&Coords_Depart=' + Coords_Depart +
                                    '&bc=' + bc +
                                    '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                    '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                    '&Country=' + serveur.split('.')[0].split('-')[1] +
                                    '&Email=' + email +
                                    '&ID_RC_og=' + ID_RC_og +
                                    '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                    '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                    '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                    '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                    '&VersionScript=' + VersionReel +
                                    '&repNumRC=' + i +
                                    '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                    '&ID_player_og=' + idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function (xmlhttp)
                            {
                                var I = parseInt(xmlhttp.responseText.split('|')[0]);


                                if (/((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.test(document.getElementsByClassName("msg")[I].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey")))
                                {
                                    CR_KEY = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName("msg")[I].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey"))[0];

                                    if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 17)
                                    { // TOUT BON
                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2];
                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].title = txtConvertir;
                                        document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;

                                        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                        listeRC[parseInt(listeRC[0]) + 1] = CR_KEY.split('-')[3];
                                        listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                        GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                        var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                        nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);


                                        document.getElementById('nbenvoiTR').textContent = nbrcenv;

                                        addProfits(xmlhttp.responseText.split('|')[2]);
                                    }
                                    else
                                    {
                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].title = xmlhttp.responseText.split('|')[1];
                                        document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                        document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                    }



                                }
                                else
                                {
                                    document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].innerHTML += ' no API KEY. Try to reload or open the CR [err02]';
                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                }

                                if (I < document.getElementsByClassName("msg").length - 1)
                                    sendAllRcUnParUn(I + 1);
                                else
                                {
                                    var nbrcenv = parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, ''));

                                    if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                    {
                                        document.getElementById('envoiColor').style.color = '#00ff00';
                                    }
                                    else
                                    {
                                        document.getElementById('envoiColor').style.color = '#ffff00';
                                    }
                                }
                            }



                        });


                    }
                }
                else
                {
                    document.getElementsByClassName("msg")[i].getElementsByClassName("aTR")[0].innerHTML += ' no API KEY. Try to reload or open the CR [err01]';
                    document.getElementsByClassName("msg")[i].getElementsByClassName('imgTR')[0].src = imgJaune;
                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                }

            }
            else if (msg[i].getElementsByClassName("combatLeftSide")[0])
            {
                //*********************************************************************************************//
                //********************************* SEND ALL RC EXPEDITION ************************************//
                //*********************************************************************************************//

                var CR_KEY = msg[i].getAttribute('data-msg-id');
                var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                var crkeyReg = new RegExp(CR_KEY, "");

                if (!crkeyReg.test(listeRC))
                {
                    EnvoiEnCours = true;

                    var pertes = msg[i].getElementsByClassName("combatRightSide")[0].getElementsByTagName('span')[0].getAttribute('losses');
                    var degats = msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByTagName('span')[0].getAttribute('damages');

                    var DDD = document.getElementsByClassName("msg")[i].getElementsByClassName('msg_date')[0].textContent;
                    var datess = trim(DDD).split(' ');
                    var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                    var Coords = document.getElementsByClassName("msg")[i].getElementsByClassName('msg_title')[0].getElementsByTagName('a')[0].textContent.replace(/\[|\]/g, '');

                    document.getElementsByClassName("msg")[i].getElementsByClassName('topraider')[0].className = 'topraider -1'; // Pas deux fois

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'http://' + www + 'topraider.eu/readexpe.php',
                        data: '&Name=' + pseudo +
                                '&CR_KEY=' + CR_KEY +
                                '&expedition=2' +
                                '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                '&Country=' + serveur.split('.')[0].split('-')[1] +
                                '&Email=' + email +
                                '&Date_rc=' + dateFormat +
                                '&Coords=' + Coords +
                                '&ID_RC_og=' + CR_KEY +
                                '&Damages=' + degats +
                                '&Loss=' + pertes +
                                '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                '&VersionScript=' + VersionReel +
                                '&repNumRC=' + i +
                                '&ID_player_og=' + idPlayer,
                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        onload: function (xmlhttp)
                        {
                            //    alert( xmlhttp.responseText);
                            var I = parseInt(xmlhttp.responseText.split('|')[0]);

                            if (document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0])
                            {

                                CR_KEY = document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0].getAttribute("apikey");
                                //       alert(xmlhttp.responseText)
                                if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                {

                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;
                                    document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?page=benef';

                                    var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                    listeRC[parseInt(listeRC[0]) + 1] = CR_KEY;
                                    listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                    GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                    var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                    nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);

                                    document.getElementById('nbenvoiTR').textContent = nbrcenv;

                                    addProfits(xmlhttp.responseText.split('|')[2]);

                                }
                                else
                                {
                                    document.getElementsByClassName("msg")[I].getElementsByClassName("topraider")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                    document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0].title = xmlhttp.responseText.split('|')[1];
                                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                }

                            }

                            if (I < document.getElementsByClassName("msg").length - 1)
                                sendAllRcUnParUn(I + 1);
                            else
                            {
                                var nbrcenv = parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, ''));

                                if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                {
                                    document.getElementById('envoiColor').style.color = '#00ff00';
                                }
                                else
                                {
                                    document.getElementById('envoiColor').style.color = '#ffff00';
                                }
                            }
                        }
                    });

                }
            }

        }
        else if (msg[i].getElementsByClassName('msg_title')[0])
        {

            if (regExpedition.test(msg[i].getElementsByClassName('msg_title')[0].textContent))
            {
                //*********************************************************************************************//
                //********************************* SEND ALL EXPEDITIONS **************************************//
                //*********************************************************************************************//

                var CR_KEY = msg[i].getAttribute('data-msg-id');

                var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                var crkeyReg = new RegExp(CR_KEY, "g");

                if (!crkeyReg.test(listeRC))
                {
                    EnvoiEnCours = true;

                    var DDD = msg[i].getElementsByClassName('msg_date')[0].textContent;
                    var datess = trim(DDD).split(' ');
                    var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                    var Coords = msg[i].getElementsByClassName('msg_title')[0].getElementsByTagName('a')[0].textContent.replace(/\[|\]/g, '');

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'http://' + www + 'topraider.eu/readexpe.php',
                        data: '&Name=' + pseudo +
                                '&CR_KEY=' + CR_KEY +
                                '&expedition=1' +
                                '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                '&Country=' + serveur.split('.')[0].split('-')[1] +
                                '&Email=' + email +
                                '&Date_rc=' + dateFormat +
                                '&Coords=' + Coords +
                                '&ID_RC_og=' + CR_KEY +
                                '&Content=' + msg[i].getElementsByClassName('msg_content')[0].textContent +
                                '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                '&VersionScript=' + VersionReel +
                                '&repNumRC=' + i +
                                '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                '&ID_player_og=' + idPlayer,
                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        onload: function (xmlhttp)
                        {
                            // alert(xmlhttp.responseText)
                            var I = parseInt(xmlhttp.responseText.split('|')[0]);

                            if (document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0])
                            {

                                CR_KEY = document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0].getAttribute("apikey");
                                //       alert(xmlhttp.responseText)
                                if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                {

                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;
                                    document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?page=benef';

                                    var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                    listeRC[parseInt(listeRC[0]) + 1] = CR_KEY;
                                    listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                    GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                    var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                    nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);

                                    document.getElementById('nbenvoiTR').textContent = nbrcenv;

                                    addProfits(xmlhttp.responseText.split('|')[2]);

                                }
                                else
                                {
                                    document.getElementsByClassName("msg")[I].getElementsByClassName("topraiderexp")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                    document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0].title = xmlhttp.responseText.split('|')[1];
                                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                }


                            }


                            if (I < document.getElementsByClassName("msg").length - 1)
                                sendAllRcUnParUn(I + 1);
                            else
                            {
                                var nbrcenv = parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, ''));

                                if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                {
                                    document.getElementById('envoiColor').style.color = '#00ff00';
                                }
                                else
                                {
                                    document.getElementById('envoiColor').style.color = '#ffff00';
                                }
                            }
                        }
                    });
                }
            }
        }
        //   alert(i);

        if (!EnvoiEnCours && i < document.getElementsByClassName("msg").length - 1)
            sendAllRcUnParUn(i + 1);
        else if (i >= document.getElementsByClassName("msg").length - 1)
        {
            var nbrcenv = parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, ''));

            if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
            {
                document.getElementById('envoiColor').style.color = '#00ff00';
            }
            else
            {
                document.getElementById('envoiColor').style.color = '#ffff00';
            }

            sendAllRCOK = true;
        }
    }
}

function sendAllSpyUnParUn(i)
{
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
    var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var serveur = document.getElementsByName('ogame-universe')[0].content;
    var pseudo = document.getElementsByName('ogame-player-name')[0].content;

    var msg = document.getElementsByClassName("TRreSpy");
    var EnvoiEnCours = false;

    if (!msg[i].getElementsByClassName('resspan')[0] && msg[i].getElementsByClassName('msg_actions clearfix')[0])
    {
        /* ***********************************************************************/
        /*************************** Send All Spy ************************************/
        /*************************************************************************/

        var api = msg[i].getAttribute('data-msg-id');
        var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        var crkeyReg = new RegExp(api, "g");

        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div

        newElement3.innerHTML = '';

        if (!crkeyReg.test(listeRC))
        {
            EnvoiEnCours = true;
            var newI = i;

            var CR_KEY = msg[i].getElementsByClassName('topraiderspy')[0].getAttribute("apikey");
            var dateFormat = msg[i].getElementsByClassName('topraiderspy')[0].getAttribute("dateFormat");
            var Coord = msg[i].getElementsByClassName('topraiderspy')[0].getAttribute("Coord");
            var Coord_att = msg[i].getElementsByClassName('topraiderspy')[0].getAttribute("Coord_att");

            var isActiv = 1;

            var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
            var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));

            msg[i].getElementsByClassName('topraiderspy')[0].className = 'topraiderspy -1'; // Pas deux fois

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://' + www + 'topraider.eu/readexpe.php',
                data: '&Name=' + pseudo +
                        '&CR_KEY=' + CR_KEY +
                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                        '&Email=' + email +
                        '&Spy=1' +
                        '&Date_rc=' + dateFormat +
                        '&Coords=' + Coord +
                        '&Coords_att=' + Coord_att +
                        '&ID_RC_og=' + CR_KEY +
                        '&Content=' + msg[i].getElementsByClassName('msg_content')[0].textContent +
                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                        '&VersionScript=' + VersionReel +
                        '&repNumRC=' + i +
                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                        '&ID_player_og=' + idPlayer,
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                onload: function (xmlhttp)
                {
                    var I = parseInt(xmlhttp.responseText.split('|')[0]);

                    if (document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0])
                    {
                        CR_KEY = document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].getAttribute("apikey");
                        //       alert(xmlhttp.responseText)
                        if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                        {

                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgVert;
                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'spy.topraider.eu';

                            var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                            listeRC[parseInt(listeRC[0]) + 1] = CR_KEY + '-1';
                            listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                            GM_setValue('listeSpy' + serveur + idPlayer, listeRC.join('|'));
                        }
                        else
                        {
                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("topraiderspy")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].title = xmlhttp.responseText.split('|')[1];
                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                        }
                    }
                    else
                    {
                        document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("topraiderspy")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                        document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                        document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].title = xmlhttp.responseText.split('|')[1];
                        document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                    }

                    if (I < document.getElementsByClassName("msg").length - 1)
                        sendAllSpyUnParUn(I + 1);
                    else
                        document.getElementById('envoiColor').style.color = '#00ff00';


                }
            });

        }

    }
    //   alert(i);

    if (!EnvoiEnCours && i < document.getElementsByClassName("TRreSpy").length - 1)
        sendAllSpyUnParUn(i + 1);
    else if (i >= document.getElementsByClassName("TRreSpy").length - 1)
    {
        var nbrcenv = parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, ''));

        if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
        {
            document.getElementById('envoiColor').style.color = '#00ff00';
        }
        else
        {
            document.getElementById('envoiColor').style.color = '#ffff00';
        }

        sendAllRCOK = true;
    }

}

function sendAllRC()
{
    if (sendAllRCOK && (document.getElementsByClassName("combatLeftSide")[0] || document.getElementsByClassName("missilesAttacked")[0] || /ui-tabs-active/.test(document.getElementById('subtabs-nfFleet22').className))) // "Section RC"
    {
        sendAllRCOK = false;
        document.getElementById('envoiColor').style.color = '#ff9900';
        sendAllRcUnParUn(0);
    }
    else if (/ui-tabs-active/.test(document.getElementById('subtabs-nfFleet20').className))
    {
        sendAllRCOK = false;
        document.getElementById('envoiColor').style.color = '#ff9900';
        sendAllSpyUnParUn(0);
    }
}



function sendRC()
{

    if (document.getElementsByClassName('combat_round_list')[0] && !document.getElementById('topraider'))
    {

        //*********************************************************************************************//
        //*********************************** SEND RC DETAILLé ****************************************//
        //*********************************************************************************************//

        var serveur = document.getElementsByName('ogame-universe')[0].content;
        var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
        var pseudo = document.getElementsByName('ogame-player-name')[0].content;

        var savedLoots = GM_getValue('loots' + idPlayer + serveur, '');
        var savedRecyle = GM_getValue('recycle' + idPlayer + serveur, '');
        var savedMIP = GM_getValue('mip' + idPlayer + serveur, '');

        var isActiv = 1;

        var KeyList = document.getElementsByTagName('html')[0].innerHTML.match(/cr-[a-z]{2}-[0-9]{1,3}-([0-9a-zA-Z])+/g);
        var CR_KEY = KeyList[KeyList.length - 1];

        var ID_RC_og = CR_KEY.split('-')[3];

        var spedtech = GM_getValue('techno' + serveur.split('.')[0] + idPlayer, '1|1|1|').split('|');

        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        var crkeyReg = new RegExp(CR_KEY.split('-')[3], "g");

        if (crkeyReg.test(listeRC))
        {
            var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<a title="topraider" href="http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2] + '" target="topraider" id="aTR"><img id="imgTR" src="' + imgConv + '" /></a>';
            newElement3.id = 'topraider';
            document.getElementsByClassName('detail_msg')[0].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);

        }
        else
        {

            var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<a title="topraider" href="http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2] + '" target="topraider" id="aTR"><img id="imgTR" src="' + imgRouge + '" /></a>';
            newElement3.id = 'topraider';
            document.getElementsByClassName('detail_msg')[0].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);
        }



        var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
        var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));



        if (email == '')
        {
            email = prompt(txtMail);
            if (email + '' != 'null')
                GM_setValue('topraideremail' + idPlayer, email);
            else
                email = '';
        }
        if (MDP == '' && email != '')
        {
            MDP = prompt(txtMDP);
            if (MDP + '' != 'null')
                GM_setValue('topraiderMDP' + idPlayer, MDP);
            else
                MDP = '';
        }

        if (email != '' && MDP != '')
        {

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://' + www + 'topraider.eu/addrcv6.php',
                data: '&Name=' + pseudo +
                        '&CR_KEY=' + CR_KEY +
                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                        '&isActiv=' + isActiv +
                        '&combu=' + spedtech[0] +
                        '&impu=' + spedtech[1] +
                        '&prop=' + spedtech[2] +
                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                        '&Email=' + email +
                        '&ID_RC_og=' + ID_RC_og +
                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                        '&VersionScript=' + VersionReel +
                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                        '&ID_player_og=' + idPlayer,
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                onload: function (xmlhttp)
                {
                    var idmsg = /data-msg-id="([0-9]+)"/.exec(document.getElementsByClassName('overlayDiv ui-dialog-content ui-widget-content')[0].innerHTML)[1]

                    if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                    {
                        document.getElementById('imgTR').src = imgConv;

                        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                        listeRC[parseInt(listeRC[0]) + 1] = CR_KEY.split('-')[3];
                        listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                        GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                        var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                        nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);
                        document.getElementById('nbenvoiTR').textContent = nbrcenv;
                        if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                            document.getElementById('envoiColor').style.color = '#00ff00';

                        addProfits(xmlhttp.responseText.split('|')[2]);

                        for (var jj = 0; jj < document.getElementsByClassName('msg').length; jj++)
                        {
                            if (idmsg == document.getElementsByClassName('msg')[jj].getAttributeNode("data-msg-id").value)
                            {

                                document.getElementsByClassName("msg")[jj].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2];

                                document.getElementsByClassName("msg")[jj].getElementsByClassName('imgTR')[0].src = imgConv;
                                document.getElementsByClassName("msg")[jj].getElementsByClassName('aTR')[0].title = txtConvertir;

                            }
                        }
                    }
                    else
                    {
                        document.getElementById('imgTR').src = imgJaune;
                        document.getElementById('imgTR').parentNode.innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                        document.getElementById('imgTR').parentNode.title = xmlhttp.responseText.split('|')[1];
                        document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';

                        for (var jj = 0; jj < document.getElementsByClassName('msg').length; jj++)
                        {
                            if (idmsg == document.getElementsByClassName('msg')[jj].getAttributeNode("data-msg-id").value)
                            {

                                document.getElementsByClassName("msg")[jj].getElementsByClassName("aTR")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                document.getElementsByClassName("msg")[jj].getElementsByClassName('imgTR')[0].src = imgJaune;
                                document.getElementsByClassName("msg")[jj].getElementsByClassName('aTR')[0].title = xmlhttp.responseText.split('|')[1];


                            }
                        }
                    }
                }
            });
        }
        else
        {
            document.getElementById('imgTR').src = imgJaune;
            document.getElementById('imgTR').parentNode.innerHTML += ' no mail or no password [err04]';
            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
        }


    }
    else if (document.getElementsByClassName('resource_list_el tooltipCustom')[0] && !document.getElementById('speedsimOK') && document.getElementsByClassName('detail_msg')[0].getElementsByClassName('icon_apikey')[0])
    {
        //*********************************************************************************************//
        //********************************** SPEEDSIM RE DETAILLé *************************************//
        //*********************************************************************************************//

        var tech = GM_getValue('techno' + document.getElementsByName('ogame-universe')[0].content.split('.')[0] + document.getElementsByName('ogame-player-id')[0].content, "0|0|0").split('|');
        var api = /(sr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName('detail_msg')[0].getElementsByClassName('icon_apikey')[0].title)[1]

        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
        newElement3.innerHTML = '<a id="speedsimOK" title="SpeedSim" target="_blank" href="http://' + www + 'topraider.eu/index.php?SR_KEY=' + api + '&combu=' + tech[0] + '&impu=' + tech[1] + '&prop=' + tech[2] + '&arme=' + tech[3] + '&bouclier=' + tech[4] + '&protect=' + tech[5] + '&speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content + '"><img src="' + imgSpeedSim + '" />';
        document.getElementsByClassName('detail_msg')[0].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);

    }
    else if ((/ui-tabs-active/.test(document.getElementById('subtabs-nfFleet21').className) || document.getElementById('tabs-nfFavorites').getAttribute("aria-selected") == 'true') && (document.getElementsByClassName("combatLeftSide")[0] || document.getElementsByClassName("missilesAttacked")[0]))
    {


        if (!document.getElementsByClassName("topraider")[0]) // "1er aff"
        {
            var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
            var serveur = document.getElementsByName('ogame-universe')[0].content;
            var pseudo = document.getElementsByName('ogame-player-name')[0].content;
            var spedtech = GM_getValue('techno' + serveur.split('.')[0] + idPlayer, '0|0|0|').split('|');

            var savedLoots = GM_getValue('loots' + idPlayer + serveur, '');
            var savedRecyle = GM_getValue('recycle' + idPlayer + serveur, '');
            var savedMIP = GM_getValue('mip' + idPlayer + serveur, '');

            nbRcAEnvoyer = 0;
            nbRcExpeAEnvoyer = 0;

            var msg = document.getElementsByClassName("msg");

            for (var i = 0; i < msg.length; i++)
            {

                if ((msg[i].getElementsByClassName("combatLeftSide")[0] || document.getElementsByClassName("msg")[i].getElementsByClassName("missilesAttacked")[0]) && !document.getElementsByClassName("msg")[i].getElementsByClassName("topraider")[0])
                {
                    if (msg[i].getElementsByClassName('icon_nf icon_apikey')[0]) // PAS EXPé
                    {
                        //*********************************************************************************************//
                        //**************************** SEND RC / MIP topraider ****************************************//
                        //*********************************************************************************************//

                        if (/((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].title))
                        {
                            var CR_KEY = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(msg[i].getElementsByClassName('icon_nf icon_apikey')[0].title)[0];
                            msg[i].getElementsByClassName('icon_nf icon_apikey')[0].setAttribute("apikey", CR_KEY);

                            var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                            var crkeyReg = new RegExp(CR_KEY.split('-')[3], "g");



                            if (crkeyReg.test(listeRC))
                            {

                                var newElement = document.createElement("a"); // On crée un nouvelle élément a
                                newElement.innerHTML = '<span name="' + i + '" class="topraider"><a title="' + txtConvertir + '" href="http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2] + '" target="topraider" class="aTR"><img name="' + i + '" class="imgTR" src="' + imgConv + '" /></a></span>';


                                msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);

                            }
                            else
                            {
                                var dateFormat, Coords, pertes, degats, Coords_Depart;
                                var loots = [0, 0, 0, 0];
                                var useAPIOK = false;

                                if (msg[i].getElementsByClassName("combatLeftSide")[0])
                                {
                                    var DDD = document.getElementsByClassName("msg")[i].getElementsByClassName('msg_date')[0].textContent;
                                    var datess = trim(DDD).split(' ');
                                    var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                                    var Coords = document.getElementsByClassName("msg")[i].getElementsByClassName('msg_title')[0].getElementsByTagName('a')[0].textContent.replace(/\[|\]/g, '');

                                    var loots = msg[i].getElementsByClassName('combatLeftSide')[0].getElementsByClassName('msg_ctn msg_ctn3 tooltipLeft')[0].title.split(':');
                                    var pertes = parseInt(msg[i].getElementsByClassName("combatRightSide")[0].getElementsByTagName('span')[0].title);
                                    var degats = parseInt(msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByTagName('span')[0].title);

                                    if (loots[3])
                                    {
                                        loots[1] = parseInt(loots[1].replace(/[^0-9]/g, ''));
                                        loots[2] = parseInt(loots[2].replace(/[^0-9]/g, ''));
                                        loots[3] = parseInt(loots[3].replace(/[^0-9]/g, ''));

                                        if (msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByClassName("msg_ctn msg_ctn2 undermark tooltipLeft")[0])
                                        {
                                            var nom = msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByClassName("msg_ctn msg_ctn2 undermark tooltipLeft")[0].textContent;

                                            if (/\(([^\)]+)\)/.test(nom))
                                            {
                                                var attaquant = /\(([^\)]+)\)/.exec(nom)[1];



                                                if (attaquant == pseudo)
                                                {

                                                    useAPIOK = true;
                                                    Coords_Depart = SeekDepart(Coords);
                                                }
                                            }
                                        }


                                    }

                                }

                                var useAPI = (useAPIOK && pertes == 0 && degats == 0 && loots[1] + loots[2] + loots[3] < 5000000 ? 0 : 1);


                                var newElement = document.createElement("a"); // On crée un nouvel élément a
                                newElement.innerHTML = '<span class="topraider ' + i + '" Coords_Depart="' + Coords_Depart + '" dateFormat="' + dateFormat + '" Coords="' + Coords + '" useAPI="' + useAPI + '" loots_met="' + loots[1] + '" loots_cri="' + loots[2] + '" loots_deut="' + loots[3] + '" apikey="' + CR_KEY + '"><a id="aTR' + i + '" title="' + txtEnvoyer + CR_KEY + '" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgRouge + '" /></a></span>';

                                msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);

                                nbRcAEnvoyer++;
                                document.getElementById('nbAenvoiTR').innerHTML = nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer;
                                document.getElementById('envoiColor').style.color = '#ff0000';

                                msg[i].getElementsByClassName("topraider")[0].addEventListener("click", function (event)
                                {

                                    var newI = this.className.split(' ')[1];

                                    if (newI > -1)
                                    {
                                        if (/((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.test(this.getAttribute("apikey")))
                                        {
                                            CR_KEY = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(this.getAttribute("apikey"))[0];
                                            var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                                            var crkeyReg = new RegExp(CR_KEY.split('-')[3], "g");

                                            if (!crkeyReg.test(listeRC))
                                            {
                                                var isActiv = 1;
                                                var ID_RC_og = CR_KEY.split('-')[3];

                                                var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
                                                var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));



                                                if (email == '')
                                                {
                                                    email = prompt(txtMail);
                                                    if (email + '' != 'null')
                                                        GM_setValue('topraideremail' + idPlayer, email);
                                                    else
                                                        email = '';
                                                }
                                                if (MDP == '' && email != '')
                                                {
                                                    MDP = prompt(txtMDP);
                                                    if (MDP + '' != 'null')
                                                        GM_setValue('topraiderMDP' + idPlayer, MDP);
                                                    else
                                                        MDP = '';
                                                }
                                                if (email != '' && MDP != '')
                                                {

                                                    document.getElementsByClassName("msg")[newI].getElementsByClassName('topraider')[0].className = 'topraider -1'; // Pas deux fois


                                                    var useAPI = this.getAttribute("useAPI");
                                                    var Coords = this.getAttribute("Coords");
                                                    var dateFormat = this.getAttribute("dateFormat");

                                                    var Coords_Depart = this.getAttribute("Coords_Depart");



                                                    GM_xmlhttpRequest({
                                                        method: 'POST',
                                                        url: 'http://' + www + 'topraider.eu/' + (useAPI == '0' ? 'readexpe' : 'addrcv6') + '.php',
                                                        data: '&Name=' + pseudo +
                                                                '&CR_KEY=' + CR_KEY +
                                                                '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                                                '&isActiv=' + isActiv +
                                                                '&combu=' + spedtech[0] +
                                                                '&impu=' + spedtech[1] +
                                                                '&prop=' + spedtech[2] +
                                                                '&loots_met=' + this.getAttribute("loots_met") +
                                                                '&loots_cri=' + this.getAttribute("loots_cri") +
                                                                '&loots_deut=' + this.getAttribute("loots_deut") +
                                                                '&useAPI=' + useAPI +
                                                                '&Date_rc=' + dateFormat +
                                                                '&Coords=' + Coords +
                                                                '&Coords_Depart=' + Coords_Depart +
                                                                '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                                                '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                                                '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                                                '&Country=' + serveur.split('.')[0].split('-')[1] +
                                                                '&Email=' + email +
                                                                '&ID_RC_og=' + ID_RC_og +
                                                                '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                                                '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                                                '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                                                '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                                                '&VersionScript=' + VersionReel +
                                                                '&repNumRC=' + newI +
                                                                '&ID_player_og=' + idPlayer,
                                                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                                        onload: function (xmlhttp)
                                                        {
                                                            var I = parseInt(xmlhttp.responseText.split('|')[0]);
                                                            if (document.getElementsByClassName("msg")[I].getElementsByClassName('icon_nf icon_apikey')[0])
                                                            {
                                                                if (/((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.test(document.getElementsByClassName("msg")[I].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey")))
                                                                {
                                                                    CR_KEY = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName("msg")[I].getElementsByClassName('icon_nf icon_apikey')[0].getAttribute("apikey"))[0];

                                                                    if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                                                    {
                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?CR_KEY=' + CR_KEY + '&CR_KEY2=' + savedLoots + '&CR_KEY3=' + savedRecyle + '&MIP=' + savedMIP + '&idPlayer=' + idPlayer + '&combu=' + spedtech[0] + '&impu=' + spedtech[1] + '&prop=' + spedtech[2];

                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;
                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName('aTR')[0].title = txtConvertir;


                                                                        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                                                        listeRC[parseInt(listeRC[0]) + 1] = CR_KEY.split('-')[3];
                                                                        listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                                                        GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                                                        var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                                                        nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);
                                                                        document.getElementById('nbenvoiTR').textContent = nbrcenv;
                                                                        if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                                                            document.getElementById('envoiColor').style.color = '#00ff00';

                                                                        addProfits(xmlhttp.responseText.split('|')[2]);

                                                                    }
                                                                    else
                                                                    {
                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                                        document.getElementsByClassName("msg")[I].getElementsByClassName('aTR')[0].title = xmlhttp.responseText.split('|')[1];
                                                                        document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                                    }

                                                                }
                                                                else
                                                                {
                                                                    document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                                    document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].innerHTML += '  no API KEY. Try to reload or open the CR [err08]';
                                                                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                                }
                                                            }
                                                            else
                                                            {
                                                                document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                                document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].innerHTML += '  no API KEY. Try to reload or open the CR [err07]';
                                                                document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                            }


                                                        }
                                                    });


                                                }
                                                else
                                                {
                                                    document.getElementsByClassName("msg")[newI].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                    document.getElementsByClassName("msg")[newI].getElementsByClassName("aTR")[0].innerHTML += ' no mail or no password [err05]';
                                                    document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                }
                                            }
                                        }
                                        else
                                        {

                                            this.getElementsByClassName('imgTR')[0].src = imgJaune;
                                            this.getElementsByClassName("aTR")[0].innerHTML += ' no API KEY. Try to reload or open the CR [err06]';
                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                        }
                                    }


                                }, true);

                            }
                            //*********************************************************************************************//
                            //******************************* SEND LOOTS CONVERTER ****************************************//
                            //*********************************************************************************************//
                            if ((new RegExp(CR_KEY, "g")).test(savedLoots))
                            {
                                document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].style.backgroundColor = "rgba(0,0,255,1)";
                                //alert((new RegExp(CR_KEY, "g")).test(savedLoots) +'\n\nbleu\n'+savedLoots+'\n\n'+CR_KEY.split('-')[3]);
                            }
                            else if (document.getElementsByClassName("msg")[i].getElementsByClassName("combatLeftSide")[0])
                            {

                                document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].addEventListener("click", function (event)
                                {
                                    var lootsAPI = /((cr|mr)-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(this.getAttribute("apikey"))[0];
                                    this.style.backgroundColor = "rgba(0,0,255,1)";


                                    var savedLoots = lootsAPI + ';' + GM_getValue('loots' + idPlayer + serveur, '');
                                    GM_setValue('loots' + idPlayer + serveur, savedLoots);

                                    var aTR = document.getElementsByClassName('aTR');
                                    for (var jjj = 0; jjj < aTR.length; jjj++)
                                    {   //  alert (/CR_KEY2\=.*&CR_KEY3/.test(aTR[jjj].href) + '\n\n'+aTR[jjj].href)
                                        aTR[jjj].href = aTR[jjj].href.replace(/CR_KEY2=.*&CR_KEY3/g, 'CR_KEY2=' + savedLoots + '&CR_KEY3');


                                    }


                                }, true);
                            }

                            else // MIP
                            {
                                //*********************************************************************************************//
                                //************************************* SEND MIP **********************************************//
                                //*********************************************************************************************//               

                                document.getElementsByClassName("msg")[i].getElementsByClassName('icon_nf icon_apikey')[0].addEventListener("click", function (event)
                                {
                                    var savedMIP = GM_getValue('mip' + idPlayer + serveur, '').split('|');

                                    var nbMIP = this.parentNode.parentNode.parentNode.getElementsByClassName('missilesAttacked')[0].innerHTML.split('<a')[0].replace(/[^0-9\.]/g, '');
                                    if (nbMIP == "")
                                        nbMIP = '1';

                                    savedMIP[1] = parseInt(savedMIP[1]) + parseInt(nbMIP);

                                    var nb = 0;

                                    var degats = [0, 0, 0]
                                    var prix = [];
                                    prix[401] = [2, 0, 0];
                                    prix[402] = [1.5, 0.5, 0];
                                    prix[403] = [6, 2, 0];
                                    prix[404] = [20, 15, 2];
                                    prix[405] = [2, 6, 0];
                                    prix[406] = [50, 50, 30];
                                    prix[407] = [10, 10, 0];
                                    prix[408] = [50, 50, 0];
                                    prix[502] = [8, 0, 2];
                                    prix[503] = [12.5, 2.5, 10];

                                    var html;

                                    for (var aa = 401; aa < 503; aa++)
                                    {
                                        html = this.parentNode.parentNode.parentNode.getElementsByClassName('tech defense' + aa)[0].innerHTML;

                                        if (/\(-([0-9\.]+)\)/.test(html))
                                        {

                                            nb = /\(-([0-9\.]+)\)/.exec(html)[1];



                                            degats[0] += nb * prix[aa][0];
                                            degats[1] += nb * prix[aa][1];
                                            degats[2] += nb * prix[aa][2];

                                        }

                                        if (aa == 408)
                                            aa = 501;
                                    }

                                    savedMIP[2] = parseInt(savedMIP[2]) + degats[0];
                                    savedMIP[3] = parseInt(savedMIP[3]) + degats[1];
                                    savedMIP[4] = parseInt(savedMIP[4]) + degats[2];

                                    GM_setValue('mip' + idPlayer + serveur, savedMIP.join('|'));



                                    var aTR = document.getElementsByClassName('aTR');
                                    for (var jjj = 0; jjj < aTR.length; jjj++)
                                    {   //  alert (/CR_KEY2\=.*&CR_KEY3/.test(aTR[jjj].href) + '\n\n'+aTR[jjj].href)
                                        aTR[jjj].href = aTR[jjj].href.replace(/MIP=[^&]*&/g, 'MIP=' + savedMIP.join('|') + '&');


                                    }
                                    this.style.backgroundColor = "rgba(0,0,255,1)";

                                }, true);

                            }
                        }
                        else
                        {
                            this.getElementsByClassName('imgTR')[0].src = imgJaune;
                            this.getElementsByClassName("aTR")[0].innerHTML += ' no API KEY. Try to reload or open the CR [err03]';
                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                        }
                    }
                    else // Attaque expé
                    {

                        //*********************************************************************************************//
                        //******************************** SEND RC EXPEDITIONS ****************************************//
                        //*********************************************************************************************//

                        var CR_KEY = msg[i].getAttribute('data-msg-id');

                        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                        var crkeyReg = new RegExp(CR_KEY, "g");

                        if (crkeyReg.test(listeRC))
                        {

                            var newElement = document.createElement("a"); // On crée un nouvelle élément a
                            newElement.innerHTML = '<span name="' + i + '" class="topraider"><a id="aTR' + i + '" title="TopRaider" target="topraider" class="aTR" href="http://' + www + 'topraider.eu?page=benef"><img name="' + i + '" class="imgTR" src="' + imgConv + '" /></a></span>';

                            msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);
                        }
                        else
                        {

                            nbRcExpeAEnvoyer++;
                            document.getElementById('nbAenvoiTR').innerHTML = nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer;
                            document.getElementById('envoiColor').style.color = '#ff0000';

                            var newElement = document.createElement("a"); // On crée un nouvel élément a
                            newElement.innerHTML = '<span class="topraider ' + i + '" apikey="' + CR_KEY + '"><a id="aTR' + i + '" title="TopRaider" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgRouge + '" /></a></span>';

                            msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);

                            var pertes = msg[i].getElementsByClassName("combatRightSide")[0].getElementsByTagName('span')[0].title;
                            var degats = msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByTagName('span')[0].title;

                            msg[i].getElementsByClassName("combatRightSide")[0].getElementsByTagName('span')[0].setAttribute('losses', pertes);
                            msg[i].getElementsByClassName("combatLeftSide")[0].getElementsByTagName('span')[0].setAttribute('damages', degats);

                            msg[i].getElementsByClassName("topraider")[0].addEventListener("click", function (event)
                            {

                                var newI = this.className.split(' ')[1];

                                if (newI > -1)
                                {

                                    CR_KEY = this.getAttribute("apikey");
                                    var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                                    var crkeyReg = new RegExp(CR_KEY, "g");

                                    if (!crkeyReg.test(listeRC))
                                    {

                                        var isActiv = 1;

                                        var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
                                        var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));



                                        if (email == '')
                                        {
                                            email = prompt(txtMail);
                                            if (email + '' != 'null')
                                                GM_setValue('topraideremail' + idPlayer, email);
                                            else
                                                email = '';
                                        }
                                        if (MDP == '' && email != '')
                                        {
                                            MDP = prompt(txtMDP);
                                            if (MDP + '' != 'null')
                                                GM_setValue('topraiderMDP' + idPlayer, MDP);
                                            else
                                                MDP = '';
                                        }
                                        if (email != '' && MDP != '')
                                        {

                                            var pertes = msg[newI].getElementsByClassName("combatRightSide")[0].getElementsByTagName('span')[0].getAttribute('losses');
                                            var degats = msg[newI].getElementsByClassName("combatLeftSide")[0].getElementsByTagName('span')[0].getAttribute('damages');

                                            var DDD = document.getElementsByClassName("msg")[newI].getElementsByClassName('msg_date')[0].textContent;
                                            var datess = trim(DDD).split(' ');
                                            var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                                            var Coords = document.getElementsByClassName("msg")[newI].getElementsByClassName('msg_title')[0].getElementsByTagName('a')[0].textContent.replace(/\[|\]/g, '');

                                            document.getElementsByClassName("msg")[newI].getElementsByClassName('topraider')[0].className = 'topraider -1'; // Pas deux fois

                                            GM_xmlhttpRequest({
                                                method: 'POST',
                                                url: 'http://' + www + 'topraider.eu/readexpe.php',
                                                data: '&Name=' + pseudo +
                                                        '&CR_KEY=' + CR_KEY +
                                                        '&expedition=2' +
                                                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                                                        '&Email=' + email +
                                                        '&Date_rc=' + dateFormat +
                                                        '&Coords=' + Coords +
                                                        '&ID_RC_og=' + CR_KEY +
                                                        '&Damages=' + degats +
                                                        '&Loss=' + pertes +
                                                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                                        '&VersionScript=' + VersionReel +
                                                        '&repNumRC=' + newI +
                                                        '&ID_player_og=' + idPlayer,
                                                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                                onload: function (xmlhttp)
                                                {
                                                    //    alert( xmlhttp.responseText);
                                                    var I = parseInt(xmlhttp.responseText.split('|')[0]);

                                                    if (document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0])
                                                    {

                                                        CR_KEY = document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0].getAttribute("apikey");
                                                        //       alert(xmlhttp.responseText)
                                                        if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                                        {

                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?page=benef';

                                                            var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                                            listeRC[parseInt(listeRC[0]) + 1] = CR_KEY;
                                                            listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                                            GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                                            var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                                            nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);
                                                            document.getElementById('nbenvoiTR').textContent = nbrcenv;
                                                            if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                                                document.getElementById('envoiColor').style.color = '#00ff00';

                                                            addProfits(xmlhttp.responseText.split('|')[2]);
                                                        }
                                                        else
                                                        {
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName("topraider")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('topraider')[0].title = xmlhttp.responseText.split('|')[1];
                                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                        }


                                                    }
                                                }
                                            });


                                        }
                                        else
                                        {
                                            document.getElementsByClassName("msg")[newI].getElementsByClassName('imgTR')[0].src = imgJaune;
                                            document.getElementsByClassName("msg")[newI].getElementsByClassName("aTR")[0].innerHTML += ' no mail or no password [err10]';
                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                        }


                                    }
                                }


                            }, true);

                        }
                    }


                }



            }


        }
    }

    else if (/ui-tabs-active/.test(document.getElementById('subtabs-nfFleet24').className) && !document.getElementById('topraiderrec'))
    {
        //*********************************************************************************************//
        //**************************** SEND recyclage converter ***************************************//
        //*********************************************************************************************//             

        var msg = document.getElementsByClassName('icon_apikey');
        if (msg[0])
        {
            var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
            var serveur = document.getElementsByName('ogame-universe')[0].content;
            var savedRecycle = GM_getValue('recycle' + idPlayer + serveur, '');

            for (var i = 0; i < msg.length; i++)
            {


                if (/(rr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.test(msg[i].title))
                {
                    var api = /(rr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(msg[i].title)[0];
                    msg[i].setAttribute("apikey", api);



                    if ((new RegExp(api, "g")).test(savedRecycle))
                    {
                        msg[i].style.backgroundColor = "rgba(0,0,255,1)";
                    }
                    else
                    {
                        msg[i].addEventListener("click", function (event)
                        {

                            var recycleAPI = /(rr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(this.getAttribute("apikey"))[0];
                            var savedRecycle = recycleAPI + ';' + GM_getValue('recycle' + idPlayer + serveur, '');

                            GM_setValue('recycle' + idPlayer + serveur, savedRecycle);

                            this.style.backgroundColor = "rgba(0,0,255,1)";


                        }, true);
                    }

                    if (!document.getElementById('topraiderrec'))
                    {
                        var newElement = document.createElement("span"); // On crée un nouvel élément a
                        newElement.innerHTML = '';
                        newElement.id = "topraiderrec";
                        msg[0].parentNode.appendChild(newElement);
                    }

                }
            }



        }


    }
    else if (/ui-tabs-active/.test(document.getElementById('subtabs-nfFleet22').className))
    {

        //*********************************************************************************************//
        //**************************** SEND EXPEDITIONS topraider ****************************************//
        //*********************************************************************************************//
        var msg = document.getElementsByClassName('msg');
        if (!document.getElementById('topraiderexpFIN'))
        {
            var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
            var serveur = document.getElementsByName('ogame-universe')[0].content;
            var savedRecycle = GM_getValue('recycle' + idPlayer + serveur, '');
            var pseudo = document.getElementsByName('ogame-player-name')[0].content;

            nbExpeAEnvoyer = 0;

            for (var i = 0; i < msg.length; i++)
            {
                if (msg[i].getElementsByClassName('msg_title')[0])
                {
                    if (regExpedition.test(msg[i].getElementsByClassName('msg_title')[0].textContent) && !msg[i].getElementsByClassName('topraiderexp')[0])
                    {
                        var CR_KEY = msg[i].getAttribute('data-msg-id');

                        var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                        var crkeyReg = new RegExp(CR_KEY, "g");

                        if (crkeyReg.test(listeRC))
                        {

                            var newElement = document.createElement("a"); // On crée un nouvelle élément a
                            newElement.innerHTML = '<span name="' + i + '" class="topraiderexp"><a id="aTR' + i + '" title="TopRaider" target="topraider" class="aTR" href="http://' + www + 'topraider.eu?page=benef"><img name="' + i + '" class="imgTR" src="' + imgConv + '" /></a></span>';

                            if (!document.getElementById('topraiderexp'))
                                newElement.id = "topraiderexp";

                            msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);
                        }
                        else
                        {
                            if (!msg[i].getElementsByClassName('combatLeftSide')[0])
                                nbExpeAEnvoyer++;


                            document.getElementById('nbAenvoiTR').innerHTML = nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer;
                            document.getElementById('envoiColor').style.color = '#ff0000';

                            var newElement = document.createElement("a"); // On crée un nouvel élément a
                            newElement.innerHTML = '<span class="topraiderexp ' + i + '" apikey="' + CR_KEY + '"><a id="aTR' + i + '" title="TopRaider" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgRouge + '" /></a></span>';

                            if (!document.getElementById('topraiderexp'))
                                newElement.id = "topraiderexp";

                            msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);

                            msg[i].getElementsByClassName("topraiderexp")[0].addEventListener("click", function (event)
                            {

                                var newI = this.className.split(' ')[1];

                                if (newI > -1)
                                {

                                    CR_KEY = this.getAttribute("apikey");

                                    var isActiv = 1;
                                    var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                                    var crkeyReg = new RegExp(CR_KEY, "g");

                                    if (!crkeyReg.test(listeRC))
                                    {
                                        var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
                                        var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));

                                        if (email == '')
                                        {
                                            email = prompt(txtMail);
                                            if (email + '' != 'null')
                                                GM_setValue('topraideremail' + idPlayer, email);
                                            else
                                                email = '';
                                        }
                                        if (MDP == '' && email != '')
                                        {
                                            MDP = prompt(txtMDP);
                                            if (MDP + '' != 'null')
                                                GM_setValue('topraiderMDP' + idPlayer, MDP);
                                            else
                                                MDP = '';
                                        }
                                        if (email != '' && MDP != '')
                                        {


                                            var DDD = document.getElementsByClassName("msg")[newI].getElementsByClassName('msg_date')[0].textContent;
                                            var datess = trim(DDD).split(' ');
                                            var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                                            var Coords = document.getElementsByClassName("msg")[newI].getElementsByClassName('msg_title')[0].getElementsByTagName('a')[0].textContent.replace(/\[|\]/g, '');

                                            document.getElementsByClassName("msg")[newI].getElementsByClassName('topraiderexp')[0].className = 'topraiderexp -1'; // Pas deux fois

                                            GM_xmlhttpRequest({
                                                method: 'POST',
                                                url: 'http://' + www + 'topraider.eu/readexpe.php',
                                                data: '&Name=' + pseudo +
                                                        '&CR_KEY=' + CR_KEY +
                                                        '&expedition=1' +
                                                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                                                        '&Email=' + email +
                                                        '&Date_rc=' + dateFormat +
                                                        '&Coords=' + Coords +
                                                        '&ID_RC_og=' + CR_KEY +
                                                        '&Content=' + document.getElementsByClassName("msg")[newI].getElementsByClassName('msg_content')[0].textContent +
                                                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                                        '&VersionScript=' + VersionReel +
                                                        '&repNumRC=' + newI +
                                                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                                        '&ID_player_og=' + idPlayer,
                                                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                                onload: function (xmlhttp)
                                                {
                                                    var I = parseInt(xmlhttp.responseText.split('|')[0]);

                                                    if (document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0])
                                                    {

                                                        CR_KEY = document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0].getAttribute("apikey");
                                                        //       alert(xmlhttp.responseText)
                                                        if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                                        {

                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgConv;
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'topraider.eu?page=benef';

                                                            var listeRC = GM_getValue('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                                            listeRC[parseInt(listeRC[0]) + 1] = CR_KEY;
                                                            listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                                            GM_setValue('listeRc' + serveur + idPlayer, listeRC.join('|'));

                                                            var nbrcenv = document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g, '');
                                                            nbrcenv = (nbrcenv == '' ? 1 : parseInt(nbrcenv) + 1);
                                                            document.getElementById('nbenvoiTR').textContent = nbrcenv;
                                                            if (nbrcenv == nbRcAEnvoyer + nbExpeAEnvoyer + nbRcExpeAEnvoyer)
                                                                document.getElementById('envoiColor').style.color = '#00ff00';

                                                            addProfits(xmlhttp.responseText.split('|')[2]);

                                                        }
                                                        else
                                                        {
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName("topraiderexp")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                            document.getElementsByClassName("msg")[I].getElementsByClassName('topraiderexp')[0].title = xmlhttp.responseText.split('|')[1];
                                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                                        }


                                                    }
                                                }
                                            });


                                        }
                                        else
                                        {
                                            document.getElementsByClassName("msg")[newI].getElementsByClassName('imgTR')[0].src = imgJaune;
                                            document.getElementsByClassName("msg")[newI].getElementsByClassName("aTR")[0].innerHTML += ' no mail or no password [err10]';
                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                        }


                                    }
                                }


                            }, true);

                        }



                        if (i == msg.length - 1 && !msg[i].getElementsByClassName('combatLeftSide')[0])
                        {
                            var newElement = document.createElement("span"); // On crée un nouvel élément a
                            newElement.innerHTML = '';
                            newElement.id = "topraiderexpFIN";
                            msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement);

                            //    alert(msg[i].getAttribute('data-msg-id'));
                            // clearInterval(interValSendRC);
                        }

                    }

                }



            }

        }
        // else alert(document.getElementById('topraiderexpFIN'))

    }
    else if (/ui-tabs-active/.test(document.getElementById('subtabs-nfFleet20').className) && !document.getElementsByClassName('topraiderspy')[0])
    {
        //*********************************************************************************************//
        //********************************** SPEEDSIM SHORT RE *************************************//
        //*********************************************************************************************//

        var msg = document.getElementsByClassName('msg');
        var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
        var serveur = document.getElementsByName('ogame-universe')[0].content;
        var tech = GM_getValue('techno' + serveur.split('.')[0] + idPlayer, '0|0|0|').split('|');

        var pseudo = document.getElementsByName('ogame-player-name')[0].content;
        var jj = 0;

        for (var i = 0; i < msg.length; i++)
        {

            if (msg[i].getElementsByClassName('resspan')[0] && !msg[i].getElementsByClassName('topraiderspy')[0])
            {

                msg[i].className += ' TRreSpy';
                var api = /(sr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(msg[i].getElementsByClassName('icon_apikey ')[0].title)[0];

                var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                var crkeyReg1 = new RegExp(api + '-1', "g");
                var crkeyReg0 = new RegExp(api + '-0', "g");


                var newElement3 = document.createElement("span"); // On crée un nouvelle élément div

                newElement3.innerHTML = '';
                if (!document.getElementsByClassName('addGT')[0])
                    newElement3.innerHTML = '<a title="SpeedSim" target="_blank" href="http://' + www + 'topraider.eu/index.php?SR_KEY=' + api + '&combu=' + tech[0] + '&impu=' + tech[1] + '&prop=' + tech[2] + '&arme=' + tech[3] + '&bouclier=' + tech[4] + '&protect=' + tech[5] + '&speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content + '"><img src="' + imgSpeedSim + '" /></a>';

                if (crkeyReg1.test(listeRC))
                {
                    newElement3.innerHTML += '<span name="' + jj + '" class="topraiderspy"><a id="aTR' + jj + '" title="TopRaider" target="topraider" class="aTR" href="http://' + www + 'spy.topraider.eu"><img name="' + jj + '" class="imgTR" src="' + imgVert + '" /></a></span>';
                    msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);
                }
                else
                {
                    if (crkeyReg0.test(listeRC))
                    {
                        newElement3.innerHTML += '<span class="topraiderspy ' + jj + '" apikey="' + api + '"><a id="aTR' + jj + '" title="TopRaider" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgConv + '" /></a></span>';
                    }
                    else
                    {
                        newElement3.innerHTML += '<span class="topraiderspy ' + jj + '" apikey="' + api + '"><a id="aTR' + jj + '" title="TopRaider" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgConv + '" /></a></span>'; // ROUGE
                    }
                    msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);


                    msg[i].getElementsByClassName("topraiderspy")[0].addEventListener("click", function (event)
                    {

                        var newI = this.className.split(' ')[1];

                        if (newI > -1)
                        {

                            CR_KEY = this.getAttribute("apikey");

                            var isActiv = 1;

                            var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
                            var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));

                            if (email == '')
                            {
                                email = prompt(txtMail);
                                if (email + '' != 'null')
                                    GM_setValue('topraideremail' + idPlayer, email);
                                else
                                    email = '';
                            }
                            if (MDP == '' && email != '')
                            {
                                MDP = prompt(txtMDP);
                                if (MDP + '' != 'null')
                                    GM_setValue('topraiderMDP' + idPlayer, MDP);
                                else
                                    MDP = '';
                            }
                            if (email != '' && MDP != '')
                            {
                                this.className = 'topraiderspy -1'; // Pas deux fois

                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: 'http://' + www + 'topraider.eu/addrcv6.php',
                                    data: '&Name=' + pseudo +
                                            '&CR_KEY=' + CR_KEY +
                                            '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                            '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                            '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                            '&Country=' + serveur.split('.')[0].split('-')[1] +
                                            '&Email=' + email +
                                            '&Important=1' +
                                            '&ID_RC_og=' + CR_KEY.split('-')[3] +
                                            '&Content=' + this.parentNode.parentNode.parentNode.getElementsByClassName('msg_content')[0].textContent +
                                            '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                            '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                            '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                            '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                            '&VersionScript=' + VersionReel +
                                            '&repNumRC=' + newI +
                                            '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                            '&ID_player_og=' + idPlayer,
                                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                    onload: function (xmlhttp)
                                    {

                                        var I = parseInt(xmlhttp.responseText.split('|')[0]);

                                        if (document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0])
                                        {

                                            CR_KEY = document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].getAttribute("apikey");
                                            //       alert(xmlhttp.responseText)
                                            if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                            {

                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgVert;
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'spy.topraider.eu';

                                                var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                                listeRC[parseInt(listeRC[0]) + 1] = CR_KEY + '-1';
                                                listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                                GM_setValue('listeSpy' + serveur + idPlayer, listeRC.join('|'));

                                            }
                                            else
                                            {
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("topraiderspy")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].title = xmlhttp.responseText.split('|')[1];
                                                document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                            }


                                        }
                                    }
                                });


                            }
                            else
                            {
                                document.getElementsByClassName("TRreSpy")[newI].getElementsByClassName('imgTR')[0].src = imgJaune;
                                document.getElementsByClassName("TRreSpy")[newI].getElementsByClassName("aTR")[0].innerHTML += ' no mail or no password [err10]';
                                document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                            }



                        }


                    }, true);

                }
                jj++;
            }
            else if (!msg[i].getElementsByClassName('topraiderspy')[0] && msg[i].getElementsByClassName('msg_actions clearfix')[0])
            {
                /* ***********************************************************************/
                /*************************** Send Spy ************************************/
                /*************************************************************************/

                var api = msg[i].getAttribute('data-msg-id');
                msg[i].className += ' TRreSpy';

                var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                var crkeyReg = new RegExp(api, "g");


                var newElement3 = document.createElement("span"); // On crée un nouvelle élément div

                newElement3.innerHTML = '';

                if (crkeyReg.test(listeRC))
                {
                    newElement3.innerHTML += '<span name="' + jj + '" class="topraiderspy"><a id="aTR' + jj + '" title="TopRaider" target="topraider" class="aTR" href="http://' + www + 'spy.topraider.eu"><img name="' + jj + '" class="imgTR" src="' + imgVert + '" /></a></span>';
                    msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);
                }
                else
                {
                    newElement3.innerHTML += '<span class="topraiderspy ' + jj + '" apikey="' + api + '"><a id="aTR' + jj + '" title="TopRaider" target="topraider" class="aTR"><img style="cursor:pointer;" class="imgTR" src="' + imgConv + '" /></a></span>';
                    msg[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);

                    var DDD = document.getElementsByClassName("msg")[i].getElementsByClassName('msg_date')[0].textContent;
                    var datess = trim(DDD).split(' ');
                    var dateFormat = datess[0].split('.')[2] + '-' + datess[0].split('.')[1] + '-' + datess[0].split('.')[0] + ' ' + datess[1];

                    var Coord = msg[i].getElementsByClassName("espionageDefText")[0].getElementsByTagName('a')[1].innerHTML
                    Coord = /\[([0-9]+:[0-9]+:[0-9]+)\]/.exec(Coord)[1];

                    var Coord_att = msg[i].getElementsByClassName("espionageDefText")[0].getElementsByTagName('a')[0].innerHTML
                    Coord_att = /\[([0-9]+:[0-9]+:[0-9]+)\]/.exec(Coord_att)[1];


                    var Name_att = msg[i].getElementsByClassName("espionageDefText")[0].getElementsByTagName('a')[0].innerHTML
                    if (/\(([^\)]+)\)/.test(Name_att))
                        Name_att = /\(([^\)]+)\)/.exec(Name_att)[1];
                    else
                        Name_att = '';



                    msg[i].getElementsByClassName("topraiderspy")[0].setAttribute('dateFormat', dateFormat);
                    msg[i].getElementsByClassName("topraiderspy")[0].setAttribute('Coord', Coord);
                    msg[i].getElementsByClassName("topraiderspy")[0].setAttribute('Coord_att', Coord_att);
                    msg[i].getElementsByClassName("topraiderspy")[0].setAttribute('Name_att', Name_att);

                    msg[i].getElementsByClassName("topraiderspy")[0].addEventListener("click", function (event)
                    {

                        var newI = this.className.split(' ')[1];

                        if (newI > -1)
                        {

                            CR_KEY = this.getAttribute("apikey");
                            dateFormat = this.getAttribute("dateFormat");
                            Coord = this.getAttribute("Coord");
                            Coord_att = this.getAttribute("Coord_att");
                            Name_att = this.getAttribute("Name_att");

                            var isActiv = 1;

                            var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
                            var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));

                            if (email == '')
                            {
                                email = prompt(txtMail);
                                if (email + '' != 'null')
                                    GM_setValue('topraideremail' + idPlayer, email);
                                else
                                    email = '';
                            }
                            if (MDP == '' && email != '')
                            {
                                MDP = prompt(txtMDP);
                                if (MDP + '' != 'null')
                                    GM_setValue('topraiderMDP' + idPlayer, MDP);
                                else
                                    MDP = '';
                            }
                            if (email != '' && MDP != '')
                            {

                                this.className = 'topraiderspy -1'; // Pas deux fois

                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: 'http://' + www + 'topraider.eu/readexpe.php',
                                    data: '&Name=' + pseudo +
                                            '&CR_KEY=' + CR_KEY +
                                            '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                            '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                            '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                            '&Country=' + serveur.split('.')[0].split('-')[1] +
                                            '&Email=' + email +
                                            '&Spy=1' +
                                            '&Date_rc=' + dateFormat +
                                            '&Coords=' + Coord +
                                            '&Coords_att=' + Coord_att +
                                            '&ID_RC_og=' + CR_KEY +
                                            '&Name_att=' + Name_att +
                                            '&Content=' + this.parentNode.parentNode.parentNode.getElementsByClassName('msg_content')[0].textContent +
                                            '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                            '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                            '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                            '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                            '&VersionScript=' + VersionReel +
                                            '&repNumRC=' + newI +
                                            '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                            '&ID_player_og=' + idPlayer,
                                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                    onload: function (xmlhttp)
                                    {

                                        var I = parseInt(xmlhttp.responseText.split('|')[0]);

                                        if (document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0])
                                        {
                                            CR_KEY = document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].getAttribute("apikey");
                                            //       alert(xmlhttp.responseText)
                                            if (parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g, '')) == 40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/, '')) == 17)
                                            {

                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgVert;
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("aTR")[0].href = 'http://' + www + 'spy.topraider.eu';

                                                var listeRC = GM_getValue('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                                                listeRC[parseInt(listeRC[0]) + 1] = CR_KEY + '-1';
                                                listeRC[0] = (parseInt(listeRC[0]) + 1) % 150;

                                                GM_setValue('listeSpy' + serveur + idPlayer, listeRC.join('|'));

                                            }
                                            else
                                            {
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("topraiderspy")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                                document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].title = xmlhttp.responseText.split('|')[1];
                                                document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                            }
                                        }
                                        else
                                        {
                                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName("topraiderspy")[0].innerHTML += ' ' + xmlhttp.responseText.split('|')[1];
                                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('imgTR')[0].src = imgJaune;
                                            document.getElementsByClassName("TRreSpy")[I].getElementsByClassName('topraiderspy')[0].title = xmlhttp.responseText.split('|')[1];
                                            document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                                        }
                                    }
                                });


                            }
                            else
                            {
                                document.getElementsByClassName("TRreSpy")[newI].getElementsByClassName('imgTR')[0].src = imgJaune;
                                document.getElementsByClassName("TRreSpy")[newI].getElementsByClassName("aTR")[0].innerHTML += ' no mail or no password [err10]';
                                document.getElementById('TRerrorEnvoi').innerHTML = (parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g, '')) + 1) + ' Errors';
                            }



                        }


                    }, true);

                }

                jj++;
            }

        }
    }

}


function addProfits(u)
{

    var profit = parseInt0(document.getElementById('TRBenef').innerHTML.replace(/[^0-9-]/g, ''));
    profit += parseInt(u.replace(/[^0-9-]/g, ''));

    var txt = u.replace(/[0-9-]/g, '')

    document.getElementById('TRBenef').innerHTML = txt + ': ' + addPoints(profit);

    if (profit < 0)
        document.getElementById('TRBenef').style.color = "#ff0000";
    else
        document.getElementById('TRBenef').style.color = "#00ff00";
}


//*********************************************************************************************//
//**************************** Fonction Options ****************************************//
//*********************************************************************************************//
function afficheOptions()
{

    var pseudo = document.getElementsByName('ogame-player-name')[0].content;
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var serveur = document.getElementsByName('ogame-universe')[0].content;

    var aff2 = '<div id="topRaiderOptionsBox" style="padding:10px;z-index: 10000;width:400px;position: fixed; bottom: 30px; left: 20px; border: solid black 2px; background:rgba(0,0,30,0.9);"><center>';
    aff2 += '<table><tr><td>' + txtMail + ' :</td><td><textarea rows="1" class="chat_box_textarea" style="width:180px;" type="text" id="mailtopraider" >' + GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, '')) + '</textarea></td></tr><tr><td>'
            + txtMDP + ' :</td><td> <input class="chat_box_textarea" style="width:180px;" type="password" id="MDPtopraider" value="' + GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, '')) + '"/><span style="cursor:pointer;" id="seemdp"><img src="' + imgWink + '"/></span> </td></tr></table>';

    var isCheck = (GM_getValue('topraiderActiv' + idPlayer + serveur, 'true') == 'true' ? 'checked' : '');
    var isCheckMines = (GM_getValue('topminierActiv' + idPlayer + serveur, 'true') == 'true' ? 'checked' : '');

    aff2 += '<br/><table><tr><td>' + txtLink + '</td><td><input id="topraiderActiv" type="checkbox" ' + isCheck + ' /></td><td rowspan="2"><input style="margin-left:20px;" id="saveoptions" type="submit" style="cursor:pointer;" /></td></tr>';
    aff2 += '<tr><td>' + txtLinkBat + '</td><td><input id="topminierActiv" type="checkbox" ' + isCheckMines + ' /></td></tr></table>';

    aff2 += '<br/><a href="http://' + www + 'mines.topraider.eu/index.php?page=options" target="_blank">' + txtLinkoption + '</a>';

    aff2 += '</center></div>';
    var newElement3 = document.createElement("div"); // On crée un nouvelle élément div
    newElement3.innerHTML = aff2;
    newElement3.id = 'topraiderOptions';
    //  document.getElementById('inhalt').appendChild(newElement3);

    if (document.getElementById('boxBG'))
        document.getElementById('boxBG').appendChild(newElement3);
    else
        document.getElementById('empire').appendChild(newElement3);



    document.getElementById('seemdp').addEventListener("click", function (event)
    {
        if (document.getElementById('MDPtopraider').type == 'text')
            document.getElementById('MDPtopraider').type = 'password';
        else
            document.getElementById('MDPtopraider').type = 'text';
    }, true);

    document.getElementById('saveoptions').addEventListener("click", function (event)
    { // Change mail => Delete colos sauvegardées

        if (document.getElementById('mailtopraider').value != GM_getValue('topraideremail' + idPlayer, ''))
        {
            var planetNode = document.getElementsByClassName('smallplanet');
            for (var i = 0; i < planetNode.length; i++)
            {
                var idPlanete = planetNode[i].id.replace('planet-', '');

                GM_setValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '');
                GM_setValue('batiments' + serveur + '|' + idPlayer + '|' + idPlanete, '');
                GM_setValue('defense' + serveur + '|' + idPlayer + '|' + idPlanete, '');

                if (planetNode[i].getElementsByClassName('moonlink')[0])
                {
                    idPlanete = planetNode[i].getElementsByClassName('moonlink')[0].href.split('&cp=')[1];

                    GM_setValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '');
                    GM_setValue('batiments' + serveur + '|' + idPlayer + '|' + idPlanete, '');
                    GM_setValue('defense' + serveur + '|' + idPlayer + '|' + idPlanete, '');
                }

            }
            GM_setValue('technos' + serveur + '|' + idPlayer, '');
            GM_setValue('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
        }



        GM_setValue('topraideremail' + idPlayer, document.getElementById('mailtopraider').value);
        GM_setValue('topraiderMDP' + idPlayer, document.getElementById('MDPtopraider').value);
        GM_setValue('topraiderActiv' + idPlayer + serveur, document.getElementById('topraiderActiv').checked + '');
        GM_setValue('topminierActiv' + idPlayer + serveur, document.getElementById('topminierActiv').checked + '');

        document.getElementById('topRaiderOptionsBox').parentNode.removeChild(document.getElementById('topRaiderOptionsBox'));


    }, true);

}


//*********************************************************************************************//
//**************************** Fonction Empire ****************************************//
//*********************************************************************************************//

function getLvl(pla, num)
{
    var res = 0;

    var PLA = document.getElementsByClassName('planet');


    if (PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('a')[0] && num < 200)
    {
        if (PLA[pla].getElementsByClassName(num + '')[0].getElementsByClassName('disabled')[0])
        {
            res = PLA[pla].getElementsByClassName(num + '')[0].getElementsByClassName('disabled')[0].textContent;
        }
        else
            res = PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('a')[0].textContent;

    }
    else if ((PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('a')[0] && num >= 200) || (PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('img')[0] && num >= 400 && num < 500))
    {
        res = PLA[pla].getElementsByClassName(num + '')[0].innerHTML.split('<img')[0];
    }
    else
    {
        res = PLA[pla].getElementsByClassName(num + '')[0].textContent
    }

    if (PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('img').length > 0)
    {

        if (!/\(/.test(PLA[pla].getElementsByClassName(num + '')[0].textContent))
        {
            Const = num;

            if (/gf2\.geo/.test(PLA[pla].getElementsByClassName(num + '')[0].getElementsByTagName('img')[0].src))
                Const = -num;

        }
    }


    if (/([0-9]{1,3}(\.|,))?[0-9]{1,3}(M|m)/.test(res))
    {
        res = res.replace(/,/g, '.').replace(/(M|m)/g, '') * 1000000;
    }
    else
        res = res.replace(/[^0-9]/g, '')

    return res;
}


function Empire()
{

    var Planete = document.getElementsByClassName('planet');

    var planeteListId = '';

    var ListeRessA = new Array();
    var ListeStationA = new Array();
    var ListeDefA = new Array();



    for (var i = 0; i < Planete.length - 1; i++)
    {
        planeteListId += Planete[i].id.replace('planet', '') + '|';
    }

    var SendTech = false;
    var SendFlotte = false;

    for (var i = 0; i < Planete.length - 1; i++)
    {
        idPlanete = Planete[i].id.replace('planet', '');

        var Coord = Planete[i].getElementsByClassName('coords textLeft')[0].textContent.replace(/\[|\]/g, '');
        var Coloname = Planete[i].getElementsByClassName('planetname')[0].textContent;
        var isLune = (Planete[i].getElementsByClassName('41')[0] ? 1 : 0);
        var DATA = '';

        var SendMine = false;
        var SendBat = false;
        var SendDef = false;


        Const = 0;

        if (!isLune)
        {
            var ListeRess = getLvl(i, 1) + '|' +
                    getLvl(i, 2) + '|' +
                    getLvl(i, 3) + '|' +
                    getLvl(i, 4) + '|' +
                    getLvl(i, 12) + '|' +
                    getLvl(i, 212) + '|' +
                    getLvl(i, 22) + '|' +
                    getLvl(i, 23) + '|' +
                    getLvl(i, 24) + '|';
        }
        else
        {
            var ListeRess = '0|0|0|0|0|' +
                    getLvl(i, 212) + '|' +
                    getLvl(i, 22) + '|' +
                    getLvl(i, 23) + '|' +
                    getLvl(i, 24) + '|';
        }

        if (!isLune)
        {
            var ListeStation = getLvl(i, 14) + '|' +
                    getLvl(i, 21) + '|' +
                    getLvl(i, 31) + '|' +
                    getLvl(i, 34) + '|' +
                    getLvl(i, 44) + '|' +
                    getLvl(i, 15) + '|' +
                    getLvl(i, 33) + '|0|0|0|' +
                    Planete[i].getElementsByClassName('planetDataTop')[0].getElementsByClassName('fields')[0].textContent.split('/')[1].replace(/[^0-9-]/g, '');
        }
        else
        {
            var ListeStation = getLvl(i, 14) + '|' +
                    getLvl(i, 21) + '|0|0|0|0|0|' +
                    getLvl(i, 41) + '|' +
                    getLvl(i, 42) + '|' +
                    getLvl(i, 43) + '|0';
        }

        ListeStation += '|' + Const;
        ListeRess += Const;

        var savedData = GM_getValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '');
        if (savedData != ListeRess)
        {

            //   alert(savedData +'\n'+ ListeRess+'\n'+ i+'-'+idPlanete )
            var niv = ListeRess.split('|');

            DATA += '&met=' + niv[0] +
                    '&cri=' + niv[1] +
                    '&deut=' + niv[2] +
                    '&ces=' + niv[3] +
                    '&cef=' + niv[4] +
                    '&sat=' + niv[5] +
                    '&hm=' + niv[6] +
                    '&hc=' + niv[7] +
                    '&hd=' + niv[8] +
                    '&const=' + Const +
                    '&temp=' + Planete[i].getElementsByClassName('planetDataBottom')[0].getElementsByClassName('fields')[0].textContent.split('°')[1].replace(/[^0-9-]/g, '');


            SendMine = true;
            ListeRessA[idPlanete] = ListeRess;
        }

        var savedData = GM_getValue('batiments' + serveur + '|' + idPlayer + '|' + idPlanete, '');
        if (savedData != ListeStation)
        {
            var niv = ListeStation.split('|');

            DATA += '&rob=' + niv[0] +
                    '&cs=' + niv[1] +
                    '&lab=' + niv[2] +
                    '&depo=' + niv[3] +
                    '&silo=' + niv[4] +
                    '&nan=' + niv[5] +
                    '&ter=' + niv[6] +
                    '&base=' + niv[7] +
                    '&pha=' + niv[8] +
                    '&pss=' + niv[9] +
                    '&const=' + Const +
                    '&case=' + niv[10];
            SendBat = true;
            ListeStationA[idPlanete] = ListeStation;
        }

        var ListeDef = getLvl(i, 401) + '|' +
                getLvl(i, 402) + '|' +
                getLvl(i, 403) + '|' +
                getLvl(i, 404) + '|' +
                getLvl(i, 405) + '|' +
                getLvl(i, 406) + '|' +
                getLvl(i, 407) + '|' +
                getLvl(i, 408) + '|' +
                getLvl(i, 502) + '|' +
                getLvl(i, 503) + '|';


        var savedData = GM_getValue('defense' + serveur + '|' + idPlayer + '|' + idPlanete, '');

        if (savedData != ListeDef)
        {
            var niv = ListeDef.split('|');

            DATA += '&lm=' + niv[0] +
                    '&lle=' + niv[1] +
                    '&llo=' + niv[2] +
                    '&gau=' + niv[3] +
                    '&lpla=' + niv[4] +
                    '&aion=' + niv[5] +
                    '&pb=' + niv[6] +
                    '&gb=' + niv[7] +
                    '&mi=' + niv[8] +
                    '&mip=' + niv[9];

            SendDef = true;
            ListeDefA[idPlanete] = ListeDef;

        }

        var imgNode = document.getElementsByClassName('values research groupresearch')[i].getElementsByTagName('img');
        if (imgNode.length > 0)
        {
            ConstR = imgNode[0].parentNode.className.replace(/[^0-9]/g, '')

        }



        if (i == Planete.length - 2) // Techo + flotte
        {

            var ii = Planete.length - 1;

            var ListeTech = getLvl(ii, 113) + '|' +
                    getLvl(ii, 120) + '|' +
                    getLvl(ii, 121) + '|' +
                    getLvl(ii, 114) + '|' +
                    getLvl(ii, 122) + '|' +
                    getLvl(ii, 115) + '|' +
                    getLvl(ii, 117) + '|' +
                    getLvl(ii, 118) + '|' +
                    getLvl(ii, 106) + '|' +
                    getLvl(ii, 108) + '|' +
                    getLvl(ii, 124) + '|' +
                    getLvl(ii, 123) + '|' +
                    getLvl(ii, 199) + '|' +
                    getLvl(ii, 109) + '|' +
                    getLvl(ii, 110) + '|' +
                    getLvl(ii, 111) + '|' + ConstR;





            var savedData = GM_getValue('technos' + serveur + '|' + idPlayer, '');

            if (savedData != ListeTech)
            {
                var niv = ListeTech.split('|');

                DATA += '&ene=' + niv[0] +
                        '&las=' + niv[1] +
                        '&Tion=' + niv[2] +
                        '&thyp=' + niv[3] +
                        '&pla=' + niv[4] +
                        '&com=' + niv[5] +
                        '&imp=' + niv[6] +
                        '&phyp=' + niv[7] +
                        '&esp=' + niv[8] +
                        '&ord=' + niv[9] +
                        '&ast=' + niv[10] +
                        '&rri=' + niv[11] +
                        '&gra=' + niv[12] +
                        '&arm=' + niv[13] +
                        '&bou=' + niv[14] +
                        '&const=' + ConstR +
                        '&pro=' + niv[15];
                SendTech = true;
            }




            var savedData = GM_getValue('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
            var niv = savedData.split('|');


            var ListeFlotte = Math.max(getLvl(ii, 204), niv[0]) + '|' +
                    Math.max(getLvl(ii, 205), niv[1]) + '|' +
                    Math.max(getLvl(ii, 206), niv[2]) + '|' +
                    Math.max(getLvl(ii, 207), niv[3]) + '|' +
                    Math.max(getLvl(ii, 215), niv[4]) + '|' +
                    Math.max(getLvl(ii, 211), niv[5]) + '|' +
                    Math.max(getLvl(ii, 213), niv[6]) + '|' +
                    Math.max(getLvl(ii, 214), niv[7]) + '|' +
                    Math.max(getLvl(ii, 202), niv[8]) + '|' +
                    Math.max(getLvl(ii, 203), niv[9]) + '|' +
                    Math.max(getLvl(ii, 208), niv[10]) + '|' +
                    Math.max(getLvl(ii, 209), niv[11]) + '|' +
                    Math.max(getLvl(ii, 210), niv[12]);


            if (savedData != ListeFlotte)
            {
                var niv = ListeFlotte.split('|');

                DATA += '&Ycle=' + niv[0] +
                        '&Yclo=' + niv[1] +
                        '&Ycro=' + niv[2] +
                        '&Yvb=' + niv[3] +
                        '&Ytraq=' + niv[4] +
                        '&Ybb=' + niv[5] +
                        '&Ydd=' + niv[6] +
                        '&Yrip=' + niv[7] +
                        '&Ypt=' + niv[8] +
                        '&Ygt=' + niv[9] +
                        '&Yvc=' + niv[10] +
                        '&Yrec=' + niv[11] +
                        '&Yesp=' + niv[12];


                SendFlotte = true;

            }

        }



        if (SendMine)
        {
            var newElement3 = document.createElement("center"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<img class="imgTopRaider" style="margin-top:5px;width:18px;" src="' + imgRouge + '" />';
            Planete[i].getElementsByClassName('row')[3].appendChild(newElement3);
        }
        if (SendBat)
        {
            var newElement3 = document.createElement("center"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<img class="imgTopRaider" style="margin-top:5px;width:18px;" src="' + imgRouge + '" />';
            Planete[i].getElementsByClassName('row')[4].appendChild(newElement3);
        }
        if (SendDef)
        {
            var newElement3 = document.createElement("center"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<img class="imgTopRaider" style="margin-top:5px;width:18px;" src="' + imgRouge + '" />';
            Planete[i].getElementsByClassName('row')[5].appendChild(newElement3);
        }
        if (SendTech && !Planete[ii].getElementsByClassName('row')[6].getElementsByClassName('imgTopRaider')[0])
        {
            var newElement3 = document.createElement("center"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<img class="imgTopRaider" style="margin-top:5px;width:18px;" src="' + imgRouge + '" />';
            Planete[ii].getElementsByClassName('row')[6].appendChild(newElement3);
        }
        if (SendFlotte && !Planete[ii].getElementsByClassName('row')[7].getElementsByClassName('imgTopRaider')[0])
        {
            var newElement3 = document.createElement("center"); // On crée un nouvelle élément div
            newElement3.innerHTML = '<img class="imgTopRaider" style="margin-top:5px;width:18px;" src="' + imgRouge + '" />';
            Planete[ii].getElementsByClassName('row')[7].appendChild(newElement3);
        }





        if (SendFlotte || SendMine || SendBat || SendDef || SendTech)
        {
            //var niv = listNiveau.split('|');

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                data: '&Name=' + pseudo +
                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                        '&Email=' + email +
                        '&Coord=' + Coord +
                        '&ID_planete_og=' + idPlanete +
                        '&Coloname=' + Coloname +
                        '&isLune=' + isLune +
                        '&empireLoad=empireLoad' +
                        '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                        DATA +
                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                        '&planeteListId=' + planeteListId +
                        '&bc=' + bc +
                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                        '&VersionScript=' + VersionReel +
                        '&ID_player_og=' + idPlayer,
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                onload: function (xmlhttp)
                {
                    var IdPla = xmlhttp.responseText.split('|')[1];
                    var imgTR = document.getElementById('planet' + IdPla).getElementsByClassName('imgTopRaider')

                    if (xmlhttp.responseText.split('|')[0] == 40)
                    {
                        if (ListeRessA[IdPla])
                            GM_setValue('mines' + serveur + '|' + idPlayer + '|' + IdPla, ListeRessA[IdPla]);

                        if (ListeStationA[IdPla])
                            GM_setValue('batiments' + serveur + '|' + idPlayer + '|' + IdPla, ListeStationA[IdPla]);

                        if (ListeDefA[IdPla])
                            GM_setValue('defense' + serveur + '|' + idPlayer + '|' + IdPla, ListeDefA[IdPla]);

                        if (IdPla == Planete[Planete.length - 2].id.replace('planet', ''))
                        {
                            if (SendTech)
                                GM_setValue('technos' + serveur + '|' + idPlayer, ListeTech);
                            if (SendFlotte)
                                GM_setValue('flotte' + serveur + '|' + idPlayer, ListeFlotte);

                            if (SendTech || SendFlotte)
                                document.getElementById('planet0').getElementsByClassName('imgTopRaider')[0].src = imgVert;
                            if (SendTech && SendFlotte)
                                document.getElementById('planet0').getElementsByClassName('imgTopRaider')[1].src = imgVert;

                        }


                        for (var ee = 0; ee < imgTR.length; ee++)
                            imgTR[ee].src = imgVert;
                    }
                    else
                    {
                        for (var ee = 0; ee < imgTR.length; ee++)
                        {
                            imgTR[ee].src = imgJaune;
                            imgTR[ee].title = 'TopRaider Error : ' + xmlhttp.responseText.split('|')[0];
                        }

                    }
                }
            });

        }

    }



}


/* **************************************************************/
/* ****************** FONCTION SPEEDSIM *************************/
/* **************************************************************/

function AdaptLoots()
{
    var lootsPers = parseInt(/plunder_perc=([0-9]+)&/.exec(location.href)[1]);
    var metLoot = parseInt(document.getElementById('metAQaui').innerHTML);
    var criLoot = parseInt(document.getElementById('criAQaui').innerHTML);
    var deutLoot = parseInt(document.getElementById('deutAQaui').innerHTML);

    document.getElementById('enemy_metalReel').value = metLoot;
    document.getElementById('enemy_crystalReel').value = criLoot;
    document.getElementById('enemy_deutReel').value = deutLoot;

    if (lootsPers == 100)
    {
        document.getElementsByName('enemy_metal')[0].value = metLoot * 2;
        document.getElementsByName('enemy_crystal')[0].value = criLoot * 2;
        document.getElementsByName('enemy_deut')[0].value = deutLoot * 2;
    }
    else if (lootsPers == 75)
    {
        document.getElementsByName('enemy_metal')[0].value = metLoot * 75 / 50;
        document.getElementsByName('enemy_crystal')[0].value = criLoot * 75 / 50;
        document.getElementsByName('enemy_deut')[0].value = deutLoot * 75 / 50;
    }
}

function speedSim()
{
    if (!document.getElementById('TRspeed'))
    {

        var tr = document.getElementsByTagName('fieldset')[5].getElementsByTagName('tr');


        var num = /([0-9\.]+)[^0-9]+[0-9]+[^0-9]+([0-9\.]+)[^0-9]+[0-9]+[^0-9]+([0-9\.]+)/g.exec(tr[2].innerHTML);

        for (var i = 1; i < num.length; i++)
        {

            tr[2].innerHTML = tr[2].innerHTML.replace((new RegExp(num[i], "g")), '<span style="color:limegreen;font-weight:bold;">' + num[i] + '</span>');

        }


        var num = /([0-9\.]+)[^0-9]+([0-9\.]+)[^0-9]+([0-9\.]+)/g.exec(tr[4].innerHTML);
        for (var i = 1; i < num.length; i++)
            tr[4].innerHTML = tr[4].innerHTML.replace((new RegExp(num[i], "g")), '<span style="color:red;font-weight:bold;">' + num[i] + '</span>');

        var num = /([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9]/g.exec(tr[6].innerHTML);
        for (var i = 1; i < num.length; i++)
            tr[6].innerHTML = tr[6].innerHTML.replace((new RegExp(num[i], "g")), '<span style="color:orange;font-weight:bold;">' + num[i] + '</span>');

        var num = /([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9][^0-9]+[^0-9]([0-9\.]+)[^0-9]/g.exec(tr[7].innerHTML);
        for (var i = 1; i < num.length; i++)
            tr[7].innerHTML = tr[7].innerHTML.replace((new RegExp(num[i], "g")), '<span style="color:orange;font-weight:bold;">' + num[i] + '</span>');


        if (lootsPers > 0)
        {
            var time = /([0-9]+):([0-9]+):([0-9]+)/.exec(tr[9].getElementsByTagName('td')[1].innerHTML);

            if (/uni_speed=([0-9]+)&/.test(location.href))
                var UniSpeed = parseInt(/uni_speed=([0-9]+)&/.exec(location.href)[1]);
            else
                UniSpeed = 1;


            var Seconde = (parseInt(time[1]) * 3600 + parseInt(time[2]) * 60 + parseInt(time[3])) / UniSpeed;


            var H = Math.floor(Seconde / 3600);
            var M = Math.floor((Seconde - 3600 * H) / 60);
            var S = Math.floor((Seconde - 3600 * H - 60 * M));



            tr[9].getElementsByTagName('td')[1].innerHTML = tr[9].getElementsByTagName('td')[1].innerHTML.replace(/([0-9]+):([0-9]+):([0-9]+)/, H + ':' + M + ':' + S);

            var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
            newElement3.innerHTML = '';
            newElement3.id = 'TRspeed';
            tr[2].appendChild(newElement3);

            AdaptLoots();
        }
    }

    //**************************************************************************************//
    //************************************* RATIO DE FUITE *********************************//
    //**************************************************************************************//
    var coutDef = 0;
    var coutAtt = 0;
    var nb = 0;


    for (var i = 0; i < 21; i++)
    {
        nb = document.getElementsByName('ship_d_' + i + '_b')[0].value;

        nb = nb == '' ? 0 : parseInt(nb);
        coutDef += nb * cout[i] * ratio[i];

        if (document.getElementsByName('ship_a_' + i + '_b')[0])
        {
            nb = document.getElementsByName('ship_a_' + i + '_b')[0].value;

            nb = nb == '' ? 0 : parseInt(nb);
            coutAtt += nb * cout[i] * ratio[i];
        }


        var taux = (coutDef == 0 ? 0 : parseInt(coutAtt / coutDef * 100) / 100);
        var couleur = 'FF9900';

        if (taux < 3)
            couleur = '00FF00';
        else if (taux > 5)
            couleur = 'FF0000';



        document.getElementById('shiptable').getElementsByTagName('th')[0].innerHTML = '<span float:"left" style="color:#' + couleur + ';" > A: ' + addPoints(coutAtt) + ' <br/> D: ' + addPoints(coutDef) + '</br> => ' + taux + "</span>";

    }

}


/* ************************************************************************/
/* ************************ FONCTION FUSION *******************************/
/* ************************************************************************/
function Fusion()
{
    if (document.getElementById('exodus-dialog'))
    {
        var UniFusion = document.getElementById('exodus-dialog').getElementsByClassName('server-selected');
        var uniCible = '0';

        for (var i = 0; i < UniFusion.length; i++)
        {
            if (/row-selected/.test(UniFusion[i].className))
            {
                uniCible = UniFusion[i].getElementsByClassName('exodus-universe-treeview-column-name')[0].textContent;
            }
        }
        //  alert(document.getElementsByClassName('exodus-universe-treeview-column-checkbox')[0].innerHTML)

        var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
        var serveur = document.getElementsByName('ogame-universe')[0].content;

        GM_setValue('fusion' + serveur + '|' + idPlayer, uniCible);
    }
}

if (/gameforge\.com\/game\/index\.php/.test(location.href)) // PAGE OGAME
{


    var imgConv = "data:image/png;base64,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";
    var imgRouge = "data:image/png;base64,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";
    var imgJaune = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsSAAALEgHS3X78AAADvElEQVR42q2WbUxTVxjHj9QWGJ1Lpg5kvDUCpWl5aUvXMtqmFttbHKUUirUQdC3RqjA2yepwSOJbNkFhbBqNJCZun/YWv7glbslifEmM7tOyL9uXjSxL+LCFZCHGRsH/nnNLwG4Ubhua/HLbc849vz7PffKcyxh98ovLjcQ9Yp7AOjG/uKeRLUosBSUVAJg04sQYMSttPd+bO7jovmQJ5zrBiNvS7+EOLlqQeoOt+S3MZuclRK60RAtctOJkvSMEE9ESjMG75z20dw3giqkDT7NkmM57Gchm6HS1SxUhpajxjRhc7cfhD3+Md45dw9S1W4hn5+IXlQ5HbG9inoQ/qLRweMJoDfbBaGtNX9QoRGBz74fV2UORRSC0DeI7VQ2eyhUYHpyCNziEmVwlHsvkaOs5C6u7F5W1Lumi15zd8ARPockfS148RygYviosh8HiQ7j/E3y5910xqslSHdR1zsxTxzGZDdCZWhIP/kXiEYOh0ZcoBr5mC8McRVnv2CP+rmvwpC8yN8dQVLUTAUsAzzZsACYYPL5uuL2hJdFVq1ecO273Q2MUMouo2toDR+sRTG8qwN85Svi7oxidvExpG18Stbb3Ia5QYPYFJdyBIdiErsxSN97chyeyjbh+aAyTX4zg5z++Qag3tpw64obZLUY10n8BgfCJzER/UTnPbC3AhxOf4/t7N/HP4z/x/tjRJJHdtU8siunNRdhL0VYZ3WmKzhIbGY75D2L45EeYuHQDw+cH0BmNiiL967uW1t4tUWOBouoOnIDZuXt1EfVXKHJyxaucmOMFsJM2bBAQHTiD8OHT0NQ6oNELSRFxLK5ezNP6u5tLYbR6pEWkoHThEBNbDGaWx63OIPTWLgi+SJJITyWtt+/Gj8qX8IRSKHZ3KaJCvomc2Je8WGdug6djAL6ek3h7aByjF7/FgcELaAkNkSgEQ1kFRZWFr18pQcOuo2uLblGVQfn/f6Wub6PufQAWm0eM6My5KVz59CGGR29CCH2A7VU1+D1PibhMhlp7ZA3RTwxx/mzOp24nxeXVosjW5IO3I4omXz/cnSMwWZwIFFdSBWZh/FX1GiItUZD4zkgoFoYiJ6VUVWWk5tuFHUInDKaGxHg+sWm1Z3Rn8eRcL35NJfqNOLU8yVjydTU0ujpoq/VQVWgTY58tdvz/iFY8yuWKbEkSTmlFNdRaA8rKdase5Su+nKQTkYSj/AFLNfm8IFNZ0XYdtpWpsa200i6+29m3Fh5uzC9+pFZpKA016wLfi+9pzy+KcMe/0RQ7ZHGeWn8AAAAASUVORK5CYII=";
    var imgSend = "data:image/png;base64,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";
    var imgSpeedSim = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAbCAYAAACAyoQSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOLSURBVEhLvVY7TBRhEJ7d23twgHB4hKfg4QN6PRMLYklFRwOJJibGSGEojCGxtrHQhFjYaSykusKEypJYaGLsCSRGoxJULofAwe3dPpyZ/3G7exzEePHb25vHPzvzz8y///5G90DOB0QsZkIykYJ4PAFWLAY+awUMQzJNQLZBGyW7ngtV2wa7ZoPruqgTRkbP0Bi772hrh1OZXkh3doNpWeB7njby0Qvxih6HoI3rOlDZ34XfpZ9QLpfBA5GJ0Tt8jrnevmEO6Do1fNDjwaYQz+LTeBPPMfCPUpTwUTQxuBVPwv5uCbZ/fAMHEyEYfSPn2XJodJwD0uwYAQeEYByGylyKOjaBGFYYELPi2DoLNr+sg+0I36aBFnRR/R2ZJZWWniGnijICMusi49reU9QDp1Zl38G2YAUwJM2aAlFZ2RcFdv+d0qV1YmIEU1KKxDcZtQzSJ6cdgEmy0GFA2ehWQbWBEgmW1+gfucAxs/1nuP6mWU++AZOLsDCflwLhA7yZewRrUorCk0lYiSQUt75CpVZjOVBemlnzTLOzS5GAhDxMLS/ChJSi4H7KEod6qhcSXYGBMHIwfnmIudLKfViam8H7KXxiTR6uzOaYi0KVNupXZ8oGf9XTVdj4KLjM4IhgIiB/VGLyHerpwOhFnkYmO4D75CEkkikeiGLiXgGmLknhhF4qVO0K0zj63NneqvdUlMAXMzom07XHqpwE6mUBFvCenpSqI6B9UluljqB7Supo7cNYhRXs5auV71IWGJsvwI0mPaWVIvyGk9HlpS+MXTmAdHsnD5yMazC9fBfGmD+63AflPd6GE6k07JZ+NZZXlKFJpvR+cjmDrwdm/uA1lJgfhNNnmQmhvpDCKzi8epsFffv+yNcjezUPGeY2ofiZmQhEeZkEoHekzq4eLm+zuP03X8KtmWEphVEs3IFnLzak1IhUW5q/qQ07ki6xnp3kJd16fh0ePnmHfBjFwm0MuN5gH6Zh6IWU7ugC+7DMSla0ECk8CpX3duofcSonl5QylZeYYYspr2MBLK9Qqu2KjPjL30Lqueib4wiYLgbjG89GvEWgEU1CbRitoB6eHDycgIIOWqtWwDBjqKIDl9zCkNL5hmcrZXLAejzHBvXCTo37LGNE/Jm8pzskS+iTAy1nGzdo8RA5UqtPlIj4+naGMiVCnLQTorIV8HBiNiajXhUFIzMoTvj/DwB/AKdf8pfHNHsiAAAAAElFTkSuQmCC";
    var imgWink = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAACXBIWXMAAAsRAAALEQF/ZF+RAAADa0lEQVQ4T9WUe0xTZxjG33NOuZRLy7zFOKPBZGxmcdEQF7YYmdopGC9kAxFNGVZA48zYqFFhFbJonMxr4h+owVpRhojV0ioiiGYDIl4QKDDFLcFirAZRwsVCO+2z92j/UcD4707yJF/O+b7f97zf836H6H/xABBYCpb42jCEyXs7lWPz7oSSvimYEiC9VyE+0CuI1+tVxV0fWjLrcn/FOKvnfsDR504xr8sh6ipv0IpL64g3fSdUhskTPPBE3h14ac98AoTcAqjcBSp8BvqtE6S7CMXX+yDO391I0ScmjwrMzYUol2hzelrvu73QOLzw/4thdf+CzH2g/Q8x+0AjpmVfA8WWgBYV9dIXBVNHBUaUdh861QNo7rjxQUMPxCsPQLe9oLJ+BB1ywniyCC2tjdAdrAVpjrFM1SPD9neEzTQPdE+yckl/DGJSfS+Uln8g5Z4FWdyIKnZieYwGyVotGuyNUCWYICWcAy0tjBkGlLa2aUJ3OzC+oBOLzzuwqsqBb043Y0K+HXSsD4utTxGX8QuE8R+hrrkdP5c2gRLNCNBdMA+Dien12UKmHYptd0F7ubz8LpCpH8KRPoh7ukEGDmDzPVBmAyj+DGhlCQStBaEZNW2UfsvvTWCSbTtpq0Br+Tx+Yjc5HaAdTtD2R6/Hm1pA39dwouVQpFkwVl8JSq5EmOFee+RhvAWLLUqmpZxSPJ/Rd9WgDdcZ2gzS2yHob0LKrIWkr4Yyuxp+G20ITK1geCvUu5y1xJ3wpjPN4Sm0wOSm2OMQEk9DSrPCP6McwYbLUP1ag6Ct5fDfcBaCzsbu2H1qK6Q8FyaaXIbhiUZfVdA8401aWAhaXgRacQpC0u8QVxZCiDeCvj3Orku5tDpQWjtoy2OojUOu+BKvcuT2+LLgY4opBi3jRXLsSRZWGWg1l6T9E5TCCaZ1QNrchU+KX3gjK18kjda0r66TerXtK9UPTW5K54Up9awboDUcyNq/QekPoDD0IuoCMNfaneMDjXhP5UOULYdMT8xaELanvUU6+Nwj7XLBb9sAlDkuTMsffBlX1vXoU8OJVJ4XyApmyX+SYUAZ5s8KY4UHhoTM+TBixo/hCRuNM9fvNEenbDoZ/tnnWQHqMRr+HsEa5wPK60Z0J7+Ud5L7JogVylL5NlD7xrKbAJbibch/znDMSedVpqkAAAAASUVORK5CYII=";
    var imgVert = "data:image/png;base64,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";
    var Chrome = navigator.userAgent.indexOf('Chrome') > -1;

    var regExpedition = new RegExp("\[[0-9]+:[0-9]+:16\]", "");


    if (Chrome) // TEMPORAIRE
    {
        var idPlayer = document.getElementsByName('ogame-player-id')[0].content;

        if (GM_getValue('topraideremail' + idPlayer, '') == '')
        {
            var serveur = document.getElementsByName('ogame-universe')[0].content;

            GM_setValue('topraideremail' + idPlayer, GM_getValueOLD('topraideremail' + idPlayer, ''))
            GM_setValue('topraiderMDP' + idPlayer, GM_getValueOLD('topraiderMDP' + idPlayer, ''))
            GM_setValue('techno' + serveur.split('.')[0] + idPlayer, GM_getValueOLD('techno' + serveur.split('.')[0] + idPlayer, '0|0|0|'));
            GM_setValue('listeRc' + serveur + idPlayer, GM_getValueOLD('listeRc' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'));
            GM_setValue('listeSpy' + serveur + idPlayer, GM_getValueOLD('listeSpy' + serveur + idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'));
            GM_setValue('technos' + serveur + '|' + idPlayer, GM_getValueOLD('technos' + serveur + '|' + idPlayer, ''));
            GM_setValue('flotte' + serveur + '|' + idPlayer, GM_getValueOLD('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0'));
            GM_setValue('nombrePoints' + idPlayer + serveur, GM_getValueOLD('nombrePoints' + idPlayer + serveur, '0'));
        }
    }


    /* **************************************************************/
    /* ****************** DEBUT SCRIPT V6****************************/
    /* **************************************************************/

    var pseudo = document.getElementsByName('ogame-player-name')[0].content;
    var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
    var serveur = document.getElementsByName('ogame-universe')[0].content;

    GM_setValue('loots' + idPlayer + serveur, '');
    GM_setValue('recycle' + idPlayer + serveur, '');
    GM_setValue('mip' + idPlayer + serveur, pseudo + '|0|0|0|0');

    var nbRcAEnvoyer = 0;
    var nbExpeAEnvoyer = 0;
    var nbRcExpeAEnvoyer = 0;

    // Affichage du menu 
    if (!/page=empire/.test(location.href))
    {
        // Bouton options
        var aff_option = '<span class="menu_icon"><a id="iconeUpdate" href="http://' + www + 'topraider.eu" target="blank_" ><img id="imgTRmenu" class="mouseSwitch" src="' + imgConv + '" rel="' + imgConv + '" height="26" width="26"></a></span><a id="affOptionsTR" class="menubutton "';
        aff_option += 'href="#" accesskey="" target="_self">';
        aff_option += '<span  class="textlabel">TopRaider</span></a>';

        var tableau = document.createElement("li");
        tableau.innerHTML = aff_option;
        tableau.id = 'optionTopRaider';
        document.getElementById('menuTableTools').appendChild(tableau);//, 

        document.getElementById('affOptionsTR').addEventListener("click", function (event)
        {
            afficheOptions();
        }, true);
    }

    // LANGUAGE 
    if (serveur.split('.')[0].split('-')[1] == 'fr')
    {
        var txtMail = "Email pour TopRaider";
        var txtMDP = "Mot de passe pour TopRaider";
        var txtLink = "Activer <a href='http://" + www + "topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Activer <a href='http://" + www + "mines.topraider.eu' target='_blank'>TopMiner</a>";
        var txtLinkoption = "Autres options";
        var txtToutEnvoyer = "Tout envoyer sur TopRaider";
        var txtOptions = "Options de TopRaider";
        var txtEnvoyer = "Envoyer";
        var txtConvertir = "Convertir";
        var txtrcsent = "RC envoyé";
        var txtrc = "RC";
    }
    else if (serveur.split('.')[0].split('-')[1] == 'de')
    {
        var txtMail = "Email für TopRaider";
        var txtMDP = "Password für TopRaider";
        var txtLink = "Aktiviere <a href='http://" + www + "topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Aktiviere <a href='http://" + www + "mines.topraider.eu' target='_blank'>TopMiner</a>";
        var txtToutEnvoyer = "Sende alle KBs nach TopRaider";
        var txtOptions = "TopRaider Optionen";
        var txtEnvoyer = "Senden";
        var txtConvertir = "Konvertieren";
        var txtrcsent = "KB gesendet";
        var txtrc = "KB";
        var txtLinkoption = "Andere options";

    }
    else
    {
        var txtMail = "Email for TopRaider";
        var txtMDP = "Password for TopRaider";
        var txtLink = "Activate <a href='http://" + www + "topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Activate <a href='http://" + www + "mines.topraider.eu' target='_blank'>TopMiner</a>";

        var txtToutEnvoyer = "send All CR to TopRaider";
        var txtOptions = "TopRaider's Options";
        var txtEnvoyer = "Send";
        var txtConvertir = "Convert";
        var txtrcsent = "CR Sent";
        var txtrc = "CR";
        var txtLinkoption = "Other options";

    }

    if (document.getElementById('exodus-indicator'))
    {
        setInterval(Fusion, 1000);

    }



    if (/page=messages/.test(location.href) && GM_getValue('topraiderActiv' + idPlayer + serveur, 'true') == 'true')
    {
        var sendAllRCOK = true;

        var interValSendRC = setInterval(sendRC, 800);

        var newElement3 = document.createElement("li"); // On crée un nouvelle élément div
        newElement3.innerHTML = '<img title="' + txtToutEnvoyer + '" style="cursor:pointer;" src="' + imgSend + '" /> <div style="position:relative;top:-28px;left:50px"><span id="envoiColor" style="font-size:0.8em;color:#00DD00;"><span id="nbenvoiTR">0</span>/<span id="nbAenvoiTR">0</span> ' + txtrc + '</span> <br/> <span id="TRerrorEnvoi" style="font-size:0.8em;color:#ffff00;"></span></div>';
        newElement3.innerHTML += '<span id="TRBenef" style="font-size:0.8em;color:#00ff00;"></span>';
        newElement3.id = "EnvoiRC";

        document.getElementById('buttonz').getElementsByTagName('ul')[0].appendChild(newElement3);


        document.getElementById('EnvoiRC').addEventListener("click", function (event)
        {
            sendAllRC();

        }, true);

    }
    else if (/page=(overview)/.test(location.href))
    {
        var idPlayer = document.getElementsByName('ogame-player-id')[0].content;
        var serveur = document.getElementsByName('ogame-universe')[0].content;

        var tdnode = document.getElementsByTagName('script');

        var sentence1 = "index.php?page=highscore";
        var decalagePoint = 2;
        var sentence2 = "(";
        var sentence3 = ")";
        var nbJoueur = '';

        for (var i = 0; i < tdnode.length; i++)
        {
            var pos1 = (tdnode[i].innerHTML).indexOf(sentence1);
            var pos3 = (tdnode[i].innerHTML).indexOf(sentence2, 10);

            if (pos1 >= 0)
            {
                var pos2 = (tdnode[i].innerHTML).indexOf(sentence2, pos1 + sentence1.length);
                var PointsTotal = (tdnode[i].innerHTML).substring(pos1 + sentence1.length + decalagePoint, pos2);

                PointsTotal = parseInt(PointsTotal.replace(/[^0-9-]/g, ""));

                GM_setValue('nombrePoints' + idPlayer + serveur, PointsTotal)
            }
        }
    }
    else if (/page=(resources|research|station|defense|shipyard|fleet1|empire)/.test(location.href) && GM_getValue('topminierActiv' + idPlayer + serveur, 'true') == 'true')
    {
        var idPlanete = document.getElementsByName('ogame-planet-id')[0].content;
        var Coord = document.getElementsByName('ogame-planet-coordinates')[0].content;
        var Coloname = document.getElementsByName('ogame-planet-name')[0].content;
        var isLune = (document.getElementsByName('ogame-planet-type')[0].content == 'planet' ? 0 : 1);

        var planeteListId = '';
        var planetNode = document.getElementsByClassName('smallplanet');
        for (var i = 0; i < planetNode.length; i++)
        {
            planeteListId += planetNode[i].id.replace('planet-', '') + '|';
            if (planetNode[i].getElementsByClassName('moonlink')[0])
            {
                planeteListId += planetNode[i].getElementsByClassName('moonlink')[0].href.split('&cp=')[1] + '|';
            }
        }

        var bc = (document.getElementById('dragplaActive') ? 10 : 0);

        var email = GM_getValue('topraideremail' + idPlayer, GM_getValue('topraideremail' + pseudo, ''));
        var MDP = GM_getValue('topraiderMDP' + idPlayer, GM_getValue('topraiderMDP' + pseudo, ''));
        if (email == '' || MDP == '' || GM_getValue('topminierActiv' + idPlayer + serveur, 'nosave') == 'nosave')
        {
            afficheOptions();

            if (GM_getValue('topminierActiv' + idPlayer + serveur, 'nosave') == 'nosave')
                GM_setValue('topminierActiv' + idPlayer + serveur, 'true');
        }
        else
        {
            if (/page=resources/.test(location.href))
            {
                var niveaux = "";
                var niveau = '';
                var listNiveau = '';
                var Const = 0;

                if (isLune)
                    var temp = 0;
                else
                    var temp = document.getElementById("planet-" + idPlanete).innerHTML.split('°C')[1].replace(/[^0-9-]/g, "");

                var id = new Array(1, 2, 3, 4, 12, 212, 22, 23, 24);

                for (var f = 0; f < 9; f++)
                {
                    niveaux = document.getElementsByClassName('supply' + id[f])[0].getElementsByClassName('level')[0];

                    if (typeof (niveaux.getElementsByClassName('textlabel')[0]) == "undefined")
                    {
                        niveau = niveaux.innerHTML.split('span')[0].replace(/[^0-9-]/g, "");
                    }
                    else
                    {
                        niveau = niveaux.textContent;

                        var span = niveaux.getElementsByTagName('span');

                        for (var k = 0; k < span.length; k++)
                        {
                            niveau = trim(niveau.replace(span[k].textContent, ""));
                        }
                    }

                    if (/\|/.test(niveau))
                    {
                        niveau = parseInt(niveau.split('|')[1].replace(/[^0-9]/g, ""))
                        bc = 101;
                    }
                    else
                        niveau = parseInt(niveau.replace(/[^0-9]/g, ""))



                    if (f != 5 && niveau > 100)
                    {
                        niveau = -1;
                        bc = 102;
                    }

                    //alert( parseInt(niveau) +'  '+f);
                    listNiveau += niveau + '|';

                }

                if (document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)
                {
                    Const = /cancelProduction\(([0-9]+),/.exec(document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)[1]

                    if (document.getElementById('details' + Const))
                    {
                        var Nact = parseInt(document.getElementById('details' + Const).getElementsByClassName('level')[0].textContent.replace(/[^0-9]/g, ''));
                        var Ncont = parseInt(document.getElementById('details' + Const).getElementsByClassName('eckeoben')[0].textContent.replace(/[^0-9]/g, ''));

                        if (Nact > Ncont)
                            Const = -Const;
                    }
                    else
                    {
                        Const = GM_getValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '').split('|')[9];
                    }
                    // alert(Const)
                }
                listNiveau += Const;

                var savedData = GM_getValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '');

                if (savedData != listNiveau)
                {


                    if (email != '' && MDP != '')
                    {

                        var niv = listNiveau.split('|');

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                            data: '&Name=' + pseudo +
                                    '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                    '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                    '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                    '&Country=' + serveur.split('.')[0].split('-')[1] +
                                    '&Email=' + email +
                                    '&Coord=' + Coord +
                                    '&ID_planete_og=' + idPlanete +
                                    '&Coloname=' + Coloname +
                                    '&isLune=' + isLune +
                                    '&met=' + niv[0] +
                                    '&cri=' + niv[1] +
                                    '&deut=' + niv[2] +
                                    '&ces=' + niv[3] +
                                    '&cef=' + niv[4] +
                                    '&sat=' + niv[5] +
                                    '&hm=' + niv[6] +
                                    '&hc=' + niv[7] +
                                    '&hd=' + niv[8] +
                                    '&temp=' + temp +
                                    '&const=' + Const +
                                    '&OffCom=' + (document.getElementsByClassName('on commander')[0] ? 1 : 0) +
                                    '&OffAmi=' + (document.getElementsByClassName('on admiral')[0] ? 1 : 0) +
                                    '&OffGeo=' + (document.getElementsByClassName('on geologist')[0] ? 1 : 0) +
                                    '&OffIng=' + (document.getElementsByClassName('on engineer')[0] ? 1 : 0) +
                                    '&OffTech=' + (document.getElementsByClassName('on technocrat')[0] ? 1 : 0) +
                                    '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                                    '&planeteListId=' + planeteListId +
                                    '&bc=' + bc +
                                    '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                    '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                    '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                    '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                    '&VersionScript=' + VersionReel +
                                    '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                    '&ID_player_og=' + idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function (xmlhttp)
                            {
                                //  alert(xmlhttp.responseText);

                                if (xmlhttp.responseText.split('|')[0] == 40)
                                {
                                    GM_setValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, listNiveau);
                                    document.getElementById('imgTRmenu').src = imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src = imgJaune;
                                    document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML += '<br/><br/>TopRaider Error : ' + xmlhttp.responseText.split('|')[0];

                                }
                            }
                        });



                    }
                }

            }
            else if (/page=research/.test(location.href))
            {
                var niveau = '';
                var niveaux = '';
                var listNiveau = '';
                var listNiveauSpeed = '';
                var Const = 0;

                var id = new Array(113, 120, 121, 114, 122, 115, 117, 118, 106, 108, 124, 123, 199, 109, 110, 111);

                for (var f = 0; f < 16; f++)
                {
                    niveaux = document.getElementById('details' + id[f]).getElementsByClassName('level')[0];

                    if (typeof (niveaux.getElementsByClassName('textlabel')[0]) == "undefined")
                    {
                        niveau = niveaux.innerHTML.split('span')[0].replace(/[^0-9-]/g, "");
                    }
                    else
                    {
                        niveau = niveaux.textContent;

                        var span = niveaux.getElementsByTagName('span');

                        for (var k = 0; k < span.length; k++)
                        {
                            niveau = trim(niveau.replace(span[k].textContent, ""));
                        }
                    }

                    niveau = parseInt(niveau)
                    if (niveau > 100)
                        niveau = -1;

                    listNiveau += niveau + '|';

                    if (f == 5 || f == 6 || f == 7 || f == 13 || f == 14 || f == 15)
                        listNiveauSpeed += niveau + '|';
                }

                // Technologie SpeedSim
                GM_setValue('techno' + serveur.split('.')[0] + idPlayer, listNiveauSpeed);

                if (document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)
                    Const = /cancelResearch\(([0-9]+),/.exec(document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)[1]

                listNiveau += Const;

                var savedData = GM_getValue('technos' + serveur + '|' + idPlayer, '');

                if (savedData != listNiveau)
                {
                    if (email != '' && MDP != '')
                    {
                        var niv = listNiveau.split('|');

                        if (niv[16] != '')
                            bc = 103;

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                            data: '&Name=' + pseudo +
                                    '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                    '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                    '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                    '&Country=' + serveur.split('.')[0].split('-')[1] +
                                    '&Email=' + email +
                                    '&Coord=' + Coord +
                                    '&ID_planete_og=' + idPlanete +
                                    '&Coloname=' + Coloname +
                                    '&isLune=' + isLune +
                                    '&ene=' + niv[0] +
                                    '&las=' + niv[1] +
                                    '&Tion=' + niv[2] +
                                    '&thyp=' + niv[3] +
                                    '&pla=' + niv[4] +
                                    '&com=' + niv[5] +
                                    '&imp=' + niv[6] +
                                    '&phyp=' + niv[7] +
                                    '&esp=' + niv[8] +
                                    '&ord=' + niv[9] +
                                    '&ast=' + niv[10] +
                                    '&rri=' + niv[11] +
                                    '&gra=' + niv[12] +
                                    '&arm=' + niv[13] +
                                    '&bou=' + niv[14] +
                                    '&pro=' + niv[15] +
                                    '&const=' + Const +
                                    '&OffCom=' + (document.getElementsByClassName('on commander')[0] ? 1 : 0) +
                                    '&OffAmi=' + (document.getElementsByClassName('on admiral')[0] ? 1 : 0) +
                                    '&OffGeo=' + (document.getElementsByClassName('on geologist')[0] ? 1 : 0) +
                                    '&OffIng=' + (document.getElementsByClassName('on engineer')[0] ? 1 : 0) +
                                    '&OffTech=' + (document.getElementsByClassName('on technocrat')[0] ? 1 : 0) +
                                    '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                                    '&planeteListId=' + planeteListId +
                                    '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                    '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                    '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                    '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                    '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                    '&VersionScript=' + VersionReel +
                                    '&ID_player_og=' + idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function (xmlhttp)
                            {
                                if (xmlhttp.responseText.split('|')[0] == 40)
                                {
                                    GM_setValue('technos' + serveur + '|' + idPlayer, listNiveau);
                                    document.getElementById('imgTRmenu').src = imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src = imgJaune;
                                    document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML += '<br/><br/>TopRaider Error : ' + xmlhttp.responseText.split('|')[0];

                                }

                            }
                        });

                    }
                }


            }
            else if (/page=station/.test(location.href))
            {

                var niveaux = document.getElementsByClassName('level');
                var niveau = '';
                var listNiveau = '';
                var Const = 0;

                if (isLune)
                {
                    var temp = 0;
                    var nbBat = 5;
                    var id = new Array(14, 21, 41, 42, 43);
                    var CaseMax = 0;

                }
                else
                {
                    var temp = document.getElementById("planet-" + idPlanete).innerHTML.split('°C')[1].replace(/[^0-9-]/g, "");
                    var CaseMax = /\(([^0-9]+)?[0-9]+[^0-9]+([0-9]+)\)/.exec(document.getElementById("planet-" + idPlanete).innerHTML)[2];

                    var nbBat = 7;
                    var id = new Array(14, 21, 31, 34, 44, 15, 33);

                }

                for (var f = 0; f < id.length; f++)
                {
                    niveaux = document.getElementById('details' + id[f]).getElementsByClassName('level')[0];

                    if (typeof (niveaux.getElementsByClassName('textlabel')[0]) == "undefined")
                    {
                        niveau = niveaux.innerHTML.split('span')[0].replace(/[^0-9-]/g, "");
                    }
                    else
                    {
                        niveau = trim(niveaux.innerHTML);
                        //         bati = niveaux[f].getElementsByClassName('textlabel')[0].innerHTML;
                        //         niveau = parseInt((niveau+'').replace(bati, '').replace(/<span class="textlabel"><\/span>/i, ''));
                    }

                    niveau = parseInt(niveau.replace(/[^0-9]/g, ""))
                    if (niveau > 100)
                        niveau = -1;


                    listNiveau += niveau + '|';

                    if (isLune && f == 1)
                        listNiveau += '0|0|0|0|0|';

                }

                if (!isLune)
                    listNiveau += '0|0|0|';

                listNiveau += CaseMax;

                if (document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)
                {
                    Const = /cancelProduction\(([0-9]+),/.exec(document.getElementsByClassName('construction active')[0].getElementsByTagName('a')[0].onclick)[1]

                    if (document.getElementById('details' + Const))
                    {
                        var Nact = parseInt(document.getElementById('details' + Const).getElementsByClassName('level')[0].textContent.replace(/[^0-9]/g, ''));
                        var Ncont = parseInt(document.getElementById('details' + Const).getElementsByClassName('eckeoben')[0].textContent.replace(/[^0-9]/g, ''));

                        if (Nact > Ncont)
                            Const = -Const;
                    }
                    else
                    {
                        Const = GM_getValue('mines' + serveur + '|' + idPlayer + '|' + idPlanete, '').split('|')[9];
                    }
                    // alert(Const)

                }


                listNiveau += '|' + Const;


                var savedData = GM_getValue('batiments' + serveur + '|' + idPlayer + '|' + idPlanete, '');

                //  alert(savedData +'\n'+ listNiveau)

                if (savedData != listNiveau)
                {


                    if (email != '' && MDP != '')
                    {

                        var niv = listNiveau.split('|');
                        var dataSent = '&Name=' + pseudo +
                                '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                '&Country=' + serveur.split('.')[0].split('-')[1] +
                                '&Email=' + email +
                                '&Coord=' + Coord +
                                '&ID_planete_og=' + idPlanete +
                                '&Coloname=' + Coloname +
                                '&isLune=' + isLune +
                                '&rob=' + niv[0] +
                                '&cs=' + niv[1] +
                                '&lab=' + niv[2] +
                                '&depo=' + niv[3] +
                                '&silo=' + niv[4] +
                                '&nan=' + niv[5] +
                                '&ter=' + niv[6] +
                                '&base=' + niv[7] +
                                '&pha=' + niv[8] +
                                '&pss=' + niv[9] +
                                '&temp=' + temp +
                                '&case=' + niv[10] +
                                '&const=' + Const +
                                '&planeteListId=' + planeteListId +
                                '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                '&OffCom=' + (document.getElementsByClassName('on commander')[0] ? 1 : 0) +
                                '&OffAmi=' + (document.getElementsByClassName('on admiral')[0] ? 1 : 0) +
                                '&OffGeo=' + (document.getElementsByClassName('on geologist')[0] ? 1 : 0) +
                                '&OffIng=' + (document.getElementsByClassName('on engineer')[0] ? 1 : 0) +
                                '&OffTech=' + (document.getElementsByClassName('on technocrat')[0] ? 1 : 0) +
                                '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                                '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                '&VersionScript=' + VersionReel +
                                '&ID_player_og=' + idPlayer;



                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                            data: dataSent,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function (xmlhttp)
                            {
                                //  alert(xmlhttp.responseText);

                                if (xmlhttp.responseText.split('|')[0] == 40)
                                {
                                    GM_setValue('batiments' + serveur + '|' + idPlayer + '|' + idPlanete, listNiveau);
                                    document.getElementById('imgTRmenu').src = imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src = imgJaune;
                                    document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML += '<br/><br/>TopRaider Error : ' + xmlhttp.responseText.split('|')[0];

                                }
                            }
                        });

                    }
                }

            }
            else if (/page=defense/.test(location.href))
            {
                var niv = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

                var niveau = '';
                var bati = '';
                var niveaux = document.getElementsByClassName('level');

                var id = new Array(401, 402, 403, 404, 405, 406, 407, 408, 502, 503);

                for (var f = 0; f < niv.length; f++)
                {
                    niveaux = document.getElementById('details' + id[f]).getElementsByClassName('level')[0];

                    if (typeof (niveaux.getElementsByClassName('textlabel')[0]) == "undefined")
                    {
                        niveau = trim(niveaux.innerHTML);
                    }
                    else
                    {
                        niveau = niveaux.innerHTML;
                        bati = niveaux.getElementsByClassName('textlabel')[0].innerHTML;
                        niveau = trim(niveau.replace(bati, '').replace(/<span class="textlabel"><\/span>/i, ''));
                    }

                    if (/([0-9]{1,3}(\.|,))?[0-9]{1,3}(M|m)/.test(niveau))
                        niv[f] = niveau.replace(/,/g, '.').replace(/(M|m)/g, '') * 1000000;
                    else
                        niv[f] = parseInt(niveau.replace(/[^0-9-]/g, ""));
                }

                var listNiveau = niv.join('|') + '|';

                var savedData = GM_getValue('defense' + serveur + '|' + idPlayer + '|' + idPlanete, '');

                if (savedData != listNiveau)
                {
                    if (email != '' && MDP != '')
                    {
                        var niv = listNiveau.split('|');

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                            data: '&Name=' + pseudo +
                                    '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                    '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                    '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                    '&Country=' + serveur.split('.')[0].split('-')[1] +
                                    '&Email=' + email +
                                    '&Coord=' + Coord +
                                    '&ID_planete_og=' + idPlanete +
                                    '&Coloname=' + Coloname +
                                    '&isLune=' + isLune +
                                    '&lm=' + niv[0] +
                                    '&lle=' + niv[1] +
                                    '&llo=' + niv[2] +
                                    '&gau=' + niv[3] +
                                    '&lpla=' + niv[4] +
                                    '&aion=' + niv[5] +
                                    '&pb=' + niv[6] +
                                    '&gb=' + niv[7] +
                                    '&mi=' + niv[8] +
                                    '&mip=' + niv[9] +
                                    '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                    '&OffCom=' + (document.getElementsByClassName('on commander')[0] ? 1 : 0) +
                                    '&OffAmi=' + (document.getElementsByClassName('on admiral')[0] ? 1 : 0) +
                                    '&OffGeo=' + (document.getElementsByClassName('on geologist')[0] ? 1 : 0) +
                                    '&OffIng=' + (document.getElementsByClassName('on engineer')[0] ? 1 : 0) +
                                    '&OffTech=' + (document.getElementsByClassName('on technocrat')[0] ? 1 : 0) +
                                    '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                                    '&planeteListId=' + planeteListId +
                                    '&bc=' + bc +
                                    '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                    '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                    '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                    '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                    '&VersionScript=' + VersionReel +
                                    '&ID_player_og=' + idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function (xmlhttp)
                            {
                                //        alert(xmlhttp.responseText);

                                if (xmlhttp.responseText.split('|')[0] == 40)
                                {
                                    GM_setValue('defense' + serveur + '|' + idPlayer + '|' + idPlanete, listNiveau);
                                    document.getElementById('imgTRmenu').src = imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src = imgJaune;
                                    document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML += '<br/><br/>TopRaider Error : ' + xmlhttp.responseText.split('|')[0];

                                }
                            }
                        });

                    }
                }

            }
            else if (/page=(shipyard|fleet1)/.test(location.href))
            {

                var savedData = GM_getValue('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
                var niv = savedData.split('|');

                //  alert(niv[0]+niv[1]+niv[2]+niv[3])

                var niveau = '';
                var bati = '';
                var niveaux = document.getElementsByClassName('level');

                var id = Array(204, 205, 206, 207, 215, 211, 213, 214, 202, 203, 208, 209, 210);

                if (niveaux[0])
                {
                    for (var f = 0; f < 13; f++)
                    {
                        if (document.getElementById('details' + id[f]))
                            niveaux = document.getElementById('details' + id[f]).getElementsByClassName('level')[0];
                        else
                            niveaux = document.getElementById('button' + id[f]).getElementsByClassName('level')[0];

                        if (typeof (niveaux.getElementsByClassName('textlabel')[0]) == "undefined")
                        {
                            niveau = trim(niveaux.innerHTML);
                        }
                        else
                        {
                            niveau = niveaux.innerHTML;
                            bati = niveaux.getElementsByClassName('textlabel')[0].innerHTML;
                            niveau = trim(niveau.replace(bati, '').replace(/<span class="textlabel"><\/span>/i, ''));
                        }



                        if (/\|/.test(niveau))
                        {
                            niveau = niveau.split('|')[1]
                            bc = 101;

                            if (GM_getValue('resetf' + serveur + idPlayer, '0') == '0')
                            {
                                GM_setValue('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
                                GM_setValue('resetf' + serveur + idPlayer, '5');
                            }

                            var savedData = GM_getValue('flotte' + serveur + '|' + idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
                            var niv = savedData.split('|');
                        }

                        if (/([0-9]{1,3}(\.|,))?[0-9]{1,3}(M|m)/.test(niveau))
                        {
                            niveau = niveau.replace(/,/g, '.').replace(/(M|m)/g, '') * 1000000;
                        }
                        else
                            niv[f] = Math.max(niveau.replace(/[^0-9-]/g, ""), parseInt(niv[f]));

                        if (isNaN(niv[f]))
                            niv[f] = 0;

                        //niv[f]=parseInt(niveau.replace( /[^0-9]/g, ""))
                    }

                    var listNiveau = niv.join('|');

                    if (savedData != listNiveau)
                    {
                        if (email != '' && MDP != '')
                        {
                            //var niv = listNiveau.split('|');

                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: 'http://' + www + 'mines.topraider.eu/addplanet.php',
                                data: '&Name=' + pseudo +
                                        '&Lang=' + serveur.split('.')[0].split('-')[1] +
                                        '&Mdp=' + CryptoJS.SHA1('vu' + MDP + 'lca') +
                                        '&Universe=' + serveur.split('.')[0].split('-')[0] +
                                        '&Country=' + serveur.split('.')[0].split('-')[1] +
                                        '&Email=' + email +
                                        '&Coord=' + Coord +
                                        '&ID_planete_og=' + idPlanete +
                                        '&Coloname=' + Coloname +
                                        '&isLune=' + isLune +
                                        '&Ycle=' + niv[0] +
                                        '&Yclo=' + niv[1] +
                                        '&Ycro=' + niv[2] +
                                        '&Yvb=' + niv[3] +
                                        '&Ytraq=' + niv[4] +
                                        '&Ybb=' + niv[5] +
                                        '&Ydd=' + niv[6] +
                                        '&Yrip=' + niv[7] +
                                        '&Ypt=' + niv[8] +
                                        '&Ygt=' + niv[9] +
                                        '&Yvc=' + niv[10] +
                                        '&Yrec=' + niv[11] +
                                        '&Yesp=' + niv[12] +
                                        '&OffCom=' + (document.getElementsByClassName('on commander')[0] ? 1 : 0) +
                                        '&OffAmi=' + (document.getElementsByClassName('on admiral')[0] ? 1 : 0) +
                                        '&OffGeo=' + (document.getElementsByClassName('on geologist')[0] ? 1 : 0) +
                                        '&OffIng=' + (document.getElementsByClassName('on engineer')[0] ? 1 : 0) +
                                        '&OffTech=' + (document.getElementsByClassName('on technocrat')[0] ? 1 : 0) +
                                        '&Points=' + GM_getValue('nombrePoints' + idPlayer + serveur, '0') +
                                        '&Fusion=' + GM_getValue('fusion' + serveur + '|' + idPlayer, '') +
                                        '&planeteListId=' + planeteListId +
                                        '&bc=' + bc +
                                        '&Alliance_name=' + document.getElementsByName('ogame-alliance-tag')[0].content +
                                        '&ID_alliance_og=' + document.getElementsByName('ogame-alliance-id')[0].content +
                                        '&Eco_speed=' + document.getElementsByName('ogame-universe-speed')[0].content +
                                        '&Fleet_speed=' + document.getElementsByName('ogame-universe-speed-fleet')[0].content +
                                        '&VersionScript=' + VersionReel +
                                        '&ID_player_og=' + idPlayer,
                                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                onload: function (xmlhttp)
                                {
                                    //  alert(xmlhttp.responseText);

                                    if (xmlhttp.responseText.split('|')[0] == 40)
                                    {
                                        GM_setValue('flotte' + serveur + '|' + idPlayer, listNiveau);
                                        document.getElementById('imgTRmenu').src = imgVert;
                                    }
                                    else
                                    {
                                        document.getElementById('imgTRmenu').src = imgJaune;
                                        document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML += '<br/><br/>TopRaider Error : ' + xmlhttp.responseText.split('|')[0];

                                    }
                                }
                            });



                        }
                    }

                }
            }
            else if (/page=empire/.test(location.href))
            {
                var Const = 0;
                var ConstR = 0;
                setTimeout(Empire, 1000);
            }
        }
    }




}
else if (/topraider\.eu/.test(location.href)) // SITE TOPRAIDER
{

    if (document.getElementById('versionScript').value != Version)
    {
        document.getElementById('linkscript').style.display = "block";
    }
    else
    {
        document.getElementById('linkscript').style.display = "none";
    }
}
else if (/speedsim/.test(location.href))
{

    var cout = new Array(4, 12, 4, 10, 29, 60, 40, 18, 1, 90, 2.5, 125, 10000, 85, 2, 2, 8, 37, 6, 130, 20, 100);
    var ratio = new Array(0.25, 0.25, 1, 1, 1, 1, 0.25, 0.25, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0);

    if (/plunder_perc=([0-9]+)&/.test(location.href))
        var lootsPers = parseInt(/plunder_perc=([0-9]+)&/.exec(location.href)[1]);
    else
        var lootsPers = -1;

    if (lootsPers > 0)
    {

        if (/enemy_metal=([0-9]+)&/.test(location.href))
            var enemet = /enemy_metal=([0-9]+)&/.exec(location.href)[1]
        else
            var enemet = 0;
        if (/enemy_crystal=([0-9]+)&/.test(location.href))
            var enecri = /enemy_crystal=([0-9]+)&/.exec(location.href)[1]
        else
            var enecri = 0;
        if (/enemy_deut=([0-9]+)&/.test(location.href))
            var enedeut = /enemy_deut=([0-9]+)&/.exec(location.href)[1]
        else
            var enedeut = 0;


        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
        newElement3.innerHTML = '<span id="Vague">1</span>  <span id="metAQaui">' + enemet + '</span>  <span id="criAQaui">' + enecri + '</span>  <span id="deutAQaui">' + enedeut + '</span>';
        newElement3.style.display = 'none';
        document.getElementsByTagName('fieldset')[0].appendChild(newElement3);

        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
        newElement3.innerHTML = '(' + lootsPers + '%)';
        newElement3.id = 'lootsPers';
        document.getElementsByTagName('fieldset')[6].getElementsByTagName('tr')[1].appendChild(newElement3);

        document.getElementsByName('enemy_metal')[0].parentNode.innerHTML += '<input id="enemy_metalReel" value="0" maxlength="15" size="10">';
        document.getElementsByName('enemy_crystal')[0].parentNode.innerHTML += '<input id="enemy_crystalReel" value="0" maxlength="15" size="10">';
        document.getElementsByName('enemy_deut')[0].parentNode.innerHTML += '<input id="enemy_deutReel" value="0" maxlength="15" size="10">';

        document.getElementsByName('enemy_metal')[0].style.display = 'none';
        document.getElementsByName('enemy_crystal')[0].style.display = 'none';
        document.getElementsByName('enemy_deut')[0].style.display = 'none';


        document.getElementById('nxt_wave').addEventListener("click", function (event)
        {
            document.getElementById('Vague').innerHTML = parseInt(document.getElementById('Vague').innerHTML) + 1;

            var span = document.getElementsByTagName('fieldset')[5].getElementsByTagName('tr')[7].getElementsByTagName('span');

            document.getElementById('metAQaui').innerHTML = parseInt(document.getElementById('metAQaui').innerHTML) - parseInt(span[0].textContent.replace(/[^0-9]/g, ''));
            document.getElementById('criAQaui').innerHTML = parseInt(document.getElementById('criAQaui').innerHTML) - parseInt(span[1].textContent.replace(/[^0-9]/g, ''));
            document.getElementById('deutAQaui').innerHTML = parseInt(document.getElementById('deutAQaui').innerHTML) - parseInt(span[2].textContent.replace(/[^0-9]/g, ''));

            AdaptLoots();

        }, true);

    }




    setInterval(speedSim, 500);

}
else if (/ogame1304\.de/.test(location.href) && GM_getValue('TRretroLink', 1))
{
    if (document.getElementById('optionTopRaider'))
    {
        GM_setValue('TRretroLink', 0);
    }
    else
    {

        // Bouton options
        var aff_option = '<td id="installTR"><div align="center"><font color="#FFFFFF">Install TopRaider Retro ?<br><a id="TrYes" href="http://topraider.eu/script/topraiderRETRO.user.js">Yes</a> / <a id="TrNo" href="#">No</a></font></div></td>';

        var tableau = document.createElement("tr");
        tableau.innerHTML = aff_option;
        tableau.id = 'installTopRaider';
        document.getElementsByTagName('tbody')[3].appendChild(tableau);

        document.getElementById('TrYes').addEventListener("click", function (event)
        {
            GM_setValue('TRretroLink', 0);
        }, true);
        document.getElementById('TrNo').addEventListener("click", function (event)
        {
            GM_setValue('TRretroLink', 0);
            document.getElementById('installTR').style.display = 'none';
        }, true);
    }

}


    