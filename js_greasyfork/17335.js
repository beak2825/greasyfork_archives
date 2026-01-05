// ==UserScript==
// @name        topraiderRETRO
// @description topraider RETRO
// @namespace   8b0ef7981263ec53a6d8d477a9f69680
// @include     http://ogame1304.de/game/index.php*
// @author     Vulca
// @version     1.0.3
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17335/topraiderRETRO.user.js
// @updateURL https://update.greasyfork.org/scripts/17335/topraiderRETRO.meta.js
// ==/UserScript==


/******************* Paramettres Globales ************************/

var VersionReel = '1.0-3'; // Reel
var Version = VersionReel.split('-')[0]; // MaJ
var www = "";


/******************* Fonctions Globales ************************/

function trim(string)
{return string.replace(/(^\s*)|(\s*$)/g,'');} 

function addPoints(nombre)
{
    var signe = '';
    if (nombre<0)
    {
        nombre = Math.abs(nombre);
        signe = '-';
    }
    nombre=parseInt(nombre);
    var str = nombre.toString(), n = str.length;
    if (n <4) {return signe + nombre;} 
    else 
    {
        return  signe + (((n % 3) ? str.substr(0, n % 3) + '.' : '') + str.substr(n % 3).match(new RegExp('[0-9]{3}', 'g')).join('.'));
    }
}



/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}}, n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}}, k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,f)).finalize(b)}}});var s=p.algo={};return p}(Math);(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();

/* **************************************************************/
/* ****************** FONCTIONS RC V6****************************/
/* **************************************************************/

function parseInt0(n)
{
    if(n=='')
        n=0;
    return parseInt(n);
}



//*********************************************************************************************//
//**************************** Fonction Options ****************************************//
//*********************************************************************************************//
function afficheOptions()
{ 
    // LANGUAGE 
    if(serveur.split('.')[1] == 'fr')
    {
        var txtMail = "Email pour TopRaider";
        var txtMDP = "Mot de passe pour TopRaider"; 
        var txtLink = "Activer <a href='http://"+www+"topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Activer <a href='http://"+www+"mines.topraider.eu' target='_blank'>TopMiner</a>";
        var txtLinkoption = "Autres options";
        var txtToutEnvoyer = "Tout envoyer sur TopRaider";
        var txtOptions = "Options de TopRaider";
        var txtEnvoyer = "Envoyer";
        var txtConvertir = "Convertir";
        var txtrcsent = "RC envoyé";
        var txtrc="RC";
    }
    else if(serveur.split('.')[1] == 'de')
    {
        var txtMail = "Email für TopRaider";
        var txtMDP = "Password für TopRaider"; 
        var txtLink = "Aktiviere <a href='http://"+www+"topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Aktiviere <a href='http://"+www+"mines.topraider.eu' target='_blank'>TopMiner</a>";
        var txtToutEnvoyer = "Sende alle KBs nach TopRaider";
        var txtOptions = "TopRaider Optionen";
        var txtEnvoyer = "Senden";
        var txtConvertir = "Konvertieren";
        var txtrcsent = "KB gesendet";
        var txtrc="KB";
        var txtLinkoption = "Andere options";

    }
    else
    {
        var txtMail = "Email for TopRaider";
        var txtMDP = "Password for TopRaider"; 
        var txtLink = "Activate <a href='http://"+www+"topraider.eu' target='_blank'>TopRaider</a>";
        var txtLinkBat = "Activate <a href='http://"+www+"mines.topraider.eu' target='_blank'>TopMiner</a>";

        var txtToutEnvoyer = "send All CR to TopRaider";
        var txtOptions = "TopRaider's Options";
        var txtEnvoyer = "Send";
        var txtConvertir = "Convert";
        var txtrcsent = "CR Sent";
        var txtrc="CR";
        var txtLinkoption = "Other options";

    }

    var aff2 = '<div id="topRaiderOptionsBox" style="padding:10px;z-index: 10000;width:400px;position: fixed; bottom: 30px; left: 20px; border: solid black 2px; background:rgba(0,0,100,0.7);"><center>';
    aff2+='<table><tr><td style="background:rgba(0,0,100,0.7);">'+txtMail+' :</td><td style="background:rgba(0,0,100,0.7);"><input style="width:180px;" type="text" id="mailtopraider" value="'+GM_getValue('topraideremail'+idPlayer, GM_getValue('topraideremail'+pseudo,''))+'" /></td></tr><tr><td style="background:rgba(0,0,100,0.7);">'
        +txtMDP+' :</td><td  style="background:rgba(0,0,100,0.7);"> <input class="chat_box_textarea" style="width:180px;" type="password" id="MDPtopraider" value="'+GM_getValue('topraiderMDP'+idPlayer, GM_getValue('topraiderMDP'+pseudo, ''))+'"/><span style="cursor:pointer;" id="seemdp"><img src="'+imgWink+'"/></span> </td></tr></table>';

    var isCheck = (GM_getValue('topraiderActiv'+idPlayer+serveur, 'true') == 'true' ? 'checked' : '');
    var isCheckMines = (GM_getValue('topminierActiv'+idPlayer+serveur, 'true') == 'true' ? 'checked' : '');

    aff2+='<br/><table><tr><td style="background:rgba(0,0,100,0.7);">'+txtLink + '</td><td style="background:rgba(0,0,100,0.7);"><input id="topraiderActiv" type="checkbox" '+isCheck+' /></td><td rowspan="2"  style="background:rgba(0,0,100,0.7);"><input style="margin-left:20px;" id="saveoptions" type="submit" style="cursor:pointer;" /></td></tr>';
    aff2+='<tr><td style="background:rgba(0,0,100,0.7);">'+txtLinkBat + '</td><td style="background:rgba(0,0,100,0.7);"><input id="topminierActiv" type="checkbox" '+isCheckMines+' /></td></tr></table>';

    aff2+='<br/><a href="http://'+www+'mines.topraider.eu/index.php?page=options" target="_blank">'+txtLinkoption+'</a>';

    aff2+= '</center></div>';
    var newElement3 = document.createElement("div"); // On crée un nouvelle élément div
    newElement3.innerHTML =aff2;
    newElement3.id ='topraiderOptions';

    document.getElementById('content').appendChild(newElement3);

    document.getElementById('seemdp').addEventListener("click", function(event) 
                                                       {
        if(document.getElementById('MDPtopraider').type=='text')
            document.getElementById('MDPtopraider').type='password';
        else
            document.getElementById('MDPtopraider').type='text';
    }, true);

    document.getElementById('saveoptions').addEventListener("click", function(event) 
                                                            { // Change mail => Delete colos sauvegardées

        GM_setValue('topraideremail'+idPlayer, document.getElementById('mailtopraider').value);
        GM_setValue('topraiderMDP'+idPlayer, document.getElementById('MDPtopraider').value);
        GM_setValue('topraiderActiv'+idPlayer+serveur, document.getElementById('topraiderActiv').checked+'' );
        GM_setValue('topminierActiv'+idPlayer+serveur, document.getElementById('topminierActiv').checked+'' );

        document.getElementById('topRaiderOptionsBox').parentNode.removeChild(document.getElementById('topRaiderOptionsBox'));


    }, true);

}

function sendAllRcUnParUn(n)
{
    var msg = document.getElementsByClassName('topraider Send');

    GM_xmlhttpRequest({
        method:'POST',
        url: location.href.replace('index','bericht').replace('page=messages&','')+'&bericht='+msg[n].getAttribute('idMess'),
        data:'',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        onload: function(xmlhttp2)
        {
            var message = xmlhttp2.responseText;
            document.getElementById('TRhtmlRC').innerHTML=message.split('<BODY>')[1];

            var TRhtmlRC = document.getElementById('TRhtmlRC');

            if(TRhtmlRC.getElementsByTagName('p')[0])
            {
                if(/([0-9\.]+) [^0-9/.]+([0-9\.]+) [^0-9/.]+([0-9\.]+) /.test(TRhtmlRC.getElementsByTagName('p')[0].innerHTML))
                    var loots = /([0-9\.]+) [^0-9/.]+([0-9\.]+) [^0-9/.]+([0-9\.]+) /.exec(TRhtmlRC.getElementsByTagName('p')[0].innerHTML);
                else
                    var loots = ['',0,0,0];
                var losses = /([0-9\.]+) [^0-9]+([0-9\.]+) [^0-9]+([0-9\.]+) [^0-9]+([0-9\.]+) /.exec(TRhtmlRC.getElementsByTagName('p')[1].innerHTML);



                var email = GM_getValue('topraideremail'+idPlayer,'');
                var MDP = GM_getValue('topraiderMDP'+idPlayer, '');

                var alliName='';
                var idAlli=0;
                var isAttacker=0;

                var Att = /Attacker ([^\(]+) \(([0-9]+:[0-9]+:[0-9]+)\)/.exec(TRhtmlRC.getElementsByTagName('center')[0].textContent)
                var Def = /Defender ([^\(]+) \(([0-9]+:[0-9]+:[0-9]+)\)/.exec(TRhtmlRC.getElementsByTagName('center')[1].textContent)

                if(pseudo == Att[1])
                {
                    var isAttacker=1;
                    var coordDepart = Att[2];
                }
                else if(pseudo == Def[1])
                {
                    var isAttacker=0;
                    var coordDepart = Def[2];
                }
                else
                {
                    var isAttacker=1;
                    var coordDepart = '0:0:0';
                }

                var Coord=/\[([0-9]+:[0-9]+:[0-9]+)\]/.exec(msg[n].parentNode.parentNode.textContent)[1];
                var dateFormat = '2016-'+/(At|On) ([0-9- :]+) the following/.exec(TRhtmlRC.getElementsByTagName('td')[0].textContent)[2];
                var nombre_copain=1;

                var nomVaisseauC = 
                    {
                        '400' : 
                        {
                            '5' : 0,       //pt
                            '50' : 2      //cle
                        },
                        '200':
                        {
                            '80': 14,       //lm
                            '100': 15,     //lle
                            '1' : 13       //sat
                        },
                        '800':
                        {
                            '250': 16,     //llo
                            '150' : 18     //ion
                        },
                        '10000':
                        {
                            '3000':19,     //pla
                            '1':21          //gb
                        },
                        '1000': {'150': 3},//clo
                        '2700':{'400':4},//crois
                        '6000':{'1000':5},  //vb
                        '1200':{'5':1},     //gt
                        '3000':{'50':6},    //vc
                        '7000':{'700':12}, //traq
                        '7500':{'1000':9},  //bb
                        '11000':{'2000':10},//dest
                        '900000':{'200000':11},//rip
                        '1600':{'1':7},     //rec
                        '100':{'0':8},      //esp
                        '3500':{'1100':17},//gauss
                        '2000':{'1':20}       //pb
                    };

                var arrayVaisseauxAttaquantDebut = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                var arrayVaisseauxAttaquantFin =   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

                var arrayVaisseauxDefenseurDebut = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                var arrayVaisseauxDefenseurFin =   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


                if(false)
                {
                    var nbAtt = TRhtmlRC.getElementsByTagName('table')[0].getElementsByTagName('tr')[3].getElementsByTagName('th');
                    var strucAtt = TRhtmlRC.getElementsByTagName('table')[0].getElementsByTagName('tr')[6].getElementsByTagName('th');
                    var fireAtt = TRhtmlRC.getElementsByTagName('table')[0].getElementsByTagName('tr')[4].getElementsByTagName('th');

                    for(var j=1 ; j<nbAtt.length ; j++)
                    { 
                        arrayVaisseauxAttaquantDebut[nomVaisseauC[strucAtt[j].textContent][fireAtt[j].textContent]] = nbAtt[j].textContent; 
                    }
                }


                GM_xmlhttpRequest({
                    method:'POST',
                    url:'http://topraider.eu/addrc.php',
                    data:'isAtt='+isAttacker+
                    '&Name='+pseudo+
                    '&isActiv=1'+
                    '&Mdp='+CryptoJS.SHA1('vu'+MDP+'lca')+
                    '&Universe=s999'+
                    '&Country=de'+
                    '&Email='+email+
                    '&ID_RC_og='+msg[n].getAttribute('idMess')+
                    '&Coord='+Coord+
                    '&Pillage_met='+loots[1]+
                    '&Pillage_cri='+loots[2]+
                    '&Pillage_deut='+loots[3]+
                    '&Debris_met='+losses[3]+
                    '&Debris_cri='+losses[4]+
                    '&Loss='+losses[1]+
                    '&Damages='+losses[2]+
                    '&Date_rc='+dateFormat+
                    '&Alliance_name='+alliName+
                    '&ID_alliance_og='+idAlli+
                    '&Eco_speed=1'+
                    '&Fleet_speed=1'+
                    '&repNumRC='+n+
                    '&coordDepart='+coordDepart+
                    '&nombre_copain='+nombre_copain+
                    //                    '&listVaisseau='+VaisseauDetruit.join(';')+
                    //                    '&listVaisseauEnemie='+VaisseauPerdu.join(';')+
                    '&VersionScript='+VersionReel+
                    '&ID_player_og='+idPlayer,
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    onload: function(xmlhttp)
                    {


                        var I = parseInt( xmlhttp.responseText.split('|')[0]);

                        var CR_KEY=document.getElementsByClassName("topraider Send")[I].getAttribute("idMess");

                        if(parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g,'')) ==40 || parseInt(xmlhttp.responseText.split('|')[1].replace(/[^0-9]/g,'')) ==17)
                        { // TOUT BON
                            document.getElementsByClassName("topraider Send")[I].getElementsByClassName('imgTR')[0].src=imgConv;

                            var listeRC=GM_getValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                            listeRC[parseInt(listeRC[0])+1]=CR_KEY;
                            listeRC[0]=(parseInt(listeRC[0])+1)%150;

                            GM_setValue('listeRc'+serveur+idPlayer, listeRC.join('|'));

                            var nbrcenv=document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g,'');
                            nbrcenv=(nbrcenv==''?1:parseInt(nbrcenv)+1);


                            document.getElementById('nbenvoiTR').textContent= nbrcenv;

                            addProfits(xmlhttp.responseText.split('|')[2]);
                        }
                        else
                        {
                            document.getElementsByClassName("topraider Send")[I].innerHTML+=' '+xmlhttp.responseText.split('|')[1];
                            document.getElementsByClassName("topraider Send")[I].getElementsByClassName('imgTR')[0].src=imgJaune;
                            document.getElementById('TRerrorEnvoi').innerHTML=(parseInt0(document.getElementById('TRerrorEnvoi').innerHTML.replace(/[^0-9]/g,''))+1)+' Errors'; 
                        }





                        if(I<document.getElementsByClassName("topraider Send").length-1)
                            sendAllRcUnParUn(I+1);
                        else
                        {
                            var nbrcenv=parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g,''));

                            if(nbrcenv == parseInt(document.getElementById('nbAenvoiTR').textContent))
                            {
                                document.getElementById('envoiColor').style.color='#00ff00';
                            }
                            else
                            {
                                document.getElementById('envoiColor').style.color='#ffff00';
                            }
                        }
                    }
                });

            }
            else
            {
                document.getElementsByClassName("topraider Send")[n].getElementsByClassName('imgTR')[0].src=imgConv;

                var listeRC=GM_getValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');

                listeRC[parseInt(listeRC[0])+1]=msg[n].getAttribute('idMess');
                listeRC[0]=(parseInt(listeRC[0])+1)%150;

                GM_setValue('listeRc'+serveur+idPlayer, listeRC.join('|'));

                var nbrcenv=document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g,'');
                nbrcenv=(nbrcenv==''?1:parseInt(nbrcenv)+1);


                document.getElementById('nbenvoiTR').textContent= nbrcenv;

                if(n<document.getElementsByClassName("topraider Send").length-1)
                    sendAllRcUnParUn(n+1);
                else
                {
                    var nbrcenv=parseInt(document.getElementById('nbenvoiTR').textContent.replace(/[^0-9]/g,''));

                    if(nbrcenv == parseInt(document.getElementById('nbAenvoiTR').textContent))
                    {
                        document.getElementById('envoiColor').style.color='#00ff00';
                    }
                    else
                    {
                        document.getElementById('envoiColor').style.color='#ffff00';
                    }
                }

            }

        }
    });
}

function addProfits(u)
{

    var profit=parseInt0(document.getElementById('TRBenef').innerHTML.replace(/[^0-9-]/g,''));
    profit+=parseInt(u.replace(/[^0-9-]/g,''));

    var txt= u.replace(/[0-9-]/g,'')

    document.getElementById('TRBenef').innerHTML=txt+': '+addPoints(profit);

    if(profit<0)
        document.getElementById('TRBenef').style.color="#ff0000";
    else document.getElementById('TRBenef').style.color="#00ff00";
}

function TopRaiderRetro()
{

    /* **************************************************************/
    /* ****************** DEBUT SCRIPT V6****************************/
    /* **************************************************************/

    var uni = 's999';
    var country='de';
    var alliName='';
    var idAlli='';

    // Bouton options
    var aff_option ='<td id="affOptionsTR"><div align="center"><font color="#FFFFFF"><a href="#">   TopRaider<img style="float:right;padding-right:5px;" width="20px" id="imgTRmenu" src="'+imgConv+'" /></a></font></div></td>';

    var tableau = document.createElement("tr");
    tableau.innerHTML = aff_option;
    tableau.id='optionTopRaider';
    document.getElementsByTagName('tbody')[3].appendChild(tableau);//, 

    document.getElementById('affOptionsTR').addEventListener("click", function(event) 
                                                             {
        afficheOptions();
    }, true);



    if(/page=messages/.test(location.href) && GM_getValue('topraiderActiv'+idPlayer+serveur, 'true') == 'true'  )
    {

        var txtToutEnvoyer = "send All CR to TopRaider";
        var txtOptions = "TopRaider's Options";
        var txtEnvoyer = "Send";
        var txtConvertir = "Convert";
        var txtrcsent = "CR Sent";
        var txtrc="CR";
        var txtLinkoption = "Other options";

        var sendAllRCOK=true;

        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
        newElement3.innerHTML ='<img title="'+txtToutEnvoyer+'" style="cursor:pointer;" src="'+imgSend+'" /> <div style="position:relative;top:-28px;left:75px;"><span id="envoiColor" style="font-size:0.8em;color:#00DD00;"><span id="nbenvoiTR">0</span>/<span id="nbAenvoiTR">0</span> '+txtrc+'</span> <br/> <span id="TRerrorEnvoi" style="font-size:0.8em;color:#ffff00;"></span></div>';
        newElement3.innerHTML +='<span id="TRBenef" style="font-size:0.8em;color:#00ff00;position:relative;top:-25px;left:85px;"></span><span id="TRhtmlRC" style="display:none;"></span>';
        newElement3.id="EnvoiRC" ;
        newElement3.style='position:relative;right:-100px;top:5px;';

        document.getElementById('content').getElementsByClassName('c')[0].appendChild(newElement3);
        document.getElementById('content').getElementsByClassName('c')[0].style.textAlign="center";

        document.getElementById('EnvoiRC').addEventListener("click", function(event) 
                                                            {
            var email = GM_getValue('topraideremail'+idPlayer,'');
            var MDP = GM_getValue('topraiderMDP'+idPlayer, '');
            if(email=='' || MDP=='' )
            {
                afficheOptions();
            }
            else
            {
                if(document.getElementsByClassName("topraider Send")[0])
                {
                    sendAllRCOK=false;
                    document.getElementById('envoiColor').style.color='#ff9900';
                    sendAllRcUnParUn(0);
                }
            }
        }, true);


        var idMess; 
        var nbAenvoiTR = 0;
        var msgCR = document.getElementById('content').getElementsByClassName('combatreport');
        for(var i=0; i<msgCR.length ; i++)
        {

            idMess = /bericht=([0-9]+)/.exec(msgCR[i].parentNode.getAttribute('onclick'))[1];

            var listeRC=GM_getValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
            var crkeyReg = new RegExp(idMess, "g"); 

            var newElement = document.createElement("span"); 

            if(! crkeyReg.test(listeRC))
            {
                newElement.innerHTML ='<span class="topraider Send '+i+'" idMess="'+idMess+'" ><img style="cursor:pointer;width:18px;float:right;" class="imgTR" src="'+imgRouge+'" /></span>';
                nbAenvoiTR++;
            }
            else
            {
                newElement.innerHTML ='<span class="topraider '+i+'" ><img style="cursor:pointer;width:18px;float:right;" class="imgTR" src="'+imgConv+'" /></span>';
            }

            msgCR[i].appendChild(newElement);
        }
        
        var tableSpy = document.getElementsByTagName('table');
        for(var i=0 ; i < tableSpy.length ; i++)
        {
            if(tableSpy[i].getElementsByTagName('td')[0])
            {
                if(/Resources on /.test(tableSpy[i].getElementsByTagName('td')[0].textContent))
                {
                    
                    var coord = /\[([0-9]+):([0-9]+):([0-9]+)\]/.exec(tableSpy[i].getElementsByTagName('td')[0].textContent);
                    var met = parseInt(tableSpy[i].getElementsByTagName('td')[2].textContent.replace(/[^0-9]/g,''))
                    var cri = parseInt(tableSpy[i].getElementsByTagName('td')[4].textContent.replace(/[^0-9]/g,''))
                    var deut = parseInt(tableSpy[i].getElementsByTagName('td')[6].textContent.replace(/[^0-9]/g,''))

                    var newElement = document.createElement("tr"); 
                    newElement.innerHTML = '<td><center><a href="'+location.href.replace('messages','flotten1')+'&am210='+((met+cri+deut)/10)+
                        '&galaxy='+coord[1]+'&system='+coord[2]+'&planet='+coord[3]+'&planettype=1&target_mission=1">'+addPoints((met+cri+deut)/10)+' Prob</a> | ';
                    newElement.innerHTML += '<a href="'+location.href.replace('messages','flotten1')+'&am202='+Math.ceil((met+cri+deut)/10000)+
                        '&galaxy='+coord[1]+'&system='+coord[2]+'&planet='+coord[3]+'&planettype=1&target_mission=1">'+addPoints(Math.ceil((met+cri+deut)/10000))+' SC</a></center></td>';
                    tableSpy[i].appendChild(newElement);
                   
                }
            }

        }


        document.getElementById('nbAenvoiTR').innerHTML = nbAenvoiTR;
        if(nbAenvoiTR >0)
            document.getElementById('envoiColor').style.color='#ff0000';

    }
    else if(/page=flotten1/.test(location.href))
    {
        if(/am([0-9]{3})=([0-9]+)/.test(location.href))
        {
            var uu = /am([0-9]{3})=([0-9]+)/.exec(location.href);
            
            if(document.getElementsByName('ship'+uu[1])[0])
            {
                document.getElementsByName('ship'+uu[1])[0].value=uu[2]
            }
        }
        
        var input = document.getElementsByTagName('input');
        for (var i =0 ; i< input.length ; i++)
        {
            if(input[i].value == 'continue')
                input[i].focus();
        }  
    } 
    else if(/page=flotten(2|3)/.test(location.href))
    {
        var input = document.getElementsByTagName('input');
        for (var i =0 ; i< input.length ; i++)
        {
            if(input[i].value == 'continue')
                input[i].focus();
        }  
    }
    else if(/page=(overview)/.test(location.href))
    {
        var pseudoS = /\(([^\)]+)\)/.exec(document.getElementsByClassName('c')[0].innerHTML)[1];
        var PointsTotal = document.getElementsByTagName('table')[5].getElementsByTagName('th')[12].innerHTML.split('(')[0].replace(/[^0-9]/g, '') ;
        GM_setValue('nombrePoints'+idPlayer+serveur, PointsTotal);
        GM_setValue('Pseudo'+idPlayer+serveur, pseudoS);

    }
    else if(/(page|mode)=(b_building|defense|Forschung|Verteidigung|Flotte)/.test(location.href) && GM_getValue('topminierActiv'+idPlayer+serveur, 'true') == 'true')
    {
        var PlaneteNode = document.getElementsByTagName('select')[0].getElementsByTagName('option');
        var planeteListId='';

        for(var i=0; i<PlaneteNode.length ; i++)
        {
            planeteListId += /cp=([0-9]+)[^0-9]/.exec(PlaneteNode[i].value)[1]+'|' ;

            if(PlaneteNode[i].selected)
            {
                var idPlanete = /cp=([0-9]+)[^0-9]/.exec(PlaneteNode[i].value)[1];

                var u = /([^\[]+)\[([0-9]+:[0-9]+:[0-9]+)\]/.exec(PlaneteNode[i].textContent);
                var Coord = u[2];
                var Coloname = u[1];
                var isLune = (true?0:1);
            }  
        }


        var email = GM_getValue('topraideremail'+idPlayer,'');
        var MDP = GM_getValue('topraiderMDP'+idPlayer, '');
        if(email=='' || MDP=='' )
        {
            afficheOptions();
        }
        else
        {
            if(/page=b_building/.test(location.href))
            {
                var trNode = document.getElementById('content').getElementsByTagName('tr');
                var listNiveau= [];
                var Const =0;

                var id =0;

                if(isLune)
                    var temp = 0;
                else
                    var temp = GM_getValue('topraidertemp'+idPlanete+serveur,0);

                listNiveau[1]=0;
                listNiveau[2]=0;
                listNiveau[3]=0;
                listNiveau[4]=0;
                listNiveau[12]=0;
                listNiveau[212]=0;
                listNiveau[22]=0;
                listNiveau[23]=0;
                listNiveau[24]=0;

                listNiveau[14]=0;
                listNiveau[21]=0;
                listNiveau[31]=0;
                listNiveau[34]=0;
                listNiveau[44]=0;
                listNiveau[15]=0;
                listNiveau[33]=0;
                listNiveau[41]=0;
                listNiveau[42]=0;
                listNiveau[43]=0;



                for (var f=0; f<trNode.length; f++)
                {
                    id=/gid=([0-9]+)/.exec(trNode[f].getElementsByTagName('a')[0].href)[1];

                    if(/\(level ([0-9]+)\)/.test(trNode[f].getElementsByTagName('td')[1].innerHTML))
                        listNiveau[id]=/\(level ([0-9]+)\)/.exec(trNode[f].getElementsByTagName('td')[1].innerHTML)[1].replace(/[^0-9]/g,'');

                    if(/Cancel/.test(trNode[f].getElementsByTagName('td')[2].innerHTML))
                        Const=id;
                }

                var listNiveauDD =listNiveau[1]+';'+listNiveau[2]+';'+listNiveau[3]+';'+listNiveau[4]+';'+listNiveau[12]+';'+listNiveau[212]+';'+listNiveau[22]+';'+listNiveau[23]+';'+listNiveau[24]+';'+
                    listNiveau[14]+';'+listNiveau[21]+';'+listNiveau[31]+';'+listNiveau[34]+';'+listNiveau[44]+';'+listNiveau[15]+';'+listNiveau[33]+';'+
                    listNiveau[41]+';'+listNiveau[42]+';'+listNiveau[43]+';'+Const;

                var savedData = GM_getValue('mines'+serveur+'|'+idPlayer+'|'+idPlanete, '');

                if(savedData != listNiveauDD)
                {

                    if( email!='' && MDP!='' )
                    {   



                        GM_xmlhttpRequest({
                            method:'POST',
                            url:'http://'+www+'mines.topraider.eu/addplanet.php',
                            data:'&Name='+pseudo+

                            '&Lang='+serveur.split('.')[1]+
                            '&Mdp='+CryptoJS.SHA1('vu'+MDP+'lca')+
                            '&Universe='+uni+
                            '&Country='+country+
                            '&Email='+email+
                            '&Coord='+Coord+
                            '&ID_planete_og='+idPlanete+   
                            '&Coloname='+Coloname+
                            '&isLune='+isLune+
                            '&met='+listNiveau[1]+   
                            '&cri='+listNiveau[2]+   
                            '&deut='+listNiveau[3]+   
                            '&ces='+listNiveau[4]+   
                            '&cef='+listNiveau[12]+   
                            '&sat='+listNiveau[212]+   
                            '&hm='+listNiveau[22]+   
                            '&hc='+listNiveau[23]+   
                            '&hd='+listNiveau[24]+
                            '&rob='+listNiveau[14]+   
                            '&cs='+listNiveau[21]+   
                            '&lab='+listNiveau[31]+   
                            '&depo='+listNiveau[34]+   
                            '&silo='+listNiveau[44]+   
                            '&nan='+listNiveau[15]+   
                            '&ter='+listNiveau[33]+   
                            '&base='+listNiveau[41]+   
                            '&pha='+listNiveau[42]+
                            '&pss='+listNiveau[43]+
                            '&temp='+temp+
                            '&const='+Const+

                            '&OffCom=0'+
                            '&OffAmi=0'+
                            '&OffGeo=0'+
                            '&OffIng=0'+
                            '&OffTech=0'+
                            '&Points='+GM_getValue('nombrePoints'+idPlayer+serveur, '0')+

                            '&planeteListId='+planeteListId+

                            '&Alliance_name='+alliName+
                            '&ID_alliance_og='+idAlli+
                            '&Eco_speed=1'+
                            '&Fleet_speed=1'+
                            '&VersionScript='+VersionReel+
                            '&ID_player_og='+idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function(xmlhttp)
                            {

                                if(xmlhttp.responseText.split('|')[0] == 40)
                                {   
                                    GM_setValue('mines'+serveur+'|'+idPlayer+'|'+idPlanete, listNiveauDD); 
                                    document.getElementById('imgTRmenu').src=imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src=imgJaune;
                                    //      document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML+='<br/><br/>TopRaider Error : '+xmlhttp.responseText.split('|')[0];

                                }
                            }
                        });



                    }
                }

            }
            else if (/mode=Forschung/.test(location.href))
            {   
                var trNode = document.getElementById('content').getElementsByTagName('tr');
                var listNiveau= [];
                var Const =0;

                var id =0;

                if(isLune)
                    var temp = 0;
                else
                    var temp = GM_getValue('topraidertemp'+idPlanete+serveur,0);

                listNiveau[113]=0;
                listNiveau[120]=0;
                listNiveau[121]=0;
                listNiveau[114]=0;
                listNiveau[122]=0;
                listNiveau[115]=0;
                listNiveau[117]=0;
                listNiveau[118]=0;
                listNiveau[106]=0;   
                listNiveau[108]=0;
                listNiveau[124]=0;
                listNiveau[123]=0;
                listNiveau[199]=0;
                listNiveau[109]=0;
                listNiveau[110]=0;
                listNiveau[111]=0;

                for (var f=0; f<trNode.length; f++)
                {
                    id=/gid=([0-9]+)/.exec(trNode[f].getElementsByTagName('a')[0].href)[1];


                    listNiveau[id]=trNode[f].getElementsByTagName('td')[2].textContent.replace(/[^0-9]/g,'');
                    if(listNiveau[id] == '') listNiveau[id]=0;
                    if(listNiveau[id]>0)
                        listNiveau[id]--;

                    if(/cancel/.test(trNode[f].getElementsByTagName('td')[2].textContent))
                        Const=id;

                }

                var listNiveauDD=listNiveau[113]+';'+listNiveau[120]+';'+listNiveau[121]+';'+listNiveau[114]+';'+listNiveau[122]+';'+listNiveau[115]+';'+
                    listNiveau[117]+';'+listNiveau[118]+';'+listNiveau[106]+';'+listNiveau[108]+';'+listNiveau[124]+';'+listNiveau[123]+';'+
                    listNiveau[199]+';'+listNiveau[109]+';'+listNiveau[110]+';'+listNiveau[111]+';';

                if(Const==0)
                    listNiveauDD+=Const;
                else
                {
                    var UU=GM_getValue('technos'+serveur+'|'+idPlayer, '').split(';')
                    UU[16]=Const;

                    listNiveauDD=UU.join(';');
                }

                var savedData = GM_getValue('technos'+serveur+'|'+idPlayer, '');

                if(savedData != listNiveauDD)
                {
                    if( email!='' && MDP!='')
                    {   
                        var niv = listNiveauDD.split(';');

                        GM_xmlhttpRequest({
                            method:'POST',
                            url:'http://'+www+'mines.topraider.eu/addplanet.php',
                            data:'&Name='+pseudo+

                            '&Lang='+serveur.split('.')[1]+
                            '&Mdp='+CryptoJS.SHA1('vu'+MDP+'lca')+
                            '&Universe='+uni+
                            '&Country='+country+
                            '&Email='+email+
                            '&Coord='+Coord+
                            '&ID_planete_og='+idPlanete+   
                            '&Coloname='+Coloname+
                            '&isLune='+isLune+
                            '&ene='+niv[0]+   
                            '&las='+niv[1]+   
                            '&Tion='+niv[2]+   
                            '&thyp='+niv[3]+   
                            '&pla='+niv[4]+   
                            '&com='+niv[5]+   
                            '&imp='+niv[6]+   
                            '&phyp='+niv[7]+   
                            '&esp='+niv[8]+   
                            '&ord='+niv[9]+   
                            '&ast='+niv[10]+   
                            '&rri='+niv[11]+   
                            '&gra='+niv[12]+   
                            '&arm='+niv[13]+   
                            '&bou='+niv[14]+   
                            '&pro='+niv[15]+   
                            '&const='+Const+   

                            '&OffCom=0'+
                            '&OffAmi=0'+
                            '&OffGeo=0'+
                            '&OffIng=0'+
                            '&OffTech=0'+
                            '&Points='+GM_getValue('nombrePoints'+idPlayer+serveur, '0')+

                            '&planeteListId='+planeteListId+

                            '&Alliance_name='+alliName+
                            '&ID_alliance_og='+idAlli+
                            '&Eco_speed=1'+
                            '&Fleet_speed=1'+
                            '&VersionScript='+VersionReel+
                            '&ID_player_og='+idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function(xmlhttp)
                            {
                                if(xmlhttp.responseText.split('|')[0] == 40)
                                {   
                                    GM_setValue('technos'+serveur+'|'+idPlayer, listNiveauDD); 
                                    document.getElementById('imgTRmenu').src=imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src=imgJaune;
                                    //  document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML+='<br/><br/>TopRaider Error : '+xmlhttp.responseText.split('|')[0];

                                }

                            }
                        });

                    }
                }
            }

            else if(/mode=Verteidigung/.test(location.href))
            {
                var trNode = document.getElementById('content').getElementsByTagName('table')[0].getElementsByTagName('tr');
                var listNiveau= [];
                var Const =0;
                var id =0;

                listNiveau[401]=0;
                listNiveau[402]=0;
                listNiveau[403]=0;
                listNiveau[404]=0;
                listNiveau[405]=0;
                listNiveau[406]=0;
                listNiveau[407]=0;
                listNiveau[408]=0;
                listNiveau[502]=0;   
                listNiveau[503]=0;

                for (var f=0; f<trNode.length; f++)
                {
                    if(trNode[f].getElementsByTagName('a')[0])
                    {
                        id=/gid=([0-9]+)/.exec(trNode[f].getElementsByTagName('a')[0].href)[1];

                        if(/\(([0-9\.]+) available\)/.test(trNode[f].getElementsByTagName('td')[1].innerHTML))
                            listNiveau[id]=/\(([0-9\.]+) available\)/.exec(trNode[f].getElementsByTagName('td')[1].innerHTML)[1].replace(/[^0-9]/g,'');


                    }
                }

                var listNiveauDD=listNiveau[401]+';'+listNiveau[402]+';'+listNiveau[403]+';'+listNiveau[404]+';'+listNiveau[405]+';'+listNiveau[406]+';'+
                    listNiveau[407]+';'+listNiveau[408]+';'+listNiveau[502]+';'+listNiveau[503];

                var savedData = GM_getValue('defense'+serveur+'|'+idPlayer+'|'+idPlanete, '');

                if(savedData != listNiveauDD)
                {
                    if( email!='' && MDP!='')
                    {   
                        var niv = listNiveauDD.split(';');

                        GM_xmlhttpRequest({
                            method:'POST',
                            url:'http://'+www+'mines.topraider.eu/addplanet.php',
                            data:'&Name='+pseudo+

                            '&Lang='+serveur.split('.')[1]+
                            '&Mdp='+CryptoJS.SHA1('vu'+MDP+'lca')+
                            '&Universe='+uni+
                            '&Country='+country+
                            '&Email='+email+
                            '&Coord='+Coord+
                            '&ID_planete_og='+idPlanete+   
                            '&Coloname='+Coloname+
                            '&isLune='+isLune+
                            '&lm='+niv[0]+   
                            '&lle='+niv[1]+   
                            '&llo='+niv[2]+   
                            '&gau='+niv[3]+   
                            '&lpla='+niv[4]+   
                            '&aion='+niv[5]+   
                            '&pb='+niv[6]+   
                            '&gb='+niv[7]+   
                            '&mi='+niv[8]+
                            '&mip='+niv[9]+

                            '&OffCom=0'+
                            '&OffAmi=0'+
                            '&OffGeo=0'+
                            '&OffIng=0'+
                            '&OffTech=0'+
                            '&Points='+GM_getValue('nombrePoints'+idPlayer+serveur, '0')+

                            '&planeteListId='+planeteListId+

                            '&Alliance_name='+alliName+
                            '&ID_alliance_og='+idAlli+
                            '&Eco_speed=1'+
                            '&Fleet_speed=1'+
                            '&VersionScript='+VersionReel+
                            '&ID_player_og='+idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function(xmlhttp)
                            {
                                //  alert(xmlhttp.responseText);

                                if(xmlhttp.responseText.split('|')[0] == 40)
                                {   
                                    GM_setValue('defense'+serveur+'|'+idPlayer+'|'+idPlanete, listNiveauDD); 
                                    document.getElementById('imgTRmenu').src=imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src=imgJaune;
                                    //        document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML+='<br/><br/>TopRaider Error : '+xmlhttp.responseText.split('|')[0];
                                }
                            }
                        });

                    }
                }

            }
            else if(/mode=Flotte/.test(location.href))
            {

                var savedData = GM_getValue('flotte'+serveur+'|'+idPlayer, '0|0|0|0|0|0|0|0|0|0|0|0|0');
                var niv = savedData.split('|');

                var trNode = document.getElementById('content').getElementsByTagName('table')[0].getElementsByTagName('tr');
                var listNiveau= [];
                var Const =0;
                var id =0;

                listNiveau[204]=0;
                listNiveau[205]=0;
                listNiveau[206]=0;
                listNiveau[207]=0;
                listNiveau[215]=0;
                listNiveau[211]=0;
                listNiveau[213]=0;
                listNiveau[214]=0;
                listNiveau[202]=0;   
                listNiveau[203]=0;
                listNiveau[208]=0;
                listNiveau[209]=0;
                listNiveau[210]=0;

                var num = [];
                num[204]=0;
                num[205]=1;
                num[206]=2;
                num[207]=3;
                num[215]=4;
                num[211]=5;
                num[213]=6;
                num[214]=7;
                num[202]=8;   
                num[203]=9;
                num[208]=10;
                num[209]=11;
                num[210]=12;

                for (var f=0; f<trNode.length; f++)
                {
                    if(trNode[f].getElementsByTagName('a')[0])
                    {
                        id=/gid=([0-9]+)/.exec(trNode[f].getElementsByTagName('a')[0].href)[1];

                        if(/\(([0-9\.]+) available\)/.test(trNode[f].getElementsByTagName('td')[1].innerHTML))
                            listNiveau[id]=parseInt(/\(([0-9\.]+) available\)/.exec(trNode[f].getElementsByTagName('td')[1].innerHTML)[1].replace(/[^0-9]/g,''));

                        niv[num[id]]=Math.max(listNiveau[id], parseInt(niv[num[id]]));

                        if(isNaN( niv[num[id]] ))
                            niv[num[id]]=0;

                    }
                }

                var listNiveauDD=niv.join('|');

                if( savedData != listNiveauDD)
                {
                    if( email!='' && MDP!='')
                    {   
                        //var niv = listNiveau.split('|');

                        GM_xmlhttpRequest({
                            method:'POST',
                            url:'http://'+www+'mines.topraider.eu/addplanet.php',
                            data:'&Name='+pseudo+

                            '&Lang='+serveur.split('.')[1]+
                            '&Mdp='+CryptoJS.SHA1('vu'+MDP+'lca')+
                            '&Universe='+uni+
                            '&Country='+country+
                            '&Email='+email+
                            '&Coord='+Coord+
                            '&ID_planete_og='+idPlanete+   
                            '&Coloname='+Coloname+
                            '&isLune='+isLune+
                            '&Ycle='+niv[0]+   
                            '&Yclo='+niv[1]+   
                            '&Ycro='+niv[2]+   
                            '&Yvb='+niv[3]+   

                            '&Ytraq='+niv[4]+   
                            '&Ybb='+niv[5]+
                            '&Ydd='+niv[6]+
                            '&Yrip='+niv[7]+
                            '&Ypt='+niv[8]+   
                            '&Ygt='+niv[9]+   
                            '&Yvc='+niv[10]+
                            '&Yrec='+niv[11]+
                            '&Yesp='+niv[12]+

                            '&OffCom=0'+
                            '&OffAmi=0'+
                            '&OffGeo=0'+
                            '&OffIng=0'+
                            '&OffTech=0'+
                            '&Points='+GM_getValue('nombrePoints'+idPlayer+serveur, '0')+

                            '&planeteListId='+planeteListId+

                            '&Alliance_name='+alliName+
                            '&ID_alliance_og='+idAlli+
                            '&Eco_speed=1'+
                            '&Fleet_speed=1'+
                            '&VersionScript='+VersionReel+
                            '&ID_player_og='+idPlayer,
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            onload: function(xmlhttp)
                            {
                                //  alert(xmlhttp.responseText);

                                if(xmlhttp.responseText.split('|')[0] == 40)
                                {   
                                    GM_setValue('flotte'+serveur+'|'+idPlayer, listNiveauDD); 
                                    document.getElementById('imgTRmenu').src=imgVert;
                                }
                                else
                                {
                                    document.getElementById('imgTRmenu').src=imgJaune;
                                    // document.getElementById('buttonz').getElementsByClassName('footer')[0].innerHTML+='<br/><br/>TopRaider Error : '+xmlhttp.responseText.split('|')[0];

                                }
                            }
                        });



                    }
                }

            }
        }

    }
}






function getIdPlayer()
{
    var PlaneteNode = document.getElementsByTagName('select')[0].getElementsByTagName('option');
    var minIdPlanete=999999999999999999999999;
    var minCoord = '';
    var id='';

    for(var i=0; i<PlaneteNode.length ; i++)
    {
        id= /cp=([0-9]+)[^0-9]/.exec(PlaneteNode[i].value)[1] ; 

        if(id < minIdPlanete)
        {
            minIdPlanete=id;
            minCoord= /\[([0-9]+:[0-9]+:[0-9]+)\]/.exec(PlaneteNode[i].textContent)[1];
        }



    }

    return minCoord.replace(/:/g, '0') ;
}

if(/ogame/.test(location.href))
{
    var imgConv =  "data:image/png;base64,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";
    var imgRouge = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABGdBTUEAAK/INwWK6QAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAABQJJREFUSMetlktsE1cUhr8Zz4yfiWMnduw4ECAOhIDKQyGCVlQUJFQVqQh10dcmEosKIbGp6Lp7xKJdNIuqEqsuKlVQISG1XZSoUAGltAkJafNyHn4kjuNn/Jyxp4vYwYlD6YJfOtKdO0f/f885v+9YABgEnwSXZBgUwccrQAVCKtzQYOgGhIRB2NkM8wNAB6C8ChWgBISBR0AauiQJLh0FXEBm/SSvBGKV8yhwDy5JClx0AanqKUrVRF0Q1hcGCb1cRtQrPDj+ARnFiic4QV/gAQb9xcdSgGJVTIGLkgAuDVgDynWJq979ZBUTWvcBLOUyvnyUcM9JFkLLzHbbcOQiOJttpFdXca2GG4Ty1UMbAQFcElXl8pbEyV0DxNxeJKeXLo8dz74ujgVn8e/q5en4FPf73kJxORBjEV4vpYgvBPDPP9vEUa5y11q5CRoiMwdPM2c1kMiEWAyMMDExyq3bd3B3dAMSVqXAmlhmIVrB0HGIO2YPtxyd/zkz6bkAzOw7wfiRdxDyCVLh39EFBVMqxoFHAfzZNL89e8gzu4ND/Wfo7x9gcuIJI+OPUItJfPE5tP8QMgzA5zuBHJAtZmmaecxrY7/yxN6N0ZSgoPjoiUewF3N0rswjmaxEgD+GbzIVDNDS5kVWTOxdmkOzt6KoJQyaig7ogBlYqLWuUo2OtQQ9qSjmcpEd7b1EUk4MTR5m3b0URRnt8DGcrTYsk8OciIUZOP42rU0SbS4vD3f0oSYTKIXsBl8tNirqrLqu/qVqMKPvP4xg7WWtqQ35oI+W8+8SsPgZiybYuzSLzeZA3t0DgoTR6maPlkFZCW7isQDBWkXaFpEK4J8eptPXh6elzIXz5+j9sJuz73VRyC8h2tpZtDTjufcDNkMTNhP4e48SPHK6gac2t43WbffLbvlxCJ9LQSss0ud7g52uQ+zeJ5DNZrDJZgzFLKa7t1mOlwgtJ8HuIObcuYmnUi9UfkF0zo1gCM6ylokwNqpy7atrTM2kkM1OmhUDZUHAFHhKcylLIvSYcFoitHtvA88me38GeIFI9dkLXC5rNP/yPcmWQcLLf/Hg/iiIRhSpxHCri7MrDhQ1j760xKqaYXVNRtILZBGQ0Rvt3QYMAP3AP8DV6loHhEyS/N+jTMoWNLmFDq8TyegivzBHTzxI3tsFFZ35SgFZyFPMp2hNpTCV1Q17R2sV1dswss3M4ojEcyreHR0YLa30+mx0nDtPanyMysIskeUw+dgksqFE1uJm5Mwpjt39Gms+tXlG9Wjdxhh7cikMRQ1DKo08/jPxhQBqPkTX8VPY3ryA1nMCyWTEbG0C0Uoql2DRYm+8gio8v/ykunUNBaMFf2QC19hPGNFRV5aYmn7KlPseMSxgduFsaaO0EMKvRdHNZjqTYYp13REug+4HlreQX6s6ph34WFaQ1FJD+QVrC7EjJwnbzKTiQfpG/8RXyK/PtprTDkzXV7T1M2EFPqmJqiWubsnJt3lIn34fx92bRK0ia5KEJgoNPLWKJF6AdF1lV7d5r8SjtH/3BQBunw+jYKBotUEuty2fpMNKGVxbneauinzK9jeHUKls7DsSSbA7MBZKDbllQIcVsQTf5Fm3n1oXUeAKcH3L/nYh5LLY4jGsmeSmfZGNT/oNUYehNCBXYyuuAF/ycijFwqbnGl96vaIhgfX2+OX1P5AfieD5H7wvRQWWVPhWhaHrMP0vCSYVKv55lGYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDYtMjJUMDM6MDY6MzMrMDI6MDBaCt/EAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTA2LTIyVDAzOjA2OjMzKzAyOjAwK1dneAAAAEp0RVh0c2lnbmF0dXJlAGYxOWFkMjc4OTZkNTJkMGU3YTAxMzBhNDYzZjJhNGE0MjY0NDBlNDI5ZmE0YmRlMmEyYjRhMmY5NzU0YWY2ZDBw9XuHAAAAAElFTkSuQmCC";
    var imgJaune = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsSAAALEgHS3X78AAADvElEQVR42q2WbUxTVxjHj9QWGJ1Lpg5kvDUCpWl5aUvXMtqmFttbHKUUirUQdC3RqjA2yepwSOJbNkFhbBqNJCZun/YWv7glbslifEmM7tOyL9uXjSxL+LCFZCHGRsH/nnNLwG4Ubhua/HLbc849vz7PffKcyxh98ovLjcQ9Yp7AOjG/uKeRLUosBSUVAJg04sQYMSttPd+bO7jovmQJ5zrBiNvS7+EOLlqQeoOt+S3MZuclRK60RAtctOJkvSMEE9ESjMG75z20dw3giqkDT7NkmM57Gchm6HS1SxUhpajxjRhc7cfhD3+Md45dw9S1W4hn5+IXlQ5HbG9inoQ/qLRweMJoDfbBaGtNX9QoRGBz74fV2UORRSC0DeI7VQ2eyhUYHpyCNziEmVwlHsvkaOs5C6u7F5W1Lumi15zd8ARPockfS148RygYviosh8HiQ7j/E3y5910xqslSHdR1zsxTxzGZDdCZWhIP/kXiEYOh0ZcoBr5mC8McRVnv2CP+rmvwpC8yN8dQVLUTAUsAzzZsACYYPL5uuL2hJdFVq1ecO273Q2MUMouo2toDR+sRTG8qwN85Svi7oxidvExpG18Stbb3Ia5QYPYFJdyBIdiErsxSN97chyeyjbh+aAyTX4zg5z++Qag3tpw64obZLUY10n8BgfCJzER/UTnPbC3AhxOf4/t7N/HP4z/x/tjRJJHdtU8siunNRdhL0VYZ3WmKzhIbGY75D2L45EeYuHQDw+cH0BmNiiL967uW1t4tUWOBouoOnIDZuXt1EfVXKHJyxaucmOMFsJM2bBAQHTiD8OHT0NQ6oNELSRFxLK5ezNP6u5tLYbR6pEWkoHThEBNbDGaWx63OIPTWLgi+SJJITyWtt+/Gj8qX8IRSKHZ3KaJCvomc2Je8WGdug6djAL6ek3h7aByjF7/FgcELaAkNkSgEQ1kFRZWFr18pQcOuo2uLblGVQfn/f6Wub6PufQAWm0eM6My5KVz59CGGR29CCH2A7VU1+D1PibhMhlp7ZA3RTwxx/mzOp24nxeXVosjW5IO3I4omXz/cnSMwWZwIFFdSBWZh/FX1GiItUZD4zkgoFoYiJ6VUVWWk5tuFHUInDKaGxHg+sWm1Z3Rn8eRcL35NJfqNOLU8yVjydTU0ujpoq/VQVWgTY58tdvz/iFY8yuWKbEkSTmlFNdRaA8rKdase5Su+nKQTkYSj/AFLNfm8IFNZ0XYdtpWpsa200i6+29m3Fh5uzC9+pFZpKA016wLfi+9pzy+KcMe/0RQ7ZHGeWn8AAAAASUVORK5CYII=";
    var imgSend =  "data:image/png;base64,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";
    var imgSpeedSim="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAbCAYAAACAyoQSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOLSURBVEhLvVY7TBRhEJ7d23twgHB4hKfg4QN6PRMLYklFRwOJJibGSGEojCGxtrHQhFjYaSykusKEypJYaGLsCSRGoxJULofAwe3dPpyZ/3G7exzEePHb25vHPzvzz8y///5G90DOB0QsZkIykYJ4PAFWLAY+awUMQzJNQLZBGyW7ngtV2wa7ZoPruqgTRkbP0Bi772hrh1OZXkh3doNpWeB7njby0Qvxih6HoI3rOlDZ34XfpZ9QLpfBA5GJ0Tt8jrnevmEO6Do1fNDjwaYQz+LTeBPPMfCPUpTwUTQxuBVPwv5uCbZ/fAMHEyEYfSPn2XJodJwD0uwYAQeEYByGylyKOjaBGFYYELPi2DoLNr+sg+0I36aBFnRR/R2ZJZWWniGnijICMusi49reU9QDp1Zl38G2YAUwJM2aAlFZ2RcFdv+d0qV1YmIEU1KKxDcZtQzSJ6cdgEmy0GFA2ehWQbWBEgmW1+gfucAxs/1nuP6mWU++AZOLsDCflwLhA7yZewRrUorCk0lYiSQUt75CpVZjOVBemlnzTLOzS5GAhDxMLS/ChJSi4H7KEod6qhcSXYGBMHIwfnmIudLKfViam8H7KXxiTR6uzOaYi0KVNupXZ8oGf9XTVdj4KLjM4IhgIiB/VGLyHerpwOhFnkYmO4D75CEkkikeiGLiXgGmLknhhF4qVO0K0zj63NneqvdUlMAXMzom07XHqpwE6mUBFvCenpSqI6B9UluljqB7Supo7cNYhRXs5auV71IWGJsvwI0mPaWVIvyGk9HlpS+MXTmAdHsnD5yMazC9fBfGmD+63AflPd6GE6k07JZ+NZZXlKFJpvR+cjmDrwdm/uA1lJgfhNNnmQmhvpDCKzi8epsFffv+yNcjezUPGeY2ofiZmQhEeZkEoHekzq4eLm+zuP03X8KtmWEphVEs3IFnLzak1IhUW5q/qQ07ki6xnp3kJd16fh0ePnmHfBjFwm0MuN5gH6Zh6IWU7ugC+7DMSla0ECk8CpX3duofcSonl5QylZeYYYspr2MBLK9Qqu2KjPjL30Lqueib4wiYLgbjG89GvEWgEU1CbRitoB6eHDycgIIOWqtWwDBjqKIDl9zCkNL5hmcrZXLAejzHBvXCTo37LGNE/Jm8pzskS+iTAy1nGzdo8RA5UqtPlIj4+naGMiVCnLQTorIV8HBiNiajXhUFIzMoTvj/DwB/AKdf8pfHNHsiAAAAAElFTkSuQmCC";
    var imgWink =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAACXBIWXMAAAsRAAALEQF/ZF+RAAADa0lEQVQ4T9WUe0xTZxjG33NOuZRLy7zFOKPBZGxmcdEQF7YYmdopGC9kAxFNGVZA48zYqFFhFbJonMxr4h+owVpRhojV0ioiiGYDIl4QKDDFLcFirAZRwsVCO+2z92j/UcD4707yJF/O+b7f97zf836H6H/xABBYCpb42jCEyXs7lWPz7oSSvimYEiC9VyE+0CuI1+tVxV0fWjLrcn/FOKvnfsDR504xr8sh6ipv0IpL64g3fSdUhskTPPBE3h14ac98AoTcAqjcBSp8BvqtE6S7CMXX+yDO391I0ScmjwrMzYUol2hzelrvu73QOLzw/4thdf+CzH2g/Q8x+0AjpmVfA8WWgBYV9dIXBVNHBUaUdh861QNo7rjxQUMPxCsPQLe9oLJ+BB1ywniyCC2tjdAdrAVpjrFM1SPD9neEzTQPdE+yckl/DGJSfS+Uln8g5Z4FWdyIKnZieYwGyVotGuyNUCWYICWcAy0tjBkGlLa2aUJ3OzC+oBOLzzuwqsqBb043Y0K+HXSsD4utTxGX8QuE8R+hrrkdP5c2gRLNCNBdMA+Dien12UKmHYptd0F7ubz8LpCpH8KRPoh7ukEGDmDzPVBmAyj+DGhlCQStBaEZNW2UfsvvTWCSbTtpq0Br+Tx+Yjc5HaAdTtD2R6/Hm1pA39dwouVQpFkwVl8JSq5EmOFee+RhvAWLLUqmpZxSPJ/Rd9WgDdcZ2gzS2yHob0LKrIWkr4Yyuxp+G20ITK1geCvUu5y1xJ3wpjPN4Sm0wOSm2OMQEk9DSrPCP6McwYbLUP1ag6Ct5fDfcBaCzsbu2H1qK6Q8FyaaXIbhiUZfVdA8401aWAhaXgRacQpC0u8QVxZCiDeCvj3Orku5tDpQWjtoy2OojUOu+BKvcuT2+LLgY4opBi3jRXLsSRZWGWg1l6T9E5TCCaZ1QNrchU+KX3gjK18kjda0r66TerXtK9UPTW5K54Up9awboDUcyNq/QekPoDD0IuoCMNfaneMDjXhP5UOULYdMT8xaELanvUU6+Nwj7XLBb9sAlDkuTMsffBlX1vXoU8OJVJ4XyApmyX+SYUAZ5s8KY4UHhoTM+TBixo/hCRuNM9fvNEenbDoZ/tnnWQHqMRr+HsEa5wPK60Z0J7+Ud5L7JogVylL5NlD7xrKbAJbibch/znDMSedVpqkAAAAASUVORK5CYII=";
    var imgVert = "data:image/png;base64,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";


    var idPlayer=  getIdPlayer();
    var serveur  = location.href.split('/')[2];
    var pseudo   = GM_getValue('Pseudo'+idPlayer+serveur, 'Unknown');
   
 //   GM_setValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

    TopRaiderRetro();
}
else if(/topraider\.eu/.test(location.href)) // SITE TOPRAIDER
{

    if(document.getElementById('versionScript').value != Version)
    {
        document.getElementById('linkscript').style.display="block";
    }
    else
    {
        document.getElementById('linkscript').style.display="none";
    }  
}
