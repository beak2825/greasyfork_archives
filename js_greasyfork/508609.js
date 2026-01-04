// ==UserScript==
// @name            DOmestres
// @namespace       DOmestres
// @description     DOmestres v1.0.0
// @include         http*dugout-online.com/teste/details*playerID*/testexyz
// @version         1.0.57
// @downloadURL https://update.greasyfork.org/scripts/508609/DOmestres.user.js
// @updateURL https://update.greasyfork.org/scripts/508609/DOmestres.meta.js
// ==/UserScript==
/*
versions
1.0.0 - initial draft
1.0.1 - fixing Dugtool's enabled "Player OPS ID" bug
*/

var APPNAME = "DOmestres";


    var idPlayer
    idPlayer = $('.player_id_txt')[0].innerText.replace('(ID ','').replace(')','').replace(/ \@.*/,'');
console.log(idPlayer);

    function replaceFullStars(){
        var emptyStars = document.getElementsByClassName('fa fa-star-o coach_star')[0];
        emptyStars.setAttribute('class','fa fa-star coach_star');
        emptyStars.setAttribute('style','font-size: 18px;');
    }

    function replaceHalfStars(){
        var emptyStars = document.getElementsByClassName('fa fa-star-o coach_star')[0];
        emptyStars.setAttribute('class','fa fa-star-half-o coach_star');
        emptyStars.setAttribute('style','font-size: 18px;');
    }

    //function replaceEmptyStars(){
    //    var emptyStars = document.getElementsByClassName('fa fa-star-o coach_star')[0];
        //emptyStars.setAttribute('class','fa fa-star-half-o coach_star');
    //    emptyStars.setAttribute('style','font-size: 18px;');
    //}

    function removeFullStars(){
        var emptyStars = document.getElementsByClassName('fa fa-star coach_star')[0];
        emptyStars.setAttribute('class','fa fa-star-o coach_star');
        emptyStars.setAttribute('style','font-size: 18px;');
    }

    function removeHalfStars(){
        var emptyStars = document.getElementsByClassName('fa fa-star-half-o coach_star')[0];
        emptyStars.setAttribute('class','fa fa-star-o coach_star');
        emptyStars.setAttribute('style','font-size: 18px;');
    }

    var openLock = document.getElementsByClassName('fa fa-unlock');
    var openReport = document.getElementsByClassName('fa fa-lock');

    if (openLock.length <1 && openReport.length<1){
        switch (idPlayer){
                //0.5*
            case '77777777777777':
                replaceHalfStars();
                break;
                //1.0*
            case '13454456':
                replaceFullStars();
                break;
                //1.5*
            case '88888888888888':
                replaceFullStars();replaceHalfStars();
                break;
                //2.0*
            case '99999999999999':
                replaceFullStars();replaceFullStars();
                break;
                //2.5*
            case '13451046':
                replaceFullStars();replaceFullStars();replaceHalfStars();
                break;
                //3.0*
            case '13376430':
            case '13376426':
            case '13401539':
            case '13377706':
            case '13509026':
            case '13450975':
            case '13418815':
            case '13451035':
            case '13456944':
            case '13454389':
            case '13457025':
            case '13414980':
            case '13563219':
            case '13444618':
            case '13562555':
            case '13543376':
            case '13392744':
            case '13456679':
            case '13447032':
            case '13552895':
            case '13447055':
            case '13447072':
            case '13444681':
            case '13402321':
            case '13402615':
            case '13402343':
            case '13630471':
            case '13630534':
            case '13589238':
                replaceFullStars();replaceFullStars();replaceFullStars();
                break;
                //3.5*
            case '13414398':
            case '13444379':
            case '13417235':
            case '13382116':
            case '13457933':
            case '13383263':
            case '13446988':
            case '13445192':
            case '13383262':
            case '13419712':
            case '13390106':
            case '13374204':
            case '13381469':
            case '13403157':
            case '13449763':
            case '13642998':
            case '13401117':
            case '13630943':
            case '13392841':
            case '13446990':
            case '13392156':
            case '13445243':
            case '13383127':
            case '13392813':
            case '13488218':
            case '13488213':
            case '13483568':
            case '13423207':
            case '13417238':
            case '13449718':
            case '13411810':
            case '13640172':
            case '13419683':
            case '13418979':
            case '13414139':
            case '13488224':
            case '13444869':
            case '13453883':
            case '13419593':
            case '13444857':
            case '13418393':
            case '13444652':
            case '13445103':
            case '13453866':
            case '13444917':
            case '13457072':
            case '13418450':
            case '13543460':
            case '13419673':
            case '13401399':
            case '13432125':
            case '13451008':
            case '13414982':
            case '13419606':
            case '13419646':
            case '13543378':
            case '13456907':
            case '13418676':
            case '13456722':
            case '13562411':
            case '13528087':
            case '13443797':
            case '13437616':
            case '13438111':
            case '13420698':
            case '13444662':
            case '13437693':
            case '13456964':
            case '13563220':
            case '13562493':
            case '13441414':
            case '13419894':
            case '13414621':
            case '13419602':
            case '13419636':
            case '13543477':
            case '13420680':
            case '13562458':
            case '13491257':
            case '13421989':
            case '13423596':
            case '13423538':
            case '13423599':
            case '13423756':
            case '13456594':
            case '13456610':
            case '13456596':
            case '13456608':
            case '13456577':
            case '13414268':
            case '13414452':
            case '13414126':
            case '13414221':
            case '13414261':
            case '13447082':
            case '13447069':
            case '13447000':
            case '13447075':
            case '13447013':
            case '13447024':
            case '13447042':
            case '13429279':
            case '13555120':
            case '13563173':
            case '13630171':
            case '13535488':
            case '13457228':
            case '13444713':
            case '13552953':
            case '13562460':
            case '13498662':
            case '13643005':
            case '13444680':
            case '13520607':
            case '13550670':
            case '13562562':
            case '13555397':
            case '13550981':
            case '13550913':
            case '13550947':
            case '13550705':
            case '13550893':
            case '13550843':
            case '13550659':
            case '13472314':
            case '13490185':
            case '13467024':
            case '13465134':
            case '13469588':
            case '13508906':
            case '13508940':
            case '13562560':
            case '13541858':
            case '13509032':
            case '13630408':
            case '13630779':
            case '13589485':
            case '13589391':
            case '13642967':
            case '13631198':
                replaceFullStars();replaceFullStars();replaceFullStars();replaceHalfStars();
                break;
                //4.0*
            case '13405871':
            case '13385998':
            case '13579039':
            case '13491242':
            case '13444594':
            case '13389855':
            case '13372908':
            case '13414343':
            case '13454905':
            case '13392270':
            case '13449822':
            case '13438103':
            case '13392845':
            case '13405584':
            case '13406334':
            case '13409068':
            case '13405305':
            case '13414530':
            case '13444586':
            case '13406257':
            case '13392811':
            case '13633275':
            case '13406154':
            case '13517453':
            case '13406432':
            case '13406269':
            case '13603552':
            case '13574999':
            case '13529126':
            case '13438951':
            case '13392114':
            case '13454375':
            case '13550661':
            case '13438144':
            case '13438119':
            case '13445239':
            case '13456554':
            case '13419490':
            case '13454067':
            case '13409109':
            case '13414201':
            case '13411844':
            case '13426971':
            case '13543733':
            case '13408882':
            case '13411619':
            case '13414801':
            case '13414877':
            case '13444730':
            case '13444976':
            case '13445010':
            case '13438279':
            case '13443914':
            case '13419754':
            case '13438357':
            case '13528552':
            case '13563227':
            case '13444752':
            case '13450994':
            case '13419464':
            case '13420229':
            case '13451095':
            case '13440653':
            case '13551806':
            case '13456939':
            case '13523097':
            case '13421482':
            case '13418811':
            case '13438029':
            case '13420404':
            case '13543695':
            case '13392854':
            case '13443971':
            case '13563190':
            case '13428678':
            case '13424676':
            case '13425757':
            case '13428680':
            case '13443812':
            case '13429460':
            case '13401855':
            case '13444503':
            case '13456998':
            case '13418066':
            case '13562441':
            case '13414741':
            case '13421206':
            case '13419442':
            case '13438143':
            case '13454291':
            case '13445258':
            case '13563161':
            case '13437674':
            case '13643004':
            case '13399266':
            case '13446444':
            case '13421763':
            case '13444080':
            case '13444643':
            case '13417653':
            case '13444567':
            case '13444115':
            case '13422543':
            case '13423592':
            case '13422325':
            case '13422292':
            case '13456640':
            case '13456580':
            case '13414614':
            case '13414850':
            case '13414997':
            case '13407455':
            case '13408996':
            case '13408138':
            case '13384982':
            case '13407730':
            case '13408908':
            case '13409003':
            case '13407907':
            case '13408980':
            case '13409309':
            case '13408370':
            case '13408010':
            case '13411882':
            case '13411754':
            case '13411708':
            case '13517662':
            case '13411768':
            case '13411656':
            case '13407190':
            case '13406298':
            case '13405711':
            case '13406486':
            case '13414414':
            case '13414469':
            case '13414085':
            case '13414273':
            case '13414321':
            case '13414058':
            case '13414062':
            case '13447116':
            case '13447099':
            case '13418352':
            case '13447071':
            case '13446996':
            case '13555582':
            case '13443936':
            case '13444716':
            case '13453985':
            case '13428057':
            case '13543737':
            case '13444325':
            case '13446324':
            case '13559694':
            case '13457239':
            case '13456962':
            case '13397956':
            case '13437575':
            case '13437915':
            case '13557160':
            case '13456832':
            case '13456746':
            case '13630093':
            case '13419497':
            case '13417650':
            case '13417783':
            case '13456724':
            case '13419701':
            case '13454329':
            case '13418355':
            case '13420589':
            case '13419757':
            case '13632491':
            case '13498625':
            case '13422297':
            case '13408702':
            case '13555117':
            case '13550599':
            case '13550631':
            case '13483546':
            case '13550861':
            case '13551052':
            case '13478614':
            case '13490060':
            case '13476153':
            case '13474829':
            case '13464368':
            case '13472132':
            case '13483913':
            case '13517375':
            case '13481595':
            case '13630407':
            case '13642982':
            case '13466508':
            case '13458442':
            case '13463482':
            case '13598442':
            case '13523102':
            case '13551047':
            case '13598075':
            case '13598138':
            case '13550842':
            case '13568919':
            case '13631527':
            case '13631056':
            case '13631375':
            case '13631402':
            case '13631381':
            case '13631492':
            case '13586970':
            case '13584366':
            case '13585894':
            case '13588997':
                replaceFullStars();replaceFullStars();replaceFullStars();replaceFullStars();
                break;
                //4.5*
            case '13402199':
            case '13421890':
            case '13402371':
            case '13421283':
            case '13420855':
            case '13445662':
            case '13632723':
            case '13643383':
            case '13445418':
            case '13414306':
            case '13560756':
            case '13444462':
            case '13380627':
            case '13391273':
            case '13392166':
            case '13633276':
            case '13446358':
            case '13445830':
            case '13437502':
            case '13517618':
            case '13624644':
            case '13633395':
            case '13425875':
            case '13605704':
            case '13444890':
            case '13550303':
            case '13444074':
            case '13443904':
            case '13420640':
            case '13427021':
            case '13526671':
            case '13527316':
            case '13550389':
            case '13441980':
            case '13445274':
            case '13528413':
            case '13418803':
            case '13528746':
            case '13408834':
            case '13411858':
            case '13405967':
            case '13447030':
            case '13444602':
            case '13446502':
            case '13419902':
            case '13420891':
            case '13449365':
            case '13444218':
            case '13420492':
            case '13457226':
            case '13442811':
            case '13551105':
            case '13458414':
            case '13469822':
            case '13631363':
            case '13618627':
            case '13512416':
                replaceFullStars();replaceFullStars();replaceFullStars();replaceFullStars();replaceHalfStars();
                break;
                //5.0*
            case '13478612':
            case '13555584':
            case '13587141':
            case '13372229':
            case '13473279':
            case '13383090':
            case '13420430':
            case '13644564':
            case '13514456':
                replaceFullStars();replaceFullStars();replaceFullStars();replaceFullStars();replaceFullStars();
                break;
            default:
                //do nothing
        }
    }