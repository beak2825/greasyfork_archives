
// ==UserScript==
// @name         AllInOne
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AllInOne - Super Pacotão de Scripts
// @author       VSCoutinho
// @match        */*
// @match        *://spoon.rekreasi.co.id/*
// @icon         https://static-00.iconduck.com/assets.00/clock-stop-icon-256x256-evvlirzq.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481462/AllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/481462/AllInOne.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.ComecarAgora=false
    window.ProcuraIniciada=""
    window.IdDosUsuarios = [
        ["ERROR",""],
        ["darmians","62101c7f"],
        ["ubay46","b0ae8fee"],
        ["sohel468","55f2013b"],
        ["Back212","a54e278d"],
        ["kamfang","45356cc6"],
        ["Bitar14","3aeb89a9"],
        ["amrgameih","97e56ca6"],
        ["Salntud","deed0240"],
        ["Jaman52626","28ec8408"],
        ["dandi1511","786106c9"],
        ["nazia0x","b8aa1d4a"],
        ["tejahtc","4d9a3c61"],
        ["jendral","785b8e52"],
        ["Ardinhtc","c4473a31"],
        ["twind1","7045941e"],
        ["Peacef","a9bfd8c5"],
        ["Junaid05","307e0b2a"],
        ["akame11","a09ca02e"],
        ["Sunbra","c4a38fb0"],
        ["OmPrass1111","bc510bc9"],
        ["n4nan1na","308f9d43"],
        ["nabetportal","6c9ad89e"],
        ["Yuvaraj001","680c84bf"],
        ["hjkhkjhkj","5a6b3918"],
        ["azi1122","f7e17878"],
        ["zakies","b5250893"],
        ["sultanbagus","827fd8bd"],
        ["mjokolukito","7e594b81"],
        ["hari_thapa","07e6011e"],
        ["indral99","ac45cc4f"],
        ["riyan956","6aaeba44"],
        ["berna265","107c575e"],
        ["greedus","d8c47139"],
        ["Flinzy","41656dd3"],
        ["wardi15","bc8f9959"],
        ["nazishcute","848a27ca"],
        ["Ziko_laazizee","f59076ec"],
        ["riana56","5166ef46"],
        ["boshafidz","7099222a"],
        ["mohamed19938","cb24b99f"],
        ["FastPayments","0e5ae2d9"],
        ["Moondogfxxx","aafaf35f"],
        ["LEIA","682e50ab"],
        ["kaichouh98","14ff7829"],
        ["Alamin1416","da7e649d"],
        ["kliifatah","45c1fb8b"],
        ["Ankit_Gi","52a294c9"],
        ["Jidemosaic","bee279aa"],
        ["waaone17","d5d04d59"],
        ["opma","cecb1524"],
        ["heripare","f8d70e53"],
        ["ridwanbor","bb7f767d"],
        ["benjasco","29ac184d"],
        ["SajeeGam","b990652a"],
        ["samxx1","83845a40"],
        ["fakhrialam","e99d6879"],
        ["IMSMOUN","4b71367e"],
        ["sk_rathnayake","c7248d29"],
        ["AshwinBabu","0d1ec23a"],
        ["SulaimanNR","9c4997ca"],
        ["kaddouir","662fe038"],
        ["Hjhhhf","d566a10c"],
        ["LEGACY19","22a00766"],
        ["junaju10","b4911235"],
        ["Rayhan24365","7314baca"],
        ["habibkhan","e3f1e15b"],
        ["abdulmani27y","49330cf8"],
        ["SS_WEBS_info","c0756ddc"],
        ["haitamjalal","962e01ac"],
        ["Infoguidemedia","ff634acc"],
        ["oossamm","655b1948"],
        ["Ajithkk","d3bb27c2"],
        ["Rissahif22","1ee36978"],
        ["palash07","b0e421f5"],
        ["Luvaprim","728cb6fc"],
        ["DaniSiddi","dfba5582"],
        ["sharattey","486678f5"],
        ["yousefashmawi","bf2d757a"],
        ["mdsajibprodan","87800ac1"],
        ["willfjp","ff003264"],
        ["Miraj1998","5c121b48"],
        ["JumpingBadger","d330002a"],
        ["maleonews","1c00507a"],
        ["ubay46","b0ae8fee"],
        ["Mercymercy","718c2380"],
        ["usmanshahidg","3e818281"],
        ["ajilaksmana","e42b4974"],
        ["mabroukch","6f6e1e7f"],
        ["musangprofit","2e86c1bb"],
        ["Deaione","db4f2a7e"],
        ["remss","958ae426"],
        ["Iam2000","2aed215d"],
        ["kasem9900","28b519e5"],
        ["zuwai","4a84409a"],
        ["Chinonso99","6220a277"],
        ["Bisalk7171","72586fe9"],
        ["Samir4075","8d8ae77e"],
        ["Aynnwatts","a7e2172e"],
        ["Aytyb","c29171e9"],
        ["shahidchohann","deb31482"],
        ["moonsiicc","1ebbe8c2"],
        ["Grandly","35e8fa2b"],
        ["WalidForhad","5afea7d6"],
        ["Lili2003","6badc0f0"],
        ["usapibase","8433e13f"],
        ["amrgameih","97e56ca6"],
        ["Peter2175","b64ce8d9"],
        ["msaki","a662dca2"],
        ["danema","bc35df89"],
        ["gathonirah","eeeca963"],
        ["Arsenalinterest","11238925"],
        ["faizan2543","2adb1acb"],
        ["Exquisiteness","4e63de1b"],
        ["dandi1511","786106c9"],
        ["subbun","915fdc3d"],
        ["Bigflash","cba26e1a"],
        ["hprabs","2280f3f7"],
        ["ait983","3de03b3a"],
        ["Lakkav","600d0770"],
        ["psychic04","6f5a0205"],
        ["MirinDaa","888e590c"],
        ["HSDRAGON","a1e38bd1"],
        ["khalidouss","be50c192"],
        ["Handiway","f865471b"],
        ["rizkypujian","17dee6aa"],
        ["Junaid05","307e0b2a"],
        ["Javiercrespillo","51ae7f3a"],
        ["Yuvaraj001","680c84bf"],
        ["sunaliagus","7cb28f6e"],
        ["hkvisen","958c9001"],
        ["browipil","b1af978e"],
        ["MoneyGenius","d2ebe769"],
        ["andikawibiks","ea9cc383"],
        ["rsifuentesc","03639c39"],
        ["Zul2023","27129b61"],
        ["mahinmd99","485f03ec"],
        ["darmians","62101c7f"],
        ["majalahpost","8cf2132b"],
        ["husamkod","a56a1d65"],
        ["Sarimiee","c17ae20f"],
        ["rizkinabilla","de784cb7"],
        ["starbaiber","fd89c284"],
        ["juragan1337","1e976bab"],
        ["ishwor999","34c363e7"],
        ["liamnoan10t","58abf532"],
        ["adeebakhanam1","6afb4a0c"],
        ["akashbala2017","975e6c63"],
        ["moni421","bb9189ee"],
        ["IamSisyphus","d5398538"],
        ["mayerl1","ee4cb98b"],
        ["Andri2022","0fafb244"],
        ["Back_kali","2a05c0d1"],
        ["bvnouni","4e066f18"],
        ["yandi10","6555c665"],
        ["jendral","785b8e52"],
        ["yayans24","90a3b32c"],
        ["IIIDW0412","aa23eead"],
        ["Blackindark","e2c0c07a"],
        ["amarelloo","227f8103"],
        ["cun30col","3bd967d0"],
        ["andy0769","5e142192"],
        ["Dwikh","6efe8365"],
        ["viralsite","87af97c5"],
        ["Aan1979","9f249d6c"],
        ["acc_ahmed_samir","bd436edf"],
        ["NICHE19","d8928991"],
        ["Max0987","f563b852"],
        ["nurulramadhan","153dcf57"],
        ["krisdwiantara","2f51e16e"],
        ["ardimuhsyadir","50c4a019"],
        ["Mounirchougdali","67995e62"],
        ["rezzaid","7c8c87be"],
        ["ogArepaog","b19b0466"],
        ["imanridhwansyah","d1ea7ba0"],
        ["aliftan","ea8420b8"],
        ["Kamlesh13","02c6295c"],
        ["Guhjkoj8b7","25f6631f"],
        ["pronation","467e6c0e"],
        ["nprince","6207d402"],
        ["fouzi76","7136f2a7"],
        ["south2020","8c6e8d3c"],
        ["Sohelkhan964","a44070ed"],
        ["maxuelassis","c058da04"],
        ["Reynesha","de56cb25"],
        ["kaps2017","fb659aeb"],
        ["Hrido","1dcb61a6"],
        ["jjakande","32583358"],
        ["Lobos911","582411ac"],
        ["ayazali123","81fe2340"],
        ["khaledshalaby","974c9ca8"],
        ["regikurniaillahi","ba37bf0a"],
        ["Kardu","d52954b9"],
        ["jackreal01","edef998e"],
        ["Creativechap","298bb136"],
        ["asihcantik","4cda4515"],
        ["sofyanlili","64f93ac8"],
        ["idpar399","7652b4f8"],
        ["tiko007","900de4df"],
        ["AdamALGO","a965342a"],
        ["umeradil10","ca597b73"],
        ["tips4urdu","e21def7f"],
        ["fadhil55","2271d374"],
        ["Priyanka5656","3a4a237f"],
        ["kevinmoriss","5d598997"],
        ["gaddahfi","6e6347d2"],
        ["Uncomon","875d441c"],
        ["shwhri1234","9eb45638"],
        ["dievoblokagung","bd300718"],
        ["Veemaboxa","d88d4c4e"],
        ["azer132","f279825c"],
        ["Imran8545","1497980e"],
        ["chinaru","50bd47a5"],
        ["pecerumah","678b9033"],
        ["Whitecar","7b80b8a6"],
        ["himanshukk","93f8c600"],
        ["eightsun","b006795e"],
        ["Farooqahme00717","d012fa1a"],
        ["mangleshwar321","e7b0315a"],
        ["qoryyyy","0293ef3b"],
        ["harry1575","242c29b2"],
        ["nining12","466ee9a2"],
        ["Manob7263","61a07a7d"],
        ["twind1","7045941e"],
        ["Oyekale","8c5da44e"],
        ["alihassan76543","a3d2fcc4"],
        ["samad517","bfcc756f"],
        ["ksulo","dc960a45"],
        ["mig2479","faafa2a0"],
        ["Professeur22","1bc7d494"],
        ["hammad92","31fec096"],
        ["Netoj","578a1c33"],
        ["Sugy","6a63f6d1"],
        ["Badar555","81fc5ae6"],
        ["hbs96","968d1517"],
        ["andre_gc","d528a4af"],
        ["workshopbd787","edaebf79"],
        ["abojoj","0b03a86a"],
        ["ankit20200","2921d71c"],
        ["Odedele","4bf8821f"],
        ["ahrefsok","64994bf8"],
        ["Eela2001","8fc817b6"],
        ["fitman2","a8d5e449"],
        ["ronisuryadi","c9bcd228"],
        ["Abmannan0171","e1bc4db5"],
        ["Szb99","21c056f4"],
        ["YARDY88","3958108c"],
        ["hoohtenan","5d19563b"],
        ["nabetportal","6c9ad89e"],
        ["sativa_wahyu","85907fa8"],
        ["aliefrm","9d925950"],
        ["Rakib50005","bd05d15b"],
        ["iammahmud","d6d87a53"],
        ["mmuassam_9748","f1b4b6ac"],
        ["Alifaizi","146aa805"],
        ["Vedesh","2dcfe090"],
        ["mughalmuneer890","503dca59"],
        ["Yusufahmad","66ea4884"],
        ["saanvi01","7ad778e1"],
        ["ibay1922","939cb6ab"],
        ["Sharminaktermim","adf45659"],
        ["ndian","cfb520de"],
        ["mujibsugih","e753709e"],
        ["RockNGas","00c44f16"],
        ["owoblow1","23b1cb64"],
        ["firmanislami28","45fef39a"],
        ["longsize","6183bb8c"],
        ["adamW10","6fd04a8f"],
        ["WayawWayaw","8c43315e"],
        ["Oukaa23","a381272d"],
        ["SNHGroupID","f9345473"],
        ["hicheeem","1abe0170"],
        ["Ariesty","31c24fe3"],
        ["claila","55cd6df7"],
        ["emfacapital","6977e6ce"],
        ["soburakhatun","800a6da8"],
        ["balen56","965c9c6f"],
        ["Brazeleo","b64c34b9"],
        ["MutiaUsamah","d4658902"],
        ["hammadu","ed402d18"],
        ["Armada99","09f384fd"],
        ["iyan18","2911a756"],
        ["Xbiozan","64113cd1"],
        ["MOHAMEDKARAM036","72b45b7d"],
        ["ShadyBatta","8eac7b96"],
        ["Dangdadang","a8cf8663"],
        ["Ifiki","c89f35c4"],
        ["HisanX08","e17fcacf"],
        ["Pratitpitu","1f4899b4"],
        ["Rihard","38a8e58e"],
        ["Adam_Fahmi","5c4e3700"],
        ["PORTDEPAIX","6c6ad5e2"],
        ["vause223","851a2388"],
        ["Dhika1507","9c2c8822"],
        ["Ganteng172","bc595526"],
        ["abukhreis","d6719d8c"],
        ["arislm10","f0eb0d1f"],
        ["Java11","13846dd9"],
        ["blossommarian","2b480aa5"],
        ["Dolmaengi","4f50be0d"],
        ["drealer","66989fa7"],
        ["elkendoussi","798ef90c"],
        ["Bright2023","93251956"],
        ["SuhaibIqbal","ad710ffc"],
        ["denafa","cd53dcd7"],
        ["rs100893","e5e03d27"],
        ["drica09","00008b35"],
        ["juliafita","2311915d"],
        ["EasyTasks786","60e2e907"],
        ["Techedgeict","6f94aa92"],
        ["Fasihrafi12","8bfff021"],
        ["Saranorman99","a363de66"],
        ["cadcamman","bf1a2f82"],
        ["Sima636ueh","da949ec3"],
        ["spyiron","f8e98250"],
        ["itfranklyn","185c9f55"],
        ["Gopal800125","313e9292"],
        ["yoestz22","540146d9"],
        ["bilkis0789","6890b00d"],
        ["manddo","7ee0d84b"],
        ["blackpapermind","964841ea"],
        ["Amjadawx98","b4b8001a"],
        ["hamoch","ecb6d222"],
        ["Neche7","ffe3edc8"],
        ["Nunta","0844dbff"],
        ["Jaman52626","28ec8408"],
        ["chandra17693","4b3a1f43"],
        ["Olivrasyid","6405c7a0"],
        ["Suno9696","8d91bd16"],
        ["AlbertoDRio","a88d3aea"],
        ["arippe","c69f8aa1"],
        ["titosa87","e0843cf4"],
        ["ReyYas","36de3eff"],
        ["Amyusup","6bf6a64e"],
        ["KokoYo16","84a58b93"],
        ["lilliadam","9a6a2644"],
        ["OmPrass1111","bc510bc9"],
        ["Gun12sma","d5fb4f75"],
        ["Ochnes","f07ed404"],
        ["Jajaofopobo","128280b9"],
        ["mohamer511","4eac1e72"],
        ["TechnicalAsish","663a6dea"],
        ["Shri008","798a619c"],
        ["Techyrack","928338e1"],
        ["Xaviski","ad073d48"],
        ["baladk","cc9c6f2c"],
        ["Rizwanjee786","e4c99eba"],
        ["acc2000","3ff7f80a"],
        ["bajiju","61918a32"],
        ["hamzabt66","cdeb5094"],
        ["laila65","e320728b"],
        ["jacobhayes071","602e611b"],
        ["ryan8561","4ae8986a"],
        ["JKDIGITAL","2f637603"],
        ["thegiantreport","09a6dc8e"],
        ["Peter2175","b64ce8d9"],
        ["Nayon456","a2e75af9"],
        ["gbr19","666667cf"],
        ["oulhou","1ccecdc4"],
        ["donik12","61416099"]
        ]
        window.InjetarAlertaNoSite = function (){
        // Injeta Js do [ SWEET ALERT 2 ]
        const script = document.createElement('script')
        script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/sweetalert2@11')
        script.setAttribute('async', '')
        script.onload = function handleScriptLoaded() {}
        script.onerror = function handleScriptError() {}
        document.head.appendChild(script)
    }
    InjetarAlertaNoSite();
        window.TotalTasks = 0
        window.UrlParaBurlar = document.baseURI;
        window.NumeroContador = 0;
        window.IndicesTrabalhos = [];
        window.NumeroContador2=-1;
        window.MostrarLog = function (mlog){
            //console.log(mlog);
        }

        window.sleep = time => new Promise(resolve=>{
            setTimeout(resolve, time);
        });
        function downpage(){
            window.scrollTo( 0, 100000 );
        }
        window.removetitle = function (numtitle){
            var num = numtitle;
            document.getElementsByClassName("titulopost")[num].innerHTML="[ - Titulo Copiado - ]"
            }

        window.pegarurl = function (numero2,href,titulo){
            var numero = numero2+1;
            var createA = document.createElement('a');
            var createAText = document.createTextNode("> URL --> [ "+numero+" ] --> ");
            createA.setAttribute('href', href);
            createA.appendChild(createAText);
            document.body.appendChild(createA);
            span(titulo,numero2);

            }

            window.geraStringAleatoria = function (tamanho) {
                    var stringAleatoria = '';
                    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    for (var i = 0; i < tamanho; i++) {
                        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                    }
                    return stringAleatoria;
                }

                window.antispam = "";


                window.exploitsprout = function (classet,numeroid){
                try {
                var ExisteClasse = document.getElementsByClassName(classet)[numeroid]
                if (typeof ExisteClasse == 'undefined'){return false;}
                var numid = numeroid+1;
                var str =  document.getElementsByClassName(classet)[numeroid].innerHTML;
                var tit =  document.getElementsByClassName(classet)[numeroid].innerText;
                var patt = /<a[^>]*href=["']([^"']*)["']/g;
                var match = "";
                while(match=patt.exec(str)){
                var resultado=(match[1]+antispam);
                console.log("Url "+numid+" - "+resultado);
                console.log("Titulo "+numid+" : " +tit);
                console.log("Classe : "+classet);
                console.log("");
                pegarurl(numeroid,resultado,tit);
                }} catch(err) {}
                }
                function setCookie(name,value,days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days*24*60*60*1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                }
                function getCookie(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for(var i=0;i < ca.length;i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' ') c = c.substring(1,c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                    }
                    return null;
                }
                function eraseCookie(name) {
                    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
                window.listurl = function (classeurl){
                NumeroContador2=0
                while (NumeroContador2<11){
                    exploitsprout(classeurl,NumeroContador2);
                    NumeroContador2++;
                }
                }

                function quebralinha(){
                    var createABR = document.createElement('br');
                    var createATextBR =document.createTextNode("");
                    createABR.appendChild(createATextBR);
                    document.body.appendChild(createABR);
                    }

            window.span = function (titulo,numid){
                var createASPAN = document.createElement('span');
                var createATextSPAN =document.createTextNode(titulo);
                createASPAN.setAttribute('class', 'titulopost')
                createASPAN.setAttribute('onclick', 'copiarTexto("'+titulo+'");removetitle('+numid+')');
                createASPAN.appendChild(createATextSPAN);
                document.body.appendChild(createASPAN);
                quebralinha();
                downpage()
                }

            window.tipo01 = /"https:..\/...((.*?)*)"/gm
            window.tipo02 = /"https(.*?)"/gm
            window.tipo03 = /"http(.*?)"/gm

        window.decode = function (str) {
            let txt = document.createElement("textarea");
            txt.innerHTML = str;
            return txt.value;
        }

        window.AtualizarHTML = function (tag){
            document.getElementsByTagName('html')[0].getElementsByTagName(tag)[0].outerHTML=HtmlDoSite.getElementsByTagName(tag)[0].outerHTML
        }

        window.BuscarUrl = function (tipo,codigo){
            try {
                window.URLcodigo=decode(codigo);
                window.ResultadoCodigo = codigo.match(tipo).join("");
                window.SeAchei= "http";
                    if (window.ResultadoCodigo!=""){
                        window.document.title= "[STOPHT] REDIRECIONANDO..."
                        ResultadoCodigo = ResultadoCodigo.replaceAll('"','');
                        window.location= ResultadoCodigo;
                    }
            } catch(err) {}
        }



// Função - Alerta do Script ( Exibe o Valor da Variavel )
window.Alerta = async function (Variavel) {


    if (PararExecucao==true) {
        return false
    }
    await sleep(2000)
    var codigovar = Variavel.trim()
    Swal.fire({
        title: 'Aperte No Botão Abaixo Para Copiar o Codigo',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Copiar Codigo',
        }).then((result) => {
        if (result.isConfirmed) {
        copiarTexto(codigovar);
        Swal.fire('O Codigo do Empregador Foi Copiado!', 'Codigo : '+codigovar, 'success')
        }
        })


    window.PararExecucao=true;
}
    window.CheckMode = async function(){
        if (document.querySelector(".jobs__item.jobs__item--client-starter") !=null){
                window.CLASSEl="jobs__item jobs__item--client-starter"
                window.CLASSENumEmpregador = "jobs__item-cell jobs__item-cell--success text-center mr-auto"
                window.CLASSEAddName = "js-job-item-name"
                window.ComecarAgora=true

        } else {
            window.CLASSEl="job-bar job-bar--expanded job-bar--client-starter"
            window.CLASSENumEmpregador = "jobs__item-cell jobs__item-cell--success text-center p-0"
            window.CLASSEAddName = "js-job-item-name"
            window.ComecarAgora=true
        }

        await sleep(2000)
        }



        window.PararExecucao = false;

    window.CriarSpan = function (Texto, Id) {
        // Menu No Topo
        var sp1 = document.createElement('span')
        sp1.setAttribute('id', Id)
        sp1.innerText = Texto
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.Quebradelinha = function () {
        var sp1 = document.createElement('br')
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.CriarDiv = function (Texto, Id, Id2, style1, style2) {
        if (document.getElementById(Id) != null) {
            return false
        }
        var sp1 = document.createElement('div')
        sp1.setAttribute('id', Id)
        sp1.setAttribute('style', style1)
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
        CriarDentro(Texto, Id, Id2, style2)
    }
    window.AtualizarTotal = setInterval(function () {
        var totalvar =window.CLASSEl
        window.total = document.getElementsByClassName(totalvar).length;

    }, 2000);

    window.RepetirAteAcharTodos = setInterval(async function () {
        if (window.ComecarAgora==true && window.ProcuraIniciada==false){

            while (NumeroContador < total) {
                ProcuraIniciada=true
                extractinfo(NumeroContador)
                if(NumeroContador<=total){
                    NumeroContador++;
                }
                if (NumeroContador >= total){
                    await sleep(3000)
                    console.log("Procura Finalizada")
                    ProcuraIniciada=false
                }

            }
        }
    }, 3000);

    window.extractinfo = async function (indicehtml) {
        try {
            var IDDOTRABALHO = document.getElementsByClassName(CLASSEl)[indicehtml].getAttribute("href").replaceAll("/jobs/submit-task.php?Id=","")


        } catch(err){
            try{
                if (typeof IDDOTRABALHO == "undefined") {
                    var IDDOTRABALHO = document.querySelector(`#jobs-content > div.jobs > div.jobs__items > a:nth-child(${indicehtml})`).getAttribute("href").replaceAll("/jobs/submit-task.php?Id=","")
                    }


            } catch(err){
                try {
                    await sleep(1000)
                    var IDDOTRABALHO =  document.getElementsByClassName(CLASSEl)[indicehtml].dataset.jobId;
                }
                catch(err){
                    addname(indicehtml,"[ERROR]")
                    console.log(`[Debug]-[ERROR] INDEX : ${indicehtml}`)

                    return "Não Achei o IDDOTRABALHO"
                }


            }
        }
    try{

                if (window.document.location.host == "sproutgigs.com"){
                    window.CategoriaSelecionada=document.getElementById("dropdownMainCategory")
                    window.SeValorExiste = CategoriaSelecionada.getElementsByTagName("span")[0].innerHTML;
                    if (SeValorExiste=="SEO + Promote Content + Search + Engage"){
                        if (IndicesTrabalhos.indexOf(IDDOTRABALHO) >= 0) {
                            console.log("Ja Usei")
                            return false
                        }
                    }
                }
                if (window.document.location.host == "sproutgigs.com"){
                    window.CategoriaSelecionada=document.getElementById("dropdownMainCategory")
                    window.SeValorExiste = CategoriaSelecionada.getElementsByTagName("span")[0].innerHTML;
                    if (SeValorExiste!="SEO + Promote Content + Search + Engage"){
                            return false

                    }
                }
        var site = ("https://sproutgigs.com/jobs/job-details.php?Id=" + IDDOTRABALHO)
        fetch(site).then(response => response.text())
            .then(result => scraping(result, "text/html", indicehtml))
        window.scraping = function scraping(string_html, content_type,indicehtml) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(string_html, content_type)
            try {
                var IDEmployer = doc.getElementsByClassName("bl-unbl-employer")[0].getElementsByTagName("a")[0].getAttribute("href").replace("/worker/block-employer.php?Emp=","")
                var numeroempregador = doc.getElementsByClassName("job-info__item")[5].getElementsByTagName("span")[0].innerHTML
                var indexcontador=0
                    while (indexcontador <= IdDosUsuarios.length) {
                        if (IdDosUsuarios[indexcontador][1].indexOf(IDEmployer) == 0){
                        var nomeempregador = IdDosUsuarios[indexcontador][0]
                        console.log(`[Debug] IDEMPREGADOR : ${nomeempregador} | NUMERO : ${numeroempregador} | ID : ${IDEmployer} | INDEX : ${indicehtml}`)
                        addname(indicehtml, nomeempregador);
                        IndicesTrabalhos.push(IDDOTRABALHO)

                    }
                    indexcontador++
                    }



            }
            catch (err) {
                if (typeof IDDOTRABALHO != "undefined") {
                    addname(indicehtml, nomeempregador);

                    }
                if (typeof IDDOTRABALHO == "undefined") {
                    console.log(`[Debug] Está faltando o IDDOTRABALHO`)
                    window.IndicesTrabalhos.push(IDDOTRABALHO)
                    }
                if (typeof nomeempregador == "undefined") {
                    console.log(`[Debug] Está faltando o NOMEEMPREGADOR | ${IDEmployer} | ${numeroempregador} | ${indicehtml} `)
                    addname(indicehtml, "[SemNome]")
                    window.IndicesTrabalhos.push(IDDOTRABALHO)
                    }
                if (typeof IDEmployer == "undefined") {
                    console.log(`[Debug] Está faltando o IDEMPLOYER`)
                    addname(indicehtml, "[SemNome]")
                    window.IndicesTrabalhos.push(IDDOTRABALHO)
                    }

                }


        }
    } catch(err) {
        if (typeof IDDOTRABALHO != "undefined") {
        window.IndicesTrabalhos.push(IDDOTRABALHO)
        }
    }}
    window.addname =function (id, empregador) {
        try {
            document.getElementsByClassName(CLASSEAddName)[id].innerHTML = "<h3>" + empregador.trim() + "</h3>";
        }
        catch (err) {
            if (typeof IDDOTRABALHO != "undefined") {
                window.IndicesTrabalhos.push(IDDOTRABALHO)
                }
        }
    }

    window.CriarBotao = function CriarBotao(ID, Texto, Onclick) {
        if (document.getElementById(ID) != null) {
            return false
        }
        var sp1 = document.createElement('button')
        sp1.setAttribute('onclick', Onclick)
        sp1.setAttribute('id', ID)
        sp1.innerText = Texto
        var sp2 = document.body
        var divPai = sp2.parentNode
        divPai.insertBefore(sp1, sp2)
    }

    window.CriarDentro = function (Texto, Id, Id2, style) {
        const script = document.createElement('div')
        script.setAttribute('id', Id2)
        script.innerText = Texto
        script.setAttribute('style', style)
        document.getElementById(Id).appendChild(script)
    }

    window.copiarTexto = function (textou) {
        const texto = textou
        var code = ''
        let inputTest = document.createElement('input')
        inputTest.value = texto
        document.body.appendChild(inputTest)
        inputTest.select()
        document.execCommand('copy')
        document.body.removeChild(inputTest)
    }




    window.AlertaS = function (Mensagem) {
        console.log('JOBTURBO DIZ : ' + Mensagem)
        Swal.fire('BOT ( JOBTURBO )', '' + Mensagem, 'success')
    }
    window.CheckCodeCookie=async function(){
        window.postlimit= getCookie("postlimit");
        window.postview= getCookie("postview");
        await sleep(2000)
        if (postlimit != postview) {
            if(postlimit==0){
                return false

            }
        setCookie('postview',postlimit,1)
        setCookie('postlimit',postlimit,1)
        setCookie('codeview','1',1)
        window.location.reload()
        }

    }

    window.ZerarTimer= function () {
        try {
        if (counter != null) {
            counter = 0
        }
        } catch (err) {}
        try {
        if (timer != null) {
            timer = 0
        }
        } catch (err) {}
        try {
        if (timeleft != null) {
            timeleft = 0
        }
        } catch (err) {}
        try {
        if (timeleft != null) {
            timeleft = 0
        }
        } catch (err) {}
        try {
        if (seconds_left != null) {
            seconds_left = 0
        }
        } catch (err) {}
        try {
        josscode_showcode()
        } catch (err) {}
        try {
        $('.timer .count').text('1')
        } catch (err) {}

        try {
        var codigo =
            document.body.getElementsByClassName('button').download.innerText
        if (codigo != null) {
            Alerta(codigo)
        }
        } catch (err) {}
    }

    window.RepeatCode= function () {

        showinvisibility('next-page-btn')
        ZerarTimer()
    }
    setInterval(RepeatCode, 1900)

    window.BuscarNoCodigo = function(tipovar, achado) {
    window.exit = false;

        try {
            if (code != 'undefined' && typeof code[0] === 'string') {
                Alerta(code)
                exit = true
        }
        } catch (err) {}
        try {
            if (cod != 'undefined' && typeof cod[0] === 'string') {
                Alerta(cod)
                exit = true
            }
        } catch (err) {}
        try {
            if (result != 'undefined' && typeof result[0] === 'string') {
            Alerta(result)
            exit = true
            }
        } catch (err) {}

        var tipoescolhido = ''
        var tipo1 = /[v][a][r][ ][c][o][d][e][ ][=][ ]["](.*?)["]/gm
        var tipo2 = /[v][a][r][ ][c][o][d][e][ ][=][ ]['](.*?)[']/gm
        var tipo3 = /[c][o][n][s][t][ ][c][o][d][e][ ][=][ ]['](.*?)['][;]/gm
        //var tipo4 = /const code...'\w+'|$/gm
        var tipo5 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]['][d][e][l][a][y][M][s][g]['][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]['](.*?)['][;]/gm
        var tipo6 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]["][t][i][m][e][r]["][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]['](.*?)[']|$/gm
        var tipo7 = /[d][o][c][u][m][e][n][t][.][g][e][t][E][l][e][m][e][n][t][B][y][I][d][(]["][t][i][m][e][r]["][)][.][i][n][n][e][r][H][T][M][L][ ][=][ ]["](.*?)["]/gm

        if (tipovar == 1) {
            tipoescolhido = tipo1
        }
        if (tipovar == 2) {
            tipoescolhido = tipo2
        }
        if (tipovar == 3) {
            tipoescolhido = tipo3
        }
        if (tipovar == 4) {
            tipoescolhido = tipo4
        }
        if (tipovar == 5) {
            tipoescolhido = tipo5
        }
        if (tipovar == 6) {
            tipoescolhido = tipo6
        }
        if (tipovar == 7) {
            tipoescolhido = tipo7
        }

try {
    var htmlfonte = document.body.innerHTML
    if (htmlfonte.indexOf(achado) >= 0 || exit == false) {
        exit = true
        var codigor = htmlfonte.match(tipoescolhido).join('')
        if (codigor !== '') {
            codigor = codigor.replaceAll('innerHTML', '')
            codigor = codigor.replaceAll('const code', '')
            codigor = codigor.replaceAll('=', '')
            codigor = codigor.replaceAll('"', '')
            codigor = codigor.replaceAll("'", '')
            codigor = codigor.replaceAll('Code', '')
            codigor = codigor.replaceAll(':', '')
            codigor = codigor.replaceAll('document.getElementById(timer).', '')
            codigor = codigor.replaceAll('document.getElementById(delayMsg).', '')
            codigor = codigor.replaceAll(";","")
            codigor = codigor.replaceAll("Please wait to get the code <span idcountDown>240</span> seconds.... ","")
            Alerta(codigor)
            exit = true
        }
    }
    } catch (err) {}
}

    window.showinvisibility = function (Valor) {
        var classe = '.' + Valor
        var id = '#' + Valor
        try {
            document.getElementById(Valor).style.visibility = 'visible'
        } catch (err) {}
        try {
            document.getElementById(Valor).style.display = ''
        } catch (err) {}
        try {
            document.getElementById(Valor).style.display = ''
        } catch (err) {}
        try {
            $(classe).css('display', '')
        } catch (err) {}
        try {
            $(classe).show()
        } catch (err) {}
        try {
            $(id).css('display', '')
        } catch (err) {}
        try {
            $(id).show()
        } catch (err) {}
    }
function TemCodigo(Termo){
    try{if (document.getElementsByClassName(Termo)[0].innerText.length>0) {
        document.title = " 🔴 "
}}catch(err){}
}
window.onload = function () {
                function setCookie(name,value,days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days*24*60*60*1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                }

     setCookie('post_ids','%5B1234%2C1478%2C1254%2C1345%2C1269%2C1247%2C1368%5D',1)
    //%5B1234%2C1478%2C1254%2C1345%2C1269%2C1247%2C1368%5D
    //%5B4140%2C4128%2C4195%2C4131%2C4143%2C4122%2C4125%5D

try{document.getElementById("myLink").style.display = "block"} catch(err){}
window.blockWording = function () {
return false;
}
try {$("textarea.alert-on-type-task").removeClass("alert-on-type-task");} catch(err){}

function BlockBlock(){
  try{
    $("textarea").each(function() {
      var input = $(this);
    const regex = /\/click(?:ed)?\s+(?:any\s+)?(?:on\s+|(?:on\s+)?any\s+|\d+\s+|one\s+|two\s+)?(?:big\s+|(?:another\s+)?banner\s+)?ad|ad(?:vertisement|vertise)?(?:\s+url|\s+site|\s+link)|\(?advert(?:isement|ise)?s?\)?|(?:navigate|browse|url|multiple|the|big|google)\s+(?:on\s+|of\s+)?(?:the\s+)?a(?:\W)?d(?:\W)?s?\b|banner(?:\s+publicity)?|\Wa(?:\W)?d(?:\W)?s?\b|\Wad(?:\W)?s|(\W|^)+\d+ads?\b|google(?:ad|4d)|4ds|\Wads?(?:\W|$)/gi;

    const blockedText = $(this).val();
    const replacedText = blockedText.replaceAll(regex, "");
      input .val(replacedText)
    });
  } catch(err){}

}
setInterval(BlockBlock,300)

TemCodigo("has-text-align-center wp-block-heading");
TemCodigo("swal2-container swal2-center swal2-backdrop-show");
    window.submitInterval= -66633;

    ProcuraIniciada=false
    CheckMode();
    CheckCodeCookie();
    listurl("article-loop asap-columns-3");
    listurl("post-box-title");
    listurl("entry-title");
    listurl("post-title");
    listurl("meta-footer-thumb");
            setCookie('post_ids','%5B1234%2C1478%2C1254%2C1345%2C1269%2C1247%2C1368%5D',1)

    quebralinha();quebralinha();quebralinha();quebralinha();quebralinha();

    fetch(UrlParaBurlar)
        .then((resp)=>resp.text())
        .then(result => FiltrarResultado(result, "text/html"))
            window.FiltrarResultado = function (string_html, content_type) {
                window.parser = new DOMParser();
                window.doc = parser.parseFromString(string_html, content_type)
                    try {

                        window.SeguirAOrdem = function(){
                            try{
                                window.SegundosAntesDoCodigoAparecer=1;
                                window.HtmlDoSite= doc.getElementsByTagName('html')[0]
                                MostrarLog(HtmlDoSite)
                                window.HurryTimer = doc.querySelector('.hurrytimer-campaign');
                                MostrarLog(HurryTimer)
                                window.AtributoContendoCodigoOuUrl = window.HurryTimer.dataset.config
                                MostrarLog(AtributoContendoCodigoOuUrl)
                                window.DataSetConfigParaPegarAtributo = window.HurryTimer.dataset.config;
                                try{BuscarUrl(tipo01,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                try{BuscarUrl(tipo02,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                try{BuscarUrl(tipo03,window.DataSetConfigParaPegarAtributo)}catch(err){}
                                MostrarLog(window.DataSetConfigParaPegarAtributo)
                                window.JSONDoDataSet = JSON.parse(window.DataSetConfigParaPegarAtributo)
                                MostrarLog(window.JSONDoDataSet)
                                window.TimerDuration = window.JSONDoDataSet.duration
                                MostrarLog(TimerDuration)
                                window.HtmlNovoDoSite = window.HtmlDoSite.querySelector(".hurrytimer-campaign").dataset.config.replaceAll(TimerDuration,SegundosAntesDoCodigoAparecer)
                                window.HtmlDoSite.querySelector(".hurrytimer-campaign").dataset.config = window.HtmlNovoDoSite
                                AtualizarHTML("head");
                                AtualizarHTML("body");
                            }catch(err){}
                        }
                    } catch(err){console.log(err.message)}
                        try{SeguirAOrdem()}catch(err){}
        }
}

        BuscarNoCodigo(1, 'var code = "')
        BuscarNoCodigo(2, "var code = '")
        BuscarNoCodigo(3, 'const code')
        // BuscarNoCodigo(4, 'const code')
        BuscarNoCodigo(5, "getElementById('delayMsg').innerHTML")
        BuscarNoCodigo(6, 'document.getElementById("timer").innerHTML')
        BuscarNoCodigo(7, 'document.getElementById("timer").innerHTML')

        showinvisibility('button')
        showinvisibility('download_link')

    window.INJECTJS = function () {
        try {
            document.getElementsByClassName('notif_alert')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[1].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[2].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('pembungkus-2')[3].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[0].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[1].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[2].remove()
        } catch (err) {}
        try {
            document.getElementsByClassName('background-cover')[3].remove()
        } catch (err) {}
        }
    setInterval(INJECTJS, 1500)

    }
)();