var isIE = document.all && document.execCommand ? true : false;
var isNS = !document.all ? true : false;
var isOP = document.all && !document.execCommand ? true : false;

var objName = '';
var objs = new Array();
var lvls = new Array();
var exprHistory = new Array();
var exprHistoryIndex = -1;

function State() {
  this.statename = 'State 1';
}
function City() {
  this.cityname = 'City 1';
}
City.prototype = new State;
function Street() {
  this.streetname = 'Street 1';
}
Street.prototype = new City;
var universityAvenue = new Street();

function evalExpr() {
  objName = document.forms[0].elements['txtExpr'].value;
  var x = objName.split('[');
  lvls.length = 0;
  for (var i=0; i<x.length; i++)
    lvls = lvls.concat(x[i].split('.'));
  for (var i=0; i<lvls.length; i++)
    if (lvls[i].indexOf(']') == lvls[i].length-1)
      lvls[i] = lvls[i].substring(0, lvls[i].length-1);
}

function getPropsString(obj) {
  var objAttr = new Array();
/*
  var obj;
  if (eval(objName)) {
    obj = eval(objName);
  }
  else {
    alert('Could not evaluate object.');
    return;
  }
*/
  for (var elem in obj) {
    objAttr.push(elem);
  }
  objAttr = objAttr.sort();
  var s = '';
  for (var i=0; i<objAttr.length; i++) {
    try {
      if (typeof(obj[objAttr[i]]) == "function")
        s += objAttr[i] + ' = [function]\n';
      else
        s += objAttr[i] + ' = ' + obj[objAttr[i]] + '\n';
    }
    catch (e) {
      s += objs[i] + ' = [' + e.description + ']\n';
    }
  }

  var test = function () {
    this.var0 = "variable 0";
    this.var1 = 3.14159;
    this.getProp = function(x) {
      var i = 0;
      for (k in this) { if( x==i++ ) return(k); }
    }
  }
/*
  s += '\n';
  blabla = new test();
  s += blabla.getProp(2);

  var i = 0;
  for (k in obj) {
//    if (x == i++)
//      s += k + '\n';
  }
*/
  return s;
}

function getProps(keepForwardHistory) {
  if (window.opener.closed) {
    alert('The referring window has been closed.');
    return;
  }

  var obj = null;
  evalExpr();
  try {
    obj = eval('window.opener.' + objName);
  }
  catch (e) {
    alert('Could not evaluate object.');
  }
  var slct = document.forms[0].elements['evalresult'];
  slct.length = 0;
  objs.length = 0;

  if (isIE) {
    getElementsIE(slct, obj);
  }
  else if (isNS || isOP) {
    getElementsNS(slct, obj);
  }

  updateHistory(keepForwardHistory);
}

function updateHistory(keepForwardHistory) {
  // Navigation history
  if (!keepForwardHistory && exprHistory[exprHistoryIndex] != document.forms[0].elements['txtExpr'].value) {
    exprHistoryIndex++;
    exprHistory.length = exprHistoryIndex;
    exprHistory.push(document.forms[0].elements['txtExpr'].value);
  }
  var btnBack = document.forms[0].elements['btnBack'];
  var btnForward = document.forms[0].elements['btnForward'];
  if (exprHistoryIndex <= 0) {
    btnBack.disabled = true;
    btnBack.title = '';
    if (isOP)
      btnBack.style.color = 'gray';
  }
  else {
    btnBack.disabled = false;
    btnBack.title = exprHistory[exprHistoryIndex-1];
    if (isOP)
      btnBack.style.color = '';
  }
  if (exprHistoryIndex >= exprHistory.length - 1) {
    btnForward.disabled = true;
    btnForward.title = '';
    if (isOP)
      btnForward.style.color = 'gray';
  }
  else {
    btnForward.disabled = false;
    btnForward.title = exprHistory[exprHistoryIndex+1];
    if (isOP)
      btnForward.style.color = '';
  }
}

function getElementsIE(slct, obj) {
  try {
    for (var elem in obj) {
      objs.push(elem);
      var newOpt = document.createElement('OPTION');
      slct.add(newOpt, 0);      // Maintain IE4 compatibility
    }
  }
  catch (e) {
    alert('Could not evaluate object:\n' + e.description);
  }
  objs = objs.sort();
  for (var i=0; i<objs.length; i++) {
    var opt = slct[i];
    try {
      opt.name = objs[i];
      opt.innerText = objs[i] + ' = ' + obj[objs[i]];
    }
    catch (e) {
      opt.innerText = objs[i] + ' = [' + e.description + ']';
    }
  }
}

function getElementsNS(slct, obj) {
  // We make use of the __proto__ attribute, supported by Moz and Opera 7
  var props = new Array();
  var methods = new Array();
  var indeterminate = new Array();

  // Get # proto levels of obj
  var protoLevels = 0;
  for (var p = obj; p; p = p.__proto__) {
    props[protoLevels] = new Array();
    methods[protoLevels] = new Array();
    indeterminate[protoLevels] = new Array();
    ++protoLevels;
  }

  for (var elem in obj) {
    // Get proto level of elem
    var protoLevel = -1;
    try {
      for (var p = obj; p && (elem in p); p = p.__proto__)
        ++protoLevel;
    }
    catch (e) {     // "in" operator throws when param to props() is a string
      protoLevel = 0;
    }

    // Put elem into appropriate category
    try {
      if ((typeof(obj[elem])) == 'function')
        methods[protoLevel].push(elem);
      else
        props[protoLevel].push(elem);
    }
    catch (e) {
      indeterminate[protoLevel].push(elem);
    }
  }

  for (var i=0; i<protoLevels; i++) {
    var qual = '';
/*
    if (i == 0)
      qual = 'User-defined ';
    else if (i == 1)
      qual = 'Native ';
*/
/*
    if (i == 1)
      qual = 'Native ';
    else
      qual = 'User-defined ';
*/
    addArrayNS(props[i], qual + 'Properties', slct, obj);
    addArrayNS(methods[i], qual + 'Methods', slct, obj);
    addArrayNS(indeterminate[i], qual + 'Indeterminate', slct, obj);
  }
}

function addArrayNS(arr, header, slct, obj) {
  if (arr.length > 0) {
    var newOpt = document.createElement('OPTION');
    newOpt.name = '(category)';
    newOpt.innerHTML = '-------------------- ' + header + ' --------------------';
    slct.appendChild(newOpt);
    arr = arr.sort();
    for (var i=0; i<arr.length; ++i) {
      newOpt = document.createElement('OPTION');
      try {
        newOpt.name = arr[i];
        if (arr[i] == 'innerHTML')
          newOpt.innerHTML = 'innerHTML = [Not shown]';
        else {
          var tn;
          if (obj[arr[i]].toString().indexOf('function ') == 1) {
            var fv = obj[arr[i]].toString();
            fv = fv.substring(0, fv.indexOf('{') + 1) + ' [...] }';
            tn = document.createTextNode(arr[i] + ' = ' + fv);
          }
          else
            tn = document.createTextNode(arr[i] + ' = ' + obj[arr[i]]);
          newOpt.appendChild(tn);
        }
      }
      catch (e) {
        newOpt.innerHTML = arr[i] + ' = [' + e + ']';
      }
      slct.appendChild(newOpt);
    }
  }
}

function selectProp(slct) {
  if (slct.selectedIndex == -1)
    return;
  if (slct[slct.selectedIndex].name == '(category)')
    return;
  lvls.push(slct[slct.selectedIndex].name);
  showProps();
}

function goUp() {
  if (lvls.length > 1) {
    lvls.length--;
    showProps();
  }
}

function goBack() {
  if (exprHistoryIndex > 0) {
    exprHistoryIndex--;
    document.forms[0].elements['txtExpr'].value = exprHistory[exprHistoryIndex];
    getProps(true);
  }
}

function goForward() {
  if (exprHistory.length > exprHistoryIndex - 1) {
    exprHistoryIndex++;
    document.forms[0].elements['txtExpr'].value = exprHistory[exprHistoryIndex];
    getProps(true);
  }
}

function showProps() {
  var s = '';
  for (var i=0; i<lvls.length; i++) {
    if (!isNaN(lvls[i]))
      s += '['+lvls[i]+']';
    else {
      if (s != '')
        s += '.';
      s += lvls[i];
    }
  }
  document.forms[0].elements['txtExpr'].value = s;
  getProps();
}

function browseTo(expr) {
  document.forms[0].elements['txtExpr'].value = expr;
  document.forms[0].elements['btnGet'].click();
}

function scanCR() {
  if (isIE)
    if (event.keyCode == 13) {
      document.forms[0].elements['btnGet'].click();
      return false;
    }
}

/////////////////////////////////////////////////////////////////////

document.writeln("\n<html>");
document.writeln("<body bgcolor='#CCCCCC' style='margin:5px' leftmargin='5' rightmargin='5' topmargin='5' bottommargin='5'>");
document.writeln("<form enctype='text/plain' onSubmit='return false'>");
document.writeln("<table id='tblDom' cellpadding='1' cellspacing='0' border='0' width='100%' height='100%'>");
document.writeln("  <tr height='1%'>");
document.writeln("    <td>");
document.writeln("      <table cellpadding='0' cellspacing='0' border='0' width='100%'>");
document.writeln("      <tr valign='top'>");
document.writeln("        <td width='96%' nowrap><input type='text' name='txtExpr' value='document' size='60' style='width:100%' onKeyDown='scanCR()'></td>");
document.writeln("        <td width='1%' nowrap>&nbsp;<input type='submit' name='btnGet' value=' Get ' onClick='getProps()'></td>");
document.writeln("        <td width='1%' nowrap>&nbsp;<input type='button' name='btnUp' value=' Up ' onClick='goUp()'></td>");
document.writeln("        <td width='1%' nowrap>&nbsp;<input type='button' name='btnBack' value=' < ' onClick='goBack()'></td>");
document.writeln("        <td width='1%' nowrap>&nbsp;<input type='button' name='btnForward' value=' > ' onClick='goForward()'></td>");
document.writeln("      </tr>");
document.writeln("      </table>");
document.writeln("    </td>");
document.writeln("  </tr>");
document.writeln("  <tr valign='top' height='*'>");
document.writeln("    <td><select id='evalresult' size='25' style='width:100%; height:100%' onDblClick='selectProp(this)'></select></td>");
document.writeln("  </tr>");
document.writeln("  <tr height='1%'>");
document.writeln("    <td>");
document.writeln("      Quick nav.:&nbsp;&nbsp;<a href='javascript: browseTo(\"window\")'>window</a>&nbsp;&nbsp;");
document.writeln("      <a href='javascript: browseTo(\"document\")'>document</a>&nbsp;&nbsp;");
document.writeln("      <a href='javascript: browseTo(\"document.body\")'>body</a>&nbsp;&nbsp;");
document.writeln("      <a href='javascript: browseTo(\"window.frames\")'>frames</a>");
document.writeln("    </td>");
document.writeln("  </tr>");
document.writeln("</table>");
document.writeln("</form>");

document.writeln("<script language='JavaScript'>");

document.writeln("if (opener) {");
document.writeln("  document.title = 'DOM Browser - ' + opener.document.location.href;");
document.writeln("  getProps();");
document.writeln("}");
document.writeln("else {");
document.writeln("  alert('The referring window has been closed, or you opened this page directly.\\nThis page is intended to be called from a referrer.');");
document.writeln("}");

document.writeln("if (isNS) {");
document.writeln("  window.onresize = handleResizeNS;");
document.writeln("  handleResizeNS();");
document.writeln("}");
document.writeln("if (isOP) {");
document.writeln("  window.onresize = handleResizeOP;");
document.writeln("  handleResizeOP();");
document.writeln("}");

/*
For Mozilla and Opera we need to patch their style implementation.

Mozilla thinks a listbox with style='width:100%' means the listbox width must accommodate 
the widest element in the listbox. In fact '100%' should refer to the page width, 
meaning the listbox should be as wide as the page. That's how it works for textboxes.

Mozilla furthermore ignores listbox style='height:100%'.

Opera thinks a listbox with style='height:100%' means the listbox height must accommodate 
the total # element in the listbox. In fact '100%' should refer to the page height, 
meaning the listbox should be as tall as the page. An empty listbox with style='height:100%' 
is 1 px. high in Opera!
*/

document.writeln("function handleResizeNS() {");
document.writeln("  document.getElementById('evalresult').style.width = document.body.offsetWidth + 'px';");
document.writeln("  document.getElementById('evalresult').style.height = window.innerHeight-70 + 'px';");
document.writeln("}");

document.writeln("function handleResizeOP() {");
document.writeln("  document.getElementById('evalresult').style.width = document.body.offsetWidth-20 + 'px';");
document.writeln("  document.getElementById('evalresult').style.height = window.innerHeight-90 + 'px';");
document.writeln("}");

document.writeln("</script>");

document.writeln("</body>");
document.writeln("</html>");