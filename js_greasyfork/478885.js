// ==UserScript==
// @name         WAFRA4WikiTravel
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Web Augmentation Framework for Accessibility (WAFRA) for WikiTravel
// @author       Cesar Gonzalez Mora
// @match        *://wikitravel.org/*
// @noframes
// @exclude      *://www.youtube.com/embed/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.slim.min.js
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/478885/WAFRA4WikiTravel.user.js
// @updateURL https://update.greasyfork.org/scripts/478885/WAFRA4WikiTravel.meta.js
// ==/UserScript==


/*********************** Variables ************************/
var myStorage = window.localStorage;
var readerRate = 1.0;
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const recognition = new SpeechRecognition();
var timeoutResumeInfinity;

//var listeningActive = true;

var recognitionActive = true;
var recognitionFailedFirstTime = true;
var recognitionFailedText = "Command not recognised, please try again.";
var recognitionFailedTextES = "Comando no reconocido, por favor inténtelo de nuevo.";
var reading = false;
var readFirstTime = true;

var localStoragePrefix;

var operations = [];
var annotations = [];

var languageCodeSyntesis = "en";
var languageCodeCommands = "en";

var spanishDomain = false;

var languageCodeSyntesisES = "es";
var languageCodeCommandsES = "es";

var listOperationsCommand = "list operations";
var listSectionsCommand = "list sections";
var listSectionCommand = "list section";
var welcomeCommand = "welcome";
var stopListeningCommand = "stop listening";
var changeCommand = "change";
var cancelCommand = "cancel";
var activateCommand = "activate";
var deactivateCommand = "deactivate";
var loadAnnotationsCommand = "load annotations";
var loadAnnotationCommand = "load annotation";
var rateCommand = "score";
var changeCommandQuestion = "which command";
var newCommandQuestion = "which is the new command";

var listOperationsCommandES = "listar operaciones";
var listSectionsCommandES = "listar secciones";
var listSectionCommandES = "listar sección";

var readSectionsCommand = "read sections";
var readSectionsCommandES = "leer secciones";
var readNextSectionCommand = "read next";
var readNextSectionCommandES = "leer siguiente";
var readPreviousSectionCommand = "read previous";
var readPreviousSectionCommandES = "leer anterior";

var readFasterCommand = "faster";
var readFasterCommandES = "más rápido";
var readSlowerCommand = "slower";
var readSlowerCommandES = "más despacio";

var welcomeCommandES = "bienvenida";
var stopListeningCommandES = "parar de escuchar";
var changeCommandES = "cambiar";
var cancelCommandES = "cancelar";
var activateCommandES = "activar";
var deactivateCommandES = "desactivar";
var loadAnnotationsCommandES = "cargar anotaciones";
var loadAnnotationCommandES = "cargar anotación";
var rateCommandES = "valorar";
var changeCommandQuestionES = "que comando";
var newCommandQuestionES = "cuál es el nuevo comando?";

var readAllSections;
var lastSectionRead = "";

var changeCommandInProcess1 = false;
var changeCommandInProcess2 = false;
var newCommandString = "";
var activateClickDetector = false;
var activateTextDetector = false;

var paragraphItemsXPath = [];
var paragraphItemsXPathAux = [];

var paragraphAnnotationItems = new Array();

var annotationActive = false;
var annotationId = "";
var annotatedItemsAux = [];
var annotationElements = [];

var operationToChange;

/*********************** Page is loaded ************************/
$(document).ready(function() {
    createCSSSelector('.hideSectionsLinks', 'pointer-events: none');
    createCSSSelector('.hideUselessSections', 'display: none !important;');
    createCSSSelector('.hoverColor:hover', 'background-color: grey !important;');
    createCSSSelector('.selectedColor', 'background-color: grey !important;;');
    createCSSSelector('.modal', 'display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);');
    createCSSSelector('.modal-content', 'background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 70% !important;');
    createCSSSelector('.close', 'color: #aaaaaa; position: absolute; right: 5%; font-size: 28px; font-weight: bold;');
    createCSSSelector('.close:hover', 'color: #000; text-decoration: none; cursor: pointer;');
    createCSSSelector('.close:focus', 'color: #000; text-decoration: none; cursor: pointer;');
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
    document.head.appendChild(link);
    $('*[class=""]').removeAttr('class');

    /*var meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy-Report-Only');
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https:; manifest-src 'self'";
    document.head.appendChild(meta);*/
    //<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

    // Browsers require user interaction for speech synthesis
    var hiddenButton = document.createElement("button");
    hiddenButton.onclick = function(){console.log("User interaction");}
    document.body.appendChild(hiddenButton);
    //hiddenButton.focus();
    hiddenButton.click();
    hiddenButton.style.display = "none";
    //swal("Click OK to speak").then(() => hiddenButton.click());
    /*var firstTimeReadWelcome = function(){
        console.log("Read welcome onmouseover");
        document.body.removeEventListener("mouseover", firstTimeReadWelcome);
        readWelcome();
    }
    document.body.addEventListener("mouseover", firstTimeReadWelcome);*/

    clickDetector();

    // Local storage independent for each visitated website
    localStoragePrefix = encodeURI(document.URL) + "_";

    // Detect if domain is spanish or english
    if(document.domain.endsWith(".es") || document.domain.startsWith("es.")){
        spanishDomain = true;
    }

    setTimeout(function(){
        mainBody();
    }, 2000);


});

function mainBody(){
     /*********************** Add new annotations here ************************/

    var textAnnotation, paragraphAnnotation, uselessAnnotation;

    if(myStorage.getItem(localStoragePrefix + "paragraphAnnotation") == null){
        var elementAux = document.getElementsByTagName("dl")[0].nextElementSibling;
        var menuJsonObject = { name: "introduction", value: [] };

        var ok = true;
        while(ok){
            if(elementAux != null){
                //console.log(elementAux.tagName);
                if(elementAux.tagName == "H2") {
                    ok = false;
                } else {
                    // Aquí hacer un array y guardar la anotación al terminar el bucle while
                    menuJsonObject.value.push(getXPathForElement(elementAux));
                }
                elementAux = elementAux.nextElementSibling;
            } else {
                ok = false;
            }
        }
        //var stringObjectParagraph = JSON.stringify(menuJsonObject);
        paragraphAnnotationItems.push(menuJsonObject);
        paragraphItemsXPath.push(menuJsonObject);

        var menu = $("#toc").children()[1].children;
        for(var menuIndex = 0; menuIndex < menu.length; menuIndex++){
            var menuElement, elementName;

            try{
                menuElement = $("#toc").children()[1].children[menuIndex].firstChild;
                elementName = menuElement.innerHTML;
    
                elementAux = document.getElementById(elementName.replaceAll(' ', '_')).parentElement.nextElementSibling;
                menuJsonObject = { name: elementName.toLowerCase(), value: [] };
            } catch(err){
                
                menuElement = $("#toc").children()[2].children[menuIndex].firstChild;
                elementName = menuElement.innerHTML;
    
                elementAux = document.getElementById(elementName.replaceAll(' ', '_')).parentElement.nextElementSibling;
                menuJsonObject = { name: elementName.toLowerCase(), value: [] };
            }

            ok = true;
            while(ok){
                if(elementAux != null){
                    //console.log(elementAux.tagName);
                    if(elementAux.tagName == "H2") {
                        ok = false;
                    } else {
                        // Aquí hacer un array y guardar la anotación al terminar el bucle while
                        menuJsonObject.value.push(getXPathForElement(elementAux));
                    }
                    elementAux = elementAux.nextElementSibling;
                } else {
                    ok = false;
                }
            }
            //var stringObjectParagraph = JSON.stringify(menuJsonObject);
            paragraphAnnotationItems.push(menuJsonObject);
            paragraphItemsXPath.push(menuJsonObject);
        }
        myStorage.setItem(localStoragePrefix + "paragraphAnnotation", JSON.stringify(paragraphAnnotationItems));
    }

    if(!spanishDomain){
        textAnnotation = new TextAnnotation("textAnnotation", "Text Annotation", ["text"], []);
        paragraphAnnotation = new ParagraphAnnotation("paragraphAnnotation", "Paragraph Annotation", ["P"], []);
        uselessAnnotation = new UselessAnnotation("uselessAnnotation", "Useless sections Annotation", ["all"], []);
    } else {
        textAnnotation = new TextAnnotation("textAnnotation", "Anotación de texto", ["text"], []);
        paragraphAnnotation = new ParagraphAnnotation("paragraphAnnotation", "Anotación de párrafos", ["P"], []);
        uselessAnnotation = new UselessAnnotation("uselessAnnotation", "Anotación de secciones inservibles", ["all"], []);
    }

    /*********************** Add new operations here ************************/
    var increaseFontSizeOperation, decreaseFontSizeOperation, readAloudOperation, goToOperation, goBackOperation, goForwardOperation, videosOperation, breadCrumbOperation, hideOperation;
    if(!spanishDomain){
        increaseFontSizeOperation = new IncreaseFontSizeOperation("increaseFontSizeOperation", "Increase Font Size", "increase font size", true, true, true, false, []);
        decreaseFontSizeOperation = new DecreaseFontSizeOperation("decreaseFontSizeOperation", "Decrease Font Size", "decrease font size", true, true, true, false, []);
        readAloudOperation = new ReadAloudOperation("readAloud", "Read Aloud", "read aloud", true, true, true, true, ["textAnnotation", "paragraphAnnotation"]);
        goToOperation = new GoToOperation("goTo", "Go To", "go to", true, true, true, true, ["textAnnotation", "paragraphAnnotation"]);
        goBackOperation = new GoBackOperation("goBack", "Go Back", "go back", true, true, true, false, []);
        goForwardOperation = new GoForwardOperation("goForward", "Go Forward", "go forward", true, true, true, false, []);
        videosOperation = new VideosOperation("videos", "Videos", "videos", true, true, true, false, []);
        breadCrumbOperation = new BreadcrumbOperation("breadcrumb", "Breadcrumb", "", true, true, true, false, []);
        hideOperation = new HideOperation("hide", "Hide useless sections", "", true, true, true, false, ["uselessAnnotation"]);
    } else {
        increaseFontSizeOperation = new IncreaseFontSizeOperation("increaseFontSizeOperation", "Aumentar Tamaño Letra", "aumentar tamaño letra", true, true, true, false, []);
        decreaseFontSizeOperation = new DecreaseFontSizeOperation("decreaseFontSizeOperation", "Reducir Tamaño Letra", "reducir tamaño letra", true, true, true, false, []);
        readAloudOperation = new ReadAloudOperation("readAloud", "Leer en voz alta", "leer", true, true, true, true, ["textAnnotation", "paragraphAnnotation"]);
        goToOperation = new GoToOperation("goTo", "Ir a", "ir a", true, true, true, true, ["textAnnotation", "paragraphAnnotation"]);
        goBackOperation = new GoBackOperation("goBack", "Volver", "volver", true, true, true, false, []);
        goForwardOperation = new GoForwardOperation("goForward", "Avanzar página", "avanzar página", true, true, true, false, []);
        videosOperation = new VideosOperation("videos", "Videos", "videos", true, true, true, false, []);
        breadCrumbOperation = new BreadcrumbOperation("breadcrumb", "Panel navegación", "", true, true, true, false, []);
        hideOperation = new HideOperation("hide", "Esconder secciones inservibles", "", true, true, true, false, ["uselessAnnotation"]);
    }

    checkFocus();
    initWAFRA();
    textToAudio();
    audioToText();

    var wafra = new WAFRA();
    wafra.getAndSetStorage();
    wafra.createWebAugmentedMenu();
    wafra.createAnnotationsMenu();
    wafra.createOperationsMenu();
    wafra.createCommandsMenu();
    wafra.basicAnnotation();
    document.onkeydown = KeyPress;

    setTimeout(function(){
        toggleHiddenSections();
    }, 1000);

}


/**
 * Class WAFRA.
 *
 * @class WAFRA
 */
class WAFRA {

    constructor() {

    }

    getAndSetStorage() {

        if(myStorage.getItem(localStoragePrefix + "readerRate") !== null){
            try {
                readerRate = myStorage.getItem(localStoragePrefix + "readerRate");
            } catch (e) {
            }
        } else {
            myStorage.setItem(localStoragePrefix + "readerRate", readerRate);
        }

        for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
            // Annotated items
            if(myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id) !== null){
                annotations[annotationsIndex].items = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
            } else {
                if(annotations[annotationsIndex].items.length > 0){
                    myStorage.setItem(localStoragePrefix + annotations[annotationsIndex].id, annotations[annotationsIndex].items);
                } else {
                    myStorage.setItem(localStoragePrefix + annotations[annotationsIndex].id, "[]");
                }
            }
        }
        for(var operationsIndex = 0; operationsIndex < operations.length; operationsIndex++){
            // Voice commands names
            if(myStorage.getItem(localStoragePrefix + operations[operationsIndex].id) !== null){
                operations[operationsIndex].voiceCommand = myStorage.getItem(localStoragePrefix + operations[operationsIndex].id);
            } else {
                myStorage.setItem(localStoragePrefix + operations[operationsIndex].id, operations[operationsIndex].voiceCommand);
            }

            // Operations & commands active?
            if(myStorage.getItem(localStoragePrefix + operations[operationsIndex].id + "Active") !== null){
                operations[operationsIndex].active = (myStorage.getItem(localStoragePrefix + operations[operationsIndex].id + "Active") == 'true');
            } else {
                myStorage.setItem(localStoragePrefix + operations[operationsIndex].id + "Active", operations[operationsIndex].active);
            }
        }


        //TODO: refactor
        if(myStorage.getItem(localStoragePrefix + "paragraphItemsXPath") !== null){
            try {
                paragraphItemsXPath = JSON.parse(myStorage.getItem(localStoragePrefix + "paragraphItemsXPath"))
            } catch (e) {
            }
        } else {
            myStorage.setItem(localStoragePrefix + "paragraphItemsXPath", JSON.stringify(paragraphItemsXPath));
        }
    }


    createWebAugmentedMenu(){
        createMenus();
    }

    createAnnotationsMenu(){
        createAnnotationsMenu();
    }

    createOperationsMenu(){
        createOperationsMenu();
    }

    createCommandsMenu(){
        createCommandsMenu();
    }

    basicAnnotation(){
        basicAnnotation();
    }

}

/**
 * Abstract Class Annotation.
 *
 * @class Annotation
 */
class Annotation {

    /*id;
    name;
    domElement;*/

    constructor() {
        if (this.constructor == Annotation) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    initAnnotationProcess() {
        throw new Error("Method 'initAnnotationProcess()' must be implemented.");
    }

    start() {
        throw new Error("Method 'start()' must be implemented.");
    }

    save() {
        throw new Error("Method 'save()' must be implemented.");
    }

    stop() {
        throw new Error("Method 'stop()' must be implemented.");
    }

    reset() {
        throw new Error("Method 'reset()' must be implemented.");
    }

    edit() {
        throw new Error("Method 'edit()' must be implemented.");
    }

    undo() {
        throw new Error("Method 'undo()' must be implemented.");
    }

    openMenu(){
        throw new Error("Method 'openMenu()' must be implemented.");
    }

    initAnnotation(id, name, domElements, items) {
        this.id = id;
        this.name = name;
        this.domElements = domElements;
        this.items = items
        annotations.push(this);
    }
}

class TextAnnotation extends Annotation {

    constructor(id, name, domElements, items){
        super();
        this.initAnnotation(id, name, domElements, items);
        /*this.id = id;
        this.name = name;
        this.domElement = domElement;*/
    }

    initAnnotationProcess() {
    }

    start() {
        console.log("annotationActive: " + annotationActive);
        if(!annotationActive){
            annotationActive = true;
            annotationId = this.id;
            startAnnotations(this);
        }
    }

    save() {
        saveAnnotations(this);
    }

    stop() {
        stopAnnotations(this);
    }

    reset(name) {
        resetAnnotationsById(this.id, name);
    }

    edit(name) {
        editAnnotationsByName(this.id, name);
    }

    undo() {
        undoAnnotations(this);
    }

    openMenu() {
        closeAnnotationsMenu();
        showSubmenu("menu-" + this.id);
    }
}

class ParagraphAnnotation extends Annotation {

    constructor(id, name, domElements, items){
        super();
        this.initAnnotation(id, name, domElements, items);
    }

    initAnnotationProcess() {
    }

    start() {
        console.log("annotationActive: " + annotationActive);
        if(!annotationActive){
            annotationActive = true;
            annotationId = this.id;
            startAnnotations(this);
        }
    }

    save() {
        saveAnnotations(this);
    }

    stop() {
        stopAnnotations(this);
    }

    reset(name) {
        resetAnnotationsById(this.id, name);
    }

    edit(name) {
        editAnnotationsByName(this.id, name);
    }

    undo() {
        undoAnnotations(this);
    }

    openMenu() {
        closeAnnotationsMenu();
        showSubmenu("menu-" + this.id);
    }
}


class UselessAnnotation extends Annotation {

    constructor(id, name, domElements, items){
        super();
        this.initAnnotation(id, name, domElements, items);
    }

    initAnnotationProcess() {
    }

    start() {
        console.log("annotationActive: " + annotationActive);
        if(!annotationActive){
            annotationActive = true;
            annotationId = this.id;
            startAnnotations(this);
        }
    }

    save() {
        saveAnnotations(this);
    }

    stop() {
        stopAnnotations(this);
    }

    reset(name) {
        resetAnnotationsById(this.id, name);
    }

    edit(name) {
        editAnnotationsByName(this.id, name);
    }

    undo() {
        undoAnnotations(this);
    }

    openMenu() {
        closeAnnotationsMenu();
        showSubmenu("menu-" + this.id);
    }
}


/*********************** Add new annotations classes here ************************/


/**
 * Abstract Class Operation.
 *
 * @class Operation
 */
class Operation {

    /*id;
    name;
    voiceCommand;
    activable;
    editable;*/

    constructor() {
        if (this.constructor == Operation) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    configureOperation() {
        throw new Error("Method 'initOperation()' must be implemented.");
    }

    initOperation() {
        throw new Error("Method 'initOperation()' must be implemented.");
    }

    startOperation() {
        throw new Error("Method 'startOperation()' must be implemented.");
    }

    stopOperation() {
        throw new Error("Method 'stopOperation()' must be implemented.");
    }


    initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations) {
        this.id = id;
        this.name = name;
        this.voiceCommand = voiceCommand;
        //this.section = section;
        this.activable = activable;
        this.active = active;
        this.editable = editable;
        this.hasMenu = hasMenu;
        this.annotations = annotations;
        operations.push(this);
    }
}


class IncreaseFontSizeOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation(){

    }

    startOperation() {
        var scroll = window.scrollY;
        var totalScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                                   document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

        var bodyContent = document.getElementsByTagName('div');

        for(var i = 0; i < bodyContent.length; i++) {
            var styleI = window.getComputedStyle(bodyContent[i], null).getPropertyValue('font-size');
            var fontSizeI = parseFloat(styleI);
            bodyContent[i].style.fontSize = (fontSizeI + 2) + 'px';
        }

        var currentTotalScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                                          document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var currentScroll = (scroll * currentTotalScroll) / totalScroll;
        window.scrollTo(0, currentScroll);
    }

    stopOperation() {
        console.log("Stop operation");
    }
}


class DecreaseFontSizeOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation(){

    }

    startOperation() {
        var scroll = window.scrollY;
        var totalScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                                   document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

        var bodyContent = document.getElementsByTagName('div');

        for(var j = 0; j < bodyContent.length; j++) {
            var styleJ = window.getComputedStyle(bodyContent[j], null).getPropertyValue('font-size');
            var fontSizeJ = parseFloat(styleJ);
            bodyContent[j].style.fontSize = (fontSizeJ - 2) + 'px';
        }

        var currentTotalScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                                          document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var currentScroll = (scroll * currentTotalScroll) / totalScroll;
        window.scrollTo(0, currentScroll);
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadAloudOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {
        //TODO: annotations parameters as objects
        createSubmenuForOperationAndAnnotations("menu-" + this.id, this);
    }

    openMenu() {
        closeOperationsMenu();
        showSubmenu("menu-" + this.id);
    }

    startOperation(params) {
        var sectionNameParam = params.currentTarget.sectionName;
        var operationParam = params.currentTarget.operation;
        readAloudFromSectionName("menu-" + operationParam.id, operationParam, sectionNameParam);
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

function readAloudFromSectionName(menuId, operation, sectionName){

    var annotationsForOperation = operation.annotations;
    closeSubmenu(menuId);
    var sectionNameToRead = sectionName;
    if(typeof sectionName.parentElement === 'undefined' && typeof sectionName.currentTarget !== 'undefined'){
        sectionNameToRead = sectionName.currentTarget.sectionName
    }
    console.log("readFromSectionName: " + sectionNameToRead);
    //closeGoToMenu();
    closeMenu();
    closeOperationsMenu();

    var readContent = ""

    var sectionsNames;
    for(var i = 0; i < annotationsForOperation.length; i++){
        var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationsForOperation[i]));
        for(var j = 0; j < items.length; j++){
            if(sectionNameToRead === items[j].name){
                if(annotationsForOperation[i] === "textAnnotation"){
                    lastSectionRead = sectionNameToRead;
                    if(!spanishDomain){
                        readContent += "Section " + sectionNameToRead + ". " ;
                    } else {
                        readContent += "Sección " + sectionNameToRead + ". " ;
                    }
                    if(readFirstTime){
                        readFirstTime = false;
                        if(!spanishDomain){
                            readContent += "You can use control + space to stop the reading aloud operation. ";
                        } else {
                            readContent += "Puedes utilizar control + espacio para detener la lectura en voz alta. ";
                        }
                    }
                    for(var b = 0; b < items[j].value.length; b++){
                        readContent += items[j].value[b] + " ";
                        console.log("content: " + readContent);
                    }
                } else {
                    if(!spanishDomain){
                        readContent += "Section " + sectionNameToRead + ". " ;
                    } else {
                        readContent += "Sección " + sectionNameToRead + ". " ;
                    }
                    if(readFirstTime){
                        readFirstTime = false;
                        if(!spanishDomain){
                            readContent += "You can use control + space to stop the reading aloud operation. ";
                        } else {
                            readContent += "Puedes utilizar control + espacio para detener la lectura en voz alta. ";
                        }
                    }
                    for(var z = 0; z < items[j].value.length; z++){
                        var element = getElementByXPath(items[j].value[z]);
                        var domParser = new DOMParser().parseFromString(element.outerHTML, 'text/html');
                        readContent += domParser.body.innerText;
                        console.log("domParser: " + JSON.stringify(domParser));
                        console.log("content: " + readContent);
                    }
                }
            }
        }
    }
    Read(readContent);
}

class GoToOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {
        //TODO: annotations parameters as objects
        createSubmenuForOperationAndAnnotations("menu-" + this.id, this);
    }

    openMenu() {
        closeOperationsMenu();
        showSubmenu("menu-" + this.id);
    }

    startOperation(params) {
        var sectionNameParam = params.currentTarget.sectionName;
        var operationParam = params.currentTarget.operation;
        goToFromSectionName("menu-" + operationParam.id, operationParam, sectionNameParam);
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

// Go to
function goToFromSectionName(menuId, operation, sectionName){
    var annotationsForOperation = operation.annotations;
    closeSubmenu(menuId);
    var sectionNameToGo = sectionName;
    if(typeof sectionName.parentElement === 'undefined' && typeof sectionName.currentTarget !== 'undefined'){
        sectionNameToGo = sectionName.currentTarget.sectionName
    }
    console.log("goToFromSectionName: " + sectionNameToGo);
    //closeGoToMenu();
    closeMenu();
    closeOperationsMenu();

    var sectionsNames;
    for(var i = 0; i < annotationsForOperation.length; i++){
        var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationsForOperation[i]));
        for(var j = 0; j < items.length; j++){
            if(sectionNameToGo === items[j].name){
                if(annotationsForOperation[i] === "textAnnotation"){
                    if(items[j].value.length > 0){
                        var foundItem = $("*:contains('" + items[j].value[0] + "'):first").offset();
                        if(typeof foundItem != 'undefined'){
                            $(window).scrollTop(foundItem.top);
                        }
                    }
                } else {
                    var element = getElementByXPath(items[j].value[0]);
                    element.scrollIntoView();
                }
            }
        }
    }

}

// Go back
class GoBackOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {
    }

    startOperation() {
        goBack();
    }

    stopOperation() {
    }
}

// Go forward
class GoForwardOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {
    }

    startOperation() {
        goBack();
    }

    stopOperation() {
    }
}

// Videos
class VideosOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {
    }

    startOperation() {
        goToVideos();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

// BreadCrumb
class BreadcrumbOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu);
    }

    configureOperation() {
        breadcrumb();
    }

    startOperation() {

    }

    stopOperation() {
        console.log("Stop operation");
    }
}

// Hide sections
class HideOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {

    }

    startOperation() {

    }

    stopOperation() {
        console.log("Stop operation");
    }
}

// Show sections
class ShowOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, annotations){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, annotations);
    }

    configureOperation() {

    }

    startOperation() {

    }

    stopOperation() {
        console.log("Stop operation");
    }
}


/*********************** Add new operations classes here ************************/


// *************************** Helpers ***************************

var hidden, visibilityChange, state;
function checkFocus(){
    // Set the name of the hidden property and the change event for visibility
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

}

function initWAFRA() {
    var link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    document.head.appendChild(link1);
    var link2 = document.createElement('link');
    link1.rel = 'stylesheet';
    link2.href= 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css';
    document.head.appendChild(link2);

    var divMenu = document.createElement("div");
    divMenu.id = "menu-webaugmentation";
    divMenu.style = "position: fixed; left: 2%; top: 2%; z-index: 100; line-height: 140%;";
    var menuLinkDiv = document.createElement("div");
    menuLinkDiv.id = "div-webaugmentation";
    var menuLink = document.createElement("a");
    menuLink.id = "a-webaugmentation";
    menuLink.href = "javascript:void(0);";
    menuLink.className = "icon";
    menuLink.addEventListener("click", toggleMenu);
    var menuIcon = document.createElement("i");
    menuIcon.className = "fa fa-bars fa-2x fa-border";
    menuIcon.style="background-color: white;";
    menuLink.appendChild(menuIcon);
    menuLinkDiv.appendChild(menuLink);
    divMenu.appendChild(menuLinkDiv);
    document.body.appendChild(divMenu);

}


function createMenus(){

    var divButtons = document.createElement('div');
    divButtons.id = "foldingMenu";
    divButtons.style = "padding: 10px; border: 2px solid black; display: none; background-color: white";

    var toggleListeningIcon = document.createElement("i");
    toggleListeningIcon.id = "toggleListeningIcon";
    toggleListeningIcon.className = "fa fa-circle";

    var aToggleListening = document.createElement('a');
    aToggleListening.id = "toggleListeningA";
    aToggleListening.addEventListener("click", function(){
        closeMenu();
        if(recognitionActive){
            console.log("recognition deactivated")
            recognitionActive = false;
            if(!spanishDomain){
                aToggleListening.text = 'Start Listening';
            } else {
                aToggleListening.text = 'Activar comandos por voz';
            }
            toggleListeningIcon.style = "color:red; margin-left: 8px";
            recognition.abort();
        } else{
            console.log("recognition activated")
            recognitionActive = true;
            recognition.start();
            if(!spanishDomain){
                aToggleListening.text = 'Stop Listening';
            } else {
                aToggleListening.text = 'Desactivar comandos por voz';
            }
            //inputVoiceCommands.checked = recognitionActive;
            toggleListeningIcon.style = "color:gray; margin-left: 8px";
        }
        //document.getElementById("voiceCommandsInput").checked = recognitionActive;
        myStorage.setItem("recognitionActive", recognitionActive);
    }, false);
    if(recognitionActive){
        if(!spanishDomain){
            aToggleListening.text = 'Stop Listening';
        } else {
            aToggleListening.text = 'Desactivar comandos por voz';
        }
        toggleListeningIcon.style = "color:gray; margin-left: 8px";
    }
    else{
        if(!spanishDomain){
            aToggleListening.text = 'Start Listening';
        } else {
            aToggleListening.text = 'Activar comandos por voz';
        }
        toggleListeningIcon.style = "color:red; margin-left: 8px";
    }
    divButtons.appendChild(aToggleListening);
    divButtons.appendChild(toggleListeningIcon);
    divButtons.appendChild(document.createElement('br'));

    var a5 = document.createElement('a');
    a5.id = "voiceCommandsA";
    //a5.href = '';
    a5.addEventListener("click", function(){
        toggleMenu();
        toggleCommandsMenu();
        closeAnnotationsMenu();
        closeOperationsMenu();
    }, false);
    if(!spanishDomain){
        a5.text = 'Voice commands';
    } else {
        a5.text = 'Comandos por voz';
    }
    divButtons.appendChild(a5);
    /*var inputVoiceCommands = document.createElement('input');
    inputVoiceCommands.type = 'checkbox';
    inputVoiceCommands.id = 'voiceCommandsInput';
    inputVoiceCommands.value = 'voiceCommandsInput';
    inputVoiceCommands.checked = recognitionActive;
    inputVoiceCommands.addEventListener("change", function(){
        if(!this.checked){
            console.log("recognition deactivated")
            recognitionActive = false;
            recognition.abort();
            aToggleListening.text = 'Start Listening';
            toggleListeningIcon.style = "color:red; margin-left: 8px";
        } else {
            console.log("recognition activated")
            recognitionActive = true;
            recognition.start();
            aToggleListening.text = 'Stop Listening';
            toggleListeningIcon.style = "color:gray; margin-left: 8px";
        }
        myStorage.setItem("recognitionActive", recognitionActive);
    }, false);
    divButtons.appendChild(inputVoiceCommands);*/
    divButtons.appendChild(document.createElement('br'));

    var aOperations = document.createElement('a');
    aOperations.id = "operationsA";
    aOperations.addEventListener("click", toggleOperationsMenu, false);
    if(!spanishDomain){
        aOperations.text = 'Accessibility Operations';
    } else {
        aOperations.text = 'Operaciones de Accesibilidad';
    }
    divButtons.appendChild(aOperations);

    var i = document.createElement('i');
    i.className = 'fa fa-close'
    i.style = "position: absolute; right: 10%; top: 20%; z-index: 100;"
    i.addEventListener("click", closeMenu, false);
    divButtons.appendChild(i);


    document.getElementById("div-webaugmentation").appendChild(divButtons);

}

function createAnnotationsMenu(){

    var divMenuAnnotations = document.createElement("div");
    divMenuAnnotations.id = "menu-intermediary";
    divMenuAnnotations.style = "position: fixed; right: 2%; top: 2%; z-index: 101 !important; line-height: 140%;"
    var menuAnnotationsLinkDiv = document.createElement("div");
    menuAnnotationsLinkDiv.id = "div-intermediary";
    menuAnnotationsLinkDiv.style = "text-align: right;";
    var menuAnnotationsLink = document.createElement("a");
    menuAnnotationsLink.id = "a-intermediary";
    menuAnnotationsLink.href = "javascript:void(0);";
    menuAnnotationsLink.className = "icon";
    menuAnnotationsLink.addEventListener("click", toggleAnnotationsMenu)
    var menuAnnotationsIcon = document.createElement("i");
    menuAnnotationsIcon.className = "fa fa-pencil-square-o fa-2x fa-border";
    menuAnnotationsIcon.style="background-color: white;";
    menuAnnotationsLink.appendChild(menuAnnotationsIcon);

    var aSave = document.createElement('a');
    aSave.id = "saveAnnotationsA";
    aSave.href = "javascript:void(0);";
    aSave.className = "icon";
    if(!spanishDomain){
        aSave.title = "Save";
    } else {
        aSave.title = "Guardar";
    }
    aSave.style = "display: none";
    aSave.addEventListener("click", saveAnnotationsSections, false);
    var saveIcon = document.createElement("i");
    saveIcon.className = "fa fa-floppy-o fa-2x fa-border";
    saveIcon.style="background-color: white;";
    aSave.appendChild(saveIcon);
    menuAnnotationsLinkDiv.appendChild(aSave);

    var aStop = document.createElement('a');
    aStop.id = "stopAnnotationsA";
    aStop.href = "javascript:void(0);";
    aStop.className = "icon";
    if(!spanishDomain){
        aStop.title = "Stop";
    } else {
        aStop.title = "Detener";
    }
    aStop.style = "display: none";
    aStop.addEventListener("click", stopAnnotationsSections, false);
    var stopIcon = document.createElement("i");
    stopIcon.className = "fa fa-stop fa-2x fa-border";
    stopIcon.style="background-color: white;";
    aStop.appendChild(stopIcon);
    menuAnnotationsLinkDiv.appendChild(aStop);

    var aUndo = document.createElement('a');
    aUndo.id = "undoAnnotationsA";
    aUndo.href = "javascript:void(0);";
    aUndo.className = "icon";
    if(!spanishDomain){
        aUndo.title = "Undo";
    } else {
        aUndo.title = "Deshacer";
    }
    aUndo.style = "display: none";
    aUndo.addEventListener("click", undoAnnotationsSections, false);
    var undoIcon = document.createElement("i");
    undoIcon.className = "fa fa-undo fa-2x fa-border";
    undoIcon.style="background-color: white;";
    aUndo.appendChild(undoIcon);
    menuAnnotationsLinkDiv.appendChild(aUndo);

    menuAnnotationsLinkDiv.appendChild(menuAnnotationsLink);
    divMenuAnnotations.appendChild(menuAnnotationsLinkDiv);

    var divAnnotationsMenu = document.createElement("div")
    divAnnotationsMenu.id = "menu-annotations";
    divAnnotationsMenu.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white"

    var i = document.createElement('i');
    i.className = 'fa fa-close'
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;"
    i.addEventListener("click", function(){
        closeAnnotationsMenu();
    }, false);
    divAnnotationsMenu.appendChild(i);

    for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
        var a2 = document.createElement('a');
        a2.id = annotations[annotationsIndex].id;
        //a2.href = '';
        a2.addEventListener("click", function(){
            for(var i = 0; i < annotations.length; i++){
                if(annotations[i].id === this.id){
                    annotations[i].start();
                }
            }
        }, false);
        a2.text = annotations[annotationsIndex].name;
        divAnnotationsMenu.appendChild(a2);

        var a2b = document.createElement('a');
        a2b.id = "edit" + annotations[annotationsIndex].id;
        a2b.className = "icon";
        if(!spanishDomain){
            a2b.title = "Edit" + annotations[annotationsIndex].name;
        } else {
            a2b.title = "Editar" + annotations[annotationsIndex].name;
        }
        a2b.addEventListener("click", function(){
            for(var i = 0; i < annotations.length; i++){
                if(annotations[i].id === this.id.split("edit").join("")){
                    annotations[i].openMenu();
                }
            }
        }, false);
        var a2bIcon = document.createElement("i");
        a2bIcon.className = "fa fa-edit";
        a2bIcon.style = "margin-left: 8px";
        a2b.appendChild(a2bIcon);
        divAnnotationsMenu.appendChild(a2b);

        var a2bTrash = document.createElement('a');
        a2bTrash.id = "reset" + annotations[annotationsIndex].id;
        a2bTrash.className = "icon";
        if(!spanishDomain){
            a2bTrash.title = "Reset" + annotations[annotationsIndex].name;
        } else {
            a2bTrash.title = "Resetear" + annotations[annotationsIndex].name;
        }
        a2bTrash.addEventListener("click", function(){
                for(var i = 0; i < annotations.length; i++){
                    if(annotations[i].id === this.id.split("reset").join("")){
                        if(!spanishDomain){
                            if(confirm("Are you sure to delete all the " + annotations[i].name + " annotations?")){
                                annotations[i].reset();
                            }
                        } else {
                            if(confirm("¿Estás seguro de borrar todas las anotaciones " + annotations[i].name + "?")){
                                annotations[i].reset();
                            }
                        }
                    }
                }
        }, false);
        var a2bTrashIcon = document.createElement("i");
        a2bTrashIcon.className = "fa fa-trash-o";
        a2bTrashIcon.style = "margin-left: 8px";
        a2bTrash.appendChild(a2bTrashIcon);
        divAnnotationsMenu.appendChild(a2bTrash);

        divAnnotationsMenu.appendChild(document.createElement('br'));
    }

    var a7 = document.createElement('a');
    a7.id = "loadAnnotationsA";
    if(!spanishDomain){
        a7.text = "Load annotations";
    } else {
        a7.text = "Cargar anotaciones";
    }
    a7.addEventListener("click", loadAnnotationsFromServer, false);
    divAnnotationsMenu.appendChild(a7);
    divAnnotationsMenu.appendChild(document.createElement('br'));

    var a8 = document.createElement('a');
    a8.id = "saveAnnotationsA";
    a8.text = "Save annotations";
    if(!spanishDomain){
        a8.text = "Save annotations";
    } else {
        a8.text = "Guardar anotaciones";
    }
    a8.addEventListener("click", askAnnotationsInfoForServer, false);
    divAnnotationsMenu.appendChild(a8);
    divAnnotationsMenu.appendChild(document.createElement('br'));


    var divLoadAnnotations = document.createElement('div')
    divLoadAnnotations.id = "menu-loadAnnotations"
    divLoadAnnotations.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white"

    var iLoad = document.createElement('i');
    iLoad.className = 'fa fa-close'
    iLoad.style = "position: absolute; right: 1%; top: 91%; z-index: 100;"
    iLoad.addEventListener("click", function(){
        closeLoadMenu();
    }, false);
    divLoadAnnotations.appendChild(iLoad);

    divMenuAnnotations.appendChild(divAnnotationsMenu);
    divMenuAnnotations.appendChild(divLoadAnnotations);

    document.body.appendChild(divMenuAnnotations);

    for(var annotationsI = 0; annotationsI < annotations.length; annotationsI++){
        createSubmenuForAnnotations("menu-" + annotations[annotationsI].id, annotations[annotationsI].id);
    }


    var saveModal = document.createElement("div");
    saveModal.id = "saveModal";
    saveModal.classList.add("modal");
    var saveModalContent = document.createElement("div");
    saveModalContent.classList.add("modal-content");
    var spanClose = document.createElement("span");
    spanClose.classList.add("close");
    spanClose.innerHTML = "&times;";
    spanClose.onclick = function(){
        saveModal.style.display = "none";
    };
    saveModalContent.appendChild(spanClose);

    var h2 = document.createElement("h2");
    if(!spanishDomain){
        h2.innerHTML = "Save annotations in server";
    } else {
        h2.innerHTML = "Guardar anotaciones en el servidor";
    }
    saveModalContent.appendChild(h2);

    var form = document.createElement("form");

    // title should be unique and easy to say (recongnisable)
    var labelTitleModal = document.createElement("label");
    if(!spanishDomain){
        labelTitleModal.innerHTML = "Title of annotations: ";
    } else {
        labelTitleModal.innerHTML = "Nombre de las anotaciones: ";
    }
    labelTitleModal.for = "inputTitleModal";
    form.appendChild(labelTitleModal);

    var inputTitleModal = document.createElement("input");
    inputTitleModal.id = "inputTitleModal";
    inputTitleModal.type = "text";
    inputTitleModal.classList.add("form-control");
    inputTitleModal.required = true;
    if(!spanishDomain){
        inputTitleModal.placeholder = "A unique title that can be recognised by voice";
    } else {
        inputTitleModal.placeholder = "Un nombre único que pueda ser reconocido por voz";
    }
    form.appendChild(inputTitleModal);

    var br = document.createElement("br");
    form.appendChild(br);

    var labelDescriptionModal = document.createElement("label");
    if(!spanishDomain){
        labelDescriptionModal.innerHTML = "Description of annotations: ";
    } else {
        labelDescriptionModal.innerHTML = "Descripción de las annotaciones: ";
    }
    labelDescriptionModal.for = "inputDescriptionModal";
    form.appendChild(labelDescriptionModal);

    var inputDescriptionModal = document.createElement("input");
    inputDescriptionModal.id = "inputDescriptionModal";
    inputDescriptionModal.type = "text";
    inputDescriptionModal.classList.add("form-control");
    if(!spanishDomain){
        inputDescriptionModal.placeholder = "A description about the annotations done";
    } else {
        inputDescriptionModal.placeholder = "Una descripción de las anotaciones realizadas";
    }
    form.appendChild(inputDescriptionModal);

    br = document.createElement("br");
    form.appendChild(br);

    var labelTargetUsersModal = document.createElement("label");
    if(!spanishDomain){
        labelTargetUsersModal.innerHTML = "Target users: ";
    } else {
        labelTargetUsersModal.innerHTML = "Usuarios destinatarios: ";
    }
    labelTargetUsersModal.for = "selectTargetUsersModal";
    form.appendChild(labelTargetUsersModal);

    var selectTargetUsersModal = document.createElement("select");
    selectTargetUsersModal.id = "selectTargetUsersModal";
    //selectTargetUsersModal.type = "text";
    selectTargetUsersModal.classList.add("form-control");
    //selectTargetUsersModal.placeholder = "A description about the annotations done";

    var option1 = document.createElement("option");
    var option2 = document.createElement("option");
    var option3 = document.createElement("option");
    if(!spanishDomain){
        option1.text = "All users";
        option2.text = "Users with some visual impairment";
        option3.text = "Blind people";
    } else {
        option1.text = "Todos los usuarios";
        option2.text = "Usuarios con problemas de visión";
        option3.text = "Personas ciegas";
    }
    selectTargetUsersModal.add(option1);
    selectTargetUsersModal.add(option2);
    selectTargetUsersModal.add(option3);

    form.appendChild(selectTargetUsersModal);

    br = document.createElement("br");
    form.appendChild(br);

    var labelCategoryModal = document.createElement("label");
    if(!spanishDomain){
        labelCategoryModal.innerHTML = "Category: ";
    } else {
        labelCategoryModal.innerHTML = "Categoría: ";
    }
    labelCategoryModal.for = "selectCategoryModal";
    form.appendChild(labelCategoryModal);

    var selectCategoryModal = document.createElement("select");
    selectCategoryModal.id = "selectCategoryModal";
    //selectCategoryModal.type = "text";
    selectCategoryModal.classList.add("form-control");
    //selectCategoryModal.placeholder = "A description about the annotations done";

    var selectCategoryModalOption1 = document.createElement("option");
    var selectCategoryModalOption2 = document.createElement("option");
    if(!spanishDomain){
        selectCategoryModalOption1.text = "General overview";
        selectCategoryModalOption2.text = "Detailed information";
    } else {
        selectCategoryModalOption1.text = "Resumen general";
        selectCategoryModalOption2.text = "Información detallada";
    }
    selectCategoryModal.add(selectCategoryModalOption1);
    selectCategoryModal.add(selectCategoryModalOption2);

    form.appendChild(selectCategoryModal);

    br = document.createElement("br");
    form.appendChild(br);

    var buttonSaveModal = document.createElement("button");
    buttonSaveModal.id = "buttonSaveModal";
    if(!spanishDomain){
        buttonSaveModal.innerHTML = "Save";
    } else {
        buttonSaveModal.innerHTML = "Guardar";
    }
    buttonSaveModal.classList.add("btn");
    buttonSaveModal.classList.add("btn-primary");
    buttonSaveModal.style = "margin: auto !important; display: block !important;"
    buttonSaveModal.onclick = function () {
        //TODO: create form with onclick to saveAnnotationsInServer with object param obj: {title: "", category: "", targetUsers: "", "description: ""}
        var selectTargetUsersModal = document.getElementById("selectTargetUsersModal");
        var selectTargetUsersModalValue = selectTargetUsersModal.options[selectTargetUsersModal.selectedIndex].text;
        var selectCategoryModal = document.getElementById("selectCategoryModal");
        var selectCategoryModalValue = selectCategoryModal.options[selectCategoryModal.selectedIndex].text;

        var obj = {};
        obj.title = document.getElementById("inputTitleModal").value;
        obj.description = document.getElementById("inputDescriptionModal").value;
        obj.category = selectCategoryModalValue;
        obj.targetUsers = selectTargetUsersModalValue;
        event.preventDefault();
        saveAnnotationsInServer(obj);

    }
    form.appendChild(buttonSaveModal);
    saveModalContent.appendChild(form);

    saveModal.appendChild(saveModalContent);
    document.body.appendChild(saveModal);

    var loadModal = document.createElement("div");
    loadModal.id = "loadModal";
    loadModal.classList.add("modal");
    var loadModalContent = document.createElement("div");
    loadModalContent.classList.add("modal-content");
    loadModalContent.id = "loadModalContent";
    var spanLoadClose = document.createElement("span");
    spanLoadClose.classList.add("close");
    spanLoadClose.innerHTML = "&times;";
    spanLoadClose.onclick = function(){
        loadModal.style.display = "none";
    };
    loadModalContent.appendChild(spanLoadClose);

    var h2Load = document.createElement("h2");
    if(!spanishDomain){
        h2Load.innerHTML = "Load annotations from server";
    } else {
        h2Load.innerHTML = "Cargar anotaciones del servidor";
    }
    loadModalContent.appendChild(h2Load);

    var divLoad = document.createElement("div");
    divLoad.id = "divLoad";
    loadModalContent.appendChild(divLoad);

    loadModal.appendChild(loadModalContent);
    document.body.appendChild(loadModal);

}



function saveAnnotationsSections(){

    if(annotationActive){
        for(var i = 0; i < annotations.length; i++){
            if(annotationId === annotations[i].id){
                annotations[i].save();
            }
        }
    }
}

function stopAnnotationsSections(){

    if(annotationActive){
        for(var i = 0; i < annotations.length; i++){
            if(annotationId === annotations[i].id){
                annotations[i].stop();
            }
        }
    }
}

function undoAnnotationsSections(){

    if(annotationActive){
        for(var i = 0; i < annotations.length; i++){
            if(annotationId === annotations[i].id){
                annotations[i].undo();
            }
        }
    }
}

function resetAnnotationsSections(){

    if(annotationActive){
        for(var i = 0; i < annotations.length; i++){
            if(annotationId === annotations[i].id){
                annotations[i].reset();
            }
        }
    }
}

function startAnnotations(annotation){
    if(annotation.domElements.length === 1 && annotation.domElements[0] === "text"){
        startAnnotationsTextSections();
    } else {
        annotationElements = annotation.domElements;
        startAnnotationsElements();
    }
}

function startAnnotationsTextSections(){
    activateTextDetector = true;
    closeAnnotationsMenu();

    showAnnotationsButtons();
    hideAnnotationMainButton();

    var textSelectionDiv
    //annotationActive = true;
    //annotationId = annotation.id;
    annotatedItemsAux = [];
    document.addEventListener("mouseup", saveTextSelected);
    document.addEventListener("keyup", saveTextSelected);
    //document.getElementById("annotateTextA").text = "Save text section";
    textSelectionDiv = document.createElement("div");
    textSelectionDiv.id = "textSelectionDiv";
    textSelectionDiv.style = "position: fixed; top: 80%; margin: 10px; padding: 10px; width: 95%; height: 100px; overflow: scroll; background-color: #E6E6E6; border: 1px solid #00000F; display: none";
    document.body.appendChild(textSelectionDiv);
    if(!spanishDomain){
        alert("Please select text from a specific section with important information and then click the save icon.");
    } else {
        alert("Por favor selecciona texto de una sección específica con información importante y después pulsa el icono de guardar.");
    }

}

function startAnnotationsElements(){
    activateClickDetector = true;
    annotationActive = true;
    closeAnnotationsMenu();

    showAnnotationsButtons();
    hideAnnotationMainButton();

    $('button').attr('disabled', 'disabled');
    $('a').addClass("hideSectionsLinks");
    /*all = document.body.getElementsByTagName("*");
        for (var i = 0; i < all.length; i++) {
            all[i].classList.add('hoverColor');
        }*/
    //$('a').css({'pointer-events': 'none'});
    $("#saveAnnotationsA").css({'pointer-events': 'all'});
    $("#stopAnnotationsA").css({'pointer-events': 'all'});
    $("#undoAnnotationsA").css({'pointer-events': 'all'});
    annotatedItemsAux = [];
    if(!spanishDomain){
        alert("Please click on the elements from a specific section and then click the save icon.");
    } else {
        alert("Por favor haz click en los elementos de una sección específica y después pulsa el icono de guardar.");
    }
}

function saveAnnotations(annotation){
    if(annotation.domElements.length === 1 && annotation.domElements[0] === "text"){
        saveAnnotationsTextSections();
    } else {
        saveAnnotationsElements();
    }
}

function saveAnnotationsTextSections(){
    if(Array.isArray(annotatedItemsAux) && annotatedItemsAux.length > 0){

        var result;
        if(!spanishDomain){
            result = prompt("Title of these text selections (must be recognisable by voice)", "");
        } else {
            result = prompt("Título de la selección de texto (tiene que ser un título reconocible por voz)", "");
        }

        var exists = false;
        try{
            var currentItems = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
            var otherItems = JSON.parse(myStorage.getItem(localStoragePrefix + "paragraphAnnotation"))
            var allItems = currentItems.concat(otherItems);
            if(Array.isArray(allItems) && allItems.length > 0){
                for(var i = 0; i < allItems.length; i++){
                    if(allItems[i].name.toLowerCase() === result.toLowerCase()){
                        exists = true;
                    }
                }
            }
        } catch(e){
            console.log("error merging elements");
        }

        while(exists){
            exists = false;
            if(!spanishDomain){
                result = prompt("Title of these text selections (choose a title that does not exist)", "");
            } else {
                result = prompt("Título de la selección de texto (elija uno que no exista)", "");
            }
            try{
                if(Array.isArray(allItems) && allItems.length > 0){
                    for(var j = 0; j < allItems.length; j++){
                        if(allItems[j].name.toLowerCase() === result.toLowerCase()){
                            exists = true;
                        }
                    }
                }
            } catch(e){}
        }

        var jsonText = new Object();
        jsonText.name = result;
        jsonText.value = annotatedItemsAux;
        var jsons = new Array();
        try{
            var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
            if(Array.isArray(items) && items.length > 0){
                jsons = items;
            }
        } catch(e){}
        jsons.push(jsonText);
        myStorage.setItem(localStoragePrefix + annotationId, JSON.stringify(jsons));
        annotatedItemsAux = [];

        var textSelectionDiv = document.getElementById("textSelectionDiv");
        textSelectionDiv.innerHTML = "";
    }

    if(annotationActive){
        if(!spanishDomain){
            alert("Please continue selecting text from other specific section (until you click the stop icon).");
        } else {
            alert("Por favor continúa seleccionando texto de otras secciones (hasta que pulses el icono de stop).");
        }
    }
}

function saveAnnotationsElements(){
    if(Array.isArray(annotatedItemsAux) && annotatedItemsAux.length > 0){
        var result;
        if(!spanishDomain){
            result = prompt("Title of this section (must be recognisable by voice)", "");
        } else {
            result = prompt("Título de la sección (tiene que ser reconocible por voz)", "");
        }
        if(result !== null){
            var exists = false;
            try{
                var currentItems = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
                var otherItems = JSON.parse(myStorage.getItem(localStoragePrefix + "textAnnotation"))
                var allItems = currentItems.concat(otherItems);
                if(Array.isArray(allItems) && allItems.length > 0){
                    for(var i = 0; i < allItems.length; i++){
                        if(allItems[i].name.toLowerCase() === result.toLowerCase()){
                            exists = true;
                        }
                    }
                }
            } catch(e){
                console.log("error merging elements");
            }

            while(exists){
                exists = false;
                if(!spanishDomain){
                    result = prompt("Title of this section (choose a title that does not exist)", "");
                } else {
                    result = prompt("Título de la sección (elija uno que no exista)", "");
                }
                try{
                    if(Array.isArray(allItems) && allItems.length > 0){
                        for(var j = 0; j < allItems.length; j++){
                            if(allItems[j].name.toLowerCase() === result.toLowerCase()){
                                exists = true;
                            }
                        }
                    }
                } catch(e){}
            }

            var all = document.body.getElementsByTagName("*");
            for (var k = 0; k < all.length; k++) {
                all[k].classList.remove('hoverColor');
                all[k].classList.remove('selectedColor');
            }

            $('*[class=""]').removeAttr('class');

            var jsonParagraph = new Object();
            jsonParagraph.name = result;
            jsonParagraph.value = annotatedItemsAux;
            var jsons = new Array();
            try{
                var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
                if(Array.isArray(items) && items.length > 0){
                    jsons = items;
                }
            } catch(e){}
            jsons.push(jsonParagraph);
            myStorage.setItem(localStoragePrefix + annotationId, JSON.stringify(jsons));
            annotatedItemsAux = [];

            //TODO: refactor xpath annotations
            if(annotationId === "paragraphAnnotation"){
                var jsonParagraphXPath = new Object();
                jsonParagraphXPath.name = result;
                jsonParagraphXPath.value = paragraphItemsXPathAux;
                var jsonsXPath = new Array();
                try{
                    var paragraphItemsXPath = JSON.parse(myStorage.getItem(localStoragePrefix + "paragraphItemsXPath"));
                    if(Array.isArray(paragraphItemsXPath) && paragraphItemsXPath.length > 0){
                        jsonsXPath = paragraphItemsXPath;
                    }
                } catch(e){}
                jsonsXPath.push(jsonParagraphXPath);
                myStorage.setItem(localStoragePrefix + "paragraphItemsXPath", JSON.stringify(jsonsXPath));
                paragraphItemsXPathAux = [];
            }

            if(annotationActive){
                if(!spanishDomain){
                    alert("Please continue clicking on other sections (until you click the stop icon).");
                } else {
                    alert("Por favor continúe haciendo click en otras secciones (hasta que pulses el botón de stop).");
                }
            }
        }
    }
}


function stopAnnotations(annotation){
    if(annotation.domElements.length === 1 && annotation.domElements[0] === "text"){
        stopAnnotationsTextSections();
    } else {
        stopAnnotationsElements();
    }
}

function stopAnnotationsTextSections(){
    if(activateTextDetector){
        document.removeEventListener("mouseup", saveTextSelected);
        document.removeEventListener("keyup", saveTextSelected);

        annotationActive = false;
        saveAnnotationsTextSections();
        annotationId = "";
        activateTextDetector = false;

        hideAnnotationsButtons();
        showAnnotationMainButton();

        var textSelectionDiv = document.getElementById("textSelectionDiv");
        document.body.removeChild(textSelectionDiv);

        toggleReadAloud();

        for(var i = 0; i < operations.length; i++){
            if(operations[i].hasMenu){
                updateSubmenuForOperationAndAnnotations("menu-" + operations[i].id, operations[i], operations[i].annotations);
            }
        }

        for(var j = 0; j < annotations.length; j++){
            updateSubmenuForAnnotations("menu-" + annotations[j].id, annotations[j].id);
        }

        toggleHiddenSections();

    }
}

function stopAnnotationsElements(){
    annotationActive = false;
    saveAnnotationsElements()
    $('button').removeAttr('disabled');
    //$('a').css({'pointer-events': 'all'});
    $('a').removeClass("hideSectionsLinks");
    activateClickDetector = false;
    $('*[class=""]').removeAttr('class');

    // save sections names from paragraphItems
    /*var paragraphItems = JSON.parse(myStorage.getItem(localStoragePrefix + "paragraphItems"));
    var textItems = JSON.parse(myStorage.getItem(localStoragePrefix + "textItems"));
    var sectionsNames = [];
    for(var i = 0; i < paragraphItems.length; i++){
        sectionsNames.push(paragraphItems[i].name);
    }
    for(var j = 0; j < textItems.length; j++){
        sectionsNames.push(textItems[j].name);
    }
    myStorage.setItem(localStoragePrefix + "sectionsNames", JSON.stringify(sectionsNames));*/

    hideAnnotationsButtons();
    showAnnotationMainButton();

    updateScriptXPath();
    toggleReadAloud();

    for(var i = 0; i < operations.length; i++){
        if(operations[i].hasMenu){
            updateSubmenuForOperationAndAnnotations("menu-" + operations[i].id, operations[i], operations[i].annotations);
        }
    }

    for(var j = 0; j < annotations.length; j++){
        updateSubmenuForAnnotations("menu-" + annotations[j].id, annotations[j].id);
    }

    toggleHiddenSections();
}

function undoAnnotations(annotation){
    if(annotation.domElements.length === 1 && annotation.domElements[0] === "text"){
        undoAnnotationsTextSections();
    } else {
        undoAnnotationsElements();
    }
}

function undoAnnotationsTextSections(){
    annotatedItemsAux.pop();

    var newContentString = "";
    for(var i = 0; i < annotatedItemsAux.length; i++){
        newContentString += annotatedItemsAux[i] + " ";
    }
    var textSelectionDiv = document.getElementById("textSelectionDiv");
    textSelectionDiv.innerText = newContentString;
}

function undoAnnotationsElements(){

    try{
        var lastItem = getElementByXPath(annotatedItemsAux[annotatedItemsAux.length -1]);
        if(typeof lastItem !== "undefined" && lastItem !== null){
            lastItem.classList.remove('selectedColor');
            annotatedItemsAux.pop();
            if(annotationId === "paragraphAnnotation")
                paragraphItemsXPathAux.pop();
        }/* else {
            var all = document.body.getElementsByTagName("*");
            for (var j=0, max=all.length; j < max; j++) {
                var containsSelectedColor = false;
                if(all[j].classList.contains('selectedColor')){
                    all[j].classList.remove('selectedColor');
                    if(all[j].classList.length === 0){
                        all[j].removeAttribute('class');
                    }
                    containsSelectedColor = true;
                }
                if(all[j].outerHTML === annotatedItemsAux[annotatedItemsAux.length -1]){
                    all[j].classList.remove('selectedColor');
                    annotatedItemsAux.pop();
                    if(annotationId === "paragraphAnnotation")
                        paragraphItemsXPathAux.pop();
                    containsSelectedColor = false;
                }

                if(containsSelectedColor){
                    all[j].classList.add('selectedColor');
                    containsSelectedColor = false;
                }
            }
        }*/
    } catch(error){
        console.log("Error searching for undo");
        console.log(error.message);
    }
}

function resetAnnotationsById(id, name){

    var resetSection = false;

    if(name !== null && typeof name !== 'undefined'){
        resetSection = true;
    }

    if(!resetSection){
        myStorage.setItem(localStoragePrefix + id, JSON.stringify([]));
    } else {
        for(var k = 0; k < annotations.length; k++){
            if(annotations[k].id === id){
                for(var a = 0; a < annotations[k].items.length; a++){
                    if(annotations[k].items[a].name === name){
                        annotations[k].items.splice(a, 1);
                    }
                }
                myStorage.setItem(localStoragePrefix + id, JSON.stringify(annotations[k].items));
            }
        }
    }

    for(var i = 0; i < operations.length; i++){
        if(operations[i].hasMenu){
            updateSubmenuForOperationAndAnnotations("menu-" + operations[i].id, operations[i], operations[i].annotations);
        }
    }

    for(var j = 0; j < annotations.length; j++){
        updateSubmenuForAnnotations("menu-" + annotations[j].id, annotations[j].id);
    }

    closeAnnotationsMenu();
    closeSubmenu("menu-" + id);
    toggleHiddenSections();
}

function editAnnotationsByName(id, name){

    var editSection = false;

    if(name !== null && typeof name !== 'undefined'){
        editSection = true;
    }

    if(editSection){
        for(var k = 0; k < annotations.length; k++){
            if(annotations[k].id === id){
                for(var a = 0; a < annotations[k].items.length; a++){
                    if(annotations[k].items[a].name === name){
                        var result;
                        if(!spanishDomain){
                            result = prompt("Title of this section (must be recognisable by voice)", "");
                        } else {
                            result = prompt("Título de esta sección (tiene que ser reconocible por voz)", "");
                        }

                        var exists = false;
                        try{
                            var currentItems = JSON.parse(myStorage.getItem(localStoragePrefix + "textAnnotation"));
                            var otherItems = JSON.parse(myStorage.getItem(localStoragePrefix + "paragraphAnnotation"))
                            var allItems = currentItems.concat(otherItems);
                            if(Array.isArray(allItems) && allItems.length > 0){
                                for(var i = 0; i < allItems.length; i++){
                                    if(allItems[i].name.toLowerCase() === result.toLowerCase()){
                                        exists = true;
                                    }
                                }
                            }
                        } catch(e){
                            console.log("error merging elements");
                        }

                        while(exists){
                            exists = false;
                            if(!spanishDomain){
                                result = prompt("Title of this section (choose a title that does not exist)", "");
                            } else {
                                result = prompt("Título de esta sección (elija uno que no exista)", "");
                            }
                            try{
                                if(Array.isArray(allItems) && allItems.length > 0){
                                    for(var j = 0; j < allItems.length; j++){
                                        if(allItems[j].name.toLowerCase() === result.toLowerCase()){
                                            exists = true;
                                        }
                                    }
                                }
                            } catch(e){}
                        }
                        if(result !== null && result !== "" && typeof result !== 'undefined'){
                            annotations[k].items[a].name = result;
                        }
                    }
                }
                myStorage.setItem(localStoragePrefix + id, JSON.stringify(annotations[k].items));
            }
        }
    }

    for(var x = 0; x < operations.length; x++){
        if(operations[x].hasMenu){
            updateSubmenuForOperationAndAnnotations("menu-" + operations[x].id, operations[x], operations[x].annotations);
        }
    }

    for(var y = 0; y < annotations.length; y++){
        updateSubmenuForAnnotations("menu-" + annotations[y].id, annotations[y].id);
    }

    closeAnnotationsMenu();
    closeSubmenu("menu-" + id);
    toggleHiddenSections();
}

function clickDetector(){
    document.addEventListener('click', function(event) {
        if (event===undefined) event= window.event;
        var target= 'target' in event? event.target : event.srcElement;

        if(activateClickDetector){
            var menu = document.getElementById("menu-webaugmentation");
            var menuAnnotations = document.getElementById("menu-intermediary");
            if(!menu.contains(target) && !menuAnnotations.contains(target)){
                console.log('clicked on ' + target.tagName);
                for(var i = 0; i < annotationElements.length; i++){
                    if(target.tagName === annotationElements[i] || annotationElements[i] === "all"){
                        annotatedItemsAux.push(getXPathForElement(target));
                        target.classList.add('selectedColor');
                        if(annotationId === "paragraphAnnotation"){
                            paragraphItemsXPathAux.push(getXPathForElement(target))
                        }
                    }
                }
            }
            event.stopPropagation()
            event.preventDefault()
            return false;
        }
    }, false);
}

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function saveTextSelected() {
    var selectedText = getSelectedText();
    console.log(selectedText);
    if (selectedText && !annotatedItemsAux.includes(selectedText)) {
        annotatedItemsAux.push(selectedText);

        var newContent = document.createTextNode(selectedText + " ");
        var textSelectionDiv = document.getElementById("textSelectionDiv");
        textSelectionDiv.appendChild(newContent);
        textSelectionDiv.style.display = "block";
    }
    clearTextSelected();
}

function clearTextSelected() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

function basicAnnotation(){
    var queryURL = "https://dbpedia.org/sparql";

    var propertyName1 = "name";
    var propertyName1ES = "nombre";
    var propertyURL1 = "http://xmlns.com/foaf/0.1/name";
    var property1 = {name : propertyName1, nameES : propertyName1ES, URL: propertyURL1};
    basicAnnotationByQueryAndProperty(queryURL, property1);

    var propertyName2 = "summary";
    var propertyName2ES = "resumen";
    var propertyURL2 = "http://dbpedia.org/ontology/abstract";
    var property2 = {name : propertyName2, nameES : propertyName2ES, URL: propertyURL2};
    basicAnnotationByQueryAndProperty(queryURL, property2);

    var propertyName3 = "comment";
    var propertyName3ES = "comentario";
    var propertyURL3 = "rdfs:comment";
    var property3 = {name : propertyName3, nameES : propertyName3ES, URL: propertyURL3};
    basicAnnotationByQueryAndProperty(queryURL, property3);

    var propertyName4 = "population";
    var propertyName4ES = "población";
    var propertyURL4 = "http://dbpedia.org/ontology/populationTotal";
    var property4 = {name : propertyName4, nameES : propertyName4ES, URL: propertyURL4};
    basicAnnotationByQueryAndProperty(queryURL, property4);


}

function basicAnnotationByQueryAndProperty(queryURL, property){

    var exists = false;

    var annotationId = "textAnnotation";
    try{
        var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
        if(Array.isArray(items) && items.length > 0){
            for(var i = 0; i < items.length; i++){
                if(items[i].name === property.name || items[i].name === property.nameES){
                    exists = true;
                }
            }
        }
    } catch(e){}

    if(!exists){

        // var currentURL = window.location.hostname + window.location.pathname;
        var currentURL = "en.wikipedia.org/wiki/" + window.location.pathname.split("/")[2];

        var queryPart1 = encodeURIComponent([
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
            "SELECT distinct ?stripped_value",
            "WHERE {",
            "<http://"
        ].join(" "));

        var queryPart2 = encodeURIComponent([
            "> foaf:primaryTopic ?label.",
            "?label <" + property.URL + "> ?value",
            "FILTER (LANG(?value)='en')",
            "BIND (STR(?value)  AS ?stripped_value)",
            "} LIMIT 1"
        ].join(" "));

        var query = queryPart1 + currentURL + queryPart2;

        var queryUrl = queryURL+"?query="+ query +"&format=json";
        console.log("query: " + query);
        console.log("queryUrl: " + queryUrl);
        $.ajax({
            dataType: "jsonp",
            url: queryUrl,
            success: function( data ) {
                console.log(JSON.stringify(data));
                var results = data.results.bindings;
                if(results.length > 0) {
                    var res = results[0].stripped_value.value;
                    console.log("query result: " + res);

                    var annotationId = "textAnnotation";
                    var jsons = new Array();
                    try{
                        var items = JSON.parse(myStorage.getItem(localStoragePrefix + annotationId));
                        if(Array.isArray(items) && items.length > 0){
                            jsons = items;
                        }
                    } catch(e){}
                    var newItem = {name: property.name, value: [res]};
                    jsons.push(newItem);
                    console.log("saved annotations: " + JSON.stringify(jsons));
                    myStorage.setItem(localStoragePrefix + annotationId, JSON.stringify(jsons));
                    //myStorage.setItem(localStoragePrefix + propertyName.name, res);

                    for(var i = 0; i < operations.length; i++){
                        if(operations[i].hasMenu){
                            updateSubmenuForOperationAndAnnotations("menu-" + operations[i].id, operations[i], operations[i].annotations);
                        }
                    }

                    for(var j = 0; j < annotations.length; j++){
                        updateSubmenuForAnnotations("menu-" + annotations[j].id, annotations[j].id);
                    }
                }
            },
            error: function(data) {
                console.log(JSON.stringify(data));
            }
        });
    }
}

function createOperationsMenu(){
    var divButtons = document.createElement('div')
    divButtons.id = "menu-operations"
    divButtons.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white"


    var i = document.createElement('i');
    i.className = 'fa fa-close'
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;"
    i.addEventListener("click", function(){
        closeOperationsMenu();
    }, false);
    divButtons.appendChild(i);

    for(var operationsIndex = 0; operationsIndex < operations.length; operationsIndex++){
        var a = document.createElement('a');
        a.id = operations[operationsIndex].id;
        //a.href = '';
        a.text = operations[operationsIndex].name;
        operations[operationsIndex].configureOperation();
        if(operations[operationsIndex].hasMenu){
            a.addEventListener("click", operations[operationsIndex].openMenu, false);
        } else {
            a.addEventListener("click", operations[operationsIndex].startOperation, false);
        }
        divButtons.appendChild(a);

        if(operations[operationsIndex].activable){
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = operations[operationsIndex].id + "Input";
            input.value = operations[operationsIndex].id + "Input";
            input.checked = operations[operationsIndex].active;
            input.style.setProperty("margin-left", "5px");
            if(operations[operationsIndex].active){
                a.style.setProperty("pointer-events", "all");
            } else {
                a.style.setProperty("pointer-events", "none");
            }
            //TODO: Refactor for reusability
            input.addEventListener("change", function(){
                for(var operationsI = 0; operationsI < operations.length; operationsI++){
                    if(operations[operationsI].id === this.id.split("Input").join("")){
                        if(!this.checked){
                            operations[operationsI].active = false;
                            myStorage.setItem(localStoragePrefix + operations[operationsI].id + "Active", operations[operationsI].active);
                            document.getElementById(operations[operationsI].id).style.setProperty("pointer-events", "none");
                            if(this.id.split("Input").join("") === "readAloud"){
                                toggleReadAloud();
                            } else if(this.id.split("Input").join("") === "videos"){
                                toggleYoutubeVideos();
                            } else if(this.id.split("Input").join("") === "breadcrumb"){
                                toggleBreadcrumb();
                            } else if(this.id.split("Input").join("") === "hide"){
                                toggleHiddenSections();
                            }
                        } else {
                            operations[operationsI].active = true;
                            myStorage.setItem(localStoragePrefix + operations[operationsI].id + "Active", operations[operationsI].active);
                            document.getElementById(operations[operationsI].id).style.setProperty("pointer-events", "all");
                            if(this.id.split("Input").join("") === "readAloud"){
                                toggleReadAloud();
                            } else if(this.id.split("Input").join("") === "videos"){
                                toggleYoutubeVideos();
                            } else if(this.id.split("Input").join("") === "breadcrumb"){
                                toggleBreadcrumb();
                            } else if(this.id.split("Input").join("") === "hide"){
                                toggleHiddenSections();
                            }
                        }
                    }
                }
            }, false);
            divButtons.appendChild(input);
        }
        divButtons.appendChild(document.createElement('br'));
    }
    document.getElementById("div-webaugmentation").appendChild(divButtons);

    /*  createReadMenu();
        createGoToMenu();*/
    createSpeakableAnnotations();
    createTourismAnnotation();
    //readWelcome();
    setTimeout(function() { say(); }, 1000);

    //TODO: refactor Toggle some operations
    toggleYoutubeVideos();
    toggleReadAloud();
    toggleBreadcrumb();
    toggleHiddenSections();
}


function say() {
    //speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    readWelcome();
}


function createCommandsMenu(){
    var divCommandsMenu = document.createElement("div")
    divCommandsMenu.id = "menu-commands";
    divCommandsMenu.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white"

    var i = document.createElement('i');
    i.className = 'fa fa-close'
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;"
    i.addEventListener("click", function(){
        closeCommandsMenu();
    }, false);
    divCommandsMenu.appendChild(i);

    for(var index = 0; index < operations.length; index++){
        var a1 = document.createElement('a');
        a1.id = operations[index].id + "Edit";
        if(!spanishDomain){
            a1.text = "'" + operations[index].name + "' command (" + operations[index].voiceCommand + ") ";
        } else {
            a1.text = "Comando '" + operations[index].name + "' (" + operations[index].voiceCommand + ") ";
        }
        a1.addEventListener("click", function(){
            for(var index = 0; index < operations.length; index++){
                if(operations[index].id === this.id.split("Edit").join("")){
                    var result;
                    if(!spanishDomain){
                        result = prompt("New command value for '" + operations[index].name + "' command (must be recognisable by voice)", operations[index].voiceCommand);;
                    } else {
                        result = prompt("Nuevo comando para '" + operations[index].name + "' (tiene que ser reconocible por voz)", operations[index].voiceCommand);;
                    }
                    if(result !== null){
                        operations[index].voiceCommand = result.toLowerCase();
                        myStorage.setItem(localStoragePrefix + operations[index].id, result.toLowerCase());
                        console.log(result);
                    }
                }
            }
        }, false);
        var a1i = document.createElement('i');
        a1i.className = 'fa fa-edit'
        a1.appendChild(a1i);
        divCommandsMenu.appendChild(a1);
        divCommandsMenu.appendChild(document.createElement('br'));
    }

    document.getElementById("div-webaugmentation").appendChild(divCommandsMenu);
}


function createSubmenuForOperationAndAnnotations(menuId, operationForSubmenu){

    var annotationsForSubmenu = operationForSubmenu.annotations;
    var divSubMenu = document.createElement("div");
    divSubMenu.id = menuId;
    divSubMenu.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white";

    var i = document.createElement('i');
    i.className = 'fa fa-close';
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;";
    i.addEventListener("click", closeSubmenu, false);
    i.menuId = menuId;
    divSubMenu.appendChild(i);

    try{
        for(var annotationsForSubmenuIndex = 0; annotationsForSubmenuIndex < annotationsForSubmenu.length; annotationsForSubmenuIndex++){
            for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
                if(annotationsForSubmenu[annotationsForSubmenuIndex] === annotations[annotationsIndex].id){
                    var annotationItems = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
                    annotations[annotationsIndex].items = JSON.parse(annotationItems);
                    var items = annotations[annotationsIndex].items
                    for(var sectionsIndex = 0; sectionsIndex < items.length; sectionsIndex ++){
                        var a1 = document.createElement('a');
                        a1.text = items[sectionsIndex].name
                        var sectionName = items[sectionsIndex].name
                        a1.addEventListener("click", operationForSubmenu.startOperation, false);
                        a1.sectionName = items[sectionsIndex].name;
                        a1.operation = operationForSubmenu;
                        divSubMenu.appendChild(a1);
                        divSubMenu.appendChild(document.createElement('br'));
                    }
                }
            }
        }
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function updateSubmenuForOperationAndAnnotations(menuId, operationForSubmenu, annotationsForSubmenu){

    var divSubMenu = document.getElementById(menuId);
    while (divSubMenu.firstChild) {
        divSubMenu.removeChild(divSubMenu.firstChild);
    }
    //divSubMenu.innerHTML = "";


    var i = document.createElement('i');
    i.className = 'fa fa-close';
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;";
    i.addEventListener("click", closeSubmenu, false);
    i.menuId = menuId;
    divSubMenu.appendChild(i);

    try{
        for(var annotationsForSubmenuIndex = 0; annotationsForSubmenuIndex < annotationsForSubmenu.length; annotationsForSubmenuIndex++){
            for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
                if(annotationsForSubmenu[annotationsForSubmenuIndex] === annotations[annotationsIndex].id){
                    var annotationItems = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
                    annotations[annotationsIndex].items = JSON.parse(annotationItems);
                    var items = annotations[annotationsIndex].items
                    for(var sectionsIndex = 0; sectionsIndex < items.length; sectionsIndex ++){
                        var a1 = document.createElement('a');
                        a1.text = items[sectionsIndex].name
                        var sectionName = items[sectionsIndex].name
                        a1.addEventListener("click", operationForSubmenu.startOperation, false);
                        a1.sectionName = items[sectionsIndex].name;
                        a1.operation = operationForSubmenu;
                        divSubMenu.appendChild(a1);
                        divSubMenu.appendChild(document.createElement('br'));
                    }
                }
            }
        }
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function createSubmenuForAnnotations(menuId, annotationId){

    var divSubMenu = document.createElement("div");
    divSubMenu.id = menuId;
    divSubMenu.style = "z-index: 100; padding: 10px; border: 2px solid black; display: none; background-color: white";

    var i = document.createElement('i');
    i.className = 'fa fa-close';
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;";
    i.addEventListener("click", closeSubmenu, false);
    i.menuId = menuId;
    divSubMenu.appendChild(i);

    try{
        for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
            if(annotationId === annotations[annotationsIndex].id){
                var annotationItems = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
                annotations[annotationsIndex].items = JSON.parse(annotationItems);
                var items = annotations[annotationsIndex].items
                for(var sectionsIndex = 0; sectionsIndex < items.length; sectionsIndex ++){
                    var label = document.createElement('label');
                    label.innerText = items[sectionsIndex].name;

                    divSubMenu.appendChild(label);

                    var a2b = document.createElement('a');
                    a2b.id = annotations[annotationsIndex].id + "editSection" + items[sectionsIndex].name;
                    a2b.className = "icon";
                    if(!spanishDomain){
                        a2b.title = "Edit" + items[sectionsIndex].name;
                    } else {
                        a2b.title = "Editar" + items[sectionsIndex].name;
                    }
                    a2b.addEventListener("click", function(){
                        for(var i = 0; i < annotations.length; i++){
                            if(annotations[i].id === this.id.split("editSection")[0]){
                                annotations[i].edit(this.id.split("editSection")[1]);
                            }
                        }
                    }, false);
                    var a2bIcon = document.createElement("i");
                    a2bIcon.className = "fa fa-edit";
                    a2bIcon.style = "margin-left: 8px";
                    a2b.appendChild(a2bIcon);
                    divSubMenu.appendChild(a2b);

                    var a2bTrash = document.createElement('a');
                    a2bTrash.id = annotations[annotationsIndex].id + "resetSection" + items[sectionsIndex].name;
                    a2bTrash.className = "icon";
                    a2bTrash.title = "Reset" + annotations[annotationsIndex].name;
                    a2bTrash.addEventListener("click", function(){
                        var confirmText = "";
                        if(!spanishDomain){
                            confirmText = "Are you sure to delete this section?";
                        } else {
                            confirmText = "¿Estás seguro de borrar esta sección?";
                        }
                        if(confirm(confirmText)){
                            for(var i = 0; i < annotations.length; i++){
                                if(annotations[i].id === this.id.split("resetSection")[0]){
                                    annotations[i].reset(this.id.split("resetSection")[1]);
                                }
                            }
                        }
                    }, false);
                    var a2bTrashIcon = document.createElement("i");
                    a2bTrashIcon.className = "fa fa-trash-o";
                    a2bTrashIcon.style = "margin-left: 8px";
                    a2bTrash.appendChild(a2bTrashIcon);
                    divSubMenu.appendChild(a2bTrash);

                    divSubMenu.appendChild(document.createElement('br'));
                }
            }
        }
    } catch(e){}

    document.getElementById("div-intermediary").appendChild(divSubMenu);
}

function updateSubmenuForAnnotations(menuId, annotationsId){

    var divSubMenu = document.getElementById(menuId);
    while (divSubMenu.firstChild) {
        divSubMenu.removeChild(divSubMenu.firstChild);
    }
    //divSubMenu.innerHTML = "";


    var i = document.createElement('i');
    i.className = 'fa fa-close';
    i.style = "position: absolute; right: 1%; top: 31%; z-index: 100;";
    i.addEventListener("click", closeSubmenu, false);
    i.menuId = menuId;
    divSubMenu.appendChild(i);

    try{
        for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
            if(annotationsId === annotations[annotationsIndex].id){
                var annotationItems = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
                annotations[annotationsIndex].items = JSON.parse(annotationItems);
                var items = annotations[annotationsIndex].items
                for(var sectionsIndex = 0; sectionsIndex < items.length; sectionsIndex ++){
                    var label = document.createElement('label');
                    label.innerText = items[sectionsIndex].name;

                    divSubMenu.appendChild(label);

                    var a2b = document.createElement('a');
                    a2b.id = annotations[annotationsIndex].id + "editSection" + items[sectionsIndex].name;
                    a2b.className = "icon";
                    if(!spanishDomain){
                        a2b.title = "Edit" + items[sectionsIndex].name;
                    } else {
                        a2b.title = "Editar" + items[sectionsIndex].name;
                    }
                    a2b.addEventListener("click", function(){
                        for(var i = 0; i < annotations.length; i++){
                            if(annotations[i].id === this.id.split("editSection")[0]){
                                annotations[i].edit(this.id.split("editSection")[1]);
                            }
                        }
                    }, false);
                    var a2bIcon = document.createElement("i");
                    a2bIcon.className = "fa fa-edit";
                    a2bIcon.style = "margin-left: 8px";
                    a2b.appendChild(a2bIcon);
                    divSubMenu.appendChild(a2b);

                    var a2bTrash = document.createElement('a');
                    a2bTrash.id = annotations[annotationsIndex].id + "resetSection" + items[sectionsIndex].name;
                    a2bTrash.className = "icon";
                    a2bTrash.title = "Reset" + annotations[annotationsIndex].name;
                    a2bTrash.addEventListener("click", function(){
                        var confirmText = "";
                        if(!spanishDomain){
                            confirmText = "Are you sure to delete this section?";
                        } else {
                            confirmText = "¿Estás seguro de borrar esta sección?";
                        }
                        if(confirm(confirmText)){
                            for(var i = 0; i < annotations.length; i++){
                                if(annotations[i].id === this.id.split("resetSection")[0]){
                                    annotations[i].reset(this.id.split("resetSection")[1]);
                                }
                            }
                        }
                    }, false);
                    var a2bTrashIcon = document.createElement("i");
                    a2bTrashIcon.className = "fa fa-trash-o";
                    a2bTrashIcon.style = "margin-left: 8px";
                    a2bTrash.appendChild(a2bTrashIcon);
                    divSubMenu.appendChild(a2bTrash);

                    divSubMenu.appendChild(document.createElement('br'));

                    divSubMenu.appendChild(document.createElement('br'));
                }
            }
        }
    } catch(e){}

    document.getElementById("div-intermediary").appendChild(divSubMenu);
}

function showSubmenu(id){
    var divSubMenu = document.getElementById(id);
    if(divSubMenu !== null){
        var x = divSubMenu.style;
        x.display = "block";
    }
}

function closeSubmenu(menuId){
    var menuIdToClose = menuId;
    if(typeof menuId.parentElement === 'undefined' && typeof menuId.currentTarget !== 'undefined'){
        menuIdToClose = menuId.currentTarget.menuId
    }
    var divSubMenu = document.getElementById(menuIdToClose);
    if(divSubMenu !== null){
        var x = divSubMenu.style;
        x.display = "none";
    }
}


function readWelcome(){
    var readContent = "";
    if(!spanishDomain){
        readContent = "Welcome to " + document.title + "! The voice commands available are: ";
        for(var i = 0; i < operations.length; i++){
            readContent += operations[i].voiceCommand + ", ";
        }
        readContent += listOperationsCommand + ", " + listSectionsCommand + ", " + welcomeCommand + ", " + stopListeningCommand + ", " + changeCommand + ", "
            + activateCommand + ", " + deactivateCommand + ", " + readFasterCommand + ", " + readSlowerCommand + ". ";
        readContent += sectionsToString();
    } else {
        readContent = "¡Bienvenido a " + document.title + "! Los comandos de voz disponibles son: ";
        for(var j = 0; j < operations.length; j++){
            readContent += operations[j].voiceCommand + ", ";
        }
        readContent += listOperationsCommandES + ", " + listSectionsCommandES + ", " + welcomeCommandES + ", " + stopListeningCommandES + ", " + changeCommandES + ", "
            + activateCommandES + ", " + deactivateCommandES + ", " + readFasterCommandES + ", " + readSlowerCommandES + ". ";
        readContent += sectionsToString();
    }


    //TODO: explain and add loadAnnotations operation
    Read(readContent);
}

function readOperations(){
    var readContent = "";
    if(!spanishDomain){
        readContent = "The voice commands available are: ";
        for(var i = 0; i < operations.length; i++){
            readContent += operations[i].voiceCommand + ", ";
        }
        readContent += listOperationsCommand + ", " + listSectionsCommand + ", " + welcomeCommand + ", " + stopListeningCommand + ", " + changeCommand + ", "
            + activateCommand + ", " + deactivateCommand + ". ";
        readContent += sectionsToString();
    } else {
        readContent = "Los comandos de voz disponibles son: ";
        for(var j = 0; j < operations.length; j++){
            readContent += operations[j].voiceCommand + ", ";
        }
        readContent += listOperationsCommandES + ", " + listSectionsCommandES + ", " + welcomeCommandES + ", " + stopListeningCommandES + ", " + changeCommandES + ", "
            + activateCommandES + ", " + deactivateCommandES + ". ";
        readContent += sectionsToString();
    }
    Read(readContent);
}

function readSections(){
    var readContent = sectionsToString()

    Read(readContent);
}

function sectionsToString(){

    var readContent = "";
    var names = [];
    for(var i = 0; i < operations.length; i++){
        try{
            for(var j = 0; j < operations[i].annotations.length; j++){
                var items = JSON.parse(myStorage.getItem(localStoragePrefix + operations[i].annotations[j]));
                for(var k = 0; k < items.length; k++){
                    if(!names.includes(items[k].name)){
                        names.push(items[k].name);
                    }
                }
            }
        } catch(e){}
    }

    if(names.length > 0){
        if(!spanishDomain){
            readContent += "The sections of the website are: ";
        } else {
            readContent += "Las secciones de esta web son: ";
        }
    }

    for(var index = 0; index < names.length; index++){
        if(index > 0){
            readContent += ", ";
        }
        readContent += names[index];
    }

    if(!spanishDomain){
        readContent += ". You can dowload more annotations using the voice command: " + loadAnnotationsCommand;
    } else {
        readContent += ". Puedes descargar más anotaciones usando el comando de voz: " + loadAnnotationsCommandES;
    }

    return readContent;
}

function readSectionsText(){

    var readAloudPosition = 0;
    var lastAnnotationName = "";
    for(var i = 0; i < operations.length; i++){
        if(operations[i].id == "readAloud"){
            readAloudPosition = i;
            try{
                for(var j = 0; j < operations[i].annotations.length; j++){
                    var items = JSON.parse(myStorage.getItem(localStoragePrefix + operations[i].annotations[j]));
                    for(var k = 0; k < items.length; k++){
                        if(k == items.length -1){
                            lastAnnotationName = items[k].name;
                        }
                    }
                }
            } catch(e){
            }
        }
    }

    var readFirst = false;
    if (lastSectionRead == lastAnnotationName){
        readFirst = true;
    }

    readAllSections = setInterval(function(){
        //console.log("setInterval");
        //console.log("reading: " + reading);
        var error = false;
        try{
            //console.log("lastSectionRead: " + lastSectionRead);
            //console.log("lastAnnotationName: " + lastAnnotationName);
            if (lastSectionRead != lastAnnotationName || readFirst){
                if(!reading){
                    //console.log("readNextSectionText");
                    readNextSectionText();
                    readFirst = false;
                }
            } else {
                clearInterval(readAllSections);
                //console.log("clearInterval");
            }
        } catch(e){
            error = true;
            console.log(e);
        }

        if(error){
            try{
                clearInterval(readAllSections);
                //console.log("clearInterval");
            } catch (e2){
            }
        }

    } , 1000);
}

function readNextSectionText(){

    for(var i = 0; i < operations.length; i++){
        if(operations[i].id == "readAloud" && operations[i].active){

            try{
                for(var j = 0; j < operations[i].annotations.length; j++){
                    var items = JSON.parse(myStorage.getItem(localStoragePrefix + operations[i].annotations[j]));
                    for(var k = 0; k < items.length; k++){
                        var ok = false;
                        if(items[k].name == lastSectionRead){
                            k++;
                            if(k >= items.length){
                                k = 0;
                            }
                            ok = true;
                        } else if(lastSectionRead == ""){
                            k = 0;
                            ok = true;
                        }

                        if(ok){
                            var params = {};
                            var current = {};
                            params.currentTarget = current;
                            params.currentTarget.sectionName = items[k].name;
                            params.currentTarget.operation = operations[i];
                            operations[i].startOperation(params);
                            return;
                        }
                    }
                }
            } catch(e){}
        }
    }
}

function readPreviousSectionText(){

    for(var i = 0; i < operations.length; i++){
        if(operations[i].id == "readAloud" && operations[i].active){

            try{
                for(var j = 0; j < operations[i].annotations.length; j++){
                    var items = JSON.parse(myStorage.getItem(localStoragePrefix + operations[i].annotations[j]));
                    for(var k = 0; k < items.length; k++){
                        var ok = false;
                        if(items[k].name == lastSectionRead){
                            k--;
                            if(k < 0){
                                k = items.length -1;
                            }
                            ok = true;
                        } else if(lastSectionRead == ""){
                            k = 0;
                            ok = true;
                        }
                        if(ok){
                            var params = {};
                            var current = {};
                            params.currentTarget = current;
                            params.currentTarget.sectionName = items[k].name;
                            params.currentTarget.operation = operations[i];
                            operations[i].startOperation(params);
                            return;
                        }
                    }
                }
            } catch(e){}
        }
    }
}

function textToAudio(){
    createPlayButtons();

    var cancelfooter = document.createElement('div');
    cancelfooter.id = "cancel";
    var buttonStop = document.createElement('button');
    if(!spanishDomain){
        buttonStop.innerText = "Stop";
    } else {
        buttonStop.innerText = "Detener";
    }
    buttonStop.addEventListener('click', stopReading);
    buttonStop.style.height = "50px";
    buttonStop.style.fontSize = "25px";
    cancelfooter.appendChild(buttonStop);
    document.body.appendChild(cancelfooter);
    $('#cancel').css({
        'position': 'fixed',
        'left': '0',
        'bottom': '0',
        'width': '100%',
        'background-color': 'black',
        'color': 'white',
        'text-align': 'center',
        'visibility': 'hidden',
    });
}

function createPlayButtons(){
    $('p').each(function() {
        if($(this).parent().attr('role') != 'navigation'){
            var button = document.createElement('button');
            button.innerHTML = "&#9658;";
            button.value = $(this).prop('innerText');
            button.className = "readAloudButton";
            button.style.fontSize = "18px";
            button.addEventListener('click', function(){
                Read($(this).prop('value'));
            });
            $(this).append(button);
        }
    });
}

function toggleReadAloud(){
    var divsToHide = document.getElementsByClassName("readAloudButton");
    var readCommandActive;
    if(!document.getElementById("readAloudInput").checked){
        readCommandActive = false;
        document.getElementById("readAloud").style.setProperty("pointer-events", "none");
        for(var i = 0; i < divsToHide.length; i++){
            divsToHide[i].style.display = "none";
        }
    } else {
        readCommandActive = true;
        document.getElementById("readAloud").style.setProperty("pointer-events", "all");
        for(var i2 = 0; i2 < divsToHide.length; i2++){
            divsToHide[i2].style.display = "block";
        }
    }
    myStorage.setItem(localStoragePrefix + "readAloudActive", readCommandActive);
}

function resumeInfinity() {
    reading = true;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    timeoutResumeInfinity = setTimeout(resumeInfinity, 10000);
    $('#cancel').css('visibility', 'visible');
}

function Read(message){
    //console.log("Read function: " + message)
    window.speechSynthesis.cancel();
    clearTimeout(timeoutResumeInfinity);

    if(!document[hidden]){

        var reader = new SpeechSynthesisUtterance(message);
        reader.rate = readerRate;
        if(!spanishDomain){
            reader.lang = languageCodeSyntesis;
        } else {
            reader.lang = languageCodeSyntesisES;
        }
        reader.onstart = function(event) {
            resumeInfinity();
        };
        reader.onend = function(event) {
            clearTimeout(timeoutResumeInfinity);
            $('#cancel').css('visibility', 'hidden');
            setTimeout(function(){
                reading = false;
                if(recognitionActive){
                    recognition.start();
                }
            }, 1000);
        };

        try{
            reading = true;
            if(recognitionActive){
                recognition.abort();
            }
            window.speechSynthesis.speak(reader);
        } catch(e){
            stopReading();
        }
        if(window.speechSynthesis.speaking){
            $('#cancel').css('visibility', 'visible');
        } else {
            stopReading();
        }

    } else {
        console.log("Window tab is not focused, reading aloud not allowed");
    }
}

function readFaster(){
    //console.log(readerRate);
    //readerRate = parseFloat(readerRate);
    if(readerRate <= 9){
        readerRate = readerRate + 0.5;
        myStorage.setItem(localStoragePrefix + "readerRate", readerRate);

        if(!spanishDomain){
            Read("Read speed " + readerRate + " out of 10.");
        } else {
            Read("Velocidad de lectura " + readerRate + " sobre 10.");
        }
    } else {
        if(!spanishDomain){
            Read("Read speed at maximum level.")
        } else {
            Read("Velocidad de lectura al máximo.")
        }
    }
}

function readSlower(){
    //console.log(readerRate);
    //readerRate = parseFloat(readerRate);
    if(readerRate > 0.5){
        readerRate = readerRate - 0.5;
        myStorage.setItem(localStoragePrefix + "readerRate", readerRate);

        if(!spanishDomain){
            Read("Read speed " + readerRate + " out of 10.");
        } else {
            Read("Velocidad de lectura " + readerRate + " sobre 10.");
        }
    } else {
        if(!spanishDomain){
            Read("Read speed at minimum level.")
        } else {
            Read("Velocidad de lectura al mínimo.")
        }
    }
}

function stopReading(){
    window.speechSynthesis.cancel();
    clearTimeout(timeoutResumeInfinity);
    $('#cancel').css('visibility', 'hidden');

    try{
        clearInterval(readAllSections);
    } catch (e2){
    }
    setTimeout(function(){
        reading = false;

        if(recognitionActive){
            recognition.start();
        }
    }, 1000);
}

function KeyPress(e) {
    var evtobj = window.event? event : e

    // No mic tests
    /*if(evtobj.ctrlKey && evtobj.shiftKey){
        console.log("No mic tests");
        readSectionsText();
    }*/
    if(evtobj.keyCode == 32 && evtobj.ctrlKey && evtobj.shiftKey){
        if(!reading){
            readWelcome();
        }
    }
    else if (evtobj.keyCode == 32 && evtobj.ctrlKey){
        if(reading){
            stopReading();
        }
        else if(!recognitionActive){
            recognitionActive = true;
            recognition.start();
            var aToggleListening = document.getElementById("toggleListeningA");
            if(!spanishDomain){
                aToggleListening.text = 'Stop Listening';
            } else {
                aToggleListening.text = 'Desactivar comandos por voz';
            }
            //var inputVoiceCommands = document.getElementById("voiceCommandsInput");
            //inputVoiceCommands.checked = recognitionActive;
            var toggleListeningIcon = document.getElementById("toggleListeningIcon");
            toggleListeningIcon.style = "color:gray; margin-left: 8px";
            if(!spanishDomain){
                Read("Listening active, to stop listening use the " + stopListeningCommand + " voice command, which disables all voice commands.");
            } else {
                Read("Comandos por voz activos, para desactivarlos use el comando " + stopListeningCommand + ".");
            }
        }
        else {
            recognitionActive = false;
            recognition.abort();
            var aToggleListening2 = document.getElementById("toggleListeningA");
            if(!spanishDomain){
                aToggleListening2.text = 'Start Listening';
            } else {
                aToggleListening2.text = 'Activar comandos por voz';
            }
            //var inputVoiceCommands2 = document.getElementById("voiceCommandsInput");
            //inputVoiceCommands2.checked = recognitionActive;
            var toggleListeningIcon2 = document.getElementById("toggleListeningIcon");
            toggleListeningIcon2.style = "color:red; margin-left: 8px";
            if(!spanishDomain){
                Read("Listening stop, to start listening use the control and space keys, which enables all voice commands.");
            } else {
                Read("Comandos por voz desactivados, para activarlos use el comando " + stopListeningCommand + ".");
            }
        }

        myStorage.setItem("recognitionActive", recognitionActive);
    }
}

var commandListened;

// Speech recognition
function audioToText(){
    //headlines = document.getElementsByClassName("mw-headline")
    //sectionsNames = JSON.parse(myStorage.getItem(localStoragePrefix + "sectionsNames"));

    console.log("Configure speech recognition");

    updateGrammar();
    if(!spanishDomain){
        recognition.lang = languageCodeCommands;
    } else {
        recognition.lang = languageCodeCommandsES;
    }
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = event => {
        if(reading === false) {
            const speechToText = event.results[event.results.length -1][0].transcript.toLowerCase().trim();
            commandListened = speechToText;
            console.log(speechToText);
            if(!changeCommandInProcess1 && !changeCommandInProcess2){
                if(speechToText.includes(listOperationsCommand) || speechToText.includes(listOperationsCommandES)){
                    readOperations();
                }
                else if(speechToText.includes(welcomeCommand) || speechToText.includes(welcomeCommandES)){
                    readWelcome();
                }
                else if(speechToText.includes(listSectionsCommand) || speechToText.includes(listSectionCommand) ||
                        speechToText.includes(listSectionsCommandES) || speechToText.includes(listSectionCommandES)){
                    readSections();
                }
                else if(speechToText.includes(readSectionsCommand) || speechToText.includes(readSectionsCommandES)){
                    readSectionsText();
                }
                else if(speechToText.includes(readNextSectionCommand) || speechToText.includes(readNextSectionCommandES)){
                    readNextSectionText();
                }
                else if(speechToText.includes(readPreviousSectionCommand) || speechToText.includes(readPreviousSectionCommandES)){
                    readPreviousSectionText();
                }
                else if(speechToText.includes(readFasterCommand) || speechToText.includes(readFasterCommandES)){
                    readFaster();
                }
                else if(speechToText.includes(readSlowerCommand) || speechToText.includes(readSlowerCommandES)){
                    readSlower();
                }
                else if((speechToText.includes(activateCommand) && !speechToText.includes(deactivateCommand)) ||
                       (speechToText.includes(activateCommandES) && !speechToText.includes(deactivateCommandES))){
                    console.log("Activate operation: ");
                    for(var a = 0; a < operations.length; a++){
                        if((speechToText.includes(activateCommand + " " + operations[a].voiceCommand) ||
                            speechToText.includes(activateCommandES + " " + operations[a].voiceCommand)) && !operations[a].active){
                            console.log(operations[a].name);
                            var input = document.getElementById(operations[a].id + "Input");
                            input.checked = true;
                            var eventChange = new Event('change');
                            input.dispatchEvent(eventChange);
                            if(!spanishDomain){
                                Read("Operation " + operations[a].voiceCommand + " activated.");
                            } else {
                                Read("Operación " + operations[a].voiceCommand + " activada.");
                            }
                        }
                    }
                }
                else if(speechToText.includes(deactivateCommand) || speechToText.includes(deactivateCommandES)){
                    console.log("Deactivate operation: ");
                    for(var b = 0; b < operations.length; b++){
                        if((speechToText.includes(deactivateCommand + " " + operations[b].voiceCommand) ||
                            speechToText.includes(deactivateCommandES + " " + operations[b].voiceCommand)) && operations[b].active){
                            console.log(operations[b].name);
                            var input2 = document.getElementById(operations[b].id + "Input");
                            input2.checked = false;
                            var eventChange2 = new Event('change');
                            input2.dispatchEvent(eventChange2);
                            if(!spanishDomain){
                                Read("Operation " + operations[b].voiceCommand + " deactivated.");
                            } else {
                                Read("Operación " + operations[b].voiceCommand + " desactivada.");
                            }
                        }
                    }
                }
                else if(speechToText.includes(loadAnnotationsCommand) || speechToText.includes(loadAnnotationCommand) ||
                        speechToText.includes(loadAnnotationsCommandES) || speechToText.includes(loadAnnotationCommandES)){
                    loadAnnotationsFromServerByVoice();
                }
                else if(speechToText.includes(rateCommand)){
                    var rating = 0;
                    if(speechToText.includes("one") || speechToText.includes("uno") || speechToText.includes("1")){
                       rating = 1;
                    } else if(speechToText.includes("two") || speechToText.includes("dos") || speechToText.includes("2")){
                       rating = 2;
                    } else if(speechToText.includes("three") || speechToText.includes("tres") || speechToText.includes("3")){
                       rating = 3;
                    } else if(speechToText.includes("four") || speechToText.includes("for") || speechToText.includes("cuatro") || speechToText.includes("4")){
                       rating = 4;
                    } else if(speechToText.includes("five") || speechToText.includes("cinco") || speechToText.includes("5")){
                       rating = 5;
                    }

                    var annotationTitle = myStorage.getItem(localStoragePrefix + "annotationTitle");
                    if(annotationTitle != null && typeof annotationTitle != 'undefined' && annotationTitle.length > 0){
                        if(rating > 0){
                            saveRatingsOfAnnotationInServer(rating, annotationTitle);
                            //TODO: check if an error occurred
                            if(!spanishDomain){
                                Read("Score saved to annotations: " + annotationTitle + ".");
                            } else {
                                Read("Valoración guardada en anotación: " + annotationTitle + ".");
                            }
                        } else {
                            if(!spanishDomain){
                                Read("Score should be from 1 to 5.");
                            } else {
                                Read("La valoración debe ser entre 1 y 5.");
                            }
                        }
                    } else {
                        if(!spanishDomain){
                            Read("You need to load annotations first using the voice command: " + loadAnnotationsCommand + ".");
                        } else {
                            Read("Necesitar cargar las anotaciones usando el comando de voz: " + loadAnnotationsCommandES + ".");
                        }
                    }
                }
                else if(speechToText.includes(changeCommand) || speechToText.includes(changeCommandES)){
                    console.log("changeCommandInProcess = true")
                    changeCommandInProcess1 = true;
                    if(!spanishDomain){
                        Read(changeCommandQuestion + "?");
                    } else {
                        Read(changeCommandQuestionES + "?");
                    }
                }
                else if(speechToText.includes(stopListeningCommand) || speechToText.includes(stopListeningCommandES)){
                    if(recognitionActive){
                        console.log("recognition deactivated")
                        recognitionActive = false;
                        recognition.abort();
                    }
                    if(!spanishDomain){
                        document.getElementById("toggleListeningA").text = "Start Listening";
                        document.getElementById("toggleListeningIcon").style = "color:red";
                        Read("Listening stopped, to start listening use control and space keys.");
                    } else {
                        document.getElementById("toggleListeningA").text = "Activar comandos por voz";
                        document.getElementById("toggleListeningIcon").style = "color:red";
                        Read("Comandos desactivados, para activar comandos por voz use las teclas control más espacio.");
                    }
                } else {
                    for(var i = 0; i < operations.length; i++){
                        if(speechToText.startsWith(operations[i].voiceCommand) && operations[i].voiceCommand.length > 0){
                            if(operations[i].active){
                                try{
                                    if(operations[i].annotations.length > 0) {
                                        for(var j = 0; j < operations[i].annotations.length; j++){
                                            var items = JSON.parse(myStorage.getItem(localStoragePrefix + operations[i].annotations[j]));
                                            for(var k = 0; k < items.length; k++){
                                                var cleanSpeechText = speechToText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase();
                                                var cleanSection = items[k].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase();
                                                if(cleanSpeechText.includes(operations[i].voiceCommand + " " + cleanSection)){
                                                    var params = {};
                                                    var current = {};
                                                    params.currentTarget = current;
                                                    params.currentTarget.sectionName = items[k].name;
                                                    params.currentTarget.operation = operations[i];
                                                    operations[i].startOperation(params);
                                                    return;
                                                }
                                            }
                                        }
                                    } else {
                                        operations[i].startOperation();
                                        return;
                                    }
                                }catch(e){}
                            } else {
                                if(!spanishDomain){
                                    Read("Operation " + operations[i].voiceCommand + " is not activated, please activate using the voice command: " + activateCommand + " " + operations[i].voiceCommand + ".");
                                } else {
                                    Read("Operación " + operations[i].voiceCommand + " está desactivada, por favor actívala usando el comando de voz: " + activateCommandES + " " + operations[i].voiceCommand + ".");
                                }
                                return;
                            }
                        }
                    }
                    if(recognitionFailedFirstTime){
                        recognitionFailedFirstTime = false;
                        if(!spanishDomain){
                            Read(recognitionFailedText + " You can use: " + listOperationsCommand + " to know which operations are available and: "
                             + listSectionsCommand + " to know which sections can be read aloud.");
                        } else {
                            Read(recognitionFailedTextES + " Puedes usar: " + listOperationsCommandES + " para saber que operaciones están disponibles y: "
                             + listSectionsCommandES + " para saber qué secciones se pueden leer en voz alta.");
                        }
                    } else {
                        if(!spanishDomain){
                            Read(recognitionFailedText);
                        } else {
                            Read(recognitionFailedTextES);
                        }
                    }
                }
            } else {
                if(changeCommandInProcess1){
                    //Command change in process
                    if(!speechToText.includes(changeCommandQuestion) && !speechToText.includes(newCommandQuestion) &&
                       !speechToText.includes(changeCommandQuestionES) && !speechToText.includes(newCommandQuestionES)){
                        if(speechToText.toLowerCase() == cancelCommand || speechToText.toLowerCase() == cancelCommandES) {
                            console.log("Cancel change of command")
                            changeCommandInProcess1 = false;
                            changeCommandInProcess2 = false;
                            return;
                        }
                        for(var opIndex = 0; opIndex < operations.length; opIndex++){
                            if(speechToText.includes(operations[opIndex].voiceCommand)){

                                if(!spanishDomain){
                                    Read(newCommandQuestion + "?");
                                } else {
                                    Read(newCommandQuestionES + "");
                                }
                                newCommandString = speechToText.toLowerCase();
                                operationToChange = operations[opIndex];
                                changeCommandInProcess1 = false;
                                changeCommandInProcess2 = true;
                                return;
                            }
                        }

                        if(!spanishDomain){
                            Read(speechToText + " is not an existing command. Try again.");
                        } else {
                            Read(speechToText + " no es un comando. Inténtelo de nuevo.");
                        }
                    }
                } else if(changeCommandInProcess2){
                    //Command change in process
                    if(!speechToText.includes(changeCommandQuestion) && !speechToText.includes(newCommandQuestion) &&
                      !speechToText.includes(changeCommandQuestionES) && !speechToText.includes(newCommandQuestionES)){
                        if(speechToText.toLowerCase() == cancelCommand) {
                            console.log("Cancel change of command")
                            changeCommandInProcess1 = false;
                            changeCommandInProcess2 = false;
                        } else {
                            if(!spanishDomain){
                                Read(speechToText + " is the new command");
                            } else {
                                Read(speechToText + " es el nuevo comando");
                            }
                            myStorage.setItem(localStoragePrefix + operationToChange.id, speechToText.toLowerCase());
                            operationToChange.voiceCommand = speechToText.toLowerCase();
                            //console.log("new variable value " + eval(camelize(newCommandString) + "Command"))
                            changeCommandInProcess1 = false;
                            changeCommandInProcess2 = false;
                        }
                    }
                }
            }
        }
    }

    recognition.onspeechend = function() {
        console.log("onspeechend");
        /*setTimeout(function(){
            if(recognitionActive && !reading){
                console.log("recognition reset");
                recognition.start();
            }
        }, 1000);*/
    }

    recognition.onend = function() {
        console.log("onend");
        recognition.stop();
        setTimeout(function(){
            if(recognitionActive && !reading){
                console.log("recognition reset");
                recognition.start();
            }
        }, 100);
    }

    recognition.onerror = function(event) {
        console.log("onerror");
        console.log('Speech recognition error detected: ' + event.error);
        event.preventDefault();
        return false;
    }

    recognition.onstart = function() {
        console.log("onstart");
    }

    if(myStorage.getItem("recognitionActive") !== null){
        recognitionActive = (myStorage.getItem("recognitionActive") == 'true')
    } else {
        myStorage.setItem("recognitionActive", recognitionActive);
    }

    if(document[hidden]){
        recognitionActive = false;
        //myStorage.setItem("recognitionActive", recognitionActive);

        console.log("Window tab is not focused, listening not allowed");
    }

    //setInterval(function(){
        if(recognitionActive && !reading){
            try{
                recognitionActive = true;
                recognition.start();
                console.log("recognition activated")
            } catch(e){

            }
        }
    //}, 1000);
}


function updateGrammar(){

    var commandsGrammar, commandsAux = [], grammar;
    if(!spanishDomain){
        commandsGrammar = [ 'increase', 'magnify', 'read', 'play', 'font', 'size', 'decrease', 'reduce', 'stop', 'listening', 'score', 'one', 'two', 'three', 'four', 'five' ];
        commandsAux = [];
        for(var i = 0; i < operations.length; i++){
            //TODO: add operation + annotations names to grammar
            /*if(operations[i].voiceCommand === "read" || operations[i].voiceCommand === "go to"){
            for(var j = 0; j < sectionsNames.length; j++){
                commandsAux.push(operations[i] + " " + sectionsNames[j].toLowerCase())
            }
        } else {*/
            commandsAux.push(operations[i].voiceCommand)
            //}
        }
    } else {
        commandsGrammar = [ 'aumentar', 'incrementar', 'leer', 'play', 'letra', 'tamaño', 'decrementar', 'reducir', 'detener', 'activar', 'desactivar', 'valoración', 'uno', 'dos', 'tres', 'cuatro', 'cinco' ];
        commandsAux = [];
        for(var j = 0; j < operations.length; j++){
            //TODO: add operation + annotations names to grammar
            /*if(operations[i].voiceCommand === "read" || operations[i].voiceCommand === "go to"){
            for(var j = 0; j < sectionsNames.length; j++){
                commandsAux.push(operations[i] + " " + sectionsNames[j].toLowerCase())
            }
        } else {*/
            commandsAux.push(operations[j].voiceCommand)
            //}
        }
    }

    grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commandsGrammar.concat(commandsAux).join(' | ') + ' ;';
    console.log("grammar: " + grammar);
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}


function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}


// Youtube videos
function youtubeVideos(){
    //videoRequest($("#firstHeading").prop('innerText'));
    videoRequest(document.title);
}

function videoRequest(searchTerm) {
    var url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
        part: 'snippet',
        //key: 'AIzaSyBB9Vs9M1WcozRTjf9rGBU-M-HEpGYGXv8',
        key: 'AIzaSyA9c14XqejmcLW_KMVlSZZngrPfyF3X5rY',
        type: 'video',
        maxResults: 6,
        q: searchTerm
    };

    $.getJSON(url, params, showResults);
}

function showResults(results) {
    var html = "";
    var entries = results.items;
    var content = document.createElement('div');

    $.each(entries, function (index, value) {
        var videoId = value.id.videoId;
        var vid = '<iframe width="380" height="200" src="https://www.youtube.com/embed/'+videoId
        +'" frameborder="1" margin="5px" padding="5px" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        content.innerHTML += vid;
    });

    //$('.mw-parser-output').append("<div id='youtubeVideos' style='display: block'><br><h2><span class='mw-headline' id='Youtube_videos'>Youtube videos</span></h2></div>")

    var youtubeVideoContent = document.createElement("DIV");
    if(!spanishDomain){
        youtubeVideoContent.innerHTML = "<div id='youtubeVideos' style='display: block'><br><h2><span class='mw-headline' id='Youtube_videos'>Youtube videos</span></h2></div>";
    } else {
        youtubeVideoContent.innerHTML = "<div id='youtubeVideos' style='display: block'><br><h2><span class='mw-headline' id='Youtube_videos'>Vídeos de Youtube</span></h2></div>";
    }
    document.body.appendChild(youtubeVideoContent);
    $('#youtubeVideos').append(content)

}

function goToVideos(){
    var videosCommandActive = myStorage.getItem(localStoragePrefix + "videosActive");
    closeOperationsMenu();
    closeMenu();

    if(videosCommandActive){
        $(window).scrollTop($('#youtubeVideos').offset().top);
    }
}

function toggleYoutubeVideos(){
    var x = document.getElementById("youtubeVideos");
    var videosCommandActive;
    if (!document.getElementById("videosInput").checked) {
        if(x !== null){
            x.style.display = "none";
        }
        document.getElementById("videos").style.setProperty("pointer-events", "none");
        videosCommandActive = false;
    } else {
        if(x !== null){
            x.style.display = "block";
        } else {
            youtubeVideos();
        }
        document.getElementById("videos").style.setProperty("pointer-events", "all");
        videosCommandActive = true;
    }
    myStorage.setItem(localStoragePrefix + "videosActive", videosCommandActive);
}


// Bread Crumb (History)
function breadcrumb(){
    var lastVisitedSitesURL = []
    var lastVisitedSitesTitle = []
    var breadcrumb = document.createElement('ol');
    breadcrumb.id = "BreadCrumb";
    breadcrumb.setAttribute('vocab',"https://schema.org/");
    breadcrumb.setAttribute('typeof',"BreadcrumbList");

    var maxBreadCrumb = 4;
    if(myStorage.getItem("lastVisitedSitesTitle" + "0") !== document.title){
        lastVisitedSitesURL.push(location.href)
        lastVisitedSitesTitle.push(document.title)
    } else{
        maxBreadCrumb++;
    }
    for(var i = 0; i < maxBreadCrumb; i++){
        if(myStorage.getItem("lastVisitedSitesURL" + i) !== null){
            lastVisitedSitesURL.push(myStorage.getItem("lastVisitedSitesURL" + i))
        }
        if(myStorage.getItem("lastVisitedSitesTitle" + i) !== null){
            lastVisitedSitesTitle.push(myStorage.getItem("lastVisitedSitesTitle" + i))
        }
    }
    for(var lastVisitedSitesIndex = 0; lastVisitedSitesIndex < lastVisitedSitesURL.length; lastVisitedSitesIndex++){
        myStorage.setItem("lastVisitedSitesURL" + lastVisitedSitesIndex, lastVisitedSitesURL[lastVisitedSitesIndex])
        myStorage.setItem("lastVisitedSitesTitle" + lastVisitedSitesIndex, lastVisitedSitesTitle[lastVisitedSitesIndex])
    }
    document.body.appendChild(breadcrumb);
    $('#BreadCrumb').css({
        'position': 'fixed',
        'height': '50px',
        'left': '15%',
        'top': '0',
        //'width': '100%',
        'padding': '10px',
        'background-color': '#FFFFFF',
        'vertical-align': 'bottom',
        'visibility': 'visible',
        'border': 'solid black',
        'z-index': '100'
    });
    var lastVisitedSitesURLReverse = lastVisitedSitesURL.reverse()
    var lastVisitedSitesTitleReverse = lastVisitedSitesTitle.reverse()
    for(var x = 0; x < lastVisitedSitesURLReverse.length; x++){
        var li = document.createElement("li");
        li.setAttribute('property',"itemListElement");
        li.setAttribute('typeof',"ListItem");
        li.style.display = "inline";

        var link = document.createElement("a");
        if(x < lastVisitedSitesURLReverse.length - 1) {
            link.href = lastVisitedSitesURLReverse[x];
            link.style = "color: #0645ad !important;"
        } else {
            link.style = "color: #000000 !important;text-decoration: none;"
        }
        link.setAttribute('property',"item");
        link.setAttribute('typeof',"WebPage");
        link.className = "linkBread";
        var span = document.createElement("span");
        span.setAttribute('property',"name");
        span.innerText = lastVisitedSitesTitleReverse[x];
        var meta = document.createElement("meta");
        meta.setAttribute('property',"position");
        var position = x+1;
        meta.setAttribute('content',position+"");
        link.appendChild(span);
        li.appendChild(link);
        li.appendChild(meta);
        breadcrumb.appendChild(li);
        breadcrumb.innerHTML += " > ";
    }
    $('.linkBread').each(function(){
        $(this).css({
            'padding':'3px',
        });
    });

    //toggleBreadcrumb()
}

function goBack(){
    var breadcrumbChildren = document.getElementById("BreadCrumb").children;
    if(breadcrumbChildren.length > 1){
        breadcrumbChildren[breadcrumbChildren.length-2].firstElementChild.click();
    } else {
        if(!spanishDomain){
            Read("There is no previous page in the history from same web domain");
        } else {
            Read("No hay una página anterior en el historial que pertenezca al mismo dominio");
        }
    }
}


function toggleBreadcrumb(){
    var breadcrumbCommandActive;
    if(document.getElementById("breadcrumbInput").checked){
        breadcrumbCommandActive = true;
        document.getElementById("BreadCrumb").style.setProperty("display", "block");
    } else {
        breadcrumbCommandActive = false;
        document.getElementById("BreadCrumb").style.setProperty("display", "none");
    }
    myStorage.setItem(localStoragePrefix + "breadcrumbActive", breadcrumbCommandActive);
}

function toggleHiddenSections(){
    console.log("toggleHiddenSections");
    var hiddenSectionsCommandActive;
    //$('.readAloudButton').attr('disabled', 'disabled');
    try{
        var hiddenItems = JSON.parse(myStorage.getItem(localStoragePrefix + "uselessAnnotation"));
        if(hiddenItems !== null){
            for(var i = 0; i < hiddenItems.length; i++){
                for(var j = 0; j < hiddenItems[i].value.length; j++){
                        var element = getElementByXPath(hiddenItems[i].value[j]);
                    if (document.getElementById("hideInput").checked) {
                        element.classList.add("hideUselessSections");
                        hiddenSectionsCommandActive = true;
                    } else {
                        element.classList.remove("hideUselessSections");
                        hiddenSectionsCommandActive = false;
                    }
                }
            }
        }

        myStorage.setItem(localStoragePrefix + "hideActive", hiddenSectionsCommandActive);

        closeMenu();
        closeOperationsMenu();
    } catch(e){

    }
    //$('.readAloudButton').removeAttr('disabled');

}


function toggleMenu(){
    var x = document.getElementById("foldingMenu");
    if(x !== null){
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
        closeCommandsMenu();
        closeAnnotationsMenu();
        closeOperationsMenu();
    }
}
function closeMenu(){
    var x = document.getElementById("foldingMenu");
    if(x !== null){
        x.style.display = "none";
    }
}

function toggleOperationsMenu(){
    var x = document.getElementById("menu-operations");
    if(x !== null){
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
            closeMenu();
        }
    }
}
function closeOperationsMenu(){
    var x = document.getElementById("menu-operations");
    if(x !== null){
        x.style.display = "none";
    }
}

function toggleAnnotationsMenu(){
    var x = document.getElementById("menu-annotations");
    if(x !== null){
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
            closeMenu();
            closeOperationsMenu();
        }
    }
}
function closeAnnotationsMenu(){
    var x = document.getElementById("menu-annotations");
    if(x !== null){
        x.style.display = "none";
    }
}

function toggleCommandsMenu(){
    var x = document.getElementById("menu-commands");
    if(x !== null){
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    }
}
function closeCommandsMenu(){
    var x = document.getElementById("menu-commands");
    if(x !== null){
        x.style.display = "none";
    }
}


function showAnnotationMainButton(){
    var aIntermediary = document.getElementById("a-intermediary");
    aIntermediary.style = "display: block";
}

function showAnnotationsButtons(){

    var aSave = document.getElementById("saveAnnotationsA");
    aSave.style = "display: block";

    var aStop = document.getElementById("stopAnnotationsA");
    aStop.style = "display: block";

    var aUndo = document.getElementById("undoAnnotationsA");
    aUndo.style = "display: block";

}

function hideAnnotationMainButton(){
    var aIntermediary = document.getElementById("a-intermediary");
    aIntermediary.style = "display: none";
}

function hideAnnotationsButtons(){

    var aSave = document.getElementById("saveAnnotationsA");
    aSave.style = "display: none";

    var aStop = document.getElementById("stopAnnotationsA");
    aStop.style = "display: none";

    var aUndo = document.getElementById("undoAnnotationsA");
    aUndo.style = "display: none";

}

/*function saveAnnotationsSections(){

    if(annotationsUselessActive){
        saveAnnotationsUselessSections();
    } else if(annotationsParagraphActive){
        saveAnnotationsParagraphSections();
    } else if(annotationsTextActive){
        saveAnnotationsTextSections();
    }
}

function stopAnnotationsSections(){

    if(annotationsUselessActive){
        //stopAnnotationsUselessSections();
    } else if(annotationsParagraphActive){
        stopAnnotationsParagraphSections();
    } else if(annotationsTextActive){
        stopAnnotationsTextSections();
    }
}

function undoAnnotationsSections(){

    if(annotationsUselessActive){
        undoAnnotationsUselessSections();
    } else if(annotationsParagraphActive){
        undoAnnotationsParagraphSections();
    } else if(annotationsTextActive){
        undoAnnotationsTextSections();
    }
}*/


function hideLoadAnnotationsInfoForServer(){
    var loadModal = document.getElementById("loadModal");
    loadModal.style.display = "none";
}

function loadAnnotationsFromServer(){
    //var menuLoadAnnotations = document.getElementById("menu-loadAnnotations");
    //menuLoadAnnotations.style.display = "block";

    closeAnnotationsMenu();
    var loadModal = document.getElementById("loadModal");
    loadModal.style.display = "block";
    var divLoad = document.getElementById("divLoad");

    var xmlhttp = new XMLHttpRequest();
    var url = "https://wake.dlsi.ua.es/AnnotationsServer/?operation=loadWebsite&website="+encodeURI(document.URL);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var annotationsLoaded = JSON.parse(this.responseText).results;
            console.log("annotationsLoaded: " + JSON.stringify(annotationsLoaded));
            divLoad.innerHTML = "";

            for(var i = 0; i < annotationsLoaded.length; i++){
                var a = document.createElement('a');
                a.text = annotationsLoaded[i].title;
                a.href = "javascript:void(0);";
                var title = annotationsLoaded[i].title;
                a.title = annotationsLoaded[i].title;
                a.addEventListener("click", function(title){
                    loadAnnotationByTitleAndWebsite(title);
                    return false;
                }, false);
                divLoad.appendChild(a);

                if(annotationsLoaded[i].ratings != null && typeof annotationsLoaded[i].ratings != 'undefined'
                   && annotationsLoaded[i].ratings.length > 0){
                    var finalRating = 0;
                    for(var ratingsStored = 0; ratingsStored < annotationsLoaded[i].ratings.length; ratingsStored++){
                        finalRating += annotationsLoaded[i].ratings[ratingsStored];
                    }
                    finalRating = Math.round(finalRating * 100.0 / annotationsLoaded[i].ratings.length) / 100;
                    var labelRating = document.createElement("label");
                    labelRating.style.marginLeft = "5px";
                    labelRating.innerHTML = " (" + finalRating + "/5 stars)";
                    divLoad.appendChild(labelRating);
                }

                var divRating = document.createElement('div');
                var rateLabel = document.createElement('label');
                if(!spanishDomain){
                    rateLabel.innerHTML = "Rate: ";
                } else {
                    rateLabel.innerHTML = "Valoración: ";
                }
                rateLabel.style.marginRight = "5px";
                divRating.appendChild(rateLabel);

                var spanRating1 = document.createElement('span');
                spanRating1.classList.add("icon");
                spanRating1.style.cursor = "pointer";
                spanRating1.innerHTML = "&#9733;";
                spanRating1.onmouseover = function(){changeColor(this, 1, true);};
                spanRating1.onmouseout = function(){changeColor(this, 1, false);};
                spanRating1.onclick= function(title){
                    changeColor(this, 1, true);
                    disableChangeColor(this);
                    saveRatingsOfAnnotationInServer(1, title);
                };
                spanRating1.title = title;
                divRating.appendChild(spanRating1);

                var spanRating2 = document.createElement('span');
                spanRating2.classList.add("icon");
                spanRating2.style.cursor = "pointer";
                spanRating2.innerHTML = "&#9733;";
                spanRating2.onmouseover = function(){changeColor(this, 2, true);};
                spanRating2.onmouseout = function(){changeColor(this, 2, false);};
                spanRating2.onclick= function(title){
                    changeColor(this, 2, true);
                    disableChangeColor(this);
                    saveRatingsOfAnnotationInServer(2, title);
                };
                spanRating2.title = title;
                divRating.appendChild(spanRating2);

                var spanRating3 = document.createElement('span');
                spanRating3.classList.add("icon");
                spanRating3.style.cursor = "pointer";
                spanRating3.innerHTML = "&#9733;";
                spanRating3.onmouseover = function(){changeColor(this, 3, true);};
                spanRating3.onmouseout = function(){changeColor(this, 3, false);};
                spanRating3.onclick= function(title){
                    changeColor(this, 3, true);
                    disableChangeColor(this);
                    saveRatingsOfAnnotationInServer(3, title);
                };
                spanRating3.title = title;
                divRating.appendChild(spanRating3);

                var spanRating4 = document.createElement('span');
                spanRating4.classList.add("icon");
                spanRating4.style.cursor = "pointer";
                spanRating4.innerHTML = "&#9733;";
                spanRating4.onmouseover = function(){changeColor(this, 4, true);};
                spanRating4.onmouseout = function(){changeColor(this, 4, false);};
                spanRating4.onclick= function(title){
                    changeColor(this, 4, true);
                    disableChangeColor(this);
                    saveRatingsOfAnnotationInServer(4, title);
                };
                spanRating4.title = title;
                divRating.appendChild(spanRating4);

                var spanRating5 = document.createElement('span');
                spanRating5.classList.add("icon");
                spanRating5.style.cursor = "pointer";
                spanRating5.innerHTML = "&#9733;";
                spanRating5.onmouseover = function(){changeColor(this, 5, true);};
                spanRating5.onmouseout = function(){changeColor(this, 5, false);};
                spanRating5.onclick= function(title){
                    changeColor(this, 5, true);
                    disableChangeColor(this);
                    saveRatingsOfAnnotationInServer(5, title);
                };
                spanRating5.title = title;
                divRating.appendChild(spanRating5);

                divLoad.appendChild(divRating);

                divLoad.appendChild(document.createElement('br'));

                if(typeof annotationsLoaded[i].description != 'undefined'){
                    var label = document.createElement('label');
                    if(!spanishDomain){
                        label.innerHTML = "<b>Description: </b>" + annotationsLoaded[i].description;
                    } else {
                        label.innerHTML = "<b>Descripción: </b>" + annotationsLoaded[i].description;
                    }
                    divLoad.appendChild(label);
                    divLoad.appendChild(document.createElement('br'));
                }
                if(typeof annotationsLoaded[i].category != 'undefined'){
                    var label2 = document.createElement('label');
                    if(!spanishDomain){
                        label2.innerHTML = "<b>Category: </b>" + annotationsLoaded[i].category;
                    } else {
                        label2.innerHTML = "<b>Categoría: </b>" + annotationsLoaded[i].category;
                    }
                    divLoad.appendChild(label2);
                    divLoad.appendChild(document.createElement('br'));
                }
                if(typeof annotationsLoaded[i].targetUsers != 'undefined'){
                    var label3 = document.createElement('label');
                    if(!spanishDomain){
                        label3.innerHTML = "<b>Target users: </b>" + annotationsLoaded[i].targetUsers;
                    } else {
                        label3.innerHTML = "<b>Destinatarios: </b>" + annotationsLoaded[i].targetUsers;
                    }
                    divLoad.appendChild(label3);
                    divLoad.appendChild(document.createElement('br'));
                }
                divLoad.appendChild(document.createElement('br'));
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function saveRatingsOfAnnotationInServer(rating, annotationTitle){
    if(typeof annotationTitle.currentTarget !== 'undefined'){
        annotationTitle = annotationTitle.currentTarget.title
    }
    //annotationTitle = annotationTitle.currentTarget.title
    console.log("saveRatingsOfAnnotationInServer: " + rating + ", " + annotationTitle);
    if(rating != null && annotationTitle != null){

        var xmlhttp = new XMLHttpRequest();
        var url = "https://wake.dlsi.ua.es/AnnotationsServer/";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var annotationsSaved = JSON.parse(this.responseText);
                console.log(JSON.stringify(annotationsSaved));
            }
        };

        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        var params = {}
        params.operation = "rate";
        params.rating = rating;
        params.annotationTitle = annotationTitle;
        //console.log(JSON.stringify(params));
        xmlhttp.send(JSON.stringify(params));

        //hideAnnotationsInfoForServer();
    } else {
        //TODO: check errors
        console.log("error");
    }
}

function disableChangeColor(element){
  var childs = element.parentNode.childNodes;
  for(var i = 0; i < childs.length; i++){
      childs[i].onmouseover = '';
      childs[i].onmouseout = '';
      childs[i].onclick = '';
  }
}

function changeColor(element, previousSiblings, fill){
  var color
  if(fill){
    color = "#F1C40F";
  } else {
    color = "#000";
  }
  var previousSiblingsAux = previousSiblings - 1;
  element.style.color = color;
  var elementAux = element
  for(var i = 0; i < previousSiblingsAux; i++){
    elementAux = elementAux.previousElementSibling
    elementAux.style.color = color;
  }
}

function loadAnnotationsFromServerByVoice(){

    var xmlhttp = new XMLHttpRequest();
    var url = "https://wake.dlsi.ua.es/AnnotationsServer/?operation=loadWebsite&website="+encodeURI(document.URL);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var annotationsLoaded = JSON.parse(this.responseText).results;
            console.log("annotationsLoaded: " + JSON.stringify(annotationsLoaded));

            var annotationsToRead = "";

            if(annotationsLoaded.length > 0){
                if(!spanishDomain){
                    annotationsToRead += "The available annotations to download are: ";
                } else {
                    annotationsToRead += "Las anotaciones disponibles para descargar son: ";
                }
            }

            var title = ""
            for(var i = 0; i < annotationsLoaded.length; i++){
                title = annotationsLoaded[i].title;
                var description = annotationsLoaded[i].description;
                var category = annotationsLoaded[i].category;
                var targetUsers = annotationsLoaded[i].targetUsers;
                var ratings = annotationsLoaded[i].ratings;
                if(commandListened.toLowerCase().includes(title.toLowerCase())){
                    loadAnnotationByTitleAndWebsite(title, true);
                    return;
                } else {
                    annotationsToRead += "title: " + title;
                    if(typeof description != 'undefined'){
                        if(!spanishDomain){
                            annotationsToRead += "; description: " + description;
                        } else {
                            annotationsToRead += "; descripción: " + description;
                        }
                    }
                    if(typeof targetUsers != 'undefined'){
                        if(!spanishDomain){
                            annotationsToRead += "; for: " + targetUsers;
                        } else {
                            annotationsToRead += "; para: " + targetUsers;
                        }
                    }
                    if(typeof category != 'undefined'){
                        if(!spanishDomain){
                            annotationsToRead += "; category: " + category;
                        } else {
                            annotationsToRead += "; categoría: " + category;
                        }
                    }
                    if(typeof ratings != 'undefined'){
                        var finalRating = 0;
                        for(var ratingsStored = 0; ratingsStored < ratings.length; ratingsStored++){
                            finalRating += ratings[ratingsStored];
                        }
                        finalRating = Math.round(finalRating * 100.0 / annotationsLoaded[i].ratings.length) / 100;
                        if(!spanishDomain){
                            annotationsToRead += "; ratings: " + finalRating + " out of 5";
                        } else {
                            annotationsToRead += "; valoración: " + finalRating + " de 5";
                        }
                    }
                    annotationsToRead += ".  ";
                }
            }

            if(annotationsLoaded.length > 0){
                if(!spanishDomain){
                    annotationsToRead +=
                    ". If you want to download one of these annotations just say the load annotations command and the title of the annotations. For example: load annotations "
                    + title + ". To rate your current loaded annotations you can use the voice command 'score' and the rating number between 1 and 5: for example score 5." ;
                } else {
                    annotationsToRead +=
                    ". Si quieres descargar una de estas anotaciones solo utiliza el comando cargar anotaciones y el título de la anotación. Por ejemplo: cargar anotaciones "
                    + title + ". Para valorar las anotaciones descargadas utiliza el comando 'valorar' y la valoración numérica entre 1 y 5, por ejemplo: valorar 5." ;
                }

            } else {
                if(!spanishDomain){
                    annotationsToRead += "There aren't annotations to download for this website.";
                } else {
                    annotationsToRead += "No hay anotaciones para descargar en esta web.";
                }
            }
            Read(annotationsToRead);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function closeLoadMenu(){
    document.getElementById("menu-loadAnnotations").style.display = "none";
}

function loadAnnotationByTitleAndWebsite(title, byVoice){
    var titleToLoad = title;
    if(typeof title.parentElement === 'undefined' && typeof title.currentTarget !== 'undefined'){
        titleToLoad = title.currentTarget.title
    }
    var xmlhttp = new XMLHttpRequest();
    var url = "https://wake.dlsi.ua.es/AnnotationsServer/?operation=loadAnnotation&title="+titleToLoad+"&website="+encodeURI(document.URL);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var annotationsLoaded = JSON.parse(this.responseText).results;
            if(annotationsLoaded.length > 0){
                //var annotationsJSON = JSON.parse(annotationsLoaded[0]);
                var annotationsJSON = annotationsLoaded[0];
                //TODO: refactor
                console.log(annotationsJSON);

                myStorage.setItem(localStoragePrefix + "annotationTitle", annotationsJSON.title);

                for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
                    myStorage.setItem(localStoragePrefix + annotations[annotationsIndex].id, annotationsJSON[localStoragePrefix + annotations[annotationsIndex].id]);
                }
                myStorage.setItem(localStoragePrefix + "paragraphItemsXPath", annotationsJSON[localStoragePrefix + "paragraphItemsXPath"]);

                for(var i = 0; i < operations.length; i++){
                    if(operations[i].hasMenu){
                        updateSubmenuForOperationAndAnnotations("menu-" + operations[i].id, operations[i], operations[i].annotations);
                    }
                }

                for(var j = 0; j < annotations.length; j++){
                    updateSubmenuForAnnotations("menu-" + annotations[j].id, annotations[j].id);
                }
                updateScriptXPath();

                //TODO: toggle operations that are toggleable(?)
                toggleHiddenSections();

                if(byVoice === true){
                    if(!spanishDomain){
                        Read("Annotations loaded, use list sections to know the new sections available."
                         + " To rate your current loaded annotations you can use the voice command 'score' and the rating number between 1 and 5: for example score 5." );
                    } else {
                        Read("Anotaciones cargadas, utiliza listar secciones para saber qué secciones hay disponibles."
                         + " Para valorar las anotaciones descargadas utiliza el comando 'valorar' y la valoración numérica entre 1 y 5, por ejemplo: valorar 5." );
                    }
                } else {
                    if(!spanishDomain){
                        alert("Annotations loaded!");
                    } else {
                        alert("¡Anotaciones cargadas!");
                    }
                    hideLoadAnnotationsInfoForServer();
                }
            }
            //console.log(JSON.stringify(annotationsLoaded));
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function askAnnotationsInfoForServer(){
    closeAnnotationsMenu();
    var saveModal = document.getElementById("saveModal");
    saveModal.style.display = "block";
}


function hideAnnotationsInfoForServer(){
    var saveModal = document.getElementById("saveModal");
    saveModal.style.display = "none";
}

function saveAnnotationsInServer(result){
    console.log("saveAnnotationsInServer: " + JSON.stringify(result));

    //var result = prompt("Title for annotations", "");
    if(result!=null && result.title != null){
        var annotationsObject = {};
        annotationsObject.title = result.title;
        annotationsObject.description = result.description;
        annotationsObject.targetUsers = result.targetUsers;
        annotationsObject.category = result.category;
        annotationsObject.website = encodeURI(document.URL);
        annotationsObject.ratings = [];

        for(var annotationsIndex = 0; annotationsIndex < annotations.length; annotationsIndex++){
            annotationsObject[localStoragePrefix + annotations[annotationsIndex].id] = myStorage.getItem(localStoragePrefix + annotations[annotationsIndex].id);
        }
        annotationsObject[localStoragePrefix + "paragraphItemsXPath"] = myStorage.getItem(localStoragePrefix + "paragraphItemsXPath");
        console.log(JSON.stringify(annotationsObject));
        var xmlhttp = new XMLHttpRequest();
        var url = "https://wake.dlsi.ua.es/AnnotationsServer/";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var annotationsSaved = JSON.parse(this.responseText);
                console.log(JSON.stringify(annotationsSaved));
            }
        };

        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        var params = {}
        params.operation = "save";
        params.annotations = JSON.stringify(annotationsObject);
        //console.log(JSON.stringify(params));
        xmlhttp.send(JSON.stringify(params));

        hideAnnotationsInfoForServer();
    } else {
        //TODO: check if title already exists for that website
        console.log("error");
    }
}

function createTourismAnnotation(){
    var script = document.createElement('script'); // Create a script element
    script.type = "application/ld+json";
    script.id = "TourismAnnotationsScript";
    script.text = '{"@context": "https://schema.org/","@type": "TouristDestination", "name": "' + document.title + 
        '", "sameAs": "http://en.wikipedia.org/wiki/' + window.location.pathname.split("/")[2] + '", "url": "' + document.URL + '" }';
    document.body.appendChild(script);
}

function createSpeakableAnnotations(){
    var script = document.createElement('script'); // Create a script element
    script.type = "application/ld+json";
    script.id = "AnnotationsScript";
    script.text = '{"@context": "https://schema.org/","@type": "WebPage","name": "' + document.title + '","speakable":{"@type": "SpeakableSpecification","xpath": [';

    var paragraphItemsXPath = myStorage.getItem(localStoragePrefix + "paragraphItemsXPath");
    try{
        paragraphItemsXPath = JSON.parse(paragraphItemsXPath);
    } catch(e){
    }

    if(paragraphItemsXPath !== null){
        var all
        var added = false;
        for(var i = 0; i < paragraphItemsXPath.length; i++){
            try{
                if(typeof paragraphItemsXPath[i].value[0] !== 'undefined'){
                    script.text += '"' + paragraphItemsXPath[i].value[0] + '",';
                    added = true;
                }
            }
            catch(exc){
                var auxValue = JSON.parse(paragraphItemsXPath[i]).value[0];
                if(typeof auxValue !== 'undefined'){
                    script.text += '"' + auxValue + '",';
                    added = true;
                }
            }
        }
        if(added){
            script.text += script.text.substring(0, script.text.length - 1);
        }
    }
    script.text += ']  }, "url": "' + document.URL + '" }';
    document.body.appendChild(script);
}

function updateScriptXPath(){
    try{
        var script = document.getElementById("AnnotationsScript");
        script.text = '{"@context": "https://schema.org/","@type": "WebPage","name": "' + document.title + '","speakable":{"@type": "SpeakableSpecification","xpath": [';

        var paragraphItemsXPath = myStorage.getItem(localStoragePrefix + "paragraphItemsXPath");
        try{
            paragraphItemsXPath = JSON.parse(paragraphItemsXPath);
        } catch(e){
        }

        if(paragraphItemsXPath !== null){
            var all
            var added = false;
            for(var i = 0; i < paragraphItemsXPath.length; i++){
                if(typeof paragraphItemsXPath[i].value !== 'undefined' && paragraphItemsXPath[i].value.length > 0 && typeof paragraphItemsXPath[i].value[0] !== 'undefined'){
                    script.text += '"' + paragraphItemsXPath[i].value[0] + '",';
                    added = true;
                }
            }
            if(added){
                script.text += script.text.substring(0, script.text.length - 1);
            }
        }
        script.text += ']  }, "url": "' + document.URL + '" }';
        document.body.appendChild(script);
    } catch(e){
    }
}

function createCSSSelector (selector, style) {
  if (!document.styleSheets) return;
  if (document.getElementsByTagName('head').length == 0) return;

  var styleSheet,mediaType;

  if (document.styleSheets.length > 0) {
    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
      if (document.styleSheets[i].disabled)
        continue;
      var media = document.styleSheets[i].media;
      mediaType = typeof media;

      if (mediaType === 'string') {
        if (media === '' || (media.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }
      else if (mediaType=='object') {
        if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }

      if (typeof styleSheet !== 'undefined')
        break;
    }
  }

  if (typeof styleSheet === 'undefined') {
    var styleSheetElement = document.createElement('style');
    styleSheetElement.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      styleSheet = document.styleSheets[i];
    }

    mediaType = typeof styleSheet.media;
  }

  if (mediaType === 'string') {
    for (i = 0, l = styleSheet.rules.length; i < l; i++) {
      if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.addRule(selector,style);
  }
  else if (mediaType === 'object') {
    var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
    for (i = 0; i < styleSheetLength; i++) {
      if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
  }
}

function getXPathForElement(element) {
    const idx = (sib, name) => sib
        ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.getElementById(elm.id) === elm
            ? [`id("${elm.id}")`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/').split('"').join("'");
}

function getElementByXPath(path) {
    return (new XPathEvaluator())
        .evaluate(path, document.documentElement, null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;
}


/*(function() {
    'use strict';

    // Your code here...
})();*/
