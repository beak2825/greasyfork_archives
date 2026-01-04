// ==UserScript==
// @name         MultiSearch Helper
// @namespace    http://terr590.doesntownanyurls.shit/
// @version      0.6.5
// @description  Searches question and highlights answers to make them easily recognizable
// @author       Terr
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.js
// @match        https://multisearchtabs.github.io/*
// @include      https://www.google.*
// @downloadURL https://update.greasyfork.org/scripts/370547/MultiSearch%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370547/MultiSearch%20Helper.meta.js
// ==/UserScript==

var resultCount = 0;
var question, temp, i = 0, useOG = false;

function getParameterByName(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function reCountMatches(str, re)
{
    return ((str || '').match(re) || []).length
}

function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag)
{
    // the highlightStartTag and highlightEndTag parameters are optional
    if ((!highlightStartTag) || (!highlightEndTag)) {
        highlightStartTag = "<font style='color:black; background-color:yellow;'>";
        highlightEndTag = "</font>";
    }

    searchTerm = searchTerm.replace('&', '&amp;');

    // find all occurences of the search term in the given text,
    // and add some "highlight" tags to them (we're not using a
    // regular expression search, because we want to filter out
    // matches that occur within HTML tags and script blocks, so
    // we have to do a little extra validation)
    var newText = "";
    var i = -1;
    var lcSearchTerm = searchTerm.toLowerCase();
    var lcBodyText = bodyText.toLowerCase();

   while (bodyText.length > 0) {
        i = lcBodyText.indexOf(lcSearchTerm, i+1);
        if (i < 0) {
            newText += bodyText;
            bodyText = "";
        } else {
            // skip anything inside an HTML tag
            if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
                // skip anything inside a <script> block
                if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
                    if(lcBodyText.lastIndexOf("}", i) >= lcBodyText.lastIndexOf("{", i)){
                        newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
                        //console.log('Highlight: '+ bodyText.substr(i, searchTerm.length));
                        bodyText = bodyText.substr(i + searchTerm.length);
                        lcBodyText = bodyText.toLowerCase();
                        i = -1;
                        resultCount++;
                    }
                }
            }
        }
    }
    return newText;
}

function highlightLetter(letter, element, highlightStartTag, highlightEndTag)
{
    var re = new RegExp("(?![\\<])\\b"+letter+"(?!\\>)\\b",'gi');
    var text = element.html();
    resultCount = 0;
    text = text.replace(re, function(str) {resultCount++; return highlightStartTag+str+highlightEndTag;});
    element.html(text);
}

function highlightSymbol(symbol, element, highlightStartTag, highlightEndTag)
{
    var re = new RegExp("(?:[^a-z0-9])"+symbol+"(?![a-z0-9])",'gi');
    var text = element.html();
    resultCount = 0;
    text = text.replace(re, function(str) {resultCount++; return highlightStartTag+str+highlightEndTag;});
    element.html(text);
}

function highlightSearchTerms(searchText, jelement ,treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag)
{
    // if the treatAsPhrase parameter is true, then we should search for
    // the entire phrase that was entered; otherwise, we will split the
    // search string so that each word is searched for and highlighted
    // individually
    resultCount = 0;

    var searchArray;
    if (treatAsPhrase) {
        searchArray = [searchText];
    } else {
        searchArray = searchText.split(/\s+/);
    }
    console.log('Search array: '+searchArray);


    if (!document.body || typeof(document.body.innerHTML) == "undefined") {
        if (warnOnFailure) {
            alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
        }
        return false;
    }

    var bodyText = jelement.html();
    for (var i = 0; i < searchArray.length; i++) {
        if (searchArray[i].match(/^\s*$/)){continue;}
        bodyText = doHighlight(bodyText, searchArray[i], highlightStartTag, highlightEndTag);
    }

    jelement.html(bodyText);
    return true;
}

function hasDuplicates(array)
{
    return (new Set(array)).size !== array.length;
}

function isNullOrWhiteSpace(str){
    return str == null || str.replace(/\s/g, '').length < 1;
}

function whichEdit( qToEdit )
{
    //console.log('Before whichEdit: ' + qToEdit);
    var newQ = qToEdit.toLowerCase();
    newQ = newQ.replace(/[.,'“”"\/#!?？¿¡$%\^\*;:{}=\_`~()]/g,''); //remove puncuation

    //console.log('After puncuation: ' + newQ);
    newQ = newQ.replace(/(\s+|^)([^\r\n\t\f\v \d]){1,3}(?=(\s+|$))/mgi, ''); //remove small words
    //console.log('After small words: ' + newQ);
    newQ = newQ.replace(/\b(can't|don't|isn't|aren't|which|whose|where|these|what|ever|with|also|same|part|would|wouldn't|when|about|mean|eine|einen|einem)\b/gi, ''); //remove these words
    //console.log('After words: ' + newQ);
    newQ = newQ.replace(/\s{2,}/g,' '); // remove extra spaces

    //console.log('After whichEdit: ' + newQ);
    return newQ;
}

function sumQuestion( qToEdit )
{
    var newQ = qToEdit.toLowerCase();
    newQ = newQ.replace(/[.,'“”"\/#!?？¿¡$%\^\*;:{}=\_`~()]/g,''); //remove puncuation
    newQ = newQ.replace(/(\s+|^)\S{1,2}(?=(\s+|$))/mgi, ''); //remove small words
    newQ = newQ.replace(/\b(the|and|are|for|you|but|not|his|her|can|who|out|how|its|was|has|can't|don't|isn't|aren't|which|whose|where|these|what|ever|with|also|same|part|would|wouldn't|when|about|mean)\b/gi, ''); //remove these words
    newQ = newQ.replace(/\s{2,}/g,' '); // remove extra spaces
    return newQ;
}

function editOption( op )
{
    var newOp;
    newOp = op.toLowerCase()
    var str = ['the ','an ', 'a ', 'in the ', 'on the ', 'at the ', 'le ', 'un ', "l'","d'"];
    var i;
    for (i = 0; i < str.length; i++)
    {
        if(newOp.startsWith(str[i])) newOp = newOp.substring(str[i].length);
    }
    newOp = newOp.replace(/\b(city)\b/gi, ''); //remove these words
    return newOp;
}

function removeCommonWordsInOptions(op, ignoreNumbers)
{
    //console.log('Before removeCommonWordsInOptions: ' + op);
    op = op.slice(); //clone array to avoid taking the it by reference
    var words = [], allWords = [], str = '', i,j;
    var unchanged = op;

    for (i = 0; i < op.length; i++)
    {
        str += ' ' + op[i];
    }

    words = str.split(/\s+/);
    words.shift();

    if(hasDuplicates(op)) {useOG = true; return unchanged;} //if any options are the same then we better use the original options
    if(words.length === op.length) return op; //must me unique, no need to search for common words


    var sorted_arr = words.slice().sort();
    var duplicates = [];
    for (i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            duplicates.push(sorted_arr[i]);
        }
    }

    var temp = [];
    $.each(duplicates, function(i, el){
        if($.inArray(el, temp) === -1) temp.push(el); //filter out duplicates
    });
    duplicates = temp.slice();

    temp=[];
    if(ignoreNumbers == true)
    {
        $.each(duplicates, function(i, el){
            if(isNaN(el)) temp.push(el);
        });
        duplicates = temp;
    }

    console.log('Duplicates: '+ duplicates )

    for (i = 0; i < op.length; i++)
    {
        var optionWords = op[i].split(/\s+/);
        for(j = 0; j < optionWords.length; j++)
        {
            if(duplicates.indexOf(optionWords[j]) > -1)
            {
                var re = new RegExp(optionWords[j], 'g');
                op[i] = op[i].replace(re, '');
            }
        }
        op[i] = op[i].replace(/\s{2,}/g,' '); // remove extra spaces
    }

    if(hasDuplicates(op)) {useOG = true; return unchanged;} //if any options are the same then we better use the original options
    //console.log('After removeCommonWordsInOptions: ' + op);

    return op;
}

function searchOptionFloat(additionalWords, opt, isImgSearch)
{
    var temp;
    if($('#floatBox').length < 1)
    {
        var floatBox = document.createElement("div");
        floatBox.setAttribute('id', 'floatBox');
        floatBox.style.cssText = 'display:flex; position:fixed; width:100%; min-height:100px; background: #ddd; bottom:0px;';
        document.body.appendChild(floatBox);

        var floatClose = document.createElement("div");
        floatClose.setAttribute('id', 'floatClose');
        floatClose.style.cssText = 'position:fixed; width:40px; height:40px; background:#002e42; color:white; top:375px; right: 0px; cursor: pointer; font-size:25px; text-align: center; vertical-align: middle; border-radius: 50%;';
        floatClose.appendChild(document.createTextNode("╳"));
        document.body.appendChild(floatClose);

        $("#floatClose").on("click", e => {
            $("#floatBox").remove();
            $("#floatClose").remove();
        });

        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 400;

        for (i = 0; i < opt.length; i++)
        {
            frame = document.createElement("iframe");
            frame.style.cssText = 'display: inline-block; flex-grow: 1; height: '+h+'px;';
            frame.id = 'gframe'+(i+1);
            floatBox.appendChild(frame);
            console.log('search?q='+question+' '+opt[i]+'&regularQ=true&removeMargin=true&option1='+opt[i]);
        }

        $('#gframe1').on('scroll', function () {
            $('#gframe2').scrollTop($(this).scrollTop());
            $('#gframe3').scrollTop($(this).scrollTop());
        });
    }

    for (i = 0; i < opt.length; i++)
    {
        temp = opt[i].replace('&', '%26');
        if(isImgSearch)
        {
            link = 'search?q='+temp+'&tbm=isch';
        }
        else if(!isNullOrWhiteSpace(additionalWords))
        {
            link = 'search?q='+temp+ additionalWords + '&removeMargin=true';
        }
        else
        {
            link = 'search?q='+temp+'&regularQ=true&removeMargin=true&tokenize='+question;
        }
        $('#gframe'+(i+1)).attr("src", link);
    }
}

function checkForPattern(question)
{
    var basicVerbExp = "(is|isn't|are|aren't|has|hasn't|have|haven't|was|wasn't|were|weren't)";
    var notExp = "\\s*(not)?\\s*";
    var timeOrderExp = '(first|second|third|last)';
    var superlativeExp = "(the \\w{2,10}st )";
    var whichOfExp = "(which of these)\\s+.{3,}\\s+";

    var rePunct = /[.,“”"\/#!?？$%\^\*;:{}=\_~()]/g;

    var re, result;

    re = new RegExp(basicVerbExp + "\\s+\\w{4,15}\\s+" + timeOrderExp,'gi');
    result = question.match(re);
    if(result != null)
    {
       result = result[0].split(/\s+/);
       return ' ' + result[1] + " date";
    }

    re = new RegExp(whichOfExp + superlativeExp,'gi');
    result = question.match(re);
    if(result != null)
    {
        result = question.replace(re,'');
        result = result.replace(rePunct,'');
        return ' ' + result;
    }

    return null;
}

//Script Main:
var domain = window.location.hostname;
var opt = [];
var node, textnode, colorNode, numberNode, frame, params;

if( domain.startsWith('www.google.') && getParameterByName('removeMargin'))
{
    $('#cnt').css('margin-left', '0px');
    $('#center_col').css('margin-left', '0px');
}

if(domain === "multisearchtabs.github.io")
{
    question = getParameterByName('s1');
    if(question === null) return;
    i = 0;
    while(!isNullOrWhiteSpace(getParameterByName('s'+(i+2))))
    {
        opt[i] = getParameterByName('s'+(i+2));
        i++;
    }

    question = question.replace('&', '%26');

    console.log('q: '+question + ' opt: '+opt)

    if(localStorage.getItem('lastLink') === window.location.href)
    {
        console.log('link visited');
        localStorage.removeItem('lastLink');
        params = '?whichDetected=' + whichEdit(question);
        if(opt[0]) params += '&option1=' + opt[0];
        if(opt[1]) params += '&option2=' + opt[1];
        if(opt[2]) params += '&option3=' + opt[2];

        params = encodeURI(params);
        console.log('about wo whcih: '+'http://google.com/'+params);

        window.location.href = 'http://google.com/'+params;
        return;
    }

    params = question
    params += '&regularQ=true';

    for(i = 0; i < opt.length; i++)
    {
        if(opt[i])
        {
            opt[i] = opt[i].replace('&', '%26');
            params += '&option'+(i+1)+'=' + opt[i];
        }
    }

    params = encodeURI(params);

    localStorage.setItem('lastLink', window.location.href);
    window.location.href = 'http://google.com/search?q='+params;
}
else if( domain.startsWith('www.google.') && getParameterByName('regularQ'))
{
    console.log("Regular search staring on: " + domain);
    var notPhrase, additionalWords, res;
    var isShift = false;
    var style = [];
    style[0] = 'color:black; background-color:yellow';
    style[1] = 'color:black; background-color:lightcoral;';
    style[2] = 'color:black; background-color:cyan;';
    style[3] = 'color:black; background-color:lightgreen;';
    style[4] = 'color:black; background-color:gray;';
    style[5] = 'color:white; background-color:black;';

    if(getParameterByName('tokenize'))
    {
        temp = getParameterByName('tokenize');
        if(temp.startsWith(' ')) temp = temp.substring(1);
        temp = temp.replace('%26', '&');
        opt = temp.split(/\s+/);
        opt.reverse();
    }
    else
    {
        i = 0;
        while(!isNullOrWhiteSpace(getParameterByName('option'+(i+1))))
        {
            opt[i] = getParameterByName('option'+(i+1));
            opt[i] = opt[i].replace('%26', '&');
            i++;
        }
    }
    if(opt.length < 1){return;}

    var editedOpt = [], phrase = true, optEdited = false, skip = false;
    var phraseArr = [];

    for (i = 0; i < opt.length; i++) {
        phraseArr[i] = false;
    }

    //console.log('Opt1: ' + opt);
    for (i = 0; i < opt.length; i++) {   //if there are anwers longer than 6 symbols, do not seach as phrase
        if(opt[i].length > 6) {phrase = false; break;}
    }

    var all = true, re, reRes;
    for (i = 0; i < opt.length; i++) {
        reRes = opt[i].match(/\d{1,6}\s{0,2}(-|–|and|und|et|[A-z])\s{0,2}\d{1,6}/gi);
        if(reRes == null)
        {
            all = false; break;
        }
    }

    if(all == true)
    {
        skip = true;
        re = new RegExp(/\d{1,6}/gi);
        var resArr;
        for (i = 0; i < opt.length; i++) {
            editedOpt[i] = '';
            while ((resArr = re.exec(opt[i])) !== null) {
                editedOpt[i] += resArr[0] + ' ';
              }
        }
    }

    if(!skip)
    {
        var digits;
        editedOpt = removeCommonWordsInOptions(opt, true);
        for (i = 0; i < opt.length; i++) {   //if there are anwers end with space, remove it
            if(editedOpt[i].substring(editedOpt[i].length - 1, editedOpt[i].length) == ' '){ editedOpt[i] = editedOpt[i].substring(0, editedOpt[i].length - 1); }
        }
        for (i = 0; i < opt.length; i++) {   //if there are anwers that contain more numbers than letters
            digits = reCountMatches(editedOpt[i] , /[0-9]/g);
            if(digits > opt[i].length/2) {phrase = true; optEdited = true; console.log('Number options detected:'+ opt); break;}
        }

        //console.log('Opt2: ' + opt);
        if(phrase == false)
        {
            optEdited = true;
            for (i = 0; i < opt.length && i< style.length; i++) {
                editedOpt[i] = editOption(opt[i]);
            }

            //console.log('Opt3: ' + editedOpt);
            for (i = 0; i < editedOpt.length; i++) {
                res = whichEdit(editedOpt[i]);
                if(isNullOrWhiteSpace(res)) { phraseArr[i] = true; continue;}
                editedOpt[i] = res;
            }
            //console.log('Opt4: ' + editedOpt);
            editedOpt = removeCommonWordsInOptions(editedOpt, false);
            //console.log('Opt5: ' + editedOpt);
            for (i = 0; i < editedOpt.length; i++) {
                if(isNullOrWhiteSpace(editedOpt[i]))
                {
                    useOG = true; break;
                }
            }

            for (i = 0; i < opt.length; i++)
            {
                if(phraseArr[i] == true){editedOpt[i] = editOption(opt[i]);}
            }
        }
        else if(optEdited == false){editedOpt = opt;}
    }

    if(useOG==true) {phrase = true; editedOpt=opt;}
    console.log('Opt6: ' + editedOpt)
    var optRes = [];
    var phraseVarDynamic;
    for (i = 0; i < editedOpt.length && i< style.length; i++) {

        if(phraseArr[i] == true){phraseVarDynamic = true}
        else{phraseVarDynamic = phrase}

        if(editedOpt[i].length < 3 && editedOpt[i].match(/^[a-z]+$/i)) { highlightLetter(editedOpt[i], $('#rcnt'), "<font style='"+style[i]+"';'>", "</font>"); }
        else if(editedOpt[i].length < 3 && editedOpt[i].match(/^[0-9.,'“”"\/#!?？$%\^&\*;:{}=\_`~()\[\]]+$/i)) { highlightSymbol(editedOpt[i], $('#rcnt'), "<font style='"+style[i]+"';'>", "</font>"); }
        else { highlightSearchTerms(editedOpt[i], $('#rcnt'),phraseVarDynamic,false, "<font style='"+style[i]+"';'>", "</font>"); }
        optRes[i] = resultCount;
        console.log((i+1)+'. result count: '+ resultCount);
    }

    var resultsElement = document.createElement('div');
    var mainContainer = document.createElement('div');
    var container = document.createElement('div');
    var buttContainer = document.createElement('div');
    container.appendChild(resultsElement);
    container.appendChild(buttContainer);
    mainContainer.appendChild(container);
    var referenceNode = document.getElementById('res');
    referenceNode.parentNode.insertBefore(mainContainer, referenceNode);
    resultsElement.setAttribute('id', 'resultsElement');

    mainContainer.style.cssText = 'font-size: large; border: 1px solid #0199d9; border-radius: 4px; padding-left: 1em; padding-right: 1em; width: 100%;';
    container.style.cssText = 'display:inline-flex; flex-wrap: nowrap; align-items: center; justify-content: space-between; width: 100%;';
    buttContainer.style.cssText = 'display:flex; flex-wrap: nowrap; align-items: flex-end; justify-content: center; flex-direction: column;';
    resultsElement.style.cssText = 'flex-basis: auto';

    node = document.createElement("p");
    node.style.cssText = 'font-weight: bold; color:#002e42;';
    textnode = document.createTextNode("MULTISEARCH RESULTS:");
    node.appendChild(textnode);
    resultsElement.appendChild(node);

    for (i = 0; i < opt.length && i< style.length; i++) {
        node = document.createElement("p");
        colorNode = document.createElement("font");
        colorNode.style.cssText = style[i];
        numberNode = document.createElement("font");
        numberNode.style.cssText = 'font-weight: bold;';
        textnode = document.createTextNode( (i+1)+'. ' + opt[i]);
        colorNode.appendChild(textnode);
        textnode = document.createTextNode('  '+optRes[i]);
        numberNode.appendChild(textnode);
        node.appendChild(colorNode);
        node.appendChild(numberNode);
        resultsElement.appendChild(node);
    }

    if(getParameterByName('tokenize') == null)
    {
        var aLink = document.createElement('a');

        question = getParameterByName('q');
        question = sumQuestion(question);

        aLink.setAttribute('id', 'btnImg');
        aLink.setAttribute('title', 'Shortcut: Shift+v');
        aLink.appendChild(document.createTextNode("OPTION IMAGES"));
        aLink.style.cssText = 'display:block; margin-bottom: 0.7em; margin-top: 0.7em; color:white; background-color: #5EB2D1; padding: 10px 10px; border-radius: 4px; text-decoration: none; cursor:pointer;';
        buttContainer.appendChild(aLink);

        $('#btnImg').on( 'click', e => {searchOptionFloat('',opt,true);});

        aLink = document.createElement('a');

        aLink.setAttribute('id', 'btnEach');
        aLink.setAttribute('title', 'Shortcut: Shift+e');
        aLink.appendChild(document.createTextNode("SEARCH EACH OPTION"));
        aLink.style.cssText = 'display:block; margin-bottom: 1em; color:white; background-color: #0199d9; padding: 10px 10px; border-radius: 4px; text-decoration: none; cursor:pointer;';
        buttContainer.appendChild(aLink);

        $('#btnEach').on( 'click', e => {searchOptionFloat('',opt,false);});

        var optionWordContainer = document.createElement('div');
        optionWordContainer.style.cssText = 'display:inline-flex; flex-wrap: nowrap; align-items: center; justify-content: space-between; width: 100%;';
        mainContainer.appendChild(optionWordContainer);

        var wordLine = document.createElement('p');
        wordLine.setAttribute('id', 'wordLine');
        wordLine.setAttribute('title', 'Left click to add word to option search; Right click to option search word exclusively.');
        optionWordContainer.appendChild(wordLine);

        var wordLineStart = document.createElement('div');
        wordLineStart.setAttribute('id', 'wordLineStart');
        wordLineStart.appendChild(document.createTextNode("Option words:"));
        wordLine.appendChild(wordLineStart);

        var words = sumQuestion(question);
        if(words.startsWith(' ')) words = words.substring(1);
        words = words.split(/\s+/);

        $("<style type='text/css'> #wordLineStart{display:inline;} "
          +".optionWord{ cursor:pointer; margin-left:0.5em; display:inline-block; text-decoration:none; font-weight: 600; } "
          +".optionWord:hover {text-decoration:underline;} "
          +"#wordLine{margin:0px; color:#002e42;} </style>").appendTo("head");

        var optionWord;
        for(i = 0; i < words.length; i++)
        {
            optionWord = document.createElement('div');
            optionWord.setAttribute('class', 'optionWord');
            optionWord.appendChild(document.createTextNode(words[i]));
            wordLine.appendChild(optionWord);
        }

        $('#wordLine').on('click', '.optionWord', e => {
            if(isNullOrWhiteSpace(additionalWords)){additionalWords = '';}
            additionalWords += ' '+e.target.innerText;
            searchOptionFloat(additionalWords,opt,false);
        });

        $('#wordLine').on('contextmenu', '.optionWord', e => {
            additionalWords = ' '+e.target.innerText;
            searchOptionFloat(additionalWords,opt,false);
            return false;
        });

        var customWordsButt = document.createElement('div');
        customWordsButt.style.cssText = 'max-height:25px; max-width:25px; min-height:25px; min-width:25px; color:white; background-color: #002e42; font-weight: bold; cursor: pointer; font-size:22px; text-align: center; vertical-align: middle; border-radius: 50%;';
        customWordsButt.appendChild(document.createTextNode("+"));
        customWordsButt.setAttribute('id', 'customWordsButt');
        customWordsButt.setAttribute('title', 'Type custom option words. (Shift+w)');
        optionWordContainer.appendChild(customWordsButt);

        $('#customWordsButt').on('click', e => {
            var customWords = prompt('Type in custom option words. (shortcut: Shift+w)');
            if(!isNullOrWhiteSpace(customWords))
            {
                searchOptionFloat(' ' + customWords,opt,false);
            }
        });

        $(document).keyup(function (e) {
            if(e.which == 16) isShift=false;
            }).keydown(function (e) {
                if(e.which == 16) isShift=true;
                if(e.which == 87 && isShift == true) //Shift+w
                {
                    $('#customWordsButt').trigger("click");
                    return false;
                }
                if(e.which == 69 && isShift == true) //Shift+e
                {
                    $('#btnEach').trigger("click");
                    return false;
                }
                if(e.which == 86 && isShift == true) //Shift+v
                {
                    $('#btnImg').trigger("click");
                    return false;
                }
            });
    }

    //res = checkForPattern(getParameterByName('q'));
    //if( res != null)
    //{
    //    searchOptionFloat(res, opt, false)
    //}
}
else if( domain.startsWith('www.google.') && getParameterByName('whichDetected') !==null)
{
    console.log('whichDetected');
    question=getParameterByName('whichDetected');

    temp = getParameterByName('option1');
    if(temp) opt[0] = temp;
    temp = getParameterByName('option2');
    if(temp) opt[1] = temp;
    temp = getParameterByName('option3');
    if(temp) opt[2] = temp;

    var isImgSearch = getParameterByName('optImg');
    var link;

    document.body.innerHTML = "";
    document.head.innerHTML = "";
    document.body.style.cssText = 'display:flex; margin: 0px ;padding: 0px;';

    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 4;

    for (i = 0; i < opt.length; i++)
    {
        frame = document.createElement("iframe");
        frame.style.cssText = 'display: inline-block; flex-grow: 1; height: '+h+'px;';
        frame.id = 'gframe'+(i+1);
        document.body.appendChild(frame);
        console.log('search?q='+question+' '+opt[i]+'&regularQ=true&removeMargin=true&option1='+opt[i]);
        if(isImgSearch)
        {
            link = 'search?q='+opt[i]+'&tbm=isch';
        }
        else
        {
            link = 'search?q='+opt[i]+'&regularQ=true&removeMargin=true&tokenize='+question;
        }
        $('#gframe'+(i+1)).attr("src", link);
    }
}