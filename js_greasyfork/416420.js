// ==UserScript==
// @name        DECIPHER - **NEW** XMLFloatyBoi
// @version     2.7.1
// @description Adds small window to XML view so you can add question types quickly without having to type them out
// @author      Scott / SSearle
// @include     https://survey*.researchnow.com/apps/lumos/*
// @include     https://survey-*.dynata.com/apps/lumos/*
// @include     https://survey-d.yoursurveynow.com/apps/lumos/*
// @exclude     *:edit
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @namespace	https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/416420/DECIPHER%20-%20%2A%2ANEW%2A%2A%20XMLFloatyBoi.user.js
// @updateURL https://update.greasyfork.org/scripts/416420/DECIPHER%20-%20%2A%2ANEW%2A%2A%20XMLFloatyBoi.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jQuery = unsafeWindow.jQuery; 	//Need for Tampermonkey or it raises warnings.
    var $ = unsafeWindow.jQuery; 		//Need for Tampermonkey or it raises warnings.
    //BUTTONS: https://www.bestcssbuttongenerator.com/#/25
    //TABLE: https://www.quackit.com/html/html_table_generator.cfm

    var questionTop;		//Holds all properties that appear -BEFORE- <title>
    var lastItem;			//Used to append ">" to the last item in questionTop
    var randomNumber;		//Holds randomly generated number, appended to QID so it's unique
	var dummyQT;			//QID for Dummies
	var dummyExecArray;		//Holds the <exec> script in dummies
    var loopSuffix;			//Holds either "", or "_[loopvar: label]"

	var argType;			//Holds question type (radio/checkbox/res/loop/etc)
 	var argLabel;			//Does question include label?
	var argRandomize;		//Is question randomized?
	var argOptional;		//Is question optional?
	var argTranslate;		//Is question translatable?
	var argRowReq;			//Rows are required.
	var argColReq;			//Cols are required.
	var argAnsType;			//Answer type (row/choice/res/looprow)
	var argQTRequired;		//Question text required
	var argDummy;			//Is question a dummy?
	var argATM1D;			//Is question ATM1D.X?
	var argAutoSum;			//Is question AutoSum?
	var argMXTool;			//Is MX question?
	var argMXType;			//What kind of MX question?
	var argMXURL;			//MX tool URL
    var argMLS;				//Include MLS?

	var logicRowCount;		//Keeps track of the # of rows created so far

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	///////////////////QUESTION BUILDING BELOW//////////////////
    var questionBuilder = document.createElement('script');
	questionBuilder.setAttribute('id', 'XMLBoiScript');
    questionBuilder.innerHTML = "function questionBuilder(" +
        //Below arguments are passed from question button
        "argType," +
        "argLabel," +
        "argRandomise," +
        "argOptional," +
        "argTranslate," +
		"argRowReq," +
		"argColReq," +
		"argAnsType," +
		"argQTRequired," +
        "argDummy," +
        "argATM1D," +
        "argAutoSum," +
		"argMXTool," +
		"argMXType," +
		"argMXURL," +
        "argMLS," +
        ") {" +

		"var debugConsole = true;" +	//Whether to show console.log comments
		"var logicRowCount = 1;" +		//Keeps track of the # of rows created so far

		"console.clear();" +
        "if (debugConsole) {console.log(\"*****Not for general use*****\");}" +
        "if (debugConsole) {console.log(\"Question Type = \" + argType);}" +
        "if (debugConsole) {console.log(\"Include Label = \" + argLabel);}" +
        "if (debugConsole) {console.log(\"Include Randomize = \" + argRandomise);}" +
        "if (debugConsole) {console.log(\"Question Optional = \" + argOptional);}" +
        "if (debugConsole) {console.log(\"Question Translate = \" + argTranslate);}" +
		"if (debugConsole) {console.log(\"Rows Required? = \" + argRowReq);}" +
		"if (debugConsole) {console.log(\"Cols Required? = \" + argColReq);}" +
		"if (debugConsole) {console.log(\"Answer Format = \" + argAnsType);}" +
		"if (debugConsole) {console.log(\"Question Text? = \" + argQTRequired);}" +
        "if (debugConsole) {console.log(\"Dummy Question = \" + argDummy);}" +
        "if (debugConsole) {console.log(\"ATM1D Question = \" + argATM1D);}" +
		"if (debugConsole) {console.log(\"Auto Sum Question = \" + argAutoSum);}" +
		"if (debugConsole) {console.log(\"MX Tool? = \" + argMXTool);}" +
		"if (debugConsole) {console.log(\"MX Name = \" + argMXType);}" +
		"if (debugConsole) {console.log(\"MX URL = \" + argMXURL);}" +
        "if (debugConsole) {console.log(\"mls = \" + argMLS);}" +

//Question vars below
"questionTop = []; " +										//Holds top half of question as it's being built
"lastItem = \"\"; " +										//Holds the last item, so we can add a closing chevron ">"
"randomNumber = Math.floor(Math.random() * 1000) + 1;" +	//Holds randomly generated number, appended to QID so it's unique

"dummyQT = jQuery(\"#questionTextOutputBox\").val().trim();" +		//Get QID for Dummy Generation
"if (dummyQT.length < 1) {dummyQT = \"Dummy\" + randomNumber;}" +	//If QID not given

"dummyExecArray = \"\";" +								//Holds the <exec> for dummies when they're built

"if(jQuery(\"#loopIncluded\").prop(\"checked\"))" +		//Is the loop button ticket?
"{loopSuffix = \"_[loopvar: label]\";}" +				//loopSuffix = "_[loopvar: label]"
"else {loopSuffix = \"\";}" + 							//loopSuffix = "" (Blank, nothing)



//Question PROPERTIES start being built below...
//
//
//
//
//
//<suspend/>
"if (!eval(argMXTool) && argType != \"cond\" && argType != \"MXExec\" && argType != \"JQExec\") {questionTop.push(addSuspend());}" +

//Notes to be added above questions/reminders
"if (argType == \"text\" || argType == \"textarea\") {questionTop.push(\"\\n<note>Remember: If a question is one of the below, don't forget to add the extra information!\\n\\nhttps://dynatallc.sharepoint.com/sites/RDSupport/SitePages/Decipher-GUST--Implementing-QS-Logic-Node.aspx#real-answer-attributes\\nhttps://dynatallc.sharepoint.com/sites/RDSupport/SitePages/How-to-add-Real-Answer-attributes-to-Open-End-questions.aspx?\\n\\n" +			//Text/OE questions and the Quality Score

		"Overall Question:	ss:questionClassNames=\\x22\\x22\\n" +
		"Rows:				ss:rowClassNames=\\x22\\x22\\n" +
		"Cols:				ss:colClassNames=\\x22\\x22\\n\\n" +

		"• Zip Code/PII (Name/Address/Email):					ss:rowClassNames=\\x22IsExcluded\\x22\\n" +																			//Exclude from Quality Score
        "• When response is expected to be short (one word):		ss:rowClassNames=\\x22EngagedLength\\x22\\n" +																	//Short one-word answers
        "• When the responses will be brandnames:				ss:rowClassNames=\\x22IsBrandQuestion\\x22\\n\\n" +																	//Brandname answers
        "You can add multiple by simply adding a space between them, i.e: ss:rowClassNames=\\x22IsBrandQuestion IsExcluded\\x22</note>\\n\");}" +								//Example

"if (argType == \"define\") {" +																																							//If using a <define
	"questionTop.push(\"<note>Be aware that to strip out value it is strip=\\x22value\\x22, NOT strip=\\x22values\\x22</note>\");" +														//Give warning
"}" +

//Pulling the latest MXConfig text
"if (argType == \"MXExec\") {mxConfigFunc();}" +

//Adding in jQuery Inection text
"if (argType == \"JQExec\") {jQueryInjectFunc();}" +

//Pulling specified MXTool from "https://survey-d.dynata.com/survey/selfserve/53b/19021138#?"
"if (eval(argMXTool)) {pullMXTool(argMXURL,argRowReq,argColReq,argType,argAnsType,argMXTool,argMXType);}" +

//<exec>p.LoopTracker</exec> & <suspend/>
"if (argType == \"loop\") {loopQuestion(1); questionTop.push(addSuspend());}" +

//<radio/<checkbox/<etc
"if (argType != \"cond\" && argType != \"term\" && argType != \"res\" && argType != \"MXExec\" && argType != \"JQExec\" && !eval(argMXTool)) {questionTop.push(\"<\" + argType + \"\");}"+

//label="Q1" / label="Q1_[loopvar: label]
"if (eval(argLabel)) {questionTop.push(\"  label=\\x22\" + questionLabel(argDummy) + \"\\x22\");}"+

//randomize="0": x = 0/1 (Hard set to 0 by default, when the fuck is 1 normally....)
"if (argRandomise != \"x\") {questionTop.push(questionRandomize());}" +

//optional="x": x = 0/1
"if (argOptional != \"x\") {questionTop.push(questionOptional(argOptional));}" +

//If checkbox and not dummy: atleast="1"
"if (argType == \"checkbox\" && !eval(argDummy) && !eval(argMXTool)) {questionTop.push(\"  atleast=\\x221\\x22\");}" +

//grouping="cols"
"if (jQuery(\"#colGroupingIncluded\").prop(\"checked\")) {questionTop.push(\"  grouping=\\x22cols\\x22\");}"+

//translate="x" --- 1 = noTranslate="comment,title", & translateable="0" --- 2 = nothing --- 3 = translation dummy
"questionTranslate(argTranslate);" +

//where="survey,execute,report"
"if (eval(argDummy)) {questionWhere(argTranslate);}"+

//vars="var1"
"if (argType == \"loop\") {loopQuestion(2);}" +

//ATM1D.9 properties
"if (eval(argATM1D)) {atm1dBuildQuestion(argType);} " +

//If text question: size="25", rowLegend="left"
"if (argType == \"text\") {questionSize(); questionRowLegend();}" +

//If textarea question: height="x", width="x"
"if (argType == \"textarea\" ) {questionHeight(); questionWidth();}" +

//If number (and not autosum)
"if (argType == \"number\" && !eval(argAutoSum) && !eval(argDummy)) {questionSize(); questionRowLegend(); questionPreText(); questionAmount(); questionVerify();} " +

//If autosum
"if (eval(argAutoSum)) {questionTop.push(\"  uses=\\x22autosum.5\\x22\");  questionTop.push(\"  amount=\\x22100\\x22\");  questionSize(); questionPreText(); questionTop.push(\"  autosum:postText=\\x22%\\x22\"); questionTop.push(\"  autosum:sumPreText=\\x22Total:\\x22\"); questionTop.push(\"  autosum:showRemaining=\\x220\\x22\"); questionTop.push(\"  autosum:prefill=\\x220\\x22\"); questionVerify();} " +

//Rizwan said we should start using MLS on studies, I'll forget to do this, so if I add 'mls="english"' as a default, it'll remind me to replace 'english' with whatever on multi-country studies
"if (argMLS == \"1\") {questionTop.push(\"  mls=\\x22english\\x22\");} " +

//Gets the question property, and suffix's it with ">"
"if (questionTop.length > 1)"+
"{" +
	"lastItem = questionTop.pop();" +
	"lastItem = lastItem + \">\" ;" +
	"questionTop.push(lastItem);" +
"}" +

//<title>
"if (eval(argQTRequired)) {questionTop.push(\"  <title>\" + questionText(argTranslate) + \"</title>\");}" +	//Add in <title>Question Text</title> if question requires it

//<comment> - This step is bypassed for certain question types that do not need a <comment>
"if (argType != \"cond\" && argType != \"term\" && argType != \"res\" && argType != \"MXExec\" && argType != \"JQExec\" && !eval(argMXTool))"+
        "{"+
        "if (jQuery(\"#instructionTextOutputBox\").val().length > 0) {questionTop.push(instructionText());}" +
        "}"+

//Loop Question (x)
"if (argType == \"loop\") {loopQuestion(3);}" +

//Dummy placeholder <exec>Script</exec>
"if (eval(argDummy)) {questionTop.push(dummyExecTag(argType,dummyQT,argTranslate));}" +
//
//
//
//
//
//Question PROPERTIES stop being built above...







//Question ANSWERS start being built below...
//
//
//
//
//Below condition makes sure rows/cols aren't built for certain question types that don't need them
"if (argType != \"cond\" && argType != \"term\" && argType != \"MXExec\" && argType != \"JQExec\" && !eval(argMXTool))"+
    "{"+
        "questionTop.push(answerBuildingFunction(argRowReq,argColReq,argType,argAnsType,argMXTool,argMXType));" +
    "}"+
//
//
//
//
//
//Question ANSWERS start being built above...

//Adds in final closing tag </radio>,</checkbox>,</etc>
"if (argType != \"cond\" && argType != \"term\" && argType != \"res\" && argType != \"MXExec\" && argType != \"JQExec\" && !eval(argMXTool)) {questionTop.push(newLogicLine(argType));}" +

"if (argType == \"term\") {questionTop.push(\"<term cond=\\x22\\x22 label=\\x22Term\" + dummyQT + \"\\x22>Term: \" + dummyQT + \"</term>\\n\");}" +	//Builds a <term></term> tag, just to avoid typing out each time

"if (!eval(argMXTool) && argType != \"cond\" && argType != \"MXExec\" && argType != \"JQExec\") {questionTop.push(addSuspend());}" +		//Adds in a closing <suspend/> tag

"if (argType == \"cond\") {questionTop.push(SC_MC_CondBuilder());}" +

		//////////////////////////////////////////////////
		///////////QUESTION IS NOW FULLY BUILT////////////
		///////////PRINT INTO THE QUESTION BOX////////////
        "$ (\"#codeOutputBox\").val(\"\");" +																			//Clear out the Question box

        "if (!eval(argMXTool) && argType != \"cond\"){" +																//If the question is NOT an MX Tool, nor a Condition being built
        "for ( var i = 0, l = questionTop.length; i < l; i++ )" +														//FOR ALL ELEMENTS IN THE QUESTION ARRAY
		"{" +																											//
			"$ (\"#codeOutputBox\").val($ (\"#codeOutputBox\").val() + questionTop[i] + \"\\n\");" +					//PRINT THEM INTO THE BOX, NEW LINE EACH TIME
			"$ (\"#codeOutputBox\").select();" + 																		//SELECT COMPLETED QUESTION
			"document.execCommand('copy');" + 																			//COPY IT TO THE CLIPBOARD
			"document.getSelection().removeAllRanges();" +																//DESELECT THE TEXT
        "}}" +

        "if (!eval(argMXTool) && argType == \"cond\"){" +																//If the question is NOT an MX Tool, and *IS* Condition being built
        "for ( var i = 1, l = questionTop.length; i < l; i++ )" +														//IGNORING 1ST BIT OF PADDING
		"{" +																											//
			"$ (\"#codeOutputBox\").val($ (\"#codeOutputBox\").val() + questionTop[i]);" +								//PRINT THEM INTO THE BOX, NEW LINE EACH TIME
			"$ (\"#codeOutputBox\").select();" + 																		//SELECT COMPLETED QUESTION
			"document.execCommand('copy');" + 																			//COPY IT TO THE CLIPBOARD
			"document.getSelection().removeAllRanges();" +																//DESELECT THE TEXT
        "}}" +

        "if (eval(argMXTool))" +																						//If the question is a MX Tool
		"{" +																											//

		"var delay = 1000;" +																							//Delay to allow time for .load request to call MXSurvey, and pull information
		"setTimeout(function() {" +
			"$ (\"#codeOutputBox\").val($('.dyxml').eq(0).val());" +													//Print out the contents of the tempMXHolders 1st box
			"$ (\"#codeOutputBox\").select();" + 																		//SELECT COMPLETED QUESTION (With delay)
			"document.execCommand('copy');" + 																			//COPY IT TO THE CLIPBOARD (With delay)
			"document.getSelection().removeAllRanges();" +																//DESELECT THE TEXT (With delay)
			"$ ('#tempMXHolder').empty();" +																			//Empty the tempMXHolder box ready for the next time you pull an MX Tool
		"}, delay);" +


        "}" +
		/////////PRINT INTO THE QUESTION BOX DONE//////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////

        "}";																											//END OF QUESTIONBUILDER FUNCTION
	///////////////////QUESTION BUILDING ABOVE//////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////FUNCTIONS BELOW///////////////////////

    //Builds simple conditions, i.e. Q1.r1, Q14.r5, Q28.r8.c3, etc
    var SC_MC_CondBuilder = document.createElement('script');
	SC_MC_CondBuilder.setAttribute('id', 'XMLBoiScript');
    SC_MC_CondBuilder.innerHTML = "function SC_MC_CondBuilder() {" +

		"let QID = prompt(\"Enter QID\", \"\");" +			//The QID
		"let ROW = prompt(\"Enter Rows (comma sep)\");" +	//The Rows
		"let COL = prompt(\"Enter Cols (comma sep)\");" +	//The Cols (if any)
        "let FinalCond = [];" +								//Will hold the final build cond, is added to over time
        "let showDebugCom = 1;" +							//Switch to show output: 1 = SHOW, 0 = HIDE

		"if (showDebugCom) {console.clear();}" +																	//Clarity clear
        "if (showDebugCom) {console.log(\"QID = \" + QID + \", Rows = \" + ROW + \", Cols (if any) = \" + COL);}" +	//Debug output

		"if (ROW.length > 0)" +						//If Rows provided, split by comma
			"{" +									//
				"ROW = ROW.split(\",\");" +			//
			"}" +									//
		"if (COL.length > 0)" +						//If Cols provided, split by comma
			"{" +									//
				"COL = COL.split(\",\");" +			//
			"}" +									//

		"if (showDebugCom) {console.log(\"Rows = \" + ROW + \", # Rows = \" + ROW.length);}" +	//Debug output
		"if (showDebugCom) {console.log(\"Cols = \" + COL + \", # Cols = \" + COL.length);}" +	//Debug output

		"for ( var rows = 0, rowItr = ROW.length; rows < rowItr; rows++ )" +				//Cycle over all of the rows first (Primary)
        	"{" +
        		"var tempCondHolder = [];" +												//Temporary place to piece together the QID.rx.cx before it's spat out into the FinalCond var
        		"if (showDebugCom) {console.log(\"Current row is r\" + ROW[rows]);}"+		//Debug output

                "if (COL.length > 0)" +														//If there are any cols...
        			"{" +
        				"for ( var cols = 0, colItr = COL.length; cols < colItr; cols++ )" +//Cycle over all of the cols second (Secondary)
	        				"{" +
        						"if (showDebugCom) {console.log(\"Current col is c\" + COL[cols]);}"+	//Debug output
        						"tempCondHolder.push(QID + \".r\" + ROW[rows] + \".c\" + COL[cols]);"+	//Build the "QID.rx.cx" cond
							"}" +
					"}" +
				"else" +																	//No cols provided
					"{" +
						"tempCondHolder.push(QID + \".r\" + ROW[rows]);"+					//Build the "QID.rx" part without any ".cx"
					"}" +

        		"FinalCond.push(tempCondHolder);"+											//Build result is added to FinalCond holder
			"}" +

        "FinalCond = FinalCond + \"\";" +													//Convert to string (collapse)
        "FinalCond = FinalCond.replace(/\,/g, ' or ');" +									//Replace every comma with " or "

		"if (showDebugCom) {console.log(\"FinalCond = \" + FinalCond);}"+					//Debug output

        "$ (\"#codeOutputBox\").val(FinalCond);" +
        "$ (\"#codeOutputBox\").select();" +
        "document.execCommand('copy');" +
        "$ (\"#codeOutputBox\").val(\"\");" +
        "return(FinalCond)" +																//Return the final string for printing into question box

        "}";	//END OF WHOLE "SC_MC_CondBuilder" FUNCTION


    //Function for minimising XMLBoi tool
    var hideWholeWindow = document.createElement('script');
	hideWholeWindow.setAttribute('id', 'XMLBoiScript');
	hideWholeWindow.innerHTML = "function hideWholeWindow()" +
		"{" +
	 		"var itemsToHide = [\"questionRow\",\"questionRowStd\",\"questionRowMX\",\"structuralRow\",\"structuralRowHeader\",\"mxRow\",\"optionRow\",\"optionRowHeader\",\"mainQuestionBox\",\"rowBox\",\"colBox\",\"questionTextBox\",\"commentTextBox\"];" +
			"for ( var b = 0, rw = itemsToHide.length; b < rw; b++ )" +
				"{$ (\".\"+ itemsToHide[b] + \"\").toggle();}" +				//Cycle through items in itemsToHide and "toggle" them

			"if ($(\"#hideXMLBoi\").children().eq(0).text() == \"Minimise\")" +
				"{$(\"#hideXMLBoi\").children().eq(0).text(\"Maximise\");}" +	//Change text to Maximise
	 				" else" +
				"{$(\"#hideXMLBoi\").children().eq(0).text(\"Minimise\");}" +	//Change text to Minimise
		"}";


    //Function for opening the XMLBoi tool in a new popup window. This is done to bypass the CORS cross-domain error you get when trying to pull a MXTool on Survey-d, given they're now hosted on Survey-d2
    var popoutWholeWindow = document.createElement('script');
	popoutWholeWindow.setAttribute('id', 'XMLBoiScript');
popoutWholeWindow.innerHTML = `
    function popoutWholeWindow() {
        var html = $('.draggable').prop('outerHTML'); // Get full HTML including the element itself

        // Extract all styles from <style> tags
        var allStyles = "";
        $("style").each(function() {
            allStyles += $(this).html();
        });

        // Extract all scripts with the ID 'XMLBoiScript'
        var allScripts = [];
        $("script#XMLBoiScript").each(function() {
            if ($(this).attr("src")) {
                allScripts.push($(this).attr("src")); // Store external script URLs
            } else {
                allScripts.push($(this).html()); // Store inline script content
            }
        });

        // Open a new window with about:blank
        var w = window.open("about:blank", "_blank", "height=890,width=380,top=0,left=1500");

        // Ensure it's a separate document
        w.document.open();
        w.document.write(\`
            <html>
            <head>
                <title>XMLBoi Window</title>
                <style>
                    \${allStyles} /* Insert all extracted styles */
                    body { background-color: #010405; } /* Set background color */
                </style>
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"><\\/script> <!-- Inject jQuery -->
            </head>
            <body>
                <div id='tempMXHolder' style='visibility: hidden; display: none;'></div>
                \${html}
            </body>
            </html>
        \`);
        w.document.close();

        // Wait until jQuery is loaded in the new window before injecting scripts
        w.onload = function() {
            var doc = w.document;

            // Inject inline scripts
            allScripts.forEach(function(scriptContent) {
                var scriptTag = doc.createElement("script");
                if (scriptContent.startsWith("http")) {
                    scriptTag.src = scriptContent; // External script
                    scriptTag.defer = true;
                } else {
                    scriptTag.innerHTML = scriptContent; // Inline script
                }
                doc.body.appendChild(scriptTag);
            });
        };
    }
`;








    //Function for opening a new popup window that I will put my useful code / notes / etc into, kinda like a mini-wiki of my own making filled with the stuff *I* find useful
    var usefulSyntaxPopup = document.createElement('script');
	//usefulSyntaxPopup.setAttribute('id', 'XMLBoiScript');
usefulSyntaxPopup.innerHTML = `
    function usefulSyntaxPopup() {
        var html = $('.draggable').prop('outerHTML'); // Get full HTML including the element itself

        // Open a new window with about:blank
        var w = window.open("about:blank", "_blank", "height=800,width=1400,top=100,left=250");

        // Ensure it's a separate document
        w.document.open();
        w.document.write(\`
            <html>
            <head>
                <title>Useful Syntax/Notes Wiki</title>
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"><\\/script> <!-- Inject jQuery -->
            </head>
            <body>
                STUFF GOES HERE
            </body>
            </html>
        \`);
        w.document.close();


    }
`;














    //Add a <suspend/> tag
    var addSuspend = document.createElement('script');
	addSuspend.setAttribute('id', 'XMLBoiScript');
    addSuspend.innerHTML = "function addSuspend() {return(\"<suspend/>\");}";

    //Add a loop question
    var loopQuestion = document.createElement('script');
	loopQuestion.setAttribute('id', 'XMLBoiScript');
    loopQuestion.innerHTML = "function loopQuestion(x) {" +
	 //(1) Adds in the exec above the loop which creates the persistent variable used for later punching loop order tracking dummy
	"if (x == 1) {var itemsToAdd = [\"<exec>\",\"p.LoopTracker\" + randomNumber + \" = int(0)\",\"</exec>\",\"\"];}" +
	 //(2) Adds in var1
	"if (x == 2) {var itemsToAdd = [\"  vars=\\x22var1\\x22\"];}" +
	 //(3) Adds in the meat of the loop, the actual question itself
 	"if (x == 3) {var itemsToAdd = [\"  <block label=\\x22blockQuestionLabel\" + randomNumber + \"\\x22>\",\"    <text \",\"    label=\\x22loopLabel_QuestionLabel\" + randomNumber + \"_[loopvar: label]\\x22\",\"    cond=\\x220\\x22\",\"    optional=\\x220\\x22\",\"    randomize=\\x220\\x22\",\"    size=\\x2225\\x22\",\"    translateable=\\x220\\x22\",\"    where=\\x22none\\x22>\",\"      <title>[loopvar:var1]</title>\",\"    </text>\",\"\",\"    <exec>\",\"p.loopVars = \\x22[loopvar:label]\\x22\",\"p.loopNames = [\\x22QuestionLabel\" + randomNumber+ \"\\x22,]\",\"p.loopLabels = loopLabel_QuestionLabel\" + randomNumber+ \"_[loopvar: label].title.split('~')\",\"    </exec>\",\"\",\"\",\"<suspend/>\",\"  <note>#ADD QUESTIONS HERE</note>\",\"\",\"<suspend/>\",\"\",\"\",\"\",\"    <exec>\",            \"dXXXXXXXXXOrder.attr(p.loopVars).val = int(p.LoopTracker\"+randomNumber+\")\"            ,\"p.LoopTracker\"+randomNumber+\" = p.LoopTracker\"+randomNumber+\" + int(1)\",\"\",\"p.loopVars = \\x22[loopvar:label]\\x22\",\"p.loopNames = [\\x22QuestionLabel\" + randomNumber+ \"\\x22,]\",\"p.loopLabels = loopLabel_QuestionLabel\" + randomNumber+ \"_[loopvar: label].title.split('~')\",\"    </exec>\",\"\",\"    <exec>\",\"p.loopVars = \\x22\\x22\",\"p.loopNames = []\",\"p.loopLabels = []\",\"    </exec>\",\"  </block>\",\"\"];}" + //(2)

	"for ( var b = 0, rw = itemsToAdd.length; b < rw; b++ )" +
		"questionTop.push(\"\"+ itemsToAdd[b] + \"\");" +
	"}";

	var questionLabel = document.createElement('script');
	questionLabel.setAttribute('id', 'XMLBoiScript');
    questionLabel.innerHTML = "function questionLabel(argDummy) {" +
	"if(!eval(argDummy)) {return(\"QuestionLabel\" + randomNumber + loopSuffix);}" +	//If not a dummy, generate random QID
	"if(eval(argDummy)) {return(dummyQT + loopSuffix);}}"								//If is a dummy, use text in question text box

	var questionRandomize = document.createElement('script');
	questionRandomize.setAttribute('id', 'XMLBoiScript');
    questionRandomize.innerHTML = "function questionRandomize() {return(\"  randomize=\\x220\\x22\");}";

 	var questionOptional = document.createElement('script');
	questionOptional.setAttribute('id', 'XMLBoiScript');
    questionOptional.innerHTML = "function questionOptional(x) {return(\"  optional=\\x22\" + x + \"\\x22\");}";

 	var questionTranslate = document.createElement('script');
	questionTranslate.setAttribute('id', 'XMLBoiScript');
    questionTranslate.innerHTML = "function questionTranslate(x) {" +
	 //(1) Used for dummies, no translation
	"if(x == 1) {questionTop.push(\"  noTranslate=\\x22comment,title\\x22\",\"  translateable=\\x220\\x22\");}" +
	//(2) Used to just bypass this, does nothing
	"if(x == 2) {}" +
    //(3) Used for translation dummies, no need to translate the title/comment for these dummies, but we do need the rows translated
    "if(x == 3) {questionTop.push(\"  noTranslate=\\x22comment,title\\x22\");}" +
	"}";

	var questionWhere = document.createElement('script');
	questionWhere.setAttribute('id', 'XMLBoiScript');
	questionWhere.innerHTML = "function questionWhere(argTranslate) {" +
		"if (argTranslate != 3) {" +
		"questionTop.push(\"  where=\\x22survey,execute,report\\x22\");}" +

		"if (argTranslate == 3) {" +
		"questionTop.push(\"  where=\\x22survey,execute,notdp\\x22\");}" +
	"}";

  	var questionSize = document.createElement('script');
	questionSize.setAttribute('id', 'XMLBoiScript');
    questionSize.innerHTML = "function questionSize() {questionTop.push(\"  size=\\x2225\\x22\");}";

  	var questionRowLegend = document.createElement('script');
	questionRowLegend.setAttribute('id', 'XMLBoiScript');
    questionRowLegend.innerHTML = "function questionRowLegend() {questionTop.push(\"  rowLegend=\\x22left\\x22\");}";

	var questionHeight = document.createElement('script');
	questionHeight.setAttribute('id', 'XMLBoiScript');
    questionHeight.innerHTML = "function questionHeight() {questionTop.push(\"  height=\\x2210\\x22\");}";

	var questionWidth = document.createElement('script');
	questionWidth.setAttribute('id', 'XMLBoiScript');
    questionWidth.innerHTML = "function questionWidth() {questionTop.push(\"  width=\\x2250\\x22\");}";

	var questionPreText = document.createElement('script');
	questionPreText.setAttribute('id', 'XMLBoiScript');
    questionPreText.innerHTML = "function questionPreText() {questionTop.push(\"  ss:preText=\\x22£\\x22\");}";

	var questionAmount = document.createElement('script');
	questionAmount.setAttribute('id', 'XMLBoiScript');
    questionAmount.innerHTML = "function questionAmount() {questionTop.push(\"  amount=\\x2210\\x22\");}";

	var questionVerify = document.createElement('script');
	questionVerify.setAttribute('id', 'XMLBoiScript');
    questionVerify.innerHTML = "function questionVerify() {questionTop.push(\"  verify=\\x22range(1,99)\\x22\");}";

    //Add a atm1d question
    var atm1dBuildQuestion = document.createElement('script');
	atm1dBuildQuestion.setAttribute('id', 'XMLBoiScript');
    atm1dBuildQuestion.innerHTML = "function atm1dBuildQuestion(argType) {" +
	//Standard atm1d stuff
    //SC
	"if(argType == \"radio\") {var itemsToAdd = [\"\",\"  uses=\\x22atm1d.11\\x22\",\"  atm1d:showInput=\\x220\\x22\",\"  atm1d:viewMode=\\x22vertical\\x22\"  ,\"  atm1d:large_buttonAlign=\\x22center\\x22\"  ,\"  atm1d:large_contentAlign=\\x22center\\x22\"  ,\"  atm1d:small_buttonAlign=\\x22center\\x22\"  ,\"  atm1d:small_contentAlign=\\x22center\\x22\"];}" +
    //MC
	"if(argType == \"checkbox\") {var itemsToAdd = [\"\",\"  uses=\\x22atm1d.11\\x22\",\"  atm1d:numCols=\\x223\\x22\",\"  atm1d:showInput=\\x220\\x22\",\"  atm1d:viewMode=\\x22tiled\\x22\"  ,\"  atm1d:large_buttonAlign=\\x22center\\x22\"  ,\"  atm1d:large_contentAlign=\\x22center\\x22\"  ,\"  atm1d:small_buttonAlign=\\x22center\\x22\"  ,\"  atm1d:small_contentAlign=\\x22center\\x22\"];}" +
	//Adds in the extra stuff if requested
	"if (!jQuery(\"#holdATM1DExtra\").prop(\"checked\")) {var itemsToAdd = [\"\",\"  uses=\\x22atm1d.11\\x22\",\"  atm1d:numCols=\\x223\\x22\",\"  atm1d:showInput=\\x220\\x22\",\"  atm1d:viewMode=\\x22tiled\\x22\",\"\",\"  atm1d:large_minHeight=\\x22200px\\x22\",\"  atm1d:large_maxHeight=\\x22200px\\x22\",\"  atm1d:large_minWidth=\\x22200px\\x22\",\"  atm1d:large_maxWidth=\\x22200px\\x22\",\"\",\"  atm1d:small_minHeight=\\x22200px\\x22\",\"  atm1d:small_maxHeight=\\x22200px\\x22\",\"  atm1d:small_minWidth=\\x22200px\\x22\",\"  atm1d:small_maxWidth=\\x22200px\\x22\",\"\",\"  atm1d:large_buttonAlign=\\x22center\\x22\",\"  atm1d:large_contentAlign=\\x22center\\x22\",\"  atm1d:small_buttonAlign=\\x22center\\x22\",\"  atm1d:small_contentAlign=\\x22center\\x22\"];}" +

	 "for ( var b = 0, rw = itemsToAdd.length; b < rw; b++ )" +
			"questionTop.push(\"\"+ itemsToAdd[b] + \"\");" +
	"}";

    var questionText = document.createElement('script');
	questionText.setAttribute('id', 'XMLBoiScript');
    questionText.innerHTML = "function questionText(argTranslate) {" +

    "var finalQT = \"\";" +										//Holds final user-given question text
    "var QText = jQuery(\"#questionTextOutputBox\").val();" +	//Get contents of question text box
    "QText = QText.split(\"\\n\");" +							//Split it line-by-line

    "if (jQuery(\"#questionTextOutputBox\").val().length > 0)" +					//If question text was provided by user
	"{" +
        "for ( var itr = 0, txtLine = QText.length; itr < txtLine; itr++ )" +		//Cycle over all text (\n) line break by line break
		"{" +

			"if (QText[itr].length > 0) {finalQT = finalQT + QText[itr].trim();}" +		//Trim away any excess space

			"if (itr < txtLine - 1)" +													//If not the last line
				"{"+
					"try {" +
						"if (QText[itr].length > 0 && QText[itr + 1].length > 0) {finalQT = finalQT + \"<br/>\\n\"}" +		//adds <br/> if line following this one has text
						"if (QText[itr].length > 0 && QText[itr + 1].length < 1) {finalQT = finalQT + \"<br/><br/>\\n\"}" +	//adds <br/><br/> if line following this one is blank
					"}" +
					"catch (err) { \"\" } " +

					"if (QText[itr].length < 1) {finalQT = finalQT + \"\\n\"}" +		//If there is no text to show (new line)
				"}"+

		"}" +

		//You already tried to use a for-loop to do this, but it doesn't play nicely with the special characters, this is the only way :'(
		"finalQT = finalQT.replace(/…/g, '...');" +						//… with ...
		"finalQT = finalQT.replace(/\\x5B/g, '(');" +					//[ with (
		"finalQT = finalQT.replace(/\\x5D/g, ')');" +					//] with )
		"finalQT = finalQT.replace(/\\x3C/g, '(');" +					//< with (
		"finalQT = finalQT.replace(/\\x3E/g, ')');" +					//> with )
		"finalQT = finalQT.replace(/\\x28br\\x2F\\x29/g, '<br/>');" +	//Adds back in the <br/> after the above

		"if (argTranslate == 3)" +										//If a translation dummy, add that information in
			"{" +
				"var tempFinalQT = finalQT + \": Translation Dummy for \" + finalQT.substring(1);" +
				"finalQT = tempFinalQT;" +
			"}" +

		"return(finalQT);" +									//Return final formatted text
    "}" +
		"else {return(\"QuestionText\");}" +					//Else just return QuestionText
	"}";

    var instructionText = document.createElement('script');
	instructionText.setAttribute('id', 'XMLBoiScript');
    instructionText.innerHTML = "function instructionText() {" +
    "var finalIT = \"\";" +											//Holds final user-given instruction text
    "var IText = jQuery(\"#instructionTextOutputBox\").val();" +	//Get contents of instruction text box
    "IText = IText.split(\"\\n\");" +								//Split it line-by-line

    "if (jQuery(\"#instructionTextOutputBox\").val().length > 0) {" +				//If question text was provided by user
        "for ( var itr = 0, txtLine = IText.length; itr < txtLine; itr++ ) {" +		//Cycle over all text line-by-line
		    "if (IText[itr].length > 0) {finalIT = finalIT + IText[itr].trim();}" +	//Add the text to finalIT
		    "if (itr < txtLine - 1) {finalIT = finalIT + \"<br/>\"}" +				//If it is -NOT- the last item, add a <br/> (remember, we're going line-by-line)
			"if (itr < txtLine - 1) {finalIT = finalIT + \"\\n\"}" +				//Break onto new line so question text is formatted in XML as per questionnaire. Easier to work with for user.
		"}" +																		//
    "if (jQuery(\"#instructionTextOutputBox\").val().length > 0) {" +				//Add in the start/end parts
		"finalIT = \"  <comment><em>\" + finalIT + \"</em></comment>\"" +			//
		"}" +																		//

	"return(finalIT);}" +											//Return the final string
	"}";															//

	var pullMXTool = document.createElement('script');
	pullMXTool.setAttribute('id', 'XMLBoiScript');
    pullMXTool.innerHTML = "function pullMXTool(argMXURL,argRowReq,argColReq,argType,argAnsType,argMXTool,argMXType) {" +
	    "$('#tempMXHolder').load(argMXURL + ' .dyxml');"+									//Pull the legit tools from the link you'd otherwise have copy-pasted from
		"$('#tempMXHolder').css({\"visibility\": \"hidden\", \"display\": \"none\"});"+		//Hide nastyass boxes
		"console.log(\"argMXType = \" + argMXType);" +


		"var delay = 750;" +								//Wait 750 before doing anything to allow .load enough time to pull the info through
		"setTimeout(function() {" +							//

			"var modifiedMXTool = $('.dyxml').eq(0).val();" +						//Original (unmodified) MX Tool
			"var answersAdded = 0;" +												//Flag to indicate rows have been added (so they aren't added multiple times)
			"var numOfr1Rows = 0;" +												//Some MX tools have more than 1 set of answers (order/time dummies), so search for more than 1 instance of <row label="r1"
			"var QTModifier = 0;" +													//The Ranking MX Tool uses the mxRankingDummy function to add a dummy above it, this dummy contains a <title> too, so this is used to skip the first (dummy version) of <title>

			"if (argMXType == \"Ranking\") {" +										//If the question is a Ranking type, add in the Ranking Dummy you use for Maximum allowed selections
				"modifiedMXTool = mxRankingDummy() + modifiedMXTool;}" +

			"modifiedMXTool = modifiedMXTool + \"<suspend/>\";" +					//Add suspend tag to end
			"modifiedMXTool = modifiedMXTool.split(\"\\n\");" +						//Split out by line

			"for ( var itrMX = 0, curMX = modifiedMXTool.length; itrMX < curMX; itrMX++ ) {" +		//Look over every line to deal with any MXBullshit that you don't want, or want to change
																										//
																										//

				"if (modifiedMXTool[itrMX].includes(\"<radio\") || modifiedMXTool[itrMX].includes(\"<checkbox\"))" +//Cleans up the tags for alignment, not required, just looks better
					"{" +																					//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].slice(2);" +							//Removes first two characters to bring <radio/<checkbox into alignment with <title/<comment
	       			//"QTModifier++;" +																		//
					"}" +																					//
																											//

				"if (modifiedMXTool[itrMX].includes(\"<title>\"))" +									//<title>
					"{" +																					//
						"if (argMXType == \"Ranking\" && QTModifier == 1) {" +								//If MX Tool is a "Ranking" type, skip over the first <title>, as you're adding a dummy via the mxRankingDummy function
						"modifiedMXTool[itrMX] = \"  <title>\" + questionText() + \"</title>\";" +			//

						"}" +																				//
						"if (argMXType != \"Ranking\") {" +													//If NOT a Ranking
						"modifiedMXTool[itrMX] = \"  <title>\" + questionText() + \"</title>\";" +			//
						"}" +																				//
	       			"QTModifier++;" +																		//
					"}" +																					//
																											//
				"if (modifiedMXTool[itrMX].includes(\"<comment>\"))" +									//<comment> (Tried usign splice to remove, wasn't having it)
					"{" +																							//
						"try {if(instructionText().length > 0) {modifiedMXTool[itrMX] = instructionText();}}" +		//
						"catch(err) {modifiedMXTool[itrMX] = \"\";}" +												//
					"}" +																							//
																													//
				"if ( (modifiedMXTool[itrMX].includes(\"<note>\")) || " +								//<note> Useless bloody things, remove them
				"(modifiedMXTool[itrMX].includes(\"<group\")) )" +										//<group These things too!
					"{" +																					//
						"modifiedMXTool[itrMX] = \"\";" +													//
					"}" +																					//
																											//
				"if (modifiedMXTool[itrMX].includes(\"atmost\"))" +										//Cut out the most="x", it only causes issues with SST
					"{" +																							//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"atmost=\\x223\\x22\", \"\");" +	//Remove atmost="3" (RANKING USES 3)
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"atmost=\\x224\\x22\", \"\");" +	//Remove atmost="4"
					"}" +																							//
				"if (modifiedMXTool[itrMX].includes(\"shuffle=\\x22rows\\x22\") && argMXType == \"Ranking\")" +		//RANKING ONLY: add the entry condition before shuffle="rows", based on the MinItems dummy
					"{" +																										 //
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"shuffle=\\x22rows\\x22\", \"cond=\\x22hcollapsibleRankingMinItems.ival gt 1\\x22 shuffle=\\x22rows\\x22\");" +//Set to number in the dummy made by mxRankingDummy
					"}" +																										 //
				"if (modifiedMXTool[itrMX].includes(\"maxAllowed\") && argMXType == \"Ranking\")" +					//RANKING ONLY: maxAllowed, used at the Ranking question, setting it to the number of items in the question itself
					"{" +																										 //
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"3\", \"${hcollapsibleRankingMinItems.val}\");" +//Set to number in the dummy made by mxRankingDummy
					"}" +																										 //
				"if (modifiedMXTool[itrMX].includes(\"minRequired\") && argMXType == \"Ranking\")" +				//RANKING ONLY: minRequired, used at the Ranking question, setting it to the number of items in the question itself
					"{" +																										 //
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"1\", \"${hcollapsibleRankingMinItems.val}\");" +//Set to number in the dummy made by mxRankingDummy
					"}" +																										 //
				"if (modifiedMXTool[itrMX].includes(\"\\x22medium\\x22: 3\") && argMXType == \"Ranking\")" +		//RANKING ONLY: changes the number of items to show on "medium" screens to be same as min items dummy
					"{" +																																				//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"3\", \"${hcollapsibleRankingMinItems.val}\");" +	//Set to number in the dummy made by mxRankingDummy
					"}" +																										 										//
				"if (modifiedMXTool[itrMX].includes(\"\\x22large\\x22: 3\") && argMXType == \"Ranking\")" +			//RANKING ONLY: changes the number of items to show on "large" screens to be same as min items dummy
					"{" +																																				//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"3\", \"${hcollapsibleRankingMinItems.val}\");" +	//Set to number in the dummy made by mxRankingDummy
					"}" +																										 										//
				"if (modifiedMXTool[itrMX].includes(\"maxAllowed\") && argMXType == \"SCTextSelector\")" +			//SC TEXT SELECTOR ONLY: maxAllowed, set to 1 as it's a SC
					"{" +																										//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"4\", \"1\");" +								//Set to 1
					"}" +																										//
				"if (modifiedMXTool[itrMX].includes(\"maxAllowed\") && argMXType == \"MCTextSelector\")" +			//MC TEXT SELECTOR ONLY: maxAllowed, set to 99 as it's a MC
					"{" +																										//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"4\", \"99\");" +								//Set to 99
					"}" +																										//

				"if (modifiedMXTool[itrMX].includes(\"rowItemMargin: 35,\") && (argMXType == \"SCCarousel\") || argMXType == \"MCCarousel\")" +						//SC/MC CAROUSEL ONLY: adding in "animationSpeed: 250,", as the latest update removed it for some reason
					"{" +																																			//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"rowItemMargin: 35,\", \"rowItemMargin: 35,\\n        animationSpeed: 250,\");" +	//Inject animationSpeed: 250,
					"}" +																																			//
				"if (modifiedMXTool[itrMX].includes(\".answers{display:none;}\") && argMXType == \"Slider\")" +						//SLIDER ONLY: Adds to the CSS already present to make the grabber invisible until you click on the slider itself
					"{" +																													//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\".answers{display:none;}\"," +								//Get the first bit of CSS, and add it back in, with the hidden grabber css suffixed onto the end
						"\".answers{display:none;}\\n  .mx-slider-container .mx-noUiSlider .noUi-handle{opacity:0 !important;}\\n" +		//
    					"  .mx-slider-container.mx-slider-answered .mx-noUiSlider .noUi-handle{opacity:1 !important;}\");" +				//
					"}" +																							//


				"if (modifiedMXTool[itrMX].includes(\"animationSpeed\"))" +								//Updates animation speed from 500, to 250, makes it snappier 💃🏻
					"{" +																							//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"500\", \"250\");" +				//Replace 500 with 250
					"}" +																							//
				"if (modifiedMXTool[itrMX].includes(\"Height\"))" +										//itemHeight, and scaleHeight
					"{" +																							//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"100px\", \"100px\");" +			//itemHeight, default is 100, change to 230px
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"60px\", \"75px\");" +				//scaleHeight, default is 60, change to 120px
					"}" +																							//
				"if (modifiedMXTool[itrMX].includes(\"Width\"))" +										//itemWidth, and scaleWidth
					"{" +																							//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"130px\", \"230px\");" +			//itemWith, default is 130, change to 230px
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"120px\", \"120px\");" +			//itemWith, default is 120, change to 120px
					"}" +																							//
				"if (modifiedMXTool[itrMX].includes(\"showInput\"))" +									//showInput, used to hide the little box that you can type into, never use it
					"{" +																							//
						"modifiedMXTool[itrMX] = modifiedMXTool[itrMX].replace(\"true\", \"false\");" +				//true to false (hidden)
					"}" +																							//
				"if ( (modifiedMXTool[itrMX].includes(\"<row\")) ||" +									//Remove the <rows
				"(modifiedMXTool[itrMX].includes(\"<col\")) )" +										//Remove the <cols
					"{" +																					//
																											//
						"if (modifiedMXTool[itrMX].includes(\"\\x22r1\\x22\")) {" +							//Searching for "r1", in-case there are order/time/etc dummies with same answerlist that needs replacing
							"numOfr1Rows = numOfr1Rows + 1;" +
							"console.log(\"numOfr1Rows = \" + numOfr1Rows);" +
						"}" +

						"if (answersAdded == numOfr1Rows) {" +												//
							"modifiedMXTool[itrMX] = \"\";" +												//After adding answers, remove rest of default answer options
						"}" +																				//

						"if (answersAdded < numOfr1Rows && jQuery(\"#rowOutputBox\").val().trim().length > 0) {" +	//Answers not yet added, but have been given by user
							"modifiedMXTool[itrMX] = \"\";" +												//Remove original answers/cols
							"modifiedMXTool[itrMX] = answerBuildingFunction(argRowReq,argColReq,argType,argAnsType,argMXTool,argMXType);" +	//add our own
							"answersAdded = answersAdded + 1;" +											//Set flag so it isn't repeated
						"};" +																				//

					"}" +																					//
				"}" +

		"$('.dyxml').eq(0).val(\"\");" +

		"for ( var xxx = 0, yyy = modifiedMXTool.length; xxx < yyy; xxx++ ) {" +
				"if (modifiedMXTool[xxx].length > 0) {" +
				"$('.dyxml').eq(0).val( $('.dyxml').eq(0).val() + modifiedMXTool[xxx] +  \"\\n\" );" +						//Put modified text back into the dyxml box
			"}}" +

		"}, delay);" +										//Woo done!
		"}";

	var logicBuilder = document.createElement('script');
	logicBuilder.setAttribute('id', 'XMLBoiScript');
    logicBuilder.innerHTML = "function logicBuilder() {" +
		"var QIDList = jQuery(\".QIDClass\").val();" +				//QID
		"var ROWList = jQuery(\".RowClass\").val().split(\",\");" +	//Rows
		"var QIDList = jQuery(\".logicRPrefix\").val();" +			//Row Prefix
		"var COLList = jQuery(\".ColClass\").val().split(\",\");" +	//Cols
		"var QIDList = jQuery(\".logicCPrefix\").val();" +			//Col Prefix
		"var RowFinalList = [];" +									//Final parsed out list
		"var ColFinalList = [];" +									//Final parsed out list

		//Below code parses out all of the rows and makes a list of them
		"for ( var itrRow = 0, rowNum = ROWList.length; itrRow < rowNum; itrRow++ ) {" +
			"if (ROWList[itrRow].includes(\"-\"))" +
				"{" +
					"var splitNum = ROWList[itrRow].split(\"-\");" +
					"var startingNum = splitNum[0];" +
					"var endingNum = splitNum[1];" +
					"endingNum++;" +
					"for ( var itrHyphenRow = startingNum, rowHyphenNum = endingNum; itrHyphenRow < rowHyphenNum; itrHyphenRow++ ) {RowFinalList.push(itrHyphenRow)}" +
				"}" +
			"else {RowFinalList.push(ROWList[itrRow])}" +
		"}" +

		//Below code parses out all of the cols and makes a list of them
		"for ( var itrCol = 0, colNum = COLList.length; itrCol < colNum; itrCol++ ) {" +
			"if (COLList[itrCol].includes(\"-\"))" +
				"{" +
					"var splitNum = COLList[itrCol].split(\"-\");" +
					"var startingNum = splitNum[0];" +
					"var endingNum = splitNum[1];" +
					"endingNum++;" +
					"for ( var itrHyphenCol = startingNum, colHyphenNum = endingNum; itrHyphenCol < colHyphenNum; itrHyphenCol++ ) {ColFinalList.push(itrHyphenCol)}" +
				"}" +
			"else {ColFinalList.push(COLList[itrCol])}" +
		"}" +

	"jQuery(\"#dragZoneLogicBuilder\").toggle();" +

	"}";

	var newLogicLine = document.createElement('script');
	newLogicLine.setAttribute('id', 'XMLBoiScript');
    newLogicLine.innerHTML = "function newLogicLine(argType) {return(\"</\" + argType + \">\")}";

	var closingTagFunc = document.createElement('script');
	closingTagFunc.setAttribute('id', 'XMLBoiScript');
    closingTagFunc.innerHTML = "function closingTagFunc() {$('[class^=logicBuilderRow]:last').clone().insertAfter($('[class^=logicBuilderRow]:last')).find(\"input[type='text']\").val(\"\")}";


	var rmvLogicLine = document.createElement('script');
	rmvLogicLine.setAttribute('id', 'XMLBoiScript');
    rmvLogicLine.innerHTML = "function rmvLogicLine(passedVal) {passedVal.remove();}";

	var dummyExecTag = document.createElement('script');
	dummyExecTag.setAttribute('id', 'XMLBoiScript');
    dummyExecTag.innerHTML = "function dummyExecTag(argType,dummyQT,argTranslate) {" +
	"dummyExecArray = dummyExecArray + \"  <exec>\\n\";" +															//
	"if(argType == \"radio\") {dummyExecArray = dummyExecArray + dummyQT + loopSuffix +\".val = None		#Clear out this dummy\\n\";}" +																				//SC specific
	"if(argType == \"checkbox\" || argType == \"text\" || argType == \"number\") {dummyExecArray = dummyExecArray + \"for clearRows in \" + dummyQT + loopSuffix + \".rows:				#Clear out this dummy\\n\"};" +	//MC/Text/Number specific
	"if(argType == \"checkbox\") {dummyExecArray = dummyExecArray + \"	\" + dummyQT + loopSuffix + \".attr(clearRows.label).val = None	#\\n\";}" +																		//MC specific
	"if(argType == \"text\" || argType == \"number\") {dummyExecArray = dummyExecArray + \"	\" + dummyQT + loopSuffix + \".attr(clearRows.label).val = \\x22\\x22	#\\n\";}" +											//Text specific

	"dummyExecArray = dummyExecArray + \"\\n\";" +																	//
	"if (argTranslate == 3)" +																						//Extra info for translation dummies, my own reminders!
		"{" +																											//
			"if (argType == \"radio\")" +																				//SC
				"{" +																									//
        			"dummyExecArray = dummyExecArray + \"#SC: Use when only ONE pipe in question, else use MC\\n\";" +	//
        			"dummyExecArray = dummyExecArray + \"#remember to use whole sentences, not pick-n-mix!\\n\";" +		//
        			"dummyExecArray = dummyExecArray + \"#Call via [pipe: \"+ dummyQT +\"]\\n\\n\";" +					//
				"}" +																									//
			"if (argType == \"checkbox\")" +																			//MC
				"{" +																									//
        			"dummyExecArray = dummyExecArray + \"#MC: Use when MULTIPLE pipes in question\\n\";" +				//
        			"dummyExecArray = dummyExecArray + \"#remember to use whole sentences, not pick-n-mix!\\n\";" +		//
					"dummyExecArray = dummyExecArray + \"#Call via ${\\x22 \\x22 \+ \" + dummyQT + \".r1.text if \" + dummyQT + \".r1 else \\x22\\x22}\\n\\n\";" +	//
				"}" +																									//
		"}" +																											//

	"dummyExecArray = dummyExecArray + \"#REST OF CODE GOES HERE\\n\";" +											//
	"dummyExecArray = dummyExecArray + \"  </exec>\\n\";" +															//
	"return(dummyExecArray);" +																						//
	"}";																											//END

	var answerBuildingFunction = document.createElement('script');
	answerBuildingFunction.setAttribute('id', 'XMLBoiScript');
    answerBuildingFunction.innerHTML = "function answerBuildingFunction(argRowReq,argColReq,argType,argAnsType,argMXTool,argMXType) {" +
	//Add "Placeholder" items if required for the question type you're trying to build
	"if (argRowReq == 1 && jQuery(\"#rowOutputBox\").val().length < 1) {jQuery(\"#rowOutputBox\").val(\"Placeholder 1 \\nPlaceholder 2\"); console.log(\"Row Vals\");};" + //ROWS
	"if (argColReq == 1 && jQuery(\"#colOutputBox\").val().length < 1) {jQuery(\"#colOutputBox\").val(\"Placeholder 1 \\nPlaceholder 2\"); console.log(\"Col Vals\");};" + //COLS

	//Get contents of row box / col box
	"var rowText = jQuery(\"#rowOutputBox\").val();" +
	"var colText = jQuery(\"#colOutputBox\").val();" +

	//New line "\n" splitting of rows / cols
	"rowText = rowText.split(\"\\n\");" +																		//Split rows by \n new line
	"if (colText.indexOf(\"\\n\") >= 0) {colText = colText.split(\"\\n\");}" +									//If there are \n (new lines) detected, split cols by line
	"if (colText.indexOf(\"	\") >= 0 && colText.indexOf(\"\\n\") <= 1) {colText = colText.split(\"	\");}" +	//If tabs are detected (and 1 or fewer new lines), split by tab (to acc for tables in Word)

	//Whether to include value="x" in the rows, or cols 0-NO, 1-YES
	"var includeRowValue = 0; " +
	"var includeColValue = 0; " +
	//Logic for when to include value="x" in a row / col
	"if ((argType == \"radio\" && colText.length < 2) || (argType == \"define\")) {includeRowValue = 1;}" +	//If SC, and columns -are not- given OR Reusable answerlist
	"if (argType == \"radio\" && colText.length > 0) {includeColValue = 1;}" +								//SC, and columns -are- given

	//Which elements are being built? Rows, Cols, or Both?
	"var boxesToCheck = [];" +																//Which boxes to check
	"if (jQuery(\"#rowOutputBox\").val().length > 0) { boxesToCheck.push(\"row\")}" +		//Check the row box
	"if (jQuery(\"#colOutputBox\").val().length > 0) { boxesToCheck.push(\"col\")}" +		//Check the col box

	"var answerArrayFinal = [];" +															//Holds the final thing to be returned

	//For each thing in boxesToCheck (Either rows, cols, or both)
	"for ( var x = 0, boxes = boxesToCheck.length; x < boxes; x++ ) {" +				//Cycles over each (filled in) row / col answer boxes
																							//
		"var answerCode = 0;" +																//Precode; used in things like label="r0", value="0", resets to zero when switching to next box (row / col)
		"var answerArrayOutside = [];" +													//Holds the current box as it is being built
																							//
		"for ( var b = 0, rw = eval(boxesToCheck[x] + \"Text.length\"); b < rw; b++ ) {" +	//Loop over each \n line for whichever box (row / col) is being checked
																								//
			"var answerArray = [];" +															//Holds the current individual row/col line as it is being built
			"var currentText = eval(boxesToCheck[x] + \"Text[b].trim()\");" +					//The answer text itself to show to respondents
			"var txLwr = currentText.toLowerCase();" +											//Lowercase version of above: Used only for checking keywords to add any extra properties
																									//
			"if (currentText.length > 0) {" +														//If there is any text
																									//


				"if ($.isNumeric(currentText.slice(0,1))) {" +									//If the very first character is a number
					"answerCode = currentText.slice(0,1);" +										//Make that number the precode
					"currentText = currentText.substring(1, currentText.length);" +					//Remove the number from the currentText
					"while ($.isNumeric(currentText.slice(0,1))) {" +									//While the 1st character remains a number
						"answerCode = answerCode + currentText.slice(0,1);" +							//For double digits, keep the initial number too!
						"currentText = currentText.substring(1, currentText.length);" +					//Remove the number from the currentText
				"}}" +																					//
				"else {" +																		//Otherwise
					"answerCode = answerCode + 1;" +												//Just bump precode up by 1 for each new item
				"};" +																				//


				//Building FIRST part of answer option below
				"if (boxesToCheck[x] == \"col\") {answerArray.push(\"  <col\");}" +																//<col
				"else {answerArray.push(\"  <\" + argAnsType + \"\");}" +																		//<row/<choice/<res/<looprow

																																				//
				"if (boxesToCheck[x] == \"col\") {answerArray.push(\" label=\\x22c\" + answerCode + \"\\x22\");}" +								//label="c1"
				"if (argAnsType != \"choice\" && boxesToCheck[x] == \"row\") {answerArray.push(\" label=\\x22r\" + answerCode + \"\\x22\");}" +	//label="r1"
				"if (argAnsType == \"choice\" && boxesToCheck[x] == \"row\") {answerArray.push(\" label=\\x22ch\" + answerCode + \"\\x22\");}" +//label="ch1"
																																				//
				"if (includeColValue == 1 && boxesToCheck[x] == \"col\") {answerArray.push(\" value=\\x22\" + answerCode + \"\\x22\");}" +		//<col value="1"

				"if (includeColValue == 1 && boxesToCheck[x] == \"col\" && currentText.length < 3) {answerArray.push(\" translateable=\\x220\\x22\");}" +		//<col translateable="0" (If len of text < 3)

				"if (includeRowValue == 1 && boxesToCheck[x] == \"row\") {answerArray.push(\" value=\\x22\" + answerCode + \"\\x22\");}" +		//<row value="1"
																																				//
																																				//
																																				//Other Specify check
				"if ((txLwr.includes(\"please\") && txLwr.includes(\"specify\")) || (answerCode == 98)) {" +									//If the current line being worked on has "please" and "specify" -OR- is standard OE code 98
					"answerArray.push(\" open=\\x221\\x22\");" +																					//open="1"
					"answerArray.push(\" openSize=\\x2225\\x22\");" +																				//openSize="25"
					"answerArray.push(\" randomize=\\x220\\x22\");"+																				//randomize="0"
					"if (eval(argMXTool)) {answerArray.push(\" openOptional=\\x221\\x22\");}" + 													//And -IS- an MX Tool - openOptional="1"
					"if ((argMXType == \"SCCarousel\") || (argMXType == \"MCCarousel\")) {answerArray.push(\" optional=\\x221\\x22\");}"+			//And -IS- an MX Tool - optional="1"
					"if ((argMXType == \"SCCarousel\") || (argMXType == \"MCCarousel\")) {currentText = currentText + \"{@optional::true||openOptional::true@}\";}" +	//And -IS- an MX Tool - {@optional::true||openOptional::true@}
				"}" +																															//
																																				//
																																				//Exclusive check
		"if ((txLwr.includes(\"don't\") && txLwr.includes(\"know\")) || " +																		//If has "don't" and "know"
		"(txLwr.includes(\"none\") && txLwr.includes(\"above\")) ||" +																			//Or "none" and "above"
		"(txLwr.includes(\"not\") && txLwr.includes(\"sure\")) ||" +																			//Or "not" and "sure"
		"(txLwr.includes(\"none\") && txLwr.includes(\"these\")) ||" +																			//Or "none" and "these"
		"((txLwr.includes(\"don’t\") || txLwr.includes(\"don't\")) && txLwr.includes(\"remember\")) ||" +										//Or "don't" and "remember"
		"(txLwr.includes(\"prefer\") && txLwr.includes(\"not\") && txLwr.includes(\"to\")) ||" +												//Or "prefer" and "not", and "to"
		"(answerCode == 96 || answerCode == 97 || answerCode == 99)) {" +																		//Or includes standard exclusive precodes 96/97/99
																																				//
			"if (!eval(argMXTool)) {" + 																										//And is -NOT- an MX Tool
				"answerArray.push(\" exclusive=\\x221\\x22\");" +																					//+ exclusive="1"
				"answerArray.push(\" randomize=\\x220\\x22\");}" +																					//+ randomize="0"
																																				//
			"if (eval(argMXTool) && (argMXType == \"MCTextSelector\" || argMXType == \"Ranking\")) {" + 										//And -IS- an MX Tool, and MC Text Selector/Ranking
				"currentText = currentText + \"{@globalExclusive::true@}\";}" +																		//+ {@globalExclusive::true@} (WORKS FOR MC TEXT SELECTOR, & RANKING ONLY)
			"if (eval(argMXTool) && (argMXType != \"MCTextSelector\" && argMXType != \"Ranking\")) {" + 										//And -IS- an MX Tool, and MC Carousel
				"currentText = currentText + \"{@exclusive::scales@}\";}" +																			//+ {@exclusive::scales@} (MC CAROUSEL ONLY)
		"}" +																																	//
																																				//
		"answerArray.push(\">\");" +																											//>: End chevron of FIRST part of answer option
		//Building FIRST part of answer option above


		//Building MIDDLE part of answer option below (Bit respondent sees)
		"currentText = currentText.replace(/&/g, '&amp;');" +																					//Convert & to "&amp;" else Decipher will freak out, delete your life, and maybe even crash :O

		"while (currentText.slice(0,1) == \".\") {" +																							//If the very first character is a full stop
			"currentText = currentText.substring(1, currentText.length);" +																		//Remove it
		"}" +																																	//

        "if (boxesToCheck[x] == \"col\" && argMXType == \"Slider\") {" +																		//If an MX Slider, add in {@customValue::x@} as a safety-net
        	"currentText = \"{@customValue:: \" + answerCode + \"@}\" + currentText;"+															//in case the scales don't have any numbers in them.
        "}"+																																	//

        "if (currentText.includes(\"__\")) {"+																									//If two underscores are joined, it's likely the ______ of an "Other Specify"
        	"currentText = currentText.replace(/_/g, '');"+																						//So replace -ALL- underscores with blank, if it's wrong, it'll be picked up in testing
        "}"+																																	//but it's far more likely to just remove the underscores in "Other Specify" logic.


		"if (currentText.includes(\"[\"))"+																										//Triggers if [square brackets] are detected, as these often hold programming notes
			"{" +																																//
        		"for ( var xyy = 0, l = currentText.length; xyy < l; xyy++ )"+																	//Go over each character
					"{"+																														//
						"var openBracket = 0;"+																									//
						"if (currentText[xyy] == \"[\")"+																						//If square bracket found
							"{"+																												//
        						"openBracket = xyy;"+																							//Find its position in the string
        					"}"+																												//
						"if (openBracket > 0)"+																									//Once found
							"{"+																												//
	        					"currentText = currentText.slice(0, openBracket);"+																//Slice everything -UP TO- that point, and disregard everthing from the square bracket onwards
        						"break;" +																										//Stop further checks
	        				"}"+																												//
					"}"+																														//
	        "}"+																																//

			"currentText = currentText.trim();" +																								//Final trim clean before use

		"if (argType != \"loop\") {answerArray.push(currentText);}" +																			//If we're not building a loop, just insert the answer text
																																				//
		"if (argType == \"loop\") {" +																											//If is a loop however...
			"answerArray.push(\"        <loopvar name=\\x22var1\\x22>\");" +																		//Add in the regular loop stuff
			"answerArray.push( currentText);" +																										//Then the answer text
			"answerArray.push(\"</loopvar>        \");" +																							//Then close the regular loop stuff
		"}" +																																	//
		//Building MIDDLE part of answer option above


		//Building END part of answer option below
		"if (boxesToCheck[x] == \"col\") {answerArray.push(\"</col>\");}" +																		//Closing: </col>
		"else {answerArray.push(\"</\" + argAnsType + \">\");}" +																				//Closing: </row>/</choice>/</res>/</looprow>
		//Building END part of answer option above

		"if (b + 1 != rw) {answerArray = answerArray.join(\"\") + \"\\n\";}" +																	//Everything that has a beginning, has an end....Also a middle I guess....Let's join them all up :D
		"else {answerArray = answerArray.join(\"\");}" +																						//Without new line \\n if it's the last one! Else you get an annoying space that stands out and fucks with your CDO.
		"answerArrayOutside.push(answerArray);" +
		"}" +																																	//End of current line (\n) in current box (row / cols)
	"}" +																																	//End of current box (row / cols), go to next

	"if (x + 1 != boxes) {answerArrayOutside = answerArrayOutside.join(\"\") + \"\\n\";}" +													//Same as above
	"else {answerArrayOutside = answerArrayOutside.join(\"\");}" +																			//Same as above

//	"answerArrayOutside = answerArrayOutside.join(\"\");" +
	"answerArrayFinal.push(answerArrayOutside);" +
"}" +																																	//End of all boxes

"answerArrayFinal = answerArrayFinal.join(\"\");" +																					//Joins up final answerlist
"return(answerArrayFinal);" +																										//Returns it
"}"; 																																//End of answerBuildingFunction

/*
REMOVED, AS IT WAS JUST ANNOYING AS FUCK, WOULD ACCIDENTALLY
CLICK AND IT'D MAKE THE WHOLE SECTION VANISH. WTF WAS I THINKING.
    var hideSpecificRow = document.createElement('script');
    hideSpecificRow.innerHTML = "function hideSpecificRow(rowToHide) {" +
		"jQuery(\".\"+rowToHide+\"\").toggle(\"100\");" +
	"}";															//
*/
    var mxConfigFunc = document.createElement('script');
	mxConfigFunc.setAttribute('id', 'XMLBoiScript');
    mxConfigFunc.innerHTML = "function mxConfigFunc() {" +
	    "$('#tempMXHolder').load('https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=mxjGTT001_1 .dyxml');"+			//Pull the legit tools from the link you'd otherwise have copy-pasted from
		"$('#tempMXHolder').css({\"visibility\": \"hidden\", \"display\": \"none\"});"+												//Hide nastyass boxes
																																	//
		"var delay = 1000;" +																										//Delay to allow time for .load request to call MXSurvey, and pull information
		"setTimeout(function() {" +																									//
			"$('.dyxml').eq(0).val(\"\");" +																						//Clear out 1st box (This is where questionBuilder script looks)
			"$('.dyxml').eq(0).val($('.dyxml').eq(1).text());" +																	//Put MXConfig <exec> block into 1st dyxml block
		"}, delay);" +																												//
	"}";																															//

    var jQueryInjectFunc = document.createElement('script');
	jQueryInjectFunc.setAttribute('id', 'XMLBoiScript');
    jQueryInjectFunc.innerHTML = "function jQueryInjectFunc() {" +
	"var itemsToAdd = [\"<style name=\\x22question.after\\x22 wrap=\\x22ready\\x22><![CDATA[\",\"var myInitTimer = setInterval(myInitFunction,10);\",\"function myInitFunction()\",\"	\\x7B\",\"		JQUERY CODE GOES HERE\",\"		clearInterval(myInitTimer);\",\"	\\x7D\",\"]]></style\"];" +

	 "for ( var b = 0, rw = itemsToAdd.length; b < rw; b++ )" +
			"questionTop.push(\"\"+ itemsToAdd[b] + \"\");" +
	"}";																															//



    var mxRankingDummy = document.createElement('script');																			//
	mxRankingDummy.setAttribute('id', 'XMLBoiScript');
    mxRankingDummy.innerHTML = "function mxRankingDummy(argRowReq,argType,argAnsType,argMXTool,argMXType) {" +						//

	"var itemsToAdd = [\"\",addSuspend(),\"<number\",\"  label=\\x22hcollapsibleRankingMinItems\\x22\",\"  noTranslate=\\x22comment,title\\x22\",\"  translateable=\\x220\\x22\",\"\" + questionRandomize(),\"  size=\\x225\\x22\",\"  where=\\x22survey,execute,report\\x22>\",\"  <title>hcollapsibleRankingMinItems: Used for number required at collapsibleRanking.</title>\",\"  <exec>\",\"finalCount = 0\",\" \",\"for rows in QIDForMasking.rows:\",\"	if QIDForMasking.attr(rows.label):\",\"		finalCount = finalCount + 1\",\" \",\"if finalCount lt 5:\",\"	hcollapsibleRankingMinItems.val = finalCount\",\"else:\",\"	hcollapsibleRankingMinItems.val = 5\",\" \",\"print(\\x22finalCount = {}\\x22 .format(finalCount))\",\"  </exec>\",\"</number>\",addSuspend(),\" \",\" \",\"<exec cond=\\x22hcollapsibleRankingMinItems.ival == 1\\x22>\",\"#AUTOPUNCHING collapsibleRanking if only one item available\",\" \",\"for rows in QIDForMasking.rows:\",\"	if QIDForMasking.attr(rows.label):\",\"		collapsibleRanking.attr(rows.label).val = 1			#Answer\",\"		collapsibleRanking_Order.attr(rows.label).val = 1	#Order\",\"		collapsibleRanking_Time.attr(rows.label).val = 0	#Time\",\"</exec>\",\" \",\" \",\" \"];" +
	"var finalReturn = [];" +

	"for ( var b = 0, rw = itemsToAdd.length; b < rw; b++ ) {" +
		"finalReturn.push(itemsToAdd[b]);" +
	"}" +

	"finalReturn = finalReturn.join(\"\\n\");" +
    "return(finalReturn);" +//Final returned thing from this function

	"}";



    var syntaxPopup = document.createElement('script');
	syntaxPopup.setAttribute('id', 'XMLBoiScript');
    syntaxPopup.innerHTML = "function syntaxPopup() {" +

    "console.log(\"SyntaxPopup\");" +//Final returned thing from this function

	"}";
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////FUNCTIONS ABOVE///////////////////////

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	/////////////ADDING ABOVE FUNCTIONS TO PAGE/////////////////
    document.body.appendChild(SC_MC_CondBuilder);
    document.body.appendChild(hideWholeWindow);
	document.body.appendChild(popoutWholeWindow);
	document.body.appendChild(usefulSyntaxPopup);
    document.body.appendChild(questionBuilder);

	document.body.appendChild(addSuspend);
	document.body.appendChild(loopQuestion);
	document.body.appendChild(questionLabel);
	document.body.appendChild(questionRandomize);
	document.body.appendChild(questionOptional);
	document.body.appendChild(questionTranslate);
	document.body.appendChild(questionWhere);
    document.body.appendChild(atm1dBuildQuestion);
	document.body.appendChild(questionText);
	document.body.appendChild(instructionText);
	document.body.appendChild(questionSize);
	document.body.appendChild(questionRowLegend);
	document.body.appendChild(questionHeight);
	document.body.appendChild(questionWidth);
	document.body.appendChild(questionPreText);
	document.body.appendChild(questionAmount);
	document.body.appendChild(questionVerify);
	document.body.appendChild(pullMXTool);
	document.body.appendChild(logicBuilder);
	document.body.appendChild(newLogicLine);
	document.body.appendChild(rmvLogicLine);
	document.body.appendChild(dummyExecTag);
	document.body.appendChild(answerBuildingFunction);
	document.body.appendChild(closingTagFunc);
	//document.body.appendChild(hideSpecificRow);
	document.body.appendChild(mxConfigFunc);
	document.body.appendChild(jQueryInjectFunc);
    document.body.appendChild(mxRankingDummy);
    document.body.appendChild(syntaxPopup);
	/////////////ADDING ABOVE FUNCTIONS TO PAGE/////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	////////////FLOATING TABLE HTML SETUP BELOW/////////////////
    $(document).ready(function() {


        $('body').before("<div id='tempMXHolder'></div>" +


	"<div style=\"float: left\" id='dragZoneLogicBuilder'><div class='draggableLogicBuilder'>" +
		"<table frame=\"box\" class='FloatingTableLogicBuilder'>" +
				"<thead>" +
					"<tr>" +
						"<td colspan=\"10\">BASIC LOGIC BUILDER</td>" +
					"</tr>" +
					"<tr class=\"questionRowxxx\">" +
						"<th class=\"logicQID\">QID</th>" +
						"<th class=\"logicPeriod\"></th>" +
						"<th class=\"logicRPrefix\"></th>" +
						"<th class=\"logicNum\">Row</th>" +
						"<th class=\"logicPeriod\"></th>" +
						"<th class=\"logicCPrefix\"></th>" +
						"<th class=\"logicNum\">Col</th>" +
						"<th class=\"logicType\"></th>" +
						"<th class=\"logicType\"></th>" +
						"<th class=\"logicType\"></th>" +
					"</tr>" +
				"</thead>" +


				//Initial row
				"<tbody>" +
					"<tr class=\"logicBuilderRow\">" +
						"<td><strong>(</strong><input style=\"width:100px\" autocomplete=\"off\" class=\"QIDClass\" name=\"QIDName\" placeholder=\"Q1\" type=\"text\"></td>" +
						"<td class=\"logicPeriod\"><strong>.</strong></td>" +
						"<td><input class=\"logicRPrefix\" autocomplete=\"off\" name=\"RowPrefix\" placeholder=\"r\" type=\"text\"></td>" +
						"<td><input style=\"width:80px\" autocomplete=\"off\" class=\"RowClass\" name=\"RowName\" placeholder=\"1-5,7\" type=\"text\"></td>" +
						"<td class=\"logicPeriod\"><strong>.</strong></td>" +
						"<td><input class=\"logicCPrefix\" autocomplete=\"off\" name=\"ColPrefix\" placeholder=\"c\" type=\"text\"></td>" +
						"<td><input style=\"width:80px\" autocomplete=\"off\" class=\"ColClass\" name=\"ColName\" placeholder=\"1-5,7\" type=\"text\"><strong>)</strong></td>" +
						"<td><input type=\"radio\" id=\"OrButton\" name=\"OrAnd\" value=\"OrValue\"><br/><label for=\"OrButton\">Or</label></td>" +
						"<td><input type=\"radio\" id=\"AndButton\" name=\"OrAnd\" value=\"AndValue\"><br/><label for=\"AndButton\">And</label></td>" +
						"<td><button class=\"rmvLogicLine\" onclick=\"rmvLogicLine($(this).closest('tr'))\" style=\"float: center;\">-DEL-</button></td>" +
					"</tr>" +

					//New line row
					"<tr class=\"newLogicRowButton\">" +
						"<td colspan=\"10\"><button class=\"newLogicLine\" onclick=\"newLogicLine()\" style=\"float: center;\">+NEW LINE+</button></td>" +
					"</tr>" +

					//Finished logic box
					"<tr class=\"mainLogicBox\">" +
						"<td colspan=\"10\"><textarea wrap=\"soft\" id=\"logicOutputBox\" rows=\"8\"></textarea></td>" +
					"</tr>" +
				"</tbody>" +
	"</table></div></div>"+




















			"<div style=\"float: right\" id='dragZone'><div class='draggable'>" +
                         "<table frame=\"box\" class='FloatingTable'>" +

                         //Top two rows
						"<thead>" +
							"<tr>" +
						 		"<td id=\"popoutXMLBoi\" colspan=\"1\" align=\"left\"><a href='#' onclick=\"popoutWholeWindow()\" class='toolButtonPop'>Popout</a></td>" +
								"<td id=\"XXXXXXXXXXX\" colspan=\"1\" align=\"center\"><a href='#' onclick=\"usefulSyntaxPopup()\" class='toolButtonNotes'>Syntax / Notes</a></td>" +
								"<td id=\"hideXMLBoi\" colspan=\"2\" align=\"right\"><a href='#' onclick=\"hideWholeWindow()\" class='toolButtonMin'>Minimise</a></td>" +

							"</tr>" +
							"<tr class=\"questionRow\">" +
								"<th>Question</th>" +
								"<th>Alternate</th>" +
								"<th>Dummy</th>" +
								"<th></th>" +
							"</tr>" +
						"</thead>" +


                         //1 = Y, 0 = N
						 //15 parameters
                         //questionBuilder('Question Type' / 'Include Label' / 'Randomized?' / 'Optional?' / 'Translatable?' / 'Requires Rows?' / 'Requires Cols?' / 'Answer Type' / 'Question text?' / 'Dummy?' / 'ATM1D' / 'AutoSum'/ 'MX Question' / 'MX Question Name' / 'MX Question Link' / 'MLS')\"

                         //SC Questions
                         "<tbody>" +
                         "<tr class=\"questionRowStd\">" +
                             "<td><a href='#' onclick=\"questionBuilder('radio','1','0','0','2','1','0','row','1','0','0','0','0','0','0','1')\" class='questionButton'>Single Select</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('radio','1','0','0','2','1','0','row','1','0','1','0','0','0','0','1')\" class='questionButton'>atm1d</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('radio','1','0','1','1','1','0','row','1','1','0','0','0','0','0','0')\" class='questionButton'>Single Select (Dummy)</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         //MC Questions
                         "<tr class=\"questionRowStd\">" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','1','0','0','2','1','0','row','1','0','0','0','0','0','0','1')\" class='questionButton'>Multi Select</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','1','0','0','2','1','0','row','1','0','1','0','0','0','0','1')\" class='questionButton'>atm1d</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','1','0','1','1','1','0','row','1','1','0','0','0','0','0','0')\" class='questionButton'>Multi Select (Dummy)</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         //Text Questions
                         "<tr class=\"questionRowStd\">" +
                             "<td><a href='#' onclick=\"questionBuilder('text','1','0','0','2','1','0','row','1','0','0','0','0','0','0','1')\" class='questionButton'>Text</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('textarea','1','0','0','2','0','0','row','1','0','0','0','0','0','0','1')\" class='questionButton'>Essay</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('text','1','0','1','1','1','0','row','1','1','0','0','0','0','0','0')\" class='questionButton'>Text (Dummy)</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         //Numeric Questions
                         "<tr class=\"questionRowStd\">" +
                             "<td><a href='#' onclick=\"questionBuilder('number','1','0','0','2','1','0','row','1','0','0','0','0','0','0','1')\" class='questionButton'>Number</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('number','1','0','0','2','1','0','row','1','0','0','1','0','0','0','1')\" class='questionButton'>AutoSum</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('number','1','0','1','1','1','0','row','1','1','0','0','0','0','0','0')\" class='questionButton'>Number (Dummy)</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         //Dropdown Questions
                         "<tr class=\"questionRowStd\">" +
						 	 "<td><a href='#' onclick=\"questionBuilder('select','1','0','0','2','1','0','choice','1','0','0','0','0','0','0','1')\" class='questionButton'>Dropdown</a></td>" +
                             "<td></td>" +
                             "<td></td>" +
                             "<td></td>" +
                         "</tr>" +

                         //"MX Questions - Pulled from URL"
                         "<tr>" +
                             "<td class=\"mxRow\" style=\"height: 5px; text-align: center; border: 1px solid #666666;\" colspan=\"4\"><strong>MX Questions - URL Pulled</strong></td>" +
                         "</tr>" +
                         //MX Questions
                         "<tr class=\"questionRowMX\">" +
						 	 "<td><a href='#' onclick=\"questionBuilder('checkbox','0','x','x','2','0','0','row','0','0','0','0','1','SCTextSelector','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=collapsibleText')\" class='questionButton'>SC Text Selector</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','0','x','x','2','0','0','row','0','0','0','0','1','MCTextSelector','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=collapsibleText')\" class='questionButton'>MC Text Selector</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','0','x','x','2','0','0','row','0','0','0','0','1','Ranking','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=collapsibleRanking')\" class='questionButton'>Ranking</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         "<tr class=\"questionRowMX\">" +
                             "<td><a href='#' onclick=\"questionBuilder('radio','0','x','x','2','0','0','row','0','0','0','0','1','SCCarousel','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=mxjGTT001_1')\" class='questionButton'>SC Carousel</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('checkbox','0','x','x','2','0','0','row','0','0','0','0','1','MCCarousel','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=mxjMGTT001_1')\" class='questionButton'>MC Carousel</a></td>" +
                             "<td><a href='#' onclick=\"questionBuilder('radio','0','x','x','2','0','0','row','0','0','0','0','1','Slider','https://survey-d2.dynata.com/survey/selfserve/53b/250106?goToTool=mxSliderHorizontal')\" class='questionButton'>Slider</a></td>" +
                             "<td></td>" +
                         "</tr>" +
                         "<tr class=\"questionRowMX\">" +
                           	"<td><a href='#' onclick=\"questionBuilder('MXExec','0','x','x','2','0','0','row','0','0','0','0','1','')\" class='questionButton'>MXConfig</a></td>" +
                             "<td></td>" +
                             "<td></td>" +
                             "<td></td>" +
                         "</tr>" +




                         //"Structural Elements"
                         "<tr>" +
                             "<td class=\"structuralRowHeader\" style=\"height: 5px; text-align: center; border: 1px solid #666666;\" colspan=\"4\"><strong>Structural Elements / Other Useful Shit</strong></td>" +
                         "</tr>" +
                         //questionBuilder('Question Type' / 'Include Label' / 'Randomized?' / 'Optional?' / 'Translatable?' / 'Requires Rows?' / 'Requires Cols?' / 'Answer Type' / 'Question text?' / 'Dummy?' / 'ATM1D' / 'AutoSum'/ 'MX Question','MX Question Link')\"
                         "<tr class=\"structuralRow\">" +
                         	"<td><a href='#' onclick=\"questionBuilder('define','1','x','x','0','1','0','row','0','0','0','0','0','0')\" class='questionButton'>Reusable Row</a></td>" +
						 	"<td><a href='#' onclick=\"questionBuilder('res','0','x','x','0','1','0','res','0','0','0','0','0','0')\" class='questionButton'>Res Tag</a></td>" +
						 	"<td><a href='#' onclick=\"questionBuilder('loop','1','x','x','0','1','0','looprow','1','0','0','0','0','0')\" class='questionButton'>Loop</a></td>" +
                            "<td></td>" +
                         "</tr>" +
                         "<tr class=\"structuralRow\">" +
						 	"<td><a href='#' onclick=\"questionBuilder('JQExec','0','x','x','2','0','0','row','0','0','0','0','0','')\"class='questionButton'>jQuery Inject</a></td>" +
                            "<td><a href='#' onclick=\"questionBuilder('radio','1','0','1','3','1','0','row','1','1','0','0','0','0','0')\" class='questionButton'>SC Translation Dummy</a></td>" +
						 	"<td><a href='#' onclick=\"questionBuilder('checkbox','1','0','1','3','1','0','row','1','1','0','0','0','0','0')\" class='questionButton'>MC Translation Dummy</a></td>" +
                            "<td></td>" +
                         "</tr>" +
                         "<tr class=\"structuralRow\">" +
						 	//"<td><a href='#' onclick=\"questionBuilder('cond','0','x','x','2','0','0','row','0','0','0','0','0','0','0')\"class='questionButton'>SC/MC Cond Builder</a></td>" +
                            "<td><a href='#' onclick=\"questionBuilder('term','0','x','x','2','0','0','row','0','0','0','0','0','0','0')\"class='questionButton'>Term Outliner</a></td>" +
                            //"<td colspan=\"2\"><a href='#' onclick=\"questionBuilder('term','0','x','x','2','0','0','row','0','0','0','0','0','0','0')\"class='questionButton'>OWN DOCUMENTATION</a></td>" +
                            "<td></td>" +
                         "</tr>" +




                         //"Options"
                         "<tr class=\"optionRowHeader\">" +
                             "<td style=\"height: 5px; text-align: center; border: 1px solid #666666;\" colspan=\"4\"><strong>Options</strong></td>" +
                         "</tr>" +

                         //Actual checkboxes and options (r1)
                         "<tr colspan=\"4\" class=\"optionRow\">" +

                             //_[loopvar: label]
                             "<td colspan=\"2\">" +
                                 "<span style=\"float: left; padding-left: 7px; padding-right: 20px; padding-bottom: 5px;\"><input type=\"checkbox\" id=\"loopIncluded\" value=\"1\"/></span>" +
                                 "<span style=\"float: left; padding-top: 5px;\">Inc loop_suffix</span>" +
                             "</td>" +

                             //Col Grouping
                             //"<td colspan=\"3\">" +
                                 //"<span style=\"float: left; padding-left: 40px; padding-right: 20px; padding-bottom: 5px;\"><input type=\"checkbox\" id=\"colGroupingIncluded\" value=\"1\"/></span>" +
                                 //"<span style=\"float: left; padding-top: 5px;\">Col Grouping (Ans per col)</span>" +
                             //"</td>" +

                             //Supress ATM1D
                             "<td colspan=\"2\" style=\"height: 35px; padding-right: 15px;\">" +
                                 "<span style=\"float: left; padding-left: 7px; padding-right: 20px; padding-bottom: 5px;\"><input checked type=\"checkbox\" id=\"holdATM1DExtra\" value=\"1\"/></span>" +
                                 "<span style=\"float: left; padding-top: 5px;\">Hold extra atm1d</span>" +
                             "</td>" +

                         "</tr>" +

                         //Actual checkboxes and options (r2)
                         //"<tr colspan=\"4\" class=\"optionRow\">" +

                         //Search boxes
                         "<tr colspan=\"4\" class=\"optionRow\">" +
                             //Search Decipher Website (Via Google)
                             "<td colspan=\"4\" style=\"max-height: 15px;\">" +
								"<form style=\"margin: 5px; display:inline-block;\" action=\"https://forstasurveys.zendesk.com/hc/en-us/search?\" class=\"searchform\" method=\"get\" name=\"searchform\" target=\"_blank\">"+
								"<input style=\"width: 198px;\" autocomplete=\"off\" name=\"query\" placeholder=\"Search Decipher Knowledgebase\" required=\"required\" id=\"KBSearchBox\" type=\"text\">"+
								"</form>"+

                         		//"<form style=\"margin-bottom: 5px;\" action=\"https://dynatacorp.atlassian.net/wiki/search?\" class=\"searchform\" method=\"get\" name=\"searchform\" target=\"_blank\">"+
								//"<input style=\"width: 95%;\" autocomplete=\"off\" name=\"text\" placeholder=\"Search Atlassian (Depreciated 2024)\" required=\"required\" id=\"AtlassianSearchBox\" type=\"text\">"+
								//"</form>"+

                         		//Search SharePoint
                         		"<form style=\"margin-bottom: 5px;  display:inline-block;\" action=\"https://dynatallc.sharepoint.com/sites/SPLibrary/_layouts/15/search.aspx/siteall?\" class=\"searchform\" method=\"get\" name=\"searchform\" target=\"_blank\">"+
								"<input style=\"width: 198px;\" autocomplete=\"off\" name=\"q\" placeholder=\"Search Sharepoint SP Library\" required=\"required\" id=\"SharepointSPLibrarySearchBox\" type=\"text\">"+
								"</form>"+
                             "</td>" +
                             //Syntax popup button
                             //"<td colspan=\"1\" ><a href='#' onclick=\"syntaxPopup()\" class='questionButton'>Useful Decipher Syntax</a></td>" +
                         "</tr>" +

						 	//Useful Decipher links
						 	"<td style=\"padding-bottom: 5px;\" colspan=\"4\" \">" +
								//"<button style=\"float: center;\" onclick=\"logicBuilder()\">Basic Logic Generator</button>" + (REMOVED AS NEVER BOTHERED TO IMPLEMENT IT, LEAVING HERE IN CASE I EVER COME BACK TO IT)
								"<select id=\"UsefulLinks\" onchange=\"window.open(this.options[this.selectedIndex].value); $('#UsefulLinks').prop('selectedIndex', 0);\" >" +
									"<option value=\"\" selected disabled>Useful Decipher Links</option>" +

									"<option value=\"https://survey-d.dynata.com/apps/projectwarnings#/exceptions?code=\">Error Code Lookup</option>" +
									"<option value=\"https://surveytools.dynata.com/empower/apps/decipher-entrylink/public/#/\">Link Generator</option>" +
                                    "<option value=\"https://dynatallc.sharepoint.com/sites/RDSupport/SitePages/Share-Country-and-Language-Code.aspx?web=1&xsdata=MDV8MDJ8fGNhNWZmYzdmNDlkMTQ3NDQ1ZGE2MDhkYzkwNmIwOTEwfGYwZmY5MTdkYWI4YzQxMjliMTNmMzNiZTI2N2ExNTNifDB8MHw2Mzg1NDQwMzY1Njc3MzU3MTh8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxMMk5vWVhSekx6RTVPalV4WldNeU5UbGxaVEV4T0RReU5HUTRNek5pWVdabFpqVTBabVl3TldZd1FIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOekU0T0RBMk9EVTJNVEl3fGEzMmRiNDJjNDg0YjQwOGQ1ZGE2MDhkYzkwNmIwOTEwfGNlNmYxZGY1ZTNiODQxOWQ5YzdiMzEwNTY0NDgzYzQy&sdata=RjRKSkZvL1B0SHByM3N0NmZHalMwT3c4dzFXV0xCaUlJOGZWRnU0dGFaRT0%3D&ovuser=f0ff917d-ab8c-4129-b13f-33be267a153b%2CScott.Searle%40dynatacorp.com&OR=Teams-HL&CT=1718806894086&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNDA1MTYyMjIyMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D\">Full Country List</option>" +
									"<option value=\"https://surveyfiles.dynata.com/na/2022/SPSOP/Complexity%20Levels.html\">Link Complexity Table</option>" +
									"<option value=\"https://surveytools.dynata.com/empower/apps/decipher-dashboard/public/\">Dashboard Generator</option>" +
									"<option value=\"\" disabled>&nbsp;</option>" +

									"<option value=\"https://forstasurveys.zendesk.com/hc/en-us/articles/4409469874843-Secure-Surveys-Overview\">𝗥𝗘𝗔𝗟𝗟𝗬 Decipher Useful Syntax</option>" +
									"<option value=\"\" disabled>&nbsp;</option>" +


                               		"<option value=\"https://dynatallc.sharepoint.com/sites/EMEASP?\">EMEA SP Homepage</option>" +
        			                "<option value=\"https://dynatallc.sharepoint.com/:f:/r/sites/SP.Global.OPS.EMEA/Shared%20Documents/EMEA%20Professional%20Services/-%20Survey%20Programming/Decipher/Documentation?csf=1&web=1&e=aR01Ah\">EMEA Decipher Documentation</option>" +
									"<option value=\"\" disabled>&nbsp;</option>" +

									"<option value=\"https://survey-d.dynata.com/survey/selfserve/53b/19021138#?\">MXTools</option>" +
                               		"<option value=\"https://dynatallc.sharepoint.com/sites/RDSupport/SitePages/Survey.aspx#mx-tools-dynata\">R&D MX Tool Guides</option>" +
									"<option value=\"\" disabled>&nbsp;</option>" +

                               		"<option value=\"https://dynatallc.sharepoint.com/sites/RDSupport/SitePages/How-to-add-Real-Answer-attributes-to-Open-End-questions.aspx\">Adding \"Real Answer\" to a question</option>" +
								"</select>" +
                             "</td>" +








                         //Finished question box
                         "<tr class=\"mainQuestionBox\">" +
                             "<td colspan=\"4\"><textarea wrap=\"soft\" id=\"codeOutputBox\" rows=\"10\"></textarea></td>" +
                         "</tr>" +
						 //Question text box
                         "<tr class=\"questionTextBox\">" +
                             "<td colspan=\"4\"><textarea wrap=\"soft\" placeholder=\"Question text here\" id=\"questionTextOutputBox\" rows=\"3\"></textarea></td>" +
                         "</tr>" +
						 //Instruction text box
                         "<tr class=\"commentTextBox\">" +
                             "<td colspan=\"4\"><textarea wrap=\"soft\" placeholder=\"Instruction text here\" id=\"instructionTextOutputBox\" rows=\"2\"></textarea></td>" +
                         "</tr>" +
						 //Row/Col box
                         "<tr class=\"rowBox\">" +
                             "<td colspan=\"4\"><textarea wrap=\"soft\" placeholder=\"Row, Choice, Res, Looprow here\" id=\"rowOutputBox\" rows=\"4\"></textarea></td>" +
                         "</tr>" +
						 //Col box
                         "<tr class=\"rowBox\">" +
						     "<td colspan=\"4\"><textarea wrap=\"soft\" placeholder=\"Cols here\" id=\"colOutputBox\" rows=\"4\"></textarea></td>" +
                         "</tr>" +

			"</tbody>" +
			"</table></div></div>");																			//END OF TABLE



        $('#dragZone,#dragZoneLogicBuilder').css('position', 'relative');	//Parent container for the entire tool
        $('#dragZone,#dragZoneLogicBuilder').css('height', '20px');			//Sets height to only 20px so it doesn't mess with Decipher's layout
		$('#dragZoneLogicBuilder').css('max-width', '1px');					//Sets height to only 20px so it doesn't mess with Decipher's layout
		$('.draggableLogicBuilder').css('width', '400px');					//Sets width to prevent leaving parent container
		$('.FloatingTableLogicBuilder').css('width', '400px');				//Sets width to prevent leaving parent container
		$('.draggableLogicBuilder').css('height', '100px');					//Sets width to prevent leaving parent container


		var currentUrl = window.location.href;
		if (currentUrl.includes("https://survey-d.dynata.com/")) {
			//
			//INITIAL SETUP STUFF BELOW (For Survey-D)
        		$("#codeOutputBox").css("width", "465px");					//Width of the main question output box
        		$("#questionTextOutputBox").css("width", "465px");			//Width of the question text box
				$("#instructionTextOutputBox").css("width", "465px");		//Width of the question text box
				$("#rowOutputBox").css("width", "465px");					//Width of the rows box
        		$("#colOutputBox").css("width", "465px");					//Width of the cols box
		  } else if (currentUrl.includes("https://survey-d2.dynata.com/")) {
			//
			//INITIAL SETUP STUFF BELOW (For Survey-D2) - When using it as a separate window, this size is good
        		$("#codeOutputBox").css("width", "566px");					//Width of the main question output box
        		$("#questionTextOutputBox").css("width", "566px");			//Width of the question text box
				$("#instructionTextOutputBox").css("width", "566px");		//Width of the question text box
				$("#rowOutputBox").css("width", "566px");					//Width of the rows box
        		$("#colOutputBox").css("width", "566px");					//Width of the cols box
		  }

        $("#codeOutputBox").css("opacity", "0.7");					//SET OPACITY
		$("#questionTextOutputBox").css("opacity", "0.7");			//SET OPACITY
		$("#instructionTextOutputBox").css("opacity", "0.7");		//SET OPACITY
        $("#rowOutputBox").css("opacity", "0.7");					//SET OPACITY
        $("#colOutputBox").css("opacity", "0.7");					//SET OPACITY

        $("th.questionRow").eq(0).css("min-width","136px");			//SETS HEADER WIDTH, USED WHEN WINDOW
        $("th.questionRow").eq(1).css("min-width","118px");			//IS MINIMISED, OTHERWISE THEY COLLAPSE
        $("th.questionRow").eq(2).css("min-width","161px");			//IN ON THEMSELVES, DOESN'T LOOK NICE.

		$("a.toolButtonNotes").css("min-width","180px");			//EXPANDS THE "Syntax / Notes" BUTTON TO MAKE IT EASIER TO USE

        $("#dragZoneLogicBuilder").css("display","none");			//Hide by default
		$(".logicQID").css("max-width","30px");						//Logic builder: QID
		$(".QIDClass").css("max-width","30px");						//Logic builder: QID
        $(".logicPeriod").css("max-width","10px");					//Logic builder: Period
        $(".logicRPrefix,.logicCPrefix").css("max-width","10px");	//Logic builder: Row/Col Prefix
		$(".RowClass").css("max-width","30px");						//Logic builder: Typed in numbers 1-5,7,9,99
		$(".ColClass").css("max-width","30px");						//Logic builder: Typed in numbers 1-5,7,9,99
		$(".logicNum").css("max-width","30px");						//Logic builder: Typed in numbers 1-5,7,9,99
		$(".ui-wrapper").css("min-width", "100%");					//Width of the main question output box

        $(".reusableListButton").css("min-width","100px");			//SET INITIAL STATES: SET WIDTH
        $(".loopButton").css("min-width","100px");					//SET INITIAL STATES: SET WIDTH
        $(".translateButton").css("min-width","100px");				//SET INITIAL STATES: SET WIDTH
        $(".windowButton").css("min-width","100px");				//SET INITIAL STATES: SET WIDTH
        $("td").css("text-align","center");							//SET INITIAL STATES: SET ALL TO CENTER

        $('#dragZone').css('z-index', '10');						//THE ONE ABOVE ALL! (R.I.P STAN LEE!)
		$('#dragZoneLogicBuilder').css('z-index', '11');			//THE ONE ABOVE ALL! (R.I.P STAN LEE!)


        var a = 10;
        $('.draggable,.draggableLogicBuilder').draggable({
            start: function(event, ui) {
                $(this).css("z-index", a++);
            }
        });

		//
        //SETS DRAGGABLE PROPERTIES,
        $('.draggable').draggable("option", "distance", 60); 					//Only drags after 60px has been reached, to prevent accidental dragging.
        $('.draggable').draggable("option", "containment", "document"); 		//Restrains the tool to the document
        $('.draggableLogicBuilder').draggable("option", "distance", 60); 					//Only drags after 60px has been reached, to prevent accidental dragging.
        $('.draggableLogicBuilder').draggable("option", "containment", "document"); 		//Restrains the tool to the document
		$("[id$=OutputBox]").resizable({handles: "e, s, se"});					//Makes it so the box can only be resized East (right), South (down), or SouthEast
		$("[id$=OutputBox]").resizable({grid: [25, 25]});						//Snaps the resizing of hor/ver to every 25px
		$(".ui-resizable-e").css("width","15px");								//Makes the "e"ast (right) handles taller for easier grabbing
		$(".ui-resizable-s").css("height","15px");								//Makes the "s"outh (bottom) handles taller for easier grabbing
		$(".ui-resizable-e").css("background-color","rgba(47, 98, 186, 0.2)");	//Makes the handles more visible
		$(".ui-resizable-s").css("background-color","rgba(47, 98, 186, 0.2)");	//Makes the handles more visible

    }); 																		//End of the tool layout code
	/////////////FLOATING TABLE HTML SETUP ABOVE/////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////







    //CSS STUFF BELOW, NO TOUCHY!
    $("<style id='XMLBoiCSSStyle'>")
        .prop("type", "text/css")
        .html("\
\
textarea {\
	white-space: nowrap;\
	overflow: auto;\
}\
\
::-webkit-scrollbar {\
    height: 8px;\
	width: 8px;\
}\
}\
\
#logicOutputBox {\
	white-space:pre-wrap;\
	resize: none;\
}\
\
textarea:hover {\
}\
\
\
table, th, td {\
	background: rgba(255,255,255,0.02);\
}\
\
input[type=checkbox] { /* This is for the loop_suffix/hold atm1d thing */\
  -webkit-transform: scale(2);\
  padding: 10px;\
}\
\
.draggable,{\
	padding-right: 5px;\
	padding-bottom: 40px;\
	padding-left: 35px;\
	position: absolute\
}\
\
.FloatingTableLogicBuilder{\
	background-color: #ffffff;\
	opacity: 1.0;\
}\
\
.toolButtonMin{\
    float:right;\
}\
\
.toolButtonPop{\
    float:left;\
}\
\
.syntaxButton{\
    float:left;\
}\
\
.questionButton, .toolButtonMin, .toolButtonPop, .toolButtonNotes, .reusableListButton, .windowButton, .loopButton, .translateButton, .syntaxButton {\
	-webkit-box-shadow:inset 0px 1px 0px 0px #bee2f9;\
	background:-webkit-linear-gradient(top, #63b8ee 5%, #468ccf 100%);\
	background:linear-gradient(to bottom, #63b8ee 5%, #468ccf 100%);\
	background-color:#63b8ee;\
	border-radius:6px;\
	border:1px solid #3866a3;\
	display:inline-block;\
	cursor:pointer;\
	color:#14396a;\
	font-family:Arial;\
	font-size:13px;\
	font-weight:bold;\
	padding:5px 7px;\
	text-decoration:none;\
	text-shadow:0px 1px 0px #7cacde;\
}\
\
.questionButton:hover, .toolButtonMin:hover, .toolButtonPop:hover, .reusableListButton:hover, .windowButton:hover, .loopButton:hover, .translateButton:hover {\
	background:-webkit-linear-gradient(top, #468ccf 5%, #63b8ee 100%);\
	background:linear-gradient(to bottom, #468ccf 5%, #63b8ee 100%);\
	background-color:#468ccf;\
}\
\
.questionButton:active, .toolButtonMin:active, .toolButtonPop:active, .reusableListButton:active, .windowButton:active, .loopButton:active, .translateButton:active {\
	position:relative;\
	top:1px;\
	table.FloatingTable,table {\
	width: 100%;\
	background-color: #ffffff;\
	border-collapse: collapse;\
	border-width: 2px;\
	border-color: #000000;\
	border-style: solid;\
	color: #000000;\
}\
\
table.FloatingTable td, table.FloatingTable th {\
	border-width: 2px;\
	border-color: #000000;\
	border-style: solid;\
	padding: 0px;\
}\
\
table.FloatingTable thead {\
	background-color: #ffffff;\
}\
\
}").appendTo("head");
})(); 																														//END OF WHOLE SCRIPT