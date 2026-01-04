// ==UserScript==
// @name         Reddit Downloader
// @namespace    https://github.com/felixire/Reddit-Downloader
// @version      0.2.4
// @description  Download your saved posts or directly posts from your feed with support for Direct links (png, jpg, gif, mp4...), (Gypcat kinda), Redgify, Imgur (Only when supplied with an API key)
// @author       felixire
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://www.old.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://www.new.reddit.com/*
// @match        https://new.reddit.com/*
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/408605/Reddit%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/408605/Reddit%20Downloader.meta.js
// ==/UserScript==

const DEBUG = false;
let _LastDownloadedID = GM_getValue('LastDownloaded', '');

let _IsOnUserPage = false;

//#region Helpers
function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function randomName(length = 16) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let name = '';
    for (let index = 0; index < length; index++) {
        let ind = Math.floor(Math.random() * chars.length);
        name += chars.charAt(ind);
    }
    return name;
}

function waitForElements(selectors, timeout = 1000) {
    return new Promise(async (res, rej) => {
        let time = 0;
        if (!Array.isArray(selectors))
            selectors = [selectors];

        let eles = [];

        selectors.forEach(async (sel, i) => {
            let ele = document.querySelector(sel.trim());
            while (ele == null || ele == undefined) {
                if (time >= timeout) {
                    //console.error("Timed out while waiting for: " + sel);
                    rej("Timed out while waiting for: " + sel);
                    return;
                }

                time += 10;
                await wait(10);
                ele = document.querySelector(sel);
            }
            eles.push(ele);
            if (i == (selectors.length - 1))
                res(eles);
            return;
        });
    })
}

function createNotification(title, text) {
    GM_notification({
        title,
        text,
        timeout: 5000
    })
}

function isOldReddit(){
    return new Promise((res) => {
        if (window.location.href.includes('old.reddit.com')){
            res(true);
            return true;
        }
        if (window.location.href.includes('new.reddit.com')){
            res(false);
            return false;
        }

        //Old page
        waitForElements('.redesign-beta-optin', 5000)
        .then(() => {
            res(true);
            return true;
        }).catch(() => {})

        //New page
        waitForElements('#SHORTCUT_FOCUSABLE_DIV', 5000)
        .then(() => {
            res(false);
            return false;
        }).catch(() => {})
    })
}

//#endregion

//#region Supported Downloaders
class DownloadSite {
    constructor() {

    }

    checkSupport(href) {
        throw new Error('NOT IMPLEMENTD!');
    }

    async downloadImages(info, folder = '') {
        return new Promise(async res => {
            let url = this._removeParams(info.url);
            let links = await this.getDownloadLinks(url);
            if (!Array.isArray(links)) links = [links];
            if (links.length > 1)
                await this._downloadBulk(links, folder, `${randomName()}`);
            else
                await this._downloadBulk(links, folder);
            // if(links.length > 1)
            // else
            //     this._download(links[0], folder);

            res();
        });
    }

    /**
     * @return {Promise<Array<string>>}
     */
    getDownloadLinks(href) {
        throw new Error('NOT IMPLEMENTD!');
    }

    _getExtension(href) {
        return href.replace(/.*\./, '');
    }

    _getParams(href) {
        return href.match(/\?.*/gim);
    }

    _removeAmpSymbols(href) {
        return href.replace(/amp;/gim, '');
    }

    _removeParams(href) {
        return href.replace(/\?.*/gim, '');
    }

    async _downloadBulk(links, folder = '', locationAppend = '') {
        return new Promise(async res => {
            for (let index = 0; index < links.length; index++) {
                const url = links[index];
                const params = this._getParams(url);
                const pureUrl = this._removeParams(url);
                const name = (links.length > 1 ? `[${index}]` : '') + `${randomName()}`;

                this._download({
                    url: url,
                    folder,
                    locationAppend,
                    name,
                    extension: this._getExtension(pureUrl)
                });
                await wait(100);
            }

            res();
        })
    }

    //_download(url, folder='', name=randomName(), locationAppend=''){
    _download(infos) {
        let folder = ((infos.folder != '' && infos.folder != null && infos.folder != undefined && infos.folder != '') ? `/${infos.folder}` : '');
        let locationAppend = ((infos.locationAppend != null && infos.locationAppend != undefined && infos.locationAppend != '') ? `/${infos.locationAppend}` : '');
        let name = (infos.name != '' && infos.name != null && infos.name != undefined) ? `/${infos.name}` : '/' + randomName();
        let downloadLocation = GM_config.get('download_location').substr(-1) == '/' ? GM_config.get('download_location').slice(0, -1) : GM_config.get('download_location');

        let details = {
            url: infos.url,
            name: downloadLocation + folder + locationAppend + name + '.' + infos.extension,
            saveAs: false
        }

        GM_download(details);
    }
}

class DirectDownload extends DownloadSite {
    constructor() {
        super();
        this.supportedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'gifv', 'mp4', 'mp3'];
    }

    checkSupport(href) {
        return this.supportedExtensions.includes(this._getExtension(href));
    }

    getDownloadLinks(href) {
        if (href.endsWith('.gifv')) href = href.replace('gifv', 'mp4');
        return [href];
    }
}

class RedditGallery extends DownloadSite {
    constructor() {
        super();
    }

    async downloadImages(info, folder) {
        return new Promise(async res => {
            let postJSON = await window.RedditDownloader._getPostData(info.og_url);
            let media_metadata = postJSON[0].data.children[0].data.media_metadata;
            if (media_metadata == null || media_metadata == undefined) {
                media_metadata = postJSON[0].data.children[0].data.crosspost_parent_list[0].media_metadata;
            }

            let media_keys = Object.keys(media_metadata);
            let links = [];

            for (let i = 0; i < media_keys.length; i++) {
                const key = media_keys[i];
                const url = media_metadata[key].s.u;

                links.push(this._removeAmpSymbols(url));
            }

            if (!Array.isArray(links)) links = [links];
            if (links.length > 1)
                await this._downloadBulk(links, folder, `${randomName()}`);
            else
                await this._downloadBulk(links, folder);
            // if(links.length > 1)
            // else{
            //     let infos = {}
            //     this._download(links[0], folder);
            // }

            res();
        });
    }

    checkSupport(href) {
        console.log('-----------------')
        console.log(href.includes('reddit.com/gallery/'));
        return (href.includes('reddit.com/gallery/'));
    }
}

class Imgur extends DownloadSite {
    constructor() {
        super();

        this._ApiEndpoint = 'https://api.imgur.com/3/';
    }

    checkSupport(href) {
        return (href.includes('imgur.com/') && !href.includes('i.imgur.com/'));
    }

    getDownloadLinks(href) {
        let id = href.replace(/.*\//igm, '');
        let isAlbum = href.replace(/.*imgur.com\//igm, '').startsWith('a');
        return isAlbum ? this.getAlbumLinks(id) : this.getGalleryLinks(id);
    }

    getGalleryLinks(galleryID) {
        return new Promise((res, rej) => {
            if (!GM_config.get('imgur_client_id')) {
                rej('NO CLIENT ID!');
                return;
            }
            fetch(this._ApiEndpoint + `gallery/${galleryID}/images?client_id=${GM_config.get('imgur_client_id')}`)
                .then(body => body.text())
                .then(text => {
                    let data = JSON.parse(text);
                    if (data.data.images == undefined) {
                        res([]);
                        return;
                    }
                    let links = data.data.images.reduce((a, c) => {
                        console.log(a, c);
                        a.push(c.link);
                        return a;
                    }, []);


                    console.log(links)
                    res(links);
                });
        })
    }

    getAlbumLinks(albumID) {
        return new Promise((res, rej) => {
            if (!GM_config.get('imgur_client_id')) {
                rej('NO CLIENT ID!');
                return;
            }
            fetch(this._ApiEndpoint + `album/${albumID}/images?client_id=${GM_config.get('imgur_client_id')}`)
                .then(body => body.text())
                .then(text => {
                    let data = JSON.parse(text);
                    let links = data.data.reduce((a, c) => {
                        a.push(c.link);
                        return a;
                    }, []);

                    res(links);
                });
        })
    }
}

class Gfycat extends DownloadSite {
    constructor() {
        super();
    }

    checkSupport(href) {
        return (href.includes('//gfycat.com/') || href.includes('www.gfycat.com/'));
    }

    getDownloadLinks(href) {
        //media => oembed => thumbnail_url
        //https://thumbs.gfycat.com/<ID>-size_restricted.gif

        return href.replace('thumbs', 'giant').replace('-size_restricted.gif', '.mp4');
    }
}

class Redgifs extends DownloadSite {
    constructor() {
        super();

        this.gypcatList = [
            'aardvark',
            'aardwolf',
            'abalone',
            'abyssiniancat',
            'abyssiniangroundhornbill',
            'acaciarat',
            'achillestang',
            'acornbarnacle',
            'acornweevil',
            'acornwoodpecker',
            'acouchi',
            'adamsstaghornedbeetle',
            'addax',
            'adder',
            'adeliepenguin',
            'admiralbutterfly',
            'adouri',
            'aegeancat',
            'affenpinscher',
            'afghanhound',
            'africanaugurbuzzard',
            'africanbushviper',
            'africancivet',
            'africanclawedfrog',
            'africanelephant',
            'africanfisheagle',
            'africangoldencat',
            'africangroundhornbill',
            'africanharrierhawk',
            'africanhornbill',
            'africanjacana',
            'africanmolesnake',
            'africanparadiseflycatcher',
            'africanpiedkingfisher',
            'africanporcupine',
            'africanrockpython',
            'africanwildcat',
            'africanwilddog',
            'agama',
            'agouti',
            'aidi',
            'airedale',
            'airedaleterrier',
            'akitainu',
            'alabamamapturtle',
            'alaskajingle',
            'alaskanhusky',
            'alaskankleekai',
            'alaskanmalamute',
            'albacoretuna',
            'albatross',
            'albertosaurus',
            'albino',
            'aldabratortoise',
            'allensbigearedbat',
            'alleycat',
            'alligator',
            'alligatorgar',
            'alligatorsnappingturtle',
            'allosaurus',
            'alpaca',
            'alpinegoat',
            'alpineroadguidetigerbeetle',
            'altiplanochinchillamouse',
            'amazondolphin',
            'amazonparrot',
            'amazontreeboa',
            'amberpenshell',
            'ambushbug',
            'americanalligator',
            'americanavocet',
            'americanbadger',
            'americanbittern',
            'americanblackvulture',
            'americanbobtail',
            'americanbulldog',
            'americancicada',
            'americancrayfish',
            'americancreamdraft',
            'americancrocodile',
            'americancrow',
            'americancurl',
            'americangoldfinch',
            'americanindianhorse',
            'americankestrel',
            'americanlobster',
            'americanmarten',
            'americanpainthorse',
            'americanquarterhorse',
            'americanratsnake',
            'americanredsquirrel',
            'americanriverotter',
            'americanrobin',
            'americansaddlebred',
            'americanshorthair',
            'americantoad',
            'americanwarmblood',
            'americanwigeon',
            'americanwirehair',
            'amethystgemclam',
            'amethystinepython',
            'amethystsunbird',
            'ammonite',
            'amoeba',
            'amphibian',
            'amphiuma',
            'amurminnow',
            'amurratsnake',
            'amurstarfish',
            'anaconda',
            'anchovy',
            'andalusianhorse',
            'andeancat',
            'andeancockoftherock',
            'andeancondor',
            'anemone',
            'anemonecrab',
            'anemoneshrimp',
            'angelfish',
            'angelwingmussel',
            'anglerfish',
            'angora',
            'angwantibo',
            'anhinga',
            'ankole',
            'ankolewatusi',
            'annashummingbird',
            'annelid',
            'annelida',
            'anole',
            'anophelesmosquito',
            'ant',
            'antarcticfurseal',
            'antarcticgiantpetrel',
            'antbear',
            'anteater',
            'antelope',
            'antelopegroundsquirrel',
            'antipodesgreenparakeet',
            'antlion',
            'anura',
            'aoudad',
            'apatosaur',
            'ape',
            'aphid',
            'apisdorsatalaboriosa',
            'aplomadofalcon',
            'appaloosa',
            'aquaticleech',
            'arabianhorse',
            'arabianoryx',
            'arabianwildcat',
            'aracari',
            'arachnid',
            'arawana',
            'archaeocete',
            'archaeopteryx',
            'archerfish',
            'arcticduck',
            'arcticfox',
            'arctichare',
            'arcticseal',
            'arcticwolf',
            'argali',
            'argentinehornedfrog',
            'argentineruddyduck',
            'argusfish',
            'arieltoucan',
            'arizonaalligatorlizard',
            'arkshell',
            'armadillo',
            'armedcrab',
            'armednylonshrimp',
            'armyant',
            'armyworm',
            'arrowana',
            'arrowcrab',
            'arrowworm',
            'arthropods',
            'aruanas',
            'asianconstablebutterfly',
            'asiandamselfly',
            'asianelephant',
            'asianlion',
            'asianpiedstarling',
            'asianporcupine',
            'asiansmallclawedotter',
            'asiantrumpetfish',
            'asianwaterbuffalo',
            'asiaticgreaterfreshwaterclam',
            'asiaticlesserfreshwaterclam',
            'asiaticmouflon',
            'asiaticwildass',
            'asp',
            'ass',
            'assassinbug',
            'astarte',
            'astrangiacoral',
            'atlanticblackgoby',
            'atlanticbluetang',
            'atlanticridleyturtle',
            'atlanticsharpnosepuffer',
            'atlanticspadefish',
            'atlasmoth',
            'attwatersprairiechicken',
            'auk',
            'auklet',
            'aurochs',
            'australiancattledog',
            'australiancurlew',
            'australianfreshwatercrocodile',
            'australianfurseal',
            'australiankelpie',
            'australiankestrel',
            'australianshelduck',
            'australiansilkyterrier',
            'austrianpinscher',
            'avians',
            'avocet',
            'axisdeer',
            'axolotl',
            'ayeaye',
            'aztecant',
            'azurevase',
            'azurevasesponge',
            'azurewingedmagpie',
            'babirusa',
            'baboon',
            'backswimmer',
            'bactrian',
            'badger',
            'bagworm',
            'baiji',
            'baldeagle',
            'baleenwhale',
            'balloonfish',
            'ballpython',
            'bandicoot',
            'bangeltiger',
            'bantamrooster',
            'banteng',
            'barasinga',
            'barasingha',
            'barb',
            'barbet',
            'barebirdbat',
            'barnacle',
            'barnowl',
            'barnswallow',
            'barracuda',
            'basenji',
            'basil',
            'basilisk',
            'bass',
            'bassethound',
            'bat',
            'bats',
            'beagle',
            'bear',
            'beardedcollie',
            'beardeddragon',
            'beauceron',
            'beaver',
            'bedbug',
            'bedlingtonterrier',
            'bee',
            'beetle',
            'bellfrog',
            'bellsnake',
            'belugawhale',
            'bengaltiger',
            'bergerpicard',
            'bernesemountaindog',
            'betafish',
            'bettong',
            'bichonfrise',
            'bighorn',
            'bighornedsheep',
            'bighornsheep',
            'bigmouthbass',
            'bilby',
            'billygoat',
            'binturong',
            'bird',
            'birdofparadise',
            'bison',
            'bittern',
            'blackandtancoonhound',
            'blackbear',
            'blackbird',
            'blackbuck',
            'blackcrappie',
            'blackfish',
            'blackfly',
            'blackfootedferret',
            'blacklab',
            'blacklemur',
            'blackmamba',
            'blacknorwegianelkhound',
            'blackpanther',
            'blackrhino',
            'blackrussianterrier',
            'blackwidowspider',
            'blesbok',
            'blobfish',
            'blowfish',
            'blueandgoldmackaw',
            'bluebird',
            'bluebottle',
            'bluebottlejellyfish',
            'bluebreastedkookaburra',
            'bluefintuna',
            'bluefish',
            'bluegill',
            'bluejay',
            'bluemorphobutterfly',
            'blueshark',
            'bluet',
            'bluetickcoonhound',
            'bluetonguelizard',
            'bluewhale',
            'boa',
            'boaconstrictor',
            'boar',
            'bobcat',
            'bobolink',
            'bobwhite',
            'boilweevil',
            'bongo',
            'bonobo',
            'booby',
            'bordercollie',
            'borderterrier',
            'borer',
            'borzoi',
            'boto',
            'boubou',
            'boutu',
            'bovine',
            'brahmanbull',
            'brahmancow',
            'brant',
            'bream',
            'brocketdeer',
            'bronco',
            'brontosaurus',
            'brownbear',
            'brownbutterfly',
            'bubblefish',
            'buck',
            'buckeyebutterfly',
            'budgie',
            'bufeo',
            'buffalo',
            'bufflehead',
            'bug',
            'bull',
            'bullfrog',
            'bullmastiff',
            'bumblebee',
            'bunny',
            'bunting',
            'burro',
            'bushbaby',
            'bushsqueaker',
            'bustard',
            'butterfly',
            'buzzard',
            'caecilian',
            'caiman',
            'caimanlizard',
            'calf',
            'camel',
            'canadagoose',
            'canary',
            'canine',
            'canvasback',
            'capeghostfrog',
            'capybara',
            'caracal',
            'cardinal',
            'caribou',
            'carp',
            'carpenterant',
            'cassowary',
            'cat',
            'catbird',
            'caterpillar',
            'catfish',
            'cats',
            'cattle',
            'caudata',
            'cavy',
            'centipede',
            'cero',
            'chafer',
            'chameleon',
            'chamois',
            'chanticleer',
            'cheetah',
            'chevrotain',
            'chick',
            'chickadee',
            'chicken',
            'chihuahua',
            'chimneyswift',
            'chimpanzee',
            'chinchilla',
            'chinesecrocodilelizard',
            'chipmunk',
            'chital',
            'chrysalis',
            'chrysomelid',
            'chuckwalla',
            'chupacabra',
            'cicada',
            'cirriped',
            'civet',
            'clam',
            'cleanerwrasse',
            'clingfish',
            'clownanemonefish',
            'clumber',
            'coati',
            'cob',
            'cobra',
            'cock',
            'cockatiel',
            'cockatoo',
            'cockerspaniel',
            'cockroach',
            'cod',
            'coelacanth',
            'collardlizard',
            'collie',
            'colt',
            'comet',
            'commabutterfly',
            'commongonolek',
            'conch',
            'condor',
            'coney',
            'conure',
            'cony',
            'coot',
            'cooter',
            'copepod',
            'copperbutterfly',
            'copperhead',
            'coqui',
            'coral',
            'cormorant',
            'cornsnake',
            'corydorascatfish',
            'cottonmouth',
            'cottontail',
            'cougar',
            'cow',
            'cowbird',
            'cowrie',
            'coyote',
            'coypu',
            'crab',
            'crane',
            'cranefly',
            'crayfish',
            'creature',
            'cricket',
            'crocodile',
            'crocodileskink',
            'crossbill',
            'crow',
            'crownofthornsstarfish',
            'crustacean',
            'cub',
            'cuckoo',
            'cur',
            'curassow',
            'curlew',
            'cuscus',
            'cusimanse',
            'cuttlefish',
            'cutworm',
            'cygnet',
            'dachshund',
            'daddylonglegs',
            'dairycow',
            'dalmatian',
            'damselfly',
            'danishswedishfarmdog',
            'darklingbeetle',
            'dartfrog',
            'darwinsfox',
            'dassie',
            'dassierat',
            'davidstiger',
            'deer',
            'deermouse',
            'degu',
            'degus',
            'deinonychus',
            'desertpupfish',
            'devilfish',
            'deviltasmanian',
            'diamondbackrattlesnake',
            'dikdik',
            'dikkops',
            'dingo',
            'dinosaur',
            'diplodocus',
            'dipper',
            'discus',
            'dobermanpinscher',
            'doctorfish',
            'dodo',
            'dodobird',
            'doe',
            'dog',
            'dogfish',
            'dogwoodclubgall',
            'dogwoodtwigborer',
            'dolphin',
            'donkey',
            'dorado',
            'dore',
            'dorking',
            'dormouse',
            'dotterel',
            'douglasfirbarkbeetle',
            'dove',
            'dowitcher',
            'drafthorse',
            'dragon',
            'dragonfly',
            'drake',
            'drever',
            'dromaeosaur',
            'dromedary',
            'drongo',
            'duck',
            'duckbillcat',
            'duckbillplatypus',
            'duckling',
            'dugong',
            'duiker',
            'dungbeetle',
            'dungenesscrab',
            'dunlin',
            'dunnart',
            'dutchshepherddog',
            'dutchsmoushond',
            'dwarfmongoose',
            'dwarfrabbit',
            'eagle',
            'earthworm',
            'earwig',
            'easternglasslizard',
            'easternnewt',
            'easteuropeanshepherd',
            'eastrussiancoursinghounds',
            'eastsiberianlaika',
            'echidna',
            'eel',
            'eelelephant',
            'eeve',
            'eft',
            'egg',
            'egret',
            'eider',
            'eidolonhelvum',
            'ekaltadeta',
            'eland',
            'electriceel',
            'elephant',
            'elephantbeetle',
            'elephantseal',
            'elk',
            'elkhound',
            'elver',
            'emeraldtreeskink',
            'emperorpenguin',
            'emperorshrimp',
            'emu',
            'englishpointer',
            'englishsetter',
            'equestrian',
            'equine',
            'erin',
            'ermine',
            'erne',
            'eskimodog',
            'esok',
            'estuarinecrocodile',
            'ethiopianwolf',
            'europeanfiresalamander',
            'europeanpolecat',
            'ewe',
            'eyas',
            'eyelashpitviper',
            'eyra',
            'fairybluebird',
            'fairyfly',
            'falcon',
            'fallowdeer',
            'fantail',
            'fanworms',
            'fattaileddunnart',
            'fawn',
            'feline',
            'fennecfox',
            'ferret',
            'fiddlercrab',
            'fieldmouse',
            'fieldspaniel',
            'finch',
            'finnishspitz',
            'finwhale',
            'fireant',
            'firebelliedtoad',
            'firecrest',
            'firefly',
            'fish',
            'fishingcat',
            'flamingo',
            'flatcoatretriever',
            'flatfish',
            'flea',
            'flee',
            'flicker',
            'flickertailsquirrel',
            'flies',
            'flounder',
            'fluke',
            'fly',
            'flycatcher',
            'flyingfish',
            'flyingfox',
            'flyinglemur',
            'flyingsquirrel',
            'foal',
            'fossa',
            'fowl',
            'fox',
            'foxhound',
            'foxterrier',
            'frenchbulldog',
            'freshwatereel',
            'frigatebird',
            'frilledlizard',
            'frillneckedlizard',
            'fritillarybutterfly',
            'frog',
            'frogmouth',
            'fruitbat',
            'fruitfly',
            'fugu',
            'fulmar',
            'funnelweaverspider',
            'furseal',
            'gadwall',
            'galago',
            'galah',
            'galapagosalbatross',
            'galapagosdove',
            'galapagoshawk',
            'galapagosmockingbird',
            'galapagospenguin',
            'galapagossealion',
            'galapagostortoise',
            'gallinule',
            'gallowaycow',
            'gander',
            'gangesdolphin',
            'gannet',
            'gar',
            'gardensnake',
            'garpike',
            'gartersnake',
            'gaur',
            'gavial',
            'gazelle',
            'gecko',
            'geese',
            'gelada',
            'gelding',
            'gemsbok',
            'gemsbuck',
            'genet',
            'gentoopenguin',
            'gerbil',
            'gerenuk',
            'germanpinscher',
            'germanshepherd',
            'germanshorthairedpointer',
            'germanspaniel',
            'germanspitz',
            'germanwirehairedpointer',
            'gharial',
            'ghostshrimp',
            'giantschnauzer',
            'gibbon',
            'gilamonster',
            'giraffe',
            'glassfrog',
            'globefish',
            'glowworm',
            'gnat',
            'gnatcatcher',
            'gnu',
            'goa',
            'goat',
            'godwit',
            'goitered',
            'goldeneye',
            'goldenmantledgroundsquirrel',
            'goldenretriever',
            'goldfinch',
            'goldfish',
            'gonolek',
            'goose',
            'goosefish',
            'gopher',
            'goral',
            'gordonsetter',
            'gorilla',
            'goshawk',
            'gosling',
            'gossamerwingedbutterfly',
            'gourami',
            'grackle',
            'grasshopper',
            'grassspider',
            'grayfox',
            'grayling',
            'grayreefshark',
            'graysquirrel',
            'graywolf',
            'greatargus',
            'greatdane',
            'greathornedowl',
            'greatwhiteshark',
            'grebe',
            'greendarnerdragonfly',
            'greyhounddog',
            'grison',
            'grizzlybear',
            'grosbeak',
            'groundbeetle',
            'groundhog',
            'grouper',
            'grouse',
            'grub',
            'grunion',
            'guanaco',
            'guernseycow',
            'guillemot',
            'guineafowl',
            'guineapig',
            'gull',
            'guppy',
            'gypsymoth',
            'gyrfalcon',
            'hackee',
            'haddock',
            'hadrosaurus',
            'hagfish',
            'hairstreak',
            'hairstreakbutterfly',
            'hake',
            'halcyon',
            'halibut',
            'halicore',
            'hamadryad',
            'hamadryas',
            'hammerheadbird',
            'hammerheadshark',
            'hammerkop',
            'hamster',
            'hanumanmonkey',
            'hapuka',
            'hapuku',
            'harborporpoise',
            'harborseal',
            'hare',
            'harlequinbug',
            'harpseal',
            'harpyeagle',
            'harrier',
            'harrierhawk',
            'hart',
            'hartebeest',
            'harvestmen',
            'harvestmouse',
            'hatchetfish',
            'hawaiianmonkseal',
            'hawk',
            'hectorsdolphin',
            'hedgehog',
            'heifer',
            'hellbender',
            'hen',
            'herald',
            'herculesbeetle',
            'hermitcrab',
            'heron',
            'herring',
            'heterodontosaurus',
            'hind',
            'hippopotamus',
            'hoatzin',
            'hochstettersfrog',
            'hog',
            'hogget',
            'hoiho',
            'hoki',
            'homalocephale',
            'honeybadger',
            'honeybee',
            'honeycreeper',
            'honeyeater',
            'hookersealion',
            'hoopoe',
            'hornbill',
            'hornedtoad',
            'hornedviper',
            'hornet',
            'hornshark',
            'horse',
            'horsechestnutleafminer',
            'horsefly',
            'horsemouse',
            'horseshoebat',
            'horseshoecrab',
            'hound',
            'housefly',
            'hoverfly',
            'howlermonkey',
            'huemul',
            'huia',
            'human',
            'hummingbird',
            'humpbackwhale',
            'husky',
            'hydatidtapeworm',
            'hydra',
            'hyena',
            'hylaeosaurus',
            'hypacrosaurus',
            'hypsilophodon',
            'hyracotherium',
            'hyrax',
            'iaerismetalmark',
            'ibadanmalimbe',
            'iberianbarbel',
            'iberianchiffchaff',
            'iberianemeraldlizard',
            'iberianlynx',
            'iberianmidwifetoad',
            'iberianmole',
            'iberiannase',
            'ibex',
            'ibis',
            'ibisbill',
            'ibizanhound',
            'iceblueredtopzebra',
            'icefish',
            'icelandgull',
            'icelandichorse',
            'icelandicsheepdog',
            'ichidna',
            'ichneumonfly',
            'ichthyosaurs',
            'ichthyostega',
            'icterinewarbler',
            'iggypops',
            'iguana',
            'iguanodon',
            'illadopsis',
            'ilsamochadegu',
            'imago',
            'impala',
            'imperatorangel',
            'imperialeagle',
            'incatern',
            'inchworm',
            'indianabat',
            'indiancow',
            'indianelephant',
            'indianglassfish',
            'indianhare',
            'indianjackal',
            'indianpalmsquirrel',
            'indianpangolin',
            'indianrhinoceros',
            'indianringneckparakeet',
            'indianrockpython',
            'indianskimmer',
            'indianspinyloach',
            'indigobunting',
            'indigowingedparrot',
            'indochinahogdeer',
            'indochinesetiger',
            'indri',
            'indusriverdolphin',
            'inexpectatumpleco',
            'inganue',
            'insect',
            'intermediateegret',
            'invisiblerail',
            'iraniangroundjay',
            'iridescentshark',
            'iriomotecat',
            'irishdraughthorse',
            'irishredandwhitesetter',
            'irishsetter',
            'irishterrier',
            'irishwaterspaniel',
            'irishwolfhound',
            'irrawaddydolphin',
            'irukandjijellyfish',
            'isabellineshrike',
            'isabellinewheatear',
            'islandcanary',
            'islandwhistler',
            'isopod',
            'italianbrownbear',
            'italiangreyhound',
            'ivorybackedwoodswallow',
            'ivorybilledwoodpecker',
            'ivorygull',
            'izuthrush',
            'jabiru',
            'jackal',
            'jackrabbit',
            'jaeger',
            'jaguar',
            'jaguarundi',
            'janenschia',
            'japanesebeetle',
            'javalina',
            'jay',
            'jellyfish',
            'jenny',
            'jerboa',
            'joey',
            'johndory',
            'juliabutterfly',
            'jumpingbean',
            'junco',
            'junebug',
            'kagu',
            'kakapo',
            'kakarikis',
            'kangaroo',
            'karakul',
            'katydid',
            'kawala',
            'kentrosaurus',
            'kestrel',
            'kid',
            'killdeer',
            'killerwhale',
            'killifish',
            'kingbird',
            'kingfisher',
            'kinglet',
            'kingsnake',
            'kinkajou',
            'kiskadee',
            'kissingbug',
            'kite',
            'kitfox',
            'kitten',
            'kittiwake',
            'kitty',
            'kiwi',
            'koala',
            'koalabear',
            'kob',
            'kodiakbear',
            'koi',
            'komododragon',
            'koodoo',
            'kookaburra',
            'kouprey',
            'krill',
            'kronosaurus',
            'kudu',
            'kusimanse',
            'labradorretriever',
            'lacewing',
            'ladybird',
            'ladybug',
            'lamb',
            'lamprey',
            'langur',
            'lark',
            'larva',
            'laughingthrush',
            'lcont',
            'leafbird',
            'leafcutterant',
            'leafhopper',
            'leafwing',
            'leech',
            'lemming',
            'lemur',
            'leonberger',
            'leopard',
            'leopardseal',
            'leveret',
            'lhasaapso',
            'lice',
            'liger',
            'lightningbug',
            'limpet',
            'limpkin',
            'ling',
            'lion',
            'lionfish',
            'littlenightmonkeys',
            'lizard',
            'llama',
            'lobo',
            'lobster',
            'locust',
            'loggerheadturtle',
            'longhorn',
            'longhornbeetle',
            'longspur',
            'loon',
            'lorikeet',
            'loris',
            'louse',
            'lovebird',
            'lowchen',
            'lunamoth',
            'lungfish',
            'lynx',
            'lynxÂ',
            'macaque',
            'macaw',
            'macropod',
            'madagascarhissingroach',
            'maggot',
            'magpie',
            'maiasaura',
            'majungatholus',
            'malamute',
            'mallard',
            'maltesedog',
            'mamba',
            'mamenchisaurus',
            'mammal',
            'mammoth',
            'manatee',
            'mandrill',
            'mangabey',
            'manta',
            'mantaray',
            'mantid',
            'mantis',
            'mantisray',
            'manxcat',
            'mara',
            'marabou',
            'marbledmurrelet',
            'mare',
            'marlin',
            'marmoset',
            'marmot',
            'marten',
            'martin',
            'massasauga',
            'massospondylus',
            'mastiff',
            'mastodon',
            'mayfly',
            'meadowhawk',
            'meadowlark',
            'mealworm',
            'meerkat',
            'megalosaurus',
            'megalotomusquinquespinosus',
            'megaraptor',
            'merganser',
            'merlin',
            'metalmarkbutterfly',
            'metamorphosis',
            'mice',
            'microvenator',
            'midge',
            'milksnake',
            'milkweedbug',
            'millipede',
            'minibeast',
            'mink',
            'minnow',
            'mite',
            'moa',
            'mockingbird',
            'mole',
            'mollies',
            'mollusk',
            'molly',
            'monarch',
            'mongoose',
            'mongrel',
            'monkey',
            'monkfishÂ',
            'monoclonius',
            'montanoceratops',
            'moorhen',
            'moose',
            'moray',
            'morayeel',
            'morpho',
            'mosasaur',
            'mosquito',
            'moth',
            'motmot',
            'mouflon',
            'mountaincat',
            'mountainlion',
            'mouse',
            'mouse / mice',
            'mousebird',
            'mudpuppy',
            'mule',
            'mullet',
            'muntjac',
            'murrelet',
            'muskox',
            'muskrat',
            'mussaurus',
            'mussel',
            'mustang',
            'mutt',
            'myna',
            'mynah',
            'myotisÂ',
            'nabarlek',
            'nag',
            'naga',
            'nagapies',
            'nakedmolerat',
            'nandine',
            'nandoo',
            'nandu',
            'narwhal',
            'narwhale',
            'natterjacktoad',
            'nauplius',
            'nautilus',
            'needlefish',
            'needletail',
            'nematode',
            'nene',
            'neonblueguppy',
            'neonbluehermitcrab',
            'neondwarfgourami',
            'neonrainbowfish',
            'neonredguppy',
            'neontetra',
            'nerka',
            'nettlefish',
            'newfoundlanddog',
            'newt',
            'newtnutria',
            'nightcrawler',
            'nighthawk',
            'nightheron',
            'nightingale',
            'nightjar',
            'nijssenissdwarfchihlid',
            'nilgai',
            'ninebandedarmadillo',
            'noctilio',
            'noctule',
            'noddy',
            'noolbenger',
            'northerncardinals',
            'northernelephantseal',
            'northernflyingsquirrel',
            'northernfurseal',
            'northernhairynosedwombat',
            'northernpike',
            'northernseahorse',
            'northernspottedowl',
            'norwaylobster',
            'norwayrat',
            'nubiangoat',
            'nudibranch',
            'numbat',
            'nurseshark',
            'nutcracker',
            'nuthatch',
            'nutria',
            'nyala',
            'nymph',
            'ocelot',
            'octopus',
            'okapi',
            'olingo',
            'olm',
            'opossum',
            'orangutan',
            'orca',
            'oregonsilverspotbutterfly',
            'oriole',
            'oropendola',
            'oropendula',
            'oryx',
            'osprey',
            'ostracod',
            'ostrich',
            'otter',
            'ovenbird',
            'owl',
            'owlbutterfly',
            'ox',
            'oxen',
            'oxpecker',
            'oyster',
            'ozarkbigearedbat',
            'pacaÂ',
            'pachyderm',
            'pacificparrotlet',
            'paddlefish',
            'paintedladybutterfly',
            'panda',
            'pangolin',
            'panther',
            'paperwasp',
            'papillon',
            'parakeet',
            'parrot',
            'partridge',
            'peacock',
            'peafowl',
            'peccary',
            'pekingese',
            'pelican',
            'pelicinuspetrel',
            'penguin',
            'perch',
            'peregrinefalcon',
            'pewee',
            'phalarope',
            'pharaohhound',
            'pheasant',
            'phoebe',
            'phoenix',
            'pig',
            'pigeon',
            'piglet',
            'pika',
            'pike',
            'pikeperchÂ',
            'pilchard',
            'pinemarten',
            'pinkriverdolphin',
            'pinniped',
            'pintail',
            'pipistrelle',
            'pipit',
            'piranha',
            'pitbull',
            'pittabird',
            'plainsqueaker',
            'plankton',
            'planthopper',
            'platypus',
            'plover',
            'polarbear',
            'polecat',
            'polliwog',
            'polyp',
            'polyturator',
            'pomeranian',
            'pondskater',
            'pony',
            'pooch',
            'poodle',
            'porcupine',
            'porpoise',
            'portuguesemanofwar',
            'possum',
            'prairiedog',
            'prawn',
            'prayingmantid',
            'prayingmantis',
            'primate',
            'pronghorn',
            'pseudodynerusquadrisectus',
            'ptarmigan',
            'pterodactyls',
            'pterosaurs',
            'puffer',
            'pufferfish',
            'puffin',
            'pug',
            'pullet',
            'puma',
            'pupa',
            'pupfish',
            'puppy',
            'purplemarten',
            'pussycat',
            'pygmy',
            'python',
            'quadrisectus',
            'quagga',
            'quahog',
            'quail',
            'queenalexandrasbirdwing',
            'queenalexandrasbirdwingbutterfly',
            'queenant',
            'queenbee',
            'queenconch',
            'queenslandgrouper',
            'queenslandheeler',
            'queensnake',
            'quelea',
            'quetzal',
            'quetzalcoatlus',
            'quillback',
            'quinquespinosus',
            'quokka',
            'quoll',
            'rabbit',
            'rabidsquirrel',
            'raccoon',
            'racer',
            'racerunner',
            'ragfish',
            'rail',
            'rainbowfish',
            'rainbowlorikeet',
            'rainbowtrout',
            'ram',
            'raptors',
            'rasbora',
            'rat',
            'ratfish',
            'rattail',
            'rattlesnake',
            'raven',
            'ray',
            'redhead',
            'redheadedwoodpecker',
            'redpoll',
            'redstart',
            'redtailedhawk',
            'reindeer',
            'reptile',
            'reynard',
            'rhea',
            'rhesusmonkey',
            'rhino',
            'rhinoceros',
            'rhinocerosbeetle',
            'rhodesianridgeback',
            'ringtailedlemur',
            'ringworm',
            'riograndeescuerzo',
            'roach',
            'roadrunner',
            'roan',
            'robberfly',
            'robin',
            'rockrat',
            'rodent',
            'roebuck',
            'roller',
            'rook',
            'rooster',
            'rottweiler',
            'sable',
            'sableantelope',
            'sablefishÂ',
            'saiga',
            'sakimonkey',
            'salamander',
            'salmon',
            'saltwatercrocodile',
            'sambar',
            'samoyeddog',
            'sandbarshark',
            'sanddollar',
            'sanderling',
            'sandpiper',
            'sapsucker',
            'sardine',
            'sawfish',
            'scallop',
            'scarab',
            'scarletibis',
            'scaup',
            'schapendoes',
            'schipperke',
            'schnauzer',
            'scorpion',
            'scoter',
            'screamer',
            'seabird',
            'seagull',
            'seahog',
            'seahorse',
            'seal',
            'sealion',
            'seamonkey',
            'seaslug',
            'seaurchin',
            'senegalpython',
            'seriema',
            'serpent',
            'serval',
            'shark',
            'shearwater',
            'sheep',
            'sheldrake',
            'shelduck',
            'shibainu',
            'shihtzu',
            'shorebird',
            'shoveler',
            'shrew',
            'shrike',
            'shrimp',
            'siamang',
            'siamesecat',
            'siberiantiger',
            'sidewinder',
            'sifaka',
            'silkworm',
            'silverfish',
            'silverfox',
            'silversidefish',
            'siskin',
            'skimmer',
            'skink',
            'skipper',
            'skua',
            'skunk',
            'skylark',
            'sloth',
            'slothbear',
            'slug',
            'smelts',
            'smew',
            'snail',
            'snake',
            'snipe',
            'snoutbutterfly',
            'snowdog',
            'snowgeese',
            'snowleopard',
            'snowmonkey',
            'snowyowl',
            'sockeyesalmon',
            'solenodon',
            'solitaire',
            'songbird',
            'sora',
            'southernhairnosedwombat',
            'sow',
            'spadefoot',
            'sparrow',
            'sphinx',
            'spider',
            'spidermonkey',
            'spiketail',
            'spittlebug',
            'sponge',
            'spoonbill',
            'spotteddolphin',
            'spreadwing',
            'springbok',
            'springpeeper',
            'springtail',
            'squab',
            'squamata',
            'squeaker',
            'squid',
            'squirrel',
            'stag',
            'stagbeetle',
            'stallion',
            'starfish',
            'starling',
            'steed',
            'steer',
            'stegosaurus',
            'stickinsect',
            'stickleback',
            'stilt',
            'stingray',
            'stinkbug',
            'stinkpot',
            'stoat',
            'stonefly',
            'stork',
            'stud',
            'sturgeon',
            'sugarglider',
            'sulphurbutterfly',
            'sunbear',
            'sunbittern',
            'sunfish',
            'swallow',
            'swallowtail',
            'swallowtailbutterfly',
            'swan',
            'swellfish',
            'swift',
            'swordfish',
            'tadpole',
            'tahr',
            'takin',
            'tamarin',
            'tanager',
            'tapaculo',
            'tapeworm',
            'tapir',
            'tarantula',
            'tarpan',
            'tarsier',
            'taruca',
            'tasmaniandevil',
            'tasmaniantiger',
            'tattler',
            'tayra',
            'teal',
            'tegus',
            'teledu',
            'tench',
            'tenrec',
            'termite',
            'tern',
            'terrapin',
            'terrier',
            'thoroughbred',
            'thrasher',
            'thrip',
            'thrush',
            'thunderbird',
            'thylacine',
            'tick',
            'tiger',
            'tigerbeetle',
            'tigermoth',
            'tigershark',
            'tilefish',
            'tinamou',
            'titi',
            'titmouse',
            'toad',
            'toadfish',
            'tomtitÂ',
            'topi',
            'tortoise',
            'toucan',
            'towhee',
            'tragopan',
            'treecreeper',
            'trex',
            'triceratops',
            'trogon',
            'trout',
            'trumpeterbird',
            'trumpeterswan',
            'tsetsefly',
            'tuatara',
            'tuna',
            'turaco',
            'turkey',
            'turnstone',
            'turtle',
            'turtledove',
            'uakari',
            'ugandakob',
            'uintagroundsquirrel',
            'ulyssesbutterfly',
            'umbrellabird',
            'umbrette',
            'unau',
            'ungulate',
            'unicorn',
            'upupa',
            'urchin',
            'urial',
            'uromastyxmaliensis',
            'uromastyxspinipes',
            'urson',
            'urubu',
            'urus',
            'urutu',
            'urva',
            'utahprairiedog',
            'vampirebat',
            'vaquita',
            'veery',
            'velociraptor',
            'velvetcrab',
            'velvetworm',
            'venomoussnake',
            'verdin',
            'vervet',
            'viceroybutterfly',
            'vicuna',
            'viper',
            'viperfish',
            'vipersquid',
            'vireo',
            'virginiaopossum',
            'vixen',
            'vole',
            'volvox',
            'vulpesvelox',
            'vulpesvulpes',
            'vulture',
            'walkingstick',
            'wallaby',
            'wallaroo',
            'walleye',
            'walrus',
            'warbler',
            'warthog',
            'wasp',
            'waterboatman',
            'waterbuck',
            'waterbuffalo',
            'waterbug',
            'waterdogs',
            'waterdragons',
            'watermoccasin',
            'waterstrider',
            'waterthrush',
            'wattlebird',
            'watussi',
            'waxwing',
            'weasel',
            'weaverbird',
            'weevil',
            'westafricanantelope',
            'whale',
            'whapuku',
            'whelp',
            'whimbrel',
            'whippet',
            'whippoorwill',
            'whitebeakeddolphin',
            'whiteeye',
            'whitepelican',
            'whiterhino',
            'whitetaileddeer',
            'whitetippedreefshark',
            'whooper',
            'whoopingcrane',
            'widgeon',
            'widowspider',
            'wildcat',
            'wildebeast',
            'wildebeest',
            'willet',
            'wireworm',
            'wisent',
            'wobbegongshark',
            'wolf',
            'wolfspider',
            'wolverine',
            'wombat',
            'woodborer',
            'woodchuck',
            'woodcock',
            'woodnymphbutterfly',
            'woodpecker',
            'woodstorks',
            'woollybearcaterpillar',
            'worm',
            'wrasse',
            'wreckfish',
            'wren',
            'wrenchbird',
            'wryneck',
            'wuerhosaurus',
            'wyvern',
            'xanclomys',
            'xanthareel',
            'xantus',
            'xantusmurrelet',
            'xeme',
            'xenarthra',
            'xenoposeidon',
            'xenops',
            'xenopterygii',
            'xenopus',
            'xenotarsosaurus',
            'xenurine',
            'xenurusunicinctus',
            'xerus',
            'xiaosaurus',
            'xinjiangovenator',
            'xiphias',
            'xiphiasgladius',
            'xiphosuran',
            'xoloitzcuintli',
            'xoni',
            'xrayfish',
            'xraytetra',
            'xuanhanosaurus',
            'xuanhuaceratops',
            'xuanhuasaurus',
            'yaffle',
            'yak',
            'yapok',
            'yardant',
            'yearling',
            'yellowbelliedmarmot',
            'yellowbellylizard',
            'yellowhammer',
            'yellowjacket',
            'yellowlegs',
            'yellowthroat',
            'yellowwhitebutterfly',
            'yeti',
            'ynambu',
            'yorkshireterrier',
            'yosemitetoad',
            'yucker',
            'zander',
            'zanzibardaygecko',
            'zebra',
            'zebradove',
            'zebrafinch',
            'zebrafish',
            'zebralongwingbutterfly',
            'zebraswallowtailbutterfly',
            'zebratailedlizard',
            'zebu',
            'zenaida',
            'zeren',
            'zethusspinipes',
            'zethuswasp',
            'zigzagsalamander',
            'zonetailedpigeon',
            'zooplankton',
            'zopilote',
            'zorilla',
            'abandoned',
            'able',
            'absolute',
            'academic',
            'acceptable',
            'acclaimed',
            'accomplished',
            'accurate',
            'aching',
            'acidic',
            'acrobatic',
            'adorable',
            'adventurous',
            'babyish',
            'back',
            'bad',
            'baggy',
            'bare',
            'barren',
            'basic',
            'beautiful',
            'belated',
            'beloved',
            'calculating',
            'calm',
            'candid',
            'canine',
            'capital',
            'carefree',
            'careful',
            'careless',
            'caring',
            'cautious',
            'cavernous',
            'celebrated',
            'charming',
            'damaged',
            'damp',
            'dangerous',
            'dapper',
            'daring',
            'dark',
            'darling',
            'dazzling',
            'dead',
            'deadly',
            'deafening',
            'dear',
            'dearest',
            'each',
            'eager',
            'early',
            'earnest',
            'easy',
            'easygoing',
            'ecstatic',
            'edible',
            'educated',
            'fabulous',
            'failing',
            'faint',
            'fair',
            'faithful',
            'fake',
            'familiar',
            'famous',
            'fancy',
            'fantastic',
            'far',
            'faraway',
            'farflung',
            'faroff',
            'gargantuan',
            'gaseous',
            'general',
            'generous',
            'gentle',
            'genuine',
            'giant',
            'giddy',
            'gigantic',
            'hairy',
            'half',
            'handmade',
            'handsome',
            'handy',
            'happy',
            'happygolucky',
            'hard',
            'icky',
            'icy',
            'ideal',
            'idealistic',
            'identical',
            'idiotic',
            'idle',
            'idolized',
            'ignorant',
            'ill',
            'illegal',
            'jaded',
            'jagged',
            'jampacked',
            'kaleidoscopic',
            'keen',
            'lame',
            'lanky',
            'large',
            'last',
            'lasting',
            'late',
            'lavish',
            'lawful',
            'mad',
            'madeup',
            'magnificent',
            'majestic',
            'major',
            'male',
            'mammoth',
            'married',
            'marvelous',
            'naive',
            'narrow',
            'nasty',
            'natural',
            'naughty',
            'obedient',
            'obese',
            'oblong',
            'oblong',
            'obvious',
            'occasional',
            'oily',
            'palatable',
            'pale',
            'paltry',
            'parallel',
            'parched',
            'partial',
            'passionate',
            'past',
            'pastel',
            'peaceful',
            'peppery',
            'perfect',
            'perfumed',
            'quaint',
            'qualified',
            'radiant',
            'ragged',
            'rapid',
            'rare',
            'rash',
            'raw',
            'recent',
            'reckless',
            'rectangular',
            'sad',
            'safe',
            'salty',
            'same',
            'sandy',
            'sane',
            'sarcastic',
            'sardonic',
            'satisfied',
            'scaly',
            'scarce',
            'scared',
            'scary',
            'scented',
            'scholarly',
            'scientific',
            'scornful',
            'scratchy',
            'scrawny',
            'second',
            'secondary',
            'secondhand',
            'secret',
            'selfassured',
            'selfish',
            'selfreliant',
            'sentimental',
            'talkative',
            'tall',
            'tame',
            'tan',
            'tangible',
            'tart',
            'tasty',
            'tattered',
            'taut',
            'tedious',
            'teeming',
            'ugly',
            'ultimate',
            'unacceptable',
            'unaware',
            'uncomfortable',
            'uncommon',
            'unconscious',
            'understated',
            'unequaled',
            'vacant',
            'vague',
            'vain',
            'valid',
            'wan',
            'warlike',
            'warm',
            'warmhearted',
            'warped',
            'wary',
            'wasteful',
            'watchful',
            'waterlogged',
            'watery',
            'wavy',
            'yawning',
            'yearly',
            'zany',
            'false',
            'active',
            'actual',
            'adept',
            'admirable',
            'admired',
            'adolescent',
            'adorable',
            'adored',
            'advanced',
            'affectionate',
            'afraid',
            'aged',
            'aggravating',
            'beneficial',
            'best',
            'better',
            'bewitched',
            'big',
            'bighearted',
            'biodegradable',
            'bitesized',
            'bitter',
            'black',
            'cheap',
            'cheerful',
            'cheery',
            'chief',
            'chilly',
            'chubby',
            'circular',
            'classic',
            'clean',
            'clear',
            'clearcut',
            'clever',
            'close',
            'closed',
            'decent',
            'decimal',
            'decisive',
            'deep',
            'defenseless',
            'defensive',
            'defiant',
            'deficient',
            'definite',
            'definitive',
            'delayed',
            'delectable',
            'delicious',
            'elaborate',
            'elastic',
            'elated',
            'elderly',
            'electric',
            'elegant',
            'elementary',
            'elliptical',
            'embarrassed',
            'fast',
            'fat',
            'fatal',
            'fatherly',
            'favorable',
            'favorite',
            'fearful',
            'fearless',
            'feisty',
            'feline',
            'female',
            'feminine',
            'few',
            'fickle',
            'gifted',
            'giving',
            'glamorous',
            'glaring',
            'glass',
            'gleaming',
            'gleeful',
            'glistening',
            'glittering',
            'hardtofind',
            'harmful',
            'harmless',
            'harmonious',
            'harsh',
            'hasty',
            'hateful',
            'haunting',
            'illfated',
            'illinformed',
            'illiterate',
            'illustrious',
            'imaginary',
            'imaginative',
            'immaculate',
            'immaterial',
            'immediate',
            'immense',
            'impassioned',
            'jaunty',
            'jealous',
            'jittery',
            'key',
            'kind',
            'lazy',
            'leading',
            'leafy',
            'lean',
            'left',
            'legal',
            'legitimate',
            'light',
            'masculine',
            'massive',
            'mature',
            'meager',
            'mealy',
            'mean',
            'measly',
            'meaty',
            'medical',
            'mediocre',
            'nautical',
            'near',
            'neat',
            'necessary',
            'needy',
            'odd',
            'oddball',
            'offbeat',
            'offensive',
            'official',
            'old',
            'periodic',
            'perky',
            'personal',
            'pertinent',
            'pesky',
            'pessimistic',
            'petty',
            'phony',
            'physical',
            'piercing',
            'pink',
            'pitiful',
            'plain',
            'quarrelsome',
            'quarterly',
            'ready',
            'real',
            'realistic',
            'reasonable',
            'red',
            'reflecting',
            'regal',
            'regular',
            'separate',
            'serene',
            'serious',
            'serpentine',
            'several',
            'severe',
            'shabby',
            'shadowy',
            'shady',
            'shallow',
            'shameful',
            'shameless',
            'sharp',
            'shimmering',
            'shiny',
            'shocked',
            'shocking',
            'shoddy',
            'short',
            'shortterm',
            'showy',
            'shrill',
            'shy',
            'sick',
            'silent',
            'silky',
            'tempting',
            'tender',
            'tense',
            'tepid',
            'terrible',
            'terrific',
            'testy',
            'thankful',
            'that',
            'these',
            'uneven',
            'unfinished',
            'unfit',
            'unfolded',
            'unfortunate',
            'unhappy',
            'unhealthy',
            'uniform',
            'unimportant',
            'unique',
            'valuable',
            'vapid',
            'variable',
            'vast',
            'velvety',
            'weak',
            'wealthy',
            'weary',
            'webbed',
            'wee',
            'weekly',
            'weepy',
            'weighty',
            'weird',
            'welcome',
            'welldocumented',
            'yellow',
            'zealous',
            'aggressive',
            'agile',
            'agitated',
            'agonizing',
            'agreeable',
            'ajar',
            'alarmed',
            'alarming',
            'alert',
            'alienated',
            'alive',
            'all',
            'altruistic',
            'blackandwhite',
            'bland',
            'blank',
            'blaring',
            'bleak',
            'blind',
            'blissful',
            'blond',
            'blue',
            'blushing',
            'cloudy',
            'clueless',
            'clumsy',
            'cluttered',
            'coarse',
            'cold',
            'colorful',
            'colorless',
            'colossal',
            'comfortable',
            'common',
            'compassionate',
            'competent',
            'complete',
            'delightful',
            'delirious',
            'demanding',
            'dense',
            'dental',
            'dependable',
            'dependent',
            'descriptive',
            'deserted',
            'detailed',
            'determined',
            'devoted',
            'different',
            'embellished',
            'eminent',
            'emotional',
            'empty',
            'enchanted',
            'enchanting',
            'energetic',
            'enlightened',
            'enormous',
            'filthy',
            'fine',
            'finished',
            'firm',
            'first',
            'firsthand',
            'fitting',
            'fixed',
            'flaky',
            'flamboyant',
            'flashy',
            'flat',
            'flawed',
            'flawless',
            'flickering',
            'gloomy',
            'glorious',
            'glossy',
            'glum',
            'golden',
            'good',
            'goodnatured',
            'gorgeous',
            'graceful',
            'healthy',
            'heartfelt',
            'hearty',
            'heavenly',
            'heavy',
            'hefty',
            'helpful',
            'helpless',
            'impartial',
            'impeccable',
            'imperfect',
            'imperturbable',
            'impish',
            'impolite',
            'important',
            'impossible',
            'impractical',
            'impressionable',
            'impressive',
            'improbable',
            'joint',
            'jolly',
            'jovial',
            'kindhearted',
            'kindly',
            'lighthearted',
            'likable',
            'likely',
            'limited',
            'limp',
            'limping',
            'linear',
            'lined',
            'liquid',
            'medium',
            'meek',
            'mellow',
            'melodic',
            'memorable',
            'menacing',
            'merry',
            'messy',
            'metallic',
            'mild',
            'negative',
            'neglected',
            'negligible',
            'neighboring',
            'nervous',
            'new',
            'oldfashioned',
            'only',
            'open',
            'optimal',
            'optimistic',
            'opulent',
            'plaintive',
            'plastic',
            'playful',
            'pleasant',
            'pleased',
            'pleasing',
            'plump',
            'plush',
            'pointed',
            'pointless',
            'poised',
            'polished',
            'polite',
            'political',
            'queasy',
            'querulous',
            'reliable',
            'relieved',
            'remarkable',
            'remorseful',
            'remote',
            'repentant',
            'required',
            'respectful',
            'responsible',
            'silly',
            'silver',
            'similar',
            'simple',
            'simplistic',
            'sinful',
            'single',
            'sizzling',
            'skeletal',
            'skinny',
            'sleepy',
            'slight',
            'slim',
            'slimy',
            'slippery',
            'slow',
            'slushy',
            'small',
            'smart',
            'smoggy',
            'smooth',
            'smug',
            'snappy',
            'snarling',
            'sneaky',
            'sniveling',
            'snoopy',
            'thick',
            'thin',
            'third',
            'thirsty',
            'this',
            'thorny',
            'thorough',
            'those',
            'thoughtful',
            'threadbare',
            'united',
            'unkempt',
            'unknown',
            'unlawful',
            'unlined',
            'unlucky',
            'unnatural',
            'unpleasant',
            'unrealistic',
            'venerated',
            'vengeful',
            'verifiable',
            'vibrant',
            'vicious',
            'wellgroomed',
            'wellinformed',
            'welllit',
            'wellmade',
            'welloff',
            'welltodo',
            'wellworn',
            'wet',
            'which',
            'whimsical',
            'whirlwind',
            'whispered',
            'yellowish',
            'zesty',
            'amazing',
            'ambitious',
            'ample',
            'amused',
            'amusing',
            'anchored',
            'ancient',
            'angelic',
            'angry',
            'anguished',
            'animated',
            'annual',
            'another',
            'antique',
            'bogus',
            'boiling',
            'bold',
            'bony',
            'boring',
            'bossy',
            'both',
            'bouncy',
            'bountiful',
            'bowed',
            'complex',
            'complicated',
            'composed',
            'concerned',
            'concrete',
            'confused',
            'conscious',
            'considerate',
            'constant',
            'content',
            'conventional',
            'cooked',
            'cool',
            'cooperative',
            'difficult',
            'digital',
            'diligent',
            'dim',
            'dimpled',
            'dimwitted',
            'direct',
            'disastrous',
            'discrete',
            'disfigured',
            'disgusting',
            'disloyal',
            'dismal',
            'enraged',
            'entire',
            'envious',
            'equal',
            'equatorial',
            'essential',
            'esteemed',
            'ethical',
            'euphoric',
            'flimsy',
            'flippant',
            'flowery',
            'fluffy',
            'fluid',
            'flustered',
            'focused',
            'fond',
            'foolhardy',
            'foolish',
            'forceful',
            'forked',
            'formal',
            'forsaken',
            'gracious',
            'grand',
            'grandiose',
            'granular',
            'grateful',
            'grave',
            'gray',
            'great',
            'greedy',
            'green',
            'hidden',
            'hideous',
            'high',
            'highlevel',
            'hilarious',
            'hoarse',
            'hollow',
            'homely',
            'impure',
            'inborn',
            'incomparable',
            'incompatible',
            'incomplete',
            'inconsequential',
            'incredible',
            'indelible',
            'indolent',
            'inexperienced',
            'infamous',
            'infantile',
            'joyful',
            'joyous',
            'jubilant',
            'klutzy',
            'knobby',
            'little',
            'live',
            'lively',
            'livid',
            'loathsome',
            'lone',
            'lonely',
            'long',
            'milky',
            'mindless',
            'miniature',
            'minor',
            'minty',
            'miserable',
            'miserly',
            'misguided',
            'misty',
            'mixed',
            'next',
            'nice',
            'nifty',
            'nimble',
            'nippy',
            'orange',
            'orderly',
            'ordinary',
            'organic',
            'ornate',
            'ornery',
            'poor',
            'popular',
            'portly',
            'posh',
            'positive',
            'possible',
            'potable',
            'powerful',
            'powerless',
            'practical',
            'precious',
            'present',
            'prestigious',
            'questionable',
            'quick',
            'repulsive',
            'revolving',
            'rewarding',
            'rich',
            'right',
            'rigid',
            'ringed',
            'ripe',
            'sociable',
            'soft',
            'soggy',
            'solid',
            'somber',
            'some',
            'sophisticated',
            'sore',
            'sorrowful',
            'soulful',
            'soupy',
            'sour',
            'spanish',
            'sparkling',
            'sparse',
            'specific',
            'spectacular',
            'speedy',
            'spherical',
            'spicy',
            'spiffy',
            'spirited',
            'spiteful',
            'splendid',
            'spotless',
            'spotted',
            'spry',
            'thrifty',
            'thunderous',
            'tidy',
            'tight',
            'timely',
            'tinted',
            'tiny',
            'tired',
            'torn',
            'total',
            'unripe',
            'unruly',
            'unselfish',
            'unsightly',
            'unsteady',
            'unsung',
            'untidy',
            'untimely',
            'untried',
            'victorious',
            'vigilant',
            'vigorous',
            'villainous',
            'violet',
            'white',
            'whole',
            'whopping',
            'wicked',
            'wide',
            'wideeyed',
            'wiggly',
            'wild',
            'willing',
            'wilted',
            'winding',
            'windy',
            'young',
            'zigzag',
            'anxious',
            'any',
            'apprehensive',
            'appropriate',
            'apt',
            'arctic',
            'arid',
            'aromatic',
            'artistic',
            'ashamed',
            'assured',
            'astonishing',
            'athletic',
            'brave',
            'breakable',
            'brief',
            'bright',
            'brilliant',
            'brisk',
            'broken',
            'bronze',
            'brown',
            'bruised',
            'coordinated',
            'corny',
            'corrupt',
            'costly',
            'courageous',
            'courteous',
            'crafty',
            'crazy',
            'creamy',
            'creative',
            'creepy',
            'criminal',
            'crisp',
            'dirty',
            'disguised',
            'dishonest',
            'dismal',
            'distant',
            'distant',
            'distinct',
            'distorted',
            'dizzy',
            'dopey',
            'downright',
            'dreary',
            'even',
            'evergreen',
            'everlasting',
            'every',
            'evil',
            'exalted',
            'excellent',
            'excitable',
            'exemplary',
            'exhausted',
            'forthright',
            'fortunate',
            'fragrant',
            'frail',
            'frank',
            'frayed',
            'free',
            'french',
            'frequent',
            'fresh',
            'friendly',
            'frightened',
            'frightening',
            'frigid',
            'gregarious',
            'grim',
            'grimy',
            'gripping',
            'grizzled',
            'gross',
            'grotesque',
            'grouchy',
            'grounded',
            'honest',
            'honorable',
            'honored',
            'hopeful',
            'horrible',
            'hospitable',
            'hot',
            'huge',
            'infatuated',
            'inferior',
            'infinite',
            'informal',
            'innocent',
            'insecure',
            'insidious',
            'insignificant',
            'insistent',
            'instructive',
            'insubstantial',
            'judicious',
            'juicy',
            'jumbo',
            'knotty',
            'knowing',
            'knowledgeable',
            'longterm',
            'loose',
            'lopsided',
            'lost',
            'loud',
            'lovable',
            'lovely',
            'loving',
            'modern',
            'modest',
            'moist',
            'monstrous',
            'monthly',
            'monumental',
            'moral',
            'mortified',
            'motherly',
            'motionless',
            'nocturnal',
            'noisy',
            'nonstop',
            'normal',
            'notable',
            'noted',
            'original',
            'other',
            'our',
            'outgoing',
            'outlandish',
            'outlying',
            'precious',
            'pretty',
            'previous',
            'pricey',
            'prickly',
            'primary',
            'prime',
            'pristine',
            'private',
            'prize',
            'probable',
            'productive',
            'profitable',
            'quickwitted',
            'quiet',
            'quintessential',
            'roasted',
            'robust',
            'rosy',
            'rotating',
            'rotten',
            'rough',
            'round',
            'rowdy',
            'square',
            'squeaky',
            'squiggly',
            'stable',
            'staid',
            'stained',
            'stale',
            'standard',
            'starchy',
            'stark',
            'starry',
            'steel',
            'steep',
            'sticky',
            'stiff',
            'stimulating',
            'stingy',
            'stormy',
            'straight',
            'strange',
            'strict',
            'strident',
            'striking',
            'striped',
            'strong',
            'studious',
            'stunning',
            'tough',
            'tragic',
            'trained',
            'traumatic',
            'treasured',
            'tremendous',
            'tremendous',
            'triangular',
            'tricky',
            'trifling',
            'trim',
            'untrue',
            'unused',
            'unusual',
            'unwelcome',
            'unwieldy',
            'unwilling',
            'unwitting',
            'unwritten',
            'upbeat',
            'violent',
            'virtual',
            'virtuous',
            'visible',
            'winged',
            'wiry',
            'wise',
            'witty',
            'wobbly',
            'woeful',
            'wonderful',
            'wooden',
            'woozy',
            'wordy',
            'worldly',
            'worn',
            'youthful',
            'attached',
            'attentive',
            'attractive',
            'austere',
            'authentic',
            'authorized',
            'automatic',
            'avaricious',
            'average',
            'aware',
            'awesome',
            'awful',
            'awkward',
            'bubbly',
            'bulky',
            'bumpy',
            'buoyant',
            'burdensome',
            'burly',
            'bustling',
            'busy',
            'buttery',
            'buzzing',
            'critical',
            'crooked',
            'crowded',
            'cruel',
            'crushing',
            'cuddly',
            'cultivated',
            'cultured',
            'cumbersome',
            'curly',
            'curvy',
            'cute',
            'cylindrical',
            'doting',
            'double',
            'downright',
            'drab',
            'drafty',
            'dramatic',
            'dreary',
            'droopy',
            'dry',
            'dual',
            'dull',
            'dutiful',
            'excited',
            'exciting',
            'exotic',
            'expensive',
            'experienced',
            'expert',
            'extralarge',
            'extraneous',
            'extrasmall',
            'extroverted',
            'frilly',
            'frivolous',
            'frizzy',
            'front',
            'frosty',
            'frozen',
            'frugal',
            'fruitful',
            'full',
            'fumbling',
            'functional',
            'funny',
            'fussy',
            'fuzzy',
            'growing',
            'growling',
            'grown',
            'grubby',
            'gruesome',
            'grumpy',
            'guilty',
            'gullible',
            'gummy',
            'humble',
            'humiliating',
            'humming',
            'humongous',
            'hungry',
            'hurtful',
            'husky',
            'intelligent',
            'intent',
            'intentional',
            'interesting',
            'internal',
            'international',
            'intrepid',
            'ironclad',
            'irresponsible',
            'irritating',
            'itchy',
            'jumpy',
            'junior',
            'juvenile',
            'known',
            'kooky',
            'kosher',
            'low',
            'loyal',
            'lucky',
            'lumbering',
            'luminous',
            'lumpy',
            'lustrous',
            'luxurious',
            'mountainous',
            'muddy',
            'muffled',
            'multicolored',
            'mundane',
            'murky',
            'mushy',
            'musty',
            'muted',
            'mysterious',
            'noteworthy',
            'novel',
            'noxious',
            'numb',
            'nutritious',
            'nutty',
            'onerlooked',
            'outrageous',
            'outstanding',
            'oval',
            'overcooked',
            'overdue',
            'overjoyed',
            'profuse',
            'proper',
            'proud',
            'prudent',
            'punctual',
            'pungent',
            'puny',
            'pure',
            'purple',
            'pushy',
            'putrid',
            'puzzled',
            'puzzling',
            'quirky',
            'quixotic',
            'quizzical',
            'royal',
            'rubbery',
            'ruddy',
            'rude',
            'rundown',
            'runny',
            'rural',
            'rusty',
            'stupendous',
            'stupid',
            'sturdy',
            'stylish',
            'subdued',
            'submissive',
            'substantial',
            'subtle',
            'suburban',
            'sudden',
            'sugary',
            'sunny',
            'super',
            'superb',
            'superficial',
            'superior',
            'supportive',
            'surefooted',
            'surprised',
            'suspicious',
            'svelte',
            'sweaty',
            'sweet',
            'sweltering',
            'swift',
            'sympathetic',
            'trivial',
            'troubled',
            'trusting',
            'trustworthy',
            'trusty',
            'truthful',
            'tubby',
            'turbulent',
            'twin',
            'upright',
            'upset',
            'urban',
            'usable',
            'used',
            'useful',
            'useless',
            'utilized',
            'utter',
            'vital',
            'vivacious',
            'vivid',
            'voluminous',
            'worried',
            'worrisome',
            'worse',
            'worst',
            'worthless',
            'worthwhile',
            'worthy',
            'wrathful',
            'wretched',
            'writhing',
            'wrong',
            'wry',
            'yummy',
            'true',
            'aliceblue',
            'antiquewhite',
            'aqua',
            'aquamarine',
            'azure',
            'beige',
            'bisque',
            'black',
            'blanchedalmond',
            'blue',
            'blueviolet',
            'brown',
            'burlywood',
            'cadetblue',
            'chartreuse',
            'chocolate',
            'coral',
            'cornflowerblue',
            'cornsilk',
            'crimson',
            'cyan',
            'darkblue',
            'darkcyan',
            'darkgoldenrod',
            'darkgray',
            'darkgreen',
            'darkgrey',
            'darkkhaki',
            'darkmagenta',
            'darkolivegreen',
            'darkorange',
            'darkorchid',
            'darkred',
            'darksalmon',
            'darkseagreen',
            'darkslateblue',
            'darkslategray',
            'darkslategrey',
            'darkturquoise',
            'darkviolet',
            'deeppink',
            'deepskyblue',
            'dimgray',
            'dimgrey',
            'dodgerblue',
            'firebrick',
            'floralwhite',
            'forestgreen',
            'fractal',
            'fuchsia',
            'gainsboro',
            'ghostwhite',
            'gold',
            'goldenrod',
            'gray',
            'green',
            'greenyellow',
            'honeydew',
            'hotpink',
            'indianred',
            'indigo',
            'ivory',
            'khaki',
            'lavender',
            'lavenderblush',
            'lawngreen',
            'lemonchiffon',
            'lightblue',
            'lightcoral',
            'lightcyan',
            'lightgoldenrod',
            'lightgoldenrodyellow',
            'lightgray',
            'lightgreen',
            'lightgrey',
            'lightpink',
            'lightsalmon',
            'lightseagreen',
            'lightskyblue',
            'lightslateblue',
            'lightslategray',
            'lightsteelblue',
            'lightyellow',
            'lime',
            'limegreen',
            'linen',
            'magenta',
            'maroon',
            'mediumaquamarine',
            'mediumblue',
            'mediumforestgreen',
            'mediumgoldenrod',
            'mediumorchid',
            'mediumpurple',
            'mediumseagreen',
            'mediumslateblue',
            'mediumspringgreen',
            'mediumturquoise',
            'mediumvioletred',
            'midnightblue',
            'mintcream',
            'mistyrose',
            'moccasin',
            'navajowhite',
            'navy',
            'navyblue',
            'oldlace',
            'olive',
            'olivedrab',
            'opaque',
            'orange',
            'orangered',
            'orchid',
            'palegoldenrod',
            'palegreen',
            'paleturquoise',
            'palevioletred',
            'papayawhip',
            'peachpuff',
            'peru',
            'pink',
            'plum',
            'powderblue',
            'purple',
            'red',
            'rosybrown',
            'royalblue',
            'saddlebrown',
            'salmon',
            'sandybrown',
            'seagreen',
            'seashell',
            'sienna',
            'silver',
            'skyblue',
            'slateblue',
            'slategray',
            'slategrey',
            'snow',
            'springgreen',
            'steelblue',
            'tan',
            'teal',
            'thistle',
            'tomato',
            'transparent',
            'turquoise',
            'violet',
            'violetred',
            'wheat',
            'white',
            'whitesmoke',
            'yellow',
            'yellowgreen'
        ]
    }

    checkSupport(href) {
        return (href.includes('//redgifs.com/') || href.includes('www.redgifs.com/'));
    }

    capatilizeWords(word) {
        let words = [];
        let remaing = word;
        let ind = 0;
        while (remaing.length > 0 && ind <= remaing.length) {
            let word = remaing.slice(0, ++ind);
            if (this.gypcatList.includes(word)) {
                remaing = remaing.slice(ind);
                words.push(word);
                ind = 0;
            }
        }

        return words.map(val => val[0].toUpperCase() + val.slice(1)).join('');
    }

    getDownloadLinks(href) {
        //media => oembed => thumbnail_url
        //https://thcf2.redgifs.com/<ID>.mp4
        //https://redgifs.com/watch/<ID>

        let words = href.split('/');
        let cWords = this.capatilizeWords(words[words.length - 1]);
        let url = words.slice(0, words.length - 1);
        url = url.join('/').replace('www.', '').replace('/watch', '').replace('redgifs', 'thcf2.redgifs') + '/' + cWords + '.mp4'
        return url;
    }
}

const _SupportedSites = [new DirectDownload(), new RedditGallery(), new Imgur(), new Gfycat(), new Redgifs()];
//#endregion

//#region Downloader Class
class BaseRedditClass {
    constructor() {

    }

    _getSavedPostsData(after = null) {
        return new Promise((res, rej) => {
            let username;
            if (_IsOnUserPage) {
                username = document.location.href.split('/');
                username = username[username.indexOf('user') + 1];
            } else if (GM_config.get('reddit_username') != '') {
                username = _RedditUsername;
            }

            fetch(`${window.location.origin}/user/${username}/saved/.json?limit=20${after != null ? '&after=' + after : ''}`)
                .then(resp => resp.text())
                .then(text => res(JSON.parse(text)));
        })
    }

    _getPostData(url) {
        return new Promise((res, rej) => {
            fetch(`${url}/.json`)
                .then(resp => resp.text())
                .then(text => res(JSON.parse(text)));
        })
    }

    _parseData(data) {
        return {
            id: data.data.name,
            url: data.data.url,
            og_url: `https://www.reddit.com${data.data.permalink}`,
            subreddit: data.data.subreddit
        }
    }

    _getFilterArray() {
        return new Promise((res, rej) => {
            let str = GM_config.get('create_for_filter');
            let arr = str.split(',').map(val => val.trim());
            res(arr);
        });
    }

    async downloadSingle(info, filter = null) {
        return new Promise(async (res, rej) => {
            if (filter == null) filter = await this._getFilterArray();
            const url = info.url;

            if (url == undefined) {
                rej();
                return;
            };

            for (let index = 0; index < _SupportedSites.length; index++) {
                const site = _SupportedSites[index];
                if (site.checkSupport(url)) {
                    let folder = null;
                    if (GM_config.get('create_subreddit_folder')) {
                        if (!GM_config.get('create_only_for_selected') || filter.includes(info.subreddit)) {
                            folder = info.subreddit;
                        }
                    }
                    await site.downloadImages(info, folder);
                    await wait(20);
                    break;
                }
            }
            res();
        })
    }

    async downloadAll() {
        console.log('DOWNLOADING!');
        //_SupportedSites.forEach(downloader => {
        //    downloader.checkSupport()
        //})

        //Before = newly added to page so page 1 => when using an id you go up the list
        //Thats why you use Before as Paramter

        //^^^ Screw that shit am i right

        //resp.data.after => Pagnation
        //resp.data.children[].data.name => ID
        //resp.data.children[].data.url => url
        //resp.data.children[].data.subreddit => subreddit

        let running = true;
        let after = null;
        let postInfos = [];
        let first = true;
        let stopAt = _LastDownloadedID;
        let filter = await this._getFilterArray();
        while (running) {
            let data = (await this._getSavedPostsData(after)).data;
            after = data.after;
            if (after == null || after == 'null') running = false;
            for (let index = 0; index < data.children.length; index++) {
                const postData = data.children[index];
                const info = this._parseData(postData);

                if (info.id == stopAt) {
                    running = false;
                    break;
                }

                if (first) {
                    first = false;
                    _LastDownloadedID = info.id;
                    GM_setValue('LastDownloaded', info.id);
                }

                postInfos.push(info);
            }
        }

        let tmp_title = document.title;

        for (let index = 0; index < postInfos.length; index++) {
            document.title = `${index+1}/${postInfos.length}`;
            const info = postInfos[index];
            await this.downloadSingle(info, filter).catch(() => {
                console.error("Failed to download image!")
            });
            /*const url = info.url;
            //console.log(`Downloading ${index+1}/${links.length}  -  ${url}`);

            if(url == undefined) continue;

            for (let index = 0; index < _SupportedSites.length; index++) {
                const site = _SupportedSites[index];
                if(site.checkSupport(url)){
                    let folder = null;
                    if(GM_config.get('create_subreddit_folder')){
                        if(!GM_config.get('create_only_for_selected') || filter.includes(info.subreddit)){
                            folder = info.subreddit;
                        }
                    }
                    await site.downloadImages(url, folder);
                    await wait(20);
                    break;
                }
            }*/
        }

        createNotification('Reddit Downloader', `Finished downloading ${postInfos.length} Posts!`);

        document.title = tmp_title;
    }
}

class RedditDownloader extends BaseRedditClass {
    constructor() {
        super();

        //this.addSavedDownloadButton();
        //this.addSettingsButton();
        this.pageUpdateChecker();
    }

    addSavedDownloadButton() {
        let aEles = document.querySelectorAll('a');
        for (let index = 0; index < aEles.length; index++) {
            const x = aEles[index];
            if (x.innerText.toLowerCase().indexOf('overview') > -1) {
                console.log(x);

                let className = x.className;

                let btn = document.createElement('a');
                btn.className = className + ' download';
                btn.innerText = 'DOWNLOAD';
                btn.onclick = () => {
                    this.downloadAll()
                };
                x.parentNode.appendChild(btn);

                return true;
            }
        }

        return false;
    }

    async addPostDownloadButton() {
        return new Promise(async (res, rej) => {
            let postEles = [...document.querySelectorAll('.Post')];
            let commentButton = document.querySelector('.icon-comment');
            if (commentButton == null || commentButton == undefined) {
                rej();
                return;
            }
            let buttonClassName = commentButton.parentElement.parentElement.className;

            for (let i = 0; i < postEles.length; i++) {
                const post = postEles[i];
                if (post.classList.contains('TMP_DOWNLOAD_ADDED') || post.querySelector('a[Reddit_Downloader="download"]') != null || post.classList.contains('promotedvideolink') || post == undefined) continue;
                //console.log(post);
                const link = post.querySelector('a[data-click-id="body"]');
                let url;
                if (link == undefined || link == null) {
                    if (window.location.href.includes('comments')) {
                        url = window.location.href;

                        if (post.children.length < 1 || post.children[0].getAttribute('data-test-id') != 'post-content') continue;

                    } else {
                        continue;
                    }

                } else {
                    url = link.href
                }
                post.classList.add('TMP_DOWNLOAD_ADDED')

                //TODO clean this shit up
                let dwnBTN = document.createElement('a');
                dwnBTN.className = buttonClassName;
                dwnBTN.innerText = 'DOWNLOAD';
                dwnBTN.setAttribute('Reddit_Downloader', 'download')
                dwnBTN.onclick = () => {
                    console.log(`Getting Data from post: ${url}`);
                    this._getPostData(url)
                        .then(data => {
                            if (!document.body.contains(post)) {
                                rej();
                                return;
                            }
                            const info = this._parseData(data[0].data.children[0]);
                            this.downloadSingle(info);
                        })
                };
                post.querySelector('.icon-comment').parentElement.parentElement.parentNode.appendChild(dwnBTN);

                // promises.push(this._getPostData(url)
                //     .then(data => {
                //         if(!document.body.contains(post)){
                //             rej();
                //             return;
                //         }
                //         const info = this._parseData(data[0].data.children[0]);

                //         // TODO clean this shit up
                //         let dwnBTN = document.createElement('a');
                //         dwnBTN.className = buttonClassName;
                //         dwnBTN.innerText = 'DOWNLOAD';
                //         dwnBTN.setAttribute('Reddit_Downloader', 'download')
                //         dwnBTN.onclick = () => this.downloadSingle(info);
                //         post.querySelector('.icon-comment').parentElement.parentElement.parentNode.appendChild(dwnBTN);
                //     }).catch(() => {}));
            }

            res();

            // Promise.all(promises).then(values => {
            //     res();
            // })
        })
    }

    async addSettingsButton() {
        waitForElements('#change-username-tooltip-id', 5000)
            .then(parent => {
                let chatButton = parent[0].children[0];
                let settingsButton = chatButton.cloneNode(true);

                settingsButton.setAttribute('title', 'Reddit Downloader Settings');
                settingsButton.querySelector('a').href = '#';
                settingsButton.querySelector('a').onclick = () => {
                    GM_config.open();
                };
                //settingsButton.querySelector('svg').setAttribute('viewBox', '0 0 24 24');
                settingsButton.querySelector('i').className = "icon icon-settings"
                //Icon link: https://iconmonstr.com/gear-1-svg/
                //settingsButton.querySelector('path').setAttribute('d', 'M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z');
                parent[0].appendChild(settingsButton);
            })
            .catch(err => {
                this.addSettingsButton();
            });
    }

    async pageUpdateChecker() {
        let isAdded = false;
        let username = await this.getUsername();

        while (true) {
            await wait(50);
            _IsOnUserPage = window.location.href.includes('reddit.com/user/' + username);

            if (true) {
                if(!_IsOnUserPage)
                    isAdded = false;
                if (window.RedditDownloader != undefined) await window.RedditDownloader.addPostDownloadButton().catch(() => {});
            }
            if (!isAdded && _IsOnUserPage) {
                if (window.RedditDownloader != undefined) {
                    await wait(50);
                    isAdded = window.RedditDownloader.addSavedDownloadButton();
                }
            }
        }
    }

    async getUsername() {
        return new Promise(async (res, rej) => {
            let usernameEle = [];
            while (usernameEle == undefined || usernameEle == null || usernameEle.length == 0) {
                usernameEle = await waitForElements('#email-collection-tooltip-id', 5000);
                console.log("CALLED", usernameEle);
            }

            res(usernameEle[0].innerText.split('\n')[0]);
        })
    }
}

class OldRedditDownloader extends BaseRedditClass {
    constructor() {
        super();

        //this.addSavedDownloadButton();
        this.addSettingsButton();
        this.pageUpdateChecker();
    }

    async addSavedDownloadButton() {
        return new Promise(async (res) => {
            waitForElements('.tabmenu')
            .then(ele => {
                let tabmenu = ele[0];

                let downloadLi = document.createElement('li');
                let downloadA = document.createElement('a');
                downloadA.classList.add('choice');
                downloadA.innerHTML = 'Download';
                downloadA.style.cursor = 'pointer';
                downloadA.onclick = () => {
                    this.downloadAll();
                }

                downloadLi.appendChild(downloadA);
                tabmenu.appendChild(downloadLi);
            })
            .catch(() => {
                res(false);
            })
        })
    }

    async addPostDownloadButton() {
        return new Promise(async (res, rej) => {
            let postEles = [...document.querySelectorAll('.thing[data-subreddit-prefixed]')];

            for (let index = 0; index < postEles.length; index++) {
                const post = postEles[index];

                if (post.classList.contains('TMP_DOWNLOAD_ADDED') || post.querySelector('a[Reddit_Downloader="download"]') != null || post.classList.contains('promotedvideolink') || post == undefined) continue;

                const link = post.querySelector('a[data-event-action="comments"]');
                let url = link;
                post.classList.add('TMP_DOWNLOAD_ADDED')

                const buttons = post.querySelector('.flat-list.buttons');

                const downloadButtonLi = document.createElement('li');
                downloadButtonLi.classList.add('download-button');

                const downloadButtonA = document.createElement('a');
                downloadButtonA.innerHTML = 'Download';
                downloadButtonA.setAttribute('Reddit_Downloader', 'download');

                downloadButtonA.onclick = () => {
                    console.log(`Getting Data from post: ${url}`);
                    this._getPostData(url)
                        .then(data => {
                            if (!document.body.contains(post)) {
                                rej();
                                return;
                            }
                            const info = this._parseData(data[0].data.children[0]);
                            this.downloadSingle(info);
                        })
                }

                downloadButtonLi.appendChild(downloadButtonA);
                buttons.appendChild(downloadButtonLi);


            }

            res();
        })
    }

    async addSettingsButton() {
        waitForElements('.tabmenu', 5000)
        .then(parent => {
            let tabmenu = parent[0];

            let downloadLi = document.createElement('li');
            let downloadA = document.createElement('a');
            downloadA.classList.add('choice');
            downloadA.innerHTML = 'RD-Settings';
            downloadA.style.cursor = 'pointer';
            downloadA.onclick = () => {
                GM_config.open();
            }

            downloadLi.appendChild(downloadA);
            tabmenu.appendChild(downloadLi);
        })
        .catch(() => {
            this.addSettingsButton();
        })
    }

    async pageUpdateChecker() {
        let isAdded = false;
        let username = await this.getUsername();

        while (true) {
            await wait(50);
            _IsOnUserPage = window.location.href.includes('reddit.com/user/' + username);

            if (!_IsOnUserPage) {
                isAdded = false;
                if (window.RedditDownloader != undefined) await window.RedditDownloader.addPostDownloadButton().catch(() => {});
            }
            if (!isAdded && _IsOnUserPage) {
                if (window.RedditDownloader != undefined) {
                    await wait(50);
                    isAdded = await window.RedditDownloader.addSavedDownloadButton();
                }
            }
        }
    }

    async getUsername() {
        return new Promise(async (res, rej) => {
            let usernameEle = [];
            while (usernameEle == undefined || usernameEle == null || usernameEle.length == 0) {
                usernameEle = await waitForElements('.user', 5000);
                console.log("CALLED", usernameEle);
            }

            res(usernameEle[0].children[0].innerText.trim());
        })
    }
}
//#endregion


(async () => {
    if (DEBUG) {
        //let imgur = new Imgur();
        //await imgur.downloadImages('https://imgur.com/a/w0ouO');

        //let direct = new DirectDownload();
        //await direct.downloadImages('')

        //let redgif = new Redgifs();
        //await redgif.downloadImages('');
    }
})()

window.addEventListener('load', async () => {
    if (window.top != window.self) {
        return;
    }

    await wait(100);
    let oldReddit = await isOldReddit();

    if (oldReddit)
        window.RedditDownloader = new OldRedditDownloader();
    else{
        window.RedditDownloader = new RedditDownloader();
    }

    GM_config.init({
        'id': 'Reddit_Downloader',
        'fields': {
            'create_subreddit_folder': {
                'label': 'Create a subreddit folder which stores all subreddit entries.',
                'type': 'checkbox',
                'default': false
            },
            'create_only_for_selected': {
                'label': 'Create a folder only if it passes the filter.',
                'type': 'checkbox',
                'default': false
            },
            'create_for_filter': {
                'label': 'The names of the subreddits to create a folder for. (comma seperated)',
                'type': 'text',
                'size': 9999999,
                'default': ''
            },
            'reddit_username': {
                'label': 'Your Reddit username. Not actually needed right now.',
                'type': 'text',
                'size': 9999999,
                'default': ''
            },
            'imgur_client_id': {
                'label': 'Your imgur Client ID. Incase you want to download imgur images/albums.',
                'type': 'text',
                'size': 9999999,
                'default': ''
            },
            'download_location': {
                'label': 'The download location of the files. Inside of your Downloads folder.',
                'type': 'text',
                'size': 9999999,
                'default': 'Reddit/Stuff/Stuff/'
            }
        }
    });

    GM_registerMenuCommand('Manage Settings', (() => {
        GM_config.open();
    }));
})
