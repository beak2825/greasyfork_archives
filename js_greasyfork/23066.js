// ==UserScript==
// @name        soulmate
// @description Checks which towns you shared with the other soul
// @include     http://www.die2nite.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @version     0.0.4.
// @namespace   https://greasyfork.org/users/64956
// @downloadURL https://update.greasyfork.org/scripts/23066/soulmate.user.js
// @updateURL https://update.greasyfork.org/scripts/23066/soulmate.meta.js
// ==/UserScript==

var twobj, uidtarget, cidade, sessao, extrato,ac,relink,ownId,season;
var prelink = "me?id=";
var poslink = ";sk=";
var colessaumlinks = [];

if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}

function alma () // changes soul page adding animated soul icon that will redirect to my town history (copying the uid of the target)
{
    if (!(document.URL).contains("uid")){}
    else{
        $("div.score").append($('<a href="http://www.die2nite.com/#ghost/city?go=ghost/ingame;" id="test"><img src="http://data.die2nite.com/gfx/icons/item_soul_blue.gif"></a>'));
        document.getElementById("test").onclick = function (){
            uidtarget = ((document.URL).substring((document.URL.indexOf("d=")+2),document.URL.indexOf(";s")));
            twobj = $(".tid_user")[0];
        }
    }
}

function historia () // changes my previous towns page and does prior town filtering based on season difference between target and own soul
{
    if (twobj === undefined || uidtarget === "ttp://www.die2nite.com/#ghost/city?go=ghost/user" ||
        uidtarget === ownId){}
    else{
        $(".side").width(470);
        $(".side > strong:nth-child(1)").append("'s towns shared with ");
        $(".side > strong:nth-child(1)").append(twobj);
        $(".side > strong:nth-child(1)").append("' soul");
        $(".side > strong:nth-child(1)").append($('<a class="button" id="botalma"><img src="http://data.twinoid.com/proxy/www.die2nite.com/img/icons/r_jsham.gif" alt=""> Analyse!</a>'));
        $("#botalma").click (analisarcidades);
        var tabela = document.getElementsByClassName("table")[0];
        sessao = document.URL.substring(document.URL.indexOf(";sk=")+4);

        ownId = $("a.tid_user:nth-child(2)").attr("href");
        ownId = ownId.substring((ownId.indexOf("d=")+2),ownId.indexOf(poslink));

        for (var i = 1, row; i<tabela.rows.length; i++) {
            row = tabela.rows[i];
            var colunazero = row.cells[0];
            if (parseFloat(colunazero.innerHTML) < knowseason(uidtarget)){
                $("tr:nth-child("+ (i+1) +")").hide();
            }
            else{
                var colunaum = row.cells[1];
                cidade = (colunaum.innerHTML).substring(colunaum.innerHTML.indexOf(prelink)+6,colunaum.innerHTML.indexOf(poslink));
                colessaumlinks.push(cidade);
            }
        }
    }
    window.addEventListener('loadend', function(event){
        ownID = undefined;twobj = undefined; uidtarget = undefined;
    });
}

function analisarcidades() // server request + more deleting
{
    $('#botalma').removeClass('button');
    $('#botalma').addClass('button off');
    $('#botalma').off();

    alert("Our Shamans will work on your towns, please wait!");

    for (ac =0;ac<colessaumlinks.length;ac++){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://www.die2nite.com/ghost/ingame?id='+
                 colessaumlinks[ac]+';sk='+sessao+'' , false);
        xhr.setRequestHeader('X-Handler', 'js.XmlHttp');  
        xhr.send();
        extrato = xhr.response;
        if (extrato.contains("uid="+uidtarget+";") === true){ //adding soul icon and opeing on new tab function
            relink = "http://www.die2nite.com/#ghost/ingame?id="+colessaumlinks[ac]+";sk="+sessao;
            $("tr:nth-child("+ (ac+2) +") > td:nth-child(2) > a:nth-child(1)").replaceWith($('<a href="" target="_blank"><img src="http://data.die2nite.com/gfx/icons/item_soul_blue.gif" alt=""></a>'));
            $("tr:nth-child("+ (ac+2) +") > td:nth-child(2) > a:nth-child(1)").attr("href", relink);
        }
        else{
            $("tr:nth-child("+ (ac+2) +")").hide();
        }
    }
    colessaumlinks = []; uidtarget ="";cidade="";sessao=""; //flushing some stuff
}

function knowseason (uidtarget) // function to detect which season the uid belongs
{
    if (parseFloat(uidtarget) < 37355){season= 0;}
    else if (parseFloat(uidtarget)<119425 && parseFloat(uidtarget)>37354){season =1;}
    else if (parseFloat(uidtarget)<156595 && parseFloat(uidtarget)>119425){season =2;}
    else if (parseFloat(uidtarget)<188375 && parseFloat(uidtarget)>156595){season =3;}
    else if (parseFloat(uidtarget)<221253 && parseFloat(uidtarget)>188375){season =4;}
    else if (parseFloat(uidtarget)<258960 && parseFloat(uidtarget)>221253){season =5;}
    else if (parseFloat(uidtarget)<278890 && parseFloat(uidtarget)>258960){season =6;}
    else if (parseFloat(uidtarget)<298610 && parseFloat(uidtarget)>278890){season =7;}
    else if (parseFloat(uidtarget)<322000 && parseFloat(uidtarget)>298610){season =8;}
    else if (parseFloat(uidtarget)<341302 && parseFloat(uidtarget)>322000){season =9;}
    else if (parseFloat(uidtarget)<356599 && parseFloat(uidtarget)>341302){season =10;}
    else if (parseFloat(uidtarget)<373535 && parseFloat(uidtarget)>356599){season =11;}
    else if (parseFloat(uidtarget)<381483 && parseFloat(uidtarget)>373535){season =12;}
    else {season=13;}
    return season;
}

waitForKeyElements (".tinyAction > form:nth-child(1) > select:nth-child(3)", alma); //detect soulpage
waitForKeyElements (".help:contains(This section displays a list of all your previous games.)", historia); //detect history page
