// ==UserScript==
// @name         WAFRA4OD
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  WAFRA for Open Data (WAFRA4OD)
// @author       Cesar Gonzalez Mora
// @match        *://www.europeandataportal.eu/*
// @match        *://data.europa.eu/*
// @noframes
// @exclude      *://www.youtube.com/embed/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.slim.min.js
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://unpkg.com/papaparse@5.3.0/papaparse.min.js
// @downloadURL https://update.greasyfork.org/scripts/419908/WAFRA4OD.user.js
// @updateURL https://update.greasyfork.org/scripts/419908/WAFRA4OD.meta.js
// ==/UserScript==


/*********************** Variables ************************/
var myStorage = window.localStorage;
var readerRate = 1.0;
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const recognition = new SpeechRecognition();
var timeoutResumeInfinity;

var apiResultDataset, apiResultPortalMetadata, apiResultPortalResults;
var distributionData = [];
var numberOfRowsToAutoDownload = 100;
var distributionDownloaded = false;

//var listeningActive = true;

var recognitionActive = true;
var recognitionFailedFirstTime = true;
var recognitionFailedText = "Command not recognised, please try again.";
var recognitionFailedTextES = "Comando no reconocido, por favor inténtelo de nuevo.";
var reading = false;
var readFirstTime = true;
var mainPage = false, resultsPage = false, datasetPage = false;

var operations = [];

var languageCodeSyntesis = "en";
var languageCodeCommands = "en";

var spanishDomain = false;

var languageCodeSyntesisES = "es";
var languageCodeCommandsES = "es";

var welcomeCommand = "welcome";
var stopListeningCommand = "stop listening";
var changeCommand = "change";
var cancelCommand = "cancel";
var activateCommand = "activate";
var deactivateCommand = "deactivate";
var changeCommandQuestion = "which command";
var newCommandQuestion = "which is the new command";
var chooseDistributionCommand = "choose distribution";
var downloadDistributionCommand = "download";

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
var changeCommandQuestionES = "que comando";
var newCommandQuestionES = "cuál es el nuevo comando?";
var chooseDistributionCommandES = "elegir distribución";
var downloadDistributionCommandES = "descargar";

var changeCommandInProcess1 = false;
var changeCommandInProcess2 = false;
var newCommandString = "";

var operationToChange;
var distributionChoosenURL = "", distributionChoosenTitle = "";

var readParams = ["title", "description", "distributions", "columns", "all", "rows", "row", "rows from"];
var readParamsES = ["titulo", "descripcion", "distribuciones", "columnas", "todo", "filas", "fila", "filas desde"];

var NumbersWord = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10
};

var NumbersWordES = {
    'uno': 1,
    'dos': 2,
    'tres': 3,
    'cuatro': 4,
    'cinco': 5,
    'seis': 6,
    'siete': 7,
    'ocho': 8,
    'nueve': 9,
    'diez': 10
};

var navigationShortcutsActive = false;
var columnPos = 0, rowPos = 1;

/*********************** Page is loaded ************************/
$(document).ready(function() {
    setTimeout(function(){
        init();
    }, 1000);

    // check if url changes and call init
    var oldHref = document.location.href;
    window.onload = function() {
        var bodyList = document.querySelector("body"), observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    //init();
                    location.reload();
                }
            });
        });
        var config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList, config);
    };

    document.onkeydown = KeyPress;

});

function init (){
    //<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    /*var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.head.appendChild(meta);*/
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

    // Detect if domain is spanish or english
    console.log(document.URL);
    if(document.URL.endsWith("/es") || document.URL.includes("locale=es")){
        spanishDomain = true;
        console.log("spanish domain");
    }

    //TODO: open data portals compatibility
    if((document.URL.startsWith("https://www.europeandataportal.eu/data/datasets/") || document.URL.startsWith("https://data.europa.eu/data/datasets/"))
      && (!document.URL.startsWith("https://www.europeandataportal.eu/data/datasets/?") && !document.URL.startsWith("https://data.europa.eu/data/datasets/?"))){
        datasetPage = true;
        var apiURLdataset = document.URL.replace("https://"+ document.domain + "/data/datasets/", "https://"+ document.domain + "/api/hub/search/datasets/");
        queryAPIdataset(apiURLdataset);
    } else if(document.URL.startsWith("https://www.europeandataportal.eu/data/datasets") || document.URL.startsWith("https://data.europa.eu/data/datasets")){
        resultsPage = true;
        var apiURLresultsPage = "https://"+ document.domain + "/api/hub/search/search";
        queryAPIportalMetadataWithResults(apiURLresultsPage);
    } else if(document.URL.startsWith("https://www.europeandataportal.eu") || document.URL.startsWith("https://data.europa.eu")){
        mainPage = true;
        var apiURLmainPage = "https://"+ document.domain + "/api/hub/search/search";
        queryAPIportalMetadata(apiURLmainPage);
    }

    /*********************** Add new operations here ************************/
    var welcome, search, addFilter, category, results, order, details, choose, removeFilter, readTitle, readDescription, readDistributions, readDetails,
        readDataOperation, increaseFontSizeOperation, decreaseFontSizeOperation,  faster, slower, chooseDistribution, download,
        mainPageOperation, goBackOperation, breadCrumbOperation;
    /*id; name; voiceCommand; activable; active; editable; hasMenu; mainPage; resultsPage; datasetPage;*/
    if(!spanishDomain){
        welcome = new WelcomeOperation("welcomeOperation", "Welcome", "welcome", true, true, true, false, true, true, true);
        search = new SearchOperation("searchOperation", "Search", "search", true, true, true, false, true, true, false);
        addFilter = new AddFilterOperation("addFilterOperation", "Add filter", "add filter", true, true, true, false, false, true, false);//TODO: create menu
        category = new CategoryOperation("categoryOperation", "Category", "category", true, true, true, true, true, true, false);
        results = new ResultsOperation("resultsOperation", "Results", "results", true, true, true, false, false, true, false);
        order = new OrderOperation("orderOperation", "Order", "order", true, true, true, true, false, true, false);
        details = new DetailsOperation("detailsOperation", "Details", "details", true, true, true, true, false, true, false);
        choose = new ChooseOperation("chooseOperation", "Choose", "choose", true, true, true, true, false, true, false);
        removeFilter = new RemoveFilterOperation("removeFilterOperation", "Remove filter", "remove filter", true, true, true, true, false, true, false);
        readTitle = new ReadTitleOperation("readTitle", "Read title", "read title", true, true, true, false, false, false, true);
        readDescription = new ReadDescriptionOperation("readDescription", "Read description", "read description", true, true, true, false, false, false, true);
        readDistributions = new ReadDistributionsOperation("readDistributions", "Read distributions", "read distributions", true, true, true, false, false, false, true);
        readDetails = new ReadDetailsOperation("readDetails", "Read details", "read details", true, true, true, false, false, false, true);
        readDataOperation = new ReadDataOperation("readData", "Read data", "read", true, true, true, true, false, false, true);
        increaseFontSizeOperation = new IncreaseFontSizeOperation("increaseFontSizeOperation", "Increase Font Size", "increase font size", true, true, true, false, true, true, true);
        decreaseFontSizeOperation = new DecreaseFontSizeOperation("decreaseFontSizeOperation", "Decrease Font Size", "decrease font size", true, true, true, false, true, true, true);
        faster = new FasterOperation("faster", "Read faster", "faster", true, true, true, false, true, true, true);
        slower = new SlowerOperation("slower", "Read slower", "slower", true, true, true, false, true, true, true);
        chooseDistribution = new ChooseDistributionOperation("chooseDistribution", "Choose distribution", "choose distribution", true, true, true, true, false, false, true);
        download = new DownloadOperation("download", "Download", "download", true, true, true, false, false, false, true);
        mainPageOperation = new GoMainPageOperation("mainPage", "Go to main page", "main page", true, true, true, false, false, true, true);

        goBackOperation = new GoBackOperation("goBack", "Go Back", "go back", true, true, true, false, false, true, true);
        breadCrumbOperation = new BreadcrumbOperation("breadcrumb", "Breadcrumb", "", true, true, true, false, true, true, true);
    } else {
        welcome = new WelcomeOperation("welcomeOperationES", "Bienvenida", "bienvenida", true, true, true, false, true, true, true);
        search = new SearchOperation("searchOperationES", "Buscar", "buscar", true, true, true, false, true, true, false);
        addFilter = new AddFilterOperation("addFilterOperationES", "Añadir filtro", "añadir filtro", true, true, true, false, false, true, false);//TODO: create menu
        category = new CategoryOperation("categoryOperationES", "Categoría", "categoría", true, true, true, true, true, true, false);
        results = new ResultsOperation("resultsOperationES", "Resultados", "resultados", true, true, true, false, false, true, false);
        order = new OrderOperation("orderOperationES", "Ordenar", "ordenar", true, true, true, true, false, true, false);
        details = new DetailsOperation("detailsOperationES", "Detalles", "detalles", true, true, true, true, false, true, false);
        choose = new ChooseOperation("chooseOperationES", "Elegir", "elegir", true, true, true, true, false, true, false);
        removeFilter = new RemoveFilterOperation("removeFilterOperationES", "Quitar filtro", "quitar filtro", true, true, true, true, false, true, false);
        readTitle = new ReadTitleOperation("readTitleES", "Leer título", "leer título", true, true, true, false, false, false, true);
        readDescription = new ReadDescriptionOperation("readDescriptionES", "Leer descripción", "leer descripción", true, true, true, false, false, false, true);
        readDistributions = new ReadDistributionsOperation("readDistributionsES", "Leer distribuciones", "leer distribuciones", true, true, true, false, false, false, true);
        readDetails = new ReadDetailsOperation("readDetailsES", "Leer detalles", "leer detalles", true, true, true, false, false, false, true);
        readDataOperation = new ReadDataOperation("readDataES", "Leer datos", "leer", true, true, true, true, false, false, true);
        increaseFontSizeOperation = new IncreaseFontSizeOperation("increaseFontSizeOperationES", "Aumentar Tamaño Letra", "aumentar tamaño letra", true, true, true, false, true, true, true);
        decreaseFontSizeOperation = new DecreaseFontSizeOperation("decreaseFontSizeOperationES", "Reducir Tamaño Letra", "reducir tamaño letra", true, true, true, false, true, true, true);
        faster = new FasterOperation("fasterES", "Leer más rápido", "más rápido", true, true, true, false, true, true, true);
        slower = new SlowerOperation("slowerES", "Leer más lento", "más despacio", true, true, true, false, true, true, true);
        chooseDistribution = new ChooseDistributionOperation("chooseDistributionES", "Elegir distribución", "elegir distribución", true, true, true, true, false, false, true);
        download = new DownloadOperation("downloadES", "Descargar", "descargar", true, true, true, false, false, false, true);
        mainPageOperation = new GoMainPageOperation("mainPageES", "Ir a la página principal", "página principal", true, true, true, false, false, true, true);
        goBackOperation = new GoBackOperation("goBackES", "Volver", "volver", true, true, true, false, false, true, true);
        breadCrumbOperation = new BreadcrumbOperation("breadcrumbES", "Panel navegación", "", true, true, true, false, true, true, true);
    }

    checkFocus();
    initWAFRA();
    textToAudio();
    audioToText();

    var wafra = new WAFRA();
    wafra.getAndSetStorage();
    wafra.createWebAugmentedMenu();
    wafra.createOperationsMenu();
    wafra.createCommandsMenu();

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

        if(myStorage.getItem("readerRate") !== null){
            try {
                readerRate = myStorage.getItem("readerRate");
            } catch (e) {
            }
        } else {
            myStorage.setItem("readerRate", readerRate);
        }
        for(var operationsIndex = 0; operationsIndex < operations.length; operationsIndex++){
            // Voice commands names
            if(myStorage.getItem(operations[operationsIndex].id) !== null){
                operations[operationsIndex].voiceCommand = myStorage.getItem(operations[operationsIndex].id);
            } else {
                myStorage.setItem(operations[operationsIndex].id, operations[operationsIndex].voiceCommand);
            }

            // Operations & commands active?
            if(myStorage.getItem(operations[operationsIndex].id + "Active") !== null){
                operations[operationsIndex].active = (myStorage.getItem(operations[operationsIndex].id + "Active") == 'true');
            } else {
                myStorage.setItem(operations[operationsIndex].id + "Active", operations[operationsIndex].active);
            }
        }
    }


    createWebAugmentedMenu(){
        createMenus();
    }

    createOperationsMenu(){
        createOperationsMenu();
    }

    createCommandsMenu(){
        createCommandsMenu();
    }

}

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
    active;
    editable;
    hasMenu;
    mainPage;
    resultsPage;
    datasetPage;*/

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

    initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage) {
        this.id = id;
        this.name = name;
        this.voiceCommand = voiceCommand;
        //this.section = section;
        this.activable = activable;
        this.active = active;
        this.editable = editable;
        this.hasMenu = hasMenu;
        this.mainPage = mainPage;
        this.resultsPage = resultsPage;
        this.datasetPage = datasetPage;
        operations.push(this);
    }
}

class WelcomeOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        say();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class SearchOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation(term) {
        if(typeof term !== 'undefined'){
            var parameters = term.currentTarget.params;
            search(parameters);
        } else {
            search("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class AddFilterOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation(filter) {
        if(typeof filter !== 'undefined'){
            var parameters = filter.currentTarget.params;
            addFilter(parameters);
        } else {
            addFilter("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class CategoryOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationCategory("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(category) {
        if(typeof category !== 'undefined'){
            var parameters = category.currentTarget.params;
            addCategory(parameters);
        } else {
            addCategory("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ResultsOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        results();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class OrderOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationOrder("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(orderValue) {
        if(typeof orderValue !== 'undefined'){
            var parameters = orderValue.currentTarget.params;
            orderResults(parameters);
        } else {
            orderResults("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class DetailsOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationDetailsAndChoose("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(position) {
        if(typeof position !== 'undefined'){
            var parameters = position.currentTarget.params;
            details(parameters);
        } else {
            details("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ChooseOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationDetailsAndChoose("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(position) {
        if(typeof position !== 'undefined'){
            var parameters = position.currentTarget.params;
            choose(parameters);
        } else {
            choose("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class RemoveFilterOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationRemoveFilter("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(filter) {
        if(typeof filter !== 'undefined'){
            var parameters = filter.currentTarget.params;
            removeFilter(parameters);
        } else {
            removeFilter("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadTitleOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        getTitleText();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadDescriptionOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        getDescriptionText();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadDistributionsOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        getDistributionsText();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadDetailsOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation(){

    }

    startOperation() {
        getDetailsText();
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class ReadDataOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
        createSubmenuForOperationRead("menu-" + this.id.replaceAll('ES',''), this);
    }

    openMenu() {
        closeOperationsMenu();
        closeMenu("menu-" + this.id.replaceAll('ES',''));
        showSubmenu("menu-" + this.id.replaceAll('ES',''));
    }

    startOperation(params) {
        if(typeof params !== 'undefined'){
            var parameters = params.currentTarget.params;
            readAloud(parameters);
        } else {
            readAloud("");
        }
    }

    stopOperation() {
        console.log("Stop operation");
    }
}

class IncreaseFontSizeOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
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
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
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

class FasterOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }
    configureOperation(){
    }
    startOperation() {
        readFaster();
    }
    stopOperation() {
        console.log("Stop operation");
    }
}

class SlowerOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }
    configureOperation(){
    }
    startOperation() {
        readSlower();
    }
    stopOperation() {
        console.log("Stop operation");
    }
}

class ChooseDistributionOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }
    configureOperation(){
    }
    startOperation(params) {
        if(typeof params !== 'undefined'){
            var parameters = params.currentTarget.params;
            chooseDistribution(parameters);
        } else {
            chooseDistribution("");
        }
    }
    stopOperation() {
        console.log("Stop operation");
    }
}

class DownloadOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }
    configureOperation(){
    }
    startOperation() {
        downloadDistribution();
    }
    stopOperation() {
        console.log("Stop operation");
    }
}

class GoMainPageOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }
    configureOperation() {
    }
    startOperation() {
        goToMainPage();
    }
    stopOperation() {
    }
}

// Go back
class GoBackOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
    }

    configureOperation() {
    }

    startOperation() {
        goBack();
    }

    stopOperation() {
    }
}

// BreadCrumb
class BreadcrumbOperation extends Operation {
    constructor(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage){
        super();
        this.initOperation(id, name, voiceCommand, activable, active, editable, hasMenu, mainPage, resultsPage, datasetPage);
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

    var divMenu = document.getElementById("menu-webaugmentation");
    if(divMenu != null){
        divMenu.innerHTML = "";;
    }else {
        divMenu = document.createElement("div");
        divMenu.id = "menu-webaugmentation";
        divMenu.style = "position: fixed; left: 2%; top: 12%; z-index: 100; line-height: 140%;";
    }
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
    aToggleListening.href = 'javascript:;';
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
    a5.href = 'javascript:;';
    a5.addEventListener("click", function(){
        toggleMenu();
        toggleCommandsMenu();
        closeOperationsMenu();
    }, false);
    if(!spanishDomain){
        a5.text = 'Voice commands';
    } else {
        a5.text = 'Comandos por voz';
    }
    divButtons.appendChild(a5);
    divButtons.appendChild(document.createElement('br'));

    var aOperations = document.createElement('a');
    aOperations.id = "operationsA";
    aOperations.href = 'javascript:;';
    aOperations.addEventListener("click", toggleOperationsMenu, false);
    if(!spanishDomain){
        aOperations.text = 'Accessibility Operations';
    } else {
        aOperations.text = 'Operaciones de Accesibilidad';
    }
    divButtons.appendChild(aOperations);

    var i = document.createElement('i');
    i.className = 'fa fa-close'
    i.style = "position: absolute; right: 10%; top: 40%; z-index: 100;"
    i.addEventListener("click", closeMenu, false);
    divButtons.appendChild(i);

    document.getElementById("div-webaugmentation").appendChild(divButtons);

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
        if((mainPage && operations[operationsIndex].mainPage) ||
           (resultsPage && operations[operationsIndex].resultsPage) ||
           (datasetPage && operations[operationsIndex].datasetPage)){
            var a = document.createElement('a');
            a.id = operations[operationsIndex].id.replaceAll('ES','');
            a.href = 'javascript:;';
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
                input.id = operations[operationsIndex].id.replaceAll('ES','') + "Input";
                input.value = operations[operationsIndex].id.replaceAll('ES','') + "Input";
                input.checked = operations[operationsIndex].active;
                input.style.setProperty("margin-left", "5px");
                if(operations[operationsIndex].active){
                    a.style.setProperty("pointer-events", "all");
                } else {
                    a.style.setProperty("pointer-events", "none");
                }

                input.addEventListener("change", function(){
                    for(var operationsI = 0; operationsI < operations.length; operationsI++){
                        if(operations[operationsI].id.replaceAll('ES','') === this.id.split("Input").join("")){
                            if(!this.checked){
                                operations[operationsI].active = false;
                                myStorage.setItem(operations[operationsI].id + "Active", operations[operationsI].active);
                                document.getElementById(operations[operationsI].id).style.setProperty("pointer-events", "none");
                            } else {
                                operations[operationsI].active = true;
                                myStorage.setItem(operations[operationsI].id + "Active", operations[operationsI].active);
                                document.getElementById(operations[operationsI].id).style.setProperty("pointer-events", "all");
                            }

                            /*if(this.id.split("Input").join("") === "readAloud"){
                                toggleReadAloud();
                            } else */if(this.id.split("Input").join("") === "breadcrumb"){
                                toggleBreadcrumb();
                            }
                        }
                    }
                }, false);
                divButtons.appendChild(input);
            }
            divButtons.appendChild(document.createElement('br'));
        }
    }
    document.getElementById("div-webaugmentation").appendChild(divButtons);

    /*  createReadMenu();
        createGoToMenu();*/
    //readWelcome();
    setTimeout(function() { try{document.getElementById("welcomeOperation").click();} catch(e){} }, 1000);


    //toggleReadAloud();
    toggleBreadcrumb();
}


function say() {
    //speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    readWelcome()
}

function readWelcome(){
    var readContent = "";
    if(!spanishDomain){
        readContent = "Welcome to " + document.title + "! The voice commands available are: ";
        for(var i = 0; i < operations.length; i++){
            if(mainPage && operations[i].mainPage){
                readContent += operations[i].voiceCommand + ", ";
            } else if(resultsPage && operations[i].resultsPage){
                readContent += operations[i].voiceCommand + ", ";
            } else if(datasetPage && operations[i].datasetPage){
                readContent += operations[i].voiceCommand + ", ";
            }
        }
        readContent += stopListeningCommand + ", " + changeCommand + ", " + activateCommand + ", " + deactivateCommand + ". ";
    } else {
        readContent = "¡Bienvenido a " + document.title + "! Los comandos de voz disponibles son: ";
        for(var j = 0; j < operations.length; j++){
            if(mainPage && operations[j].mainPage){
                readContent += operations[j].voiceCommand + ", ";
            } else if(resultsPage && operations[j].resultsPage){
                readContent += operations[j].voiceCommand + ", ";
            } else if(datasetPage && operations[j].datasetPage){
                readContent += operations[j].voiceCommand + ", ";
            }
        }
        readContent += stopListeningCommandES + ", " + changeCommandES + ", " + activateCommandES + ", " + deactivateCommandES + ". ";
    }

    Read(readContent);
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
        a1.href = 'javascript:;';
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
                        myStorage.setItem(operations[index].id, result.toLowerCase());
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


function createSubmenuForOperationRead(menuId, operationForSubmenu){

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
        var a1 = document.createElement('a');
        if(!spanishDomain){
            a1.text = "columns";
            a1.params = "columns";
        } else {
            a1.text = "columnas";
            a1.params = "columnas";
        }
        a1.href = 'javascript:;';
        a1.addEventListener("click", operationForSubmenu.startOperation, false);
        a1.operation = operationForSubmenu;
        divSubMenu.appendChild(a1);
        divSubMenu.appendChild(document.createElement('br'));

        var a2 = document.createElement('a');
        if(!spanishDomain){
            a2.text = "all";
            a2.params = "all";
        } else {
            a2.text = "todo";
            a2.params = "todo";
        }
        a2.href = 'javascript:;';
        a2.addEventListener("click", operationForSubmenu.startOperation, false);
        a2.operation = operationForSubmenu;
        divSubMenu.appendChild(a2);
        divSubMenu.appendChild(document.createElement('br'));

        var a3 = document.createElement('a');
        if(!spanishDomain){
            a3.text = "rows";
            a3.params = "rows";
        } else {
            a3.text = "filas";
            a3.params = "filas";
        }
        a3.href = 'javascript:;';
        a3.addEventListener("click", operationForSubmenu.startOperation, false);
        a3.operation = operationForSubmenu;
        divSubMenu.appendChild(a3);
        divSubMenu.appendChild(document.createElement('br'));
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function createSubmenuForOperationCategory(menuId, operationForSubmenu){

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
        setTimeout(function(){
            if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
               && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
                for(var j = 0; j < apiResultPortalMetadata.facets.length; j++){
                    if(apiResultPortalMetadata.facets[j].id == "categories"){
                        for(var k = 0; k < apiResultPortalMetadata.facets[j].items.length; k++){
                            //check for language tag
                            var a1 = document.createElement('a');
                            if(apiResultPortalMetadata.facets[j].items[k].title.en && !spanishDomain){
                                a1.text = apiResultPortalMetadata.facets[j].items[k].title.en;
                                a1.params = apiResultPortalMetadata.facets[j].items[k].title.en;
                            } else if(apiResultPortalMetadata.facets[j].items[k].title.es && spanishDomain){
                                a1.text = apiResultPortalMetadata.facets[j].items[k].title.es;
                                a1.params = apiResultPortalMetadata.facets[j].items[k].title.es;
                            } else {
                                a1.text = apiResultPortalMetadata.facets[j].items[k].title;
                                a1.params = apiResultPortalMetadata.facets[j].items[k].title;
                            }
                            a1.href = 'javascript:;';
                            a1.addEventListener("click", operationForSubmenu.startOperation, false);
                            a1.operation = operationForSubmenu;
                            divSubMenu.appendChild(a1);
                            divSubMenu.appendChild(document.createElement('br'));
                        }
                    }
                }
            }
        }, 3000);
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function createSubmenuForOperationDetailsAndChoose(menuId, operationForSubmenu){

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
        for(var j = 1; j <= 10; j++){
            var a1 = document.createElement('a');
            a1.text = "Dataset " + j;
            a1.params = j;
            a1.href = 'javascript:;';
            a1.addEventListener("click", operationForSubmenu.startOperation, false);
            a1.operation = operationForSubmenu;
            divSubMenu.appendChild(a1);
            divSubMenu.appendChild(document.createElement('br'));
        }
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function createSubmenuForOperationOrder(menuId, operationForSubmenu){

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
        var a1 = document.createElement('a');
        if(!spanishDomain){
            a1.text = "Relevance";
        } else {
            a1.text = "Relevancia";
        }
        a1.params = "relevance";
        a1.href = 'javascript:;';
        a1.addEventListener("click", operationForSubmenu.startOperation, false);
        a1.operation = operationForSubmenu;
        divSubMenu.appendChild(a1);
        divSubMenu.appendChild(document.createElement('br'));
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}



function createSubmenuForOperationRemoveFilter(menuId, operationForSubmenu){

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
        var params = window.location.search;
        var urlParams = new URLSearchParams(params);
        // read aloud available filters
        var querySearch = urlParams.get('query');
        if(querySearch != null){
            var a1 = document.createElement('a');
            if(!spanishDomain){
                a1.text = "Search";
            } else {
                a1.text = "Búsqueda";
            }
            a1.params = "search";
            a1.href = 'javascript:;';
            a1.addEventListener("click", operationForSubmenu.startOperation, false);
            a1.operation = operationForSubmenu;
            divSubMenu.appendChild(a1);
            divSubMenu.appendChild(document.createElement('br'));
        }

        var sort = urlParams.get('sort');
        if(sort != null){
            var a2 = document.createElement('a');
            if(!spanishDomain){
                a2.text = "Sort";
            } else {
                a2.text = "Orden";
            }
            a2.params = "sort";
            a2.href = 'javascript:;';
            a2.addEventListener("click", operationForSubmenu.startOperation, false);
            a2.operation = operationForSubmenu;
            divSubMenu.appendChild(a2);
            divSubMenu.appendChild(document.createElement('br'));
        }

        setTimeout(function(){
            if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
               && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
                for(var j = 0; j < apiResultPortalMetadata.facets.length; j++){
                    if(urlParams.getAll(apiResultPortalMetadata.facets[j].id).length > 0){
                        var aj = document.createElement('a');
                        aj.text = apiResultPortalMetadata.facets[j].id;
                        aj.params = apiResultPortalMetadata.facets[j].id;
                        aj.href = 'javascript:;';
                        aj.addEventListener("click", operationForSubmenu.startOperation, false);
                        aj.operation = operationForSubmenu;
                        divSubMenu.appendChild(aj);
                        divSubMenu.appendChild(document.createElement('br'));
                    }
                }
            }
        }, 3000);
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
}

function createSubmenuForOperationGoTo(menuId, operationForSubmenu){

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
        var a1 = document.createElement('a');
        if(!spanishDomain){
            a1.text = "distributions";
            a1.params = "distributions";
        } else {
            a1.text = "distribuciones";
            a1.params = "distribuciones";
        }
        a1.href = 'javascript:;';
        a1.addEventListener("click", operationForSubmenu.startOperation, false);
        a1.operation = operationForSubmenu;
        divSubMenu.appendChild(a1);
        divSubMenu.appendChild(document.createElement('br'));
    } catch(e){}

    document.getElementById("div-webaugmentation").appendChild(divSubMenu);
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

function textToAudio(){
    createPlayButtons();


    var cancelfooter = document.getElementById("cancel");
    if(cancelfooter != null){
        cancelfooter.innerHTML = "";;
    }else {
        cancelfooter = document.createElement("div");
        cancelfooter.id = "cancel";
    }
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

/*function toggleReadAloud(){
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
    myStorage.setItem("readAloudActive", readCommandActive);
}*/

function resumeInfinity() {
    reading = true;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    timeoutResumeInfinity = setTimeout(resumeInfinity, 10000);
    $('#cancel').css('visibility', 'visible');
}

function Read(message){
    console.log("Read function: " + message)
    window.speechSynthesis.cancel();
    clearTimeout(timeoutResumeInfinity);

    if(!document[hidden]){

        var reader = new SpeechSynthesisUtterance(message);
        reader.rate = parseFloat(readerRate);
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
    readerRate = parseFloat(readerRate);
    if(readerRate <= 9){
        readerRate = readerRate + 0.5;
        myStorage.setItem("readerRate", readerRate);

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
        myStorage.setItem("readerRate", readerRate);

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

    setTimeout(function(){
        reading = false;

        if(recognitionActive){
            recognition.start();
        }
    }, 1000);
}

// Shortcuts
function KeyPress(e) {
    var evtobj = window.event? event : e
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
        if(!reading && navigationShortcutsActive){
            navigationShortcutsActive = false;
        }

        myStorage.setItem("recognitionActive", recognitionActive);
    }

    if(navigationShortcutsActive){
        if(evtobj.ctrlKey && evtobj.keyCode == 37){
            //Left
            columnPos -= 1;
            readCell();
        } else if(evtobj.ctrlKey && evtobj.keyCode == 38){
            //Up
            rowPos -= 1;
            readCell();
        } else if(evtobj.ctrlKey && evtobj.keyCode == 39){
            //Right
            columnPos += 1;
            readCell();
        } else if(evtobj.ctrlKey && evtobj.keyCode == 40){
            //Down
            rowPos += 1;
            readCell();
        }
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
                if((speechToText.includes(activateCommand) && !speechToText.includes(deactivateCommand)) ||
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
                                    var cleanSpeechText = speechToText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase();
                                    var cleanCommand = operations[i].voiceCommand.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase();
                                    var parametersCommand = cleanSpeechText.replaceAll(cleanCommand, "").trim();
                                    if(parametersCommand !== "" && parametersCommand.length > 0 &&
                                       ((operations[i].mainPage && mainPage) || (operations[i].resultsPage && resultsPage) || (operations[i].datasetPage && datasetPage))){
                                        var params = {};
                                        var current = {};
                                        params.currentTarget = current;
                                        params.currentTarget.params = parametersCommand;
                                        params.currentTarget.operation = operations[i];
                                        operations[i].startOperation(params);
                                        return;
                                    } else if ((operations[i].mainPage && mainPage) || (operations[i].resultsPage && resultsPage) || (operations[i].datasetPage && datasetPage)){
                                        operations[i].startOperation();
                                        return;
                                    } else {
                                        if(!spanishDomain){
                                            Read("Operation " + operations[i].voiceCommand + " is not available in this page, please try in other pages of the portal.");
                                        } else {
                                            Read("Operación " + operations[i].voiceCommand + " no está disponible en esta página, por favor prueba en otras páginas del portal.");
                                        }
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
                            Read(recognitionFailedText + " You can use: " + welcomeCommand + " to know which operations are available and which sections can be read aloud.");
                        } else {
                            Read(recognitionFailedTextES + " Puedes usar: " + welcomeCommandES + " para saber que operaciones están disponibles y qué secciones se pueden leer en voz alta.");
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
                            myStorage.setItem(operationToChange.id, speechToText.toLowerCase());
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
        commandsGrammar = [ 'increase', 'magnify', 'read', 'play', 'font', 'size', 'decrease', 'reduce', 'stop', 'listening', 'faster', 'slower' ];
        commandsAux = [];
        for(var i = 0; i < operations.length; i++){
            commandsAux.push(operations[i].voiceCommand);
        }

        for(var i2 = 0; i2 < readParams.length; i2++){
            commandsAux.push(readParams[i2]);
            commandsAux.push("read " + readParams[i2]);
        }
    } else {
        commandsGrammar = [ 'aumentar', 'incrementar', 'leer', 'play', 'letra', 'tamaño', 'decrementar', 'reducir', 'detener', 'activar', 'desactivar', 'más', 'rápido', 'despacio' ];
        commandsAux = [];
        for(var j = 0; j < operations.length; j++){
            commandsAux.push(operations[j].voiceCommand);
        }

        for(var j2 = 0; j2 < readParams.length; j2++){
            commandsAux.push(readParams[j2]);
            commandsAux.push("leer " + readParams[j2]);
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


// Bread Crumb (History)
function breadcrumb(){
    var lastVisitedSitesURL = []
    var lastVisitedSitesTitle = []
    var breadcrumb = document.createElement('ol');
    breadcrumb.id = "BreadCrumb";
    breadcrumb.setAttribute('vocab',"https://schema.org/");
    breadcrumb.setAttribute('typeof',"BreadcrumbList");

    var maxBreadCrumb = 4;
    if(myStorage.getItem("lastVisitedSitesTitle0") !== document.title){
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
        //'height': '50px',
        'left': '15%',
        'top': '15%',
        //'width': '100%',
        'padding': '10px',
        'background-color': '#FFFFFF',
        'vertical-align': 'bottom',
        'visibility': 'visible',
        'border': 'solid black',
        'z-index': '99'
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


function toggleBreadcrumb(){
    try{
        var breadcrumbCommandActive;
        if(document.getElementById("breadcrumbInput").checked){
            breadcrumbCommandActive = true;
            document.getElementById("BreadCrumb").style.setProperty("display", "block");
        } else {
            breadcrumbCommandActive = false;
            document.getElementById("BreadCrumb").style.setProperty("display", "none");
        }
        myStorage.setItem("breadcrumbActive", breadcrumbCommandActive);
    } catch(e){
    }
}

function toggleMenu(id){
    var x;
    if(id !== null && typeof id !== 'undefined' && typeof id == "string"){
        x = document.getElementById(id);
    } else {
        x = document.getElementById("foldingMenu");
        if(x !== null){
            closeCommandsMenu();
            closeOperationsMenu();
        }
    }
    if(x !== null){
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    }
}
function closeMenu(id){
    var x;
    if(id !== null && typeof id !== 'undefined' && typeof id == "string"){
        x = document.getElementById(id);
    } else {
        x = document.getElementById("foldingMenu");
    }
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

/*function parseCSVLine(text) {
  return text.match( /\s*(\".*?\"|'.*?'|[^,]+)\s*(,|$)/g ).map( function (text) {
    let m;
    if (m = text.match(/^\s*\"(.*?)\"\s*,?$/)) return m[1]; // Double Quoted Text
    if (m = text.match(/^\s*'(.*?)'\s*,?$/)) return m[1]; // Single Quoted Text
    if (m = text.match(/^\s*(true|false)\s*,?$/)) return m[1] === "true"; // Boolean
    if (m = text.match(/^\s*((?:\+|\-)?\d+)\s*,?$/)) return parseInt(m[1]); // Integer Number
    if (m = text.match(/^\s*((?:\+|\-)?\d*\.\d*)\s*,?$/)) return parseFloat(m[1]); // Floating Number
    if (m = text.match(/^\s*(.*?)\s*,?$/)) return m[1]; // Unquoted Text
    return text;
  } );
}*/

function queryAPIdataset(apiURL){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("api queried: " + apiURL);
                //console.log(xhr.responseText);
                apiResultDataset = JSON.parse(xhr.responseText).result;
                console.log(apiResultDataset);

                if(distributionChoosenURL === ""){
                    // choose distribution csv by order (last)
                    var csvDistribution, csvDistributionAux;
                    for(var i = 0; i < apiResultDataset.distributions.length; i++){
                        if(apiResultDataset.distributions[i].format != null && apiResultDataset.distributions[i].format.id === "CSV"){
                            csvDistribution = apiResultDataset.distributions[i];
                            distributionChoosenURL = csvDistribution.access_url;
                            if(!spanishDomain){
                                distributionChoosenTitle = csvDistribution.title.en;
                            } else {
                                distributionChoosenTitle = csvDistribution.title.es;
                            }
                        }
                    }
                    downloadDistributionToInteract();
                }
            }
        }
    }
    xhr.send();
}

function queryAPIportalMetadata(apiURL){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", apiURL, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("api queried: " + apiURL);
                //console.log(xhr.responseText);
                apiResultPortalMetadata = JSON.parse(xhr.responseText).result;
                console.log(apiResultPortalMetadata);
            }
        }
    }
    xhr.send(JSON.stringify({q: "string", filter: "dataset", limit: 0, searchParams: {minDate: "2021-01-04T13:42:27Z", maxDate: "2021-01-04T13:42:27Z"}}));
}

function queryAPIportalMetadataWithResults(apiURL){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", apiURL, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("api queried: " + apiURL);
                //console.log(xhr.responseText);
                apiResultPortalMetadata = JSON.parse(xhr.responseText).result;

                var params = window.location.search;
                var urlParams = new URLSearchParams(params);
                var querySearch = urlParams.get('query');
                if(querySearch == null){
                    querySearch = "";
                }

                var sort = urlParams.get('sort');
                if(sort == null){
                    sort = "relevance+desc";
                }

                var facetsObj = {};
                if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
                   && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
                    for(var i = 0; i < apiResultPortalMetadata.facets.length; i++){
                        if(urlParams.getAll(apiResultPortalMetadata.facets[i].id).length > 0){
                            facetsObj[apiResultPortalMetadata.facets[i].id] = urlParams.getAll(apiResultPortalMetadata.facets[i].id);
                        }
                    }
                }
                console.log(facetsObj);
                console.log(JSON.stringify(facetsObj));

                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", apiURL, true);
                xhr2.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr2.onreadystatechange = function() {
                    if (xhr2.readyState === 4) {
                        if (xhr2.status === 200) {
                            apiResultPortalResults = JSON.parse(xhr2.responseText).result;
                            console.log(apiResultPortalResults);
                        }
                    }
                }
                xhr2.send(JSON.stringify({q: querySearch, filter: "dataset", limit: 10, sort: [sort], facetOperator: "AND", facets: facetsObj}));
            }
        }
    }
    xhr.send(JSON.stringify({q: "string", filter: "dataset", limit: 10, searchParams: {minDate: "2021-01-04T13:42:27Z", maxDate: "2021-01-04T13:42:27Z"}}));
}

function search(term){

    if(term == null || typeof term == 'undefined' || term == "[object MouseEvent]"){
        term = "";
    }

    if(!spanishDomain){
        Read("Performing the search and redirecting to the results page.");
    }
    else{
        Read("Realizando la búsqueda y redirigiendo a la página de resultados.");
    }
    setTimeout(function(){
        if(!spanishDomain){
            window.location.href = '/data/datasets?query=' + term + '&locale=en';
        } else {
            window.location.href = '/data/datasets?query=' + term + '&locale=es';
        }
    }, 3000);
}

function addFilter(filter){

    var readContent = "";

    if(filter == null || typeof filter == 'undefined' || filter == "[object MouseEvent]"){
        filter = "";
    }

    if(filter == ""){
        // read aloud available filters
        if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
           && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
            for(var i = 0; i < apiResultPortalMetadata.facets.length; i++){
                readContent += apiResultPortalMetadata.facets[i].id + "; ";
            }
        }

        if(readContent == ""){
            if(!spanishDomain){
                Read("No filters are available now, please try again later or in other page of the portal.");
            }
            else{
                Read("Ahora no hay filtros disponibles, prueba más tarde o en otra página del portal.");
            }
        } else {
            if(!spanishDomain){
                Read("The available filters are: " + readContent + ". You can use the same voice command indicating the filter and its value.");
            }
            else{
                Read("Los filtros disponibles son: " + readContent + ". Puedes utilizar el mismo comando de voz indicando el filtro que deseas y el valor a filtrar.");
            }
        }

    } else {
        //read available values for specific filter
        if((filter.match(" ") || []).length == 0){
            // No value is provided
            for(var j = 0; j < apiResultPortalMetadata.facets.length; j++){
                if(apiResultPortalMetadata.facets[j].id == filter){
                    for(var k = 0; k < apiResultPortalMetadata.facets[j].items.length; k++){
                        //check for language tag
                        if(apiResultPortalMetadata.facets[j].items[k].title.en && !spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.en + "; ";
                        } else if(apiResultPortalMetadata.facets[j].items[k].title.es && spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.es + "; ";
                        } else {
                            readContent += apiResultPortalMetadata.facets[j].items[k].title + "; ";
                        }
                    }
                }
            }

            if(readContent == ""){
                if(!spanishDomain){
                    Read("The filter specified does not exist, please try again.");
                }
                else{
                    Read("El filtro especificado no existe, por favor inténtalo de nuevo.");
                }
            } else {
                if(!spanishDomain){
                    Read("The available values for the filter " + filter + " are: " + readContent + ". You can use the same voice command indicating the filter and its value.");
                }
                else{
                    Read("Los valores para el filtro " + filter + " son: " + readContent + ". Puedes utilizar el mismo comando de voz indicando el filtro que deseas y el valor a filtrar.");
                }
            }
        } else {
            //apply specific filter if existing
            //{ "q": "string",  "filter": "dataset",  "limit": 10,  "facets": { "format": [ "CSV" ] } }

            var filterId = filter.split(" ")[0];
            var filterValue = filter.substring(filter.indexOf(" ") + 1);
            var filterValueId = "";
            var filterExists = false, filterValueExists = false;
            // check if filter exist, if value is possible and get value id to apply filter
            for(var a = 0; a < apiResultPortalMetadata.facets.length && !filterExists; a++){
                if(apiResultPortalMetadata.facets[a].id == filterId){
                    filterExists = true;
                    for(var b = 0; b < apiResultPortalMetadata.facets[a].items.length && !filterValueExists; b++){
                        //check for language tag
                        var filterValueNormalized = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                        var titleNormalized;
                        if(apiResultPortalMetadata.facets[a].items[b].title.en && !spanishDomain){
                            titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.en.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                        } else if(apiResultPortalMetadata.facets[a].items[b].title.es && spanishDomain){
                            titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.es.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                        } else {
                            titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                        }
                        if(titleNormalized == filterValueNormalized){
                            filterValueExists = true;
                            filterValueId = apiResultPortalMetadata.facets[a].items[b].id;
                        }
                    }
                }
            }

            if(filterExists && filterValueExists){
                if(!spanishDomain){
                    Read("Applying the filter and redirecting to the updated results page.");
                }
                else{
                    Read("Aplicando los filtros y redirigiendo a la página con la lista actualizada.");
                }
                setTimeout(function(){
                    window.location.href = window.location.href + "&" + filterId + "=" + filterValueId;
                }, 3000);
            } else {
                if(filterExists){
                    if(!spanishDomain){
                        Read("The filter value does not exist, please try other value.");
                    }
                    else{
                        Read("El valor a filtrar no es válido, por favor pruebe otro valor.");
                    }
                } else {
                    if(!spanishDomain){
                        Read("The filter does not exist, please try other filter.");
                    }
                    else{
                        Read("El filtro no existe, por favor pruebe otro filtro.");
                    }
                }
            }
        }

    }

}

function addCategory(category){

    var readContent = "";

    if(category == null || typeof category == 'undefined' || category == "[object MouseEvent]"){
        category = "";
    }

    if(category == ""){
        // read aloud available categories
        if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
           && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
            for(var j = 0; j < apiResultPortalMetadata.facets.length; j++){
                if(apiResultPortalMetadata.facets[j].id == "categories"){
                    for(var k = 0; k < apiResultPortalMetadata.facets[j].items.length; k++){
                        //check for language tag
                        if(apiResultPortalMetadata.facets[j].items[k].title.en && !spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.en + "; ";
                        } else if(apiResultPortalMetadata.facets[j].items[k].title.es && spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.es + "; ";
                        } else {
                            readContent += apiResultPortalMetadata.facets[j].items[k].title + "; ";
                        }
                    }
                }
            }
        }

        if(readContent == ""){
            if(!spanishDomain){
                Read("No categories are available now, please try again later or in other page of the portal.");
            }
            else{
                Read("Ahora no hay categorías disponibles, prueba más tarde o en otra página del portal.");
            }
        } else {
            if(!spanishDomain){
                Read("The available categories are: " + readContent + ". You can use the same voice command indicating the category name.");
            }
            else{
                Read("Las categorías disponibles son: " + readContent + ". Puedes utilizar el mismo comando de voz indicando el nombre de la categoría.");
            }
        }

    } else {
        //apply specific category if existing
        var categoryValue = category;
        var categoryValueId = "";
        var categoryValueExists = false, filterExists = false;
        // check if filter exist, if value is possible and get value id to apply filter
        for(var a = 0; a < apiResultPortalMetadata.facets.length && !filterExists; a++){
            if(apiResultPortalMetadata.facets[a].id == "categories"){
                filterExists = true;
                for(var b = 0; b < apiResultPortalMetadata.facets[a].items.length && !categoryValueExists; b++){
                    //check for language tag
                    var filterValueNormalized = categoryValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                    var titleNormalized;
                    if(apiResultPortalMetadata.facets[a].items[b].title.en && !spanishDomain){
                        titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.en.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                    } else if(apiResultPortalMetadata.facets[a].items[b].title.es && spanishDomain){
                        titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.es.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                    } else {
                        titleNormalized = apiResultPortalMetadata.facets[a].items[b].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').trim().toLowerCase().replace(",","");
                    }
                    if(titleNormalized == filterValueNormalized){
                        categoryValueExists = true;
                        categoryValueId = apiResultPortalMetadata.facets[a].items[b].id;
                    }
                }
            }
        }

        if(filterExists && categoryValueExists){
            if(!spanishDomain){
                Read("Applying the category and redirecting to the results page.");
            }
            else{
                Read("Aplicando la categoría y redirigiendo a la página de resultados.");
            }
            setTimeout(function(){
                if(mainPage){
                    window.location.href = "/data/datasets?categories=" + categoryValueId;
                }
                else {
                    window.location.href = window.location.href + "&categories=" + categoryValueId;
                }
            }, 3000);
        } else {
            if(filterExists){
                if(!spanishDomain){
                    Read("The filter value does not exist, please try other value.");
                }
                else{
                    Read("El valor a filtrar no es válido, por favor pruebe otro valor.");
                }
            } else {
                if(!spanishDomain){
                    Read("The filter does not exist, please try other filter.");
                }
                else{
                    Read("El filtro no existe, por favor pruebe otro filtro.");
                }
            }
        }

    }
}

function results(){
    // read results from query with results
    //console.log(JSON.stringify(apiResultPortalResults));
    var readContent = "";

    if(apiResultPortalResults !== null && apiResultPortalResults !== ""
       && apiResultPortalResults.results !== null && apiResultPortalResults.results !== ""){
        var indexAux = 1;
        for(var i = 0; i < apiResultPortalResults.results.length; i++){
            // read title in language (if existing) and description (if possible).
            var titleAux = "";
            if(!spanishDomain){
                titleAux = apiResultPortalResults.results[i].title.en;
            } else {
                titleAux = apiResultPortalResults.results[i].title.es;
            }

            if(titleAux == "" || typeof titleAux == 'undefined'){
                if(Object.keys(apiResultPortalResults.results[i].title).length > 0){
                    titleAux = apiResultPortalResults.results[i].title[Object.keys(apiResultPortalResults.results[i].title)[0]];
                } else {
                    titleAux = apiResultPortalResults.results[i].title;
                }
            }

            if(titleAux != "" && typeof titleAux != 'undefined'){
                readContent += indexAux + ": " + titleAux + ". ";
                indexAux++;
            }
        }
    }

    if(readContent == ""){
        if(!spanishDomain){
            Read("No results found, please try again with other filters.");
        }
        else{
            Read("No se han encontrado resultados, por favor pruebe de nuevo con otros filtros.");
        }
    } else {
        if(!spanishDomain){
            Read("The results are: " + readContent + ".");
        }
        else{
            Read("Los resultados son: " + readContent + ".");
        }
    }
}

function orderResults(orderValue){
    // order results

    var readContent = "";

    if(orderValue == null || typeof orderValue == 'undefined' || orderValue == "[object MouseEvent]"){
        orderValue = "";
    }

    if(orderValue == ""){
        // read available ordering values
        /*if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
           && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
            for(var j = 0; j < apiResultPortalMetadata.facets.length; j++){
                if(apiResultPortalMetadata.facets[j].id == "sort"){
                    for(var k = 0; k < apiResultPortalMetadata.facets[j].items.length; k++){
                        //check for language tag
                        if(apiResultPortalMetadata.facets[j].items[k].title.en && !spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.en + "; ";
                        } else if(apiResultPortalMetadata.facets[j].items[k].title.es && spanishDomain){
                            readContent += apiResultPortalMetadata.facets[j].items[k].title.es + "; ";
                        } else {
                            readContent += apiResultPortalMetadata.facets[j].items[k].title + "; ";
                        }
                    }
                }
            }
        }*/
        //not provided by dcat standard
        readContent = "relevance";

        if(readContent == ""){
            if(!spanishDomain){
                Read("Ordering is not available now, please try again later or in other page of the portal.");
            }
            else{
                Read("No se puede ordenar ahora, prueba más tarde o en otra página del portal.");
            }
        } else {
            if(!spanishDomain){
                Read("The available ordering options are: " + readContent + ". You can use the same voice command indicating the ordering value.");
            }
            else{
                Read("Las opciones de ordenación disponibles son: " + readContent + ". Puedes utilizar el mismo comando de voz indicando el valor de ordenación.");
            }
        }
    } else {
        // check and apply order
        if(!spanishDomain){
            Read("Applying the order and redirecting to the updated results page.");
        }
        else{
            Read("Aplicando la ordenación de resultados y redirigiendo a la página con la lista actualizada.");
        }
        setTimeout(function(){
            window.location.href = window.location.href + "&sort=" + orderValue + "%2Bdesc";
        }, 3000);
    }
}

function details(positionText){

    var readContent = "";

    if(positionText == null || typeof positionText == 'undefined' || positionText == "[object MouseEvent]"){
        positionText = "";
    }

    if(positionText == ""){
        // read instructions
        if(!spanishDomain){
            Read("Use the same command indicating the position of the dataset to read its details. In order to know the position, you can use the Results command.");
        }
        else{
            Read("Usa el mismo comando indicando la posición del conjunto de datos para leer sus detalles. Para saber la posición, puedes usar el comando Resultados.");
        }
    } else {
        // read details of position dataset
        var positionAux = text2num(positionText);
        var position;
        if(parseInt(positionAux) > 0){
            position = parseInt(positionAux) - 1;
        } else {
            position = 0;
        }
        if(apiResultPortalResults !== null && apiResultPortalResults !== ""
           && apiResultPortalResults.results !== null && apiResultPortalResults.results !== ""){
            if(apiResultPortalResults.results.length > position){
                // read and description title in language (if existing) and description (if possible).
                var titleAux = "", descriptionAux = "", publisher = "", country = "";

                if(!spanishDomain){
                    titleAux = apiResultPortalResults.results[position].title.en;
                } else {
                    titleAux = apiResultPortalResults.results[position].title.es;
                }

                if(titleAux == "" || typeof titleAux == 'undefined'){
                    if(Object.keys(apiResultPortalResults.results[position].title).length > 0){
                        titleAux = apiResultPortalResults.results[position].title[Object.keys(apiResultPortalResults.results[position].title)[0]];
                    } else {
                        titleAux = apiResultPortalResults.results[position].title;
                    }
                }

                if(!spanishDomain){
                    descriptionAux = apiResultPortalResults.results[position].description.en;
                } else {
                    descriptionAux = apiResultPortalResults.results[position].description.es;
                }

                if(descriptionAux == "" || typeof descriptionAux == 'undefined'){
                    if(Object.keys(apiResultPortalResults.results[position].description).length > 0){
                        descriptionAux = apiResultPortalResults.results[position].description[Object.keys(apiResultPortalResults.results[position].description)[0]];
                    } else {
                        descriptionAux = apiResultPortalResults.results[position].description;
                    }
                }

                country = apiResultPortalResults.results[position].country.title;
                publisher = apiResultPortalResults.results[position].publisher.name;

                if(titleAux != "" && typeof titleAux != 'undefined'){
                    readContent += titleAux;
                    if(descriptionAux != "" && typeof descriptionAux != 'undefined'){
                        readContent += ", " + descriptionAux;
                    }
                    if(country != "" && typeof country != 'undefined' && publisher != "" && typeof publisher != 'undefined'){
                        if(!spanishDomain){
                            readContent += ", published by " + publisher + " in " + country;
                        }
                        else{
                            readContent += ", publicado por " + publisher + " en " + country;
                        }
                    }
                }
            }
        }

        if(readContent == ""){
            if(!spanishDomain){
                Read("No dataset found, please try again with other position.");
            }
            else{
                Read("No se ha encontrado el conjunto de datos, por favor pruebe de nuevo con otra posición.");
            }
        } else {
            if(!spanishDomain){
                Read(readContent + ".");
            }
            else{
                Read(readContent + ".");
            }
        }
    }
}

function choose(positionText){

    var readContent = "";

    if(positionText == null || typeof positionText == 'undefined' || positionText == "[object MouseEvent]"){
        positionText = "";
    }

    if(positionText == ""){
        // read instructions
        if(!spanishDomain){
            Read("Use the same command indicating the position of the dataset to access its page. In order to know the position, you can use the Results command.");
        }
        else{
            Read("Usa el mismo comando indicando la posición del conjunto de datos para acceder a su página. Para saber la posición, puedes usar el comando Resultados.");
        }
    } else {
        // access dataset
        var positionAux = text2num(positionText);
        var position;
        if(parseInt(positionAux) > 0){
            position = parseInt(positionAux) - 1;
        } else {
            position = 0;
        }
        var datasetFound = false;
        if(apiResultPortalResults !== null && apiResultPortalResults !== ""
           && apiResultPortalResults.results !== null && apiResultPortalResults.results !== ""){
            if(apiResultPortalResults.results.length > parseInt(position)){
                datasetFound = true;
                if(!spanishDomain){
                    Read("Accessing the dataset and redirecting to its page.");
                }
                else{
                    Read("Accediendo al conjunto de datos y redirigiendo su página.");
                }
                setTimeout(function(){
                    var href = '';
                    if(!spanishDomain){
                        href = '/data/datasets/' + apiResultPortalResults.results[position].id + '?locale=en';
                    } else {
                        href = '/data/datasets/' + apiResultPortalResults.results[position].id + '?locale=es';
                    }
                    window.location.href = href;
                }, 3000);
            }
        }

        if(!datasetFound){
            if(!spanishDomain){
                Read("No dataset found, please try again with other position.");
            }
            else{
                Read("No se ha encontrado el conjunto de datos, por favor pruebe de nuevo con otra posición.");
            }
        }
    }
}

function removeFilter(filter){

    var readContent = "";

    if(filter == null || typeof filter == 'undefined' || filter == "[object MouseEvent]"){
        filter = "";
    }

    var params = window.location.search;
    var urlParams = new URLSearchParams(params);
    if(filter == ""){
        // read aloud available filters
        var querySearch = urlParams.get('query');
        if(querySearch != null){
            readContent += "search, ";
        }

        var sort = urlParams.get('sort');
        if(sort != null){
            readContent = "sort, ";
        }

        if(apiResultPortalMetadata !== null && apiResultPortalMetadata !== ""
           && apiResultPortalMetadata.facets !== null && apiResultPortalMetadata.facets !== ""){
            for(var i = 0; i < apiResultPortalMetadata.facets.length; i++){
                if(urlParams.getAll(apiResultPortalMetadata.facets[i].id).length > 0){
                    readContent += apiResultPortalMetadata.facets[i].id + ", ";
                }
            }
        }

        if(readContent == ""){
            if(!spanishDomain){
                Read("No filters are available now, please try again later or in other page of the portal.");
            }
            else{
                Read("Ahora no hay filtros disponibles, prueba más tarde o en otra página del portal.");
            }
        } else {
            if(!spanishDomain){
                Read("The applied filters that can be removed are: " + readContent + ". You can use the same voice command indicating the filter and its value.");
            }
            else{
                Read("Los filtros aplicados que se pueden quitar son: " + readContent + ". Puedes utilizar el mismo comando de voz indicando el filtro que deseas y su valor.");
            }
        }

    } else {
        //remove specific filter if existing
        var filterInUrl = urlParams.get(filter);
        var filterExists = false;
        if(filterInUrl != null){
            filterExists = true;
        }

        if(filterExists){
            urlParams.delete(filter);
            if(!spanishDomain){
                Read("Removing the filter and redirecting to the updated results page.");
            }
            else{
                Read("Quitando el filtro y redirigiendo a la página con la lista actualizada.");
            }
            setTimeout(function(){
                //window.location.href = window.location.href + urlParams.toString();
                window.location.search = urlParams.toString();
            }, 3000);
        } else {
            if(filterExists){
                if(!spanishDomain){
                    Read("The filter value does not exist, please try other value.");
                }
                else{
                    Read("El valor a filtrar no es válido, por favor pruebe otro valor.");
                }
            } else {
                if(!spanishDomain){
                    Read("The filter does not exist, please try other filter.");
                }
                else{
                    Read("El filtro no existe, por favor pruebe otro filtro.");
                }
            }
        }

    }

}

function getTitleText(){
    console.log("getTitleText");
    var text = "", titleAux = "";
    if(apiResultDataset !== null && apiResultDataset !== ""){
        if(!spanishDomain){
            text = "Title: ";
            titleAux = apiResultDataset.title.en;
        } else {
            text = "Título: ";
            titleAux = apiResultDataset.title.es;
        }

        if(titleAux == "" || typeof titleAux == 'undefined'){
            if(Object.keys(apiResultDataset.title).length > 0){
                titleAux = apiResultDataset.title[Object.keys(apiResultDataset.title)[0]];
            } else {
                titleAux = apiResultDataset.title;
            }
        }
    }

    if(titleAux != "" || typeof titleAux != 'undefined'){
        Read(text + titleAux);
    } else {
        if(!spanishDomain){
            Read("No title available.");
        } else {
            Read("Título no disponible.");
        }
    }
}

function getDescriptionText(){
    console.log("getDescriptionText");
    var text = "", descriptionAux = "";
    if(apiResultDataset !== null && apiResultDataset !== ""){
        if(!spanishDomain){
            text = "Description: ";
            descriptionAux = apiResultDataset.description.en;
        } else {
            text = "Descripción: ";
            descriptionAux = apiResultDataset.description.es;
        }

        if(descriptionAux == "" || typeof descriptionAux == 'undefined'){
            if(Object.keys(apiResultDataset.description).length > 0){
                descriptionAux = apiResultDataset.description[Object.keys(apiResultDataset.description)[0]];
            } else {
                descriptionAux = apiResultDataset.description;
            }
        }
    }

    if(descriptionAux != "" || typeof descriptionAux != 'undefined'){
        Read(text + descriptionAux);
    } else {
        if(!spanishDomain){
            Read("No description available.");
        } else {
            Read("Descripción no disponible.");
        }
    }
}

function getDistributionsText(){
    console.log("getDistributionsText");
    //var distributionItems = document.getElementsByClassName("distributions__item");

    var text = "";
    if(apiResultDataset !== null && apiResultDataset !== ""){
        if(!spanishDomain){
            text += "The distributions available are: ";
        } else {
            text += "Las distribuciones disponibles son: ";
        }

        var format = "";
        for(var i = 0; i < apiResultDataset.distributions.length; i++){
            //format = distributionItems[i].firstElementChild.firstElementChild.firstElementChild.getAttribute("type");
            //if(format === "CSV"){
            var distributionNumber = i+1;
            var distributionTitle = "";
            if(!spanishDomain){
                distributionTitle = apiResultDataset.distributions[i].title.en;
            } else {
                distributionTitle = apiResultDataset.distributions[i].title.es;
            }

            if(distributionTitle == "" || typeof distributionTitle == 'undefined'){
                if(Object.keys(apiResultDataset.distributions[i].title).length > 0){
                    distributionTitle = apiResultDataset.distributions[i].title[Object.keys(apiResultDataset.distributions[i].title)[0]];
                } else {
                    distributionTitle = apiResultDataset.distributions[i].title;
                }
            }

            format = apiResultDataset.distributions[i].format.title;

            text += distributionNumber + ";";

            if(!spanishDomain){
                if(format != "" && typeof format != 'undefined' && format != null){
                    text += format + " format, ";
                }
                if(distributionTitle != "" && typeof distributionTitle != 'undefined' && distributionTitle != null){
                    text += distributionTitle + ".";
                }
            } else {
                if(format != "" && typeof format != 'undefined' && format != null){
                    text += " formato " + format + ", ";
                }
                if(distributionTitle != "" && typeof distributionTitle != 'undefined' && distributionTitle != null){
                    text += distributionTitle + ".";
                }
            }
            //}
        }
    }

    if(text != "" || typeof text != 'undefined'){
        Read(text);
    } else {
        if(!spanishDomain){
            Read("No distributions available.");
        } else {
            Read("Distribuciones no disponibles.");
        }
    }
}

function getDetailsText(){
    console.log("getDetailsText");

    var text = "";

    if(apiResultDataset !== null && apiResultDataset !== ""){
        var titleAux = "", descriptionAux = "", publisher = "", country = "";

        if(!spanishDomain){
            titleAux = apiResultDataset.title.en;
        } else {
            titleAux = apiResultDataset.title.es;
        }

        if(titleAux == "" || typeof titleAux == 'undefined'){
            if(Object.keys(apiResultDataset.title).length > 0){
                titleAux = apiResultDataset.title[Object.keys(apiResultDataset.title)[0]];
            } else {
                titleAux = apiResultDataset.title;
            }
        }

        if(!spanishDomain){
            descriptionAux = apiResultDataset.description.en;
        } else {
            descriptionAux = apiResultDataset.description.es;
        }

        if(descriptionAux == "" || typeof descriptionAux == 'undefined'){
            if(Object.keys(apiResultDataset.description).length > 0){
                descriptionAux = apiResultDataset.description[Object.keys(apiResultDataset.description)[0]];
            } else {
                descriptionAux = apiResultDataset.description;
            }
        }

        country = apiResultDataset.country.title;
        publisher = apiResultDataset.publisher.name;

        if(titleAux != "" && typeof titleAux != 'undefined'){
            text += titleAux;
            if(descriptionAux != "" && typeof descriptionAux != 'undefined'){
                text += ", " + descriptionAux;
            }
            if(country != "" && typeof country != 'undefined' && publisher != "" && typeof publisher != 'undefined'){
                if(!spanishDomain){
                    text += ", published by " + publisher + " in " + country;
                }
                else{
                    text += ", publicado por " + publisher + " en " + country;
                }
            }
        }
    }

    if(text != "" || typeof text != 'undefined'){
        Read(text);
    } else {
        if(!spanishDomain){
            Read("No details available.");
        } else {
            Read("Detalles no disponibles.");
        }
    }
}

function chooseDistribution(number){
    //TODO: check if number is integer and if we are in datasets page
    console.log("chooseDistribution: " + number);

    if(number !== "" && number >= 1){
        for(var i = 0; i < apiResultDataset.distributions.length; i++){
            var index = i - 1;
            if(apiResultDataset.distributions[i].format.id.toLower() === "csv" && index === number){
                var csvDistribution = apiResultDataset.distributions[i];
                distributionChoosenURL = csvDistribution.access_url;
                if(!spanishDomain){
                    distributionChoosenTitle = csvDistribution.title.en;
                }
                else{
                    distributionChoosenTitle = csvDistribution.title.es;
                }
            }
        }
        //distributionChoosenURL = document.getElementsByClassName("distributions__item")[number-1].firstElementChild.lastElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.firstElementChild.firstElementChild.href;

        if(!spanishDomain){
            Read("Distribution " + number + " choosen. Now you can ask for data of that distribution.");
        } else {
            Read("Distribución " + number + " elegida. Ahora puedes preguntar por los datos de dicha distribución.");
        }
    } else {
        if(!spanishDomain){
            Read("Distribution not found.");
        } else {
            Read("Distribución no encontrada.");
        }
    }

}

function getColumnsText(){

    var firstRow = true;
    console.log("getColumnsText: " + distributionChoosenURL);

    if(distributionChoosenURL !== ""){

        if(!distributionDownloaded){
            downloadDistributionToInteract();
            if(!spanishDomain){
                Read("Accessing data, please try again in a while...");
            } else {
                Read("Accediendo a los datos, por favor pruebe de nuevo en unos instantes...");
            }
        } else {
            var columns = "";
            if(distributionData[0].length > 0){
                if(!spanishDomain){
                    columns = "The columns available are: ";
                } else {
                    columns = "Las columnas disponibles son: ";
                }

                for(var i = 0; i < distributionData[0].length; i++){
                    columns += distributionData[0][i].replaceAll(",","").replaceAll(";","") + ", ";
                }
            } else {
                if(!spanishDomain){
                    columns = "There cannot be found any columns.";
                } else {
                    columns = "No se ha podido encontrar ninguna columna.";
                }
            }
            console.log(columns);
            Read(columns);
        }
    }
    else
    {
        if(!spanishDomain){
            Read("First choose a distribution using the voice command: Choose distribution 1 (or the desired number).");
        } else {
            Read("Primero elegir la distribución usando el comando de voz: Elegir distribución 1 (o el número deseado).");
        }
    }

}

function downloadDistributionToInteract(){
    var columns = "";
    var counter = 0;
    // created own https server that redirects to dataset
    // Alternative: https://cors-anywhere.herokuapp.com/
    Papa.parse("https://cors-wafra4od.herokuapp.com/" + distributionChoosenURL, {
        //worker: true,
        download: true,
        step: function(row, parser) {
            distributionData.push(row.data);
            counter++;
            if(counter >= numberOfRowsToAutoDownload){
                parser.abort();
            }
        },
        complete: function() {
            console.log("All done!");
            distributionDownloaded = true;
        }
    });

    /*var xhr = new XMLHttpRequest();
        // Using https://cors-anywhere.herokuapp.com/ allows us to download http (insecure) datasets from https pages
        xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + distributionChoosenURL, true);
        //xhr.setRequestHeader("Origin", '*');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function() {
            //console.log(JSON.stringify(xhr));
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //console.log(xhr.responseText);

                    var columns = "";
                    //var firstRow = parseCSVLine(xhr.responseText.split("\n")[0]);
                    var firstRow = xhr.responseText.split("\n")[0];
                    console.log(firstRow);
                    var options={"separator" : ";", "delimiter" : ""};
                    //var firstRowArray = $.csv.toArray(firstRow, options);
                    if(firstRow.length > 0){
                        if(!spanishDomain){
                            columns = "The columns available are: ";
                        } else {
                            columns = "Las columnas disponibles son: ";
                        }

                        for(var i = 0; i < firstRow.length; i++){
                            columns += firstRow[i].replaceAll(",","").replaceAll(";","") + ", ";
                        }
                    } else {
                        if(!spanishDomain){
                            columns = "There cannot be found any columns.";
                        } else {
                            columns = "No se ha podido encontrar ninguna columna.";
                        }
                    }
                    console.log(columns);
                    Read(columns);
                }
            }
        }
        xhr.send();*/
}

function readAloud(params){

    console.log("read: " + params);
    //closeGoToMenu();
    closeMenu();
    closeOperationsMenu();

    if(params == "" || params == null || typeof params == 'undefined'){
    // if no params, read instructions (available params)
        if(!spanishDomain){
            Read("Please use the read command with one of the following options: columns, all, rows, row number, rows from number to number.");
        } else {
            Read("Por favor usa el comando leer con una de las siguientes opciones: columnas, todo, filas, fila número, filas desde número a número.");
        }
    } else {
        var readContent = "";
        // if params, read what params says from dataset
        switch(params){
            case "columns":
            case "columnas":
                getColumnsText();
                return;
                break;
            case "all":
            case "todo":
                activateKeyboardShortcuts();
                return;
                break;
            case "rows":
            case "filas":
                readRows();
                return;
                break;
            case params.startsWith('rows from') ? params : '' :
            case params.startsWith('filas desde') ? params : '' :
                readRowsFrom(params);
                return;
                break;
            case params.startsWith('row') ? params : '' :
            case params.startsWith('fila') ? params : '' :
                readRow(params);
                return;
                break;
            default:
                if(!spanishDomain){
                    Read("Read " + params + " is not possible, please try again with another option. To get available options use the command Read.");
                } else {
                    Read("No es posible leer " + params + " por favor prueba con otra opción. Para saber las opciones disponibles usa el comando Leer.");
                }
                break;
        }
    }
}

function readCell(){
    var limitRow = false, limitColumn = false;
    var columnText = "", cellValue = "";

    if(distributionData.length > rowPos && rowPos >= 1){
        if(distributionData[rowPos].length > columnPos && columnPos >= 0){
            columnText = distributionData[0][columnPos];
            cellValue = distributionData[rowPos][columnPos];
        } else {
            limitColumn = true;
            if(columnPos >= distributionData[rowPos].length){
                columnPos -= 1;
            } else if (rowPos < 0){
                columnPos += 1;
            }
        }
    } else {
        limitRow = true;
        if(rowPos >= distributionData.length){
            rowPos -= 1;
        } else if (rowPos <= 0){
            rowPos += 1;
        }
    }

    var columnPosAux = columnPos + 1;
    var rowPosAux = rowPos;
    if(!limitColumn && !limitRow){
        if(!spanishDomain){
            Read(" Row " + rowPosAux + " Column " + columnPosAux + ": the value of " + columnText + " is " + cellValue + ".");
        } else {
            Read(" Fila " + rowPosAux + " Columna " + columnPosAux + ": el valor de " + columnText + " es " + cellValue + ".");
        }
    } else if(limitColumn){
        if(!spanishDomain){
            Read("The edge has been reached in column " + columnPosAux + ".");
        } else {
            Read("Se ha alcanzado el borde en la columna " + columnPosAux + ".");
        }
            console.log("row " + rowPosAux);
    } else if(limitRow){
        if(!spanishDomain){
            Read("The edge has been reached in row " + rowPosAux + ".");
        } else {
            Read("Se ha alcanzado el borde en la fila " + rowPosAux + ".");
        }
            console.log("column " + columnPosAux);
    }
    //TODO: check border in row 100 and download 100 more rows
}

function readRows(){
    var readContent = "";
    if(!spanishDomain){
        readContent += "Reading data row by row, you can use the shortcut control and space to stop the reading aloud.";
    } else {
        readContent += "Leyendo datos fila a fila, puedes utilizar el atajo de teclado control más espacio para detener la lectura.";
    }

    var columnText = "", cellValue = "";
    for(var i = 1; i < distributionData.length; i++){
        for(var j = 0; j < distributionData[i].length; j++){
            var rowPosAux = i;
            var columnPosAux = j + 1;
            columnText = distributionData[0][j];
            cellValue = distributionData[i][j];
            //Move rowPos and columnPos?
            if(!spanishDomain){
                readContent += " Row " + rowPosAux + " Column " + columnPosAux + ": the value of " + columnText + " is " + cellValue + ".";
            } else {
                readContent += " Fila " + rowPosAux + " Columna " + columnPosAux + ": el valor de " + columnText + " es " + cellValue + ".";
            }
        }
    }
    Read(readContent);
    //TODO: check border in row 100 and download 100 more rows
}

function readRow(params){
    var readContent = "";
    var error = false;
    var position = 0;
    if(params.includes(" ")){
        // check if existing, if not read error
        if(params.split(" ").length > 0){
            var paramNumber = params.split(" ")[1];
            position = text2num(paramNumber);
        } else {
            error = true;
        }
    } else {
        error = true;
    }
    console.log(position);

    var columnText = "", cellValue = "";
    if(position < distributionData.length){
        for(var j = 0; j < distributionData[position].length; j++){
            var rowPosAux = position;
            var columnPosAux = j + 1;
            columnText = distributionData[0][j];
            cellValue = distributionData[position][j];
            //Move rowPos and columnPos?
            if(!spanishDomain){
                readContent += " Row " + rowPosAux + " Column " + columnPosAux + ": the value of " + columnText + " is " + cellValue + ".";
            } else {
                readContent += " Fila " + rowPosAux + " Columna " + columnPosAux + ": el valor de " + columnText + " es " + cellValue + ".";
            }
        }
    } else {
        error = true;
    }

    if(error){
        if(!spanishDomain){
            Read("Indicated row does not exist, please try again.");
        } else {
            Read("La fila indicada no existe, inténtalo de nuevo.");
        }
    } else {
        Read(readContent);
    }
    //TODO: check border in row 100 and download 100 more rows
}

function readRowsFrom(params){
    var readContent = "";
    var error = false;
    var positionStart = 0, positionEnd = 0;
    if(params.includes(" ")){
        // check if existing, if not read error
        if(params.split(" ").length > 0){
            positionStart = text2num(params.split(" ")[2]);
            positionEnd = text2num(params.split(" ")[4]);
        } else {
            error = true;
        }
    }

    var columnText = "", cellValue = "";
    // read rows from n to m
    if(positionStart >= 0 && positionEnd < distributionData.length){
        for(var i = 0; i < distributionData.length; i++){
            if(i >= positionStart && i <= positionEnd){
                for(var j = 0; j < distributionData[i].length; j++){
                    var rowPosAux = i;
                    var columnPosAux = j + 1;
                    columnText = distributionData[0][j];
                    cellValue = distributionData[i][j];
                    //Move rowPos and columnPos?
                    if(!spanishDomain){
                         readContent += " Row " + rowPosAux + " Column " + columnPosAux + ": the value of " + columnText + " is " + cellValue + ".";
                    } else {
                        readContent += " Fila " + rowPosAux + " Columna " + columnPosAux + ": el valor de " + columnText + " es " + cellValue + ".";
                    }
                }
            }
        }
    } else {
        error = true;
    }
    //TODO: check border in row 100 and download 100 more rows

    if(error){
        if(!spanishDomain){
            Read("Indicated rows do not exist, please try again.");
        } else {
            Read("Las filas indicadas no existen, inténtalo de nuevo.");
        }
    } else {
        Read(readContent);
    }
}

function activateKeyboardShortcuts(){
    columnPos = 0;
    rowPos = 1;
    navigationShortcutsActive = true;
    if(!spanishDomain){
        Read("Now you can use control + keyboard arrows to navigate within the data. For example, use control and down arrow to read the cell below, or use control and right arrow to read the next cell in the row. To stop this operation and reactivate other voice commands use the shortcut control + space.");
    } else {
        Read("Ahora puedes utilizar el atajo control más las flechas para navegar entre los datos. Por ejemplo, usa control y flecha abajo para leer la celda inferior, o usa control y flecha derecha para leer la celda siguiente en la fila. Para terminar esta operación y reactivar el resto de comandos por voz utiliza el atajo control y espacio.");
    }
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
}

function downloadDistribution(){
    console.log("downloadDistribution");
    var link = document.createElement("a");
    console.log("distributionChoosenTitle: " + distributionChoosenTitle);
    link.download = distributionChoosenTitle;
    console.log("distributionChoosenURL: " + distributionChoosenURL);
    link.href = distributionChoosenURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

    if(!spanishDomain){
        Read("Distribution downloading to your computer.");
    } else {
        Read("Distribución descargándose a su ordenador.");
    }
}

// Main Page
function goToMainPage(){
    window.location.href = window.location.href.replace(window.location.pathname, "");
}

// Go back
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

function text2num(number) {
    if(isNaN(number)){
        var x = NumbersWord[number];
        if(spanishDomain){
            x = NumbersWordES[number];
        }
        if (x != null) {
            return x;
        } else {
            console.log("Unknown number: " + number);
            return 0;
        }
    } else {
        return number;
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