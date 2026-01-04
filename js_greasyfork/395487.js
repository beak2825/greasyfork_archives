// ==UserScript==
// @name         External Labor Summary Update
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sends a chime message about the labor summary
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/labor_tracking/labor_summary*
// @connect      hooks.chime.aws
// @connect      amazon.com
// @connect      amazonaws.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/395487/External%20Labor%20Summary%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/395487/External%20Labor%20Summary%20Update.meta.js
// ==/UserScript==



var tag= document.getElementsByTagName('div');
var start= document.getElementsByTagName('span')[7].innerText;
var end= document.getElementsByTagName('span')[20].innerText;
var site= document.getElementsByTagName('span')[0].innerText;
var siteList = {
// test room for testing webhook
    UNY1: "https://hooks.chime.aws/incomingwebhooks/cc04d984-c104-4c6f-9fae-a7e633431386?token=T2hJZjczMVF8MXxINGdkSUVndXlGZF9MNDd3aUdaT1J0QVlRVEFJbnVINEpGb1hBUGZGbE5v",
    UNJ1: "https://hooks.chime.aws/incomingwebhooks/459fde30-97ac-482e-9b6b-64c4c2a7ec65?token=bXpqeVRBOVJ8MXxEQV9XLW5NWm5PRlhod3N6SHBjXzExYXdlMmpCaVJveXlKcERwZVFEd3dn",
    UNC2: "https://hooks.chime.aws/incomingwebhooks/47877a42-cfef-4217-8122-1398ed4febbc?token=dUFzZEVPbjV8MXwwa3d1ckp0MThjWFdkVkZ0SGhvODQxUFA5ZW5ZOWVwaTd4c0t4cmM3NWY4"

};


var z= document.createElement("button");
var body= document.getElementsByTagName('h4')[0];
body.appendChild(z);
z.innerHTML= "Send Chime";
z.style.backgroundColor= '#03ff42';


var pack;
var prate;
var punits;
var phours;
var stow;
var srate;
var sunits;
var shours;
var receive;
var rrate;
var rhours;
var runits;
var receiv;
var rrat;
var rhour;
var runit;
var dock;
var dockrate;
var dockunits;
var dockhours;
var wtrsp;
var wtrsprate;
var wtrspunits;
var wtrsphours;
var ibps;
var ibpsrate;
var ibpshours;
var ibpsunits;
var bulk;
var bulkrate;
var bulkunits;
var bulkhours;
var stowm;
var stowmrate;
var stowmunits;
var stowmhours;

var transform;
var transformrate;
var transformhours;
var transformunits;
var spec;
var specrate;
var specunits;
var spechours;
var receive2;
var receive2rate;
var receive2units;
var receive2hours;

var sorter;
var sorterrate;
var sorterunits;
var sorterhours;
var obps;
var obpsrate;
var obpsunits;
var obpshours;
var hero;
var herorate;
var herohours;
var herounits;
var bagprep;
var bagpreprate;
var bagprephours;
var bagprepunits;
var batching;
var batchingrate;
var batchingunits;
var batchinghours;
var problem;
var problemrate;
var problemunits;
var problemhours;

var removal;
var removalrate;
var removalhours;
var removalunits;

var bcc;
var bccrate;
var bccunits;
var bcchours;
var sbc;
var sbcrate;
var sbcunits;
var sbchours;
var icqa;
var icqarate;
var icqahours;
var icqaunits;
var grading;
var gradingrate;
var gradingunits;
var gradinghours;

var brk;
var brkrate;
var brkunits;
var brkhours;
var admn;
var admnrate;
var admnunits;
var admnhours;
var trn;
var trnrate;
var trnunits;
var trnhours;
var amcr;
var amcrrate;
var amcrhours;
var amcrunits;
var damage;
var damagerate;
var damagehours;
var damageunits;
var dispose;
var disposerate;
var disposeunits;
var disposehours;
var idle;
var idlerate;
var idleunits;
var idlehours;
var inventory;
var inventoryrate;
var inventoryhours;
var inventoryunits;
var tot;
var totrate;
var totunits;
var tothours;
var unpack;
var unpackrate;
var unpackunits;
var unpackhours;

var asm;
var asmrate;
var asmhours;
var asmunits;
var receive_ced;
var receive_cedrate;
var receive_cedhours;
var receive_cedunits;




for (var i = 0; i < tag.length; i++) {
    if (tag[i].innerText === "pack") {
        pack= tag[i].innerText;
        prate= tag[i + 4].innerText;
        punits= Number(tag[i + 2].innerText);
        phours= Number(tag[i + 3].innerText);
        break;
    }}
for (var a = 0; a < tag.length; a++) {
    if (tag[a].innerText === "stow") {
        stow= tag[a].innerText;
        srate= tag[a + 4].innerText;
        sunits= Number(tag[a + 2].innerText);
        shours= Number(tag[a + 3].innerText);
        break;
    }}
if(stow === undefined){
    srate= 0;
    shours= 0;
    sunits= 0;
}

for (var b = 0; b < tag.length; b++) {
if (tag[b].innerText === "receive2_direct") {
        receive= tag[b].innerText;
        rrate= Number(tag[b + 4].innerText);
        rhours= Number(tag[b + 3].innerText);
        runits= Number(tag[b + 2].innerText);
        break;
    }}

for (var c = 0; c < tag.length; c++) {
if (tag[c].innerText === "receive_direct") {
        receiv= tag[c].innerText;
        rrat= Number(tag[c + 4].innerText);
        rhour= Number(tag[c + 3].innerText);
        runit= Number(tag[c + 2].innerText);
        break;
    }}

for (var aa = 0; aa < tag.length; aa++) {
if (tag[aa].innerText === "DOCKCREW") {
        dock= tag[aa].innerText;
        dockrate= tag[aa + 4].innerText;
        dockhours= Number(tag[aa + 3].innerText);
        dockunits= Number(tag[aa + 2].innerText);
        break;
    }}

if(dock === undefined){
    dockrate= 0;
    dockhours= 0;
    dockunits= 0;
}

for (var bb = 0; bb < tag.length; bb++) {
if (tag[bb].innerText === "WTRSP") {
        wtrsp= tag[bb].innerText;
        wtrsprate= tag[bb + 4].innerText;
        wtrsphours= Number(tag[bb + 3].innerText);
        wtrspunits= Number(tag[bb + 2].innerText);
        break;
    }}
if(wtrsp === undefined){
    wtrsprate= 0;
    wtrsphours= 0;
    wtrspunits= 0;
}

if(receiv === undefined){
    rrat= 0;
    rhour= 0;
    runit= 0;
}


for (var cc = 0; cc < tag.length; cc++) {
if (tag[cc].innerText === "IBPS") {
        ibps= tag[cc].innerText;
        ibpsrate= tag[cc + 4].innerText;
        ibpshours= Number(tag[cc + 3].innerText);
        ibpsunits= Number(tag[cc + 2].innerText);
        break;
    }}


if(ibps === undefined){
    ibpsrate= 0;
    ibpshours= 0;
    ibpsunits= 0;
}

for (var dd = 0; dd < tag.length; dd++) {
if (tag[dd].innerText === "bulk_move") {
        bulk= tag[dd].innerText;
        bulkrate= tag[dd + 4].innerText;
        bulkhours= Number(tag[dd + 3].innerText);
        bulkunits= Number(tag[dd + 2].innerText);
        break;
    }}


if(bulk === undefined){
    bulkrate= 0;
    bulkhours= 0;
    bulkunits= 0;
}

for (var ee = 0; ee < tag.length; ee++) {
if (tag[ee].innerText === "stow_move") {
        stowm= tag[ee].innerText;
        stowmrate= tag[ee + 4].innerText;
        stowmhours= Number(tag[ee + 3].innerText);
        stowmunits= Number(tag[ee + 2].innerText);
        break;
    }}


if(stowm === undefined){
    stowmrate= 0;
    stowmhours= 0;
    stowmunits= 0;
}

for (var ff = 0; ff < tag.length; ff++) {
if (tag[ff].innerText === "transform") {
        transform= tag[ff].innerText;
        transformrate= Number(tag[ff + 4].innerText);
        transformhours= Number(tag[ff + 3].innerText);
        transformunits= Number(tag[ff + 2].innerText);
        break;
    }}


if(transform === undefined){
    transformhours= 0;
    transformrate= 0;
    transformunits= 0;
}

for (var gg = 0; gg < tag.length; gg++) {
if (tag[gg].innerText === "SPECINDIRECT") {
        spec= tag[gg].innerText;
        specrate= tag[gg + 4].innerText;
        spechours= Number(tag[gg + 3].innerText);
        specunits= Number(tag[gg + 2].innerText);
        break;
    }}


if(spec === undefined){
    specrate= 0;
    spechours= 0;
    specunits= 0;
}

for (var hh = 0; hh < tag.length; hh++) {
if (tag[hh].innerText === "receive2") {
        receive2= tag[hh].innerText;
        receive2rate= tag[hh + 4].innerText;
        receive2hours= Number(tag[hh + 3].innerText);
        receive2units= Number(tag[hh + 2].innerText);
        break;
    }}


if(receive2 === undefined){
    receive2rate= 0;
    receive2hours= 0;
    receive2units= 0;
}

for (var ii = 0; ii < tag.length; ii++) {
if (tag[ii].innerText === "SORTER") {
        sorter= Number(tag[ii].innerText);
        sorterrate= Number(tag[ii + 4].innerText);
        sorterhours= Number(tag[ii + 3].innerText);
        sorterunits= Number(tag[ii + 2].innerText);
        break;
    }}


if(sorter === undefined){
    sorterrate= 0;
    sorterhours= 0;
    sorterunits= 0;
}

for (var jj = 0; jj < tag.length; jj++) {
if (tag[jj].innerText === "OBPS") {
        obps= Number(tag[jj].innerText);
        obpsrate= Number(tag[jj + 4].innerText);
        obpshours= Number(tag[jj + 3].innerText);
        obpsunits= Number(tag[jj + 2].innerText);
        break;
    }}


if(obps === undefined){
    obpsrate= 0;
    obpshours= 0;
    obpsunits= 0;
}

for (var kk = 0; kk < tag.length; kk++) {
if (tag[kk].innerText === "HERO") {
        hero= Number(tag[kk].innerText);
        herorate= Number(tag[kk + 4].innerText);
        herohours= Number(tag[kk + 3].innerText);
        herounits= Number(tag[kk + 2].innerText);
        break;
    }}


if(hero === undefined){
    herorate= 0;
    herohours= 0;
    herounits= 0;
}

for (var ll = 0; ll < tag.length; ll++) {
if (tag[ll].innerText === "BAGPREP") {
        bagprep= Number(tag[ll].innerText);
        bagpreprate= Number(tag[ll + 4].innerText);
        bagprephours= Number(tag[ll + 3].innerText);
        bagprepunits= Number(tag[ll + 2].innerText);
        break;
    }}


if(bagprep === undefined){
    bagprephours= 0;
    bagpreprate= 0;
    bagprepunits= 0;
}

for (var mm = 0; mm < tag.length; mm++) {
if (tag[mm].innerText === "BATCHING") {
        batching= Number(tag[mm].innerText);
        batchingrate= Number(tag[mm + 4].innerText);
        batchinghours= Number(tag[mm + 3].innerText);
        batchingunits= Number(tag[mm + 2].innerText);
        break;
    }}


if(batching === undefined){
    batchingrate= 0;
    batchinghours= 0;
    batchingunits= 0;
}

for (var nn = 0; nn < tag.length; nn++) {
if (tag[nn].innerText === "pack_problem") {
        problem= Number(tag[nn].innerText);
        problemrate= Number(tag[nn + 4].innerText);
        problemhours= Number(tag[nn + 3].innerText);
        problemunits= Number(tag[nn + 2].innerText);
        break;
    }}


if(problem === undefined){
    problemrate= 0;
    problemunits= 0;
    problemhours= 0;
}

for (var oo = 0; oo < tag.length; oo++) {
if (tag[oo].innerText === "removal") {
        removal= Number(tag[oo].innerText);
        removalrate= Number(tag[oo + 4].innerText);
        removalhours= Number(tag[oo + 3].innerText);
        removalunits= Number(tag[oo + 2].innerText);
        break;
    }}


if(removal === undefined){
    removalrate= 0;
    removalhours= 0;
    removalunits= 0;
}

for (var pp = 0; pp < tag.length; pp++) {
if (tag[pp].innerText === "bcc") {
        bcc= Number(tag[pp].ipperText);
        bccrate= Number(tag[pp + 4].innerText);
        bcchours= Number(tag[pp + 3].innerText);
        bccunits= Number(tag[pp + 2].innerText);
        break;
    }}


if(bcc === undefined){
    bccrate= 0;
    bcchours= 0;
    bccunits= 0;
}

for (var qq = 0; qq < tag.length; qq++) {
if (tag[qq].innerText === "sbc") {
        sbc= Number(tag[qq].innerText);
        sbcrate= Number(tag[qq + 4].innerText);
        sbchours= Number(tag[qq + 3].innerText);
        sbcunits= Number(tag[qq + 2].innerText);
        break;
    }}


if(sbc === undefined){
    sbcrate= 0;
    sbchours= 0;
    sbcunits= 0;
}

for (var rr = 0; rr < tag.length; rr++) {
if (tag[rr].innerText === "ICQA") {
        icqa= Number(tag[rr].innerText);
        icqarate= Number(tag[rr + 4].innerText);
        icqahours= Number(tag[rr + 3].innerText);
        icqaunits= Number(tag[rr + 2].innerText);
        break;
    }}


if(icqa === undefined){
    icqarate= 0;
    icqahours= 0;
    icqaunits= 0;
}

for (var ss = 0; ss < tag.length; ss++) {
if (tag[ss].innerText === "GRADING") {
        grading= Number(tag[ss].innerText);
        gradingrate= Number(tag[ss + 4].innerText);
        gradinghours= Number(tag[ss + 3].innerText);
        gradingunits= Number(tag[ss + 2].innerText);
        break;
    }}


if(grading === undefined){
    gradingrate= 0;
    gradinghours= 0;
    gradingunits= 0;
}

for (var tt = 0; tt < tag.length; tt++) {
if (tag[tt].innerText === "BRK") {
        brk= Number(tag[tt].innerText);
        brkrate= Number(tag[tt + 4].innerText);
        brkhours= Number(tag[tt + 3].innerText);
        brkunits= Number(tag[tt + 2].innerText);
        break;
    }}


if(brk === undefined){
    brkrate= 0;
    brkhours= 0;
    brkunits= 0;
}

for (var uu = 0; uu < tag.length; uu++) {
if (tag[uu].innerText === "ADMN") {
        admn= Number(tag[uu].innerText);
        admnrate= Number(tag[uu + 4].innerText);
        admnhours= Number(tag[uu + 3].innerText);
        admnunits= Number(tag[uu + 2].innerText);
        break;
    }}


if(admn === undefined){
    admnrate= 0;
    admnhours= 0;
    admnunits= 0;
}

for (var vv = 0; vv < tag.length; vv++) {
if (tag[vv].innerText === "TRN") {
        trn= Number(tag[vv].innerText);
        trnrate= Number(tag[vv + 4].innerText);
        trnhours= Number(tag[vv + 3].innerText);
        trnunits= Number(tag[vv + 2].innerText);
        break;
    }}


if(trn === undefined){
    trnrate= 0;
    trnhours= 0;
    trnunits= 0;
}

for (var ww = 0; ww < tag.length; ww++) {
if (tag[ww].innerText === "AMCR") {
        amcr= Number(tag[ww].innerText);
        amcrrate= Number(tag[ww + 4].innerText);
        amcrhours= Number(tag[ww + 3].innerText);
        amcrunits= Number(tag[ww + 2].innerText);
        break;
    }}


if(amcr === undefined){
    amcrrate= 0;
    amcrhours= 0;
    amcrunits= 0;
}

for (var xx = 0; xx < tag.length; xx++) {
if (tag[xx].innerText === "damage") {
        damage= Number(tag[xx].innerText);
        damagerate= Number(tag[xx + 4].innerText);
        damagehours= Number(tag[xx + 3].innerText);
        damageunits= Number(tag[xx + 2].innerText);
        break;
    }}


if(damage === undefined){
    damagerate= 0;
    damagehours= 0;
    damageunits= 0;
}

for (var yy = 0; yy < tag.length; yy++) {
if (tag[yy].innerText === "dispose") {
        dispose= Number(tag[yy].innerText);
        disposerate= Number(tag[yy + 4].innerText);
        disposehours= Number(tag[yy + 3].innerText);
        disposeunits= Number(tag[yy + 2].innerText);
        break;
    }}


if(dispose === undefined){
    disposerate= 0;
    disposehours= 0;
    disposeunits= 0;
}

for (var zz = 0; zz < tag.length; zz++) {
if (tag[zz].innerText === "IDLE") {
        idle= Number(tag[zz].innerText);
        idlerate= Number(tag[zz + 4].innerText);
        idlehours= Number(tag[zz + 3].innerText);
        idleunits= Number(tag[zz + 2].innerText);
        break;
    }}


if(idle === undefined){
    idlerate= 0;
    idlehours= 0;
    idleunits= 0;
}

for (var aaa = 0; aaa < tag.length; aaa++) {
if (tag[aaa].innerText === "inventory") {
        inventory= Number(tag[aaa].innerText);
        inventoryrate= Number(tag[aaa + 4].innerText);
        inventoryhours= Number(tag[aaa + 3].innerText);
        inventoryunits= Number(tag[aaa + 2].innerText);
        break;
    }}


if(inventory === undefined){
    inventoryrate= 0;
    inventoryhours= 0;
    inventoryunits= 0;
}

for (var bbb = 0; bbb < tag.length; bbb++) {
if (tag[bbb].innerText === "TIMEOFFTASK") {
        tot= Number(tag[bbb].innerText);
        totrate= Number(tag[bbb + 4].innerText);
        tothours= Number(tag[bbb + 3].innerText);
        totunits= Number(tag[bbb + 2].innerText);
        break;
    }}


if(tot === undefined){
    totrate= 0;
    tothours= 0;
    totunits= 0;
}

for (var ccc = 0; ccc < tag.length; ccc++) {
if (tag[ccc].innerText === "unpack") {
        unpack= Number(tag[ccc].innerText);
        unpackrate= Number(tag[ccc + 4].innerText);
        unpackhours= Number(tag[ccc + 3].innerText);
        unpackunits= Number(tag[ccc + 2].innerText);
        break;
    }}


if(unpack === undefined){
    unpackrate= 0;
    unpackhours= 0;
    unpackunits= 0;
}

for (var ddd = 0; ddd < tag.length; ddd++) {
if (tag[ddd].innerText === "ASM") {
        asm= Number(tag[ddd].innerText);
        asmrate= Number(tag[ddd + 4].innerText);
        asmhours= Number(tag[ddd + 3].innerText);
        asmunits= Number(tag[ddd + 2].innerText);
        break;
    }}


if(asm === undefined){
    asmrate= 0;
    asmhours= 0;
    asmunits= 0;
}

for (var eee = 0; eee < tag.length; eee++) {
if (tag[eee].innerText === "receive_ced") {
        receive_ced= Number(tag[eee].innerText);
        receive_cedrate= Number(tag[eee + 4].innerText);
        receive_cedhours= Number(tag[eee + 3].innerText);
        receive_cedunits= Number(tag[eee + 2].innerText);
        break;
    }}


if(receive_ced === undefined){
    receive_cedrate= 0;
    receive_cedhours= 0;
    receive_cedunits= 0;
}


var totalhrs= (add+receive_cedhours+rhour+rhours+shours+transformhours+spechours+receive2hours+sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours+phours+removalhours+bcchours+sbchours+gradinghours+icqahours+unpackhours+tothours+inventoryhours+idlehours+disposehours+damagehours+amcrhours+trnhours+admnhours+brkhours+asmhours+dockhours+wtrsphours+ibpshours+bulkhours+stowmhours).toFixed(2);
var ibunits= transformunits+runit+runits+sunits+receive_cedunits;
var ibrate= ((transformunits+runit+runits+sunits+receive_cedunits)/(rhour+rhours+shours+transformhours+spechours+receive2hours+receive_cedhours)).toFixed(2);



    var phrase= "TPH Update from " + start + " - " + end + '\n\n' +
        "Current Adj. UPH: " + (punits/((totalhrs)-((ibunits-punits)/ibrate))).toFixed(2) + '\n\n' +
              "Stow: " + sunits + "units - " + shours.toFixed(2) + "hours - " + srate + '\n' +
             "Receive: " + (runit+runits+receive_cedunits) + "units - " + (rhour+rhours+receive_cedhours).toFixed(2) + "hours - " + ((runit+runits+receive_cedunits)/(rhour+rhours+receive_cedhours)).toFixed(2) + '\n' +
             "Inbound Indirect Rate: " + (runit+runits+sunits+receive_cedunits) + "units - " + (dockhours+wtrsphours+ibpshours+bulkhours+stowmhours).toFixed(2) + "hours - " + ((runit+runits+sunits)/(dockhours+wtrsphours+ibpshours+bulkhours+stowmhours)).toFixed(2) + '\n' +
             "Specialty Total: " + (transformunits) + "units - " + (transformhours+spechours+receive2hours).toFixed(2) + "hours - " + (transformunits/(transformhours+spechours+receive2hours)).toFixed(2) +'\n' +
             "Inbound Total: " + (transformunits+runit+runits+sunits+receive_cedunits) +"units - " + (rhour+rhours+shours+transformhours+spechours+receive2hours+dockhours+wtrsphours+ibpshours+bulkhours+stowmhours+receive_cedhours).toFixed(2) + "hours - " + ((transformunits+runit+runits+sunits+receive_cedunits)/(rhour+rhours+shours+transformhours+spechours+receive2hours+dockhours+wtrsphours+ibpshours+bulkhours+stowmhours+receive_cedhours)).toFixed(2) + '\n\n' +
             "Pack: " + punits + "units - " + phours.toFixed(2) + "hours - " + prate + '\n' +
             "Outbound Indirect Rate: " + (punits) + "units - " + (sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours).toFixed(2) + "hours - " + (punits/(sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours)).toFixed(2) + '\n' +
             "Outbound Total: " + punits + "units - " + (sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours+phours).toFixed(2) + "hours - " + (punits/(sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours+phours)).toFixed(2) + '\n\n' +
             "Removals Total: " + removalunits + "units - " + removalhours.toFixed(2) + "hours - " + (removalunits/removalhours).toFixed(2) + '\n' +
             "ICQA Total: " + (bcchours+sbchours+gradinghours+icqahours).toFixed(2) + 'hours\n' +
        "Support Total: " + (unpackhours+tothours+inventoryhours+idlehours+disposehours+damagehours+amcrhours+trnhours+admnhours+brkhours).toFixed(2) +'hours\n' +
            "ASM Hours: " + (asmhours+add).toFixed(2) + 'hours\n' +
            "FC Totals: " + punits + "units - " + (add+receive_cedhours+rhour+rhours+shours+transformhours+spechours+receive2hours+sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours+phours+removalhours+bcchours+sbchours+gradinghours+icqahours+unpackhours+tothours+inventoryhours+idlehours+disposehours+damagehours+amcrhours+trnhours+admnhours+brkhours+asmhours+dockhours+wtrsphours+ibpshours+bulkhours+stowmhours).toFixed(2) + "hours - " + (punits/(add+receive_cedhours+rhour+rhours+shours+transformhours+spechours+receive2hours+sorterhours+obpshours+herohours+batchinghours+bagprephours+problemhours+phours+removalhours+bcchours+sbchours+gradinghours+icqahours+unpackhours+tothours+inventoryhours+idlehours+disposehours+damagehours+amcrhours+trnhours+admnhours+brkhours+asmhours)).toFixed(2)

z.onclick= sendChime;
 function sendChime() {


     var sitelist= siteList.length;


    var conData = {
                Content: phrase};


// CHIME to Site Channel
            GM_xmlhttpRequest({
                method: "POST",
                url: siteList[site],
                data: JSON.stringify(conData),
                dataType: "json"
            });
        }

