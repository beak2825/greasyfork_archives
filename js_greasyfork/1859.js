// ==UserScript==
// @name        C&C Tiberium Alliances Landingpage Autologin
// @namespace   http://*tiberiumalliances.com/*
// @namespace   https://*tiberiumalliances.com/*
// @author		   Elda1990, F1u5h3r
// @description    Autologin to C&C Tibeirum Alliances
// @include        https*://www.tiberiumalliances.com*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant   GM_setValue 
// @grant   GM_getValue 
// @version	1.0.1DL
// @downloadURL https://update.greasyfork.org/scripts/1859/CC%20Tiberium%20Alliances%20Landingpage%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/1859/CC%20Tiberium%20Alliances%20Landingpage%20Autologin.meta.js
// ==/UserScript==

var GM_SuperValue = new function () {

    var JSON_MarkerStr  = 'json_val: ';
    var FunctionMarker  = 'function_code: ';

    function ReportError (msg) {
        if (console && console.error)
            console.log (msg);
        else
            throw new Error (msg);
    }

    //--- Check that the environment is proper.
    if (typeof GM_setValue != "function")
        ReportError ('This library requires Greasemonkey! GM_setValue is missing.');
    if (typeof GM_getValue != "function")
        ReportError ('This library requires Greasemonkey! GM_getValue is missing.');


    /*--- set ()
        GM_setValue (http://wiki.greasespot.net/GM_setValue) only stores:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow storing any data type.

        Parameters:
            varName
                String: The unique (within this script) name for this value.
                Should be restricted to valid Javascript identifier characters.
            varValue
                Any valid javascript value.  Just note that it is not advisable to
                store too much data in the Firefox preferences.

        Returns:
            undefined
    */
    this.set = function (varName, varValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.set().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.set().');
        }

        switch (typeof varValue) {
            case 'undefined':
                ReportError ('Illegal varValue sent to GM_SuperValue.set().');
            break;
            case 'boolean':
            case 'string':
                //--- These 2 types are safe to store, as is.
                GM_setValue (varName, varValue);
            break;
            case 'number':
                /*--- Numbers are ONLY safe if they are integers.
                    Note that hex numbers, EG 0xA9, get converted
                    and stored as decimals, EG 169, automatically.
                    That's a feature of JavaScript.

                    Also, only a 32-bit, signed integer is allowed.
                    So we only process +/-2147483647 here.
                */
                if (varValue === parseInt (varValue)  &&  Math.abs (varValue) < 2147483647)
                {
                    GM_setValue (varName, varValue);
                    break;
                }
            case 'object':
                /*--- For all other cases (but functions), and for
                    unsafe numbers, store the value as a JSON string.
                */
                var safeStr = JSON_MarkerStr + JSON.stringify (varValue);
                GM_setValue (varName, safeStr);
            break;
            case 'function':
                /*--- Functions need special handling.
                */
                var safeStr = FunctionMarker + varValue.toString ();
                GM_setValue (varName, safeStr);
            break;

            default:
                ReportError ('Unknown type in GM_SuperValue.set()!');
            break;
        }
    }//-- End of set()


    /*--- get ()
        GM_getValue (http://wiki.greasespot.net/GM_getValue) only retieves:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow retrieving any data type -- as
        long as it was stored with GM_SuperValue.set().

        Parameters:
            varName
                String: The property name to get. See GM_SuperValue.set for details.
            defaultValue
                Optional. Any value to be returned, when no value has previously
                been set.

        Returns:
            When this name has been set...
                The variable or function value as previously set.

            When this name has not been set, and a default is provided...
                The value passed in as a default

            When this name has not been set, and default is not provided...
                undefined
    */
    this.get = function (varName, defaultValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.get().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.get().');
        }

        //--- Attempt to get the value from storage.
        var varValue    = GM_getValue (varName);
        if (!varValue)
            return defaultValue;

        //--- We got a value from storage. Now unencode it, if necessary.
        if (typeof varValue == "string") {
            //--- Is it a JSON value?
            var regxp       = new RegExp ('^' + JSON_MarkerStr + '(.+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = JSON.parse ( m[1] );
                return varValue;
            }

            //--- Is it a function?
            var regxp       = new RegExp ('^' + FunctionMarker + '((?:.|\n|\r)+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = eval ('(' + m[1] + ')');
                return varValue;
            }
        }

        return varValue;
    }//-- End of get()


    /*--- runTestCases ()
        Tests storage and retrieval every every knid of value.
        Note: makes extensive use of the console.

        Parameters:
            bUseConsole
                Boolean: If this is true, uses the console environment to store
                the data.  Useful for dev test.
        Returns:
            true, if pass.  false, otherwise.
    */
    this.runTestCases = function (bUseConsole) {

        if (bUseConsole) {
            //--- Set up the environment to use local JS, and not the GM environment.
            this.testStorage    = {};
            var context         = this;
            this.oldSetFunc     = (typeof GM_setValue == "function") ? GM_setValue : null;
            this.oldGetFunc     = (typeof GM_getValue == "function") ? GM_getValue : null;

            GM_setValue    = function (varName, varValue) {
                console.log ('Storing: ', varName, ' as: ', varValue);
                context.testStorage[varName] = varValue;
            }

            GM_getValue    = function (varName, defaultValue) {
                var varValue    = context.testStorage[varName];
                if (!varValue)
                    varValue    = defaultValue;

                console.log ('Retrieving: ', varName, '. Got: ', varValue);

                return varValue;
            }
        }

        var dataBefore  =   [null, true, 1, 1.1, -1.0, 2.0E9,  2.77E9,  2.0E-9, 0xA9, 'string',
                            [1,2,3], {a:1, B:2}, function () {a=7; console.log ("Neat! Ain't it?"); }
                        ];

        for (var J = 0;  J <= dataBefore.length;  J++)
        {
            var X       = dataBefore[J];
            console.log (J, ': ', typeof X, X);

            this.set ('Test item ' + J, X);
            console.log ('\n');
        }

        console.log ('\n***********************\n***********************\n\n');

        var dataAfter   = [];

        for (var J = 0;  J < dataBefore.length;  J++)
        {
            var X       = this.get ('Test item ' + J);
            dataAfter.push (X);
            console.log ('\n');
        }

        console.log (dataBefore);
        console.log (dataAfter);

        dataAfter[12]();

        //--- Now test for pass/fail.  The objects won't be identical but contenets are.
        var bPass;
        if (dataBefore.toString()  ==  dataAfter.toString() ) {
            var pfStr   = 'PASS!';
            bPass       = true;
        } else {
            var pfStr   = 'FAIL!';
            bPass       = false;
        }
        console.log ( "\n***************************        \
                       \n***************************        \
                       \n***************************        \
                       \n*****     " + pfStr + "       *****        \
                       \n***************************        \
                       \n***************************        \
                       \n***************************\n");

        if (bUseConsole) {
            //--- Restore the GM functions.
            GM_setValue    = this.oldSetFunc;
            GM_getValue    = this.oldGetFunc;
        }
        else {
            //--- Clean up the FF storage!

            for (var J = 0;  J < dataBefore.length;  J++)
            {
                GM_deleteValue ('Test item ' + J);
            }
        }

        return bPass;

    }//-- End of runTestCases()
};


//GM_SuperValue.runTestCases  (true);

//--- EOF

var language = "de"; // CHANGE FOR OTHER REGION
var url = window.location.href;
var CCEmail = GM_SuperValue.get("CCEmail", []);
var CCPassword = GM_SuperValue.get("CCPassword", []);

function login(){
	var profile = $('#selectionBox234562 option:selected').text();
	profile = profile.substring(profile.lastIndexOf("-")+1);
	$('input#username').val(CCEmail[profile]);
	$('input#password').val(CCPassword[profile]);
	$('input[type="submit"]').trigger('click');
}

function addProfile() {
	var email = $("#email234562").val();
	var password = $("#password234562").val();
	if(email != "" && password != "") {
		CCEmail.push(email);
		CCPassword.push(password);
		GM_SuperValue.set("CCEmail", CCEmail);
		GM_SuperValue.set("CCPassword", CCPassword);
		window.location.href = url;
	}
}

function removeProfile() {
	var profile = $('#selectionBox234562 option:selected').text();
	var splitProfileIndex = profile.lastIndexOf("-");
	profile = profile.substring(0, splitProfileIndex);
	var CCEmailString = CCEmail.toString();
	var profileIndex = CCEmail.indexOf(profile);
	CCEmail.splice(profileIndex, 1);
	CCPassword.splice(profileIndex, 1);
	GM_SuperValue.set("CCEmail", CCEmail);
	GM_SuperValue.set("CCPassword", CCPassword);
	window.location.href = url;
}

function init() {
	if (url == "https://alliances.commandandconquer.com/"+language+"/" || url == "https://alliances.commandandconquer.com/") {
		window.location.href = "https://alliances.commandandconquer.com/" + language + "/game/launch";
	} else if (url.search("/login/auth/step") != -1 || url.search("/login/auth") != -1) {
		var width = $(window).width() / 2.5;
		var height = $(window).height() / 3;
		var selectionList = '<select name="selectionBox234562" size="1" style="width: 90px">';
		for(var i = 0; i < CCEmail.length; i++){
			selectionList += '<option>'+CCEmail[i]+'-'+i+'</option>';
			if(i == CCEmail.length-1){
				selectionList += '</select>';
			}
		}
        var selectionBox = '<div id="selectionBox234562" style="width: 350px; height: 80px; border: 4px solid grey; padding: 15px; z-index: 9999; position: absolute; background-color: #17341A; top: 0px; left: 665px; line-height: 20px;  left: '+width+'px; position:absolute;">Select one of the following profiles for your login.<br>Profiles: </div>';
		$('body').append(selectionBox);
		$('#selectionBox234562').append(selectionList).append('<button id="login234562" type="button">Login</button><button type="button" id="remove234562">Remove Profile</button><br>Or add a new profile<br>EMail: <input type="text" style="width: 90px" id="email234562"> Password: <input type="text" style="width: 90px" id="password234562"> <button type="button" id="add234562">Add</button></div>');

		$('#login234562').click(function() {
			var profile = $('#selectionBox234562 option:selected').text();
			profile = profile.substring(profile.lastIndexOf("-")+1);
			login(CCEmail[profile], CCPassword[profile]);
		});

		$('#add234562').click(function() {
			addProfile();
		});

		$('#remove234562').click(function() {
			removeProfile();
		});
	}
}

init();