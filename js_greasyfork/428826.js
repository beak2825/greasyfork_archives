// ==UserScript==
// @name Sidebar Filter
// @description Add a sidebar with all possible Tags + "Combine Tags" function and forces language to English
// @match *nhentai.net*
// @match *nhentai.net/*
// @exclude *nhentai.net/g/*
// @exclude *nhentai.net/tags*
// @exclude *nhentai.net/artists*
// @exclude *nhentai.net/characters*
// @exclude *nhentai.net/parodies*
// @exclude *nhentai.net/groups*
// @exclude *nhentai.net/info*
// @exclude *nhentai.net/login*
// @exclude *nhentai.net/register*
// @version 0.0.1.20210702181702
// @namespace https://greasyfork.org/users/789731
// @downloadURL https://update.greasyfork.org/scripts/428826/Sidebar%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/428826/Sidebar%20Filter.meta.js
// ==/UserScript==


/* ------------------------ Custom CSS ------------------------

nav[role="navigation"] {
  z-index: 1;
}

.sidenav {
    height: 100%;
    width: auto;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #1f1f1f;
    overflow-x: hidden;
    padding-top: 50px;
    text-align: left;
}

.sidenav div {
  padding: 6px 8px;
  text-decoration: none;
  font-size: 16px;
  color: #d9d9d9;
  display: flex;
}

.sidenav div:hover {
  color: #fff;
}

.sidenav div.selected {
  background-color: #ed2553;
}

.sidenav div a {
  width: 150px;
}

.sidenav::-webkit-scrollbar {
  width: 15px;
}

.sidenav::-webkit-scrollbar-track {
  background: #d9d9d9;
  margin-top: 50px;
}

.sidenav::-webkit-scrollbar-thumb {
  background: #ed2553;
}

.sidenav::-webkit-scrollbar-thumb:hover {
  background: #b70d34;
}

.add_remove {
    float: right;
    margin: 0 0 0 8px;
    width: 10px !important;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
}

/** -------------------------------------------------- */

// Search and return all tags from nHentai
async function getTags (url) {
    fetch(url).then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {

        // Convert the HTML string into a document object
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('span.name').forEach(function (el) { return el.textContent })

    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

var customStyle = 'nav[role=navigation]{z-index:1}.sidenav{height:100%;width:auto;position:fixed;top:0;left:0;background-color:#1f1f1f;overflow-x:hidden;padding-top:50px;text-align:left}.sidenav div{padding:6px 8px;text-decoration:none;font-size:16px;color:#d9d9d9;display:flex}.sidenav div:hover{color:#fff}.sidenav div.selected{background-color:#ed2553}.sidenav div a{width:150px}.sidenav::-webkit-scrollbar{width:15px}.sidenav::-webkit-scrollbar-track{background:#d9d9d9;margin-top:50px}.sidenav::-webkit-scrollbar-thumb{background:#ed2553}.sidenav::-webkit-scrollbar-thumb:hover{background:#b70d34}.add_remove{float:right;margin:0 0 0 8px;width:10px!important;font-weight:700;font-size:16px;cursor:pointer}'
var tags = ["3d","440hz","5505 project","7mm","a kyokufuri","a.w.u","abortion","absorption","aburanabeshiki","aburitoro salmon o kawari","acoe reisuke","adventitious mouth","adventitious penis","adventitious vagina",
            "afks","afro","age progression","age regression","ahegao","aji ponntarou","akahon","akaimelon","akekinokonokon","akigami satoru","albino","alien","alien girl","all the way through","already uploaded",
            "amazatou","amputee","anal","anal birth","anal intercourse","analphagia","angel","animated","animegao","anorexic","anthology","aoto kage","apparel bukkake","apron","ari and mura","ariyuuji","ariyuzi",
            "armpit licking","armpit sex","artbook","artist torika","artist yun","artistcg","arurukaana7a","asakatsu","asakatsu teishoku","asatsuki aoi","asphyxiation","ass expansion","assjob","atelier bucha","aunt",
            "autofellatio","autopaizuri","ayase mio","ayase mizuki","ayashi yachiyo","bald","ball sucking","balljob","balls expansion","bandages","bandaid","banka","bankoku ayuya","bat girl","bbm","bbw","bdsm","bear",
            "bear girl","beauty mark","bee girl","bestiality","big areolae","big ass","big balls","big breasts","big clit","big lips","big muscles","big nipples","big penis","big vagina","bike shorts","bikini",
            "binbin honpo","birth","biscuitone","bisexual","blackmail","blind","blindfold","blood","blood-way","bloomers","blowjob","blowjob face","body modification","body painting","body swap","body writing",
            "bodystocking","bodysuit","bomubomuburin","bona rice special","bonaparte rice","bonbi","bondage","brain fuck","breast expansion","breast feeding","breast reduction","bride","brother","bukkake","bull",
            "bunbuku nagi","bunny boy","bunny girl","bureidora","burping","business suit","butler","camphara tree","cannibalism","cappuccino","capsaicin","caption","carter","cashier","catboy","catfight","catgirl",
            "cbt","centaur","cervix penetration","cervix prolapse","cgc trash","chastity belt","cheating","cheerleader","chikan","chikumaya","chinese dress","chinpan","chitsu kara liver","chiyou yoyuchi","chloroform",
            "christmas","chuka","circle ojisan","circle takaya","clamp","clit growth","clit insertion","clone","closed eyes","clothed female nude male","clothed male nude female","clothed paizuri","cloud flake","coach",
            "cockphagia","cockslapping","coela network","collar","comic","compilation","condom","coprophagia","corruption","corset","cosplaying","cousin","cow","cowgirl","cowman","crossdressing","crotch tattoo","crown",
            "cucchiore","cum bath","cum in eye","cum swap","cumflation","cunnilingus","cuntboy","cuntbusting","cure rhytm","dai sasaduka","dakimakura","dark nipples","dark sclera","dark skin","daughter","deepthroat",
            "deer girl","defloration","delta nine","deluxe kougyou","demon","demon girl","denki anma","devils talk","diaper","dick growth","dickgirl on dickgirl","dickgirl on male","dickgirls only","dicknipples",
            "dilf","dinosaur","dismantling","dog","dog boy","dog girl","doll joints","dolphin","dom san-shiki","domination loss","domo","donmaikingdom","double anal","double blowjob","double penetration",
            "double vaginal","dougi","doujinharuga","doujinshi","dragon","drill hair","drugs","drunk","dummy kaiko","ear fuck","eel","eggs","electric shocks","elf","emotionless sex","emu shoukai","enami nao",
            "enema","ero hige circle","eruu","eugene fitzherbert","exhibitionism","eye penetration","eye-covering bang","eyemask","eyepatch","facesitting","facial hair","fairy","fantia","farting","father",
            "feales only","females only","femdom","feminization","fff threesome","ffm threesome","fft threesome","filming","fingering","first person perspective","fish","fish girl","fishnets","fisting","fliming",
            "focus anal","focus blowjob","foot insertion","foot licking","footjob","forbidden content","forced exposure","forniphilia","fox","fox boy","fox girl","freckles","frog","frog girl","frottage",
            "fujii tooru","fujikyuu","fujishima kousuke fx","fujiwarake","full body tattoo","full censorship","full color","fundoshi","furry","furumoto takeru","futaba channel","futanari","fuziemon","gag",
            "gakuen saimin reido","gamecg","gamigami","gan sukii","gaping","garter belt","gasmask","gattsu shihan","gender bender","ghost","giant","giantess","gigantic breasts","gijinka","glasses","glory hole",
            "gloves","goblin","gokkun","gokuge","gomuta","goredolf musik","gorilla","gothic lolita","goudoushi","goup","granddaughter","grandfather","grandmother","great akuta","group","growth","guro","gyaru",
            "gyaru-oh","gymshorts","gyoumuin a","gyouninzaka mawaru","hachikirisou","hacka doll no.0","haigure","hair buns","hairjob","hairy","hairy armpits","hako no naka no imaginary","hanairo spoon",
            "handicapped","handjob","harem","harness","harpy","haruharu dou","hatomame coffee","hatten tojounin","headless","headphones","heine","hesomagari","heterochromia","hidden sex","hijab","hinoa",
            "hirobi","hiropons","hirotake neo","hisashi-705","hizatsuki nakidashi-dou","hogback","hololive","honjou tatami","hood","horns","horse","horse boy","horse cock","horse girl","hoshi to lucky",
            "hoshimaguro","hoshina shinya","hotpants","how to","hua butterfly tower","huge breasts","huge penis","human cattle","human on furry","human pet","humiliation","ichigo-chan milk-chan","imageset",
            "impregnation","imprison","incest","incomplete","infantilism","inflation","insect","insect boy","insect girl","inseki","internal urination","inverted nipples","invisible","ishihara norihiro",
            "ishoku dougen","jaguchi","jikken b-tou","jingle abel meuniere","josou seme","jun tsuyu","juumaru shigeru","kakucho parts","kamenoashi","kamokan","kamono","kanatomi mikiru","kanbe rino","kangoku meika",
            "kaoritatsu chaya","kappa","karmin","kazaoka","kazefuki poni","kemonomimi","kiaineko","kichoutei","kien-biu","kigurumi","killu","kimono","kindergarten uniform","king frederic","kiri nada","kisaragi yri",
            "kissing","kitaichi naco","kitayama","kiyomiya ryou","kneepit sex","koguma","kouboku","kouun ryuusui","koyama hayato","kozakura nagiha","kudou maimu","kuki isu","kukki ore","kunoichi","kunojimaru",
            "kuremente","kuretudenn","kurita suzume","kyun ja","lab coat","lacatation","lactation","large insertions","large tattoo","latex","layer cake","leash","leg lock","legjob","leotard","levi","lingerie",
            "lione","little note","living clothes","liz ricarro","lizard girl","lizard guy","lolicon","long tongue","loon koubou","low bestiality","low guro","low lolicon","low scat","low shotacon","machine",
            "madako","madakoya","maggot","magical girl","maid","makeup","makimura hiromi","male on dickgirl","males only","mame hikouki","manga","manga teikoku","maou dante","mari ruki makino","maripaka",
            "masahiro","masani sadakichi","masaru","mash.","mashi miyuki","mashiba kenta","masked face","masturbation","masturbtion","masuta","matcho","matsushima aiko","maturbation","mature","mdc","mecha girl",
            "megumi fushiguro","melonbooks","menstruation","mentoru","mermaid","merman","mesuiki","metal armor","micchi","midget","miki akira","miki hime","miko","mikoshiro nagitoh","milf","military","milking",
            "mind break","mind control","mine mura","minigirl","miniguy","minotaur","misakitou","misc","missing cover","misuke","mitsume no mitsumame","mitsuya hikari","miyami","miyamoto smoke","mmf threesome",
            "mmm threesome","mmt threesome","mochinchi","moe katsuragi","mofu mofu sheep","mogemoge","mogemogeland","mokko","mokusei lemonade","momoiro onsen","momomo gasshuukoku","mon","monkey","monkey girl",
            "monoeye","monster","monster girl","moomin","moral degeneration","mori tanishi","moriyama inu","mosaic censorship","mother","mouse boy","mouse girl","mouth mask","mr. hokke","mtf threesome",
            "mugen murasaki","muinu475","mujin hangetsuban bakudan","multi-work series","multimouth blowjob","multipanel sequence","multiple arms","multiple breasts","multiple footjob","multiple handjob",
            "multiple orgasms","multiple paizuri","multiple penises","multiple straddling","muscle","muscle growth","mute","myuma subaru","myuu","nagatoro","nagise yuito","naiagara rengou","nakadashi",
            "nakamura kafka","nakayoshi chihuahua","narita emu","natsu no ame","natsukawa kagari","navel fuck","nayunayuna","nazi","necrophilia","nego blood","netorare","neutral","niece","nigawarai yashiki",
            "nijisanji","nikubou maranoshin","ningenjiru","ninja","nipple birth","nipple expansion","nipple fuck","nishiki ai","nishikujou kitarafu","nishimura hanten","niwaka daimyou","no penetration",
            "non-h","norn clatalissa jioral","nose fuck","nose hook","nudity only","nug","nun","nurse","nyowawa","octopus","oikaze","oil","okemaruta","okmonook","okoru usagi","old lady","old man","omorashi",
            "onahole","onaka pants koubou","oni","oniichan no imouto","oniichan no imouto shutchoujo","onushi","oosaki","oppai loli","orc","ore teki doremi e","orgasm denial","otakebi","otofubarricade",
            "otter girl","out of order","oyakodon","pai genji","paizuri","panda girl","pantyhose","pantyjob","parareyukicchu","parasite","pasties","patra suou","payapaya mambo de u","pegging","penis birth",
            "petplay","petrification","phimosis","phone sex","piercing","pig","pig girl","pig man","pillory","pinknopiyopiyo","pirate","piss drinking","pixie cut","plant girl","plump peach bean paste",
            "pole dancing","policeman","policewoman","ponygirl","ponytail","poor grammar","possession","pregnant","prehensile hair","priest","prolapse","prostate massage","prostitution","pubic stubble",
            "public use","puorg etwas","puru","qiujun","qow","raccoon boy","raccoon girl","race queen","rairu tobaru","randoseru","rape","realporn","redraw","replaced","reptile","retora-38","rimjob",
            "ririkaruseki","ririkaruski","robot","rudeus greyrat","ryona","ryuuguu","salad oil","saliva","sample","saotshi yabe","sarashi","saremetei","satotsuki chiyo","sawada honoka","sawananana","scanmark",
            "scar","scat","school gym uniform","school swimsuit","schoolboy uniform","schoolgirl uniform","scrotal lingerie","seinyanko gakuen","seisha ryuso","seishokuki","sekigetsu meguru","selfcest",
            "seliph","senmura","sentouin haken shimasu","sentouin hakenshimasu","seto kohei","sevenstrike","sex toys","shade no urahime","shared senses","shark girl","shaved head",
            "sheep boy","sheep girl","shemale","shibari","shiga hanako","shigu","shimaidon","shimapan","shimon ryuushirou","shinazu no himegimi","shioimo","shiokaze toride","shiragi mana",
            "shirasaka miyu","shiroi ofuton","shiromaru","shizaki tsukiyo","shizukuno reyu","shotacon","shrinking","shuhan","shuroop","silk koharuno","siruto","sister","skeb","sketch lines",
            "skinsuit","slatex","slave","slayn","sleeping","slime","slime girl","slowpit","slug","small breasts","small penis","smegma","smell","smoking","snake","snake girl","snuff","sockjob","sokushi",
            "sole dickgirl","sole female","sole male","solo action","soushuuhen","spanking","sparkling snow","speculum","spider","spider girl","squid girl","squirrel girl","squirting","ssbbm","ssbbw",
            "stealth koubou","stealthcraftwork","stealthwriter","stewardess","stirrup legwear","stockings","stomach deformation","story arc","story circle","straitjacket","strap-on","stretching",
            "stuck in wall","studio abuno culture","studio wonderland 203","sudou raikuu","sugu owaru.","suitcho","sukuna","sukurinton","sumata","sumegawa kurenai","sumina en","sundress","sunglasses",
            "super cub","suzunashi rei","sway","sweating","swimsuit","swinging","syringe","syunka kikaku","syunkarow","table masturbation","tachibana ruri","taiban steak","tail","tail plug","tailjob",
            "tailphagia","taimanin","taiyou no nishi","takasaki jiro","takeshi jinno","tall girl","tall man","tanizoko jikkenshitsu","tankoubon","tanlines","tarcho","tarte aux fraise","tasuke seinyuu",
            "tawashi","teacher","tebasaki tabetai","tenkoinu","tenshi okihana","tentacles","thick eyebrows","thigh high boots","tiara","tickling","tights","time stop","time travel tondekeman",
            "togishiro yoshitaka","tokyo kumitaisou-gumi","tomatorice","tomboy","tomgirl","tomikadou","tonari toyama","toorisugari kari","tori seisakusho","tornado","torotei","torture","toshiyuki sawada",
            "totorina","tracksuit","trampling","tranformation","transformation","tribadism","triple anal","triple penetration","triple vaginal","tropical-rouge pretty cure","tsuruga","tsutsugamushi",
            "ttf threesome","ttm threesome","ttt threesome","tube","tuna empire","turisasu","turtle","tutor","twins","twintails","tyrellsha","uchuu-jin tanaka tarou","unbirth","uncensored","uncle",
            "underwater","unicorn","unusual insertions","unusual pupils","unusual teeth","unya","unyakun","uranokyuu","urasuke","urethra insertion","urination","usaginoniwa","usagizukin","uyuu",
            "vacbed","vaginal sticker","vampire","variant set","velokisss","very long hair","virginity","virginneko","vivienne ohtori","vomit","vore","vorefection","vorevore","voyeurism","vtuber",
            "waiter","waitress","wajima24","wakiyaku ni koso ai","walkure","watari shirou","watarinchi","watermarked","webtoon","weight gain","western","western cg","western imageset","western non-h",
            "wet clothes","whip","widow","widower","wings","witch","wolf","wolf boy","wolf girl","wooden horse","worm","wormhole","wrestling","wsplus","x-ray","yakishio","yakumo ryojin","yandere",
            "yaoi","yariyo","yo o shinobu","yodai","yoikorogashi","yongo","yorozu company","yukino makoto","yukkuri","yumemi rin","yumiko","yurayura","yuri","yutto prime","yuuki chizuco","zaba torte",
            "zinkurou","zombie","zukkoke 3-nin-gumi"]

var mainTag = window.location.pathname.indexOf('tag/') > -1 ? window.location.pathname.replace(/tag/, '').replace(/\//g, '') : ''
var userTags = (mainTag !== '' ? [mainTag] : [])
if (userTags.length === 0) {
    userTags= parseQueryString().q
    if (userTags) {
        userTags = userTags.split('+')
    } else {
        userTags = []
    }
}

addStyle(customStyle)
addScripts()
createSideBar()

function createSideBar () {
    var sidebar = document.createElement('div')
    sidebar.className = 'sidenav'
    sidebar.innerHTML = insertTags(userTags)

    var mainNav = document.querySelector('body > nav')
    mainNav.insertAdjacentElement('afterend', sidebar)
}

function insertTags (userTags) {
    var tagHTML = ''
    for (var t = 0; t < tags.length; ++t) {
        var actualTag = tags[t]
        if (userTags.indexOf(actualTag) > -1) {
            tagHTML += '<div class="selected">' +
                '<a href="/tag/' + actualTag + '" class="category">' + actualTag.toUpperCase() + '</a>' +
                // '<p class="add_remove" onclick="addTag(\'\')">+</p>' +
                '<p class="add_remove" onclick="removeTag(\'' + actualTag + '\')">-</p>' +
                '</div>'
        } else {
            tagHTML += '<div class="">' +
                '<a href="/tag/' + actualTag + '" class="category">' + actualTag.toUpperCase() + '</a>' +
                '<p class="add_remove" onclick="addTag(\'' + actualTag + '\')">+</p>' +
                // '<p class="add_remove" onclick="removeTag(\'\')">-</p>' +
                '</div>'
        }
    }
    return tagHTML
}

function parseQueryString () {

    var str = decodeURIComponent(window.location.search);
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
}

function addStyle (styleString) {
    var style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

function addScripts () {
    var script = document.createElement('script');
    script.textContent = 'window.userTags=["' + userTags.join('","') + '"]\n' + addTag.toString() + '\n' + removeTag.toString();
    document.head.append(script);
}

function addTag (tag) {
    userTags.push(tag)

    if (userTags.indexOf('language:english') < 0) {
        userTags.push('language:english')
    } else {
        var tagIndex = userTags.indexOf('language:english')
        userTags.splice(tagIndex, 1)
        userTags.push('language:english')
    }
    var nt = userTags.join('+')
    window.location = window.location.origin + '/search/\?q=' + nt
}

function removeTag (tag) {
    var tagIndex = userTags.indexOf(tag)

    if (tagIndex > -1) {
        userTags.splice(tagIndex, 1)
    }

    if (userTags.indexOf('language:english') < 0) {
        userTags.push('language:english')
    } else {
        var langIndex = userTags.indexOf('language:english')
        userTags.splice(langIndex, 1)
        userTags.push('language:english')
    }

    var nt = userTags.join('+')
    window.location = window.location.origin + '/search/\?q=' + nt
}