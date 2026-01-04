// ==UserScript==
// @name         MTV Autofetch for upload.php
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  Autofill the upload form using TVDB/TVmaze API
// @license      MIT
// @author       Narkyy
// @match        https://www.morethan.tv/upload.php
// @match        https://www.morethan.tv/upload.php?requestid=*
// @match        https://morethan.tv/upload.php
// @match        https://morethan.tv/upload.php?requestid=*
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/41015/MTV%20Autofetch%20for%20uploadphp.user.js
// @updateURL https://update.greasyfork.org/scripts/41015/MTV%20Autofetch%20for%20uploadphp.meta.js
// ==/UserScript==

/* Initialize source arrays */
var scenearray = "LucidTV,EDHD,Scene,SH0W,0SEC,2HD,7SinS,aAF,ACED,AiRTV,ALTEREGO,AMBIT,AMBiTiOUS,ANGELiC,ANiVCD,ARCHiViST,ARiGOLD,ASAP,ASCENDANCE,AVCDVD,AVCHD,AVS,aWake,B4F,BAJSKORV,BALLS,BAMBOOZLE,BareHD,BARGE,BATV,BAWLS,BiA,BiGBruv,BiPOLAR,BiQ,BOV,BRAVERY,BRICKSQUaD,BRiGAND,BRISK,BRMP,BWB,C4TV,CABs,CAFFEiNE,CaRaT,Catchphraser,CBFD,CBFM,CCAT,CCCAM,CCCUNT,CHAMPiONS,CiA,CiNEFiLE,CLASSiC,CLUE,CNHD,COMPETiTiON,COMPULSiON,CONSCiENCE,CookieMonster,Counterfeit,CRAVERS,CREED,CREST,CRiMSON,CROOKS,CROSSFIT,CTU,CURIOSITY,D0NK,D2V,DAA,DAH,DEADPiXEL,DEADPOOL,DEAL,DeBTViD,DEFEATER,DEFiNiTE,DEFLATE,DEiMOS,DEMAND,DEMENTED,DEPTH,DERANGED,DETAiLS,DEUTERiUM,DHD,DiCH,DiFFERENT,DIMENSION,DiVERGE,DiVERSE,DiViSiON,DOCERE,DOMiNATE,DRAWER,DUKES,EDUCATiON,EiTheL,EPiC,ETACH,euHD,EVOLVE,EwDp,EXCELENTE,EXCELLENCE,EXECUTION,EXViD,FADE,FaiLED,FAIRPLAY,FARGIRENIS,FCC,FEET,FFNDVD,FiCO,FiHTV,FilmHD,FIRST,FKKHD,FKKTV,FLATLiNE,FLEET,FLHD,FoReVer,FoV,FQM,FRiSPARK,FTP,FULLSiZE,FUtV,GAMETiME,GAYTEAM,GECKOS,GERUDO,GHOULS,GORE,GOTEi,GOTHiC,GreenBlade,GRiP,GTVG,GUFFAW,GZCrew,HAGGiS,HALCYON,HD4U,HDMI,HDR,HILSWALTB,HOLiDAY,HUNTED,hV,HYBRiS,iFH,iFPD,iGNiTiON,iHD,iKUZE,iLM,iMCARE,IMMERSE,iMMORTALs,iNCiTE,iND,iNFiNiTE,iNGOT,INNOCENCE,INQUISITION,iNSPiRED,iNTENTiON,intothevoid,iOM,ITG,Japhson,JETSET,JHD,JMT,KFV,KILLERS,KLINGON,KmF,KNiFESHARP,KNOCKOUT,KOENiG,KYR,LCHD,LiBRARiANS,LiLDiCK,LiNKLE,LiViDiTY,LMAO,LOGiES,LOL,LPH,Ltu,LYCAN,m00tv,MACK4,MAJiKNiNJAZ,MaM,MARS,MATCH,MAYHEM,MEDiEVAL,MELON,MEMENTO,METCON,MiND,MiNDTHEGAP,MiNT,MiSFiTS,MOAB,MOBTV,MOMENTUM,MORiTZ,MOROSE,MoTv,MSE,MTB,MULTiPLY,NBCTV,NBS,NCAXA,NGCHD,NODLABS,NORDiCHD,NORiTE,NOSCREENS,NSN,OMER,OMiCRON,ORENJI,ORGANiC,OSiRiS,OSiTV,OUIJA,OVERTiME,P0W4,P0W4DVD,P2W,PANZeR,PCH,PFa,PHASE,PHOBOS,PiX,PLANET3,PLUTONiUM,PREMiER,PRiNCE,PSYCHD,PUCKS,PVR,QCF,QPEL,QRUS,RAPIDO,RCDiVX,RDVAS,RedBlade,REMARKABLE,REMAX,REWARD,RiTALiN,RiVER,ROVERS,RPTV,RRH,RTA,RTL,RUGGERZ,RUNNER,S0LD13R,SADPANDA,SAiNTS,SEMTEX,SERIOUSLY,SFM,SHOCKWAVE,SHORTBREHD,SiBV,SiNNERS,SiTiN,SKANK,SKGTV,SNOOZE,SNOW,SOAPBOX,SODAPOP,SomeTV,SONiDO,SORNY,SPAROOD,sPHD,SPLiTSViLLE,SPOCHT,SPRiNTER,SQUEAK,SRiZ,ss,STRiFE,SVA,SViNTO,sweHD,SweWR,SWOLLED,SYNS,SYS,TABULARiA,TARS,TASTETV,Taurine,TAXES,TBS,TCM,TCPA,TELEFUNKEN,TENEIGHTY,TERRA,TFiN,thebeeb,TINKERS,TLA,TNS,ToF,TOPAZ,TOPCAT,TRexHD,TRiPS,TRUEDEF,TURBO,TVA,TVBOX,TVBYEN,TViLLAGE,TVLoO,TvNORGE,TVP,TVSLiCES,TWG,uAuViD,UAV,uDF,UltraHD,UNTOUCHABLES,UNVEiL,URTV,UTOPiA,VALiOMEDiA,VeDeTT,VERUM,VH-PROD,ViD,VIDEOSLAVE,ViLD,VoMiT,W4F,W4Y,WaLMaRT,WALTERWHITE,WAT,WAVEY,WeFaiLED,WHEELS,WHiSKEY,WiDE,WiNNERS,WNN,WPi,xD2V,XOR,XORBiTANT,XPERT_HD,XTV,YELLOWBiRD,YesTV,ZZGtv,SPARKS,GECKOS,DRONES,BLOW,COCAIN,Replica,DiAMOND,Felony,SECTOR7,Larceny,Counterfeit,ROVERS,LPD,CiNEFiLE,LiBRARiANS,VoMiT,SADPANDA,VETO,AMIABLE,IAMABLE,SPOOKS,GHOULS,agw,CREEPSHOW,CREEPSHOWx,RedBlade,DoNE,BiPOLAR,FiCO,UNVEiL,WiDE,MULTiPLY,SiNNERS,PSYCHD,RUSTED,ARiES,NODLABS,HD4U,NOSCREENS,VALUE,GUACAMOLE,PHOBOS,USURY,TRiPS,RRH,MARS,TASTE,MOOVEE,7SiNS,DEPTH,PFa,KEBAP,AEROHOLiCS,GiMCHi,EiDER,SPRiNTER,FaiLED,MELiTE,CADAVER,WaLMaRT,JFKDVD,ENSOR,EwDp,HUMANiSM,TABULARiA,VH-PROD,iGNiTiON,iFAiL,OBiTS,ToF,ALLiANCE,ASSOCiATE,THUGLiNE,COW,Ltu,Counterfeit,Japhson,Felony,AN0NYM0US,BRMP,FRAGMENT,SiNCiTY,SAPHiRE,FUTURiSTiC,DEV0,GRiLL,Chakra,LoveGuru,REGARDS,LAP,MEGABOX,ONEY,iNTENSO,MANiC,aBD,JustWatch,FLABICIOUS,PussyFoot,SUMMERX,CHRONiCLER,EXCLUDED,SABENA,TERMiNAL,GETiT,HAiDEAF,WEST,NOMAAM,CURSE,HOTEL,LATENCY,GECiSFAGYi,UHDooDoo,SWAGGERUHD,LAZERS,CBGB,FilmHD,BAKED,NERV,FULLSiZE,TRUEDEF,PCH,CiNEMATiC,DiSRUPTiON,TAPAS,BRDC,BDA,watchHD,UltraHD,VEXHD,BLURRY,LCHD,MIDDLE,UNRELiABLE,WHiZZ,o0o,COASTER,SUPERSIZE,PTWINNER,OCULAR,ROUNDROBIN,KillerHD,KOREANSHIT,DUH,OMFUG,EMERALD,WhiteRhino,OLDHAM,iTWASNTME,SKG,CSOLHD,WESTCOAST".split(',');

var p2parray = "KiTTeN,KORPOS,SiGMA,BTN,BTW,ESPNtb,HiSD,HRiP,iPRiP,iT00NZ,JJ,LoTV,NTb,PreBS,TTVa,TVSmash,2Maverick,2T,449,A4N,aB,ABH,Abjex,Absinth,AFFY,AG,AJP69,ALANiS,AltHD,Anime-Koi,AREA11,Asenshi,AURA,AUTHORiTY,BatchGuy,BB,BDCop,beAst,BF1,BgFr,BitHQ,bLinKkY,BluDragon,BluHD,BluntzRip,BlurayDesuYo,Bob,Bobash,BOOP,BS,BYTE,C-W,Cache,CasStudio,CBM,CH,ChaosBlades,CHD,Chihiro,CHiNJiTSU,Chotab,Chyuu,CLARiTY,CLDD,CMS,CMSSide,CNN,Coalgirls,Commie,Coo7,COR,CP,CREATiVE24,Cthuko,CTL,CtrlHD,CYRUS,D-Z0N3,DameDesuYo,DarkHollow,DaViEW,dbR,decibeL,denpa,DiFUN,DLBR,DmonHiro,DoA,Doki,DOLEMiTE,DON,doosh,Doremi,DRACULA,DWJ,DX-TV,Ebi,EbP,ECI,EDL,ELANOR,eMperor,EPSiLON,ESiR,Euc,EucHD,EV1LAS,EveTaku,Exiled-Destiny,FANT,FFF,Final8,FiNCH,FraMeSToR,FREAKS,gc04,gg,GJM,GoApe,Grassy,Green,GS,GTi,h264iRMU,HANDJOB,Handy,Hatsuyuki,HDAccess,HDB,HDCLUB,HDS,HDWinG,HDWTV,HDxT,HeBits,Hector,HERO,Hien,HiFi,Hiryuu,HoodBag,HOPELESS,HorribleSubs,HPotter,HQC,HRD,HT,HTTV,Hukumuzuku,HWD,HWE,Hype,iMPUDiCiTY,Introspective,iNVULTUATiON,iON,iPOP,Irishman,iTRY,IWStreams,jAh,JCH,jhonny2,JiZZA,JohnGalt,Juggalotus,JungleBoy,k3n,KAGA,Kaylith,KCRT,kingofosiris,KiNGS,KiSHD,KRaLiMaRKo,LEGiON,LiBERTY,LiGHTSPEED,LIMO,Link420,lulz,M0ar,matt42,MD,MEECH,Mezashite,MiCDROP,Migoto,MiMa,MissDream,MMI,monkee,MOS,MW,MYSELF,NEXT,NFHD,NORMIES,NorTV,NovaRip,NT,NTG,Nub,NuMbErTw0,NY2,NyanTaku,OOO,Oosh,OZC,panos,Pcar,pcsyndicate,Penumbra,Phr0stY,Piranha,PISTA,PLAYNOW,PLAYREADY,playTV,PLRVRTX,POD,Poke,PPKORE,ProdQc,PSiG,PublicHD,PWE,QOQ,QuebecRules,QUEENS,R2D2,Raizel,RARBG,RAS,RCG,RDF,Reborn4HD,RED,RedJohn,ReDone,Rizlim,RKSTR,RTFM,RTN,RUDOS,Ryu,RZF,SA89,SallySubs,saMMie,SbR,SDH,Secludedly,SFH,SHiELD,sHoTV,SiGMA,Silver007,Sir.Paul,SLiME,smcgill1969,SMODOMiTE,SOAP,SRS,StarryNights,Sticky83,SWC,Sweet-Star,SynHD,TAiLGATE,TAR,TayTO,TB,TeamCoCo,testttt,TheBox,THORA,THoRCuATo,TiGHTBH,tlacatlc6,tNe,tonic,TOPKEK,TRiAL,TrollHD,TrollUHD,TrueHD,TSTN,Tsundere,TT,TTL,TURTLE,TVCUK,TVV,TxN,TYT,Underwater,UNPOPULAR,UTW,Vawn,VietHD,ViLLAiNS,ViPER,ViSUM,Vivid,VLAD,wAm,WAREZNiK,WB,WBS,WDTeam,Weby,WHR,WhyNot,WiKi,WINNEBAGO,WITH,WLR,WRCR,WTB,WYW,XAA,XEON,XWT,yAzMMA,YFN,Yonidan,ZR1,Zurako".split(',');

var regexscenegroups = new RegExp( '\^\('+scenearray.join( "|" )+'\)\$', "i");
var regexp2pgroups = new RegExp( '\^\('+p2parray.join( "|" )+'\)\$', "i");

var tvbool = false;
var moviebool = false;
var miniseries_bool = false;

var tv_regex = /^.+S([0-9].+?)E([0-9].+?)(\.|\s)/i;
var group_regex = /^(.+\-(.+?))(\.|$)/i;
var series_regex = /^(.+?)(.S[0-9].+?)/i;
var series_regex_maze = /^(.+?)(?=.20\d\d.S[0-9].+?)/i
var alt_series_regex = /^(.+?).(20\d\d.\d\d.\d\d)/i;
var region_regex = /(.+?)(\.|\s)(US|UK|CA)(\.|\s)/i;
var miniseries_regex = /^(.+?)(.(S[0-9]+|720p|1080p|HDTV|WEB-DL|WEBRip|[.]WEB[.]|BluRay|DVD|BDRip).+)/i;
var season_regex = /^.+[^\-]S([0-9].+?)/i;
var year_regex = /(\d.+?)\-/i;
var alt_year_regex = /^(.+?).(20\d\d).\d\d.\d\d/i;
var movie_year_regex = /(19\d\d|20\d\d)(\.|\s)/i;
var tvmaze_nameyear_regex = /^.+?(20\d\d).S[0-9].+?/i;
var tvmaze_url_to_seriesname_regex = /.+\/(.+)/;

var input_text;

var rls_name;
var parsed_seriesname;
var groupmatch;

var source;
var season;
var episode;
var padded_season;
var padded_episode;
var year;
var pack;

var mediacodec;
var resolution;
var audiocodec;

var tvdbid;
var status_show;

var seriesname;
var genres;
var synopsis;
var imdbid;
var imdblink;
var poster;
var bannerfile;
var actors = "";
var ep_overview = "";
var ep_name = "";

var desc_top = "";

var searchURL = "https://api.thetvdb.com/search/series?name=";
var manualSearch = "https://api.thetvdb.com/series/";
var manual_override = false;

var refreshcount = 0;

var selectedAPI;

var mazeSearchURL = "https://api.tvmaze.com/search/shows?q=";
var mazeManualSearch = "https://api.tvmaze.com/shows/";

var ext_tvdb;
var tvdb_url;
var tvdb_title

var tvmaze_url;
var alt_tvdbname;

if(GM_getValue("selectedapi")){
    selectedAPI = GM_getValue("selectedapi");
}
else {
    selectedAPI = "tvmaze";
}

// Add UI
(function() {
    $("#upload_table").before("<input type='button' id='btn_refresh' value='Refresh'>");
    $("#btn_refresh").before("<input type='number' id='tvdb_input'>");
    $("#tvdb_input").before("<p id='api_label'><b>TVDB API</b></p>");
    $("#api_label").append("<div style='width:5px; display:inline-block;'></div><input type='radio' id='apiradio_tvdb' name='api_input' style='vertical-align:middle;'/><div style='width:20px; display:inline-block;'>"
                           +"</div><span id='tvmaze_label' style='padding-right:5px;'><b>TVmaze API</b></span><input type='radio' id='apiradio_tvmaze' name='api_input' style='vertical-align:middle;'/>");
    $("#btn_refresh").after('<div id="matched_ui"><p id="matched_label" style="font-size:12px;"><b>TVDB Link: </b><a href="" id="matched_url" target="_blank"><span id="matched_show" style="font-size:13px;">test</span></a></div>');
    $("#matched_ui").hide();

    $("#btn_refresh").on("click", function () {
        if($("#tvdb_input").val()){
            tvdbid = $("#tvdb_input").val();
            manual_override = true;
        }
        ep_overview = "", ep_name = "";
        moviebool = false, tvbool = false, miniseries_bool = false;

        $("#upload_table input:text, textarea").not('[id*=trailer], [id=other_bitrate]').each(function(){
            $(this).css({"background-color": 'white'});
            $(this).off();
        });

        refreshInfo();
    });

    $("input[id^='apiradio']").on("click", function() {

        if(this.id.includes(selectedAPI)){
            return;
        }

        if(this.id == "apiradio_tvdb"){
            selectedAPI = "tvdb";
            confTVDB();
        }
        else if(this.id == "apiradio_tvmaze"){
            selectedAPI = "tvmaze";
        }

        GM_setValue("selectedapi", selectedAPI);
        //console.log("Selected API: "+selectedAPI);
    });
}());

//Default values
document.getElementById("categories").selectedIndex = 1;
$("#apiradio_"+selectedAPI).prop("checked", true);
confTVDB();

//When torrent is added, do everything
$("#file").on("change", refreshInfo);

function confTVDB(){
    if(selectedAPI == "tvdb"){
        var confirm;

        if(GM_getValue("tvdbconf") == "false" && (!GM_getValue("apikey") && !GM_getValue("userkey") && !GM_getValue("username"))){
            confirm = prompt('Configure TVDB API now?');
        }

        if(confirm != "no" && confirm || (GM_getValue("tvdbconf") == "true" && (!GM_getValue("apikey") || !GM_getValue("userkey") || !GM_getValue("username")))){
            GM_setValue("tvdbconf", "true");
            checkTVDBConfig();
        }
        else if (!GM_getValue("apikey") && !GM_getValue("userkey") && !GM_getValue("username")){
            GM_setValue("tvdbconf", "false");
        }
    }
}

function refreshInfo() {

    if(selectedAPI == "tvdb"){
        renewTVDBToken();
    }

    if($("#tvdb_input").val()){
        tvdbid = $("#tvdb_input").val();
        manual_override = true;
    }

    if($("#title").val()){
        input_text = $("#title").val();
    }
    else{
        input_text = $("#file").val().replace(/^.*\\/, "");
    }

    if(miniseries_bool){
        var match = miniseries_regex.exec(input_text);
        input_text = match[1] + ".S01"+ match[2];
    }

    if(group_regex.test(input_text)){
        rls_name = group_regex.exec(input_text)[1];
        groupmatch = group_regex.exec(rls_name)[2];
    }
    else{
        console.log("Error parsing file name, name not standard.");
        return;
    }

    year = "";

    mediacodec = parseMedia(rls_name);
    resolution = parseResolution(rls_name);
    audiocodec = parseAudio(rls_name, mediacodec[0], resolution);

    //Check if the release is actually TV (SXXEXX)
    //Type (TV or Movies)
    if(series_regex.test(rls_name) || alt_series_regex.test(rls_name)){
        document.getElementById("categories").selectedIndex = 1;
        tvbool = true;
    }
    else {
        document.getElementById("categories").selectedIndex = 0;
        moviebool = true;
    }

    if(tvbool){
        var url_final;

        source = 1;
        pack = !tv_regex.test(rls_name);

        if(pack){
            if(!alt_series_regex.test(rls_name)){
                season = season_regex.exec(rls_name)[1].replace(/^0+/, '');
                episode = 1;
                padded_season = season_regex.exec(rls_name)[1];
            }
            else{
                season = alt_year_regex.exec(rls_name)[2];
            }
        }
        else{
            season = season_regex.exec(rls_name)[1].replace(/^0+/, '');
            episode = tv_regex.exec(rls_name)[2].replace(/^0+/, '');
            padded_season = season_regex.exec(rls_name)[1];
            padded_episode = tv_regex.exec(rls_name)[2];
        }

        if(alt_series_regex.test(rls_name)){
            parsed_seriesname = alt_series_regex.exec(rls_name.toLowerCase())[1].replace(/\./g,'%20');
        }
        else if(region_regex.test(rls_name)){
            parsed_seriesname = region_regex.exec(rls_name.toLowerCase())[1].replace(/\./g,'%20');
        }
        else {
            if(selectedAPI == "tvdb"){
                parsed_seriesname = series_regex.exec(rls_name.toLowerCase())[1].replace(/\./g,'%20');
            }
            else{
                if(tvmaze_nameyear_regex.test(rls_name)){
                    parsed_seriesname = series_regex_maze.exec(rls_name.toLowerCase())[1].replace(/\./g,'%20');
                }
                else{
                    parsed_seriesname = series_regex.exec(rls_name.toLowerCase())[1].replace(/\./g,'%20');
                }
            }
        }

        if(!manual_override){
            if(selectedAPI == "tvdb"){
                url_final = searchURL + parsed_seriesname;
            }
            else{
                url_final = mazeSearchURL + parsed_seriesname;
            }
        }
        else{
            if(selectedAPI == "tvdb"){
                url_final = manualSearch + tvdbid;
            }
            else{
                url_final = mazeManualSearch + tvdbid;
            }
        }

        if(selectedAPI == "tvdb"){
            console.log("Getting main info from TVDB");
            //Get TVDB ID
            GM_xmlhttpRequest({
                method: "GET",
                url: url_final,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + GM_getValue("tvdbtoken")
                },
                onload: function(response) {
                    var parser = JSON.parse(response.responseText);

                    //console.log(response.responseText);
                    if(!parser.Error){
                        if(!manual_override){
                            tvdbid = parser.data[0].id;
                        }

                        getSeriesInfo();
                    }
                    else{
                        console.log("Error parsing TVDB response: TVDB ID")
                        return;
                    }
                }
            });
        }
        else if (selectedAPI == "tvmaze"){

            console.log("Getting main info from TVmaze");
            //Get show from release name
            GM_xmlhttpRequest({
                method: "GET",
                url: url_final,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    var parser = JSON.parse(response.responseText);

                    if(!parser.Error){
                        if(!manual_override){
                            tvdbid = parser[0].show.id;
                        }
                        //console.log(tvdbid);

                        getSeriesInfoMaze();
                    }
                    else{
                        console.log("Error parsing response: TVmaze init request");
                        return;
                    }
                }
            });
        }
    }
    else if(moviebool){

        if(movie_year_regex.test(rls_name)){
            year = movie_year_regex.exec(rls_name)[1];
            seriesname = "";

            mediacodec = parseMedia(rls_name);
            resolution = parseResolution(rls_name);
            audiocodec = parseAudio(rls_name, mediacodec[0], resolution);

            populateFields();
        }
        else{
            console.log("No Season, no year, must be a miniseries!");
            moviebool = false;
            miniseries_bool = true;
            refreshInfo();
        }
    }

}

function getSeriesInfo(){

    //Get series info
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.thetvdb.com/series/" + tvdbid,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GM_getValue("tvdbtoken")
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error){

                seriesname = parser.data.seriesName;
                genres = parser.data.genre;
                synopsis = parser.data.overview;
                imdbid = parser.data.imdbId;
                imdblink = "https://www.imdb.com/title/" + imdbid;
                tvdb_url = "https://www.thetvdb.com?id="+tvdbid+"&tab=series";

                genres = genres.toString().replace(/,/g, ', ').toLowerCase();
                //console.log(seriesname +"\n"+genres +"\n"+synopsis+"\n"+imdblink);
            }
            else{
                console.log("Error parsing response: TVDB ID Lookup");
                return;
            }
        }
    });

    //Get year and episode info
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.thetvdb.com/series/"+tvdbid+"/episodes/query?airedSeason="+season+"&airedEpisode="+episode,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GM_getValue("tvdbtoken")
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error){
                year = year_regex.exec(parser.data[0].firstAired)[1];
                ep_overview = parser.data[0].overview;
                ep_name = parser.data[0].episodeName;

                //console.log(year+"\n"+ep_overview+"\n"+ep_name);
            }
            else{
                console.log("Error parsing response: TVDB Episode Lookup");
                return;
            }
        }
    });

    //Get poster URL
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.thetvdb.com/series/"+tvdbid+"/images/query?keyType=season&subKey="+season,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GM_getValue("tvdbtoken")
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error){

                var max_rating = 0;
                var index_best = 0;
                for(var i in parser.data){
                    var cur_rating = parser.data[i].ratingsInfo.average;
                    if(max_rating < cur_rating){
                        max_rating = cur_rating;
                        index_best = i;
                    }
                }

                bannerfile = parser.data[index_best].fileName;
                poster = "https://www.thetvdb.com/banners/" + bannerfile;
                //console.log(poster);
            }
            else{
                console.log("TVDB: Getting alternative poster");
                getAlternativePoster();
            }
        }
    });

    //Get actor list
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.thetvdb.com/series/"+tvdbid+"/actors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GM_getValue("tvdbtoken")
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);
            actors = "";

            if(!parser.Error){

                var n = 0;
                for(var i in parser.data){
                    if(n<=15){
                        if(parser.data[i].role){
                            actors += parser.data[i].name.replace(/\t/g, '') + " (" + parser.data[i].role.replace(/\t/g, '') +") | ";
                        }
                        else{
                            actors += parser.data[i].name.replace(/\t/g, '') +" | ";
                        }
                    }
                    n++;
                }

                actors = actors.substring(0, actors.length - 3);
                //console.log(actors);

                setTimeout(populateFields, 500);
            }
            else{
                console.log("Error parsing response: TVDB Actor Lookup");
                return;
            }
        }
    });
}

function getAlternativePoster(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.thetvdb.com/series/"+tvdbid+"/images/query?keyType=poster",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GM_getValue("tvdbtoken")
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error){

                var max_rating = 0;
                var index_best = 0;
                for(var i in parser.data){
                    var cur_rating = parser.data[i].ratingsInfo.average;
                    if(max_rating < cur_rating){
                        max_rating = cur_rating;
                        index_best = i;
                    }
                }
                bannerfile = parser.data[index_best].fileName;
                poster = "https://www.thetvdb.com/banners/" + bannerfile;
            }
            else{
                console.log("TVDB Error retrieving alternative poster");
                return;
            }
        }
    });
}

function getSeriesInfoMaze(){

    //Get series info
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.tvmaze.com/shows/" + tvdbid,
        headers: {
            "Content-Type": "application/json",
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error && parser.length != 0){

                seriesname = parser.name;
                genres = parser.genres;
                synopsis = $(parser.summary).text();
                imdbid = parser.externals.imdb;
                imdblink = "https://www.imdb.com/title/" + imdbid;
                ext_tvdb = parser.externals.thetvdb;
                tvmaze_url = parser.url.replace("http://", "https://");

                poster = parser.image.original.replace("http://", "https://");
                genres = genres.toString().replace(/,/g, ', ').toLowerCase();

                if(!imdbid){
                    imdblink = null;
                }

                //If TVmaze has no record of a TVDB ID
                if(ext_tvdb){
                    tvdb_url = "https://www.thetvdb.com?id="+ext_tvdb+"&tab=series";
                }
                else if (tvmaze_url_to_seriesname_regex.test(tvmaze_url)){
                    alt_tvdbname = tvmaze_url_to_seriesname_regex.exec(tvmaze_url)[1];
                    tvdb_url = "https://www.thetvdb.com/series/"+alt_tvdbname;
                }

                //console.log(seriesname +"\n"+genres +"\n"+synopsis+"\n"+imdblink+"\n"+poster+"\n"+ext_tvdb);
            }
            else{
                console.log("Error parsing response: TVmaze ID Lookup");
                return;
            }
        }
    });
    //Get year and episode info
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.tvmaze.com/shows/"+tvdbid+"/episodebynumber?season="+season+"&number="+episode,
        headers: {
            "Content-Type": "application/json",
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error){
                if(parser.status != "404"){
                    year = year_regex.exec(parser.airdate)[1];
                    ep_overview = $(parser.summary).text();
                    ep_name = parser.name;
                }
                else{
                    console.log("Episode info not found!");
                }
                //console.log(year+"\n"+ep_overview+"\n"+ep_name);
            }
            else{
                console.log("Error parsing response: TVmaze Episode Lookup");
                return;
            }
        }
    });

    //Get actor list
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.tvmaze.com/shows/"+tvdbid+"/cast",
        headers: {
            "Content-Type": "application/json",
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);
            actors = "";

            if(!parser.Error){

                var n = 0;
                for(var i in parser){
                    if(n<=15){
                        if(parser[i].character.name){
                            actors += parser[i].person.name.replace(/\t/g, '') + " (" + parser[i].character.name.replace(/\t/g, '') +") | ";
                        }
                        else{
                            actors += parser[i].person.name.replace(/\t/g, '') +" | ";
                        }
                    }
                    n++;
                }

                actors = actors.substring(0, actors.length - 3);
                //console.log(actors);

                getTVDBTitle();
            }
            else{
                console.log("Error parsing response: TVmaze Cast Lookup");
                return;
            }
        }
    });
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)(?!in|the)\S/g, function(a) { return a.toUpperCase(); });
};

function parseMedia(title){
    var media_regex = /^.+?(HDTV|WEB-DL|WEBRip|[.]WEB[.]|BluRay|DVD|BDRip)/i;
    var codec_regex = /^.+?(x264|x265|H.264|H264|MPEG2)/i;
    var media;
    var codec;
    var index_media = 12;
    var index_codec = 10;

    if(media_regex.test(title) && codec_regex.test(title)){
        media = media_regex.exec(title.toLowerCase())[1];
        codec = codec_regex.exec(title.toLowerCase())[1];

        switch(media){
            case "hdtv":
                index_media = 1;
                break;
            case "web-dl":
                index_media = 3;
                break;
            case ".web.":
                index_media = 3;
                break;
            case "webrip":
                index_media = 4;
                break;
            case "bluray":
                index_media = 6;
                break;
            case "dvd":
                index_media = 7;
                break;
            case "bdrip":
                index_media = 6;
                break;
            default:
                index_media = 12;
        }

        switch(codec){
            case "x264":
                index_codec = 1;
                break;
            case "h264":
                index_codec = 4;
                break;
            case "h.264":
                index_codec = 4;
                break;
            case "mpeg2":
                index_codec = 9;
                break;
            default:
                index_codec = 10;
        }
    }

    return [index_media, index_codec];
}

function parseResolution(title){
    var res_regex = /^.+?(480p|720p|1080p|1080i|2160p)/i;
    var resolution;
    var index_res = 1;

    if(res_regex.test(title)){
        resolution = res_regex.exec(title.toLowerCase())[1];

        switch (resolution){
            case "480p":
                index_res = 1;
                break;
            case "720p":
                index_res = 2;
                break;
            case "1080p":
                index_res = 3;
                break;
            case "1080i":
                index_res = 4;
                break;
            case "2160p":
                index_res = 6;
                break;
            default:
                index_res = 1;
        }
    }

    return index_res;
}

function parseAudio(title, media, resolution){
    var ac3_regex = /(DD|DD\+|DDP)(.\d|\d).+?\./i;
    var flac_regex = /^.+?(FLAC)/;
    var aac_regex = /^.+?(AAC(.\d|\d).+?)\./i;
    var dts_regex = /(DTS)/i;

    var hd_res = [2,3,4,6];

    var index_audio = 7;

    if(ac3_regex.test(title)){
        index_audio = 1;
    }
    else if(flac_regex.test(title)){
        index_audio = 2;
    }
    else if(aac_regex.test(title)){
        index_audio = 3;
    }
    else if(dts_regex.test(title)){
        index_audio = 6;
    }
    if(index_audio != 7){
        return index_audio;
    }
    else{
        if(resolution == 1 || groupmatch == "TBS"){
           index_audio = 3;
        }
        else if(hd_res.includes(resolution)){
           index_audio = 1;
        }
    }
    return index_audio;
}

function populateFields(){

    //Torrent title
    $("#title").val (rls_name);

    if (tvdb_title){
        console.log("Got extra info from TVDB");
        seriesname = tvdb_title;
    }

    if((selectedAPI == "tvmaze" && (ext_tvdb || alt_tvdbname)) || selectedAPI == "tvdb"){
        $("#matched_ui a span").text(seriesname).css("color", "#009b24");
        $("#matched_url").attr("href", tvdb_url);
        $("#matched_ui").show();
    }
    else{
        $("#matched_label b").text("TVmaze Link: ");
        $("#matched_ui a span").text(seriesname).css("color", "#31e08b");
        $("#matched_url").attr("href", tvmaze_url);
        $("#matched_ui").show();
    }

    //Series
    $("#artist").val (seriesname);

    //Check if it's P2P or Scene
    //List from BTN
    if(regexp2pgroups.test(groupmatch)){
        source = 3;
    }
    if(regexscenegroups.test(groupmatch)){
        source = 4;
    }
    if(rls_name.toLowerCase().includes("web-dl")){
        source = 3;
    }

    document.getElementById("releasetype").selectedIndex = source;

    document.getElementById("media").selectedIndex = mediacodec[0];
    document.getElementById("format").selectedIndex = mediacodec[1];
    document.getElementById("bitrate").selectedIndex = resolution;
    document.getElementById("AudioContainer").selectedIndex = audiocodec;
    document.getElementById("MediaContainer").selectedIndex = 3;

    //Genres
    $("#tags").val (genres);

    if(!pack){
        if(!ep_overview){
            desc_top = "[b][align=center]"+seriesname+" S"+padded_season+"E"+padded_episode+" - "+ep_name+"[/align][/b]\n\n";
        }
        else{
            desc_top = "[b][align=center]"+seriesname+" S"+padded_season+"E"+padded_episode+" - "+ep_name+"[/align]\nEpisode Overview:[/b]\n[hide]"+ep_overview+"[/hide]\n\n";
        }
    }
    else{
        desc_top = "";
    }

    //Description
    if(moviebool){
        desc_top = "";
        $("#release_desc").val ("[hide=MediaInfo][/hide]\n[hide=Screenshots][/hide]");
    }
    else{
        $("#release_desc").val (desc_top+"[hide=MediaInfo][/hide]\n[hide=Screenshots][/hide]");
    }

    //If not a pack, add episode number
    if(!pack){
        $("#group_wiki_tvepisode #group_wiki_tvepisode").val (episode);
    }
    $("#group_wiki_tvseries #group_wiki_tvseries").val (season);

    //Year
    if(!alt_series_regex.test(rls_name)){
       $("#year_tr #year").val (year);
    }
    else{
        year = alt_year_regex.exec(rls_name)[2];
        $("#year_tr #year").val (year);
    }

    //IMDB Link
    $("#group_wiki_imdb #group_wiki_imdb").val (imdblink);

    //Poster URL
    $("#image").val (poster);

    //Cast
    $("#group_wiki_cast").val (actors);

    //Synopsis
    $("#group_wiki_synopsis").val (synopsis);

    console.log("Filled the fields")
        $("#upload_table input:text, textarea").not('[id*=trailer], [id=other_bitrate]').each(function(){
        if(!$(this).val()){
            if(this.id == "tags"){
                console.log("Missing Genres");
            }
            if(! (pack && this.id == "group_wiki_tvepisode")){
                $(this).css({"background-color": '#e57367'});

                $(this).on("input", function(){
                    $(this).css({"background-color": 'white'});
                    $(this).off();
                });
            }
            //console.log(this);
        }
    });

    //console.log(rls_name+"\n"+seriesname+"\n"+genres+"\n"+ep_name+"\n"+ep_overview+"\n"+year+"\n"+poster+"\n"+actors+"\n"+synopsis);
}

//Requests the TVDB page to get:
//Series name, genres, IMDB ID
function getTVDBTitle(){
    if(alt_tvdbname || ext_tvdb){
        GM_xmlhttpRequest({
            method: "GET",
            url: tvdb_url,
            onload: function(response) {
                var tvdbtitleregex = /<h1.+>(.+)<\/h1>/i;
                var series_info = $($.parseHTML(response.responseText)).find('#series_basic_info li');

                if(tvdbtitleregex.test(response.responseText)){
                    tvdb_title = tvdbtitleregex.exec(response.responseText)[1];
                    var tvdb_genres = $($(series_info)[5]).find("span").text().toLowerCase();
                    var tvdb_imdb = $($(series_info)[8]).find("span").text();

                    if(!imdbid && tvdb_imdb){
                        imdblink = "https://www.imdb.com/title/" + tvdb_imdb;
                    }
                    if(tvdb_genres){
                        genres = tvdb_genres;
                    }
                }
                else{
                    console.log("Couldn't get extra TVDB info");
                    alt_tvdbname = null;
                }

                //console.log(tvdb_title+"\n"+genres + "\n"+imdblink);
                setTimeout(populateFields, 500);
            }
        });
    }
    else{
        console.log("Couldn't get extra TVDB info: No TVDB ID on TVmaze");
        setTimeout(populateFields, 500);
    }
}

function checkTVDBConfig(){
    if(!GM_listValues().includes("apikey") || !GM_getValue("apikey")){
        var apikey = prompt('Enter TVDB API Key');

        if(apikey){
            GM_setValue("apikey", apikey);
        }
    }
    if(!GM_listValues().includes("userkey") || !GM_getValue("userkey")){
        var userkey = prompt('Enter TVDB Unique ID');

        if(userkey){
            GM_setValue("userkey", userkey);
        }
    }
    if(!GM_listValues().includes("username") || !GM_getValue("username")){
        var username = prompt('Enter TVDB Username');

        if(username){
            GM_setValue("username", username);
        }
    }
}

function renewTVDBToken(){
    if(!GM_listValues().includes("tvdbexpiry") || GM_getValue("tvdbexpiry") < Date.now()){

        var initpost = JSON.stringify({"apikey":GM_getValue("apikey"), "userkey":GM_getValue("userkey"), "username":GM_getValue("username")});
        var apitoken;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.thetvdb.com/login",
            data: initpost,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                var parser = JSON.parse(response.responseText);

                if(!parser.Error){
                    apitoken = parser.token;


                    if(!apitoken){
                        console.log("Token empty: "+response.responseText);
                        return;
                    }

                    GM_setValue("tvdbtoken", apitoken);
                    GM_setValue("tvdbexpiry", Date.now() + 86400000);
                    console.log("got new tvdb token");
                }
                else{
                    console.log("Error parsing response: Renew TVDB Token");
                    return;
                }
            }
        });
    }
}