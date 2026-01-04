// ==UserScript==
// @name         Hcaptcha Solver (Automatically solves Hcaptcha in browser)
// @namespace    Hcaptcha Solver
// @version      6.8
// @description  Hcaptcha Solver in Browser | Automatically solves Hcaptcha in browser
// @author       Md ubeadulla
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      www.imageidentify.com
// @connect      https://cdnjs.cloudflare.com
// @connect      https://cdn.jsdelivr.net
// @connect      https://unpkg.com
// @connect      https://*.hcaptcha.com/*
// @run-at       document-start
// @require      https://unpkg.com/jimp@0.5.2/browser/lib/jimp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/2.0.0-alpha.2/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.12.0/dist/tf.min.js
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
 * Install the free cryporotator https://greasyfork.org/en/scripts/426599-free-cryptorotator       *
 * Or Sign up using the referral link and solve captchas to earn crypto (Do not abuse the websites)*
 * 1.) https://get-bitcoin.net/?ref=9230                                                           *
 * 2.) https://getdoge.io/?ref=34017                                                               *
 * 3.) https://r.adbtc.top/1771513                   *
 * 4.) https://cryptowin.io/ref/ubeadulla                                                          *
 * 5.) https://winalittle.fun/referral/02c7061877cec89e81a306303d36b77c                            *
 * 6.) https://faucetofbob.xyz/?ref=2121                                                           *
 * 7.) https://free-litecoin.com/login?referer=1035367                                             *
 * 8.) https://free-ethereum.io/?referer=742436                                                    *
 * 9.) https://litking.biz/signup?r=125431                                                         *
 * 10.) https://bitking.biz/signup?r=75339                                                         *
 ***************************************************************************************************
 * MicroWallets:                                                                                   *
 * 1.) FaucetPay: BTC: 1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5                                          *
 *     LTC: MHpCuD3zAFEkeuhbgLbuZKcfdqMFkaLSem                                                     *
 *     BCH: bitcoincash:qp7ywra8h7lwatcuc7u65lv8x6rv5kn4sutrsnzrpx                                 *
 *     TRX: TLs3iQfXJs1rmUuG6pkLkUwcu32mFUwzgu                                                     *
 *     Doge: DPtBQG9GNTYHUFkjB2zYWYah4nCCogVAt9                                                    *
 * 2.) ExpressCrypto:                                                                              *
 *    BTC Wallet: 3DftzBztFkDVP3rSSzD9YJ9FKieGfbAotw                                               *
 *    Doge Wallet: D78xByqXqW6vCt8btam5T83Ejkw8MBs7nB                                              *
 *    LTC Wallet: MNw2cMXHxPfWzeodngfxWjurwqjKvVECfS                                               *
 * 3.) Direct BTC: 35HbfGfvbdctzY6tT4jcHXRx4zonBTnDuC                                              *
 ***************************************************************************************************
 * Cloud Mining Websites Just SignUp and earn passive income                                       *                                                                                       *
 * 1.) https://tronrex.online/r/86733                                                              *
 *                                                     *
 ***************************************************************************************************
 */

// @downloadURL https://update.greasyfork.org/scripts/439135/Hcaptcha%20Solver%20%28Automatically%20solves%20Hcaptcha%20in%20browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439135/Hcaptcha%20Solver%20%28Automatically%20solves%20Hcaptcha%20in%20browser%29.meta.js
// ==/UserScript==
(function() {

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
    const ZEBRA = "zebra"

    const LIVING_ROOM_TYPES = [BED, BOOK, CHAIR, CLOCK, COUCH, DINING_TABLE, POTTED_PLANT, TV];
    const TRANSPORT_TYPES = [AIRPLANE, BICYCLE, BOAT, BUS, CAR, MOTORBUS, MOTORCYCLE, SEAPLANE, SPEEDBOAT, SURFBOARD, TRAIN, TRIMARAN, TRUCK];
    const ANIMAL_TYPES = [ZEBRA];

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
    
    //Probablility for objects
    var probabilityForObject = new Map()
    probabilityForObject.set("speedboat",0.14);
    probabilityForObject.set("fireboat",0.4);
    probabilityForObject.set("boathouse",0.4);
    probabilityForObject.set("submarine",0.5);
    probabilityForObject.set("printer",0.05);
    probabilityForObject.set("stretcher",0.05);

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
                if(e && e.status && e.status != 0){
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
                        if(probabilityForObject.get(predictions[j].className)){
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
        if(!worker){
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

        //TODO: Format this to JSON string
        if (word == MOTORBUS || word == BUS) {
            word = ['bus', 'motorbus'];
        } else if (word == CAR) {
            word = ['=car', 'coupe', 'jeep', 'limo', 'sport utility vehicle', 'station wagon', 'hatchback', 'bumper car', 'modelT', 'electric battery', 'cruiser'];
        } else if (word == AIRPLANE) {
            word = ['airplane', 'plane', 'aircraft', 'aeroplane', 'hangar', 'Airdock', 'JumboJet', 'jetliner', 'stealth fighter', 'field artillery']
        } else if (word == TRAIN) {
            word = ['train', 'rail', 'cable car', 'locomotive', 'subway station']
        } else if (word == BOAT || word == SURFBOARD) {
            word = ['=boat', '=barge', 'houseboat', 'boathouse', 'speedboat', '=submarine', 'bobsled', 'catamaran', 'schooner', 'ocean liner', 'lifeboat', 'fireboat', 'yawl', 'pontoon', 'small boat', 'SnowBlower', 'Sea-coast', 'paddlewheel', 'paddle wheel', 'PaddleSteamer', 'Freighter', 'Sternwheeler', 'kayak', 'canoe', 'deck', 'DockingFacility', 'surfboard', '=ship', '=cruise', 'watercraft', 'sail', 'canvas', '=raft']
            USE_MOBILE_NET = true;
        } else if (word == BICYCLE) {
            word = ['bicycle', 'tricycle', 'mountain bike', 'AcceleratorPedal', 'macaw', 'knot']
        } else if (word == MOTORCYCLE) {
            word = ['moped', 'motor scooter', 'scooter', 'motorcycle', 'windshield', 'dashboard']
            USE_MOBILE_NET = true;
        } else if (word == TRUCK) {
            word = ['truck', 'cargocontainer', 'bazooka']
        } else if (word == TRIMARAN || word == SPEEDBOAT || word == SEAPLANE) {
            word = ['stretcher', 'printer', 'nail', 'mousetrap', 'TRIMARAN','space shuttle', 'ski', 'rotisserie', 'geyser', 'plate rack']
            USE_MOBILE_NET = true;
        } else if (word.includesOneOf(LIVING_ROOM_TYPES)){
            word = ['bed', 'couch', 'chair', 'potted plant', 'dining table', 'clock', 'tv', 'book']
        } else if (word.includesOneof(ANIMAL_TYPES)){
            word = ['zebra']
        } else {
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

        }, 500);
    } else {

        try {
            initializeTesseractWorker();
            selectImages();

        } catch (err) {
            console.log(err);
            console.log("Tesseract could not be initialized");
        }

    }

    function selectImagesAfterDelay(delay) {
        setTimeout(function() {
            selectImages();
        }, delay * 500);
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

        if(!imageUrl || !imageUrl.includes("https")){
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
            } else {

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
    function preProcessImage(imageUrl) {

        //Darken and Brighten
        Jimp.read(imageUrl).then(function(data) {
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
                        preProcessImageMethod2(imageUrl);
                    }
                });

            });
        });

    }


    function preProcessImageMethod2(imageUrl) {

        //Multi Contrast darken and brighten
        Jimp.read(imageUrl).then(function(data) {
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
                        preProcessImageMethod3(imageUrl);
                    }
                });
            });
        });

    }

    function preProcessImageMethod3(imageUrl) {
        //Multi Contrast only brighten
        Jimp.read(imageUrl).then(function(data) {
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
                        preProcessImageMethod4(imageUrl);
                    }
                });
            });
        });
    }

    function preProcessImageMethod4(imageUrl) {
        //Resize the image
        Jimp.read(imageUrl).then(function(data) {
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

            preProcessImage(imageUrl);

        } catch (err) {
            console.log(err.message);
            return selectImagesAfterDelay(1);
        }
    }


    async function convertTextToImage(text) {

        //Convert Text to image
        var canvas = document.createElement("canvas");
        canvas.width = 620;
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

    function areExampleImageUrlsChanged(){

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

        if(prevExampleUrls.length != currentExampleUrls.length){
            return true;
        }

        for(let i=0; i< currentExampleUrls.length;i++){

            if(prevExampleUrls[i] != currentExampleUrls[i]){
                return true;
            }
        }

        return false;
    }

    async function identifyObjectsFromImages(imageUrlList){
        identifiedObjectsList = [];

        for(let i=0;i< imageUrlList.length; i++){
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

                        if(i == imageUrlList.length-1){
                            identifyObjectsFromImagesCompleted = true;
                        }

                    })
                }
            }catch(e){
                console.log(e);
            }

        }

    }

    async function identifyObjectsFromImagesUsingMobileNet(imageUrlList){
        identifiedObjectsList = [];

        for(let i=0;i< imageUrlList.length; i++){
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
                            hashSet.add(predictions[j].className);
                        }

                        hashSet.forEach((key) => {
                            identifiedObjectsList.push(key);
                        });

                        img.removeAttribute("src");

                        if(i == imageUrlList.length-1){
                            identifyObjectsFromImagesCompleted = true;
                        }

                    })
                }
            }catch(e){
                console.log(e);
            }

        }

    }

    async function getWordFromIdentifiedObjects(identifiedObjectsList){

        var hashMap = new Map();
        for (var i = 0; i < identifiedObjectsList.length; i++)
        {
            if(hashMap.has(identifiedObjectsList[i])){
                hashMap.set(identifiedObjectsList[i], hashMap.get(identifiedObjectsList[i])+1)
            }
            else{
                hashMap.set(identifiedObjectsList[i], 1)
            }
        }
        var maxCount = 0, objectKey = -1;
        await hashMap.forEach((value,key) => {
            if (maxCount < value && (key.equalsOneOf(TRANSPORT_TYPES) ||
                                     key.equalsOneOf(LIVING_ROOM_TYPES) ||
                                     key.equalsOneOf(ANIMAL_TYPES))) {
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

    async function identifyWordFromExamples(){

        var word = -1;
        if(areExampleImageUrlsChanged()){
            exampleImageList = currentExampleUrls;
            if(exampleImageList.length == 0){
                return -1;
            }
            identifyObjectsFromImages(exampleImageList);
            while (!identifyObjectsFromImagesCompleted) {
                await delay(2000)
            }
            identifyObjectsFromImagesCompleted = false;
            word = await getWordFromIdentifiedObjects(identifiedObjectsList);

            //Word has not been identified yet, use mobile net to recognize images
            if(word == -1) {
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

        } else{
            return getWordFromIdentifiedObjects(identifiedObjectsList);
        }

        return word;
    }

    var prevObject = "";
    function isObjectChanged (){
        if(!prevObject && qSelector(PROMPT_TEXT)){
            prevObject = qSelector(PROMPT_TEXT).innerText;
            return true;
        }

        if(prevObject && qSelector(PROMPT_TEXT) &&
           prevObject == qSelector(PROMPT_TEXT).innerText){
            return false;
        }

        return true;

    }


    async function identifyWord() {
        var word = -1;
        try{
            if(window.location.href.includes('&hl=en')){
                word = qSelector(PROMPT_TEXT) ? qSelector(PROMPT_TEXT).innerText : word;
                if (word && (word.includes(SENTENCE_TEXT_A) || word.includes(SENTENCE_TEXT_AN))) {
                    word = word.replace(SENTENCE_TEXT_A, '');
                    word = word.replace(SENTENCE_TEXT_AN, '');
                }

                if(word.equalsOneOf(TRANSPORT_TYPES)){
                    return word;
                }else{
                    //Using OCR on Text for accurate result
                    console.log("New word or different cyrillic");
                    var img = await convertTextToImage(word);
                    word = await convertImageToText(img);
                    word = word.replace(SENTENCE_TEXT_A, '');
                    word = word.replace(SENTENCE_TEXT_AN, '');
                    if(word.equalsOneOf(TRANSPORT_TYPES)){
                        return word;
                    }else{
                        word = await identifyWordFromExamples();
                    }
                }
            }else{

                //If word is not english
                //Identify Images from Example
                word = await identifyWordFromExamples();
            }

        }catch(e){
            console.log(e);
        }

        return word;
    }

    var prevWord = "";

    async function selectImages() {

        if (qSelectorAll(IMAGE) && qSelectorAll(IMAGE).length == 9 && qSelector(NO_SELECTION).getAttribute(ARIA_HIDDEN) != true) {
            selectedImageCount = 0;
            try {
                await initializeTensorFlowModel();

                if(isObjectChanged()){
                    prevWord = await identifyWord();
                }

                var word = prevWord;


                if(word == -1 && skipCount >= MAX_SKIPS) {
                    console.log("Max Retries Attempted. Captcha cannot be solved");
                    return;
                } else if(word == -1 && skipCount < MAX_SKIPS) {
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
            if(word && word != -1 && USE_MOBILE_NET){
                for (let i = 0; i < 9; i++) {
                    matchImagesUsingTensorFlowMobileNet(imageList[i], word, i);
                }
            }else if(word && word != -1) {
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