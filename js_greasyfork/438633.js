// ==UserScript==
// @name           FCup Script

// @description    This script aims to improve the game appearance and increase your gaming experience by adding new features. Under the MIT license the script is reproduced and further distributed. Copyright: Criyessei | mot33

// @version        3.7.1.7
// @icon           https://i.ibb.co/tJC5RX3/HFWRRt6.png

// @namespace      https://greasyfork.org/users/83290
// @author         Criyessei | mot33

// @homepage       https://www.fcup-tools.de/tool
// @supportURL     https://forum.fussballcup.de/showthread.php?t=417372

// @include        /^https?:\/\/(futbolcup.net|fussballcup.(de|at)|futbolcup.pl|footcup.fr|footballcup.nl).+/

// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @require        https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require        https://greasyfork.org/scripts/441421-t%C5%82umaczenia/code/T%C5%82umaczenia.js?version=1027588

// @compatible     chrome
// @compatible     firefox
// @compatible     opera

// @connect        greasyfork.org

// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow

// @license        MIT

// @run-at         document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438633/FCup%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/438633/FCup%20Script.meta.js
// ==/UserScript==

/* eslint no-eval: 0, no-implicit-globals: 0, no-native-reassign: 0, curly: 0, no-proto: 0 */

/* global $, currentLive, worldId, toolTipObj, plObj, SelectBox, closeFocus, toolPipe*/ //jquery script and Game veriables

/* other dependencies game functions: (these functions will be modified)
       1. showServerTime: Necessary to take the server's time. [Temporary Modify]
       2. updateLayout: Necessary to understand that the page has changed and to detect that goals have been scored in other matches on the live match page. [Permanent Modify]
       3. Live: Neccessary to get old or new match events and to detect when the match is end on the live match page. [Permanent Modify]
       4. openCard: Necessary to display captain image. [Permanent Modify]
*/

/* global Translate */ //Translation.js

"use strict";

if(location.protocol!='https:'){ //Routing to secure protocol
    let pageHref = location.href;
    location.href = 'https'+pageHref.substring(pageHref.indexOf(':'));
    return;
}
else if(location.search.indexOf('action=logout')!=-1){
    location.href = location.origin; //Go main page
    return;
}

let serversDatas = {
    "tr":{
        "flag"                : "TUR",
        "language"            : "Turkish",
        "footballerPositions" : ["KL", "DD", "DI", "OD", "OL", "OR", "OH", "FO"],
        "leagues"             : [
            "2. Amatör Lig",
            "1. Amatör Lig",
            "Süper Amatör Lig",
            "Bölgesel Amatör Lig",
            "TFF 3.Lig",
            "TFF 2.Lig",
            "Spor Toto 1.Lig",
            "Spor Toto Süper Lig"
        ],
        "replaceClubName"     : "'den Profil",
        "ScriptAuthorClubId"  : "670524",
        "ClubExchange"        : "Kulüp Değiştirme",
        "bidTexts"            : {
            'accept': 'kabul edildi',
            'reject': 'reddedildi',
            'read'  : 'okundu',
            'new'   : 'yeni'
        },
        'news'       : {
            "youngPlayer": {"title":'Genç Oyuncu',"beforeName":"yetiyor.","afterName":"Detaylı incele"},
            "increaseBid": {"title":"Transfer Pazarı","control":"tarafından geçildi.","beforeName":"Transfer Pazarı","afterName":"için transfer teklifin"},
            "sellPlayer" : {"title":"Assistent: Transfer Pazarı","control":"yıllık kontrat imzaladı","beforeName":"</h2>","afterName":", <div"}
        },
        "ageDates"   : [26483328, 26527104, 26570880, 26614656, 26658432, 26702208, 26746104, 26789880, 26833656, 26877432, 26921208, 26964984, 27008760, 27052536, 27096312, 27140088, 27183864, 27227640, 27271416, 27315192, 27358968, 27402744, 27446520, 27490296, 27534072, 27577848, 27621624, 27665400, 27709176, 27752952, 27796728, 27840504, 27884280, 27928056, 27971832, 28015608, 28059384, 28103160, 28146936, 28190712, 28234488, 28278264, 28322040, 28365816, 28409592, 28453368, 28497144, 28540920, 28584696, 28628472, 28672248],
    },
    "de":{
        "flag"                : "DEU",
        "language"            : "German", /*The game language*/
        "footballerPositions" : ["TW", "AV", "IV", "DM", "LM", "RM", "OM", "ST"],
        "leagues"             : [
            "Kreisliga",
            "Landesliga",
            "Verbandsliga",
            "Oberliga",
            "Regionalliga",
            "3. Liga",
            "2. Bundesliga",
            "1. Bundesliga"
        ],
        "replaceClubName"     : "Profil von",
        "ScriptAuthorClubId"  : "1286060",
        "ClubExchange"        : "Vereinswechsel",
        "bidTexts"            : {
            'accept': 'akzeptiert',
            'reject': 'abgelehnt',
            'read'  : 'gelesen',
            'new'   : 'neu'
        },
        'news' : {
            "youngPlayer": {"title":'Jugendspieler',"beforeName":"diesen ","afterName":" mal"},
            "increaseBid": {"title":"Transfermarkt","control":"überboten","beforeName":"für ","afterName":" wurde"},
            "sellPlayer" : {"title":"Assistent: Transfermarkt","control":"ausgehandelt","beforeName":"Spieler ","afterName":" hat"}
        },
        "ageDates"            : [26402796, 26446632, 26490408, 26534184, 26579400, 26621736, 26665512, 26709288, 26753004, 26796780,26840676,26884452,26928228,26972004,27015780,27059556,27103332,27147108,27190884,27234660,27278436,27322212, 27365988, 27409764, 27453540, 27497316, 27541092, 27584868, 27628644, 27672420, 27716196, 27759972, 27803748, 27847524, 27891300, 27935076, 27978852, 28022628, 28066404, 28110180, 28153956, 28197732, 28241508, 28285284, 28329060, 28372836, 28416612, 28460388, 28504164, 28547940, 28591716, 28635492, 28679268, 28723044, 28766820, 28810596, 28854372, 28898148, 28941924, 28985700, 29029476, 29073252, 29117028, 29160804, 29204580, 29248356, 29292132, 29335908, 29379684, 29423460, 29467236, 29511012, 29554788, 29598564, 29642340, 29686116, 29729892, 29773668, 29817444, 29861220, 29904996, 29948772, 29992548, 30036324, 30080100, 30123876],
    },
    "at":{
        "flag"                : "AUT",
        "language"            : "German",
        "footballerPositions" : ["TW", "AV", "IV", "DM", "LM", "RM", "OM", "ST"],
        "leagues"             : [
            "2. Klasse",
            "1. Klasse",
            "Gebietsliga",
            "2. Landesliga",
            "Landesliga",
            "Regionalliga",
            "Erste Liga",
            "Österreichische Bundesliga"
        ],
        "replaceClubName"     : "Profil von",
        "ScriptAuthorClubId"  : "1510674",
        "ClubExchange"        : "Vereinswechsel",
        "bidTexts"            : {
            'accept': 'akzeptiert',
            'reject': 'abgelehnt',
            'read'  : 'gelesen',
            'new'   : 'neu'
        },
        'news' : {
            "youngPlayer": {"title":'Jugendspieler',"beforeName":"diesen ","afterName":" mal"},
            "increaseBid": {"title":"Transfermarkt","control":"überboten","beforeName":"für ","afterName":" wurde"},
            "sellPlayer" : {"title":"Assistent: Transfermarkt","control":"ausgehandelt","beforeName":"Spieler ","afterName":" hat"}
        },
        "ageDates"            : [26542884,26588100,26630436,26674212,26717988,26761764,26805540, 26849316, 26893092, 26936868, 26980644, 27024420, 27068196, 27111972, 27155748, 27199524, 27243300, 27287076, 27330852, 27374628, 27418404, 27462180, 27505956, 27549732, 27593508, 27637284, 27681060, 27724836, 27768612, 27812388, 27856164, 27899940, 27943716, 27987492, 28031268, 28075044, 28118820, 28162596, 28206372, 28250148, 28293924, 28337700, 28381476, 28425252, 28469028, 28512804, 28556580],
    },
    "pl":{
        "flag"                : "POL",
        "language"            : "Polish",
        "footballerPositions" : ["BR", "OZ", "OŚ", "DP", "LP", "PP", "OP","N"],
        "leagues"             : [
            "Klasa B",
            "Klasa A",
            "Liga okręgowa",
            "4 Liga",
            "3 Liga",
            "2 Liga",
            "1 Liga",
            "Ekstraklasa"
        ],
        "replaceClubName"     : "Profil",
        "ScriptAuthorClubId"  : "2074",
        "ClubExchange"        : "Zmienia klub",
        "bidTexts"            : {
            'accept': 'Zaakceptowane',
            'reject': 'Odrzucone',
            'read'  : 'przeczytana',
            'new'   : 'nowy'
        },
        'news' : {
            "youngPlayer": {"title":'Junior',"beforeName":"dokładniej","afterName":"i zaproś"},
            "increaseBid": {"title":"Rynek transferowy","control":"została przebita przez","beforeName":"spłaty za","afterName":"została"},
            "sellPlayer" : {"title":"Assistent: Rynek transferowy","control":"periodzie rynku transferowego","beforeName":"</h2>","afterName":"wynegocjował"}
        },
        "ageDates"            : [26196708, 26240484, 26284260, 26328036, 26371812, 26415588, 26459364, 26503140, 26546916, 26590692, 26634468, 26678244, 26722020, 26765796, 26809572, 26853348, 26897124, 26940900, 26984676, 27028452, 27072228, 27116004, 27159780, 27203556, 27247332, 27291108, 27334884, 27378660, 27422436, 27466212, 27509988, 27553764, 27597540, 27641316, 27685092, 27728868, 27772644, 27816420, 27860196, 27903972, 27947748, 27991524, 28035300, 28079076, 28122852, 28166628, 28210404, 28254180, 28297956, 28341732, 28385508, 28429284, 28473060, 28516836, 28560612, 28604388, 28648164, 28691940, 28735716, 28779492, 28823268, 28867044, 28910820, 28954596, 28998372, 29042148, 29085924, 29129700, 29173476, 29217252, 29261028, 29304804, 29348580, 29392356, 29436132, 29479908, 29523684, 29567460, 29611236, 29655012, 29698788, 29742564, 29786340, 29830116, 29873892],

    },
    "fr":{
        "flag"                : "FRA",
        "language"            : "French",
        "footballerPositions" : ["GB", "DL", "DC", "Mdf", "MG", "MD", "MO", "BT"],
        "leagues"             : [
            "PH",
            "DHR",
            "DH",
            "CFA 2",
            "CFA",
            "National",
            "Ligue 2",
            "Ligue 1"
        ],
        "replaceClubName"     : "Profil de",
        "ScriptAuthorClubId"  : "169948",
        "ClubExchange"        : "Clubs Changer",
        "bidTexts"            : {
            'accept': 'approuvé',
            'reject': 'rejeté',
            'read'  : 'lu',
            'new'   : 'nouveau'
        },
        'news' : {
            "youngPlayer": {"title":'Jeune joueur',"beforeName":"d'œil sur ce","afterName":"..."},
            "increaseBid": undefined,
            "sellPlayer" : undefined
        },
        "ageDates"            : [25733556, 25778772, 25821109, 25864884, 25908660, 25952436, 25996212, 26039988, 26083764, 26127540, 26171316, 26215092, 26258868, 26302644, 26346420, 26390196, 26433972, 26477748, 26521524, 26565300, 26609076, 26652852, 26696628, 26740404, 26784180, 26827956, 26871732, 26915508, 26959284, 27003060, 27046836, 27090612, 27134388, 27178164, 27221940, 27265716, 27309492, 27353268, 27397044, 27440820, 27484596, 27528372, 27572148, 27615924, 27659700, 27703476, 27747252, 27791028, 27834804, 27878580, 27922356],
    },
    "nl":{
        "flag"                : "NLD",
        "language"            : "Dutch",
        "footballerPositions" : ["GK", "VV", "CV", "DM", "LM", "RM", "AM", "AV"],
        "leagues"             : [
            "4e Klasse",
            "3e Klasse",
            "2e Klasse",
            "1e Klasse",
            "Hoofdklasse",
            "Topklasse",
            "1e Divisie",
            "Eredivisie"
        ],
        "replaceClubName"     : "Profiel van",
        "ScriptAuthorClubId"  : "108310",
        //Aşağıdaki kısım düzeltilmeli!
        "ClubExchange"        : "Kulüp Değiştirme",
        "bidTexts"            : {
            'accept': 'Geaccepteerd',
            'reject': 'Afgewezen',
            'read'  : 'Gelezen',
            'new'   : 'Nieuw'
        },
        'news' : {
            "youngPlayer": {"title":'Jeugdspeler',"beforeName":"De speler","afterName":"zou zeker"},
            "increaseBid": {"title":"Transfer markt","control":"overboden","beforeName":"transferbod op","afterName":"werd door"},
            "sellPlayer" : undefined,
        },
        "ageDates"            : undefined
    }
};
let GetText = (key, opt={tag:1})=>Translate.getText(key, opt);

class Page{
    constructor(name, page_selector,run=null,sub_pages=null,parent_page=null){
        this.name = name;
        if(parent_page!==null) this.parent_page = parent_page;
        this.page_selector = page_selector;
        if(run!=null) this.run = run;
        this.features = [];
        this.features.getByName = function(n){
            return this.find(f=>f.name==n);
        };
        if(Array.isArray(sub_pages) && sub_pages.length) this.sub_pages = sub_pages;

    }
    addFeature(feature){
        this.features.push(feature);
    }
    getActiveFeatures(){
        return this.features.filter(f=>f.active);
    }
    parentsByName(name){
        let temp = this.parent_page;
        while(temp instanceof Page && temp.name!=name) temp = temp.parent_page;
        return temp;
    }
    findPath(){
        let temp = this.parent_page,
            path = this.name;
        while(temp instanceof Page){
            path=temp.name+"->"+path;
            temp=temp.parent_page;
        }
        return path;
    }
}

let Game = new (class{
    constructor(){
        this.currentPage = null;
        this.pages = [];
        this.pages.getByName = function(name){
            let names = name.split('->');
            if(names.length==1) return this.find(p=>p.name==names[0]);
            try{
                return eval("this.getByName('"+names.join("').sub_pages.getByName('")+"')");
            }
            catch(err){
                return undefined;
            }
        };
        this.pages.add = function(name, page_selector, run=null, sub_pages=null, parent_page=null){
            let page = (parent_page instanceof Page?parent_page.sub_pages:this).getByName(name);
            if(page instanceof Page) throw new Error(`A page with this name(${name}) was previously created in ${parent_page===null?'game page as top page':'sub pages of '+parent_page.name + ' page'}`);

            page = new Page(name, page_selector, run, sub_pages, parent_page);
            if(Array.isArray(sub_pages)){
                if(!Array.isArray(sub_pages[0])) sub_pages=[sub_pages];
                page.sub_pages = sub_pages;
                page.sub_pages.getByName = Game.pages.getByName;
                page.sub_pages.forEach((sub_page,i)=>{
                    page.sub_pages[i] =  Game.pages.add(
                        sub_page[0], //name
                        sub_page[1], //page_selectort
                        sub_page.length>2?sub_page[2]:null, //page run function
                        sub_page.length>3?sub_page[3]:null, //page sub pages
                        page
                    )
                });
            }
            if(parent_page!==null) return page; //this page is sub page
            this.push(page);
        };
        this.link = new (function(){
            this.pr = {};
            this.on = function(a){
                if(!Array.isArray(a)) a = [a];
                for(let i=0,len=a.length;i<len;i++){
                    for(let p in a[i]){
                        let v=a[i][p];
                        if(!Array.isArray(v)) v = [v];
                        if(!(this.pr.hasOwnProperty(p) && v.includes(this.pr[p]))) return 0;
                    }
                }
                return 1;
            }
        })();
    }

    pageLoad(){// USE in async function: await PageLoad();
        return new Promise(function(res,rej){
            setTimeout(function(){
                if(!$('#body').hasClass('loading')) res(10);
                else{
                    let counter=0,
                        a = setInterval(function(){
                            ++counter;
                            if(!$('#body').hasClass('loading')){
                                clearInterval(a);
                                res(counter*50);
                            }
                        },50);
                }
            },10);
        });
    }

    async initialConfigure(){
        delete this.__proto__.initialConfigure;

        this.timeDifference = (
            await this.getInitialServerTime()
            + Math.round(Math.abs(window.performance.timing.responseEnd-window.performance.timing.requestStart)/2)
            + new Date().getTime()-window.performance.timing.responseEnd
        ) - new Date().getTime(); //Difference between server and pc

        /*printServerTime();
        setInterval(printServerTime,1000);
        function printServerTime(){
            console.clear();
            console.log(
                'Server Time: '+$('#server-time').text()+
                '\nTool Time  : '+new Date(Game.getTime()).toLocaleTimeString()+
                '\nPC Time    : '+new Date().toLocaleTimeString()
            );
        }*/

        let z_index = parseInt($('#chatToggleBtn').css('z-index'));
        if(!isNaN(z_index)){
            let z_index_ = parseInt($('#feedback').css('z-index'))||0;
            if(z_index_<=z_index) $('#feedback').css('z-index',z_index+1);
        }
    }

    giveNotification(NotificationType,Text){
        $('#feedback').prepend(
            `<p class="${NotificationType?'notice':'error'}" style="left: 0px;${NotificationType?'background:#1ba0de;border: 1px solid #000000;':''}">`+
            `   <span class="icon"></span>`+Text+
            `</p>`
        );
        $('#feedback p:not(.minified)').each(function(a,e){
            $(e).css('left',($(document).width() - $(e).outerWidth()) / 2);
            setTimeout(()=>{
                $(e).addClass('minified').css({left : 0});
            },4000);
        });
        $('#feedback p').each(function(key){
            if(key>19) {
                $(this).slideUp(function(){
                    $(this).remove();
                });
            }
        });
    }

    getInitialServerTime(){
        delete this.__proto__.getInitialServerTime;
        return new Promise(function(res,rej){
            $('<button id="TimeTrigger">').hide().appendTo('body').click(function(){
                $(this).off().remove();
                let server_time = JSON.parse($(this).attr('server_time'));
                Tool.modifyGameFunction('showServerTime',function(content){
                    return content.substring(content.indexOf('/*{end}*/')+9);
                });
                res(server_time);
            });
            Tool.modifyGameFunction('showServerTime',function(content){
                return `$('#TimeTrigger').attr('server_time',
                            (function getServerTime(args){
                                args[1] = parseInt(args[1])-1; // month [0-11]
                                return new Date(...args).getTime();
                            })([...arguments])
                        ).click();/*{end}*/` + content;
            });
        });
    }
    getTime(){
        return this.timeDifference+new Date().getTime();
    }

    async detectPage(clear=true){
        if(clear) console.clear();
        console.log('Game Time: ' + new Date(this.getTime()).toLocaleString());
        await Game.pageLoad();

        this.link.pr = location.hash.substring(location.hash.indexOf('?')+1).split('&').reduce((acc, i)=>{
            let parts = i.split('=');
            acc[parts[0]] = parts[1];
            return acc;
        }, {});

        //Problem : https://forum.fussballcup.de/showpost.php?p=7513019&postcount=1
        $('#content table:has(.open-card)').each(function(){
            if($(this).width()>942){
                $(this).css({'display':'block','overflow-x':'auto'});
            }
        });

        function find_page(pages){ //BFS Search
            if(!Array.isArray(pages) || !pages.length) return undefined;
            let page = pages.find(page=>{
                return Game.link.on(page.page_selector);
            });
            if(page!==undefined) return page;
            let pages_ = [];
            pages.filter(page=>{
                return page.sub_pages && Array.isArray(page.sub_pages) && page.sub_pages.length;
            }).forEach(page=>{
                pages_.push(...page.sub_pages);
            });
            return find_page(pages_);
        }

        let prev_page = this.currentPage;
        this.currentPage = find_page(this.pages);
        console.log('Current Page : ' + (this.currentPage||{}).name+ (prev_page==null?"":"\nPrevious Page: " + prev_page.name));

        if(prev_page instanceof Page){
            if(prev_page.name=="tournament"){
                if(this.currentPage.name!="tournament" && Tool.hasOwnProperty('tournaments_data')) delete Tool.tournaments_data;
            }
            else if(prev_page.findPath()=='live->match'){
                if(typeof unsafeWindow.timeout_1 != 'undefined') clearTimeout(unsafeWindow.timeout_1);
            }

            //Özelliklerin olduğu tablo temizleniyor. Çünkü sayfa değiştirildi ve bu sayfada başka özellikler olabilir.
            Tool.featuresList.clear();

            //Önceki sayfalardan kalan sayaçlar sıfırlanıyor.
            Tool.intervals.clear();
        }

        if(this.currentPage == undefined){
            $('#featureList').after(
                `<p class="not-detected-info" style="color:red; font-weight:bold; text-align:center; border:1px dotted gray; border-radius:7px; margin:10px 0"${GetText('notdetected')}"</p>`
            );
        }
        else{
            $('#ScriptMenu .not-detected-info').remove();

            if(typeof this.currentPage.run == 'function') this.currentPage.run();

            this.currentPage.getActiveFeatures().forEach(f=>{
                f.work = false !== f.run();
            });

            //Sayfalarda çalışan özelliklerin olduğu tablo gösteriliyor
            Tool.featuresList.show(this.currentPage.features);
        }

        //Bir sonraki yaş atlamaya kalan süre sayaç şeklinde en alt menüye ekleniyor.
        (()=>{
            let sTime = Game.getTime(),
                ageDates = Tool.ageDates;
            if(!Array.isArray(ageDates) //Yaş atlama tarihleri mevcut değilse
               || $('#FutureAge').length //Geri sayım sayacı bulunuyorsa
               || ageDates[ageDates.length-1]*60000<sTime //Server zamanı, yaş atlama tarihlerinin sonuncusundan büyükse
              ) return;
            let nextAgeDate = ageDates.find(date=>date*60000>sTime);
            if(nextAgeDate === undefined){
                return;
            }
            nextAgeDate*=60000;

            let remainingTime = parseInt((nextAgeDate-sTime)/1000);//Yaş atlamaya kalan saniye hesaplanıyor.
            $('#footer > div').css('width','300px');
            $('#footer > .server-infos').prepend(
                `<li style="padding: 4px 5px;font-size:12px;" title="${new Date(nextAgeDate).toLocaleString()}">`+
                `   ${GetText('NewAge')} : <label id="FutureAge">${SecToTime(remainingTime--)}</label>`+
                `</li>`
            );
            Tool.intervals.create(function(){ //eslint-disable-line no-loop-func
                $('#FutureAge').html(SecToTime(remainingTime--));
                if(remainingTime<1){
                    $('#FutureAge').html('Yaş Atladı');
                    this.delete();
                }
            },1000);
        })();

        //Sayfanın düzeltildiği ana başlığa bildiriliyor.
        $('#content').find('h2').first().attr('Fixed',this.getTime());
    }
    startDetectingPageChanging(){
        delete this.__proto__.startDetectingPageChanging;

        Tool.modifyGameFunction(//The function named updateLayout are needed update for the FCUP Script. Because when the page change, fcup script should work then.
            'updateLayout',
            function(content){
                content =  `\ntry{\nconsole.log("run updateLayout");`+ content + `\n}\ncatch(e){\nconsole.error('updateLayout: %o',e);}\n$('#ChangeContent').click();`;
                let idx = content.indexOf('scores.php?world');
                if(idx==-1) return content;
                let idx2 = content.substring(idx).search(/function\s*\(\s*transport/);
                if(idx2==-1) return content;
                idx = content.indexOf('{',idx+idx2);
                if(idx==-1) return content;
                ++idx;
                if(!Tool.hasOwnProperty('goalTrigger')) Tool.goalTrigger = 0;
                Tool.goalTrigger+=2;
                return content.substring(0,idx)+
                    GetFuncContent(()=>{
                    if($('#NewGoalCatcher').length){/*This codes were written by FCUP Script.*/
                        try{
                            var datas = JSON.parse(transport); /*eslint-disable-line no-undef*/
                            for(let matchId in datas){
                                let data = datas[matchId], score = $('#'+matchId+' > .score');
                                if($('#MatchEndCatcher').length && data.status=="ended") $('#MatchEndCatcher').trigger('click', [matchId]);
                                if(
                                    [data.home_goals, data.away_goals].find(v=>[null, undefined].includes(v))!==undefined ||
                                    data.home_goals==parseInt(score.find('.score-home').text()) &&
                                    data.away_goals==parseInt(score.find('.score-away').text())
                                ){
                                    delete datas[matchId];
                                    continue;
                                }
                            }
                            if(Object.keys(datas).length) $('#NewGoalCatcher').trigger('click', [datas]);
                        }catch(err){ console.error(err);}
                    }
                }) + content.substring(idx);
            }
        );
    }

    getPage(url,querySelector=null,callBack=null,fail=0,layoutData=null){
        //let argNames = ['url','querySelector','callBack','fail','layoutData'];
        //console.log(`[getPage] ${url}, arguments: %o`, Array.from(arguments).slice(1).reduce((acc,i,idx)=>{acc[argNames[idx+1]]=i;return acc;},{}));
        return new Promise((res,rej)=>{
            $.get(url, function(response){
                let layout = url.indexOf('&layout=none')!=-1,
                    page = $('<html>').html(layout?response.content:response);

                let newSecureId = page.find('input[name="secureId"][type="hidden"]');
                if(newSecureId.length) $('body').find('input[name="secureId"][type="hidden"]').val(newSecureId.first().val());

                if(layout && layoutData!=null){
                    if(!Array.isArray(layoutData)){
                        if(typeof layoutData != "string") throw new Error("layoutData must be array or string");
                        layoutData = [layoutData];
                    }
                    let data = Object.entries(response).filter(i=>layoutData.includes(i[0])), r;
                    if(querySelector != null && (r = data.find(i=>i[0]=='content'))!==undefined) r[1]=page.find(querySelector);
                    res(Object.fromEntries(data));
                    return;
                }

                if(typeof querySelector!='string' || (querySelector=querySelector.trim())==""){
                    res(page);
                    return;
                }
                let e = page.find(querySelector);
                if(e.length!=0){
                    if(typeof callBack=='function') callBack(e);
                    res(e);
                    return;
                }
                rej(new Error("Game->getPage->html->find->querySelector->length==0"));
            }).fail(function(){
                if(++fail<3){
                    setTimeout(()=>{Game.getPage(url,querySelector,callBack,fail);},250);
                }
                else rej(new Error("Game->getPage->fail 3 times"));
            }).always(function(){
            });
        });
    }
})();

//CATEGORY: TEAM
Game.pages.add('squad',{
    'module':'team','action':'squad'
},function(){
    let comingPlayersCount = $('#players-table-changes > tbody').find('.open-card').length;
    if(comingPlayersCount.length) $('#players-table-changes').prev('h3').append(`<span style="float:right;">${comingPlayersCount} ${comingPlayersCount>1?GetText('Players'):GetText('Player')}</span>`);
});
Game.pages.add('formation',{
    'module':'formation','action':'index'
},function(){
    if($('#squad span.field-player').length>1 || $('#bank span.field-player').length>1 ){
        if($('#squad').find('span.field-player').length>1){
            Create('squad');
            $('#squad').css('height','auto');
        }
        if($('#bank').find('span.field-player').length>1) Create('bank',27);
        function Create(divId,addHeight=0){
            $('#'+divId).css('min-height',parseInt($('#'+divId).css('height'))+addHeight).find('>h3:first').after(
                '<p class="sorting_players">'+
                '   <label>'+
                '      <input type="radio" name="sorting_preference_'+divId+'" value="Position">'+GetText('Position')+
                '   </label>'+
                '   <label>'+
                '      <input type="radio" name="sorting_preference_'+divId+'" value="Strength">'+GetText('Strength')+
                '   </label>'+
                '</p>'+
                '<p class="filterByPositions"></p>'
            );
            let positions = [...new Set($('#'+divId).find('span.field-player').toArray().map(e=>$('>div >div.position',e).text()))],
                POSITIONS = Tool.footballerPositions;
            positions.sort((a,b)=> POSITIONS.findIndex(x=>x==a)-POSITIONS.findIndex(x=>x==b));

            let filterByPositions = $('#'+divId+' > p.filterByPositions'),
                b_colors = ['green','#72ed72','#72ed72','#3f8a83','yellow','yellow','yellow','red'],
                f_colors = ['white','black','black','white','black','black','black','white'];
            positions.forEach(pos=>{
                let index = POSITIONS.findIndex(x=>x==pos);
                filterByPositions.append(`<span class="filter_position disHighlight" style="background-color:${b_colors[index]};color:${f_colors[index]};">${pos}</span>`);
            });
            filterByPositions.find('.filter_position').click(function(){
                $(this).css("pointer-events", "none");
                let isActive = !$(this).hasClass('not_active'),
                    pos = $(this).text();
                $(this)[isActive?'addClass':'removeClass']('not_active').parents('div.ui-droppable').find('span.field-player').each(function(){
                    if($('> div > div.position',this).text()==pos) $(this)[isActive?'slideUp':'slideDown'](200);
                });
                setTimeout(()=>$(this).css("pointer-events", ""),200);
            });
        }
        $('#squad,#bank').find('>.sorting_players input').click(function(){
            let div = $(this).parents('div.ui-droppable'),
                players = div.find('span.field-player'),
                positions = Tool.footballerPositions;
            switch(this.value){
                case 'Position':
                    players.sort(function(a,b){
                        let compare;
                        if(compare = positions.findIndex(x=>x==$(' > div > div.position',a).text()) - positions.findIndex(x=>x==$(' > div > div.position',b).text())) return compare;
                        else if(compare = parseInt($(' > div > div.strength',b).text())-parseInt($(' > div > div.strength',a).text())) return compare;
                        return plObj[a.id.split('-')[2]].age-plObj[b.id.split('-')[2]].age;
                    }).appendTo(div);
                    break;
                case 'Strength':
                    players.sort(function(a,b){
                        let compare;
                        if(compare = parseInt($(' > div > div.strength',b).text()) - parseInt($(' > div > div.strength',a).text())) return compare;
                        else if(compare = positions.findIndex(x=>x==$(' > div > div.position',a).text()) - positions.findIndex(x=>x==$(' > div > div.position',b).text())) return compare;
                        return plObj[a.id.split('-')[2]].age-plObj[b.id.split('-')[2]].age;
                    }).appendTo(div);
                    break;
            }
        });

        let sorting_preferences = undefined || {squad:'Position',bank:'Strength'}
        $('#squad .sorting_players input[value="'+sorting_preferences.squad+'"]:first').click();
        $('#bank .sorting_players input[value="'+sorting_preferences.bank+'"]:first').click();
    }

    if(true){ //To show the leadership values of football players
        $('#formation-select-captain > span > select > option:not([value="0"])').each(function(){
            let playerId = this.value;
            if(!plObj[playerId]) return true;
            let attr_leadership = parseInt(plObj[playerId].attr_leadership),
                text = $(this).html(),
                find = text.indexOf(')');
            if(find==-1) return true;
            $(this).html("(" + attr_leadership + ")" + text.substring(find+1));
        });

        let selectedCaptain = plObj[$('#formation-select-captain > span > select > option:selected').val()];
        if(selectedCaptain){
            let attr_leadership = selectedCaptain.attr_leadership,
                text = $('#formation-select-captain > span > div.button > span.text').html(),
                find = text.indexOf(')');
            $('#formation-select-captain > span > div.button > span.text').html("(" + attr_leadership + ")" + text.substring(find+1));
        }

        let li = $(SelectBox.instances[$('#formation-select-captain > span').attr('instance')].expand[0]).find('li') ;
        li.each(function(){
            let playerId = this.getAttribute('idvalue');
            if(!plObj[playerId]) return true;
            let attr_leadership = parseInt(plObj[playerId].attr_leadership),
                text = $(this).html(),
                find = text.indexOf(')');
            if(find==-1) return true;
            $(this).html("(" + attr_leadership + ")" + text.substring(find+1));
            $(this).attr('leadership',attr_leadership);
        });

        let arr = li.map(function(_, o) {
            return {
                text       : $(o).text(),
                idvalue    : $(o).attr('idvalue'),
                leadership : $(o).attr('leadership')
            };
        }).get();

        arr.sort((o1, o2)=>{ return o2.leadership-o1.leadership;});

        li.each(function(i, option) {
            $(option).text(arr[i].text).attr({
                'idvalue':arr[i].idvalue,
                'leadership':arr[i].leadership
            });
        });
    }
});
Game.pages.add('training',{
    'module':'team','action':'index'
},null,[
    [
        'groups',
        {'module':'team','action':'groups'}
    ],[
        'settings',
        {'module':'team','action':'settings'},
        function(){
            $('#groupNameForm > table > tbody').find('input').attr('maxlength',16).mouseenter(function(){
                $(this).focus().attr('placeHolder',$(this).val()).val('');
            }).mouseleave(function(){
                if($(this).val().trim()=="") $(this).val($(this).attr('placeHolder'));
                $(this).removeAttr('placeHolder').focusout();
            });
        }
    ]
]);
Game.pages.add('camp',{
    'module':'team','action':'camp'
});
Game.pages.add('scout',{
    'module':'transfermarket','action':'scout'
});
Game.pages.add('transfermarket',{
    'module':'transfermarket','action':'index'
},function(){
    /*Transfermarket Filter*/
    $('.table-container:first').children().first().after(
        '<div id="show_transfermarket_filter" style="margin:5px 0;">'+
        '&#10148; <span style="cursor:pointer;background-color:green;padding:2px;margin-left:-2px;border-radius:7px;" id="ShowAllPlayers">'+GetText('ShowAllPlayers')+'</span><br>'+
        '&#10148; <span style="cursor:pointer;" id="OnlyForeignPlayers">'+GetText('OnlyForeignPlayers')+'</span><br>'+
        '</div>'
    );
    $('#ShowAllPlayers').click(function(){
        $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(i){
            $(this).show();
            $(this).attr('class',i%2==0?"odd":"even");
        });
        $(this).css({
            'background-color':'green',
            'padding':'2px',
            'margin-left':'-2px',
            'border-radius':'7px'
        });
        $('#OnlyForeignPlayers')[0].style = "cursor:pointer;";
    });
    $('#OnlyForeignPlayers').click(function(){
        let counter=0;
        $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(){
            if(!$('td:nth-child(1) > img',this).attr('src').endsWith(Tool.flag+'.gif')){
                $(this).show();
                $(this).attr('class',counter++%2?'even':'odd');
            }
            else $(this).hide();
        });
        $(this).css({
            'background-color':'green',
            'padding':'2px',
            'margin-left':'-2px',
            'border-radius':'7px'
        });
        $('#ShowAllPlayers')[0].style = "cursor:pointer;";
    });


    //Kulüp arama kısmındaki tüm metni silmek için.
    $('#club').after('<img style="float:right;margin:2px 2px 0 0;cursor:pointer;" id="clearText" src="'+Tool.sources.getLink('https://www.clipartmax.com/png/full/301-3016667_red-cross-clipart-high-resolution-red-cross-emoji-gif.png')+'" alt="remove" width="10px">');
    $('#clearText').click(function(){
        clearText('club');
        function clearText(id){
            let text = $('#'+id).val(),
                length = text.length;
            while(length>0){
                setTimeout(function(){
                    let t = $('#'+id).val();
                    $('#'+id).val(t.substring(0,t.length-1));
                },(text.length-length)*25);
                length--;
            }
        }
    });


    if(Game.server == 'tr') $('#age_min').parents('li:first').next().find('>span:first').css('margin-left','-34px').html('Yerli Futbolcu');

    //Kulübümüzün transfer pazarını göstermek için:
    $('#content > .container:first').append(CreateButton('ShowMyTransferMarket', GetText('ShowMyMarket'),'margin-Right:12px; top:71px; right:0; position:absolute; z-index:'+$('#content .search-container:first').css('z-index')+';'));
    $('#ShowMyTransferMarket').click(function(){
        $('#age_min').val(16);
        $('#age_max').val(34);
        $('#searchform > ul > li.strength > span:nth-child(2) > input[type="text"]').val(0);
        $('#searchform > ul > li.strength > span:nth-child(3) > input[type="text"]').val(999);
        $('#positions').val(0);
        $('#club').val(Tool.clubName);
        $('#searchform > ul > li.transfermarket-search-button > span > a > span').click();
    });


    //Show total bid
    if($('#club').val().trim()==Tool.clubName){
        let totalBid = 0;
        $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(){
            var o = $('td:nth-child(7)',this).find('.currency-number');
            if(o.length) totalBid += parseInt(o.first().text().replace(/\./g,''));
        });
        if(totalBid>0){
            $('#content > div.container.transfermarket > div.table-container > table > tfoot > tr').html(
                `<td colspan="5"></td>`+
                `<td colspan="2" style="color:#edfdff;font-weight:bold;text-align:right;">${GetText('totalBid')}: ${(totalBid).toLocaleString()} <span class="icon currency"></span></td>`+
                `<td colspan="3"></td>`
            );
        }
    }


    //For the movement of the transfer page with the left and right arrow keys
    /*if($('#container .pager').length){
        $(document).keydown(function(e){
            document.title = "Click:"+Math.floor(Math.random()*1000);
            let a=undefined
            if(e.which==37) a = $('#container .pager > strong:first').prev()[0];
            else if(e.which==39) a = $('#container .pager > strong:first').next()[0];
            if(a!=undefined && a.tagName=='A') a.click();
        });
    }*/
});

//CATEGORY: SEASON
Game.pages.add('fixture',{
    'module':'statistics','action':'games'
});
Game.pages.add('league',{
    'module':'statistics','action':'table'
});
Game.pages.add('friendly',{
    'module':'friendly'
},function(){
    if(!$('#own-invitations-table > tbody > tr').find('.no-invites').length){
        //Kendi arkadaşlık maç davetlerimizin silinmesi
        $('#invitations > div.table-container > div:nth-child(1) > h3').append(CreateButton('ClearInvitations', GetText('CancelUnnecessaryDays'),'float:right;margin-right:5px;'));
        $('#ClearInvitations').click(function(){
            var doluTarihler = {};
            $('#friendly-matches > tbody > tr').each(function(){
                doluTarihler[$(this).find('td:nth-child(2)').attr('sortvalue')] = '';
            });
            var silinecekIstekKeyleri = [];
            $('#own-invitations-table > tbody > tr').each(function(){
                if(doluTarihler[$(this).find('td:nth-child(2)').attr('sortvalue')]!==undefined){
                    var href = $(this).find('td.last-column > a')[0].href;
                    silinecekIstekKeyleri.push(href.substring(href.indexOf('delete=')+7,href.lastIndexOf('&')));
                }
            });
            if(silinecekIstekKeyleri.length){
                clearInvitations();
            }
            async function clearInvitations(){
                if(!silinecekIstekKeyleri.length){
                    Game.detectPage();
                    return;
                }
                var key = silinecekIstekKeyleri[0];
                silinecekIstekKeyleri.splice(0,1);
                location.href = "#/index.php?w="+worldId+"&area=user&module=friendly&action=index&delete="+key;
                await Game.pageLoad();
                clearInvitations();
            }
        });
    }
});
Game.pages.add('simulation',{
    'module':'simulation'
},function(){
    let LeagueData = Tool.getVal('LeagueData');
    if(LeagueData!=undefined){
        if((LeagueData.lastMatchDate+86400000)>Game.getTime()){
            let clubs = LeagueData.clubs;
            $('#simulations > tbody').find('.name-column').each(function(){
                let a = $(this).find('a:first'),
                    clubId = a.attr('clubid');
                if(!clubs.hasOwnProperty(clubId)) return;
                $(this).parent().css('background','green').attr({
                    'title': GetText('SameLeague', {tag:0}),
                    'tool_tt': 'SameLeague'
                });
            })
        }
        else Tool.delVal('LeagueData');
    }
});
Game.pages.add('tournament',{
    'module':'tournament','action':['index','tournament','holding']
});
Game.pages.add('betoffice',{
    'module':'betoffice'
});

//CATEGORY: CLUB MANAGEMENT
Game.pages.add('sponsors',{
    'module':'club','action':'sponsors'
});
Game.pages.add('publicrelations',{
    'module':'publicrelations'
});
Game.pages.add('assistants',{
    'module':'assistants'
},function(){
    let bars = $('#assistants').find('.bar'),
        values = [];
    bars.each(function(){
        values.push(parseInt(this.style.width.replace('%','')));
        this.style.width = '0%';
    });
    if(values.length){
        Tool.intervals.create(function(){
            for(let i = 0, width ; i < bars.length ; i++){
                width = bars[i].style.width;
                width = parseInt(width.substring(0,width.lastIndexOf('%')));
                if(width<values[i]) bars[i].style.width = (width+1)+'%';
                else{
                    bars.splice(i,1);
                    values.splice(i,1);
                }
            }
            this.delete();
        },20,'Asistants');
    }
});
Game.pages.add('finances',{
    'module':'finances'
});
Game.pages.add('stadium',{
    'module':'stadium'
});
Game.pages.add('buildings',{
    'module':'buildings'
});
Game.pages.add('shop',{
    'module':'shop'
});

//CATEGORY: STATISTICS
Game.pages.add('rating',{
    'module':'rating'
});
Game.pages.add('statistics',{
    'module':'statistics','action':'season'
});
Game.pages.add('tournament_history',{
    'module':'tournament','action':'history'
});
Game.pages.add('squadstrenght',{
    'module':'statistics','action':'squadstrenght'
});
Game.pages.add('goalgetter',{
    'module':'statistics','action':'goalgetter'
});
Game.pages.add('sales',{
    'module':'statistics','action':'sales'
});
Game.pages.add('team_history',{
    'module':'team','action':'history'
});

//CATEGORY: COMMUNITY
Game.pages.add('press',{
    'module':'press','action':'index'
},null,[
    [
        'article',
        {'module':'press','action':'article'}
    ],[
        'topnews',
        {'module':'press','action':'topnews'}
    ],[
        'settings',
        {'module':'press','action':'settings'}
    ],[
        'comment',
        {'module':'press','action':'comment'}
    ]
]);
Game.pages.add('friends',{
    'module':'friends'
});
Game.pages.add('neighbors',{
    'module':'main','action':'neighbors'
});
Game.pages.add('signatures',{
    'module':'profile','action':'signatures'
});

//CATEGORY: CLUB
Game.pages.add('premium',{
    'module':'premium'
});
Game.pages.add('menager_profile',{
    'module':'profile','action':'index'
});
Game.pages.add('club_profile',{
    'module':'profile','action':'club'
});
Game.pages.add('manager',{
    'module':'profile','action':'show'
});
Game.pages.add('mail',{
    'module':'mail','action':'index'
},null,[
    [
        'outbox',
        {'module':'mail','action':'outbox'}
    ],[
        'archive',
        {'module':'mail','action':'archive'}
    ],[
        'ignore',
        {'module':'mail','action':'ignore'}
    ]
]);
Game.pages.add('tricotshop',{
    'module':'tricotshop'
});

//NON-CATEGORY
Game.pages.add('main',{
    'module':'main','action':['home','acceptSimulation','deleteSimulation','accept']
});
Game.pages.add('live',{
    'module':'live','action':'index'
},null,[
    [
        'league',
        {'module':'live','action':'league'}
    ],[
        'match',
        {'module':'live','action':'match'},
        function(){
            if($('#match').length){//Match is exist
                // Add images
                $('#goal-event-container').after(
                    `<div id="DivCards" class="match event-container" style="display:none;">`+
                    `   <img id="yellow_card" src="${Tool.sources.getLink('yellowCard','png')}" alt="yellowCard" style="display:none;">`+
                    `   <img id="red_card" src="${Tool.sources.getLink('redCard','png')}" alt="redCard" style="display:none;">`+
                    `   <img id="yellow_red_card" src="${Tool.sources.getLink('yellowRedCard','png')}" alt="yellowRedCard" style="display:none;">`+
                    `</div>`
                );

                // Add audios
                $('#goal-event-container').after(
                    '<div id="Songs">'+
                    '   <audio id="goalSound" src="https://static.wixstatic.com/mp3/fcacd5_2794b8a8827a475eaf9a3241be0c42d5.mp3"></audio>'+
                    '   <audio id="whistle1" src="https://static.wixstatic.com/mp3/fcacd5_4f0052fc29104ead86761cbb08d50774.mp3"></audio>'+
                    '   <audio id="whistle2" src="https://static.wixstatic.com/mp3/fcacd5_b967408abf59401d9b71778ea45ae2b9.mp3"></audio>'+
                    '   <audio id="whistle3" src="https://static.wixstatic.com/mp3/fcacd5_c4ccd759ec62404cb59f6a8ff906e110.mp3"></audio>'+
                    //'   <audio id="backgroundSound" loop src="https://static.wixstatic.com/mp3/fcacd5_5a27a4e8ed2a482099ea0ba8839d4db9.mp3"></audio>'+
                    '   <audio id="fan1" loop src="https://static.wixstatic.com/mp3/fcacd5_d7123a0a3c2f469cbdf603067579de93.mp3"></audio>'+
                    '   <audio id="fan2" loop src="https://static.wixstatic.com/mp3/fcacd5_fde7b7b934d24cf98771cc022eb6bee3.mp3"></audio>'+
                    '</div>'
                );

                // Add Goals Container
                $('#match-messages').before(
                    '<div style="width: 840px;position: absolute;left: 65px;top: 101px;color:white;">'+
                    '   <div id="home-goals" style="float:left;width:48%;height:100%;text-align:center;overflow: auto;line-height:16px;height:38px;"></div>'+
                    '   <div id="away-goals" style="float:right;width:48%;height:100%;text-align:center;overflow: auto;line-height:16px;height:38px;"></div>'+
                    '</div>'
                );

                // Is this match own?
                currentLive.ownMatch = $('#'+currentLive.matchId +' h3 a[clubid="'+Tool.clubId+'"]').length!=0;


                unsafeWindow.jQuery('<span id="MatchEventCatcher">').hide().appendTo('#content').click(function(_, event){
                    if(event.message) {
                        switch(event.type){
                            case 'goal': case 'penalty': case 'penaltyShootout':
                                if(event.type!='penaltyShootout' || event.goal == 'goal'){
                                    if(currentLive.lastActiveMin < 120){ // GOOOOALL : event['team']
                                        if(event._status == 'new'){
                                            if(currentLive.ownMatch && event.team == currentLive.ownSquad){
                                                $('#goalSound')[0].currentTime = 0;
                                                $('#goalSound')[0].play();
                                            }

                                            if($('#NewGoalCatcher').length){
                                                unsafeWindow.jQuery('#NewGoalCatcher').trigger('click', {
                                                    [currentLive.matchId]: { //Note: New goal has not yet been added to the element (score-home or score-away)
                                                        "status": event.action=="end"?"ended":"active",
                                                        "home_goals": parseInt($('#'+currentLive.matchId + '> span.score > div:first > span.score-home').text()) + (event.team==currentLive.homeId?1:0),
                                                        "away_goals": parseInt($('#'+currentLive.matchId + '> span.score > div:first > span.score-away').text()) + (event.team==currentLive.awayId?1:0),
                                                        "min": event.min
                                                    }
                                                });
                                            }
                                        }

                                        let message = event.message,
                                            team_matchId = event.team,
                                            min = event.min,
                                            team = currentLive.homeId==team_matchId?"home":"away",
                                            goal_scorer_lastname = $('<div>').html(message).find('.'+team+':last').text().trim(),
                                            fonded_players = Object.values(currentLive.players[team_matchId]).filter(p=>p.lastname==goal_scorer_lastname)

                                        if(fonded_players.length==1){
                                            let goal_scorer = fonded_players[0],
                                                spn = $('#player-goals-'+goal_scorer.id);
                                            if(!spn.length){ // player's first goal
                                                if($('#'+team+'-goals > span').length) $('#'+team+'-goals').append(' , ');
                                                $('#'+team+'-goals').append(
                                                    `<span style="color:${team=="home"?'#f00':'#0ec6e7'};white-space:nowrap;">`+
                                                    `   <img src="https://image.ibb.co/jdRxmK/Ads_z.png" height="15px;" style="vertical-align:middle;margin: 1px 2px 0 0;">`+
                                                    `   <span id="player-goals-${goal_scorer.id}" style="color:white;font-size: 10px;font-weight:bold;">[${min}]</span> ${goal_scorer.lastname}`+
                                                    `</span>`
                                                );
                                            }
                                            else{
                                                let text = spn.text();
                                                spn.text(text.substring(0,text.length-1)+','+min+']');
                                            }
                                        }
                                        else{
                                            if($('#'+team+'-goals > span').length) $('#'+team+'-goals').append(' , ');
                                            $('#'+team+'-goals').append(
                                                `<span style="color:${team=="home"?'#f00':'#0ec6e7'};white-space:nowrap;">`+
                                                `   <img src="https://image.ibb.co/jdRxmK/Ads_z.png" height="15px;" style="vertical-align:middle;margin: 1px 2px 0 0;"> ~`+
                                                `</span>`
                                            );
                                        }
                                    }
                                }
                                break;
                            case 'info':
                                if(event._status == 'new'){
                                    let min = event.min,
                                        whistle = $('#whistle'+(
                                            min==1?1: //Match start
                                            min==45?2: //First half end
                                            event.action=='end'?3: //Match end
                                            2 //Else
                                        ));
                                    if(whistle.length){
                                        whistle=whistle[0];
                                        whistle.currentTime = 0;
                                        whistle.play();
                                    }
                                }
                                break;
                        }
                    }

                    switch(event.type){
                        case 'penaltyShootout':
                            if(event.goal == 'goal'){ //Penaltı atışı gol oldu
                                //Gol atan takım => event.team
                            }
                            else if(event.goal == 'miss'){ //Penaltı atışı kaçtı
                            }
                            break;
                        case 'penaltyShootoutScore': //Penaltı skor tablosu gösteriliyor
                            /*message = currentLive.getMessageElement(event['min']);
                            $(message).addClass('info');
                            $(message).append(event['template']);
                            $('#match-messages').prepend($(message));*/
                            break;
                        case 'red': case 'yellow': case 'yellow_red':
                            if(event._status == 'new'){
                                $('#whistle1')[0].currentTime=0;
                                $('#whistle1')[0].play();
                                if(currentLive.ownMatch && event.squad == currentLive.ownSquad){
                                    $('#DivCards,#'+event.type+'_card').show();
                                    setTimeout(()=>{
                                        $('#DivCards,#'+event.type+'_card').hide();
                                    },event.delay);
                                }
                            }
                            /*var player = $('#field-player-' + event['player']);
                            player.removeClass('weak');
                            player.addClass(event['type']);
                            if (event['type'] != 'yellow') {
                                if (event['squad'] == currentLive.ownSquad) {
                                    $('#out-of-match').append($('#field-player-' + event['player']));
                                    var playerObj = currentLive.players[currentLive.ownSquad][event['player']];
                                    if (playerObj) {
                                        $('#field-player-points-' + event['player']).html(playerObj['points']);
                                        player.off();
                                    }
                                } else {
                                    $('#opponent-out-of-match').append($('#field-player-' + event['player']));
                                }
                                currentLive.players[event['squad']][event['player']]['a_position'] = 'Bank';
                            } */
                            break;
                        case 'move':
                            break;
                        case 'injured':
                            //var isOwnInjuredPlayer = currentLive.ownMatch && event.squad==currentLive.ownSquad;
                            /*currentLive.players[event['squad']][event['player']]['initial_health'] -= event['injuring'];
                        currentLive.setHealthStatus(event['player'], currentLive.players[event['squad']][event['player']]['initial_health']);*/
                            break;
                        case 'bonusHealthLoss':
                            break;
                        case 'bonusHealthGain':
                            break;
                        case 'bonusFormationLoss':
                            break;
                        case 'bonusFormationGain':
                            break;
                        case 'bonusLeadershipLoss':
                            break;
                    }

                    if(event.action == 'end'){
                        if(event._status == 'new'){
                            ['backgroundSound','fan1','fan2'].map(n=>$('#'+n)[0]).forEach((audio,i)=>{
                                if(audio.paused) return;
                                let j = audio.volume*100;
                                for(let t = j ; j>=0 ; j--){
                                    ((j,i)=>{
                                        setTimeout(function(){
                                            audio.volume = j/100;
                                            if(audio.volume < 1) audio.pause();
                                        },(t-j)*50);
                                    })(j,i);
                                }
                            });

                            if($('#NewGoalCatcher').length && event.min==1){ //the match is over due to insufficient number of players
                                let home_goals = $('<div>').html(event.message).find('span.away,span.home').first().attr('class')=="away"?3:0,
                                    away_goals = home_goals==3?0:3;

                                unsafeWindow.jQuery('#NewGoalCatcher').trigger('click', {
                                    [currentLive.matchId]: {
                                        "status": "ended",
                                        "home_goals": home_goals,
                                        "away_goals": away_goals,
                                        "min": event.min
                                    }
                                });
                            }
                        }
                        else{ //Match has been already finished before, no new event will catched
                            $('#backgroundSound').attr('stop',true);
                            ['backgroundSound','fan1','fan2'].map(n=>$('#'+n)[0]).forEach(audio=>{
                                if(!audio.paused) audio.pause();
                            });
                        }
                    }
                });
                if(Array.isArray(Tool.uncaught_events_queue)){
                    Tool.uncaught_events_queue.forEach(event=>{
                        unsafeWindow.jQuery("#MatchEventCatcher").trigger('click', [event]);
                    });
                    delete Tool.uncaught_events_queue;
                }
                if(!Tool.hasOwnProperty('goalTrigger')) Tool.goalTrigger = 0;
                if(Tool.goalTrigger<3) ++Tool.goalTrigger;

                //Show or hide home/away team's players in field.
                for(let squadId in currentLive.players){
                    ((index,playersClass)=>{ //eslint-disable-line no-loop-func
                        let data = {
                            home:{
                                style:'position:absolute;top:600px;',
                                id:"homePlayersFilter",
                                text:GetText('ShowHomeSquad')
                            },
                            away:{
                                style:"position:absolute;top:600px;right:20px;",
                                id:"awayPlayersFilter",
                                text:GetText('ShowAwaySquad')
                            }}[index];

                        $('#formation-container').append(
                            `<div style="${data.style}">`+
                            `   <input id="${data.id}" type="checkBox">`+
                            `   <label for="${data.id}" style="cursor:pointer;">${data.text}</label>`+
                            `</div>`
                        );

                        if(index==="away"){
                            $('#match-handle-container').css('height',"36px");
                            $('#match-handle-container > li:first').css('height',"36px");
                        }
                        $('#'+data.id).click(function(){
                            let checked = this.checked;
                            $('#field').find('.field-player').each(function(){
                                if($(this).hasClass(playersClass)){
                                    $(this)[checked?'addClass':"removeClass"]('hover');
                                }
                            });
                        });
                    })(
                        squadId == currentLive.homeId?"home":"away",
                        squadId == currentLive.ownSquad?"own-player":"opponent"
                    );
                }

                try{
                    //Background Sound is playing
                    setTimeout(function(){
                        let backgroundSound = $('#backgroundSound')[0];
                        backgroundSound.currentTime = 0;
                        backgroundSound.volume = 0;
                        backgroundSound.play();
                        let intervals = [];
                        [...Array(51).keys()].slice(1).forEach(i=>{ // 1 to 50
                            intervals.push(setTimeout(()=>{
                                if(!$('#backgroundSound').attr('stop')){
                                    backgroundSound.volume = i/100;
                                }
                                else{
                                    intervals.forEach(id=>{ clearTimeout(id);});
                                }
                            },(i-1)*50));
                        });
                    },250);
                }
                catch(err){console.error(err);};
            }
        }
    ]
]);

class Feature{
    constructor(name,page_names,run,hover_selector=null){
        this.name = name;
        this.page_names = page_names;
        this.run = run;
        this.active = null;
        this.work = null;
        if(typeof hover_selector == 'string' && (hover_selector=hover_selector.trim())!="") this.hover_selector = hover_selector;
    }
    deactivate(){
        this.active = false;
    }
    activate(){
        this.active = true;
    }
}

let Tool = new (class{
    constructor(){
        this.sources = {
            getLink: (url)=>{
                return url;/*Thanks to mot33*/
            }
        };
        this.features = [];
        this.features.getByName = function(name){
            return this.find(f=>f.name==name);
        }
        this.features.add = function(name,page_names,run,hover_selector=null,otherPages=null){
            if(this.getByName(name) instanceof Feature) throw new Error(`A feature with this name(${name}) was previously created.`);

            let feature = new Feature(name, page_names, run, hover_selector);
            if(!Array.isArray(page_names)) page_names = [page_names];

            page_names.forEach(page_name=>{
                let page = Game.pages.getByName(page_name);
                if(page === undefined) throw new Error(`Page(${page_name}) doesn't exist, therefore feature(${name}) can't be added.`);
                page.addFeature(feature);
            });

            if(otherPages!=null){
                if(!Array.isArray(otherPages[0])) otherPages=[otherPages];
                otherPages.forEach(p=>{
                    let page_name = p[0],
                        run = p[1],
                        page = Game.pages.getByName(page_name)
                    if(page === undefined) throw new Error(`Page(${page_name}) doesn't exist, therefore feature(${name}) can't be added. (Page is in otherPages)`);

                    //Extends page's run function
                    let page_run = page.run;
                    if(typeof page_run=='function'){ //If page's run function already exist, it will be extended
                        page_run = page_run.toString();
                        page_run = page_run.substring(0,page_run.lastIndexOf('}'));
                        run = run.toString();
                        run = run.substring(run.indexOf('{')+1);
                        eval('page.run = '+page_run+`\n\t\t/*Extended by feature named ${name}*/`+run);
                    }
                    else{
                        run = run.toString();
                        let find = run.indexOf('{');
                        eval('page.run = ' + run.substring(0,find+1)+`\n\t\t/*Created by feature named ${name}*/`+run.substring(find+1));
                    }
                });
            }

            this.push(feature);
        };
        this.log_intervals=false;
        this.intervals = new (class{
            constructor(){
                this.named = {};
                this.anonymous = [];
            }
            create(func,delay,name=null){
                let that = this;
                if(typeof name == "string" && (name=name.trim())!=""){
                    if(this.named.hasOwnProperty(name)) throw new Error(`Intervals.create with name(${name}) was already used in one of previous intervals`);

                    let interval = {
                        created_at : new Date().getTime(),
                        name : name,
                        delete : function(){
                            clearInterval(that.named[this.name]);
                            let diff = new Date().getTime()-this.created_at;
                            if(Tool.log_intervals) console.log('[intervals] Named('+this.name+') interval deleted itself after ' + SecToTime(parseInt((diff)/1000))+'.'+(diff%1000));
                            delete that.named[this.name];
                        },
                        func : func
                    };
                    this.named[name] = setInterval(function(){
                        func.call(interval);
                    },delay);
                    if(Tool.log_intervals) console.log('[intervals] Created named('+name+') interval with '+delay+' ms delay');
                }
                else{
                    let id,
                        interval = {
                            created_at : new Date().getTime(),
                            delete : function(){
                                clearInterval(id);
                                let diff = new Date().getTime()-this.created_at;
                                if(Tool.log_intervals) console.log('[intervals] Anonymous interval deleted itself id: '+id+' after ' + SecToTime(parseInt((diff)/1000))+'.'+(diff%1000));
                                that.anonymous.find((item,index,array)=>{
                                    if(item==id){
                                        array.splice(index,1);
                                        if(Tool.log_intervals) console.log('[intervals]\t\t id in annoymous splice index: '+index);
                                        return 1;
                                    }
                                });
                            }
                        };
                    id = setInterval(function(){
                        func.call(interval);
                    },delay);
                    this.anonymous.push(id);
                    if(Tool.log_intervals) console.log('[intervals] Created anonymous interval with '+delay+' ms delay , id: '+id);
                }
            }
            clear(){
                if(Tool.log_intervals) console.log('[intervals] Clear all intervals');
                let named = this.named;
                for(var name in named){
                    clearInterval(named[name]);
                    delete named[name];
                }

                for(let i=0, len=this.anonymous.length; i<len; i++) clearInterval(this.anonymous[i])
                this.anonymous=[];
            }
        })();
        this.defaultFeaturesActiveStatus = {
            "ConstructionCountdown"           : !0,
            "RematchMatch"                    : !0,
            "NumberOfFootballerChecker"       : !0,
            "MatchAnalyst"                    : !0,
            "TrainingControl"                 : !0,
            "ClubExchange"                    : !0,
            "RankingOfPlayers"                : !0,
            "ShowStrengthChange"              : !0,
            "ShowRealStrength"                : !1,
            "CalculateNonYoungPlayersStrength": !0,
            "CalculatingStrengthOfYoungPlayer": !0,
            "YoungPlayersHistory"             : !0,
            "TrainingGroups"                  : !1,
            "CampHistory"                     : !0,
            "TransferDates"                   : !0,
            "GoOffer"                         : !0,
            "ShowBoughtPlayers"               : !0,
            "ShowOwnOfferInMarket"            : !0,
            "FilterOwnOffers"                 : !0,
            "FilterTransferMarket"            : !0,
            "DownloadTable"                   : !0,
            "CancelFriendlyMatchInvites"      : !0,
            "QuickBet"                        : !0,
            "ShowAsistantLevelIncrease"       : !0,
            "QuickShopping"                   : !0,
            "AddImage"                        : !0,
            "InviteSimulationMatch"           : !0,
            "ShowEloRating"                   : !0,
            "LiveMatchesTable"                : !0,
            "SortTournaments"                 : !0,
        };
    }

    async start(){
        delete this.__proto__.start;

        if($('#ChangeContent').length) throw new Error("Script already works!");

        //Fix tool values and print
        this.fixValues();
        this.printValues();

        //Wait game page loading first time
        await new Promise(res=>{
            let a, b = setTimeout(()=>{
                clearInterval(a);
                res();
            },2500);
            a = setInterval(()=>{
                if($('body').hasClass('loading')){
                    clearInterval(a);
                    clearTimeout(b);
                    res();
                }
            },10);
        });

        //Wait game page loaded
        let ms = await Game.pageLoad();
        console.log('Wait for the game to load for the first time : ' + ms + ' ms');

        if($('#logout').length==0) throw new Error("Logout button doesn't exist");

        await Game.initialConfigure(); //After that initialize game configure

        //Get game server and check if it's datas is already in the script
        Game.server = $('body').attr('class').replace('loading','').trim();
        if(!(Game.server in serversDatas)){
            Game.giveNotification(false,"This server is not available in the script!");
            throw new Error("This server is not available in the script!");
        }

        //Get tool features active status data. (Note: getVal use Game.server)
        this.featuresActiveStatus = this.getVal('featuresActiveStatus', this.defaultFeaturesActiveStatus);

        //Tool datas
        for(const [key,value] of Object.entries(serversDatas[Game.server])) this[key] = value;
        serversDatas = undefined;

        let Positions = this.footballerPositions;
        this.strengthFactors = new Proxy({ // this is required to calculate strength of a player
            [['goalkeeper',Positions[0]].join('|')]          : [[ 0,5], [ 1,5], [3,4], [ 8,3], [ 6,2], [10,1], [4,1], [2,1]],
            [['defense',...Positions.slice(1,4)].join("|")]  : [[ 6,4], [ 9,4], [3,3], [ 8,2], [10,2], [ 4,2], [5,2], [7,2], [11,2], [2,1]],
            [['midfield',...Positions.slice(4,6)].join("|")] : [[ 3,4], [10,4], [8,3], [ 5,3], [ 6,2], [ 4,2], [7,2], [9,2], [11,2], [2,1]],
            [['offensive',...Positions.slice(6,8)].join("|")]: [[11,4], [ 3,3], [8,3], [10,3], [ 2,3], [ 6,2], [4,2], [5,1], [ 7,1], [9,1]]
        }, {
            get: function(target, property, receiver) {
                for(let k in target)
                    if(new RegExp(k).test(property))
                        return target[k];
                return null;
            }
        });

        (()=>{
            let penalty_area_safety=0, catch_safety=1, two_footed=2, fitness=3, shot=4, header=5, duell=6, cover=7, speed=8, pass=9, endurance=10, running=11, ball_control=12, aggressive=13;
            this.trainingPlan = { // this is required to check whether player skill that is being improved is true
                [Positions[0]]: [penalty_area_safety, catch_safety, fitness, speed, duell, endurance, shot, two_footed], //TW
                [Positions[1]]: [pass, duell, fitness, cover, speed, endurance, header, shot, running, two_footed], //AV
                [Positions[2]]: [pass, duell, fitness, cover, speed, endurance, header, shot, running, two_footed], //IV
                [Positions[3]]: [duell, pass, fitness, cover, endurance, speed, shot, running, header, two_footed], //DM
                [Positions[4]]: [endurance, fitness, speed, header, pass, running, duell, shot, cover, two_footed], //LM
                [Positions[5]]: [endurance, fitness, speed, header, pass, running, duell, shot, cover, two_footed], //RM
                [Positions[6]]: [running, fitness, speed, endurance, two_footed, shot, duell, pass, header, cover], //OM
                [Positions[7]]: [running, fitness, speed, two_footed, endurance, duell, shot, header, pass, cover]  //ST
            };
        })();
        Positions=undefined;

        //Get translations
        let userLanguages = GM_getValue('userLanguage',{}),
            result, gameDefLanguage = this.language, chooseAlternative=!1;
        if(userLanguages.hasOwnProperty(Game.server) && Translate.existLanguage(userLanguages[Game.server])){
            result = Translate.start(userLanguages[Game.server]); //User preference language
        }
        else{
            if(Translate.existLanguage(gameDefLanguage)) result = Translate.start(this.language); //Default server language
            else{
                result = Translate.start(); //Alternative language
                chooseAlternative=!0;
            }
        }

        if(result.status=='error'){
            Game.giveNotification(false, result.msg);
            throw new Error(JSON.stringify(result, null, '\t'));
        }
        this.language = Translate.locale.name;
        if(chooseAlternative){
            Game.giveNotification(true, `This script hasn't yet been translated into ${gameDefLanguage}!<br>Alternative language[${this.language}] selected!`);
        }

        //Get club datas
        let clubDatas = Tool.getVal('clubDatas'),
            dataResult = this.checkClubData(clubDatas);
        if(dataResult == 'not-exist'){
            clubDatas = await this.createWelcomeMenu();
            dataResult = this.checkClubData(clubDatas);
        }
        delete this.__proto__.createWelcomeMenu;
        delete this.__proto__.checkClubData;

        if(dataResult!='correct'){
            Game.giveNotification(false,"Club datas isn't correct!");
            throw new Error("Club datas isn't correct!");
        }
        for(let [key,val] of Object.entries(clubDatas)) this[key] = val;

        //
        this.checkDatas();

        //...
        this.createToolMenu();
        this.createMenuEvents();
        this.checkVersion();
        this.createNoticeArea();

        //plObj[Oyuncu verileri] nin kaydedilmesi
        /*$.get('?area=user&module=formation&action=index&layout=none',function(response) {
            let r = response.content,
                b = r.lastIndexOf('var plObj');
            if(b!=-1){
                b = r.indexOf('=',b);
                playerObject = JSON.parse(r.substring(b+1,r.indexOf('}};',b)+2));
                if(!typeof playerObject=='object' //Kadroda oyuncu olunca "plObj = {...};" oluyor.
                   || Array.isArray(playerObject) //Kadroda hic oyuncu olmazsa "plObj = [];" oluyor.
                  ) playerObject = undefined;
            }
        });*/

        $('<span id="ChangeContent">').hide().appendTo('body').click(function(){
            if(!$('#content').find('h2').first().attr('Fixed'))
                Game.detectPage(); //Sayfa değiştirilince Fixed özelliği olmayacağı için undefined değeri dönecek ve main fonksiyonu çalıştırılacak.
        });
        Game.detectPage(false);
    }
    checkDatas(){
        delete this.__proto__.checkDatas;

        //ageDatas
        if(Array.isArray(this.ageDates)){
            let ageDates = this.ageDates.slice(0),
                serverTime = Game.getTime();
            if(ageDates[ageDates.length-1]*60000<serverTime) this.ageDates = undefined;
            else{
                while(ageDates.length){
                    let date = ageDates[0]*60000;
                    if(date>serverTime) break;
                    ageDates.splice(0,1);
                }
                if(!ageDates.length) this.ageDates = undefined;
                else this.ageDates = ageDates.slice(0);
            }
        }
        else delete this.ageDates;

        //featuresActiveStatus
        let updated=0; //Veri de herhangi bir güncelleme olursa onu kaydetmek için
        Object.entries(this.defaultFeaturesActiveStatus).map(e=>{return {k:e[0],v:e[1]};}).forEach(f=>{ //Yeni bir özellik geldiğinde veya var olan özellik bir şekilde kaybolduysa eklemek için;
            if(!this.featuresActiveStatus.hasOwnProperty(f.k)){
                this.featuresActiveStatus[f.k] = f.v;
                ++updated;
            }
        });
        delete this.defaultFeaturesActiveStatus;
        for(let [featureKey,enable] of Object.entries(this.featuresActiveStatus)){ //Tool'a eklenen özelliklere başlangıç durumunu(etkin/devre dışı) verecek
            let feature = this.features.getByName(featureKey);
            if(feature==undefined){ //Özellik kaldırıldı veya verilerde yanlış düzenleme mevcut
                delete this.featuresActiveStatus[featureKey];
                ++updated;
                continue;
            }
            feature.active = enable;
        }
        if(updated>0) this.setVal('featuresActiveStatus',this.featuresActiveStatus);
        delete this.featuresActiveStatus;
    }
    checkClubData(clubDatas){
        if(typeof clubDatas == "object"){
            if(clubDatas.trainerLevel==undefined ||
               clubDatas.yTrainerLevel==undefined ||
               clubDatas.clubId==undefined ||
               clubDatas.clubName==undefined
              ) return 'incorrect';
            return 'correct';
        }
        return 'not-exist';
    }

    createWelcomeMenu(){
        delete this.__proto__.createWelcomeMenu;
        //Eğer kulüp bilgileri mevcut değilse, kullanıcının verileri silinmiş olabilir yada kullanıcı scripti ilkkez yüklüyordur.
        return new Promise((res,rej)=>{
            let header = { //Scriptin açılış menüsünün baş kısmı
                content : GetText('NeedNecessaryInformation')+`<img src="${Tool.sources.getLink('unhappy','png')}" alt="unhappy" height="25px" style="position:absolute;margin: 4px 0 4px 5px;">`,
                css : {'text-align':'center'}
            };

            let div = { //Scriptin açılış menüsünün içeriği
                footer : !0,
                close  : !0,
                class  : 'container'
            };
            div.content=
                `<p style="color:red;margin-bottom:10px;font-weight:bold;text-align:left;font-size:12px;">${GetText('InformScriptWorking')}</p>`+
                `<p style="color:blue;font-weight:bold;text-align:left;font-size:12px;margin-Bottom:10px;">${GetText('HelpDataUploading')}</p>`+
                `<p style="text-align:center;margin-bottom:25px;">`+
                `   <img id="uploadDatas" class="grow" title="${GetText('UploadDatas', {tag:0})}" tool_tt="UploadDatas" src="https://i.ibb.co/WzvZS4s/Untitled.png" style="cursor:pointer;" height="40px">`+
                `</p>`+
                `<h3>${GetText('EnterClubInformation')} :</h3>`+
                `<table style="width:280px;margin:0 auto 15px auto;border-radius:6px;color:#111b9c;background-color:white;box-shadow: 5px 10px 8px #3939398c;">`+
                `   <tbody>`+
                `      <tr class="odd">`+
                `         <td style="border:0;text-align:center;padding-Left:5px;">${GetText('TrainerLevel')}</td>`+
                `         <td style="border:0;">`+
                `            <label class="menü">`+
                `               <select id="AntrenörSeviyesi1" style="font-size:12px;width:55px;margin:0 auto;text-align-last: center;"></select>`+
                `            </label>`+
                `         </td>`+
                `      </tr>`+
                `      <tr class="even">`+
                `         <td style="border:0;border-radius:6px 0 0 6px;text-align:center;padding-Left:5px;">${GetText('YoungTrainerLevel')}</td>`+
                `         <td style="border:0;border-radius:0 6px 6px 0;">`+
                `            <label class="menü">`+
                `               <select id="GAntrenörSeviyesi1" style="font-size:12px;width:55px;margin:0 auto;text-align-last: center;"></select>`+
                `            </label>`+
                `         </td>`+
                `      </tr>`+
                `   </tbody>`+
                `</table>`+
                `<p style="text-align:center;">${CreateButton('butonOnayla', GetText('Confirm')+' !')}</p>`;

            ShowDialog(div,header);

            //Adding level options to selects
            let selects = $('#AntrenörSeviyesi1, #GAntrenörSeviyesi1');
            selects.append(`<option value="10" selected tool_ot="SortLevel_10 {X}">10 ${GetText('SortLevel', {tag:0})}</option>`)
            for(let lvl=9; lvl>-1; lvl--) selects.append(`<option value="${lvl}" tool_ot="SortLevel_${lvl} {X}">${lvl} ${GetText('SortLevel', {tag:0})}</option>`)

            $('#butonOnayla').click(async function(){
                $(this).off();
                let span = $(this).find('span:last'),
                    html = span.html(),
                    clubDatas = {
                        "trainerLevel"    : parseInt($('#AntrenörSeviyesi1').val()),
                        "yTrainerLevel"   : parseInt($('#GAntrenörSeviyesi1').val())
                    },
                    self = $('.self-link');
                span.html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-top: -1px;">');
                if(self.length){
                    clubDatas.clubId = $('.self-link').first().attr('clubid');
                    clubDatas.clubName = $('.self-link').first().text().trim();
                }
                else{
                    try{
                        let profile_show = await Game.getPage('?w='+worldId+'&area=user&module=profile&action=show','#profile-show');
                        clubDatas.clubId = profile_show.find('div.container.profile-trophy > div.profile > ul.profile-box-club > li:nth-child(2) > a')[0].href.split('&').find(a=>a.split('=')[0]=='clubId').split('=')[1];
                        clubDatas.clubName = profile_show.find('h2').first().text().replace(Tool.replaceClubName,'').trim();
                    }
                    catch(err){
                        alert("An error is exist.\n"+err);
                        return;
                    }
                }

                span.html(html);
                Tool.setVal('clubDatas',clubDatas);
                closeFocus({target: $('.close')});
                res(clubDatas);
            });
            $('#uploadDatas').click(function(){
                ReadTextFile(
                    function(valuesText){
                        valuesText.split('CookieKey&:').slice(1).forEach(data=>{
                            let b = data.indexOf(':');
                            GM_setValue(data.substring(0,b),JSON.parse(data.substring(b+1)));
                        });
                        Tool.fixValues();
                        closeFocus({target: $('.close')});
                        Game.giveNotification(true, GetText('DataLoaded'));
                        res(Tool.getVal('clubDatas'));
                    }
                );
            });
        });
    }

    createToolMenu(){
        delete this.__proto__.createToolMenu;

        $('html, body').animate({ scrollTop: 0 }, 'fast'); //Sayfanın başına getiriliyor. Menü ortaya çıkartılacak.

        //Script menüsü için toogle buton ekleniyor ve açılıp-kapanabilmesi için click eventi ekleniyor.
        $('#section-inner-container').after('<div id="scriptMenuToggleBtn" class="active"></div>');
        $('#scriptMenuToggleBtn').click(function(){
            let active = $(this).hasClass('active');
            $(this)[active?'removeClass':'addClass']('active');
            $('#ScriptMenu')[active?'slideUp':'slideDown']();
        });

        //Script menüsü butondan sonra ekleniyor.
        $('#section-inner-container').after(
            `<div id="ScriptMenu" class="box" style="position:absolute;">`+
            `   <h2>${GetText('ScriptMenuTitle')}</h2>`+
            `   <table class="table">`+
            `      <thead>`+
            `         <tr>`+
            `            <th>${GetText('Explanation')}</th>`+
            `            <th>${GetText('Action')}</th>`+
            `         </tr>`+
            `      </thead>`+
            `      <tbody>`+
            `         <tr class="odd">`+
            `            <td>${GetText('DownloadData')}</td>`+
            `            <td>${CreateButton('downloadValues', GetText('Download'), '', 'width:35px;')}</td>`+
            `         </tr>`+
            `         <tr class="even">`+
            `            <td>${GetText('UploadDatas')}</td>`+
            `            <td>${CreateButton('uploadValues', GetText('Load'), '', 'width:35px;')}</td>`+
            `         </tr>`+
            `         <tr class="odd">`+
            `            <td>${GetText('DeleteData')}</td>`+
            `            <td>${CreateButton('deleteValues', GetText('Delete'), '', 'width:35px;')}</td>`+
            `         </tr>`+
            `         <tr class="even">`+
            `            <td>${GetText('GameLanguage')}</td>`+
            `            <td>`+
            `               <label class="menü">`+
            `                 <select id="gameLanguage" style="width:69px;margin:0 auto;text-align-last: center;">`+
            `                    <option selected value="${Tool.language}">${GetText('Language', {tag:0})} *</option>`+
            `                 </select>`+
            `              </label>`+
            `           </td>`+
            `        </tr>`+
            `     </tbody>`+
            `     <tbody id="ExtraSettings" style="display:none;">`+
            `        <tr class="odd">`+
            `           <td>${GetText('TrainerLevelS')}</td>`+
            `           <td>`+
            `              <label class="menü">`+
            `                 <select id="AntrenörSeviyesi" k="trainerLevel" currentvalue="${Tool.trainerLevel}" style="width:55px; margin:0 auto; text-align-last:center;"></select>`+
            `               </label>`+
            `            </td>`+
            `         </tr>`+
            `         <tr class="even">`+
            `            <td>${GetText('YoungTrainerLevelS')}</td>`+
            `            <td>`+
            `               <label class="menü">`+
            `                  <select id="GAntrenörSeviyesi" k="yTrainerLevel" currentvalue="${Tool.yTrainerLevel}" style="width:55px;margin:0 auto;text-align-last: center;"></select>`+
            `               </label>`+
            `            </td>`+
            `         </tr>`+
            `         <tr style="height:20px;line-height:20px;display:none;">`+
            `            <td colspan="2" style="text-align:center;">${CreateButton('saveChangeProperties', GetText('Update'), '', 'padding:3px 8px; width:43px;')}</td>`+
            `         </tr>`+
            `      </tbody>`+
            `      <tfoot>`+
            `         <tr style="line-height:10px;height:10px;">`+
            `            <td colspan="2">`+
            `               <p style="width: 60px;border-top:1px solid gray;margin:0 auto 2px;">`+
            `                  <img id="toggleExtraSettings" src="${Tool.sources.getLink('https://img.favpng.com/11/7/10/computer-icons-eye-png-favpng-b9eV1DRv9qP55UTXxRh6EACiV.jpg')}" alt="show" height="15px" width="25px" style="cursor:pointer;margin-top:10px;">`+
            `               </p>`+
            `            </td>`+
            `         </tr>`+
            `      </tfoot>`+
            `   </table>`+

            //Scriptin özelliklerinin gösterileceği tablo ekleniyor.
            `   <table id="featureList" class="table" style="margin-Top:10px;display:none;table-layout:fixed;">`+
            `      <thead>`+
            `         <tr style="background:none;">`+
            `            <th width="60%">${GetText('Features')}</th>`+
            `            <th>${GetText('Action')}</th>`+
            `         </tr>`+
            `      </thead>`+
            `      <tbody></tbody>`+
            `   </table>`+

            //Script menüsünün en alt kısmı ekleniyor.
            `   <div style="font-family:Comic Sans MS; color:white; font-weight:bold; background-color:black; margin:15px -5px -6px -5px; border-radius: 0 0 6px 6px; padding:5px 0; text-align:center;">`+
            `      <p style="font-size:10px;margin:0;">`+
            `         ${GetText('QuestionHelp')} : `+
            `         <a href="https://forum.fussballcup.de/showthread.php?t=417372&page=22 "style="color:#14ffff; text-decoration:none; font-size:10px;" target="_blank">`+
            `            ${GetText('ClickMe')}`+
            `         </a>`+
            `      </p>`+
            `      <p style="font-size:10px;margin:0;">`+
            `         ${GetText('ScriptWriter')} : `+
            `         <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${Tool.ScriptAuthorClubId}" style="color:#14ffff; text-decoration:none; cursor:pointer; font-size: 10px;">`+
            `            Criyessei | mot33`+
            `         </a>`+
            `      </p>`+
            `   </div>`+
            `</div>`
        );

        //Script menüsüne seçili dil eklenmiş durumda fakat diğer diller şimdi ekleniyor.
        for(let [key,name] of Object.entries(Translate.locale.texts.OtherLanguages)) $('#gameLanguage').append(`<option value="${key}">${name}</option>`);

        let selects = $('#AntrenörSeviyesi, #GAntrenörSeviyesi');
        for(let lvl=10; lvl>-1; lvl--) selects.append(`<option value="${lvl}">${lvl} ${GetText('SortLevel', {tag:0})}</option>`)

        //Geçerli olan antrenör ve genç antrenör seviyeleri aktif ediliyor ve sonlarına ' *' ekleniyor.
        $('#AntrenörSeviyesi').val(Tool.trainerLevel);
        $('#AntrenörSeviyesi > option:selected')[0].innerHTML+=' *';
        $('#GAntrenörSeviyesi').val(Tool.yTrainerLevel);
        $('#GAntrenörSeviyesi > option:selected')[0].innerHTML+=' *';

        //CSS Ekle
        $('head').append('<link id="font-awesome" rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');
        GM_addStyle(`.disHighlight{ user-select: none; -webkit-user-select: none; -ms-user-select: none; -webkit-touch-callout: none; -o-user-select: none; -moz-user-select: none; } @keyframes flickerAnimation { 0%   { opacity:1; } 50%  { opacity:0; } 100% { opacity:1; } } @-o-keyframes flickerAnimation{ 0%   { opacity:1; } 50%  { opacity:0; } 100% { opacity:1; } } @-moz-keyframes flickerAnimation{ 0%   { opacity:1; } 50%  { opacity:0; } 100% { opacity:1; } } @-webkit-keyframes flickerAnimation{ 0%   { opacity:1; } 50%  { opacity:0; } 100% { opacity:1; } } .animate-flicker { -webkit-animation: flickerAnimation 1s infinite; -moz-animation: flickerAnimation 1s infinite; -o-animation: flickerAnimation 1s infinite; animation: flickerAnimation 1s infinite; } #scriptMenuToggleBtn{ position:absolute; top:-44px; right:-23px; height:40px; width:40px; background-image: url(https://i.ibb.co/tJC5RX3/HFWRRt6.png); z-index:20; opacity:.5; cursor:pointer; } #scriptMenuToggleBtn:hover , #scriptMenuToggleBtn.active{ opacity:1; } #ScriptMenu > table > tbody > tr > td{ word-wrap: break-word; white-space: normal; line-height: 15.5px; padding:3px 6px; } #ScriptMenu{ z-index:10; position: absolute; width: 180px; background: white; top: 0; right: -180px; overflow-wrap: break-word; display: block; margin: 0 auto; padding:5px; border-radius: 8px; font-size:10px; border: 1px solid black!important; box-sizing: border-box; } #ScriptMenu > h2{ width: 100%; color: white; font-weight: bold; border: 0; margin: -5px 0 0 -5px; text-align: center; font-size: 14px; height: 30px; background:url(/designs/redesign/images/layout/headlines_sprite.gif) 0 -70px repeat-x; border-radius: 7px 7px 0 0; margin-bottom:5px; cursor:move; } table.table thead th:first-of-type{ border-radius : 7px 0 0 7px; } table.table thead th:last-of-type{ border-radius : 0 7px 7px 0; } table.table th{ background : #c01700; } table.table tbody tr.even > td{ background: #eee; } table.table tbody tr > td:first-of-type{ padding-left:5px; text-align:left; } table.table tbody tr.even > td:first-of-type{ border-radius : 7px 0 0 7px; } table.table tbody tr.even > td:last-of-type{ border-radius : 0 7px 7px 0; } table.table tbody td{ border-bottom: 0; } div.box p{ margin-Bottom:5px; } .slideThree input[type=checkbox]{ visibility: hidden; } .slideThree { width: 55px; height: 21px; background: #333; margin: 0; -webkit-border-radius: 55px; -moz-border-radius: 50px; border-radius: 50px; position: relative; -webkit-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2); -moz-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2); box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2); } .slideThree:after { content: \'Off\'; font: 9px/26px Arial, sans-serif; color: red; position: absolute; right: 7px; top: -2px; z-index: 0; font-weight: bold; text-shadow: 1px 1px 0px rgba(255,255,255,.15); } .slideThree:before { content: \'On\'; font: 9px/26px Arial, sans-serif; color: #00bf00; position: absolute; left: 7px; top: -2px; z-index: 0; font-weight: bold; } .slideThree label { display: block; width: 25px; height: 17px; -webkit-border-radius: 50px; -moz-border-radius: 50px; border-radius: 50px; -webkit-transition: all .4s ease; -moz-transition: all .4s ease; -o-transition: all .4s ease; -ms-transition: all .4s ease; transition: all .4s ease; cursor: pointer; position: absolute; top: 2px; left: 3px; z-index: 1; -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3); -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3); box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3); background: #fcfff4; background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%); background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%); background: -o-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%); background: -ms-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%); background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#fcfff4\', endColorstr=\'#b3bead\',GradientType=0 ); } .slideThree input[type=checkbox]:checked + label { left: 26px; } label.menü > select { padding:4px; margin: 0; -webkit-border-radius:9px; -moz-border-radius:4px; border-radius:4px; -webkit-box-shadow: 0 px 0 #ccc, 0 -1px #fff inset; -moz-box-shadow: 0 2px 0 #ccc, 0 -1px #fff inset; box-shadow: 0 2px 0 #ccc, 0 -1px #fff inset; background: #f8f8f8; color:#888; border:none; outline:none; display: inline-block; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer; } label.menü > select { padding-right:18px; font-size:9px; width:45px; margin:0 auto; text-align-last: center; } label.menü { position:relative } label.menü:after { content:'<>'; font:8px \"Consolas\", monospace; color:#aaa; -webkit-transform:rotate(90deg); -moz-transform:rotate(90deg); -ms-transform:rotate(90deg); transform:rotate(90deg); right:2px; top:2px; padding:0 0 2px; border-bottom:0px solid #ddd; position:absolute; pointer-events:none; } label.menü:before { content:''; right:0px; top:0px; width:5px; height:px; background:#f8f8f8; position:absolute; pointer-events:none; display:block; } @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-1.25em); } 100% { opacity: 1; transform: translateY(0); } } .openClose[open] { animation-name: fadeInDown; animation-duration: 0.5s; } @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-1.25em); } 100% { opacity: 1; transform: translateY(0); } } .details5[open] { animation-name: fadeInDown; animation-duration: 0.5s; } @keyframes fadeInUp { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-1.25em); } } .openClose[close] { animation-name: fadeInUp; animation-duration: 0.5s; } .checkbox_1 { display: none; } .checkbox_1 + label:before { cursor: pointer; content: \'\\2714\'; border: 0.1em solid #d95555; border-radius: 0.2em; display: inline-block; width: 1.1em; height: 1em; padding-left: 0em; padding-bottom: 0.3em; padding-top:-0.1em; margin-right: 0em; vertical-align: middle; text-align:center; color: #d95555; transition: .2s; } .checkbox_1 + label:active:before { transform: scale(0); } .checkbox_1:checked + label:before{ background-color: red; border-color: red; color: #fff; } /*** custom checkboxes ***/ .checkbox_2 { display:none; } /* to hide the checkbox itself */ .checkbox_2 + label:before { font-family: FontAwesome; display: inline-block; } .checkbox_2 + label:before { content: \'\\f096\'; } /* unchecked icon */ .checkbox_2 + label:before { letter-spacing: 2px; } /* space between checkbox and label */ .checkbox_2:not(:checked):hover + label:before{content: \'\\f046\';color:#6f6e6e;letter-spacing: 0;} .checkbox_2:checked + label:before { content: \'\\f046\'; } /* checked icon */ .checkbox_2:checked + label:before { letter-spacing: 0; } /* allow space for check mark */ .sorting_players{ font-size:10px; text-align:center; padding:5px 0; margin-bottom: 9px; border-bottom: 1px solid white; line-height:1.5; } .sorting_players > label{ display:inline-block; } .sorting_players > label:not(:first-child){ margin-left:8px; } .sorting_players > label > input{ vertical-align:middle; margin:-3px 1px 0 0; cursor:pointer; } .sorting_players st{ color:#c8c7c7; } .sorting_players input:checked + st{ color : #04da97; } .filterByPositions{ margin: -3px 0 7px; text-align: center; } .filterByPositions > .filter_position{ border-radius: 20%; background-color:green; cursor: pointer; display:inline-block; padding:2px 0; font-size: 8px; color: white; min-width: 20px; opacity:1; margin:2px; } .filterByPositions > .filter_position.not_active{ opacity:0.3; } .grow,.grow2 { transition: all .2s ease-in-out; } .grow:hover { transform: scale(1.1); } .grow2:hover{ transform: scale(1.5); } .slider { -webkit-appearance: none; width: 100%; height: 20px; background: #d3d3d3; outline: none; opacity: 0.7; -webkit-transition: .2s; transition: opacity .2s; } .slider:hover { opacity: 1; } .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; border-radius:6px; width: 30px; height: 20px; background: #4CAF50; cursor: pointer; } .slider::-moz-range-thumb { border-radius:6px; width: 30px; height: 20px; background: #4CAF50; cursor: pointer; }`);

        //For Features Table
        this.featuresList = {
            clear:function(){
                $('#featureList > tbody').html('');
                $('#featureList > tbody').parent().hide();
            },
            show:function(features){
                let counter=0;
                features.forEach(feature=>{
                    let div = $('<div class="slideThree"></div>'),
                        featureId = feature.name,
                        featureName = Translate.locale.texts.FeaturesName[featureId] || featureId;
                    if(feature.hover_selector!=undefined){
                        div.attr('hover_selector',feature.hover_selector);
                        $(feature.hover_selector).css('transition','background-color 1s;');
                    }
                    div.append(
                        `<input type="checkbox" id="${featureId}" class="slideThreeInput" ${feature.active?'checked="checked"':''}>`+
                        `<label for="${featureId}"></label>`
                    );
                    $('#featureList > tbody').append(
                        `<tr class="${counter++%2?'even':'odd'}">`+
                        `   <td><label k="${featureId}">${featureName}</label></td>`+
                        `   <td>${div[0].outerHTML}</td>`+
                        '</tr>'
                    );
                    if(feature.active && !feature.work){
                        $('#featureList > tbody > tr:last > td:first').css({
                            'color':'#e23f3fb5',
                            'font-style':'italic'
                        });
                    }
                });

                if(counter>0){
                    $('#featureList > tbody').parent().show();
                    $('#featureList > tbody > tr .slideThreeInput').click(function(){
                        console.log(this);
                        Tool.features.getByName(this.id)[this.checked?'activate':'deactivate']();
                        Tool.setVal('featuresActiveStatus',Tool.features.reduce((acc,feature)=>{acc[feature.name]=feature.active;return acc},{}));
                        if(!this.checked) $('.addedBy_'+this.id).remove();
                    });
                    $('#featureList > tbody .slideThreeInput:checked').parent('[hover_selector]').mouseenter(function(){
                        $($(this).attr('hover_selector')).addClass('animate-flicker').css('background-color','#910e0ea8');
                    }).mouseleave(function(){
                        $($(this).attr('hover_selector')).removeClass('animate-flicker').css('background-color','');
                    });
                }
                else{
                    $('#featureList > tbody').parent().hide();
                }
            }
        }
    }
    createMenuEvents(){
        delete this.__proto__.createMenuEvents;

        //Script menüsü hareket ettirilebilecek.
        $("#ScriptMenu").draggable({ handle: "h2" });

        //Oyun dili değiştirilmek istendiğinde yapılacak kodlar ekleniyor.
        $('#gameLanguage').change(function(){
            //Select box kitleniyor.Bu sayede dil değiştirilene kadar tekrar değiştirilmesine izin verilmiyor.
            this.disabled = true;
            this.style.cursor = 'not-allowed';

            //Change Language
            let result = Translate.changeLanguage(this.value, this.selectedIndex);
            if(result.status=='success'){
                Tool.language = Translate.locale.name;

                //Update User Servers Language Preferences
                let userLanguage = GM_getValue('userLanguage',{});
                if(typeof userLanguage != 'object') userLanguage = {};
                userLanguage[Game.server] = Tool.language;
                GM_setValue('userLanguage', userLanguage);
            }
            else{
                Game.giveNotification(false, result.msg);
                throw new Error(JSON.stringify(result, null, '\t'));
            }

            //Kitlenen select box açılıyor.
            this.disabled = false;
            this.style.cursor = '';
        });

        //Script menüsünde çok yer kaplamaması için gizlenen antrenör ve genç antrenör select boxlarının gizlenip-gösterilebilmesi için click eventi oluşturuluyor.
        $('#toggleExtraSettings').click(function(){
            $('#ExtraSettings').toggle();
            let a = $('#toggleExtraSettings').attr('alt')=='hide'?'show':'hide';
            $(this).attr({
                'src': Tool.sources.getLink('https://img.favpng.com/11/7/10/computer-icons-eye-png-favpng-b9eV1DRv9qP55UTXxRh6EACiV.jpg'),
                'alt': a
            });
            if(a=='hide' && $('#saveChangeProperties').parents('tr:first').is(':visible')){ //Restore
                $('#AntrenörSeviyesi').val($('#AntrenörSeviyesi').attr('currentvalue'));
                $('#GAntrenörSeviyesi').val($('#GAntrenörSeviyesi').attr('currentvalue'));
                $('#saveChangeProperties').parents('tr').first().hide();
            }
        });

        //Antrenör veya genç antrenör seviyesi güncel seviyesinden farklı olursa kayıt etme butonu gösteriliyor,aksi taktirde gizleniyor.
        $('#AntrenörSeviyesi').add($('#GAntrenörSeviyesi')).change(function(){
            let o=$('#'+(this.id=='AntrenörSeviyesi'?'GAntrenörSeviyesi':'AntrenörSeviyesi'));
            $('#saveChangeProperties').parents('tr').first()[
                this.value!=$(this).attr('currentvalue') || o.val()!=o.attr('currentvalue')?'show':'hide'
            ]();
        });

        //Değiştirilen antrenör ve|veya genç antrenör seviyeleri kayıt ediliyor ve sayfa yenilenerek değişikli(ğin|klerin) gösterilmesi sağlanıyor.
        $('#saveChangeProperties').click(function(){
            $(this).parents('tr').first().hide();
            let clubDatas = Tool.getVal('clubDatas');
            clubDatas.trainerLevel = parseInt($('#AntrenörSeviyesi').val());
            clubDatas.yTrainerLevel = parseInt($('#GAntrenörSeviyesi').val());
            Tool.setVal('clubDatas',clubDatas);
            location.reload();
        });

        //Script verilerilerinin indirilmesi
        $('#downloadValues').click(function(){
            let cookies = GM_listValues().sort(function(a,b){
                let s1=a.substring(0,a.indexOf('_')+1),
                    s2=b.substring(0,b.indexOf('_')+1);
                if((a=a.substring(a.indexOf('_')+1))>(b=b.substring(b.indexOf('_')+1))) return 1;
                else if(a<b) return -1;
                return s1>s2;
            }),
                cookiesText = '',
                ekle='',
                veri;
            for(let i = 0; i < cookies.length ; i++){
                ekle = '';
                if(!(veri = GM_getValue(cookies[i]))) continue;
                ekle = Array.isArray(veri)?returnArrayString(veri):JSON.stringify(veri,null,'\t');
                cookiesText +='CookieKey&:'+cookies[i]+':'+ekle+'\n\n';
            }
            if(cookiesText.trim()) DownloadAsTextFile(cookiesText,'Fcup Script Datas');
            else Game.giveNotification(false, GetText('NotDataExist'));
            function returnArrayString(array){
                let o='[';
                for(let i = 0 ; i < array.length ; i++){
                    o+=Array.isArray(array[i])?returnArrayString(array[i]):JSON.stringify(array[i],null,'\t')+',';
                }
                o = o.substring(0,o.length-1)+']';
                return o;
            }
        });

        //İndirilen script verilerinin yüklenmesi
        $('#uploadValues').click(function(){
            ReadTextFile((valuesText)=>{
                valuesText.split('CookieKey&:').slice(1).forEach(data=>{
                    let b = data.indexOf(':');
                    GM_setValue(data.substring(0,b),JSON.parse(data.substring(b+1)));
                });
                Tool.fixValues();
                Game.giveNotification(true, GetText('DataLoaded')+'!!');
                location.reload();
            });
        });

        //Scriptin sıfırlanması
        $('#deleteValues').click(function(){
            let globaldatas = GM_listValues().filter(key=>{return key.indexOf('_')==-1}),
                opt = ["1","2"],
                exit = "3";
            if(globaldatas.length!=0){
                opt.push("3");
                exit = "4";
            };
            let wrongChoise = $(this).attr('wrong_choise'),
                choise = prompt(
                    (wrongChoise==undefined?"":"Wrong choise: "+wrongChoise+"\n\n")+
                    "1: Delete all servers datas\n"+
                    "2: Delete all current server["+Game.server+"] datas\n"+
                    (globaldatas.length==0?"":"3: Delete global datas: "+globaldatas.join(', ')+"\n")+
                    exit+": Exit\n"+
                    "Enter your choise:",2
                );
            $(this).removeAttr('wrong_choise');

            if(choise==null || choise==exit) return;
            if(!opt.includes(choise)){
                $('#deleteValues').attr('wrong_choise',choise).click();
                return;
            }

            let keys;
            if(choise=="1") //Delete all servers datas
                keys = GM_listValues();
            else if(choise=="2"){ //Delete current server datas
                keys = GM_listValues().filter(key=>{
                    let find = key.indexOf('_');
                    return find!=-1 && key.substring(0,find).trim() == Game.server
                });
            }
            else keys = globaldatas;

            keys.forEach(key=>GM_deleteValue(key));
            Game.giveNotification(true, GetText('DataCleared'));
            location.reload();
        });
    }
    checkVersion(){
        delete this.__proto__.checkVersion;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://greasyfork.org/scripts/438633-fcup-script/code/FCup%20Script.user.js",
            onload: function(response) {
                let text = response.responseText,
                    b = text.indexOf('@version')+8,
                    b1 = text.indexOf('/',b),
                    version = text.substring(b,b1).trim(),
                    currentVersion = GM_info.script.version;
                if(version!=currentVersion){
                    let header = {
                        css : {'text-align':'center'},
                        content :
                        `<span class="icon" style="background:url(/designs/redesign/images/layout/icons_sprite.png?v=2.2.6.14231) 0 -1180px no-repeat;margin-Right:10px;float:left;margin:6px;"></span>`+
                        GetText('ReleasedVersion', {args:[version]})
                    };
                    let div = {
                        footer : !0,
                        close  : !0,
                        class  : 'container'
                    };
                    div.content =
                        `<img src="https://image.ibb.co/jrcFap/Untitled.png" style="height:73px; float:left; margin:-15px 0 0 -15px;">`+
                        `<p style="font-size:15px; margin-Bottom:10px; font-weight:bold; color:red; text-align:center;">`+
                        `   ${GetText('CurrentVersion')+' '+currentVersion}`+
                        `   <label style="color:green; margin-Left:50px;">${GetText('NewVersion')+" : "+ version}</label>`+
                        `</p>`+
                        `<p style="font-size:14px; font-weight:bold; color:blue;">`+
                        `   ${GetText('UpdateTheScriptInfo', {args:['<a href="https://greasyfork.org/scripts/438633-fcup-script/code/FCup%20Script.user.js" style="font-size:14px">','</a>']})}`+
                        `</p>`+
                        `<p style="margin-Top:20px;text-align:center;">${CreateButton('relaodPage', GetText('RefreshPage'))}</p>`;
                    ShowDialog(div,header);
                    $('#relaodPage').click(()=>location.reload());
                }
                else console.log('[Version control] => %cVersion up to date.','color:green;');
            },
            onerror: function() {
                console.log('[Version control] => %cFail!','color:red;');
            }
        });
    }
    createNoticeArea(){
        delete this.__proto__.createNoticeArea;

        GM_addStyle(`#notice_in { color: white; font-size: 12px; background-color: #088A08; padding: 3px; width: 130px; margin: auto; border-radius: 10px; cursor: pointer; letter-spacing: 0.11em; } #notice_out { width: 100%; background-color: transparent; padding: 10px; border: 0px solid #088A08; } #Notizbereich { position: static; margin: 5px; height: 150px; background-color: #FFFFFF; border: 1px solid #DF0101; border-radius: 10px; padding: 4px 5px; min-height: 59px; min-width: 345px; } .notiz_button { border-radius: 12px; background-color: #B40404; border: none; color: #FFFFFF; text-align: center; font-size: 13px; padding: 4px; width: 106px; transition: all 0.5s; cursor: pointer; margin: 2px 8px; }`);
        $('body').prepend(
            `<div id="notice_area">`+
            `   <div id="notice_in" class="disHighlight" lock="0">${GetText('OpenNote')}</div>`+
            `   <div id="notice_out">`+
            `      <p>`+
            `         <textarea id="Notizbereich" cols="80" rows="5" placeholder="${GetText('WriteANote', {tag:0})}" tool_pt="WriteANote" style="max-width:${$('#header').width()}px;">${Tool.getVal('Notiz','')}</textarea>`+
            `         <p>`+
            `            <input id="notiz_save_btn" class="notiz_button" type="button" value="${GetText('SaveNote', {tag:0})}" tool_vt="SaveNote">`+
            `            <input id="notiz_clr_btn" class="notiz_button" type="button" value="${GetText('ClearField', {tag:0})}" tool_vt="ClearField">`+
            `         </p>`+
            `      </p>`+
            `      <p>`+
            `         <font id="change_clue" style="color:#1C6125;border-radius:7px;padding:3px 4px;text-align:center;opacity:0;"></font>`+
            `      </p>`+
            `   </div>`+
            `</div>`
        );
        $('#notice_out').attr('outerHeight',$('#notice_out').outerHeight()).hide();
        $("#chatToggleBtn").css('top','+='+$('#notice_area').outerHeight()+'px');//Düzenleme yapılıyor.

        $('#notice_in').click(function(){
            if($(this).attr('lock')!=0) return;
            $(this).attr('lock',1);

            let open = !$('#notice_out').is(':visible'),
                time = 750;
            $('#notice_in').html(open?GetText('CloseNote'):GetText('OpenNote'));

            $('#notice_out').slideToggle(time);
            $("#chatToggleBtn").animate({ "top": (open?"+":"-")+"="+$('#notice_out').attr('outerHeight')+"px" }, time);
            setTimeout(()=>{ $(this).attr('lock',0); },time);
        });

        $('#notiz_save_btn').click(function(){
            Tool.setVal('Notiz', $('#Notizbereich').val());
            change_clue(GetText('SavedNote'));
        });
        $('#notiz_clr_btn').click(function(){
            $('#Notizbereich').val('');
            Tool.delVal('Notiz');
            change_clue(GetText('ClearedNote'));
        });

        let interval;
        function change_clue(value){
            $('#change_clue').animate({'opacity':1});
            clearTimeout(interval);
            $('#change_clue').html(value);
            interval = setTimeout(function() {
                $('#change_clue').animate({'opacity':0},200);
                setTimeout(()=>{
                    $('#change_clue').html('');
                },200);
            }, 2800);
        }
    }

    pipe(func=()=>{}){func(Tool)}

    printValues(){
        delete this.__proto__.printValues;
        console.clear();
        let values = this.fixValues();
        if(!values.length){
            console.log("%c! ANY COOKIES ARE EXIST",'color:red;font-weight:bold;font-size:15px;');
            return;
        }

        console.log("%cVALUES","color:white;text-align:center;font-size:15px;padding:2px 500px;background-color:black;border-radius:7px;text-weight:bold;display:inline;");
        values.sort(function(a,b){
            let s1=a.substring(0,a.indexOf('_')+1),
                s2=b.substring(0,b.indexOf('_')+1);
            if((a=a.substring(a.indexOf('_')+1))>(b=b.substring(b.indexOf('_')+1))) return 1;
            else if(a<b) return -1;
            return s1>s2;
        });

        let maxLongKey = values.reduce((acc,val)=>{return Math.max(acc,val);},-1);
        values.forEach(cookieKey=>{
            let find = cookieKey.indexOf('_');
            console.log(
                '%c' + cookieKey.substring(0,find) + '%c' + (find!=-1?'_':'   ') + '%c' + cookieKey.substring(find+1) + (" ").repeat(Math.abs(maxLongKey-cookieKey.length+(find!=-1?0:-3))) + ' %c: %c%o',
                'font-weight:bold;color:blue;',
                'font-weight:bold;color:orange;',
                'font-weight:bold;color:green;',
                'font-weight:bold;color:black;',
                'color:black;',
                GM_getValue(cookieKey)
            );
        });
        console.log('\n');
    }
    fixValues(valuesList=GM_listValues()){
        for(let i=0,find,server,valueKey,valueName,deleteValue ; i < valuesList.length ; i++){
            valueKey = valuesList[i];
            deleteValue = !1;

            if((find=valueKey.indexOf('_'))==-1) server=null;
            else server = valueKey.substring(0,find);

            switch(valueName=valueKey.substring(find+1)){
                case 'clubDatas':
                    var clubDatas = GM_getValue(valueKey);
                    if(typeof clubDatas == 'object'){
                        if(clubDatas.hasOwnProperty('trainingProgram')){
                            delete clubDatas.trainingProgram;
                            GM_setValue(valueKey,clubDatas);
                        }
                    }
                    else deleteValue = !0;
                    break;
                case 'LeagueData':
                    var LeagueData = GM_getValue(valueKey);
                    if(typeof LeagueData == 'object' && !$.isEmptyObject(LeagueData)){
                        if(LeagueData.hasOwnProperty('IlkMacTarihi')){
                            LeagueData.firstMatchDate = LeagueData.IlkMacTarihi;
                            LeagueData.firstHalfFinalMatchDate = LeagueData.IlkYarıSonMacTarihi;
                            LeagueData.lastMatchDate = LeagueData.SonMacTarihi;
                            LeagueData.league = LeagueData.lig;
                            delete LeagueData.IlkMacTarihi;
                            delete LeagueData.IlkYarıSonMacTarihi;
                            delete LeagueData.SonMacTarihi;
                            delete LeagueData.lig;
                            GM_setValue(valueKey,LeagueData);
                        }
                    }
                    else deleteValue = !0;
                    break;
                    /*case 'ClubExchange':
                let ClubExchange = GM_getValue(cookieKey);
                if(typeof ClubExchange == 'object' && !$.isEmptyObject(ClubExchange)){
                    for(let PlayerId in ClubExchange){
                        let date = ClubExchange.date; //03.02.2019
                    }
                }
                else deleteCookie = !0;
                break;
            case 'YoungPlayers':
                let YoungPlayers = GM_getValue(cookieKey);
                if(typeof YoungPlayers == 'object'){

                }
                else deleteCookie = !0;
                break;*/
                case 'AutomaticTraining':case 'PlayersHealth':case 'SquadsStrength':
                    deleteValue = !0;
                    break;
                case 'FeaturesOfScript': case 'featuresActiveStatus':
                    var featuresActiveStatus = GM_getValue(valueKey);
                    if(valueName=='FeaturesOfScript'){
                        GM_setValue(server+'_featuresActiveStatus',featuresActiveStatus);
                        GM_deleteValue(valueKey);
                    }

                    if(typeof featuresActiveStatus == 'object'){
                        let changed = 0;
                        if(featuresActiveStatus.PlayersHealth){
                            delete featuresActiveStatus.PlayersHealth;
                            changed++;
                        }
                        /*
                         ...
                        */
                        if(changed){
                            if($.isEmptyObject(featuresActiveStatus)) deleteValue = !0;
                            else GM_setValue(valueKey,featuresActiveStatus);
                        }
                    }
                    break;
                case 'YoungPlayers':
                    var YoungPlayers = GM_getValue(valueKey), //Structure: http://prntscr.com/ucg9s3
                        updated = 0;
                    if(typeof YoungPlayers != 'object') YoungPlayers = {};
                    if(typeof YoungPlayers.MessageBox != 'object'){ YoungPlayers.MessageBox = {}; ++updated; }
                    if(!Array.isArray(YoungPlayers.show)){ YoungPlayers.show = []; ++updated; }

                    var MessageBox = YoungPlayers.MessageBox,
                        show = YoungPlayers.show;
                    for(let playerName in MessageBox){
                        var date = MessageBox[playerName];
                        if(show.find(p=>{return p.name==playerName && p.date==date;}) != undefined){ //eslint-disable-line no-loop-func
                            delete MessageBox[playerName];
                            ++updated;
                        }
                    }
                    if(updated) GM_setValue(valueKey,YoungPlayers);
                    break;
            }
            if(deleteValue){
                GM_deleteValue(valueKey);
                valuesList.splice(i--,1);
            }
        }
        return valuesList;
    }
    modifyGameFunction(funcName, callBack){
        let v = unsafeWindow[funcName];
        if(typeof v != 'function') throw new Error(`Game function(${funcName}) try to been modified but it was't found!`);
        let codes = v.toString(),
            anonFunc = codes.substring(0,codes.indexOf('(')).replace('function','').trim() == "";
        $(`<script id="modifyFunction_${funcName}" type="text/javascript">`).html(
            "/*This function was modified by FCUP Script*/\n"+
            (anonFunc?'window.'+funcName+"=":"")+
            codes.substring(0, codes.indexOf('{')+1) + callBack(codes.substring(codes.indexOf('{')+1, codes.lastIndexOf('}'))) + '}'
        ).appendTo('body').remove();
    }
    setVal(key,data){
        GM_setValue(Game.server+'_'+key, data);
    }
    getVal(key,defaultValue=undefined){
        return GM_getValue(Game.server+'_'+key, defaultValue);
    }
    delVal(key){
        GM_deleteValue(Game.server+'_'+key);
    }
})();
unsafeWindow.toolPipe = Tool.pipe;

//Live game function is in minified.js that is external function in head tag. This function had been already declarated and it must be modify before first game page loaded.
//Before Sammy->get->updateLayout->$('#content').html(value)
Tool.modifyGameFunction('Live',content=>{
    content = `\n\t$('#content > h2:first').append('<img src="https://cdn1.iconfinder.com/data/icons/interface-elements/32/accept-circle-512.png" height="25px" style="position:absolute;right: 3px;top: 3px;">');\n`+
        content;
    let b = content.search(/this.writeMessage\s*=\s*function/);
    b = content.indexOf('{',b)+1;
    b = content.indexOf('{',b)+1;
    content = content.substring(0,b)+ GetFuncContent(()=>{
        /*This codes were written by FCUP Script.*/
        try{
            var event_ = Object.assign({'_status': this.requestMin==0?'old':'new'}, arguments[1]);
            if($("#MatchEventCatcher").length){
                $("#MatchEventCatcher").trigger('click', [event_]);
            }
            else{ //Match event catcher not yet created
                toolPipe(Tool=>{
                    if(!Tool.uncaught_events_queue) Tool.uncaught_events_queue = [];
                    Tool.uncaught_events_queue.push(event_);
                });
            }
        }
        catch(err){console.error('MatchEventCatcher Trigger ERROR: ' + err.message);}
    }) + content.substring(b);

    b = content.search(/this\s*\.\s*commit\s*=/);
    let c = content.substring(b).search(/\$\s*\.\s*get/);
    return content.substring(0, b+c) + GetFuncContent(()=>{
        /*This codes were written by FCUP Script for Live League Table*/
        $('#MatchEndCatcher').trigger('click', [this.matchId]);
    }) + content.substring(b+c);
});

//Click event of .negotiation-bid-player is will declerate asap in body script tag.
//When the click event declarate, it will be deleted and new event created for them asap.
Tool.intervals.create(function(){
    let events = unsafeWindow.jQuery._data($('body')[0], "events");
    if(typeof events != 'object') return;
    if(events.click.filter(e=>e.selector=='.negotiation-bid-player').length == 0) return;
    this.delete();

    unsafeWindow.jQuery('body')
        .off('click', '.negotiation-bid-player')
        .on('click', '.negotiation-bid-player', function(e) {
        /* eslint no-multi-spaces: 0*/
        /* global amountControl,durationControl,updateAds*/
        let element  = $(this),                //Onaylama butonu
            id       = element.attr('unique'), //return player-29820872
            playerId = element.attr('player'), //Oyuncunun id si alınıyor.
            clubId   = element.attr('club'),   //Bizim kulüp id'imiz alınıyor.
            offer    = '',                     //Teklif ettiğimiz ücret
            amount   = '',                     //Oyuncuya vereceğimiz maaş
            duration = '',                     //Oyuncuyla anlaşacağımız sezon sayısı
            params,                            //Servere gönderilecek data
            negotiation_type,                  //Müzakere tipi = [offer,negotiateDebts,negotiateWithOwnPlayer,acceptNegotiation]
            pl; //Satın alınan oyuncunun isminin alınabilmesi için

        //Onaylama butonu gizleniyor.
        element.hide();

        //Onaylama butonunun olduğu yere yükleniyor gifi ekleniyor.
        element.parent().append($('<div class="load-icon loading" id="loading-'+id+'"></div>'));

        if($('#bid-offer-'+id).length && $('#bid-offer-'+id).val()){ //Oyuncuyu satın almak için kulübe teklif ettiğimiz input mevcutsa ve değeri boş değilse
            negotiation_type = 'offer'; //Oyuncuya teklif veriliyor.
            $('#info-player-'+playerId+' .abort-negotiation-button-container').first().hide(); //Geri dönmeyi sağlayan buton gizleniyor.
            offer = $('#bid-offer-' + id).val();
            params = {//Example : {"elements": '{"offer":{"0":"1111;2222;3333"}}'}
                'elements': JSON.stringify({
                    'offer': {
                        0: playerId+';'+clubId+';'+offer
                    }
                })
            };
        }
        else if($('#bid-amount-' + id).length && $ ('#bid-amount-' + id).val()){ //Teklif ettiğimiz maaş inputu mevcutsa ve değeri boş değilse
            if($('#own-offers').length){//Transfer pazarı sayfası açık ise ya kendi oyuncumuzla yeni sözleşme imzalıyoruz. Yada yeni bir oyuncu satın alırken futbolcuyla sözleşme imzalıyoruz.
                if((pl = $('#own-offers').find('tbody > tr span[pid="player-'+playerId+'"]')).length){ //Sözleşme imzalanan oyuncu tekliflerimiz tablosunda ise yeni bir oyuncu alarak sözleşme imzalıyoruz
                    negotiation_type = 'negotiateDebts';
                    pl = pl.parents('tr').first();
                }
                else//Tekliflerimizin bulunduğu tabloda yoksa, kendi oyuncumuz ile sözleşme imzalıyoruzdur.
                    negotiation_type = 'negotiateWithOwnPlayer'; //Oyuncu ile sözleşme yapılıyor.
            }
            else //Transfer pazarı sayfası açık değil. Not : Burada sıkıntı olabilir.
                negotiation_type = 'negotiateWithOwnPlayer';

            amount = amountControl[id].numberUnFormat($('#bid-amount-'+id).val()); //Formatı sıfırlıyor.Noktalar kaldırılıyor.Artık integer.

            if($('#bid-duration-' + id).length && $('#bid-duration-'+id).val()) //Teklif ettiğimiz sezon inputu mevcutsa ve değeri boş değilse
                duration = durationControl[id].numberUnFormat($('#bid-duration-'+id).val()); //Formatı sıfırlıyor.Noktalar kaldırılıyor.

            params = {//Example : {"elements":'{"negotiateDebts":{"0":"1111;2222;amount=33333;duration=3"}}'}
                'elements': JSON.stringify({
                    'negotiateDebts': {
                        0: playerId+';'+clubId+';amount='+amount+';duration='+duration
                    }
                })
            };
        }
        else{
            negotiation_type = 'acceptNegotiation'; //Gözlemcinin getirdiği oyuncu için kapora ödeniyor.
            params = { //Example : {"elements":'{"acceptNegotiation":{"0":"1111;2222"}}'}
                'elements': JSON.stringify({'acceptNegotiation': {0: playerId+';'+clubId}})
            };
        }

        $.get( //Servere istek gönderiliyor.
            '/index.php?w='+worldId+'&area=user&module=player&action=negotiate&complex=0',
            params,
            function(response) { //İstek başarılı oldu!
                $('#loading-'+id).remove(); //Yükleniyor gifi kaldırılıyor.
                let div = $('<div>').html(response);
                try{
                    let texts,negotiate_success = !1;
                    switch(negotiation_type){
                        case "offer":case "acceptNegotiation":break;
                        case "negotiateDebts": //Yeni bir oyuncu satın alırken kontrat yapıyoruz
                        case "negotiateWithOwnPlayer": //Kendi oyuncumuzla kontrat yeniliyoruz
                            div.find('script').each(function(i){
                                texts = $(this).html();
                                //window.location.href = $('span[pid=player-' + 29823205 + ']').first().attr('ref')
                                if(-1 != texts.search(new RegExp(`window\\s*.\\s*location\\s*.\\s*href\\s*=\\s*\\$\\s*\\(\\s*'span\\[pid=player-'\\s*\\+\\s*${playerId}\\s*\\+\\s*']'\\s*\\)`))){
                                    div.find('script')[i].remove();
                                    negotiate_success = !0;
                                    let notification_text;
                                    if(negotiation_type=="negotiateWithOwnPlayer"){//Kendi oyuncumuz ile başarılı bir şekilde sözleşme imzaladık!
                                        notification_text = GetText('SuccessfullyContract');
                                    }
                                    else{//Yeni bir oyuncuyu sözleşme imzalayarak satın aldık.
                                        let data = Tool.getVal('PlayersData',{BuyPlayers:[]});  //Structure: http://prntscr.com/uc2p4v
                                        if(!Array.isArray(data.BuyPlayers)) data.BuyPlayers = [];
                                        let playerName = pl.find('.player-name:first').text().trim(),
                                            BuyPlayers = data.BuyPlayers;
                                        BuyPlayers.splice(0,0,{
                                            playerCountry : pl.find('td:nth-child(1) > img').attr('src').match(/\w+.gif/)[0].replace('.gif',''),
                                            playerId      : playerId,
                                            playerName    : playerName,
                                            position      : pl.find('td:nth-child(3)').text().trim(),
                                            strength      : parseInt(pl.find('td:nth-child(4)').text()),
                                            age           : parseInt(pl.find('td:nth-child(5)').text()),
                                            salary        : parseInt(amount),
                                            price         : parseInt(pl.find('td:nth-child(8)').attr('sortvalue')),
                                            season        : parseInt(duration),
                                            club          : {
                                                id        : parseInt(pl.find('td:nth-child(6) > a').attr('clubid')),
                                                name      : pl.find('td:nth-child(6) > a').text().trim()
                                            },
                                            date : GetDateText(Game.getTime()),

                                        });
                                        Tool.setVal('PlayersData',data);
                                        notification_text = GetText('SuccessfullyTransferred', {args:[playerName]});
                                    }
                                    //Onaylama butonunu gizlemeye gerek yok çünkü en başta gizliyoruz : element.hide();
                                    //$('#negotiation-bid-player-' + playerId).hide();
                                    //Böyle bir element yok ki!
                                    $('#info-window-player-' + playerId + ' .abort-negotiation-button-container').first().hide();
                                    setTimeout(async function(){
                                        location.href = $('span[pid=player-'+playerId+']').first().attr('ref');
                                        if(notification_text){
                                            await Game.pageLoad();
                                            Game.giveNotification(true, notification_text);
                                        }
                                    },2000);
                                    $('.negotiation table, .negotiation .info').each(function(key, e) {
                                        e.hide();
                                    });
                                    return false;
                                }
                            });
                            break;
                    }
                }
                catch(err){
                    CatchError(err,'negotiation-bid-player');
                }

                $('#negotiate-container-'+id).html(div.html()); //Konteynıra server tarafından verilen cevap konuluyor.

                updateAds(); //Reklamları güncelleme

                $('body').trigger('content:changed');
            }
        ).fail(function(){
        }).always(function(){
        });
    });
},20);

//openCard function is will declerate asap in body script tag.
//When it is exist it will be updated to display captain image
Tool.intervals.create(function(){
    if(typeof unsafeWindow.openCard != 'function') return
    this.delete();

    Tool.modifyGameFunction('openCard',function(content){/*To show Captain Image*/
        /*global element,pid*/
        return content + GetFuncContent(()=>{
            /*New codes added here by FCUP Script*/
            let div_dialog = element.parent();
            div_dialog.css('display','none').fadeIn(400);
            if(parseInt($('#agreement-info-'+pid+' > li:nth-child(8) > div > div.bar-text').text())>=55 && !$('#info-'+pid+' > div.name > img.captain_icon').length){
                $('#info-'+pid+' > div.name').append(
                    `<img class="captain_icon" title="Captain" src="https://i.ibb.co/Sy52rxz/Captain.png" style="height:20px; float:none; margin:-7px 0 0 3px; vertical-align:middle; cursor:info;">`
                );
            }
        });
    });
},20);

Tool.features.add('ConstructionCountdown','main',function(){
    $('.likebox').css('bottom','-28px');
    $('#clubinfocard > ul').append(
        `<li>`+

        `   <span class="label">${GetText('Buildings')}:</span>`+
        `   <span id="countdown_buildings">${GetText('Loading')}...</span>`+
        `</li>`+

        `<li>`+

        `   <span class="label">${GetText('Stadium')}:</span>`+
        `   <span id="countdown_stadium">${GetText('Loading')}...</span>`+
        `</li>`
    );
    ['buildings','stadium'].forEach(module=>{
        if(Tool.hasOwnProperty(["finishDate_"+module])){
            let seconds = parseInt((Tool["finishDate_"+module] - Game.getTime()) /1000);
            let cd = $('#countdown_'+module);
            cd.attr('title',new Date(Tool["finishDate_"+module]).toLocaleString());
            startTimer(seconds,cd);
        }
        else getData(module);
    });
    function getData(module){
        Game.getPage(`?w=${worldId}&area=user&module=${module}&action=index&_=squad`, '#content').then(content=>{
            let cd = content.find('.countdown');
            if(cd.length){
                let seconds = parseInt(cd.first().attr('x')),
                    finishDate = Game.getTime()+seconds*1000;
                Tool["finishDate_"+module] = finishDate; //Bitiş süresinin bir kere alınması yeterli.
                cd = $('#countdown_'+module);
                cd.attr('title',new Date(Tool["finishDate_"+module]).toLocaleString());
                startTimer(seconds,cd);
            }
            else{
                let result = '';
                if(module=='buildings'){//buildings
                    if(content.find('.build').length)
                        result = `<a href="#/index.php?w=${worldId}&area=user&module=${module}&action=index" style="color:#51ff44;">${GetText('GoToBuildings')}</a>`;
                    else result = `<font color="white">${GetText('Full')}</font>`;
                }
                else{//stadium
                    let capacity = parseInt(content.find('.stadium-separator').parent().find('>span').last().text().replace('.','').trim());
                    let full_infrastructure = undefined == $(content[0].querySelector('#infrastructure')).find('ul.options-list > li > .imagesprite-container > div[class]').toArray().find(d=>{return $(d).hasClass('inactive')});
                    if(capacity == 77800 && full_infrastructure) result = `<font color="white">${GetText('Full')}</font>`;
                    else result = `<a href="#/index.php?w=${worldId}&area=user&module=${module}&action=index" style="color:#51ff44;">${GetText('GoToStadium')}</a>`;
                }

                $('#countdown_'+module).html(result);
            }
        }).catch(err=>{
            $('#countdown_'+module).html(`<font color="#751b1b">${GetText('error')}</font>`);
            console.error(err);
        });
    }
    function startTimer(seconds,e){
        e.html(SecToTime(seconds--));
        Tool.intervals.create(function(){
            if(seconds<1){
                e.html(`<font style="color:#b20b0b; font-weight:bold;">${GetText('ItIsOver')} !</font>`);
                this.delete();
                return;
            }
            e.html(SecToTime(seconds--));
        },1000,e[0].id);
    }
},'#clubinfocard > ul > li:nth-child(6),#clubinfocard > ul > li:nth-child(7)');
Tool.features.add('RematchMatch','main',function(){
    let requests = {
        "myRequest":{
            "accepted":[],
            "unaccepted":[]
        },
        "otherRequest":{
            "accepted":[],
            "unaccepted":[]
        }
    };
    $('#matches > ul.matches.simulations > li').each(function(){
        let ul = $('ul',this),
            o = ul.find('.squad-home .self-link').length?"myRequest":"otherRequest",
            u;
        if(o=="otherRequest")
            u = ul.find('.show-button a[href*="acceptSimulation"]').length?"unaccepted":"accepted";
        else//myRequest
            u = ul.find('.show-button a[href*="match&id="]').length?"accepted":"unaccepted";
        requests[o][u].push(ul);
    });
    let oa = requests.otherRequest.accepted,
        i;
    //Kabul etmiş olduğumuz deplasman isteğimiz olacak fakat o takıma gönderdiğimiz bir simülasyon davetimiz olmayacak.
    for(i = 0; i < oa.length ; i++){
        let find = !1,
            clubId = $('li.col.info > span.squad-home > a',oa[i]).attr('clubid'),
            m = requests.myRequest.accepted.concat(requests.myRequest.unaccepted),
            j;
        for(j = 0; j < m.length ; j++){
            if(clubId == $('li.col.info > span.squad-away > a',m[j]).attr('clubid')){
                find = true;
                break;
            }
        }
        if(!find){
            let ul = oa[i];
            ul.find('.show-button').append(`<img class="sendSimulation" k="${clubId}" src="${Tool.sources.getLink('https://www.pinclipart.com/picdir/big/130-1304128_left-curved-arrow-clipart-black-curved-arrow-png.png')}" alt="again" style="cursor:pointer; vertical-align:middle;" width="25x">`);
        }
    }

    let images = $('img.sendSimulation');
    if(!images.length) return false;

    let get_club_matchId = (clubId)=>{
        return new Promise((res,rej)=>{
            Game.getPage(`?w=${worldId}&area=user&module=profile&action=show&clubId=${clubId}`,'#profile-show').then(profile_show=>{
                res(profile_show.find('.button-container-friendly-invite-button > a')[0].href.split('&').find(a=>a.split('=')[0]=='invite').split('=')[1]);
            }).catch(err=>{rej(err)});
        });
    };
    let send_similation_request = (matchId)=>{
        return new Promise((res,rej)=>{
            Game.getPage(`?w=${worldId}&area=user&module=simulation&action=index&squad=${matchId}`,'#feedback').then(feedback=>{
                res(!feedback.find('.error').length);
            }).catch(err=>{rej(err)});
        });
    };

    images.click(function(){
        let success,
            img = $(this).hide().after('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="vertical-align:middle; margin-left:7px;">');

        get_club_matchId($(this).attr('k'))
            .then(match_id=>send_similation_request(match_id))
            .then(status=>{
            success = true;
            if(status) Game.giveNotification(true, GetText('SimulationRequestSent'));
            else Game.giveNotification(false, GetText('SimulationRequestAvailable'));
        }).catch(err=>{
            console.error(err);
        }).finally(function(){
            img.next().remove();
            if(success) img.remove();
        });
    });
},'.sendSimulation');
Tool.features.add('NumberOfFootballerChecker','main',function(){
    this.hover_selector = '#li_'+this.name;
    $('#clubinfocard > div.club-avatar').append(
        `<li>`+
        `   <span id="li_${this.name}" class="label">`+
        `      ${GetText('Team')}: <label id='auf_count_number'> ... </label>`+
        `   </span>`+
        `</li>`
    );
    Game.getPage(`?w=${worldId}&area=user&module=formation&action=index`, '#formation-count')
        .then(formation_count=>{
        let count_number = formation_count.text();
        if(count_number == "11") $('#auf_count_number').html('11/11');
        else $('#auf_count_number').html(`<font style="color:red; text-shadow:0.5px 0.5px white;">${count_number}/11</font>`);
    })
        .catch(err=>{
        $('#auf_count_number').html(`<font color="#751b1b">${GetText('error')}</font>`);
        console.error(err);
    });
});
Tool.features.add('MatchAnalyst', 'main',function(){
    let box = $('#matches > ul.matches.next'), matches;
    if(box.find('.no-entry').length || !(matches = box.find('>li')).length) return false;

    let get_club_info = (tricot,squad)=>{
        return {
            id  : squad.find('> a').attr('clubid'),
            name: squad.find('> a').text().trim(),
            logo: (squad.find('> .club-logo-container > img:first').attr('src')||"").split('/').splice(-2).shift() || 0,
            tricot : {
                shorts: tricot.find('img[src$="shorts.png"]').attr('color'),
                tricot: tricot.find('img[src$="tricot.png"]').attr('color'),
                design: tricot.find('img[src$="design.png"]').attr('color'),
                model : tricot.find('img[src$="details.png"]').attr('model')
            }
        }
    };
    matches= matches.toArray().map(m=>{
        let match={},
            li = $(m).find('>ul>li');
        match.type = $(li[0]).find('.icon.match')[0].className.replace('icon','').replace('match','').trim();
        match.time = $(li[1]).find('>p').text().match(/([0-9]{2}:[0-9]{2}:[0-9]{2})/)[0];
        match.date = $(li[1]).find('>p').text().replace(match.time,'').trim();
        match.home = get_club_info($(li[2]), $(li[3]).find('>.squad-home:first'));
        match.away = get_club_info($(li[4]), $(li[3]).find('>.squad-away:first'));
        if(match.type == 'tournament' && parseInt(match.time.split(':')[0])>17) match.isSpecialTournament = !0;
        return match;
    });
    get_club_info = undefined;

    box.html('');
    box[0].style="display:none; margin:0px; height:214px; background:url('https://i.ibb.co/pxPRgSL/background-image.png'); color:white; padding:5px; position:relative;";

    //Create Next Matches Tables
    let create_tricot = (t)=>$(
        `<div class="tricot-container" style="display:inline-block;">`+
        `   <img class="background shorts png" src="/tricots/${t.model+'/'+t.shorts}/shorts.png" alt="shorts" model="${t.model}" color="${t.shorts}">`+
        `   <img class="background tricot png" src="/tricots/${t.model+'/'+t.tricot}/tricot.png" alt=tricot"" model="${t.model}" color="${t.tricot}">`+
        `   <img class="background design png" src="/tricots/${t.model+'/'+t.design}/design.png" alt="design" model="${t.model}" color="${t.design}">`+
        `   <img  class="png" src="designs/redesign/images/tricots/${t.model}/details.png" alt="model" model="${t.model}">`+
        `</div>`
    );
    let create_comparision = (compares)=>{
        let e=$(`<div>`+compares.map(key=>`<p><strong>${GetText(key)}:</strong> <span>...</span></p>`).join('')+'</div>');
        e.find('>p').css({
            'text-align':'right',
            'font-size':'12px',
            'margin-bottom':'1px'
        });
        e.find('>p:not(:last)').css({
            'border-bottom':'1px solid white',
            'padding':'1px 0'
        });
        e.find('>p >strong').css('float','left');
        return e;
    }

    let pages={rating:{}, manager:{}, squadstrenght:{}, fixture:{}};
    for(let i=0; i<matches.length; i++){
        let match  = matches[i],
            p_match= i-1>-1?matches[i-1]:0,
            n_match= i+1<matches.length?matches[i+1]:0,
            matchId= match.home.id+'_'+match.away.id+'_'+i;

        let compares = [];
        switch(match.type){
            case "tournament":
                //Turnuva sayfasına gidip, katıldığımız turnuvaları çek
                if(match.isSpecialTournament){// 20:00:00
                    /*compare = {
                        rating: {
                            elo_rating: 1
                        },
                        manager : {
                            squad_strength  : 1,
                            strongest_player: 1,
                            trophy: -1
                        }
                    };*/
                }
                else{// 14:00:00
                    compares = ['EloRank', 'SquadStrength', 'StrongestPlayer'];
                    [match.home.id, match.away.id].forEach((id,away)=>{
                        let squad = away?'away':'home',
                            e = matchId+'_'+squad;

                        if(!pages.rating.hasOwnProperty(id)) pages.rating[id] = {n:match[squad].name, e:[]};
                        pages.rating[id].e.push(e);

                        if(!pages.manager.hasOwnProperty(id)) pages.manager[id] = {};
                        ['ss', 'sp'].forEach(k=>{
                            if(Array.isArray(pages.manager[id][k])) pages.manager[id][k].push(e);
                            else pages.manager[id][k] = [e]
                        });
                    });
                }
                break;
            case "friendly":// 16:00:00
                compares = ['StadiumCapacity', 'StadiumInfrastructure', 'HomeBonusCount', 'SquadStrength', 'StrongestPlayer'];

                [match.home.id, match.away.id].forEach((id,away)=>{
                    let squad = away?'away':'home',
                        e = matchId+'_'+squad;

                    if(!pages.manager.hasOwnProperty(id)) pages.manager[id] = {};
                    ['sc', 'si', 'hb', 'ss', 'sp',].forEach(k=>{
                        if(Array.isArray(pages.manager[id][k])) pages.manager[id][k].push(e);
                        else pages.manager[id][k] = [e]
                    });
                });
                break;
            case "league":// 18:00:00
                compares = ['EloRank', 'LeagueRank', 'SquadStrength', 'StrengthDetails', 'PrevMatchesScores', 'StrongestPlayer'];

                if(!pages.squadstrenght.hasOwnProperty(Tool.clubId)) pages.squadstrenght[Tool.clubId] = {};
                if(!pages.fixture.hasOwnProperty(Tool.clubId)) pages.fixture[Tool.clubId] = {};

                [match.home.id, match.away.id].forEach((id,away)=>{
                    let squad = away?'away':'home',
                        e = matchId+'_'+squad;

                    if(!pages.rating.hasOwnProperty(id)) pages.rating[id] = {n:match[squad].name, e:[]};
                    pages.rating[id].e.push(e);

                    if(!pages.manager.hasOwnProperty(id)) pages.manager[id] = {};
                    ['ss', 'sp', 'lr'].forEach(k=>{
                        if(Array.isArray(pages.manager[id][k])) pages.manager[id][k].push(e);
                        else pages.manager[id][k] = [e]
                    });

                    if(!pages.squadstrenght[Tool.clubId].hasOwnProperty(id)) pages.squadstrenght[Tool.clubId][id] = [];
                    pages.squadstrenght[Tool.clubId][id].push(e);

                    if(!pages.fixture[Tool.clubId].hasOwnProperty(id)) pages.fixture[Tool.clubId][id] = [];
                    pages.fixture[Tool.clubId][id].push(e);
                });
                break;
        }

        $(`<div class="matches" style="height:100%; position:relative;${i>0?" display:none;":""}">`+
          `   <p style="font-size:15px; color:white; text-align:center; font-weight:bold;">`+
          `      ${GetText(match.type=='tournament'?(match.isSpecialTournament?'specialTournamentMatch':'tournamentMatch'):(match.type+'Match'))} - ${match.date}, ${match.time}</p>`+
          `   <span class="fixture ${match.type}" style="width:128px; position:absolute; bottom:0; left:0;"></span>`+
          `   <div style="height:70%; width:90%; margin:5px auto 0 auto; position:relative; z-index:1;">`+
          /*     Home Club*/
          `      <div style="height:100%; width:49%; float:left;">`+
          `         <div style="position:relative; margin-bottom: 22px;">`+
          `            ${create_tricot(match.home.tricot).css('margin','0 5px -14px 0')[0].outerHTML}`+
          `            <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${match.home.id}" clubid="${match.home.id}" ${match.home.id==Tool.clubId?'class="self-link"':''} style="font-size:13px; font-weight:bold; text-decoration:none;">${match.home.name}</a>`+
          `            ${match.home.logo?`<img src="/avatars/${worldId}/squad/${match.home.logo}/${match.home.id}" style="position:absolute; top:7px; right:5px;">`:''}`+
          `         </div>`+
          `         ${create_comparision(compares).attr('id',`comparison_${matchId}_home`)[0].outerHTML}`+
          `      </div>`+

          `      <div style="width:0.1%; height:100%; background-color:white; float:left; margin-left:5px;"></div>`+

          /*     Away Club*/
          `      <div style="height:100%; width:49%; float:right; text-align:right;">`+
          `         <div style="position:relative; margin-bottom:22px;">`+
          `            ${match.away.logo?`<img src="/avatars/${worldId}/squad/${match.away.logo}/${match.away.id}" style="position:absolute; top:7px; left:5px;">`:''}`+
          `            <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${match.away.id}" clubid="${match.away.id}" ${match.away.id==Tool.clubId?'class="self-link"':''} style="font-size:13px; font-weight:bold; text-decoration:none;">${match.away.name}</a>`+
          `            ${create_tricot(match.away.tricot).css('margin','0 0 -14px 5px')[0].outerHTML}`+
          `         </div>`+
          `         ${create_comparision(compares).attr('id',`comparison_${matchId}_away`)[0].outerHTML}`+
          `      </div>`+
          `   </div>`+
          `</div>`
         ).attr({
            id: matchId,
            prev_match: p_match? p_match.home.id+'_'+p_match.away.id+'_'+(i-1): null,
            next_match: n_match? n_match.home.id+'_'+n_match.away.id+'_'+(i+1): null
        }).appendTo(box);
    }
    create_tricot = create_comparision = undefined;

    Object.values(pages.rating).forEach(data=>{
        let e = data.e = $(data.e.map(e=>$(`#comparison_${e} strong>[k="EloRank"]`).parent().next())).map($.fn.toArray),
            club_name = data.n;

        e.html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-left:10px; vertical-align:middle;">');
        Game.getPage(`index.php?w=${worldId}&area=user&module=rating&action=index&club=${club_name}&_qf__form=&league=&path=index.php&layout=none`,'#container-rating')
            .then(div=>{
            let row = div.find('.table-rating > tbody > tr.odd,tr.even');
            if(!row.length){
                e.html('~');
                return;
            }
            row = row.first();
            let rank = parseInt(row.find('>td:first').text().split('.').join('')),
                change_r = parseInt(row.find('>td:nth-child(2)').text().split('.').join('')),
                points = parseInt(row.find('>td:nth-child(4)').text().split('.').join('')),
                points_r = parseInt(row.find('>td:nth-child(5)').text().split('.').join(''));
            e.html(rank);
        })
            .catch(err=>{
            e.html(`<font color="#f34949" style="border-bottom:1px dashed red;">${GetText('error')}</font>`);
            console.error(err);
        });
    });

    Object.entries(pages.manager).forEach(d=>{
        let clubId = d[0],
            data = d[1],
            ss = data.ss = $((Array.isArray(data.ss)?data.ss:[]).map(e=>$(`#comparison_${e} strong>[k="SquadStrength"]`).parent().next())).map($.fn.toArray),
            sp = data.sp = $((Array.isArray(data.sp)?data.sp:[]).map(e=>$(`#comparison_${e} strong>[k="StrongestPlayer"]`).parent().next())).map($.fn.toArray),
            lr = data.lr = $((Array.isArray(data.lr)?data.lr:[]).map(e=>$(`#comparison_${e} strong>[k="LeagueRank"]`).parent().next())).map($.fn.toArray),
            sc = data.sc = $((Array.isArray(data.sc)?data.sc:[]).map(e=>$(`#comparison_${e} strong>[k="StadiumCapacity"]`).parent().next())).map($.fn.toArray),
            si = data.si = $((Array.isArray(data.si)?data.si:[]).map(e=>$(`#comparison_${e} strong>[k="StadiumInfrastructure"]`).parent().next())).map($.fn.toArray),
            hb = data.hb = $((Array.isArray(data.hb)?data.hb:[]).map(e=>$(`#comparison_${e} strong>[k="HomeBonusCount"]`).parent().next())).map($.fn.toArray);

        let all = ss.add(sp).add(lr).add(sc).add(si).add(hb);

        if(0 == all.length) return;
        all.html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-left:10px; vertical-align:middle;">');

        Game.getPage(`?w=${worldId}&area=user&module=profile&action=show&clubId=${clubId}&layout=none`, '#profile-show')
            .then(node=>{
            let contents = node.find('ul.profile-box-squad > li:nth-child(1)').contents();
            if(!contents.length) return; //Kein Verein gefunden.

            if(ss.length) ss.html(node.find('ul.profile-box-squad > li:nth-child(1)').contents()[1].textContent); //Squad_Strength

            if(lr.length){
                let leaguetable = node[0].querySelector('#leaguetable');
                if(leaguetable && !$('.no-entry',leaguetable).length){
                    //$('>h2',leaguetable).text().trim()+", " +
                    lr.html($('> div.container > div > table',leaguetable).find(`a[clubid="${clubId}"]`).parents('tr:first').find('td:first').text().trim()); //League
                }
                else lr.html('~');
            }

            if(sp.length){
                let o = $('.profile-box-squad .open-card',node);
                if(!o.length){
                    sp.html(GetText('NotFound'));
                    return;
                }
                let name = o.next().find('.ellipsis'),
                    playerDetails;
                if(name.length){
                    let p = $(name.parent()[0].outerHTML);
                    name = name[0].title;
                    p.find('.ellipsis').remove();
                    playerDetails = p.html();
                }
                else{
                    name = o.next().text();
                    let idx = name.indexOf('(');
                    playerDetails = name.substring(idx).trim();
                    name = name.substring(0,idx).trim();
                }
                sp.html(`<span pid="player-${o.attr('pid').split('-')[1]}" class="icon details open-card" style="float:none;"></span>${/*name +" "+*/playerDetails}`);
            }

            if(sc.length) sc.html(node.find('.profile-box-stadium').text().trim().match(/[\d,\.]+/)[0]||"~");

            if(hb.length + si.length){
                unsafeWindow.jQuery.get(`/index.php?w=${worldId}&area=user&module=trophy&action=index&complex=0&clubId=${clubId}`).success(function(r){
                    if(si.length){
                        let node = $('<div>').html(r);
                        si.html(node.find('.trophy-50').hasClass('trophy-unavailable')?GetText("Missing"):GetText("Full"));
                    }

                    if(hb.length){
                        try{
                            let b = r.lastIndexOf('toolTipObj.addTooltips(')+23;
                            r = JSON.parse(r.substring(b,r.indexOf(');',b)));
                            let text= r.tt_trophy_70.trim(),
                                num = parseInt(text.substring(text.lastIndexOf(':')+1,text.lastIndexOf('<')))
                            hb.html(Number.isInteger(num)?num:"~");
                        }
                        catch(err){
                            hb.html(`<font color="#f34949" style="border-bottom:1px dashed red;">${GetText('error')}</font>`);
                        }
                    }
                });
            }
        })
            .catch(err=>{
            $(all.toArray().filter(span=>$(span).find('>img').length)).html(`<font color="#f34949" style="border-bottom:1px dashed red;">${GetText('error')}</font>`);
            console.error(err);
        });
    });

    Object.entries(pages.squadstrenght).forEach(d=>{
        let clubId = d[0];
        if(clubId != Tool.clubId) return;
        let data = d[1] = Object.entries(d[1])
        .map(d=>[d[0], $(d[1].map(e=>$(`#comparison_${e} strong>[k="StrengthDetails"]`).parent().next())).map($.fn.toArray)])
        .reduce((acc,d)=>{acc[d[0]]=d[1];return acc;},{});

        $(Object.values(data)).map($.fn.toArray).html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-left:10px; vertical-align:middle;">');

        Game.getPage(`?w=${worldId}&area=user&module=statistics&action=squadstrenght&layout=none`, '#squad-strengths')
            .then(table=>{
            let tbody = table.find('>tbody:first');
            Object.entries(data).forEach(d=>{
                let clubId = d[0],
                    e = d[1],
                    a = tbody.find(`td.name-column > a[clubid="${clubId}"]:first`);
                if(!a.length){
                    e.html('~');
                    return;
                }
                e.html(a.parents('tr').find('>td[sortvalue]:not(.last-column)').toArray().map(e=>$(e).attr('sortvalue')).join(' | '));
            });
        })
            .catch(err=>{
            $($(Object.values(data)).map($.fn.toArray).toArray().filter(span=>$(span).find('>img').length)).html(`<font color="#f34949" style="border-bottom:1px dashed red;">${GetText('error')}</font>`);
            console.error(err);
        });
    });

    Object.entries(pages.fixture).forEach(d=>{
        let clubId = d[0];
        if(clubId != Tool.clubId) return;

        let data = d[1] = Object.entries(d[1])
        .map(d=>[d[0], $(d[1].map(e=>$(`#comparison_${e} strong>[k="PrevMatchesScores"]`).parent().next())).map($.fn.toArray)])
        .reduce((acc,d)=>{acc[d[0]]=d[1];return acc;},{});

        let all = $(Object.values(data)).map($.fn.toArray);
        all.html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-left:10px; vertical-align:middle;">');

        let images = {
            'W': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iV2luIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzNBQTc1NyIgY3g9IjgiIGN5PSI4IiByPSI4Ij48L2NpcmNsZT4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSI2LjQgOS43NiA0LjMyIDcuNjggMy4yIDguOCA2LjQgMTIgMTIuOCA1LjYgMTEuNjggNC40OCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==',
            'D': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRHJhdyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiM5QUEwQTYiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjUgNyAxMSA3IDExIDkgNSA5Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K',
            'L': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTG9zcyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNFQTQzMzUiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiIHBvaW50cz0iMTIgOC44IDguOCA4LjggOC44IDEyIDcuMiAxMiA3LjIgOC44IDQgOC44IDQgNy4yIDcuMiA3LjIgNy4yIDQgOC44IDQgOC44IDcuMiAxMiA3LjIiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=',
            '-': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRW1wdHkiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0JEQzFDNiIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjgiIGN5PSI4IiByPSI3Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo='
        }
        Game.getPage(`?w=${worldId}&area=user&module=statistics&action=games&layout=none`)
            .then(content=>{
            let table ,ul, trs;
            if(!(table=content.find('#league-crosstable')).length ||
               !(ul=content.find('.date-selector > ul:first')).length ||
               !(trs=table.find('>tbody > tr')).length){
                all.html('~');
                return;
            }
            let played = ul.find('li.day.past').length,
                getDatas = (td)=>{
                    let goals, week;
                    if((goals=$('>p',td).text().trim().split(':').map(n=>parseInt(n))).length!=2 ||
                       undefined !== goals.find(n=>isNaN(n)) ||
                       (week=$('>p',td).attr('title').trim().split(':')).length!=2 ||
                       isNaN(week=parseInt(week[1]))
                      ) return false;
                    return {goals:goals, week:week};
                }, r,
                thead = $('> thead > tr:nth-child(1)',table);
            Object.entries(data).forEach(d=>{
                let clubId = d[0],
                    e = d[1],
                    a = trs.find(`> td > a[clubid="${clubId}"]:first`);
                if(!a.length){
                    e.html('~');
                    return;
                }
                let tr = a.parents('tr:first'),
                    results = ["-","-","-","-","-"];
                tr.find('td:not(.nomatch):not(:first)').each(function(){ //Satırdaki bölümler incelenecek
                    if(!(r = getDatas(this))){
                        e.html('~');
                        return;
                    }
                    if(r.week<played-4 || played<r.week) return; //Too old score
                    results[4-Math.max(0,5-played)-played+r.week] = {
                        s: r.goals[0]>r.goals[1]?"W":r.goals[0]==r.goals[1]?"D":"L",
                        g: r.week+": " + a.text().trim() + " " + r.goals[0]+'-'+r.goals[1] + " " + thead.find(`>th:nth-child(${$(this).index()+1})`).text().trim()
                    };
                });
                trs.find(`>td:nth-child(${1+tr.index()+1}):not(.nomatch)`).each(function(i){ //Sutundaki bölümler incelenecek
                    if(!(r = getDatas(this))){
                        e.html('~');
                        return;
                    }
                    if(r.week<played-4 || played<r.week) return; //Too old score
                    results[4-Math.max(0,5-played)-played+r.week] = {
                        s: r.goals[1]>r.goals[0]?"W":r.goals[0]==r.goals[1]?"D":"L",
                        g: r.week+": " + $(this).parent().find('a[clubid]').text().trim() + " " + r.goals[0]+'-'+r.goals[1] + " " + a.text().trim()
                    };
                });
                e.html(`[${results.reduce((acc,r)=>acc+({W:3,D:1}[r.s]||0),0)} ${GetText('SPoints')}] `+results.map(r=>`<img src="${images[r=="-"?r:r.s]}" ${r=="-"?"":`title="${r.g}"`} style="margin:0 2px -1px 0">`).join(''));
            });
        })
            .catch(err=>{
            $(all.toArray().filter(span=>$(span).find('>img').length)).html(`<font color="#f34949" style="border-bottom:1px dashed red;">${GetText('error')}</font>`);
            console.error(err);
        });
    });

    //Create Animation
    if(matches.length>1){
        box.append(
            `<img id="prev_match" matches_length="${matches.length}" src="https://i.ibb.co/p468SYn/Untitled.png" style="height:18px; position:absolute; left:2px; top:50%; cursor:pointer; transform:translate(0,-50%); display:none; ">`+
            `<img id="next_match" matches_length="${matches.length}" src="https://i.ibb.co/p468SYn/Untitled.png" style="height:18px; position:absolute; right:2px; top:50%; cursor:pointer; transform:translate(0,-50%); -moz-transform:scaleX(-1); -o-transform:scaleX(-1); -webkit-transform:scaleX(-1); transform:scaleX(-1);">`
        );
        $('#prev_match,#next_match').click(function(){
            $('#prev_match,#next_match').css("pointer-events", "none");
            let k = this.id=='next_match'?1:0,
                close_e = $('#matches > ul.matches.next').find('>div.matches:visible'),
                open_e = $('#'+close_e.attr(k?'next_match':'prev_match'));
            close_e.hide("slide", { direction: k?'left':'right' }, 200);
            setTimeout(()=>{
                open_e.show("slide", { direction: k?'right':'left' }, 300);
                $('#prev_match,#next_match').css("pointer-events", "auto");
            },250);
            $('#prev_match')[open_e.attr('prev_match')?'show':'hide']();
            $('#next_match')[open_e.attr('next_match')?'show':'hide']();
        });
    }

},'#matches > ul.matches.next,#matches-handle-container > li.handle:nth-child(2)');
Tool.features.add('TrainingControl',['squad','training->groups'],function(){
    function getElementOffsetWidth(e) {
        var element = $(e).clone().appendTo('body');
        var width = element.outerWidth();
        element.remove();
        return width;
    }
    let trainingPlan = Tool.trainingPlan,
        Positions = Tool.footballerPositions,
        SkillsName = Translate.locale.texts.Skills,
        alerts = {i:[],e:[]};
    $('#players-table-skills > tbody > tr').each(function(){
        let position = $(this).find('td:nth-child(3)').text().trim(),
            developSkills = trainingPlan[position];
        if(!developSkills) return true;

        let skills = $(this).find('.skill-column');

        for(let i = 0 ; i < developSkills.length ; i++){//Geliştirilecek yetenek aranıyor
            let s = $(skills[developSkills[i]]).find('span');
            if(s.hasClass("maximum")) continue;//Bu geliştirilecek yetenek maksimumsa bir sonraki geliştirilecek yeteneğe bak.
            else if(s.hasClass("next-training")) break;//Bu geliştirilecek yetenek geliştirilmeye devam ediyorsa doğru yoldasın.
            else{//Bu geliştirilecek yetenek maksimum değil ve geliştirilmeye devam edilmiyorsa.Bir sıkıntı var.
                //Ya farklı bir yetenek geliştiriliyor yada hiçbir yetenek geliştirilmiyor.
                let skillName = SkillsName[developSkills[i]],
                    left = (getElementOffsetWidth(s[0])-15)/2,
                    value = s.text().trim(),
                    playerName = $(this).find('.player-name').text().trim();
                s.html(
                    `<img title="${GetText('ImproveSkillTitle', {tag:0, args:[skillName]})}!!!" tool_tt="ImproveSkillTitle_${encodeURIComponent(JSON.stringify([skillName]))}" src="${Tool.sources.getLink('https://c.tenor.com/nByXaSdQ13EAAAAi/down-arrow-going-down.gif')}" alt="here" width="30px" height="30px" style="-webkit-transform:rotate(0deg); margin:-25px -15px -15px -5px; position:absolute;">`+
                    value
                );
                if($(skills[0]).parent().find('span.next-training').length) alerts.e.push(playerName+'-> '+skillName.toLowerCase());
                else alerts.i.push(playerName+'-> '+skillName.toLowerCase());
                break;
            }
        }
    });
    if(alerts.i.length || alerts.e.length){
        let content="";
        if(alerts.i.length){
            content= `<span style="text-decoration:underline; color:#3fffe4;">${GetText('TrainingMessage')}</span><br>`+alerts.i.join('<br>');
        }
        if(alerts.e.length){
            if(content!="") content+="<br><br>"
            content+= `<span style="text-decoration:underline; color: #3fffe4;">${GetText('FaultyTrainingMessage')}</span><br>`+alerts.e.join('<br>');
        }
        Game.giveNotification(true,content);
    }
},null);
Tool.features.add('ClubExchange','squad',function(){
    let ClubExchange = {
        initial_data : Tool.getVal('ClubExchange',{}),
        new : {},// Exp : {3252352:0,234131:1} , 0=>error , 1=>success
        selector : [],
        finish : 0,
        initial : function(){
            let initial_data = ClubExchange.initial_data;
            $('#players-table-overview > tbody > tr').add($('#players-table-overview-club > tbody > tr')).each(function(){
                let openCard;
                if(!(openCard = $(this).find('.open-card')).length) return true;
                let playerId = openCard.attr('pid').split('-')[1],
                    table = $(this).parents('table')[0].id.replace('players-table-',''),// overview or overview-club
                    index = $(this).index(),
                    td_contract = $('td:nth-child(11)',this);
                if(td_contract.text().indexOf(Tool.ClubExchange)!=-1){//td_contract da Kulüp Değişimi yazıyor olmali...
                    //Bu futbolcu kulüp değiştiriyor!!!
                    let playerData = initial_data[playerId];
                    if(!playerData) //Oyuncunun gidiş bilgileri mevcut değilse
                        ClubExchange.getPage(playerId,table,index);
                    else //Oyuncunun gidiş bilgileri mevcutsa
                        ClubExchange.addImage(playerData,table,index);
                }
            });
        },
        getPage : function(playerId,table,index){
            ClubExchange.new[playerId]=0;//Varsayılan değer olarak sayfa çekmeyi başarısız sayıyoruz.
            $.get(`index.php?w=${worldId}&area=user&module=player&action=index&complex=0&id=${playerId}`, function(response){
                ClubExchange.new[playerId]=1;//default olarak başarısız olarak varsayılan değeri başarılı değere çeviriyoruz.
                let li = $('<div>'+response+'</div>').find('.data.attributes > ul > li:last'),
                    a = li.find('a'),
                    club = {
                        id   : a.attr('clubid'),
                        name : a.text().trim()
                    };
                li.find('a,strong').remove();
                let li_text = li.text().trim(),
                    date = li_text.match(/(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/g);
                if(date){
                    date=date[0];
                    let playerData = {date:date,club:club},
                        data = Tool.getVal('ClubExchange',{});
                    data[playerId] = playerData;
                    Tool.setVal('ClubExchange',data);
                    ClubExchange.addImage(playerData,table,index)
                }
            }).always(function() {
                let _new = ClubExchange.new;
                if(ClubExchange.finish++==Object.keys(_new).length){//Tüm istekler başarılı yada başarısız bir şekilde bitti!
                    //Eğer daha önceden kayıtlı edilmiş bir futbolcu varsa(kulübü terkeden) şimdi o oyuncu bulunmazsa kulübü terk etmiştir. Onu kayıtlardan çıkarmamız lazım.
                    let initial_data = ClubExchange.initial_data,
                        current_data = Tool.getVal('ClubExchange',{}),
                        counter = 0;
                    for(let playerId in initial_data){
                        if(_new[playerId]==undefined){//Oyuncu çoktan kulübü terk etmiş..
                            counter++;
                            delete current_data[playerId];
                        }
                    }
                    if(counter) Tool.setVal('ClubExchange',current_data);
                }
            });
        },
        addImage : function(playerData,table,index){
            let d = playerData.date.split('.'),
                sec = parseInt((new Date(d[2],parseInt(d[1])-1,d[0],3).getTime()-Game.getTime())/1000),
                tds = [
                    $(`#players-table-${table} >tbody >tr:nth-child(${index+1}) >td:nth-child(11)`),
                    $(`#players-table-${table=='overview'?'agreements':'agreements-club'} >tbody >tr:nth-child(${index+1}) >td:nth-child(8)`)
                ];
            //this.selector.push('#players-table-'+table+' > tbody > tr:nth-child('+(index+1)+') > td:nth-child(11)','#players-table-'+(table=='overview'?'agreements':'agreements-club')+' > tbody > tr:nth-child('+(index+1)+') > td:nth-child(8)');
            $(tds).each(function(){
                let time_text = $('<div>'+SecToTime(sec)+'</div>').text(),
                    args = [playerData.date, playerData.club.name];
                $(this).html(
                    `<a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${playerData.club.id}" target="_blank">`+
                    `   <img title="${GetText('ClubExchange', {tag:0, args:args})}" tool_tt="ClubExchange_${encodeURIComponent(JSON.stringify(args))}" src="${Tool.sources.getLink('https://thumbs.dreamstime.com/z/arrow-up-down-stock-%C3%A2%E2%82%AC-121724975.jpg')}" alt="exchange" height="15px" style="background-color:#00fff7; border-radius:50%; cursor:pointer; margin-right:4px;">`+
                    `</a>`+
                    `<font title="${GetText('RemainingTime', {tag:0})} : ${time_text}"  tool_tt="RemainingTime_{X} : ${time_text}">${playerData.date}</font>`
                );
            });
        }
    };
    ClubExchange.initial();
},null);
Tool.features.add('RankingOfPlayers','squad',function(){
    if($('#players-table-overview > tbody > tr').find('.open-card').length==0) return false;

    let players = $('#players-table-overview > tbody > tr');
    players.each(function(i){
        $(this).find('td:nth-child(6) >span >input[type="text"]').attr('tabindex', i+1);
    });
    $('#squad-handle-container').append(`<input id="RankingOfPlayersButton" type="button" value="${GetText('SortPlayers', {tag:0})}" tool_vt="SortPlayers" title="${GetText('rankOfPlayerExplanation', {tag:0})}" tool_tt="rankOfPlayerExplanation" style="-webkit-border-radius:7px !important; padding:2px 5px; border:1px solid #999; font-size:9px; margin:16px 90px 0 40px;">`);
    $('#RankingOfPlayersButton').click(function(){
        let klText = Tool.footballerPositions[0],
            kl=[],genc=[],diger=[];
        $('#players-table-overview > tbody > tr').each(function(i){
            let mevki = $(this).find('td:nth-child(3)')[0].textContent.trim(),
                güc = parseInt($(this).find('td:nth-child(4)')[0].textContent),
                yas = parseInt($(this).find('td:nth-child(5)')[0].textContent);
            if(IsYoungPlayer($(this).find('td:nth-child(12)'))){
                let tarih = $(this).find('td:nth-child(11)')[0].textContent.split('.');
                tarih = new Date(tarih[2],parseInt(tarih[1])-1,tarih[0]).getTime();
                genc.push({'i':i,tarih:tarih});
            }
            else if(mevki===klText){
                kl.push({'i':i,güc:güc,yas:yas});
            }
            else{
                diger.push({'i':i,güc:güc,yas:yas});
            }
        });
        let maxKl = {güc:0,i:null},
            spliceIndex = null;
        for(let i = 0 ; i < kl.length; i++){
            if(kl[i].güc>maxKl.güc){
                maxKl.güc = kl[i].güc;
                maxKl.i = kl[i].i;
                spliceIndex = i;
            }
        }
        let no = 1;
        if(maxKl.i!=null){
            //Kaleci varsa, en güçlü kaleciyi 1.sıraya al!
            $('#players-table-overview > tbody > tr:nth-child('+(maxKl.i+1)+') > td:nth-child(6) > span > input[type="text"]').val(no);
            $('#players-table-overview > tbody > tr:nth-child('+(maxKl.i+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',no++);

            //En güçlü kaleciyi çıkart ve geri kalanını diger adlı diziye aktar
            kl.splice(spliceIndex,1);
            for(let i = 0 ; i < kl.length ; i++){
                diger.push({'i':kl[i].i,'güc':kl[i].güc,'yas':kl[i].yas});
            }
        }

        //En güçlüden en güçsüze göre sırala
        diger.sort(function(a,b){
            if(b.güc-a.güc!==0) return b.güc-a.güc;
            else return a.yas-b.yas;
        });

        //Genç hariç geri kalanını sırala
        for(let i = 0 ; i < diger.length ; i++){
            $('#players-table-overview > tbody > tr:nth-child('+(diger[i].i+1)+') > td:nth-child(6) > span > input[type="text"]').val(no);
            $('#players-table-overview > tbody > tr:nth-child('+(diger[i].i+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',no++);
        }

        //Genç oyuncuları geliş tarihlerine göre sırala. Geliş tarihi en küçük olan ilk olmalı!
        genc.sort(function(a,b){
            return a.tarih-b.tarih;
        });

        //Genç oyuncuları 90 dan başlayarak sırala
        for(let i = 0 ; i < genc.length ; i++){
            $('#players-table-overview > tbody > tr:nth-child('+(genc[i].i+1)+') > td:nth-child(6) > span > input[type="text"]').val(90+i);
            $('#players-table-overview > tbody > tr:nth-child('+(genc[i].i+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',90+i);
        }
        $('#players-table-overview > tfoot > tr > td:nth-child(2) > span > a > span').click();
    });
    $('#squad-handle-container > li').click(function(){
        $('#RankingOfPlayersButton')[$(this).index()?'slideUp':'slideDown']('slow');
    });
},'#RankingOfPlayersButton');
Tool.features.add('ShowStrengthChange','squad',function(){
    if($('#players-table-overview > tbody > tr').find('.open-card').length==0) return false;
    let BuyPlayers = Tool.getVal('PlayersData',{BuyPlayers:[]}).BuyPlayers; //Structure: http://prntscr.com/uc2p4v
    if(!Array.isArray(BuyPlayers) || BuyPlayers.length==0) return false;
    let players = $('#players-table-changes > tbody > tr .open-card');
    if(!players.length) return false;
    players.each(function(){
        let p_data = BuyPlayers.find(p=>p.playerId==$(this).attr('pid').split('-')[1]);
        if(p_data===undefined) return;
        let tr = $(this).parents('tr').first(),
            currentStrength = parseInt(tr.find('td:nth-child(4)').text()),
            oldStrength = p_data.strength,
            difference = currentStrength-oldStrength;
        if(difference>0) tr.find('td:nth-child(4)').append(`<span class="changed-property new-player" style="color:#42ff35; margin-left:2px;">(+${difference})</span>`);

        //tr.find('.last-column').last().css('position','relative').append(
        //   `<img title="${GetText('InfoStrengthChange', {tag:0})}" tool_tt="InfoStrengthChange" src="${Tool.sources.getLink('data','png')}" alt="data" height="15px" style="position:absolute; top:9px; right:10px;">`
        //);
    });

},'#players-table-changes > tbody span.changed-property.new-player');
Tool.features.add('ShowRealStrength','squad',function(){
    let tables =
        [
            ["#players-table-overview", "#players-table-agreements", "#players-table-skills"],
            ["#players-table-overview-club", "#players-table-agreements-club", "#players-table-skills-club"]
        ],
        counter = 0;
    for(let i = 0 ; i < tables.length ; i++){
        let first_table = $(tables[i][0]);
        if(!first_table.find('.open-card').length) continue;
        $('>tbody>tr',first_table).each(function(rowIndex){ //eslint-disable-line no-loop-func
            let row = $(this),
                position = row.find('> td:nth-child(3)').text().trim();
            let skills = [];
            $(tables[i][2]).find('> tbody > tr:nth-child('+(rowIndex+1)+')').find('.skill-column').each(function(){
                skills.push(parseFloat($(this).text()));
            });
            let strengthColumn = row.find('> td:nth-child(4)'),
                currentStrength = parseInt(strengthColumn.attr('sortvalue')),
                realStrength = GetRealStrength(skills,position);

            if(isNaN(realStrength)) return true;
            realStrength = realStrength.toFixed(2);

            let difference = (realStrength - currentStrength).toFixed(2),
                color = difference>0?"green":difference<0?"#a62c2c":"#d9d9d9";

            for(let j = 0 ; j < 3 ; j++){
                strengthColumn = $(tables[i][j]).find('>tbody > tr:nth-child('+(rowIndex+1)+') > td:nth-child(4)');
                strengthColumn.html(strengthColumn.html().replace(currentStrength,realStrength)).css('color',color).attr('title',(difference>0?'+':'')+difference).attr('realstrength',realStrength);
            }
            ++counter;
        });
    }
    if(counter==0) return false;
},"#players-table-overview > tbody td:nth-child(4)[realstrength],#players-table-overvie-club > tbody td:nth-child(4)[realstrength],#players-table-agreements > tbody td:nth-child(4)[realstrength],#players-table-agreement-club > tbody td:nth-child(4)[realstrength],#players-table-skills > tbody td:nth-child(4)[realstrength],#players-table-skill-club > tbody td:nth-child(4)[realstrength]");
Tool.features.add('CalculateNonYoungPlayersStrength','squad',function(){
    if(!(Array.isArray(Tool.ageDates) && Tool.ageDates.length>0)) return false;

    let tables =
        [
            ['#players-table-overview', '#players-table-skills'],
            ['#players-table-overview-club', '#players-table-skills-club']
        ],
        add =
        `<h3>${GetText('CalculateNonYoungPlayersStrength')}</h3>`+
        `<div id="CalculateFutureStrength" style="text-align:center; margin:5px auto; border-radius:15px; background-color:#4a6b3247;">`+
        `<div style="border-radius:15px 15px 0 0; background-color:#4a6b32; padding:15px 15px 5px 15px; margin-bottom:20px;">`,
        select =
        `<select id="selectPlayers" style="margin:0 0 0 20px; text-align-last:center; border-radius:10px; padding:3px 2px; background-color:black; color:green;" onfocus="this.style.backgroundColor='green'; this.style.color='black';" onfocusout="this.style.backgroundColor='black'; this.style.color='green';">`+
        `<option value="0" tool_ot="ChoosePlayer">${GetText('ChoosePlayer', {tag:0})}</option>`;

    for(let i=0 ; i<tables.length; i++){
        let first_table = $(tables[i][0]);
        if(!first_table.find('.open-card').length) continue;
        first_table.find('> tbody > tr').each(function(rowIndex){ //eslint-disable-line no-loop-func
            let row = $(this);
            if(IsYoungPlayer(row.find('td:nth-child(12)'))) return true;
            let position = row.find('td:nth-child(3)').text().trim(),
                playerId = row.find('.open-card').attr('pid').split('-')[1],
                playerName = row.find('.player-name').text(),
                skills = [];
            $(tables[i][1]+' > tbody > tr:nth-child('+(rowIndex+1)+') .skill-column').each(function(){
                skills.push(parseFloat($(this).text()));
            });
            select+=`<option value="${playerId}" position="${position}" age="${row.find('td:nth-child(5)').text()}" skill="${skills.join(',')}">[${position}] ${playerName}</option>`;
        });
    }
    select += '</select>';
    add+= GetText('ChoosePlayer')+': ' + select;
    add+='</div></div>';
    $('#squad > div.squad.personal').append('<hr>'+add);
    tables = add = select = undefined;

    let ageDates = Tool.ageDates,
        age_length = ageDates.length,
        serverTime = Game.getTime(),
        nextAgesDates = [];
    for(let i = 0 ; i < age_length ; i++){
        if(ageDates[i]*60000>serverTime){
            nextAgesDates.push(ageDates[i]);
        };
    }
    $('#selectPlayers').attr('nextAgesDates',nextAgesDates.join(','));
    ageDates = age_length = serverTime = nextAgesDates = undefined;

    $('#selectPlayers').change(function(){
        $('#Comparison').add($(this).nextAll()).remove();
        if(this.value!=0){
            let nextAgesDates = $(this).attr('nextAgesDates').split(','),
                selectedOption = $('option:selected',this),
                age = parseInt(selectedOption.attr('age')),
                position = selectedOption.attr('position'),
                skills = selectedOption.attr('skill').split(','),
                text =
                `<span id="ChoosedPlayer" class="icon details open-card" pid="player-${this.value}" style="float:none; margin-top:-3px;"></span>`+
                `<p style="margin-top:5px;">`+
                `   ${GetText('SkillPassLimitPoint')} : `+
                `   <input id="ChangeSkillLimit" type="number" style="border-radius:7px; border:1px solid gray; width:75px; text-align:center; padding:0 2px;" value="990" step="10" max="990" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57">`+
                `</p>`+
                `<p style="margin-top:5px;">`+
                `   ${GetText('TrainerLevel')} : ${Tool.trainerLevel} ${GetText('SortLevel')}`+
                `</p>`+
                `<p id="chooseRange" style="margin:10px 0;">`+
                `   ${GetText('ChooseAge')} :`+
                `   <input id="ageRange" class="slider" type="range" min="${age}" max="${Math.min(age+nextAgesDates.length, (position==Tool.footballerPositions[0]?(age<43?43:age+1):(age<41?41:age+1)))}" value="${age}" style="vertical-align:middle; margin:0 5px; border-radius:8px; width:300px;">`+
                `   <label id="lblageRange">${age}</label>`+
                `</p>`;
            selectedOption = undefined;

            for(let i in skills) skills[i] = parseFloat(skills[i]);

            $(this).after(text);
            text = undefined;

            $('#ChangeSkillLimit').keyup(function(){
                let val = $(this).val();
                if(isNaN(val)) val = 0;
                val = parseInt(val);
                if(val<$(this).attr('min')) val = $(this).attr('min');
                else if(val>$(this).attr('max')) val = $(this).attr('max');
                if($(this).val() != val) $(this).val(val);
            }).mouseenter(function(){
                $(this).focus();
                $(this).select();
            }).change(function(){
                $('#ageRange').trigger('oninput');
            });

            document.getElementById('ageRange').oninput = function() {
                $('#Comparison').remove();
                $('#lblageRange').text(this.value);

                if(parseInt(this.value)>age){
                    let now = Game.getTime(),
                        targetDate = nextAgesDates[parseInt(this.value)-age-1]*60000,
                        result = CalculateFutureStrength(now, targetDate, skills, position, false, parseInt($('#ChangeSkillLimit').val()));
                    if(!isNaN(result.current_strength)) result.current_strength = result.current_strength.toFixed(2);
                    if(!isNaN(result.future.normal.strength)) result.future.normal.strength = result.future.normal.strength.toFixed(2);
                    if(!isNaN(result.future.premium.strength)) result.future.premium.strength = result.future.premium.strength.toFixed(2);

                    let tables =
                        [
                            {
                                title    : GetText('Now')+' ('+GetDateText(now)+')',
                                skills   : skills,
                                age      : age,
                                strength : result.current_strength
                            },
                            {
                                title            : GetText('NonCreditTraining')+' ('+GetDateText(targetDate)+')',
                                skills           : result.future.normal.skills,
                                age              : parseInt(this.value),
                                strength         : result.future.normal.strength,
                                numberOfTraining : result.future.normal.trainings
                            },
                            {
                                title            : GetText('CreditTraining')+' ('+GetDateText(targetDate)+')',
                                skills           : result.future.premium.skills,
                                age              : parseInt(this.value),
                                strength         : result.future.premium.strength,
                                numberOfTraining : result.future.premium.trainings
                            }
                        ],
                        skillsId = ['penalty_area_safety', 'catch_safety', 'two_footed', 'fitness', 'shot', 'header', 'duell', 'cover', 'speed', 'pass', 'endurance', 'running', 'ball_control', 'aggressive'],
                        code = '<div id="Comparison" class="infosheet" style="text-align:center; margin-bottom:10px;">';
                    now = targetDate = undefined;

                    for(let tablesIndex = 0 ; tablesIndex < 3 ; tablesIndex++){
                        code +=
                            '<div class="data skills" style="height:100%; padding:5px; background-color:#58793d; border-radius:5px; position:static;'+(tablesIndex!=2?" margin-right:25px;":"")+'">'+
                            '<h2 style="font-size:12px; margin-bottom:5px; border:none; line-height:25px; height:25px; background:#4a6b32; width:auto; font-weight:bold;">'+
                            tables[tablesIndex].title+
                            '</h2>'+
                            '<ul style="margin:3px 0;">'+
                            '<li class="odd">'+
                            '<span style="float:left;">Ø</span>'+
                            '<span style="color:white;font-weight:bold;">'+
                            (typeof tables[tablesIndex].strength == 'number'?(tables[tablesIndex].strength).toFixed(2):tables[tablesIndex].strength)+
                            '</span>'+
                            '</li>'+
                            '<li class="odd">'+
                            '<span style="float:left;">'+
                            GetText('Age')+
                            '</span>'+
                            '<span style="color:white;font-weight:bold;">'+
                            tables[tablesIndex].age+
                            '</span>'+
                            '</li>'+
                            '</ul>'+
                            '<ul style="margin:0;">';

                        for(let j = 0 ; j < 14 ; j++){
                            var span='<span',
                                prevValOfSkill = tables[0].skills[j],
                                valueOfSkill = prevValOfSkill,
                                changedValue = '';
                            if(tablesIndex!=0 && tables[tablesIndex].skills[j]){
                                valueOfSkill = tables[tablesIndex].skills[j];
                                if(valueOfSkill!=prevValOfSkill){
                                    span+= ' style="color:#ff0808"';
                                    changedValue=
                                        '<span class="changed-property" style="color:#3db3d5e6">'+
                                        '(+'+(valueOfSkill-prevValOfSkill).toFixed(2)+')'+
                                        '</span>';
                                }
                            }
                            if(valueOfSkill>=990) span+=' class="maximum"';
                            span+='>'+valueOfSkill+changedValue+'</span>';

                            let skillId = skillsId[j];
                            code +=
                                '<li class="odd">'+
                                '<strong>'+
                                '<span class="icon '+skillId+'" tooltip="tt_'+skillId+'"></span>'+
                                '</strong>'+
                                span+
                                '</li>';
                        }
                        code += '</ul>';

                        if(tablesIndex>0){
                            code +=
                                '<ul style="margin:4px auto 2px auto">'+
                                '<li class="odd" style="float:none;margin:auto;margin-bottom:1px;">'+
                                '<span style="float:left;">'+
                                GetText('Training')+
                                '</span>'+
                                '<span style="color:white;font-weight:bold;">'+
                                tables[tablesIndex].numberOfTraining+
                                '</span>'+
                                '</li>'+
                                '</ul>';
                        }
                        code +='</div>';
                    }
                    code += '</div>';
                    $('#chooseRange').parent().parent().append(code);
                }
            };
        }
    });
},'CalculateFutureStrength');
Tool.features.add('CalculatingStrengthOfYoungPlayer','squad',function(){
    if(!(Array.isArray(Tool.ageDates) && Tool.ageDates.length>0)) return false;

    let tables = [
        ["#players-table-overview","#players-table-agreements","#players-table-skills"],
        ["#players-table-overview-club","#players-table-agreements-club","#players-table-skills-club"]
    ],  featureElements = [];

    for(let i = 0 ; i < tables.length ; i++){
        let first_table = $(tables[i][0]);
        if(!first_table.find('.open-card').length) continue;
        $('>tbody>tr',first_table).each(function(rowIndex){ //eslint-disable-line no-loop-func
            let row = $(this);
            if(!IsYoungPlayer(row.find('td:nth-child(12)'))) return true;
            let startDate = Game.getTime(),
                position = row.find('td:nth-child(3)').text().trim(),
                currentAge = parseInt(row.find('td:nth-child(5)').text()),
                skills = [];
            $(tables[i][2]+' > tbody > tr:nth-child('+(rowIndex+1)+')').find('.skill-column').each(function(){
                skills.push(parseFloat($(this).text()));
            });
            let finishDate = row.find('td:nth-child(11)').text().trim().match(/(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/g);
            if(!finishDate.length) return true;
            finishDate = finishDate[0].split('.');
            finishDate = new Date(finishDate[2],parseInt(finishDate[1])-1,parseInt(finishDate[0])+1).getTime();

            let result = CalculateFutureStrength(startDate, finishDate, skills, position, true);

            if(!isNaN(result.current_strength)) result.current_strength = result.current_strength.toFixed(2);
            if(!isNaN(result.future.normal.strength)) result.future.normal.strength = result.future.normal.strength.toFixed(2);
            if(!isNaN(result.future.premium.strength)) result.future.premium.strength = result.future.premium.strength.toFixed(2);

            let nextAge = currentAge,
                dates = [],
                remainingDay = '-',
                start = !1,
                ageDates = Tool.ageDates;
            for(let p = 0 ; p < ageDates.length ; p++){
                let date = ageDates[p]*60000;
                if(start){
                    if(date <= finishDate){
                        dates.push({
                            s : 'color:white;',
                            v : GetDateText(date)
                        });
                        nextAge++;
                    }
                    else{
                        dates.push({
                            s : 'color:aqua; border-top:1px solid white; padding-top:1px; margin-top:1px; display:block;',
                            v : GetDateText(date)
                        });
                        remainingDay = ((date-finishDate)/86400000).toFixed(1);
                        break;
                    }
                    continue;
                }
                if(startDate<date){
                    start = !0;
                    p--;
                }
            }

            let title =
                GetText('EndYouth', {tag:0, args:[
                    ((finishDate-startDate)/86400000).toFixed(1),
                    Pad2(new Date(finishDate).getDate())+'.'+
                    Pad2(new Date(finishDate).getMonth()+1)+'.'+
                    new Date(finishDate).getFullYear()
                ]})+';\n'+
                GetText('Age', {tag:0})+' : '+nextAge+'\n'+
                'Ø : '+result.future.normal.strength+' - ' + result.future.premium.strength+'\n'+
                GetText('YoungTrainerLevelS', {tag:0})+' : '+Tool.yTrainerLevel+' '+GetText('SortLevel', {tag:0})+'\n'+
                GetText('RemainingNumberOfNormalTraining', {tag:0})+' : ' + result.future.normal.trainings+'\n'+
                GetText('RemainingNumberOfCreditTraining', {tag:0})+' : ' + (result.future.premium.trainings-result.future.normal.trainings)+'\n'+
                GetText('RemainingNextAgeDay', {tag:0, args:[remainingDay]});

            let selector = "";
            for(let tablesIndex = 0 ; tablesIndex < 2 ; tablesIndex++){
                MouseEnterLeaveEvent(
                    $(selector = tables[i][tablesIndex]+' > tbody > tr:nth-child('+(rowIndex+1)+') > td:nth-child(4)'), // Strength column
                    $(tables[i][tablesIndex]+' > tbody > tr:nth-child('+(rowIndex+1)+') > td:nth-child(5)'), // Age column
                    result.future.normal.strength,
                    nextAge,
                    result.future.premium.strength,
                    result.current_strength,
                    currentAge,
                    row.find('.open-card').attr('pid').split('-')[1],
                    row.find('> td.name-column > span.player-name').text().trim(),
                    dates
                );
                featureElements.push(selector);
                featureElements.push(tables[i][tablesIndex]+' > tbody > tr:nth-child('+(rowIndex+1)+') > td:nth-child(5)');
                $(selector = tables[i][tablesIndex]+' > tbody > tr:nth-child('+(rowIndex+1)+') > td:nth-child('+[11,8][tablesIndex]+')').attr('title',title);
                featureElements.push(selector);
            }

            //$('#players-table-agreements > tbody > tr:nth-child('+(i+1)+') > td:nth-child(8)')[0].title = title;
            if(i==0){
                let u = this.getElementsByClassName('open-card')[0];
                let TrainingSkills = Tool.trainingPlan[position]; // [9,6,3,7,8,10,5]
                if(!Array.isArray(TrainingSkills)) return true;
                for(let tablesIndex = 0 ; tablesIndex < tables[i].length ; tablesIndex++)
                    ClickOpenCard(
                        $(tables[i][tablesIndex]+' > tbody > tr:nth-child('+(rowIndex+1)+') .open-card'),
                        TrainingSkills
                    );
            }
        });
    }
    if(featureElements.length==0) return false;
    this.hover_selector = featureElements.join(',');
    tables = featureElements= undefined;

    function MouseEnterLeaveEvent(strengthColumn, ageColumn, newStrength, nextAge, premiumNewStrength, currentStrength, currentAge, playerId, playerName, dates){
        let strengthColHtml=strengthColumn.html(),
            ageColHtml=ageColumn.html();

        if(!toolTipObj.data['youngPlayerStrengthInfo_'+playerId]){
            let tr =
                [
                    [GetText('Strength'), strengthColumn.attr('sortvalue')],
                    [GetText('RealStrength'), currentStrength],
                    [GetText('YoungTrainerLevelS'), Tool.yTrainerLevel+' '+GetText('SortLevel')],
                    [GetText('NonCreditTraining'), newStrength + ' (' + (newStrength-currentStrength>0?'+':'') + (newStrength-currentStrength).toFixed(2)+')'],
                    [GetText('CreditTraining'), premiumNewStrength + ' (' + (premiumNewStrength-currentStrength>0?'+':'') + (premiumNewStrength-currentStrength).toFixed(2)+')']
                ],
                html =
                `<h3 style="text-align:center; margin-bottom:2px;">`+
                `   <label style="border-bottom:1px solid white;padding:0 2px;">${playerName}</label>`+
                `</h3>`+
                `<table>`+
                `   <tbody>`;
            playerName = currentStrength = undefined;
            for(let i = 0 ; i < tr.length ; i++){
                html +=
                    `<tr style="line-height:20px; height:20px;">`+
                    `   <td style="border-bottom:none; text-align:left;">`+
                    `      ${tr[i][0]}`+
                    `      <span style="float:right; margin:0 2px;">:</span>`+
                    `   </td>`+
                    `   <td style="border-bottom:none; text-align:left;">`+
                    `      ${tr[i][1]}`+
                    `   </td>`+
                    `</tr>`;
            }
            html += `</tbody></html>`;
            toolTipObj.data['youngPlayerStrengthInfo_'+playerId] = html;

            html =
                `<h3 style="text-align:center; margin-bottom:2px;">`+
                `   <label style="border-bottom:1px solid white; padding:0 2px;">`+
                `      Age : ${currentAge} => ${nextAge} (${(nextAge-currentAge>0?'+':'')+(nextAge-currentAge)})`+
                `   </label>`+
                `</h3>`;
            let temp = currentAge;
            for(let i = 0 ; i < dates.length ; i++,temp++)
                html+=`<label style="${dates[i].s}">${temp}=>${temp+1} | ${dates[i].v+(i+1<dates.length?`</label><br>`:'')}`;
            dates = currentAge = undefined;
            toolTipObj.data['youngPlayerAgeInfo_'+playerId] = html;
        }
        strengthColumn.attr('tooltip','youngPlayerStrengthInfo_'+playerId);
        ageColumn.attr('tooltip','youngPlayerAgeInfo_'+playerId);
        strengthColumn.attr('title','');
        playerId = undefined;

        strengthColumn.add(ageColumn).mouseenter(function(){
            strengthColumn.html(`<label style="color:#00e7ff;">${newStrength} / ${premiumNewStrength}</label>`);
            ageColumn.html(`<label style="color:#00e7ff;">${nextAge}</label>`);
        });

        strengthColumn.add(ageColumn).mouseleave(function(){
            $(toolTipObj.toolTipLayer).hide();
            strengthColumn.html(strengthColHtml);
            ageColumn.html(ageColHtml);
        });
    }
    function ClickOpenCard(openCard,TrainingSkills){
        if(!openCard.length) return;
        openCard.click(function(){
            let openCard = $(this);
            openCard.off();
            let rowIndex = openCard.parents('tr').index()+1;
            $('#players-table-overview > tbody > tr:nth-child('+rowIndex+') .open-card').off();
            $('#players-table-agreements > tbody > tr:nth-child('+rowIndex+') .open-card').off();
            $('#players-table-skills > tbody > tr:nth-child('+rowIndex+') .open-card').off();
            rowIndex = undefined;

            let playerId = openCard.attr('pid').split('-')[1];
            if($('#info-player-'+playerId).length) return;

            let max = 300;
            Tool.intervals.create(function(){
                if(!openCard.hasClass('loading')){
                    this.delete();

                    let infoDiv = $('#info-player-'+playerId),
                        lis = infoDiv.find('div.data.skills > ul:first > li'),
                        romanNumerals = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV"];
                    for(let p = 0 ; p < 3 ; p++){
                        lis[TrainingSkills[p]].style.backgroundColor = '#00585d';
                        $(lis[TrainingSkills[p]]).append(
                            '<label style="float:left;">'+
                            romanNumerals[p]+
                            '</label>'
                        );
                    }

                    infoDiv.find('.skill:not(.maximum)').each(function(){
                        let skillValue = parseFloat(this.textContent);
                        $(this).mouseenter(function(){
                            let result = GetMaxSkill(skillValue,parseInt(Tool.yTrainerLevel)+0.5),
                                args = [result.required_trainings];
                            if(result.required_trainings>0){
                                $(this).css({
                                    'color':'#5eff0c',
                                    'font-weight':'bold'
                                }).attr({
                                    'title': GetText('AfterTrainings', {tag:0, args:args}),
                                    'tool_tt': `AfterTrainings_${encodeURIComponent(JSON.stringify(args))}`
                                }).text(result.max_value);
                            }
                        }).mouseleave(function(){
                            $(this).css({
                                'color':'',
                                'font-weight':''
                            }).removeAttr('title').text(skillValue);
                        });
                    });
                    return false;
                }
                if(--max<1) this.delete();
            },50,'OpenCard_'+playerId);
        });
        openCard = undefined;
    }
},null);
Tool.features.add('YoungPlayersHistory','squad',function(){
    let YoungPlayers = Tool.getVal('YoungPlayers', {MessageBox:{},show:[]}); //Structure: http://prntscr.com/ucg9s3
    if(!Array.isArray(YoungPlayers.show)) YoungPlayers.show = [];

    let players = YoungPlayers.show;
    if(players.length == 0) return false;

    players.sort(function(a,b){
        a = (a.date || a.date_).split('.');
        b = (b.date || b.date_).split('.');
        return new Date(b[2],b[1]-1,b[0]).getTime() - new Date(a[2],a[1]-1,a[0]).getTime();
    });
    let max = 10, //maximum number of players shown on a page
        sayfaSayısı = Math.ceil(players.length/max),
        acıkSayfa = 1;
    $('#squad > div.squad.personal').append(
        `<hr>`+
        `<div id="container-youngs-history" class="table-container">`+
        `   <h3>${GetText('TitleOfYoungPlayersTable')}</h3>`+
        `   <table id="players-table-youngs-history" class="sortable-table sortable">`+
        `      <thead>`+
        `         <tr>`+
        `            <th class="name-column sortcol">${GetText('Name')}</th>`+
        `            <th class="position-column sortcol">${GetText('Position')}</th>`+
        `            <th class="strength-column sortcol" tooltip="tt_strength">Ø</th>`+
        `            <th class="age-column sortcol">${GetText('Age')}</th>`+
        `            <th class="sortcol">${GetText('Date')}</th>`+
        `         </tr>`+
        `      </thead>`+
        `      <tbody></tbody>`+
        `   </table>`+
        `</div>`
    );
    AddTableRows(players);
    if(sayfaSayısı>1) CreateMenu(false,players.length);
    players = undefined;

    function AddTableRows(players){
        for(let i = 0, k = (acıkSayfa-1)*max, player; i < max && i+k < players.length ; i++){
            player = players[i+k];
            $('#players-table-youngs-history>tbody').append(
                `<tr class="${i%2?"even":"odd"}">`+
                `   <td class="name-column">`+
                `      <span pid="player-${player.id}" class="icon details open-card"></span>`+
                `      <span class="player-name">${player.name}</span>`+
                `   </td>`+
                `   <td>${player.position}</td>`+
                `   <td sortvalue="${player.strength}">${player.strength}</td>`+
                `   <td>${player.age}</td>`+
                `   <td${player.hasOwnProperty('date_')?` title="${GetText('mayNotTrue', {tag:0})}" tool_tt="mayNotTrue" style="font-style:italic;"`:''}>${player.date||player.date_}</td>`+
                `</tr>`
            );
        }
    }
    function CreatePageLabel(sayfa){
        return `<label class="page" style="color:white; cursor:pointer; text-decoration:underline;">${sayfa}</label> | `;
    }
    function CreateMenu(c,playersLength){
        let text = '<div class="pager">';
        if(acıkSayfa>=15){
            for(let i = 1 ; i <=3 ; i++) text+=CreatePageLabel(i);
            text+='... | ';
            for(let i = acıkSayfa-10 ; i < acıkSayfa ; i++) text+=CreatePageLabel(i);
        }
        else{
            for(let i = 1 ; i < acıkSayfa ; i++) text+=CreatePageLabel(i);
        }
        text+='<strong>'+acıkSayfa+'</strong>'+(acıkSayfa!=sayfaSayısı?' | ':'');
        if(acıkSayfa<=sayfaSayısı-14){
            for(let i = acıkSayfa+1 ; i<=acıkSayfa+10; i++) text+=CreatePageLabel(i);
            text+='... | ';
            for(let i = sayfaSayısı-2 ; i < sayfaSayısı ; i++) text+=CreatePageLabel(i);
        }
        else{
            for(let i = acıkSayfa+1 ; i < sayfaSayısı ; i++) text+=CreatePageLabel(i);
        }
        if(acıkSayfa!==sayfaSayısı) text+=`<label class="page" style="color:white; cursor:pointer; text-decoration:underline;">${sayfaSayısı}</label>`;
        text+=' '+GetText('total')+' : '+playersLength+'</div>';
        let e = $('#players-table-youngs-history');
        if(c){
            e.prev().remove();
            e.next().remove();
        }
        e.before(text);
        e.after(text);
        $('#container-youngs-history').find('.page').click(function(){
            acıkSayfa = parseInt($(this).text());
            let players = Tool.getVal('YoungPlayers',{MessageBox:{},show:[]}).show; //Structure: http://prntscr.com/ucg9s3
            $('#players-table-youngs-history>tbody').html('');
            AddTableRows(players);
            CreateMenu(true,players.length);
        });
    }
},'#players-table-youngs-history',[
    [
        'main',
        function(){
            //Yeni gelen genç oyuncuların geliş tarihlerini bulma
            if(typeof Tool.news.youngPlayer=='object'){ //{"title":'Jugendspieler',"beforeName":"diesen ","afterName":" mal"}
                let yData=Tool.news.youngPlayer;
                GetMessagesByTitle(yData.title,(messages)=>{
                    let YoungPlayers = Tool.getVal('YoungPlayers',{MessageBox:{}, show:[]}); //Structure: http://prntscr.com/ucg9s3
                    if(typeof YoungPlayers.MessageBox != 'object') YoungPlayers.MessageBox = {};
                    if(!Array.isArray(YoungPlayers.show)) YoungPlayers.show = [];

                    let MessageBox = YoungPlayers.MessageBox,
                        show = YoungPlayers.show,
                        html,start,end,playerName,date,newPlayer=0;

                    messages.forEach(message=>{ //message=> element : $('#newscenter-preview-'+id)
                        html = message.html().trim();
                        start = html.indexOf(yData.beforeName)+yData.beforeName.length;
                        end = html.indexOf(yData.afterName,start);
                        playerName = html.substring(start,end);
                        date = message.parents('tr').first().find('.last-column').text().trim();
                        message.html(html.substring(0,start)+`<font style="cursor:default;" title="${yData.title}" color="#89f4ff">${playerName}</font>`+html.substring(end));
                        playerName=playerName.trim();
                        if(!MessageBox.hasOwnProperty(playerName) && //MessageBox'a kayıtlı olmamış olacak
                           undefined==show.find(p=>{return p.name==playerName && p.date==date;})){ //show'a aynı isim ve tarihte kaydedilmiş genç futbolcu olmayacak
                            MessageBox[playerName] = date; //Yeni gelen gencin hangi tarihte geldiğinin kaydı alınıyor
                            newPlayer++;
                        }
                    });
                    if(newPlayer) Tool.setVal('YoungPlayers',YoungPlayers);
                });
            }
        }
    ],
    [
        'squad',
        function(){
            if($('#players-table-overview-club > tbody').find('.open-card').length){
                let YoungPlayers = Tool.getVal('YoungPlayers',{MessageBox:{}, show:[]}); //Structure: http://prntscr.com/ucg9s3
                if(typeof YoungPlayers.MessageBox != 'object') YoungPlayers.MessageBox = {};
                if(!Array.isArray(YoungPlayers.show)) YoungPlayers.show = [];

                let MessageBox = YoungPlayers.MessageBox,
                    show = YoungPlayers.show,
                    update = 0;

                let strength;
                $('#players-table-overview-club > tbody > tr').each(function(){
                    strength=parseInt($('td:nth-child(4)',this).attr('sortvalue'));
                    if(IsYoungPlayer($('>td:nth-child(12)',this)) && 90>strength){ // limited by strength: https://forum.fussballcup.de/showthread.php?t=417372&page=22#post7485413
                        let playerId = $('.open-card',this).attr('pid').split('-')[1],
                            playerName = $('.player-name',this).text().trim(), //Format: lastNames, firstNames
                            found = !1;
                        for(let i = 0 ; i < show.length ; i++){
                            if(playerId == show[i].id){
                                found = !0;
                                if(show[i].hasOwnProperty('date_') && MessageBox.hasOwnProperty(playerName)){
                                    show[i].date = MessageBox[playerName];
                                    delete MessageBox[playerName];
                                    delete show[i].date_;
                                    ++update;
                                }
                                break;
                            }
                        }
                        if(!found){
                            let data = {
                                id       : playerId,
                                name     : playerName,
                                position : $('td:nth-child(3)',this).text().trim(),
                                strength : strength,
                                age      : parseInt($('td:nth-child(5)',this).text()),
                            };
                            if(MessageBox.hasOwnProperty(playerName)){
                                data.date = MessageBox[playerName];
                                delete MessageBox[playerName];
                            }
                            else{
                                let gameTime = new Date(Game.getTime());
                                data.date_ = Pad2(gameTime.getDate())+'.'+Pad2(gameTime.getMonth()+1)+'.'+gameTime.getFullYear();
                            }
                            show.splice(0,0,data); //Add to the top
                            ++update;
                        }
                    }
                });
                if(update) Tool.setVal('YoungPlayers',YoungPlayers);
            }
        }
    ]
]);
Tool.features.add('TrainingGroups','training',function(){
    if(Tool.getVal("TrainingGroups")==undefined) return false;
    let data = Tool.getVal("TrainingGroups");
    $('#training > div.schedule > div.table-container > table > tbody > tr').each(function(i){
        if($('th',this).length){
            var grupId = i/4 + 1;
            var th = $('th',this)[1];
            th.style.textAlign = 'left';
            th.style.fontSize = '11px';
            toolTipObj.data.showPlayersInGroups = GetText('NoInformation')+'!';
            if(data[grupId]!==undefined){
                var oyuncuSayısı = data[grupId].length;
                if(oyuncuSayısı!==0){
                    th.innerHTML = GetText('TrainingGroupInformation', {args:[`<strong grupId="${grupId}" style="color:green; font-size:12px; cursor:default;" tooltip="showPlayersInGroups">${oyuncuSayısı}</strong>`]});
                    $('strong',th).mouseenter(function(){
                        var d = Tool.getVal("TrainingGroups")[$(this).attr('grupId')];
                        var text = '';
                        for(var i = 0 ; i < d.length ; i++){
                            text+=`[${d[i].position}] ${d[i].name}<br>`;
                        }
                        text = text.substring(0,text.length-4);
                        toolTipObj.data.showPlayersInGroups = text;
                    });
                }
                else th.innerHTML = GetText('NoPlayersInTheGroup');
            }
            else th.innerHTML = GetText('NoRecord');
        }
    });
},null,[
    'training->groups',
    function(){
        let data = {},
            groupLength = $('#players-table-skills > tbody').find('.select-box-container:first >select >option').length;
        for(let i=1 ; i<=groupLength ; i++) data[i] = [];

        $('#players-table-skills > tbody > tr').each(function(){
            data[$('.select-box-container:first >select',this).val()].push({
                name    : $('.player-name',this).text().trim(),
                position: $('td:nth-child(3)',this).text().trim()
            });
        });
        Tool.setVal('TrainingGroups',data);
    }
]);
Tool.features.add('CampHistory','camp',function(){
    let imagesPos = [-641,-962,-214,-534,-748,-321,0,-107,-427,-854],
        data = Tool.getVal('CampHistory',[]);

    $('<div id="allCamps">').html(
        imagesPos.reduce((acc,i,idx)=>acc+`<div class="camp-${idx+1}"><div id="camps_${idx+1}" class="image" style="margin-right:4px; float: left; opacity: 0.2;"></div></div>`,'')
    ).appendTo('#camp');

    if(data.length){/*Show*/
        //Tablo oluşturuluyor.
        function dateFormat(a){
            let b = a.split('.');
            b = new Date(b[2],parseInt(b[1])-1,parseInt(b[0])+3);
            return a+' - ' + Pad2(b.getDate())+'.'+Pad2(b.getMonth()+1)+'.'+b.getFullYear();
        }

        let text =
            `<table id="lastCamps">`+
            `   <thead>`+
            `      <tr style="background:url();">`+
            `         <th colspan="7">${GetText('PreviouslyVisitedCamps')}</th>`+
            `      </tr>`+
            `      <tr>`+
            `         <th style="text-align:left;">${GetText('No')}</th>`+
            `         <th style="text-align:left;">${GetText('Camp')}</th>`+
            `         <th style="text-align:left;">${GetText('Country')}</th>`+
            `         <th style="text-align:left;">${GetText('Price')}</th>`+
            `         <th style="text-align:left;">${GetText('_Skills')}</th>`+
            `         <th style="text-align:left;">${GetText('Definition')}</th>`+
            `         <th style="text-align:left;">${GetText('Date')}</th>`+
            `      </tr>`+
            `   </thead>`+
            `   <tbody>`;

        for(let i = 0 ; i < data.length ;i++){
            let camp = data[i];
            $('#camps_'+camp.campNo).css('opacity',1)
            text+=
                `<tr>`+
                `   <td style="color:white;font-weight: bold;text-align:center;">${i+1}</td>`+
                `   <td width="160" style="text-align:left;">`+
                `      <h3 style="margin:0;">${camp.campName}</h3>`+
                `      <div class="image" style="display:none;margin: 1px auto 3px; background-position: 0 ${imagesPos[camp.campNo-1]}px;"></div>`+
                `   </td>`+
                `   <td width="100" style="text-align:left;">`+
                `      <img class="flag" name="__tooltip" tooltip="tt_${camp.country.img}" src="/static/images/countries/${camp.country.img}.gif" alt=""> ${camp.country.name}`+
                `   </td>`+
                `   <td width="80" style="text-align:left;">${camp.price}`+
                `      <span class="icon currency"></span>`+
                `   </td>`+
                `   <td style="text-align:left;">`;
            camp.skills.forEach(skill=>{ //eslint-disable-line no-loop-func
                text+=`<span style="margin-right:3px;" class="icon ${skill}" name="__tooltip" tooltip="tt_${skill}"></span>`;
            });
            text+=
                `   </td>`+
                `   <td style="white-space: pre-wrap;font-Size:10px;line-height: 1.5;text-align:left;">${camp.description}</td>`+
                `   <td>`+
                `      <img src="${Tool.sources.getLink('https://www.pinclipart.com/picdir/big/561-5616345_transparent-time-clock-icon-png-5-minute-timer.png')}" alt="clock" height="15px" style="margin:0 2px 1px 0;cursor:help;text-align:left;" title="${GetText('ServerDate', {tag:0})}" tool_tt="ServerDate">`+
                `      ${dateFormat(camp.date)}`+
                `   </td>`+
                `</tr>`;
        }
        text+=`</tbody><tfoot><tr></tr></tfoot></table>`;
        $('#allCamps').before(text);
        $('#lastCamps').find('.image').each(function(){
            let image = $(this);
            image.parent('td').mouseenter(function(){
                image.slideDown();
            }).mouseleave(function(){
                image.slideUp();
            });
        });
    }

    if(!$('#camp > div.list-container > ul > li.disabled').length && //Kamp ayarlama inaktif olmayacak.
       !$('#camp > div.list-container > ul > li > p.not-available').length //Kamplar kullanılmıyor olmayacak.
      ){/*Save*/
        //Kamplar açık ve gidilebiliyor!
        $('#camp > div.list-container > ul > li').each(function(){
            let parent = this,
                button = $('div.buttons > span > a',this);
            button.attr('href_',button.attr('href')).removeAttr('href').click(function(){
                $(this).off();
                let skills = $('ul > li',parent),
                    _skills = [];
                skills.each(function(){
                    _skills.push($('span',this).first().attr('class').replace('icon ',''));
                });
                let country = {name:'Berlin',img:'DEU'};
                country.name = $('p',parent).first().text().trim();
                var img = $('p > img',parent).first().attr('src');
                country.img = img.substring(img.lastIndexOf('/')+1,img.lastIndexOf('.'));
                //Yeni kampı en öne ekle!
                data.splice(0,0,{
                    campName   : $('h3',parent).first().text(),
                    campNo     : $(parent).attr('class').replace('camp-',''),
                    date       : $('span',this).first().text().trim().match(/(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/g)[0],
                    skills     : _skills,
                    price      : $('span.currency-number',parent).text().trim(),
                    country    : country,
                    description: $('p.description',parent).text().trim(),
                });
                Tool.setVal('CampHistory',data);
                location.href = $(this).attr('href_');
            });
        });
    }
},null);
Tool.features.add('TransferDates','transfermarket',async function(){
    let LeagueData = Tool.getVal('LeagueData'), save = true;
    if(typeof LeagueData=='object' && (LeagueData.lastMatchDate+86400000)>Game.getTime()) save = false;

    if(save){
        let content = await Game.getPage('?w='+worldId+'&area=user&module=statistics&action=games','#content');
        LeagueData = SaveLeagueData(content);
        if(LeagueData==false) return false;
    }

    let aDay = 24*60*60*1000,
        timeToMs = (t)=> ((t.h*60+t.m)*60+t.s)*1000,
        fComingTime = timeToMs({h:6, m:0, s:0}),
        tmChangingTime = timeToMs({h:0, m:0, s:0}),
        firstMatchDate = LeagueData.firstMatchDate,
        firstHalfFinalMatchDate= LeagueData.firstHalfFinalMatchDate,
        lastMatchDate= LeagueData.lastMatchDate,
        now = Game.getTime(),
        footballerComing = null,
        tmDateChanging = null;

    if((firstMatchDate-1*aDay+fComingTime)>now)/*Alınan Oyuncu Bir Sonraki Gün Gelecek*/
        footballerComing = new Date(new Date(now).getFullYear(),new Date(now).getMonth(),new Date(now).getDate()+1).getTime()+fComingTime;
    else if((firstHalfFinalMatchDate+fComingTime)>now)/*Alınan Oyuncular Lig Arasında Gelecek*/
        footballerComing = firstHalfFinalMatchDate+aDay+fComingTime;
    else footballerComing = lastMatchDate+aDay+fComingTime; /*Alınan Oyuncu Lig Sonunda Gelecek*/

    if((firstMatchDate-1*aDay+tmChangingTime)>now)/*Transfer Tarihinin Değişeceği Tarih*/
        tmDateChanging = firstMatchDate-1*aDay+tmChangingTime;
    else if((firstHalfFinalMatchDate+tmChangingTime)>now)/*Transfer Tarihinin Değişeceği Tarih*/
        tmDateChanging = firstHalfFinalMatchDate+tmChangingTime;

    let header = $('#content > h2:first'),
        h_content = header.html() +
        GetText('FootballersAreComing')+' : '+
        `<label class="cntDwnTrnsfMrkt" style="color:#17fc17;" intervalName="footballerComing" title="${GetDateText(footballerComing)}" finish="${footballerComing}"></label>`;
    if(tmDateChanging!=null){
        h_content+='             '+
            GetText('TransferDateWillChange')+' : '+
            `<label class="cntDwnTrnsfMrkt" style="color:orange;" intervalName="tmDateChanging" title="${GetDateText(tmDateChanging)}" finish="${tmDateChanging}"></label>`;
    }
    header.html(h_content);
    $('.cntDwnTrnsfMrkt').each(function(){
        let t = $(this);
        t.removeClass('cntDwnTrnsfMrkt');
        Tool.intervals.create(function(){
            let sec = parseInt((parseInt(t.attr('finish'))-Game.getTime())/1000);
            if(sec<1){
                this.delete();
                t.html(GetText('ItIsOver'));
                return;
            }
            t.html(SecToTime(sec));
        },1000,t.attr('intervalName'));
        t.removeAttr('intervalName');
    });
},null,[
    'fixture',
    function(){
        if($('#content').find('.date-selector').length){
            let LeagueData = Tool.getVal('LeagueData'), save = true;
            if(typeof LeagueData=='object' && (LeagueData.lastMatchDate+86400000)>Game.getTime()) save = false;
            if(save) SaveLeagueData($('#content'));
        }
    }
]);
Tool.features.add('GoOffer','transfermarket',function(){
    let data = Tool.getVal('increaseBid');//{playerName:'Criyessei',process:1}
    if(typeof data != 'object') return false;
    let playerName = data.playerName,
        process = data.process,
        find_player = !1;
    if(process==1){
        //Teklif tablonuzda oyuncu varsa devam edecek.
        if($('#own-offers > tbody').find('.open-card').length){
            $('#own-offers > tbody > tr').each(function(){
                if(playerName == $(this).find('.name-column').first().text().trim()){
                    find_player = !0;
                    let clubName = $(this).find('td.name-column').last().attr('sortvalue');
                    if($('#club').val()==clubName){
                        find_player = !1;
                        process_2();
                    }
                    else{
                        $('#age_min').val(16);
                        $('#age_max').val(34);
                        $('#searchform > ul > li.strength > span:nth-child(2) > input[type="text"]').val(0);
                        $('#searchform > ul > li.strength > span:nth-child(3) > input[type="text"]').val(999);
                        $('#positions').val(0);
                        $('#club').val(clubName);
                        Tool.setVal('increaseBid', {playerName:playerName,process:2});
                        $('#searchform > ul > li.transfermarket-search-button > span > a > span').click();
                    }
                    return false;
                }
            });
        }
    }
    else process_2();
    function process_2(){
        if($('#content > div.container.transfermarket > div.table-container > table > tbody').find('.open-card').length){
            $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(){
                if(playerName == $(this).find('.name-column').first().text().trim()){
                    find_player = !0;
                    let tr = this,
                        pageHeight = $(window).height();
                    $('html, body').animate({ scrollTop: GetOffset(tr).top-pageHeight/2 }, 'fast');
                    setTimeout(function(){
                        tr.style = 'background-color:#fff2ac; background-image:linear-gradient(to right, #ffe359 0%, #fff2ac 100%);';
                        setTimeout(function(){
                            tr.style='';
                        },2000);
                    },200);
                    Tool.delVal('increaseBid');
                    return false;
                }
            });
        }
    }
    if(!find_player){
        Game.giveNotification(false, GetText('bidIncreasedPlayerNotFound'));
        Tool.delVal('increaseBid');
    }
},null,[
    'main',
    function(){
        //Futbolcuya verilen teklif geçilirse kolay bir şekilde bu futbolcuyu transfer pazarında görüntüleyebileceğiz.
        if(typeof Tool.news.increaseBid=='object'){// {"title":"Transfermarkt","control":"überboten","beforeName":"für ","afterName":" wurde"}
            let iData = Tool.news.increaseBid;
            GetMessagesByTitle(iData.title,(messages)=>{
                let text,message,messageP=[];
                for(let i=0; i<messages.length; i++){
                    message = messages[i]; // $ element
                    text = message.text().trim();
                    if(text.indexOf(iData.control)!=-1)
                        messageP.push(message.parent());
                }
                for(let i = 0 ; i < messageP.length ; i++){
                    messageP[i].click(function(){ // eslint-disable-line no-loop-func
                        let messageId = this.id.split('-')[2],
                            intName = 'OpenMessage_'+messageId,
                            k,max=50;
                        Tool.intervals.create(function(){
                            k = $('#readmessage-home');
                            if(k.length){
                                let a = $('<div>'+k.html()+'</div>');
                                a.find('a').remove();
                                let playerName = a.text().trim(),
                                    start = playerName.indexOf(iData.beforeName)+iData.beforeName.length,
                                    end = playerName.indexOf(iData.afterName,start);
                                playerName = playerName.substring(start,end).trim();
                                k.html(k.html().replace(playerName, `<font style="cursor:default;" color="#89f4ff">${playerName}</font>`));
                                k.find('a:last').click(function(){
                                    Tool.setVal('increaseBid',{playerName:playerName,process:1});
                                });
                                this.delete();
                            }
                            else{
                                if(!--max) this.delete();
                            }
                        },50,intName);
                    }); // eslint-disable-line no-loop-func
                }
            });
        }
    }
]);
Tool.features.add('ShowBoughtPlayers','transfermarket',function(){
    //Sattığımız oyunculara gelen teklifleri kabul edersek veya reddedersek PlayersData.AcceptedOffers güncellenmeli
    let updated=0,
        data = Tool.getVal('PlayersData',{}); //Structure: http://prntscr.com/uc2p4v
    if(typeof data.AcceptedOffers != 'object') data.AcceptedOffers = {};
    let AcceptedOffers = data.AcceptedOffers;

    $('#foreigner-offers > tbody > tr').each(function(){ //Sattığımız oyunculara gelen teklifleri kontrol et
        let accept_button = $(this).find('a.button[href*="do=accept"]');
        if(accept_button.length){ //accept the bid
            accept_button.attr('_href', $(this).find('.button:first > a')[0].href)
                .removeAttr('href')
                .css('cursor','pointer')
                .click(function(){
                $(this).off();
                let data = Tool.getVal('PlayersData',{});
                if(typeof data.AcceptedOffers != 'object') data.AcceptedOffers = {};
                let AcceptedOffers = data.AcceptedOffers,
                    tr = $(this).parents('tr').first(),
                    playerId = tr.find('.open-card').attr('pid').split('-')[1],
                    a_club = $(`>td.name-column >a[clubid]:not([clubid="${Tool.clubId}"])`,tr).first(),
                    clubId = a_club.attr('clubid');

                if(!AcceptedOffers.hasOwnProperty(playerId)){
                    AcceptedOffers[playerId] = {
                        playerName: tr.find('.player-name').text().trim(),
                        offers:{} //Accepted offers
                    };
                }
                AcceptedOffers[playerId].offers[clubId] = {
                    clubName: a_club.text().trim(),
                    price   : tr.find('.currency-container').last().parent().attr('sortvalue').split('.').join(''),
                    date    : GetDateText(Game.getTime())
                };
                Tool.setVal('PlayersData',data);
                $(this).attr('href',$(this).attr('_href')).click();
            });
        }
        else if($(this).find('>td.last-column a[href*="do=dismissOfferAcceptance"]').length){
            //Oyuncuya gelen teklif daha önceden kabul edilmiş. Eğer verilerde kayıtlı değilse kaydedilecek.
            let a_club = $(`>td.name-column >a[clubid]:not([clubid="${Tool.clubId}"])`,this).first(),
                clubId = a_club.attr('clubid'),
                playerId = $(this).find('.open-card').attr('pid').split('-')[1];

            if(AcceptedOffers.hasOwnProperty(playerId)){
                if(AcceptedOffers[playerId].offers.hasOwnProperty(clubId)) return; //continue
            }
            else{
                AcceptedOffers[playerId] = {
                    playerName: $(this).find('.player-name').text().trim(),
                    offers:{}
                };
            }
            AcceptedOffers[playerId].offers[clubId] = {
                clubName : a_club.text().trim(),
                price    : $(this).find('.currency-container').last().parent().attr('sortvalue').split('.').join(''),
                date     : '-'
            };
            ++updated;
        }
    });

    //Teklifi iptal etmek için butona basıyoruz
    if(Game.link.pr.do=="dismissOfferAcceptance" && ['playerid','clubid'].every(k=>Game.link.pr.hasOwnProperty(k))){
        let playerId = Game.link.pr.playerid,
            clubId = Game.link.pr.clubid,
            offerStillExist = undefined != $('#foreigner-offers > tbody > tr .open-card').toArray().find(e=>{
                return $(e).attr('pid').split('-')[1] == playerId && $(e).parents('tr').first().find('td.name-column:last > a').attr('clubid') == clubId;
            });
        if(!offerStillExist){ //Teklif silindi
            if(AcceptedOffers.hasOwnProperty(playerId)){
                let playerData = AcceptedOffers[playerId];
                if(playerData.offers.hasOwnProperty(clubId)){
                    delete playerData.offers[clubId];
                    if($.isEmptyObject(playerData.offers)) delete AcceptedOffers[playerId];
                    ++updated;
                }
            }
        }
    }
    if(updated) Tool.setVal('PlayersData',data);


    //Satın aldığımız oyuncuların listelenmesi. PlayersData.BuyPlayers verisi kullanarak
    if(!Array.isArray(data.BuyPlayers)) data.BuyPlayers = [];
    start(data.BuyPlayers);

    function start(BoughtPlayers){
        if(!BoughtPlayers.length){
            UploadPlayersData();
            return;
        }

        $('#own-offers').after(
            `<h3>${GetText('ListofPurchasedFootballers')}</h3>`+
            `<table id="purchased-players" class="sortable-table sortable">`+
            `   <thead>`+
            `      <tr class="">`+
            `         <th class="nosort">${GetText('Country')}</th>`+
            `         <th class="name-column sortcol">${GetText('Name')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('SortPosition')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol" name="__tooltip" tooltip="tt_strength"> Ø <span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('Age')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('Salary')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('Price')}</th>`+
            `         <th class="nosort">${GetText('Contract')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('Club')}<span class="sort-status"></span> </th>`+
            `         <th class="sortcol">${GetText('Date')}<span class="sort-status"></span></th>`+
            `         <th class="sortcol">${GetText('Delete')}</th>`+
            `      </tr>`+
            `   </thead>`+
            `   <tbody></tbody>`+
            `   <tfoot>`+
            `      <tr class="even">`+
            `         <td class="last-column" colspan="9"></td>`+
            `      </tr>`+
            `   </tfoot>`+
            `</table>`
        );
        let h3=$('#purchased-players').prev();
        $(`<img style="float:right;cursor:pointer;margin-Right:5px;" src="${Tool.sources.getLink('https://www.clipartmax.com/png/full/52-527627_animated-down-arrow-arrow-down-gif-png.png')}" alt="download" width="20px" height="20px" title="${GetText('Download', {tag:0})}" tool_tt="Download">`)
            .appendTo(h3)
            .click(function(){ DownloadAsTextFile(JSON.stringify(BoughtPlayers,null,'\t'), "Bought Players Datas"); });

        $(`<img style="margin-Right:7px;float:right;cursor:pointer" src="${Tool.sources.getLink('https://www.clipartmax.com/png/full/301-3016667_red-cross-clipart-high-resolution-red-cross-emoji-gif.png')}" alt="remove2" width="15px" height="15px" title="${GetText('Delete', {tag:0})}" tool_tt="Delete">`)
            .appendTo(h3)
            .click(function(){
            if(confirm(GetText('Warning', {tag:0}))){
                let table = $('#purchased-players');
                table.prev().remove();
                table.remove();
                let data = Tool.getVal('PlayersData');
                delete data.BuyPlayers;
                Tool.setVal('PlayersData',data);
                UploadPlayersData();
            }
        });
        h3=undefined;

        let tbody = $('#purchased-players>tbody');
        BoughtPlayers.forEach((a,i)=>{
            tbody.append(
                `<tr class="${i%2?"even":"odd"}">`+
                `   <td>`+
                `      <img name="__tooltip" tooltip="tt_${a.playerCountry}" src="/static/images/countries/${a.playerCountry}.gif">`+
                `   </td>`+
                `   <td style="white-space:pre-wrap; line-height:1.5; width:25%; max-width:30%; text-align:left;">`+
                `      <span pid="player-${a.playerId}" class="icon details open-card"></span>`+
                `      <span class="player-name">${a.playerName}</span>`+
                `   </td>`+
                `   <td>${a.position}</td>`+
                `   <td>${a.strength}</td>`+
                `   <td>${a.age}</td>`+
                `   <td>${a.salary.toLocaleString()}<span class="icon currency"></span></td>`+
                `   <td>${a.price.toLocaleString()}<span class="icon currency"></span></td>`+
                `   <td>${a.season+' '+(a.season==1?GetText("Season"):GetText("Seasons"))}</td>`+
                `   <td style="text-align:left; white-space:pre-wrap; line-height:1.5; width:17%; max-width:20%;" sortvalue="${a.club.name}">`+
                `      <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${a.club.id}" clubid="${a.club.id}">${a.club.name}</a>`+
                `   </td>`+
                `   <td>${a.date}</td>`+
                `   <td class="last-column">`+
                `      <img class="DeletePurchasedPlayerData" playerid="${a.playerId}" src="${Tool.sources.getLink('https://www.clipartmax.com/png/full/301-3016667_red-cross-clipart-high-resolution-red-cross-emoji-gif.png')}" alt="remove3" heigth="15px" width="15px" style="cursor:pointer">`+
                `   </td>`+
                `</tr>`
            );
        });

        $('#purchased-players').find('.DeletePurchasedPlayerData').click(function(){
            let playerId = $(this).attr('playerid'),
                data = Tool.getVal('PlayersData',{});
            BoughtPlayers = data.BuyPlayers; //Structure: http://prntscr.com/uc2p4v
            let idx = BoughtPlayers.findIndex(p=>p.playerId==playerId);
            if(idx==-1) return;
            BoughtPlayers.splice(idx,1);
            data.BuyPlayers = BoughtPlayers;
            Tool.setVal('PlayersData',data);

            let tr = $(this).parents('tr').first();
            tr.hide(400);
            setTimeout(function(){
                let i = tr.index();
                tr.remove();
                let table = $('#purchased-players'),
                    players = table.find('> tbody > tr');
                if(players.length){
                    for(; i < players.length ; i++)
                        players[i].className = i%2?"even":"odd";
                }
                else{
                    table.prev().remove();
                    table.remove();
                    UploadPlayersData();
                }
            },400);
        });


        //Show Profit
        let elements={p:[],n:[]};
        $('#foreigner-offers > tbody > tr').toArray().map(t=>{
            let td=$(t).find('>td:nth-child(8)'), offer;
            if(!td[0].hasAttribute('sortvalue') || isNaN(offer = parseInt(td.attr('sortvalue')))) return false;
            let id = $(t).find('.open-card').attr('pid').split('-')[1],
                data = BoughtPlayers.find(p=>p.playerId==id);
            if(data === undefined) return false;
            return {
                offer: offer,
                price: data.price,
                e    : $(t).find('>td .currency-number').last()
            };
        }).filter(o=>o!==false).forEach(o=>{
            let price = o.price,
                profit = o.offer - price,
                title_key = profit<0?GetText('Loss', {tag:0}):GetText('Gain', {tag:0});
            o.e.css('color',profit>0?'#20ff63':profit==0?"white":"#a10c00").after(
                `<span title="${title_key} : ${profit.toLocaleString()} €" tool_tt="${title_key}_{X} : ${profit.toLocaleString()} €" style="font-weight:bold; color:#42ead4; display:none; vertical-align:top;">${price.toLocaleString()}</span>`
            );
            elements.p.push(o.e);
            elements.n.push(...[o.e.parent(),o.e.next()]);
        });

        $(elements.p).map($.fn.toArray).mouseenter(function(){
            $(this).hide().next().show();
        });
        $(elements.n).map($.fn.toArray).mouseleave(function(){
            ($(this).hasClass('currency-container')?$('>span:nth-child(2)',this):$(this)).hide().prev().show();
        });
        elements=null;
    }
    function UploadPlayersData(){
        if($('#UploadPlayerData').length) return;

        $('#own-offers').after(
            `<div align="center">`+
            `   <label style="color:#a5e4c6; font-weight:bold;">${GetText('UploadPlayersData')} : </label>`+
            `   <input id="UploadPlayerData" type="file" accept="text/plain">`+
            `</div>`
        );
        $('#UploadPlayerData').change(function(e){
            let that = $(this),
                file = this.files[0];
            if(file.type == 'text/plain'){
                let reader = new FileReader();
                reader.onload = function(){
                    let PlayersData = JSON.parse(reader.result),
                        data = Tool.getVal('PlayersData');
                    data.BuyPlayers = PlayersData;
                    Tool.setVal('PlayersData',data);
                    that.parent().remove();
                    start(PlayersData);
                };
                reader.readAsText(file);
            }
            else Game.giveNotification(false, GetText('ChooseNotebook'));
        });
    }
},null,[
    'main',
    function(){
        //Sattığımız oyuncudan ne kadar kazanç sağladığımızı gösterebilmek için
        if(typeof Tool.news.sellPlayer=='object'){ //{"title":"Assistent: Transfermarkt","control":"ausgehandelt","beforeName":"Spieler ","afterName":" hat"}
            let sData=Tool.news.sellPlayer,
                PlayersData = Tool.getVal('PlayersData'); //Structure: http://prntscr.com/uc2p4v
            if(PlayersData){
                GetMessagesByTitle(sData.title,(messages)=>{
                    if(typeof PlayersData.SellPlayers != 'object') PlayersData.SellPlayers = {};
                    let SellPlayers = PlayersData.SellPlayers;

                    let html,message,updated=0;
                    for(let i=0; i<messages.length ; i++){
                        message = messages[i]; // $ element
                        html = message.html().trim();

                        if(html.indexOf(sData.control)==-1) continue;

                        let start = html.indexOf(sData.beforeName)+sData.beforeName.length,
                            end = html.indexOf(sData.afterName,start),
                            a = message.find('a');

                        if(start==-1 || end==-1 || a.length==0) continue;
                        a = a.first();

                        let playerName = html.substring(start,end).trim(),
                            club = {
                                id   : a.attr('clubid'),
                                name : a.text().trim()
                            };

                        message.html(html.substring(0,start)+`<font style="cursor:default;" color="#89f4ff">${playerName}</font>`+html.substring(end));

                        if(SellPlayers.hasOwnProperty(playerName)){
                            ShowLabels(message,SellPlayers[playerName].price,SellPlayers[playerName].purchase);
                            continue;
                        }

                        let AcceptedOffers = PlayersData.AcceptedOffers,
                            foundPlayers = [];
                        for(let playerId in AcceptedOffers){
                            let playerData = AcceptedOffers[playerId],
                                playerName_ = playerData.playerName;
                            if(playerName_.split(',').reverse().join(' ').trim() == playerName){
                                let offers = playerData.offers;
                                for(let clubId in offers){
                                    if(clubId == club.id){
                                        playerData.playerId = playerId;
                                        playerData.clubId = clubId;
                                        foundPlayers.push(playerData);
                                        break;
                                    }
                                }
                            }
                        }

                        if(foundPlayers.length != 1) continue;

                        let playerData = foundPlayers[0],
                            offer = playerData.offers[playerData.clubId];

                        SellPlayers[playerName] = {
                            playerName : playerData.playerName,
                            playerId   : playerData.playerId,
                            clubId     : playerData.clubId,
                            clubName   : offer.clubName,
                            price      : offer.price,
                            date       : message.parents('tr').find('td.last-column').text().trim(),
                            purchase   : !1
                        };
                        delete AcceptedOffers[playerData.playerId];
                        ++updated;

                        if(!Array.isArray(PlayersData.BuyPlayers)) PlayersData.BuyPlayers = [];
                        let BuyPlayers = PlayersData.BuyPlayers,
                            purchase=!1;

                        for(let i = 0 ; i < BuyPlayers.length ; i++){
                            if(BuyPlayers[i].playerId == playerData.playerId){
                                SellPlayers[playerName].purchase = purchase = BuyPlayers[i].price;
                                break;
                            }
                        }
                        ShowLabels(message,offer.price,purchase);
                    }
                    if(updated) Tool.setVal('PlayersData',PlayersData);

                    function ShowLabels(e,sale,purchase=!1){
                        let text = `<p style="text-align:center; font-weight:bold; margin-top:10px;">`;
                        if(purchase!=!1)
                            text+=`<label style="color:#a11717; font-family:'comic sans'; font-size:15px;">${GetText('PurchasePrice')}: ${parseInt(purchase).toLocaleString()}<span class="icon currency"></span></label>`;
                        if(sale)
                            text+=`<label style="color:blue; font-family:'comic sans\; font-size:15px; margin:0 15px;">${GetText('SalePrice')}: ${parseInt(sale).toLocaleString()}<span class="icon currency"></span></label>`;
                        if(purchase!=!1){
                            let profit = parseInt(sale)-parseInt(purchase);
                            text+=`<label style="color:${profit>0?'green':(profit<0?'#9d2527; font-weight:bold':'white')}; font-family:'comic sans'; font-size: 15px;">${GetText('Profit')}: ${profit.toLocaleString()}<span class="icon currency"></span></label>`;
                        }
                        text+=`</p>`;
                        $(e).append(text)
                            .find('>p:last>label:not(:last)').css('margin-right', '10px')
                    }
                });
            }
        }
    }
]);
Tool.features.add('ShowOwnOfferInMarket','transfermarket',function(){
    let players = $('#content > div.container.transfermarket > div.table-container > table > tbody');
    if(!players.find('.open-card').length) return false;

    let OwnOffers = {};
    if($('#own-offers> tbody').find('.open-card').length){
        $('#own-offers> tbody > tr').each(function(){
            let OCard = $(this).find('.open-card'),
                playerId = OCard.attr('pid').split('-')[1],
                price = parseInt($(this).find('td:nth-child(8)').attr('sortvalue')),
                bidStatus = $(this).find('td:nth-child(7)').text().trim().toLowerCase();
            OwnOffers[playerId]= {
                price     : price,
                bidStatus : bidStatus
            };
        });
    }

    players = players.find('tr');
    players.each(function(i){
        let playerId = $(this).find('.open-card').attr('pid').split('-')[1];
        if(OwnOffers[playerId]){
            let club = $(this).find('td:nth-child(8) > a'),
                bidStatus = OwnOffers[playerId].bidStatus,
                color,
                title = '';
            switch(bidStatus){
                case Tool.bidTexts.accept.toLowerCase():
                    color = '#20ff63';
                    title = GetText('AcceptedOwnOffer', {tag:0});
                    break;
                case Tool.bidTexts.reject.toLowerCase():
                    color = '#9e0e0e';
                    title = GetText('RejectedOwnOffer', {tag:0});
                    break;
                case Tool.bidTexts.read.toLowerCase():
                    color = '#fcbd0f';
                    title = GetText('ReadOwnOffer', {tag:0});
                    break;
                default: // Tool.bidTexts.new
                    color = '#ffffff82';
                    title = GetText('NewOwnOffer', {tag:0});
                    break;
            }
            var playerName = $(this).find('.player-name:first');
            if(club.length){
                if(club.hasClass('self-link')){
                    $(this).find('.currency-number').first().css('color',color);
                }
                else if(bidStatus != Tool.bidTexts.reject){
                    //Bu oyuncuya verdiğimiz geçilmiş fakat bizim teklifimiz reddedilmemiş ise
                    var price = OwnOffers[playerId].price;
                    showMyOffer(playerName,$(this).find('.currency-number:first'),club,price,color);
                    title += '\u000d'+GetText('PassedOwnOffer', {tag:0});
                }
            }
            playerName[0].style = `background-color:${color}; border-radius:7px; padding:1px 3px;`;
            playerName[0].title = title;
            goToMyOffer(playerName,playerId);
        }
    });
    function goToMyOffer(playerName,playerId){
        let _playerId;
        playerName.click(function(){
            $('#own-offers > tbody > tr').each(function(){
                _playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                if(_playerId == playerId){
                    $('html, body').animate({ scrollTop: GetOffset(this).top-$(window).height()/2 }, 'fast');
                    this.style = `background-color:#fff2ac; background-image:linear-gradient(to right, #ffe359 0%, #fff2ac 100%);`;
                    let tr = this;
                    setTimeout(function(){
                        tr.style = '';
                    },2000);
                    return;
                }
            });
        });
    }
    function showMyOffer(e1,e2,club,price,color){
        let temp = {
            price : e2.html(),
            clubId : club.attr('clubid'),
            clubName : club.text().trim()
        };
        e1.add(e2).mouseenter(function(){
            e2.html(`<font color:"${color}">${price.toLocaleString()}</font>`);
            club.attr('clubid',Tool.clubId);
            club.addClass('self-link');
            club.text(Tool.clubName);
        });
        e1.add(e2).mouseleave(function(){
            e2.html(temp.price);
            club.attr('clubid',temp.clubId);
            club.removeClass('self-link');
            club.text(temp.clubName);
        });
    }
},null);
Tool.features.add('FilterOwnOffers','transfermarket',function(){
    if(!$('#own-offers > tbody').find('.open-card').length) return false;

    $('#own-offers').parent().before(
        `<div id="divFilterOwnOffers" style="text-align:center;">`+
        `   <label style="color:white; font-size:13px;" title="${new Date(Game.getTime()).toLocaleDateString()}">`+
        `      <input type="checkbox">`+
        `      `+GetText('TodayOffers')+
        `   </label>`+
        `   <label style="color:white; font-size:13px;">`+
        `      <input type="checkbox" style="margin-Left:20px;" checked>`+
        `      `+GetText('AcceptedOffers')+
        `   </label>`+
        `   <label style="color:white; font-size:13px;">`+
        `      <input type="checkbox" style="margin-Left:20px;" checked>`+
        `      `+GetText('ReadingOffers')+
        `   </label>`+
        `   <label style="color:white; font-size:13px;">`+
        `      <input type="checkbox" style="margin-Left:20px;" checked>`+
        `      `+GetText('RejectedOffers')+
        `   </label>`+
        `   <label style="color:white; font-size:13px;">`+
        `      <input type="checkbox" style="margin-Left:20px;" checked>`+
        `      `+GetText('NewOffers')+
        `   </label>`+
        `</div>`
    );
    $('#divFilterOwnOffers > label > input').click(function(){
        $('#divFilterOwnOffers > input').attr('disabled',true);
        let filter = {},
            today = new Date(Game.getTime()).toLocaleDateString();
        $('#divFilterOwnOffers > label > input').each(function(i){
            filter[$(this).next().attr('k')]=this.checked;
        });
        let count = 0;
        $('#own-offers > tbody > tr').each(function(){
            let bidStatus = $(this).find('td:nth-child(7)').text().trim().toLowerCase(),
                date = $(this).find('td:nth-child(9)').text().trim(),
                show =
                (filter.AcceptedOffers && bidStatus==Tool.bidTexts.accept.toLowerCase()) ||
                (filter.ReadingOffers && bidStatus==Tool.bidTexts.read.toLowerCase()) ||
                (filter.RejectedOffers && bidStatus==Tool.bidTexts.reject.toLowerCase()) ||
                (filter.NewOffers && bidStatus==Tool.bidTexts.new.toLowerCase());
            show = show && filter.TodayOffers?date.indexOf(today)!=-1:show;
            if(show){
                $(this).attr('class',(count++)%2==0?"odd":"even");
                $(this).show();
            }
            else $(this).hide();
        });
        $('#divFilterOwnOffers > input').removeAttr('disabled');
    });
},null);
Tool.features.add('FilterTransferMarket','transfermarket',function(){
    if(!$('#content > div.container.transfermarket > div.table-container > table > tbody').find('.open-card').length || $('#club').val()==Tool.clubName) return false;

    if(!Tool.hasOwnProperty('transferMarket')){
        Tool.transferMarket = {
            clubs: {},
            values: {"ligaIndex":0,"checkBox":false}
        };
    }

    let players = $('#content > div.container.transfermarket > div.table-container > table > tbody > tr'),
        count = 0;

    $('#content').find('.search-container').first().after(
        `<div id="transferMarktMenu" style="clear:both; margin-left:18px; position:relative;">`+
        `   ${GetText('ShowOnlyOneLeague')} : `+
        `   <select id="select_lig" style="-webkit-border-radius:7px; margin-Left:10px; text-align-last:center;">`+
        `      <option value="0" selected="selected">${GetText('SelectLeague')}:</option>`+
        `      ${Tool.leagues.reduce((acc,league,idx)=>acc+`<option value="${idx+1}">${league}</option>`,'')}`+
        `   </select>`+
        `   <label style="display:none; vertical-align:middle;">`+
        `      <input id="only_one_lig" type="checkBox" style="margin-Left:10px;"></input>`+
        `      <label for="only_one_lig">${GetText('ShowOnlyOneLeague')}</label>`+
        `   </label>`+
        `   <p ${$('#positions').val()==0?'':`style="display:none;"`}>`+
        `      <input id="NoKeeperPlayers" type="checkBox" style="margin-left:0;">`+
        `      <label for="NoKeeperPlayers">${GetText('AllExceptGoalkeeper')}</label>`+
        `   </p>`+
        `</div>`
    );

    let myLeague = (Tool.getVal('LeagueData',{league:false})).league;
    if(myLeague){
        let options = $('#select_lig > option');
        options.each(function(i){
            if($(this).text().toLowerCase()==myLeague.toLowerCase()){
                $(this).attr({'title': GetText('ownLeague', {tag:0}), 'tool_tt':"ownLeague"}).css({
                    'background-color':'#8c0505',
                    'color':'white'
                });
                for(let j=i-3;j>0;j--) $(options[j]).attr('title', GetText('lowerLeague', {tag:0})+'. '+GetText('playerBuyInfo1', {tag:0})).css('background-color','yellow');
                for(let j=i-1,c=0;j>0&&c<2;j--,c++) $(options[j]).attr({'title': GetText('lowerLeague', {tag:0}), 'tool_tt':'lowerLeague'}).css('background-color','orange');
                let len = $('#select_lig > option').length;
                for(let j=i+1,c=0;j<=len&&c<2;j++,c++) $(options[j]).attr({'title': GetText('upperLeague', {tag:0}), 'tool_tt':'upperLeague'}).css('background-color','#17fc17');
                for(let j=i+3;j<=len;j++) $(options[j]).attr('title', GetText('upperLeague', {tag:0})+'. '+GetText('playerBuyInfo2', {tag:0})).css('color','#808080').prop('disabled',true);
                return false;
            }
        });
    }

    $('#content > div.container.transfermarket > div.table-container > h3').after(
        `<p id="filterPlayerInformation" style="background-color:black; color:white; line-height:33px; text-align:center;"></p>`
    );

    unsafeWindow.$('#positions').change(function(){
        $('#NoKeeperPlayers').parent()[this.value=='0'?'slideDown':'slideUp']();
    });
    $('#NoKeeperPlayers').click(function(){
        Tool.transferMarket.values.NoKeeperPlayers = this.checked;
        if(this.checked && $('#positions').val()==0){
            players.each(function(){
                if($(this).css('display')!=='none'){
                    if(this.getElementsByTagName('td')[2].innerHTML === Tool.footballerPositions[0]){
                        $(this).hide();
                    }
                }
            });
        }
        else{
            if($('#only_one_lig')[0].checked){
                var lig = $('#select_lig')[0].options[$('#select_lig')[0].selectedIndex].textContent.trim();
                players.each(function(){
                    var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
                    if(Tool.transferMarket.clubs[clubId].indexOf(lig)!==-1){
                        $(this).show();
                    }
                });
            }
            else{
                players.each(function(){
                    $(this).show();
                });
            }
        }
        showFilterInfo();
    });
    $('#select_lig').change(function(){
        Tool.transferMarket.values.ligaIndex= this.selectedIndex;
        if(this.value==0){
            $('#only_one_lig').parent().slideUp();
            $('#only_one_lig')[0].checked = false;
            Tool.transferMarket.values.checkBox = false;
            players.each(function(i){
                this.className = i%2===0?"odd":"even";
                $(this).show();
            });
        }
        else{
            $('#only_one_lig').parent().slideDown();
            if($('#only_one_lig')[0].checked){
                tablo_oku();
            }
        }
    });
    $('#only_one_lig').click(function(){
        Tool.transferMarket.values.checkBox = this.checked;
        if(this.checked){
            tablo_oku();
        }
        else{
            if($('#NoKeeperPlayers')[0].checked){
                var c = 0;
                players.each(function(i){
                    if(this.getElementsByTagName('td')[2].innerHTML !== Tool.footballerPositions[0]){
                        this.className = c%2===0?"odd":"even";
                        this.style.display='';
                        c++;
                    }
                });
            }
            else{
                players.each(function(i){
                    this.className = i%2===0?"odd":"even";
                    $(this).show();
                });
            }
            showFilterInfo();
        }
    });
    if(Tool.transferMarket.values.NoKeeperPlayers){
        if($('#positions').val()=='0')
            $('#NoKeeperPlayers').click();
        else{
            Tool.transferMarket.values.NoKeeperPlayers = !1;
            $('#NoKeeperPlayers')[0].checked = !1;
        }
    }
    if(Tool.transferMarket.values.ligaIndex!==0){
        document.getElementById('select_lig').selectedIndex = Tool.transferMarket.values.ligaIndex;
        $('#only_one_lig').parent().show();
        if(Tool.transferMarket.values.checkBox){
            $('#only_one_lig')[0].checked=true;
            tablo_oku();
        }
    }

    function tablo_oku(){
        $('#select_lig, #only_one_lig, #NoKeeperPlayers').prop('disabled', true);
        $('#only_one_lig').parent().hide()
            .parent().after(`<img id="LoadingTable" src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-left:10px; vertical-align:middle;">`);
        count = 0;
        players.each(function(){
            var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
            if(!Tool.transferMarket.clubs[clubId]){
                count++;
                kulüp_bilgileri_cek(clubId);
            }
        });
        if(count==0){
            tablo_göster();
        }
    }
    function kulüp_bilgileri_cek(clubId){
        $.get(`index.php?w=${worldId}&area=user&module=club&action=index&complex=0&id=${clubId}`, function(response){
            var a = $('<diV>'+response+'</div>').find('ul > li:first');
            a.find('strong').remove();
            var leuage = a.text().trim();
            Tool.transferMarket.clubs[clubId] = leuage;
            count--;
            if(count===0){
                tablo_göster();
            }
        });
    }
    function tablo_göster(){
        var kl_gösterme = Tool.transferMarket.values.NoKeeperPlayers && $('#positions').val()=="0"?true:false;
        var görüntülenecek_lig = document.getElementById('select_lig').options[document.getElementById('select_lig').selectedIndex].textContent;
        players.each(function(i){
            var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
            var mevki = this.getElementsByTagName('td')[2].innerHTML;
            if(Tool.transferMarket.clubs[clubId].indexOf(görüntülenecek_lig)!==-1 && !(kl_gösterme && mevki===Tool.footballerPositions[0])){
                this.className = i%2==0?"odd":"even";
                $(this).show();
            }
            else{
                $(this).hide();
            }
        });
        $('#select_lig, #only_one_lig, #NoKeeperPlayers').prop('disabled', false);
        $('#LoadingTable').remove();
        $('#only_one_lig').parent().show();
        showFilterInfo();
    }
    function showFilterInfo(){
        var show = 0;
        players.each(function(){
            if($(this).css('display')!=='none'){
                show++;
            }
        });
        if(players.length !== show){
            $('#filterPlayerInformation').html(GetText('FilterPlayerInformation', {args:[players.length, show]}));
        }
        else{
            $('#filterPlayerInformation').html('');
        }
    }
},null);
Tool.features.add('DownloadTable',['league','statistics','squadstrenght','goalgetter'],function(){
    let element = {'league':'statistics-league-table' ,'statistics':'season-league-table', 'squadstrenght':'squad-strengths', 'goalgetter':'goalgetters'}[Game.currentPage.name];
    if(element==null || (element=$('#'+element)).length==0) return false;

    if(!$('#html2canvas').length)
        $('head').append(`<script id="html2canvas" type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.min.js">`);

    $(`<img src="${Tool.sources.getLink('https://www.pinclipart.com/picdir/big/494-4943705_camera-symbol-png-video-camera-icon-gif-clipart.png')}" alt="printscreen" height="20px" style="cursor:pointer;" title="${GetText('DownloadTable', {tag:0})}" tool_tt="DownloadTable">`)
        .appendTo(element.find('> tfoot > tr > td')).mouseenter(function(){
        element.find('>tbody:first,>thead:first').addClass('animate-flicker');
    }).mouseleave(function(){
        element.find('>tbody:first,>thead:first').removeClass('animate-flicker');
    }).click(function(){
        $(this).hide().after(`<span class="load-icon loading" style="float:none; margin:0 auto;"></span>`);
        element.css('background', '#6e9a5a url(/designs/redesign/images/layout/box_bg.gif) 0 -200px repeat-x')
            .find('>tbody:first,>thead:first').removeClass('animate-flicker').css('opacity',1);
        let that = $(this);
        html2canvas( //eslint-disable-line no-undef
            element[0],{
                x: element.offset().left,
                y: element.offset().top,
                height: element.height()-element.find('>tfoot:first').height()
            }
        ).then(function(canvas) {
            let fileName = {'league':'LeagueTable' ,'statistics':'MatchResultsTable', 'squadstrenght':'SquadStrengthTable', 'goalgetter':'GoalScorerTable'}[Game.currentPage.name];
            if(typeof fileName=='string') fileName= GetText(fileName, {tag:0});
            switch(Game.currentPage.name){
            }
            canvas.toBlob(function(blob){
                let object_URL = URL.createObjectURL(blob);
                $('<a>').attr({'href':object_URL, 'download':(fileName||'screenshot')+'.png'})[0].click();
                URL.revokeObjectURL(object_URL);
            },'image/png');
            that.show().next().remove();
        });
    });
},null);
Tool.features.add('CancelFriendlyMatchInvites','friendly',function(){
    if($('#away-invitations-table > tbody .no-invites').length) return false;
    let invites = $('#away-invitations-table > tbody > tr');
    if(invites.length>1){
        $('#away-invitations-table > thead > tr > th:last').append(
            `<input id="SelectAllInvites" type="checkbox" class="checkbox_1">`+
            `<label for="SelectAllInvites" title="${GetText('selectAll', {tag:0})}" tool_tt="selectAll" style="line-height:20px; float:right; margin-top:2.5px;"></label>`
        );
        $('#SelectAllInvites').click(function(){
            $('#away-invitations-table > tbody .CancelInvite'+(this.checked?':not(:checked)':':checked')).prop('checked',this.checked);
            $('#CancelInvites')[this.checked?'slideDown':'slideUp']();
        });
    }
    $('#away-invitations-table > tbody > tr').each(function(i){
        let a = $('.icon.delete',$(this)).parent(),
            decline = a.attr('href'),
            find = decline.indexOf('&decline=')+9;
        decline = decline.substring(find,decline.indexOf('&',find));
        a.after(
            `<input id="Cancel_invite_${i}" class="CancelInvite checkbox_2" style="vertical-align:middle; margin:0;" type="checkbox" decline="${decline}">`+
            `<label for="Cancel_invite_${i}" class="disHighlight" style="cursor:pointer;"></label>`
        );
        a.remove();
    });
    let prev_index=undefined;
    $('.CancelInvite').click(function(e){
        let index = $(this).parents('tr').index();
        if(e.shiftKey && prev_index!=undefined){
            $('#away-invitations-table > tbody > tr').slice(Math.min(prev_index,index),Math.max(prev_index,index)+1).find('.CancelInvite').prop('checked',this.checked);
        }
        prev_index = index;
        $('#CancelInvites')[$('#away-invitations-table > tbody .CancelInvite:checked').length?'slideDown':'slideUp']();
        if(!this.checked && $('#SelectAllInvites').prop('checked')) $('#SelectAllInvites').prop('checked',false);
        else if(
            this.checked
            && !$('#SelectAllInvites').prop('checked')
            && !$('#away-invitations-table > tbody .CancelInvite:not(:checked)').length
        ) $('#SelectAllInvites').prop('checked',true);
    });
    $('#away-invitations-table > tfoot > tr > td').append(CreateButton('CancelInvites', GetText('CancelSelectedInvites'), 'display:none; float:right;'));
    $('#CancelInvites').click(function(){
        let checked;
        if(!(checked = $('#away-invitations-table > tbody .CancelInvite:checked')).length) return;
        let links = [];
        checked.each(function(){
            links.push({tr:$(this).parents('tr'),decline:$(this).attr('decline')});
        });
        let invites_length=links.length,
            counter=0;
        for(let i=0;i<invites_length;i++){
            CancelInvite(links[i]);
        }
        let control_time=0;
        function CancelInvite(obj,err=0){
            let success;
            //     index.php?w=3401&area=user&module=friendly&action=index&decline=668249_1550581200
            $.get(`index.php?w=${worldId}&area=user&module=friendly&action=index&decline=${obj.decline}&layout=none`, function(response){
                //Veri alımı başarılı oldu.
                let feedback;
                if(!(feedback=response.feedback).trim() //feedback yoksa
                   || !(feedback = $(feedback)).length //tag bulunamadıysa
                   || (feedback=feedback)[0].tagName!='P' //doğru tak değilse
                   || !feedback.hasClass('notice') //bildirim başarılı değilse
                  ){
                    console.log("feedback isn't exist || length=0 || tagname!='P'");
                    success=!1;
                    err = 3;
                    return;
                }
                else{
                    success=!0;
                    console.log("Canceling invite ["+obj.decline+"] is successfull!");
                }
            }).fail(function(){
                //Veri alımı başarısız oldu. 3 Kere veri alımını tekrar dene. Eğer 2 kez daha başarısız olursa işlemi sonlandır.
                if(++err<3) CancelInvite(obj,err);
            }).always(function(){
                if(success //Veri alımı başarılı
                   || err==3 //veya 3 kere denenmesine rağmen veri alınamadı!
                  ){
                    counter++;
                    let tr = obj.tr;
                    if(success){
                        tr.fadeOut(1000,()=>{
                            tr.remove();
                        });
                        control_time=new Date().getTime()+1000; // 1000 salise sonra satır silinecek.Eğer o esnada finish fonksiyonu çalışırsa..
                    }else{
                        tr.find('.CancelInvite').prop('checked',false);
                        BlinkEvent(tr,1000);
                    }
                    if(counter==invites_length)
                        setTimeout(finish,control_time-new Date().getTime());
                }
            });
        }
        function finish(){
            if(!$('#away-invitations-table > tbody > tr').length){
                $('#away-invitations-table > tbody').append(`<tr class="odd"> <td class="no-invites last-column" colspan="4"> - </td> </tr>`);
                $('#SelectAllInvites').parent().find('label[for=SelectAllInvites]').remove();
                $('#SelectAllInvites').remove();
                $('#CancelInvites').remove();
            }
        }
    });
},null);
Tool.features.add('QuickBet','betoffice',function(){
    var t = $('#betoffice-container').find('.matches').find('tbody');
    if(t.find('.club-logo-container').length){
        t.find('tr').each(function(){
            if($(this).find('.last-column').find('select').length){
                var k = this.getElementsByClassName('bet-quote');
                for(var j = 0 ; j < k.length ; j++){
                    var radio = k[j].getElementsByTagName('span')[0];
                    $(radio).click(function(){
                        var e = $(this).parents('tr').find('select')[0];
                        var q = $(this).parents('tr').find('.last-column > span > div > span')[0];
                        if(!$(this).hasClass('checked')){
                            e.selectedIndex = e.options.length-1;
                            q.innerHTML = e.options[e.selectedIndex].innerHTML;
                        }
                        else{
                            e.selectedIndex = 0;
                            q.innerHTML=0;
                        }
                    });
                }
            }
        });
    }
},null);
Tool.features.add('ShowAsistantLevelIncrease','assistants',function(){
    var key = 'AsistanLevel';
    var data = Tool.getVal(key,{});
    var o = [];
    $('#assistants').find('.bar-text').each(function(){
        var level = this.textContent.trim();
        var b = level.indexOf(' ');
        level = level.substring(b,level.indexOf(' ',b+1));
        var value = parseInt($(this).prev().find('div')[0].style.width.replace('%',''));
        var asistant = $($(this).parents('li')[1]).index();
        var asistantName = $(this).parents('ul').first().find('li:first > span').text();
        if(data[asistant]!==undefined){
            if(data[asistant].name == asistantName){
                var difference = value - data[asistant].v;
                if(difference>0){
                    var asistantType = $(this).parents('li').find('h3').text().trim();
                    o.push({asistantType:asistantType,asistantName:asistantName,difference:difference});
                }
            }
        }
        data[asistant] = {name:asistantName,v:(level*100+value)};
    });
    if(o.length){
        var text = GetText('SeminarIsOver')+'<br>';
        for(var i = 0 ; i < o.length-1 ; i++){
            text += o[i].asistantName+`[${o[i].asistantType}] : +${o[i].difference}%<br>`;
        }
        text += o[o.length-1].asistantName+`[${o[o.length-1].asistantType}] : +${o[o.length-1].difference}`;
        Game.giveNotification(true, text);
    }
    Tool.setVal(key,data);
},null);
Tool.features.add('QuickShopping','shop',function(){
    $('#shop-content > .shop').each(function(){
        let shop = this;
        if($(shop).find('.shadow').length) return;

        let e = $('div.table-container',shop)[0].getElementsByClassName('multi');
        for(let i=0,len=e.length ; i<len ; i++){
            let k = e[i].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for(var j = 0 ; j<k.length ; j++){
                let t = k[j].getElementsByClassName('last-column order-quantity')[0];
                if(t!==undefined && t.getElementsByClassName('input-container')[0]!==undefined){
                    let tk = t.innerHTML,
                        b = tk.indexOf('</span> / ')+7,
                        b1 = tk.indexOf('<span',b),
                        mi = tk.substring(b+3,b1).trim();
                    t.innerHTML = tk.substring(0,b)+`<span class="TrOk disHighlight" style="cursor:pointer;"> / ${mi}</span>`+tk.substring(b1);
                    ClickTrOk(t.getElementsByClassName('TrOk')[0]);
                }
            }
        }
        $('div.button-container > span.button.button-container-disabled.premium > a > span', shop)
        .attr('k',1)
        .removeAttr('class tooltip name')
        .css('cursor','pointer')
        .html(GetText('FillAll'))
        .click(function(){
            let k = shop.getElementsByClassName('TrOk');
            if($(this).attr('k')==1){
                for(let i = 0 ; i < k.length ; i++)
                    k[i].previousSibling.getElementsByTagName('input')[0].value = k[i].textContent.replace('/','').trim();
                $(this).html(GetText('EmptyAll')).attr('k',0);
            }
            else{
                for(let i = 0 ; i < k.length ; i++)
                    k[i].previousSibling.getElementsByTagName('input')[0].value = 0;
                $(this).html(GetText('FillAll')).attr('k',0);
            }
        })
        .parent().removeAttr('href');
        $('div.button-container > span:nth-child(3) > a > span', shop).html(GetText('Ordering'));
    });
    function ClickTrOk(e){
        $(e).click(function(){
            let va = e.textContent.replace('/','').trim(),
                t = e.previousSibling.getElementsByTagName('input')[0];
            if(e.previousSibling.getElementsByTagName('input')[0].value!==va) t.value = va;
            else t.value=0;
        });
    }
},null);
Tool.features.add('AddImage',['press->article','club_profile'],function(){
    let elements = {
        'article': { /*press->article*/
            toolbar : $('#Toolbar_designArea > ul'),
            textarea: $('#designArea')[0]
        },
        'club_profile' : {
            toolbar : $('#Toolbar_profile-edit-club-information > ul'),
            textarea: $('#profile-edit-club-information')[0]
        }
    }[Game.currentPage.name];
    $(`<li class="" title="${GetText('AddImage', {tag:0})}" tool_tt="AddImage" style="cursor:pointer;" onmouseenter="$(this).addClass('hover')" onmouseleave="$(this).removeClass('hover')">`+
      `   <img src="${Tool.sources.getLink('https://icon-library.com/images/photo-gallery-icon/photo-gallery-icon-12.jpg')}" alt="image" width="20px" height="20px">`+
      `</li>`
     ).appendTo(elements.toolbar).click(function(){
        let txt = prompt(GetText('EnterImageLink', {tag:0}) + ' :', "");
        if (!txt || !(txt=txt.trim())) return;
        let intStart = elements.textarea.selectionStart,
            img = new Image();
        img.onload = function() {
            let a = elements.textarea;
            txt = `[color=rgb(255, 255, 255);background-image: url(${txt});width:${this.width}px;height:${this.height}px;display:block;overflow:visible;margin:0 auto;][/color]`;
            a.value = String(a.value).substring(0, intStart) + txt + String(a.value).substring(a.selectionEnd);
            a.selectionStart = intStart;
            a.selectionEnd = intStart+txt.length;
            a.focus();
        };
        img.src = txt;
    });
},null);
Tool.features.add('InviteSimulationMatch','manager',function(){
    if(isNaN(Game.link.pr.clubId) || Game.link.pr.clubId==Tool.clubId) return;
    let matchId = (new URL(location.origin+'/'+$('#profile-show').find('.button-container-friendly-invite-button > a').attr('href').replace('#/',''))).searchParams.get('invite');
    if(matchId == null) return false;
    $('#profile-show').find('.profile-actions').first().append(
        `<a class='button' href='#/index.php?w=${worldId}&area=user&module=simulation&action=index&squad=${matchId}'>`+
        `   <span>${GetText('InviteSimulation')}</span>`+
        `</a>`
    );
},null);
Tool.features.add('ShowEloRating','manager',function(){
    $('#profile-show > div.container.profile-trophy > div.profile > ul.profile-box-club').append(
        `<li><strong>${GetText('EloRank')} : </strong> <span id="SpanEloRating" class="icon details loading"></span></li>`
    );
    let clubName = $('#profile-show > h2:nth-child(1)').text().replace(Tool.replaceClubName,'').trim();
    Game.getPage(`index.php?club=${clubName}&_qf__form=&module=rating&action=index&area=user&league=&path=index.php&layout=none`, null, null, 0, ['content'])
        .then(data=>{
        let odds = $('<div>').html(data.content).find('.odd');
        $('#SpanEloRating').attr('class','');
        if(odds.length) $('#SpanEloRating').html(odds.first().find('>td')[0].textContent);
        else $('#SpanEloRating').css('color','gray').html('-');
    })
        .catch(err=>{
        console.error(err);
        $('#SpanEloRating').html(`<font color="#751b1b">${GetText('error')}</font>`);
    });
},null);
Tool.features.add('LiveMatchesTable','live->match',function(){
    if(typeof currentLive!='object') return false;
    if(Tool.goalTrigger!==3) return false;
    if(!($('#'+currentLive.matchId).hasClass('league') && $('#match-observer').length)) return false;
    //If the match is league match

    let LiveLeagueTable = {
        Initialize : async function(){
            delete this.Initialize;
            $('#match > div.match.ticker').css('height','765px');

            if(!currentLive.hasOwnProperty('homeClubId')){
                currentLive.homeClubId = $('#'+currentLive.matchId+' > div.home > span > h3 > a').attr('clubid');
                currentLive.awayClubId = $('#'+currentLive.matchId+' > div.away > span > h3 > a').attr('clubid');
            }

            this.InsertHeaderForObserver();
            this.InsertLeagueTable();
            this.InsertHeaderForTable();
            this.CreateAnimation();

            let all_matches_ended = this.AllMatchesEnded(),
                league_table_updated = all_matches_ended && await this.AreScoresUpdated(),
                matches_not_started = !all_matches_ended && new Date(Game.getTime()).getMinutes()>29,
                any_match_is_continue = !all_matches_ended && !matches_not_started;

            console.log('%call_matches_ended: %o\n%cleague_table_updated: %o','color:red;font-weight:bold;',all_matches_ended,'color:red;font-weight:bold;',league_table_updated);
            let result = await this.GetTable();
            this.leagueIndex = result.leagueIndex;
            this.tableRowClass = result.rowClass;

            this.SetMatchIdForClub(result.table);
            this.SetOppenentId(result.table);

            // match hour is x
            if(!league_table_updated){ // (x-1) <-> x:15
                this.old_table = result.table;
                if(!all_matches_ended){ //Before match time or in match hour(x): (x-1):30 <-> x:10
                    if(matches_not_started){ // (x-1):30 <-> x (from when matches appear until when matches start)
                        console.log('1.Area');
                        this.new_table = this.old_table;
                        this.UpdateLiveLeagueTable();

                        //await until matches start
                        await new Promise((res,rej)=>{
                            let d = new Date(Game.getTime()),
                                ms = (3600-(d.getMinutes()*60+d.getSeconds()))*1000-d.getMilliseconds();
                            console.log('Beklenecek milisaniye: ' + ms);
                            clearTimeout(unsafeWindow.timeout_1);
                            unsafeWindow.timeout_1=setTimeout(function(){
                                res();
                                delete unsafeWindow.timeout_1;
                            }, ms);
                        });
                        console.log('Mathces start now');

                        this.new_table = this.CreateTableWithScores(this.GetCurrentScores(), this.old_table);
                        //this.new_table.forEach(club=>{++club.played;});
                    }
                    else{ // x <-> x:10 (from when matches start until when all matches end)
                        this.new_table = this.CreateTableWithScores(this.GetCurrentScores(), this.old_table);
                        //this.new_table.forEach(club=>{++club.played;});
                        console.log('2.Area');
                    }
                    this.StartToCatchNewGoals();
                    this.StartToCatchMatchEnd();
                }
                else{ // x:10 <->x:15 (from when all matches end until league table updated)
                    this.new_table = this.CreateTableWithScores(this.GetCurrentScores(), this.old_table);
                    this.new_table.forEach(club=>{++club.played;});
                    console.log('3.Area');
                }
            }
            else{ // x:15 <-> 24:00 (from when league table updated until when matches result disappear)
                this.new_table = result.table;
                this.old_table = this.CreateTableWithScores(this.GetCurrentScores(), this.new_table.slice(0), true);
                this.old_table.forEach(club=>{--club.played;});
                console.log('4.Area');
            }

            this.UpdateLiveLeagueTable();
        },

        InsertLeagueTable : function(){
            delete this.InsertLeagueTable;

            let table_height=450,
                space_height=188;
            $(`<div id="league-table" style="position:absolute; background:#6e9a5a url(images/layout/box_bg.gif) 0 -200px repeat-x; overflow:auto; box-shadow:1px 1px 5px black;">`+
              `   <table class="table-league">`+
              `      <thead>`+
              `         <tr>`+
              `            <th>${GetText('Rank')}</th>`+
              `            <th>${GetText('Trend')}</th>`+
              `            <th>${GetText('Club')}</th>`+
              `            <th>${GetText('Played')}</th>`+
              `            <th>${GetText('Won')}</th>`+
              `            <th>${GetText('Drawn')}</th>`+
              `            <th>${GetText('Lost')}</th>`+
              `            <th title="${GetText('GoalFor', {tag:0})}" tool_tt="GoalFor">${GetText('SGoalFor')}</th>`+
              `            <th title="${GetText('GoalAgainst',{tag:0})}" tool_tt="GoalAgainst">${GetText('SGoalAgainst')}</th>`+
              `            <th>${GetText('Average')}</th>`+
              `            <th>${GetText('Points')}</th>`+
              `         </tr>`+
              `      </thead>`+
              `      <tbody></tbody>`+
              `   </table>`+
              `</div>`
             ).css({
                'top' :(parseInt($('#match-observer').css('top'))+24)+'px',
                'left' :'0px',
                'width':'0',
                'height':table_height+'px'
            }).insertAfter($('#match-observer')).find('table>thead th').css({position: 'sticky', top: '0','background-color':'black','border-bottom':'1px double white'});
            $('#match > div.match').height($('#match > div.match').height()+table_height-space_height)
        },
        InsertHeaderForTable : function(){
            delete this.InsertHeaderForTable;

            $(`<p id="Toggle_league_table" class="disHighlight">${GetText('LiveLeagueTable')}</p>`).css({
                "position" : "absolute",
                "line-height" : "18px",
                "cursor" : "pointer",
                "text-align" : "center",
                "color" : "black",
                "font-weight" : "bold",
                "font-size" : "15px",
                "background-color" : "#d0cfcf",
                "border-radius" : "0 10px 10px 0",
                'padding':'0 2px',
                "writing-mode" : "vertical-lr",
                "text-orientation" : "unset",
                "top" : (parseInt($('#match-observer').css('top'))+24)+'px',
                "left" : "0px",
                "width" : "18px",
                "height" : $('#league-table').height()+"px"
            }).insertAfter($('#match-observer'));
        },
        InsertHeaderForObserver : function(){
            delete this.InsertHeaderForObserver;

            $(`<p id="Toggle_match_observer" k="close" animate_top="${$('#match-observer').height()}" class="disHighlight">${GetText('LiveMatchScores')}</p>`).css({
                'position' : 'absolute',
                'line-height' : '18px',
                'cursor' : 'pointer',
                'text-align' : 'center',
                'color' : 'black',
                'font-weight' : 'bold',
                'font-size' : '15px',
                'background-color' : '#d0cfcf',
                'border-radius' : '0 0 10px 10px',
                'padding':'2px 0',
                'top' : parseInt($('#match-observer').css('top'))+$('#match-observer').height(),
                'width' : $('#match-observer').width()+parseInt($('#match-observer').css('padding-right'))+parseInt($('#match-observer').css('padding-left'))-2,
                'left' : parseInt($('#match-observer').css('left'))+1
            }).insertAfter($('#match-observer'));
        },
        CreateAnimation : function(){
            delete this.CreateAnimation;

            $('#Toggle_match_observer,#Toggle_league_table').click(function(){
                let k = $('#Toggle_match_observer').attr('k'),
                    animate_left = $('#league-table>table').width() + ($('#league-table')[0].scrollHeight != $('#league-table')[0].offsetHeight?16.8:0),
                    animate_top = $('#Toggle_match_observer').attr('animate_top');
                $('#Toggle_match_observer,#Toggle_league_table').css("pointer-events", "none");

                if(k=='close'){
                    $('#Toggle_match_observer').animate({ "top":'-='+animate_top+"px" }, 500 );
                    $('#match-observer,#match-observer > ul').animate({
                        height : 0,
                        opacity: 0
                    }, 500);
                    setTimeout(function(){
                        $('#Toggle_match_observer').attr('k','open');
                        //Cookies.set('liveLeagueTable', 1, { expires: 365 });

                        $('#Toggle_league_table').animate({ "left": '+='+animate_left+"px" }, 500 );
                        $('#league-table').animate({
                            width : animate_left,
                            opacity: 1
                        }, 500);

                        setTimeout(function(){
                            $('#Toggle_match_observer,#Toggle_league_table').css("pointer-events", "auto");
                        },500);
                    },400);
                }
                else{
                    $('#Toggle_league_table').animate({ "left": '-='+animate_left+"px" }, 500 );
                    $('#league-table').animate({
                        width : 0,
                        opacity: 0
                    }, 500);

                    setTimeout(function(){
                        $('#Toggle_match_observer').attr('k','close');
                        //Cookies.set('liveLeagueTable', 0, { expires: 365 });
                        $('#match-observer,#match-observer > ul').animate({
                            height : animate_top,
                            opacity: "1"
                        }, 500);
                        $('#Toggle_match_observer').animate({ "top": '+='+animate_top+"px" }, 500 );
                        setTimeout(function(){
                            $('#Toggle_match_observer,#Toggle_league_table').css("pointer-events", "auto");
                        },500);
                    },400);
                }
            });

            //if(Cookies.get('liveLeagueTable') == "1") $('#Toggle_match_observer').click();

            unsafeWindow.jQuery('#content').off('mouseenter','#league-table > table > tbody > tr').on('mouseenter','#league-table > table > tbody > tr',function(){
                let opp_idx = parseInt($(this).attr('opp_idx'));
                if(isNaN(opp_idx)||opp_idx<0) return;
                $('#league-table > table > tbody > tr').css('background-color','');
                $(this).add($('#league-table > table > tbody > tr:nth-child('+(opp_idx+1)+')')).css('background-color','#4854a8;');
            });
            unsafeWindow.jQuery('#content').off('mouseleave','#league-table > table > tbody').on('mouseleave','#league-table > table > tbody',function(){
                $('#league-table > table > tbody > tr').css('background-color','');
                [currentLive.homeClubId,currentLive.awayClubId].forEach(id=>{$('#league-table > table > tbody > tr:has(a[clubid="'+id+'"])').css('background-color','#4854a8;');});
            });
        },

        GetTable : function(tryGetPage=0){
            delete this.GetTable;
            return new Promise((res,rej)=>{
                Game.getPage('index.php?w='+worldId+'&area=user&module=statistics&action=table&layout=none','#league-table-container').then(table_container=>{
                    let leagueIndex = $(table_container[0].querySelector('#leagueCatalogueForm')).find('select[group="league-selector"]').first().val(),
                        table = [],
                        rowClass = [];
                    $(table_container[0].querySelector('#statistics-league-table')).find('tbody > tr').each(function(i){
                        let tr = this,
                            data = {};
                        rowClass.push(tr.className.replace('odd','').replace('even','').trim());
                        //data.rank = i+1;
                        //data.trend = parseInt($(tr).find('> td:nth-child(2)').attr('sortvalue'));
                        data.clubId = $(tr).find('a[clubid]').attr('clubid');
                        data.clubName = $(tr).find('a[clubid]').text().trim();
                        data.played = parseInt($(tr).find('td:nth-child(4)').text());
                        data.won = parseInt($(tr).find('td:nth-child(5)').text());
                        data.drawn = parseInt($(tr).find('td:nth-child(6)').text());
                        data.lost = parseInt($(tr).find('td:nth-child(7)').text());
                        data.gf = parseInt($(tr).find('td:nth-child(8)').text().split(':')[0]);
                        data.ga = parseInt($(tr).find('td:nth-child(8)').text().split(':')[1]);
                        data.average = parseInt($(tr).find('td:nth-child(9)').text());
                        data.points = parseInt($(tr).find('td:nth-child(10)').text());
                        table.push(data);
                    });
                    res({leagueIndex:leagueIndex,table:table,rowClass:rowClass});
                }).catch(err=>{rej(err);});
            });
        },
        AllMatchesEnded : function(){ //In live->match page
            let match_length = 1 + $('#match-observer > ul > li').length,
                end_match_length = ($('#'+currentLive.matchId).hasClass('ended')?1:0) + $('#match-observer > ul > li.ended').length;
            return match_length == end_match_length;
        },
        AreScoresUpdated : function(tryGetPage=0){
            delete this.AreScoresUpdated;
            return new Promise((res,rej)=>{
                Game.getPage('index.php?w='+worldId+'&area=user&module=main&action=home&layout=none','#matches').then(matches=>{
                    let last_matches = $(matches).find('ul.matches.last'),
                        scores_updated = !1
                    if(!last_matches.find('li.no-entry').length){
                        last_matches = last_matches.find('>li');
                        let match_day = new Date(parseInt(currentLive.matchId.split('_')[2])*1000).toLocaleDateString();
                        last_matches.each(function(){
                            let match = $(this);
                            if(match.find('li.type > span.match.league').length){
                                let match_dates = match.find('li.date').text().trim().split(/\s+/g); // return ["23.02.2019", "18:00:00"] or ["Bugün, "18:00:00"] ||  ["Today, "18:00:00"]
                                if(match_dates[0].length != 10 || match_dates[0] == match_day)
                                    scores_updated = !0;
                                return false;
                            }
                        });
                    }
                    res(scores_updated);
                }).catch(err=>{rej(err);});
            });
        },
        SetMatchIdForClub : function(table){
            delete this.SetMatchIdForClub;
            $('#match-observer>ul>li a[clubid]').each(function(){
                let a = $(this);
                table.find(c=>c.clubId==a.attr('clubid')).matchId = a.parents('li').first().attr('id').split('_')[a.parent().hasClass('squad-home')?0:1];
            });
            table.find(c=>c.clubId==currentLive.homeClubId).matchId = currentLive.homeId;
            table.find(c=>c.clubId==currentLive.awayClubId).matchId = currentLive.awayId;
        },
        SetOppenentId : function(table){
            table.forEach(c=>{
                let clubId = c.clubId,
                    oppenent_id = null;
                if(currentLive.homeClubId == clubId) oppenent_id = currentLive.awayClubId;
                else if(currentLive.awayClubId == clubId) oppenent_id = currentLive.homeClubId
                else{
                    $('#match-observer > ul > li').toArray().forEach(li=>{
                        li = $(li);
                        let a = li.find('a[clubid]');
                        if(a.toArray().find(a=>$(a).attr('clubid')==clubId)==undefined) return;
                        if(a.first().attr('clubid')==clubId) oppenent_id = a.last().attr('clubid')
                        else oppenent_id = a.first().attr('clubid');
                    });
                }
                if(oppenent_id!=null);
                c.oppenent_id = oppenent_id;
            });
        },

        GetCurrentScores : function(){
            delete this.GetCurrentScores;

            let scores = [];
            //Add current matches scores
            scores.push({
                home: {
                    id: currentLive.homeClubId
                },
                away: {
                    id: currentLive.awayClubId
                }
            });

            if($('#'+currentLive.matchId).hasClass('ended') && currentLive.timeElement.html()==1){ //Hükmen galibiyet
                let home_goals = $('#match-messages > li.info').first().find('span.away,span.home').first().attr('class')=="away"?3:0,
                    away_goals = home_goals==3?0:3;
                scores[0].home.goals = home_goals;
                scores[0].away.goals = away_goals;
            }
            else{
                scores[0].home.goals = parseInt($('#'+currentLive.matchId + '> span.score > div:first > span.score-home').text());
                scores[0].away.goals = parseInt($('#'+currentLive.matchId + '> span.score > div:first > span.score-away').text());
            }

            scores.push(...$('#match-observer > ul > li').toArray().map(li=>{
                return {
                    home: {
                        id: $('span.squad-home > a',li).attr('clubid'),
                        goals : parseInt($('> span.score > span.score-home',li).text())
                    },
                    away: {
                        id: $('span.squad-away > a',li).attr('clubid'),
                        goals : parseInt($('> span.score > span.score-away',li).text())
                    }
                };
            }));

            //Add other matches scores
            return scores;
        },
        CreateTableWithScores: function(scores, table, updated_table=false, fill_items=table){
            let factor = updated_table?-1:1,
                len = table.length,
                new_table = new Array(len);
            scores.forEach(score=>{
                let diffGoals = score.home.goals - score.away.goals,
                    points = diffGoals!=0?3:1,
                    idx1 = table.findIndex(c=>c.clubId==score.home.id),
                    idx2 = table.findIndex(c=>c.clubId==score.away.id),
                    home_= table[idx1],
                    away_= table[idx2],
                    home,away;

                new_table[idx1] = home = Object.create(home_);
                new_table[idx2] = away = Object.create(away_);

                home.points = home_.points + factor*points*(diffGoals>-1?1:0);
                away.points = away_.points + factor*points*(diffGoals<1?1:0);
                if(diffGoals!=0){
                    let key = diffGoals>0?'won':'lost';
                    home[key] = home_[key] + factor;
                    away[key = key=="lost"?'won':'lost'] = away_[key] + factor;
                }
                else{
                    home.drawn = home_.drawn + factor;
                    away.drawn = away_.drawn + factor;
                }
                home.gf = home_.gf + factor*score.home.goals;
                away.gf = away_.gf + factor*score.away.goals;
                home.ga = home_.ga + factor*score.away.goals;
                away.ga = away_.ga + factor*score.home.goals;
                home.average = home_.average + factor*diffGoals;
                away.average = away_.average + factor*diffGoals*-1;
            });

            for(let i=0; i<len ;i++){
                if(new_table[i]!==undefined) continue;
                new_table[i] = fill_items.find(c=>c.clubId==table[i].clubId);
            }

            return this.SortTable(new_table);
        },
        SortTable : function(table){
            return table.sort(function(a,b){
                let compare;
                if(compare = b.points - a.points) return compare; //En yüksek puana göre sırala
                else if(compare = b.average - a.average) return compare; //Averajı yüksek olan
                else if(compare = b.gf - a.ga) return compare; //Daha fazla gol atan
                return a.clubId - b.clubId; //Daha önce takım açan
            });
        },
        UpdateLiveLeagueTable : function(){
            $('#league-table > table > tbody').html('')
            function showChanged(diff){
                return diff!=0?`<span class="changed-property" style="margin-left:2px;">(${(diff>0?'+':'')+diff})</span>`:'';
            }
            console.log('old: %o\n,new: %o',this.old_table,this.new_table);
            this.new_table.forEach((club,i)=>{ //Add Row to Live League Table
                let club_old_index = this.old_table.findIndex(c=>c.clubId==club.clubId),
                    club_old = this.old_table[club_old_index],
                    rank_dif = club_old_index-i,
                    diff = ['played','won','drawn','lost','gf','ga','average','points'].reduce((acc,key)=>{
                        acc[key] = club[key]-club_old[key];
                        return acc;
                    },{}),
                    opp_idx = null;
                if(!isNaN(club.oppenent_id)) opp_idx = this.new_table.findIndex(c=>c.clubId==club.oppenent_id);
                $('#league-table > table > tbody').append(
                    `<tr class="${this.tableRowClass[i]} ${i%2?'even':'odd'}" ${[currentLive.homeId, currentLive.awayId].includes(club.matchId)?`style="background-color:#4854a8;"`:''} ${!isNaN(opp_idx) && opp_idx>-1?`opp_idx="${opp_idx}"`:''}>`+
                    `   <td>${i+1}</td>`+
                    `   <td>`+
                    `      <div class="icon ${rank_dif>0?'advancement':rank_dif<0?'relegation':'remain'}" ${rank_dif!=0?` title="${(rank_dif>0?'+':'')+rank_dif}"`:""}></div>`+
                    `    </td>`+
                    `    <td class="name-column">`+
                    `       <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${club.clubId}" clubid="${club.clubId}" ${club.clubId==Tool.clubId?'class="self-link"':''}>${club.clubName}</a>`+
                    `    </td>`+
                    `    <td style="color:black;">${club.played+showChanged(diff.played)}</td>`+
                    `    <td style="color:black;">${club.won+showChanged(diff.won)}</td>`+
                    `    <td style="color:black;">${club.drawn+showChanged(diff.drawn)}</td>`+
                    `    <td style="color:black;">${club.lost+showChanged(diff.lost)}</td>`+
                    `    <td style="color:black;">${club.gf+showChanged(diff.gf)}</td>`+
                    `    <td style="color:black;">${club.ga+showChanged(diff.ga)}</td>`+
                    `    <td style="color:black;">${club.average+showChanged(diff.average)}</td>`+
                    `    <td class="last-column" style="color: black;"><b>${club.points}</b>${showChanged(diff.points)}</td>`+
                    `</tr>`
                );
            });
        },
        StartToCatchNewGoals : function(){
            delete this.StartToCatchNewGoals;
            unsafeWindow.jQuery('<span id="NewGoalCatcher">').hide().appendTo('#content').click(function(_, matches_status){
                // matches_status: { "668262_667855_1550761200_league": { "status": "ended", "home_goals": 0, "away_goals": 3, "min": 1 }, "669559_669389_1550761200_league": { "status": "ended", "home_goals": 0, "away_goals": 1, "min": 93 }, "669599_106135_1550761200_league": { "status": "ended", "home_goals": 5, "away_goals": 0, "min": 92 } }
                if(!matches_status) return;
                let new_scores = [];
                console.log('New Goal Catcher: %o',matches_status);
                for(let matchId in matches_status){
                    if(matchId.split('_')[3]!='league') continue;
                    let match = matches_status[matchId];
                    new_scores.push({
                        home : {
                            id  : LiveLeagueTable.new_table.find(c=>c.matchId==matchId.split('_')[0]).clubId,
                            goals: match.home_goals
                        },
                        away : {
                            id  : LiveLeagueTable.new_table.find(c=>c.matchId==matchId.split('_')[1]).clubId,
                            goals: match.away_goals
                        },
                    });
                }

                LiveLeagueTable.new_table = LiveLeagueTable.CreateTableWithScores(
                    new_scores, //updated scores
                    LiveLeagueTable.old_table, //old scores in old table and new scores use to create a table
                    false, //create next table
                    LiveLeagueTable.new_table //old scores will not be updated
                );

                LiveLeagueTable.UpdateLiveLeagueTable();
            });
        },
        StartToCatchMatchEnd : function(){
            delete this.StartToCatchMatchEnd;
            unsafeWindow.jQuery('<span id="MatchEndCatcher">').hide().appendTo('#content').click(function(_, matchId){
                console.log("Match ended: "+matchId);
            });
        }
    };
    LiveLeagueTable.Initialize();
},null);
Tool.features.add('SortTournaments','tournament',function(){
    let upcoming_table = $('#tournaments > div.container.upcoming > div > table');
    if(upcoming_table.find('>tbody>tr').length==0) return false;

    let getDateNum = (date) => parseInt(((date=new Date((date=date.split('.'))[2],parseInt(date[1])-1,date[0]))-date.getTimezoneOffset()*60*1000)/86400000);
    if(!Tool.hasOwnProperty('tournaments_data')){
        $(CreateButton('BtnSortTournaments', GetText('SortTournaments'),'top:55px;')).insertAfter('#button-container-create-own-tournament').click(function(){
            $(this).off().remove();
            $('#tournaments-handle-container > li.handle').off();
            let total_tournaments = 0,
                tournaments = [], //except credits tournament
                other_pages = upcoming_table.find('> tfoot > tr > td > a'),
                page_count = 1 + other_pages.length;
            if(page_count == 1) saveTournament(upcoming_table.find('>tbody'), true, toolTipObj.data);/*save current page*/
            else{
                let cur_page_num=-1,
                    e = upcoming_table.find('> tfoot > tr > td > strong');
                if(e.length){
                    cur_page_num = parseInt(e.first().text());
                    saveTournament(upcoming_table.find('> tbody'), false, toolTipObj.data);/*save current page*/
                }
                let get_page_count = 0,
                    success_count = 0,
                    fail_count = 0;
                $('#button-container-create-own-tournament').after(
                    `<span style="position: absolute;top: 55px;right: 52px;">`+
                    `   <img src="/designs/redesign/images/icons/loading/16x16.gif" style="vertical-align:middle;margin-right: 3px;">`+
                    `   ${GetText('gettingPage')}: <span id="get_page_count">0</span>/${page_count-1} | ${GetText('success')}: <span id="success_count">0</span> | ${GetText('fail')}: <span id="fail_count">0</span>`+
                    `</span>`
                );
                let always=(data=null)=>{
                    let finish = get_page_count == page_count-1;
                    if(finish) $('#get_page_count').parent().find('img').first().remove();
                    if(data==null) return;
                    saveTournament(data.content, finish, data.tooltip);
                };
                Array.from({length: page_count}, (_, i) => i + 1).forEach(n=>{
                    if(n==cur_page_num) return;
                    Game.getPage(
                        `?area=user&module=tournament&action=index&section=upcoming&posupcoming=${(n-1)*20}&layout=none`,
                        '#tournaments> div.container.upcoming> div> table> tbody:first',
                        null, //callback
                        0, //fail counter
                        ['content','tooltip']
                    ).then(data=>{
                        data.tooltip = JSON.parse(data.tooltip);
                        if(!data.content.length || typeof data.tooltip != 'object') throw new Error("There is an error in the requested data.");
                        $('#get_page_count,#success_count').toArray().forEach(e=>{$(e).html(eval("++"+e.id))})
                        always(data)
                    }).catch(err=>{
                        $('#get_page_count,#fail_count').toArray().forEach(e=>{$(e).html(eval("++"+e.id))})
                        console.error(err);
                        always();
                    });
                });
            }

            function saveTournament(tbody, finish, tooltip){
                total_tournaments += tbody.find('tr').length;
                tbody.find('tr').each(function(i){
                    if($(this).find('.first-column > .credits').length) return;
                    let tournament_id = $(this).find(' td.info-column > a > img').attr('tooltip').replace('tt_',''),
                        tournament = {
                            has_psw : $(this).find('.first-column > .password').length?true:false,
                            name : $(this).find('.name-column:first>a').text().trim(),
                            id : tournament_id,
                            tt : tooltip['tt_'+tournament_id]
                        },
                        totalPrice = 0, koo = false;
                    $(tournament.tt).find('div.tournament-tooltip-table> table> tbody> tr').each(function(j){
                        if($(this).find('.last-column').length)
                            totalPrice += parseInt($(this).find('td.last-column > span > span.currency-number').text().split('.').join(''));
                        else{
                            koo = true;
                            return;
                        }
                    });
                    if(!koo){
                        let a = $(this).find('td:nth-child(4) > a').first(),
                            start = $(this).find('td:nth-child(5)').text().trim(),
                            end = $(this).find('td:nth-child(6)').text().trim();
                        tournaments.push(Object.assign({
                            totalPrice: totalPrice,
                            type: $(this).find('td:nth-child(3) > span')[0].className.replace('icon','').trim(),
                            club: {
                                id  : a.attr('clubid'),
                                name: a.text().trim()
                            },
                            start : start,
                            startK: getDateNum(start),
                            end : end,
                            endK: getDateNum(end),
                        },tournament));
                    }
                    else{
                        console.info(`The tournament named ${tournament.name}[id=${tournament.id}] is not included in the ranking]`);
                    }
                });
                if(finish){
                    console.info(`Total tournaments: ${total_tournaments}. Maximum ${tournaments.length} of them will be sorted and shown!`);
                    Tool.tournaments_data = {
                        tournaments: tournaments,
                        total: total_tournaments,
                        except: total_tournaments-tournaments.length //Credit tournaments size
                    };
                    if($('#get_page_count').length){
                        Tool.tournaments_data = Object.assign({
                            page_count: page_count-1,
                            get_page_count: parseInt($('#get_page_count').html()),
                            success_count: parseInt($('#success_count').html()),
                            fail_count: parseInt($('#fail_count').html())
                        },Tool.tournaments_data);
                    }
                    sortTournaments('money', 'DESC');
                    showTournaments();
                }
            }
        })[$('#tournaments-handle-container > li[target=".container.upcoming"]').hasClass('active')?'show':'hide']();

        $('#tournaments-handle-container > li.handle').click(function(){
            $('#BtnSortTournaments')[$(this).attr('target')==".container.upcoming"?'show':'hide']();
        });
    }
    else{
        if(Tool.tournaments_data.hasOwnProperty('page_count')){
            $('#button-container-create-own-tournament').after(
                '<span style="position: absolute;top: 55px;right: 52px;">'+
                `   ${GetText('gettingPage')}: ${Tool.tournaments_data.get_page_count}/${Tool.tournaments_data.page_count} | ${GetText('success')}: ${Tool.tournaments_data.success_count} | ${GetText('fail')}: ${Tool.tournaments_data.fail_count}`+
                '</span>'
            );
        }
        showTournaments(); /*Show saved tournaments*/
    }

    function showTournaments(){
        let thead_row = $('>thead>tr',upcoming_table).first();
        thead_row.before(
            `<tr style="background:none;">`+
            `   <th colspan="8" style="background-color: #075971;border-radius: 7px 7px 0 0;padding:5px;"><span id="sorted_tournaments_length" style="line-height: 1.4; white-space: break-spaces;">...</span></th>`+
            `</tr>`
        );

        $('>th:nth-child(5),>th:nth-child(6)',thead_row)
            .addClass('sort_tournaments')
            .attr({'sort_type':'date','order_by':'DESC'})
            .css('cursor','pointer');
        $('th:nth-child(6)',thead_row).after(`<th class="sort_tournaments" sort_type="money" order_by="ASC" style="cursor:pointer;">${GetText('totalprice')}</th>`);
        $('.sort_tournaments').click(function(){
            let order_by = $(this).attr('order_by');
            sortTournaments($(this).attr('sort_type'), order_by);
            updateTbody();
            $(this).attr('order_by',order_by=='ASC'?'DESC':'ASC');
        });

        $('>tfoot',upcoming_table).html('');

        let ownTournaments = [],
            own_tbody = $('#tournaments > div.container.own > div > table > tbody');
        if(own_tbody.find('.info-column').length){
            own_tbody.find('tr').each(function(){
                let icon = $(this).find('>td.first-column> span.icon'),
                    tournament = {
                        id: $(this).find('>td.info-column>a>img[tooltip]').attr('tooltip').replace('tt_',''),
                        type:'normal'
                    };
                if(icon.length){
                    if(icon.hasClass('password')) tournament.has_psw = true;
                    if(icon.hasClass('credits')) tournament.type='credits';
                    else if(icon.hasClass('tournament')) tournament.type='special';
                }
                ownTournaments.push(Object.assign({
                    start: getDateNum($(this).find('td:nth-child(4)').text().trim()),
                    end  : getDateNum($(this).find('td:nth-child(5)').text().trim())
                },tournament));
            });
        }

        let isTournamentIntersect = t1=>{
            let s1=t1.startK, e1=t1.endK;
            return undefined !== ownTournaments.filter(t2=>t2.type!='special').find(t2=>{
                let s2=t2.start, e2=t2.end;
                return (e1>=s2 && e1<=e2) || (s1<=e2 && s1>=s2);
            });
        }, tbody = $('>tbody',upcoming_table);
        updateTbody()

        function updateTbody(){
            tbody.html('');
            let intersect=0,
                i=0;
            Tool.tournaments_data.tournaments.forEach((t)=>{
                if(isTournamentIntersect(t)){ ++intersect; return;} // or set background-color:#00000099
                tbody.append(
                    `<tr class="${i++%2?"even":"odd"}">`+
                    `   <td class="first-column">${t.has_psw?`<span class="icon password"></span>`:``}</td>`+
                    `   <td class="name-column">`+
                    `      <a href="#/index.php?w=${worldId}&area=user&module=tournament&action=tournament&tournament=${t.id}">${t.name}</a>`+
                    `   </td>`+
                    `   <td>`+
                    `      <span class="icon ${t.type}" tooltip="tt_tournament_type_${t.type}"></span>`+
                    `   </td>`+
                    `   <td class="name-column">`+
                    `      <div class="club-logo-container"></div>`+
                    `      <a href="#/index.php?w=${worldId}&area=user&module=profile&action=show&clubId=${t.club.id}" clubid="${t.club.id}">${t.club.name}</a>`+
                    `   </td>`+
                    `   <td class="date-column" sortvalue="${t.startK}">${t.start}</td>`+
                    `   <td class="date-column" sortvalue="${t.endK}">${t.end}</td>`+
                    `   <td>${t.totalPrice.toLocaleString()}</td>`+
                    `   <td class="last-column info-column">`+
                    `      <a href="#/index.php?w=${worldId}&area=user&module=tournament&action=tournament&tournament=${t.id}">`+
                    `         <img src="/designs/redesign/images/icons/tooltip.gif" name="__tooltip" tooltip="tt_${t.id}">`+
                    `      </a>`+
                    `   </td>`+
                    `</tr>`
                );
                if(!toolTipObj.data.hasOwnProperty('tt_'+t.id)) toolTipObj.data['tt_'+t.id] = t.tt;
            });
            let total = Tool.tournaments_data.total,
                except = Tool.tournaments_data.except,
                attended = ownTournaments.length,
                shown = tbody.find('>tr').length,
                lines=[GetText('Tournament_total', {args:[`<font color="chartreuse">${total}</font>`]})],
                missing=0;

            if(except){
                lines.push(GetText('Tournament_except', {args:[`<font color="crimson">${except}</font>`]}));
                missing+=except;
            }
            if(intersect){
                if(missing==0){
                    lines.push(GetText('Tournament_intersect_1', {args:[`<font color="crimson">${intersect}</font>`, `<font color="chartreuse">${total}</font>`, `<font color="darkturquoise">${attended}</font>`]}));
                }
                else{
                    lines.push(GetText('Tournament_intersect_2', {args:[`<font color="crimson">${intersect}</font>`, `<font color="chocolate">${total-except}</font>`, `<font color="darkturquoise">${attended}</font>`]}));
                }
                missing+=intersect;
            }
            if(shown<total-missing){
                lines.push(GetText('Tournament_unknown', {args:[`<font color="crimson">${(total-missing)-shown}</font>`]}));
                missing+=(total-missing)-shown;
            }
            if(missing==0) lines[0]+=" "+GetText('Tournament_end_1', {args:[]});
            else{
                lines.push(GetText('Tournament_end_2', {args:[`<font color="mediumspringgreen" style="font-size: 15px;">${shown}</font>`]}));
            }
            $('#sorted_tournaments_length').html(lines.join('<br>'));
        }
    }
    function sortTournaments(type, order_by='DESC'){
        order_by=order_by=='DESC'?1:-1;
        switch(type){
            case "money":
                Tool.tournaments_data.tournaments.sort((a,b)=>order_by*(b.totalPrice-a.totalPrice));
                break;
            case "date":
                Tool.tournaments_data.tournaments.sort((a,b)=>order_by*(a.startK-b.startK));
                break;
        }
    }
},null);

(async ()=>{
    await new Promise(res=>{
        //updateLayout function is will declerate asap in body script tag.
        //When it is exist it will be updated to start detecting page changing
        Tool.intervals.create(function(){
            if(typeof unsafeWindow.updateLayout != 'function') return;
            this.delete();
            Game.startDetectingPageChanging();
            res();
        },20);
    });
    Tool.start();
})();

//FUNCTIONS
function CatchError(e,where){
    console.log('%c[FCUP-SCRİPT] %cERROR%c | '+ e + '%c\tIn'+where,'color:blue;font-weight:bold;','color:red;','','float:right;color:green;');
}

function SecToTime(s){
    //Converts seconds to [d [day|days]] hh:mm:ss
    if(s<0) return '-';
    let m = 0,h = 0,t='';
    if(s>59)
        if((m = parseInt(s/60))>59)
            if((h = parseInt(m/60))>23)
                t = parseInt(h/24)+' '+(h<48?GetText('aDay'):GetText('Days'))+' ';
    return t + Pad2(h%24)+':'+Pad2(m%60)+':'+Pad2(s%60);
}
function GetDateText(ms){
    // Converts milliseconds to d.m.Y H:i:s date format
    let d = new Date(ms);
    return Pad2(d.getDate())+"."+
        Pad2(d.getMonth()+1)+"."+
        d.getFullYear()+' '+
        Pad2(d.getHours())+":"+
        Pad2(d.getMinutes())+":"+
        Pad2(d.getSeconds());
}

function Pad2(a){
    return (a<10?"0":"")+a;
}
function GetOffset(el){
    let _x = 0,_y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: _y, left: _x};
}
function GetFuncContent(func){
    return (func=func.toString()).substring(func.indexOf('{')+1, func.lastIndexOf('}'));
}

function DownloadAsTextFile(text,filename){
    let object_URL = URL.createObjectURL(new Blob([text], {type: "text/plain"}));
    $('<a>').attr({'href':object_URL,'download':(filename||'Fcup Script Datas')+'.txt'})[0].click();
    URL.revokeObjectURL(object_URL);
}
function ReadTextFile(func){
    $('<input type="file" accept="text/plain">').change(function(e){
        let file = this.files[0];
        if(file.type == 'text/plain') {
            let reader = new FileReader();
            reader.onload = function() {
                func(reader.result);
            };
            reader.readAsText(file);
        }
    }).click();
}

function ShowDialog(div,header=undefined,setMid=true){
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    $('#container > .shadow').show();

    let focus = $('<div>').attr('id',div.id || null).css({
        'padding'   : '15px',
        'width'     : '580px',
        'wordWrap'  : 'break-word',
        'textAlign' : 'center!important',
        'box-sizing': 'border-box'
    }).css(div.css || {}).addClass('focus visible').addClass(div.class || null).html(div.content || '');

    if(typeof header == 'object'){
        let h2 = $('<h2>').css(header.css || {}).html(header.content || '').css({
            width        : '100%',
            paddingLeft  : '0px',
            paddingRight : '0px',
            top          : '0px',
            transform    : 'translateY(-100%)'
        });
        focus.prepend(h2);
    }

    if(div.footer) focus.append('<div class="footer"></div>');

    if(div.close) focus.append('<div class="close" style="position:absolute;top:-46px"></div>');

    $('#container').append(focus);

    let topOffset = 190;
    if(setMid){
        //Set In The Midst
        topOffset = 0/*$(window).scrollTop()*/ + ($(window).innerHeight() - focus.height()) / 2;
        if (topOffset < 190) topOffset = 190;
    }
    focus.css({
        'position': 'absolute',
        'top'     : topOffset + 'px',
        'left'    : ($(window).scrollLeft() + ($(window).innerWidth() / 2) - (focus.width() / 2 + focus.parent().offset().left)) + 'px'
    });
}
function CreateButton(id,value,buttonStyle='',spanStyle=''){
    return `<span class="button disHighlight" id="${id}" style="cursor:pointer; ${buttonStyle}">`+
        `   <a class="button" style="text-decoration:none;">`+
        `      <span style="${spanStyle}">${value}</span>`+
        `   </a>`+
        `</span>`;
}
function BlinkEvent(e,duration,duration2=2500,times=5){
    times = Math.max(times,1);
    if(e.attr('BlinkEvent')!=undefined){
        if(e.attr('BlinkEvent')!=0){
            e.attr('BlinkEvent',times);
            return;
        }
        else e.attr('BlinkEvent',times);
    }
    e.attr('BlinkEvent',times);
    e.css('background-color','#910e0ea8');
    f();
    let blink = setInterval(f, duration);
    function f(){
        e.fadeOut(duration/2);
        e.fadeIn(duration/2);
        let times = parseInt(e.attr('BlinkEvent'))||1;
        e.attr('BlinkEvent',--times);
        if(times<1){
            clearInterval(blink);
            setTimeout(()=>{
                if(e.attr('BlinkEvent')==0){
                    e.css('transition','background-color 1s').css('background-color','');
                    setTimeout(()=>{
                        if(e.attr('BlinkEvent')==0){
                            e.css('transition','');
                            e.removeAttr('BlinkEvent');
                        }
                    },1000);
                }
            },duration2);
        }
    }
}

function SaveLeagueData(cntnt){
    if(cntnt.find('.date-selector').length==0) return false;
    if(cntnt.find('div.table-container table > tbody a[clubid][class*="self-link"]').length==0) return false;

    let match_weeks = cntnt.find('.date-selector > ul >li.day').length,
        date = $('div > div.table-container > h3',cntnt)[0].textContent, // "Spieltag: 2 - 13.09.2020 18:00:00"
        idx1 = date.indexOf(':');
    if(idx1==-1) return false;
    idx1++;
    let idx2 = date.indexOf('-',idx1+1);
    if(idx2==-1) return false;
    let match_day_number = parseInt(date.substring(idx1,idx2)); //Exp: Return 2
    idx2++;
    let lastMatchDate = date.substring(idx2,date.indexOf(' ',date.indexOf('.',idx2+1)+1)).trim().split('.'),
        addDay = match_weeks-match_day_number,
        aDay = 24*60*60*1000; // ms
    if(match_day_number<match_weeks/2) addDay+=3; //League break days
    lastMatchDate = new Date(lastMatchDate[2],parseInt(lastMatchDate[1])-1,parseInt(lastMatchDate[0])+addDay).getTime();

    if(lastMatchDate+aDay<=Game.getTime()) return false;

    let firstMatchDate = lastMatchDate-(match_weeks-1+3)*aDay,
        firstHalfFinalMatchDate = firstMatchDate+(match_weeks/2-1)*aDay,
        clubs = {};
    cntnt.find('div.table-container table >tbody .name-column').each(function(){
        let a = $(this).find('a:first'),
            clubId = a.attr('clubid');
        if(clubId==Tool.clubId) return;
        clubs[clubId] = a.text().trim();
    });

    let LeagueData = {
        league                 : cntnt.find('select:first > option:selected').text().trim(),
        firstMatchDate         : firstMatchDate,
        firstHalfFinalMatchDate: firstHalfFinalMatchDate,
        lastMatchDate          : lastMatchDate,
        clubs                  : clubs
    };
    Tool.setVal('LeagueData',LeagueData);
    return LeagueData;
}
function IsYoungPlayer(td){
    return $(td).find('[tooltip="tt_extendNotPossibleJunior"]').length;
}
function GetRealStrength(skills,position){
    // skills: Float Array(14), positions: String
    let strengthFactors = Tool.strengthFactors[position];
    if(!Array.isArray(strengthFactors)) return "-";
    return strengthFactors.reduce((acc,i)=>acc+skills[i[0]]/28*i[1],0);
}
function FindNumberOfTraining(start,end){
    // start and end are dates ms
    if(end <= start) return 0;

    let normalTrainingsTimeCycle = [
        [36000, 54000],
        [36000, 54000],
        [25200, 36000, 54000],
        [36000, 54000]
    ],  premiumTrainingsTimeCycle = [[25200],[],[],[]],
        normalTrainingsInACycle = normalTrainingsTimeCycle.reduce((acc,v)=>acc+v.length,0),
        premiumTrainingsInACycle = premiumTrainingsTimeCycle.reduce((acc,v)=>acc+v.length,0),
        startDate = new Date(start),
        endDate = new Date(end),
        getDaySeconds = (date)=>date.getHours()*3600+ date.getMinutes()*60+ date.getSeconds(), //Return [0,86400]
        getDayIndex = (date)=>parseInt((date.getTime()-date.getTimezoneOffset()*60*1000)/86400000)%4,
        normalTrainings = 0,
        premiumTrainings = 0,
        addDayTrainings = (date,dayIndex,after=true)=>{
            let daySeconds = getDaySeconds(date);
            let a,b;
            normalTrainings += a = normalTrainingsTimeCycle[dayIndex].filter(time=>after?time>daySeconds:daySeconds>time).length;
            premiumTrainings += b = premiumTrainingsTimeCycle[dayIndex].filter(time=>after?time>daySeconds:daySeconds>time).length;
            return dayIndex;
        },
        getDaysBetweenDates = (s,e)=> (new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime() - new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime())/86400000-1;

    // 1- Calculate the day index using the start date and add trainings in the starting day.
    let dayIndex = getDayIndex(startDate);
    addDayTrainings(startDate,dayIndex);

    // 2- Başlangıç ve bitiş günleri arasındaki gün sayısını bul. Gün sayısını kullanarak döngü sayısını bul. Döngü kadar antrenman ekle
    let days = getDaysBetweenDates(startDate,endDate),
        cycle_count = parseInt(days/4);
    normalTrainings += cycle_count*normalTrainingsInACycle;
    premiumTrainings += cycle_count*premiumTrainingsInACycle;

    // 3- Döngüsü tamamlanmamış günleri tek tek ekle
    for(let i=0,len=days%4; i<len; i++){
        dayIndex = (dayIndex+1)%4;
        normalTrainings += normalTrainingsTimeCycle[dayIndex].length;
        premiumTrainings += premiumTrainingsTimeCycle[dayIndex].length;
    }

    // 4- Bitiş günündeki anrenman sayısını ekle
    dayIndex = (dayIndex+1)%4;
    addDayTrainings(endDate,dayIndex,false);

    return {normal: normalTrainings, premium: premiumTrainings};
}
function CalculateFutureStrength(start, end, skills, position, young, limit=990){
    let trainings = FindNumberOfTraining(start,end),
        training_score = young==true?parseInt(Tool.yTrainerLevel)+0.5: parseInt(Tool.trainerLevel)*0.25+0.5,
        next_skills = {
            normal : skills.slice(0),
            premium: skills.slice(0)
        },
        trainingRankingOfSkills = Tool.trainingPlan[position];

    for(let i=0, remaining_trainings=trainings.normal ; i < trainingRankingOfSkills.length && remaining_trainings>0 ; i++){
        let skillIndex = trainingRankingOfSkills[i],
            cur_value = skills[skillIndex];
        if(cur_value>=limit) continue;
        let apply_trainings = Math.min(
            remaining_trainings,
            GetMaxSkill(cur_value, training_score, limit).required_trainings
        );
        next_skills.premium[skillIndex] = next_skills.normal[skillIndex] = cur_value + (apply_trainings*training_score);
        remaining_trainings-=apply_trainings;
    }

    for(let i=0, remaining_trainings=trainings.premium ; i < trainingRankingOfSkills.length && remaining_trainings>0 ; i++){
        let skillIndex = trainingRankingOfSkills[i],
            cur_value = next_skills.premium[skillIndex];
        if(cur_value>=limit) continue;
        let apply_trainings = Math.min(
            remaining_trainings,
            GetMaxSkill(cur_value, training_score, limit).required_trainings
        );
        next_skills.premium[skillIndex] += apply_trainings*training_score;
        remaining_trainings-=apply_trainings;
    }

    return {
        current_strength: GetRealStrength(skills, position),
        future   : {
            normal : {
                strength : GetRealStrength(next_skills.normal, position),
                skills   : next_skills.normal,
                trainings: trainings.normal
            },
            premium:{
                strength : GetRealStrength(next_skills.premium, position),
                skills   : next_skills.premium,
                trainings: trainings.normal + trainings.premium
            }
        }
    };

}
function GetMaxSkill(curVal,trainingScore,limit=990){
    let diff = limit-curVal,
        numberOfTrainings = 0;
    if(diff>0){
        numberOfTrainings = Math.ceil(diff/trainingScore);
        curVal = Math.min(1000,curVal+numberOfTrainings*trainingScore);
    }
    return {max_value:curVal, required_trainings:numberOfTrainings};
}

function GetMessagesByTitle(title,func){
    let id,messages=[],message,_title;
    $('#deleteForm > table > tbody').find('.odd,.even').each(function(){
        id = $(this).attr('id').split('-')[1];
        message = $('#newscenter-preview-'+id);
        _title = message.find('h2').first().text().replace(/\s\s+/g, ' ').trim();
        if(_title == title) messages.push(message);
    });
    if(messages.length) func(messages);
}