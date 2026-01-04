/*********************************** Debug Tab ***********************************/
// @tabversion 20180516

Tabs.Debug = {
	tabOrder: 9999,
	tabLabel: 'Debug',
	tabColor: 'red',
	myDiv: null,
	dbSelect: {},
	sortSeed: [],
	sortNonSeed: [],
	sortCM: [],
	WorldSettings: {},
	sortWorldSettings: [],

	init: function (div) {
		var t = Tabs.Debug;

		var sl = 0;
		for (var k in Seed) {
			t.dbSelect[k] = false;
			t.sortSeed[sl] = k;
			sl++;
		}
		t.sortSeed.sort();
		sl = 0;
		for (var k in uW) {
			kType = typeof (uW[k]);
			if ((k.indexOf('actionlink_data') != 0) && (k != 'content') && (k != 'document') && (k.indexOf('feed') != 0) && (k.indexOf('frame') != 0) && (k != 'globalStorage') &&
				(k != 'g_mapObject') && (k != 'history') && (k != 'Modal') && (k != 'navigator') && (k != 'parent') && (k.indexOf('bt') != 0) && (k != 'seed') && (k != 'cm') &&
				(k != 'self') && /*(k.indexOf('template_data') != 0) &&*/ (k != 'that') && (k != 'window') && (k != '_htmlElement') && (kType != 'function') && (kType != 'undefined')) {
				t.sortNonSeed[sl] = k;
				sl++;
			}
		}
		t.sortNonSeed.sort(function (x, y) {
			var a = String(x).toUpperCase();
			var b = String(y).toUpperCase();
			if (a > b) return 1;
			else if (a < b) return -1;
			else return 0;
		});
		sl = 0;
		for (var k in CM) {
			kType = typeof (CM[k]);
			if ((k != 'FETemplates') && (kType != 'function') && (kType != 'undefined')) {
				t.sortCM[sl] = k;
				sl++;
			}
		}
		t.sortCM.sort(function (x, y) {
			var a = String(x).toUpperCase();
			var b = String(y).toUpperCase();
			if (a > b) return 1;
			else if (a < b) return -1;
			else return 0;
		});

		var myregexp = /cm.WorldSettings.init\((.*?)\);/;
		var match = myregexp.exec(document.documentElement.innerHTML);
		if (match != null) {
			try {
				t.WorldSettings = JSON2.parse(match[1]);
				
			} catch (e){ logerr(e);	}
		}

		sl = 0;
		for (var k in t.WorldSettings) {
			t.sortWorldSettings[sl] = k;
			sl++;
		}
		t.sortWorldSettings.sort(function (x, y) {
			var a = String(x).toUpperCase();
			var b = String(y).toUpperCase();
			if (a > b) return 1;
			else if (a < b) return -1;
			else return 0;
		});

		t.myDiv = div;
		
		function syncBoxes() {
			for (var i = 0; i < t.sortSeed.length; i++) {
				var name = t.sortSeed[i];
				var box = ById('dbpop_' + name);
				box.checked = t.dbSelect[name];
			}
		}

		function clickedAll() {
			for (var k in t.dbSelect)
				t.dbSelect[k] = true;
			syncBoxes();
		}

		function clickedNone() {
			for (var k in t.dbSelect)
				t.dbSelect[k] = false;
			syncBoxes();
		}

		function clickedShow() {
			var resultsDiv = ById('idDebugResultsDiv')
			var s = '<PRE>';
			for (var i = 0; i < t.sortSeed.length; i++) {
				var name = t.sortSeed[i];
				var box = ById('dbpop_' + name);
				if (box.checked)
					s += name + " =\n" + t.inspect(Seed[name], 10, 1);
			}
			resultsDiv.innerHTML = s + '</PRE>';
		}

		function clickedShowNonSeed() {
			var resultsDiv = ById('idDebugResultsDiv');
			nsvalue = ById('dbnonseed').value;
			if (nsvalue != '') {
				val = uW[nsvalue];
				valtype = typeof (val);
				resultsDiv.innerHTML = '<PRE>(' + valtype + ') ' + nsvalue + ((valtype == 'string') ? (" = " + val) : (" =\n" + t.inspect(val, 10, 1))) + '</PRE>';
			}
		}

		function clickedShowCM() {
			var resultsDiv = ById('idDebugResultsDiv');
			nsvalue = ById('dbCM').value;
			if (nsvalue != '') {
				val = CM[nsvalue];
				valtype = typeof (val);
				resultsDiv.innerHTML = '<PRE>(' + valtype + ') ' + nsvalue + ((valtype == 'string') ? (" = " + val) : (" =\n" + t.inspect(val, 10, 1))) + '</PRE>';
			}
		}

		function clickedShowWS() {
			var resultsDiv = ById('idDebugResultsDiv');
			nsvalue = ById('dbworldsettings').value;
			if (nsvalue != '') {
				try {
					val = JSON2.parse(t.WorldSettings[nsvalue]);
				}
				catch (e) {
					val = t.WorldSettings[nsvalue];
				}
				valtype = typeof (val);
				resultsDiv.innerHTML = '<PRE>(' + valtype + ') ' + nsvalue + ((valtype == 'string') ? (" = " + val) : (" =\n" + t.inspect(val, 10, 1))) + '</PRE>';
			}
		}
		
		function clickedShowScripts() {
			var resultsDiv = ById('idDebugResultsDiv')
			var scripts = document.getElementsByTagName('script');
			var s = '';
			for (var i = 0; i < scripts.length; i++)
				if (scripts[i].src != null && scripts[i].src != '')
					s += '<A TARGET=_tab HREF="' + scripts[i].src + '">' + scripts[i].src + '</A><BR />';
			resultsDiv.innerHTML = s;
		}

		function clickedShowStyles() {
			var resultsDiv = ById('idDebugResultsDiv')
			var styles = document.getElementsByTagName('link');
			var s = '';
			for (var i = 0; i < styles.length; i++)
				if (styles[i].rel && styles[i].rel=='stylesheet' && styles[i].href && styles[i].href != '')
					s += '<A TARGET=_tab HREF="' + styles[i].href + '">' + styles[i].href + '</A><BR />';
			resultsDiv.innerHTML = s;
		}

		var wsSelect = '<SELECT id="dbworldsettings"><OPTION value="" ></option>';
		for (var i = 0; i < t.sortWorldSettings.length; i++)
			wsSelect += '<OPTION value="' + t.sortWorldSettings[i] + '" >' + t.sortWorldSettings[i] + '</option>';
		wsSelect += '</SELECT>';
		var nsSelect = '<SELECT id="dbnonseed"><OPTION value="" ></option>';
		for (var i = 0; i < t.sortNonSeed.length; i++)
			nsSelect += '<OPTION value="' + t.sortNonSeed[i] + '" >' + t.sortNonSeed[i] + '</option>';
		nsSelect += '</SELECT>';
		var cmSelect = '<SELECT id="dbCM"><OPTION value="" ></option>';
		for (var i = 0; i < t.sortCM.length; i++)
			cmSelect += '<OPTION value="' + t.sortCM[i] + '" >' + t.sortCM[i] + '</option>';
		cmSelect += '</SELECT>';
		var m = '<div class="divHeader" align="center">DEBUG</div><div align=center>';
		m += '<table class=xtab width=98%><tr><td><DIV class=ptentry><B>&nbsp;Seed: </B><INPUT type=submit id=dbsuball value="Select All">&nbsp;<INPUT type=submit id=dbsubnone value="Clear All">&nbsp;<INPUT type=submit id=dbrefresh value="Refresh">&nbsp;';
		m += '<INPUT type=submit id=dbsubdo value="Show Selected">&nbsp;<INPUT type=submit id=dbsubscripts value="List Scripts">&nbsp;<INPUT type=submit id=dbsubstyles value="List Styles"><BR /><TABLE width=100%>';
		var cols = 5;
		var entries = t.sortSeed.length;
		var rows = parseInt(0.99 + entries / cols);
		for (var rowno = 1; rowno <= rows; rowno++) {
			m += '<TR>';
			for (var colno = 1; colno <= cols; colno++) {
				var slvalue = rows * (colno - 1) + rowno - 1;
				m += ((slvalue < entries) ? ('<TD class=xtab><INPUT type=checkbox id="dbpop_' + t.sortSeed[slvalue] + '">&nbsp;' + t.sortSeed[slvalue] + '</TD>') : '<TD class=xtab></TD>');
			}
			m += '</TR>';
		}
		m += '</TABLE><table class=xtab>';
		m += '<tr><td align="right"><B>Non-Seed:</B></td><td>'+nsSelect+'</td></tr>';
		m += '<tr><td align="right"><B>CM:</B></td><td>'+cmSelect+'</td></tr>';
		m += '<tr><td align="right"><B>World Settings:</B></td><td>'+wsSelect+'</td></tr>';
		m += '<tr><td align="right">eval(</td><td><INPUT id=SCode type=text size=70 maxlength=-1 value="" \></td><td>\)</td></tr>';
		m += '<tr><td align="right">JSON2.stringify(</td><td><INPUT id=SajCode type=text size=70 maxlength=-1 value="" \></td><td>)</td></tr>';
		m += '<tr><td align="right">inspect(</td><td><INPUT id=SaiCode type=text size=70 maxlength=-1 value="" \></td><td>)</td></tr>';
		m += '<tr><td align="right">alert(</td><td><INPUT id=SaCode type=text size=70 maxlength=-1 value="" \></td><td>)</td></tr>';
		m += '<tr id=btdebugajax class=divHide><td align="right">AJAX(</td><td><INPUT id=AjaxURL type=text size=20 maxlength=-1 value="" \>.php&nbsp;&nbsp;&nbsp;&nbsp;Params:&nbsp;<INPUT title="Use double-quotes around param names..." id=AjaxParams type=text size=30 maxlength=-1 value="" \></td><td>)&nbsp;'+strButton8('Send Request','id=btDebugAjax')+'</td></tr>';
		m += '</table>';
		m += '<DIV id="idDebugResultsDiv" style="border:1px solid '+Options.Colors.PanelText+';width:700px;height:400px; max-height:400px; overflow-y:auto; overflow-x:scroll; white-space:pre-wrap;"></DIV></td></tr></table></div>';
		t.myDiv.innerHTML = m;

		if (trusted) jQuery('#btdebugajax').removeClass("divHide");

		ById('SCode').addEventListener ('keypress', function (e){
			if(e.which == 13) {
				var resultsDiv = ById('idDebugResultsDiv')
				try {
					eval(this.value);
					resultsDiv.innerHTML = 'OK';
				}
				catch (err) {
					logerr(err); // write to log
					resultsDiv.innerHTML = err;
				}
			}
		}, false);

		ById('SaiCode').addEventListener ('keypress', function (e){
			if(e.which == 13) {
				var resultsDiv = ById('idDebugResultsDiv')
				try {
					resultsDiv.innerHTML = '<PRE>'+t.inspect(eval(this.value),10,1)+'</PRE>';
				}
				catch (err) {
					logerr(err); // write to log
					resultsDiv.innerHTML = err;
				}
			}
		}, false);

		ById('SajCode').addEventListener ('keypress', function (e){
			if(e.which == 13) {
				var resultsDiv = ById('idDebugResultsDiv')
				try {
					resultsDiv.innerHTML = '<PRE>'+eval('JSON2.stringify('+this.value+')')+'</PRE>';
				}
				catch (err) {
					logerr(err); // write to log
					resultsDiv.innerHTML = err;
				}
			}
		}, false);

		ById('SaCode').addEventListener ('keypress', function (e){
			if(e.which == 13) {
				try {
					alert(eval(this.value));
				}
				catch (err) {
					logerr(err); // write to log
					alert(err);
				}
			}
		}, false);

		ById('btDebugAjax').addEventListener ('click', function (){
			var resultsDiv = ById('idDebugResultsDiv')
			var URL = ById('AjaxURL').value;
			if (URL!='') {
				try {
					resultsDiv.innerHTML = 'Sending Request...';
					var ParamString = JSON2.parse('{'+ById('AjaxParams').value+'}');
					var params = uW.Object.clone(uW.g_ajaxparams);
					for (var p in ParamString) {
						params[p] = ParamString[p];
					}
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/"+URL+".php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							resultsDiv.innerHTML = '<PRE>'+JSON2.stringify(rslt)+'</PRE>';
						},
						onFailure: function () {
							resultsDiv.innerHTML = "Server Error";
						},
					},true);
				}
				catch (err) {
					logerr(err); // write to log
					resultsDiv.innerHTML = err;
				}
			}
		}, false);
		
		ById('dbrefresh').addEventListener('click', function() { Tabs.Debug.init(Tabs.Debug.myDiv); }, false);
		ById('dbsuball').addEventListener('click', clickedAll, false);
		ById('dbsubnone').addEventListener('click', clickedNone, false);
		ById('dbsubdo').addEventListener('click', clickedShow, false);
		ById('dbsubscripts').addEventListener('click', clickedShowScripts, false);
		ById('dbsubstyles').addEventListener('click', clickedShowStyles, false);
		ById('dbnonseed').addEventListener('change', clickedShowNonSeed, false);
		ById('dbCM').addEventListener('change', clickedShowCM, false);
		ById('dbworldsettings').addEventListener('change', clickedShowWS, false);
		syncBoxes();
	},

	inspect: function (obj, maxLevels, level, doFunctions) {
		var t = Tabs.Debug;
		var str = '', type, msg;
		if (level == null) level = 0;
		if (maxLevels == null) maxLevels = 1;
		if (maxLevels < 1)
			return 'Inspect Error: Levels number must be > 0';
		if (obj == null)
			return 'ERROR: Object is NULL\n';
		var indent = '';
		for (var i = 0; i < level; i++)
			indent += '  ';
		type = typeof (obj);
		if (type == 'object'){
			for (var property in obj) {
				try {
					type = matTypeof(obj[property]);
					if (doFunctions == true && (type == 'function')) {
						str += indent + '(' + type + ') ' + property + "[FUNCTION]\n";
					} else if (type != 'function') {
						str += indent + '(' + type + ') ' + property + ((obj[property] == null) ? (': null') : ('')) + ' = ' + obj[property] + "\n";
					}
					if ((type == 'object' || type == 'array') && (obj[property] != null) && (level + 1 < maxLevels))
						str += t.inspect(obj[property], maxLevels, level + 1, doFunctions); // recurse
				} catch (err) {
					// Is there some properties in obj we can't access? Print it red.
					if (typeof (err) == 'string') msg = err;
					else if (err.message) msg = err.message;
					else if (err.description) msg = err.description;
					else msg = 'Unknown';
					str += '(Error) ' + property + ': ' + msg + "\n";
				}
			}
		}
		else {
			str += indent + '(' + type + ') ' + ((obj==null) ? (': null') : ('')) + ' = ' + obj + "\n";
		}
		str += "\n";
		return str;
	},	
	
	show: function () {},

	hide : function () {},
	
};