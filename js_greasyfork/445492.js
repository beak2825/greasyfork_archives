// ==UserScript==
// @name         Hcaptcha Solver Workaround
// @namespace    hcaptcha.workaround
// @version      1.0
// @description  Hcaptcha Solver in Browser | Automatically solves Hcaptcha in browser
// @author       Md ubeadulla
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*hcaptcha*
// @match        https://*.hcaptcha.com/*checkbox*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @connect      www.imageidentify.com
// @connect      https://cdnjs.cloudflare.com
// @connect      https://cdn.jsdelivr.net
// @connect      https://unpkg.com
// @connect      https://*.hcaptcha.com/*
// @require      https://unpkg.com/jimp@0.5.2/browser/lib/jimp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/2.0.0-alpha.2/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.13.0/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js

/*
██╗░░██╗░█████╗░░█████╗░██████╗░████████╗░█████╗░██╗░░██╗░█████╗░  ░██████╗░█████╗░██╗░░░░░██╗░░░██╗███████╗██████╗░
██║░░██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║░░██║██╔══██╗  ██╔════╝██╔══██╗██║░░░░░██║░░░██║██╔════╝██╔══██╗
███████║██║░░╚═╝███████║██████╔╝░░░██║░░░██║░░╚═╝███████║███████║  ╚█████╗░██║░░██║██║░░░░░╚██╗░██╔╝█████╗░░██████╔╝
██╔══██║██║░░██╗██╔══██║██╔═══╝░░░░██║░░░██║░░██╗██╔══██║██╔══██║  ░╚═══██╗██║░░██║██║░░░░░░╚████╔╝░██╔══╝░░██╔══██╗
██║░░██║╚█████╔╝██║░░██║██║░░░░░░░░██║░░░╚█████╔╝██║░░██║██║░░██║  ██████╔╝╚█████╔╝███████╗░░╚██╔╝░░███████╗██║░░██║
╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚═╝░░░░░░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝  ╚═════╝░░╚════╝░╚══════╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝
*/
/** Note: This script is solely intended for the use of educational purposes only and not to abuse any website.
 * Sign Up using the referral links or consider a donation to the following addresses:
 ***************************************************************************************************
 * Faucets:                                                                                        *
 * Install the free cryporotator https://greasyfork.org/scripts/425999                             *
 * Or Sign up using the referral link and solve captchas to earn crypto (Do not abuse the websites)*
 * 1.) https://freebitco.in/?r=10071414                                                            *
 * 2.) https://free-doge.com/?ref=215057                                                           *
 * 3.) https://freesteam.io/?ref=145741                                                            *
 * 4.) https://freebitcoin.io/?ref=609010                                                          *
 * 5.) https://free-ltc.com/?ref=186849                                                            *
 * 6.) https://freematic.com/?ref=11970                                                            *
 * 7.) https://freenem.com/?ref=328536                                                             *
 * 8.) https://freepancake.com/?ref=16894                                                          *
 * 9.) https://freeneo.io/?ref=139331                                                              *
 * 10.)https://freeshibainu.com/?ref=30472                                                         *
 * 11.)https://coinfaucet.io/?ref=890330                                                           *
 * 12.)https://freechainlink.io/?ref=111060                                                        *
 * 13.)https://freedash.io/?ref=179942                                                             *
 * 14.)https://freeethereum.com/?ref=298598                                                        *
 * 15.)https://freecardano.com/?ref=422651                                                         *
 * 16.)https://freebinancecoin.com/?ref=279463                                                     *
 * 17.)https://freeusdcoin.com/?ref=176772                                                         *
 * 18.)https://freetether.com/?ref=241612                                                          *
 * 19.)https://free-tron.com/?ref=349501                                                           *
 * 20.)https://betfury.io/?r=61d1d91b981f9c52e622248b                                              *
 ***************************************************************************************************
 * If you want to donate                                                                           *
 * 1.) on TRC20: THXgPrq5brvizsqkitoUXXeyyz8zS9h7Fv                                                *
 * 2.) on BSC/HECO : 0x7c955688ed956804c4aef31c84e32cd50766fe98                                    *
 ***************************************************************************************************
 
 */

// @downloadURL https://update.greasyfork.org/scripts/445492/Hcaptcha%20Solver%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/445492/Hcaptcha%20Solver%20Workaround.meta.js
// ==/UserScript==
(async function() {

    //TODO: Enable debug mode to print console logs
    //TODO: Refactor Code for different models
    'use strict';
    var selectedImageCount = 0;
    var tensorFlowModel = undefined;
    var tensorFlowMobileNetModel = undefined;
    var worker = undefined;

    var identifiedObjectsList = [];
    var exampleImageList = [];
    var identifyObjectsFromImagesCompleted = false;
    var currentExampleUrls = [];

    //Default Language for hcaptcha
    const LANG_ENGLISH = "English"
    const DEFAULT_LANGUAGE = LANG_ENGLISH;
    const ENABLE_DEFAULT_LANGUAGE = true;

    //Guess/Match New Images
    const MATCH_IMAGES_USING_TRAINER = false;
    const GUESS_NEW_IMAGE_TYPE = false;

    //Node Selectors
    const CHECK_BOX = "#checkbox";
    const SUBMIT_BUTTON = ".button-submit";
    const TASK_IMAGE_BORDER = ".task-image .border";
    const IMAGE = ".task-image .image";
    const TASK_IMAGE = ".task-image";
    const PROMPT_TEXT = ".prompt-text";
    const NO_SELECTION = ".no-selection";
    const CHALLENGE_INPUT_FIELD = ".challenge-input .input-field";
    const CHALLENGE_INPUT = ".challenge-input";
    const CHALLENGE_IMAGE = ".challenge-example .image .image";
    const IMAGE_FOR_OCR = ".challenge-image .zoom-image";
    const LANGUAGE_SELECTOR = "#language-list .scroll-container .option span";

    //Attributes
    const ARIA_CHECKED = "aria-checked";
    const ARIA_HIDDEN = "aria-hidden";

    //Values that can be changed for other languages
    const AIRPLANE = "airplane";
    const BICYCLE = "bicycle";
    const BOAT = "boat";
    const BUS = "bus";
    const CAR = "car";
    const MOTORBUS = "motorbus";
    const MOTORCYCLE = "motorcycle";
    const SURFBOARD = "surfboard";
    const TRAIN = "train";
    const TRUCK = "truck";
    const TRIMARAN = "trimaran";
    const SEAPLANE = "seaplane";
    const SPEEDBOAT = "speedboat";

    //Living Room Objects
    const BED = "bed";
    const BOOK = "book";
    const CHAIR = "chair";
    const CLOCK = "clock";
    const COUCH = "couch";
    const DINING_TABLE = "dining table";
    const POTTED_PLANT = "potted plant";
    const TV = "tv";

    //Animals
    const ZEBRA = "zebra";
    const CAT = "cat";
    const DOG = "dog";

    // Vertical River
    const VALLEY = "valley";
    const VERTICAL_RIVER = "vertical river";


    const LIVING_ROOM_TYPES = [BED, BOOK, CHAIR, CLOCK, COUCH, DINING_TABLE, POTTED_PLANT, TV];
    const TRANSPORT_TYPES = [AIRPLANE, BICYCLE, BOAT, BUS, CAR, MOTORBUS, MOTORCYCLE, SEAPLANE, SPEEDBOAT, SURFBOARD, TRAIN, TRIMARAN, TRUCK];
    const ANIMAL_TYPES = [ZEBRA, CAT, DOG];

    const SENTENCE_TEXT_A = "Please click each image containing a ";
    const SENTENCE_TEXT_AN = "Please click each image containing an ";
    const LANGUAGE_FOR_OCR = "eng";

    // Option to override the default image matching
    // Enabling this by default
    const ENABLE_TENSORFLOW = true;

    // Max Skips that can be done while solving the captcha
    // This is likely not to happen, if it occurs retry for new images
    const MAX_SKIPS = 10;
    var skipCount = 0;

    var USE_MOBILE_NET = false;
    var USE_COLOUR_PATTERN = false;
    var NEW_WORD_IDENTIFIED = false;

    //Probablility for objects
    var probabilityForObject = new Map();
    probabilityForObject.set("speedboat", 0.14);
    probabilityForObject.set("fireboat", 0.4);
    probabilityForObject.set("boathouse", 0.4);
    probabilityForObject.set("submarine", 0.5);
    probabilityForObject.set("printer", 0.05);
    probabilityForObject.set("stretcher", 0.05);
    probabilityForObject.set("rotisserie", 0.02);
    probabilityForObject.set("spatula", 0.05);


    String.prototype.includesOneOf = function(arrayOfStrings) {

        //If this is not an Array, compare it as a String
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if ((arrayOfStrings[i].substr(0, 1) == "=" && this.toLowerCase() == arrayOfStrings[i].substr(1).toLowerCase()) ||
                (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase()))) {
                return true;
            }
        }
        return false;
    }

    String.prototype.transliterate = function transliterate() {
        const a = {"ο":"o","ѕ": "s","і":"i","Ё":"E","Й":"I","Ц":"TS","У":"y","К":"K","Е":"E","Н":"H","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"y","к":"k","е":"e","н":"n","г":"r","ш":"sh","щ":"sch","з":"z","х":"x","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"P","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"n","р":"p","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"C","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"c","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
        return this.split('').map(function (char) {
            return a[char] || char;
        }).join("");
    }

    String.prototype.equalsOneOf = function(arrayOfStrings) {

        //If this is not an Array, compare it as a String
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase() == arrayOfStrings.toLowerCase();
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if ((arrayOfStrings[i].substr(0, 1) == "=" && this.toLowerCase() == arrayOfStrings[i].substr(1).toLowerCase()) ||
                (this.toLowerCase() == arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }



    // This script uses imageidentify API (wolfram) . You may also use TensorFlow.js, Yolo latest version to recognize common objects.
    //(When the cloud service is available for yolo, we can switch the API endpoint). Accuracy varies between Wolfram, Tensorflow and Yolo.
    // Use this as a reference to solve recaptcha/other captchas using scripts in browser. This is intended for learning purposes.
    // Using TensorFlow as fallback, but this requires good CPU in order to solve quickly.
    // CPU utilization and memory utlization may go high when using TensorFlow.js
    function matchImages(imageUrl, word, i) {

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.imageidentify.com/objects/user-26a7681f-4b48-4f71-8f9f-93030898d70d/prd/urlapi/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "image=" + encodeURIComponent(imageUrl),
            timeout: 8000,
            onload: function(response) {
                clickImages(response, imageUrl, word, i)
            },
            onerror: function(e) {
                //Using Fallback TensorFlow
                if (e && e.status && e.status != 0) {
                    console.log(e);
                    console.log("Using Fallback");
                }
                matchImagesUsingTensorFlow(imageUrl, word, i);

            },
            ontimeout: function() {
                //console.log("Timed out. Using Fallback");
                matchImagesUsingTensorFlow(imageUrl, word, i);
            },
        });

    }

    function matchImagesUsingTensorFlow(imageUrl, word, i) {
        try {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = () => {
                initializeTensorFlowModel().then(model => model.detect(img))
                    .then(function(predictions) {
                    var predictionslen = predictions.length;
                    for (var j = 0; j < predictionslen; j++) {
                        if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                            qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 0 &&
                            predictions[j].class.includesOneOf(word)) {
                            qSelectorAll(TASK_IMAGE)[i].click();
                            break;
                        }
                    }
                    img.removeAttribute("src");
                    selectedImageCount = selectedImageCount + 1;
                });
            }
        } catch (err) {
            console.log(err.message);
        }
    }


    function matchImagesUsingTensorFlowMobileNet(imageUrl, word, i) {

        try {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = () => {
                initializeTensorFlowMobilenetModel().then(model => model.classify(img))
                    .then(function(predictions) {
                    var predictionslen = predictions.length;
                    for (var j = 0; j < predictionslen; j++) {
                        var probability = 0.077;
                        if (probabilityForObject.get(predictions[j].className)) {
                            probability = probabilityForObject.get(predictions[j].className);
                        }

                        if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                            qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 0 &&
                            predictions[j].className.includesOneOf(word) && predictions[j].probability > probability) {
                            qSelectorAll(TASK_IMAGE)[i].click();
                            break;
                        }
                    }
                    img.removeAttribute("src");
                    selectedImageCount = selectedImageCount + 1;
                });
            }
        } catch (err) {
            console.log(err.message);
        }
    }


    // TODO: Generalize this logic
    // Identifying this based on the observation of the images seen
    // The actual way would be to scan the entire image to find the lake.
    // Mobilenet model in browser js identifies the lake but does not provide coordinates
    // to identify if it is horizontal or vertical
    function matchImageForVerticalRiver(imageUrl, word, i) {

        Jimp.read(imageUrl).then(function (data) {

            data.getBase64(Jimp.AUTO, async function (err, src) {
                var img = document.createElement("img");
                img.setAttribute("src", src);
                await img.decode();
                var imageHeight = img.height;
                var imageWidth = img.width;
                var cropHeight = imageHeight - 0.03*imageHeight;
                let url = src.replace(/^data:image\/\w+;base64,/, "");
                let buffer = new Buffer(url, 'base64');

                Jimp.read(buffer).then(function (data) {
                    data.crop(0, cropHeight, imageWidth, imageHeight)
                        .getBase64(Jimp.AUTO, async function (err, src) {

                        var img = document.createElement("img");
                        img.src = src;
                        await img.decode();

                        var c = document.createElement("canvas")
                        c.width = img.width;
                        c.height = img.height;
                        var ctx = c.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        var imageData = ctx.getImageData(0, 0, c.width, c.height);
                        var data = imageData.data;
                        var count = 0;

                        //Multiple combinations and distances are required for accuracy
                        for (let i = 0; i < data.length; i+= 4) {
                            if( (data[i] < 140 && data[i+1] < 110 && data[i+2] > 80 && data[i+3] == 255) ||
                               (data[i] < 200 && data[i+1] < 200 && data[i+2] > 140 && data[i+3] == 255)){
                                count++;
                            }
                        }

                        if(count > 0.001*(data.length/4) && count < data.length/8) {
                            if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                                qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 0) {
                                qSelectorAll(TASK_IMAGE)[i].click();
                            }
                        }

                        img.removeAttribute("src");
                        selectedImageCount = selectedImageCount + 1;

                    });
                });
                img.removeAttribute("src");
            });
        });
    }


    // This approach is naive approch to store the images and retrieve
    // The accuracy is 100% as long as you store the selected images
    // Browser memory is used to store the images and gets cleared if you delete the browser cache and cookies
    // You may use this to store images in remote place and retrive for quick access
    // This approach is only used during urgent scenarios before training the images
    // Image differnce can also be done with the stored images to identify new image based on the existing if they are nearly equal
    function matchImagesUsingTrainer(imageUrl, word, i) {

        Jimp.read(imageUrl).then(function (data) {

            data.getBase64(Jimp.AUTO, async function (err, src) {  
                var trainerInterval = setInterval(function(){

                    if (!qSelectorAll(IMAGE)[i] || !(qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) ){
                        clearInterval(trainerInterval);
                        return;
                    }
                    
                    if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                        qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 0 && GM_getValue(src) && GM_getValue(src) == word) {
                        console.log("Retrieved image from trainer");
                        selectedImageCount = selectedImageCount + 1;
                        qSelectorAll(TASK_IMAGE)[i].click();
                        clearInterval(trainerInterval);
                        return;
                    }

                    // Overriding Previously Stored values
                    if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                        qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 1 && GM_getValue(src) && GM_getValue(src) != word) {
                        console.log("Overriding image in the trainer");
                        selectedImageCount = selectedImageCount + 1;
                        GM_setValue(src,word);
                        console.log("Image Stored into database");
                        clearInterval(trainerInterval);
                        return;
                    }
                    
                    if (qSelectorAll(IMAGE)[i] && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                        qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 1 && !GM_getValue(src)) {
                        selectedImageCount = selectedImageCount + 1;
                        GM_setValue(src,word);
                        console.log("Image Stored into database");
                        clearInterval(trainerInterval);
                        return;

                    }

                },5000);

            });
        });
    }


    //Function to sleep or delay
    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    //Different Models can be set later based on usecase
    //Ref Models: https://github.com/tensorflow/tfjs-models
    async function initializeTensorFlowModel() {
        if (!tensorFlowModel) {
            tensorFlowModel = await cocoSsd.load();
        }
        return tensorFlowModel;
    }

    //MobileNet ssd model
    async function initializeTensorFlowMobilenetModel() {
        if (!tensorFlowMobileNetModel) {
            tensorFlowMobileNetModel = await mobilenet.load();
        }
        return tensorFlowMobileNetModel;
    }


    //Initialize TesseractWorker
    function initializeTesseractWorker() {
        if (!worker) {
            worker = new Tesseract.TesseractWorker();
        }
    }

    function clickImages(response, imageUrl, word, i) {

        try {
            if (response && response.responseText && (qSelectorAll(IMAGE)[i].style.background).includes(imageUrl) &&
                qSelectorAll(TASK_IMAGE_BORDER)[i].style.opacity == 0) {
                var responseJson = JSON.parse(response.responseText);
                if (responseJson.identify && responseJson.identify.title && responseJson.identify.title.includesOneOf(word)) {
                    qSelectorAll(TASK_IMAGE)[i].click();
                } else if (responseJson.identify && responseJson.identify.entity && responseJson.identify.entity.includesOneOf(word)) {
                    qSelectorAll(TASK_IMAGE)[i].click();
                } else if (responseJson.identify && responseJson.identify.alternatives) {
                    var alternatives = JSON.stringify(responseJson.identify.alternatives);
                    var alternativesJson = JSON.parse(alternatives);

                    for (var key in alternativesJson) {
                        if (alternativesJson.hasOwnProperty(key)) {
                            if ((alternativesJson[key].includesOneOf(word) || key.includesOneOf(word))) {
                                qSelectorAll(TASK_IMAGE)[i].click();
                                break;
                            }
                        }
                    }
                } else {
                    //No Match found
                }

                selectedImageCount = selectedImageCount + 1;

            } else {
                //console.log("Using Fallback TensorFlow");
                matchImagesUsingTensorFlow(imageUrl, word, i);
            }

        } catch (err) {
            //Using Fallback TensorFlow
            //console.log(err.message);
            //console.log("Using Fallback TensorFlow");
            matchImagesUsingTensorFlow(imageUrl, word, i);
        }
    }

    function qSelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    function qSelector(selector) {
        return document.querySelector(selector);
    }


    async function getSynonyms(word) {

        USE_MOBILE_NET = false;
        USE_COLOUR_PATTERN = false;
        NEW_WORD_IDENTIFIED = false;

        //TODO: Format this to JSON string
        if (word == MOTORBUS || word == BUS) {
            word = ['bus', 'motorbus'];
            USE_MOBILE_NET = true;
        } else if (word == CAR) {
            word = ['=car', 'coupe', 'jeep', 'limo', 'sport utility vehicle', 'station wagon', 'hatchback', 'bumper car', 'modelT', 'electric battery', 'cruiser'];
            USE_MOBILE_NET = true;
        } else if (word == AIRPLANE) {
            word = ['airplane', 'plane', 'aircraft', 'aeroplane', 'hangar', 'Airdock', 'JumboJet', 'jetliner', 'stealth fighter', 'field artillery']
            USE_MOBILE_NET = true;
        } else if (word == TRAIN) {
            word = ['train', 'rail', 'cable car', 'locomotive', 'subway station']
            USE_MOBILE_NET = true;
        } else if (word == BOAT || word == SURFBOARD) {
            word = ['=boat', '=barge', 'houseboat', 'boathouse', 'speedboat', '=submarine', 'bobsled', 'catamaran', 'schooner', 'ocean liner', 'lifeboat', 'fireboat', 'yawl', 'pontoon', 'small boat', 'SnowBlower', 'Sea-coast', 'paddlewheel', 'paddle wheel', 'PaddleSteamer', 'Freighter', 'Sternwheeler', 'kayak', 'canoe', 'deck', 'DockingFacility', 'surfboard', '=ship', '=cruise', 'watercraft', 'sail', 'canvas', '=raft']
            USE_MOBILE_NET = true;
        } else if (word == BICYCLE) {
            word = ['bicycle-built-for-two', 'tandem bicycle', 'bicycle', 'tricycle', 'mountain bike', 'AcceleratorPedal', 'macaw', 'knot']
            USE_MOBILE_NET = true;
        } else if (word == MOTORCYCLE) {
            word = ['moped', 'motor scooter', 'scooter', 'motorcycle', 'windshield', 'dashboard']
            USE_MOBILE_NET = true;
        } else if (word == TRUCK) {
            word = ['truck', 'cargocontainer', 'bazooka']
            USE_MOBILE_NET = true;
        } else if (word == TRIMARAN || word == SPEEDBOAT || word == SEAPLANE) {
            word = ['spatula', 'can opener', 'tin opener', 'monitor', 'screen', 'stretcher', 'printer', 'nail', 'mousetrap', 'TRIMARAN', 'space shuttle', 'ski', 'rotisserie', 'geyser', 'plate rack']
            USE_MOBILE_NET = true;
        } else if (word.includesOneOf(LIVING_ROOM_TYPES)) {
            word = ['bed', 'couch', 'chair', 'potted plant', 'dining table', 'clock', 'tv', 'book']
        } else if (word == ZEBRA) {
            word = ['zebra']
        } else if (word == CAT) {
            word = ['cat']
            USE_MOBILE_NET = true;
        } else if (word == DOG) {
            word = ['dog']
        } else if (word == VALLEY || word == VERTICAL_RIVER){
            word = ['alp','volcano']
            USE_COLOUR_PATTERN = true;
        } else {
            NEW_WORD_IDENTIFIED = true;
            console.log("Word does not match. New type identified::" + word);
        }

        return word

    }

    function isHidden(el) {
        return (el.offsetParent === null)
    }

    if (window.location.href.includes("checkbox")) {
        var checkboxInterval = setInterval(function() {
            if (!qSelector(CHECK_BOX)) {
                //Wait until the checkbox element is visible
            } else if (qSelector(CHECK_BOX).getAttribute(ARIA_CHECKED) == "true") {
                clearInterval(checkboxInterval);
            } else if (!isHidden(qSelector(CHECK_BOX)) && qSelector(CHECK_BOX).getAttribute(ARIA_CHECKED) == "false") {
                qSelector(CHECK_BOX).click();
            } else {
                return;
            }

        }, 5000);
    } else {

        try {
            await initializeTesseractWorker();
            await initializeTensorFlowModel();
            await initializeTensorFlowMobilenetModel();
            selectImages();

        } catch (err) {
            console.log(err);
            console.log("Tesseract could not be initialized");
        }

    }

    function selectImagesAfterDelay(delay) {
        setTimeout(function() {
            selectImages();
        }, delay * 1000);
    }

    function triggerEvent(el, type) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    }

    function triggerMouseEvent(el, type) {
        var e = document.createEvent('MouseEvent');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    }

    // Small hack to select the nodes
    function unsure(targetNodeText) {
        var targetNode = Array.from(qSelectorAll('div'))
        .find(el => el.textContent === targetNodeText);
        //Works for now
        //TODO: Select clothing
        //TODO: Draw boxes around images
        if (targetNode) {
            triggerMouseEvent(targetNode, 'mousedown');
            triggerMouseEvent(targetNode, 'mouseup');
            if (qSelector(SUBMIT_BUTTON)) {
                qSelector(SUBMIT_BUTTON).click();
            }
        }
        return selectImagesAfterDelay(1);
    }

    function getUrlFromString(urlString) {

        var imageUrl = urlString.substring(
            urlString.indexOf('"') + 1,
            urlString.lastIndexOf('"')
        );

        if (!imageUrl || !imageUrl.includes("https")) {
            return 0;
        }

        return imageUrl;
    }


    function getImageList() {
        var imageList = [];
        if (qSelectorAll(IMAGE).length > 0) {
            for (var i = 0; i < 9; i++) {
                var urlString = qSelectorAll(IMAGE)[i].style.background;
                var imageUrl = getUrlFromString(urlString);
                if (imageUrl == 0) {
                    //console.log("Image url is empty");
                    return imageList;
                }
                imageList[i] = imageUrl;
            }
        }
        return imageList;
    }

    function waitUntilImageSelection() {
        var imageIntervalCount = 0;
        var imageInterval = setInterval(function() {
            imageIntervalCount = imageIntervalCount + 1;
            if (selectedImageCount == 9) {
                clearInterval(imageInterval);
                if (qSelector(SUBMIT_BUTTON)) {
                    qSelector(SUBMIT_BUTTON).click();
                }
                return selectImagesAfterDelay(5);
            } else if (imageIntervalCount > 8) {
                clearInterval(imageInterval);
                return selectImages();
            } else if(selectedImageCount > 2 && MATCH_IMAGES_USING_TRAINER && NEW_WORD_IDENTIFIED && imageIntervalCount > 4){
                clearInterval(imageInterval);
                if (qSelector(SUBMIT_BUTTON)) {
                    qSelector(SUBMIT_BUTTON).click();
                }
                return selectImagesAfterDelay(5);
            } else if(MATCH_IMAGES_USING_TRAINER && NEW_WORD_IDENTIFIED && imageIntervalCount > 6){
                clearInterval(imageInterval);
                if (qSelector(SUBMIT_BUTTON)) {
                    qSelector(SUBMIT_BUTTON).click();
                }
                return selectImagesAfterDelay(5);
            }else{

            }
        }, 3000);
    }

    function waitForImagesToAppear() {
        var checkImagesSelectedCount = 0;
        var waitForImagesInterval = setInterval(function() {
            checkImagesSelectedCount = checkImagesSelectedCount + 1;
            if (qSelectorAll(IMAGE) && qSelectorAll(IMAGE).length == 9) {
                clearInterval(waitForImagesInterval);
                return selectImages();
            } else if (checkImagesSelectedCount > 60) {
                clearInterval(waitForImagesInterval);
            } else if (qSelector(CHALLENGE_INPUT_FIELD) && qSelector(NO_SELECTION).getAttribute(ARIA_HIDDEN) != true) {
                clearInterval(waitForImagesInterval);
                return imageUsingOCR();
            } else {
                //TODO: Identify Objects for the following (Ex: bed,chair,table etc)
                //Ref for clothing: https://www.youtube.com/watch?v=yWwzFnAnrLM, https://www.youtube.com/watch?v=FiNglI1wRNk,https://www.youtube.com/watch?v=oHAkK_9UCQ8
                var targetNodeList = ["Yes", "3 or more items of furniture", "Equipped space or room", "Photo is clean, no watermarks, logos or text overlays", "An interior photo of room", "Unsure", "Photo is sharp"];
                for (var j = 0; j < targetNodeList.length; j++) {
                    var targetNode = Array.from(qSelectorAll('div'))
                    .find(el => el.textContent === targetNodeList[j]);
                    if (targetNode) {
                        //console.log("Target Node Found");
                        clearInterval(waitForImagesInterval);
                        return unsure(targetNodeList[j]);
                    }
                }
            }
        }, 5000);
    }

    //TODO: Convert Image to base64 to avoid multiple calls
    function preProcessImage(base64Image, imageUrl) {

        //Darken and Brighten
        Jimp.read(base64Image).then(function(data) {
            data.color([

                {
                    apply: 'darken',
                    params: [20]
                }

            ]).color([

                {
                    apply: 'brighten',
                    params: [20]
                }

            ])
                .greyscale()
                .getBase64(Jimp.AUTO, function(err, src) {
                var img = document.createElement("img");
                img.setAttribute("src", src);

                worker.recognize(img, LANGUAGE_FOR_OCR).then(function(data) {
                    //Remove Image After recognizing
                    img.removeAttribute("src");
                    //If null change to other methods
                    if (data && data.text && data.text.length > 0) {
                        inputChallenge(postProcessImage(data), imageUrl);
                        return selectImages();
                    } else {
                        preProcessImageMethod2(base64Image, imageUrl);
                    }
                });

            });
        });

    }


    function preProcessImageMethod2(base64Image, trimageUrl) {

        //Multi Contrast darken and brighten
        Jimp.read(base64Image).then(function(data) {
            data.color([

                {
                    apply: 'darken',
                    params: [20]
                }

            ]).contrast(1).color([

                {
                    apply: 'brighten',
                    params: [20]
                }

            ]).contrast(1).greyscale().getBase64(Jimp.AUTO, function(err, src) {
                var img = document.createElement("img");
                img.setAttribute("src", src);

                worker.recognize(img, LANGUAGE_FOR_OCR).then(function(data) {
                    //Remove Image After recognizing
                    img.removeAttribute("src");
                    if (data && data.text && data.text.length > 0) {
                        inputChallenge(postProcessImage(data), imageUrl);
                        return selectImages();
                    } else {
                        preProcessImageMethod3(base64Image, imageUrl);
                    }
                });
            });
        });

    }

    function preProcessImageMethod3(base64Image, imageUrl) {
        //Multi Contrast only brighten
        Jimp.read(base64Image).then(function(data) {
            data.contrast(1).color([{
                apply: 'brighten',
                params: [20]
            }

                                   ])
                .contrast(1)
                .greyscale()
                .getBase64(Jimp.AUTO, function(err, src) {
                var img = document.createElement("img");
                img.setAttribute("src", src);

                worker.recognize(img, LANGUAGE_FOR_OCR).then(function(data) {
                    //Remove Image After recognizing
                    img.removeAttribute("src");
                    if (data && data.text && data.text.length > 0) {
                        inputChallenge(postProcessImage(data), imageUrl);
                        return selectImages();
                    } else {
                        preProcessImageMethod4(base64Image, imageUrl);
                    }
                });
            });
        });
    }

    function preProcessImageMethod4(base64Image, imageUrl) {
        //Resize the image
        Jimp.read(base64Image).then(function(data) {
            data.resize(256, Jimp.AUTO)
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .getBase64(Jimp.AUTO, function(err, src) {
                var img = document.createElement("img");
                img.setAttribute("src", src);

                worker.recognize(img, LANGUAGE_FOR_OCR).then(function(data) {
                    //Remove Image After recognizing
                    img.removeAttribute("src");
                    inputChallenge(postProcessImage(data), imageUrl);
                    return selectImages();
                });
            });
        });

    }

    function postProcessImage(data) {
        var filterValues = ['\n', '{', '}', '[', ']'];
        for (var i = 0; i < filterValues.length; i++) {
            data.text = data.text.replaceAll(filterValues[i], "");
        }
        return data;
    }

    // Using Tesseract to recognize images
    function imageUsingOCR() {
        try {
            //console.log("Image using OCR");
            var urlString = qSelector(IMAGE_FOR_OCR).style.background;
            var imageUrl = getUrlFromString(urlString);
            if (imageUrl == 0) {
                return selectImagesAfterDelay(1);
            }

            Jimp.read(imageUrl).then(function(data) {

                data.getBase64(Jimp.AUTO, function(err, src) {

                    var img = document.createElement("img");
                    img.setAttribute("src", src);
                    var base64Image = img.src;

                    preProcessImage(base64Image, imageUrl);

                })});

        } catch (err) {
            console.log(err.message);
            return selectImagesAfterDelay(1);
        }
    }


    async function convertTextToImage(text) {

        //Convert Text to image
        var canvas = document.createElement("canvas");
        var textLength = text.length;
        canvas.width = 60 * textLength;
        canvas.height = 80;
        var ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillText(text, 10, 50);
        var img = document.createElement("img");
        img.src = canvas.toDataURL();

        return img;
    }

    async function convertImageToText(img) {

        await initializeTesseractWorker();

        //Convert Image to Text
        var text = "";
        await worker.recognize(img, LANGUAGE_FOR_OCR).then(function(data) {
            text = data.text;
            // console.log("Recognized Text::" + text);
        });
        return text.trim();
    }

    function areExampleImageUrlsChanged() {

        var prevExampleUrls = exampleImageList;
        currentExampleUrls = [];

        if (qSelectorAll(CHALLENGE_IMAGE).length > 0) {
            for (let i = 0; i < qSelectorAll(CHALLENGE_IMAGE).length; i++) {
                var urlString = qSelectorAll(CHALLENGE_IMAGE)[i].style.background;
                var imageUrl = getUrlFromString(urlString);
                if (imageUrl == 0) {
                    console.log("Image url is empty, Retrying...");
                    return true;
                }
                currentExampleUrls[i] = imageUrl;
            }
        }

        if (prevExampleUrls.length != currentExampleUrls.length) {
            return true;
        }

        for (let i = 0; i < currentExampleUrls.length; i++) {

            if (prevExampleUrls[i] != currentExampleUrls[i]) {
                return true;
            }
        }

        return false;
    }

    async function identifyObjectsFromImages(imageUrlList) {
        identifiedObjectsList = [];

        for (let i = 0; i < imageUrlList.length; i++) {
            try {
                let img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = imageUrlList[i];
                img.onload = () => {
                    initializeTensorFlowModel().then(model => model.detect(img))
                        .then(function(predictions) {
                        let predictionslen = predictions.length;
                        let hashSet = new Set();
                        for (let j = 0; j < predictionslen; j++) {
                            hashSet.add(predictions[j].class);
                        }

                        hashSet.forEach((key) => {
                            identifiedObjectsList.push(key);
                        });

                        img.removeAttribute("src");

                        if (i == imageUrlList.length - 1) {
                            identifyObjectsFromImagesCompleted = true;
                        }

                    })
                }
            } catch (e) {
                console.log(e);
            }

        }

    }

    async function identifyObjectsFromImagesUsingMobileNet(imageUrlList) {
        identifiedObjectsList = [];

        for (let i = 0; i < imageUrlList.length; i++) {
            try {
                let img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = imageUrlList[i];
                img.onload = () => {
                    initializeTensorFlowMobilenetModel().then(model => model.classify(img))
                        .then(function(predictions) {

                        let predictionslen = predictions.length;
                        let hashSet = new Set();
                        for (let j = 0; j < predictionslen; j++) {
                            if(predictions[j].className.includes(",")){
                                var multiPredictions = predictions[j].className.split(',');
                                for(let k=0; k< multiPredictions.length;k++){
                                    hashSet.add(multiPredictions[k].trim());
                                }
                            }else{
                                hashSet.add(predictions[j].className);
                            }
                        }

                        hashSet.forEach((key) => {
                            identifiedObjectsList.push(key);
                        });

                        img.removeAttribute("src");

                        if (i == imageUrlList.length - 1) {
                            identifyObjectsFromImagesCompleted = true;
                        }

                    })
                }
            } catch (e) {
                console.log(e);
            }

        }

    }

    async function getWordFromIdentifiedObjects(identifiedObjectsList) {

        var hashMap = new Map();
        for (var i = 0; i < identifiedObjectsList.length; i++) {
            if (hashMap.has(identifiedObjectsList[i])) {
                hashMap.set(identifiedObjectsList[i], hashMap.get(identifiedObjectsList[i]) + 1)
            } else {
                hashMap.set(identifiedObjectsList[i], 1)
            }
        }
        var maxCount = 0,
            objectKey = -1;
        await hashMap.forEach((value, key) => {
            if (maxCount < value && (key.equalsOneOf(TRANSPORT_TYPES) ||
                                     key.equalsOneOf(LIVING_ROOM_TYPES) ||
                                     key.equalsOneOf(ANIMAL_TYPES)|| key == VALLEY)) {
                objectKey = key;
                maxCount = value;
            }

        });

        return objectKey;
    }


    function inputChallenge(data, imageUrl) {
        try {
            if ((qSelector(IMAGE_FOR_OCR).style.background).includes(imageUrl)) {
                console.log(data.text);
                var targetNode = qSelector(CHALLENGE_INPUT_FIELD);
                targetNode.value = data.text.replaceAll("\n", "");
                var challengeInput = qSelector(CHALLENGE_INPUT);
                triggerEvent(challengeInput, 'input');
                // Set a timeout if you want to see the text
                qSelector(SUBMIT_BUTTON).click();
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    async function identifyWordFromExamples() {

        var word = -1;
        if (areExampleImageUrlsChanged()) {
            exampleImageList = currentExampleUrls;
            if (exampleImageList.length == 0) {
                return -1;
            }
            identifyObjectsFromImages(exampleImageList);
            while (!identifyObjectsFromImagesCompleted) {
                await delay(2000)
            }
            identifyObjectsFromImagesCompleted = false;
            word = await getWordFromIdentifiedObjects(identifiedObjectsList);

            //Word has not been identified yet, use mobile net to recognize images
            if (word == -1) {
                //Initialiaze MobileNet Model
                await initializeTensorFlowMobilenetModel();
                identifyObjectsFromImagesUsingMobileNet(exampleImageList);
                while (!identifyObjectsFromImagesCompleted) {
                    await delay(2000)
                }
                identifyObjectsFromImagesCompleted = false;

                word = getWordFromIdentifiedObjects(identifiedObjectsList);
            }
            return word;

        } else {
            return getWordFromIdentifiedObjects(identifiedObjectsList);
        }

        return word;
    }

    var prevObject = "";

    function isObjectChanged() {
        if (!prevObject && qSelector(PROMPT_TEXT)) {
            prevObject = qSelector(PROMPT_TEXT).innerText;
            return true;
        }

        if (prevObject && qSelector(PROMPT_TEXT) &&
            prevObject == qSelector(PROMPT_TEXT).innerText) {
            return false;
        }

        return true;

    }


    async function identifyWord() {
        var word = -1;
        try {
            if (window.location.href.includes('&hl=en') || (ENABLE_DEFAULT_LANGUAGE && DEFAULT_LANGUAGE == LANG_ENGLISH)) {
                word = qSelector(PROMPT_TEXT) ? qSelector(PROMPT_TEXT).innerText.transliterate() : word;
                if (word && (word.includes(SENTENCE_TEXT_A) || word.includes(SENTENCE_TEXT_AN))) {
                    word = word.replace(SENTENCE_TEXT_A, '');
                    word = word.replace(SENTENCE_TEXT_AN, '');
                }

                if (word.equalsOneOf(TRANSPORT_TYPES) || word == VERTICAL_RIVER) {
                    return word;
                } else {
                    //Using OCR on Text for accurate result
                    console.log("New word or different cyrillic");
                    var img = await convertTextToImage(word);
                    word = await convertImageToText(img);
                    word = word.replace(SENTENCE_TEXT_A, '');
                    word = word.replace(SENTENCE_TEXT_AN, '');
                    if (word.equalsOneOf(TRANSPORT_TYPES) || word == VERTICAL_RIVER) {
                        return word;
                    } else {
                        if(MATCH_IMAGES_USING_TRAINER){
                            word = qSelector(PROMPT_TEXT) ? qSelector(PROMPT_TEXT).innerText : -1;
                            if(word){
                              img = await convertTextToImage(word);
                              word = await convertImageToText(img);
                            }
                            return word;
                        }else{
                            word = await identifyWordFromExamples();
                        }
                    }
                }
            } else {

                //If word is not english
                //Identify Images from Example
                word = await identifyWordFromExamples();
            }

        } catch (e) {
            console.log(e);
        }

        return word;
    }

    var prevWord = "";

    async function selectImages() {

        if (ENABLE_DEFAULT_LANGUAGE) {
            for (let i = 0; i < qSelectorAll(LANGUAGE_SELECTOR).length; i++) {
                if (qSelectorAll(LANGUAGE_SELECTOR)[i].innerText == DEFAULT_LANGUAGE) {
                    document.querySelectorAll(LANGUAGE_SELECTOR)[i].click();
                    await delay(1000);
                }
            }
        }

        if (qSelectorAll(IMAGE) && qSelectorAll(IMAGE).length == 9 && qSelector(NO_SELECTION).getAttribute(ARIA_HIDDEN) != true) {
            selectedImageCount = 0;
            try {

                if (isObjectChanged()) {
                    prevWord = await identifyWord();
                }

                var word = prevWord;

                if (word == -1 && skipCount >= MAX_SKIPS) {
                    console.log("Max Retries Attempted. Captcha cannot be solved");
                    return;
                } else if (word == -1 && skipCount < MAX_SKIPS) {
                    skipCount++;
                    if (qSelector(SUBMIT_BUTTON)) {
                        qSelector(SUBMIT_BUTTON).click();
                    }
                    return selectImagesAfterDelay(5);
                } else {
                    //Get Synonyms for the word
                    word = await getSynonyms(word);
                    //console.log("words are::" + word);
                }


            } catch (err) {
                console.log(err.message);
                return selectImagesAfterDelay(5);
            }

            var imageList = [];
            try {
                imageList = getImageList();
                if (imageList.length != 9) {
                    //console.log("Waiting");
                    // Image containers are visible but there are no urls in the image
                    // Skip the image
                    if (qSelector(SUBMIT_BUTTON)) {
                        qSelector(SUBMIT_BUTTON).click();
                    }
                    return selectImagesAfterDelay(5);
                }
            } catch (err) {
                console.log(err.message);
                return selectImagesAfterDelay(5);
            }

            //Identifying word for seaplane and matching images
            //TODO: Refactor Code to combine different models or use only one model based on accuracy
            if(word && word != -1 && MATCH_IMAGES_USING_TRAINER && NEW_WORD_IDENTIFIED){
                for (let i = 0; i < 9; i++) {
                    matchImagesUsingTrainer(imageList[i], word, i);
                }
            }else if(word && word != -1 && USE_COLOUR_PATTERN){
                for (let i = 0; i < 9; i++) {
                    matchImageForVerticalRiver(imageList[i], word, i);
                }
            }else if (word && word != -1 && USE_MOBILE_NET) {
                for (let i = 0; i < 9; i++) {
                    matchImagesUsingTensorFlowMobileNet(imageList[i], word, i);
                }
            } else if (word && word != -1) {
                for (var i = 0; i < 9; i++) {
                    if (ENABLE_TENSORFLOW) {
                        matchImagesUsingTensorFlow(imageList[i], word, i);
                    } else {
                        matchImages(imageList[i], word, i);
                    }
                }
            }
            waitUntilImageSelection();

        } else {
            waitForImagesToAppear();
        }
    }


})();